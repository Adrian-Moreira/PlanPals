import express from 'express'

import plannerRouter from './planner'

const router = express.Router()

router.use('/planner', plannerRouter)

export default router
