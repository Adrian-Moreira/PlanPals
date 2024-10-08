// src/pages/TravelPlanner.js
import React, { useEffect, useState } from 'react';
import TravelForm from '../components/Navbar/TravelForm';
import './TravelPlanner.css'; 
import '../Global.css';

const TravelPlanner = () => {
    const [role, setRole] = useState('viewer'); // Default role
    const username = localStorage.getItem('username'); // Get username from local storage

    useEffect(() => {
        // Fetch the user's role (assuming roles are stored with usernames)
        const userRole = localStorage.getItem('role') || 'viewer'; // Default to viewer
        setRole(userRole);
    }, [username]);

    return (
        <div className="travel-planner-container">
            <h1>Travel Planner</h1>
            <p>Plan your next adventure with friends and family!</p>
            {role === 'editor' || role === 'admin' ? (
                <TravelForm /> // Show form if user can edit
            ) : (
                <p>You have read-only access to this planner.</p> // Read-only message
            )}
        </div>
    );
};

export default TravelPlanner;
