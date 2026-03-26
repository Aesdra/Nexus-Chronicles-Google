
import React from 'react';

export type Stat = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface StatBonuses {
  [key: string]: number;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statBonuses: Partial<Record<Stat, number>>;
  subRaces?: SubRace[];
  customizationOptions: {
    ageRange: { min: number; max: number; typical: number };
    heightRange: { min: number; max: number };
    skinColors: string[];
    eyeColors: string[];
    hairColors: string[];
  };
}

export interface SubRace {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statBonuses: Partial<Record<Stat, number>>;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  scalesWith: Stat[];
  subclasses?: SubClass[];
}

export interface SubClass {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Background {
  slug: string;
  name: string;
  desc: string;
  skill_proficiencies: string;
  tool_proficiencies: string;
  languages: string;
  equipment: string;
  feature: string;
  feature_desc: string;
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type EquipmentSlot = 'head' | 'chest' | 'legs' | 'feet' | 'hands' | 'mainHand' | 'offHand' | 'ring' | 'amulet';
export enum DamageType {
  BLUDGEONING = 'Bludgeoning',
  PIERCING = 'Piercing',
  SLASHING = 'Slashing',
  FIRE = 'Fire',
  COLD = 'Cold',
  LIGHTNING = 'Lightning',
  ACID = 'Acid',
  POISON = 'Poison',
  NECROTIC = 'Necrotic',
  RADIANT = 'Radiant',
  FORCE = 'Force',
  PSYCHIC = 'Psychic',
  THUNDER = 'Thunder'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number;
  slot?: EquipmentSlot;
  stackable?: boolean;
  maxStackSize?: number;
  damage?: {
    amount: number;
    type: DamageType;
    onHitEffect?: {
      effects: Partial<StatusEffect>[];
      chance: number;
      duration: number;
    };
  };
  stats?: Partial<Record<Stat | 'armor' | 'hp' | 'mana' | 'stamina', number>>;
  requirements?: {
    race?: string[];
    class?: string[];
    subclass?: string[];
    classGroup?: string[];
    stats?: Partial<Record<Stat, number>>;
  };
  grantsSpells?: string[];
  onUseEffectIds?: string[];
  handedness?: 'one' | 'two';
  finesse?: boolean;
}

export interface InventorySlotData {
  item: Item;
  quantity: number;
}

export interface PlayerCharacter {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currency: { gp: number; sp: number; cp: number };
  race: Race;
  subRace: SubRace | null;
  characterClass: CharacterClass;
  subClass: SubClass | null;
  background: Background | null;
  stats: Record<Stat, number> & { hp: number; maxHp: number; mana: number; maxMana: number; stamina: number; maxStamina: number };
  inventory: (InventorySlotData | null)[];
  equipment: Record<EquipmentSlot, Item | null>;
  karma: number;
  spells: string[];
  martialAbilities: string[];
  skills: string[];
  feats: string[];
  reputation: Record<string, number>;
  appearance: any;
  gender: string;
  sexualOrientation: string;
  spriteUrl?: string;
  factionId?: string;
}

export interface Companion {
  id: string;
  name: string;
  race: string;
  subRace?: string;
  characterClass: string;
  subClass?: string;
  level: number;
  xp: number;
  affinity: number;
  backstory: string;
  spriteUrl: string;
  stats: Record<Stat, number> & { hp: number; maxHp: number; stamina: number; maxStamina: number; wisdom?: number };
  equipment: {
    mainHand: Item | null;
    chest: Item | null;
  };
  spells: string[];
  martialAbilities: string[];
  personality?: Personality;
  sexualOrientation?: string;
  questlineId?: string;
  role?: string;
}

export interface Personality {
    aggression: number;
    caution: number;
    altruism: number;
}

export enum SceneType {
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  COMBAT = 'COMBAT',
  POINT_AND_CLICK = 'POINT_AND_CLICK',
  PROCEDURAL = 'PROCEDURAL'
}

export interface ClickableArea {
    x: number;
    y: number;
    width: number;
    height: number;
    nextScene: string;
    tooltip: string;
    condition?: string | ((gameState: GameState) => boolean);
}

export interface Choice {
  text: string;
  nextScene?: string;
  condition?: string | ((gameState: GameState) => boolean);
  action?: 'trade' | 'input_code' | 'play_dice' | 'manage_camp';
  actionTargetId?: string;
  startsQuest?: string;
  updatesQuest?: { questId: string; objectiveId: string; status?: boolean };
  completesQuest?: string;
  effectId?: string;
  unlocks?: {
      lore?: string[];
      creatures?: string[];
      npcs?: string[];
  };
  reputationChange?: Record<string, number>;
}

export interface Scene {
  id: string;
  type: SceneType;
  backgroundImageUrl?: string;
  backgroundKey?: string;
  text: string;
  choices?: Choice[];
  clickableAreas?: ClickableArea[];
  musicTrack?: string;
  particleTheme?: string;
  enemies?: { enemyId: string; count: number }[];
  temporaryCompanions?: { allyId: string; count: number }[];
  onVictoryScene?: string;
  onDefeatScene?: string;
  fallbackScene?: string;
  unlocks?: {
      lore?: string[];
      creatures?: string[];
      npcs?: string[];
  };
  effectId?: string;
  reputationChange?: Record<string, number>;
  startsQuest?: string;
  updatesQuest?: { questId: string; objectiveId: string; status?: boolean };
  completesQuest?: string;
  safeZoneType?: 'public' | 'private';
}

export interface QuestObjective {
    id: string;
    text: string;
    isCompleted: boolean;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    objectives: QuestObjective[];
    status: 'active' | 'completed' | 'failed';
}

export interface NPCData {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    role: string;
    faction: string;
    factionId: string;
    attitude?: number;
    inventory?: { itemId: string; stock: number }[];
    factionRankInventory?: Record<string, { itemId: string; stock: number }[]>;
}

export interface Enemy {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    notes: string;
    stats: {
        maxHp: number;
        attackBonus: number;
        armorClass: number;
        speed: number;
        damage: { 
            amount: number; 
            type: DamageType;
            onHitEffect?: {
                effects: Partial<StatusEffect>[];
                chance: number;
                duration: number;
            };
        };
        xpValue: number;
        lootTable?: { itemId: string; dropChance: number }[];
        actions: string[];
        role: string;
        personality: Personality;
        maxMana?: number;
        currentMana?: number;
        maxStamina?: number;
        isDisarmable?: boolean;
        martialAbilities?: string[];
    };
}

export interface Ally {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    notes: string;
    stats: {
        maxHp: number;
        attackBonus: number;
        armorClass: number;
        speed: number;
        damage: { amount: number; type: DamageType };
        actions: string[];
        role: string;
        personality: Personality;
        maxStamina?: number;
        currentStamina?: number;
        martialAbilities?: string[];
    }
}

export interface Creature {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    notes: string;
    stats: {
        maxHp: number;
        attackBonus: number;
        armorClass: number;
        speed: number;
        damage: { amount: number; type: DamageType };
        actions: string[];
        role: string;
        personality: Personality;
        maxStamina?: number;
        currentStamina?: number;
        martialAbilities?: string[];
    }
}

export interface NPC extends NPCData {}

export type LoreCategory = 'World' | 'Factions' | 'History' | 'Mechanics';

export interface Lore {
    id: string;
    title: string;
    content: string;
    category: LoreCategory;
}

export interface Spell {
    slug: string;
    name: string;
    desc: string;
    higher_level?: string;
    range: string;
    components: string;
    material?: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    casting_time: string;
    level: number;
    school: string;
    dnd_class: string;
    manaCost: number;
    targetType: 'enemy' | 'ally' | 'self';
    actionId: string;
}

export interface MartialAbility {
    id: string;
    name: string;
    description: string;
    staminaCost: number;
    targetType: 'enemy' | 'ally' | 'self';
    actionId: string;
}

export interface Feat {
    id: string;
    name: string;
    description: string;
    effects: {
        stats?: Partial<Record<Stat | 'maxHp' | 'maxMana', number>>;
    }
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    classRequirement?: string[];
}

export interface CurrencyInfo {
  slug: string;
  name: string;
  desc: string;
}

export interface FactionRank {
    name: string;
    reputationThreshold: number;
}

export interface Faction {
    id: string;
    name: string;
    description: string;
    motives: string;
    goals: string;
    beliefs: string;
    hierarchy: string;
    joinable: boolean;
    iconUrl: string;
    rank: 'major' | 'lesser';
    relations: {
        allies: string[];
        enemies: string[];
    };
    ranks?: FactionRank[];
}

export interface CampUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effectDescription: string;
    icon?: React.ReactNode;
}

// --- Combat Types ---

export type StatusEffectType = 'DAMAGE_OVER_TIME' | 'ATTACK_BUFF' | 'ATTACK_DEBUFF' | 'ARMOR_BUFF' | 'ARMOR_DEBUFF' | 'STUNNED' | 'TAUNTED' | 'DISARMED' | 'SLOWED' | 'MAX_HP_BUFF';

export interface StatusEffect {
    name: string;
    type: StatusEffectType;
    duration: number;
    bonus?: number; // For buffs/debuffs
    damage?: { amount: number; type: DamageType };
    trigger?: 'start-of-turn' | 'end-of-turn';
    sourceId?: string;
}

export interface Combatant {
    id: string;
    originalId?: string;
    name: string;
    spriteUrl: string;
    type: 'player' | 'companion' | 'enemy';
    maxHp: number;
    currentHp: number;
    maxMana?: number;
    currentMana?: number;
    maxStamina?: number;
    currentStamina?: number;
    speed: number;
    armorClass: number;
    attackBonus: number;
    damage: { amount: number; type: DamageType };
    isDefeated: boolean;
    statusEffects: StatusEffect[];
    martialAbilities?: string[];
    spells?: string[];
    personality?: Personality;
}

export type LogType = 'system' | 'damage' | 'heal' | 'miss' | 'status' | 'info';

export interface CombatLogEntry {
    id: string;
    message: string;
    type: LogType;
    abilityId?: string;
}

export interface ActionDetails {
    type: 'attack' | 'spell' | 'ability' | 'item' | 'flee' | null;
    spellSlug?: string;
    abilityId?: string;
    item?: { item: Item; inventoryIndex: number };
    isAwaitingTarget?: boolean;
}

export type PlayerActionState = ActionDetails;

export interface CombatEvent {
    type: 'TURN_START' | 'ACTION_CHOSEN' | 'ATTACK_RESOLVED' | 'HEAL_RESOLVED' | 'STATUS_APPLIED' | 'COMBATANT_DEFEATED' | 'TURN_END' | 'COMBAT_END' | 'LOG_MESSAGE';
    combatantId?: string;
    sourceId?: string;
    targetId?: string;
    action?: ActionDetails;
    hit?: boolean;
    damage?: number;
    damageType?: DamageType;
    amount?: number;
    spellSlug?: string;
    abilityId?: string;
    effect?: StatusEffect;
    outcome?: 'victory' | 'defeat';
    message?: string;
    logType?: LogType;
}

export interface CombatAction {
    resolve: (source: Combatant, target: Combatant, allCombatants: Combatant[]) => CombatEvent[];
}

export interface CombatState {
    combatants: Combatant[];
    turnOrder: string[];
    currentTurnId: string;
    isProcessingEvent: boolean;
    eventQueue: CombatEvent[];
    log: CombatLogEntry[];
    onVictoryScene: string;
    onDefeatScene: string;
    isFinished: 'victory' | 'defeat' | null;
    rewards: { xp: number; loot: { item: Item; quantity: number }[] } | null;
    playerActionState: PlayerActionState;
}

// --- Trade Types ---

export interface TradeSession {
    npcId: string;
    playerOffer: { items: InventorySlotData[]; currency: { gp: number; sp: number; cp: number } };
    npcOffer: { items: InventorySlotData[]; currency: { gp: number; sp: number; cp: number } };
    playerValue: number;
    npcValue: number;
}

// --- Dialogue Types ---

export interface DialogueChoice {
  text: string;
  nextNode?: DialogueNode;
  effectId?: string;
  condition?: string | ((gameState: GameState) => boolean);
}

export interface DialogueNode {
  id: string;
  text: string;
  choices: DialogueChoice[];
}

export interface CompanionDialogue {
  id: string;
  companionId: string;
  isOneTime: boolean;
  priority: number;
  title: string;
  condition: string | ((gameState: GameState) => boolean);
  rootNode: DialogueNode;
  requiresPrivateZone?: boolean;
}

// --- Game State & Store ---

export interface CompanionAbilityProgression {
    [level: number]: {
        choices: { type: 'spell' | 'ability'; id: string }[];
    }
}

export interface GameState {
    player: PlayerCharacter | null;
    party: Companion[]; // Replaced 'companion' with 'party' array
    currentSceneId: string;
    previousSceneId: string | null;
    globalFlags: Record<string, boolean>;
    unlockedLoreIds: string[];
    encounteredCreatureIds: string[];
    encounteredNpcIds: string[];
    npcState: Record<string, { inventory: { itemId: string; stock: number }[]; attitude: number }>;
    combatState: CombatState | null;
    tradeSession: TradeSession | null;
    quests: Record<string, Quest>;
    isLevelUpPending: boolean;
    companionLevelUpInfo: { companionId: string; level: number; choices: { type: 'spell' | 'ability'; id: string }[] } | null;
    actionCounters: Record<string, number>;
    factionRelationsOverrides: Record<string, { allies?: string[]; enemies?: string[] }>;
    activeDialogue?: CompanionDialogue | null;
    currentDialogueNode?: DialogueNode | null;
    readDialogueIds?: string[];
    campUpgrades: string[]; 
}

export interface GameSave extends Omit<GameState, 'combatState' | 'tradeSession' | 'activeDialogue' | 'currentDialogueNode'> {
  id: number;
  saveTimestamp: number;
}

export type ModalType = 'inventory' | 'characterSheet' | 'companion' | 'codex' | 'journal' | 'gameMenu' | 'saveLoad' | 'trade' | 'analysis' | 'chat' | 'levelUpPrompt' | 'companionLevelUpPrompt' | 'companionHub' | 'cheatCode' | 'campManagement' | 'diceGame';

export interface ModalPayloads {
    saveLoad: { mode: 'save' | 'load' };
    trade: { npc: NPCData };
    analysis: { file: File };
    diceGame: { npc: NPCData };
    inventory: undefined;
    characterSheet: undefined;
    companion: undefined; // Open with a specific companion? Or just generic list
    codex: undefined;
    journal: undefined;
    gameMenu: undefined;
    chat: undefined;
    levelUpPrompt: undefined;
    companionLevelUpPrompt: undefined;
    companionHub: undefined;
    cheatCode: undefined;
    campManagement: undefined;
}

// Slices

export interface PlayerSlice {
    updatePlayer: (playerUpdate: Partial<PlayerCharacter> | ((p: PlayerCharacter) => Partial<PlayerCharacter>)) => void;
    gainXp: (amount: number) => void;
    applyAutomaticLevelUp: () => void;
    applyManualLevelUp: (choices: { attribute: Stat; featId?: string }) => void;
    applyCompanionLevelUp: (choice: { type: 'spell' | 'ability'; id: string }) => void;
    addFeat: (featId: string) => void;
}

export interface InventorySlice {
    addItemToPlayerInventory: (item: Item) => void;
    addItemsToPlayerInventory: (items: { item: Item; quantity: number }[]) => void;
    updateInventoryAndEquipment: (inventory: (InventorySlotData | null)[], equipment: Record<EquipmentSlot, Item | null>) => void;
    useItem: (itemIndex: number) => void;
    equipItem: (inventoryIndex: number, targetSlot: EquipmentSlot) => void;
    unequipItem: (sourceSlot: EquipmentSlot) => void;
}

export interface QuestSlice {
    startQuest: (questId: string) => void;
    updateQuest: (questId: string, objectiveId: string, status?: boolean) => void;
    completeQuest: (questId: string) => void;
}

export interface NpcSlice {
    ensureNpcState: (npcId: string) => void;
}

export interface GameSlice {
    isHydrated: boolean;
    autosaveNotificationVisible: boolean;
    hydrate: (savedState: GameSave) => void;
    initializeNewGame: (character: PlayerCharacter) => Promise<void>;
    advanceScene: (choice: Choice) => Promise<void>;
    addCompanion: (companion: Companion) => void;
    setCompanion: (companion: Companion) => void;
    saveGameToSlot: (slotId: number) => Promise<boolean>;
    triggerAutosave: () => Promise<void>;
    unlockCampUpgrade: (upgradeId: string) => void;
}

export interface TradeSlice {
    startTradeSession: (npc: NPCData) => void;
    endTradeSession: () => void;
    _recalculateValues: () => void;
    addItemToPlayerOffer: (item: Item, quantity: number) => void;
    removeItemFromPlayerOffer: (itemIndex: number, quantity?: number) => void;
    addItemToNpcOffer: (item: Item, quantity: number) => void;
    removeItemFromNpcOffer: (itemIndex: number, quantity?: number) => void;
    updatePlayerOfferCurrency: (currency: { gp: number; sp: number; cp: number }) => void;
    updateNpcOfferCurrency: (currency: { gp: number; sp: number; cp: number }) => void;
    clearOffers: () => void;
    finalizeTrade: () => void;
}

export interface CombatSlice {
    startCombat: (scene: { enemies: { enemyId: string; count: number }[]; onVictoryScene: string; onDefeatScene: string; temporaryCompanions?: { allyId: string; count: number }[] }) => void;
    setPlayerAction: (action: PlayerActionState) => void;
    playerChooseAction: (action: ActionDetails, targetId?: string) => void;
    processNextCombatEvent: () => void;
    concludeCombat: () => void;
}

export interface DialogueSlice {
    startDialogue: (dialogue: CompanionDialogue) => void;
    advanceDialogue: (choice: DialogueChoice) => void;
    endDialogue: () => void;
}

export interface CharacterCreationSlice {
    step: number;
    points: number;
    characterInProgress: {
        race: Race | null;
        subRace: SubRace | null;
        characterClass: CharacterClass | null;
        subClass: SubClass | null;
        background: Background | null;
        stats: Record<Stat, number>;
        customBgName: string;
        customBgDesc: string;
        customBgSkills: string[];
        customBgToolsLangs: string[];
        customBgFeatureSlug: string;
    };
    goToStep: (step: number) => void;
    selectRace: (race: Race) => void;
    selectSubRace: (subRace: SubRace) => void;
    selectClass: (characterClass: CharacterClass) => void;
    selectSubClass: (subClass: SubClass) => void;
    selectBackground: (background: Background) => void;
    setStatsAndPoints: (stats: Record<Stat, number>, points: number) => void;
    setCustomBackgroundName: (name: string) => void;
    setCustomBackgroundDesc: (desc: string) => void;
    setCustomBackgroundSkills: (skills: string[]) => void;
    setCustomBackgroundToolsLangs: (toolsLangs: string[]) => void;
    setCustomBackgroundFeatureSlug: (slug: string) => void;
    resetCreation: () => void;
}

export enum GameScreen {
  MAIN_MENU,
  CHARACTER_CREATION,
  GAMEPLAY
}

// The aggregated store type
export type GameStore = GameState & PlayerSlice & InventorySlice & QuestSlice & NpcSlice & GameSlice & TradeSlice & CombatSlice & DialogueSlice;
