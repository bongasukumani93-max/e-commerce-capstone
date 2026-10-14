import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../store/cartSlice";


const ADDRESS_STORAGE_KEY = "ecommerce-default-address";
const PAYMENT_STORAGE_KEY = "ecommerce-default-payment";


const DEMO_ADDRESS = {
  shippingName: "John Maker",
  streetName: "123 Plae Grond Street",
  city: "Vermont",
  state: "California",
  country: "United States of America",
};

const SHIPPING_FEE = 6.99;
const ESTIMATED_TAX_RATE = 0.13;
const GIFT_CARD_BALANCE = 0;

function readStoredValue(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function formatMoney(amount) {
  return `R${Number(amount).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ProductPlaceholder({ category }) {
  const icon =
    category === "laptop"
      ? "💻"
      : category === "phone"
        ? "📱"
        : "⌚";

  return (
    <div
      aria-hidden="true"
      className="flex h-[88px] w-[112px] shrink-0 items-center justify-center bg-transparent text-5xl sm:h-[100px] sm:w-[132px]"
    >
      {icon}
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
const products = useSelector(selectCartItems);
const cartTotal = useSelector(selectCartTotalPrice);
    
  const [giftCard] = useState(GIFT_CARD_BALANCE);
  const [notice, setNotice] = useState("");

  const shippingAddress =
    location.state?.shippingAddress ||
    readStoredValue(ADDRESS_STORAGE_KEY) ||
    DEMO_ADDRESS;

  const paymentMethod =
    location.state?.paymentMethod ||
    readStoredValue(PAYMENT_STORAGE_KEY);

  const subtotal = cartTotal;

  const estimatedGST = subtotal * ESTIMATED_TAX_RATE;
  const shipping = products.length > 0 ? SHIPPING_FEE : 0;

  const appliedGiftCard = Math.min(
    Math.max(0, Number(giftCard) || 0),
    subtotal + estimatedGST + shipping
  );

  const orderTotal = Math.max(
    0,
    subtotal + shipping + estimatedGST - appliedGiftCard
  );

  const changeQuantity = (productId, amount) => {
  setNotice("");

  if (amount > 0) {
    dispatch(increaseQty(productId));
  } else {
    dispatch(decreaseQty(productId));
  }
};

  const handlePlaceOrder = () => {
    if (products.length === 0) {
      setNotice(
        "Your bag is empty. Add products before placing an order."
      );
      return;
    }

    const order = {
      items: products,
      shippingAddress,
      paymentMethod: paymentMethod
        ? {
            label:
              paymentMethod.label ||
              (paymentMethod.last4
                ? `Card ending in ${paymentMethod.last4}`
                : "Selected payment method"),
          }
        : null,
      subtotal,
      shipping,
      estimatedGST,
      giftCard: appliedGiftCard,
      total: orderTotal,
      currency: "ZAR",
    };

    // Demo order only; no real payment is processed.
    dispatch(clearCart());
    
    navigate("/order-success", {
      state: { order },
    });
  };

  const paymentLabel = paymentMethod
    ? paymentMethod.label ||
      (paymentMethod.last4
        ? `Mastercard ending in ${paymentMethod.last4}`
        : "Selected payment method")
    : "No payment method selected";

  return (
    <main className="min-h-screen bg-[#e9e9e9] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1296px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_258px] lg:gap-[clamp(32px,7vw,108px)]">

        {/* Main checkout content */}
        <div className="min-w-0 space-y-[14px]">

          {/* Shipping Address */}
          <section className="rounded-[9px] bg-white px-[16px] py-[20px] sm:px-[18px] sm:py-[22px]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] font-medium tracking-[0.18em] text-[#1b2119] sm:text-[23px]">
                  SHIPPING ADDRESS
                </h2>

                <div className="mt-[12px] text-[14px] leading-[23px] text-[#1b2119]">
                  <p>{shippingAddress.shippingName}</p>
                  <p>{shippingAddress.streetName}</p>
                  <p>
                    {[shippingAddress.city, shippingAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/checkout/address", {
                    state: { shippingAddress },
                  })
                }
                className="shrink-0 self-center rounded-[7px] border border-[#777d76] px-[11px] py-[5px] text-[11px] text-[#1b2119] transition hover:bg-gray-100"
              >
                Change
              </button>
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-[9px] bg-white px-[16px] py-[20px] sm:px-[18px] sm:py-[22px]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">

                {/* Increased heading font size */}
                <h2 className="text-[24px] font-medium tracking-[0.19em] text-[#1b2119] sm:text-[25px]">
                  PAYMENT METHOD
                </h2>

                {/* Increased payment detail font size and line height */}
                <div className="mt-[12px] space-y-[9px] text-[15px] leading-[23px] text-[#1b2119]">

                  {/* Selected payment card */}
                  <p className="flex items-center gap-[8px]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-[17px] w-[17px] shrink-0 text-[#168b69]"
                    >
                      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 4v2h18V9H3Z" />
                    </svg>

                    <span>{paymentLabel}</span>
                  </p>

                  {/* Gift card balance */}
                  <p className="flex items-center gap-[8px]">
                    <span
                      aria-hidden="true"
                      className="text-[17px] leading-none text-[#1b2119]"
                    >
                      ▦
                    </span>

                    <span>
                      {formatMoney(appliedGiftCard)} gift card balance
                    </span>
                  </p>

                  {/* Billing address */}
                  <p className="flex items-center gap-[8px]">
                    <span
                      aria-hidden="true"
                      className="text-[17px] leading-none text-[#168b69]"
                    >
                      ▣
                    </span>

                    <span>
                      Billing address same as Shipping Address
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/checkout/payment", {
                    state: { shippingAddress },
                  })
                }
                className="shrink-0 self-center rounded-[7px] border border-[#777d76] px-[11px] py-[5px] text-[11px] text-[#1b2119] transition hover:bg-gray-100"
              >
                Change
              </button>
            </div>
          </section>

          {/* Review Your Bag */}
          <section className="rounded-[9px] bg-white px-[16px] py-[20px] sm:px-[18px] sm:py-[22px]">
            <h2 className="text-[22px] font-medium tracking-[0.18em] text-[#1b2119] sm:text-[23px]">
              REVIEW YOUR BAG
            </h2>

            {products.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[15px] text-gray-600">
                  Your bag is currently empty.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mt-4 rounded-md bg-[#1b2119] px-5 py-2 text-[14px] text-white hover:bg-[#30382d]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="mt-[20px] divide-y divide-[#c9c9c9]">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-x-3 py-[20px] first:pt-[12px] sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-x-[12px]"
                  >
                    {/* Product image */}
                    <div className="flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-[95px] w-full object-contain sm:h-[110px]"
                        />
                      ) : (
                        <ProductPlaceholder
                          category={product.category}
                        />
                      )}
                    </div>

                    {/* Product details and quantity controls */}
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-medium text-[#1b2119]">
                        {product.name}
                      </h3>

                      <p className="mt-[4px] text-[14px] text-gray-500">
                        {product.variant || ""}
                      </p>

                      {product.description && (
                        <p className="mt-[8px] line-clamp-2 text-[13px] leading-[19px] text-[#1b2119]">
                          {product.description}
                        </p>
                      )}

                      {product.rating && (
                        <div className="mt-[7px] flex items-center gap-[9px] text-[13px]">
                          <span
                            aria-label={`${product.rating} out of 5 stars`}
                            className="whitespace-nowrap tracking-[1px] text-[#168b69]"
                          >
                            ★★★★☆
                          </span>

                          <span className="text-[#168b69]">
                            {product.rating} / 5
                          </span>
                        </div>
                      )}

                      <div className="mt-[14px] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-[7px] whitespace-nowrap text-[13px] text-[#1b2119]">
                          <span>
                            {formatMoney(Number(product.price || 0))}
                          </span>
                          <span>×</span>
                          <span>{product.quantity}</span>
                        </div>

                        {/* Quantity controls on the far right */}
                        <div
                          className="flex shrink-0 items-center gap-[10px] text-[13px]"
                          aria-label={`Quantity for ${product.name}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(product.id, -1)
                            }
                            aria-label={`Decrease ${product.name} quantity`}
                            className="text-[17px] leading-none text-red-600 hover:text-red-800"
                          >
                            −
                          </button>

                          <span className="min-w-[8px] text-center text-[#1b2119]">
                            {product.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(product.id, 1)
                            }
                            aria-label={`Increase ${product.name} quantity`}
                            className="text-[17px] leading-none text-emerald-600 hover:text-emerald-800"
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
        </div>

        {/* Order Summary */}
        <aside className="h-fit lg:sticky lg:top-5">
          <div className="rounded-[9px] bg-white p-[16px]">
            <h3 className="text-[16px] font-medium text-[#1b2119]">
              Order Summary
            </h3>

            <div className="mt-[13px] space-y-[11px] text-[13px] text-[#697064]">
              <div className="flex justify-between gap-2">
                <span>Items:</span>
                <span className="text-right">
                  {formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span>Shipping:</span>
                <span className="text-right">
                  {formatMoney(shipping)}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span>Estimated GST:</span>
                <span className="text-right">
                  {formatMoney(estimatedGST)}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span>Gift Card:</span>
                <span className="text-right">
                  {formatMoney(appliedGiftCard)}
                </span>
              </div>

              <hr className="border-[#dedede]" />

              <div className="flex items-start justify-between gap-2 text-[15px] font-medium text-red-600">
                <span className="shrink-0">Order Total:</span>
                <span className="text-right">
                  {formatMoney(orderTotal)}
                </span>
              </div>
            </div>

            {notice && (
              <p role="alert" className="mt-3 text-[13px] text-red-600">
                {notice}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={products.length === 0}
              className="mt-[14px] w-full whitespace-nowrap rounded-[6px] bg-[#1b2119] px-[10px] py-[8px] text-[13px] font-medium text-white transition hover:bg-[#30382d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place your order
            </button>
          </div>

          {/* Back button outside and below the Order Summary */}
          <div className="mt-[14px] flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex min-w-[92px] items-center justify-center gap-[9px] rounded-[6px] border border-[#777d76] bg-transparent px-[25px] py-[6px] text-[12px] text-[#1b2119] transition hover:bg-white"
            >
              <span
                aria-hidden="true"
                className="text-[15px] leading-none"
              >
                ‹
              </span>

              <span>Back</span>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;