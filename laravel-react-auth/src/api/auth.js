import api from './axios';

export const register = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { message: error.message || 'Registration failed' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { message: error.message || 'Login failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  }
};