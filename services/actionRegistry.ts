
/**
 * @file actionRegistry.ts
 * @description
 * This file serves as a centralized registry for all combat action logic. It maps an `actionId`
 * (a string used in spells, martial abilities, and AI strategies) to a `resolve` function.
 * This `resolve` function contains the complete logic for how an action affects the combat state.
 *
 * By decoupling the action's logic from its definition (e.g., in `data/spells.ts`), we create a
 * data-driven combat system that is highly modular and extensible. Adding a new spell or ability
 * with a unique effect only requires adding a new entry to this registry and referencing its key.
 *
 * This file was previously `data/actions.ts` and has been moved to `/services` as part of a
 * refactor to strictly separate data and logic.
 */
import { CombatAction, Combatant, CombatEvent, DamageType } from '../types';
import { getModifiedAttackBonus, getModifiedArmorClass, getModifiedDamage } from './combatCalculations';

// A helper for standard weapon attacks
const resolveBasicAttack = (source: Combatant, target: Combatant): CombatEvent[] => {
    const modifiedAttackBonus = getModifiedAttackBonus(source);
    const modifiedArmorClass = getModifiedArmorClass(target);
    const hitRoll = Math.floor(Math.random() * 20) + 1 + modifiedAttackBonus;
    const hit = hitRoll >= modifiedArmorClass;

    if (!hit) {
        return [{ type: 'LOG_MESSAGE', message: `${source.name} misses ${target.name}.`, logType: 'miss' }];
    }

    const modifiedDamage = getModifiedDamage(source, { amount: source.damage.amount });
    return [{
        type: 'ATTACK_RESOLVED',
        sourceId: source.id,
        targetId: target.id,
        hit: true,
        damage: modifiedDamage.amount,
        damageType: source.damage.type,
    }];
};


export const ACTION_REGISTRY: Record<string, CombatAction> = {
    'basic-attack': {
        resolve: resolveBasicAttack,
    },
    'fire-bolt': {
        resolve: (source, target) => {
            const events: CombatEvent[] = [];
            events.push({
                type: 'ATTACK_RESOLVED',
                sourceId: source.id,
                targetId: target.id,
                hit: true,
                damage: 10,
                damageType: DamageType.FIRE,
                abilityId: 'fire-bolt'
            });

            if (Math.random() < 0.25) { // 25% chance
                events.push({
                    type: 'STATUS_APPLIED',
                    targetId: target.id,
                    effect: {
                        name: 'Burning',
                        type: 'DAMAGE_OVER_TIME',
                        duration: 2,
                        damage: { amount: 3, type: DamageType.FIRE },
                        trigger: 'start-of-turn',
                        sourceId: source.id,
                    }
                });
            }
            return events;
        }
    },
    'acid-splash': {
        resolve: (source, target) => {
             const events: CombatEvent[] = [];
             events.push({
                type: 'ATTACK_RESOLVED',
                sourceId: source.id,
                targetId: target.id,
                hit: true,
                damage: 8,
                damageType: DamageType.ACID,
                abilityId: 'acid-splash'
            });
            if (Math.random() < 0.75) {
                events.push({
                    type: 'STATUS_APPLIED',
                    targetId: target.id,
                    effect: {
                        name: 'Corroding',
                        type: 'ARMOR_DEBUFF',
                        duration: 2,
                        bonus: 2,
                        sourceId: source.id,
                    }
                });
            }
            return events;
        }
    },
    'magic-missile': {
        resolve: (source, target) => [{
            type: 'ATTACK_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            hit: true,
            damage: 12,
            damageType: DamageType.FORCE,
            abilityId: 'magic-missile'
        }]
    },
    'cure-wounds': {
        resolve: (source, target) => [{
            type: 'HEAL_RESOLVED',
            sourceId: source.id,
            targetId: target.id, // Can target self or ally
            amount: 15,
            spellSlug: 'cure-wounds'
        }]
    },
    'healing-word': {
         resolve: (source, target) => [{
            type: 'HEAL_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            amount: 8,
            spellSlug: 'healing-word'
        }]
    },
    'vicious-mockery': {
        resolve: (source, target) => [
            {
                type: 'ATTACK_RESOLVED',
                sourceId: source.id,
                targetId: target.id,
                hit: true,
                damage: 4,
                damageType: DamageType.PSYCHIC,
                abilityId: 'vicious-mockery'
            },
            {
                type: 'STATUS_APPLIED',
                targetId: target.id,
                effect: {
                    name: 'Mocked',
                    type: 'ATTACK_DEBUFF',
                    duration: 1,
                    bonus: 4,
                    sourceId: source.id
                }
            }
        ]
    },
     'bless': {
        resolve: (source, target, allCombatants) => {
            const isPlayerSide = source.type === 'player' || source.type === 'companion';
            
            // Determine potential targets based on team
            const potentialTargets = allCombatants.filter(c => {
                if (c.isDefeated) return false;
                if (isPlayerSide) {
                    return c.type === 'player' || c.type === 'companion';
                } else {
                    return c.type === 'enemy';
                }
            });

            const finalTargets: typeof allCombatants = [];
            
            // 1. Prioritize the selected target if valid (User Intent)
            if (potentialTargets.some(t => t.id === target.id)) {
                finalTargets.push(target);
            }

            // 2. Fill remaining slots (up to 3 total) with other allies
            for (const ally of potentialTargets) {
                if (finalTargets.length >= 3) break;
                if (ally.id !== target.id) {
                    finalTargets.push(ally);
                }
            }

            return finalTargets.map(t => ({
                type: 'STATUS_APPLIED',
                targetId: t.id,
                effect: {
                    name: 'Blessed',
                    type: 'ATTACK_BUFF',
                    duration: 3,
                    bonus: 2, // Approx 1d4
                    sourceId: source.id
                }
            }));
        }
    },
    'compelled-duel': {
        resolve: (source, target) => [{
            type: 'STATUS_APPLIED',
            targetId: target.id,
            effect: {
                name: 'Taunted',
                type: 'TAUNTED',
                duration: 3,
                sourceId: source.id,
            }
        }]
    },
    'mage-armor': {
        resolve: (source, target) => [{
            type: 'STATUS_APPLIED',
            targetId: source.id, // Mage armor is always self-cast
            effect: {
                name: 'Mage Armor',
                type: 'ARMOR_BUFF',
                duration: 10, // A long duration for a whole combat
                bonus: 3,
                sourceId: source.id,
            }
        }]
    },
    'sacred-flame': {
        resolve: (source, target) => [{
            type: 'ATTACK_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            hit: true,
            damage: 8,
            damageType: DamageType.RADIANT,
            abilityId: 'sacred-flame'
        }]
    },
    'guiding-bolt': {
        resolve: (source, target) => [
             {
                type: 'ATTACK_RESOLVED',
                sourceId: source.id,
                targetId: target.id,
                hit: true,
                damage: 15,
                damageType: DamageType.RADIANT,
                abilityId: 'guiding-bolt'
            },
            {
                type: 'STATUS_APPLIED',
                targetId: target.id,
                effect: {
                    name: 'Illuminated',
                    type: 'ARMOR_DEBUFF',
                    duration: 1,
                    bonus: 4,
                    sourceId: source.id
                }
            }
        ]
    },
    'power-strike': {
        resolve: (source, target) => {
            // Power strike adds damage to a basic attack.
            const baseAttackEvents = resolveBasicAttack(source, target);
            if (baseAttackEvents[0].type === 'ATTACK_RESOLVED' && baseAttackEvents[0].hit) {
                const modifiedEvent = {
                    ...baseAttackEvents[0],
                    damage: (baseAttackEvents[0].damage || 0) + 5,
                    abilityId: 'power-strike'
                };
                return [modifiedEvent];
            }
            return baseAttackEvents;
        }
    },
    'disarming-strike': {
        resolve: (source, target) => {
            const events = resolveBasicAttack(source, target);
             if (events[0].type === 'ATTACK_RESOLVED' && events[0].hit) {
                 if (Math.random() < 0.5) { // 50% chance
                    events.push({
                        type: 'STATUS_APPLIED',
                        targetId: target.id,
                        effect: {
                            name: 'Disarmed',
                            type: 'DISARMED',
                            duration: 2,
                            bonus: 0.5, // 50% damage reduction
                            sourceId: source.id
                        }
                    });
                 }
             }
             return events;
        }
    },
    'hamstring-shot': {
        resolve: (source, target) => {
            const events = resolveBasicAttack(source, target);
             if (events[0].type === 'ATTACK_RESOLVED' && events[0].hit) {
                 if (Math.random() < 0.8) {
                    events.push({
                        type: 'STATUS_APPLIED',
                        targetId: target.id,
                        effect: {
                            name: 'Slowed',
                            type: 'SLOWED',
                            duration: 3,
                            bonus: 2, // -2 AC penalty
                            sourceId: source.id
                        }
                    });
                 }
             }
             return events;
        }
    },
     'power-shot': {
        resolve: (source, target) => {
            const baseAttackEvents = resolveBasicAttack(source, target);
            if (baseAttackEvents[0].type === 'ATTACK_RESOLVED' && baseAttackEvents[0].hit) {
                const modifiedEvent = {
                    ...baseAttackEvents[0],
                    damage: (baseAttackEvents[0].damage || 0) + 8,
                    abilityId: 'power-shot'
                };
                return [modifiedEvent];
            }
            return baseAttackEvents;
        }
    },
    'multi-shot': {
        resolve: (source, target) => {
            const firstShot = resolveBasicAttack(source, target);
            const secondShot = resolveBasicAttack(source, target);
            return [...firstShot, ...secondShot];
        }
    },
    'ensnaring-strike': {
        resolve: (source, target) => {
             const events = resolveBasicAttack(source, target);
             if (events[0].type === 'ATTACK_RESOLVED' && events[0].hit) {
                events.push({
                    type: 'STATUS_APPLIED',
                    targetId: target.id,
                    effect: {
                        name: 'Stunned', // Simplified to a stun for now
                        type: 'STUNNED',
                        duration: 1,
                        sourceId: source.id
                    }
                });
             }
             return events;
        }
    },
    'hail-of-thorns': {
        resolve: (source, target, allCombatants) => {
            const mainAttack = resolveBasicAttack(source, target);
            if (mainAttack[0].type === 'ATTACK_RESOLVED' && mainAttack[0].hit) {
                const splashTargets = allCombatants.filter(c => c.id !== target.id && c.type !== source.type && !c.isDefeated);
                const splashEvents = splashTargets.map(st => ({
                     type: 'ATTACK_RESOLVED',
                     sourceId: source.id,
                     targetId: st.id,
                     hit: true,
                     damage: 4,
                     damageType: DamageType.PIERCING,
                     abilityId: 'hail-of-thorns',
                 } as CombatEvent));
                 return [...mainAttack, ...splashEvents];
            }
            return mainAttack;
        }
    },
    'wails-from-the-grave': {
        resolve: (source, target, allCombatants) => {
            // 1. Primary Attack
            const mainAttack = resolveBasicAttack(source, target);
            
            // 2. If it hits, deal secondary necrotic damage to another target
            if (mainAttack[0].type === 'ATTACK_RESOLVED' && mainAttack[0].hit) {
                // Find a secondary target (enemy of source, not the main target, not defeated)
                const secondaryTarget = allCombatants.find(c => 
                    c.type !== source.type && 
                    c.id !== target.id && 
                    !c.isDefeated
                );

                if (secondaryTarget) {
                    const secondaryDamage = Math.ceil((mainAttack[0].damage || 0) / 2);
                    const secondaryEvent: CombatEvent = {
                        type: 'ATTACK_RESOLVED',
                        sourceId: source.id,
                        targetId: secondaryTarget.id,
                        hit: true,
                        damage: secondaryDamage,
                        damageType: DamageType.NECROTIC,
                        abilityId: 'wails-from-the-grave',
                    };
                    return [...mainAttack, secondaryEvent];
                }
            }
            return mainAttack;
        }
    }
};
