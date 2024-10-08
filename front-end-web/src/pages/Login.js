// src/pages/Login.js
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
// try {
//     // Make a request to your backend to check if the user exists
//     const response = await axios.get(`http://localhost:8080/users`, {
//       params: { userName: username } // Pass username as a query parameter
//     });

//     if (response.data.success && response.data.data.length > 0) {
//       const user = response.data.data[0]; // Assuming the first result is the user
//       login(user.userName); // Call the login function with the username
//       navigate("/home"); // Redirect to Home after login
//     } else {
//       setError("User not found. Please check your username.");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Error while trying to log in. Please try again later.");
//   }
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
