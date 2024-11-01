import express from 'express'

import plannerRouter from './planner/planner'
import userRouter from './user'
import { voteRouter } from './vote'
import { commentRouter } from './comment'
import RequestUtils from '../utils/RequestUtils'

const router = express.Router()
router.use('/user', userRouter)
router.use('/planner', plannerRouter)
router.use('/vote', voteRouter)
router.use('/comment', commentRouter)

router.use(RequestUtils.mkSuccessResponse)

router.use('*', (req: express.Request, res: express.Response) => {
  if (!req.body.err) {
    res.status(404).json({
      success: false,
      data: 'Route not found',
    })
  }
})

export default router
