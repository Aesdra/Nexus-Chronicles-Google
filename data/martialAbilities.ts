
import { MartialAbility } from "../types";

export const MARTIAL_ABILITIES: Record<string, MartialAbility> = {
    'power-strike': {
        id: 'power-strike',
        name: 'Power Strike',
        description: 'A focused and powerful attack that deals additional damage.',
        staminaCost: 5,
        targetType: 'enemy',
        actionId: 'power-strike',
    },
    'disarming-strike': {
        id: 'disarming-strike',
        name: 'Disarming Strike',
        description: 'A precise strike aimed to knock the weapon from an enemy\'s grasp, reducing their damage.',
        staminaCost: 8,
        targetType: 'enemy',
        actionId: 'disarming-strike',
    },
    'hamstring-shot': {
        id: 'hamstring-shot',
        name: 'Hamstring Shot',
        description: 'A targeted ranged attack that hinders the enemy\'s movement, making them easier to hit.',
        staminaCost: 7,
        targetType: 'enemy',
        actionId: 'hamstring-shot',
    },
    'power-shot': {
        id: 'power-shot',
        name: 'Power Shot',
        description: 'A carefully aimed and powerful ranged shot that deals significant piercing damage.',
        staminaCost: 10,
        targetType: 'enemy',
        actionId: 'power-shot',
    },
    'multi-shot': {
        id: 'multi-shot',
        name: 'Multi-shot',
        description: 'Fire two arrows in quick succession at the same target.',
        staminaCost: 15,
        targetType: 'enemy',
        actionId: 'multi-shot',
    },
    'wails-from-the-grave': {
        id: 'wails-from-the-grave',
        name: 'Wails from the Grave',
        description: 'As you strike your foe, you channel the torment of the dead to inflict necrotic damage on a second nearby enemy.',
        staminaCost: 10,
        targetType: 'enemy',
        actionId: 'wails-from-the-grave',
    }
};
