import './App.css'
import { Routes, Route } from "react-router-dom";
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivateUser from './pages/ActivateUser';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';


function App() {

  return (
    <>
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
      </Routes>
    </>
  )

}

export default App