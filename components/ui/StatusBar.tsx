import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatusBarProps {
  currentValue: number;
  maxValue: number;
  colorClass: string;
  label: string; // for ARIA
  labelComponent?: React.ReactNode;
  barClassName?: string;
  textClassName?: string;
  showText?: boolean;
  containerClassName?: string;
}

/**
 * A reusable, atomic component for displaying animated status bars.
 * Used for health, mana, stamina, experience, etc. It's flexible to allow for different styles.
 *
 * @param {number} currentValue - The current value of the bar.
 * @param {number} maxValue - The maximum value of the bar.
 * @param {string} colorClass - Tailwind CSS class for the bar's color/gradient.
 * @param {string} label - Accessible label for the progress bar.
 * @param {React.ReactNode} [labelComponent] - An optional React node to render as a visible label.
 * @param {string} [barClassName] - Custom classes for the bar background element, controlling height, borders, etc.
 * @param {string} [textClassName] - Custom classes for the text overlay.
 * @param {boolean} [showText=true] - Whether to display the "current / max" text.
 * @param {string} [containerClassName] - Custom classes for the outer wrapper div.
 */
export const StatusBar: React.FC<StatusBarProps> = ({
  currentValue,
  maxValue,
  colorClass,
  label,
  labelComponent,
  barClassName,
  textClassName,
  showText = true,
  containerClassName,
}) => {
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

  return (
    <div className={containerClassName}>
      {labelComponent}
      <div
        className={cn(
          'w-full bg-stone-700 rounded-full relative',
          barClassName || 'h-5 border border-stone-500' // Default style
        )}
        role="progressbar"
        aria-label={label}
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={maxValue}
      >
        <motion.div
          className={cn('h-full rounded-full', colorClass)}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {showText && (
          <span
            className={cn(
              'absolute inset-0 text-white font-bold flex items-center justify-center',
              textClassName || 'text-xs' // Default text size
            )}
            style={{ textShadow: '1px 1px 1px black' }}
          >
            {currentValue} / {maxValue}
          </span>
        )}
      </div>
    </div>
  );
};
