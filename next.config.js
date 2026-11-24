// Normal builds (npm run dev / Vercel) are unchanged.
// The GitHub Actions workflow sets GITHUB_PAGES and NEXT_PUBLIC_BASE_PATH to build a static site for GitHub Pages.
const onPages = !!process.env.GITHUB_PAGES;
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  ...(onPages && { output: 'export', trailingSlash: true, images: { unoptimized: true } }),
  ...(base && { basePath: base })
};
