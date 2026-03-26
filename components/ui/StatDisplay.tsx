import React from 'react';

interface StatDisplayProps {
  label: string;
  value: number;
  modifier: string;
}

/**
 * A reusable, atomic component for displaying a single character attribute (stat).
 * It standardizes the presentation of the stat's name, its numerical value, and its calculated modifier.
 *
 * @param {string} label - The name of the stat (e.g., "Strength").
 * @param {number} value - The numerical value of the stat.
 * @param {string} modifier - The pre-calculated modifier string (e.g., "+2", "-1").
 */
export const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, modifier }) => {
  return (
    <div className="text-center">
      <p className="font-medieval text-3xl text-amber-200" title={`Modifier: ${modifier}`}>{value}</p>
      <p className="text-stone-300 font-bold text-lg">{modifier}</p>
      <p className="text-sm text-stone-400">{label}</p>
    </div>
  );
};
