import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '../db';
import { GameSave } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { NUM_SAVE_SLOTS } from '../constants';
import { cn } from '../lib/utils';
import { getScene } from '../services/dataService';
import { audioManager } from '../services/audioService';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  onSave?: (slotId: number) => Promise<boolean>;
  onLoad?: (saveData: GameSave) => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ isOpen, onClose, mode, onSave, onLoad }) => {
  const queryClient = useQueryClient();
  const { data: saves, isLoading } = useQuery({
    queryKey: ['gameSaves'],
    queryFn: () => db.gameSaves.toArray(),
    enabled: isOpen,
  });

  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [status, setStatus] = useState<{ slotId: number, type: 'success' | 'error' } | null>(null);
  const [confirmingOverride, setConfirmingOverride] = useState<number | null>(null);

  // When modal is closed, reset internal states
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(null);
      setStatus(null);
      setConfirmingOverride(null);
    }
  }, [isOpen]);

  const executeSave = async (slotId: number) => {
    if (!onSave) return;
    setIsProcessing(slotId);
    setStatus(null);
    setConfirmingOverride(null); // Ensure confirmation dialog is closed

    const success = await onSave(slotId);

    if (success) {
      setStatus({ slotId, type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['gameSaves'] });
    } else {
      setStatus({ slotId, type: 'error' });
    }

    setIsProcessing(null); // Release lock immediately
    setTimeout(() => {
      setStatus(null); // Clear status message after a delay
    }, 2500);
  };

  const handleSlotClick = async (slotId: number, existingSave?: GameSave) => {
    if (isProcessing || confirmingOverride) return;
    audioManager.playSound('click');

    if (mode === 'save') {
      if (existingSave) {
        setConfirmingOverride(slotId); // Ask for confirmation
      } else {
        executeSave(slotId); // Save directly to empty slot
      }
    } else if (mode === 'load') {
      if (existingSave && onLoad) {
        onLoad(existingSave);
        onClose();
      }
    }
  };

  const renderSlot = (slotId: number) => {
    const save = saves?.find(s => s.id === slotId);
    const scene = save ? getScene(save.currentSceneId) : null;
    const sceneName = scene?.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Location';
    const isDisabled = mode === 'load' && !save;

    const isBeingProcessed = isProcessing === slotId;
    const currentStatus = status?.slotId === slotId ? status.type : null;

    return (
      <motion.button
        key={slotId}
        onClick={() => handleSlotClick(slotId, save)}
        disabled={isDisabled || !!isProcessing}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (slotId - 1) * 0.05 }}
        whileHover={{ scale: (isDisabled || !!isProcessing) ? 1 : 1.03, backgroundColor: (isDisabled || !!isProcessing) ? '' : '#4a5568' }}
        whileTap={{ scale: (isDisabled || !!isProcessing) ? 1 : 0.98 }}
        className={cn(
          "w-full text-left p-4 rounded-lg border-2 transition-all h-28", // Increased height
          save ? "bg-stone-800/70 border-stone-600" : "bg-stone-900/50 border-stone-700",
          (isDisabled || !!isProcessing) ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-amber-400"
        )}
      >
        {isBeingProcessed ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner text="Saving..." size="sm" />
          </div>
        ) : currentStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center h-full text-green-400 font-bold text-lg">
            <h3 className="font-medieval text-2xl">Saved!</h3>
          </div>
        ) : currentStatus === 'error' ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 font-bold text-lg">
            <h3 className="font-medieval text-2xl">Save Failed</h3>
          </div>
        ) : (
          save ? (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-medieval text-2xl text-amber-100 font-bold">{save.player?.name}</h3>
                    <span className="text-xs text-amber-400 font-mono">{new Date(save.saveTimestamp!).toLocaleString()}</span>
                </div>
                <div className="mt-auto text-right">
                    <p className="text-base text-stone-300">{sceneName}</p>
                    <p className="text-sm font-medieval text-stone-500">Slot {slotId}</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-medieval text-xl text-stone-600">Empty Slot</h3>
                </div>
                <div className="mt-auto text-right">
                    <p className="text-sm font-medieval text-stone-500">Slot {slotId}</p>
                </div>
            </div>
          )
        )}
      </motion.button>
    );
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title={mode === 'save' ? 'Save Game' : 'Load Game'} containerClassName="max-w-2xl max-h-[90vh]">
        <div className="p-6 relative">
            <AnimatePresence>
            {confirmingOverride && (
                <motion.div
                className="absolute inset-0 bg-stone-900/95 z-10 flex flex-col items-center justify-center p-8 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                <h3 className="text-2xl font-medieval text-amber-300 mb-4 text-center">Confirm Override</h3>
                <p className="text-lg text-stone-300 text-center mb-6">You are about to overwrite your save data in Slot {confirmingOverride}. This action cannot be undone.</p>
                <div className="flex gap-4">
                    <Button onClick={() => executeSave(confirmingOverride)} variant="destructive" className="font-medieval">Yes, Override</Button>
                    <Button onClick={() => setConfirmingOverride(null)} variant="secondary" className="font-medieval">No, Cancel</Button>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
            {isLoading ? (
            <LoadingSpinner text="Reading the save scrolls..." />
            ) : (
            <div className="space-y-4">
                {Array.from({ length: NUM_SAVE_SLOTS }, (_, i) => renderSlot(i + 1))}
            </div>
            )}
        </div>
    </ModalFrame>
  );
};
