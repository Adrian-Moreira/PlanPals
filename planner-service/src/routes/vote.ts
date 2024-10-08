import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import {
//   createVote,
//   getVotesByActivityId,
// } from '../controllers/vote';

export const voteRouter = express.Router({ mergeParams: true });

voteRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
    //   const result = await getVotesByActivityId(activityId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

voteRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
      const voteData = req.body;
    //   const result = await createVote(activityId, voteData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);