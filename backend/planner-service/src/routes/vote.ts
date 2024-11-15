import express from 'express'
import VoteValidator from '../controllers/vote'
import VoteService from '../services/vote'
import UserService from '../services/user'
import RequestUtils from '../utils/RequestUtils'
import { publishDeleteEvent, publishUpdateEvent } from '../services/rabbit'
import PlannerService from '../services/planner'

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
  PlannerService.verifyPlannerExists,
  UserService.verifyUserExists,
  VoteService.upVote,
  publishUpdateEvent,
)
voteRouter.post(
  '/down',
  VoteValidator.downVote,
  RequestUtils.verifyObjectExistInCollection,
  PlannerService.verifyPlannerExists,
  UserService.verifyUserExists,
  VoteService.downVote,
  publishUpdateEvent,
)
voteRouter.delete(
  '/',
  VoteValidator.removeVote,
  RequestUtils.verifyObjectExistInCollection,
  PlannerService.verifyPlannerExists,
  UserService.verifyUserExists,
  VoteService.removeVote,
  publishDeleteEvent,
)

voteRouter.get(
  '/count',
  VoteValidator.getVotesByObjectId,
  RequestUtils.verifyObjectExistInCollection,
  VoteService.getVoteCountByObjectId,
)
