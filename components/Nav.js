'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fa } from '@/lib/api';
import { getCart } from '@/lib/cart';

export default function Nav({ user }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const f = () => setN(getCart().length);
    f(); window.addEventListener('cart', f);
    return () => window.removeEventListener('cart', f);
  }, []);
  const out = async () => { await api('auth/logout', { method: 'POST' }); location.href = '/'; };
  return (
    <nav>
      <b>𐎠 Royal Bazaar</b>
      <Link href="/">Home</Link>
      {user ? (<>
        <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>{user.role === 'admin' ? 'Admin Panel' : 'My Account'}</Link>
        <button onClick={out}>Log Out</button>
      </>) : (<>
        <Link href="/login">Log In</Link>
        <Link className="btn" href="/register">Sign Up</Link>
      </>)}
      <Link href="/dashboard">🛒 {fa(n)}</Link>
    </nav>
  );
}
