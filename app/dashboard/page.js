'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { api, fa, CUR } from '@/lib/api';
import { go } from '@/lib/base';
import { getCart, setCart } from '@/lib/cart';
import useMe from '@/lib/useMe';
import Nav from '@/components/Nav';

export default function Dashboard() {
  const { user, loading } = useMe();
  const [prods, setProds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setC] = useState([]);
  const [msg, setMsg] = useState('');
  const root = useRef();

  const refresh = useCallback(() => {
    setC(getCart());
    api('products').then((j) => setProds(j.products));
    api('orders').then((j) => setOrders(j.orders)).catch(() => {});
  }, []);
  useEffect(() => { if (!loading && !user) go('/login'); if (user) refresh(); }, [loading, user, refresh]);
  const ok = !!user;
  useEffect(() => {
    if (!ok) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out', clearProps: 'transform,opacity' });
    }, root);
    return () => ctx.revert();
  }, [ok]);

  if (!user) return null;
  const items = cart.map((id) => prods.find((p) => p.id === id)).filter(Boolean);
  const total = items.reduce((a, p) => a + p.price, 0);
  const rm = (i) => { const c = [...cart]; c.splice(i, 1); setCart(c); setC(c); };
  const checkout = async () => {
    try { await api('orders', { method: 'POST', body: { ids: cart } }); setCart([]); setMsg('Order placed ✓'); refresh(); }
    catch (e) { setMsg(e.message); }
  };
  return (<>
    <Nav user={user} />
    <div className="dash" ref={root}>
      <h2 className="anim">Hello, {user.name} 👑</h2>
      <div className="stats anim">
        <div className="stat"><b>{fa(items.length)}</b>In cart</div>
        <div className="stat"><b>{fa(orders.length)}</b>Orders</div>
        <div className="stat"><b>{fa(total)}</b>Cart total ({CUR})</div>
      </div>
      {msg && <p className="anim" style={{ color: 'var(--gold2)' }}>{msg}</p>}
      <h3 className="anim" style={{ color: 'var(--gold2)' }}>Shopping Cart</h3>
      <div className="tw anim"><table><thead><tr><th>Item</th><th>Price</th><th /></tr></thead><tbody>
        {items.map((p, i) => <tr key={i}><td>{p.name}</td><td>{fa(p.price)}</td><td><button className="btn o s" onClick={() => rm(i)}>Remove</button></td></tr>)}
        {!items.length && <tr><td colSpan={3}>Your cart is empty</td></tr>}
      </tbody></table></div>
      {items.length > 0 && <button className="btn anim" onClick={checkout}>Place Order</button>}
      <h3 className="anim" style={{ color: 'var(--gold2)', marginTop: 30 }}>My Orders</h3>
      <div className="tw anim"><table><thead><tr><th>#</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((o) => <tr key={o.id}><td>{fa(o.id)}</td><td>{o.items}</td><td>{fa(o.total)}</td><td>{o.status}</td></tr>)}
        {!orders.length && <tr><td colSpan={4}>You have no orders yet</td></tr>}
      </tbody></table></div>
    </div>
  </>);
}
