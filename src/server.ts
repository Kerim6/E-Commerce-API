import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env, isTestEnv } from '../env.ts'
import morgan from 'morgan'
import authRoutes from './modules/auth/authRoutes.ts'
import categoryRoutes from './modules/categories/categoryRoutes.ts'
import productRoutes from './modules/products/productRoutes.ts'
import cartRoutes from './modules/carts/cartRoute.ts'
import orderRoutes from './modules/orders/orderRoute.ts'
import { AppError } from './errors/AppError.ts'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan('dev', {
    skip: () => isTestEnv(),
  }),
)

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'OK', timestamp: new Date(), service: 'E-Commerce API' })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/items', cartRoutes)
app.use('/api/v1/orders', orderRoutes)

app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message })
    }

    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }

    return res.status(500).json({ message: 'Internal server error' })
  },
)

export { app }
export default app
