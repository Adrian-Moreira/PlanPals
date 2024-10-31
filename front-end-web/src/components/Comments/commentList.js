import React from 'react';
import Comment from './comment';

const CommentList = ({commentData}) => {
    return (
        <div id="commentList" className="Comment-Scrolling-Box">
            {commentData.map((comment) => (
                <Comment commentId={comment.id} author={comment.author} body={comment.body}/>
            ))}
        </div>
    );
};

export default CommentList;