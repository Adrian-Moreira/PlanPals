import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'; // Import useParams to get plannerId from URL
import { useAuth } from '../AuthContext'; // Import Auth context to get userId
import { BiSolidPlane } from "react-icons/bi"; // Icon for transport
import { BiSolidBed } from "react-icons/bi"; // Icon for accommodations
import { BiCalendarEvent } from "react-icons/bi"; // Icon for activities
import { BsFillPlusCircleFill, BsPencilFill, BsTrashFill, BsFillMapFill, BsChatFill, BsFillPinMapFill } from "react-icons/bs";
import axios from "axios"; // Import axios for API calls
import CommentButton from "../components/Comments/commentButton";

const Planner = () => {
    // Retrieve plannerId and userId from URL and context
    const { plannerId, access } = useParams();
    const isReadOnly = access === "ro"; //set planner to read only if user has ro access 
    const { userId } = useAuth(); 
    
    // State variables
    const [planner, setPlanner] = useState(null); 
    const [destinations, setDestinations] = useState([]); 
    const [transportations, setTransportations] = useState([]); 

    // State variables for destination form
    const [showDestinationForm, setShowDestinationForm] = useState(false);
    const [destinationName, setDestinationName] = useState("");
    const [destinationStartDate, setDestinationStartDate] = useState("");
    const [destinationEndDate, setDestinationEndDate] = useState("");
    const [editingDestinationId, setEditingDestinationId] = useState(null); 

    // State variables for transportation form
    const [showTransportationForm, setShowTransportationForm] = useState(false);
    const [transportationType, setTransportationType] = useState("");
    const [transportationDetails, setTransportationDetails] = useState("");
    const [transportationDepartureTime, setTransportationDepartureTime] = useState("");
    const [transportationArrivalTime, setTransportationArrivalTime] = useState(""); 
    const [transportationVehicleId, setTransportationVehicleId] = useState("");
    const [editingTransportationId, setEditingTransportationId] = useState(null);

    // State variables for accommodation form
    const [showAccommodationForm, setShowAccommodationForm] = useState(false);
    const [accommodationName, setAccommodationName] = useState("");
    const [accommodationAddress, setAccommodationAddress] = useState("");
    const [accommodationCheckInDate, setAccommodationCheckInDate] = useState("");
    const [accommodationCheckOutDate, setAccommodationCheckOutDate] = useState("");
    const [selectedDestinationId, setSelectedDestinationId] = useState(""); 

    // State variables for activity form
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [activityName, setActivityName] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [activityTime, setActivityTime] = useState("");
    const [activityDestinationId, setActivityDestinationId] = useState(""); 

    const [error, setError] = useState(""); // State for error messages

    // Fetch planner and destinations when component mounts or dependencies change
    useEffect(() => {
        const fetchPlanner = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/planner/${plannerId}`, {
                    params: { userId }
                });
                if (response.data.success) {
                    setPlanner(response.data.data); // Set planner details if fetch is successful
                } else {
                    console.error("Failed to fetch planner:", response.data.message); // Log error message
                }
            } catch (error) {
                console.error("Error fetching planner:", error); // Log error if fetch fails
            }
        };

        const fetchDestinations = async () => {
            if (plannerId) {
                try {
                    const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination`, {
                        params: { userId }
                    });
                    if (response.data.success) {
                        setDestinations(response.data.data); // Set destinations if fetch is successful
                    } else {
                        console.error("Failed to fetch destinations:", response.data.message); // Log error message
                    }
                } catch (error) {
                    console.error("Error fetching destinations:", error); // Log error if fetch fails
                }
            }
        };

        const fetchTransportations = async () => {
            if (plannerId) {
                try {
                    const response = await axios.get(`http://localhost:8080/planner/${plannerId}/transportation`, {
                        params: { userId }
                    });
                    if (response.data.success) {
                        setTransportations(response.data.data); // Set transportations if fetch is successful
                    } else {
                        console.error("Failed to fetch transportations:", response.data.message); // Log error message
                    }
                } catch (error) {
                    console.error("Error fetching transportations:", error); // Log error if fetch fails
                }
            }
        };

        fetchPlanner(); // Fetch planner data
        fetchDestinations(); // Fetch destinations data after fetching planner
        fetchTransportations();// Fetch transportation data after fetching planner
    }, [plannerId, userId]);

    // Validate if the provided date range is within the planner's date range
    const validateDateRange = (startDate, endDate) => {
        const plannerStart = new Date(planner.startDate);
        const plannerEnd = new Date(planner.endDate);
        return startDate >= plannerStart && endDate <= plannerEnd; // Return true if valid
    };

    // Handle adding a new destination
    const handleAddDestination = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const startDate = new Date(destinationStartDate);
        const endDate = new Date(destinationEndDate);

        // Validate input fields
        if (!destinationName || !destinationStartDate || !destinationEndDate) {
            alert("Destination name, start date, and end date are required."); // Alert if fields are empty
            return;
        }

        // Validate date range
        if (!validateDateRange(startDate, endDate)) {
            setError("Destination dates must be within the planner's date range."); // Set error message
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/planner/${plannerId}/destination`, {
                name: destinationName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                createdBy: userId
            });

            if (response.data.success) {
                setDestinations(prev => [...prev, response.data.data]); // Update destinations state
                resetDestinationForm(); // Reset form fields after successful addition
            } else {
                console.error("Error adding destination:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error adding destination:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    // Handle editing an existing destination
    const handleEditDestination = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const startDate = new Date(destinationStartDate);
        const endDate = new Date(destinationEndDate);

        // Validate input fields
        if (!destinationName || !destinationStartDate || !destinationEndDate) {
            alert("Destination name, start date, and end date are required."); // Alert if fields are empty
            return;
        }

        // Validate date range
        if (!validateDateRange(startDate, endDate)) {
            setError("Destination dates must be within the planner's date range."); // Set error message
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/planner/${plannerId}/destination/${editingDestinationId}?userId=${userId}`, {
                name: destinationName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });

            if (response.data.success) {
                // Update the destinations state with edited destination data
                setDestinations(prev => 
                    prev.map(dest => 
                        dest._id === editingDestinationId 
                        ? { ...dest, name: destinationName, startDate: startDate.toISOString(), endDate: endDate.toISOString() } 
                        : dest
                    )
                );
                resetDestinationForm(); // Reset form fields after successful edit
            } else {
                console.error("Error editing destination:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error editing destination:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    // Handle deleting a destination
    const handleDeleteDestination = async (destinationId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/planner/${plannerId}/destination/${destinationId}`, {
                params: { userId }
            });
            if (response.data.success) {
                setDestinations(prev => prev.filter(dest => dest._id !== destinationId)); // Update destinations state after deletion
                setError(""); // Clear error message
            } else {
                console.error("Error deleting destination:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error deleting destination:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    // Reset destination form fields
    const resetDestinationForm = () => {
        setEditingDestinationId(null);
        setDestinationName("");
        setDestinationStartDate("");
        setDestinationEndDate("");
        setError(""); // Clear any error messages
        setShowDestinationForm(false);
    };

        // Handle adding a new transportation
        const handleAddTransportation = async (e) => {
            e.preventDefault(); // Prevent default form submission
            const startDate = new Date(transportationDepartureTime);
            const endDate = new Date(transportationArrivalTime);
    
            // Validate input fields
            if (!transportationType || !transportationDetails || !transportationDepartureTime || !transportationArrivalTime || !transportationVehicleId) {
                alert("Transportation type, details, departure time, arrival time, and vehicle ID are required."); // Alert if fields are empty
                return;
            }
    
            // Validate date range
            if (!validateDateRange(startDate, endDate)) {
                setError("Transportation dates must be within the planner's date range."); // Set error message
                return;
            }
    
            try {
                const response = await axios.post(`http://localhost:8080/planner/${plannerId}/transportation`, {
                    type: transportationType,
                    details: transportationDetails,
                    departureTime: startDate.toISOString(),
                    arrivalTime: endDate.toISOString(),
                    vehicleId: transportationVehicleId,
                    createdBy: userId
                });
    
                if (response.data.success) {
                    setTransportations(prev => [...prev, response.data.data]); // Update transportations state
                    resetTransportationForm(); // Reset form fields after successful addition
                } else {
                    console.error("Error adding transportation:", response.data.message); // Log error message
                }
            } catch (error) {
                console.error("Error adding transportation:", error.response ? error.response.data : error.message); // Log error if request fails
            }
        };
    
        // Handle editing an existing transportation
        const handleEditTransportation = async (e) => {
            e.preventDefault(); // Prevent default form submission
            const startDate = new Date(transportationDepartureTime);
            const endDate = new Date(transportationArrivalTime);
    
            // Validate input fields
            if (!transportationType || !transportationDetails || !transportationDepartureTime || !transportationArrivalTime || !transportationVehicleId) {
                alert("Transportation type, details, departure time, arrival time, and vehicle ID are required."); // Alert if fields are empty
                return;
            }
    
            // Validate date range
            if (!validateDateRange(startDate, endDate)) {
                setError("Transportation dates must be within the planner's date range."); // Set error message
                return;
            }
    
            try {
                const response = await axios.patch(`http://localhost:8080/planner/${plannerId}/transportation/${editingTransportationId}?userId=${userId}`, {
                    type: transportationType,
                    details: transportationDetails,
                    departureTime: startDate.toISOString(),
                    arrivalTime: endDate.toISOString(),
                    vehicleId: transportationVehicleId,
                });
    
                if (response.data.success) {
                    // Update the transportations state with edited transportation data
                    setTransportations(prev => 
                        prev.map(transport => 
                            transport._id === editingTransportationId 
                            ? { ...transport, type: transportationType, details: transportationDetails, departureTime: startDate.toISOString(), arrivalTime: endDate.toISOString(), vehicleId: transportationVehicleId } 
                            : transport
                        )
                    );
                    resetTransportationForm(); // Reset form fields after successful edit
                } else {
                    console.error("Error editing transportation:", response.data.message); // Log error message
                }
            } catch (error) {
                console.error("Error editing transportation:", error.response ? error.response.data : error.message); // Log error if request fails
            }
        };
    
        // Handle deleting a transportation
        const handleDeleteTransportation = async (transportationId) => {
            try {
                const response = await axios.delete(`http://localhost:8080/planner/${plannerId}/transportation/${transportationId}`, {
                    params: { userId }
                });
                if (response.data.success) {
                    setTransportations(prev => prev.filter(transport => transport._id !== transportationId)); // Update transportations state after deletion
                    setError(""); // Clear error message
                } else {
                    console.error("Error deleting transportation:", response.data.message); // Log error message
                }
            } catch (error) {
                console.error("Error deleting transportation:", error.response ? error.response.data : error.message); // Log error if request fails
            }
        };
    
        // Reset destination form fields
        const resetTransportationForm = () => {
            setEditingTransportationId(null);
            setTransportationType("");
            setTransportationDetails("");
            setTransportationDepartureTime("");
            setTransportationArrivalTime("");
            setTransportationVehicleId("");
            setError(""); // Clear any error messages
            setShowTransportationForm(false);
        };

    // Handle adding an accommodation
    const handleAddAccommodation = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const checkInDate = new Date(accommodationCheckInDate);
        const checkOutDate = new Date(accommodationCheckOutDate);
    
        // Validate input fields
        if (!accommodationName || !accommodationAddress || !accommodationCheckInDate || !accommodationCheckOutDate || !selectedDestinationId) {
            alert("All fields are required for accommodation."); // Alert if fields are empty
            return;
        }
    
        // Validate date range
        if (!validateDateRange(checkInDate, checkOutDate)) {
            setError("Accommodation dates must be within the planner's date range."); // Set error message
            return;
        }
    
        try {
            const response = await axios.post(`http://localhost:8080/planner/${plannerId}/destination/${selectedDestinationId}/accommodation`, {
                name: accommodationName,
                address: accommodationAddress,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                createdBy: userId,  // Include the userId of the creator
                location: selectedDestinationId  // Include the selected destination ID
            });
    
            if (response.data.success) {
                setDestinations(prev =>
                    prev.map(dest =>
                        dest._id === selectedDestinationId
                            ? { ...dest, accommodations: [...(dest.accommodations || []), response.data.data] } // Update accommodations for selected destination
                            : dest
                    )
                );
                // Reset accommodation form fields after successful addition
                setAccommodationName("");
                setAccommodationAddress("");
                setAccommodationCheckInDate("");
                setAccommodationCheckOutDate("");
                setShowAccommodationForm(false);
                setError(""); // Clear any error messages
            } else {
                console.error("Error adding accommodation:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error adding accommodation:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    // Handle adding an activity
    const handleAddActivity = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const selectedDate = new Date(activityDate);

        // Validate input fields
        if (!activityName || !activityDate || !activityTime || !activityDestinationId) {
            alert("All fields are required for the activity."); // Alert if fields are empty
            return;
        }

        // Validate that the activity date is within the planner's date range
        if (!validateDateRange(selectedDate, selectedDate)) {
            setError("Activity date must be within the planner's date range."); // Set error message
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/planner/${plannerId}/destination/${activityDestinationId}/activity`, {
                name: activityName,
                date: selectedDate.toISOString(),
                time: activityTime,
                createdBy: userId // Include the userId of the creator
            });

            if (response.data.success) {
                setDestinations(prev => prev.map(dest => 
                    dest.destinationId === activityDestinationId 
                    ? { ...dest, activities: [...(dest.activities || []), response.data.data] } // Update activities for selected destination
                    : dest
                ));
                // Reset activity form fields after successful addition
                setActivityName("");
                setActivityDate("");
                setActivityTime("");
                setShowActivityForm(false);
                setError(""); // Clear any error messages
            } else {
                console.error("Error adding activity:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error adding activity:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };

    // Display loading message while fetching planner data
    if (!planner) {
        return <p>Loading...</p>; 
    }

    return (
        <div className="Page-color">
            <div className="List">
                <p/>
                <h1>
                    {planner.name}
                </h1>
                <div className="List-subheader">
                    {planner.description}
                    <p/>
                    {`${new Date(planner.startDate).toLocaleDateString()} To ${new Date(planner.endDate).toLocaleDateString()}`}
                </div>
            <header className="Page-header">

                {/* Add Accommodation Form */}
                <button onClick={() => setShowAccommodationForm(!showAccommodationForm)}>
                    {showAccommodationForm ? "❌ Cancel" : "➕ Add Accommodation"}
                </button>
                {showAccommodationForm && (
                    <form onSubmit={handleAddAccommodation}>
                        <select 
                            onChange={(e) => setSelectedDestinationId(e.target.value)} 
                            required
                        >
                            <option value="">Select Destination</option>
                            {destinations.map(dest => (
                                <option key={dest._id} value={dest._id}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={accommodationName}
                            onChange={(e) => setAccommodationName(e.target.value)}
                            placeholder="Accommodation Name"
                            required
                        />
                        <input
                            type="text"
                            value={accommodationAddress}
                            onChange={(e) => setAccommodationAddress(e.target.value)}
                            placeholder="Address"
                            required
                        />
                        <input
                            type="date"
                            value={accommodationCheckInDate}
                            onChange={(e) => setAccommodationCheckInDate(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            value={accommodationCheckOutDate}
                            onChange={(e) => setAccommodationCheckOutDate(e.target.value)}
                            required
                        />
                        <button type="submit">Add Accommodation</button>
                    </form>
                )}

                {/* Add Activity Form */}
                <button onClick={() => setShowActivityForm(!showActivityForm)}>
                    {showActivityForm ? "❌ Cancel" : "➕ Add Activity"}
                </button>
                {showActivityForm && (
                    <form onSubmit={handleAddActivity}>
                        <select 
                            onChange={(e) => setActivityDestinationId(e.target.value)} 
                            required
                        >
                            <option value="">Select Destination</option>
                            {destinations.map(dest => (
                                <option key={dest.destinationId} value={dest.destinationId}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            placeholder="Activity Name"
                            required
                        />
                        <input
                            type="date"
                            value={activityDate}
                            onChange={(e) => setActivityDate(e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={activityTime}
                            onChange={(e) => setActivityTime(e.target.value)}
                            required
                        />
                        <button type="submit">Add Activity</button>
                    </form>
                )}

                <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
            </header>

                <p/>
                <div className="List-header">
                    <BsFillMapFill /> Destinations
                </div>
                {destinations.length > 0 ? (
                    destinations.map(dest => (
                        <div className="List-item" key={dest._id}>
                            <div>
                                <h3>
                                    {dest.name} 
                                </h3>
                                <h4>
                                    {`${new Date(dest.startDate).toLocaleDateString()} To ${new Date(dest.endDate).toLocaleDateString()}`}
                                </h4>
                                
                                {!isReadOnly &&(
                                    <div>
                                        <button className="Icon-button" onClick={() => {
                                            setEditingDestinationId(dest._id);
                                            setDestinationName(dest.name);
                                            setDestinationStartDate(dest.startDate.split("T")[0]); // Format date for input
                                            setDestinationEndDate(dest.endDate.split("T")[0]); // Format date for input
                                            setShowDestinationForm(true); // Show form for editing
                                        }}><BsPencilFill /></button>
                                        <button className="Icon-button" onClick={() => handleDeleteDestination(dest._id)}><BsTrashFill /></button>
                                        <CommentButton id={dest._id} type="Destination" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No destinations available.</p> // Display message if no destinations
                )}

                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button" onClick={() => {
                            setShowDestinationForm(true)
                        }}><BsFillPlusCircleFill /></button >
                    </div>
                )}
                
                
                {showDestinationForm && (
                    //create/edit destination modal
                    <div className="modal">
                        <div className="modal-content">
                            <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
                            <form onSubmit={editingDestinationId ? handleEditDestination : handleAddDestination} onReset={resetDestinationForm}>
                                Destination Name:
                                <input
                                    type="text"
                                    value={destinationName}
                                    onChange={(e) => setDestinationName(e.target.value)}
                                    placeholder="Destination Name"
                                    required
                                />
                                <p/>
                                Start Date:
                                <input
                                    type="date"
                                    value={destinationStartDate}
                                    onChange={(e) => setDestinationStartDate(e.target.value)}
                                    required
                                />
                                <p/>
                                End Date:
                                <input
                                    type="date"
                                    value={destinationEndDate}
                                    onChange={(e) => setDestinationEndDate(e.target.value)}
                                    required
                                />
                                <p/>
                                <button type="reset">Cancel</button>
                                <button type="submit">{editingDestinationId ? "Update Destination" : "Add Destination"}</button>
                            </form>
                        </div>
                    </div>
                )}
                <p />

                <p/>
                <div className="List-header">
                    <BiSolidPlane /> Transportation
                </div>
                {transportations.length > 0 ? (
                    transportations.map(transport => (
                        <div className="List-item" key={transport._id}>
                            <div>
                                <h3>
                                    {transport.type} 
                                </h3>
                                <h4>
                                    {transport.details}
                                    <br/>
                                    {`Departure: ${new Date(transport.departureTime).toLocaleDateString()} at ${new Date(transport.departureTime).toLocaleTimeString()}`}
                                    <br/>
                                    {`Arrival: ${new Date(transport.arrivalTime).toLocaleDateString()} at ${new Date(transport.arrivalTime).toLocaleTimeString()}`}
                                    <br/>
                                    Vehicle ID: {transport.vehicleId}
                                </h4>
                                
                                {!isReadOnly &&(
                                    <div>
                                        <button className="Icon-button" onClick={() => {
                                            setEditingTransportationId(transport._id);
                                            setTransportationType(transport.type);
                                            setTransportationDetails(transport.details);
                                            setEditingTransportationId(transport._id);
                                            setTransportationDepartureTime(transport.departureTime.split(":00.000Z")[0]); // Format date for input
                                            setTransportationArrivalTime(transport.arrivalTime.split(":00.000Z")[0]); // Format date for input
                                            setTransportationVehicleId(transport.vehicleId);
                                            setShowTransportationForm(true); // Show form for editing
                                        }}><BsPencilFill /></button>
                                        <button className="Icon-button" onClick={() => handleDeleteTransportation(transport._id)}><BsTrashFill /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No transportation available.</p> // Display message if no transportation
                )}

                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button" onClick={() => {
                            setShowTransportationForm(true)
                        }}><BsFillPlusCircleFill /></button >
                    </div>
                )}
                
                
                {showTransportationForm && (
                    //create/edit transportation modal
                    <div className="modal">
                        <div className="modal-content">
                            <p>{error && <span style={{ color: 'red' }}>{error}</span>}</p> {/* Display any error messages */}
                            <form onSubmit={editingTransportationId ? handleEditTransportation : handleAddTransportation} onReset={resetTransportationForm}>
                                Transportation Type:
                                <input
                                    type="text"
                                    value={transportationType}
                                    onChange={(e) => setTransportationType(e.target.value)}
                                    placeholder="Transportation Type"
                                    required
                                />
                                <p/>
                                Details:
                                <input
                                    type="text"
                                    value={transportationDetails}
                                    onChange={(e) => setTransportationDetails(e.target.value)}
                                    placeholder="Transportation Details"
                                    required
                                />
                                <p/>
                                Departure Time:
                                <input
                                    type="datetime-local"
                                    value={transportationDepartureTime}
                                    onChange={(e) => setTransportationDepartureTime(e.target.value)}
                                    required
                                />
                                <p/>
                                Arrival Time:
                                <input
                                    type="datetime-local"
                                    value={transportationArrivalTime}
                                    onChange={(e) => setTransportationArrivalTime(e.target.value)}
                                    required
                                />
                                <p/>
                                Vehicle ID:
                                <input
                                    type="text"
                                    value={transportationVehicleId}
                                    onChange={(e) => setTransportationVehicleId(e.target.value)}
                                    placeholder="Vehicle ID"
                                    required
                                />
                                <p/>
                                <button type="reset">Cancel</button>
                                <button type="submit">{editingTransportationId ? "Update Transportation" : "Add Transportation"}</button>
                            </form>
                        </div>
                    </div>
                )}
                <p />

                <div className="List-header">
                    <BiSolidBed /> Accommodations
                </div>
                {planner.accommodations && planner.accommodations.length > 0 ? (
                    planner.accommodations.map(accommodation => (
                        <div className="List-item" key={accommodation._id}>
                            <div>{accommodation.name}</div>
                            <div className="Planner-item">{accommodation.address}</div>
                            <div className="Planner-item">Check In: {new Date(accommodation.checkInDate).toLocaleDateString()}</div>
                            <div className="Planner-item">Check Out: {new Date(accommodation.checkOutDate).toLocaleDateString()}</div>
                        </div>
                    ))
                ) : (
                    <p>No accommodations available.</p> // Display message if no accommodations
                )}
                <p />

                <div className="List-header">
                    <BiCalendarEvent /> Activities
                </div>
                {planner.activities && planner.activities.length > 0 ? (
                    planner.activities.map(activity => (
                        <div className="List-item" key={activity._id}>
                            <div>{activity.name}</div>
                            <div className="Planner-item">{new Date(activity.date).toLocaleDateString()}</div>
                            <div className="Planner-item">{activity.time}</div>
                            <p />
                        </div>
                    ))
                ) : (
                    <p>No activities available.</p> // Display message if no activities
                )}
            </div>
        </div>
    );
};

export default Planner; // Export Planner component for use in other parts of the application
