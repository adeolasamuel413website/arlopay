/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
