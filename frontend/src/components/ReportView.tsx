import React, { useState } from 'react';
import { ReportResponse } from '../lib/types';
import { Download, Copy, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface ReportViewProps {
  report: ReportResponse;
  onStartOver: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onStartOver }) => {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 8a. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            {report.candidate_name || 'Anonymous Candidate'}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-700 border border-orange-500/20 rounded-full text-sm font-semibold">
              {report.role}
            </span>
            <span className="text-stone-500 text-sm font-medium">{today}</span>
          </div>
        </div>
        <button 
          onClick={onStartOver}
          className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-stone-300"
        >
          <RefreshCcw size={16} />
          <span>Start Over</span>
        </button>
      </div>

      {/* 8b. Summary Card */}
      <div className="p-[1px] bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 rounded-2xl shadow-lg">
        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-xl font-bold text-stone-900 mb-4">Executive Summary</h3>
          <p className="text-stone-600 leading-relaxed text-lg">{report.summary}</p>
        </div>
      </div>

      {/* 8c. Topics Covered */}
      <div className="space-y-4">
        <p className="text-sm text-stone-500 uppercase tracking-wider font-semibold">Topics Covered</p>
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {report.topics_covered.map((topic, i) => {
            const colors = [
              'bg-orange-500/20 text-orange-700 border-orange-500/20',
              'bg-purple-500/20 text-purple-300 border-purple-500/30',
              'bg-green-500/20 text-green-300 border-green-500/30',
              'bg-teal-500/20 text-teal-300 border-teal-500/30',
              'bg-orange-500/20 text-orange-300 border-orange-500/30',
              'bg-pink-500/20 text-pink-300 border-pink-500/30'
            ];
            const colorClass = colors[i % colors.length];
            return (
              <motion.span 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${colorClass}`}
              >
                {topic}
              </motion.span>
            );
          })}
        </motion.div>
      </div>

      {/* 8d. Q&A Section */}
      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-bold text-stone-900 mb-6">Detailed Q&A</h3>
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {report.qa_pairs.map((qa, i) => {
            const wordCount = qa.answer.trim().split(/\s+/).filter(w => w.length > 0).length;
            return (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                className="flex flex-col md:flex-row bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-orange-900/5 hover:border-stone-300 transition-all duration-300 group"
              >
                <div className="md:w-1/4 bg-stone-50 p-6 border-l-4 border-orange-400 flex flex-col items-start space-y-4">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-700 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                    {qa.topic}
                  </span>
                  <div className="text-stone-500 text-sm font-medium">Question {qa.question_number} of 8</div>
                </div>
                <div className="md:w-3/4 p-6 space-y-4">
                  <h4 className="text-lg font-bold text-stone-900 leading-snug">{qa.question}</h4>
                  <p className="text-stone-500 leading-relaxed bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] p-4 rounded-xl border border-stone-200">
                    {qa.answer}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                      {wordCount} words
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 8e. Download & Share */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-10 pb-20">
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-orange-900/10 transition-all w-full sm:w-auto"
        >
          <Download size={20} />
          <span>Download Report</span>
        </button>
        <button 
          onClick={handleCopyLink}
          className="flex items-center justify-center space-x-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 px-8 py-4 rounded-xl font-medium transition-all w-full sm:w-48 relative"
        >
          {copied ? (
            <>
              <CheckCircle2 size={20} className="text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={20} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
