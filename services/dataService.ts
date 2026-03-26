import { SCENES } from '../data/scenes';
import { Scene, Spell, Background, Item, ItemType, EquipmentSlot, DamageType, ItemRarity, NPCData, Enemy, Ally } from '../types';
import { db } from '../db';
import { fetchSpellFromApi, fetchAllEquipmentFromApi } from './dndApiService';
import { BACKGROUNDS } from '../data/backgrounds';
import { ITEMS } from '../data/items';
import { NPCS } from '../data/npcs';
import { ENEMIES } from '../data/enemies';
import { ALLIES } from '../data/allies';

// Simple lookups for static data from local files
export const getScene = (sceneId: string): Scene | undefined => {
    return SCENES[sceneId];
};

export const getNpcData = (npcId: string): NPCData | undefined => {
    return NPCS[npcId];
};

export const getEnemy = (enemyId: string): Enemy | undefined => {
    return ENEMIES[enemyId];
};

export const getAlly = (allyId: string): Ally | undefined => {
    return ALLIES[allyId];
};

// Functions interacting with the database (Dexie)

/**
 * Retrieves a spell by its slug.
 * It first checks the local Dexie database cache. If the spell is not found,
 * it fetches it from the Open5e API, caches it in the database, and then returns it.
 */
export const getSpell = async (slug: string): Promise<Spell | null> => {
    if (!slug) return null;
    // 1. Check Dexie cache first
    const cachedSpell = await db.spells.get(slug);
    if (cachedSpell) {
        return cachedSpell;
    }

    // 2. If not in cache, fetch from API
    const apiSpell = await fetchSpellFromApi(slug);
    if (apiSpell) {
        // 3. Store in Dexie for future use
        try {
            await db.spells.put(apiSpell);
        } catch (error) {
            console.error(`Failed to cache spell '${slug}':`, error);
        }
        return apiSpell;
    }

    return null;
};

/**
 * Retrieves all character backgrounds.
 * If the Dexie database is empty, it populates it from the static `BACKGROUNDS` data.
 */
export const getBackgrounds = async (): Promise<Background[]> => {
    try {
        const count = await db.backgrounds.count();
        if (count === 0) {
            console.log('Populating backgrounds from static data...');
            await db.backgrounds.bulkAdd(BACKGROUNDS);
        }
        return await db.backgrounds.toArray();
    } catch (error) {
        console.error('Failed to get backgrounds:', error);
        // Fallback to static data if DB fails
        return BACKGROUNDS;
    }
};

/**
 * Retrieves an item by its ID.
 * It checks the static `ITEMS` object first, which contains quest items and basic gear.
 * If not found, it then checks the Dexie database, which holds items preloaded from an API.
 */
export const getItem = async (itemId: string): Promise<Item | null> => {
    // Check static items first
    if (ITEMS[itemId]) {
        return ITEMS[itemId];
    }
    // Then check the database for preloaded items
    try {
        const dbItem = await db.items.get(itemId);
        return dbItem || null;
    } catch (error) {
        console.error(`Failed to get item '${itemId}' from db:`, error);
        return null;
    }
};

/**
 * Transforms a raw equipment object from the Open5e API into the game's `Item` format.
 */
const transformApiEquipmentToItem = (apiItem: any): Item | null => {
    if (!apiItem || !apiItem.slug) return null;

    const rarityMap: Record<string, ItemRarity> = {
        'common': 'Common', 'uncommon': 'Uncommon', 'rare': 'Rare',
        'very rare': 'Epic', 'legendary': 'Legendary', 'varies': 'Rare',
    };

    const slotMap: Record<string, EquipmentSlot> = {
        'shield': 'offHand', 'light armor': 'chest', 'medium armor': 'chest', 'heavy armor': 'chest',
        'ring': 'ring', 'amulet': 'amulet', 'boots': 'feet', 'gloves': 'hands', 'helmet': 'head'
    };
    
    let type: ItemType = 'misc';
    let slot: EquipmentSlot | undefined = undefined;

    if (apiItem._type === 'weapon') type = 'weapon';
    if (apiItem._type === 'armor') type = 'armor';

    if (apiItem.type?.toLowerCase().includes('weapon')) type = 'weapon';
    if (apiItem.type?.toLowerCase().includes('armor')) {
        type = 'armor';
        if (apiItem.type.toLowerCase().includes('shield')) slot = 'offHand';
        else slot = 'chest';
    }
    
    if (apiItem.armor_category) slot = slotMap[apiItem.armor_category.toLowerCase()] || 'chest';

    let value = 0;
    if (apiItem.cost) {
        const costString = String(apiItem.cost).replace(/,/g, '');
        const parts = costString.split(' ');
        const amount = parseInt(parts[0]);
        const unit = parts[1];
        if (!isNaN(amount)) {
            if (unit === 'gp') value = amount * 100;
            else if (unit === 'sp') value = amount * 10;
            else if (unit === 'cp') value = amount;
        }
    }
    
    const item: Item = {
        id: apiItem.slug,
        name: apiItem.name,
        description: apiItem.desc || apiItem.text || 'No description available.',
        iconUrl: `https://placehold.co/64x64/4a5568/a0aec0?text=${apiItem.name.substring(0, 3)}`,
        type: type,
        rarity: rarityMap[apiItem.rarity?.toLowerCase()] || 'Common',
        value: value,
        slot: slot,
    };
    
    if (type === 'weapon') {
        item.slot = item.slot || 'mainHand';
        if (apiItem.properties_list?.some((p: string) => p.includes('Two-Handed'))) {
            item.handedness = 'two';
        } else {
            item.handedness = 'one';
        }
        if (apiItem.properties_list?.some((p: string) => p.includes('Finesse'))) {
            item.finesse = true;
        }
    }

    if (apiItem.damage_dice) {
        const [diceCount, diceType] = apiItem.damage_dice.split('d').map(Number);
        if(!isNaN(diceCount) && !isNaN(diceType)) {
             item.damage = {
                amount: Math.ceil(diceCount * (diceType / 2 + 0.5)), // Average damage
                type: (apiItem.damage_type as DamageType) || DamageType.SLASHING
            };
        }
    }
    
    return item;
};

/**
 * Fetches all equipment (weapons, armor, magic items) from the Open5e API,
 * transforms it into the game's `Item` format, and stores it in the Dexie database.
 * This is intended to be called once at app startup to populate the item database.
 */
export const preloadAllItems = async (): Promise<void> => {
    try {
        const count = await db.items.count();
        if (count > 0) {
            console.log('Items already preloaded.');
            return;
        }

        console.log('Preloading all items from API...');
        const apiEquipment = await fetchAllEquipmentFromApi();
        const itemsToStore: Item[] = [];
        for (const apiItem of apiEquipment) {
            const item = transformApiEquipmentToItem(apiItem);
            if (item) {
                itemsToStore.push(item);
            }
        }

        if (itemsToStore.length > 0) {
            await db.items.bulkPut(itemsToStore);
            console.log(`Successfully preloaded ${itemsToStore.length} items.`);
        }
    } catch (error) {
        console.error('Failed to preload items:', error);
    }
};
