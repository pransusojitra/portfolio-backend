import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check storage on init
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('auth_token');

      if (storedToken) {
        try {
          // Set token temporarily so apiService can use it
          setToken(storedToken);
          
          // Verify with backend
          const data = await apiService.getMe();
          
          if (data.success) {
            setUser(data.data);
            setIsAuthenticated(true);
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // API service maps username to email for the backend
      const data = await apiService.login({ username, password });
      
      if (data.success && data.data?.token) {
        const jwtToken = data.data.token;
        const loggedUser = data.data.user;
        
        localStorage.setItem('auth_token', jwtToken);
        
        setToken(jwtToken);
        setUser(loggedUser);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Invalid email or password';
      setAuthError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      authError,
      login,
      logout,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
