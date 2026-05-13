import ReportClient from './ReportClient';
import { PageTransition } from '@/components/PageTransition';

export const metadata = { title: 'PGAGI — Your Interview Report' };

export default function ReportPage({ params }: { params: { sessionId: string } }) {
  return (
    <PageTransition>
      <ReportClient params={params} />
    </PageTransition>
  );
}
