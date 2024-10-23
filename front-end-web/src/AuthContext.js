// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext to provide authentication state and functions
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State variables to track authentication status and user details
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
    const [username, setUsername] = useState(''); // Store the username
    const [userId, setUserId] = useState(''); // Store the user ID

    // Function to log in a user
    const login = (user, id) => {
        setIsAuthenticated(true); // Update authentication status
        setUsername(user); // Set the username
        setUserId(id); // Set the user ID
        // Store user information in local storage for persistence
        localStorage.setItem('username', user);
        localStorage.setItem('userId', id);
    };

    // Function to log out a user
    const logout = () => {
        setIsAuthenticated(false); // Update authentication status
        setUsername(''); // Clear the username
        setUserId(''); // Clear the user ID
        // Remove user information from local storage
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    };

    // Provide the authentication state and functions to child components
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username, userId }}>
            {children} {/* Render child components */}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth context easily in components
export const useAuth = () => {
    return useContext(AuthContext); // Return the current context value
};
