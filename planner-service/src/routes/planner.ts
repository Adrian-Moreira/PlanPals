import express, { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
// import { createPlanner, getPlannersByUserId } from '../controllers/plannerController'
import { destinationRouter } from './destination'

import { transportationRouter } from './transportation'
import { joinPlanner, createPlanner, getPlannersByUserId } from '../controllers/plannerController';

const plannerRouter = express.Router({ mergeParams: true })
plannerRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     

     // Call the service function to get planners by user ID
     const result = await getPlannersByUserId(req,res);

     // Log the result for debugging purposes
     console.log('Result:', result);

     // Return the result with a success status
      res.status(StatusCodes.OK).json({ success: true, data: result });
   } catch (error) {
     // Pass any error to the error handler middleware
     next(error);
   }
 },
);


plannerRouter.get('/planner', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPlannersByUserId(req, res);
    console.log(result, '.get /planner LOGG');
    res.status(StatusCodes.OK).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});
// plannerRouter.get('/', getPlannersByUserId);

// plannerRouter.get('/planners/user/:userId', getPlannersByUserId);
// plannerRouter.get('/planner', getPlannersByUserId);

//plannerRouter.post('/planners/:planId/user/:userId/join', joinPlanner);

// Route to join an existing planner
// plannerRouter.put('/planners/:planId/join', joinPlanner);  // PUT for updating planner


// plannerRouter.post(
//   '/',
//   async (req: Request, res: Response, next: NextFunction) => {
//     const {
//       createdBy,
//       startDate,
//       endDate,
//       roUsers,
//       rwUsers,
//       name,
//       description,
//       destinations,
//       transportations,
//     } = req.body
//     try {
//       const result = await createPlanner(req, res);
//       res.status(StatusCodes.CREATED).json({ success: true, ...result })
//       console.log(result, 'createddddddddddddd')
//     } catch (error) {
//       next(error)
//     }
//   },
// )

plannerRouter.post('/', async (req, res, next) => {
  try {
    const result = await createPlanner(req, res);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    next(error);
  }
});

plannerRouter.use('/:plannerId/transportation', transportationRouter)
plannerRouter.use('/:plannerId/destination', destinationRouter)

export default plannerRouter
