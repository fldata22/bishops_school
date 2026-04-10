const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'avatar.iran.liara.run' },
      { protocol: 'https', hostname: 'bishops-school-api-3vlr1ol7.on-forge.com' },
    ],
  },
}

module.exports = withPWA(nextConfig)
