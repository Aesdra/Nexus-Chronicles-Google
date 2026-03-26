
import React from 'react';

interface LoadingSpinnerProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "The threads of fate are weaving...", size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div className={`${sizeClasses[size]} border-amber-600 border-t-transparent rounded-full animate-spin mb-4`}></div>
      <p className="text-amber-400 font-medieval text-xl">{text}</p>
    </div>
  );
};