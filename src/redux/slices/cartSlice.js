// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	items: [],
	totalQuantity: 0,
	totalPrice: 0,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItem: (state, action) => {
			const newItem = action.payload;
			const existingItem = state.items.find(item => item.id === newItem.id);
			
			if (existingItem) {
				existingItem.quantity += 1;
				existingItem.totalPrice += newItem.price;
			} else {
				state.items.push({
					...newItem,
					quantity: 1,
					totalPrice: newItem.price,
				});
			}
			state.totalQuantity += 1;
			state.totalPrice += newItem.price;
		},
		
		removeItem: (state, {payload}) => {
			const {id} = payload;
			const existingItem = state.items.find(item => item.id === id);
			
			if (existingItem) {
				state.totalQuantity -= existingItem.quantity;
				state.totalPrice -= existingItem.totalPrice;
				state.items = state.items.filter(item => item.id !== id);
			}
		},
		
		clearCart: (state) => {
			state.items = [];
			state.totalQuantity = 0;
			state.totalPrice = 0;
		}
	},
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;