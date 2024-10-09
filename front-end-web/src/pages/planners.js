import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import your Auth context to get user ID
import axios from "axios"; // Import axios for API calls

const Planners = () => {
    const [plannerList, setPlannerList] = useState([]);
    const [name, setName] = useState(""); // State for planner name
    const [description, setDescription] = useState(""); // State for planner description
    const [startDate, setStartDate] = useState(""); // State for start date
    const [endDate, setEndDate] = useState(""); // State for end date
    const { userId } = useAuth(); // Get the logged-in user's ID from Auth context
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

    useEffect(() => {
        const fetchPlanners = async () => {
            console.log(userId);
            if (!userId) return; // Exit if userId is not available
            try {
                const response = await axios.get(`http://localhost:8080/planner?userId=${userId}`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setPlannerList(response.data.data); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch planners:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching planners:", error);
            }
        };

        fetchPlanners();
    }, [userId]);

    // Function to handle creating a new planner
    const handleCreatePlanner = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!name || !startDate || !endDate) {
            alert("Planner name, start date, and end date are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/planner", {
                createdBy: userId, // Use the logged-in user's ID
                name,
                description,
                startDate: new Date(startDate).toISOString(), // Convert to ISO string
                endDate: new Date(endDate).toISOString(), // Convert to ISO string
                destinations: [], // Optional
                transportations: [], // Optional
                roUsers: [], // Optional: Add if needed
                rwUsers: [], // Optional: Add if needed
            });

            if (response.data.success) {
                setPlannerList((prevPlanners) => [...prevPlanners, response.data.data]); // Append newly created planner to list
                // Reset the form fields
                setName("");
                setDescription("");
                setStartDate("");
                setEndDate("");
                setShowForm(false); // Hide the form after successful creation
            } else {
                console.error("Error creating planner:", response.data.message);
            }
        } catch (error) {
            console.error("Error creating planner:", error.response ? error.response.data : error.message);
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
                {plannerList.length > 0 ? (
                    plannerList.map((planner) => (
                        <div key={planner._id}>
                            <Link className="List-button" to={`/planner/${planner._id}`}>
                                {planner.name}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No planners available.</p>
                )}
            </div>
        </div>
    );
};

export default Planners;
