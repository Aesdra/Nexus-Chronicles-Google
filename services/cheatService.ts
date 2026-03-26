
import { useGameStore } from '../store/store';
import { formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';

/**
 * Processes a cheat code entered by the player.
 * @param code The secret word entered by the player.
 * @returns A message indicating the result of the cheat code.
 */
export const processCheatCode = (code: string): string => {
    const store = useGameStore.getState();
    const player = store.player;

    if (!player) return "No active player found.";

    const normalizedCode = code.trim().toUpperCase();

    switch (normalizedCode) {
        case 'MAMMON':
            // Grant 1000 Gold
            const currentCopper = totalCurrencyInCopper(player.currency);
            const newCurrency = formatCurrencyFromCopper(currentCopper + 100000); // 1000 gold in copper
            store.updatePlayer({ currency: newCurrency });
            return "The weight of gold fills your purse. Greed is good.";

        case 'EUREKA':
            // Grant Level Up XP
            store.gainXp(player.xpToNextLevel - player.xp);
            return "A sudden surge of understanding floods your mind. You feel stronger.";

        case 'AMBROSIA':
            // Full Restore
            store.updatePlayer({
                stats: {
                    ...player.stats,
                    hp: player.stats.maxHp,
                    mana: player.stats.maxMana,
                    stamina: player.stats.maxStamina
                }
            });
            return "Divine nectar revitalizes your body and soul.";

        case 'CHRONOS':
            // Reset Daily Actions
            useGameStore.setState(state => ({ 
                actionCounters: { ...state.actionCounters, performed_today: 0 } 
            }));
            return "Time rewinds slightly. The day feels fresh again.";

        default:
            return "The shadows remain silent. That word has no power here.";
    }
};
