
import { GameStore, CompanionDialogue } from '../../types';
import { ALL_DIALOGUES } from '../../data/dialogues/index';
import { getScene } from '../../services/dataService';
import { checkCondition } from '../../services/conditionRegistry';

export const selectAvailableDialogues = (state: GameStore): CompanionDialogue[] => {
    if (state.party.length === 0) return [];
    
    const currentScene = getScene(state.currentSceneId);
    const isPrivateZone = currentScene?.safeZoneType === 'private';

    // Get all IDs of current party members
    const partyIds = state.party.map(c => c.id);

    return ALL_DIALOGUES.filter(dialogue => {
        // Only show dialogues for companions currently in the party
        if (!partyIds.includes(dialogue.companionId)) return false;
        
        if ((state.readDialogueIds || []).includes(dialogue.id)) return false;
        
        // Check privacy requirement
        if (dialogue.requiresPrivateZone && !isPrivateZone) return false;

        return checkCondition(dialogue.condition, state);
    }).sort((a, b) => b.priority - a.priority);
};

export const selectHasUnreadDialogues = (state: GameStore): boolean => {
    return selectAvailableDialogues(state).length > 0;
};

export const selectImportantDialogueAvailable = (state: GameStore): boolean => {
    const available = selectAvailableDialogues(state);
    return available.some(d => d.priority >= 10);
};
