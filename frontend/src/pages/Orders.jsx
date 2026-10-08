import {
    useCallback,
    useEffect,
    useState
} from "react"

import {
    useNavigate
} from "react-router-dom"

import Navbar from "../components/Navbar.jsx"

import {
    getOrders
} from "../services/orderApi.js"


function Orders() {
    const navigate = useNavigate()

    const [orders, setOrders] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")


    const fetchOrders =
        useCallback(
            async () => {
                try {
                    setLoading(true)
                    setError("")

                    const data =
                        await getOrders()

                    setOrders(
                        data.orders || []
                    )

                } catch (
                requestError
                ) {
                    console.error(
                        "Failed to load orders:",
                        requestError
                    )

                    setOrders([])

                    setError(
                        requestError
                            .response
                            ?.data
                            ?.message ||
                        "Unable to load your orders."
                    )

                } finally {
                    setLoading(false)
                }
            },
            []
        )


    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])


    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

            <Navbar />

            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                <section className="overflow-hidden rounded-[34px] bg-[#f8faf7] px-6 py-8 shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10 sm:py-10">

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                        Your purchase history
                    </p>

                    <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                        My Orders
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
                        View your previous ShopKart purchases and their current status.
                    </p>

                </section>


                {loading && (
                    <section className="mt-10 rounded-[28px] bg-white p-10 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                        <p className="mt-4 text-sm font-semibold text-black/45">
                            Loading your orders...
                        </p>

                    </section>
                )}


                {!loading && error && (
                    <section className="mt-10 rounded-[28px] border border-red-200 bg-red-50 p-10 text-center">

                        <h2 className="text-xl font-black text-red-700">
                            Something went wrong.
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                fetchOrders
                            }
                            className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white"
                        >
                            Try Again
                        </button>

                    </section>
                )}


                {!loading &&
                    !error &&
                    orders.length === 0 && (
                        <section className="mt-10 rounded-[28px] bg-white p-12 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9ff45] text-2xl">
                                ✓
                            </div>

                            <h2 className="mt-5 text-2xl font-black">
                                You have not placed any orders yet.
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                                Your completed ShopKart purchases will appear here.
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
                                Start Shopping
                            </button>

                        </section>
                    )}


                {!loading &&
                    !error &&
                    orders.length > 0 && (
                        <section className="mt-10 space-y-4">

                            {orders.map(
                                (order) => (
                                    <article
                                        key={
                                            order._id
                                        }
                                        className="rounded-[28px] bg-white p-5 shadow-[0_14px_35px_rgba(31,45,45,0.06)] sm:p-6"
                                    >

                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
                                                    Order #
                                                    {
                                                        order._id
                                                    }
                                                </p>

                                                <p className="mt-2 text-sm font-semibold text-black/45">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </p>
                                            </div>


                                            <span className="w-fit rounded-full bg-[#d9ff45] px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#111616]">
                                                {
                                                    order.status
                                                }
                                            </span>

                                        </div>


                                        <div className="mt-5 grid gap-3 border-y border-black/5 py-5 sm:grid-cols-2">

                                            {order.items.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <div
                                                        key={`${order._id}-${item.product}-${index}`}
                                                        className="flex items-center gap-3"
                                                    >

                                                        <img
                                                            src={
                                                                item.image
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                            className="h-12 w-12 rounded-xl object-cover"
                                                        />

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold">
                                                                {
                                                                    item.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs font-semibold text-black/40">
                                                                ×{" "}
                                                                {
                                                                    item.quantity
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>


                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                            <p className="font-black">
                                                Total: ₹
                                                {Number(
                                                    order.totalAmount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/orders/${order._id}`
                                                    )
                                                }
                                                className="rounded-2xl bg-[#111616] px-5 py-3 text-sm font-extrabold text-white"
                                            >
                                                View Details
                                            </button>

                                        </div>

                                    </article>
                                )
                            )}

                        </section>
                    )}

            </main>

        </div>
    )
}


export default Orders