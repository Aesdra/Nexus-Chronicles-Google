
import React, { useMemo } from 'react';
import { useGameStore } from '../store/store';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';
import { selectAvailableDialogues } from '../store/selectors/dialogueSelectors';
import { AnimatedText } from './AnimatedText';
import { ChoiceButton } from './ChoiceButton';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../lib/utils';
import { Companion } from '../types';

interface CompanionHubModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CompanionHubModal: React.FC<CompanionHubModalProps> = ({ isOpen, onClose }) => {
    const { party, activeDialogue, currentDialogueNode, startDialogue, advanceDialogue, endDialogue } = useGameStore();
    const availableDialogues = useGameStore(selectAvailableDialogues);
    const [selectedCompanionId, setSelectedCompanionId] = React.useState<string | null>(null);

    const handleClose = () => {
        if (activeDialogue) {
            // If in conversation, end it properly first
            endDialogue();
        }
        setSelectedCompanionId(null);
        onClose();
    };

    const activeCompanion = useMemo(() => party.find(c => c.id === selectedCompanionId), [party, selectedCompanionId]);
    const companionDialogues = useMemo(() => availableDialogues.filter(d => d.companionId === selectedCompanionId), [availableDialogues, selectedCompanionId]);

    const renderConversationView = () => {
        if (!currentDialogueNode) return <LoadingSpinner />;
        
        // Find the companion who is speaking (based on activeDialogue)
        const speaker = party.find(c => c.id === activeDialogue?.companionId);

        return (
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 overflow-y-auto bg-black/30 rounded-md border border-stone-700/50 mb-4">
                     {/* Sprite for context */}
                    <div className="flex items-center gap-4 mb-6 border-b border-stone-600/50 pb-4">
                         <div className="w-16 h-16 rounded-full border-2 border-amber-700 overflow-hidden flex-shrink-0 bg-stone-800">
                             {speaker?.spriteUrl ? (
                                <img src={speaker.spriteUrl} alt={speaker.name} className="w-full h-full object-cover" />
                             ) : <div className="w-full h-full bg-stone-700" />}
                         </div>
                         <div>
                             <h3 className="font-medieval text-2xl text-amber-200">{speaker?.name}</h3>
                             <p className="text-stone-400 text-sm italic">Listening...</p>
                         </div>
                    </div>

                    <div className="text-xl text-gray-200 leading-relaxed">
                        <AnimatedText key={currentDialogueNode.id} text={currentDialogueNode.text} />
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {currentDialogueNode.choices.map((choice, idx) => (
                        <ChoiceButton 
                            key={idx} 
                            text={choice.text} 
                            onClick={() => advanceDialogue(choice)} 
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderCompanionSelectionView = () => {
        if (party.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-stone-500">
                    <p>You are traveling alone.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {party.map(companion => (
                    <button
                        key={companion.id}
                        onClick={() => setSelectedCompanionId(companion.id)}
                        className="flex flex-col items-center bg-stone-800/60 p-4 rounded-lg border-2 border-stone-600 hover:border-amber-500 hover:bg-stone-700/80 transition-all group"
                    >
                        <div className="w-24 h-24 rounded-full border-2 border-stone-500 overflow-hidden mb-3 bg-black">
                            <img src={companion.spriteUrl} alt={companion.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-medieval text-xl text-amber-100 group-hover:text-white">{companion.name}</h3>
                        <p className="text-xs text-stone-400">{companion.characterClass}</p>
                    </button>
                ))}
            </div>
        );
    }

    const renderTopicSelectionView = () => {
        if (!activeCompanion) return null;

        return (
            <div className="flex flex-col h-full">
                {/* Top: Companion Card */}
                <div className="bg-stone-800/60 p-6 rounded-lg border-2 border-stone-600 flex items-center gap-6 mb-6">
                    <div className="w-32 h-32 rounded-lg border-2 border-amber-700 overflow-hidden shadow-lg bg-black/50 flex-shrink-0">
                         {activeCompanion.spriteUrl ? (
                                <img src={activeCompanion.spriteUrl} alt={activeCompanion.name} className="w-full h-full object-contain" />
                         ) : <div className="w-full h-full flex items-center justify-center text-stone-600">?</div>}
                    </div>
                    <div className="flex-grow">
                         <h2 className="font-medieval text-4xl text-amber-100">{activeCompanion.name}</h2>
                         <p className="text-stone-400 text-lg mb-3">{activeCompanion.characterClass} - {activeCompanion.subClass}</p>
                         
                         {/* Affinity Bar */}
                         <div className="w-full max-w-md">
                            <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                                <span>Distrust</span>
                                <span>Neutral</span>
                                <span>Loyal</span>
                            </div>
                            <div className="h-4 bg-stone-900 rounded-full border border-stone-600 overflow-hidden relative">
                                <div 
                                    className="h-full bg-gradient-to-r from-red-900 via-amber-700 to-amber-500 transition-all duration-500"
                                    style={{ width: `${activeCompanion.affinity}%` }}
                                />
                                {/* Markers for thresholds */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black/50 left-[30%]" />
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black/50 left-[70%]" />
                            </div>
                            <p className="text-center text-xs text-amber-300 mt-1">{activeCompanion.affinity} / 100</p>
                         </div>
                    </div>
                    <Button onClick={() => setSelectedCompanionId(null)} variant="secondary" className="self-start">Back</Button>
                </div>

                {/* Bottom: Actions & Topics */}
                <div className="flex-grow bg-stone-900/50 p-4 rounded-lg border border-stone-700/50 overflow-y-auto">
                    <h3 className="font-medieval text-xl text-stone-400 mb-4 border-b border-stone-700 pb-2">Topics</h3>
                    
                    {companionDialogues.length > 0 ? (
                        <div className="space-y-2">
                            {companionDialogues.map(dialogue => (
                                <button
                                    key={dialogue.id}
                                    onClick={() => startDialogue(dialogue)}
                                    className={cn(
                                        "w-full text-left p-4 rounded border-l-4 transition-all duration-200 flex justify-between items-center group",
                                        dialogue.priority >= 10 
                                            ? "bg-amber-900/20 border-amber-500 hover:bg-amber-900/40" 
                                            : "bg-stone-800/40 border-stone-600 hover:bg-stone-700/60"
                                    )}
                                >
                                    <span className={cn(
                                        "font-medieval text-lg",
                                        dialogue.priority >= 10 ? "text-amber-200 group-hover:text-white" : "text-stone-300 group-hover:text-amber-100"
                                    )}>{dialogue.title}</span>
                                    
                                    {dialogue.priority >= 10 && (
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-stone-500 italic p-4 text-center">No new topics available.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <ModalFrame isOpen={isOpen} onClose={handleClose} title={activeDialogue ? "Conversation" : "Camp"} containerClassName="max-w-4xl h-[85vh]">
            <div className="p-6 h-full">
                {activeDialogue ? renderConversationView() : (selectedCompanionId ? renderTopicSelectionView() : renderCompanionSelectionView())}
            </div>
        </ModalFrame>
    );
};
