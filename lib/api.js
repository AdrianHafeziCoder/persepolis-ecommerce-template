// Front-end-only replacement for a backend. Components call api('products'), api('orders', {...}) etc.
// exactly as before, but everything is answered locally from lib/store.js (no server, no network).
// To use a real backend later, replace the body of `api` with a fetch('/api/' + url, ...) call.
import { load, save, session, setSession, pub } from './store';
import { ORDER_STATUSES } from './data';

export const fa = (n) => Number(n).toLocaleString('en-US');
export const CUR = 'Toman'; // change to '$' (and move it before the number) if you prefer dollars

const err = (m) => { throw new Error(m); };

function route(url, method, b) {
  const [res, seg] = url.split('/');
  const id = res === 'auth' ? undefined : seg; // 'auth/login' is a fixed route; 'orders/12' carries an id
  const d = load();
  const sid = session();
  const u = sid ? d.users.find((x) => x.id === sid) || null : null;
  const needAdmin = () => { if (u?.role !== 'admin') err('Access denied'); };
  const needUser = () => { if (!u) err('Please log in first'); };
  const key = res === 'auth' ? `${method} auth/${seg}` : `${method} ${res}${id ? '/:id' : ''}`;

  switch (key) {
    case 'GET auth/me':
      return { user: pub(u) };

    case 'POST auth/register': {
      const em = String(b.email || '').trim().toLowerCase();
      if (!b.name?.trim() || !/^\S+@\S+\.\S+$/.test(em) || String(b.password || '').length < 6)
        err('Invalid input (password must be at least 6 characters)');
      if (d.users.some((x) => x.email === em)) err('This email is already registered');
      const nu = { id: ++d.seq, name: b.name.trim().slice(0, 60), email: em, password: b.password, role: 'user' };
      d.users.push(nu); save(d); setSession(nu.id);
      return { user: pub(nu) };
    }

    case 'POST auth/login': {
      const em = String(b.email || '').trim().toLowerCase();
      const lu = d.users.find((x) => x.email === em && x.password === String(b.password || ''));
      if (!lu) err('Incorrect email or password');
      setSession(lu.id);
      return { user: pub(lu) };
    }

    case 'POST auth/logout':
      setSession(null);
      return { ok: true };

    case 'GET products':
      return { products: d.products };

    case 'POST products': {
      needAdmin();
      if (!b.name?.trim() || !(Number(b.price) > 0)) err('Invalid input');
      const p = { id: ++d.seq, name: b.name.trim().slice(0, 80), ico: (b.ico || '🏺').slice(0, 4), price: Math.round(Number(b.price)) };
      d.products.push(p); save(d);
      return { product: p };
    }

    case 'DELETE products/:id':
      needAdmin();
      d.products = d.products.filter((p) => p.id !== Number(id)); save(d);
      return { ok: true };

    case 'GET orders':
      needUser();
      return { orders: u.role === 'admin' ? d.orders : d.orders.filter((o) => o.uid === u.id) };

    case 'POST orders': {
      needUser();
      const items = (Array.isArray(b.ids) ? b.ids : []).map((x) => d.products.find((p) => p.id === Number(x))).filter(Boolean);
      if (!items.length) err('Your cart is empty');
      // The total is calculated from the products array, never from what the page sends
      const o = { id: ++d.seq, uid: u.id, user: u.name, items: items.map((p) => p.name).join(', '), total: items.reduce((a, p) => a + p.price, 0), status: ORDER_STATUSES[0], at: new Date().toISOString() };
      d.orders.push(o); save(d);
      return { order: o };
    }

    case 'PATCH orders/:id': {
      needAdmin();
      if (!ORDER_STATUSES.includes(b.status)) err('Invalid status');
      const o = d.orders.find((x) => x.id === Number(id));
      if (!o) err('Not found');
      o.status = b.status; save(d);
      return { order: o };
    }

    case 'GET users':
      needAdmin();
      return { users: d.users.map(pub) };

    default:
      return err('Not found');
  }
}

// Same signature as the old fetch-based helper, so no component had to change.
export const api = (url, opt = {}) =>
  Promise.resolve().then(() => route(url, (opt.method || 'GET').toUpperCase(), opt.body || {}));
