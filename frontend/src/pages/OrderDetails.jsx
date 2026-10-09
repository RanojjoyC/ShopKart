import {
    useEffect,
    useState
} from "react"

import {
    useNavigate,
    useParams
} from "react-router-dom"

import Navbar from "../components/Navbar.jsx"

import {
    getOrderById
} from "../services/orderApi.js"


function OrderDetails() {
    const {
        id
    } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")


    useEffect(() => {
        const fetchOrder =
            async () => {
                try {
                    setLoading(true)
                    setError("")

                    const data =
                        await getOrderById(
                            id
                        )

                    setOrder(
                        data.order
                    )

                } catch (
                requestError
                ) {
                    console.error(
                        "Failed to load order:",
                        requestError
                    )

                    setError(
                        requestError
                            .response
                            ?.data
                            ?.message ||
                        "Unable to load this order."
                    )

                } finally {
                    setLoading(false)
                }
            }

        fetchOrder()
    }, [id])


    if (loading) {
        return (
            <div className="min-h-screen bg-[#edf1ef]">
                <Navbar />

                <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10">

                    <section className="rounded-[28px] bg-white p-10 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                        <p className="mt-4 text-sm font-semibold text-black/45">
                            Loading order...
                        </p>
                    </section>

                </main>
            </div>
        )
    }


    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

                <Navbar />

                <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10">

                    <section className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center">

                        <h1 className="text-2xl font-black text-red-700">
                            Unable to load order
                        </h1>

                        <p className="mt-2 text-sm font-semibold text-red-600">
                            {error || "Order not found."}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/orders"
                                )
                            }
                            className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white"
                        >
                            View My Orders
                        </button>

                    </section>

                </main>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

            <Navbar />

            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                <section className="overflow-hidden rounded-[34px] bg-[#f8faf7] px-6 py-10 text-center shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10">

                    {order.paymentStatus === "PAID" ? (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9ff45] text-3xl">
                                ✓
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                Order Confirmation
                            </p>

                            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                                Order Placed Successfully
                            </h1>

                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-black/50">
                                Your ShopKart order has been saved successfully.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-white">
                                !
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                Order Status
                            </p>

                            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                                Payment Pending
                            </h1>

                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-black/50">
                                Order Created Successfully but payment is still pending.
                            </p>
                        </>
                    )}

                </section>


                <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                    <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(31,45,45,0.06)] sm:p-8">

                        <div className="flex flex-col gap-4 border-b border-black/5 pb-6 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
                                    Order ID
                                </p>

                                <p className="mt-2 break-all text-sm font-black">
                                    {order._id}
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-[#d9ff45] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em]">
                                {order.status}
                            </span>

                        </div>


                        <h2 className="mt-7 text-2xl font-black">
                            Items
                        </h2>


                        <div className="mt-5 space-y-4">

                            {order.items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={`${item.product}-${index}`}
                                        className="flex items-center gap-4 rounded-2xl bg-[#f7f9f6] p-3"
                                    >

                                        <img
                                            src={
                                                item.image
                                            }
                                            alt={
                                                item.name
                                            }
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-sm font-black">
                                                {
                                                    item.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-black/40">
                                                ₹
                                                {Number(
                                                    item.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                                {" "}×{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>

                                        </div>

                                        <p className="shrink-0 text-sm font-black">
                                            ₹
                                            {(
                                                Number(
                                                    item.price
                                                ) *
                                                Number(
                                                    item.quantity
                                                )
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>


                    <aside className="h-fit rounded-[30px] bg-[#111616] p-6 text-white shadow-[0_20px_55px_rgba(31,45,45,0.14)] sm:p-8">

                        <h2 className="text-2xl font-black">
                            Order Summary
                        </h2>


                        <div className="mt-6 space-y-4 text-sm">

                            <div className="flex justify-between gap-4">
                                <span className="text-white/50">
                                    Payment
                                </span>

                                <span className="font-black">
                                    {
                                        order.paymentStatus
                                    }
                                </span>
                            </div>


                            <div className="flex justify-between gap-4">
                                <span className="text-white/50">
                                    Status
                                </span>

                                <span className="font-black">
                                    {
                                        order.status
                                    }
                                </span>
                            </div>


                            <div className="border-t border-white/10 pt-5">

                                <div className="flex items-center justify-between">

                                    <span className="text-white/50">
                                        Total
                                    </span>

                                    <span className="text-2xl font-black">
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="mt-7 space-y-3">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/orders"
                                    )
                                }
                                className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#111616]"
                            >
                                View My Orders
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                                className="w-full rounded-2xl bg-[#d9ff45] px-5 py-3 text-sm font-extrabold text-[#111616]"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

        </div>
    )
}


export default OrderDetails