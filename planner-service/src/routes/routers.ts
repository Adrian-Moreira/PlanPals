import express from 'express'

import plannerRouter from './planner/planner'
import userRouter from './user'
import { voteRouter } from './vote'
import { commentRouter } from './comment'

const router = express.Router()

router.use('/user', userRouter)
router.use('/planner', plannerRouter)
router.use('/vote', voteRouter)
router.use('/comment', commentRouter)

export default router
