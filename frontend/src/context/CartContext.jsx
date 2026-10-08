import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { addToCart as addToCartApi, getCart, updateCartQuantity as updateCartItem, removeFromCart as removeCartItem } from "../services/cartApi.js"
import { useAuth } from "./AuthContext.jsx"

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { user } = useAuth()

    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionLoading, setActionLoading] = useState(null)

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

            setError(
                requestError.response?.data?.message ||
                "Unable to load cart."
            )

            setCartItems([])

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
                success: true,
                data
            }

        }catch(requestError){
            const message =
                requestError.response?.data?.message ||
                "Unable to add product to cart."

            setError(message)

            return {
                success: false,
                message
            }

        }finally{
            setActionLoading(null)
        }
    }

    const updateQuantity = async (productId, quantity) => {
        try{
            setActionLoading(productId)
            setError("")

            const data = await updateCartItem(productId, quantity)
            setCartItems(data.cart || [])

            return {
                success: true,
                data
            }

        }catch(requestError){
            const message =
                requestError.response?.data?.message ||
                "Unable to update cart."

            setError(message)

            return {
                success: false,
                message
            }

        }finally{
            setActionLoading(null)
        }
    }

    const removeFromCart = async (productId) => {
        try{
            setActionLoading(productId)
            setError("")

            const data = await removeCartItem(productId)
            setCartItems(data.cart || [])

            return {
                success: true,
                data
            }

        }catch(requestError){
            const message =
                requestError.response?.data?.message ||
                "Unable to remove product."

            setError(message)

            return {
                success: false,
                message
            }

        }finally{
            setActionLoading(null)
        }
    }

    const clearCart = useCallback(() => {
        setCartItems([])
        setError("")
    }, [])

    // Derived values
    const totalItems = useMemo(() => {
        return cartItems.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        )
    }, [cartItems])

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (total, item) =>
                total +
                Number(item.product?.price || 0) *
                Number(item.quantity || 0),
            0
        )
    }, [cartItems])

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
                refreshCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () =>
    useContext(CartContext)