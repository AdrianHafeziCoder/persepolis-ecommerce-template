'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { api } from '@/lib/api';
import useMe from '@/lib/useMe';
import Nav from './Nav';
import { Faravahar } from './Art';

export default function AuthForm({ mode }) {
  const reg = mode === 'register';
  const { user } = useMe();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef();
  useEffect(() => {
    // gsap.context + revert: React StrictMode runs effects twice in dev; without revert the 2nd tween would start from the hidden state and the form would stay invisible
    const ctx = gsap.context(() => {
      gsap.fromTo(box.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', clearProps: 'transform,opacity' });
    }, box);
    return () => ctx.revert();
  }, []);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.target);
    try {
      const { user: u } = await api(reg ? 'auth/register' : 'auth/login', {
        method: 'POST', body: { name: f.get('name'), email: f.get('email'), password: f.get('password') }
      });
      location.href = u.role === 'admin' ? '/admin' : '/dashboard';
    } catch (x) { setErr(x.message); setBusy(false); }
  };
  return (<>
    <Nav user={user} />
    <div className="wrap">
      <div className="box" ref={box}>
        <div style={{ textAlign: 'center' }}><Faravahar s={100} /></div>
        <h2>{reg ? 'Join the Persians' : 'Enter the Court'}</h2>
        <form onSubmit={submit}>
          {reg && <><label>Name</label><input name="name" required /></>}
          <label>Email</label><input name="email" type="email" required />
          <label>Password</label><input name="password" type="password" minLength={reg ? 6 : 1} required />
          {err && <p style={{ color: '#e07a5f', margin: '0 0 10px' }}>{err}</p>}
          <button className="btn" style={{ width: '100%' }} disabled={busy}>{reg ? 'Sign Up' : 'Log In'}</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '.85rem' }}>
          {reg ? <>Already a member? <Link style={{ color: 'var(--gold)' }} href="/login">Log In</Link></>
               : <>No account yet? <Link style={{ color: 'var(--gold)' }} href="/register">Sign Up</Link></>}
        </p>
      </div>
    </div>
  </>);
}
