import React, { useState } from 'react'
import * as MUIcons from '@mui/icons-material'
import * as MUI from '@mui/material'

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('')

  const handleAddComment = (e) => {
    e.preventDefault() // Prevent the default form submission

    //If it's not an empty comment, post it!
    if (comment) {
      onSubmit(comment)
      setComment('')
    }
  }

  return (
    <form onSubmit={handleAddComment}>
      <MUI.Box
        sx={{
          margin: '0.5em 0',
        }}
      >
        <MUI.TextField
          type="text"
          size="small"
          label="Add new comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <MUI.IconButton type="submit">
          <MUIcons.Send />
        </MUI.IconButton>
      </MUI.Box>
    </form>
  )
}

export default CommentForm
