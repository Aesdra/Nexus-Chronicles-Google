import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from '../../types';
import { cn } from '../../lib/utils';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { LoadingSpinner } from '../LoadingSpinner';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

interface BackgroundSelectionStepProps {
    backgrounds: Background[];
    isLoading: boolean;
}

/**
 * A modular step component for the character creation process, responsible for selecting
 * a character's Background. It is now controlled by the `useCharacterCreationStore`,
 * dispatching actions to navigate or select a background.
 */
export const BackgroundSelectionStep: React.FC<BackgroundSelectionStepProps> = ({ backgrounds, isLoading }) => {
    const { characterInProgress, selectBackground, goToStep } = useCharacterCreationStore();
    const { characterClass } = characterInProgress;
    const [selectedBackgroundPreview, setSelectedBackgroundPreview] = useState<Background | null>(null);
    
    const handleBack = () => {
        goToStep(characterClass?.subclasses ? 2.5 : 2);
    };

    return (
        <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Choose your Background</h2>
            {isLoading ? (
                <LoadingSpinner text="Recalling ancient histories..." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[80vh]">
                    {/* Left Pane: Grid of backgrounds */}
                    <div className="overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => goToStep(3.5)}
                                className="cursor-pointer border-2 border-dashed border-amber-600 hover:border-amber-400 hover:bg-amber-900/40 transition-colors p-3 rounded-lg bg-stone-900/50 text-center shadow-lg flex flex-col justify-center items-center h-48 pulse-glow"
                            >
                                <h3 className="font-medieval text-2xl text-amber-100">Create Your Own</h3>
                                <p className="text-sm text-gray-400 px-1 mt-2">Craft a unique background that fits your character's story.</p>
                            </div>
                            {backgrounds.map(bg => (
                                <div
                                    key={bg.slug}
                                    onMouseEnter={() => setSelectedBackgroundPreview(bg)}
                                    onClick={() => setSelectedBackgroundPreview(bg)} // also select on click for touch devices
                                    className={cn(
                                        "cursor-pointer border-2 hover:border-amber-500 transition-colors p-3 rounded-lg bg-stone-900/50 text-center shadow-lg flex flex-col h-48",
                                        selectedBackgroundPreview?.slug === bg.slug ? 'border-amber-500' : 'border-stone-700'
                                    )}
                                >
                                    <h3 className="font-medieval text-xl text-amber-100 mb-2">{bg.name}</h3>
                                    <p className="text-sm text-gray-400 text-left overflow-hidden flex-grow">{bg.desc.substring(0, 150)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Right Pane: Details */}
                    <div className="bg-stone-800/40 p-6 rounded-lg border-2 border-stone-700 flex flex-col overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {!selectedBackgroundPreview ? (
                                <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-stone-500">
                                    <p className="font-medieval text-xl text-center">Hover over or select a background to learn more.</p>
                                </motion.div>
                            ) : (
                                <motion.div key={selectedBackgroundPreview.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <h3 className="font-medieval text-3xl text-amber-200 mb-2">{selectedBackgroundPreview.name}</h3>
                                    <p className="text-gray-300 italic mb-4">{selectedBackgroundPreview.desc}</p>
                                    <div className="border-t border-stone-600 pt-4 mt-4">
                                        <h4 className="font-medieval text-xl text-amber-300">{selectedBackgroundPreview.feature}</h4>
                                        <p className="text-gray-400 text-sm mt-1">{selectedBackgroundPreview.feature_desc}</p>
                                    </div>
                                    <div className="mt-4 space-y-1 text-gray-300">
                                        <p><strong className="text-stone-300">Skills:</strong> <span className="text-amber-100">{selectedBackgroundPreview.skill_proficiencies}</span></p>
                                        {selectedBackgroundPreview.tool_proficiencies && <p><strong className="text-stone-300">Tools:</strong> <span className="text-amber-100">{selectedBackgroundPreview.tool_proficiencies}</span></p>}
                                        {selectedBackgroundPreview.languages && <p><strong className="text-stone-300">Languages:</strong> <span className="text-amber-100">{selectedBackgroundPreview.languages}</span></p>}
                                        <p className="mt-2"><strong className="text-stone-300">Equipment:</strong> <span className="text-amber-100">{selectedBackgroundPreview.equipment}</span></p>
                                    </div>

                                    <motion.button 
                                        type="button" 
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => selectBackground(selectedBackgroundPreview)}
                                        className="mt-8 w-full px-6 py-2 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 font-bold rounded-lg border-2 border-stone-600 hover:border-amber-400 font-medieval"
                                    >
                                        Confirm Background
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
            <div className="flex justify-start mt-8">
                <motion.button 
                    type="button" 
                    variants={backButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleBack}
                    className="text-amber-300 font-medieval"
                >
                    Back
                </motion.button>
            </div>
        </motion.div>
    );
};
