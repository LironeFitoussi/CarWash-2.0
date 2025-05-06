import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

// Routes imports 
import healthRouter from './routes/health.routes'
import userRouter from './routes/user.routes'
import eventRouter from './routes/events'

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ credentials: true }))

// Test route
app.get('/', (req, res) => {
  res.send('API is running')
})

// Routes
app.use('/api/v1/health', healthRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1', eventRouter)

export default app


