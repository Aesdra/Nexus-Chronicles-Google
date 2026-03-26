import { CurrencyInfo } from '../types';

export const CURRENCIES: Record<string, CurrencyInfo> = {
  'copper-piece': {
    slug: 'copper-piece',
    name: 'Copper Piece',
    desc: "The humble copper piece is the lifeblood of the common folk. With a handful, one can buy a loaf of bread, a mug of cheap ale, or a simple candle to ward off the night's gloom. It is the coin of the street, the marketplace, and the farmer."
  },
  'silver-piece': {
    slug: 'silver-piece',
    name: 'Silver Piece',
    desc: "Worth ten coppers, the silver piece is the coin of the soldier and the skilled artisan. It can secure a day's rations, a night's stay in a decent inn, or a sharp dagger. It represents a day of honest, hard work."
  },
  'gold-piece': {
    slug: 'gold-piece',
    name: 'Gold Piece',
    desc: "The gleaming gold piece, worth ten silvers, is the standard of wealth and power. It is the coin of merchants, nobles, and adventurers. A single gold piece can purchase a fine sword, a sturdy shield, or passage on a ship to a distant land. It is the currency of ambition and danger."
  }
};
