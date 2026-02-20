/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'standalone' output for Vercel deployment
  // output: 'standalone', // Only needed for Docker/self-hosting
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
};

module.exports = nextConfig;
