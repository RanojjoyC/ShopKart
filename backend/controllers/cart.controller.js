import mongoose from "mongoose"
import Customer from "../models/customer.models.js"
import Product from "../models/product.models.js"

// Adding Product to Cart 
export const addToCart = async (req, res) => {
    try{
        const { productId } = req.params 
        
        if(!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json({message: "Invalid Product ID"})

        const product = await Product.findById(productId)

        if(!product)
        return res.status(404).json({message: "Product Not Found"})

        const cartItem = req.customer.cart.find((item) => item.product.toString() === productId)
        if(cartItem){
            const newQuantity = cartItem.quantity + 1
            if(newQuantity > product.stock)
            return res.status(400).json({message: "Requested Quantity Exceeds Available Stock"})

            cartItem.quantity = newQuantity
        }else{
            if(product.stock < 1)
            return res.status(400).json({message: "Product Is Out Of Stock"})

            req.customer.cart.push({
                product: productId,
                quantity: 1 
            })
        }

        await req.customer.save()

        const customer = await Customer.findById(req.customer._id).populate({
            path: "cart.product",
            select: "name price image category stock"
        })

        return res.status(200).json({success: true, message: "Cart Updated", cart: customer.cart})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// Fetch User Cart 
export const getCart = async (req, res) => {
    try{
        const customer = await Customer.findById(req.customer._id)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        if(!customer)
        return res.status(404).json({message: "Customer Not Found"})

        return res.status(200).json({success: true, cart: customer.cart})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

// Update Product Quantity
export const updateCartQuantity = async (req, res) => {
    try{
        const { productId } = req.params
        const { quantity } = req.body

        if(!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json({message: "Invalid Product ID"})

        if(typeof quantity !== "number" || !Number.isInteger(quantity))
        return res.status(400).json({message: "Quantity must be a number"})

        if(quantity < 1)
        return res.status(400).json({message: "Quantity must be at least 1"})

        const product = await Product.findById(productId)

        if(!product)
        return res.status(404).json({message: "Product Not Found"})
        
        if(quantity > product.stock)
        return res.status(400).json({message: "Requested quantity exceeds available stock"})

        const cartItem = req.customer.cart.find((item) => item.product.toString() === productId)
        if(!cartItem)
        return res.status(404).json({message: "Product Not Found In Cart"})

        cartItem.quantity = quantity
        await req.customer.save()

        const customer = await Customer.findById(req.customer._id)
            .populate({
                path: "cart.product",
                select: "name price image category stock"
            })

        return res.status(200).json({success: true, message: "Cart quantity updated", cart: customer.cart})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

// Remove Product From Cart 
export const removeFromCart = async (req, res) => {
    try{
        const { productId } = req.params 

        if(!mongoose.Types.ObjectId.isValid(productId))
        return res.status(400).json({message: "Invalid Product ID"})
        
        const cartItemIndex  = req.customer.cart.findIndex((item) => item.product.toString() === productId)
        if(cartItemIndex === -1)
        return res.status(404).json({message: "Product Not Found In Cart"})

        req.customer.cart.splice(cartItemIndex, 1)
        await req.customer.save()

        const customer = await Customer.findById(req.customer._id).populate({
            path: "cart.product",
            select: "name price image category stock"
        })

        return res.status(200).json({success: true, message: "Product Removed From Cart", cart: customer.cart})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}