import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useAuth();
  const { totalItems } = useCart();

  const [search, setSearch] =
    useState("");

  const isProductsPage =
    location.pathname === "/products";

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      setUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      navigate("/login");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch =
      search.trim();

    if (!trimmedSearch) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        trimmedSearch
      )}`
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#edf1ef]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:px-10">

        {/* Brand */}
        <button
          type="button"
          onClick={() =>
            navigate("/home")
          }
          className="flex shrink-0 items-center gap-2.5 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111616] text-lg font-black text-white shadow-[0_8px_20px_rgba(17,22,22,0.18)]">
            S
          </span>

          <span className="text-xl font-black tracking-[-0.04em] text-[#111616]">
            ShopKart.
          </span>
        </button>

        {/* Navbar Search */}
        {!isProductsPage && (
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 justify-center md:flex"
          >
            <div className="flex h-11 w-full max-w-xl items-center rounded-full border border-black/5 bg-white px-4 shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition focus-within:border-black/10 focus-within:shadow-[0_10px_30px_rgba(22,32,32,0.08)]">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mr-3 h-4 w-4 shrink-0 text-black/40"
                aria-hidden="true"
              >
                <path
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-[#111616] outline-none placeholder:text-black/35"
                aria-label="Search products"
              />

            </div>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">

          {/* Products */}
          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="hidden h-11 items-center rounded-full bg-white px-5 text-xs font-bold uppercase tracking-[0.08em] text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(22,32,32,0.08)] sm:flex"
          >
            Products
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() =>
              navigate("/wishlist")
            }
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 sm:flex"
            aria-label="Wishlist"
          >
            <span className="text-lg">
              ♡
            </span>
          </button>

          {/* Shopping Cart */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 sm:flex"
            aria-label="Shopping cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M6.5 8.5h11l.8 11h-12.6l.8-11Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M9 9V6.8a3 3 0 0 1 6 0V9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9ff45] px-1 text-[10px] font-black text-[#111616]">
                {totalItems}
              </span>
            )}
          </button>

          {/* Orders */}
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="hidden h-11 items-center rounded-full bg-white px-5 text-xs font-bold uppercase tracking-[0.08em] text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(22,32,32,0.08)] sm:flex"
          >
            Orders
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 items-center gap-2 rounded-full bg-[#111616] px-4 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_25px_rgba(17,22,22,0.16)] transition hover:-translate-y-0.5 hover:bg-[#252d2d]"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;