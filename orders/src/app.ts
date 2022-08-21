import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from '@keisto/ticketbooth-common'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'
import { deleteOrderRouter } from './routes/delete'
import { newOrderRouter } from './routes/new'

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
app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

app.all('*', () => {
  throw new NotFoundError()
})

export { app }
