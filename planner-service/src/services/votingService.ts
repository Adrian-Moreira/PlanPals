import { VoteModel } from '../models/Vote'

export async function castVoteService({
  activityId,
  userId,
  voteValue,
}: any): Promise<any> {
  const vote = await VoteModel.create({
    activityId,
    userId,
    voteValue,
  })
  return vote
}

export async function getVotesByActivityIdService(
  activityId: string,
): Promise<any> {
  const votes = await VoteModel.find({ activityId })
  return votes
}
