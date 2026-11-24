import { useEffect, useState } from 'react';
import { api } from './api';
export default function useMe() {
  const [s, set] = useState({ user: null, loading: true });
  useEffect(() => {
    api('auth/me').then((j) => set({ user: j.user, loading: false })).catch(() => set({ user: null, loading: false }));
  }, []);
  return s;
}
