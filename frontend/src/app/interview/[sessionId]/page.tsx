import InterviewClient from './InterviewClient';
import { PageTransition } from '@/components/PageTransition';

export const metadata = { title: 'PGAGI — Interview in Progress' };

export default function InterviewPage({ params }: { params: { sessionId: string } }) {
  return (
    <PageTransition>
      <InterviewClient params={params} />
    </PageTransition>
  );
}
