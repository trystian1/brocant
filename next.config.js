/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const stylexPlugin = require('@stylexjs/nextjs-plugin');

module.exports = stylexPlugin({
  rootDir: __dirname,
})({});

module.exports = nextConfig
