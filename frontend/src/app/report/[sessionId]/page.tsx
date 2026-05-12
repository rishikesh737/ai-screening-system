"use client";

import { useEffect, useState } from 'react';
import { getReport } from '@/lib/api';
import { ReportResponse } from '@/lib/types';
import { ReportView } from '@/components/ReportView';
import { Spinner } from '@/components/ui/Spinner';

export default function ReportPage({ params }: { params: { sessionId: string } }) {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getReport(params.sessionId)
      .then(setReport)
      .catch((err) => {
        console.error(err);
        setError('Failed to load report. It might still be generating or the session was not found.');
      })
      .finally(() => setLoading(false));
  }, [params.sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-slate-400">Generating your comprehensive interview report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-slate-300">
          <p className="text-red-400 font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <ReportView report={report} />
      </div>
    </div>
  );
}
