import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/store';
import { SaveIcon } from './icons/SaveIcon';

export const AutosaveNotification: React.FC = () => {
    const isVisible = useGameStore(state => state.autosaveNotificationVisible);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-4 left-4 z-50 bg-black/70 text-white p-2 px-4 rounded-md font-medieval flex items-center gap-2 border border-stone-600 shadow-lg"
                    role="status"
                    aria-live="polite"
                >
                    <SaveIcon />
                    Autosaving...
                </motion.div>
            )}
        </AnimatePresence>
    );
};