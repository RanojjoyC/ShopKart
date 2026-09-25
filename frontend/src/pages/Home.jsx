import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user: customer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf1ef]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#111616] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-black/50">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#edf1ef]">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        {/* Main hero */}
        <section className="grid overflow-hidden rounded-[34px] bg-[#f8faf7] shadow-[0_25px_70px_rgba(39,54,54,0.10)] lg:grid-cols-[1.55fr_0.85fr]">
          <div className="relative min-h-[500px] overflow-hidden px-7 py-9 sm:px-12 sm:py-12 lg:px-14 lg:py-14">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#dfff4d]/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#d7e9ff]/60 blur-3xl" />

            <div className="relative z-10 max-w-xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black/55 shadow-[0_8px_25px_rgba(22,32,32,0.06)]">
                <span className="h-2 w-2 rounded-full bg-[#b8e52e]" />
                ShopKart essentials
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-black/45">
                Curated for you
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.065em] text-[#111616] sm:text-6xl lg:text-7xl">
                Shop smarter.
                <br />
                Live better.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-black/55 sm:text-lg">
                Discover everyday products with a clean, simple shopping experience built around you.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="group flex items-center gap-3 rounded-full bg-[#d9ff45] px-6 py-3.5 text-sm font-extrabold text-[#111616] shadow-[0_10px_25px_rgba(190,222,47,0.25)] transition hover:-translate-y-0.5"
                >
                  Explore products
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111616] text-white transition group-hover:rotate-45">
                    ↗
                  </span>
                </button>
                <span className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black/50 shadow-[0_8px_25px_rgba(22,32,32,0.05)]">
                  Welcome, {customer.fullName}
                </span>
              </div>
            </div>

            {/* Decorative product */}
            <div className="pointer-events-none absolute -bottom-10 right-[-10px] h-[340px] w-[340px] sm:h-[420px] sm:w-[420px] lg:right-[5%]">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dcecff] blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85"
                alt="Blue wireless headphones"
                className="relative h-full w-full object-contain drop-shadow-[0_30px_25px_rgba(20,40,50,0.25)]"
              />
            </div>

            <div className="absolute bottom-6 left-7 hidden items-center gap-4 text-xs text-black/40 sm:flex sm:left-12 lg:left-14">
              <span>Follow us</span>
              <span className="h-px w-10 bg-black/15" />
              <span>New arrivals</span>
              <span>•</span>
              <span>Best sellers</span>
            </div>
          </div>

          {/* Side feature cards */}
          <div className="grid gap-4 bg-[#f0f3f1] p-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative min-h-[210px] overflow-hidden rounded-[26px] bg-[#f8faf7] p-6">
              <span className="relative z-10 inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black/50">
                New gen
              </span>
              <h2 className="relative z-10 mt-3 max-w-[190px] text-2xl font-black leading-tight tracking-[-0.04em] text-[#111616]">
                Audio made simple.
              </h2>
              <div className="absolute -bottom-8 right-[-15px] h-44 w-56 rotate-[-8deg] rounded-[30px] bg-gradient-to-br from-[#f2f3ef] to-[#c9cfca] shadow-[0_25px_35px_rgba(40,50,50,0.20)]" />
              <span className="absolute bottom-5 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                ↗
              </span>
            </div>

            <div className="relative min-h-[210px] overflow-hidden rounded-[26px] bg-[#111616] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">For your setup</p>
              <h2 className="mt-3 max-w-[210px] text-2xl font-black leading-tight tracking-[-0.04em]">
                Upgrade your everyday tech.
              </h2>
              <div className="absolute -bottom-16 right-[-25px] h-48 w-48 rounded-full border-[28px] border-white/10" />
              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-xs text-white/55">
                <span className="h-2 w-2 rounded-full bg-[#d9ff45]" />
                460+ items
              </div>
            </div>
          </div>
        </section>

        {/* Product section */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">Shop the collection</p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#111616] sm:text-4xl">
                Popular products
              </h2>
            </div>
            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-black/45 shadow-[0_8px_25px_rgba(22,32,32,0.05)] sm:inline-flex">
              6 featured items
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85" alt="Red running shoes" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-extrabold text-[#111616]">Nike Air Max</h3><p className="mt-1 text-sm text-black/45">Running shoes</p></div>
                  <span className="font-black text-[#111616]">$120</span>
                </div>
              </div>
            </article>

            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=85" alt="Wireless headphones" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-[#111616]">Studio Headphones</h3><p className="mt-1 text-sm text-black/45">Wireless audio</p></div><span className="font-black text-[#111616]">$149</span></div></div>
            </article>

            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=85" alt="White cotton t-shirt" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-[#111616]">Classic White Tee</h3><p className="mt-1 text-sm text-black/45">100% cotton</p></div><span className="font-black text-[#111616]">$25</span></div></div>
            </article>

            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85" alt="Leather jacket" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-[#111616]">Leather Jacket</h3><p className="mt-1 text-sm text-black/45">Premium outerwear</p></div><span className="font-black text-[#111616]">$199</span></div></div>
            </article>

            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85" alt="Minimalist wrist watch" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-[#111616]">Minimalist Watch</h3><p className="mt-1 text-sm text-black/45">Everyday accessory</p></div><span className="font-black text-[#111616]">$85</span></div></div>
            </article>

            <article className="group overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_14px_35px_rgba(31,45,45,0.07)] transition hover:-translate-y-1">
              <div className="h-64 overflow-hidden rounded-[20px] bg-[#eef1ee]">
                <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=85" alt="Modern wireless earbuds" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-[#111616]">Air Buds Pro</h3><p className="mt-1 text-sm text-black/45">Compact wireless audio</p></div><span className="font-black text-[#111616]">$89</span></div></div>
            </article>
          </div>
        </section>

        {/* Existing account data, presented without the old XP window */}
        <section className="mt-12 rounded-[28px] bg-white p-6 shadow-[0_14px_35px_rgba(31,45,45,0.06)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/35">Account</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#111616]">Your ShopKart profile</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9ff45] text-lg font-black text-[#111616]">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f2f5f2] p-4"><p className="text-xs font-semibold text-black/40">Full name</p><p className="mt-1 font-bold text-[#111616] break-words">{customer.fullName}</p></div>
            <div className="rounded-2xl bg-[#f2f5f2] p-4"><p className="text-xs font-semibold text-black/40">Email</p><p className="mt-1 font-bold text-[#111616] break-words">{customer.email}</p></div>
            <div className="rounded-2xl bg-[#f2f5f2] p-4"><p className="text-xs font-semibold text-black/40">Phone</p><p className="mt-1 font-bold text-[#111616] break-words">{customer.phone}</p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
