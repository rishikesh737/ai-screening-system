import React from 'react';
import { Card } from './ui/Card';
import { BrainCircuit } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface QuestionCardProps {
  topic: string;
  question: string;
  onComplete?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ topic, question, onComplete }) => {
  return (
    <Card className="border-orange-200 bg-stone-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-semibold uppercase tracking-wider rounded-full">
          {topic}
        </span>
      </div>
      <h2 className="text-2xl font-medium text-stone-900 leading-relaxed">
        <TypewriterText text={question} onComplete={onComplete} />
      </h2>
    </Card>
  );
};
