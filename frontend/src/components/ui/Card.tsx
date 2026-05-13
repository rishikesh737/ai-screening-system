import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  const hoverStyles = hoverable ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-orange-400/50 transition-all duration-300" : "";
  return (
    <div 
      onClick={onClick}
      className={`bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-lg p-6 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
