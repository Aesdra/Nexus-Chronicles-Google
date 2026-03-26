import Dexie, { Table } from 'dexie';
import { GameSave, Spell, Background, CurrencyInfo, Item } from './types';

// FIX: Refactored to a non-subclassing pattern to resolve schema definition errors.
// This approach is functionally equivalent and avoids potential `this` context issues
// that can occur in some TypeScript configurations when extending classes like Dexie.
export const db = new Dexie('nexusChroniclesDB') as Dexie & {
  gameSaves: Table<GameSave, number>; 
  spells: Table<Spell, string>;
  backgrounds: Table<Background, string>;
  items: Table<Item, string>;
};

db.version(1).stores({
  gameSaves: '&id',
  spells: '&slug', // Use the spell's unique slug as the primary key
});

// Per Dexie's versioning rules, when declaring a new version, all existing tables 
// must be re-declared to prevent them from being deleted.
db.version(2).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
});

db.version(3).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
  currencies: '&slug',
});

db.version(4).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
  currencies: '&slug',
  items: '&id', // Add new items table, keyed by the item's unique id (slug from API)
});

db.version(5).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
  items: '&id',
  currencies: null, // This will remove the table
});
