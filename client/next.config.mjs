/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/hapi/:path*",
        destination: `http://103.49.239.73:5000/:path*`,
      },
    ];
  },
};

export default nextConfig;
