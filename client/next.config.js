/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        // Add a path to the images directory
        pathname: "/uploads/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
