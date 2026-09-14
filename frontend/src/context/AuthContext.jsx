import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api, { API_URL } from '../services/api';
import AuthContext from './AuthContextCore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const userToken = res.data.data?.token;
        const userData = res.data.data?.user;

        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);

        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  // Used by OAuthCallback — stores the JWT then fetches the user profile
  const loginWithToken = async (rawToken) => {
    try {
      localStorage.setItem('token', rawToken);
      setToken(rawToken);
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${rawToken}` }
      });
      if (res.data.success) {
        setUser(res.data.data);
        return { success: true };
      }
      localStorage.removeItem('token');
      setToken(null);
      return { success: false, error: 'Failed to load user profile.' };
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      return {
        success: false,
        error: err.response?.data?.message || 'Authentication failed.'
      };
    }
  };

  const register = async (name, email, password, role, phone, bankDetails) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role, phone, bankDetails });
      if (res.data.success) {
        const userToken = res.data.data?.token;
        const userData = res.data.data?.user;

        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);

        return { success: true };
      }

      return { success: false, error: 'Registration failed.' };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, loginWithToken, register, logout, API_URL }),
    [user, token, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
