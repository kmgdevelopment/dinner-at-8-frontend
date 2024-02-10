/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 's3.us-west-2.amazonaws.com',
          port: '',
          pathname: '/content.dinnerat8.kristengrote.com/**',
        },
      ],
    },
}

module.exports = nextConfig
