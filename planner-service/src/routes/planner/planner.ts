import express from 'express'
import { destinationRouter } from './destination/destination'
import { transportationRouter } from './transportation/transportation'
import {
  createPlanner,
  deletePlanner,
  getPlannerById,
  getPlanners,
  inviteIntoPlanner,
  updatePlanner,
} from '../../controllers/plannerController'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get('/', getPlanners)
plannerRouter.post('/', createPlanner)

plannerRouter.get('/:plannerId', getPlannerById)
plannerRouter.patch('/:plannerId', updatePlanner)
plannerRouter.delete('/:plannerId', deletePlanner)

plannerRouter.post('/:plannerId/invite', inviteIntoPlanner)

plannerRouter.use('/:plannerId/transportation', transportationRouter)
plannerRouter.use('/:plannerId/destination', destinationRouter)

export default plannerRouter
