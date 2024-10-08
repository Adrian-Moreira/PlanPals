import express from 'express'

import plannerRouter from './planner/planner'
import userRouter from './user'

const router = express.Router()

router.use('/user', userRouter)
router.use('/planner', plannerRouter)

export default router
