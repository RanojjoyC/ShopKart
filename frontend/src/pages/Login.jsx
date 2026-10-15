import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError("");
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      await api.post("/customers/login", formData);
      await checkAuth();

      navigate("/home");
    } catch {
      setApiError("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf1ef] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-[34px] bg-[#f8faf7] shadow-[0_25px_70px_rgba(39,54,54,0.10)] lg:grid-cols-2">
        {/* Left: form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <button onClick={() => navigate("/home")} className="mb-12 flex items-center gap-2.5 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111616] text-lg font-black text-white">S</span>
              <span className="text-xl font-black tracking-[-0.04em] text-[#111616]">ShopKart.</span>
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Welcome back</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#111616] sm:text-5xl">Login to ShopKart</h1>
            <p className="mt-3 text-sm leading-6 text-black/45">Sign in to continue exploring products curated for your everyday life.</p>

            {apiError && (
              <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#111616]">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-2xl border ${errors.email ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`}
                />
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#111616]">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full rounded-2xl border ${errors.password ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`}
                />
                {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#111616] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(17,22,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#252d2d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-sm text-black/45">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/register")} className="font-extrabold text-[#111616] underline decoration-[#d9ff45] decoration-2 underline-offset-4">
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Right: visual hero */}
        <div className="relative hidden overflow-hidden bg-[#111616] lg:block">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#d9ff45]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#8ac5ff]/15 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
            <div className="flex justify-end">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/60 backdrop-blur">
                ShopKart / 01
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9ff45]">Your everyday marketplace</p>
              <h2 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white xl:text-7xl">
                Everything you need.
                <br />
                Nothing you don't.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/50">
                A clean shopping experience for discovering useful products without the clutter.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur"><p className="text-2xl font-black text-white">460+</p><p className="mt-1 text-xs text-white/45">Products</p></div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur"><p className="text-2xl font-black text-white">24/7</p><p className="mt-1 text-xs text-white/45">Shopping</p></div>
              </div>
            </div>

            <div className="relative mt-10 flex justify-end">
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full border border-white/10" />
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85" alt="Wireless headphones" className="relative z-10 h-64 w-80 rounded-[32px] object-cover object-center shadow-2xl xl:h-80 xl:w-96" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
