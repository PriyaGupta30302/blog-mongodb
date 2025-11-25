/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true, // keep your option
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // allow uploads up to 5 MB
    },
  },
};

export default nextConfig;
