import { useState, useEffect } from 'react';

interface AdminSession {
  authenticated: boolean;
  email: string;
  loginTime: string;
}

const ADMIN_PASSWORD = 'Fc8787965@!';
const ADMIN_EMAIL = 'admin@fc.sa';
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
const STORAGE_KEY = 'admin_session';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if there's an existing session
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const session: AdminSession = JSON.parse(storedSession);
        const loginTime = new Date(session.loginTime).getTime();
        const currentTime = Date.now();

        // Check if session has not expired
        if (currentTime - loginTime < SESSION_TIMEOUT) {
          setIsAuthenticated(true);
          setEmail(session.email);
        } else {
          // Session expired
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        authenticated: true,
        email: ADMIN_EMAIL,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      setEmail(ADMIN_EMAIL);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setEmail('');
  };

  return {
    isAuthenticated,
    isLoading,
    email,
    login,
    logout
  };
}
