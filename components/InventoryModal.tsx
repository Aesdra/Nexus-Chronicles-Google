
import React, { useState } from 'react';
import { Item, EquipmentSlot, InventorySlotData } from '../types';
import { ItemSlot } from './ItemSlot';
import { useGameStore } from '../store/store';
import { GoldCoinIcon } from './icons/GoldCoinIcon';
import { SilverCoinIcon } from './icons/SilverCoinIcon';
import { CopperCoinIcon } from './icons/CopperCoinIcon';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';
import { ItemTooltip } from './ui/ItemTooltip';


interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HoveredItemInfo = { 
  item: Item; 
  quantity: number;
  source: 'inventory' | 'equipment'; 
  index: number | EquipmentSlot;
};

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  const [hoveredItemInfo, setHoveredItemInfo] = useState<HoveredItemInfo | null>(null);
  
  const player = useGameStore((state) => state.player);
  const updateInventoryAndEquipment = useGameStore((state) => state.updateInventoryAndEquipment);
  const { useItem, equipItem, unequipItem } = useGameStore(state => ({
      useItem: state.useItem,
      equipItem: state.equipItem,
      unequipItem: state.unequipItem
  }));

  if (!player) return null;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, data: { slotData: InventorySlotData | null, item: Item | null }, source: string, index: number | EquipmentSlot) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ ...data, source, index }));
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetName: string, targetIndex: number | EquipmentSlot) => {
    e.preventDefault();
    try {
        const dataString = e.dataTransfer.getData('application/json');
        if (!dataString) return;
        
        const data = JSON.parse(dataString);
        const sourceName = data.source as string;
        const sourceIndex = data.index as number | EquipmentSlot;

        const newInventory: (InventorySlotData | null)[] = JSON.parse(JSON.stringify(player.inventory));
        const newEquipment: Record<EquipmentSlot, Item | null> = JSON.parse(JSON.stringify(player.equipment));
        
        // --- This is now purely for swapping ---
        if (sourceName === 'inventory' && targetName === 'inventory' && typeof sourceIndex === 'number' && typeof targetIndex === 'number') {
            const temp = newInventory[sourceIndex];
            newInventory[sourceIndex] = newInventory[targetIndex];
            newInventory[targetIndex] = temp;
            updateInventoryAndEquipment(newInventory, newEquipment);
            return;
        }

        // --- Dragging to/from equipment slots ---
        if (sourceName === 'inventory' && targetName === 'equipment' && typeof sourceIndex === 'number' && typeof targetIndex === 'string') {
            equipItem(sourceIndex, targetIndex as EquipmentSlot);
        } else if (sourceName === 'equipment' && targetName === 'inventory' && typeof sourceIndex === 'string') {
            unequipItem(sourceIndex as EquipmentSlot);
        }

    } catch (error) {
        console.error("Error handling drop:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const renderActionButtons = () => {
    if (!hoveredItemInfo) return null;

    const { item, source, index } = hoveredItemInfo;
    const isInventoryFull = player.inventory.every(slot => slot !== null);

    if (source === 'equipment') {
        return (
            <Button 
                onClick={() => unequipItem(index as EquipmentSlot)}
                disabled={isInventoryFull}
                variant="destructive"
                className="w-full"
                title={isInventoryFull ? "Inventory is full" : "Unequip this item"}
            >
                Unequip
            </Button>
        );
    }

    if (source === 'inventory') {
        if (item.type === 'consumable') {
            return (
                <Button 
                    onClick={() => useItem(index as number)}
                    variant="secondary"
                    className="w-full bg-blue-800/80 hover:bg-blue-700/80 border-blue-700"
                >
                    Use
                </Button>
            );
        }
        
        if (item.slot) { // Is equippable
            if (item.type === 'weapon' && item.handedness === 'one') {
                const mainHandIsTwoHanded = player.equipment.mainHand?.handedness === 'two';
                return (
                    <div className="w-full flex gap-2">
                        <Button onClick={() => equipItem(index as number, 'mainHand')} variant="secondary" className="flex-1 bg-green-800/80 hover:bg-green-700/80 border-green-700">
                            Main Hand
                        </Button>
                        <Button 
                            onClick={() => equipItem(index as number, 'offHand')} 
                            disabled={mainHandIsTwoHanded}
                            variant="secondary" className="flex-1 bg-green-800/80 hover:bg-green-700/80 border-green-700"
                            title={mainHandIsTwoHanded ? "Cannot equip off-hand with a two-handed weapon." : ""}
                        >
                            Off Hand
                        </Button>
                    </div>
                );
            } else { // For armor, two-handed weapons, etc.
                 return (
                    <Button 
                        onClick={() => equipItem(index as number, item.slot!)}
                        variant="secondary"
                        className="w-full bg-green-800/80 hover:bg-green-700/80 border-green-700"
                    >
                        Equip
                    </Button>
                );
            }
        }
    }
    
    return null;
}

const equipmentSlotLayout: Record<string, EquipmentSlot[]> = {
    top: ['head', 'amulet', 'ring'],
    middle: ['chest', 'legs', 'hands'],
    bottom: ['feet'],
}

const renderEquipmentSlot = (slot: EquipmentSlot) => (
    <ItemSlot
        key={slot}
        item={player.equipment[slot]}
        quantity={1}
        showTooltip={true}
        onDrop={(e) => handleDrop(e, 'equipment', slot)}
        onDragOver={handleDragOver}
        onDragStart={(e) => player.equipment[slot] && handleDragStart(e, { item: player.equipment[slot]!, slotData: null }, 'equipment', slot)}
        onMouseEnter={() => player.equipment[slot] && setHoveredItemInfo({item: player.equipment[slot]!, quantity: 1, source: 'equipment', index: slot})}
        onMouseLeave={() => setHoveredItemInfo(null)}
    />
);

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="Inventory" containerClassName="max-w-5xl h-[90vh]">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Character & Equipment Panel (Left) */}
            <div className="md:col-span-1 bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700 flex flex-col items-center">
              <h3 className="font-medieval text-2xl text-amber-200 mb-4">{player.name}</h3>
              <div className="w-full flex justify-center items-center gap-2 mb-4">
                {renderEquipmentSlot('mainHand')}
                <div className="relative w-40 h-56 bg-black/30 rounded flex-shrink-0 border-2 border-stone-800">
                  {player.spriteUrl ? (
                    <img src={player.spriteUrl} alt="Character" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Sprite</div>
                  )}
                </div>
                {renderEquipmentSlot('offHand')}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                  {equipmentSlotLayout.top.map(renderEquipmentSlot)}
                  {equipmentSlotLayout.middle.map(renderEquipmentSlot)}
                  <div className="col-span-3 flex justify-center mt-2">
                    {equipmentSlotLayout.bottom.map(renderEquipmentSlot)}
                  </div>
              </div>

              <div className="mt-auto pt-4 border-t-2 border-stone-700 w-full min-h-[220px] flex flex-col">
                {hoveredItemInfo ? (
                  <ItemTooltip item={hoveredItemInfo.item} quantity={hoveredItemInfo.quantity}>
                    {renderActionButtons()}
                  </ItemTooltip>
                ) : (
                  <div className="flex-grow flex items-center justify-center h-full text-stone-500">
                    <p>Hover over an item to see its details.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Panel (Right) */}
            <div className="md:col-span-2 bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700 flex flex-col">
              <h3 className="font-medieval text-2xl text-amber-200 mb-4 text-center">Inventory</h3>
              <div className="grid grid-cols-6 gap-2">
                {player.inventory.map((slotData, index) => (
                  <ItemSlot
                    key={index}
                    item={slotData?.item}
                    quantity={slotData?.quantity}
                    showTooltip={true}
                    onDrop={(e) => handleDrop(e, 'inventory', index)}
                    onDragOver={handleDragOver}
                    onDragStart={(e) => slotData && handleDragStart(e, { slotData, item: slotData.item }, 'inventory', index)}
                    onMouseEnter={() => slotData && setHoveredItemInfo({item: slotData.item, quantity: slotData.quantity, source: 'inventory', index})}
                    onMouseLeave={() => setHoveredItemInfo(null)}
                  />
                ))}
              </div>
              <div className="mt-auto pt-4 border-t-2 border-stone-700 flex items-center justify-center gap-6">
                   <div className="flex items-center" title="Gold Pieces">
                      <GoldCoinIcon className="h-6 w-6 text-yellow-400" />
                      <span className="font-medieval text-2xl text-amber-200 ml-2">{player.currency.gp}</span>
                  </div>
                  <div className="flex items-center" title="Silver Pieces">
                      <SilverCoinIcon className="h-6 w-6 text-slate-400" />
                      <span className="font-medieval text-2xl text-amber-200 ml-2">{player.currency.sp}</span>
                  </div>
                  <div className="flex items-center" title="Copper Pieces">
                      <CopperCoinIcon className="h-6 w-6 text-orange-400" />
                      <span className="font-medieval text-2xl text-amber-200 ml-2">{player.currency.cp}</span>
                  </div>
              </div>
            </div>
        </div>
    </ModalFrame>
  );
};
