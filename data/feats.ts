import { Feat } from '../types';

export const FEATS: Record<string, Feat> = {
    'resilient-constitution': {
        id: 'resilient-constitution',
        name: 'Resilient (Constitution)',
        description: 'Increase your Constitution score by 1, to a maximum of 20.',
        effects: {
            stats: { constitution: 1 }
        }
    },
    'resilient-strength': {
        id: 'resilient-strength',
        name: 'Resilient (Strength)',
        description: 'Increase your Strength score by 1, to a maximum of 20.',
        effects: {
            stats: { strength: 1 }
        }
    },
    'toughness': {
        id: 'toughness',
        name: 'Toughness',
        description: 'Your hit point maximum increases by 10.',
        effects: {
            stats: { maxHp: 10 }
        }
    },
    'arcanist': {
        id: 'arcanist',
        name: 'Arcanist',
        description: 'Your maximum mana increases by 10.',
        effects: {
            stats: { maxMana: 10 }
        }
    }
};

export const ALL_FEATS = Object.values(FEATS);
