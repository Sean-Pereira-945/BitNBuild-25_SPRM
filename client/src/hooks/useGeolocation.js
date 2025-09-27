/**
 * useGeolocation - Custom hook for GPS location tracking
 * Provides live GPS coordinates using navigator.geolocation.watchPosition
 */
import { useState, useEffect, useRef } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  // Default options
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000, // 1 minute
    ...options
  };

  // Success callback
  const onSuccess = (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    });
    setError(null);
    setLoading(false);
  };

  // Error callback
  const onError = (err) => {
    let errorMessage;
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'An unknown error occurred while retrieving location';
        break;
    }
    setError(errorMessage);
    setLoading(false);
  };

  // Start tracking location
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setIsTracking(true);
    setError(null);

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      defaultOptions
    );
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLoading(false);
  };

  // Get current position once
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSuccess(position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (err) => {
          onError(err);
          reject(err);
        },
        defaultOptions
      );
    });
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Check if current location is within a geofence
  const isWithinGeofence = (centerLat, centerLon, radiusKm) => {
    if (!location.latitude || !location.longitude) {
      return false;
    }
    
    const distance = calculateDistance(
      location.latitude, 
      location.longitude, 
      centerLat, 
      centerLon
    );
    
    return distance <= radiusKm;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    location,
    error,
    loading,
    isTracking,
    startTracking,
    stopTracking,
    getCurrentPosition,
    calculateDistance,
    isWithinGeofence,
    isSupported: !!navigator.geolocation
  };
};

export default useGeolocation;