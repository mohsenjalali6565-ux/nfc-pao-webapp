/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let Vercel build even if there are TS type errors
  typescript: { ignoreBuildErrors: true },

  // Skip ESLint during production build on Vercel
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;