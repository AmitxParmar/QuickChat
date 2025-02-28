/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 209392776,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "41057fd84869483ae47f13360c1cea5b",
  },
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
