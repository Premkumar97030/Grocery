import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [apiHealth, setApiHealth] = useState({
    status: 'checking',
    message: 'Checking backend connection...',
  });

  const showToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const checkHealth = async () => {
    try {
      const res = await authService.getHealth();
      if (res.success) {
        setApiHealth({
          status: 'online',
          message: res.message || 'Grocery Delivery API is running',
          timestamp: res.timestamp,
        });
      } else {
        setApiHealth({ status: 'error', message: 'API returned error' });
      }
    } catch (err) {
      setApiHealth({
        status: 'offline',
        message: 'Backend API connection failed',
      });
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll health status every 45s
    const interval = setInterval(checkHealth, 45000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    searchTerm,
    setSearchTerm,
    toasts,
    showToast,
    removeToast,
    apiHealth,
    checkHealth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
