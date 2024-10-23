import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import the Auth context to access login function
import axios from 'axios'; // Import Axios for API calls

const Login = () => {
  const [username, setUsername] = useState(""); // State for storing username input
  const [error, setError] = useState(""); // State for storing error messages
  const navigate = useNavigate(); // For navigating after login
  const { login } = useAuth(); // Get the login function from AuthContext

  // Handle the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a request to the backend to check if the user exists
      const response = await axios.get(`http://localhost:8080/user/search`, {
        params: { userName: username }  // Pass username as a query parameter
      });

      // If the user exists, log them in
      if (response.data.success && response.data.data) {
        const user = response.data.data; // Retrieve the user object from response
        login(user.userName, user._id); // Call the login function with username and user ID
        navigate("/home"); // Redirect to Home after successful login
      }
    } catch (err) {
      // Handle errors based on their status
      if (err.response) {
        if (err.response.status === 404) {
          // User does not exist, prompt to create a new account
          const createUser = window.confirm(`User "${username}" does not exist. Would you like to create a new account?`);
          
          if (createUser) {
            // Attempt to create a new user
            try {
              const createResponse = await axios.post(`http://localhost:8080/user`, {
                userName: username,
                preferredName: username // Use username as the preferred name for simplicity
              });

              // Check if user creation was successful
              if (createResponse.data.success) {
                // If user creation is successful, log them in
                login(createResponse.data.data.userName, createResponse.data.data._id); // Log in with the created user
                navigate("/home"); // Redirect to Home after successful login
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
          // Handle conflict error when a user with that username already exists
          setError("A user with that username already exists. Please try logging in.");
        } else {
          // General error handling for login failure
          setError("Error while trying to log in. Please try again later.");
        }
      } else {
        // Handle network error
        setError("Error connecting to the server. Please check your network.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>} {/* Display error message if present */}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            required // Field is required
          />
        </label>
        <button type="submit">Login</button> {/* Submit button for login */}
      </form>
    </div>
  );
};

export default Login; // Export Login component for use in other parts of the application
