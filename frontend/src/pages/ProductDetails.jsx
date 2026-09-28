import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getProductById } from "../services/productApi.js";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product);
      } catch (requestError) {
        console.error(
          "Failed to fetch product:",
          requestError
        );

        setProduct(null);

        setError(
          requestError.response?.data?.message ||
            "Something went wrong while loading the product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-5 sm:px-8 lg:px-10">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />

            <p className="mt-4 text-sm font-semibold text-black/45">
              Loading product...
            </p>

          </div>

        </main>

      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-5 sm:px-8 lg:px-10">

          <div className="w-full max-w-lg rounded-[30px] bg-white p-10 text-center shadow-[0_14px_35px_rgba(31,45,45,0.07)]">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 font-black text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Product unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/45">
              {error ||
                "The requested product could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 rounded-full bg-[#111616] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#293131]"
            >
              Back to Products
            </button>

          </div>

        </main>

      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-[#edf1ef] text-[#111616]">

      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mb-6 text-sm font-bold text-black/45 transition hover:text-[#111616]"
        >
          ← Back to Products
        </button>

        <section className="grid overflow-hidden rounded-[34px] bg-[#f8faf7] shadow-[0_25px_70px_rgba(39,54,54,0.08)] lg:grid-cols-2">

          {/* Product Image */}
          <div className="relative min-h-[430px] overflow-hidden bg-[#eef1ee] p-5 sm:min-h-[600px] sm:p-8">

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dcecff] blur-3xl" />

            <img
              src={product.image}
              alt={product.name}
              className="relative h-full min-h-[390px] w-full rounded-[28px] object-cover shadow-[0_25px_50px_rgba(20,40,50,0.16)] sm:min-h-[530px]"
            />

          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">

            <span className="w-fit rounded-full bg-[#d9ff45] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#111616]">
              {product.category}
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-black/50">
              {product.description}
            </p>

            <div className="mt-8 flex items-end justify-between gap-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-black/35">
                  Price
                </p>

                <p className="mt-1 text-3xl font-black">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-black/35">
                  Stock
                </p>

                <p
                  className={`mt-1 text-sm font-black ${
                    isOutOfStock
                      ? "text-red-600"
                      : "text-[#111616]"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : `${product.stock} units available`}
                </p>
              </div>

            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              className="mt-9 w-full rounded-2xl bg-[#111616] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#293131] disabled:cursor-not-allowed disabled:bg-black/20"
            >
              {isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <p className="mt-3 text-center text-xs text-black/35">
              Add to Cart is UI-only in this lab.
              Cart functionality comes later.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;