import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';

// Helper functions для роботи з localStorage
const saveCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

const initialState = []; // завжди початковий стан — порожній масив (для SSR)

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Дія для гідратації стану кошика (з client-side localStorage)
        hydrateCart: (state, action) => {
            return action.payload;
        },
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.find(item =>
                item.id === newItem.id &&
                item.dough === newItem.dough &&
                isEqual(item.extras, newItem.extras)
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = (
                    (existingItem.basePrice + existingItem.doughPrice + existingItem.extrasPrice) *
                    existingItem.quantity
                ).toFixed(2);
            } else {
                state.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    // Обчислюємо allergen: true, якщо в newItem.allergens є хоча б один елемент
                    allergen: Array.isArray(newItem.allergens) && newItem.allergens.length > 0
                });
            }
            saveCartToStorage(state);
        },
        removeFromCart: (state, action) => {
            const updated = state.filter(item => item.id !== action.payload);
            saveCartToStorage(updated);
            return updated;
        },
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                item.totalPrice = (
                    (item.basePrice + item.doughPrice + item.extrasPrice) *
                    item.quantity
                ).toFixed(2);
            }
            saveCartToStorage(state);
        },
        clearCart: () => {
            saveCartToStorage([]);
            return [];
        }
    }
});

export const { hydrateCart, addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
