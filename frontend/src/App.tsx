import './App.css'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivateUser from './pages/ActivateUser';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import History from './pages/History';
import type { JSX } from 'react/jsx-dev-runtime';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/forget-password", "/users/activate", "/users/reset_password"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>

      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/activate" element={<ActivateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/users/reset_password" element={<ResetPassword />} />
        <Route path="/profile/edit" element={<Profile />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      </Routes>
    </>
  )

}

export default App