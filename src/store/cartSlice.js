
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addItem: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          price: Number(product.price) || 0,
          quantity: 1,
        });
      }
    },

    removeItem: (state, action) => {
      const id = action.payload;

      state.items = state.items.filter(
        (item) => String(item.id) !== String(id)
      );
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (product) =>
          String(product.id) === String(action.payload)
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (product) =>
          String(product.id) === String(action.payload)
      );

      if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (product) =>
              String(product.id) !== String(action.payload)
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
