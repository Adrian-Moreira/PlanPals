
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BiSolidPlane } from "react-icons/bi";
import { BiSolidBed } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";

const planner = 
    {
        "plannerId": "5",
        "createdBy": "user123",
        "startDate": "2023-10-01T00:00:00Z",
        "endDate": "2023-10-10T00:00:00Z",
        "name": "Trip to Spain",
        "description": "Exploring Barcelona and Madrid",
        "roUsers": ["user456"],
        "rwUsers": ["user789"],
        "destinations": ["dest001"],
        "transportations": ["trans001"]
      };

const destinations = [
    {
        "destinationId": "dest001",
        "plannerId": "planner001",
        "name": "Madrid",
        "startDate": "2023-10-01",
        "endDate": "2023-10-05",
        "activities": ["activity001"],
        "accommodations": ["accom001"]
      }
];

const transportation = [
    {
        "transportationId": "trans001",
        "plannerId": "planner001",
        "type": "Flight",
        "details": "Flight from NYC to Madrid",
        "departureTime": "2023-10-01T08:00:00Z",
        "arrivalTime": "2023-10-01T20:00:00Z"
      }
];

const accommodations = [
    {
        "accommodationId": "accom001",
        "destinationId": "dest001",
        "name": "Madrid Hotel",
        "address": "123 Main St, Madrid",
        "checkInDate": "2023-10-01",
        "checkOutDate": "2023-10-05"
      }
];

const activities = [
    {
        "activityId": "activity001",
        "destinationId": "dest001",
        "name": "Visit Prado Museum",
        "date": "2023-10-02",
        "time": "10:00",
        "locations": ["loc001"],
        "votes": ["vote001"],
        "comments": ["comment001"]
      }
];

const locations = [
    {
        "locationId": "loc001",
        "activityId": "activity001",
        "createdBy": "user123",
        "name": "Prado Museum",
        "address": "C. de Ruiz de Alarcón, 23, 28014 Madrid"
      }
];

const votes = [
    {
        "voteId": "vote001",
        "activityId": "activity001",
        "createdBy": "user456",
        "voteType": "upvote"
      }
];

const comments = [
    {
        "commentId": "comment001",
        "activityId": "activity001",
        "createdBy": "user456",
        "content": "Can't wait to visit!"
      }
];

function Planner() {
    //const { id } = useParams();
    return (
        <div>
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
                        {transport.type}
                        <span className="Icon-button"> <BsPencilFill /></span> 
                        <span className="Icon-button"> <BsTrashFill /></span>
                        <div className="Planner-item">{transport.details}</div>
                        <div className="Planner-item">Departure: {transport.departureTime}</div>
                        <div className="Planner-item">Arrival: {transport.arrivalTime}</div>
                    </div>
                ))}
                <div className="Icon-button"><BsFillPlusCircleFill /></div >
                <p/>

                <div className="List-header">
                    <BiSolidBed /> Accomodations
                </div>
                {accommodations.map((accomodation) => (
                    <div className="List-item" key={accomodation.accommodationId}>
                        {accomodation.name}
                        <span className="Icon-button"> <BsPencilFill /></span> 
                        <span className="Icon-button"> <BsTrashFill /></span>
                        <div className="Planner-item">{accomodation.address}</div>
                        <div className="Planner-item">Check In: {accomodation.checkInDate}</div>
                        <div className="Planner-item">Check Out: {accomodation.checkOutDate}</div>
                    </div>
                ))}
                <div className="Icon-button"><BsFillPlusCircleFill /></div >
                <p/>

                <div className="List-header">
                    <BiCalendarEvent /> Activities
                </div>
                {activities.map((activity) => (
                    <div className="List-item" key={activity.activityId}>
                        {activity.name}
                        <span className="Icon-button"> <BsPencilFill /></span> 
                        <span className="Icon-button"> <BsTrashFill /></span>
                        <div className="Planner-item">{activity.date}</div>
                        <div className="Planner-item">{activity.time}</div>
                        
                        <p/>
                        Locations:
                        {locations.map((location) => (
                            <div className="List-item" key={location.locationId}>
                                {location.name}
                                <div className="Planner-item">{location.address}</div>
                            </div>
                        ))}

                        <p/>
                        Comments:
                        {comments.map((comment) => (
                            <div className="List-item" key={comment.commentId}>
                                {comment.createdBy}
                                <div className="Planner-item">{comment.content}</div>
                            </div>
                        ))}

                        <div className="Planner-vote">
                            Vote Score: {
                            votes.reduce((total, vote) => {
                                return total + (vote.voteType === 'upvote' ? 1 : -1);
                            }, 0)
                            }
                            <div className="Vote-button"><BsFillHandThumbsUpFill /></div><div className="Vote-button"><BsFillHandThumbsDownFill /></div>
                        </div>
                    </div>
                ))}

                <div className="Icon-button"><BsFillPlusCircleFill /></div >

            </div>
      </div>
    );
};

export default Planner;