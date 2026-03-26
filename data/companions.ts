import { Companion, CompanionAbilityProgression } from '../types';
import { IMAGE_ASSETS } from './assets';
import { ITEMS } from './items';

export const LYRA_PROGRESSION: CompanionAbilityProgression = {
    3: {
        choices: [
            { type: 'ability', id: 'power-shot' },
            { type: 'spell', id: 'ensnaring-strike' }
        ]
    },
    5: {
        choices: [
            { type: 'ability', id: 'multi-shot' },
            { type: 'spell', id: 'hail-of-thorns' }
        ]
    }
}

export const VESPERA_PROGRESSION: CompanionAbilityProgression = {
    3: {
        choices: [
            { type: 'ability', id: 'hamstring-shot' }, // Reusing existing abilities for now
        ]
    },
    5: {
        choices: [
            { type: 'ability', id: 'disarming-strike' },
        ]
    }
}

export const COMPANIONS: Record<string, Companion> = {
    'lyra': {
        id: 'lyra',
        name: 'Lyra',
        race: 'Human',
        subRace: 'Riverfolk',
        characterClass: 'Ranger',
        subClass: 'Hunter',
        level: 1,
        xp: 0,
        affinity: 50,
        backstory: "Lyra is a pragmatic and skilled ranger, a sworn agent of the Guardians of the Threshold. She was guided to the Whispering Crypt to investigate a growing dark influence, where she encountered the newly-awakened Chosen One. While she appears aloof, she is fiercely loyal to the cause of restoring balance and will protect those she deems worthy.",
        spriteUrl: IMAGE_ASSETS.COMPANION_LYRA,
        stats: {
            hp: 90,
            maxHp: 90,
            stamina: 15,
            maxStamina: 15,
            strength: 12,
            dexterity: 17,
            constitution: 14,
            intelligence: 11,
            wisdom: 15,
            charisma: 10,
        },
        equipment: {
            mainHand: null,
            chest: ITEMS['leather-armor'],
        },
        spells: [],
        martialAbilities: ['hamstring-shot'],
        personality: { aggression: 0.7, caution: 0.6, altruism: 0.4 },
        sexualOrientation: 'Bisexual',
        questlineId: 'lyras_past',
        role: 'striker',
    },
    'vespera': {
        id: 'vespera',
        name: "Vespera 'Gutter-Rot' Thorne",
        race: 'Tiefling',
        subRace: 'Levistus',
        characterClass: 'Rogue',
        subClass: 'Phantom',
        level: 1,
        xp: 0,
        affinity: 20, // Starts very low trust
        backstory: "Sold by her debt-ridden parents to a high-end trafficking ring known as 'The Gilded Cage', Vespera was magically sculpted and tormented for years as a vessel for the twisted fantasies of the nobility. Her mind shattered before her body did. In a moment of total dissociation, she unlocked the Phantom ability to tear souls from bodies, slaughtering her captors and burning the establishment to the ground. She now wanders the gutters, addicted to painkillers to numb her trauma, hunting slavers with a jagged, feral rage. She trusts no one, viewing kindness as a manipulation tactic.",
        spriteUrl: IMAGE_ASSETS.COMPANION_VESPERA,
        stats: {
            hp: 85,
            maxHp: 85, // High CON
            stamina: 12,
            maxStamina: 12,
            strength: 8, // Low Str
            dexterity: 18, // High Dex
            constitution: 16, // High Con
            intelligence: 12,
            wisdom: 16, // High Wis (Hyper-vigilant)
            charisma: 6, // Very Low Cha
        },
        equipment: {
            mainHand: ITEMS['the-mercy'],
            chest: ITEMS['ragged-cloak'],
        },
        spells: [],
        martialAbilities: ['hamstring-shot'], // Needs Rogue abilities implemented later
        personality: { aggression: 0.9, caution: 0.9, altruism: 0.1 }, // Hostile and hyper-cautious
        sexualOrientation: 'Asexual', // Anti-sexual due to trauma
        questlineId: 'gutter_rot_revenge',
        role: 'striker',
    }
};