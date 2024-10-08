import React from "react";
import "./App.css";
import "./Global.css";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Login from "./pages/Login"; // Import the Login page
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />}/>} /> {/* Home page */}
          <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    
  );
}

export default App;
