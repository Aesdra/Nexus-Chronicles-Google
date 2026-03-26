
import { Enemy, DamageType, StatusEffectType } from '../types';
import { IMAGE_ASSETS } from './assets';

export const ENEMIES: Record<string, Enemy> = {
    giant_rat: {
        id: 'giant_rat',
        name: 'Giant Rat',
        description: 'An unnaturally large and aggressive rodent, often found in sewers and cellars.',
        imageUrl: IMAGE_ASSETS.CREATURE_GIANT_RAT,
        notes: 'Weak and cowardly, but can be dangerous in packs.',
        stats: {
            maxHp: 7,
            attackBonus: 4,
            armorClass: 12,
            speed: 15,
            damage: { 
                amount: 4, 
                type: DamageType.PIERCING,
            },
            xpValue: 25,
            lootTable: [
                { itemId: 'potion-of-healing', dropChance: 0.1 }, // 10% chance
                { itemId: 'rat-tail', dropChance: 0.8 } // 80% chance
            ],
            actions: ['basic_attack'],
            role: 'opportunist',
            personality: { aggression: 0.7, caution: 0.8, altruism: 0 }
        }
    },
     goblin_boss: {
        id: 'goblin_boss',
        name: 'Goblin Boss',
        description: 'A particularly large and nasty goblin, wearing crude armor made of scrap metal. He wields a heavy, spiked club.',
        imageUrl: IMAGE_ASSETS.CREATURE_GOBLIN_BRUTE, // Reusing brute image
        notes: 'A tougher version of a goblin brute that can command its underlings.',
        stats: {
            maxHp: 40,
            attackBonus: 5,
            armorClass: 14,
            speed: 15,
            damage: { amount: 10, type: DamageType.BLUDGEONING },
            xpValue: 150,
            lootTable: [
                { itemId: 'potion-of-healing', dropChance: 0.5 },
                { itemId: 'goblin-leader-head', dropChance: 1.0 },
            ],
            actions: ['basic_attack'],
            role: 'striker',
            isDisarmable: true,
            maxStamina: 15,
            martialAbilities: ['power-strike'],
            personality: { aggression: 0.9, caution: 0.3, altruism: 0.1 }
        }
    },
     warehouse_thug: {
        id: 'warehouse_thug',
        name: 'Warehouse Thug',
        description: 'A hired tough paid to guard a shipment. Looks mean, but is probably more interested in getting paid than dying.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        notes: 'A standard human fighter.',
        stats: {
            maxHp: 20,
            attackBonus: 3,
            armorClass: 12,
            speed: 15,
            damage: { amount: 6, type: DamageType.BLUDGEONING },
            xpValue: 50,
            lootTable: [
                { itemId: 'potion-of-healing', dropChance: 0.1 },
            ],
            actions: ['basic_attack'],
            role: 'striker',
            isDisarmable: true,
            personality: { aggression: 0.6, caution: 0.5, altruism: 0.2 }
        }
    },
    bandit_scout: {
        id: 'bandit_scout',
        name: 'Bandit Scout',
        description: 'A nimble bandit who uses a shortbow to harass foes from a distance.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        notes: 'Will try to stay at range. Low HP but can be annoying.',
        stats: {
            maxHp: 18,
            attackBonus: 4,
            armorClass: 13,
            speed: 16,
            damage: { amount: 5, type: DamageType.PIERCING },
            xpValue: 50,
            lootTable: [{ itemId: 'potion-of-stamina', dropChance: 0.1 }],
            actions: ['basic_attack'],
            role: 'opportunist',
            personality: { aggression: 0.6, caution: 0.7, altruism: 0.2 }
        }
    },
    bandit_leader: {
        id: 'bandit_leader',
        name: 'Bandit Leader',
        description: 'The ruthless leader of a bandit crew, skilled with a sword and shield.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        notes: 'A tough combatant who will protect their allies.',
        stats: {
            maxHp: 50,
            attackBonus: 5,
            armorClass: 16,
            speed: 15,
            damage: { amount: 8, type: DamageType.SLASHING },
            xpValue: 200,
            lootTable: [{ itemId: 'longsword-of-the-legion', dropChance: 0.2 }],
            actions: ['basic_attack', 'disarming-strike'],
            role: 'defender',
            isDisarmable: true,
            maxStamina: 20,
            martialAbilities: ['disarming-strike', 'power-strike'],
            personality: { aggression: 0.7, caution: 0.5, altruism: 0.8 }
        }
    },
    scavenger_rival: {
        id: 'scavenger_rival',
        name: 'Scavenger Rival',
        description: 'A grim warrior who believes some legends are best left buried. He moves with a deadly purpose, intent on claiming the Crimson Blades banner.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        notes: 'A skilled fighter who will focus on the player.',
        stats: {
            maxHp: 65,
            attackBonus: 6,
            armorClass: 15,
            speed: 16,
            damage: { amount: 9, type: DamageType.SLASHING },
            xpValue: 300,
            lootTable: [{ itemId: 'rapier', dropChance: 0.5 }, { itemId: 'potion-of-healing', dropChance: 1.0 }],
            actions: ['basic_attack', 'power-strike'],
            role: 'striker',
            isDisarmable: true,
            maxStamina: 25,
            martialAbilities: ['power-strike', 'disarming-strike'],
            personality: { aggression: 0.9, caution: 0.4, altruism: 0.1 }
        }
    },
    goblin_shaman: {
        id: 'goblin_shaman',
        name: 'Goblin Shaman',
        description: 'A goblin that has learned crude but effective magic, often involving minor healing and curses.',
        imageUrl: IMAGE_ASSETS.CREATURE_GOBLIN_SHAMAN,
        notes: 'Will try to keep itself and its allies alive with healing magic before attacking.',
        stats: {
            maxHp: 15,
            maxMana: 20,
            currentMana: 20,
            attackBonus: 2,
            armorClass: 13,
            speed: 12,
            damage: {
                amount: 3,
                type: DamageType.BLUDGEONING
            },
            xpValue: 50,
            lootTable: [
                { itemId: 'potion-of-healing', dropChance: 0.2 },
            ],
            actions: ['basic_attack', 'cast_heal_self'],
            role: 'support',
            isDisarmable: true,
            personality: { aggression: 0.2, caution: 0.7, altruism: 0.9 }
        }
    },
    goblin_brute: {
        id: 'goblin_brute',
        name: 'Goblin Brute',
        description: 'A larger, more muscular goblin that eschews cunning for brute force. It wields a heavy club and charges headfirst into battle.',
        imageUrl: IMAGE_ASSETS.CREATURE_GOBLIN_BRUTE,
        notes: 'Possesses high health and damage, but low armor class. Tends to focus on the strongest-looking opponent.',
        stats: {
            maxHp: 25,
            attackBonus: 5,
            armorClass: 12,
            speed: 15,
            damage: { amount: 8, type: DamageType.BLUDGEONING },
            xpValue: 75,
            lootTable: [{ itemId: 'potion-of-healing', dropChance: 0.15 }],
            actions: ['basic_attack'],
            role: 'striker',
            isDisarmable: true,
            maxStamina: 10,
            martialAbilities: ['power-strike'],
            personality: { aggression: 1.0, caution: 0.1, altruism: 0 }
        }
    },
    hobgoblin_defender: {
        id: 'hobgoblin_defender',
        name: 'Hobgoblin Defender',
        description: 'A disciplined and heavily armored hobgoblin warrior. It uses a large shield and spear to protect its allies and control the frontline.',
        imageUrl: IMAGE_ASSETS.CREATURE_HOBGOBLIN,
        notes: 'High armor class and health. Will try to engage the main player character to draw attention away from weaker allies.',
        stats: {
            maxHp: 22,
            attackBonus: 4,
            armorClass: 18,
            speed: 10,
            damage: { amount: 6, type: DamageType.PIERCING },
            xpValue: 100,
            lootTable: [{ itemId: 'longsword-of-the-legion', dropChance: 0.05 }],
            actions: ['basic_attack'],
            role: 'defender',
            isDisarmable: true,
            maxStamina: 12,
            martialAbilities: ['disarming-strike'],
            personality: { aggression: 0.5, caution: 0.6, altruism: 0.7 }
        }
    },
    kelp_lurker: {
        id: 'kelp_lurker',
        name: 'Kelp Lurker',
        description: 'A massive, amphibious predator with a heavily armored carapace and powerful tentacles.',
        imageUrl: IMAGE_ASSETS.CREATURE_KELP_LURKER,
        notes: 'Vulnerable to fire and lightning. Its tentacles can grapple and crush opponents.',
        stats: {
            maxHp: 150,
            attackBonus: 7,
            armorClass: 16,
            speed: 10,
            damage: { amount: 12, type: DamageType.BLUDGEONING },
            xpValue: 500,
            lootTable: [{ itemId: 'kelp-lurker-heart', dropChance: 1.0 }],
            actions: ['basic_attack'],
            role: 'striker',
            personality: { aggression: 0.8, caution: 0.4, altruism: 0 }
        }
    },
    fey_stalker: {
        id: 'fey_stalker',
        name: 'Fey Stalker',
        description: 'A lithe, predatory creature from the Feywild. It moves with unnatural speed and grace, its claws dripping with a sleep-inducing venom.',
        imageUrl: 'https://i.ibb.co/L8B62Zg/battlerager.jpg', // Placeholder
        notes: 'Fast and difficult to hit. Its venom can incapacitate targets.',
        stats: {
            maxHp: 45,
            attackBonus: 6,
            armorClass: 15,
            speed: 20,
            damage: { 
                amount: 8, 
                type: DamageType.SLASHING,
                onHitEffect: { effects: [{name: 'Stunned', type: 'STUNNED'}], chance: 0.2, duration: 1 }
            },
            xpValue: 200,
            lootTable: [{ itemId: 'moonpetal-flower', dropChance: 1.0 }],
            actions: ['basic_attack'],
            role: 'opportunist',
            personality: { aggression: 0.8, caution: 0.5, altruism: 0.1 }
        }
    },
    restless_legionnaire: {
        id: 'restless_legionnaire',
        name: 'Restless Legionnaire',
        description: 'The spectral remnant of a soldier who died in battle. Bound to its post, it attacks any who disturb its rest with a ghostly blade.',
        imageUrl: 'https://i.ibb.co/PN4gGv8/hobgoblin-defender.jpg', // Placeholder
        notes: 'Resistant to physical damage, but vulnerable to radiant and force damage.',
        stats: {
            maxHp: 30,
            attackBonus: 5,
            armorClass: 14,
            speed: 12,
            damage: { amount: 7, type: DamageType.NECROTIC },
            xpValue: 150,
            lootTable: [{ itemId: 'longsword-of-the-legion', dropChance: 0.1 }],
            actions: ['basic_attack'],
            role: 'striker',
            isDisarmable: true,
            personality: { aggression: 0.9, caution: 0.2, altruism: 0.3 }
        }
    },
    gilded_keeper: {
        id: 'gilded_keeper',
        name: 'Gilded Keeper',
        description: 'A heavily muscled enforcer for the Gilded Cage syndicate. They wear masks of porcelain and velvet to hide their identity.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        notes: 'Fanatically loyal. Wields a heavy mace.',
        stats: {
            maxHp: 45,
            attackBonus: 5,
            armorClass: 14,
            speed: 30,
            damage: { amount: 8, type: DamageType.BLUDGEONING },
            xpValue: 100,
            lootTable: [
                { itemId: 'potion-of-healing', dropChance: 0.25 },
                { itemId: 'fine-dagger', dropChance: 0.1 }
            ],
            actions: ['basic_attack'],
            role: 'striker',
            personality: { aggression: 0.8, caution: 0.2, altruism: 0 }
        }
    },
};
