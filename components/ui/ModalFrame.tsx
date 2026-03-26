import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ModalFrameProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    preventClose?: boolean;
}

/**
 * A reusable frame for all modals in the application.
 * It handles the backdrop, enter/exit animations via Framer Motion, the main container styling,
 * and a consistent header. It supports preventing closure for critical decisions.
 */
export const ModalFrame: React.FC<ModalFrameProps> = ({ isOpen, onClose, title, children, className, containerClassName, preventClose = false }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !preventClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, preventClose]);
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Check if the click is on the backdrop itself, not on the modal content
        if (e.target === e.currentTarget && !preventClose) {
            onClose();
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={handleBackdropClick}
                    role="presentation" // The outer div is just for positioning and backdrop clicks
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={cn(
                            'relative bg-stone-900 rounded-lg shadow-2xl w-full flex flex-col overflow-hidden border-4 border-stone-700/80',
                            containerClassName
                        )}
                        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/crissxcross.png')" }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <header className="p-4 bg-stone-800/50 border-b-2 border-stone-600/80 flex justify-between items-center flex-shrink-0">
                            <h2 id="modal-title" className="text-3xl font-medieval text-amber-300">{title}</h2>
                            {!preventClose && (
                                <button onClick={onClose} className="text-amber-300 hover:text-white text-4xl font-bold" aria-label="Close modal">&times;</button>
                            )}
                        </header>
                        <div className={cn('flex-grow overflow-y-auto', className)}>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
