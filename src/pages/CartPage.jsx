import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalPrice,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";

function BagIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="8" width="15" height="12.5" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M12 12v5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10h18l-2-6H5l-2 6Z" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      <path d="M10 16l4-4-4-4M14 12H3" />
    </svg>
  );
}

function formatMoney(amount) {
  return `R${Number(amount).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalPrice);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#e9e9e9] p-3 font-[Arial,sans-serif] text-[#1b2119] sm:p-5 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] gap-4 lg:gap-8">

        {/* Sidebar */}
        <aside className="relative flex w-[52px] shrink-0 flex-col items-center rounded-xl bg-white py-5 sm:w-[60px] sm:py-6 lg:w-[68px]">

          {/* Green logo */}
          <button
            type="button"
            onClick={() => navigate("/products")}
            aria-label="Go to products"
            className="mb-8 flex h-8 w-8 items-center justify-center"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7 5h12l-3 14H4L7 5Z" fill="#12bd91" />
              <path d="M7 5h12" stroke="#12bd91" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Hamburger menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-[#1b2119] transition hover:bg-gray-100"
          >
            <MenuIcon />
          </button>

          {/* Store */}
          <button
            type="button"
            onClick={() => navigate("/products")}
            aria-label="Browse products"
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-[#1b2119] transition hover:bg-gray-100"
          >
            <StoreIcon />
          </button>

          {/* Active bag */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Shopping bag"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b2119] text-white"
          >
            <BagIcon size={21} />
          </button>

          {/* Bottom red icon */}
          <button
            type="button"
            onClick={() => navigate("/products")}
            aria-label="Return to products"
            className="mt-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#f52f39] text-white transition hover:bg-red-600"
          >
            <ExitIcon />
          </button>

          {/* Menu dropdown */}
          {menuOpen && (
            <nav className="absolute left-[calc(100%+10px)] top-[82px] z-20 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/products");
                }}
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-normal text-[#1b2119] hover:bg-gray-100"
              >
                Browse products
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-normal text-[#1b2119] hover:bg-gray-100"
              >
                Shopping bag
              </button>
            </nav>
          )}
        </aside>

        {/* Main content and bag summary */}
        <div className="grid min-w-0 flex-1 grid-cols-1 content-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-10">

          {/* Cart items */}
          <section className="min-w-0 pt-4 sm:pt-7">
            <h1 className="mb-6 text-2xl font-normal tracking-normal text-[#1b2119] sm:mb-7 sm:text-[28px] lg:text-[30px]">
              Check your Bag Items
            </h1>

            {cartItems.length === 0 ? (
              <div className="rounded-2xl bg-white px-6 py-12 text-center sm:px-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#1b2119]">
                  <BagIcon size={26} />
                </div>

                <h2 className="text-xl font-normal text-[#1b2119]">
                  Your bag is empty
                </h2>

                <p className="mt-2 text-base font-normal text-gray-600">
                  Browse our products and add something you love.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="mt-6 rounded-xl bg-[#1b2119] px-6 py-3 text-sm font-normal text-white transition hover:bg-[#30382e] sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5 lg:gap-7 lg:p-6"
                  >
                    {/* Use the real product image from Redux */}
                    <div className="flex h-28 w-full shrink-0 items-center justify-center sm:h-[112px] sm:w-[125px] lg:w-[135px]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-normal text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product information */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h2 className="text-lg font-normal leading-tight text-[#1b2119] sm:text-xl">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm font-normal text-gray-500 sm:text-base">
                        {item.tag || item.variant || item.category}
                      </p>

                      <p className="mt-2 text-sm font-normal leading-relaxed text-[#33382f] sm:text-[15px]">
                        {item.description ||
                          "A carefully selected product for everyday use."}
                      </p>

                      {/* Rating */}
                      <div
                        className="mt-2 flex flex-wrap items-center gap-2 text-emerald-700"
                        aria-label="Rated 4.5 out of 5"
                      >
                        <span className="text-xl font-normal tracking-[1px] sm:text-2xl">
                          ★★★★☆
                        </span>
                        <span className="text-sm font-normal">
                          4.5 / 5
                        </span>
                      </div>

                      {/* Price and quantity */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm font-normal text-[#1b2119] sm:text-base">
                          {formatMoney(item.price)} × {item.quantity}
                        </p>

                        <div className="flex items-center gap-4 sm:gap-5">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() =>
                              dispatch(decreaseQty(item.id))
                            }
                            className="text-xl font-normal text-red-500 transition hover:text-red-700"
                          >
                            −
                          </button>

                          <span className="min-w-3 text-center text-sm font-normal text-[#1b2119]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() =>
                              dispatch(increaseQty(item.id))
                            }
                            className="text-xl font-normal text-emerald-600 transition hover:text-emerald-800"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Right-hand bag summary */}
          <aside className="min-w-0 border-t border-[#8b9089] py-6 lg:mt-1 lg:border-l lg:border-t-0 lg:py-4 lg:pl-6 xl:pl-8">
            <h2 className="mb-5 text-center text-2xl font-normal text-[#1b2119] sm:text-[26px]">
              Bag
            </h2>

            {cartItems.length > 0 ? (
              <>
                {/* Product thumbnails */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-lg bg-white p-2"
                      title={item.name}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <BagIcon size={24} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Bag total */}
                <p className="mt-5 text-center text-sm font-normal leading-relaxed text-[#1b2119] sm:text-base">
                  Bag Total:{" "}
                  <span className="ml-1 font-normal">
                    {formatMoney(totalAmount)}
                  </span>
                </p>

                {/* Checkout */}
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mx-auto mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#1b2119] px-5 py-3 text-sm font-normal text-white transition hover:bg-[#30382e] sm:text-base"
                >
                  <BagIcon size={18} />
                  Checkout
                </button>
              </>
            ) : (
              <p className="text-center text-sm font-normal text-gray-500">
                Your bag is empty.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CartPage;