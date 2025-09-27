/**
 * NotificationContext - Toast notification state management
 * Provides functions to show different types of toast notifications
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Initial state
const initialState = {
  notifications: []
};

// Action types
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS'
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload.notification]
      };
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload.id
        )
      };
    case NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add notification function
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      duration: 5000, // Default 5 seconds
      ...notification,
      createdAt: new Date().toISOString()
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: { notification: newNotification }
    });

    // Auto-remove notification after duration (if not persistent)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove notification function
  const removeNotification = useCallback((id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: { id }
    });
  }, []);

  // Clear all notifications function
  const clearAllNotifications = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS });
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      duration: 7000, // Errors stay longer by default
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options
    });
  }, [addNotification]);

  // Show loading notification
  const showLoading = useCallback((message = 'Loading...', options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      duration: 0, // Persistent until manually removed
      showSpinner: true,
      ...options
    });
  }, [addNotification]);

  // Show notification with custom action
  const showWithAction = useCallback((message, actionText, actionCallback, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      action: {
        text: actionText,
        callback: actionCallback
      },
      duration: 0, // Persistent when there's an action
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showWithAction,
    types: NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;