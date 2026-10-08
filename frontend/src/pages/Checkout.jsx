import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

    const {
        cartItems,
        loading: cartLoading,
        subtotal,
        clearCart
    } = useCart()


    const [form, setForm] =
        useState(initialForm)

    const [error, setError] =
        useState("")

    const [fieldErrors, setFieldErrors] =
        useState({})

    const [placingOrder, setPlacingOrder] =
        useState(false)


    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target

        setForm((previous) => ({
            ...previous,
            [name]: value
        }))

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }))

        setError("")
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


        if (!validateForm()) {
            return
        }


        if (
            !cartItems ||
            cartItems.length === 0
        ) {
            setError(
                "Your cart is empty."
            )

            return
        }


        try {
            setPlacingOrder(true)


            const scriptLoaded =
                await loadRazorpayScript()


            if (!scriptLoaded) {
                setError(
                    "Unable to load Razorpay Checkout. Please try again."
                )

                return
            }


            const data =
                await createPaymentOrder(
                    form
                )


            const options = {
                key: data.key,

                amount:
                    data.amount,

                currency:
                    data.currency,

                name:
                    "ShopKart",

                description:
                    "ShopKart Order",

                order_id:
                    data.razorpayOrderId,


                handler:
                    async function (
                        response
                    ) {
                        try {
                            const result =
                                await verifyPayment({
                                    shopKartOrderId:
                                        data.shopKartOrderId,

                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature
                                })


                            if (
                                result.success
                            ) {
                                clearCart()

                                navigate(
                                    `/orders/${data.shopKartOrderId}`
                                )
                            }

                        } catch (
                        verificationError
                        ) {
                            console.error(
                                "Payment verification failed:",
                                verificationError
                            )

                            setError(
                                verificationError
                                    .response
                                    ?.data
                                    ?.message ||
                                "Payment verification failed. Your cart has not been cleared."
                            )
                        } finally {
                            setPlacingOrder(
                                false
                            )
                        }
                    },


                prefill: {
                    name:
                        form.fullName,

                    contact:
                        form.phone
                },


                theme: {}
            }


            const paymentObject =
                new window.Razorpay(
                    options
                )


            paymentObject.on(
                "payment.failed",
                function (
                    response
                ) {
                    console.error(
                        "Payment failed:",
                        response.error
                    )

                    setError(
                        "Payment failed. Your cart has not been cleared. Please try again."
                    )

                    setPlacingOrder(
                        false
                    )
                }
            )


            paymentObject.open()

        } catch (requestError) {
            console.error(
                "Failed to create payment order:",
                requestError
            )

            setError(
                requestError.response
                    ?.data?.message ||
                "Unable to place your order. Please try again."
            )

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
        !cartItems ||
        cartItems.length === 0
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


                {error && (
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
                            {cartItems.map(
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
                                        subtotal
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={
                                handlePlaceOrder
                            }
                            disabled={
                                placingOrder
                            }
                            className="mt-7 flex w-full items-center justify-center rounded-2xl bg-[#d9ff45] px-5 py-4 text-sm font-black text-[#111616] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {placingOrder
                                ? "Opening Payment..."
                                : "Place Order"}
                        </button>


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