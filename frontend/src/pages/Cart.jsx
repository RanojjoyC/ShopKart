import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar.jsx"
import CartItem from "../components/CartItem.jsx"

import { useCart } from "../context/CartContext.jsx"


function Cart() {
    const navigate = useNavigate()

    const {
        cartItems,
        loading,
        error,
        actionLoading,
        totalItems,
        subtotal,
        updateQuantity,
        removeFromCart,
        refreshCart
    } = useCart()


    const handleUpdateQuantity = async (
        productId,
        quantity
    ) => {

        const result =
            await updateQuantity(
                productId,
                quantity
            )

        if (!result.success) {
            console.error(
                result.message
            )
        }
    }


    const handleRemove = async (
        productId
    ) => {

        const result =
            await removeFromCart(
                productId
            )

        if (!result.success) {
            console.error(
                result.message
            )
        }
    }


    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

            <Navbar />


            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                {/* Header */}
                <section className="overflow-hidden rounded-[34px] bg-[#f8faf7] px-6 py-8 shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10 sm:py-10">

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                        Your shopping bag
                    </p>

                    <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                        My Cart
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
                        Review your products, adjust quantities,
                        and see your order subtotal before checkout.
                    </p>

                </section>


                {/* Loading */}
                {loading && (
                    <section className="mt-10 rounded-[28px] bg-white p-10 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                        <p className="mt-4 text-sm font-semibold text-black/45">
                            Loading your cart...
                        </p>

                    </section>
                )}


                {/* Error */}
                {!loading && error && (
                    <section className="mt-10 rounded-[28px] border border-red-200 bg-red-50 p-10 text-center">

                        <h2 className="text-xl font-black text-red-700">
                            Unable to load your cart.
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={refreshCart}
                            className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                        >
                            Try Again
                        </button>

                    </section>
                )}


                {/* Empty */}
                {!loading &&
                    !error &&
                    cartItems.length === 0 && (
                        <section className="mt-10 rounded-[28px] bg-white p-12 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9ff45] text-2xl">
                                🛒
                            </div>

                            <h2 className="mt-5 text-2xl font-black">
                                Your cart is empty
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                                Looks like you haven't added
                                anything yet.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/products")
                                }
                                className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                            >
                                Browse Products
                            </button>

                        </section>
                    )}


                {/* Cart */}
                {!loading &&
                    !error &&
                    cartItems.length > 0 && (

                        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                            {/* Items */}
                            <div className="space-y-4">

                                <div className="mb-6">

                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                        Cart items
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                                        {totalItems}{" "}
                                        {totalItems === 1
                                            ? "item"
                                            : "items"}
                                    </h2>

                                </div>


                                {cartItems.map(
                                    (item) => (
                                        <CartItem
                                            key={
                                                item.product._id
                                            }
                                            item={item}
                                            onUpdateQuantity={
                                                handleUpdateQuantity
                                            }
                                            onRemove={
                                                handleRemove
                                            }
                                            loading={
                                                actionLoading ===
                                                item.product._id
                                            }
                                        />
                                    )
                                )}

                            </div>


                            {/* Order Summary */}
                            <aside className="h-fit rounded-[28px] bg-white p-6 shadow-[0_14px_35px_rgba(31,45,45,0.07)] lg:sticky lg:top-28">

                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                    Order Summary
                                </p>

                                <h2 className="mt-2 text-2xl font-black">
                                    Your total
                                </h2>


                                <div className="mt-6 space-y-4 border-y border-black/5 py-5">

                                    <div className="flex justify-between gap-4 text-sm">

                                        <span className="font-semibold text-black/45">
                                            Items
                                        </span>

                                        <span className="font-black">
                                            {totalItems}
                                        </span>

                                    </div>


                                    <div className="flex justify-between gap-4 text-sm">

                                        <span className="font-semibold text-black/45">
                                            Subtotal
                                        </span>

                                        <span className="font-black">
                                            ₹
                                            {subtotal.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div className="mt-5 flex items-end justify-between gap-4">

                                    <span className="text-sm font-bold text-black/45">
                                        Total
                                    </span>

                                    <span className="text-2xl font-black">
                                        ₹
                                        {subtotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="mt-6 w-full rounded-2xl bg-[#d9ff45] px-6 py-4 text-sm font-extrabold text-[#111616] transition hover:-translate-y-0.5"
                                >
                                    Proceed to Checkout
                                </button>

                            </aside>

                        </section>
                    )}

            </main>

        </div>
    )
}

export default Cart