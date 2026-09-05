import express from 'express'
import { registerCustomer, loginCustomer } from '../controllers/customer.controller.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registerCustomer)

customerRoutes.post('/login', loginCustomer)

export default customerRoutes
