const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    i18n: {
        locales: ['en', 'de', 'fr', 'es', 'pl', 'it', 'ua'],
        defaultLocale: 'en',
    },
};

export default nextConfig;
