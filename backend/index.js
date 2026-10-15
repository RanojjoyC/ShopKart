import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'node:dns'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from "./routes/order.routes.js"

const app = express()

// Trust proxy for Render deployment to handle secure cookies over HTTPS
app.set("trust proxy", 1)

const allowedOrigins = [
  'https://shop-kart-lovat-seven.vercel.app/',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 7777

dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connection to DB Established")
}).catch((error) => {
    console.log(error)
})

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use("/orders", orderRoutes)

app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`)
})