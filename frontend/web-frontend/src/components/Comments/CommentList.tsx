//A comment list maps comment data supplied as seperate comments on the screen

import React from 'react'
import Comment, { IComment } from './Comment'

const CommentList = ({ commentData }) => {
  return (
    <div id="commentList" className="Comment-Scrolling-Box">
      {commentData.map((comment: IComment) => (
        <Comment key={comment._id} commentId={comment._id} author={comment.createdBy} body={comment.content} />
      ))}
    </div>
  )
}

export default CommentList
