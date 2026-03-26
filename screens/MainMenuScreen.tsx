import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { audioManager } from '../services/audioService';
import { SaveLoadModal } from '../components/SaveLoadModal';
import { GameSave } from '../types';
import { db } from '../db';
import ParticleBackground from '../components/ParticleBackground';
import { Key } from 'lucide-react';

interface MainMenuScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: (saveData: GameSave) => void;
  hasSaveData: boolean;
  onDevQuickstart: () => void;
}

const buttonVariants = {
  hover: { 
    scale: 1.05, 
    textShadow: "0px 0px 8px rgb(251, 191, 36)",
    boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)",
    transition: { duration: 0.2 } 
  },
  tap: { scale: 0.95 },
};

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onNewGame, onContinue, onLoadGame, hasSaveData, onDevQuickstart }) => {
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const handleNewGameClick = () => {
    audioManager.playSound('click');
    onNewGame();
  };
  
  const handleContinueClick = () => {
    audioManager.playSound('click');
    onContinue();
  };
  
  const handleLoadClick = () => {
    audioManager.playSound('click');
    setIsLoadModalOpen(true);
  };

  const handleDevClick = () => {
    audioManager.playSound('click');
    onDevQuickstart();
  }

  const handleKeyChange = async () => {
    audioManager.playSound('click');
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <>
      <div 
        className="flex flex-col items-center justify-center h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://i.ibb.co/0jp3NKh0/6be03fdc-cb0e-4650-9ef6-0e00000389ac-1.jpg')" }}
      >
        <ParticleBackground theme="main_menu" />
        <div className="bg-stone-900/80 p-8 rounded-lg shadow-2xl backdrop-blur-sm border-y-4 border-amber-900/60 relative z-10">
          <h1 className="text-6xl font-medieval text-amber-400 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">
            Nexus Chronicles
          </h1>
          <p className="text-xl font-medieval text-amber-200 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] mb-8">
            The Eternal Echo
          </p>
          <div className="w-full max-w-xs mx-auto space-y-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleNewGameClick}
              className={cn(
                "w-full px-6 py-3 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200",
                "font-bold rounded-lg border-2 border-stone-600 shadow-lg",
                "hover:from-stone-600 hover:to-stone-700 hover:border-amber-400",
                "transition-all duration-300 font-medieval text-2xl"
              )}
            >
              New Game
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={!hasSaveData ? undefined : "hover"}
              whileTap={!hasSaveData ? undefined : "tap"}
              onClick={handleContinueClick}
              disabled={!hasSaveData}
              className={cn(
                  "w-full px-6 py-3 bg-gradient-to-b from-stone-800 to-stone-900 text-amber-200",
                  "font-bold rounded-lg border-2 border-stone-700 shadow-lg",
                  "hover:from-stone-700 hover:to-stone-800 hover:border-amber-500",
                  "transition-all duration-300 font-medieval text-2xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-stone-800 disabled:hover:border-stone-700"
              )}
            >
              Continue
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={!hasSaveData ? undefined : "hover"}
              whileTap={!hasSaveData ? undefined : "tap"}
              onClick={handleLoadClick}
              disabled={!hasSaveData}
              className={cn(
                  "w-full px-6 py-3 bg-gradient-to-b from-stone-800 to-stone-900 text-amber-200",
                  "font-bold rounded-lg border-2 border-stone-700 shadow-lg",
                  "hover:from-stone-700 hover:to-stone-800 hover:border-amber-500",
                  "transition-all duration-300 font-medieval text-2xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-stone-800 disabled:hover:border-stone-700"
              )}
            >
              Load Game
            </motion.button>
             <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleDevClick}
              className={cn(
                "w-full px-6 py-2 mt-4 bg-gradient-to-b from-indigo-800 to-indigo-900 text-amber-100",
                "font-bold rounded-lg border-2 border-indigo-700 shadow-lg",
                "hover:from-indigo-700 hover:to-indigo-800 hover:border-amber-500",
                "transition-all duration-300 font-medieval text-xl"
              )}
            >
              Dev Quickstart
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleKeyChange}
              className={cn(
                "w-full px-6 py-2 mt-2 bg-stone-900/50 text-stone-400",
                "font-medium rounded-lg border border-stone-700/50",
                "hover:text-amber-200 hover:border-amber-900/50",
                "transition-all duration-300 font-medieval text-sm flex items-center justify-center gap-2"
              )}
            >
              <Key className="w-4 h-4" />
              Change API Key
            </motion.button>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-stone-500 text-sm font-medieval">
          A game by Samuel Casanueva
        </div>
      </div>
      <SaveLoadModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        mode="load"
        onLoad={onLoadGame}
      />
    </>
  );
};