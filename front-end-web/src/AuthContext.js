// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    const login = (user) => {
        setIsAuthenticated(true);
        setUsername(user);
        localStorage.setItem('username', user);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername('');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
