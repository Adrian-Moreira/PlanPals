import React from 'react';

const Comment = ({author, body, commentId}) => {
    return (
        <div id={commentId}>
            <u>{author}:</u> {body}
        </div>
    );
};

export default Comment;