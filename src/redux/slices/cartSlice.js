import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';

const CART_EXPIRATION_MS = 24 * 60 * 60 * 1000;
const getCartStorageKey = (slug) => `cart_${slug}`;

const saveCartToStorage = (cart, slug) => {
    if (typeof window !== 'undefined' && slug) {
        const payload = { data: cart, savedAt: Date.now() };
        localStorage.setItem(getCartStorageKey(slug), JSON.stringify(payload));
    }
};

export const loadCartFromStorage = (slug) => {
    if (typeof window === 'undefined' || !slug) return [];
    const raw = localStorage.getItem(getCartStorageKey(slug));
    if (!raw) return [];
    try {
        const { data, savedAt } = JSON.parse(raw);
        if (!savedAt || Date.now() - savedAt > CART_EXPIRATION_MS) {
            localStorage.removeItem(getCartStorageKey(slug));
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('Error parsing cart from storage:', err);
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {},
    reducers: {
        hydrateCart: (_state, action) => {
            // action.payload is expected to be an object { [slug]: [...] }
            return action.payload || {};
        },

        addToCart: (state, action) => {
            const newItem = action.payload;
            const slug = newItem.slug;
            if (!slug) return;

            const cart = state[slug] || [];
            const existing = cart.find(item =>
                item.id === newItem.id &&
                item.dough === newItem.dough &&
                isEqual(item.extras, newItem.extras)
            );

            if (existing) {
                existing.quantity += newItem.quantity || 1;
                existing.totalPrice = (
                    (existing.basePrice + existing.doughPrice + existing.extrasPrice) *
                    existing.quantity
                ).toFixed(2);
            } else {
                cart.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    allergen: Array.isArray(newItem.allergens) && newItem.allergens.length > 0
                });
            }

            state[slug] = cart;
            saveCartToStorage(cart, slug);
        },

        removeFromCart: (state, action) => {
            const { id, slug } = action.payload;
            if (!slug || !state[slug]) return;
            state[slug] = state[slug].filter(item => item.id !== id);
            saveCartToStorage(state[slug], slug);
        },

        updateCartQuantity: (state, action) => {
            const { id, quantity, slug } = action.payload;
            if (!slug || !state[slug]) return;
            const item = state[slug].find(i => i.id === id);
            if (!item) return;

            item.quantity = quantity;
            item.totalPrice = (
                (item.basePrice + item.doughPrice + item.extrasPrice) *
                item.quantity
            ).toFixed(2);

            saveCartToStorage(state[slug], slug);
        },

        clearCart: (state, action) => {
            const { slug } = action.payload;
            if (!slug) return;
            state[slug] = [];
            saveCartToStorage([], slug);
        },
    },
});

export const {
    hydrateCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
