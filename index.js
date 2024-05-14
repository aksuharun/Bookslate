import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'


import userRouter from './routes/user.js'
import bookRouter from './routes/book.js'
import authRouter from './routes/auth.js'

import './mongo-connection.js'


dotenv.config()

const app = express()
const port = 3000

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

app.listen(port, console.log(`port is listening on http://localhost:${port}`))