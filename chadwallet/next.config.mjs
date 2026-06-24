/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude Privy's optional peer dependencies that are not needed in this project
    config.externals.push({
      "@stripe/crypto": "commonjs @stripe/crypto",
      "@farcaster/mini-app-solana": "commonjs @farcaster/mini-app-solana",
    });
    return config;
  },
};

export default nextConfig;
