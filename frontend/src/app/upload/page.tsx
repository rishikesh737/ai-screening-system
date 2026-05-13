import UploadClient from './UploadClient';
import { PageTransition } from '@/components/PageTransition';

export const metadata = { title: 'PGAGI — Upload Resume' };

export default function UploadPage() {
  return (
    <PageTransition>
      <UploadClient />
    </PageTransition>
  );
}
