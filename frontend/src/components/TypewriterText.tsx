"use client";

import React, { useState, useEffect, useRef } from 'react';

export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  onComplete?: () => void;
}> = ({ text, speed = 28, onComplete }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayCount(0);
    
    if (text.length === 0) {
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      setDisplayCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (nextCount >= text.length) {
          clearInterval(intervalId);
          if (onCompleteRef.current) onCompleteRef.current();
          return text.length;
        }
        return nextCount;
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  const isTyping = displayCount < text.length;

  return (
    <span>
      {text.slice(0, displayCount)}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
};
