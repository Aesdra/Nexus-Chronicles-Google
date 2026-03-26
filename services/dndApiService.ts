import { Spell } from '../types';

const API_BASE_URL = 'https://api.open5e.com/v1';

/**
 * Fetches all pages of data from a given API endpoint.
 * Enforces HTTPS to prevent mixed-content errors from the API's pagination links.
 */
const fetchPaginatedData = async (endpoint: string): Promise<any[]> => {
  let allResults: any[] = [];
  let nextUrl: string | null = `${API_BASE_URL}/${endpoint}/?limit=200`;

  while (nextUrl) {
    const secureUrl = nextUrl.replace(/^http:/, 'https:');
    const response = await fetch(secureUrl);
    if (!response.ok) {
      throw new Error(`API request to ${secureUrl} failed with status ${response.status}`);
    }
    const data: { results: any[], next: string | null } = await response.json();
    allResults = allResults.concat(data.results);
    nextUrl = data.next;
  }
  return allResults;
};

/**
 * Fetches a single spell from the Open5e API.
 * @param slug The unique identifier for the spell (e.g., 'magic-missile').
 * @returns A promise that resolves to the Spell object or null if not found.
 */
export const fetchSpellFromApi = async (slug: string): Promise<Spell | null> => {
  try {
    const url = `${API_BASE_URL}/spells/${slug}/`;
    const response = await fetch(url.replace(/^http:/, 'https:'));
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Spell with slug '${slug}' not found in Open5e API.`);
        return null;
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    // Transform API data to our strictly typed Spell object
    const spell: Spell = {
        slug: data.slug,
        name: data.name,
        desc: data.desc,
        higher_level: data.higher_level,
        range: data.range,
        components: data.components,
        material: data.material,
        ritual: data.ritual === 'yes',
        duration: data.duration,
        concentration: data.concentration === 'yes',
        casting_time: data.casting_time,
        level: data.level_int,
        school: data.school,
        dnd_class: data.dnd_class,
        // FIX: Add missing properties with reasonable defaults for API-fetched spells.
        manaCost: (data.level_int || 0) * 3 + 5,
        targetType: data.desc.toLowerCase().includes('regains hit points') ? 'ally' : 'enemy',
        actionId: data.slug,
    };

    return spell;
  } catch (error) {
    console.error(`Error fetching spell '${slug}' from API:`, error);
    return null;
  }
};


/**
 * Fetches all equipment from the Open5e API, handling pagination.
 * This combines weapons, armor, and magic items.
 * @returns A promise that resolves to an array of raw equipment objects.
 */
export const fetchAllEquipmentFromApi = async (): Promise<any[]> => {
  try {
    const [weapons, armor, magicItems] = await Promise.all([
      fetchPaginatedData('weapons'),
      fetchPaginatedData('armor'),
      fetchPaginatedData('magicitems'),
    ]);

    // Add a temporary type property to help with transformation later
    const taggedWeapons = weapons.map(w => ({ ...w, _type: 'weapon' }));
    const taggedArmor = armor.map(a => ({ ...a, _type: 'armor' }));
    const taggedMagicItems = magicItems.map(m => ({ ...m, _type: 'magicitem' }));

    return [...taggedWeapons, ...taggedArmor, ...taggedMagicItems];
  } catch (error) {
    console.error('Error fetching all equipment from API:', error);
    return [];
  }
};
