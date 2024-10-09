import express, { Request, Response, NextFunction } from 'express';
import { CommentController } from '../controllers/commentController';
import { StatusCodes } from 'http-status-codes';


//import { CommentController } from './commentController';


const commentRouter = express.Router({ mergeParams: true });
const commentController = new CommentController();

commentRouter.post('/', async (req: Request, res: Response) => {
  try {
    console.log(req.body, 'req.body');
    console.log(commentController.createComment(req, res), 'commentController.createComment(req, res)');
    res.status(StatusCodes.CREATED).json({ success: true, data: commentController.createComment(req, res)});
  } catch (error) {
    //next(error);
  }
});

commentRouter.get('/:plannerId/comments', async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({ success: true, data: commentController.getCommentsByPlanner(req, res) });
  } catch (error) {
    //next(error);
  }
});

commentRouter.delete('/comments/:commentId', async (req: Request, res: Response) => {
  try {
     
    res.status(StatusCodes.OK).json({ success: true, data: commentController.deleteComment(req, res) });
  } catch (error) {
    //next(error);
  }
});

export default commentRouter;