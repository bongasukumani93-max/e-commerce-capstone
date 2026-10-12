
import { useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import "./App.css";

const products = [
  {
    id: 1,
    name: "MacBook Air M2",
    category: "Laptops",
    price: 18999,
    oldPrice: 21999,
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop",
    description:
      "A lightweight and powerful laptop for work, studying, and everyday productivity.",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "Phones",
    price: 23999,
    oldPrice: 26999,
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop",
    description:
      "A premium smartphone with a powerful camera, beautiful display, and excellent performance.",
  },
  {
    id: 3,
    name: "Apple Watch Series 9",
    category: "Watches",
    price: 7999,
    oldPrice: 9499,
    tag: "Sale",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&auto=format&fit=crop",
    description:
      "A stylish smartwatch designed to keep you connected and track your daily activity.",
  },
  {
    id: 4,
    name: "Sony Wireless Headphones",
    category: "Accessories",
    price: 4499,
    oldPrice: 5999,
    tag: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop",
    description:
      "Comfortable wireless headphones with immersive sound for music and entertainment.",
  },
  {
    id: 5,
    name: "Dell XPS Laptop",
    category: "Laptops",
    price: 24999,
    oldPrice: 27999,
    tag: "Premium",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop",
    description:
      "A premium laptop with a sharp display and dependable performance.",
  },
  {
    id: 6,
    name: "Samsung Galaxy Smartphone",
    category: "Phones",
    price: 15999,
    oldPrice: 17999,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop",
    description:
      "An Android smartphone built for photography, entertainment, and multitasking.",
  },
  {
    id: 7,
    name: "Classic Smart Watch",
    category: "Watches",
    price: 3299,
    oldPrice: 3999,
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop",
    description:
      "A modern everyday watch with a clean design and comfortable fit.",
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    category: "Accessories",
    price: 1999,
    oldPrice: 2599,
    tag: "Value",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&auto=format&fit=crop",
    description:
      "Compact wireless earbuds for calls, music, and listening on the move.",
  },
];

const categories = [
  "All Products",
  "Laptops",
  "Phones",
  "Watches",
  "Accessories",
];

const money = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [sort, setSort] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All Products" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [search, category, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to cart!`);
  }

  function removeFromCart(id) {
    setCart((previous) => previous.filter((item) => item.id !== id));
  }

  function chooseCategory(value) {
    setCategory(value);
    setSidebarOpen(false);
    setSelectedProduct(null);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-slate-200 px-3 py-2 text-xl hover:bg-slate-100"
            >
              ☰
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xl font-black tracking-tight sm:text-2xl"
            >
              techstore<span className="text-blue-600">.</span>
            </button>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <button
              onClick={() => {
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() => chooseCategory("All Products")}
              className="hover:text-blue-600"
            >
              Shop
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:text-blue-600"
            >
              Categories
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                document.getElementById("cart")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              🛒 Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="relative z-10 h-full w-72 max-w-[85vw] bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-black">techstore.</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="rounded-lg bg-slate-100 px-3 py-2"
              >
                ✕
              </button>
            </div>

            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Browse Categories
            </h3>

            <div className="space-y-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => chooseCategory(item)}
                  className={`block w-full rounded-xl px-4 py-3 text-left font-semibold transition ${
                    category === item
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="mt-10 text-sm text-slate-500">
              Discover quality technology products at great prices.
            </p>
          </aside>
        </div>
      )}

      {/* HOMEPAGE */}
      <main>
        {!selectedProduct ? (
          <>
            {/* HERO */}
            <section className="bg-slate-950 text-white">
              <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
                <div>
                  <span className="inline-block rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-300">
                    New season. New technology.
                  </span>

                  <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                    Upgrade your
                    <span className="block text-blue-400">
                      everyday tech.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
                    Explore premium laptops, smartphones, watches, and
                    accessories. Find the technology that fits your lifestyle.
                  </p>

                  <button
                    onClick={() => chooseCategory("All Products")}
                    className="mt-8 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
                  >
                    Shop Collection →
                  </button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop"
                    alt="Technology products"
                    className="h-72 w-full object-cover md:h-96"
                  />
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section className="border-b border-slate-200 bg-white">
              <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 text-center sm:grid-cols-3">
                <div>
                  <p className="text-2xl">🚚</p>
                  <h3 className="mt-2 font-bold">Fast Delivery</h3>
                  <p className="text-sm text-slate-500">
                    Convenient shopping experience
                  </p>
                </div>

                <div>
                  <p className="text-2xl">🔒</p>
                  <h3 className="mt-2 font-bold">Quality Products</h3>
                  <p className="text-sm text-slate-500">
                    Carefully selected technology
                  </p>
                </div>

                <div>
                  <p className="text-2xl">⭐</p>
                  <h3 className="mt-2 font-bold">Great Value</h3>
                  <p className="text-sm text-slate-500">
                    Competitive prices every day
                  </p>
                </div>
              </div>
            </section>

            {/* PRODUCTS */}
            <section
              id="products"
              className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16"
            >
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  Our Collection
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Featured Products
                </h2>
                <p className="mt-3 text-slate-500">
                  Explore our latest technology collection.
                </p>
              </div>

              {/* CATEGORY FILTERS */}
              <div className="mb-7 flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      category === item
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* SEARCH AND SORT */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 outline-none focus:border-blue-500"
                />

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 outline-none focus:border-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <p className="mb-5 text-sm text-slate-500">
                Showing {visibleProducts.length} products
              </p>

              {/* PRODUCT GRID USING REUSABLE COMPONENT */}
              {visibleProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <div key={product.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          if (event.target.closest("button")) return;
                          setSelectedProduct(product);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onKeyDown={(event) => {
                          if (event.target === event.currentTarget &&
                            (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            setSelectedProduct(product);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <ProductCard
                          product={product}
                          money={money}
                          onAddToCart={addToCart}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-blue-500 hover:text-blue-600"
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-12 text-center">
                  <h3 className="text-xl font-bold">No products found</h3>
                  <p className="mt-2 text-slate-500">
                    Try another search or category.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("All Products");
                    }}
                    className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* PRODUCT DETAIL VIEW */
          <section className="mx-auto max-w-7xl px-5 py-12">
            <button
              onClick={() => setSelectedProduct(null)}
              className="mb-8 font-semibold text-blue-600 hover:underline"
            >
              ← Back to Products
            </button>

            <div className="grid gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-80 w-full object-cover md:h-[450px]"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  {selectedProduct.category}
                </p>

                <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                  {selectedProduct.name}
                </h1>

                {selectedProduct.tag && (
                  <span className="mt-4 w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
                    {selectedProduct.tag}
                  </span>
                )}

                <div className="mt-7 flex items-center gap-4">
                  <span className="text-3xl font-black">
                    {money(selectedProduct.price)}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    {money(selectedProduct.oldPrice)}
                  </span>
                </div>

                <p className="mt-6 leading-8 text-slate-600">
                  {selectedProduct.description}
                </p>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <p className="mb-4 text-sm font-semibold text-green-600">
                    ✓ Available for purchase
                  </p>

                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700"
                  >
                    Add to Cart — {money(selectedProduct.price)}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SIMPLE CART PREVIEW FOR TESTING */}
        <section
          id="cart"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12"
        >
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">Shopping Cart</h2>
              <span className="text-sm text-slate-500">
                {cartCount} items
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                Your cart is currently empty.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <strong>{money(item.price * item.quantity)}</strong>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black">
                    {money(cartTotal)}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setNotice("Checkout will be integrated by the checkout team.")
                  }
                  className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-4 font-bold text-white hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-10 sm:flex-row">
          <div>
            <h2 className="text-2xl font-black">
              techstore<span className="text-blue-400">.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Your destination for everyday technology.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 TechStore. All rights reserved.
          </p>
        </div>
      </footer>

      {/* NOTIFICATION */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 p-4 text-sm font-semibold text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
