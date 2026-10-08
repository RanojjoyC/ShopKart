import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlist } from "../services/wishlistApi.js";
import { useCart } from "../context/CartContext.jsx";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const {
        addToCart,
        cartItems,
        actionLoading
    } = useCart();

    const isOutOfStock = product.stock === 0;

    const [savingWishlist, setSavingWishlist] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistError, setWishlistError] = useState("");

    const handleAddToWishlist = async () => {
        if (savingWishlist || wishlisted)
            return;

        try {
            setSavingWishlist(true);
            setWishlistError("");

            await addToWishlist(product._id);

            setWishlisted(true);

        } catch (error) {
            console.error(
                "Failed to add product to wishlist:",
                error
            );

            setWishlistError(
                error.response?.data?.message ||
                "Unable to save product. Please try again."
            );

        } finally {
            setSavingWishlist(false);
        }
    };

    const alreadyInCart = cartItems.some(
        (item) =>
            item.product?._id === product._id
    );

    const handleAddToCart = async () => {
        if (
            isOutOfStock ||
            actionLoading === product._id
        ) {
            return;
        }

        const result = await addToCart(product._id);

        if (!result.success) {
            console.error(
                "Failed to add product to cart:",
                result.message
            );
        }
    };

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

                {/* Wishlist Button */}
                <button
                    type="button"
                    onClick={handleAddToWishlist}
                    disabled={
                        savingWishlist ||
                        wishlisted
                    }
                    className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-black/55 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {savingWishlist
                        ? "Saving..."
                        : wishlisted
                            ? "♥ Added"
                            : "♡ Wishlist"}
                </button>

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

                {wishlistError && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                        {wishlistError}
                    </p>
                )}

                {/* Add To Cart */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={
                        isOutOfStock ||
                        actionLoading === product._id
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d9ff45] px-4 py-3 text-sm font-extrabold text-[#111616] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {actionLoading === product._id
                        ? "Adding..."
                        : alreadyInCart
                            ? "Add Another"
                            : "Add to Cart"}
                </button>

                {/* View Details */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/products/${product._id}`
                        )
                    }
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111616] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                >
                    View Details
                    <span>↗</span>
                </button>

            </div>
        </article>
    );
}

export default ProductCard;