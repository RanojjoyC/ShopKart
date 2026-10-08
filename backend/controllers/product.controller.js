import mongoose from 'mongoose'
import Product from "../models/product.models.js"

// Product Creation Controller
export const createProduct = async (req, res) => {
    try{
        const { name, description, price, category, image, stock } = req.body 

        if(!name || !description || price === undefined || !category || !image || stock === undefined)
        return res.status(400).json({message: "All product fields are required"})

        if(Number(price) <= 0)
        return res.status(400).json({message: "Invalid Price"})

        if(Number(stock) < 0)
        return res.status(400).json({message: "Invalid Stock"})

        const product = await Product.create({
            name, 
            description,
            price,
            category,
            image,
            stock
        })

        return res.status(201).json({message: "Product Created Successfully!", success: true, product})
    }catch(error){
        if (error.name === "ValidationError")
        return res.status(400).json({message: error.message})
        
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

// Search + Retrieve Products
export const getProducts = async (req, res) => {
    try{
        const { search, category, sort } = req.query
        const query = {}

        if(search?.trim()){
            query.name = {
                $regex: search.trim(),
                $options: 'i'
            }
        }

        if(category?.trim())
        query.category = category.trim()
    
        let productQuery = Product.find(query).select("name description price category image stock createdAt")

        if(sort === "price_asc")
        productQuery = productQuery.sort({price: 1})
        else if(sort === "price_desc")
        productQuery = productQuery.sort({price: -1})

        const products = await productQuery

        return res.status(200).json({success: true, count: products.length, products})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

// One Product Using MongoDB _id
export const getProductById = async (req, res) => {
    try{
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid Product ID"})

        const product = await Product.findById(id).select("name description price category image stock createdAt")

        if(!product)
        return res.status(404).json({message: "Product Not Found"})
        
        return res.status(200).json({success: true, product})
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}