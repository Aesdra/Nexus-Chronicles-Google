
/**
 * @file effectRegistry.ts
 * @description
 * This file serves as a centralized registry for all game logic effects that can be triggered
 * by scenes or player choices. By decoupling logic from the data in `data/scenes.ts`,
 * we achieve several key benefits:
 * 1.  **Data Purity:** Scene and choice data becomes pure, serializable (like JSON), which is
 *     essential for a robust save/load system.
 * 2.  **Modularity & Reusability:** Effects can be easily reused across multiple scenes or choices
 *     without duplicating code.
 * 3.  **Testability:** Each effect function can be individually imported and unit-tested
 *     in isolation.
 * 4.  **Maintainability:** All game logic is consolidated in one place, making it easier to
 *     find, modify, and debug.
 *
 * The `EFFECT_REGISTRY` object maps a unique string identifier (e.g., 'ADD_HEALING_POTION_TO_INVENTORY')
 * to a function that takes the current `GameState` and returns the modified `GameState`.
 * The game engine (`store/gameSlice.ts`) uses this registry to execute effects based on the
 * `effectId` property in scene or choice objects.
 */

import { GameState } from '../types';
import { ITEMS } from '../data/items';
import { COMPANIONS } from '../data/companions';
import { NPCS } from '../data/npcs';
import { addItemToInventory, formatCurrencyFromCopper, totalCurrencyInCopper, updateInventoryByQuantity } from '../lib/utils';
import { FACTIONS } from '../data/factions';

type EffectFunction = (gameState: GameState) => GameState;

export const EFFECT_REGISTRY: Record<string, EffectFunction> = {
    SET_PLAYER_CURRENCY_TO_ZERO: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, currency: { gp: 0, sp: 0, cp: 0 } };
        return { ...gameState, player: newPlayer };
    },
    ADD_HEALING_POTION_TO_INVENTORY: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: finalInventory } = addItemToInventory(gameState.player.inventory, ITEMS['potion-of-healing']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        return { ...gameState, player: newPlayer };
    },
    RECEIVE_FINNS_COIN: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: finalInventory } = addItemToInventory(gameState.player.inventory, ITEMS['finns-wooden-coin']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        const newFlags = { ...gameState.globalFlags, talkedToFinnAfterRats: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    RECEIVE_BARKEEP_REWARD_BASIC: (gameState) => {
        if (!gameState.player) return gameState;
        let currentInventory = gameState.player.inventory;
        const { inventory: inventoryAfterSword } = addItemToInventory(currentInventory, ITEMS['rusty-sword']);
        const { inventory: finalInventory } = addItemToInventory(inventoryAfterSword, ITEMS['leather-armor']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        const newFlags = { ...gameState.globalFlags, hasTavernRoom: true, completed_rat_extermination: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    RECEIVE_BARKEEP_REWARD_SOLDIER: (gameState) => {
        if (!gameState.player) return gameState;
        let currentInventory = gameState.player.inventory;
        const { inventory: inventoryAfterSword } = addItemToInventory(currentInventory, ITEMS['longsword-of-the-legion']);
        const { inventory: finalInventory } = addItemToInventory(inventoryAfterSword, ITEMS['leather-armor']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        const newFlags = { ...gameState.globalFlags, hasTavernRoom: true, completed_rat_extermination: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    FIND_MILL_CACHE: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: newInventory } = addItemToInventory(gameState.player.inventory, ITEMS['fine-dagger']);
        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 2000); // 20 gold
        const newPlayer = { ...gameState.player, inventory: newInventory, currency: newCurrency };
        return { ...gameState, player: newPlayer };
    },
    REST_AND_RESET_DAILIES: (gameState) => {
        if (!gameState.player) return gameState;
        
        const hasKitchen = gameState.campUpgrades.includes('field_kitchen');
        const hasInfirmary = gameState.campUpgrades.includes('infirmary');
        const hasTraining = gameState.campUpgrades.includes('training_grounds');

        // Base HP restoration is 50% max HP, unless Infirmary is built (100%)
        const healRatio = hasInfirmary ? 1.0 : 0.5;
        const hpToRestore = Math.floor(gameState.player.stats.maxHp * healRatio);
        
        const currentHp = Math.min(gameState.player.stats.maxHp, gameState.player.stats.hp + hpToRestore);
        
        const newPlayer = {
            ...gameState.player,
            xp: hasTraining ? gameState.player.xp + 50 : gameState.player.xp,
            stats: {
                ...gameState.player.stats,
                hp: currentHp,
                mana: gameState.player.stats.maxMana,
                stamina: gameState.player.stats.maxStamina,
            },
        };
        const newCounters = { ...gameState.actionCounters, performed_today: 0 };
        return { ...gameState, player: newPlayer, actionCounters: newCounters };
    },
    MEET_HERALD: (gameState) => {
        const newGameState = { ...gameState, globalFlags: { ...gameState.globalFlags, metHerald: true } };
        if (!newGameState.player) return newGameState;
        const { inventory: newInventory } = addItemToInventory(newGameState.player.inventory, ITEMS['ornate-key']);
        const newPlayer = { ...newGameState.player, inventory: newInventory };
        newPlayer.currency.gp = (newPlayer.currency.gp || 0) + 25;
        newGameState.player = newPlayer;
        return newGameState;
    },
    PERFORM_FOR_COIN: (gameState) => {
        if (!gameState.player) return gameState;
        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 500); // 5 gold
        const newPlayer = { ...gameState.player, currency: newCurrency };
        const newCounters = { ...gameState.actionCounters, performed_today: 1 };
        return { ...gameState, player: newPlayer, actionCounters: newCounters };
    },
    IMPRESS_XYLOS_NOBLE: (gameState) => {
        const newFlags = { ...gameState.globalFlags, xylos_discount: true };
        const newNpcState = JSON.parse(JSON.stringify(gameState.npcState));
        if (!newNpcState['xylos_merchant']) {
            const npcData = NPCS['xylos_merchant'];
            newNpcState['xylos_merchant'] = {
                inventory: JSON.parse(JSON.stringify(npcData.inventory)),
                attitude: npcData.attitude || 0,
            };
        }
        newNpcState['xylos_merchant'].attitude = (newNpcState['xylos_merchant'].attitude || 0) + 20;
        return { ...gameState, globalFlags: newFlags, npcState: newNpcState };
    },
    FLAG_CRYPT_DOOR_OPENED: (gameState) => {
        const newFlags = { ...gameState.globalFlags, cryptDoorOpened: true };
        return { ...gameState, globalFlags: newFlags };
    },
    FLAG_VISITED_CRYPT_ENTRANCE: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, visitedCryptEntrance: true } }),
    LYRA_JOINS_PARTY: (gameState) => {
        if (gameState.party.some(c => c.id === 'lyra')) return gameState;
        const newCompanion = COMPANIONS['lyra'];
        const newPlayer = gameState.player ? { ...gameState.player, xp: gameState.player.xp + 50 } : null;
        const newFlags = { ...gameState.globalFlags, metLyra: true };
        return { ...gameState, party: [...gameState.party, newCompanion], player: newPlayer, globalFlags: newFlags };
    },
    DECLINE_LYRA: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, declinedCompanion: true, metLyra: true } }),
    LYRA_OUTLANDER_REMARK: (gameState) => {
        if (!gameState.player) return gameState;
        // Increase affinity for Lyra if she is in party
        const newParty = gameState.party.map(c => {
            if (c.id === 'lyra') {
                return { ...c, affinity: Math.min(100, c.affinity + 10) };
            }
            return c;
        });
        
        const { inventory: newInventory } = addItemToInventory(gameState.player.inventory, ITEMS['trackers-unguent']);
        const newPlayer = { ...gameState.player, inventory: newInventory };
        const newFlags = { ...gameState.globalFlags, lyra_outlander_remark_done: true };
        return { ...gameState, player: newPlayer, party: newParty, globalFlags: newFlags };
    },
    LYRA_AFFINITY_PLUS_20: (gameState) => {
        const newParty = gameState.party.map(c => {
            if (c.id === 'lyra') {
                return { ...c, affinity: Math.min(100, c.affinity + 20) };
            }
            return c;
        });
        return { ...gameState, party: newParty };
    },
    LYRA_AFFINITY_PLUS_10: (gameState) => {
        const newParty = gameState.party.map(c => {
            if (c.id === 'lyra') {
                return { ...c, affinity: Math.min(100, c.affinity + 10) };
            }
            return c;
        });
        return { ...gameState, party: newParty };
    },
    LYRA_AFFINITY_PLUS_5: (gameState) => {
        const newParty = gameState.party.map(c => {
            if (c.id === 'lyra') {
                return { ...c, affinity: Math.min(100, c.affinity + 5) };
            }
            return c;
        });
        return { ...gameState, party: newParty };
    },
    LYRA_AFFINITY_MINUS_5: (gameState) => {
        const newParty = gameState.party.map(c => {
            if (c.id === 'lyra') {
                return { ...c, affinity: Math.max(0, c.affinity - 5) };
            }
            return c;
        });
        return { ...gameState, party: newParty };
    },
    FLAG_TOLD_BARKEEP_ABOUT_CRYPT: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, toldBarkeepAboutCrypt: true } }),
    FLAG_ASKED_QUEEN_WHO: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, askedQueenWho: true } }),
    FLAG_ASKED_QUEEN_WHY: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, askedQueenWhy: true } }),
    FLAG_ASKED_QUEEN_BETRAYER: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, askedAboutBetrayer: true } }),
    FLAG_ASKED_QUEEN_WHAT: (gameState) => ({ ...gameState, globalFlags: { ...gameState.globalFlags, askedQueenWhat: true } }),
    ACCEPT_DESTINY: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: finalInventory } = addItemToInventory(gameState.player.inventory, ITEMS['serpents-eye-amulet']);
        const newPlayer = { 
            ...gameState.player, 
            xp: gameState.player.xp + 200,
            inventory: finalInventory,
        };
        const newFlags = { ...gameState.globalFlags, destinyChosen: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    REFUSE_DESTINY: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, karma: gameState.player.karma - 5 };
        const newFlags = { ...gameState.globalFlags, destinyChosen: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    RECEIVE_ACOLYTE_GIFT: (gameState) => {
        if (!gameState.player) return gameState;
        let inv = gameState.player.inventory;
        inv = addItemToInventory(inv, ITEMS['potion-of-healing']).inventory;
        inv = addItemToInventory(inv, ITEMS['potion-of-healing']).inventory;
        const newPlayer = { ...gameState.player, inventory: inv };
        const newFlags = { ...gameState.globalFlags, receivedAcolyteGift: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    DONATE_GOLD_KARMA_PLUS_5: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        const total = totalCurrencyInCopper(newPlayer.currency);
        newPlayer.currency = formatCurrencyFromCopper(total - 100);
        newPlayer.karma += 5;
        return { ...gameState, player: newPlayer };
    },
    DONATE_SILVER_KARMA_PLUS_3: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        const total = totalCurrencyInCopper(newPlayer.currency);
        newPlayer.currency = formatCurrencyFromCopper(total - 50);
        newPlayer.karma += 3;
        return { ...gameState, player: newPlayer };
    },
    DONATE_COPPER_KARMA_PLUS_1: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        const total = totalCurrencyInCopper(newPlayer.currency);
        newPlayer.currency = formatCurrencyFromCopper(total - 10);
        newPlayer.karma += 1;
        return { ...gameState, player: newPlayer };
    },
    ACCEPT_ELARA_QUEST: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: newInventory } = addItemToInventory(gameState.player.inventory, ITEMS['mariners-guild-seal']);
        const newPlayer = { ...gameState.player, inventory: newInventory };
        return { ...gameState, player: newPlayer };
    },
    ACCEPT_ELARA_QUEST_SAILOR: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: newInventory } = addItemToInventory(gameState.player.inventory, ITEMS['mariners-guild-seal']);
        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 2500); // 25 gold
        const newPlayer = { ...gameState.player, inventory: newInventory, currency: newCurrency };
        return { ...gameState, player: newPlayer };
    },
    ACCEPT_SYNDICATE_QUEST_KARMA_MINUS_2: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, karma: gameState.player.karma - 2 };
        return { ...gameState, player: newPlayer };
    },
    ACCEPT_SYNDICATE_QUEST_INSIDER: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, karma: gameState.player.karma - 2 };
        const newFlags = { ...gameState.globalFlags, syndicateInsiderDeal: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    ACCEPT_SYNDICATE_QUEST_CHARLATAN: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, karma: gameState.player.karma - 2 };
        const newFlags = { ...gameState.globalFlags, syndicate_knows_plot: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    FORGE_ALLIANCE_STONECARVERS_CRIMSONBLADES: (gameState) => {
        const newOverrides = JSON.parse(JSON.stringify(gameState.factionRelationsOverrides || {}));

        const addAlly = (factionId: string, allyId: string) => {
            if (!newOverrides[factionId]) newOverrides[factionId] = {};
            if (!newOverrides[factionId].allies) {
                newOverrides[factionId].allies = FACTIONS.find(f => f.id === factionId)?.relations?.allies?.slice() || [];
            }
            if (!newOverrides[factionId].allies.includes(allyId)) {
                newOverrides[factionId].allies.push(allyId);
            }
        };

        addAlly('stonecarvers_guild', 'crimson_blades');
        addAlly('crimson_blades', 'stonecarvers_guild');
        
        return { ...gameState, factionRelationsOverrides: newOverrides };
    },
    BREAK_ALLIANCE_MARINERS_STONECARVERS: (gameState) => {
        const newOverrides = JSON.parse(JSON.stringify(gameState.factionRelationsOverrides || {}));

        const removeAlly = (factionId: string, allyIdToRemove: string) => {
            if (!newOverrides[factionId]) newOverrides[factionId] = {};
            if (newOverrides[factionId].allies) {
                newOverrides[factionId].allies = newOverrides[factionId].allies.filter((ally: string) => ally !== allyIdToRemove);
            } else {
                const staticAllies = FACTIONS.find(f => f.id === factionId)?.relations?.allies?.slice() || [];
                newOverrides[factionId].allies = staticAllies.filter((ally: string) => ally !== allyIdToRemove);
            }
        };

        removeAlly('mariners_guild', 'stonecarvers_guild');
        removeAlly('stonecarvers_guild', 'mariners_guild');

        return { ...gameState, factionRelationsOverrides: newOverrides };
    },
    JOIN_CRIMSON_BLADES: (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player, factionId: 'crimson_blades', reputation: { ...gameState.player.reputation, 'crimson_blades': (gameState.player.reputation['crimson_blades'] || 0) + 15 } };
        const newFlags = { ...gameState.globalFlags, joined_crimson_blades: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    COMPLETE_BROMS_BANNER: (gameState) => {
        if (!gameState.player) return gameState;
        
        const { inventory: newInventory } = updateInventoryByQuantity(gameState.player.inventory, ITEMS['crimson-blades-banner'], -1);

        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 5000); // 50 gold

        const newPlayer = { 
            ...gameState.player, 
            inventory: newInventory,
            currency: newCurrency, 
            reputation: { ...gameState.player.reputation, 'crimson_blades': (gameState.player.reputation['crimson_blades'] || 0) + 10 }
        };
        const newFlags = { ...gameState.globalFlags, completed_broms_banner: true };
        
        let newQuests = { ...gameState.quests };
        if (newQuests['broms_banner_known_past']) newQuests['broms_banner_known_past'].status = 'completed';
        if (newQuests['broms_banner_unknown_past']) newQuests['broms_banner_unknown_past'].status = 'completed';


        return { ...gameState, player: newPlayer, globalFlags: newFlags, quests: newQuests };
    },
    COMPLETE_BORIN_QUEST: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: inventoryAfterHead } = updateInventoryByQuantity(gameState.player.inventory, ITEMS['goblin-leader-head'], -1);
        const { inventory: finalInventory } = addItemToInventory(inventoryAfterHead, ITEMS['aegis-of-the-devout']);

        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 10000); // 100 gold

        const newPlayer = { ...gameState.player, inventory: finalInventory, currency: newCurrency };
        return { ...gameState, player: newPlayer };
    },
    COMPLETE_XYLOS_QUEST: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: inventoryAfterFlower } = updateInventoryByQuantity(gameState.player.inventory, ITEMS['moonpetal-flower'], -1);
        const { inventory: finalInventory } = addItemToInventory(inventoryAfterFlower, ITEMS['tome-of-clear-thought']);

        const currentTotal = totalCurrencyInCopper(gameState.player.currency);
        const newCurrency = formatCurrencyFromCopper(currentTotal + 5000); // 50 gold (example)

        const newPlayer = { ...gameState.player, inventory: finalInventory, currency: newCurrency };
        return { ...gameState, player: newPlayer };
    },
    BROM_GIVES_OLD_AMULET: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: finalInventory } = addItemToInventory(gameState.player.inventory, ITEMS['broms_veteran_amulet']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        const newFlags = { ...gameState.globalFlags, received_broms_amulet: true };
        return { ...gameState, player: newPlayer, globalFlags: newFlags };
    },
    FLAG_MET_VORLAG: (gameState) => {
        return { ...gameState, globalFlags: { ...gameState.globalFlags, met_vorlag: true } };
    },
    FLAG_KNOWS_BROMS_PAST: (gameState) => {
        return { ...gameState, globalFlags: { ...gameState.globalFlags, knows_broms_past: true } };
    },
    FLAG_DECLINED_GOBLIN_QUEST: (gameState) => {
      return {...gameState, globalFlags: {...gameState.globalFlags, declinedGoblinQuest: true}}
    },
    FLAG_LYRA_RESCUE_REVEALED: (gameState) => {
        return {...gameState, globalFlags: {...gameState.globalFlags, lyraRescueRevealed: true}}
    },
    GET_CRIMSON_BLADES_BANNER: (gameState) => {
        if (!gameState.player) return gameState;
        const { inventory: finalInventory } = addItemToInventory(gameState.player.inventory, ITEMS['crimson-blades-banner']);
        const newPlayer = { ...gameState.player, inventory: finalInventory };
        return { ...gameState, player: newPlayer };
    },
    MEET_SCAVENGER: (gameState) => {
        const newFlags = { ...gameState.globalFlags, met_scavenger: true };
        return { ...gameState, globalFlags: newFlags };
    },
    SCAVENGER_DEFEATED: (gameState) => {
        if (!gameState.player) return gameState;
        const newRep = { ...gameState.player.reputation, 'crimson_blades': (gameState.player.reputation['crimson_blades'] || 0) + 10 };
        const newPlayer = { ...gameState.player, reputation: newRep };
        return { ...gameState, player: newPlayer };
    },
    RECRUIT_KORGAN: (gameState) => {
        const newFlags = { ...gameState.globalFlags, recruited_korgan: true };
        return { ...gameState, globalFlags: newFlags };
    },
    RECRUIT_ELARA: (gameState) => {
        const newFlags = { ...gameState.globalFlags, recruited_elara: true };
        return { ...gameState, globalFlags: newFlags };
    },
    RECRUIT_VESPERA: (gameState) => {
        // Prevent duplicate recruitment
        if (gameState.party.some(c => c.id === 'vespera')) return gameState;
        const newCompanion = COMPANIONS['vespera'];
        const newFlags = { ...gameState.globalFlags, recruited_vespera: true, met_vespera: true };
        const newPlayer = gameState.player ? { ...gameState.player, xp: gameState.player.xp + 100 } : null; // XP Bonus
        return { ...gameState, party: [...gameState.party, newCompanion], player: newPlayer, globalFlags: newFlags };
    },
    VESPERA_LEAVES_HOSTILE: (gameState) => {
        const newFlags = { ...gameState.globalFlags, met_vespera: true };
        return { ...gameState, globalFlags: newFlags };
    }
};
