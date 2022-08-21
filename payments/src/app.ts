import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from '@keisto/ticketbooth-common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
)

// Middleware
app.use(currentUser)
app.use(errorHandler)

// Routes
app.use(createChargeRouter)

app.all('*', () => {
  throw new NotFoundError()
})

export { app }
