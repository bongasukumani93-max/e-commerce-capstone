import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { products } from './data/products';
import {
  addItem,
  removeItem,
  increaseQty,
  decreaseQty,
  clearCart,
  selectCartItems,
  selectCartTotalQty,
  selectCartTotalPrice,
} from './store/cartSlice';

function App() {
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const totalQty = useSelector(selectCartTotalQty);
  const totalPrice = useSelector(selectCartTotalPrice);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Our Store</h1>
      
      {/* Cart Summary */}
      <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h2>Cart Summary</h2>
        <p><strong>Total Items in Cart:</strong> {totalQty}</p>
        <p><strong>Total Cart Value:</strong> R{totalPrice.toFixed(2)}</p>
        {cartItems.length > 0 && (
          <button 
            onClick={() => dispatch(clearCart())}
            style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Products Section */}
      <h2>Products List</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>R{product.price.toFixed(2)}</p>
            <button
              onClick={() => dispatch(addItem(product))}
              style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Items in Cart */}
      <h2>Items in Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li 
              key={item.id} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}
            >
              <div>
                <strong>{item.name}</strong> — R{item.price.toFixed(2)} x {item.quantity}
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  (Subtotal: R{(item.price * item.quantity).toFixed(2)})
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => dispatch(decreaseQty(item.id))}
                  style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => dispatch(increaseQty(item.id))}
                  style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  +
                </button>
                <button 
                  onClick={() => dispatch(removeItem(item.id))}
                  style={{ marginLeft: '10px', color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;