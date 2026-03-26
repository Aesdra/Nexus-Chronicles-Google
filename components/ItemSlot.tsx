
import React from 'react';
import { Item, ItemRarity, InventorySlotData } from '../types';
import { cn } from '../lib/utils';

const rarityBorderColorMap: Record<ItemRarity, string> = {
    Common: 'border-stone-600 hover:border-stone-400',
    Uncommon: 'border-green-600 hover:border-green-400',
    Rare: 'border-blue-600 hover:border-blue-400',
    Epic: 'border-purple-600 hover:border-purple-400',
    Legendary: 'border-yellow-500 hover:border-yellow-300',
};

export interface ItemSlotProps {
    item?: Item | null;
    quantity?: number;
    isSelected?: boolean;
    showTooltip?: boolean;
    onClick?: () => void;
    className?: string;
    // Drag and Drop Props
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const ItemSlot: React.FC<ItemSlotProps> = ({
    item,
    quantity,
    isSelected,
    showTooltip = false,
    onClick,
    className,
    onDragStart,
    onDrop,
    onDragOver,
    onMouseEnter,
    onMouseLeave
}) => {
    return (
        <div
            className={cn(
                "relative group flex items-center justify-center bg-stone-900/50 border-2 rounded-md transition-all duration-200",
                // Default size (can be overridden by className)
                "w-16 h-16",
                // Interaction styles
                onClick && "cursor-pointer active:scale-95",
                // Rarity Border
                item ? rarityBorderColorMap[item.rarity] : "border-stone-700 hover:border-stone-500",
                // Selection State
                isSelected && "ring-2 ring-amber-400 border-amber-500 z-10 bg-stone-800",
                className
            )}
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {item ? (
                <>
                    <img
                        src={item.iconUrl}
                        alt={item.name}
                        className="w-full h-full object-cover p-1 rounded-sm"
                        draggable={!!onDragStart}
                        onDragStart={onDragStart}
                    />
                    
                    {/* Quantity Badge */}
                    {quantity !== undefined && quantity > 1 && (
                        <div
                            className="absolute bottom-0 right-1 text-xs font-bold text-white tabular-nums pointer-events-none"
                            style={{ textShadow: '1px 1px 2px black, -1px -1px 2px black' }}
                        >
                            {quantity}
                        </div>
                    )}

                    {/* Optional Tooltip (mostly for Inventory) */}
                    {showTooltip && (
                        <div className="absolute bottom-full mb-2 w-max max-w-[12rem] bg-stone-950/95 border border-stone-600 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                            <p className={cn("font-bold mb-1", rarityBorderColorMap[item.rarity].split(' ')[0].replace('border-', 'text-'))}>
                                {item.name}
                            </p>
                            <p className="text-xs text-stone-300 leading-tight">{item.description}</p>
                        </div>
                    )}
                </>
            ) : (
                // Empty Slot Placeholder
                <div className="w-full h-full" />
            )}
        </div>
    );
};
