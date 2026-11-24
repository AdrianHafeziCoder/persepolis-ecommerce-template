// Base path of the site. Empty normally; set to '/<repo-name>' when building for GitHub Pages.
// Use go('/login') instead of location.href = '/login' so redirects keep working under that sub-path.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const go = (path) => { location.href = BASE + path; };
