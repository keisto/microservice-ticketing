import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { loginRouter } from './routes/login'
import { logoutRouter } from './routes/logout'
import { registerRouter } from './routes/register'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
)

// Routes
app.use(currentUserRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(registerRouter)

app.all('*', () => {
  throw new NotFoundError()
})

// Middleware
app.use(errorHandler)

export { app }
