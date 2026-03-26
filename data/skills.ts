import { Skill } from '../types';

export const SKILLS: Record<string, Skill> = {
    'power-attack': {
        id: 'power-attack',
        name: 'Power Attack',
        description: 'Before you make a melee attack on your turn, you can choose to take a -2 penalty to the attack roll. If the attack hits, you add +4 to the attack\'s damage.',
        classRequirement: ['fighter', 'barbarian', 'paladin'],
    },
    'cleave': {
        id: 'cleave',
        name: 'Cleave',
        description: 'Once on your turn when you reduce a hostile creature to 0 hit points with a melee attack, you can make another melee attack against a different creature within 5 feet of the original target and within your reach.',
        classRequirement: ['fighter', 'barbarian', 'paladin'],
    }
};

export const ALL_SKILLS = Object.values(SKILLS);
