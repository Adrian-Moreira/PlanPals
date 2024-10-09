import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import the Auth context
import axios from 'axios'; // Import Axios

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigating after login
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a request to your backend to check if the user exists
      const response = await axios.get(`http://localhost:8080/user/search`, {
        params: { userName: username }  // Pass username in the request
      });

      // If the user exists, log them in
      if (response.data.success && response.data.data) {
        const user = response.data.data; // Get the user object
        login(user.userName); // Call the login function with the username
        navigate("/home"); // Redirect to Home after login
      }
    } catch (err) {
      // Handle errors based on their status
      if (err.response) {
        if (err.response.status === 404) {
          // User does not exist, prompt to create a new one
          const createUser = window.confirm(`User "${username}" does not exist. Would you like to create a new account?`);
          
          if (createUser) {
            // Create a new user
            try {
              const createResponse = await axios.post(`http://localhost:8080/user`, {
                userName: username,
                preferredName: username // Use username as preferred name for simplicity
              });

              // Check if user creation was successful
              if (createResponse.data.success) {
                // If user creation is successful, log them in
                login(createResponse.data.data.userName); // Log in with the created user
                navigate("/home"); // Redirect to Home after login
              } else {
                // Handle user creation error
                setError(createResponse.data.message || "Error creating user. Please try again.");
              }
            } catch (createErr) {
              // Handle potential error during user creation
              setError("Error while creating user. Please try again.");
            }
          }
        } else if (err.response.status === 409) {
          setError("A user with that username already exists. Please try logging in.");
        } else {
          setError("Error while trying to log in. Please try again later.");
        }
      } else {
        setError("Error connecting to the server. Please check your network.");
      }
    }
  };

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
