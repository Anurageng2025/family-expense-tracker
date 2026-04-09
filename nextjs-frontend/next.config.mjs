/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // Note: redirects are not supported with 'output: export'
    // async redirects() { ... }
};

export default nextConfig;
