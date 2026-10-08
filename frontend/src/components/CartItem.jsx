import { useNavigate } from "react-router-dom"


function CartItem({item, onUpdateQuantity, onRemove, loading}) {
    const navigate = useNavigate()
    const product = item.product

    const isAtMaximum =
        item.quantity >= product.stock

    const handleIncrease = () => {
        if (!isAtMaximum) {
            onUpdateQuantity(
                product._id,
                item.quantity + 1
            )
        }
    }

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(
                product._id,
                item.quantity - 1
            )
        }
    }

    return (
        <article className="rounded-[26px] bg-white p-4 shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

            <div className="flex flex-col gap-5 sm:flex-row">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/products/${product._id}`
                        )
                    }
                    className="h-32 w-full shrink-0 overflow-hidden rounded-[20px] bg-[#eef1ee] sm:h-32 sm:w-32"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition hover:scale-105"
                    />
                </button>


                <div className="flex min-w-0 flex-1 flex-col justify-between">

                    <div>

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
                                    {product.category}
                                </p>

                                <h2 className="mt-1 text-lg font-black">
                                    {product.name}
                                </h2>

                            </div>

                            <p className="shrink-0 font-black">
                                ₹
                                {Number(
                                    product.price
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>

                        <p className="mt-2 text-sm text-black/45">
                            {product.stock} units available
                        </p>

                    </div>


                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={handleDecrease}
                                disabled={
                                    loading ||
                                    item.quantity === 1
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf1ef] text-lg font-black transition hover:bg-[#e2e8e5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center rounded-full bg-[#111616] px-3 text-sm font-black text-white">
                                {item.quantity}
                            </span>

                            <button
                                type="button"
                                onClick={handleIncrease}
                                disabled={
                                    loading ||
                                    isAtMaximum
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf1ef] text-lg font-black transition hover:bg-[#e2e8e5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                +
                            </button>

                        </div>


                        <div className="flex items-center gap-4">

                            <p className="font-black">
                                ₹
                                {(
                                    Number(
                                        product.price
                                    ) *
                                    item.quantity
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    onRemove(
                                        product._id
                                    )
                                }
                                disabled={loading}
                                className="text-sm font-extrabold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </article>
    )
}

export default CartItem