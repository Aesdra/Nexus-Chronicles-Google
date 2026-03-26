import React from 'react';
import { Item, ItemRarity } from '../../types';
import { cn } from '../../lib/utils';
import { formatCurrencyFromCopper } from '../../lib/utils';
import { GoldCoinIcon } from '../icons/GoldCoinIcon';
import { SilverCoinIcon } from '../icons/SilverCoinIcon';
import { CopperCoinIcon } from '../icons/CopperCoinIcon';

const rarityTextColorMap: Record<ItemRarity, string> = {
  Common: 'text-stone-300',
  Uncommon: 'text-green-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Legendary: 'text-yellow-400',
};

interface ItemTooltipProps {
  item: Item;
  quantity?: number;
  price?: { type: 'Buy' | 'Sell'; value: number };
  children?: React.ReactNode;
}

/**
 * A centralized, reusable component for displaying detailed information about an item.
 * It encapsulates all formatting logic for item properties like rarity, stats, requirements, and value.
 * It is designed to be used in tooltips or detail panes across the application (e.g., Inventory, Trade).
 *
 * @param {Item} item - The item object to display.
 * @param {number} [quantity] - The quantity of the item, if it's a stack.
 * @param {object} [price] - An optional price to display, used in the trade modal.
 * @param {React.ReactNode} [children] - Optional action buttons (e.g., Equip, Use) to be rendered at the bottom.
 */
export const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, quantity, price, children }) => {
  const renderItemValue = (valueInCopper: number, label: string) => {
    if (valueInCopper <= 0) return null;
    const { gp, sp, cp } = formatCurrencyFromCopper(valueInCopper);
    const parts = [];
    if (gp > 0) parts.push(<span key="gp" className="flex items-center"><GoldCoinIcon className="h-4 w-4 mr-1" /> {gp}</span>);
    if (sp > 0) parts.push(<span key="sp" className="flex items-center"><SilverCoinIcon className="h-4 w-4 mr-1" /> {sp}</span>);
    if (cp > 0) parts.push(<span key="cp" className="flex items-center"><CopperCoinIcon className="h-4 w-4 mr-1" /> {cp}</span>);
    if (parts.length === 0) return null;

    return (
      <div className="mt-4 flex items-center justify-center gap-4 text-stone-300">
        <span className="font-bold">{label}:</span>
        <div className="flex items-center gap-3">
          {parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 className="font-medieval text-2xl text-amber-300 text-center">{item.name}</h4>
      <p className={cn("text-center font-bold text-lg mb-2", rarityTextColorMap[item.rarity])}>
        {item.rarity} {quantity && quantity > 1 && `(x${quantity})`}
      </p>
      <p className="text-sm text-gray-400 text-center capitalize mb-2">
        {item.type} {item.slot && `(${item.slot})`}
      </p>
      <p className="text-gray-300 mb-3 text-center">{item.description}</p>

      {item.stats && Object.keys(item.stats).length > 0 && (
        <div className="border-t border-stone-600 pt-2">
          <h5 className="font-medieval text-lg text-amber-400">Properties</h5>
          <ul className="list-none text-green-400">
            {Object.entries(item.stats).map(([stat, value]) => {
              const numValue = value as number;
              return (
                <li key={stat}>
                  {`${numValue > 0 ? '+' : ''}${numValue} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {item.requirements && (() => {
        const { race, class: classes, subclass, classGroup, stats } = item.requirements;
        const requirementLines: string[] = [];
        if (race) requirementLines.push(`Race: ${race.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}`);
        if (classes) requirementLines.push(`Class: ${classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}`);
        if (subclass) requirementLines.push(`Subclass: ${subclass.map(s => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ')}`);
        if (classGroup) requirementLines.push(`Group: ${classGroup.join(', ')}`);
        if (stats) {
          Object.entries(stats).forEach(([stat, val]) => {
            requirementLines.push(`Requires ${val}+ ${stat.charAt(0).toUpperCase() + stat.slice(1)}`);
          });
        }
        if (requirementLines.length === 0) return null;
        return (
          <div className="border-t border-stone-600 pt-2 mt-2">
            <h5 className="font-medieval text-lg text-red-400">Restricted to</h5>
            <ul className="list-none text-red-300 text-sm">
              {requirementLines.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </div>
        );
      })()}

      {price ? renderItemValue(price.value, price.type + ' Price') : renderItemValue(item.value, 'Value')}

      {children && (
        <div className="mt-auto pt-4">
          {children}
        </div>
      )}
    </div>
  );
};
