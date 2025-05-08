// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add SVGR support for importing SVGs as React components
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },

    // If you need any other Next.js config options, add them here.
    // Internationalization is handled exclusively in next-i18next.config.js
};

export default nextConfig;
