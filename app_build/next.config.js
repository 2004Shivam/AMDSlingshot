/** @type {import('next').NextConfig} */
const withSerwist = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withSerwist({
  turbopack: {},   // silence Next 16 turbopack warning
});
