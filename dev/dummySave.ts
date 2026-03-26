import { GameState, PlayerCharacter, Background, InventorySlotData } from '../types';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { ITEMS } from '../data/items';
import { INVENTORY_SIZE } from '../constants';
import { IMAGE_ASSETS } from '../data/assets';

// A static background object to avoid async fetching during initialization
const soldierBackground: Background = {
  slug: "soldier",
  name: "Soldier",
  desc: "You are trained in battlefield tactics and have seen the horrors of war firsthand.",
  skill_proficiencies: "Athletics, Intimidation",
  tool_proficiencies: "One type of gaming set, vehicles (land)",
  languages: "",
  equipment: "An insignia of rank, a trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner), a set of bone dice or deck of cards, a set of common clothes, and a belt pouch containing 10 gp",
  feature: "Military Rank",
  feature_desc: "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized."
};

const dummyCharacter: PlayerCharacter = {
  name: 'Dev Tester',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  currency: { gp: 50, sp: 10, cp: 0 },
  race: RACES[0], // Human
  subRace: RACES[0].subRaces![0], // Highlander
  characterClass: CLASSES[5], // Fighter
  subClass: CLASSES[5].subclasses![1], // Champion
  background: soldierBackground,
  stats: {
    hp: 100,
    maxHp: 100,
    mana: 30,
    maxMana: 30,
    stamina: 22,
    maxStamina: 22,
    strength: 14, // 12 + 2 from Highlander
    dexterity: 12,
    constitution: 13, // 12 + 1 from Highlander
    intelligence: 12,
    wisdom: 12,
    charisma: 12,
  },
  appearance: {
    age: 28,
    height: "6' 1\"",
    eyeColor: 'Blue',
    skinColor: 'Tanned',
    hairColor: 'Brown',
    hairStyle: 'Short',
    hasBeard: true,
    scars: 'A scar across the right eyebrow.',
    tattoos: '',
    accessories: '',
  },
  gender: 'Male',
  sexualOrientation: 'Undefined',
  spriteUrl: IMAGE_ASSETS.RACE_HUMAN,
  inventory: Array(INVENTORY_SIZE).fill(null),
  equipment: {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    hands: null,
    mainHand: null,
    offHand: null,
    ring: null,
    amulet: null,
  },
  karma: 0,
  spells: [],
  martialAbilities: ['power-strike', 'disarming-strike'],
  skills: [],
  feats: [],
  reputation: {},
};

export const dummySave: GameState = {
  player: dummyCharacter,
  party: [],
  currentSceneId: 'start',
  previousSceneId: 'intro_arrival',
  globalFlags: {},
  unlockedLoreIds: [],
  encounteredCreatureIds: [],
  encounteredNpcIds: [],
  npcState: {},
  quests: {},
  combatState: null,
  isLevelUpPending: false,
  companionLevelUpInfo: null,
  tradeSession: null,
  actionCounters: {},
  factionRelationsOverrides: {},
  campUpgrades: [],
};