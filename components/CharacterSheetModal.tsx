import React, { useState } from 'react';
import { useGameStore } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { CharacterSheetHeader } from './CharacterSheet/CharacterSheetHeader';
import { StatsPane } from './CharacterSheet/StatsPane';
import { DetailsPane } from './CharacterSheet/DetailsPane';
import { SpellsPane } from './CharacterSheet/SpellsPane';
import { PlayerCharacter } from '../types';
import { ModalFrame } from './ui/ModalFrame';
import { selectPlayer } from '../store/selectors/playerSelectors';

interface CharacterSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'stats' | 'details' | 'spells';

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const character = useGameStore(selectPlayer);

  const handleClose = () => {
    setActiveTab('stats'); // Reset tab on close
    onClose();
  };
  
  if (!character) {
      return null;
  }

  const hasSpells = character.spells.length > 0;

  return (
    <ModalFrame isOpen={isOpen} onClose={handleClose} title="Character Sheet" containerClassName="max-w-4xl max-h-[90vh]">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <CharacterSheetHeader character={character} />
            <div className="md:col-span-2 flex flex-col overflow-hidden">
                <div className="border-b border-stone-600 mb-4 flex-shrink-0">
                    <div role="tablist" aria-label="Character Sheet Sections" className="flex space-x-4">
                        <button id="tab-stats" role="tab" aria-selected={activeTab === 'stats'} aria-controls="tabpanel-content" onClick={() => setActiveTab('stats')} className={cn('font-medieval text-xl py-2 px-4', {'text-amber-300 border-b-2 border-amber-400': activeTab === 'stats','text-stone-400 hover:text-amber-200': activeTab !== 'stats'})}>
                            Stats & Appearance
                        </button>
                        <button id="tab-details" role="tab" aria-selected={activeTab === 'details'} aria-controls="tabpanel-content" onClick={() => setActiveTab('details')} className={cn('font-medieval text-xl py-2 px-4', {'text-amber-300 border-b-2 border-amber-400': activeTab === 'details','text-stone-400 hover:text-amber-200': activeTab !== 'details'})}>
                            Details
                        </button>
                        {hasSpells && (
                            <button id="tab-spells" role="tab" aria-selected={activeTab === 'spells'} aria-controls="tabpanel-content" onClick={() => setActiveTab('spells')} className={cn('font-medieval text-xl py-2 px-4', {'text-amber-300 border-b-2 border-amber-400': activeTab === 'spells','text-stone-400 hover:text-amber-200': activeTab !== 'spells'})}>
                            Spells
                        </button>
                        )}
                    </div>
                </div>
                
                <div id="tabpanel-content" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="flex-grow overflow-y-auto">
                    {activeTab === 'stats' && <StatsPane />}
                    {activeTab === 'details' && <DetailsPane />}
                    {activeTab === 'spells' && <SpellsPane spellSlugs={character.spells} />}
                </div>
            </div>
        </div>
    </ModalFrame>
  );
};