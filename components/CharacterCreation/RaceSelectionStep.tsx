import React from 'react';
import { motion } from 'framer-motion';
import { Race, SubRace } from '../../types';
import { RACES } from '../../data/races';
import { cn } from '../../lib/utils';
import { backButtonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

/**
 * A modular step component for the character creation process, responsible for selecting
 * a character's Race and, if applicable, their Sub-Race.
 * This component is now fully controlled by the `useCharacterCreationStore`, reading state
 * and dispatching actions directly, making it decoupled from its parent.
 */
export const RaceSelectionStep: React.FC = () => {
    const { step, characterInProgress, selectRace, selectSubRace, goToStep } = useCharacterCreationStore();
    const { race } = characterInProgress;

    // Sub-race selection view
    if (step === 1.5) {
        if (!race || !race.subRaces) return null;
        return (
            <motion.div key="step1.5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Choose your Heritage</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {race.subRaces.map(subRace => (
                        <div key={subRace.id} onClick={() => selectSubRace(subRace)} className={cn("cursor-pointer border-2 border-stone-700 hover:border-amber-500 transition-colors p-2 rounded-lg bg-stone-900/50 text-center shadow-lg")}>
                            <img src={subRace.imageUrl} alt={subRace.name} className="w-full h-48 object-cover rounded mb-2" />
                            <h3 className="font-medieval text-xl text-amber-100">{subRace.name}</h3>
                            <p className="text-sm text-gray-400 px-1">{subRace.description}</p>
                        </div>
                    ))}
                </div>
                <motion.button
                    type="button"
                    variants={backButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => goToStep(1)}
                    className="mt-6 text-amber-300 font-medieval"
                >
                    Back to Lineage
                </motion.button>
            </motion.div>
        );
    }
    
    // Default view: Race selection
    if (step === 1) {
        return (
             <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Choose your Lineage</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {RACES.map(r => (
                        <div key={r.id} onClick={() => selectRace(r)} className={cn("cursor-pointer border-2 border-stone-700 hover:border-amber-500 transition-colors p-2 rounded-lg bg-stone-900/50 text-center shadow-lg")}>
                            <img src={r.imageUrl} alt={r.name} className="w-full h-48 object-cover rounded mb-2" />
                            <h3 className="font-medieval text-xl text-amber-100">{r.name}</h3>
                            <p className="text-sm text-gray-400 px-1">{r.description}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return null;
};
