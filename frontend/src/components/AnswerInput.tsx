import React, { useState } from 'react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, isSubmitting }) => {
  const [answer, setAnswer] = useState('');
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isValid = wordCount >= 3;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here... Be as detailed as possible."
        className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow shadow-inner"
      />
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isValid ? 'text-emerald-400' : 'text-slate-500'}`}>
          {wordCount} words (min 3)
        </span>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95"
        >
          {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};
