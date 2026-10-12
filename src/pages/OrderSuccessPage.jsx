import { useNavigate } from "react-router-dom";

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#e9e9e9] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-[900px]">

        {/* Confirmation Card */}
        <section className="rounded-lg bg-white px-6 py-12 text-center shadow-sm sm:px-12">

          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-9 w-9 text-emerald-700"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-medium tracking-[0.12em] text-[#1b2119] sm:text-3xl">
            ORDER SUCCESSFUL!
          </h1>

          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6 text-gray-600 sm:text-base">
            Thank you for your order! Your order has been placed
            successfully.
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We appreciate your purchase.
          </p>

          {/* Order Status */}
          <div className="mx-auto mt-8 max-w-[520px] rounded-lg border border-gray-200 p-5 text-left">
            <h2 className="text-sm font-medium tracking-[0.12em] text-[#1b2119]">
              ORDER CONFIRMATION
            </h2>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">
                Order status
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                Successful
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-md bg-[#1b2119] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#30382e]"
            >
              Continue Shopping
            </button>

          </div>
        </section>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Thank you for shopping with us.
        </p>

      </div>
    </main>
  );
}

export default OrderSuccessPage;