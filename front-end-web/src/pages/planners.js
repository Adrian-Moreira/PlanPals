
import React from "react";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

const uid = 0;

function Planners() {
    const [editPlannerList, setPlannersRW] = useState([]);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner?userId='+uid+'&access=\'rw\'')
        .then((response) => setPlannersRW(response.data))
        .catch((error) => console.error('Error fetching planners:', error));
    }, []);

    const [viewPlannerList, setPlannersRO] = useState([]);

    useEffect(() => {
        axios
        .get('http://localhost:8080/planner?userId='+uid+'&access=\'ro\'')
        .then((response) => setPlannersRO(response.data))
        .catch((error) => console.error('Error fetching planners:', error));
    }, []);
  

    return (
        <div>
            <header className="Page-header">
                <p>
                    Your Planners:
                </p>
            
            </header>

            <div className="List">
                {editPlannerList.map((planner) => (
                    <div key={planner.plannerId}>
                        <Link className="List-button" to={`/planner/${planner.plannerId}`}>{planner.name}</Link>
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
                    <div key={planner.id}>
                        <Link className="List-button" to={`/planner/${planner.id}`}>{planner.name}</Link>
                    </div>
                ))}
            </div>
      </div>
    );
};

export default Planners;