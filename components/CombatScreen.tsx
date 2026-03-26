
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGameStore } from '../store/store';
import { Combatant, Item, InventorySlotData, Spell, StatusEffect, CombatLogEntry, LogType, MartialAbility, PlayerActionState } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SwordIcon } from './icons/SwordIcon';
import { RunIcon } from './icons/RunIcon';
import { SpellbookIcon } from './icons/SpellbookIcon';
import { BagIcon } from './icons/BagIcon';
import { useQueries } from '@tanstack/react-query';
import { getSpell } from '../services/dataService';
import { MARTIAL_ABILITIES } from '../data/martialAbilities';
import { FistIcon } from './icons/FistIcon';
import { StatusBar } from './ui/StatusBar';
import { selectConsumableItems } from '../store/selectors/inventorySelectors';
import { selectPlayerSpells, selectPlayerMartialAbilities } from '../store/selectors/playerSelectors';
import { ItemSlot } from './ItemSlot';
import { Button } from './ui/Button';

// --- SpellDetailsPanel ---
interface SpellDetailsPanelProps {
    spell: Spell;
}

const SpellDetailsPanel: React.FC<SpellDetailsPanelProps> = ({ spell }) => {
    
    const formatTarget = (targetType: 'enemy' | 'ally' | 'self') => {
        switch(targetType) {
            case 'enemy': return 'Hostile';
            case 'ally': return 'Friendly';
            case 'self': return 'Self';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-medieval text-amber-300 text-lg border-b border-stone-500 mb-2 flex-shrink-0">{spell.name}</h3>
            <div className="flex-grow overflow-y-auto text-sm pr-1 text-stone-300 space-y-2">
                <p className="italic">{spell.desc}</p>
                <div className="border-t border-stone-600 pt-2 mt-2 space-y-1">
                    <p><strong className="text-stone-300">Cost:</strong> <span className="text-blue-300 font-bold">{spell.manaCost} MP</span></p>
                    <p><strong className="text-stone-300">Target:</strong> <span className="text-yellow-300">{formatTarget(spell.targetType)}</span></p>
                </div>
            </div>
        </div>
    );
};

// --- AbilityDetailsPanel ---
interface AbilityDetailsPanelProps {
    ability: MartialAbility;
}

const AbilityDetailsPanel: React.FC<AbilityDetailsPanelProps> = ({ ability }) => {
    
    const formatTarget = (targetType: 'enemy' | 'ally' | 'self') => {
        switch(targetType) {
            case 'enemy': return 'Hostile';
            case 'ally': return 'Friendly';
            case 'self': return 'Self';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-medieval text-amber-300 text-lg border-b border-stone-500 mb-2 flex-shrink-0">{ability.name}</h3>
            <div className="flex-grow overflow-y-auto text-sm pr-1 text-stone-300 space-y-2">
                <p className="italic">{ability.description}</p>
                <div className="border-t border-stone-600 pt-2 mt-2 space-y-1">
                    <p><strong className="text-stone-300">Cost:</strong> <span className="text-yellow-300 font-bold">{ability.staminaCost} ST</span></p>
                    <p><strong className="text-stone-300">Target:</strong> <span className="text-yellow-300">{formatTarget(ability.targetType)}</span></p>
                </div>
            </div>
        </div>
    );
};

// --- ItemDetailsPanel ---
interface ItemDetailsPanelProps {
    itemData: { item: Item; inventoryIndex: number };
}
const ItemDetailsPanel: React.FC<ItemDetailsPanelProps> = ({ itemData }) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="font-medieval text-amber-300 text-lg border-b border-stone-500 mb-2 flex-shrink-0">{itemData.item.name}</h3>
            <div className="flex-grow overflow-y-auto text-sm pr-1 text-stone-300 space-y-2">
                <p className="italic">{itemData.item.description}</p>
            </div>
        </div>
    );
};


interface CombatScreenProps {
    background: string;
}

// --- SVG Icon Components for Status Effects and Abilities ---
const PoisonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 6.2c.3-.3.6-.7.8-1.1"/><path d="m22 2-1-1-3.5 3.5-1 1L21 10z"/><path d="M14.5 9.5 9.5 14.5"/><path d="M3.5 17.5 2 22l4.5-1.5"/><path d="M16.5 3.5 22 2l-1.5 5.5"/><circle cx="10.5" cy="10.5" r="8.5"/></svg>);
const BurningIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
const StunnedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L12 2l1.71 1.86" /><path d="M21.14 13.71L22 12l-1.86-1.71" /><path d="M3.86 10.29L2 12l1.86 1.71" /><path d="M12 22l1.71-1.86" /><path d="m12 12 2.29-2.29" /><path d="m12 12-2.29-2.29" /><path d="m12 12-2.29 2.29" /><path d="m12 12 2.29 2.29" /></svg>);
const CorrodingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3h8" /><path d="M12 3v5" /><path d="M12 8a5 5 0 0 0-5 5c0 4.2 3.5 8 5 8s5-3.8 5-8a5 5 0 0 0-5-5Z" /><path d="M12 12h.01" /><path d="M14 15h.01" /><path d="M10 15h.01" /></svg>);
const BlessedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-200" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const MockedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.532 4.47a.75.75 0 011.064 0 3.498 3.498 0 004.936 0 .75.75 0 011.064 1.063 5 5 0 01-7.064 0 .75.75 0 010-1.063z" clipRule="evenodd" /></svg>);
const MageArmorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.611 11.955 11.955 0 019 2.611A12.02 12.02 0 0019.618 5.984z" /></svg>);
const IlluminatedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-200" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm-.707-2.122a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>);
const TauntedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const DisarmedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const SlowedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const DefaultIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);


const StatusEffectIndicator: React.FC<{ name: string, effects: StatusEffect[] }> = ({ name, effects }) => {
    if (effects.length === 0) return null;

    const effectIconMap: Record<string, React.ReactNode> = {
        'Poisoned': <PoisonIcon />, 'Burning': <BurningIcon />, 'Stunned': <StunnedIcon />,
        'Corroding': <CorrodingIcon />, 'Blessed': <BlessedIcon />, 'Mocked': <MockedIcon />,
        'Mage Armor': <MageArmorIcon />, 'Illuminated': <IlluminatedIcon />, 'Taunted': <TauntedIcon />,
        'Disarmed': <DisarmedIcon />, 'Slowed': <SlowedIcon />, 'Default': <DefaultIcon />
    };

    const icon = effectIconMap[name] || effectIconMap['Default'];
    const duration = Math.max(...effects.map(e => e.duration));

    return (
        <div className="relative group p-1 rounded bg-black/50 cursor-help flex items-center justify-center">
            {icon}
            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-stone-900/95 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-stone-600 shadow-lg">
                <p className="font-bold text-amber-300">{name} ({duration} turn{duration > 1 ? 's' : ''} left)</p>
            </div>
        </div>
    );
};


const TargetIndicator = () => (
    <div className="absolute -top-4 w-full flex justify-center drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse">
        <svg className="w-8 h-8 text-red-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
    </div>
);


const CombatantDisplay: React.FC<{
    combatant: Combatant;
    isCurrentTurn: boolean;
    onClick?: () => void;
    isTargetable: boolean;
}> = ({ combatant, isCurrentTurn, onClick, isTargetable }) => {
    
    const animationProps = {
        opacity: combatant.isDefeated ? 0 : 1,
        y: combatant.isDefeated ? 50 : 0,
        filter: combatant.isDefeated ? 'grayscale(100%)' : 'none',
        scale: isCurrentTurn ? 1.05 : 1,
    };
    
    const groupedEffects = useMemo(() => {
        const groups: Record<string, StatusEffect[]> = {};
        for (const effect of combatant.statusEffects) {
            if (!groups[effect.name]) groups[effect.name] = [];
            groups[effect.name].push(effect);
        }
        return groups;
    }, [combatant.statusEffects]);

    return (
        <motion.div
            key={combatant.id}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={animationProps}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
                "relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 w-40",
                isTargetable && "cursor-pointer hover:bg-red-500/30",
                isCurrentTurn && "bg-black/40 shadow-lg shadow-amber-400/50"
            )}
            onClick={onClick}
        >
            {isTargetable && <TargetIndicator />}
            <h3 className="font-medieval text-lg text-white drop-shadow-lg">{combatant.name}</h3>
            <div className="w-full space-y-1">
                <StatusBar
                    currentValue={combatant.currentHp}
                    maxValue={combatant.maxHp}
                    colorClass="bg-gradient-to-r from-red-600 to-red-500"
                    label={`${combatant.name} Health`}
                    showText={true}
                    barClassName="h-4"
                />
                {combatant.maxMana !== undefined && combatant.currentMana !== undefined && (
                    <StatusBar
                        currentValue={combatant.currentMana}
                        maxValue={combatant.maxMana}
                        colorClass="bg-gradient-to-r from-blue-600 to-blue-500"
                        label={`${combatant.name} Mana`}
                        showText={true}
                        barClassName="h-4"
                    />
                )}
                {combatant.maxStamina !== undefined && combatant.currentStamina !== undefined && (combatant.maxStamina > 0) && (
                     <StatusBar
                        currentValue={combatant.currentStamina}
                        maxValue={combatant.maxStamina}
                        colorClass="bg-gradient-to-r from-yellow-600 to-yellow-500"
                        label={`${combatant.name} Stamina`}
                        showText={true}
                        barClassName="h-4"
                    />
                )}
            </div>
            <div className="relative w-32 h-40 my-2">
                <img src={combatant.spriteUrl} alt={combatant.name} className={cn("w-full h-full object-contain", combatant.type === 'enemy' && 'transform -scale-x-100')} />
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
                {Object.entries(groupedEffects).map(([name, effects]) => (
                    <StatusEffectIndicator key={name} name={name} effects={effects} />
                ))}
            </div>
        </motion.div>
    );
};

export const CombatScreen: React.FC<CombatScreenProps> = ({ background }) => {
    const { combatState, player, playerChooseAction, setPlayerAction, concludeCombat, processNextCombatEvent } = useGameStore();
    const logEndRef = useRef<HTMLDivElement>(null);

    const isPlayerTurn = useMemo(() => combatState?.currentTurnId === 'player' && !combatState?.isFinished, [combatState]);

    // State for the new "select then confirm" UI flow
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
    const [selectedAbility, setSelectedAbility] = useState<MartialAbility | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ slot: InventorySlotData, index: number } | null>(null);

    useEffect(() => {
        const isWaitingForPlayer = isPlayerTurn && (combatState?.eventQueue.length === 0);
        if (combatState && !combatState.isProcessingEvent && !isWaitingForPlayer && combatState.eventQueue.length > 0) {
            const timer = setTimeout(() => {
                processNextCombatEvent();
            }, 700); // Delay for pacing
            return () => clearTimeout(timer);
        }
    }, [combatState, processNextCombatEvent, isPlayerTurn]);
    
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [combatState?.log]);

    const playerSpellSlugs = useGameStore(selectPlayerSpells);
    const playerMartialAbilityIds = useGameStore(selectPlayerMartialAbilities);
    const consumableItems = useGameStore(selectConsumableItems);
    
    const spellQueries = useQueries({
        queries: playerSpellSlugs.map(slug => ({ queryKey: ['spell', slug], queryFn: () => getSpell(slug), staleTime: Infinity, })),
    });

    const martialAbilities = useMemo(() => playerMartialAbilityIds.map(id => MARTIAL_ABILITIES[id]).filter((ability): ability is MartialAbility => !!ability), [playerMartialAbilityIds]);

    const handleActionSelect = (action: PlayerActionState) => {
        // FIX: Cast query data to Spell to access its properties
        const spellData = action.type === 'spell' ? spellQueries.find(q => (q.data as Spell)?.slug === action.spellSlug)?.data as Spell : null;
        const abilityData = action.type === 'ability' ? MARTIAL_ABILITIES[action.abilityId!] : null;
        // FIX: Cast spellData to Spell to access its properties
        const targetType = spellData?.targetType || abilityData?.targetType || 'enemy';
        
        // Clear preview states before proceeding
        setSelectedSpell(null);
        setSelectedAbility(null);
        setSelectedItem(null);
        
        if (targetType === 'self') {
            playerChooseAction(action, 'player');
            setPlayerAction({ type: null, isAwaitingTarget: false });
        } else {
            setPlayerAction(action);
        }
    };
    
    const handleTargetSelect = (targetId: string) => {
        if (!combatState?.playerActionState.isAwaitingTarget) return;
        playerChooseAction(combatState.playerActionState, targetId);
        setPlayerAction({ type: null, isAwaitingTarget: false });
    };

    const isTargetValid = (target: Combatant): boolean => {
        const playerActionState = combatState?.playerActionState;
        if (!playerActionState?.isAwaitingTarget || target.isDefeated) return false;
        
        // FIX: Cast query data to Spell to access its properties
        const spellData = playerActionState.spellSlug ? spellQueries.find(q => (q.data as Spell)?.slug === playerActionState.spellSlug)?.data as Spell : null;
        const abilityData = playerActionState.abilityId ? MARTIAL_ABILITIES[playerActionState.abilityId] : null;

        // FIX: Cast spellData to Spell to access its properties
        const targetType = spellData?.targetType || abilityData?.targetType || 'enemy';
        const isAllyTarget = target.type === 'player' || target.type === 'companion';

        if (targetType === 'enemy' && isAllyTarget) return false;
        if (targetType === 'ally' && !isAllyTarget) return false;
        if (targetType === 'self' && target.id !== 'player') return false;
        return true;
    };

    if (!combatState || !player) return null;
    const { combatants, currentTurnId, log, isFinished, rewards, playerActionState } = combatState;
    const party = combatants.filter(c => c.type === 'player' || c.type === 'companion');
    const enemies = combatants.filter(c => c.type === 'enemy');

    const handleCategorySelect = (type: PlayerActionState['type']) => {
        setPlayerAction({ type, isAwaitingTarget: false });
        setSelectedSpell(null);
        setSelectedAbility(null);
        setSelectedItem(null);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${background})` }}>
            <AnimatePresence>
                {isFinished && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-stone-900/90 p-8 rounded-lg border-2 border-stone-600 text-center w-full max-w-md">
                            <h2 className="text-6xl font-medieval mb-4 text-amber-300">{isFinished === 'victory' ? 'Victory!' : 'Defeated'}</h2>
                            {isFinished === 'victory' && rewards && (
                                <div className="text-lg text-stone-300 mb-6 space-y-4">
                                    <p>Gained <span className="text-yellow-400 font-bold">{rewards.xp} XP</span>.</p>
                                    {rewards.loot.length > 0 && (
                                        <div>
                                            <h3 className="font-medieval text-2xl text-amber-200 mb-2">Loot Acquired</h3>
                                            <div className="grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-md border border-stone-700 max-h-48 overflow-y-auto justify-center">
                                                {rewards.loot.map(({ item, quantity }, index) => (
                                                    <div key={`${item.id}-${index}`} className="relative group flex justify-center">
                                                        <ItemSlot item={item} quantity={quantity} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button onClick={concludeCombat} className="px-6 py-2 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-lg font-medieval text-xl">
                               {isFinished === 'victory' ? 'Claim Spoils' : 'Continue'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-grow flex flex-col justify-between p-4">
                <div className="flex justify-center items-end gap-4">
                    {enemies.map(c => <CombatantDisplay key={c.id} combatant={c} isCurrentTurn={currentTurnId === c.id} onClick={() => isTargetValid(c) && handleTargetSelect(c.id)} isTargetable={isTargetValid(c)} />)}
                </div>
                <div className="flex justify-center items-end gap-4">
                     {party.map(c => <CombatantDisplay key={c.id} combatant={c} isCurrentTurn={currentTurnId === c.id} onClick={() => isTargetValid(c) && handleTargetSelect(c.id)} isTargetable={isTargetValid(c)} />)}
                </div>
            </div>

            <footer className="w-full p-2 bg-black/50 backdrop-blur-sm z-20 flex gap-2">
                 <div className="w-1/3 bg-black/40 rounded p-2 text-sm overflow-y-auto h-40">
                    {log.map(entry => (<p key={entry.id} className={cn("mb-1", { 'text-red-400': entry.type === 'damage', 'text-green-400': entry.type === 'heal', 'text-purple-300': entry.type === 'status', 'text-stone-400': entry.type === 'info', 'text-yellow-300 font-bold': entry.type === 'system', 'text-gray-500 italic': entry.type === 'miss'})}>{entry.message}</p>))}
                    <div ref={logEndRef} />
                </div>
                <div className="flex-grow bg-black/40 rounded p-2 h-40 flex">
                    {isPlayerTurn ? (
                        <div className="w-full grid grid-cols-[1fr_2fr] gap-2">
                            <div className="flex flex-col gap-1">
                                <button onClick={() => setPlayerAction({type: 'attack', isAwaitingTarget: true})} className={cn("flex items-center gap-2 p-2 rounded transition-colors", playerActionState.type === 'attack' ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}> <SwordIcon /> Attack </button>
                                <button onClick={() => handleCategorySelect('ability')} className={cn("flex items-center gap-2 p-2 rounded transition-colors", playerActionState.type === 'ability' ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}> <FistIcon /> Abilities </button>
                                <button onClick={() => handleCategorySelect('spell')} className={cn("flex items-center gap-2 p-2 rounded transition-colors", playerActionState.type === 'spell' ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}> <SpellbookIcon /> Spells </button>
                                <button onClick={() => handleCategorySelect('item')} className={cn("flex items-center gap-2 p-2 rounded transition-colors", playerActionState.type === 'item' ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}> <BagIcon /> Items </button>
                                <button onClick={() => playerChooseAction({ type: 'flee' })} className="flex items-center gap-2 p-2 rounded bg-stone-700 hover:bg-stone-600 mt-auto"> <RunIcon /> Flee </button>
                            </div>
                            <div className="bg-stone-900/50 rounded p-2 overflow-y-auto grid grid-cols-2 gap-2">
                                <AnimatePresence mode="wait">
                                    <motion.div key={playerActionState.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-2 grid grid-cols-2 gap-2 content-start">
                                    {playerActionState.type === 'spell' && spellQueries.map(query => {
                                        if (!query.data) return null;
                                        // FIX: Cast query.data to Spell to access its properties
                                        const spell = query.data as Spell;
                                        return <button key={spell.slug} onClick={() => { setSelectedSpell(spell!); setSelectedAbility(null); setSelectedItem(null); }} className={cn("text-left p-1 rounded transition-colors", selectedSpell?.slug === spell.slug ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}>{spell.name}</button>
                                    })}
                                    {playerActionState.type === 'item' && consumableItems.map(({ slot, index }) => ( <button key={index} onClick={() => { setSelectedItem({ slot, index }); setSelectedSpell(null); setSelectedAbility(null); }} className={cn("text-left p-1 rounded transition-colors", selectedItem?.index === index ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}>{slot.item.name} (x{slot.quantity})</button>))}
                                    {playerActionState.type === 'ability' && martialAbilities.map(ability => {
                                        return <button key={ability.id} onClick={() => { setSelectedAbility(ability); setSelectedSpell(null); setSelectedItem(null); }} className={cn("text-left p-1 rounded transition-colors", selectedAbility?.id === ability.id ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600')}>{ability.name}</button>
                                    })}
                                    </motion.div>
                                </AnimatePresence>
                                {playerActionState.isAwaitingTarget && <p className="col-span-2 text-center text-amber-300 animate-pulse">Select a target...</p>}
                            </div>
                        </div>
                    ) : (
                         <div className="w-full flex items-center justify-center text-xl font-medieval text-stone-400">
                           {currentTurnId ? `Waiting for ${combatants.find(c => c.id === currentTurnId)?.name}...` : 'Processing...'}
                        </div>
                    )}
                </div>
                <div className="w-1/4 bg-black/40 rounded p-2 text-sm h-40 flex flex-col">
                   <div className="flex-grow">
                        {selectedSpell && <SpellDetailsPanel spell={selectedSpell} />}
                        {selectedAbility && <AbilityDetailsPanel ability={selectedAbility} />}
                        {/* FIX: Corrected a prop type mismatch for the ItemDetailsPanel component.
                        The 'itemData' prop expects an object with 'item' and 'inventoryIndex' properties,
                        so we now construct this object from the 'selectedItem' state. */}
                        {selectedItem && <ItemDetailsPanel itemData={{ item: selectedItem.slot.item, inventoryIndex: selectedItem.index }} />}
                   </div>
                    <div className="mt-auto flex-shrink-0">
                        {selectedSpell && (
                            <Button onClick={() => handleActionSelect({type: 'spell', spellSlug: selectedSpell.slug, isAwaitingTarget: true})} disabled={player.stats.mana < selectedSpell.manaCost} className="w-full">Use</Button>
                        )}
                         {selectedAbility && (
                            <Button onClick={() => handleActionSelect({type: 'ability', abilityId: selectedAbility.id, isAwaitingTarget: true})} disabled={player.stats.stamina < selectedAbility.staminaCost} className="w-full">Use</Button>
                        )}
                         {selectedItem && (
                            <Button onClick={() => handleActionSelect({type: 'item', item: { item: selectedItem.slot.item, inventoryIndex: selectedItem.index }, isAwaitingTarget: true})} className="w-full">Use</Button>
                        )}
                   </div>
                </div>
            </footer>
        </div>
    );
};
