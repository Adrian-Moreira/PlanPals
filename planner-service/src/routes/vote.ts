import express from 'express'
import VoteValidator from '../controllers/vote'
import VoteService from '../services/vote'
import { Vote } from '../models/Vote'
import RequestUtils from '../utils/RequestUtils'

export const voteRouter = express.Router({ mergeParams: true })

voteRouter.get(
  '/',
  VoteValidator.getVotesByObjectId,
  VoteService.getVotesByObjectId,
  RequestUtils.mkSuccessResponse<Vote>,
  RequestUtils.mkErrorResponse,
)
voteRouter.get(
  '/:userId([0-9a-fA-F]{24})',
  VoteValidator.isUserVoted,
  VoteService.isUserVoted,
  RequestUtils.mkSuccessResponse<{ upVoted: boolean; downVoted: boolean }>,
  RequestUtils.mkErrorResponse,
)
voteRouter.post(
  '/up',
  VoteValidator.upVote,
  VoteService.upVote,
  RequestUtils.mkSuccessResponse<Vote>,
  RequestUtils.mkErrorResponse,
)
voteRouter.post(
  '/down',
  VoteValidator.downVote,
  VoteService.downVote,
  RequestUtils.mkSuccessResponse<Vote>,
  RequestUtils.mkErrorResponse,
)
voteRouter.delete(
  '/',
  VoteValidator.removeVote,
  VoteService.removeVote,
  RequestUtils.mkSuccessResponse<Vote>,
  RequestUtils.mkErrorResponse,
)
