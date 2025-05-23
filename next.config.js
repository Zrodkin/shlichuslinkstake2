/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/logo192.png",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/logo512.png",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
