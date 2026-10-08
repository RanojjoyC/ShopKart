import mongoose from "mongoose"
import Wishlist from "../models/wishlist.models.js"
import Product from "../models/product.models.js"

// Adding Product to Wishlist 
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid Product ID" })

        const product = await Product.findById(productId)
        if (!product)
            return res.status(404).json({ message: "Product Not Found" })

        // Find or create the wishlist document for this customer
        let wishlist = await Wishlist.findOne({ customer: req.customer._id })

        if (!wishlist) {
            wishlist = await Wishlist.create({ customer: req.customer._id, products: [productId] })
            return res.status(200).json({ success: true, message: "Product Added To Wishlist" })
        }

        const alreadyExists = wishlist.products.some((id) => id.toString() === productId)
        if (alreadyExists)
            return res.status(409).json({ message: "Product already added to wishlist" })

        wishlist.products.push(productId)
        await wishlist.save()

        return res.status(200).json({ success: true, message: "Product Added To Wishlist" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error })
    }
}

// Removing From Wishlist 
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid Product ID" })

        const wishlist = await Wishlist.findOne({ customer: req.customer._id })

        if (!wishlist)
            return res.status(404).json({ message: "Wishlist Not Found" })

        const productIndex = wishlist.products.findIndex((id) => id.toString() === productId)

        if (productIndex === -1)
            return res.status(404).json({ message: "Product Not Found In Wishlist" })

        wishlist.products.splice(productIndex, 1)
        await wishlist.save()

        return res.status(200).json({ success: true, message: "Product Removed From Wishlist" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error })
    }
}

// Get Customers Wishlist 
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ customer: req.customer._id }).populate({
            path: "products",
            select: "name price category image stock"
        })

        if (!wishlist)
            return res.status(200).json({ success: true, count: 0, wishlist: [] })

        return res.status(200).json({ success: true, count: wishlist.products.length, wishlist: wishlist.products })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error })
    }
}