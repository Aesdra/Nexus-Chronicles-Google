
import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../store/store';
import { NPCData, Item, InventorySlotData, ItemType } from '../types';
import { GoldCoinIcon } from './icons/GoldCoinIcon';
import { SilverCoinIcon } from './icons/SilverCoinIcon';
import { CopperCoinIcon } from './icons/CopperCoinIcon';
import { cn } from '../lib/utils';
import { formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';
import { audioManager } from '../services/audioService';
import { useQueries } from '@tanstack/react-query';
import { getItem, getNpcData } from '../services/dataService';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';
import { ItemTooltip } from './ui/ItemTooltip';
import { FACTIONS } from '../data/factions';
import { ItemSlot } from './ItemSlot';

const BalanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const CurrencyInput: React.FC<{
    currency: { gp: number, sp: number, cp: number };
    onChange: (currency: { gp: number, sp: number, cp: number }) => void;
}> = ({ currency, onChange }) => (
    <div className="flex items-center justify-around bg-black/30 p-1 rounded border border-stone-600 gap-1">
        <div className="flex items-center">
            <GoldCoinIcon className="w-4 h-4 text-yellow-500" />
            <input type="number" value={currency.gp} onChange={e => onChange({...currency, gp: Math.max(0, parseInt(e.target.value) || 0)})} className="w-8 bg-transparent text-center text-amber-200 font-bold focus:outline-none" min="0" />
        </div>
        <div className="flex items-center">
            <SilverCoinIcon className="w-4 h-4 text-slate-400" />
            <input type="number" value={currency.sp} onChange={e => onChange({...currency, sp: Math.max(0, parseInt(e.target.value) || 0)})} className="w-8 bg-transparent text-center text-amber-200 font-bold focus:outline-none" min="0" />
        </div>
        <div className="flex items-center">
            <CopperCoinIcon className="w-4 h-4 text-orange-500" />
            <input type="number" value={currency.cp} onChange={e => onChange({...currency, cp: Math.max(0, parseInt(e.target.value) || 0)})} className="w-8 bg-transparent text-center text-amber-200 font-bold focus:outline-none" min="0" />
        </div>
    </div>
);

type SelectedItemInfo = {
    item: Item;
    source: 'player' | 'npc' | 'playerOffer' | 'npcOffer';
    index: number; 
    slotData: InventorySlotData;
} | null;


export const TradeModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { 
      player, npcState, tradeSession,
      endTradeSession, addItemToPlayerOffer, removeItemFromPlayerOffer, addItemToNpcOffer, removeItemFromNpcOffer,
      updatePlayerOfferCurrency, updateNpcOfferCurrency, clearOffers, finalizeTrade 
    } = useGameStore();
    
    const [selectedItem, setSelectedItem] = useState<SelectedItemInfo>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'player' | 'npc'>('player');
    const [itemFilter, setItemFilter] = useState<ItemType | 'all'>('all');
    
    // Derived state from the store
    const npc = useMemo(() => tradeSession ? getNpcData(tradeSession.npcId) : null, [tradeSession]);
    const attitude = useMemo(() => (tradeSession && npcState[tradeSession.npcId]?.attitude) || 0, [tradeSession, npcState]);

    useEffect(() => {
        // When a new item is selected, reset the quantity input to 1 for a predictable user experience.
        setQuantity(1);
    }, [selectedItem]);
    
    const handleClose = () => {
        audioManager.playSound('click');
        setSelectedItem(null);
        setQuantity(1);
        endTradeSession();
        onClose();
    };

    const handleFinalizeTrade = () => {
        audioManager.playSound('click');
        finalizeTrade();
        setSelectedItem(null);
        setQuantity(1);
    };

    const handleActionClick = () => {
        if (!selectedItem) return;
        
        audioManager.playSound('click');

        const { item, source, index } = selectedItem;

        switch (source) {
            case 'player':
                addItemToPlayerOffer(item, quantity);
                break;
            case 'npc':
                addItemToNpcOffer(item, quantity);
                break;
            case 'playerOffer':
                removeItemFromPlayerOffer(index, quantity);
                break;
            case 'npcOffer':
                removeItemFromNpcOffer(index, quantity);
                break;
        }
        
        setSelectedItem(null);
    };

    const npcFullInventory = useMemo(() => {
        if (!tradeSession || !npc || !player) return [];
        const baseInventory = npc.inventory || [];
        const rankInventory: { itemId: string; stock: number }[] = [];
        const npcFactionId = npc.factionId;
        const factionData = FACTIONS.find(f => f.id === npcFactionId);
        
        if (factionData && factionData.ranks && npc.factionRankInventory) {
            const playerRep = player.reputation[npcFactionId] || 0;
            for (const rank of factionData.ranks) {
                if (playerRep >= rank.reputationThreshold && npc.factionRankInventory[rank.name]) {
                    rankInventory.push(...npc.factionRankInventory[rank.name]);
                }
            }
        }
        return [...baseInventory, ...rankInventory];
    }, [tradeSession, npc, player]);

    const itemQueries = useQueries({
        queries: npcFullInventory.map(inv => ({
            queryKey: ['item', inv.itemId],
            queryFn: () => getItem(inv.itemId), staleTime: Infinity, enabled: isOpen && !!tradeSession,
        })),
    });

    const npcInventoryForDisplay = useMemo(() => {
        if (!tradeSession) return [];
        const offeredCounts = tradeSession.npcOffer.items.reduce((acc, slot) => {
            acc[slot.item.id] = (acc[slot.item.id] || 0) + slot.quantity;
            return acc;
        }, {} as Record<string, number>);

        return itemQueries.map((query, index) => {
            const itemData = query.data;
            if (!itemData || (itemFilter !== 'all' && itemData.type !== itemFilter)) return null;
            const dynamicStock = npcState[tradeSession.npcId]?.inventory.find(i => i.itemId === itemData.id);
            const staticStock = npcFullInventory[index];
            const stock = dynamicStock?.stock ?? staticStock?.stock ?? 0;
            const offeredCount = offeredCounts[itemData.id] || 0;
            if (stock === -1) return { item: itemData, quantity: 99 }; // effectively "infinite"
            const remainingStock = stock - offeredCount;
            if (remainingStock <= 0) return null;
            return { item: itemData, quantity: remainingStock };
        }).filter((slot): slot is InventorySlotData => !!slot);
    }, [itemQueries, npcFullInventory, tradeSession, npcState, itemFilter]);
    
    const playerInventoryForDisplay = useMemo(() => {
        if (!player || !tradeSession) return [];
        const offeredCounts = tradeSession.playerOffer.items.reduce((acc, slot) => {
            acc[slot.item.id] = (acc[slot.item.id] || 0) + slot.quantity;
            return acc;
        }, {} as Record<string, number>);

        const displayedInventory: { slotData: InventorySlotData, originalIndex: number }[] = [];
        const tempOffered = {...offeredCounts};

        player.inventory.forEach((slot, originalIndex) => {
            if (!slot || slot.item.type === 'quest' || (itemFilter !== 'all' && slot.item.type !== itemFilter)) {
                return;
            }

            const offered = tempOffered[slot.item.id] || 0;
            if (offered > 0) {
                const remainingInSlot = slot.quantity - offered;
                if (remainingInSlot > 0) {
                    displayedInventory.push({ slotData: { ...slot, quantity: remainingInSlot }, originalIndex });
                }
                tempOffered[slot.item.id] = Math.max(0, offered - slot.quantity);
            } else {
                displayedInventory.push({ slotData: slot, originalIndex });
            }
        });

        return displayedInventory;
    }, [player?.inventory, tradeSession?.playerOffer.items, itemFilter]);


    if (!isOpen || !tradeSession || !npc || !player) return null;

    const { playerOffer, npcOffer, playerValue, npcValue } = tradeSession;
    const isTradeBalanced = playerValue >= npcValue;
    const playerHasEnoughGold = totalCurrencyInCopper(player.currency) >= totalCurrencyInCopper(playerOffer.currency);

    const renderValue = (valueInCopper: number) => {
        const { gp, sp, cp } = formatCurrencyFromCopper(valueInCopper);
        const parts = [];
        if (gp > 0) parts.push(<span key="gp" className="flex items-center"><GoldCoinIcon className="h-3 w-3 mr-0.5" /> {gp}</span>);
        if (sp > 0) parts.push(<span key="sp" className="flex items-center"><SilverCoinIcon className="h-3 w-3 mr-0.5" /> {sp}</span>);
        if (cp > 0) parts.push(<span key="cp" className="flex items-center"><CopperCoinIcon className="h-3 w-3 mr-0.5" /> {cp}</span>);
        if (parts.length === 0) return <span className="flex items-center"><CopperCoinIcon className="h-3 w-3 mr-0.5" /> 0</span>;
        return <>{parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}</>;
    };

    return (
        <ModalFrame isOpen={isOpen} onClose={handleClose} title="Barter" containerClassName="max-w-md h-[98vh]">
            <div className="flex flex-col h-full">
                <div className="text-center bg-black/20 p-2 border-b-2 border-amber-900/60">
                    <p className="text-sm text-stone-400">Trading with {npc.name}</p>
                </div>
                {/* Top Zone: Offers */}
                <div className="p-3 bg-black/20">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
                        {/* Your Offer */}
                        <div className="text-center">
                            <h3 className="font-medieval text-amber-200">Your Offer</h3>
                             <div className="grid grid-cols-4 gap-1 p-1 bg-black/30 rounded border border-stone-600 my-1 min-h-[4.5rem]">
                                {playerOffer.items.map((slotData, index) => (
                                    <ItemSlot 
                                        key={`${slotData.item.id}-${index}`} 
                                        item={slotData.item} 
                                        quantity={slotData.quantity}
                                        onClick={() => setSelectedItem({item: slotData.item, source: 'playerOffer', index, slotData})} 
                                        isSelected={selectedItem?.source === 'playerOffer' && selectedItem.index === index}
                                        className="w-full aspect-square"
                                    />
                                ))}
                            </div>
                            <CurrencyInput currency={playerOffer.currency} onChange={updatePlayerOfferCurrency} />
                            <div className="text-xs text-stone-400 mt-1 flex items-center justify-center gap-1">Value: <div className="flex items-center gap-2 text-amber-200 font-bold">{renderValue(playerValue)}</div></div>
                        </div>
                        {/* Balance Icon */}
                        <div className={cn("p-2 rounded-full mt-5", isTradeBalanced ? "bg-green-800/30" : "bg-red-800/30")}>
                            <BalanceIcon />
                        </div>
                        {/* NPC Offer */}
                        <div className="text-center">
                            <h3 className="font-medieval text-stone-300">Merchant's Offer</h3>
                             <div className="grid grid-cols-4 gap-1 p-1 bg-black/30 rounded border border-stone-600 my-1 min-h-[4.5rem]">
                                {npcOffer.items.map((slotData, index) => (
                                    <ItemSlot 
                                        key={`${slotData.item.id}-${index}`} 
                                        item={slotData.item} 
                                        quantity={slotData.quantity}
                                        onClick={() => setSelectedItem({item: slotData.item, source: 'npcOffer', index, slotData})} 
                                        isSelected={selectedItem?.source === 'npcOffer' && selectedItem.index === index}
                                        className="w-full aspect-square"
                                    />
                                ))}
                            </div>
                            <CurrencyInput currency={npcOffer.currency} onChange={updateNpcOfferCurrency} />
                            <div className="text-xs text-stone-400 mt-1 flex items-center justify-center gap-1">Value: <div className="flex items-center gap-2 text-amber-200 font-bold">{renderValue(npcValue)}</div></div>
                        </div>
                    </div>
                </div>

                {/* Middle Zone: Inventories */}
                <div className="flex-grow flex flex-col p-3 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b-2 border-amber-900/60 mb-2">
                        <button onClick={() => { setActiveTab('player'); setSelectedItem(null); }} className={cn('flex-1 font-medieval text-xl py-2', activeTab === 'player' ? 'bg-amber-800/30 text-amber-200' : 'bg-black/20 text-stone-500 hover:bg-stone-700/30')}>Your Inventory</button>
                        <button onClick={() => { setActiveTab('npc'); setSelectedItem(null); }} className={cn('flex-1 font-medieval text-xl py-2', activeTab === 'npc' ? 'bg-amber-800/30 text-amber-200' : 'bg-black/20 text-stone-500 hover:bg-stone-700/30')}>Merchant's Inventory</button>
                    </div>
                    {/* Filters */}
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {(['all', 'weapon', 'armor', 'consumable', 'misc'] as const).map(filter => (
                            <Button key={filter} onClick={() => setItemFilter(filter)} size="sm" variant={itemFilter === filter ? 'default' : 'secondary'} className="capitalize">{filter}</Button>
                        ))}
                    </div>
                    {/* Inventory Grid */}
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="grid grid-cols-5 gap-2">
                            {activeTab === 'player' ? (
                                playerInventoryForDisplay.map(({ slotData, originalIndex }) => (
                                    <ItemSlot 
                                        key={`${slotData.item.id}-${originalIndex}`} 
                                        item={slotData.item}
                                        quantity={slotData.quantity}
                                        onClick={() => setSelectedItem({ item: slotData.item, source: 'player', index: originalIndex, slotData })} 
                                        isSelected={selectedItem?.source === 'player' && selectedItem.index === originalIndex}
                                        className="w-full aspect-square"
                                    />
                                ))
                            ) : (
                                npcInventoryForDisplay.map((slotData, displayIndex) => (
                                    <ItemSlot 
                                        key={`${slotData.item.id}-${displayIndex}`} 
                                        item={slotData.item}
                                        quantity={slotData.quantity}
                                        onClick={() => setSelectedItem({ item: slotData.item, source: 'npc', index: displayIndex, slotData })} 
                                        isSelected={selectedItem?.source === 'npc' && selectedItem.index === displayIndex}
                                        className="w-full aspect-square"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Bottom Zone: Context & Action */}
                <footer className="p-3 border-t-2 border-amber-900/60 bg-black/20 flex-shrink-0">
                    <div className="min-h-[140px] mb-2 p-2 bg-black/20 rounded border border-stone-600 text-center flex flex-col justify-center">
                       {selectedItem ? (() => {
                            const { item, source, slotData } = selectedItem;
                            const maxQuantity = slotData.quantity;
                            const isOfferItem = source.includes('Offer');

                            const isSelling = source === 'player';
                             const price = isSelling
                                ? Math.floor((item.value / 2) * (1 + (attitude / 100 * 0.5)))
                                : Math.floor(item.value * (1 - (attitude / 100 * 0.5)));

                            return (
                                <ItemTooltip
                                    item={item}
                                    price={!isOfferItem ? { type: isSelling ? 'Sell' : 'Buy', value: price } : undefined}
                                >
                                    {item.stackable && (
                                        <div className="flex items-center justify-center gap-2 my-2">
                                            <Button size="sm" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                                            <input 
                                                type="number"
                                                value={quantity}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setQuantity(Math.max(1, Math.min(val, maxQuantity)));
                                                }}
                                                className="w-16 text-center bg-stone-900 border border-stone-600 rounded"
                                                max={maxQuantity}
                                                min="1"
                                            />
                                            <Button size="sm" onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}>+</Button>
                                            <Button size="sm" onClick={() => setQuantity(maxQuantity)}>Max</Button>
                                        </div>
                                    )}
                                    <Button 
                                        onClick={handleActionClick} 
                                        variant={isOfferItem ? 'destructive' : 'secondary'} 
                                        className={cn("w-full", !isOfferItem && "bg-green-800/80 hover:bg-green-700/80 border-green-700")}
                                    >
                                        {isOfferItem 
                                            ? (quantity >= maxQuantity ? `Remove Stack (${maxQuantity})` : `Remove ${quantity} From Offer`)
                                            : `Add To Offer ${quantity > 1 ? `(x${quantity})` : ''}`
                                        }
                                    </Button>
                                </ItemTooltip>
                            );
                        })() : (
                            <p className="text-stone-500 text-sm">Select an item for details and actions.</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleFinalizeTrade} disabled={!isTradeBalanced || !playerHasEnoughGold} title={!playerHasEnoughGold ? "You don't have enough currency for this offer." : ""} className="w-full font-medieval text-2xl p-3 bg-gradient-to-b from-amber-600 to-amber-800 text-white rounded-md border-2 border-amber-500">Accept Trade</Button>
                        <div className="flex gap-2">
                            <Button onClick={handleClose} variant="secondary" className="flex-1 font-medieval text-lg p-2">Cancel</Button>
                            <Button onClick={clearOffers} variant="secondary" className="flex-1 font-medieval text-lg p-2">Clear Offer</Button>
                        </div>
                    </div>
                </footer>
            </div>
        </ModalFrame>
    );
};
