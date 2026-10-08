import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import WishlistCard from "../components/WishlistCard.jsx";

import { getWishlist, removeFromWishlist } from "../services/wishlistApi.js";

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState("");

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getWishlist();

            setWishlist(
                data.wishlist || []
            );

        } catch (requestError) {
            console.error(
                "Failed to load wishlist:",
                requestError
            );

            setWishlist([]);

            setError(
                "Unable to load wishlist."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            setRemovingId(productId);

            await removeFromWishlist(
                productId
            );

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) =>
                        product._id !== productId
                )
            );

        } catch (removeError) {
            console.error(
                "Failed to remove product:",
                removeError
            );

            setError(
                "Unable to remove product from wishlist."
            );

        } finally {
            setRemovingId("");
        }
    };

    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

            <Navbar />

            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                {/* Header */}
                <section className="overflow-hidden rounded-[34px] bg-[#f8faf7] px-6 py-8 shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10 sm:py-10">

                    <div className="max-w-3xl">

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                            Your saved products
                        </p>

                        <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                            My Wishlist
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
                            Keep the products you love
                            close and come back to them
                            whenever you are ready.
                        </p>

                    </div>

                </section>

                {/* Loading */}
                {loading && (
                    <section className="mt-10 rounded-[28px] bg-white p-10 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                        <p className="mt-4 text-sm font-semibold text-black/45">
                            Loading your wishlist...
                        </p>

                    </section>
                )}

                {/* Error */}
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
                            onClick={fetchWishlist}
                            className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                        >
                            Try Again
                        </button>

                    </section>
                )}

                {/* Empty Wishlist */}
                {!loading &&
                    !error &&
                    wishlist.length === 0 && (
                        <section className="mt-10 rounded-[28px] bg-white p-12 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9ff45] text-2xl">
                                ♥
                            </div>

                            <h2 className="mt-5 text-2xl font-black">
                                Your wishlist is empty
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                                Save products you love
                                and find them here later.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                                className="mt-6 rounded-2xl bg-[#111616] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
                            >
                                Browse Products
                            </button>

                        </section>
                    )}

                {/* Wishlist Products */}
                {!loading &&
                    !error &&
                    wishlist.length > 0 && (
                        <section className="mt-10">

                            <div className="mb-6 flex items-end justify-between gap-4">

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                        Saved products
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                        {wishlist.length}{" "}
                                        {wishlist.length === 1
                                            ? "product"
                                            : "products"}{" "}
                                        saved
                                    </h2>

                                </div>

                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {wishlist.map(
                                    (product) => (
                                        <WishlistCard
                                            key={
                                                product._id
                                            }
                                            product={
                                                product
                                            }
                                            onRemove={
                                                handleRemove
                                            }
                                            removing={
                                                removingId ===
                                                product._id
                                            }
                                        />
                                    )
                                )}

                            </div>

                        </section>
                    )}

            </main>

        </div>
    );
}

export default Wishlist;