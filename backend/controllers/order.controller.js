import mongoose from "mongoose"
import crypto from "node:crypto"

import Order from "../models/order/models.js"
import Product from "../models/product.models.js"
import Customer from "../models/customer.models.js"

import { getRazorpay } from "../config/razorpay.js"

// Shipping Address Verification
const validateShippingAddress = (shippingAddress) => {
    if (!shippingAddress || typeof shippingAddress !== "object")
        return "Shipping Address is Required"

    const requiredFields = [
        "fullName",
        "phone",
        "addressLine1",
        "city",
        "state",
        "pincode"
    ]

    for (const field of requiredFields) {
        if (typeof shippingAddress[field] !== "string" || !shippingAddress[field].trim())
            return `${field} is required`

        if (!/^[0-9]{10}$/.test(shippingAddress.phone.trim()))
            return "Pincode Must Contain 6 Digits"
    }
    return ""
}

// Payment Creation 
export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body

        const shippingError = validateShippingAddress(shippingAddress)

        if (shippingError)
            return res.status(400).json({ success: false, message: shippingError })

        const customer = await Customer.findById(req.customer._id)
        if (!customer)
            return res.status(404).json({ message: "Customer Not Found" })

        if (!customer.cart || customer.cart.length === 0)
            return res.status(400).json({ success: false, message: "Your cart is empty" })

        const orderItems = []
        let totalAmount = 0

        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product)

            if (!product)
                return res.status(400).json({ success: false, message: "A product in your cart is no longer available" })

            if (cartItem.quantity > product.stock)
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` })

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })

            totalAmount += Number(product.price) * cartItem.quantity
        }
        totalAmount = Number(totalAmount.toFixed(2))

        const shopKartOrder = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName:
                    shippingAddress.fullName.trim(),
                phone:
                    shippingAddress.phone.trim(),
                addressLine1:
                    shippingAddress.addressLine1.trim(),
                city:
                    shippingAddress.city.trim(),
                state:
                    shippingAddress.state.trim(),
                pincode:
                    shippingAddress.pincode.trim()
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        })

        try {
            const razorpay = getRazorpay()

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: shopKartOrder._id.toString()
            })
            shopKartOrder.razorpayOrderId = razorpayOrder.id
            await shopKartOrder.save()

            return res.status(201).json({
                success: true, shopKartOrderId: shopKartOrder._id,
                razorpayOrderId: razorpayOrder._id, amount: razorpayOrder.amount,
                currency: razorpayOrder.currency, key: process.env.RAZORPAY_KEY_ID
            })
        } catch (razorpayError) {
            await Order.findByIdAndDelete(shopKartOrder._id)

            console.error("Razorpay order creation failed:", razorpayError)

            return res.status(500).json({ success: false, message: "Unable to create payment order. Please try again." })
        }
    } catch (error) {
        console.error("Create payment order failed:", error)

        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// Payment Verification
export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if(!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        return res.status(400).json({success: false, message: "Payment verification data is incomplete"})


        if(!mongoose.Types.ObjectId.isValid(shopKartOrderId))
        return res.status(400).json({success: false, message: "Invalid ShopKart Order ID"})
        
        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.customer._id
        })

        if(!order)
        return res.status(404).json({success: false, message: "Order Not Found"})


        if(!order.razorpayOrderId)
        return res.status(400).json({success: false, message: "Razorpay order is not available"})

        if(order.razorpayOrderId !== razorpay_order_id)
        return res.status(400).json({success: false, message: "Razorpay Order ID does not match"})
        
        if(order.paymentStatus === "PAID") 
        return res.status(200).json({success: true, message: "Payment already verified", order})
        
        const body = `${order.razorpayOrderId}|${razorpay_payment_id}`

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex")

        if(expectedSignature !== razorpay_signature){
            order.paymentStatus = "FAILED"
            await order.save()

            return res.status(400).json({success: false, message: "Invalid payment signature"})
        }
        order.paymentStatus = "PAID"
        order.status = "PLACED"
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        const customer = await Customer.findById(req.customer._id)

        if(!customer)
        return res.status(404).json({success: false, message: "Customer Not Found"})
        
        customer.cart = []
        await customer.save()

        return res.status(200).json({success: true, message: "Payment verified and order placed successfully", order})
    }catch (error){
        console.error("Payment verification failed:", error)

        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// Get all orders belonging to authenticated customer
export const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({user: req.customer._id}).sort({createdAt: -1}).select("items totalAmount paymentStatus status createdAt")
        
        return res.status(200).json({success: true, orders})
    }catch(error){
        console.error("Get orders failed:", error)

        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// Get one order belonging to authenticated customer
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({success: false, message: "Invalid Order ID"})

        const order = await Order.findOne({_id: id, user: req.customer._id})

        if(!order) 
        return res.status(404).json({success: false, message: "Order Not Found"})
        
        return res.status(200).json({success: true, order})
    }catch(error){
        console.error("Get order failed:", error)

        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}