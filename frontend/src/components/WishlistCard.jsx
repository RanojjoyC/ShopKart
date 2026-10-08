import { useNavigate } from "react-router-dom";

function WishlistCard({product, onRemove, removing}){
    const navigate = useNavigate();
    const isOutOfStock = product.stock === 0;

    return (
        <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(31,45,45,0.11)]">

            <div className="relative h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">

                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-black/55 backdrop-blur">
                    {product.category}
                </span>

                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-black/55 backdrop-blur">
                    ♥ Saved
                </span>

            </div>

            <div className="p-3 pt-4">

                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                        <h2 className="truncate font-extrabold text-[#111616]">
                            {product.name}
                        </h2>

                        <p
                            className={`mt-1 text-sm ${isOutOfStock
                                ? "font-semibold text-red-600"
                                : "text-black/45"
                                }`}
                        >
                            {isOutOfStock
                                ? "Out of stock"
                                : `${product.stock} units left`}
                        </p>

                    </div>

                    <span className="shrink-0 font-black text-[#111616]">
                        ₹
                        {Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </span>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/products/${product._id}`
                        )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111616] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                >
                    View Details
                    <span>↗</span>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onRemove(product._id)
                    }
                    disabled={removing}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#edf1ef] px-4 py-3 text-sm font-extrabold text-[#111616] transition hover:bg-[#e2e8e5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {removing
                        ? "Removing..."
                        : "Remove ♥"}
                </button>

            </div>
        </article>
    );
}

export default WishlistCard;