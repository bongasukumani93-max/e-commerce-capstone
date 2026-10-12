import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    increaseQty: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQty: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotalPrice = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;