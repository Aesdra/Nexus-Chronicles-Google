import React from 'react';
import { PlayerCharacter } from '../../types';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { cn } from '../../lib/utils';
import { useGameStore } from '../../store/store';
import { selectPlayer } from '../../store/selectors/playerSelectors';
import { selectKnownFactions } from '../../store/selectors/factionSelectors';

/**
 * A dedicated component pane for displaying detailed character information, including background
 * and faction standings. It now fetches all its data directly from the Zustand store using selectors,
 * making it a self-contained and decoupled UI module.
 */
export const DetailsPane: React.FC = React.memo(() => {
    const character = useGameStore(selectPlayer);
    const knownFactions = useGameStore(selectKnownFactions);

    if (!character) return null;

    return (
        <div className="p-2">
            <h4 className="font-medieval text-2xl text-amber-300 mb-4 border-b border-stone-600 pb-2">Personal Details</h4>
            <ul className="list-none space-y-3 text-lg">
                <li>
                    <span className="font-bold text-stone-400">Gender:</span>
                    <span className="text-amber-100 ml-2">{character.gender}</span>
                </li>
                <li>
                    <span className="font-bold text-stone-400">Sexual Orientation:</span>
                    <span className="text-amber-100 ml-2">{character.sexualOrientation}</span>
                </li>
                <li>
                    <span className="font-bold text-stone-400">Karma:</span>
                    <span className={cn("text-amber-100 ml-2", {
                        'text-green-400': character.karma > 0,
                        'text-red-400': character.karma < 0,
                    })}>{character.karma > 0 ? `+${character.karma}` : character.karma}</span>
                </li>
            </ul>

            {character.background && (
                <>
                    <h4 className="font-medieval text-2xl text-amber-300 mb-2 mt-6 border-b border-stone-600 pb-2">Background: {character.background.name}</h4>
                    <div className="text-gray-300 text-lg leading-relaxed space-y-4">
                        <p className="italic text-stone-400">{character.background.desc}</p>
                        <h5 className="font-medieval text-xl text-amber-200">{character.background.feature}</h5>
                        <MarkdownRenderer>{character.background.feature_desc}</MarkdownRenderer>
                    </div>
                </>
            )}

            {knownFactions.length > 0 && (
                 <>
                    <h4 className="font-medieval text-2xl text-amber-300 mb-2 mt-6 border-b border-stone-600 pb-2">Faction Standing</h4>
                    <ul className="list-none space-y-2 text-lg">
                        {knownFactions.map(({ id, name, reputation, rankName }) => (
                                    <li key={id} className="flex justify-between items-center bg-stone-800/30 p-2 rounded-md">
                                        <span className="text-stone-300">{name}</span>
                                        <div className="flex flex-col items-end">
                                            <span className={cn("font-bold", reputation > 0 ? "text-green-400" : "text-red-400")}>
                                                {reputation > 0 ? `+${reputation}` : reputation}
                                            </span>
                                            {rankName && <span className="text-xs text-amber-300 font-medieval">{rankName}</span>}
                                        </div>
                                    </li>
                                ))
                        }
                    </ul>
                 </>
            )}
        </div>
    );
});