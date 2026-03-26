import React from 'react';
import { audioManager } from '../services/audioService';
import { useModalStore } from '../store/modalStore';
import { ModalType } from '../types';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

interface GameMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMainMenu: () => void;
}

/**
 * The main in-game menu modal.
 * This component has been refactored to be controlled by the `ModalManager`.
 * It uses the `useModalStore` to dispatch actions for opening other modals,
 * rather than relying on numerous prop callbacks.
 */
export const GameMenuModal: React.FC<GameMenuModalProps> = ({ isOpen, onClose, onMainMenu }) => {
  const openModal = useModalStore(state => state.openModal);
  const triggerAnalysisFileInput = useModalStore(state => state.triggerAnalysisFileInput);

  /**
   * A handler to play a click sound, close the current menu modal,
   * and then execute a subsequent action after a short delay to allow for animations.
   * @param action The function to execute after closing the menu.
   */
  const handleAndClose = (action: () => void) => {
    audioManager.playSound('click');
    onClose();
    setTimeout(action, 250); // Delay allows menu to animate out
  };

  const handleOpenModal = <T extends ModalType>(modal: T, payload?: T extends keyof import('../types').ModalPayloads ? import('../types').ModalPayloads[T] : never) => {
    handleAndClose(() => openModal(modal, payload));
  };
  
  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="Game Menu" containerClassName="max-w-sm">
        <div className="space-y-2 p-6">
            <Button variant="menu" onClick={() => { audioManager.playSound('click'); onClose(); }}>Resume</Button>

            <div className="pt-2 border-t border-stone-600/50" />

            <Button variant="menu" onClick={() => handleOpenModal('characterSheet')}>Character</Button>
            <Button variant="menu" onClick={() => handleOpenModal('inventory')}>Inventory</Button>
            <Button variant="menu" onClick={() => handleOpenModal('journal')}>Journal</Button>
            <Button variant="menu" onClick={() => handleOpenModal('codex')}>Codex</Button>
            <Button variant="menu" onClick={() => handleOpenModal('companion')}>Companion</Button>

            <div className="pt-2 border-t border-stone-600/50" />
            
            <Button variant="menu" onClick={() => handleAndClose(triggerAnalysisFileInput)}>Analyze Item</Button>
            <Button variant="menu" onClick={() => handleOpenModal('chat')}>Loremaster</Button>

            <div className="pt-2 border-t border-stone-600/50" />

            <Button variant="menu" onClick={() => handleOpenModal('saveLoad', { mode: 'save' })}>Save Game</Button>
            <Button variant="menu" onClick={() => handleOpenModal('saveLoad', { mode: 'load' })}>Load Game</Button>

            <div className="pt-2 border-t border-stone-600/50" />
          
            <Button variant="destructive" className="w-full text-xl font-medieval p-2 mt-2" onClick={() => handleAndClose(onMainMenu)}>Main Menu</Button>
        </div>
    </ModalFrame>
  );
};