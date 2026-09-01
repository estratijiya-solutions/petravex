import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export. Nothing here needs a server: the three API routes
  // were logging stubs that no component ever called, and every page is
  // prerendered. A Node process would only burn against the shared-hosting
  // process cap.
  output: 'export',
  reactStrictMode: true,
  images: {
    // No image optimiser behind a static export.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default withNextIntl(nextConfig);
