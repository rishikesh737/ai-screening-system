import LandingClient from './LandingClient';
import { PageTransition } from '@/components/PageTransition';

export const metadata = { title: 'PGAGI — Start Your Interview' };

export default function Home() {
  return (
    <PageTransition>
      <LandingClient />
    </PageTransition>
  );
}
