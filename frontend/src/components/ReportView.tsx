import React from 'react';
import { ReportResponse } from '../lib/types';
import { Card } from './ui/Card';
import { Award, BookOpen } from 'lucide-react';

interface ReportViewProps {
  report: ReportResponse;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Report</h1>
          <p className="text-slate-400">Candidate: <span className="text-slate-200 font-medium">{report.candidate_name || 'Anonymous'}</span> • Role: <span className="text-slate-200">{report.role}</span></p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Download PDF
        </button>
      </div>

      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <div className="flex items-start space-x-4">
          <Award className="text-blue-400 shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Executive Summary</h3>
            <p className="text-slate-300 leading-relaxed">{report.summary}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <BookOpen className="text-slate-400" size={20} />
          Topics Covered
        </h3>
        <div className="flex flex-wrap gap-2">
          {report.topics_covered.map((topic, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-700">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <h3 className="text-xl font-semibold text-white">Q&A Transcript</h3>
        <div className="space-y-4">
          {report.qa_pairs.map((qa, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                  Q{qa.question_number}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold uppercase">{qa.topic}</span>
                  <p className="text-slate-200 font-medium">{qa.question}</p>
                </div>
              </div>
              <div className="pl-11">
                <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm leading-relaxed border border-slate-700/50">
                  {qa.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
