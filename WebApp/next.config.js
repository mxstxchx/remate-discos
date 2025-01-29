/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Add Supabase storage domain here once configured
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig