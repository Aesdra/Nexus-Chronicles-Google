
import { CampUpgrade } from '../types';

export const CAMP_UPGRADES: CampUpgrade[] = [
    {
        id: 'field_kitchen',
        name: 'Field Kitchen',
        description: 'A dedicated cooking station with improved supplies and utensils. Allows for the preparation of heartier, more nutritious meals.',
        cost: 300,
        effectDescription: 'Grants the "Well Fed" buff when resting (+5 Max HP until next rest).',
    },
    {
        id: 'training_grounds',
        name: 'Training Grounds',
        description: 'A cleared area with dummies, targets, and sparring gear. Perfect for drilling maneuvers and refining combat techniques.',
        cost: 400,
        effectDescription: 'Resting grants a small amount of XP (50 XP).',
    },
    {
        id: 'infirmary',
        name: 'Field Infirmary',
        description: 'A tent stocked with bandages, salves, and clean linens. Provides a sanitary environment for treating wounds and preventing infection.',
        cost: 500,
        effectDescription: 'Resting heals 100% HP (instead of partial) and removes negative status effects.',
    }
];
