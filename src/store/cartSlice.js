import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseQty: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// MAKE SURE THIS EXPORT LINE IS AT THE BOTTOM:
export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } = cartSlice.actions;

// MAKE SURE SELECTORS ARE EXPORTED TOO:
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQty = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export default cartSlice.reducer;