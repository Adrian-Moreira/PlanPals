import express from 'express'
import {
  castVote,
  getVotesByActivityId,
} from '../../../../controllers/votingController'

export const voteRouter = express.Router({ mergeParams: true })

voteRouter.get('/', getVotesByActivityId)
voteRouter.post('/', castVote)
