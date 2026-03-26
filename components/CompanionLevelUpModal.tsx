import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types';
import { MARTIAL_ABILITIES } from '../data/martialAbilities';
// FIX: Removed unused import from a non-module file.
import { useQuery } from '@tanstack/react-query';
import { getSpell } from '../services/dataService';
import { cn } from '../lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

interface CompanionLevelUpModalProps {
  isOpen: boolean;
  companionLevelUpInfo: GameState['companionLevelUpInfo'];
  onConfirm: (choice: { type: 'spell' | 'ability', id: string }) => void;
}

const getAbilityDetails = (choice: { type: 'spell' | 'ability', id: string }) => {
    if (choice.type === 'ability') {
        const ability = MARTIAL_ABILITIES[choice.id];
        return ability ? { name: ability.name, description: ability.description } : null;
    }
    // For spells, we'll need to fetch them. This component will handle that.
    return null;
};

export const CompanionLevelUpModal: React.FC<CompanionLevelUpModalProps> = ({ isOpen, companionLevelUpInfo, onConfirm }) => {
    const [selectedChoice, setSelectedChoice] = useState<{ type: 'spell' | 'ability', id: string } | null>(null);
    const [hoveredChoice, setHoveredChoice] = useState<{ type: 'spell' | 'ability', id: string } | null>(null);
    
    const spellChoices = useMemo(() => companionLevelUpInfo?.choices.filter(c => c.type === 'spell').map(c => c.id) || [], [companionLevelUpInfo]);

    const spellQueries = useQuery({
        queryKey: ['spells', ...spellChoices],
        queryFn: async () => {
            const spells = await Promise.all(spellChoices.map(slug => getSpell(slug)));
            return spells.filter(Boolean);
        },
        enabled: isOpen && spellChoices.length > 0,
    });
    
    if (!companionLevelUpInfo) return null;
    
    const { companionId, level, choices } = companionLevelUpInfo;

    const handleConfirm = () => {
        if (selectedChoice) {
            onConfirm(selectedChoice);
        }
    };
    
    const getChoiceDetails = (choice: { type: 'spell' | 'ability', id: string }) => {
        if (choice.type === 'ability') {
            return getAbilityDetails(choice);
        }
        if (choice.type === 'spell' && spellQueries.data) {
            const spell = spellQueries.data.find(s => s?.slug === choice.id);
            return spell ? { name: spell.name, description: spell.desc } : null;
        }
        return null;
    }

    const hoveredDetails = hoveredChoice ? getChoiceDetails(hoveredChoice) : null;

  return (
    <ModalFrame 
        isOpen={isOpen} 
        onClose={() => {}} 
        title={`${companionId.charAt(0).toUpperCase() + companionId.slice(1)} Reached Level ${level}!`}
        containerClassName="max-w-2xl"
    >
        <div className="p-8 text-center">
            <p className="text-lg text-stone-300 mb-6">Choose a new ability for your companion.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    {choices.map(choice => {
                        const details = getChoiceDetails(choice);
                        return (
                            <Button
                                key={choice.id}
                                onClick={() => setSelectedChoice(choice)}
                                onMouseEnter={() => setHoveredChoice(choice)}
                                onMouseLeave={() => setHoveredChoice(null)}
                                variant={selectedChoice?.id === choice.id ? 'default' : 'secondary'}
                                className="p-4 h-auto text-left"
                            >
                                <p className="font-medieval text-xl">{details?.name || choice.id}</p>
                            </Button>
                        );
                    })}
                </div>

                <div className="bg-stone-800/40 p-4 rounded-lg border border-stone-600 min-h-[150px] text-left">
                    {hoveredDetails ? (
                        <>
                            <h3 className="font-bold text-lg text-amber-300">{hoveredDetails.name}</h3>
                            <MarkdownRenderer>{hoveredDetails.description}</MarkdownRenderer>
                        </>
                    ) : (
                        <p className="text-stone-500 text-center flex items-center justify-center h-full">Hover over an ability to see its description.</p>
                    )}
                </div>
            </div>

            <Button
                onClick={handleConfirm}
                disabled={!selectedChoice}
                className="mt-8 px-8 py-3 font-medieval text-2xl"
            >
                Confirm
            </Button>
        </div>
    </ModalFrame>
  );
};
