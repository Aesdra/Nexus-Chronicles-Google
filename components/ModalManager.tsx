


import React, { useState, useEffect } from 'react';
// FIX: Corrected the import path for useGameStore to point to the specific store module ('../store/store') instead of the directory, resolving an incorrect module resolution.
import { useGameStore } from '../store/store';
import { useModalStore } from '../store/modalStore';
import { analyzeImage } from '../services/geminiService';

// Import all modal components
import { ChatBotModal } from './ChatBotModal';
import { InventoryModal } from './InventoryModal';
import { AnalysisModal } from './AnalysisModal';
import { CompanionModal } from './CompanionModal';
import { CharacterSheetModal } from './CharacterSheetModal';
import { CodexModal } from './CodexModal';
import { GameMenuModal } from './GameMenuModal';
import { SaveLoadModal } from './SaveLoadModal';
import { TradeModal } from './TradeModal';
import { JournalModal } from './JournalModal';
import { LevelUpModal } from './LevelUpModal';
import { CompanionLevelUpModal } from './CompanionLevelUpModal';
import { CompanionHubModal } from './CompanionHubModal';
import { CheatCodeModal } from './CheatCodeModal';
import { CampUpgradeModal } from './CampUpgradeModal';
import { DiceGameModal } from './DiceGameModal';

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Failed to read file as base64."));
            }
        };
        reader.onerror = error => reject(error);
    });
};

interface ModalManagerProps {
    onReturnToMenu: () => void;
    onManualLevelUp: () => void;
}

/**
 * A central component responsible for rendering all modals in the application.
 * It listens to the `useModalStore` to determine which modal should be active.
 * This approach centralizes modal logic and keeps the main `GameScreen` component clean.
 * It also encapsulates logic specific to certain modals, like the async image analysis
 * and the lifecycle management of the trade session.
 */
export const ModalManager: React.FC<ModalManagerProps> = ({ onReturnToMenu, onManualLevelUp }) => {
    const { activeModal, closeModal, saveLoadMode, tradeNpc, analysisFile } = useModalStore();
    const { saveGameToSlot, hydrate, applyAutomaticLevelUp, companionLevelUpInfo, applyCompanionLevelUp, startTradeSession } = useGameStore();
    
    // State for the Analysis Modal
    const [analysisData, setAnalysisData] = useState<{ imageSrc: string | null, result: string | null, isLoading: boolean }>({
        imageSrc: null,
        result: null,
        isLoading: false,
    });

    // Effect to start a trade session when the trade modal is opened
    useEffect(() => {
        if (activeModal === 'trade' && tradeNpc) {
            startTradeSession(tradeNpc);
        }
    }, [activeModal, tradeNpc, startTradeSession]);


    // Effect to handle the image analysis process when a file is provided to the store
    useEffect(() => {
        if (activeModal !== 'analysis' || !analysisFile) return;

        let objectUrl: string | null = null;
        const processFile = async () => {
            objectUrl = URL.createObjectURL(analysisFile);
            setAnalysisData({ imageSrc: objectUrl, result: null, isLoading: true });
            
            try {
                const base64String = await fileToBase64(analysisFile);
                const resultText = await analyzeImage(base64String, analysisFile.type);
                setAnalysisData(prev => ({ ...prev, result: resultText, isLoading: false }));
            } catch (error) {
                console.error("Image analysis failed:", error);
                setAnalysisData(prev => ({ ...prev, result: "The object's history is clouded... I cannot see its secrets clearly at this moment.", isLoading: false }));
            }
        };

        processFile();

        // Cleanup function to revoke the object URL
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            setAnalysisData({ imageSrc: null, result: null, isLoading: false });
        };
    }, [analysisFile, activeModal]);

    // The manager returns a fragment containing all possible modals.
    // Each modal's `isOpen` prop is tied to the `activeModal` state, ensuring only one is visible at a time.
    return (
        <>
            <ChatBotModal isOpen={activeModal === 'chat'} onClose={closeModal} />
            <InventoryModal isOpen={activeModal === 'inventory'} onClose={closeModal} />
            <CompanionModal isOpen={activeModal === 'companion'} onClose={closeModal} />
            <CharacterSheetModal isOpen={activeModal === 'characterSheet'} onClose={closeModal} />
            <CodexModal isOpen={activeModal === 'codex'} onClose={closeModal} />
            <JournalModal isOpen={activeModal === 'journal'} onClose={closeModal} />
            <GameMenuModal isOpen={activeModal === 'gameMenu'} onClose={closeModal} onMainMenu={onReturnToMenu} />
            
            <SaveLoadModal isOpen={activeModal === 'saveLoad'} onClose={closeModal} mode={saveLoadMode} onSave={saveGameToSlot} onLoad={(save) => { hydrate(save); closeModal(); }} />
            <TradeModal isOpen={activeModal === 'trade'} onClose={closeModal} />
            
            <AnalysisModal
                isOpen={activeModal === 'analysis'}
                onClose={closeModal}
                imageSrc={analysisData.imageSrc}
                result={analysisData.result}
                isLoading={analysisData.isLoading}
            />

            <LevelUpModal
                isOpen={activeModal === 'levelUpPrompt'}
                onAutomatic={() => { applyAutomaticLevelUp(); closeModal(); }}
                onManual={() => { onManualLevelUp(); closeModal(); }}
                onClose={() => { applyAutomaticLevelUp(); closeModal(); }}
            />
            
            <CompanionLevelUpModal
                isOpen={activeModal === 'companionLevelUpPrompt'}
                companionLevelUpInfo={companionLevelUpInfo}
                onConfirm={(choice) => { applyCompanionLevelUp(choice); closeModal(); }}
            />

            <CompanionHubModal 
                isOpen={activeModal === 'companionHub'} 
                onClose={closeModal} 
            />

            <CheatCodeModal 
                isOpen={activeModal === 'cheatCode'} 
                onClose={closeModal} 
            />

            <CampUpgradeModal
                isOpen={activeModal === 'campManagement'}
                onClose={closeModal}
            />

            <DiceGameModal
                isOpen={activeModal === 'diceGame'}
                onClose={closeModal}
            />
        </>
    );
};
