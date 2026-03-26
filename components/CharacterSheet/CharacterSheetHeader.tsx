import React from 'react';
import { PlayerCharacter } from '../../types';

interface CharacterSheetHeaderProps {
    character: PlayerCharacter;
}

export const CharacterSheetHeader: React.FC<CharacterSheetHeaderProps> = React.memo(({ character }) => {
    return (
        <div className="md:col-span-1 flex flex-col items-center bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700">
            <div className="relative w-full h-80 bg-black/30 rounded mb-4 border-2 border-stone-600">
                {character.spriteUrl ? (
                    <img src={character.spriteUrl} alt={character.name} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-500">No Sprite</div>
                )}
            </div>
            <h3 className="font-medieval text-4xl text-amber-100">{character.name}</h3>
            <p className="text-amber-300 text-lg">{character.subRace?.name || character.race.name}</p>
            <p className="text-stone-300">{character.subClass?.name || character.characterClass.name}</p>
        </div>
    );
});