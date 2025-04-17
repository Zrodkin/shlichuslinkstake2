// next.config.js

/** @type {import('next').NextConfig} */
module.exports = async () => ({
  reactStrictMode: true,

  headers: async () => [
    {
      source: "/manifest.json",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" }
      ],
    },
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
  ]
});
