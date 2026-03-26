import { Creature, DamageType } from '../types';
import { IMAGE_ASSETS } from './assets';

export const CREATURES: Creature[] = [
    {
        id: 'crypt_ghoul',
        name: 'Crypt Ghoul',
        description: `A gaunt, humanoid creature that haunts ancient tombs and graveyards. Ghouls are driven by an insatiable hunger for the flesh of the dead, but they are also drawn to powerful necrotic or divine energy sources, which they seem to mindlessly guard or worship.`,
        imageUrl: IMAGE_ASSETS.CREATURE_GHOUL,
        notes: `While they possess a paralyzing touch, they are often single-minded and can be easily avoided if not confronted directly. They appear to be territorial but not actively malicious unless their territory or the object of their fixation is threatened.`,
        stats: {
            maxHp: 22,
            attackBonus: 4,
            armorClass: 12,
            speed: 30,
            damage: { amount: 7, type: DamageType.SLASHING },
            actions: ['Claw'],
            role: 'Undead Scavenger',
            personality: { aggression: 0.8, caution: 0.2, altruism: 0 },
            martialAbilities: []
        }
    },
    {
        id: 'goblin_skirmisher',
        name: 'Goblin Skirmisher',
        description: 'Small, wiry, and vicious, goblin skirmishers are the frontline troops of their clans. They fight with a desperate cunning, using hit-and-run tactics and sheer numbers to overwhelm their foes.',
        imageUrl: IMAGE_ASSETS.CREATURE_GOBLIN_SKIRM,
        notes: 'Individually weak, but dangerous in groups. They often set simple traps and use the terrain to their advantage. Rarely fight to the death if the odds turn against them.',
        stats: {
            maxHp: 7,
            attackBonus: 4,
            armorClass: 15,
            speed: 30,
            damage: { amount: 5, type: DamageType.SLASHING },
            actions: ['Scimitar', 'Shortbow'],
            role: 'Skirmisher',
            personality: { aggression: 0.6, caution: 0.7, altruism: 0.1 },
            martialAbilities: []
        }
    },
    {
        id: 'kelp_lurker',
        name: 'Kelp Lurker',
        description: 'A massive, amphibious predator that makes its lair in dense coastal kelp forests. Its mottled green-and-brown hide provides perfect camouflage. It attacks ships from below, using its powerful tentacles to drag sailors into the depths and its armored beak to crush hulls.',
        imageUrl: IMAGE_ASSETS.CREATURE_KELP_LURKER,
        notes: 'Vulnerable to fire and lightning. Its primary weakness is its underbelly, which is softer than its armored carapace. Tends to retreat to the depths if heavily wounded.',
        stats: {
            maxHp: 150,
            attackBonus: 7,
            armorClass: 16,
            speed: 10,
            damage: { amount: 12, type: DamageType.BLUDGEONING },
            actions: ['Tentacle Slam', 'Beak Bite'],
            role: 'Apex Predator',
            personality: { aggression: 0.9, caution: 0.3, altruism: 0 },
            martialAbilities: []
        }
    },
    {
        id: 'fey_stalker',
        name: 'Fey Stalker',
        description: 'A lithe, predatory creature from the Feywild that has slipped through a thin part of the veil into the mortal world. It moves with an unnatural, jarring grace, seeming to flicker in and out of sight. Its claws are sharp as obsidian and drip with a potent, sleep-inducing venom.',
        imageUrl: 'https://i.ibb.co/L8B62Zg/battlerager.jpg', // Placeholder
        notes: 'These creatures are drawn to places of strong natural or magical energy. They are territorial hunters and should be approached with extreme caution.',
        stats: {
            maxHp: 45,
            attackBonus: 6,
            armorClass: 15,
            speed: 40,
            damage: { amount: 8, type: DamageType.SLASHING },
            actions: ['Shadow Claw', 'Blink'],
            role: 'Ambush Predator',
            personality: { aggression: 0.8, caution: 0.5, altruism: 0.1 },
            martialAbilities: []
        }
    },
    {
        id: 'restless_legionnaire',
        name: 'Restless Legionnaire',
        description: 'The spectral remnant of a soldier who died a traumatic death in battle, their spirit bound to their post by a powerful sense of duty or regret. Clad in ethereal armor, they guard their final resting place against all intruders, unable to distinguish friend from foe.',
        imageUrl: 'https://i.ibb.co/PN4gGv8/hobgoblin-defender.jpg', // Placeholder
        notes: 'Being incorporeal, they are resistant to normal weaponry. Magic, silvered weapons, or radiant energy are far more effective against these tormented souls.',
        stats: {
            maxHp: 30,
            attackBonus: 5,
            armorClass: 14,
            speed: 25,
            damage: { amount: 7, type: DamageType.NECROTIC },
            actions: ['Ghostly Blade'],
            role: 'Spectral Guardian',
            personality: { aggression: 0.9, caution: 0.1, altruism: 0 },
            martialAbilities: []
        }
    },
    {
        id: 'giant_rat',
        name: 'Giant Rat',
        description: 'An unnaturally large and aggressive rodent, often found in sewers and cellars. Its size makes it far more dangerous than its smaller kin, capable of delivering a nasty bite.',
        imageUrl: IMAGE_ASSETS.CREATURE_GIANT_RAT,
        notes: 'Giant rats are cowardly and will flee if seriously injured. They often attack in packs.',
        stats: {
            maxHp: 7,
            attackBonus: 4,
            armorClass: 12,
            speed: 30,
            damage: { amount: 4, type: DamageType.PIERCING },
            actions: ['Bite'],
            role: 'Scavenger',
            personality: { aggression: 0.7, caution: 0.8, altruism: 0 },
            martialAbilities: []
        }
    },
    {
        id: 'goblin_brute',
        name: 'Goblin Brute',
        description: 'A larger, more muscular goblin that eschews cunning for brute force. It wields a heavy club and charges headfirst into battle.',
        imageUrl: IMAGE_ASSETS.CREATURE_GOBLIN_BRUTE,
        notes: 'Possesses high health and damage, but low armor class. Tends to focus on the strongest-looking opponent.',
        stats: {
            maxHp: 25,
            attackBonus: 5,
            armorClass: 12,
            speed: 30,
            damage: { amount: 8, type: DamageType.BLUDGEONING },
            actions: ['Club Smash'],
            role: 'Brute',
            personality: { aggression: 1.0, caution: 0.1, altruism: 0 },
            martialAbilities: ['power-strike']
        }
    },
    {
        id: 'hobgoblin_defender',
        name: 'Hobgoblin Defender',
        description: 'A disciplined and heavily armored hobgoblin warrior. It uses a large shield and spear to protect its allies and control the frontline.',
        imageUrl: IMAGE_ASSETS.CREATURE_HOBGOBLIN,
        notes: 'High armor class and health. Will try to engage the main player character to draw attention away from weaker allies.',
        stats: {
            maxHp: 22,
            attackBonus: 4,
            armorClass: 18,
            speed: 30,
            damage: { amount: 6, type: DamageType.PIERCING },
            actions: ['Spear Thrust', 'Shield Bash'],
            role: 'Defender',
            personality: { aggression: 0.5, caution: 0.6, altruism: 0.7 },
            martialAbilities: ['disarming-strike']
        }
    },
];