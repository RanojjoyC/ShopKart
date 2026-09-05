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
        return res.status(400).json({message: "Minimum assword length should be 6"})
       
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

        res.status(200).json({success: true, message: "Custoner registered successfully", customer: newCustomer})
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
        return res.status(404).json({message: "Custoer not found"})

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
