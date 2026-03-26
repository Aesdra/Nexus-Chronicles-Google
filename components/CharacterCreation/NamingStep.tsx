import React from 'react';
import { motion } from 'framer-motion';
import { FormValues } from '../../screens/CharacterCreationScreen';
import { UseFormRegister } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

interface NamingStepProps {
    register: UseFormRegister<FormValues>;
    isValid: boolean;
}

/**
 * A modular step component for naming the character. This is one of the final steps
 * in the character creation process. It relies on `react-hook-form` for validation
 * and the `useCharacterCreationStore` for navigation.
 */
export const NamingStep: React.FC<NamingStepProps> = ({ register, isValid }) => {
    const { goToStep, characterInProgress } = useCharacterCreationStore();
    const { race, subRace, characterClass, subClass, background } = characterInProgress;

    const summaryText = `A ${subRace?.name || race?.name} ${subClass?.name || characterClass?.name} ${background?.name} stands ready.`;

    return (
        <motion.div key="step6" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
            <h2 className="text-4xl font-medieval text-amber-300 mb-4">What is your Name?</h2>
            <p className="mb-6 text-lg text-amber-100">{summaryText}</p>
            <div className="max-w-sm mx-auto">
                <input
                    id="name"
                    {...register('name', { required: true, minLength: 2, maxLength: 25 })}
                    className={cn("bg-stone-900 border-2 border-stone-600 rounded p-2 text-center text-2xl w-full mb-8 text-amber-100 focus:ring-amber-500 focus:border-amber-500")}
                    placeholder="Enter your name..."
                    autoFocus
                />
            </div>
            <div>
                <motion.button
                    type="button"
                    variants={buttonVariants}
                    whileHover={isValid ? "hover" : undefined}
                    whileTap={isValid ? "tap" : undefined}
                    disabled={!isValid}
                    onClick={() => goToStep(7)}
                    className={cn(
                        "px-8 py-3 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200",
                        "font-bold rounded-lg border-2 border-stone-600 shadow-lg font-medieval text-2xl",
                        "hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                    )}
                >
                    Review Summary
                </motion.button>
            </div>
            <motion.button
                type="button"
                variants={backButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => goToStep(5)}
                className="mt-6 text-amber-300 font-medieval"
            >
                Back to Details
            </motion.button>
        </motion.div>
    );
};
