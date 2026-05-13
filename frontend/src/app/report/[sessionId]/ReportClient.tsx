"use client";

import { useEffect, useState } from 'react';
import { getReport } from '@/lib/api';
import { ReportResponse } from '@/lib/types';
import { ReportView } from '@/components/ReportView';
import { Spinner } from '@/components/ui/Spinner';
import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';

export default function ReportClient({ params }: { params: { sessionId: string } }) {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const resetStore = useInterviewStore(state => state.reset);
  const router = useRouter();

  useEffect(() => {
    getReport(params.sessionId)
      .then(setReport)
      .catch((err) => {
        console.error(err);
        setError('Failed to load report. It might still be generating or the session was not found.');
      })
      .finally(() => setLoading(false));
  }, [params.sessionId]);

  const handleStartOver = () => {
    resetStore();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-stone-500">Generating your comprehensive interview report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex items-center justify-center px-4 text-center">
        <div className="bg-white border border-stone-200 p-8 rounded-2xl max-w-md w-full text-stone-600">
          <p className="text-red-400 font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] py-16 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <ReportView report={report} onStartOver={handleStartOver} />
      </div>
    </div>
  );
}
