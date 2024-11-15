import React, {useState } from "react";

const CommentForm = ({onSubmit}) => {

    const [comment, setComment] = useState('');

    const handleAddComment = (e) => {
        e.preventDefault(); // Prevent the default form submission

        //If it's not an empty comment, post it!
        if (comment) {
            onSubmit(comment);
            setComment('');
        }
    }

    return (
        <form onSubmit={handleAddComment}>
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit">Post</button>
                    </form>
    );
};

export default CommentForm;