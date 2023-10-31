/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/rounds/:round_id/proposals/:prop_id',
        destination: '/proposals/:prop_id',
      },
    ];
  },
  images: {
    domains: ['metadata.ens.domains'],
  },
};

module.exports = nextConfig;
