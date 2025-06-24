import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h2 id="welcome-msg">Welcome, {user?.name}</h2>
      {/* <p>Email: {user?.email}</p> */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Profile;