/** @type {import('next').NextConfig} */
const withSerwist = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withSerwist({
  output: "standalone",  // Required for Docker / Cloud Run deployment
  turbopack: {},         // Silence Next.js 16 turbopack warning
});
