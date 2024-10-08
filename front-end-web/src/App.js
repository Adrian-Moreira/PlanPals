import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Planners from "./pages/planners";
import Planner from "./pages/planner";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/planners" element={<Planners />} />
          <Route path="/planner/:id" element={<Planner />} />
      </Routes>
    </Router>
    
  );
}

export default App;
