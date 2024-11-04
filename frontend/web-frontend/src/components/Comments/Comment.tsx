import React from 'react'

export interface IComment {
  _id: string
  content: string
  createdBy: string
}

function Comment({ author, body, commentId }) {
  return (
    <div id={commentId}>
      <u>{author}:</u> {body}
    </div>
  )
}

export default Comment
