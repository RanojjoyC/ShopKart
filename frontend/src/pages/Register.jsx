import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
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

      await api.post("/customers/register", formData);

      navigate("/login");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf1ef] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-[34px] bg-[#f8faf7] shadow-[0_25px_70px_rgba(39,54,54,0.10)] lg:grid-cols-2">
        {/* Left: form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-lg">
            <button onClick={() => navigate("/home")} className="mb-9 flex items-center gap-2.5 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111616] text-lg font-black text-white">S</span>
              <span className="text-xl font-black tracking-[-0.04em] text-[#111616]">ShopKart.</span>
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Get started</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#111616] sm:text-5xl">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-black/45">Join ShopKart and start discovering products made for your everyday needs.</p>

            {apiError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-[#111616]">Full Name</label>
                <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" className={`w-full rounded-2xl border ${errors.fullName ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`} />
                {errors.fullName && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.fullName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#111616]">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full rounded-2xl border ${errors.email ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`} />
                {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#111616]">Password</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className={`w-full rounded-2xl border ${errors.password ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`} />
                {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold text-[#111616]">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" className={`w-full rounded-2xl border ${errors.phone ? "border-red-500" : "border-black/10"} bg-white px-4 py-3.5 text-sm text-[#111616] outline-none shadow-[0_8px_25px_rgba(22,32,32,0.04)] transition placeholder:text-black/30 focus:border-[#111616] focus:ring-4 focus:ring-[#d9ff45]/30`} />
                {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.phone}</p>}
              </div>

              <button type="submit" disabled={loading} className="sm:col-span-2 w-full rounded-2xl bg-[#111616] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(17,22,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#252d2d] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-black/45">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="font-extrabold text-[#111616] underline decoration-[#d9ff45] decoration-2 underline-offset-4">
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Right: visual hero */}
        <div className="relative hidden overflow-hidden bg-[#d9ff45] lg:block">
          <div className="absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-white/50 blur-3xl" />
          <div className="absolute -bottom-36 -left-24 h-[420px] w-[420px] rounded-full bg-[#8ac5ff]/25 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
            <div className="flex justify-end">
              <span className="rounded-full bg-[#111616] px-4 py-2 text-xs font-bold text-white">ShopKart / 02</span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/45">A better way to shop</p>
              <h2 className="mt-5 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.065em] text-[#111616] xl:text-7xl">
                Find something
                <br />
                you'll love.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-black/50">
                From everyday essentials to your next favourite gadget, keep everything in one place.
              </p>
            </div>

            <div className="relative mt-10 min-h-[260px]">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-[40px] bg-white/70 shadow-[0_30px_60px_rgba(30,50,40,0.12)] rotate-6" />
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" alt="Minimalist watch" className="absolute right-5 top-4 h-56 w-72 rounded-[30px] object-cover shadow-[0_30px_50px_rgba(30,50,40,0.22)]" />
              <div className="absolute bottom-2 left-0 rounded-3xl bg-white/70 px-5 py-4 backdrop-blur"><p className="text-xl font-black text-[#111616]">Simple.</p><p className="text-xs text-black/45">Beautifully useful.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
