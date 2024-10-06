import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import {
//   createComment,
//   getCommentsByActivityId,
//   getCommentById,
//   updateCommentById,
// } from '../controllers/comment';

export const commentRouter = express.Router({ mergeParams: true });

commentRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
    //   const result = await getCommentsByActivityId(activityId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

commentRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
      const commentData = req.body;
    //   const result = await createComment(activityId, commentData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

commentRouter.get(
  '/:commentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, commentId } = req.params;
    //   const result = await getCommentById(activityId, commentId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

commentRouter.put(
  '/:commentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, commentId } = req.params;
      const commentData = req.body;
    //   const result = await updateCommentById(
    //     activityId,
    //     commentId,
    //     commentData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);