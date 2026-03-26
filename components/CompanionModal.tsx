import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/store';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Stat } from '../types';
import { ModalFrame } from './ui/ModalFrame';
import { StatDisplay } from './ui/StatDisplay';

interface CompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATS_ORDER: { key: Stat; name: string }[] = [
    { key: 'strength', name: 'Strength' },
    { key: 'dexterity', name: 'Dexterity' },
    { key: 'constitution', name: 'Constitution' },
    { key: 'intelligence', name: 'Intelligence' },
    { key: 'wisdom', name: 'Wisdom' },
    { key: 'charisma', name: 'Charisma' },
];


export const CompanionModal: React.FC<CompanionModalProps> = ({ isOpen, onClose }) => {
  const companion = useGameStore((state) => state.party[0]);

  const calculateModifier = (value: number) => {
    const modifier = Math.floor((value - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="Companion Sheet" containerClassName="max-w-4xl max-h-[90vh]">
        <div className="p-6">
            {!companion ? (
            <div className="flex items-center justify-center h-full text-stone-500 min-h-[50vh]">
                <p>You are traveling alone.</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Sprite & Core Info */}
                <div className="md:col-span-1 flex flex-col items-center bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700">
                <div className="relative w-full h-80 bg-black/30 rounded mb-4 border-2 border-stone-600">
                    {companion.spriteUrl ? (
                    <img src={companion.spriteUrl} alt={companion.name} className="w-full h-full object-contain" />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <LoadingSpinner text="Summoning..." />
                    </div>
                    )}
                </div>
                <h3 className="font-medieval text-4xl text-amber-100">{companion.name}</h3>
                <p className="text-amber-300 text-lg">
                    {companion.subRace ? `${companion.subRace} ` : ''}{companion.race}
                </p>
                <p className="text-amber-300 text-lg">
                    {companion.subClass ? `${companion.subClass} ` : ''}{companion.characterClass}
                </p>

                <div className="w-full mt-4">
                    <label id="affinity-label" className="text-sm font-bold text-pink-400">Affinity</label>
                    <div 
                    className="w-full bg-gray-700 rounded-full h-5 my-1 border border-stone-500"
                    role="progressbar"
                    aria-labelledby="affinity-label"
                    aria-valuenow={companion.affinity}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    >
                    <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs font-bold"
                        style={{ width: `${companion.affinity}%` }}
                    >
                    {companion.affinity} / 100
                    </div>
                    </div>
                </div>
                </div>

                {/* Right Column: Stats & Backstory */}
                <div className="md:col-span-2">
                <h4 className="font-medieval text-2xl text-amber-300 mb-4 border-b border-stone-600 pb-2">Attributes</h4>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center mb-6">
                    {STATS_ORDER.map(({ key, name }) => {
                        const value = companion.stats[key];
                        return value !== undefined ? (
                            <StatDisplay
                                key={key}
                                label={name}
                                value={value}
                                modifier={calculateModifier(value)}
                            />
                        ) : null;
                    })}
                </div>

                <h4 className="font-medieval text-2xl text-amber-300 mb-2 mt-4 border-t border-stone-600 pt-4">Background</h4>
                <div className="text-gray-300 text-lg leading-relaxed">
                    <MarkdownRenderer>{companion.backstory}</MarkdownRenderer>
                </div>
                </div>
            </div>
            )}
        </div>
    </ModalFrame>
  );
};
