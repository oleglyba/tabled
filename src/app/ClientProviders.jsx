'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { useEffect } from 'react';
import { hydrateCart } from '@/redux/slices/cartSlice';

export default function ClientProviders({ children }) {
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            store.dispatch(hydrateCart(JSON.parse(storedCart)));
        }
    }, []);

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
