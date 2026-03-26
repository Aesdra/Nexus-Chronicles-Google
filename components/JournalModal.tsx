import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/store';
import { Quest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BookIcon } from './icons/BookIcon';
import { ModalFrame } from './ui/ModalFrame';
import { selectActiveQuests, selectCompletedQuests } from '../store/selectors/questSelectors';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckboxIcon: React.FC<{ checked: boolean }> = ({ checked }) => (
  <svg className={cn("h-5 w-5 mr-2 flex-shrink-0", checked ? "text-green-400" : "text-stone-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {checked ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    )}
  </svg>
);

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose }) => {
  const activeQuests = useGameStore(selectActiveQuests);
  const completedQuests = useGameStore(selectCompletedQuests);

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleClose = () => {
    setSelectedQuest(null);
    onClose();
  };

  const currentList = activeTab === 'active' ? activeQuests : completedQuests;

  return (
    <ModalFrame isOpen={isOpen} onClose={handleClose} title="Journal" containerClassName="max-w-4xl h-[90vh]">
        <div className="p-6 flex gap-6 h-full">
            {/* Left Panel - Quest List */}
            <div className="w-1/3 flex flex-col bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700">
            <div role="tablist" aria-label="Quest Status" className="flex border-b border-stone-600 mb-3">
                <button role="tab" aria-selected={activeTab === 'active'} onClick={() => { setActiveTab('active'); setSelectedQuest(null); }} className={cn('flex-1 font-medieval text-xl py-2', activeTab === 'active' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400 hover:text-amber-200')}>Active</button>
                <button role="tab" aria-selected={activeTab === 'completed'} onClick={() => { setActiveTab('completed'); setSelectedQuest(null); }} className={cn('flex-1 font-medieval text-xl py-2', activeTab === 'completed' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400 hover:text-amber-200')}>Completed</button>
            </div>
            <ul className="flex-grow overflow-y-auto space-y-1 pr-2">
                {currentList.length > 0 ? currentList.map(quest => (
                <li key={quest.id}>
                    <button onClick={() => setSelectedQuest(quest)} className={cn('w-full text-left p-2 rounded transition-colors text-amber-200 hover:bg-stone-700/80', selectedQuest?.id === quest.id && 'bg-amber-800/50 font-bold')}>
                    {quest.title}
                    </button>
                </li>
                )) : (
                <li className="p-2 text-stone-500 italic">No {activeTab} quests.</li>
                )}
            </ul>
            </div>

            {/* Right Panel - Quest Details */}
            <div className="w-2/3 bg-stone-800/40 p-6 rounded-lg border-2 border-stone-700 overflow-y-auto">
            {!selectedQuest ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-500 text-center">
                <BookIcon />
                <p className="mt-4 font-medieval text-2xl">Select a quest to read.</p>
                </div>
            ) : (
                <div>
                <h3 className="font-medieval text-4xl text-amber-200 border-b-2 border-amber-800/50 pb-2 mb-4">{selectedQuest.title}</h3>
                <div className="text-gray-300 text-lg leading-relaxed mb-6"><MarkdownRenderer>{selectedQuest.description}</MarkdownRenderer></div>
                <h4 className="font-medieval text-2xl text-amber-300 mb-3">Objectives</h4>
                <ul className="space-y-2">
                    {selectedQuest.objectives.map(obj => (
                    <li key={obj.id} className={cn("flex items-start text-lg", obj.isCompleted ? "text-stone-400 line-through" : "text-amber-100")}>
                        <CheckboxIcon checked={obj.isCompleted} />
                        <span>{obj.text}</span>
                    </li>
                    ))}
                </ul>
                </div>
            )}
            </div>
        </div>
    </ModalFrame>
  );
};