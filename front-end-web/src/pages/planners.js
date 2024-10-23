import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import Auth context to get user ID
import axios from "axios"; // Import axios for API calls

const Planners = () => {
    const [plannerList, setPlannerList] = useState([]); // State for storing list of planners
    const [name, setName] = useState(""); // State for planner name
    const [description, setDescription] = useState(""); // State for planner description
    const [startDate, setStartDate] = useState(""); // State for planner start date
    const [endDate, setEndDate] = useState(""); // State for planner end date
    const { userId } = useAuth(); // Get the logged-in user's ID from Auth context
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

    useEffect(() => {
        const fetchPlanners = async () => {
            if (!userId) return; // Exit if userId is not available

            try {
                // Fetch planners for the logged-in user
                const response = await axios.get(`http://localhost:8080/planner?userId=${userId}`);
                
                // Check if fetch was successful
                if (response.data.success) {
                    setPlannerList(response.data.data); // Update planner list with fetched data
                } else {
                    console.error("Failed to fetch planners:", response.data.message); // Log error message
                }
            } catch (error) {
                console.error("Error fetching planners:", error); // Log error if fetch fails
            }
        };

        fetchPlanners(); // Call function to fetch planners
    }, [userId]); // Re-run effect when userId changes

    // Function to handle creating a new planner
    const handleCreatePlanner = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate input fields
        if (!name || !startDate || !endDate) {
            alert("Planner name, start date, and end date are required."); // Alert if fields are empty
            return;
        }

        try {
            // Create new planner using POST request
            const response = await axios.post("http://localhost:8080/planner", {
                createdBy: userId, // Use the logged-in user's ID
                name,
                description,
                startDate: new Date(startDate).toISOString(), // Convert to ISO string
                endDate: new Date(endDate).toISOString(), // Convert to ISO string
                destinations: [], // Optional: Add destinations if needed
                transportations: [], // Optional: Add transportations if needed
                roUsers: [], // Optional: Add if needed
                rwUsers: [userId], // Optional: Include the user in rwUsers
            });

            // Check if planner creation was successful
            if (response.data.success) {
                setPlannerList((prevPlanners) => [...prevPlanners, response.data.data]); // Append newly created planner to list
                
                // Reset the form fields after successful creation
                setName("");
                setDescription("");
                setStartDate("");
                setEndDate("");
                setShowForm(false); // Hide the form
            } else {
                console.error("Error creating planner:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error creating planner:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    return (
        <div>
            <header className="Page-header">
                <p>Your Planners:</p>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "❌ Cancel" : "➕ Create New Planner"}
                </button>
            </header>

            {showForm && ( // Show form only when `showForm` is true
                <form onSubmit={handleCreatePlanner}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Planner Name"
                        required
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    <button type="submit">➕ Create New Planner</button>
                </form>
            )}

            <div className="List">
                {plannerList.length > 0 ? ( // Check if there are planners to display
                    plannerList.map((planner) => (
                        <div key={planner._id}>
                            <Link className="List-button" to={`/planner/rw/${planner._id}`}>
                                {planner.name} {/* Link to the individual planner's page */}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No planners available.</p> // Display message if no planners exist
                )}
            </div>
        </div>
    );
};

export default Planners; // Export Planners component for use in other parts of the application
