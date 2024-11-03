import React from 'react'
import './App.css'
import './Global.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages'
import About from './pages/about'
import Planners from './pages/planners'
import Planner from './pages/planner'
import Login from './pages/Login' // Import the Login page
import ProtectedRoute from './ProtectedRoute' // Import the ProtectedRoute
import { Resource } from 'sst'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} /> {/* Home page */}
        <Route path="/about" element={<About />} />
        <Route path="/planners" element={<Planners />} />
        <Route path="/planner/:access/:plannerId" element={<Planner />} />
      </Routes>
    </Router>
  )
}

export default App
