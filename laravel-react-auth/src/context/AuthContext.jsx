import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const data = await apiRegister(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);