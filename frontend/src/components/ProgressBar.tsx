import React from 'react';

export const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-stone-500 mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% Completed</span>
      </div>
      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
