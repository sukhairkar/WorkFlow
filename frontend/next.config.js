/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Required for Docker builds to work properly
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig;