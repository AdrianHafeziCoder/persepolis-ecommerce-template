// Tiny browser-side "database": the arrays from lib/data.js, saved in localStorage.
import { DATA_VERSION, PRODUCTS, USERS, ORDERS } from './data';

const DB_KEY = 'rb_db';
const SESSION_KEY = 'rb_session';
const mem = {}; // fallback when localStorage is blocked (private mode, etc.)

const clone = (x) => JSON.parse(JSON.stringify(x));
const read = (k) => {
  try { const v = localStorage.getItem(k); if (v) return JSON.parse(v); } catch {}
  return mem[k] ? clone(mem[k]) : null;
};
const write = (k, v) => {
  mem[k] = clone(v);
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

const seed = () => ({ v: DATA_VERSION, seq: 100, users: clone(USERS), products: clone(PRODUCTS), orders: clone(ORDERS) });

export function load() {
  let d = read(DB_KEY);
  if (!d || d.v !== DATA_VERSION) { d = seed(); write(DB_KEY, d); }
  return d;
}
export const save = (d) => write(DB_KEY, d);

export const session = () => read(SESSION_KEY);
export const setSession = (id) => {
  mem[SESSION_KEY] = id;
  try { id ? localStorage.setItem(SESSION_KEY, JSON.stringify(id)) : localStorage.removeItem(SESSION_KEY); } catch {}
};

export const pub = (u) => u && { id: u.id, name: u.name, email: u.email, role: u.role };

// Wipe everything saved in this browser and start again from lib/data.js
export function resetDemo() {
  try { localStorage.removeItem(DB_KEY); localStorage.removeItem(SESSION_KEY); } catch {}
  delete mem[DB_KEY]; delete mem[SESSION_KEY];
}
