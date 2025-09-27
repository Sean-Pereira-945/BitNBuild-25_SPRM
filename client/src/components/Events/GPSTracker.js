import React from 'react';
import useGeolocation from '../../hooks/useGeolocation';

const GPSTracker = () => {
  const { location, error } = useGeolocation();

  return (
    <div>
      <h3>GPS Status</h3>
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Your current location is: <br />
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </div>
  );
};

export default GPSTracker;