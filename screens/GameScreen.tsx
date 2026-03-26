
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, Scene, SceneType, Choice, Companion, ClickableArea, NPCData } from '../types';
import { useGameStore } from '../store/store';
import { useModalStore } from '../store/modalStore';
import { generateCompanionSprite, generateStoryTwist } from '../services/geminiService';
import { useQuery } from '@tanstack/react-query';
import { getScene, getNpcData } from '../services/dataService';
import { audioManager } from '../services/audioService';
import { BATTLE_BACKGROUNDS } from '../data/battle-backgrounds';
import ParticleBackground from '../components/ParticleBackground';
import { checkCondition } from '../services/conditionRegistry';

// Refactored components
import { CombatScreen } from '../components/CombatScreen';
import { LevelUpScreen } from '../components/LevelUpScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ModalManager } from '../components/ModalManager';
import { GameHeader } from '../components/GameUI/GameHeader';
import { GameFooter } from '../components/GameUI/GameFooter';
import { useGameShortcuts } from '../hooks/useGameShortcuts';
import { AutosaveNotification } from '../components/AutosaveNotification';
import { useGamepadInput } from '../hooks/useGamepadInput';

interface GameScreenProps {
    onReturnToMenu: () => void;
}

/**
 * The main gameplay screen component. This component has been refactored to act as a "controller".
 * Its primary responsibilities are:
 * - Fetching the current scene data.
 * - Managing core game logic (advancing scenes, starting combat, handling procedural content).
 * - Orchestrating the rendering of major UI sections (Header, Footer, Modals).
 * - Responding to global game state changes (e.g., level ups).
 *
 * All direct UI state management (like which modal is open) and complex UI rendering
 * has been extracted into dedicated components and stores (`ModalManager`, `useModalStore`, `GameHeader`, etc.).
 */
export const GameScreen: React.FC<GameScreenProps> = ({ onReturnToMenu }) => {
  const gameState = useGameStore();
  const { 
      advanceScene, setCompanion, combatState, 
      isLevelUpPending, companionLevelUpInfo, startCombat
  } = useGameStore(state => ({
      advanceScene: state.advanceScene,
      setCompanion: state.setCompanion,
      combatState: state.combatState,
      isLevelUpPending: state.isLevelUpPending,
      companionLevelUpInfo: state.companionLevelUpInfo,
      startCombat: state.startCombat,
  }));
  const { activeModal, openModal, closeModal } = useModalStore();

  const { data: currentScene, isLoading: isSceneLoading } = useQuery({
      queryKey: ['scene', gameState.currentSceneId],
      queryFn: () => getScene(gameState.currentSceneId),
      staleTime: Infinity,
  });

  const [dynamicChoices, setDynamicChoices] = useState<Choice[]>([]);
  const [isChoiceLoading, setIsChoiceLoading] = useState(false);
  const [showLevelUpScreen, setShowLevelUpScreen] = useState(false);
  const [focusedChoiceIndex, setFocusedChoiceIndex] = useState(0);

  const allChoices = useMemo(() => [...(currentScene?.choices || []), ...dynamicChoices], [currentScene, dynamicChoices]);
  
  // Updated logic to use checkCondition helper
  const visibleChoices = useMemo(() => 
    allChoices.filter(choice => !choice.condition || checkCondition(choice.condition, gameState)), 
  [allChoices, gameState]);

  useEffect(() => {
    setFocusedChoiceIndex(0);
  }, [visibleChoices.length]);

  /**
   * Handles player's choice selection.
   * Opens the trade modal for trade actions, otherwise advances the scene.
   */
  const handleChoice = useCallback((choice: Choice) => {
    audioManager.playSound('click');
    if (choice.action === 'trade' && choice.actionTargetId) {
        const npcData = getNpcData(choice.actionTargetId);
        if (npcData) {
            openModal('trade', { npc: npcData });
        }
    } else if (choice.action === 'input_code') {
        openModal('cheatCode');
    } else {
        advanceScene(choice);
    }
  }, [advanceScene, openModal]);

  // Custom hook handles all keyboard shortcuts (e.g., Escape key, 1-9 for choices)
  useGameShortcuts(showLevelUpScreen, visibleChoices, handleChoice);

  // Custom hook for gamepad input
  useGamepadInput({
    onUp: () => setFocusedChoiceIndex(prev => Math.max(0, prev - 1)),
    onDown: () => setFocusedChoiceIndex(prev => Math.min(visibleChoices.length - 1, prev + 1)),
    onConfirm: () => {
      if (visibleChoices[focusedChoiceIndex]) {
        handleChoice(visibleChoices[focusedChoiceIndex]);
      }
    },
    onCancel: () => {
        if (activeModal) closeModal();
    },
    onStart: () => {
        if (!activeModal && !combatState) openModal('gameMenu');
    }
  });


  // Effect to trigger level up modals based on global state
  useEffect(() => {
    if (isLevelUpPending) {
        openModal('levelUpPrompt');
    } else if (companionLevelUpInfo) {
        openModal('companionLevelUpPrompt');
    }
  }, [isLevelUpPending, companionLevelUpInfo, openModal]);

  // Effect to generate a sprite for a companion if they don't have one
  useEffect(() => {
    const firstCompanion = gameState.party[0];
    if (firstCompanion && !firstCompanion.spriteUrl) {
        let isMounted = true;
        generateCompanionSprite().then(spriteUrl => {
            if (isMounted && firstCompanion) {
                const newCompanion: Companion = { ...firstCompanion, spriteUrl };
                setCompanion(newCompanion);
            }
        }).catch(error => console.error("Failed to generate companion sprite in-game:", error));
        
        return () => { isMounted = false; };
    }
  }, [gameState.party, setCompanion]);

  /**
   * Generates a dynamic story twist for procedural scenes using the Gemini API.
   * Updates the component's state with the new choice.
   */
  const handleProceduralScene = useCallback(async (scene: Scene) => {
    setIsChoiceLoading(true);
    try {
      const currentState = useGameStore.getState();
      const twistText = await generateStoryTwist(currentState);
      const twistChoice: Choice = {
        text: twistText,
        nextScene: scene.fallbackScene || 'start',
      };
      setDynamicChoices([twistChoice]);
    } catch (error) {
      console.error("Failed to generate and set procedural choice:", error);
      const fallbackChoice: Choice = {
        text: "You steel your nerves and decide to press on.",
        nextScene: scene.fallbackScene || 'start',
      };
      setDynamicChoices([fallbackChoice]);
    } finally {
      setIsChoiceLoading(false);
    }
  }, []);

  // Main effect to handle scene transitions and triggers
  useEffect(() => {
    if (!currentScene) return;

    audioManager.playMusic(currentScene.musicTrack);
    setDynamicChoices([]);

    if (currentScene.type === SceneType.PROCEDURAL) {
      handleProceduralScene(currentScene);
    } else if (currentScene.type === SceneType.COMBAT && currentScene.enemies && currentScene.onVictoryScene && currentScene.onDefeatScene) {
        if (!combatState) {
            startCombat({
                enemies: currentScene.enemies,
                onVictoryScene: currentScene.onVictoryScene,
                onDefeatScene: currentScene.onDefeatScene,
                temporaryCompanions: currentScene.temporaryCompanions,
            });
        }
    }

  }, [currentScene, handleProceduralScene, startCombat, combatState]);
  
  if (isSceneLoading || !currentScene || !gameState.player) {
    return <div className="h-screen w-screen flex items-center justify-center bg-black"><LoadingSpinner text="Loading your adventure..."/></div>;
  }

  // --- Render logic for special screen states ---

  const backgroundUrl = currentScene.backgroundKey
    ? BATTLE_BACKGROUNDS[currentScene.backgroundKey]
    : currentScene.backgroundImageUrl;

  if (combatState) {
      return <CombatScreen background={backgroundUrl!} />;
  }
   if (showLevelUpScreen) {
      return <LevelUpScreen onComplete={() => setShowLevelUpScreen(false)} />;
  }

  // --- Main render for Visual Novel / Point-and-Click scenes ---
  
  return (
    <>
      <div
        className="h-screen w-screen flex flex-col bg-cover bg-center transition-all duration-1000 bg-black relative"
        style={{ backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined }}
      >
        <ParticleBackground theme={currentScene.particleTheme} />

        <GameHeader />

        <div className="flex-grow">
          {currentScene.type === SceneType.POINT_AND_CLICK && (
            <div className="absolute inset-0 z-10">
              {currentScene.clickableAreas
                ?.filter((area) => !area.condition || checkCondition(area.condition, gameState))
                .map((area, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-solid rounded-md cursor-pointer group pulse-glow"
                    style={{ left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%`, height: `${area.height}%` }}
                    onClick={() => handleChoice({ text: area.tooltip, nextScene: area.nextScene })}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-amber-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medieval">
                      {area.tooltip}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <GameFooter 
          scene={currentScene} 
          choices={visibleChoices}
          isLoading={isChoiceLoading}
          onChoice={handleChoice}
          focusedChoiceIndex={focusedChoiceIndex}
        />
      </div>

      <AutosaveNotification />

      {/* The ModalManager now handles rendering all modals based on the modal store */}
      <ModalManager 
        onReturnToMenu={onReturnToMenu}
        onManualLevelUp={() => setShowLevelUpScreen(true)}
      />
    </>
  );
};
