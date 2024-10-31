import React, {useState } from "react";
import CommentList from './commentList';
import CommentForm from './commentForm';

var commentData = [
    {id:1, author:"Adrian", body:"This is my first comment!"},
    {id:2, author:"Alvinna", body:"Here's another comment."},
    {id:3, author:"Adrian", body:"testing Scrollingggggggggggggggggggggggggggg"},
    {id:4, author:"Adrian", body:"keeeeeep going"},
    {id:5, author:"Adrian", body:"AAAaaaaaahhhhhhhhhhhhh"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"},
    {id:6, author:"Adrian", body:"more"}
];

//Contains a comment list of comments made on an object with the given objectId
const CommentBox = ({objectId}) => {

    const [commentData, setComments] = useState([]);

    const handleCommentSubmit = (newComment) => {

        //Eventually, do backend comment adding here and only update the comments if it goes through
        //...but also probably don't update them this way because we'll need the near realtime eventually

        setComments((prevComments) => [...prevComments, newComment]);
    };


    return (
        <div id="commentBox" className="Comment-Container">
            <h1>
                displaying comments for objectId: {objectId}
            </h1>
            <CommentList commentData={commentData} />
            <CommentForm onSubmit={handleCommentSubmit} />
        </div>
    );
};

export default CommentBox;