import express from 'express'
import VoteValidator from '../controllers/vote'
import VoteService from '../services/vote'

export const voteRouter = express.Router({ mergeParams: true })

voteRouter.get(
  '/',
  VoteValidator.getVotesByObjectId,
  VoteService.getVotesByObjectId,
)
voteRouter.get('/:userId([0-9a-fA-F]{24})',VoteValidator.isUserVoted, VoteService.isUserVoted)
voteRouter.post('/up', VoteValidator.upVote, VoteService.upVote)
voteRouter.post('/down', VoteValidator.downVote, VoteService.downVote)
voteRouter.delete('/', VoteValidator.removeVote, VoteService.removeVote)
