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
import Welcome from './pages/Welcome';
import type { JSX } from 'react/jsx-dev-runtime';
import Location from './pages/Location';
import SuggestedProfile from './pages/SuggestedProfile';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login", "/register", "/forget-password", "/users/activate", "/users/reset_password"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>

      {showNavbar && <Navbar />}
      
      <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Welcome />} />

          {/* Protected App Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

          <Route path="/location/edit" element={<ProtectedRoute><Location /></ProtectedRoute>} />
          <Route path="/search/suggested" element={<ProtectedRoute><SuggestedProfile /></ProtectedRoute>} />
          
          
          {/* Public Auth Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/users/activate" element={<ActivateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/users/reset_password" element={<ResetPassword />} />
      </Routes>
    </>
  )

}

export default App