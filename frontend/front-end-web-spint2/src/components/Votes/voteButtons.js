/*Creates 2 buttons, allowing the user to up vote or down vote an object (such as a destination or activity)
  Votes are made on the given objectId under the current userId that is logged in

  CURRENTLY KNOWN ISSUE: if the user is logged in on the same account on multiple windows/devices client side state
                         may differ from the server state. This won't cause any backend issues but front end may display
                         incorrectly until refreshed. Will be fixed when real time updating is added.
*/

import React, { useEffect, useState } from 'react';
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import axios from "axios"; // Import axios for API calls
import { useAuth } from "../../AuthContext";

//id is the objectId, type is the object type
const VoteButtons = ({id, type}) => {

  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);

  const [hasVotedUp, setHasVotedUp] = useState(false);
  const [hasVotedDown, setHasVotedDown] = useState(false);

  const { userId } = useAuth(); 

  //Called when the user presses the upVote button
  const upVote = async() => {

    //If the user has not voted this object up, upVote it!
    if(!hasVotedUp) {

      try {
        const response = await axios.post(`http://localhost:8080/vote/up`, {
            type: type,
            objectId: id,
            createdBy: userId
        });

        if (response.data.success) {
            //Increment upVote counter
            setUpVotes(upVotes + 1)
            setHasVotedUp(true)

            //If the user had previously downVoted this object, remove one from the downVote counter
            if(hasVotedDown)
            {
              setDownVotes(downVotes - 1)
              setHasVotedDown(false)
            }
            

        } else {
            console.error("Error adding upVote:", response.data.message); // Log error message
        }
      } catch (error) {
          console.error("Error adding upVote:", error.response ? error.response.data : error.message); // Log error if request fails
      }
    }

    //If user has already upVoted, remove that vote
    else {

      try {
        const response = await axios.delete(`http://localhost:8080/vote`, {
          data:{type: type,
          objectId: id
          },
          params: {userId: userId}
          });

        if (response.data.success) {
          //Decrement upVote counter
          setUpVotes(upVotes - 1)
          setHasVotedUp(false)
            

        } else {
            console.error("Error removing upVote:", response.data.message); // Log error message
        }
      } catch (error) {
          console.error("Error removing upVote:", error.response ? error.response.data : error.message); // Log error if request fails
      }
    }

  }

  const downVote = async() => {

    //If the user has not voted this object up, downVote it!
    if(!hasVotedDown) {

      try {
        const response = await axios.post(`http://localhost:8080/vote/down`, {
            type: type,
            objectId: id,
            createdBy: userId
        });

        if (response.data.success) {
            //Increment downVote counter
            setDownVotes(downVotes + 1)
            setHasVotedDown(true)

            //If the user had previously upVoted this object, remove one from the upVote counter
            if(hasVotedUp)
            {
              setUpVotes(upVotes - 1)
              setHasVotedUp(false)
            }
            

        } else {
            console.error("Error adding upVote:", response.data.message); // Log error message
        }
      } catch (error) {
          console.error("Error adding upVote:", error.response ? error.response.data : error.message); // Log error if request fails
      }
    }

    //If user has already downVoted, remove that vote
    else {

      try {
        const response = await axios.delete(`http://localhost:8080/vote`, {
          data:{type: type,
          objectId: id
          },
          params: {userId: userId}
          });

        if (response.data.success) {
          //Decrement upVote counter
          setDownVotes(downVotes - 1)
          setHasVotedDown(false)
            

        } else {
            console.error("Error removing upVote:", response.data.message); // Log error message
        }
      } catch (error) {
          console.error("Error removing upVote:", error.response ? error.response.data : error.message); // Log error if request fails
      }
    }
  }


  //When component is mounted, load votes from the server
  useEffect(()=>{

    //Loads all votes from the server
    /*
      When adding real time capability, will need to call these functions much more often to keep screen up to date
    */
    const loadVotesFromServer = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/vote`, {
                params: {
                    type: type,
                    objectId: id
                }
            });

            if (response.data.success) {
              //Set both vote counters to reflect the amount of votes made on the object
              setUpVotes(response.data.data.upVotes.length)
              setDownVotes(response.data.data.downVotes.length)

            } else {
                console.error("Failed to fetch votes:", response.data.message); // Log error message

            }
        } catch (error) {
            console.error("Error fetching votes:", error); // Log error if fetch fails
        }
    }
    
      //Loads current users voting state from the server
      const setVotedState = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/vote/${userId}`, {
                params: {
                    type: type,
                    objectId: id
                }
            });

            if (response.data.success) {
              //Set the voting state as the server provided
              setHasVotedUp(response.data.data.upVoted)
              setHasVotedDown(response.data.data.downVoted)

            } else {
                console.error("Failed to fetch votes:", response.data.message); // Log error message

            }
        } catch (error) {
            console.error("Error fetching votes:", error); // Log error if fetch fails
        }
    }


    loadVotesFromServer();
    setVotedState();
  }, [])


  //Return the actual voting buttons and counters
  return (
    <div id="comments" style={{display:"inline-block"}}>

        <button className="Icon-button" onClick={upVote}>
          <BsFillHandThumbsUpFill/>
        </button>

        <div style={{display:"inline-block", fontSize:"medium", fontWeight:"normal"}}>
          {upVotes}
        </div>
        

        <button className="Icon-button" onClick={downVote}>
          <BsFillHandThumbsDownFill/>
        </button>

        <div style={{display:"inline-block", fontSize:"medium", fontWeight:"normal"}}>
          {downVotes}
        </div>

    </div>
  );
};

export default VoteButtons;