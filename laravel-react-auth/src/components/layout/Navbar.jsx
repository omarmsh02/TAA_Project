// import { useAuth } from '../../context/AuthContext';
// import { Link } from 'react-router-dom';
// import '../../styles/auth.css';

// const Navbar = () => {
//   const { user } = useAuth();

//   return (
//     <nav style={{ padding: '1rem', background: 'rgba(31, 41, 55, 0.85)' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Link to="/" className="link">Home</Link>
//         <div>
//           {user ? (
//             <Link to="/profile" className="link">Profile</Link>
//           ) : (
//             <>
//               <Link to="/login" className="link" style={{ marginRight: '1rem' }}>Login</Link>
//               <Link to="/signup" className="link">Signup</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;