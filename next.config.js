/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's13emagst.akamaized.net',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
