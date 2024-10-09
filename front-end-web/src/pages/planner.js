
import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BiSolidPlane } from "react-icons/bi";
import { BiSolidBed } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
// import { BsFillHandThumbsUpFill } from "react-icons/bs";
// import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BsChatFill } from "react-icons/bs";

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

// const destinations = [
//     {
//         "destinationId": "dest001",
//         "plannerId": "planner001",
//         "name": "Madrid",
//         "startDate": "2023-10-01",
//         "endDate": "2023-10-05",
//         "activities": ["activity001"],
//         "accommodations": ["accom001"]
//       }
// ];

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

    const [planner, setPlanner] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [activities, setActivities] = useState([]);

    const [locations, setLocations] = useState([]);
    const [comments, setComments] = useState([]);
    // const [votes, setVotes] = useState([]);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId)
        .then((response) => setPlanner(response.data))
        .catch((error) => console.error('Error fetching planner:', error));
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId+'/destination')
        .then((response) => setDestinations(response.data))
        .catch((error) => console.error('Error fetching destination:', error));
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId+'/transportation')
        .then((response) => setTransportation(response.data))
        .catch((error) => console.error('Error fetching transportation:', error));
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId+'/destination/'+destinations[0].destinationId+'/accommodation')
        .then((response) => setAccommodations(response.data))
        .catch((error) => console.error('Error fetching accommodations:', error));
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId+'/destination/'+destinations[0].destinationId+'/activity')
        .then((response) => setActivities(response.data))
        .catch((error) => console.error('Error fetching activities:', error));
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner/'+plannerId+'/destination/'+destinations[0].destinationId+'/comment')
        .then((response) => setComments(response.data))
        .catch((error) => console.error('Error fetching comments:', error));
    }, []);

    // Fetch locations for each activity
    useEffect(() => {
        // For each activity, fetch locations by its id
        activities.forEach(activity => {
        axios.get('http://localhost:8080/planner/'+plannerId+'/destination/'+destinations[0].destinationId+'/activity/'+activity.activityId+'/location')
            .then((response) => {
            // Set locations in the state, with activity.id as the key
            setLocations(prevLocations => ({
                ...prevLocations,
                [activity.activityId]: response.data, // Assuming data is a list of locations
            }));
            })
            .catch((error) => {
            console.error('Error fetching locations for activity ${activity.activityId}:', error);
            });
        });
    }, [activities]);

    // // Fetch votes for each activity
    // useEffect(() => {
    //     // For each activity, fetch votes by its id
    //     activities.forEach(activity => {
    //     axios.get('http://localhost:8080/planner/'+plannerId+'/destination/'+destinations[0].destinationId+'/activity/'+activity.activityId+'/vote')
    //         .then((response) => {
    //         // Set votes in the state, with activity.id as the key
    //         setVotes(prevVotes => ({
    //             ...prevVotes,
    //             [activity.activityId]: response.data, // Assuming data is a list of votes
    //         }));
    //         })
    //         .catch((error) => {
    //         console.error('Error fetching locations for activity ${activity.activityId}:', error);
    //         });
    //     });
    // }, [activities]);

    return (
        <div className="Page-color">
            <header className="Page-header">
                <p>
                    {planner.name}
                </p>
            
            </header>

            <div className="List">
                <div className="List-image-header">
                    {destinations[0].name}
                </div>
                <div className="List-subheader">
                    {destinations[0].startDate} to {destinations[0].endDate}
                </div>

                <p/>
                <div className="List-header">
                    <BiSolidPlane /> Transportation
                </div>
                {transportation.map((transport) => (
                    <div className="List-item" key={transport.transportationId}>
                        {!isReadOnly &&(
                            <div className="Right-side">
                                <button className="Icon-button"> <BsPencilFill /></button> 
                                <button className="Icon-button"> <BsTrashFill /></button>
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
                        <button className="Icon-button"><BsFillPlusCircleFill /></button >
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
                                <button className="Icon-button"> <BsPencilFill /></button> 
                                <button className="Icon-button"> <BsTrashFill /></button>
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
                        <button className="Icon-button"><BsFillPlusCircleFill /></button >
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
                                <button className="Icon-button"> <BsPencilFill /></button> 
                                <button className="Icon-button"> <BsTrashFill /></button>
                            </div>
                        )}
                        {activity.name}
                        <div className="Planner-item">{activity.date}</div>
                        <div className="Planner-item">{activity.time}</div>
                        
                        <p/>
                        Locations:
                        {/* {locations.map((location) => (
                            <div className="List-item"  key={location.locationId}>
                                {location.name}
                                <div className="Planner-item">{location.address}</div>
                            </div>
                        ))} */}
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
                        <button className="Icon-button"><BsFillPlusCircleFill /></button >
                    </div>
                )}
                
                <p/>
                <div className="List-header">
                    <BsChatFill /> Comments
                </div>
                {comments.map((comment) => (
                    <div className="List-item"  key={comment.commentId}>
                        {comment.createdBy}
                        <div className="Planner-item">{comment.content}</div>
                    </div>
                ))}
                {!isReadOnly &&(
                    <div>
                        <button className="Icon-button"><BsFillPlusCircleFill /></button >
                    </div>
                )}

            </div>
      </div>
    );
};

export default Planner;