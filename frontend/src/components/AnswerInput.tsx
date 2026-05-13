import React, { useState, useEffect } from 'react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
  questionId: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, isSubmitting, questionId }) => {
  const [answer, setAnswer] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setAnswer('');
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [questionId]);

  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isValid = wordCount >= 5;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(answer);
    }
  };

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-4">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here... Be as detailed as possible."
        className="w-full h-48 bg-white border border-stone-300 rounded-xl p-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow shadow-inner"
      />
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 text-sm font-medium">
          <span className={wordCount >= 30 ? 'text-green-600' : 'text-stone-400'}>
            {wordCount} words
          </span>
          <span className="text-stone-500">
            {minutes}:{seconds}
          </span>
        </div>
        <div className="relative group">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/10 active:scale-95"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
          </button>
          {!isValid && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-stone-100 text-stone-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              Write at least 5 words to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
