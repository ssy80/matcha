import './App.css'
import { Routes, Route } from "react-router-dom";
import About from './pages/About';
import Home from './pages/Home';
import ActivateUser from './pages/ActivateUser';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/activate" element={<ActivateUser />} />
      </Routes>
    </>
  )

}

export default App
