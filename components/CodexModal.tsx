import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../store/store';
import { Spell, Lore, LoreCategory, Creature, NPC, NPCData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useQueries } from '@tanstack/react-query';
import { getSpell } from '../services/dataService';
import { LORE } from '../data/lore';
import { CREATURES } from '../data/creatures';
import { NPCS } from '../data/npcs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BookIcon } from './icons/BookIcon';
import { SpellbookIcon } from './icons/SpellbookIcon';
import { BestiaryIcon } from './icons/BestiaryIcon';
import { CharactersIcon } from './icons/CharactersIcon';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

// --- HELPER HOOKS & COMPONENTS ---

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const getOrdinal = (n: number) => {
    if (n === 0) return "Cantrip";
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]) + " level";
};

type ActiveTab = 'spells' | 'lore' | 'bestiary' | 'characters';
type Entry = Spell | Lore | Creature | NPC;

// --- UI SUB-COMPONENTS ---

const DetailPanel: React.FC<{ selectedEntry: Entry | null }> = ({ selectedEntry }) => {
    if (!selectedEntry) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 text-center">
              <BookIcon />
              <p className="mt-4 font-medieval text-2xl">Select an entry to read.</p>
            </div>
        );
    }
    // Type guards to differentiate entries
    if ('slug' in selectedEntry && 'level' in selectedEntry) { // Spell
        const spell = selectedEntry;
        return (
            <div>
                <h3 className="font-medieval text-4xl text-amber-200">{spell.name}</h3>
                <p className="text-sm text-stone-400 italic mb-4">{getOrdinal(spell.level)} {spell.school}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-lg">
                    <div><strong className="text-stone-300">Casting Time:</strong> <span className="text-amber-100">{spell.casting_time}</span></div>
                    <div><strong className="text-stone-300">Range:</strong> <span className="text-amber-100">{spell.range}</span></div>
                    <div><strong className="text-stone-300">Components:</strong> <span className="text-amber-100">{spell.components}</span></div>
                    <div><strong className="text-stone-300">Duration:</strong> <span className="text-amber-100">{spell.duration}</span></div>
                </div>
                {(spell.ritual || spell.concentration) &&
                    <div className="mb-4 flex gap-4">
                        {spell.ritual && <span className="px-2 py-1 bg-blue-800/50 text-blue-300 rounded text-sm font-bold">Ritual</span>}
                        {spell.concentration && <span className="px-2 py-1 bg-purple-800/50 text-purple-300 rounded text-sm font-bold">Concentration</span>}
                    </div>
                }
                {spell.material && <p className="text-stone-400 italic mb-4"><strong>Materials:</strong> {spell.material}</p>}
                <div className="text-gray-300 text-lg leading-relaxed space-y-4 border-t border-stone-600 pt-4">
                    <MarkdownRenderer>{spell.desc}</MarkdownRenderer>
                    {spell.higher_level && <MarkdownRenderer>{"**At Higher Levels:** " + spell.higher_level}</MarkdownRenderer>}
                </div>
            </div>
        );
    } else if ('category' in selectedEntry) { // Lore
        const lore = selectedEntry;
        return (
            <div>
                <h3 className="font-medieval text-4xl text-amber-200 border-b-2 border-amber-800/50 pb-2 mb-4">{lore.title}</h3>
                <p className="text-stone-400 font-bold mb-4">{lore.category}</p>
                <div className="text-gray-300 text-lg leading-relaxed"><MarkdownRenderer>{lore.content}</MarkdownRenderer></div>
            </div>
        );
    } else if ('notes' in selectedEntry) { // Creature
        const creature = selectedEntry;
        return (
            <div>
                <h3 className="font-medieval text-4xl text-amber-200 mb-4">{creature.name}</h3>
                <img src={creature.imageUrl} alt={creature.name} className="w-full h-64 object-contain rounded-lg bg-black/20 border-2 border-stone-600 mb-4" />
                <div className="text-gray-300 text-lg leading-relaxed"><MarkdownRenderer>{creature.description}</MarkdownRenderer></div>
                <h4 className="font-medieval text-2xl text-amber-300 mt-6 border-t border-stone-600 pt-4">Loremaster's Notes</h4>
                <div className="text-gray-300 text-lg leading-relaxed italic"><MarkdownRenderer>{creature.notes}</MarkdownRenderer></div>
            </div>
        );
    } else if ('role' in selectedEntry) { // NPC
        const npc = selectedEntry;
         return (
            <div>
                <h3 className="font-medieval text-4xl text-amber-200 mb-2">{npc.name}</h3>
                <p className="text-stone-400 font-bold mb-4">{npc.role} - {npc.faction}</p>
                <img src={npc.imageUrl} alt={npc.name} className="w-full h-64 object-contain rounded-lg bg-black/20 border-2 border-stone-600 mb-4" />
                <div className="text-gray-300 text-lg leading-relaxed"><MarkdownRenderer>{npc.description}</MarkdownRenderer></div>
            </div>
        );
    }
    return null;
};

// --- MAIN MODAL COMPONENT ---

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  const { playerSpells, unlockedLoreIds, encounteredCreatureIds, encounteredNpcIds } = useGameStore((state) => ({
    playerSpells: state.player?.spells || [],
    unlockedLoreIds: state.unlockedLoreIds,
    encounteredCreatureIds: state.encounteredCreatureIds,
    encounteredNpcIds: state.encounteredNpcIds,
  }));
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('lore');
  const [selectedLoreCategory, setSelectedLoreCategory] = useState<LoreCategory | 'all'>('all');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const hasSpells = playerSpells.length > 0;
  const hasLore = unlockedLoreIds.length > 0;
  const hasCreatures = encounteredCreatureIds.length > 0;
  const hasNpcs = encounteredNpcIds.length > 0;

  useEffect(() => {
    if (isOpen) {
      setSelectedEntry(null);
      setSearchTerm('');
      if (hasLore) setActiveTab('lore');
      else if (hasSpells) setActiveTab('spells');
      else if (hasNpcs) setActiveTab('characters');
      else if (hasCreatures) setActiveTab('bestiary');
    }
  }, [isOpen, hasLore, hasSpells, hasNpcs, hasCreatures]);

  const spellQueries = useQueries({
    queries: playerSpells.map(slug => ({
      queryKey: ['spell', slug],
      queryFn: () => getSpell(slug),
      staleTime: Infinity,
    })),
  });
  
  const unlockedLore = useMemo(() => LORE.filter(entry => unlockedLoreIds.includes(entry.id)), [unlockedLoreIds]);
  const unlockedCreatures = useMemo(() => CREATURES.filter(entry => encounteredCreatureIds.includes(entry.id)), [encounteredCreatureIds]);
  const unlockedNpcs = useMemo(() => Object.values(NPCS).filter(entry => encounteredNpcIds.includes(entry.id)), [encounteredNpcIds]);

  const handleClose = () => {
    setSelectedEntry(null);
    setSearchTerm('');
    onClose();
  };
  
  const filteredLore = useMemo(() => unlockedLore.filter(entry => 
      (selectedLoreCategory === 'all' || entry.category === selectedLoreCategory) &&
      (debouncedSearchTerm === '' || entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  ), [unlockedLore, selectedLoreCategory, debouncedSearchTerm]);

  const filteredCreatures = useMemo(() => unlockedCreatures.filter(entry => 
      debouncedSearchTerm === '' || entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ), [unlockedCreatures, debouncedSearchTerm]);
  
  const filteredNpcs = useMemo(() => unlockedNpcs.filter(entry => 
      debouncedSearchTerm === '' || entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ), [unlockedNpcs, debouncedSearchTerm]);

  const filteredSpellQueries = useMemo(() => spellQueries.filter(query => 
      query.data && (debouncedSearchTerm === '' || (query.data as Spell).name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  ), [spellQueries, debouncedSearchTerm]);


  const renderList = () => {
    switch (activeTab) {
        case 'spells':
            const spellsByLevel = filteredSpellQueries.reduce((acc, query) => {
                if(query.data) {
                    // FIX: Cast query.data to Spell to access its properties
                    const level = (query.data as Spell).level;
                    if (!acc[level]) acc[level] = [];
                    acc[level].push(query);
                }
                return acc;
              }, {} as Record<number, typeof spellQueries>);
        
            return (
                <div className="space-y-4">
                    {Object.keys(spellsByLevel).sort((a,b) => parseInt(a) - parseInt(b)).map(levelStr => {
                    const level = parseInt(levelStr, 10);
                    return (
                        <div key={level}>
                            <h3 className="font-medieval text-xl text-amber-400 border-b border-stone-600 mb-2">{getOrdinal(level)}</h3>
                            <ul className="space-y-1">
                            {spellsByLevel[level].map((query, index) => (
                                <li key={(query.data as Spell)?.slug || index}>
                                <Button
                                    onClick={() => query.data && setSelectedEntry(query.data as Spell)}
                                    disabled={query.isLoading}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-between items-center',
                                        // FIX: Use type guard to safely access properties on the 'selectedEntry' union type.
                                        selectedEntry && 'slug' in selectedEntry && selectedEntry.slug === (query.data as Spell)?.slug && 'bg-amber-800/50',
                                    )}
                                >
                                    <span>{(query.data as Spell)?.name || '...'}</span>
                                    {query.isLoading && <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>}
                                </Button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    );
                    })}
                </div>
            );
        case 'lore':
            const loreCategories: LoreCategory[] = ['World', 'Factions', 'History', 'Mechanics'];
            return (
                <>
                    <nav className="flex flex-wrap gap-2 border-b border-stone-600 pb-3 mb-3">
                        <Button onClick={() => setSelectedLoreCategory('all')} size="sm" variant={selectedLoreCategory === 'all' ? 'default' : 'secondary'}>All</Button>
                        {loreCategories.map(cat => (
                           unlockedLore.some(l => l.category === cat) && <Button key={cat} onClick={() => setSelectedLoreCategory(cat)} size="sm" variant={selectedLoreCategory === cat ? 'default' : 'secondary'}>{cat}</Button>
                        ))}
                    </nav>
                    <ul className="space-y-1">
                        {filteredLore.map(entry => (
                            // FIX: Use type guard to safely access properties on the 'selectedEntry' union type.
                            <li key={entry.id}><Button variant="ghost" onClick={() => setSelectedEntry(entry)} className={cn('w-full justify-start', selectedEntry && 'id' in selectedEntry && selectedEntry.id === entry.id && 'bg-amber-800/50')}>{entry.title}</Button></li>
                        ))}
                        {filteredLore.length === 0 && <li className="p-2 text-stone-500">No entries match your search.</li>}
                    </ul>
                </>
            );
        case 'bestiary':
            return (
                <ul className="space-y-1">
                    {filteredCreatures.map(entry => (
                        // FIX: Use type guard to safely access properties on the 'selectedEntry' union type.
                        <li key={entry.id}><Button variant="ghost" onClick={() => setSelectedEntry(entry)} className={cn('w-full justify-start', selectedEntry && 'id' in selectedEntry && selectedEntry.id === entry.id && 'bg-amber-800/50')}>{entry.name}</Button></li>
                    ))}
                    {filteredCreatures.length === 0 && <li className="p-2 text-stone-500">No entries match your search.</li>}
                </ul>
            );
        case 'characters':
             return (
                <ul className="space-y-1">
                    {filteredNpcs.map(entry => (
                        // FIX: Use type guard to safely access properties on the 'selectedEntry' union type.
                        <li key={entry.id}><Button variant="ghost" onClick={() => setSelectedEntry(entry as NPCData)} className={cn('w-full justify-start', selectedEntry && 'id' in selectedEntry && selectedEntry.id === entry.id && 'bg-amber-800/50')}>{entry.name}</Button></li>
                    ))}
                    {filteredNpcs.length === 0 && <li className="p-2 text-stone-500">No entries match your search.</li>}
                </ul>
            );
    }
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={handleClose} title="Codex" containerClassName="max-w-5xl h-[90vh]">
        <div className="p-6 flex gap-6 h-full">
            {/* Left Panel - Navigation */}
            <div className="w-1/3 flex flex-col bg-stone-800/40 p-4 rounded-lg border-2 border-stone-700">
            <div role="tablist" aria-label="Codex Sections" className="flex flex-wrap gap-1 border-b border-stone-600 pb-3 mb-3">
                {hasLore && <Button variant="ghost" size="icon" title="Lore" onClick={() => { setActiveTab('lore'); setSelectedEntry(null); setSearchTerm(''); }} className={cn(activeTab === 'lore' ? 'bg-stone-700/60 text-amber-300' : 'text-stone-500')}><BookIcon /></Button>}
                {hasSpells && <Button variant="ghost" size="icon" title="Spells" onClick={() => { setActiveTab('spells'); setSelectedEntry(null); setSearchTerm(''); }} className={cn(activeTab === 'spells' ? 'bg-stone-700/60 text-amber-300' : 'text-stone-500')}><SpellbookIcon /></Button>}
                {hasNpcs && <Button variant="ghost" size="icon" title="Characters" onClick={() => { setActiveTab('characters'); setSelectedEntry(null); setSearchTerm(''); }} className={cn(activeTab === 'characters' ? 'bg-stone-700/60 text-amber-300' : 'text-stone-500')}><CharactersIcon /></Button>}
                {hasCreatures && <Button variant="ghost" size="icon" title="Bestiary" onClick={() => { setActiveTab('bestiary'); setSelectedEntry(null); setSearchTerm(''); }} className={cn(activeTab === 'bestiary' ? 'bg-stone-700/60 text-amber-300' : 'text-stone-500')}><BestiaryIcon /></Button>}
            </div>
                <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-900 border-2 border-stone-600 rounded p-2 mb-3 text-amber-100 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="flex-grow overflow-y-auto pr-2">
                {renderList()}
            </div>
            </div>

            {/* Right Panel - Details */}
            <div id="codex-content" role="tabpanel" aria-labelledby={`codex-tab-${activeTab}`} className="w-2/3 bg-stone-800/40 p-6 rounded-lg border-2 border-stone-700 overflow-y-auto">
            <DetailPanel selectedEntry={selectedEntry} />
            </div>
        </div>
    </ModalFrame>
  );
};