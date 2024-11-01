//A comment box holds all comments submitted for a given objectId
//Comments are fetched from and sent to the backend

import React, { useEffect, useState } from "react";
import CommentList from './commentList';
import CommentForm from './commentForm';
import axios from "axios"; // Import axios for API calls
import { useAuth } from "../../AuthContext";

const CommentBox = ({objectId, objectType}) => {

    const [commentData, setComments] = useState([]);
    const { userId } = useAuth(); 

    //Handles submitting a new comment, sending it to the server and updating the comment display
    const handleCommentSubmit = async (newComment) => {

        try {
            const response = await axios.post(`http://localhost:8080/comment`, {
                type: objectType,
                objectId: objectId,
                createdBy: userId,
                content: newComment
            });

            if (response.data.success) {
                const comment = {content: newComment, createdBy: userId}

                //Add new comment to the displayed box
                setComments((prevComments) => [...prevComments, comment]);

            } else {
                console.error("Error adding comment:", response.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error adding comment:", error.response ? error.response.data : error.message); // Log error if request fails
        }
    };


    //When component is mounted, load comments from the server
    useEffect(()=>{

        //Loads all comments from the server
        const loadCommentsFromServer = async () => {

            try {
                const response = await axios.get(`http://localhost:8080/comment`, {
                    params: {
                        type: objectType, //Not sure what type means, ask kin later and fix this
                        objectId: objectId
                    }
                });

                if (response.data.success) {
                    setComments(response.data.data);

                } else {
                    console.error("Failed to fetch comments:", response.data.message); // Log error message

                }
            } catch (error) {
                console.error("Error fetching comments:", error); // Log error if fetch fails
            }
        }


        loadCommentsFromServer();
    }, [])


    return (
        <div id="commentBox" className="Comment-Container">
            <CommentList commentData={commentData} />
            <CommentForm onSubmit={handleCommentSubmit} />
        </div>
    );
};

export default CommentBox;