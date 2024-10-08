// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import the Auth context

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigating after login
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulate checking for an existing username
    const existingUsernames = ["user1", "user2", "admin"]; // Predefined usernames for testing

    if (existingUsernames.includes(username)) {
      // Simulate a successful login
    login(username); // Call the login function
      navigate("/home"); // Redirect to Home after login

    } else {
      // Simulate an error for invalid username
      setError("User not found. Please check your username.");
    }
  };
  //     try {
  //         const response = await fetch(`http://localhost:8080/users?userName=${username}`); // Update the port
  //         const data = await response.json();

  //         if (data.success && data.data.length > 0) {
  //             const user = data.data[0]; // Assuming the first result is the user
  //             localStorage.setItem('username', user.userName);
  //             localStorage.setItem('role', user.role || 'viewer'); // Assign role if available

  //             navigate('/travel-planner'); // Redirect to Travel Planner
  //         } else {
  //             setError('User not found. Please check your username.');
  //         }
  //     } catch (err) {
  //         console.error(err);
  //         setError('Error while trying to log in. Please try again later.');
  //     }
  // };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
