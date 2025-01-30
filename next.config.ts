// @ts-check

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    ppr: true,
    dynamicIO: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    webpackBuildWorker: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withNextIntl(config);
