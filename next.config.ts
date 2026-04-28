import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.dev-api.42.space' },
      { protocol: 'https', hostname: 'assets.42.space' },
      { protocol: 'https', hostname: '*.42.space' },
    ],
  },
}

export default nextConfig
