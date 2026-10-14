import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import CartPage from "./pages/CartPage";

import products from "./data/products";

import {
  addItem,
  selectCartItems,
} from "./store/cartSlice";

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/products" replace />}
        />

        <Route
          path="/checkout/address"
          element={<AddressPage />}
        />

        <Route
          path="/checkout/payment"
          element={<PaymentPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />


       <Route
        path="/cart"
        element={<CartPage />}
       />


       <Route
          path="/order-success"
          element={<OrderSuccessPage />}
       />
        

        <Route
  path="/products"
  element={
     <main className="min-h-screen bg-[#e9e9e9] px-6 py-12">
  <div className="mx-auto max-w-6xl">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-medium text-[#1b2119]">
        Our Products
      </h1>

      <Link
        to="/cart"
        className="inline-flex items-center gap-2 rounded-md bg-[#1b2119] px-5 py-3 text-white transition hover:bg-gray-800"
      >
        <span aria-hidden="true">🛍️</span>
        <span>Shopping Bag</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-sm font-semibold text-[#1b2119]">
          {cartCount}
        </span>
      </Link>
    </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-lg bg-white p-4 shadow-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full rounded-md object-contain"
              />

              <p className="mt-4 text-sm text-gray-500">
                {product.category}
              </p>

              <h2 className="mt-1 text-lg font-medium text-gray-900">
                {product.name}
              </h2>

              <p className="mt-2 text-gray-700">
                {product.description}
              </p>

              <p className="mt-3 text-lg font-semibold text-gray-900">
                R{product.price.toLocaleString("en-ZA")}
              </p>

              <button
                type="button"
                onClick={() => dispatch(addItem(product))}
                className="mt-4 w-full rounded-md bg-black px-4 py-3 text-white transition hover:bg-gray-800"
              >
                Add to Cart
             </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  }
/>

        <Route
          path="*"
          element={<Navigate to="/products" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;