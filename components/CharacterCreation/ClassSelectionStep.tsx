import React from 'react';
import { motion } from 'framer-motion';
import { CharacterClass, SubClass } from '../../types';
import { CLASSES } from '../../data/classes';
import { cn } from '../../lib/utils';
import { backButtonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

const SUBCLASS_TITLES: Record<string, string> = {
    warlock: 'Choose your Otherworldly Patron',
    sorcerer: 'Choose your Sorcerous Origin',
    rogue: 'Choose your Roguish Archetype',
    wizard: 'Choose your Arcane Tradition',
    cleric: 'Choose your Domain',
    barbarian: 'Choose your Primal Path',
    bard: 'Choose your College',
    druid: 'Choose your Circle',
    fighter: 'Choose your Martial Archetype',
    monk: 'Choose your Monastic Tradition',
    paladin: 'Choose your Sacred Oath',
    ranger: 'Choose your Conclave',
};

/**
 * A modular step component for the character creation process, responsible for selecting
 * a character's Class and, if applicable, their Sub-Class (specialization). This component
 * is now fully controlled by the `useCharacterCreationStore`.
 */
export const ClassSelectionStep: React.FC = () => {
    const { step, characterInProgress, selectClass, selectSubClass, goToStep } = useCharacterCreationStore();
    const { race: selectedRace, characterClass } = characterInProgress;

    if (step === 2.5) {
        if (!characterClass || !characterClass.subclasses) return null;
        const title = SUBCLASS_TITLES[characterClass.id] || 'Choose your Specialization';
        return (
             <motion.div key="step2.5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">{title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characterClass.subclasses.map(subClass => (
                  <div key={subClass.id} onClick={() => selectSubClass(subClass)} className={cn("cursor-pointer border-2 border-stone-700 hover:border-amber-500 transition-colors p-2 rounded-lg bg-stone-900/50 text-center shadow-lg")}>
                    <img src={subClass.imageUrl} alt={subClass.name} className="w-full h-48 object-cover rounded mb-2"/>
                    <h3 className="font-medieval text-xl text-amber-100">{subClass.name}</h3>
                    <p className="text-sm text-gray-400 px-1">{subClass.description}</p>
                  </div>
                ))}
              </div>
              <motion.button 
                type="button" 
                variants={backButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => goToStep(2)} 
                className="mt-6 text-amber-300 font-medieval"
              >
                Back to Path
            </motion.button>
            </motion.div>
        );
    }
    
    if (step === 2) {
        const handleBack = () => {
            goToStep(selectedRace?.subRaces ? 1.5 : 1);
        };
        return (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Choose your Path</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CLASSES.map(cls => (
                    <div 
                        key={cls.id} 
                        onClick={() => selectClass(cls)} 
                        className={cn("cursor-pointer border-2 border-stone-700 hover:border-amber-500 transition-colors p-2 rounded-lg bg-stone-900/50 text-center shadow-lg flex flex-col")}
                    >
                    <img src={cls.imageUrl} alt={cls.name} className="w-full h-48 object-cover rounded mb-2"/>
                    <div className="flex-grow">
                        <h3 className="font-medieval text-xl text-amber-100">{cls.name}</h3>
                        <p className="text-sm text-gray-400 px-1">{cls.description}</p>
                    </div>
                    {cls.scalesWith && (
                        <div className="mt-2 pt-2 border-t border-stone-600/50">
                            <p className="text-xs text-amber-200/80 font-bold tracking-wider">PRIMARY STATS</p>
                            <p className="text-sm text-amber-100 capitalize">{cls.scalesWith.join(', ')}</p>
                        </div>
                    )}
                    </div>
                ))}
                </div>
                <motion.button 
                type="button" 
                variants={backButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleBack}
                className="mt-6 text-amber-300 font-medieval"
                >
                    Back to Heritage
                </motion.button>
            </motion.div>
        );
    }
    
    return null;
};
