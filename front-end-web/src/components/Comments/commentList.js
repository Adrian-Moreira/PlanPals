//A comment list maps comment data supplied as seperate comments on the screen

import React from 'react';
import Comment from './comment';

const CommentList = ({commentData}) => {
    return (
        <div id="commentList" className="Comment-Scrolling-Box">
            {commentData.map((comment) => (
                <Comment commentId={comment._id} author={comment.createdBy} body={comment.content}/>
            ))}
        </div>
    );
};

export default CommentList;