import React from 'react';
import { Spell } from '../types';

interface SpellDetailsPanelProps {
    spell: Spell;
}

export const SpellDetailsPanel: React.FC<SpellDetailsPanelProps> = ({ spell }) => {

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