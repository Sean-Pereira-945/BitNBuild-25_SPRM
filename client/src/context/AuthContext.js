import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { storage } from '../utils/storage';
import { parseAPIError } from '../utils/errorHandling';
import { ROLE_DASHBOARD_PATHS } from '../utils/constants';
import { useNotifications } from './NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotifications();
  const [user, setUser] = useState(() => storage.get('user'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const hasTokens = storage.get('accessToken');
      if (!user && hasTokens) {
        try {
          setLoading(true);
          const { data } = await authService.getProfile();
          setUser(data.data.user);
        } catch (error) {
          authService.clearAuth();
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };

    initialize();
  }, [user]);

  const login = useCallback(async (formData) => {
    try {
      setLoading(true);
      const data = await authService.login(formData);
      setUser(data.user);
      showNotification({ type: 'success', title: 'Welcome back!', message: 'You are now logged in.' });
      return data;
    } catch (error) {
      const message = parseAPIError(error);
      showNotification({ type: 'error', title: 'Login failed', message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const register = useCallback(async (formData) => {
    try {
      setLoading(true);
      const data = await authService.register(formData);
      showNotification({
        type: 'success',
        title: 'Registration successful',
        message: 'Check your email to verify your account.'
      });
      return data;
    } catch (error) {
      const message = parseAPIError(error);
      showNotification({ type: 'error', title: 'Registration failed', message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      authService.clearAuth();
      setUser(null);
      showNotification({ type: 'info', title: 'Logged out', message: 'You have been signed out.' });
    }
  }, [showNotification]);

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await authService.getProfile();
      setUser(data.data.user);
    } catch (error) {
      console.error('Profile refresh failed', error);
    }
  }, []);

  const getDashboardPath = useCallback(
    (role) => ROLE_DASHBOARD_PATHS[role || user?.role] || '/events',
    [user?.role]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
      getDashboardPath
    }),
    [user, loading, login, register, logout, refreshProfile, getDashboardPath]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
