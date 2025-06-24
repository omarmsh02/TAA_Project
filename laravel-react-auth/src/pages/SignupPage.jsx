import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/Signup';

const SignupPage = () => {
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Signup failed');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;