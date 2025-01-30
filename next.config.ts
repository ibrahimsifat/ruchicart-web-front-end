// @ts-check

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    ppr: true,
    dynamicIO: true,
  },
};

module.exports = withNextIntl(config);
