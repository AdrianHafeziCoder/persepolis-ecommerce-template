# Royal Bazaar — Achaemenid Store Template (Next.js) [LIVE](https://adrianhafezicoder.github.io/persepolis-ecommerce-template/)

A front-end-only e-commerce template with an Achaemenid / Persepolis theme.
React + Next.js (App Router) and GSAP scroll animations. **No backend, no database, no environment variables.**

## Features
- Persepolis gates that open on scroll and close again when you scroll back (GSAP ScrollTrigger, `scrub`)
- Store page, shopping cart, orders
- Login and sign-up pages
- User dashboard and admin dashboard (add/delete products, update order status, view users)
- Responsive layout, favicon

## Run (PowerShell)
```
npm install
npm run dev
```
Open http://localhost:3000.

## Where the data lives
Everything is a plain array in `lib/data.js`: `PRODUCTS`, `USERS`, `ORDERS`, `ORDER_STATUSES`.
On the first visit the arrays are copied into the browser's localStorage; sign-ups, orders and admin changes are then saved there (per browser, not shared between visitors).

- Edit the arrays to change the shop, then bump `DATA_VERSION` so returning visitors get the new data.
- Demo admin account: see `USERS` in `lib/data.js`.
- `resetDemo()` in `lib/store.js` wipes the saved browser data.

## Structure
- `lib/data.js` — the arrays (products, users, orders)
- `lib/store.js` — saves the arrays in localStorage
- `lib/api.js` — small local "API" used by every component (same calls a real backend would get)
- `components/Gate.js` — Persepolis gates
- `components/Shop.js`, `Nav.js`, `AuthForm.js`, `Art.js`
- Pages: `/`, `/login`, `/register`, `/dashboard`, `/admin`
- `app/globals.css` — all styles and colors (`:root` variables at the top)

## Important
This is a demo. Sign-in is simulated in the browser: passwords are stored in plain text and anyone can read them in the page source or DevTools. Do not use real passwords or real customer data.
To add a real backend later, replace the body of `api()` in `lib/api.js` with `fetch` calls to your server (and hash passwords there).

## Deploy
- **Vercel / any Next.js host:** no settings or variables are needed.
- **GitHub Pages:** in the repository go to Settings → Pages and set Source to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds a static export on every push to `main`. The site appears at `https://<username>.github.io/<repo-name>/`.
  (If you use a custom domain, remove the `NEXT_PUBLIC_BASE_PATH` line from the workflow.)
- Use `go('/path')` from `lib/base.js` for redirects, so they keep working under the Pages sub-path.
