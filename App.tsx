import React, { useState, useEffect } from 'react';
import { GameScreen as ScreenType, PlayerCharacter, GameState, GameSave } from './types';
import { useGameStore } from './store/store';
import { db } from './db';
// FIX: Corrected import path for LoadingSpinner
import { LoadingSpinner } from './components/LoadingSpinner';
import { preloadAllItems } from './services/dataService';
import { dummySave } from './dev/dummySave';

// Statically import screen components to bypass dynamic import issues.
import { MainMenuScreen } from './screens/MainMenuScreen';
import { CharacterCreationScreen } from './screens/CharacterCreationScreen';
import { GameScreen } from './screens/GameScreen';
import { LevelUpModal } from './components/LevelUpModal';
import { LevelUpScreen } from './components/LevelUpScreen';
import { ApiKeyGuard } from './components/ApiKeyGuard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(ScreenType.MAIN_MENU);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { initializeNewGame, hydrate, player } = useGameStore(state => ({
      initializeNewGame: state.initializeNewGame,
      hydrate: state.hydrate,
      player: state.player,
  }));

  useEffect(() => {
    const initializeApp = async () => {
        setIsLoading(true);
        try {
            // Check for existing save data
            const count = await db.gameSaves.count();
            setHasSaveData(count > 0);

            // Preload essential game data
            await preloadAllItems();
        } catch (error) {
            console.error("Error during app initialization:", error);
        } finally {
            setIsLoading(false);
        }
    };

    initializeApp();
  }, []);

  // Effect to handle invalid state: navigating to gameplay without a player.
  useEffect(() => {
    if (!isLoading && currentScreen === ScreenType.GAMEPLAY && !player) {
      console.warn("Attempted to render Gameplay screen without a player. Returning to menu.");
      setCurrentScreen(ScreenType.MAIN_MENU);
    }
  }, [isLoading, currentScreen, player]);


  const handleNewGame = async () => {
    // We don't need to delete all saves, just start the creation process
    setCurrentScreen(ScreenType.CHARACTER_CREATION);
  };

  const handleContinue = async () => {
    // "Continue" always loads the autosave from slot 1
    const savedGame = await db.gameSaves.get(1);
    if (savedGame) {
      handleLoadGame(savedGame);
    } else {
        console.warn("Continue was clicked, but no autosave data found. This shouldn't happen if a game has been started.");
    }
  };

  const handleLoadGame = (savedGame: GameSave) => {
    const gameStateToLoad: GameState = {
        ...savedGame,
        player: savedGame.player ? {
            ...savedGame.player,
            reputation: savedGame.player.reputation || {},
        } : null,
        combatState: null, // Re-add null combatState to conform to GameState type
        isLevelUpPending: savedGame.isLevelUpPending || false,
        actionCounters: savedGame.actionCounters || {},
        factionRelationsOverrides: savedGame.factionRelationsOverrides || {},
        // FIX: Add missing companionLevelUpInfo property to conform to GameState.
        // This is a transient state and should be reset when loading a save.
        companionLevelUpInfo: null,
        // FIX: Add missing tradeSession property to conform to GameState.
        // This is a transient state and should be reset when loading a save.
        tradeSession: null,
    };
    hydrate(gameStateToLoad as any); // Casting to any to bypass strict check during load
    setCurrentScreen(ScreenType.GAMEPLAY);
  };
  
  const handleCharacterCreated = async (character: PlayerCharacter) => {
    await initializeNewGame(character);
    setHasSaveData(true);
    setCurrentScreen(ScreenType.GAMEPLAY);
  };

  const handleReturnToMenu = () => {
      setCurrentScreen(ScreenType.MAIN_MENU);
      // Re-check save data when returning to menu
      db.gameSaves.count().then(count => setHasSaveData(count > 0));
  }

  const handleDevQuickstart = () => {
    hydrate(dummySave as any); // Cast to any to bypass strict check
    setHasSaveData(true); // Ensure continue/load buttons are enabled after this
    setCurrentScreen(ScreenType.GAMEPLAY);
  };


  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case ScreenType.CHARACTER_CREATION:
        return <CharacterCreationScreen onCharacterCreated={handleCharacterCreated} onBackToMenu={handleReturnToMenu} />;
      case ScreenType.GAMEPLAY:
        // This is now guarded by the useEffect, but we can keep the check for safety.
        return player ? <GameScreen onReturnToMenu={handleReturnToMenu} /> : null;
      case ScreenType.MAIN_MENU:
      default:
        return <MainMenuScreen onNewGame={handleNewGame} onContinue={handleContinue} onLoadGame={handleLoadGame} hasSaveData={hasSaveData} onDevQuickstart={handleDevQuickstart} />;
    }
  };

  // First, show a loading spinner while essential game data is fetched.
  if (isLoading) {
      return <div className="h-screen w-screen flex items-center justify-center bg-black"><LoadingSpinner text="Summoning game data..."/></div>;
  }

  // Once data is loaded, render the app. The Suspense wrapper for lazy loading is no longer needed here.
  return (
    <ApiKeyGuard>
      <div className="bg-slate-900 text-white min-h-screen">
        {renderCurrentScreen()}
      </div>
    </ApiKeyGuard>
  );
};

export default App;
