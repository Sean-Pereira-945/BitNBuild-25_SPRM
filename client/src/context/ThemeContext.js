/**
 * ThemeContext - Theme state management
 * Manages light/dark theme state and persistence using localStorage
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create context
const ThemeContext = createContext();

// Theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Use local storage hook to persist theme preference
  const [theme, setTheme] = useLocalStorage('eventchain-theme', THEMES.LIGHT);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // Get theme-specific values
  const getThemeValue = (lightValue, darkValue) => {
    return theme === THEMES.LIGHT ? lightValue : darkValue;
  };

  // Apply theme to document body
  useEffect(() => {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    // Add current theme class
    body.classList.add(theme);
    
    // Update CSS custom properties
    const root = document.documentElement;
    if (theme === THEMES.DARK) {
      root.style.setProperty('--color-mode', 'dark');
    } else {
      root.style.setProperty('--color-mode', 'light');
    }
    
    setIsLoading(false);
  }, [theme]);

  // Check for system theme preference on mount
  useEffect(() => {
    // Only set system theme if no theme is stored
    if (!localStorage.getItem('eventchain-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? THEMES.DARK : THEMES.LIGHT);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('eventchain-theme')) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [setTheme]);

  const value = {
    theme,
    isLight: theme === THEMES.LIGHT,
    isDark: theme === THEMES.DARK,
    isLoading,
    toggleTheme,
    setTheme: setSpecificTheme,
    getThemeValue,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;