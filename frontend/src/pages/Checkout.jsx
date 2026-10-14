import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import Navbar from "../components/Navbar.jsx"

import { useCart } from "../context/CartContext.jsx"

import { createPaymentOrder, verifyPayment } from "../services/orderApi.js"


const initialForm = {
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
}


function Checkout() {
    const navigate = useNavigate()
    const location = useLocation()
    const retryOrder = location.state?.retryOrder

    const { cartItems, loading: cartLoading, subtotal, clearCart, addToCart, updateQuantity, refreshCart } = useCart()
    const [restoringCart, setRestoringCart] = useState(false)

    useEffect(() => {
        if (
            retryOrder?.items?.length > 0 &&
            (!cartItems || cartItems.length === 0) &&
            !cartLoading &&
            !restoringCart
        ) {
            const restoreCartItems = async () => {
                setRestoringCart(true)
                try {
                    for (const item of retryOrder.items) {
                        const prodId = item.product?._id || item.product
                        if (prodId) {
                            await addToCart(prodId)
                            if (item.quantity > 1) {
                                await updateQuantity(prodId, item.quantity)
                            }
                        }
                    }
                    await refreshCart()
                } catch (err) {
                    console.error("Failed to restore cart from order:", err)
                } finally {
                    setRestoringCart(false)
                }
            }
            restoreCartItems()
        }
    }, [retryOrder, cartItems, cartLoading])

    const effectiveCartItems =
        cartItems && cartItems.length > 0
            ? cartItems
            : (retryOrder?.items || []).map((item) => ({
                  product: {
                      _id: item.product,
                      name: item.name,
                      price: item.price,
                      image: item.image
                  },
                  quantity: item.quantity
              }))

    const effectiveSubtotal =
        cartItems && cartItems.length > 0
            ? subtotal
            : (retryOrder?.totalAmount || 0)

    const [form, setForm] = useState(() => {
        if (retryOrder?.shippingAddress) {
            return {
                fullName: retryOrder.shippingAddress.fullName || "",
                phone: retryOrder.shippingAddress.phone || "",
                addressLine1: retryOrder.shippingAddress.addressLine1 || "",
                city: retryOrder.shippingAddress.city || "",
                state: retryOrder.shippingAddress.state || "",
                pincode: retryOrder.shippingAddress.pincode || ""
            }
        }
        return initialForm
    })
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [placingOrder, setPlacingOrder] = useState(false)
    const [paymentFailure, setPaymentFailure] = useState(null)
    const failureBannerRef = useRef(null)

    useEffect(() => {
        if (paymentFailure && failureBannerRef.current) {
            failureBannerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }
    }, [paymentFailure])

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((previous) => ({
            ...previous,
            [name]: value
        }))

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }))

        setError("")
        setPendingOrder(null)
    }


    const validateForm = () => {
        const errors = {}

        if (!form.fullName.trim()) {
            errors.fullName =
                "Full name is required."
        }

        if (!form.phone.trim()) {
            errors.phone =
                "Phone number is required."
        } else if (
            !/^[0-9]{10}$/.test(
                form.phone.trim()
            )
        ) {
            errors.phone =
                "Phone must contain 10 digits."
        }


        if (!form.addressLine1.trim()) {
            errors.addressLine1 =
                "Address is required."
        }


        if (!form.city.trim()) {
            errors.city =
                "City is required."
        }


        if (!form.state.trim()) {
            errors.state =
                "State is required."
        }


        if (!form.pincode.trim()) {
            errors.pincode =
                "Pincode is required."
        } else if (
            !/^[0-9]{6}$/.test(
                form.pincode.trim()
            )
        ) {
            errors.pincode =
                "Pincode must contain 6 digits."
        }


        setFieldErrors(errors)

        return (
            Object.keys(errors).length === 0
        )
    }


    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (
                window.Razorpay
            ) {
                resolve(true)
                return
            }


            const script =
                document.createElement(
                    "script"
                )

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js"

            script.onload = () =>
                resolve(true)

            script.onerror = () =>
                resolve(false)

            document.body.appendChild(
                script
            )
        })
    }


    const handlePlaceOrder = async () => {
        setError("")
        setPaymentFailure(null)

        if (!validateForm()) {
            return
        }

        if (restoringCart) {
            setError("Restoring your cart items from order, please wait a moment...")
            return
        }

        if (!effectiveCartItems || effectiveCartItems.length === 0) {
            setError("Your cart is empty.")
            return
        }

        try {
            setPlacingOrder(true)
            const scriptLoaded = await loadRazorpayScript()

            if (!scriptLoaded) {
                const loadErrorMsg = "Unable to load Razorpay Checkout. Please check your internet connection."
                setError(loadErrorMsg)
                setPaymentFailure({
                    title: "Gateway Unavailable",
                    message: loadErrorMsg,
                    reason: "script_load_failed"
                })
                setPlacingOrder(false)
                return
            }

            // Always create a fresh order on checkout/retry to ensure clean Razorpay state
            const orderData = await createPaymentOrder(form)

            const launchRazorpayModal = (currentOrder) => {
                const options = {
                    key: currentOrder.key,
                    amount: currentOrder.amount,
                    currency: currentOrder.currency,
                    name: "ShopKart",
                    description: "ShopKart Order",
                    order_id: currentOrder.razorpayOrderId,

                    handler: async function (response) {
                        try {
                            const result = await verifyPayment({
                                shopKartOrderId: currentOrder.shopKartOrderId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })

                            if (result.success) {
                                setPaymentFailure(null)
                                clearCart()
                                navigate(`/orders/${currentOrder.shopKartOrderId}`)
                            }
                        } catch (verificationError) {
                            console.error("Payment verification failed:", verificationError)
                            const verifyMsg =
                                verificationError.response?.data?.message ||
                                "Payment verification failed. Your cart has not been cleared."

                            setError(verifyMsg)
                            setPaymentFailure({
                                title: "Payment Verification Failed",
                                message: verifyMsg,
                                reason: "verification_error",
                                orderId: currentOrder.razorpayOrderId
                            })
                        } finally {
                            setPlacingOrder(false)
                        }
                    },

                    modal: {
                        ondismiss: function () {
                            setPlacingOrder(false)
                        }
                    },

                    prefill: {
                        name: form.fullName,
                        contact: form.phone
                    },

                    theme: {
                        color: "#111616"
                    }
                }

                const paymentObject = new window.Razorpay(options)

                paymentObject.on("payment.failed", function (response) {
                    console.error("Payment failed:", response.error)
                    const err = response?.error || {}
                    const failureReason =
                        err.description ||
                        err.reason ||
                        "Payment failed. Your cart has not been cleared. Please try again."

                    setError(failureReason)
                    setPaymentFailure({
                        title: "Payment Failed",
                        message: failureReason,
                        description: err.description,
                        reason: err.reason,
                        code: err.code,
                        paymentId: err.metadata?.payment_id,
                        orderId: err.metadata?.order_id || currentOrder.razorpayOrderId
                    })

                    setPlacingOrder(false)
                })

                paymentObject.open()
            }

            launchRazorpayModal(orderData)

        } catch (requestError) {
            console.error("Failed to process payment order:", requestError)
            const requestMsg =
                requestError.response?.data?.message ||
                "Unable to place your order. Please try again."

            setError(requestMsg)
            setPaymentFailure({
                title: "Payment Initiation Failed",
                message: requestMsg,
                reason: "order_creation_failed"
            })
            setPlacingOrder(false)
        }
    }


    if (cartLoading) {
        return (
            <div className="min-h-screen bg-[#edf1ef]">
                <Navbar />

                <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10">
                    <div className="rounded-[28px] bg-white p-12 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                        <p className="mt-4 text-sm font-semibold text-black/45">
                            Loading checkout...
                        </p>
                    </div>
                </main>
            </div>
        )
    }


    if (
        !effectiveCartItems ||
        effectiveCartItems.length === 0
    ) {
        return (
            <div className="min-h-screen bg-[#edf1ef] text-[#111616]">
                <Navbar />

                <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10">
                    <section className="rounded-[34px] bg-white p-12 text-center shadow-[0_20px_55px_rgba(31,45,45,0.08)]">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9ff45] text-2xl">
                            🛒
                        </div>

                        <h1 className="mt-5 text-3xl font-black">
                            Your cart is empty
                        </h1>

                        <p className="mt-2 text-sm text-black/45">
                            Add some products before checking out.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white"
                        >
                            Browse Products
                        </button>
                    </section>
                </main>
            </div>
        )
    }


    const inputClass =
        "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#111616]"


    const errorClass =
        "mt-1 text-xs font-semibold text-red-600"


    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">
            <Navbar />

            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                <section className="rounded-[34px] bg-[#f8faf7] px-6 py-8 shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10 sm:py-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                        Complete your purchase
                    </p>

                    <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                        Checkout
                    </h1>
                </section>


                {/* Retrying Order Notice */}
                {retryOrder && !paymentFailure && (
                    <section className="mt-6 rounded-[28px] border-2 border-amber-300 bg-amber-50 p-6 shadow-[0_12px_30px_rgba(245,158,11,0.08)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-200 text-amber-900 text-xl font-black">
                                    ↺
                                </div>
                                <div>
                                    <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900">
                                        Retrying Payment
                                    </span>
                                    <h2 className="mt-1 text-lg font-black text-[#111616]">
                                        Order #{retryOrder._id}
                                    </h2>
                                    <p className="mt-0.5 text-sm font-semibold text-black/60">
                                        {restoringCart
                                            ? "Restoring your cart items from this order..."
                                            : "Your order items and shipping details have been loaded. Click 'Complete Payment' to open payment."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={placingOrder || restoringCart}
                                className="shrink-0 rounded-2xl bg-[#111616] px-6 py-3.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(17,22,22,0.18)] transition hover:bg-black hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                            >
                                {placingOrder ? "Opening Payment..." : "Complete Payment"}
                            </button>
                        </div>
                    </section>
                )}


                {/* Payment Failed Banner with Retry Option */}
                {paymentFailure && (
                    <section
                        ref={failureBannerRef}
                        role="alert"
                        aria-live="assertive"
                        className="mt-6 overflow-hidden rounded-[30px] border-2 border-red-200 bg-white p-6 shadow-[0_16px_40px_rgba(239,68,68,0.12)] sm:p-8"
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 sm:h-14 sm:w-14">
                                    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-700">
                                            Payment Failed
                                        </span>
                                        {paymentFailure.code && (
                                            <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-bold text-black/50">
                                                {paymentFailure.code}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-2 text-xl font-black text-[#111616] sm:text-2xl">
                                        {paymentFailure.title || "Payment Unsuccessful"}
                                    </h2>

                                    <p className="mt-1 text-sm font-semibold text-black/60 sm:text-base">
                                        {paymentFailure.message || "Your payment could not be processed. Don't worry, your cart items are safe and no funds were deducted."}
                                    </p>

                                    {paymentFailure.paymentId && (
                                        <p className="mt-2 font-mono text-xs text-black/45">
                                            Transaction ID: {paymentFailure.paymentId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPaymentFailure(null)}
                                aria-label="Dismiss payment failed alert"
                                className="self-end rounded-xl p-2 text-black/35 hover:bg-black/5 hover:text-black transition sm:self-start cursor-pointer"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/5 pt-5">
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition hover:bg-red-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                {placingOrder ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Opening Payment...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Retry Payment
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentFailure(null)}
                                className="rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm font-black text-[#111616] hover:bg-black/5 transition cursor-pointer"
                            >
                                Edit Shipping Details
                            </button>
                        </div>
                    </section>
                )}

                {/* General Error Banner (only if not paymentFailure to prevent duplicate banners) */}
                {error && !paymentFailure && (
                    <section className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-5">
                        <p className="text-sm font-bold text-red-700">
                            {error}
                        </p>
                    </section>
                )}


                <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                    <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(31,45,45,0.06)] sm:p-8">

                        <h2 className="text-2xl font-black">
                            Shipping Details
                        </h2>


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label className="text-sm font-extrabold">
                                    Full Name
                                </label>

                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter your full name"
                                />

                                {fieldErrors.fullName && (
                                    <p className={errorClass}>
                                        {fieldErrors.fullName}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="text-sm font-extrabold">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    className={inputClass}
                                    placeholder="10 digit phone number"
                                />

                                {fieldErrors.phone && (
                                    <p className={errorClass}>
                                        {fieldErrors.phone}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="text-sm font-extrabold">
                                    Pincode
                                </label>

                                <input
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    className={inputClass}
                                    placeholder="6 digit pincode"
                                />

                                {fieldErrors.pincode && (
                                    <p className={errorClass}>
                                        {fieldErrors.pincode}
                                    </p>
                                )}
                            </div>


                            <div className="sm:col-span-2">
                                <label className="text-sm font-extrabold">
                                    Address
                                </label>

                                <input
                                    name="addressLine1"
                                    value={form.addressLine1}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="House number, street, area"
                                />

                                {fieldErrors.addressLine1 && (
                                    <p className={errorClass}>
                                        {fieldErrors.addressLine1}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="text-sm font-extrabold">
                                    City
                                </label>

                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="City"
                                />

                                {fieldErrors.city && (
                                    <p className={errorClass}>
                                        {fieldErrors.city}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="text-sm font-extrabold">
                                    State
                                </label>

                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="State"
                                />

                                {fieldErrors.state && (
                                    <p className={errorClass}>
                                        {fieldErrors.state}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>


                    <aside className="h-fit rounded-[30px] bg-[#111616] p-6 text-white shadow-[0_20px_55px_rgba(31,45,45,0.14)] sm:p-8">

                        <h2 className="text-2xl font-black">
                            Order Summary
                        </h2>


                        <div className="mt-6 space-y-4">
                            {effectiveCartItems.map(
                                (item) => (
                                    <div
                                        key={
                                            item.product?._id
                                        }
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <img
                                                src={
                                                    item.product?.image
                                                }
                                                alt={
                                                    item.product?.name
                                                }
                                                className="h-12 w-12 rounded-xl object-cover"
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold">
                                                    {
                                                        item.product?.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs font-semibold text-white/45">
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <p className="shrink-0 text-sm font-black">
                                            ₹
                                            {(
                                                Number(
                                                    item.product?.price ||
                                                    0
                                                ) *
                                                Number(
                                                    item.quantity ||
                                                    0
                                                )
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>


                        <div className="mt-6 border-t border-white/10 pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white/50">
                                    Total
                                </span>

                                <span className="text-2xl font-black">
                                    ₹
                                    {Number(
                                        effectiveSubtotal
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder || restoringCart}
                            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                                paymentFailure
                                    ? "bg-red-600 text-white hover:bg-red-700 shadow-[0_10px_25px_rgba(220,38,38,0.3)] cursor-pointer"
                                    : "bg-[#d9ff45] text-[#111616] cursor-pointer"
                            }`}
                        >
                            {placingOrder ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Opening Payment...
                                </>
                            ) : paymentFailure ? (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Retry Payment
                                </>
                            ) : retryOrder ? (
                                "Complete Payment"
                            ) : (
                                "Place Order"
                            )}
                        </button>

                        {paymentFailure && (
                            <p className="mt-3 text-center text-xs font-semibold text-red-400">
                                Previous payment attempt failed. Click to retry.
                            </p>
                        )}

                        <p className="mt-4 text-center text-xs leading-5 text-white/35">
                            You will be redirected to Razorpay Test Checkout.
                        </p>

                    </aside>

                </section>

            </main>
        </div>
    )
}


export default Checkout