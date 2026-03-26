

import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/store';
import { useModalStore } from '../../store/modalStore';
import { GearIcon } from '../icons/GearIcon';
import { CampfireIcon } from '../icons/CampfireIcon';
import { StatusBar } from '../ui/StatusBar';
import { selectPlayer, selectVitals, selectExperience } from '../../store/selectors/playerSelectors';
import { selectHasUnreadDialogues, selectImportantDialogueAvailable } from '../../store/selectors/dialogueSelectors';
import { getScene } from '../../services/dataService';
import { cn } from '../../lib/utils';

/**
 * A dedicated component for rendering the game's main header UI.
 * It is self-contained, fetching necessary player data from the `useGameStore`
 * and dispatching modal actions via the `useModalStore`.
 */
export const GameHeader: React.FC = () => {
    const player = useGameStore(selectPlayer);
    const { hp, maxHp, mana, maxMana, stamina, maxStamina } = useGameStore(selectVitals);
    const { xp, xpToNextLevel, level } = useGameStore(selectExperience);
    const currentSceneId = useGameStore(state => state.currentSceneId);

    // Dialogue notifications
    const hasUnread = useGameStore(selectHasUnreadDialogues);
    const isImportant = useGameStore(selectImportantDialogueAvailable);

    const { openModal, analysisFileInputTrigger } = useModalStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if current scene is a safe zone
    const currentScene = getScene(currentSceneId);
    const isSafeZone = !!currentScene?.safeZoneType; // Checks if 'public' or 'private' is set

    // This effect listens for a trigger from the modal store and programmatically clicks the hidden file input.
    useEffect(() => {
        if (analysisFileInputTrigger > 0 && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [analysisFileInputTrigger]);

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            openModal('analysis', { file });
        }
        // Reset the input value to allow selecting the same file again
        if(event.target) event.target.value = '';
    };

    if (!player) return null;

    return (
        <header className="bg-gradient-to-b from-black/70 to-transparent p-2 flex items-center justify-between z-20">
            {/* PLAYER IDENTITY ZONE */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => openModal('characterSheet')}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-stone-800/50 transition-colors"
                    aria-label="Open Character Sheet"
                >
                    <img 
                        src={player.spriteUrl || `https://picsum.photos/seed/avatar-${player.name}/64/64`} 
                        alt={player.name} 
                        className="w-12 h-12 rounded-full border-2 border-amber-800 object-cover" 
                    />
                </button>
                <div>
                    <h2 className="font-medieval text-lg text-amber-100 truncate max-w-[120px]">{player.name}</h2>
                    <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="font-bold text-amber-300">Lvl {level}</span>
                        <div className="w-16">
                            <StatusBar
                                currentValue={xp}
                                maxValue={xpToNextLevel}
                                colorClass="bg-yellow-400"
                                label="Experience"
                                showText={false}
                                barClassName="h-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* PLAYER STATUS & GLOBAL MENU ZONE */}
            <div className="flex items-center gap-3">
                <div className="w-28 text-xs space-y-0.5 hidden sm:block">
                    <div title={`HP: ${hp}/${maxHp}`}>
                        <StatusBar
                            currentValue={hp}
                            maxValue={maxHp}
                            colorClass="bg-red-600"
                            label="Health"
                            barClassName="h-3 bg-black/50 border-stone-600"
                            textClassName="text-[10px]"
                        />
                    </div>
                     <div title={`MP: ${mana}/${maxMana}`}>
                        <StatusBar
                            currentValue={mana}
                            maxValue={maxMana}
                            colorClass="bg-blue-600"
                            label="Mana"
                            barClassName="h-3 bg-black/50 border-stone-600"
                            textClassName="text-[10px]"
                        />
                    </div>
                    <div title={`ST: ${stamina}/${maxStamina}`}>
                        <StatusBar
                            currentValue={stamina}
                            maxValue={maxStamina}
                            colorClass="bg-yellow-500"
                            label="Stamina"
                            barClassName="h-3 bg-black/50 border-stone-600"
                            textClassName="text-[10px]"
                        />
                    </div>
                </div>

                {/* Safe Zone / Camp Button */}
                {isSafeZone && (
                    <div className="relative">
                        <button
                            onClick={() => openModal('companionHub')}
                            className="p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/80 text-amber-300 hover:text-white transition-colors relative"
                            aria-label="Open Camp"
                            title="Camp / Companions"
                        >
                            <CampfireIcon />
                        </button>
                        {hasUnread && (
                            <span className={cn(
                                "absolute top-0 right-0 w-3 h-3 rounded-full border border-black",
                                isImportant ? "bg-amber-400 animate-pulse" : "bg-stone-300"
                            )} />
                        )}
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    className="hidden"
                    accept="image/*"
                    aria-hidden="true"
                />
                <button
                    onClick={() => openModal('gameMenu')}
                    className="p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/80 text-amber-300 hover:text-white transition-colors"
                    aria-label="Open Game Menu"
                >
                    <GearIcon />
                </button>
            </div>
        </header>
    );
};
