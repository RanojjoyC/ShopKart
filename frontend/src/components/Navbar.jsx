import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#edf1ef]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <button
          onClick={() => navigate("/home")}
          className="flex shrink-0 items-center gap-2.5 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111616] text-lg font-black text-white shadow-[0_8px_20px_rgba(17,22,22,0.18)]">
            S
          </span>
          <span className="text-xl font-black tracking-[-0.04em] text-[#111616]">
            ShopKart.
          </span>
        </button>

        {/* Search - visual only for this phase */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex h-11 w-full max-w-xl items-center rounded-full border border-black/5 bg-white px-4 shadow-[0_8px_25px_rgba(22,32,32,0.05)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mr-3 h-4 w-4 text-black/40"
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
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent text-sm text-[#111616] outline-none placeholder:text-black/35"
              aria-label="Search products"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 sm:flex"
            aria-label="Wishlist"
          >
            <span className="text-lg">♡</span>
          </button>

          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#111616] shadow-[0_8px_25px_rgba(22,32,32,0.05)] transition hover:-translate-y-0.5 sm:flex"
            aria-label="Shopping bag"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M6.5 8.5h11l.8 11h-12.6l.8-11Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 9V6.8a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

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
