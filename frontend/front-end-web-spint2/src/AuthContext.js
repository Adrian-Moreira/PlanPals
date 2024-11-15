// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

    const login = (user, id) => {
        setIsAuthenticated(true);
        setUsername(user);
        setUserId(id);
        localStorage.setItem('username', user);
        localStorage.setItem('userId', id);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setUserId('');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username,userId }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
