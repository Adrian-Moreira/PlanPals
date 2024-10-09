
import React from "react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

// const plannerList = [
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
//       }
// ];

const uid = 0; //temp userid

function Planners() {
    const [editPlannerList, setPlannersRW] = useState([]);
    const [viewPlannerList, setPlannersRO] = useState([]);

    const getPlanners = async (e) => {
        e.preventDefault();
    
        try {
            await axios
            .get(`http://localhost:8080/planner`, {
                params: { userId: uid, access:'rw'}
            })
            .then((response) => setPlannersRW(response.data));

            await axios
            .get(`http://localhost:8080/planner`, {
                params: { userId: uid, access:'ro'}
            })
            .then((response) => setPlannersRO(response.data));
            
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {getPlanners}
            <header className="Page-header">
                <p>
                    Your Planners:
                </p>
            
            </header>

            <div className="List">
                {editPlannerList.map((planner) => (
                    <div key={planner.plannerId}>
                        <Link className="List-button" to={`/planner/rw/${planner.plannerId}`}>{planner.name}</Link>
                    </div>
                ))}
            </div>

            <header className="Page-header">
                <p>
                    Viewable Planners:
                </p>
            
            </header>

            <div className="List">
                {viewPlannerList.map((planner) => (
                    <div key={planner.plannerId}>
                        <Link className="List-button" to={`/planner/ro/${planner.plannerId}`}>{planner.name}</Link>
                    </div>
                ))}
            </div>
      </div>
    );
};

export default Planners;