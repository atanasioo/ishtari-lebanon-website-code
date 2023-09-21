/** @type {import('next').NextConfig} */
// next.config.js

const nextConfig = {
  reactStrictMode: false,
  optimized:true,
  generateEtags: false,  // Disable etags
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,  // Cache inactive entries for 1 hour
    pagesBufferLength: 5,
  },
  images: {
    domains: ['www.ishtari.com', 'www.ishtari.com.gh', 'www.flo-lebanon.com', "www.energyplus-lb.com"], 
    unoptimized: true

  }}


module.exports = nextConfig


