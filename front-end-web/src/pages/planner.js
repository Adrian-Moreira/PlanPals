

import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import your Auth context to get user ID
import axios from "axios"; // Import axios for API calls
import { BiSolidPlane } from "react-icons/bi";
import { BiSolidBed } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
// import { BsFillHandThumbsUpFill } from "react-icons/bs";
// import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BsChatFill } from "react-icons/bs";
import { BsFillPinMapFill } from "react-icons/bs";

// const planner = 
//     {
//         "plannerId": "5",
//         "createdBy": "user123",
//         "startDate": "2023-10-01T00:00:00Z",
//         "endDate": "2023-10-10T00:00:00Z",
//         "name": "Trip to Spain",
//         "description": "Exploring Barcelona and Madrid",
//         "roUsers": ["user456"],
//         "rwUsers": ["user789"],
//         "destinations": ["dest001"],
//         "transportations": ["trans001"]
//       };

// const destinations = 
//     {
//         "destinationId": "dest001",
//         "plannerId": "planner001",
//         "name": "Madrid",
//         "startDate": "2023-10-01",
//         "endDate": "2023-10-05",
//         "activities": ["activity001"],
//         "accommodations": ["accom001"]
//       };

// const transportation = [
//     {
//         "transportationId": "trans001",
//         "plannerId": "planner001",
//         "type": "Flight",
//         "details": "Flight from NYC to Madrid",
//         "departureTime": "2023-10-01T08:00:00Z",
//         "arrivalTime": "2023-10-01T20:00:00Z"
//       }
// ];

// const accommodations = [
//     {
//         "accommodationId": "accom001",
//         "destinationId": "dest001",
//         "name": "Madrid Hotel",
//         "address": "123 Main St, Madrid",
//         "checkInDate": "2023-10-01",
//         "checkOutDate": "2023-10-05"
//       }
// ];

// const activities = [
//     {
//         "activityId": "activity001",
//         "destinationId": "dest001",
//         "name": "Visit Prado Museum",
//         "date": "2023-10-02",
//         "time": "10:00",
//         "locations": ["loc001"],
//         "votes": ["vote001"],
//         "comments": ["comment001"]
//       }
// ];

// const locations = [
//     {
//         "locationId": "loc001",
//         "activityId": "activity001",
//         "createdBy": "user123",
//         "name": "Prado Museum",
//         "address": "C. de Ruiz de Alarcón, 23, 28014 Madrid"
//       }
// ];

// const votes = [
//     {
//         "voteId": "vote001",
//         "activityId": "activity001",
//         "createdBy": "user456",
//         "voteType": "upvote"
//       }
// ];

// const comments = [
//     {
//         "commentId": "comment001",
//         "activityId": "activity001",
//         "createdBy": "user456",
//         "content": "Can't wait to visit!"
//       }
// ];

function Planner() {
    const { plannerId, access } = useParams();
    const isReadOnly = access === "ro";
    const { userId } = useAuth(); // Get the logged-in user's ID from Auth context

    const [planner, setPlanner] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [activities, setActivities] = useState([]);

    const [locations, setLocations] = useState([]);
    const [comments, setComments] = useState([]);
    // const [votes, setVotes] = useState([]);

    useEffect(() => {
        const fetchPlanners = async () => {
            console.log(userId);
            if (!userId) return; // Exit if userId is not available
            try {
                const response = await axios.get(`http://localhost:8080/planner?userId=${userId}`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setPlanner(response.data.data.find(item => item._id === plannerId)); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch planners:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching planners:", error);
            }
        };

        fetchPlanners();
    }, [userId,plannerId]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setDestinations(response.data.data); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch destination:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching destination:", error);
            }
        };

        fetchDestinations();
    }, [plannerId]);

    useEffect(() => {
        const fetchTransportation = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/planner/${plannerId}/transportation`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setTransportation(response.data.data); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch transportation:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching transportation:", error);
            }
        };

        fetchTransportation();
    }, [plannerId]);

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination/${destinations[0].destinationId}/accommodation`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setAccommodations(response.data.data); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch accommodations:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching accommodations:", error);
            }
        };

        fetchAccommodations();
    }, [plannerId,destinations]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination/${destinations[0].destinationId}/activity`);
                console.log(response.data); // Log the response data to check structure
                if (response.data.success) {
                    setActivities(response.data.data); // Ensure you're using the correct path to access the data
                } else {
                    console.error("Failed to fetch activities:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchActivities();
    }, [plannerId,destinations]);

    useEffect(() => {
        activities.forEach(activity => {
            const fetchLocations = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination/${destinations[0].destinationId}/activity/${activity.activityId}/location`);
                    console.log(response.data); // Log the response data to check structure
                    if (response.data.success) {
                        setLocations(prevLocations => ({
                            ...prevLocations,
                            [activity.activityId]: response.data.data, // Assuming data is a list of locations
                        }));
                    } else {
                        console.error("Failed to fetch locations:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }

            };
        
            fetchLocations();
        })
    }, [plannerId,destinations,activities]);

    useEffect(() => {
        activities.forEach(activity => {
            const fetchComments = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/planner/${plannerId}/destination/${destinations[0].destinationId}/activity/${activity.activityId}/comment`);
                    console.log(response.data); // Log the response data to check structure
                    if (response.data.success) {
                        setComments(prevComments => ({
                            ...prevComments,
                            [activity.activityId]: response.data.data, // Assuming data is a list of locations
                        }));
                    } else {
                        console.error("Failed to fetch comments:", response.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching comments:", error);
                }

            };
        
            fetchComments();
        })
    }, [plannerId,destinations,activities]);

    return (
        <div className="Page-color">
            <div className="List">
            <div className="List-image-header">
                {planner.name}
            </div>
            <div className="List-subheader">
                {planner.description}
                <p/>
                {planner.startDate} to {planner.endDate}
            </div>

                {destinations && destinations.length > 0 ? (
                    <div>
                        <div className="List-image-header">
                            {destinations[0].name}
                        </div>
                        <div className="List-subheader">
                            {destinations[0].startDate} to {destinations[0].endDate}
                        </div>
                    </div>
                ) : (
                        <div className="List-image-header">
                            Add Destination 
                            {!isReadOnly &&(
                                <span>
                                    <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                                </span>
                            )}
                    </div>
                )}
                

                <p/>
                <div className="List-header">
                    <BiSolidPlane /> Transportation
                </div>
                {transportation.map((transport) => (
                    <div className="List-item" key={transport.transportationId}>
                        {!isReadOnly &&(
                            <div className="Right-side">
                                <button className="Icon-button" disabled> <BsPencilFill /></button> 
                                <button className="Icon-button" disabled> <BsTrashFill /></button>
                            </div>
                        )}
                        {transport.type}
                        <div className="Planner-item">{transport.details}</div>
                        <div className="Planner-item">Departure: {transport.departureTime}</div>
                        <div className="Planner-item">Arrival: {transport.arrivalTime}</div>
                    </div>
                ))}
                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                    </div>
                )}
                <p/>

                <div className="List-header">
                    <BiSolidBed /> Accomodations
                </div>
                {accommodations.map((accomodation) => (
                    <div className="List-item" key={accomodation.accommodationId}>
                        {!isReadOnly &&(
                            <div className="Right-side">
                                <button className="Icon-button" disabled> <BsPencilFill /></button> 
                                <button className="Icon-button" disabled> <BsTrashFill /></button>
                            </div>
                        )}
                        {accomodation.name}
                        <div className="Planner-item">{accomodation.address}</div>
                        <div className="Planner-item">Check In: {accomodation.checkInDate}</div>
                        <div className="Planner-item">Check Out: {accomodation.checkOutDate}</div>
                    </div>
                ))}
                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                    </div>
                )}
                <p/>

                <div className="List-header">
                    <BiCalendarEvent /> Activities
                </div>
                {activities.map((activity) => (
                    <div className="List-item" key={activity.activityId}>
                        {!isReadOnly &&(
                            <div className="Right-side">
                                <button className="Icon-button" disabled> <BsPencilFill /></button> 
                                <button className="Icon-button" disabled> <BsTrashFill /></button>
                            </div>
                        )}
                        {activity.name}
                        <div className="Planner-item">{activity.date}</div>
                        <div className="Planner-item">{activity.time}</div>
                        
                        <p/>

                        <div className="List-header">
                            <BsFillPinMapFill /> Locations:
                        </div>
                        {locations[activity.activityId] ? (
                            locations[activity.activityId].map(location => (
                                <div className="List-item"  key={location.locationId}>
                                    {location.name}
                                    <div className="Planner-item">{location.address}</div>
                                </div>
                            ))
                        ) : (
                            <div className="List-item">Loading locations...</div>
                        )}
                        {!isReadOnly &&(
                            <div>
                                <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                            </div>
                        )}

                        <p/>

                        <div className="List-header">
                            <BsChatFill /> Comments
                        </div>
                        {comments[activity.activityId] ? (
                            comments[activity.activityId].map(comment => (
                                <div className="List-item"  key={comment.commentId}>
                                    {comment.createdBy}
                                    <div className="Planner-item">{comment.content}</div>
                                </div>
                            ))
                        ) : (
                            <div className="List-item">Loading comments...</div>
                        )}
                        {!isReadOnly &&(
                            <div>
                                <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                            </div>
                        )}

                        {/* <div className="Planner-vote">
                            Vote Score:
                            {votes[activity.activityId] ? (
                                votes[activity.activityId].reduce((total, vote) => {
                                    return total + (vote.voteType === 'upvote' ? 1 : -1);
                                }, 0)
                                
                            ) : (
                                <div className="List-item">Loading votes...</div>
                            )}
                            <div className="Vote-button"><BsFillHandThumbsUpFill /></div><div className="Vote-button"><BsFillHandThumbsDownFill /></div>
                             Voting is currently non-functional 
                        </div> */}
                    </div>
                ))}

                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button" disabled><BsFillPlusCircleFill /></button >
                    </div>
                )}
                
                <p/>

            </div>
      </div>
    );
};

export default Planner;