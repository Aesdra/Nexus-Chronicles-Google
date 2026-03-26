
import { GameState } from '../types';
import { totalCurrencyInCopper } from '../lib/utils';

type ConditionFn = (gameState: GameState) => boolean;

export const CONDITION_REGISTRY: Record<string, ConditionFn> = {
    // --- Global Flags ---
    'HAS_TAVERN_ROOM': (gs) => !!gs.globalFlags.hasTavernRoom,
    'MET_HERALD': (gs) => !!gs.globalFlags.metHerald,
    'NOT_MET_HERALD': (gs) => !gs.globalFlags.metHerald,
    'MET_LYRA': (gs) => !!gs.globalFlags.metLyra,
    'NOT_MET_LYRA': (gs) => !gs.globalFlags.metLyra,
    'TALKED_TO_FINN_AFTER_RATS': (gs) => !!gs.globalFlags.talkedToFinnAfterRats,
    'NOT_TALKED_TO_FINN_AFTER_RATS': (gs) => !gs.globalFlags.talkedToFinnAfterRats,
    'COMPLETED_RAT_EXTERMINATION': (gs) => !!gs.globalFlags.completed_rat_extermination,
    'NOT_COMPLETED_RAT_EXTERMINATION': (gs) => !gs.globalFlags.completed_rat_extermination,
    'CRYPT_DOOR_OPENED': (gs) => !!gs.globalFlags.cryptDoorOpened,
    'NOT_CRYPT_DOOR_OPENED': (gs) => !gs.globalFlags.cryptDoorOpened,
    'VISITED_CRYPT_ENTRANCE': (gs) => !!gs.globalFlags.visitedCryptEntrance,
    'TOLD_BARKEEP_ABOUT_CRYPT': (gs) => !!gs.globalFlags.toldBarkeepAboutCrypt,
    'NOT_TOLD_BARKEEP_ABOUT_CRYPT': (gs) => !gs.globalFlags.toldBarkeepAboutCrypt,
    'KNOWS_BROMS_PAST': (gs) => !!gs.globalFlags.knows_broms_past,
    'NOT_KNOWS_BROMS_PAST': (gs) => !gs.globalFlags.knows_broms_past,
    'COMPLETED_BROMS_BANNER': (gs) => !!gs.globalFlags.completed_broms_banner,
    'NOT_COMPLETED_BROMS_BANNER': (gs) => !gs.globalFlags.completed_broms_banner,
    'JOINED_CRIMSON_BLADES': (gs) => !!gs.globalFlags.joined_crimson_blades,
    'RECEIVED_BROMS_AMULET': (gs) => !!gs.globalFlags.received_broms_amulet,
    'NOT_RECEIVED_BROMS_AMULET': (gs) => !gs.globalFlags.received_broms_amulet,
    'XYLOS_DISCOUNT': (gs) => !!gs.globalFlags.xylos_discount,
    'NOT_XYLOS_DISCOUNT': (gs) => !gs.globalFlags.xylos_discount,
    'RECRUITED_KORGAN': (gs) => !!gs.globalFlags.recruited_korgan,
    'NOT_RECRUITED_KORGAN': (gs) => !gs.globalFlags.recruited_korgan,
    'RECRUITED_ELARA': (gs) => !!gs.globalFlags.recruited_elara,
    'NOT_RECRUITED_ELARA': (gs) => !gs.globalFlags.recruited_elara,
    'MET_SCAVENGER': (gs) => !!gs.globalFlags.met_scavenger,
    'NOT_MET_SCAVENGER': (gs) => !gs.globalFlags.met_scavenger,
    'FOUND_BANNER': (gs) => !!gs.globalFlags['found_banner'], // Note: found_banner vs foundBanner consistency check
    'NOT_FOUND_BANNER': (gs) => !gs.globalFlags['found_banner'],
    'CLEARED_BANDITS_FOR_BORIN': (gs) => !!gs.globalFlags.cleared_bandits_for_borin,
    'RECEIVED_ACOLYTE_GIFT': (gs) => !!gs.globalFlags.receivedAcolyteGift,
    'NOT_RECEIVED_ACOLYTE_GIFT': (gs) => !gs.globalFlags.receivedAcolyteGift,
    'DESTINY_CHOSEN': (gs) => !!gs.globalFlags.destinyChosen,
    'NOT_DESTINY_CHOSEN': (gs) => !gs.globalFlags.destinyChosen,
    'LYRA_OUTLANDER_REMARK_DONE': (gs) => !!gs.globalFlags.lyra_outlander_remark_done,
    'NOT_LYRA_OUTLANDER_REMARK_DONE': (gs) => !gs.globalFlags.lyra_outlander_remark_done,
    'LYRA_RESCUE_REVEALED': (gs) => !!gs.globalFlags.lyraRescueRevealed,
    'NOT_LYRA_RESCUE_REVEALED': (gs) => !gs.globalFlags.lyraRescueRevealed,
    'ASKED_QUEEN_WHO': (gs) => !!gs.globalFlags.askedQueenWho,
    'NOT_ASKED_QUEEN_WHO': (gs) => !gs.globalFlags.askedQueenWho,
    'ASKED_QUEEN_WHY': (gs) => !!gs.globalFlags.askedQueenWhy,
    'NOT_ASKED_QUEEN_WHY': (gs) => !gs.globalFlags.askedQueenWhy,
    'ASKED_QUEEN_WHAT': (gs) => !!gs.globalFlags.askedQueenWhat,
    'NOT_ASKED_QUEEN_WHAT': (gs) => !gs.globalFlags.askedQueenWhat,
    'ASKED_ABOUT_BETRAYER': (gs) => !!gs.globalFlags.askedAboutBetrayer,
    'NOT_ASKED_ABOUT_BETRAYER': (gs) => !gs.globalFlags.askedAboutBetrayer,
    'QUEEN_QUESTIONS_REMAINING': (gs) => !gs.globalFlags.askedQueenWho || !gs.globalFlags.askedQueenWhy || !gs.globalFlags.askedQueenWhat,
    'QUEEN_QUESTIONS_ASKED_ANY': (gs) => !!(gs.globalFlags.askedQueenWho || gs.globalFlags.askedQueenWhy || gs.globalFlags.askedQueenWhat),
    
    // Vespera Flags
    'MET_VESPERA': (gs) => !!gs.globalFlags.met_vespera,
    'NOT_MET_VESPERA': (gs) => !gs.globalFlags.met_vespera,
    'RECRUITED_VESPERA': (gs) => !!gs.globalFlags.recruited_vespera,
    'NOT_RECRUITED_VESPERA': (gs) => !gs.globalFlags.recruited_vespera,

    // --- Quests ---
    'QUEST_RATS_KILLED': (gs) => !!gs.quests['rat_extermination']?.objectives.find(o => o.id === 'kill_rats')?.isCompleted,
    'QUEST_BLADES_ACTIVE': (gs) => gs.quests['gathering_the_blades']?.status === 'active',
    'QUEST_BLADES_READY_FOR_REPORT': (gs) => !!gs.quests['gathering_the_blades']?.objectives.find(o => o.id === 'arm_the_blades')?.isCompleted && !gs.quests['gathering_the_blades']?.objectives.find(o => o.id === 'report_to_vorlag')?.isCompleted,
    'QUEST_BLADES_ACTIVE_NOT_ARMED': (gs) => gs.quests['gathering_the_blades']?.status === 'active' && !gs.quests['gathering_the_blades'].objectives.find(o => o.id === 'arm_the_blades')?.isCompleted,
    'QUEST_BLADES_RECRUITED_BOTH_NOT_ARMED': (gs) => gs.quests['gathering_the_blades']?.status === 'active' && !!gs.globalFlags.recruited_korgan && !!gs.globalFlags.recruited_elara && !gs.quests['gathering_the_blades'].objectives.find(o => o.id === 'arm_the_blades')?.isCompleted,
    'QUEST_FINNS_CACHE_ACTIVE': (gs) => gs.quests['finns_hidden_cache']?.status === 'active',
    'NOT_QUEST_FINNS_CACHE_STARTED': (gs) => !gs.quests['finns_hidden_cache'],
    
    // Basic Active Checks
    'QUEST_BROMS_BANNER_KNOWN_ACTIVE': (gs) => gs.quests['broms_banner_known_past']?.status === 'active',
    'QUEST_BROMS_BANNER_UNKNOWN_ACTIVE': (gs) => gs.quests['broms_banner_unknown_past']?.status === 'active',
    'QUEST_BANNER_ACTIVE_ANY': (gs) => gs.quests['broms_banner_known_past']?.status === 'active' || gs.quests['broms_banner_unknown_past']?.status === 'active',
    
    // STRICT Turn-In Checks (Fixes the instant complete bug)
    'READY_TO_RETURN_BANNER_KNOWN': (gs) => 
        gs.quests['broms_banner_known_past']?.status === 'active' && 
        !!gs.player?.inventory.some(i => i?.item.id === 'crimson-blades-banner'),
    
    'READY_TO_RETURN_BANNER_UNKNOWN': (gs) => 
        gs.quests['broms_banner_unknown_past']?.status === 'active' && 
        !!gs.player?.inventory.some(i => i?.item.id === 'crimson-blades-banner'),

    'HAS_BANNER_NO_QUEST': (gs) => 
        !!gs.player?.inventory.some(i => i?.item.id === 'crimson-blades-banner') && 
        !gs.quests['broms_banner_known_past'] && 
        !gs.quests['broms_banner_unknown_past'] &&
        !gs.globalFlags.completed_broms_banner,

    'QUEST_GOBLINS_NOT_STARTED': (gs) => !gs.quests['quarry_goblins'],
    'READY_TO_RETURN_GOBLIN_HEAD': (gs) => 
        gs.quests['quarry_goblins']?.status === 'active' && 
        !!gs.player?.inventory.some(i => i?.item.id === 'goblin-leader-head'),

    'QUEST_SEA_BEAST_ACTIVE': (gs) => !!gs.quests['sea_beast_hunt'],
    'QUEST_SEA_BEAST_NOT_STARTED': (gs) => !gs.quests['sea_beast_hunt'],
    
    'QUEST_DISTRUST_ACTIVE_NOT_MET_RORIC': (gs) => gs.quests['a_tide_of_distrust']?.status === 'active' && !gs.quests['a_tide_of_distrust'].objectives.find(o => o.id === 'meet_roric')?.isCompleted,
    'QUEST_DISTRUST_FRAME_READY': (gs) => gs.quests['a_tide_of_distrust']?.status === 'active' && !!gs.quests['a_tide_of_distrust'].objectives.find(o => o.id === 'frame_dwarves')?.isCompleted,

    'QUEST_MOONPETAL_ACTIVE': (gs) => gs.quests['moonpetal_flower']?.status === 'active',
    'READY_TO_RETURN_MOONPETAL': (gs) => 
        gs.quests['moonpetal_flower']?.status === 'active' &&
        !!gs.player?.inventory.some(i => i?.item.id === 'moonpetal-flower'),

    // --- Inventory ---
    'HAS_CRIMSON_BANNER': (gs) => !!gs.player?.inventory.some(i => i?.item.id === 'crimson-blades-banner'),
    'HAS_ORNATE_KEY': (gs) => !!gs.player?.inventory.find(i => i?.item.id === 'ornate-key'),
    'HAS_ENOUGH_GOLD_FOR_KORGAN': (gs) => !!gs.player && totalCurrencyInCopper(gs.player.currency) >= 5000,
    'HAS_ENOUGH_GOLD_DONATE_1': (gs) => !!gs.player && totalCurrencyInCopper(gs.player.currency) >= 100,
    'HAS_ENOUGH_GOLD_DONATE_5': (gs) => !!gs.player && totalCurrencyInCopper(gs.player.currency) >= 50,
    'HAS_ENOUGH_GOLD_DONATE_10': (gs) => !!gs.player && totalCurrencyInCopper(gs.player.currency) >= 10,

    // --- Backgrounds & Classes ---
    'BG_SOLDIER': (gs) => gs.player?.background?.slug === 'soldier',
    'NOT_BG_SOLDIER': (gs) => gs.player?.background?.slug !== 'soldier',
    'BG_ENTERTAINER_OR_GLADIATOR': (gs) => ['entertainer', 'gladiator'].includes(gs.player?.background?.slug || ''),
    'BG_FOLK_HERO': (gs) => gs.player?.background?.slug === 'folk-hero',
    'BG_NOBLE_TYPES': (gs) => ['noble', 'waterdhavian-noble', 'courtier'].includes(gs.player?.background?.slug || ''),
    'BG_ACOLYTE_OR_CLERIC': (gs) => (gs.player?.background?.slug === 'acolyte' || gs.player?.characterClass.id === 'cleric'),
    'BG_CRIMINAL_OR_URCHIN': (gs) => ['criminal', 'urchin'].includes(gs.player?.background?.slug || ''),
    'BG_CHARLATAN_TYPES': (gs) => ['charlatan', 'infiltrator', 'spy'].includes(gs.player?.background?.slug || ''),
    'BG_NOT_CRIMINAL_TYPES': (gs) => !['criminal', 'urchin', 'charlatan', 'infiltrator', 'spy'].includes(gs.player?.background?.slug || ''),
    'BG_SAILOR': (gs) => gs.player?.background?.slug === 'sailor',
    'NOT_BG_SAILOR': (gs) => gs.player?.background?.slug !== 'sailor',
    'BG_SAGE_TYPES': (gs) => ['sage', 'cloistered-scholar', 'archaeologist'].includes(gs.player?.background?.slug || '') && !gs.unlockedLoreIds.includes('lore_malakor_madness'),
    'BG_OUTLANDER_TYPES': (gs) => ['rift-wanderer', 'outlander', 'uthgardt-tribe-member'].includes(gs.player?.background?.slug || ''),

    // --- Stats & Misc ---
    'KARMA_NEGATIVE': (gs) => !!gs.player && gs.player.karma < 0,
    'PERFORMED_TODAY': (gs) => !!gs.actionCounters.performed_today,
    'NOT_PERFORMED_TODAY': (gs) => !gs.actionCounters.performed_today,
    'HAS_COMPANION': (gs) => gs.party.length > 0,
    'IS_LYRA': (gs) => gs.party.some(c => c.id === 'lyra'),
    'IS_VESPERA': (gs) => gs.party.some(c => c.id === 'vespera'),
    'LYRA_AFFINITY_HIGH_30': (gs) => {
        const lyra = gs.party.find(c => c.id === 'lyra');
        return !!lyra && lyra.affinity >= 30;
    },
    'LYRA_AFFINITY_HIGH_60': (gs) => {
        const lyra = gs.party.find(c => c.id === 'lyra');
        return !!lyra && lyra.affinity >= 60;
    },
    'LYRA_AFFINITY_HIGH_70': (gs) => {
        const lyra = gs.party.find(c => c.id === 'lyra');
        return !!lyra && lyra.affinity >= 70;
    },
    'ALWAYS_TRUE': () => true,
};

/**
 * Evaluates a condition against the current game state.
 * Supports both legacy function predicates and new string IDs.
 * @param condition The condition identifier or function.
 * @param state The current game state.
 * @returns True if the condition is met, false otherwise.
 */
export const checkCondition = (
    condition: string | undefined | ((gs: GameState) => boolean), 
    state: GameState
): boolean => {
    if (!condition) return true;
    
    if (typeof condition === 'function') {
        return condition(state);
    }
    
    const check = CONDITION_REGISTRY[condition];
    if (!check) {
        console.warn(`Condition ID not found in registry: "${condition}". Defaulting to true.`);
        return true;
    }
    
    return check(state);
};
