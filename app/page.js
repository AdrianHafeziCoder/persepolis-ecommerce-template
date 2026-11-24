'use client';
import useMe from '@/lib/useMe';
import Nav from '@/components/Nav';
import Gate from '@/components/Gate';
import Shop from '@/components/Shop';

export default function Home() {
  const { user } = useMe();
  return (<>
    <Nav user={user} />
    <Gate />
    <div className="greek" />
    <Shop />
    <div className="greek" />
    <footer>“I am Cyrus, king of the world, great king, mighty king.” — Made with ☀ in Persia</footer>
  </>);
}
