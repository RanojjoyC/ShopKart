import Customer from '../models/customer.models.js'
import bcrypt from 'bcrypt'
import { genToken } from '../utils/generateToken.js'

// Register
export const registerCustomer = async (req, res) => {
    try{
        const {fullName, email, password, phone} = req.body

        // all input fields present or not
        if(!phone || !email || !password || !fullName)
        return res.status(400).json({message: "All fields are required"})
        
         // password strength 
        if(password.length < 6)
        return res.status(400).json({message: "Password must be at least 6 characters"})
       
        // if EMAIL already exists
        const existingEmail = await Customer.findOne({email})
        if(existingEmail)
        return res.status(409).json({message: "An existing customer with the same email already exists"})
    
        // Password Security 
        const salt  = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newCustomer = await Customer.create({
            fullName, 
            email, 
            password: hashedPassword,
            phone,
        })

        const token = genToken(newCustomer._id)
        res.cookie("token", token, {httpOnly: true})

        res.status(201).json({success: true, message: "Customer registered successfully", customer: {_id: newCustomer._id, fullName: newCustomer.fullName, email: newCustomer.email, phone: newCustomer.phone}})
    }catch(error){
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Login
export const loginCustomer = async (req, res) => {
    try{
        const {email, password} = req.body 
        const customer = await Customer.findOne({email})

        if(!customer)
        return res.status(404).json({message: "Customer not found"})

        const same = await bcrypt.compare(password, customer.password)
        if(!same)
        return res.status(401).json({message: "Invalid credentials"})
        
        const token = genToken(customer._id)
        res.cookie("token", token, {httpOnly: true})

        return res.status(200).json({success: true, message: "Login successful"})
    }catch(error){
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Customer Profile
export const profileCustomer = async (req, res) => {
    try{
        return res.status(200).json({_id: req.customer._id, fullName: req.customer.fullName, email: req.customer.email, phone: req.customer.phone})
    }catch(error){
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Change Password
export const changePasswordCustomer = async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body
        
        // check old and new 
        if(!oldPassword || !newPassword)
        return res.status(400).json({message: "Old password and new password are required"})
        
        // check password strength
        if(newPassword.length < 6)
        return res.status(400).json({message: "New password must be at least 6 characters"})

        // match old password
        const same = await bcrypt.compare(oldPassword, req.customer.password)
        if(!same)
        return res.status(401).json({message: "Old password is incorrect"})

        // hashing new password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // update password
        req.customer.password = hashedPassword
        await req.customer.save()

        return res.status(200).json({success: true, message: "Password changed successfully"})

    }catch(error){
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Logout 
export const logoutCustomer = async (req, res) => {
    try{
        res.clearCookie("token")
        return res.status(200).json({success: true, message: "Logged out successfully"})
    }catch(error){
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}
