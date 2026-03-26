
import React, { useState, useEffect } from 'react';
import { ModalFrame } from './ui/ModalFrame';
import { useModalStore } from '../store/modalStore';
import { useGameStore } from '../store/store';
import { Button } from './ui/Button';
import { GoldCoinIcon } from './icons/GoldCoinIcon';
import { formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Die: React.FC<{ value: number; isRolling: boolean; selected: boolean; onClick: () => void; disabled: boolean }> = ({ value, isRolling, selected, onClick, disabled }) => {
    return (
        <motion.div
            onClick={!disabled ? onClick : undefined}
            className={`w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center border-4 shadow-lg cursor-pointer transition-all ${
                selected ? 'border-amber-500 ring-2 ring-amber-300 scale-105' : 'border-stone-400'
            } ${disabled ? 'opacity-50 cursor-default' : 'hover:bg-stone-100'}`}
            animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 0.8, 1.2, 1] } : {}}
            transition={isRolling ? { duration: 0.5, repeat: Infinity } : {}}
        >
            <span className="text-3xl font-bold text-stone-900">{isRolling ? '?' : value}</span>
        </motion.div>
    );
};

export const DiceGameModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { diceNpc } = useModalStore();
    const { player, updatePlayer } = useGameStore();
    const [bet, setBet] = useState(10);
    const [playerDice, setPlayerDice] = useState<number[]>([1, 1, 1]);
    const [npcDice, setNpcDice] = useState<number[]>([1, 1, 1]);
    const [gameState, setGameState] = useState<'betting' | 'rolling' | 'reroll' | 'npc_turn' | 'result'>('betting');
    const [selectedDice, setSelectedDice] = useState<boolean[]>([false, false, false]);
    const [message, setMessage] = useState("Place your bet!");

    // Helper to calculate score
    const calculateScore = (dice: number[]) => {
        // Triples (Instant Win x3 logic handled in result phase)
        if (dice[0] === dice[1] && dice[1] === dice[2]) return 1000 + dice[0]; 
        // Straights (Instant Win x2 logic handled in result phase)
        const sorted = [...dice].sort();
        if ((sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) || (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6)) return 500 + dice.reduce((a, b) => a + b, 0);
        
        return dice.reduce((a, b) => a + b, 0);
    };

    const rollDice = (count: number) => Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);

    const handleStartGame = () => {
        if (!player) return;
        const playerCopper = totalCurrencyInCopper(player.currency);
        if (playerCopper < bet * 100) {
            setMessage("Not enough gold!");
            return;
        }
        
        // Deduct bet immediately (escrow)
        updatePlayer({ currency: formatCurrencyFromCopper(playerCopper - (bet * 100)) });
        
        setGameState('rolling');
        setMessage("Rolling the bones...");
        
        setTimeout(() => {
            setPlayerDice(rollDice(3));
            setNpcDice(rollDice(3)); // Hidden for now? Or visible? Let's make visible for tension.
            setGameState('reroll');
            setMessage("Select dice to re-roll (Risk it?) or Stand.");
        }, 1000);
    };

    const handleReroll = () => {
        setGameState('rolling');
        setMessage("Rerolling...");
        setTimeout(() => {
            const newDice = [...playerDice];
            if (selectedDice[0]) newDice[0] = rollDice(1)[0];
            if (selectedDice[1]) newDice[1] = rollDice(1)[0];
            if (selectedDice[2]) newDice[2] = rollDice(1)[0];
            setPlayerDice(newDice);
            setSelectedDice([false, false, false]);
            setGameState('npc_turn');
            handleNpcTurn(newDice);
        }, 800);
    };

    const handleStand = () => {
        setGameState('npc_turn');
        handleNpcTurn(playerDice);
    };

    const handleNpcTurn = (finalPlayerDice: number[]) => {
        setMessage(`${diceNpc?.name} is thinking...`);
        setTimeout(() => {
            // Simple AI: NPC rerolls if score is low (< 10) and no special combo
            const npcScore = calculateScore(npcDice);
            if (npcScore < 10 && npcScore < 500) {
                setMessage(`${diceNpc?.name} chooses to reroll...`);
                // Reroll lowest die
                const minVal = Math.min(...npcDice);
                const idx = npcDice.indexOf(minVal);
                const newNpcDice = [...npcDice];
                newNpcDice[idx] = rollDice(1)[0];
                setNpcDice(newNpcDice);
            } else {
                setMessage(`${diceNpc?.name} stands.`);
            }
            
            setTimeout(() => determineWinner(finalPlayerDice), 1000);
        }, 1500);
    };

    const determineWinner = (pDice: number[]) => {
        const pScore = calculateScore(pDice);
        const nScore = calculateScore(npcDice); // Using current state npcDice might be stale in closure? No, state update triggers re-render, but here we need latest.
        // Actually, since handleNpcTurn updates state, we should probably pass the new NPC dice or rely on a useEffect. 
        // For simplicity, let's assume the state update in handleNpcTurn propagates or we calculate logic here.
        // FIX: The state update setNpcDice inside handleNpcTurn won't be reflected immediately in npcDice variable in this scope.
        // We need to calculate winner in a useEffect or pass the value.
        
        // Let's refactor slightly to separate "resolution".
        setGameState('result');
    };

    // Effect to handle result calculation when state changes to 'result'
    useEffect(() => {
        if (gameState === 'result' && player) {
            const pScore = calculateScore(playerDice);
            const nScore = calculateScore(npcDice);
            
            let winnings = 0;
            let resultMsg = "";

            if (pScore > nScore) {
                // Win
                let multiplier = 2; // 1 (bet back) + 1 (win)
                if (pScore >= 1000) multiplier = 4; // Triple win (3x profit + bet back)
                else if (pScore >= 500) multiplier = 3; // Straight win (2x profit + bet back)
                
                winnings = bet * multiplier;
                resultMsg = `You won! (+${winnings - bet} GP)`;
                const currentCopper = totalCurrencyInCopper(player.currency);
                updatePlayer({ currency: formatCurrencyFromCopper(currentCopper + (winnings * 100)) });
            } else if (pScore < nScore) {
                resultMsg = "You lost.";
            } else {
                // Tie - Push (return bet)
                resultMsg = "It's a draw. Bet returned.";
                const currentCopper = totalCurrencyInCopper(player.currency);
                updatePlayer({ currency: formatCurrencyFromCopper(currentCopper + (bet * 100)) });
            }
            setMessage(resultMsg);
        }
    }, [gameState, playerDice, npcDice]); // Dependencies ensure we have latest dice

    const toggleDieSelection = (idx: number) => {
        if (gameState !== 'reroll') return;
        const newSel = [...selectedDice];
        newSel[idx] = !newSel[idx];
        setSelectedDice(newSel);
    };

    if (!player || !diceNpc) return null;

    return (
        <ModalFrame isOpen={isOpen} onClose={onClose} title="Gambit of Fate" containerClassName="max-w-lg">
            <div className="p-6 text-center">
                <div className="mb-4">
                    <h3 className="font-medieval text-xl text-amber-200">Opponent: {diceNpc.name}</h3>
                    <p className="text-stone-400 text-sm h-6">{message}</p>
                </div>

                {/* NPC Area */}
                <div className="bg-black/30 p-4 rounded-lg mb-4 border border-stone-700">
                    <div className="flex justify-center gap-4">
                        {npcDice.map((val, i) => (
                            <Die key={i} value={val} isRolling={gameState === 'rolling'} selected={false} onClick={() => {}} disabled={true} />
                        ))}
                    </div>
                    {gameState === 'result' && <p className="mt-2 text-stone-500 font-bold">Score: {calculateScore(npcDice) >= 500 ? 'Special!' : calculateScore(npcDice)}</p>}
                </div>

                {/* Player Area */}
                <div className="bg-black/30 p-4 rounded-lg mb-6 border border-stone-700">
                    <div className="flex justify-center gap-4">
                        {playerDice.map((val, i) => (
                            <Die 
                                key={i} 
                                value={val} 
                                isRolling={gameState === 'rolling'} 
                                selected={selectedDice[i]} 
                                onClick={() => toggleDieSelection(i)}
                                disabled={gameState !== 'reroll'}
                            />
                        ))}
                    </div>
                    {gameState === 'reroll' && <p className="text-xs text-stone-400 mt-2">Click dice to re-roll (Risk)</p>}
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3">
                    {gameState === 'betting' && (
                        <div className="flex flex-col gap-3 items-center">
                            <div className="flex items-center gap-4">
                                <Button onClick={() => setBet(b => Math.max(5, b - 5))}>-</Button>
                                <span className="font-bold text-2xl text-yellow-500 w-24">{bet} GP</span>
                                <Button onClick={() => setBet(b => b + 5)}>+</Button>
                            </div>
                            <Button onClick={handleStartGame} className="w-full bg-amber-700 text-white font-medieval text-xl">Roll!</Button>
                        </div>
                    )}

                    {gameState === 'reroll' && (
                        <div className="flex gap-4">
                            <Button onClick={handleReroll} className="flex-1 bg-stone-600" disabled={!selectedDice.some(Boolean)}>Re-Roll Selected</Button>
                            <Button onClick={handleStand} className="flex-1 bg-green-700">Stand</Button>
                        </div>
                    )}

                    {gameState === 'result' && (
                        <div className="flex gap-4">
                            <Button onClick={() => { setGameState('betting'); setSelectedDice([false,false,false]); setMessage("Place your bet!"); }} className="flex-1">Play Again</Button>
                            <Button onClick={onClose} variant="secondary" className="flex-1">Leave</Button>
                        </div>
                    )}
                </div>
            </div>
        </ModalFrame>
    );
};
