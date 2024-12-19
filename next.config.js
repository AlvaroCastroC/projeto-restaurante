import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,


  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["system-booking-images.s3.us-east-2.amazonaws.com"]
  }
};

export default config;


