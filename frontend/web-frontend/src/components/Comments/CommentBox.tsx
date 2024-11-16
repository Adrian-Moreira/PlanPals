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
import { useWebSocket } from '../../lib/wsLib'

const CommentBox = ({ objectId, objectType, userId, plannerId }) => {
  const [commentData, setComments] = useState<IComment[]>([])
  const { messages } = useWebSocket()
  useEffect(() => {
    const relevantEntries = Object.entries(messages).filter(([, msg]) => {
      return (
        msg.topic.type === 'planner' &&
        msg.topic.id === plannerId &&
        msg.message.type === 'Comment' &&
        msg.message.addon![0].objectId.id === objectId &&
        msg.message.addon![0].objectId.collection === objectType
      )
    })
    relevantEntries.forEach(([msgId, msg]) => {
      switch (msg.action) {
        case 'update':
          setComments([...commentData.filter((c) => c._id !== msg.message.data._id), msg.message.data])
          delete messages[msgId]
          break
        case 'delete':
          setComments(commentData.filter((c) => c._id !== msg.message.data._id))
          delete messages[msgId]
          break
      }
    })
  }, [messages, plannerId, objectId, userId])

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
