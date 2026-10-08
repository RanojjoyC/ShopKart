import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { addToCart as addToCartApi, getCart, updateCartQuantity as updateCartQuantityApi, removeFromCart as removeFromCartApi } from "../services/cartApi.js"
import { useAuth } from "./AuthContext.jsx"

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { user } = useAuth()

    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionLoading, setActionLoading] = useState("")

    const refreshCart = useCallback(async () => {

        if(!user){
            setCartItems([])
            setLoading(false)
            return
        }
        try{
            setLoading(true)
            setError("")

            const data = await getCart()
            setCartItems(data.cart || [])
        }catch(requestError){
            console.error("Failed to load cart:", requestError)

            setCartItems([])
            setError("Unable to load your cart.")
        }finally{
            setLoading(false)
        }

    }, [user])

    useEffect(() => {
        refreshCart()
    }, [refreshCart])

    const addToCart = async (productId) => {
        try{
            setActionLoading(productId)
            setError("")

            const data = await addToCartApi(productId)
            setCartItems(data.cart || [])

            return {
                success: true
            }

        }catch(requestError){
            console.error("Failed to add product to cart:", requestError)

            return {
                success: false,
                message: requestError.response?.data?.message || "Unable to add product to cart."
            }

        }finally{
            setActionLoading("")
        }
    }


    const updateQuantity = async (productId, quantity) => {
        try{
            setActionLoading(productId)
            setError("")

            const data = await updateCartQuantityApi(productId, quantity)
            setCartItems(data.cart || [])

            return {
                success: true
            }

        }catch(requestError){
            console.error("Failed to update cart quantity:", requestError)

            return {
                success: false,
                message: requestError.response?.data?.message || "Unable to update quantity."
            }

        }finally{
            setActionLoading("")
        }
    }

    const removeFromCart = async (productId) => {
        try{
            setActionLoading(productId)
            setError("")

            const data = await removeFromCartApi(productId)
            setCartItems(data.cart || [])

            return {
                success: true
            }
        }catch(requestError){
            console.error("Failed to remove product from cart:", requestError)

            return {
                success: false,
                message: requestError.response?.data?.message || "Unable to remove product."
            }
        }finally{
            setActionLoading("")
        }
    }
    // Derived values
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

    const subtotal = cartItems.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                actionLoading,
                totalItems,
                subtotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                refreshCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () =>
    useContext(CartContext)