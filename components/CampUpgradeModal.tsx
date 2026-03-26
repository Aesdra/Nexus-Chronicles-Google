
import React from 'react';
import { ModalFrame } from './ui/ModalFrame';
import { useGameStore } from '../store/store';
import { CAMP_UPGRADES } from '../data/campUpgrades';
import { Button } from './ui/Button';
import { formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';
import { GoldCoinIcon } from './icons/GoldCoinIcon';

interface CampUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CampUpgradeModal: React.FC<CampUpgradeModalProps> = ({ isOpen, onClose }) => {
    const { player, campUpgrades, unlockCampUpgrade } = useGameStore();

    if (!player) return null;

    const currentCopper = totalCurrencyInCopper(player.currency);

    const handlePurchase = (upgradeId: string, cost: number) => {
        unlockCampUpgrade(upgradeId);
    };

    return (
        <ModalFrame isOpen={isOpen} onClose={onClose} title="Camp Improvements" containerClassName="max-w-4xl h-[80vh]">
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 bg-black/30 p-4 rounded-lg border border-stone-600">
                    <p className="text-stone-300">
                        Invest in the Crimson Blades encampment. Upgrades provide benefits when resting.
                    </p>
                    <div className="flex items-center gap-2 bg-stone-800 px-3 py-1 rounded border border-stone-500">
                        <span className="text-sm text-stone-400">Funds:</span>
                        <GoldCoinIcon className="text-yellow-500 w-5 h-5" />
                        <span className="font-bold text-amber-100">{player.currency.gp} GP</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                    {CAMP_UPGRADES.map(upgrade => {
                        const isUnlocked = campUpgrades.includes(upgrade.id);
                        const canAfford = currentCopper >= upgrade.cost * 100;

                        return (
                            <div 
                                key={upgrade.id} 
                                className={`flex flex-col p-4 rounded-lg border-2 transition-all ${
                                    isUnlocked 
                                    ? 'bg-green-900/20 border-green-600/50' 
                                    : 'bg-stone-800/40 border-stone-600'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-medieval text-xl ${isUnlocked ? 'text-green-300' : 'text-amber-200'}`}>
                                        {upgrade.name}
                                    </h3>
                                    {isUnlocked && <span className="text-xs font-bold text-green-400 bg-green-900/40 px-2 py-1 rounded border border-green-700">OWNED</span>}
                                </div>
                                
                                <p className="text-stone-300 text-sm mb-4 flex-grow">{upgrade.description}</p>
                                
                                <div className="bg-black/20 p-2 rounded mb-4">
                                    <p className="text-xs text-stone-400 font-bold uppercase mb-1">Effect</p>
                                    <p className="text-sm text-amber-100 italic">{upgrade.effectDescription}</p>
                                </div>

                                <div className="mt-auto">
                                    {isUnlocked ? (
                                        <Button disabled className="w-full bg-stone-700/50 text-stone-400 border-stone-600 cursor-default">
                                            Constructed
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={() => handlePurchase(upgrade.id, upgrade.cost)}
                                            disabled={!canAfford}
                                            className={`w-full font-medieval text-lg ${
                                                canAfford 
                                                ? 'bg-amber-700 hover:bg-amber-600 text-white border-amber-500' 
                                                : 'bg-red-900/30 text-red-300 border-red-800/50 opacity-50 cursor-not-allowed'
                                            }`}
                                        >
                                            {canAfford ? `Build (${upgrade.cost} GP)` : `Need ${upgrade.cost} GP`}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ModalFrame>
    );
};
