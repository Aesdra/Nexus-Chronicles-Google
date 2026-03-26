
import { Ally, DamageType } from '../types';
import { IMAGE_ASSETS } from './assets';

export const ALLIES: Record<string, Ally> = {
    finn_cellar: {
        id: 'finn_cellar',
        name: 'Finn',
        description: 'A young, nervous but determined tavern worker.',
        imageUrl: IMAGE_ASSETS.ALLY_FINN,
        notes: 'Wields a pitchfork.',
        stats: {
            maxHp: 20,
            attackBonus: 1,
            armorClass: 10,
            speed: 10,
            damage: { 
                amount: 4, 
                type: DamageType.PIERCING,
            },
            actions: ['basic_attack'],
            role: 'opportunist',
            personality: { aggression: 0.3, caution: 0.8, altruism: 0.6 }
        }
    },
    vespera: {
        id: 'vespera',
        name: 'Vespera',
        description: 'A desperate, cornered tiefling fighting with feral intensity.',
        imageUrl: IMAGE_ASSETS.COMPANION_VESPERA,
        notes: 'She fights with zero regard for her own safety.',
        stats: {
            maxHp: 35,
            attackBonus: 5,
            armorClass: 14,
            speed: 16,
            damage: { 
                amount: 6, // Shank damage
                type: DamageType.PIERCING,
            },
            actions: ['basic_attack', 'wails-from-the-grave'],
            role: 'striker',
            personality: { aggression: 1.0, caution: 0.1, altruism: 0 },
            martialAbilities: ['wails-from-the-grave']
        }
    }
};
