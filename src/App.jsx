import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/checkout/address" replace />}
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
          path="/order-success"
          element={<OrderSuccessPage />}
       />
        <Route
          path="*"
          element={<Navigate to="/checkout/address" replace />}
        />

        <Route
         path="/products"
         element={
        <main className="min-h-screen bg-[#e9e9e9] px-6 py-12">
        <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-medium text-[#1b2119]">
          Our Products
        </h1>

        <p className="mt-3 text-gray-600">
          The shopping page will be connected here.
        </p>
      </div>
    </main>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;