import mongoose from "mongoose"
import Customer from "../models/customer.models.js"
import Product from "../models/product.models.js"

// Adding Product to Wishlist 
export const addToWishlist = async (req, res) => {
    try{
        const { productId } = req.params

        if(!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json({message: "Invalid Product ID"})
        
        const product = await Product.findById(productId)
        if(!product)
        return res.status(404).json({message: "Product Not Found"})
        
        const alreadyExists = req.customer.wishlist.some((id) => id.toString() === productId)    
        if(alreadyExists)
        return res.status(409).json({message: "Product already added to wishlist"})

        // Add Product Reference
        req.customer.wishlist.push(productId)
        await req.customer.save() 
        
        return res.status(200).json({success: true, message: "Product Added To Wishlist"})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Removing From Wishlist 
export const removeFromWishlist = async (req, res) => {
    try{
        const { productId } = req.params 
        
        if(!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json({message: "Invalid Product ID"})
        
        const productIndex = req.customer.wishlist.findIndex((id) => id.toString() === productId)

        if(productIndex === -1)
        return res.status(404).json({message: "Product Not Found In Wishlist"})

        req.customer.wishlist.splice(productIndex, 1)
        await req.customer.save()

        return res.status(200).json({success: true, message: "Product Removed From Wishlist"})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Get Customers Wishlist 
export const getWishlist = async (req, res) => {
    try{
        const customer = await Customer.findById(req.customer._id).populate({
            path: "wishlist",
            select: "name price category image stock"
        })

        if(!customer)
        return res.status(404).json({message: "Customer Not Found"})
        
        return res.status(200).json({success: true, count: customer.wishlist.length, wishlist: customer.wishlist})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}