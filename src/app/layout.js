// app/layout.js
export const metadata = {
    title: 'Tabled',
    description:
        "Tabled is a modern online food ordering platform where every user can quickly find their favorite menu items, add them to the cart, and place an order",
    icons: {
        icon: '/icon/logo/logo.svg',
    },
};

import './globals.css';
import ClientProviders from './ClientProviders';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    );
}
