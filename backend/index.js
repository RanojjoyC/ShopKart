import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'node:dns'
import cookieParser from 'cookie-parser'

import customerRoutes from './routes/customer.routes.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = 7777

dotenv.config()

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

app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`)
})