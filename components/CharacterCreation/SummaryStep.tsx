
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Stat, Race, SubRace, CharacterClass, SubClass, Background } from '../../types';
import { FormValues } from '../../screens/CharacterCreationScreen';
import { cn } from '../../lib/utils';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

const STAT_NAME_MAP: Record<Stat, string> = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
};

const STATS_ORDER: Stat[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

interface SummaryStepProps {
    isGenerating: boolean;
    formValues: FormValues;
}

/**
 * A modular step component that displays a final summary of the character.
 * It now reads character data (race, class, stats, etc.) directly from the
 * `useCharacterCreationStore`, making it a direct reflection of the centralized state.
 */
export const SummaryStep: React.FC<SummaryStepProps> = ({ isGenerating, formValues }) => {
    const { characterInProgress, goToStep } = useCharacterCreationStore();
    const { race, subRace, characterClass, subClass, background, stats } = characterInProgress;

    const getRacialBonuses = (race: Race | null, subRace: SubRace | null) => {
        const bonuses: Partial<Record<Stat, number>> = {};
        if (!race) return bonuses;
        Object.entries(race.statBonuses).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
        if (subRace) Object.entries(subRace.statBonuses || {}).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
        return bonuses;
    };

    const finalStats = useMemo(() => {
        const racialBonuses = getRacialBonuses(race, subRace);
        const final: Record<Stat, number> = { ...stats };
        STATS_ORDER.forEach(statKey => {
            final[statKey] += racialBonuses[statKey] || 0;
        });
        return final;
    }, [race, subRace, stats]);
    
    const getModifier = (val: number) => {
        const mod = Math.floor((val - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    if (!race || !characterClass || !background) {
        return <div>Loading summary...</div>; // Or some other placeholder
    }

    return (
        <motion.div key="step7" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Final Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[65vh] overflow-y-auto pr-2 bg-black/20 p-4 rounded-lg border border-stone-700">
                <div>
                    <h3 className="font-medieval text-2xl text-amber-200 border-b border-stone-600 pb-1 mb-2">Identity</h3>
                    <p className="text-lg"><strong className="text-stone-400">Name:</strong> <span className="text-amber-100">{formValues.name}</span></p>
                    <p className="text-lg"><strong className="text-stone-400">Race:</strong> <span className="text-amber-100">{race.name} {subRace ? `(${subRace.name})` : ''}</span></p>
                    <p className="text-lg"><strong className="text-stone-400">Class:</strong> <span className="text-amber-100">{characterClass.name} {subClass ? `(${subClass.name})` : ''}</span></p>
                    <p className="text-lg"><strong className="text-stone-400">Background:</strong> <span className="text-amber-100">{background.name}</span></p>
                </div>
                <div>
                    <h3 className="font-medieval text-2xl text-amber-200 border-b border-stone-600 pb-1 mb-2">Appearance</h3>
                    <p className="text-lg"><strong className="text-stone-400">Age:</strong> <span className="text-amber-100">{formValues.age}</span>, <strong className="text-stone-400">Height:</strong> <span className="text-amber-100">{formValues.height}</span></p>
                    <p className="text-lg"><strong className="text-stone-400">Skin:</strong> <span className="text-amber-100">{formValues.skinColor}</span>, <strong className="text-stone-400">Eyes:</strong> <span className="text-amber-100">{formValues.eyeColor}</span></p>
                    <p className="text-lg"><strong className="text-stone-400">Hair:</strong> <span className="text-amber-100">{formValues.hairColor} ({formValues.hairStyle})</span></p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="font-medieval text-2xl text-amber-200 border-b border-stone-600 pb-1 mb-2">Attributes</h3>
                    <div className="grid grid-cols-3 gap-2 text-lg text-center">
                        {STATS_ORDER.map(stat => (
                            <div key={stat}>
                                <p className="text-amber-100">{STAT_NAME_MAP[stat]}</p>
                                <p className="font-bold text-2xl text-white">{finalStats[stat]} <span className="text-base text-stone-400">({getModifier(finalStats[stat])})</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <motion.button type="button" variants={backButtonVariants} whileHover="hover" whileTap="tap" onClick={() => goToStep(6)} className="text-amber-300 font-medieval">Back to Naming</motion.button>
                <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover={!isGenerating ? "hover" : undefined}
                    whileTap={!isGenerating ? "tap" : undefined}
                    disabled={isGenerating}
                    className={cn(
                        "px-8 py-3 bg-gradient-to-b from-amber-700 to-amber-800 text-white",
                        "font-bold rounded-lg border-2 border-amber-500 shadow-lg font-medieval text-2xl",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                    )}
                >
                    Begin Adventure
                </motion.button>
            </div>
        </motion.div>
    );
};
