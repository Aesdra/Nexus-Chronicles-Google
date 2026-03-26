
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stat, Race, SubRace } from '../../types';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

const STATS_ORDER: Stat[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const POINT_BUY_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const STAT_DESCRIPTIONS: Record<Stat, string> = {
    strength: "Governs raw physical power, affecting melee combat, carrying capacity, and athletic feats.",
    dexterity: "Represents agility, reflexes, and balance. It's key for ranged combat, stealth, and avoiding danger.",
    constitution: "Measures health, stamina, and vital force. A high constitution increases your hit points and resilience.",
    intelligence: "Determines reasoning and memory. Crucial for arcane spellcasters and solving complex problems.",
    wisdom: "Reflects awareness, intuition, and insight. It's the primary stat for divine spellcasters and perception.",
    charisma: "Is the force of personality, persuasiveness, and leadership. It empowers social interactions and some forms of magic."
};

const STAT_NAME_MAP: Record<Stat, string> = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
};

/**
 * A modular step component for assigning character attributes using a point-buy system.
 * It is now fully controlled by the `useCharacterCreationStore`, reading the current stats
 * and points, and calling actions to update them.
 */
export const AttributeAssignmentStep: React.FC = () => {
    const { characterInProgress, points, setStatsAndPoints, goToStep } = useCharacterCreationStore();
    const { stats, race, subRace } = characterInProgress;
    const [hoveredStat, setHoveredStat] = useState<Stat | null>(null);

    const getRacialBonuses = (race: Race | null, subRace: SubRace | null) => {
        const bonuses: Partial<Record<Stat, number>> = {};
        if (!race) return bonuses;
        Object.entries(race.statBonuses).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
        if (subRace) Object.entries(subRace.statBonuses || {}).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
        return bonuses;
    };
    const racialBonuses = useMemo(() => getRacialBonuses(race, subRace), [race, subRace]);

    const highestStat = useMemo(() => {
        return STATS_ORDER.reduce((highest, current) => {
            const totalCurrent = stats[current] + (racialBonuses[current] || 0);
            const totalHighest = stats[highest] + (racialBonuses[highest] || 0);
            return totalCurrent > totalHighest ? current : highest;
        }, 'strength');
    }, [stats, racialBonuses]);

    const handleStatChange = (stat: Stat, delta: 1 | -1) => {
        const currentScore = stats[stat];
        const newScore = currentScore + delta;

        if (newScore < 8 || newScore > 15) return;

        const currentCost = POINT_BUY_COST[currentScore as keyof typeof POINT_BUY_COST];
        const newCost = POINT_BUY_COST[newScore as keyof typeof POINT_BUY_COST];
        const pointChange = newCost - currentCost;

        if (delta === 1 && points - pointChange < 0) return;

        setStatsAndPoints({ ...stats, [stat]: newScore }, points - pointChange);
    };

    return (
        <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-4xl font-medieval text-amber-300 mb-2 text-center">Assign Attributes</h2>
            <p className="text-center text-amber-100 mb-6 font-bold text-xl" aria-live="polite">{points} Points Remaining</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Stats */}
                <div className="space-y-3">
                    {STATS_ORDER.map(stat => {
                        const base = stats[stat];
                        const racial = racialBonuses[stat] || 0;
                        const total = base + racial;
                        return (
                            <div
                                key={stat}
                                className="grid grid-cols-5 items-center gap-2 p-1 rounded-md transition-colors hover:bg-stone-800/50"
                                onMouseEnter={() => setHoveredStat(stat)}
                                onMouseLeave={() => setHoveredStat(null)}
                            >
                                <label className="col-span-1 font-medieval text-amber-300 text-lg">{STAT_NAME_MAP[stat]}</label>
                                <div className="col-span-3 flex items-center justify-center bg-stone-900/50 p-1 rounded">
                                    <button type="button" onClick={() => handleStatChange(stat, -1)} disabled={base <= 8} className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded disabled:opacity-50 font-bold" aria-label={`Decrease ${STAT_NAME_MAP[stat]}`}>-</button>
                                    <span className="w-12 text-center text-xl font-bold">{base}</span>
                                    <button type="button" onClick={() => handleStatChange(stat, 1)} disabled={base >= 15 || points < (POINT_BUY_COST[(base + 1) as keyof typeof POINT_BUY_COST] - POINT_BUY_COST[base as keyof typeof POINT_BUY_COST])} className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded disabled:opacity-50 font-bold" aria-label={`Increase ${STAT_NAME_MAP[stat]}`}>+</button>
                                </div>
                                <div className="col-span-1 text-center">
                                    <div className="text-2xl font-bold text-amber-100" title={`Base ${base} + Racial ${racial}`}>{total}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Right: Description */}
                <div className="bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700 flex flex-col justify-center min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {hoveredStat ? (
                            <motion.div
                                key={hoveredStat}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className="font-medieval text-2xl text-amber-200 mb-2">{STAT_NAME_MAP[hoveredStat]}</h3>
                                <p className="text-gray-300">{STAT_DESCRIPTIONS[hoveredStat]}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="default"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className="font-medieval text-2xl text-amber-200 mb-2">Primary Stat: {STAT_NAME_MAP[highestStat]}</h3>
                                <p className="text-gray-300">{`This is your character's strongest attribute. Hover over any stat on the left to learn more about it.`}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <motion.button
                    type="button"
                    variants={backButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => goToStep(3)}
                    className="text-amber-300 font-medieval"
                >
                    Back
                </motion.button>
                <motion.button
                    type="button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => goToStep(5)}
                    disabled={points > 0}
                    className="px-6 py-2 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 font-bold rounded-lg border-2 border-stone-600 hover:border-amber-400 font-medieval disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-stone-700"
                >
                    Next
                </motion.button>
            </div>
        </motion.div>
    );
};
