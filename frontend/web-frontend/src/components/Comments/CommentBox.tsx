/*  A comment box holds all comments submitted for a given objectId
    Comments are fetched from and sent to the backend

    NOTE: Comments currently only store the userId of the comment creator, as such
          without making hundreds of backend calls, we cannot display a users username beside
          a comment. Because of this we are currently displaying userIds in front of comments
          which is NOT GOOD! (but it works for now)
*/

import React, { useEffect, useState } from 'react'
import { IComment } from './Comment'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import apiLib from '../../lib/apiLib'

const CommentBox = ({ objectId, objectType, userId }) => {
  const [commentData, setComments] = useState<IComment[]>([])

  //Handles submitting a new comment, sending it to the server and updating the comment display
  const handleCommentSubmit = async (newComment) => {
    try {
      const response = await apiLib.post(`/comment`, {
        data: { type: objectType, objectId: objectId, createdBy: userId, content: newComment },
      })

      if (response.data.success) {
        const comment = { _id: response.data.data._id, content: newComment, createdBy: userId }

        //Add new comment to the displayed box
        setComments((prevComments) => [...prevComments, comment])
      } else {
        console.error('Error adding comment:', response.data.message) // Log error message
      }
    } catch (error) {
      console.error('Error adding comment:', error.response ? error.response.data : error.message) // Log error if request fails
    }
  }

  //When component is mounted, load comments from the server
  useEffect(() => {
    //Loads all comments from the server
    const loadCommentsFromServer = async () => {
      try {
        const response = await apiLib.get(`/comment`, {
          params: {
            type: objectType,
            objectId: objectId,
          },
        })

        if (response.data.success) {
          setComments(response.data.data)
        } else {
          console.error('Failed to fetch comments:', response.data.message) // Log error message
        }
      } catch (error) {
        console.error('Error fetching comments:', error) // Log error if fetch fails
      }
    }

    loadCommentsFromServer()
  }, [objectId])

  return (
    <div id="commentBox" className="Comment-Container">
      <CommentList commentData={commentData} />
      <CommentForm onSubmit={handleCommentSubmit} />
    </div>
  )
}

export default CommentBox
