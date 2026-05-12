import React from 'react';
import { Card } from './ui/Card';
import { BrainCircuit } from 'lucide-react';

interface QuestionCardProps {
  topic: string;
  question: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ topic, question }) => {
  return (
    <Card className="border-blue-900/30 bg-slate-800/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <BrainCircuit size={20} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">{topic}</span>
      </div>
      <h2 className="text-2xl font-medium text-slate-100 leading-relaxed">
        {question}
      </h2>
    </Card>
  );
};
