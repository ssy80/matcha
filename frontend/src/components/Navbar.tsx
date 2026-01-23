import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo" onClick={() => navigate('/home')}>
                🍵 Matcha
            </div>

            {/* Links */}
            <div className="navbar-links">
                <Link to="/home" className="nav-link">Discover</Link>
                <Link to="/profile" className="nav-link">My Profile</Link>
                <Link to="/chat" className="nav-link">Chat 💬</Link> 
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </nav>
    );
};

export default Navbar;