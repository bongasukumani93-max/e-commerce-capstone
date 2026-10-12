
import { useMemo, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "./store/cartSlice";
import ProductCard from "./components/ProductCard";
import CheckoutPage from "./pages/CheckoutPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
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
    description: "A premium laptop for professional productivity."
  },
  {
    id: 6,
    name: "Samsung Galaxy Smartphone",
    category: "Phones",
    price: 15999,
    oldPrice: 17999,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop",
    description: "A powerful Android smartphone for everyday use."
  },
  {
    id: 7,
    name: "Smart Fitness Watch",
    category: "Watches",
    price: 2999,
    oldPrice: 3999,
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop",
    description: "Track your activity with a modern smartwatch."
  },
  {
    id: 8,
    name: "Wireless Headphones",
    category: "Accessories",
    price: 1999,
    oldPrice: 2799,
    tag: "Deal",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop",
    description: "Wireless headphones for entertainment and travel."
  }
];

const categories = [
  "All Products",
  "Laptops",
  "Phones",
  "Watches",
  "Accessories"
];

const money = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR"
  }).format(Number(amount) || 0);

function Storefront() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const cart = Array.isArray(cartState)
    ? cartState
    : cartState?.items || [];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [sort, setSort] = useState("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All Products" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

  const cartCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * (Number(item.quantity) || 1),
    0
  );

  function addToCart(product) {
    dispatch(addItem(product));
    setNotice(`${product.name} added to cart`);
  }

  function removeFromCart(product) {
    dispatch(removeItem(product.id));
  }

  function selectCategory(value) {
    setCategory(value);
    setMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth"
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-black"
          >
            techstore<span className="text-blue-600">.</span>
          </button>

          <nav className="hidden gap-6 font-semibold md:flex">
            <a href="#home">Home</a>
            <a href="#products">Shop</a>
            <a href="#categories">Categories</a>
          </nav>

          <button
            onClick={() =>
              document.getElementById("cart")?.scrollIntoView({
                behavior: "smooth"
              })
            }
            className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Cart ({cartCount})
          </button>
        </div>

        {menuOpen && (
          <div className="border-t bg-white px-6 py-5 shadow-lg">
            <div className="mx-auto flex max-w-7xl flex-col gap-4">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => selectCategory(item)}
                  className="text-left font-semibold hover:text-blue-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {notice && (
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-xl bg-blue-50 px-5 py-3 text-blue-800">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>✕</button>
        </div>
      )}

      <main>
        <section id="home" className="mx-auto max-w-7xl px-5 py-8">
          <div className="overflow-hidden rounded-3xl bg-slate-950 text-white">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-14">
              <div>
                <p className="font-bold tracking-widest text-blue-400">
                  NEW SEASON. NEW TECHNOLOGY.
                </p>

                <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  Discover your next favourite tech.
                </h1>

                <p className="mt-6 text-lg text-slate-300">
                  Explore laptops, smartphones, smartwatches and accessories
                  at great prices.
                </p>

                <a
                  href="#products"
                  className="mt-8 inline-block rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-700"
                >
                  Shop Now
                </a>
              </div>

              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop"
                alt="Technology products"
                className="h-80 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-5 py-8">
          <h2 className="mb-6 text-3xl font-black">Shop by Category</h2>

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

        <section id="products" className="mx-auto max-w-7xl px-5 py-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Featured Products</h2>
              <p className="mt-2 text-slate-500">
                Discover the latest technology.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {visibleProducts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <div key={product.id}>
                 <div
  onClick={(event) => {
    if (event.target.closest("button")) return;
    navigate(`/product/${product.id}`);
  }}
  className="cursor-pointer"
>
  <ProductCard
    product={product}
    money={money}
    onAddToCart={addToCart}
  />
</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-10 text-center">
              No products found.
            </p>
          )}
        </section>

        <section id="cart" className="mx-auto max-w-7xl px-5 py-12">
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-black">
              Shopping Cart ({cartCount})
            </h2>

            {cart.length === 0 ? (
              <p className="text-slate-500">
                Your cart is empty. Add products to get started.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        )}

                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-slate-500">
                            {money(item.price)} × {item.quantity || 1}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                  <p className="text-2xl font-black">
                    Total: {money(cartTotal)}
                  </p>

                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: { cartItems: cart, items: cart }
                      })
                    }
                    className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-black">
            techstore<span className="text-blue-500">.</span>
          </h2>
          <p className="mt-3 text-slate-300">
            Your destination for modern technology.
          </p>
          <p className="mt-5 text-sm text-slate-400">
            © 2026 TechStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = products.find((item) => String(item.id) === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl p-10">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <button onClick={() => navigate("/")} className="mt-5 text-blue-600">
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/")}
          className="mb-8 font-semibold text-blue-600"
        >
          ← Back to Store
        </button>

        <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl object-cover"
          />

          <div>
            <p className="font-bold text-blue-600">{product.category}</p>
            <h1 className="mt-4 text-4xl font-black">{product.name}</h1>
            <p className="mt-5 text-slate-600">{product.description}</p>

            <p className="mt-8 text-3xl font-black">
              {money(product.price)}
            </p>

            <button
              onClick={() => dispatch(addItem(product))}
              className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/")}
              className="ml-4 rounded-xl border px-6 py-4 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/address" element={<AddressPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="*" element={<Storefront />} />
    </Routes>
  );
}
