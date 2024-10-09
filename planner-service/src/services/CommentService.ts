import { Types } from 'mongoose';
import { CommentModel } from '../models/Comment';
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException';

export class CommentService {
  // Create a comment for a planner
  public async createComment(plannerId: string, userId: string, content: string) {
    if (!Types.ObjectId.isValid(plannerId) || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid plannerId or userId');
    }

    const comment = await CommentModel.create({ plannerId, userId, content });
    return comment;
  }

  // Get all comments for a planner
  public async getCommentsByPlanner(plannerId: string) {
    if (!Types.ObjectId.isValid(plannerId)) {
      throw new Error('Invalid plannerId');
    }

    const comments = await CommentModel.find({ plannerId }).populate('userId', 'userName');
    return comments;
  }

  // Delete a comment
  public async deleteComment(commentId: string) {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new Error('Invalid commentId');
    }

    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    if (!deletedComment) {
      throw new RecordNotFoundException({ recordType: 'comment', message: 'Comment not found' });
    }

    return deletedComment;
  }
}
