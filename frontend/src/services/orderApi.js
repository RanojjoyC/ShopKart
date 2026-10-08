import api from "./api.js"

export const createPaymentOrder = async (shippingAddress) => {
    const response =await api.post("/orders/create-payment-order", {shippingAddress})

    return response.data
}

export const verifyPayment = async (paymentData) => {
    const response = await api.post("/orders/verify-payment", paymentData)

    return response.data
}

export const getOrders = async () => {
    const response = await api.get("/orders")

    return response.data
}

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`)

    return response.data
}