import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome {user ? user.name : 'Guest'}</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default Home;
