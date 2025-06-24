import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/Login';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;