
import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { audioManager } from '../services/audioService';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  isFocused?: boolean;
}

export const ChoiceButton = React.memo<ChoiceButtonProps>(({ text, onClick, disabled = false, isFocused = false }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [isFocused]);

  const handleClick = () => {
    audioManager.playSound('click');
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "w-full text-left p-3 my-1.5",
        "bg-transparent hover:bg-stone-800/60 transition-all duration-200",
        "rounded-md",
        "text-amber-200 hover:text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "font-medium tracking-wide text-lg",
        "focus:outline-none", // Remove default browser focus outline
        isFocused && "bg-stone-700/80 ring-2 ring-amber-400"
      )}
    >
      <span className="font-medieval mr-2 text-amber-500">&gt;</span>{text}
    </button>
  );
});
