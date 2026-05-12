import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  const hoverStyles = hoverable ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300" : "";
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-lg p-6 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
