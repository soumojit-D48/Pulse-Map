// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // Disable static optimization for pages that use dynamic imports
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '2mb',
//     },
//   },
//   // Ensure proper handling of dynamic imports
//   webpack: (config) => {
//     config.externals = [...(config.externals || []), { canvas: 'canvas' }];
//     return config;
//   },
// };

// export default nextConfig;








import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the webpack config - it's not needed and causes issues with Turbopack
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;