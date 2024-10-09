
import React from "react";
import { Link } from 'react-router-dom';

const plannerList = [
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
      }
];

function Planners() {
    return (
        <div>
            <header className="Page-header">
                <p>
                    Your Planners:
                </p>
            
            </header>

            <div className="List">
                {plannerList.map((planner) => (
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
                {plannerList.map((planner) => (
                    <div key={planner.id}>
                        <Link className="List-button" to={`/planner/${planner.id}`}>{planner.name}</Link>
                    </div>
                ))}
            </div>
      </div>
    );
};

export default Planners;