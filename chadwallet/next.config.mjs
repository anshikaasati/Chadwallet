/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "birdeye.so" },
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "shdw-drive.genesysgo.net" },
    ],
  },
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
