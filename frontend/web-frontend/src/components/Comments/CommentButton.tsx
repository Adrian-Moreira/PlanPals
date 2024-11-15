//Creates a button which when clicked shows or hides the comment box for a given object
//objectId must be supplied to show the correct comment box

import React, { useCallback, useState } from 'react'
import * as MUIcons from '@mui/icons-material'
import * as MUI from '@mui/material'
import CommentBox from './CommentBox'

//id is the objectId, type is the object type
const CommentButton = ({ id, type, userId, plannerId }) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [setIsVisible, id])

  return (
    <div id="comments" style={{ display: 'inline-block' }}>
      <MUI.IconButton className="Icon-button" onClick={toggleVisibility}>
        <MUIcons.ChatSharp />
      </MUI.IconButton>

      <div id="commentVisibility" style={{ display: isVisible ? 'flex' : 'none', float: 'right' }}>
        <CommentBox objectId={id} objectType={type} userId={userId} plannerId={plannerId} />
      </div>
    </div>
  )
}

export default CommentButton
