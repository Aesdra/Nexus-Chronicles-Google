import React from 'react';
import { motion } from 'framer-motion';
import { Race } from '../../types';
import { FormValues } from '../../screens/CharacterCreationScreen';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

interface AppearanceDetailsStepProps {
    register: UseFormRegister<FormValues>;
    watch: UseFormWatch<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    race: Race;
}

const formatHeight = (inches: number) => {
    return `${Math.floor(inches / 12)}' ${inches % 12}"`;
};

/**
 * A modular step component for customizing a character's physical appearance.
 * It uses props passed down from a `react-hook-form` instance in the parent component
 * to manage its state, but uses the `useCharacterCreationStore` for navigation.
 */
export const AppearanceDetailsStep: React.FC<AppearanceDetailsStepProps> = ({ register, watch, setValue, race }) => {
    const { goToStep } = useCharacterCreationStore();
    const ageValue = watch('age');
    const heightValue = watch('height');
    const { customizationOptions: opts } = race;

    return (
        <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Carve your Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column */}
                <div>
                    <label htmlFor="age" className="block mb-1 font-medieval text-amber-300">Age ({opts.ageRange.min}-{opts.ageRange.max})</label>
                    <input id="age" type="range" {...register('age', { valueAsNumber: true })} min={opts.ageRange.min} max={opts.ageRange.max} className="w-full" />
                    <span className="text-center block text-amber-100">{ageValue} years</span>

                    <label htmlFor="height" className="block mb-1 mt-4 font-medieval text-amber-300">Height</label>
                    <input id="height" type="range" {...register('height', { valueAsNumber: true })} min={opts.heightRange.min} max={opts.heightRange.max} className="w-full" />
                    <span className="text-center block text-amber-100">{formatHeight(heightValue)} ({Math.round(heightValue * 2.54)} cm)</span>
                    
                    <label htmlFor="skinColor" className="block mb-1 mt-4 font-medieval text-amber-300">Skin Color</label>
                    <select id="skinColor" {...register('skinColor')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                        {opts.skinColors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <label htmlFor="eyeColor" className="block mb-1 mt-4 font-medieval text-amber-300">Eye Color</label>
                    <select id="eyeColor" {...register('eyeColor')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                        {opts.eyeColors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Right Column */}
                <div>
                    <label htmlFor="hairColor" className="block mb-1 font-medieval text-amber-300">Hair Color</label>
                    <select id="hairColor" {...register('hairColor')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                        {opts.hairColors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <label htmlFor="hairStyle" className="block mb-1 mt-4 font-medieval text-amber-300">Hair Style</label>
                    <input id="hairStyle" type="text" {...register('hairStyle')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="e.g., long and braided, short and spiky" />

                    <label htmlFor="gender" className="block mb-1 mt-4 font-medieval text-amber-300">Gender</label>
                    <select id="gender" {...register('gender')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                        {['Male', 'Female', 'Non-binary', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>

                    <div className="flex items-center mt-6">
                        <input id="hasBeard" type="checkbox" {...register('hasBeard')} className="w-5 h-5 accent-amber-600" />
                        <label htmlFor="hasBeard" className="ml-2 font-medieval text-amber-300">Has a beard?</label>
                    </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                    <label htmlFor="sexualOrientation" className="block mb-1 mt-4 font-medieval text-amber-300">Sexual Orientation</label>
                    <select id="sexualOrientation" {...register('sexualOrientation')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                        {['Straight', 'Gay', 'Bisexual', 'Pansexual', 'Asexual', 'Other', 'Undefined'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>

                    <div>
                        <label htmlFor="scars" className="block mb-1 font-medieval text-amber-300">Scars</label>
                        <input id="scars" type="text" {...register('scars')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="e.g., a long scar over the left eye" />
                    </div>
                    <div>
                        <label htmlFor="tattoos" className="block mb-1 font-medieval text-amber-300">Tattoos</label>
                        <input id="tattoos" type="text" {...register('tattoos')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="e.g., a serpent tattoo on the right arm" />
                    </div>
                    <div>
                        <label htmlFor="accessories" className="block mb-1 font-medieval text-amber-300">Accessories</label>
                        <input id="accessories" type="text" {...register('accessories')} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="e.g., a silver ring, a leather eyepatch" />
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <motion.button
                    type="button"
                    variants={backButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => goToStep(4)}
                    className="text-amber-300 font-medieval"
                >
                    Back
                </motion.button>
                <motion.button
                    type="button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => goToStep(6)}
                    className="px-6 py-2 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 font-bold rounded-lg border-2 border-stone-600 hover:border-amber-400 font-medieval"
                >
                    Next
                </motion.button>
            </div>
        </motion.div>
    );
};
