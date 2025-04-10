// store.js
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import cartReducer from './slices/cartSlice';
import languageReducer from './slices/languageSlice';
import selectionReducer from './slices/selectionSlice';
import paramsReducer from './slices/paramsSlice';
import menuReducer from './slices/menuSlice'; // імпорт нового slice

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        cart: cartReducer,
        language: languageReducer,
        selection: selectionReducer,
        params: paramsReducer,
        menu: menuReducer, // додаємо
    },
});
