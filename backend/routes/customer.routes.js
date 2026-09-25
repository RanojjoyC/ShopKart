import express from 'express'
import { registerCustomer, loginCustomer, profileCustomer, logoutCustomer, changePasswordCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registerCustomer)

customerRoutes.post('/login', loginCustomer)

customerRoutes.get('/me', isAuthenticated, profileCustomer)

customerRoutes.patch('/change-password', isAuthenticated, changePasswordCustomer)

customerRoutes.post('/logout', logoutCustomer)

export default customerRoutes
