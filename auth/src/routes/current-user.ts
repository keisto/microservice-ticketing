import express, { Request, Response } from 'express'
import { currentUser } from '@keisto/ticketbooth-common'
// import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.get(
  '/api/users/current',
  currentUser,
  // requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null })
  }
)

export { router as currentUserRouter }
