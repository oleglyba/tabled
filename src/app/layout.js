import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata = {
    title: 'Tabled',
    description:
        "Tabled is a modern online food ordering platform where every user can quickly find their favorite menu items, add them to the cart, and place an order",
    icons: {
        icon: '/icon/logo/logo.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <title>{metadata.title}</title>
            <meta
                name="description"
                content="Tabled is a modern online food ordering platform where every user can quickly find their favorite menu items, add them to the cart, and place an order"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, viewport-fit=cover"
            />
            {/* для Android */}
            <meta name="theme-color" content="#000000"/>
            {/* для iOS PWA */}
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
            <link rel="apple-touch-icon" href="/icon/logo/logo.svg"/>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </head>

        <body>
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    );
}
