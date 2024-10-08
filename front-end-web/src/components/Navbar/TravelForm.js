// src/components/TravelForm.js
import React, { useState, useEffect } from 'react';

const TravelForm = () => {
    const [createdBy, setCreatedBy] = useState(''); // Replace with actual user ID in real implementation
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [destinations, setDestinations] = useState('');
    const [transportations, setTransportations] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('username'); // Get username from local storage
        if (username) {
            setCreatedBy(username); // Auto-fill the createdBy field
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const travelData = {
            createdBy,
            startDate,
            endDate,
            name,
            description,
            destinations: destinations.split(',').map(dest => dest.trim()), // Split input by comma
            transportations: transportations.split(',').map(trans => trans.trim()), // Split input by comma
            roUsers: [], // Add any read-only users if needed
            rwUsers: [], // Add any read-write users if needed
        };

        try {
            const response = await fetch('http://localhost:8080/planner', { // Replace with correct port
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Planner created successfully:', data); // Handle success
        } catch (error) {
            console.error('Error submitting travel data:', error);
            setError('Error creating planner. Please try again.'); // Set error state to display
        }
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Created By (User ID):
                <input
                    type="text"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)} // Allow user to change if needed
                    required
                />
            </label>
            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </label>
            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </label>
            <label>
                Planner Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Destinations (comma-separated):
                <input
                    type="text"
                    value={destinations}
                    onChange={(e) => setDestinations(e.target.value)}
                />
            </label>
            <label>
                Transportations (comma-separated):
                <input
                    type="text"
                    value={transportations}
                    onChange={(e) => setTransportations(e.target.value)}
                />
            </label>
            {error && <p className="error">{error}</p>} {/* Display error if any */}
            <button type="submit">Create Travel Plan</button>
        </form>
    );
};

export default TravelForm;
