//Creates a button which when clicked shows or hides the comment box for a given object
//objectId must be supplied to show the correct comment box

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

            //If user has downVoted this object, reflect such by removing the downVote on screen
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

            //If user has downVoted this object, reflect such by removing the downVote on screen
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
    const loadVotesFromServer = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/vote`, {
                params: {
                    type: type,
                    objectId: id
                }
            });

            if (response.data.success) {
              setUpVotes(response.data.data.upVotes.length)
              setDownVotes(response.data.data.downVotes.length)

            } else {
                console.error("Failed to fetch votes:", response.data.message); // Log error message

            }
        } catch (error) {
            console.error("Error fetching votes:", error); // Log error if fetch fails
        }
    }
    
      //Loads all votes from the server
      const setVotedState = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/vote/${userId}`, {
                params: {
                    type: type,
                    objectId: id
                }
            });

            if (response.data.success) {
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