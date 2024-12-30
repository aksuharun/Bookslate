import './config.js'

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import userRouter from './routes/user.js'
import bookRouter from './routes/book.js'
import authRouter from './routes/auth.js'
import errorHandler from './errors/error-handler.js'
import { NotFoundError } from './errors/api-errors.js'

import './mongo-connection.js'

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'pug')

app.use(cors())
app.use(express.json())
app.use(express.static('views'))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
	res.send('hello')
})

// 404 handler for undefined routes
app.use((req, res, next) => {
	next(new NotFoundError('Route not found'))
})

// Global error handler
app.use((err, req, res, next) => {
	errorHandler(err, req, res)
})

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => console.log(`port is listening on http://localhost:${port}`))
}

export default app