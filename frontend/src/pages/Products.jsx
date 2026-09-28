import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

import { getProducts } from "../services/productApi.js";

const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Books",
    "Home",
];

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [category, setCategory] =
        useState("All Categories");

    const [sort, setSort] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const urlSearch =
            searchParams.get("search") || "";

        setSearch(urlSearch);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProducts({
                    search,
                    category:
                        category === "All Categories"
                            ? ""
                            : category,
                    sort,
                });

                setProducts(data.products || []);
            } catch (requestError) {
                console.error(
                    "Failed to fetch products:",
                    requestError
                );

                setProducts([]);

                setError(
                    "Something went wrong while loading products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category, sort]);

    const handleSearchChange = (value) => {
        setSearch(value);

        const trimmedSearch = value.trim();

        if (trimmedSearch) {
            setSearchParams({
                search: trimmedSearch,
            });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

            <Navbar />

            <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

                {/* Page Header */}
                <section className="overflow-hidden rounded-[34px] bg-[#f8faf7] px-6 py-8 shadow-[0_25px_70px_rgba(39,54,54,0.08)] sm:px-10 sm:py-10">

                    <div className="max-w-3xl">

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                            ShopKart collection
                        </p>

                        <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                            Discover products.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
                            Search the catalogue, filter by category,
                            and open any product to see its full details.
                        </p>

                    </div>

                    {/* Search + Filters */}
                    <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_190px]">

                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                        />

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-[#111616] outline-none focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/20"
                            aria-label="Filter by category"
                        >
                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-[#111616] outline-none focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/20"
                            aria-label="Sort products"
                        >
                            <option value="">
                                Sort: Default
                            </option>

                            <option value="price_asc">
                                Price: Low to High
                            </option>

                            <option value="price_desc">
                                Price: High to Low
                            </option>
                        </select>

                    </div>

                </section>

                {/* Product Catalogue */}
                <section className="mt-10">

                    <div className="mb-6 flex items-end justify-between gap-4">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                Product catalogue
                            </p>

                            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                {search ||
                                    category !== "All Categories"
                                    ? "Matching products"
                                    : "All products"}
                            </h2>

                        </div>

                        {!loading && !error && (
                            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-black/45 shadow-[0_8px_25px_rgba(22,32,32,0.05)] sm:inline-flex">
                                {products.length}{" "}
                                {products.length === 1
                                    ? "product"
                                    : "products"}
                            </span>
                        )}

                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

                            <p className="mt-4 text-sm font-semibold text-black/45">
                                Loading products...
                            </p>

                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading &&
                        !error &&
                        products.length === 0 && (
                            <div className="rounded-[28px] bg-white p-12 text-center shadow-[0_14px_35px_rgba(31,45,45,0.06)]">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d9ff45] text-2xl">
                                    ⌕
                                </div>

                                <h3 className="mt-5 text-xl font-black">
                                    No products found.
                                </h3>

                                <p className="mt-2 text-sm text-black/45">
                                    Try another search term or choose a
                                    different category.
                                </p>

                            </div>
                        )}

                    {/* Dynamic Product Cards */}
                    {!loading &&
                        !error &&
                        products.length > 0 && (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))}

                            </div>
                        )}

                </section>

            </main>

        </div>
    );
}

export default Products;