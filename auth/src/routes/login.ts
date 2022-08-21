import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Password } from '../services/password'
import { validateRequest, BadRequestError } from '@keisto/ticketbooth-common'

const router = express.Router()

router.post(
  '/api/users/login',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password').trim().notEmpty().withMessage('Password is required.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials.')
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials.')
    }

    req.session = {
      jwt: jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY!
      ),
    }

    res.status(200).send(existingUser)
  }
)

export { router as loginRouter }
