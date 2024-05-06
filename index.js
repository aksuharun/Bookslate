import express from 'express'
import userRouter from './routes/user.js' 
import './mongo-connection.js'

const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use(express.json())
app.use('/user', userRouter)

app.listen(port, console.log(`port is listening on http://localhost:${port}`))