import React, { useState } from 'react';
import { Spell } from '../../types';
import { useQueries } from '@tanstack/react-query';
import { getSpell } from '../../services/dataService';
import { cn } from '../../lib/utils';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { BookIcon } from '../icons/BookIcon';

interface SpellsPaneProps {
    spellSlugs: string[];
}

const getOrdinal = (n: number) => {
    if (n === 0) return "Cantrip";
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]) + " level";
};

export const SpellsPane: React.FC<SpellsPaneProps> = React.memo(({ spellSlugs }) => {
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

    const spellQueries = useQueries({
        queries: (spellSlugs || []).map(slug => ({
            queryKey: ['spell', slug],
            queryFn: () => getSpell(slug),
            staleTime: Infinity,
            gcTime: Infinity,
            enabled: !!spellSlugs && spellSlugs.length > 0,
        })),
    });

    const spellsByLevel = spellQueries.reduce((acc, query) => {
        if (query.data) {
            const level = query.data.level;
            if (!acc[level]) acc[level] = [];
            acc[level].push(query);
        }
        return acc;
    }, {} as Record<number, typeof spellQueries>);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full p-2">
            <div className="md:col-span-1 overflow-y-auto space-y-4 pr-2">
                {Object.keys(spellsByLevel).sort().map(levelStr => {
                    const level = parseInt(levelStr, 10);
                    return (
                        <div key={level}>
                            <h3 className="font-medieval text-lg text-amber-400 border-b border-stone-600 mb-2">{getOrdinal(level)}</h3>
                            <ul className="space-y-1">
                                {spellsByLevel[level].map((query, index) => (
                                    // FIX: Use index as a fallback key to avoid errors on queryKey access.
                                    <li key={query.data?.slug || index}>
                                        <button
                                            onClick={() => query.data && setSelectedSpell(query.data)}
                                            disabled={query.isLoading}
                                            className={cn(
                                                'w-full text-left p-2 rounded transition-colors text-amber-200 hover:bg-stone-700/80 flex justify-between items-center',
                                                selectedSpell?.slug === query.data?.slug && 'bg-amber-800/50',
                                                'disabled:opacity-50'
                                            )}
                                        >
                                            <span>{query.data?.name || '...'}</span>
                                            {query.isLoading && <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
            <div className="md:col-span-2 overflow-y-auto pl-4 border-l border-stone-600">
                {!selectedSpell ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-500 text-center">
                        <BookIcon />
                        <p className="mt-4 font-medieval text-xl">Select a spell to see its details.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="font-medieval text-3xl text-amber-200">{selectedSpell.name}</h3>
                        <p className="text-sm text-stone-400 italic mb-4">{getOrdinal(selectedSpell.level)} {selectedSpell.school}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-md">
                            <div><strong className="text-stone-300">Casting Time:</strong> <span className="text-amber-100">{selectedSpell.casting_time}</span></div>
                            <div><strong className="text-stone-300">Range:</strong> <span className="text-amber-100">{selectedSpell.range}</span></div>
                            <div><strong className="text-stone-300">Components:</strong> <span className="text-amber-100">{selectedSpell.components}</span></div>
                            <div><strong className="text-stone-300">Duration:</strong> <span className="text-amber-100">{selectedSpell.duration}</span></div>
                        </div>
                        {selectedSpell.material && <p className="text-stone-400 italic mb-4"><strong>Materials:</strong> {selectedSpell.material}</p>}
                        <div className="text-gray-300 text-lg leading-relaxed space-y-4 border-t border-stone-600 pt-4">
                            <MarkdownRenderer>{selectedSpell.desc}</MarkdownRenderer>
                            {selectedSpell.higher_level && <MarkdownRenderer>{"**At Higher Levels:** " + selectedSpell.higher_level}</MarkdownRenderer>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});