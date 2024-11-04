import express from 'express'
import VoteValidator from '../controllers/vote'
import VoteService from '../services/vote'
import UserService from '../services/user'
import RequestUtils from '../utils/RequestUtils'

export const voteRouter = express.Router({ mergeParams: true })

voteRouter.get(
  '/',
  VoteValidator.getVotesByObjectId,
  RequestUtils.verifyObjectExistInCollection,
  VoteService.getVotesByObjectId,
)
voteRouter.get(
  '/:userId([0-9a-fA-F]{24})',
  VoteValidator.isUserVoted,
  RequestUtils.verifyObjectExistInCollection,
  UserService.verifyUserExists,
  VoteService.isUserVoted,
)
voteRouter.post(
  '/up',
  VoteValidator.upVote,
  RequestUtils.verifyObjectExistInCollection,
  UserService.verifyUserExists,
  VoteService.upVote,
)
voteRouter.post(
  '/down',
  VoteValidator.downVote,
  RequestUtils.verifyObjectExistInCollection,
  UserService.verifyUserExists,
  VoteService.downVote,
)
voteRouter.delete(
  '/',
  VoteValidator.removeVote,
  RequestUtils.verifyObjectExistInCollection,
  UserService.verifyUserExists,
  VoteService.removeVote,
)

voteRouter.get(
  '/count',
  VoteValidator.getVotesByObjectId,
  RequestUtils.verifyObjectExistInCollection,
  VoteService.getVoteCountByObjectId,
);
