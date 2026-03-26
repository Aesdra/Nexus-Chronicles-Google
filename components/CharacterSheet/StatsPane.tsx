import React from 'react';
import { PlayerCharacter, Stat } from '../../types';
import { StatusBar } from '../ui/StatusBar';
import { StatDisplay } from '../ui/StatDisplay';
import { useGameStore } from '../../store/store';
import { selectFinalStats, selectVitals, selectExperience } from '../../store/selectors/playerSelectors';

const STATS_ORDER: { key: Stat; name: string }[] = [
    { key: 'strength', name: 'Strength' },
    { key: 'dexterity', name: 'Dexterity' },
    { key: 'constitution', name: 'Constitution' },
    { key: 'intelligence', name: 'Intelligence' },
    { key: 'wisdom', name: 'Wisdom' },
    { key: 'charisma', name: 'Charisma' },
];

/**
 * A dedicated component pane for displaying character vitals (HP, Mana, etc.) and attributes.
 * It now fetches all its data directly from the Zustand store using memoized selectors,
 * making it a self-contained and optimized UI module.
 */
export const StatsPane: React.FC = React.memo(() => {
    const finalStats = useGameStore(selectFinalStats);
    const { hp, maxHp, mana, maxMana, stamina, maxStamina } = useGameStore(selectVitals);
    const { xp, xpToNextLevel, level } = useGameStore(selectExperience);

    const calculateModifier = (value: number) => {
        const modifier = Math.floor((value - 10) / 2);
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    };
    
    if (!finalStats) return null;

    return (
        <div className="p-2">
            <div className="mb-4">
                <div className="flex justify-between items-center font-medieval text-2xl text-amber-200 mb-2">
                    <span>Level {level}</span>
                    <span>{xp} / {xpToNextLevel} XP</span>
                </div>
                <StatusBar
                    currentValue={xp}
                    maxValue={xpToNextLevel}
                    colorClass="bg-yellow-400"
                    label="Experience"
                    showText={false}
                    barClassName="h-2"
                />
            </div>
            <h4 className="font-medieval text-2xl text-amber-300 mb-4 border-b border-stone-600 pb-2">Vitals</h4>
            <div className="space-y-2 mb-6">
                <StatusBar
                    labelComponent={<label className="text-sm font-bold text-red-400">Health</label>}
                    currentValue={hp}
                    maxValue={maxHp}
                    colorClass="bg-gradient-to-r from-red-600 to-red-500"
                    label="Health"
                />
                <StatusBar
                    labelComponent={<label className="text-sm font-bold text-blue-400">Mana</label>}
                    currentValue={mana}
                    maxValue={maxMana}
                    colorClass="bg-gradient-to-r from-blue-600 to-blue-500"
                    label="Mana"
                />
                {(maxStamina > 0) && (
                    <StatusBar
                        labelComponent={<label className="text-sm font-bold text-yellow-400">Stamina</label>}
                        currentValue={stamina}
                        maxValue={maxStamina}
                        colorClass="bg-gradient-to-r from-yellow-600 to-yellow-500"
                        label="Stamina"
                    />
                )}
            </div>
            <h4 className="font-medieval text-2xl text-amber-300 mb-4 mt-6 border-b border-stone-600 pb-2">Attributes</h4>
            <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center mb-6">
                {STATS_ORDER.map(({ key, name }) => (
                    <StatDisplay
                        key={key}
                        label={name}
                        value={finalStats[key]}
                        modifier={calculateModifier(finalStats[key])}
                    />
                ))}
            </div>
        </div>
    );
});