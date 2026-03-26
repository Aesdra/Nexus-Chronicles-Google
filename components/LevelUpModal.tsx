import React from 'react';
import { audioManager } from '../services/audioService';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

interface LevelUpModalProps {
  isOpen: boolean;
  onAutomatic: () => void;
  onManual: () => void;
  onClose: () => void; // Added to handle Radix close events
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onAutomatic, onManual, onClose }) => {

  const handleAutoClick = () => {
    audioManager.playSound('click');
    onAutomatic();
  };

  const handleManualClick = () => {
    audioManager.playSound('click');
    onManual();
  };

  return (
    <ModalFrame 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Level Up!" 
      containerClassName="max-w-md"
      preventClose // Prevent closing via ESC or overlay click
    >
        <div className="p-8 text-center">
            <p className="text-lg text-stone-300 mb-8">
              You have grown stronger. Choose how to proceed with your newfound power.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleAutoClick} variant="secondary" className="flex-1 text-xl font-medieval p-3 h-auto flex-col">
                <h3 className="text-2xl">Automatic</h3>
                <p className="text-sm font-sans font-normal text-stone-400">Quick & simple progression.</p>
              </Button>
              <Button onClick={handleManualClick} className="flex-1 text-xl font-medieval p-3 h-auto flex-col">
                <h3 className="text-2xl">Manual</h3>
                <p className="text-sm font-sans font-normal text-amber-200">Take control of your growth.</p>
              </Button>
            </div>
        </div>
    </ModalFrame>
  );
};