// ─────────────────────────────────────────────────────────────
// All demo data lives here as plain arrays. Edit them to customize the template.
// The app copies these arrays into the browser (localStorage) on the first visit;
// after that, signups, orders, and admin changes are saved in the visitor's browser.
// If you change the arrays below, bump DATA_VERSION so returning visitors get the new data.
// ─────────────────────────────────────────────────────────────
export const DATA_VERSION = 1;

export const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered'];

export const PRODUCTS = [
  { id: 1, name: 'Golden Lion-Handled Rhyton', ico: '🏺', price: 4800000 },
  { id: 2, name: 'Gold Daric Coin', ico: '🪙', price: 1200000 },
  { id: 3, name: 'Royal Cup of Parsa', ico: '🏆', price: 3500000 },
  { id: 4, name: 'Persepolis Relief Rug', ico: '🧶', price: 9500000 },
  { id: 5, name: 'Akinakes Dagger', ico: '🗡️', price: 2700000 },
  { id: 6, name: 'Faravahar Pendant', ico: '📿', price: 1900000 }
];

// Demo accounts. Passwords are plain text because this is a front-end-only demo (see README).
export const USERS = [
  { id: 1, name: 'Admin', email: 'h@gmail.com', password: '12345678', role: 'admin' }
];

export const ORDERS = [];
