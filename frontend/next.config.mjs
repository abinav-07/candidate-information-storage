/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  // For hot reload
  webpackDevMiddleware: config => {
    config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
    }
    return config
},
// To fix import errors
transpilePackages: [
    'rc-util',
    'rc-table',
    'rc-tree',
      'rc-pagination',
    'rc-picker',
  '@ant-design',
  'antd',
  ],
};

export default nextConfig;
