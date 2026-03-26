import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Background } from '../../types';
import { cn } from '../../lib/utils';
import { SKILL_PROFICIENCIES, TOOL_PROFICIENCIES, LANGUAGES } from '../../data/character-options';
import { backButtonVariants, buttonVariants, stepVariants } from './variants';
import { useCharacterCreationStore } from '../../store/characterCreationStore';

interface CustomBackgroundStepProps {
    backgroundFeatures: { slug: string; name: string; desc: string }[];
}

/**
 * A modular step component for creating a custom character background.
 * It is now fully controlled by the `useCharacterCreationStore`, reading and writing
 * all custom background data directly to the central store.
 */
export const CustomBackgroundStep: React.FC<CustomBackgroundStepProps> = ({ backgroundFeatures }) => {
    const { 
        characterInProgress,
        setCustomBackgroundName,
        setCustomBackgroundDesc,
        setCustomBackgroundSkills,
        setCustomBackgroundToolsLangs,
        setCustomBackgroundFeatureSlug,
        selectBackground,
        goToStep,
    } = useCharacterCreationStore();
    
    const { 
      customBgName, customBgDesc, customBgSkills, customBgToolsLangs, customBgFeatureSlug 
    } = characterInProgress;

    const [toolLangTab, setToolLangTab] = useState<'tools' | 'languages'>('tools');

    const isCustomBgValid = useMemo(() => 
        customBgName.trim() !== '' &&
        customBgDesc.trim() !== '' &&
        customBgSkills.length === 2 &&
        customBgToolsLangs.length === 2 &&
        !!customBgFeatureSlug,
      [customBgName, customBgDesc, customBgSkills, customBgToolsLangs, customBgFeatureSlug]);

    const handleConfirmCustomBackground = () => {
        if (!isCustomBgValid) return;

        const featureData = backgroundFeatures.find(f => f.slug === customBgFeatureSlug);
        if (!featureData) return;
        
        const tools = customBgToolsLangs.filter(item => TOOL_PROFICIENCIES.includes(item));
        const langs = customBgToolsLangs.filter(item => LANGUAGES.includes(item));

        const customBg: Background = {
            slug: `custom-${customBgName.toLowerCase().replace(/\s+/g, '-')}`,
            name: customBgName,
            desc: customBgDesc,
            skill_proficiencies: customBgSkills.join(', '),
            tool_proficiencies: tools.join(', '),
            languages: langs.join(', '),
            equipment: "A set of common clothes, an explorer's pack, a personal trinket, and a pouch with 10 gp.",
            feature: featureData.name,
            feature_desc: featureData.desc,
        };
        selectBackground(customBg);
    };

    const selectedFeature = backgroundFeatures.find(f => f.slug === customBgFeatureSlug);

    return (
        <motion.div key="step3.5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="text-4xl font-medieval text-amber-300 mb-6 text-center">Create Your Background</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto pr-2">
                {/* Left Column: Flavor */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="customBgName" className="block mb-1 font-medieval text-amber-300 text-lg">Background Name</label>
                        <input id="customBgName" type="text" value={customBgName} onChange={e => setCustomBackgroundName(e.target.value)} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="e.g., Disgraced Knight, Rift Survivor" />
                    </div>
                    <div>
                        <label htmlFor="customBgDesc" className="block mb-1 font-medieval text-amber-300 text-lg">Description</label>
                        <textarea id="customBgDesc" value={customBgDesc} onChange={e => setCustomBackgroundDesc(e.target.value)} rows={3} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")} placeholder="A short story about your character's past." />
                    </div>
                    <div>
                        <label htmlFor="customBgFeature" className="block mb-1 font-medieval text-amber-300 text-lg">Feature</label>
                        <select id="customBgFeature" value={customBgFeatureSlug} onChange={e => setCustomBackgroundFeatureSlug(e.target.value)} className={cn("bg-stone-800 border-2 border-stone-600 rounded p-2 w-full focus:ring-amber-500 focus:border-amber-500")}>
                            {backgroundFeatures.map(f => <option key={f.slug} value={f.slug}>{f.name}</option>)}
                        </select>
                        {selectedFeature && <p className="text-sm text-stone-400 mt-2 p-2 bg-black/20 rounded">{selectedFeature.desc}</p>}
                    </div>
                </div>
                {/* Right Column: Mechanics */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medieval text-amber-300 text-lg">Skill Proficiencies (Choose 2)</h3>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {SKILL_PROFICIENCIES.map(skill => (
                                <button type="button" key={skill} onClick={() => setCustomBackgroundSkills(customBgSkills.includes(skill) ? customBgSkills.filter(s => s !== skill) : customBgSkills.length < 2 ? [...customBgSkills, skill] : customBgSkills)} className={cn("p-2 text-sm rounded border", customBgSkills.includes(skill) ? 'bg-amber-600 border-amber-400 text-white' : 'bg-stone-700 border-stone-600 hover:bg-stone-600')}>
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medieval text-amber-300 text-lg">Tool & Language Proficiencies</h3>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-stone-400 text-sm">You may choose any combination of two.</p>
                            <p className="text-amber-300 font-bold text-sm">Choices remaining: {2 - customBgToolsLangs.length}</p>
                        </div>
                        
                        <div className="flex border-b border-stone-600 mb-2">
                            <button type="button" onClick={() => setToolLangTab('tools')} className={cn('flex-1 py-1 font-medieval', toolLangTab === 'tools' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-500 hover:text-amber-200')}>Tools</button>
                            <button type="button" onClick={() => setToolLangTab('languages')} className={cn('flex-1 py-1 font-medieval', toolLangTab === 'languages' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-500 hover:text-amber-200')}>Languages</button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                            { (toolLangTab === 'tools' ? TOOL_PROFICIENCIES : LANGUAGES).map(item => (
                                <button
                                    type="button"
                                    key={item}
                                    onClick={() => setCustomBackgroundToolsLangs(customBgToolsLangs.includes(item) ? customBgToolsLangs.filter(i => i !== item) : customBgToolsLangs.length < 2 ? [...customBgToolsLangs, item] : customBgToolsLangs)}
                                    className={cn(
                                        "p-2 text-sm rounded border",
                                        customBgToolsLangs.includes(item)
                                            ? 'bg-amber-600 border-amber-400 text-white'
                                            : 'bg-stone-700 border-stone-600 hover:bg-stone-600'
                                    )}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="mt-2 text-sm text-stone-300">
                            <span className="font-bold">Selected:</span> {customBgToolsLangs.join(', ') || 'None'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <motion.button type="button" variants={backButtonVariants} whileHover="hover" whileTap="tap" onClick={() => goToStep(3)} className="text-amber-300 font-medieval">Back to Backgrounds</motion.button>
                <motion.button type="button" variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleConfirmCustomBackground} disabled={!isCustomBgValid} className="px-6 py-2 bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 font-bold rounded-lg border-2 border-stone-600 hover:border-amber-400 font-medieval disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirm Custom Background
                </motion.button>
            </div>
        </motion.div>
    );
};
