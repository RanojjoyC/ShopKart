function SearchBar({ value, onChange }) {
  return (
    <div className="flex w-full items-center rounded-2xl border border-black/10 bg-white px-4 shadow-[0_8px_25px_rgba(22,32,32,0.05)] focus-within:border-[#111616] focus-within:ring-4 focus-within:ring-[#d9ff45]/20">

      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="mr-3 h-5 w-5 shrink-0 text-black/40"
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
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search products..."
        className="w-full bg-transparent py-4 text-sm text-[#111616] outline-none placeholder:text-black/35"
        aria-label="Search products"
      />

    </div>
  );
}

export default SearchBar;