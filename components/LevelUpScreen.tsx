import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/store';
import { Stat, Feat } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ALL_FEATS } from '../data/feats';

interface LevelUpScreenProps {
    onComplete: () => void;
}

const STATS_ORDER: { key: Stat; name: string }[] = [
    { key: 'strength', name: 'Strength' },
    { key: 'dexterity', name: 'Dexterity' },
    { key: 'constitution', name: 'Constitution' },
    { key: 'intelligence', name: 'Intelligence' },
    { key: 'wisdom', name: 'Wisdom' },
    { key: 'charisma', name: 'Charisma' },
];

const FEAT_LEVELS = [3, 6, 9, 12, 15, 18];

export const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ onComplete }) => {
    const { player, applyManualLevelUp } = useGameStore(state => ({
        player: state.player,
        applyManualLevelUp: state.applyManualLevelUp
    }));

    const [attributePoints, setAttributePoints] = useState(1);
    const [selectedAttribute, setSelectedAttribute] = useState<Stat | null>(null);
    const [selectedFeatId, setSelectedFeatId] = useState<string | null>(null);
    const [hoveredFeat, setHoveredFeat] = useState<Feat | null>(null);

    const newLevel = useMemo(() => player ? player.level + 1 : 0, [player]);
    const isFeatLevel = useMemo(() => FEAT_LEVELS.includes(newLevel), [newLevel]);

    const handleConfirm = () => {
        if (!selectedAttribute) return;
        if (isFeatLevel && !selectedFeatId) return;

        applyManualLevelUp({
            attribute: selectedAttribute,
            featId: selectedFeatId || undefined,
        });
        onComplete();
    };

    if (!player) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-900 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden border-4 border-amber-800/50"
            >
                <header className="p-4 text-center border-b-2 border-amber-900/60">
                    <h1 className="text-4xl font-medieval text-amber-300">Level {newLevel}</h1>
                    <p className="text-stone-400">Distribute your points and choose your path.</p>
                </header>

                <main className="flex-grow p-6 overflow-y-auto space-y-8">
                    {/* Attribute Points */}
                    <section>
                        <h2 className="text-2xl font-medieval text-amber-200 border-b border-stone-600 pb-2 mb-4">Attribute Points</h2>
                        <p className="text-stone-300 mb-4">You have <span className="font-bold text-amber-400">{attributePoints}</span> point(s) to spend. Select an attribute to increase.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {STATS_ORDER.map(({ key, name }) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedAttribute(key)}
                                    className={cn(
                                        "p-3 rounded-lg border-2 transition-colors text-center",
                                        selectedAttribute === key
                                            ? "bg-amber-700/80 border-amber-500 text-white"
                                            : "bg-stone-800/60 border-stone-600 hover:bg-stone-700/60 hover:border-stone-500"
                                    )}
                                >
                                    <p className="font-medieval text-2xl">{name}</p>
                                    <p className="text-4xl font-bold">{player.stats[key]}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Feat Selection */}
                    {isFeatLevel && (
                        <section>
                            <h2 className="text-2xl font-medieval text-amber-200 border-b border-stone-600 pb-2 mb-4">Choose a Feat</h2>
                            <p className="text-stone-300 mb-4">At level {newLevel}, you gain a feat. This is a special talent that gives you a new capability.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                    {ALL_FEATS.filter(feat => !player.feats.includes(feat.id)).map(feat => (
                                        <li key={feat.id}>
                                            <button
                                                onClick={() => setSelectedFeatId(feat.id)}
                                                onMouseEnter={() => setHoveredFeat(feat)}
                                                onMouseLeave={() => setHoveredFeat(null)}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-md transition-colors",
                                                    selectedFeatId === feat.id
                                                        ? "bg-amber-700/80 text-white"
                                                        : "bg-stone-800/60 hover:bg-stone-700/60"
                                                )}
                                            >
                                                {feat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-stone-800/40 p-4 rounded-lg border border-stone-600 min-h-[150px]">
                                    {hoveredFeat ? (
                                        <>
                                            <h3 className="font-bold text-lg text-amber-300">{hoveredFeat.name}</h3>
                                            <p className="text-stone-300">{hoveredFeat.description}</p>
                                        </>
                                    ) : (
                                        <p className="text-stone-500">Hover over a feat to see its description.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                <footer className="p-4 border-t-2 border-amber-900/60 flex justify-end">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedAttribute || (isFeatLevel && !selectedFeatId)}
                        className="px-8 py-3 bg-gradient-to-b from-amber-600 to-amber-800 text-white font-bold rounded-lg border-2 border-amber-500 font-medieval text-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-stone-700 disabled:to-stone-800"
                    >
                        Confirm
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};