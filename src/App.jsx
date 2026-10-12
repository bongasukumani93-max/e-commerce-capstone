import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItem,
  increaseQty,
  decreaseQty,
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
} from './store/cartSlice';

export default function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
          YOUR SHOPPING CART
        </h1>
        <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 uppercase">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CART ITEMS LIST (Left side) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                
                {/* Product Image & Title */}
                <div className="flex items-center gap-4 w-2/5">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || "https://via.placeholder.com/150"} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base leading-snug">
                    {item.name}
                  </h3>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                    <button 
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="text-gray-500 hover:text-black font-bold px-2 text-lg"
                    >
                      –
                    </button>
                    <span className="px-3 font-semibold text-gray-800 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="text-gray-500 hover:text-black font-bold px-2 text-lg"
                    >
                      +
                    </button>
                  </div>
                  {item.quantity > 1 && (
                    <span className="text-xs text-gray-400 mt-1">
                      {item.quantity}x R {item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Individual Price */}
                <div className="text-gray-900 font-semibold text-sm">
                  R {item.price.toLocaleString()}
                </div>

                {/* Total Price for line item */}
                <div className="text-gray-900 font-bold text-base">
                  R {(item.price * item.quantity).toLocaleString()}
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => dispatch(removeItem(item.id))}
                  className="flex items-center text-red-600 hover:text-red-800 font-semibold text-sm gap-1"
                >
                  <span className="text-base">🗑</span> Remove
                </button>

              </div>
            ))}
          </div>

          {/* ORDER SUMMARY SIDEBAR (Right side) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">R {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes:</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Estimated Total:</span>
              <span>R {totalPrice.toLocaleString()}</span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors text-sm uppercase tracking-wider mb-6">
              Proceed to Checkout
            </button>

            <div className="flex justify-between items-center text-sm">
              <button className="text-gray-900 font-semibold underline hover:text-blue-600">
                Continue Shopping
              </button>
              <button 
                onClick={() => dispatch(clearCart())}
                className="text-gray-900 font-semibold underline hover:text-red-600"
              >
                Empty Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}