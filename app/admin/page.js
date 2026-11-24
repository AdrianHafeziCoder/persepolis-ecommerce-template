'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { api, fa, CUR } from '@/lib/api';
import useMe from '@/lib/useMe';
import Nav from '@/components/Nav';
import { Faravahar } from '@/components/Art';

const H = ({ children }) => <h3 className="anim" style={{ color: 'var(--gold2)' }}>{children}</h3>;

export default function Admin() {
  const { user, loading } = useMe();
  const [prods, setProds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');
  const root = useRef();

  const refresh = useCallback(async () => {
    const [p, o, u] = await Promise.all([api('products'), api('orders'), api('users')]);
    setProds(p.products); setOrders(o.orders); setUsers(u.users);
  }, []);
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') { location.href = '/login'; return; }
    refresh();
  }, [loading, user, refresh]);

  const ok = !!user && user.role === 'admin';
  useEffect(() => {
    if (!ok) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out', clearProps: 'transform,opacity' });
    }, root);
    return () => ctx.revert();
  }, [ok]);

  if (!user || user.role !== 'admin') return null;
  const add = async (e) => {
    e.preventDefault(); const f = e.target; setErr('');
    try { await api('products', { method: 'POST', body: { name: f.n.value, ico: f.i.value, price: f.p.value } }); f.reset(); refresh(); }
    catch (x) { setErr(x.message); }
  };
  const del = async (id) => { await api('products/' + id, { method: 'DELETE' }); refresh(); };
  const setSt = async (id, status) => { await api('orders/' + id, { method: 'PATCH', body: { status } }); refresh(); };
  const rev = orders.reduce((a, o) => a + o.total, 0);
  return (<>
    <Nav user={user} />
    <div className="dash" ref={root}>
      <h2 className="anim">Admin Panel <Faravahar s={40} /></h2>
      <div className="stats anim">
        <div className="stat"><b>{fa(prods.length)}</b>Products</div>
        <div className="stat"><b>{fa(users.length)}</b>Users</div>
        <div className="stat"><b>{fa(orders.length)}</b>Orders</div>
        <div className="stat"><b>{fa(rev)}</b>Revenue ({CUR})</div>
      </div>
      <H>Products</H>
      <form className="row anim" style={{ marginBottom: 14 }} onSubmit={add}>
        <input name="n" placeholder="Product name" required />
        <input name="i" placeholder="Emoji" maxLength={4} defaultValue="🏺" />
        <input name="p" type="number" min="1" placeholder="Price" required />
        <button className="btn">Add</button>
      </form>
      {err && <p style={{ color: '#e07a5f' }}>{err}</p>}
      <div className="tw anim"><table><thead><tr><th>Name</th><th>Price</th><th /></tr></thead><tbody>
        {prods.map((p) => <tr key={p.id}><td>{p.ico} {p.name}</td><td>{fa(p.price)}</td><td><button className="btn o s" onClick={() => del(p.id)}>Delete</button></td></tr>)}
      </tbody></table></div>
      <H>Orders</H>
      <div className="tw anim"><table><thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((o) => <tr key={o.id}><td>{fa(o.id)}</td><td>{o.user}</td><td>{o.items}</td><td>{fa(o.total)}</td>
          <td><select style={{ margin: 0 }} value={o.status} onChange={(e) => setSt(o.id, e.target.value)}>
            {['Pending', 'Shipped', 'Delivered'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}
        {!orders.length && <tr><td colSpan={5}>No orders yet</td></tr>}
      </tbody></table></div>
      <H>Users</H>
      <div className="tw anim"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>
        {users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role === 'admin' ? 'Admin' : 'User'}</td></tr>)}
      </tbody></table></div>
    </div>
  </>);
}
