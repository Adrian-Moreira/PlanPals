import express from 'express'
import VoteValidator from '../controllers/vote'
import VoteService from '../services/vote'
import UserService from '../services/user'

export const voteRouter = express.Router({ mergeParams: true })

voteRouter.get(
  '/',
  VoteValidator.getVotesByObjectId,
  VoteService.getVotesByObjectId,
)
voteRouter.get(
  '/:userId([0-9a-fA-F]{24})',
  VoteValidator.isUserVoted,
  UserService.verifyUserExists,
  VoteService.isUserVoted,
)
voteRouter.post(
  '/up',
  VoteValidator.upVote,
  UserService.verifyUserExists,
  VoteService.upVote,
)
voteRouter.post(
  '/down',
  VoteValidator.downVote,
  UserService.verifyUserExists,
  VoteService.downVote,
)
voteRouter.delete(
  '/',
  VoteValidator.removeVote,
  UserService.verifyUserExists,
  VoteService.removeVote,
)
