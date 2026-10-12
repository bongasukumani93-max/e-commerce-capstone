
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./components/ProductCard";
import { addItem, removeItem } from "./store/cartSlice";
import "./App.css";

const products = [
  {
    id: 1,
    name: "MacBook Air M2",
    category: "Laptops",
    price: 18999,
    oldPrice: 21999,
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop",
    description: "A lightweight and powerful laptop for work, studying, and everyday productivity."
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "Phones",
    price: 23999,
    oldPrice: 26999,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop",
    description: "A premium smartphone with a powerful camera and excellent performance."
  },
  {
    id: 3,
    name: "Apple Watch Series 9",
    category: "Watches",
    price: 7999,
    oldPrice: 9499,
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&auto=format&fit=crop",
    description: "A stylish smartwatch designed to keep you connected."
  },
  {
    id: 4,
    name: "Sony Wireless Headphones",
    category: "Accessories",
    price: 4499,
    oldPrice: 5999,
    tag: "Hot Deal",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop",
    description: "Comfortable wireless headphones with immersive sound."
  },
  {
    id: 5,
    name: "Dell XPS Laptop",
    category: "Laptops",
    price: 24999,
    oldPrice: 27999,
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop",
    description: "A powerful laptop for professionals and creators."
  },
  {
    id: 6,
    name: "Samsung Galaxy Smartphone",
    category: "Phones",
    price: 15999,
    oldPrice: 18999,
    tag: "New",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop",
    description: "A modern smartphone with a vibrant display."
  },
  {
    id: 7,
    name: "Smart Fitness Watch",
    category: "Watches",
    price: 2999,
    oldPrice: 3999,
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop",
    description: "Track your fitness and stay connected."
  },
  {
    id: 8,
    name: "Wireless Bluetooth Speaker",
    category: "Accessories",
    price: 1999,
    oldPrice: 2599,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&auto=format&fit=crop",
    description: "Portable wireless sound for everyday listening."
  }
];

const categories = ["All Products", "Laptops", "Phones", "Watches", "Accessories"];

const money = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(amount);

export default function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems || []);

  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All Products" || product.category === category;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [category, search, sort]);

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  function addToCart(product) {
    dispatch(addItem(product));
    setNotice(`${product.name} added to cart!`);
  }

  function removeFromCart(product) {
    dispatch(removeItem(product.id));
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    setMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth"
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-slate-200 px-3 py-2"
              aria-label="Toggle menu"
            >
              ☰
            </button>

            <a href="#" className="text-2xl font-black">
              techstore<span className="text-blue-600">.</span>
            </a>
          </div>

          <nav className="hidden gap-6 font-medium md:flex">
            <a href="#" className="hover:text-blue-600">Home</a>
            <a href="#products" className="hover:text-blue-600">Shop</a>
            <a href="#categories" className="hover:text-blue-600">Categories</a>
          </nav>

          <a
            href="#cart"
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white"
          >
            Cart ({cartCount})
          </a>
        </div>
      </header>

      {menuOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold">Categories</h2>
            <button onClick={() => setMenuOpen(false)}>✕</button>
          </div>

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => selectCategory(item)}
              className="block w-full rounded-lg px-4 py-3 text-left hover:bg-slate-100"
            >
              {item}
            </button>
          ))}
        </aside>
      )}

      <main>
        <section className="bg-slate-900 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
            <div>
              <p className="mb-4 font-semibold uppercase tracking-widest text-blue-300">
                New season. New technology.
              </p>

              <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                Discover your next favourite tech.
              </h1>

              <p className="mb-8 max-w-lg text-lg text-slate-300">
                Explore laptops, smartphones, smartwatches and accessories
                at great prices.
              </p>

              <a
                href="#products"
                className="inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
              >
                Shop Now →
              </a>
            </div>

            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop"
              alt="Electronics collection"
              className="h-80 w-full rounded-3xl object-cover"
            />
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="mb-6 text-2xl font-black">Shop by Category</h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => selectCategory(item)}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black">Featured Products</h2>
              <p className="mt-2 text-slate-500">
                {visibleProducts.length} products available
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
              />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <p className="rounded-xl bg-white p-10 text-center">
              No products found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    money={money}
                    onAddToCart={addToCart}
                  />

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold hover:bg-slate-100"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="cart" className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-black">
              Shopping Cart ({cartCount})
            </h2>

            {cart.length === 0 ? (
              <p className="text-slate-500">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-4"
                    >
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-slate-500">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="font-bold">
                          {money(item.price * (item.quantity || 1))}
                        </span>

                        <button
                          onClick={() => removeFromCart(item)}
                          className="font-semibold text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-2xl font-black">
                    Total: {money(cartTotal)}
                  </p>

                  <button
                    onClick={() => setNotice("Checkout integration is handled by Member 3.")}
                    className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 md:p-10">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-5 top-5 text-2xl"
            >
              ✕
            </button>

            <div className="grid gap-8 md:grid-cols-2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full rounded-2xl object-cover"
              />

              <div>
                <p className="font-semibold text-blue-600">
                  {selectedProduct.category}
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {selectedProduct.name}
                </h2>

                <p className="mt-4 text-slate-600">
                  {selectedProduct.description}
                </p>

                <p className="mt-6 text-2xl font-black">
                  {money(selectedProduct.price)}
                </p>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 p-4 text-white shadow-xl">
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            className="mt-2 text-sm font-bold text-blue-300"
          >
            Close
          </button>
        </div>
      )}

      <footer className="mt-12 bg-slate-900 px-6 py-10 text-center text-slate-300">
        <p className="text-xl font-black text-white">techstore.</p>
        <p className="mt-3">Your destination for modern technology.</p>
        <p className="mt-4 text-sm">© 2026 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}
