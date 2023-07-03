/** @type {import('next').NextConfig} */
// next.config.js
const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const buildInfo = require('./build-info.js');

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['www.ishtari.com', 'www.ishtari.com.gh', 'www.flo-lebanon.com', "www.energyplus-lb.com"],
  }


}


module.exports = nextConfig

// module.exports = (phase, { defaultConfig }) => {
//   if (phase === PHASE_PRODUCTION_BUILD) {
//     // Set build date as an environment variable
//     process.env.BUILD_DATE = buildInfo.buildDate;
//   }

//   return defaultConfig;
// };
