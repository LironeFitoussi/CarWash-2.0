import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

// Routes imports 
import healthRouter from './routes/health.routes'
import userRouter from './routes/user.routes'
import transactionRouter from './routes/transaction.routes'
import categoryRouter from './routes/category.routes'
import accountRouter from './routes/account.routes'
import budgetRouter from './routes/budget.routes'
import authRouter from './routes/auth.routes'

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ credentials: true }))

// Test route
app.get('/', (req, res) => {
  res.send('Expense Manager API is running')
})

// Routes
app.use('/api/v1/health', healthRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/transactions', transactionRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/accounts', accountRouter)
app.use('/api/v1/budgets', budgetRouter)

export default app


