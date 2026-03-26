
import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlayerCharacter, Race, CharacterClass, SubRace, SubClass, Stat, Background } from '../types';
import { INVENTORY_SIZE } from '../constants';
import { generateCharacterSprite } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getBackgrounds } from '../services/dataService';
import { SKILL_PROFICIENCIES, TOOL_PROFICIENCIES, LANGUAGES } from '../data/character-options';
import { useCharacterCreationStore } from '../store/characterCreationStore';

// Import modular step components
import { RaceSelectionStep } from '../components/CharacterCreation/RaceSelectionStep';
import { ClassSelectionStep } from '../components/CharacterCreation/ClassSelectionStep';
import { BackgroundSelectionStep } from '../components/CharacterCreation/BackgroundSelectionStep';
import { CustomBackgroundStep } from '../components/CharacterCreation/CustomBackgroundStep';
import { AttributeAssignmentStep } from '../components/CharacterCreation/AttributeAssignmentStep';
import { AppearanceDetailsStep } from '../components/CharacterCreation/AppearanceDetailsStep';
import { NamingStep } from '../components/CharacterCreation/NamingStep';
import { SummaryStep } from '../components/CharacterCreation/SummaryStep';


interface CharacterCreationScreenProps {
  onCharacterCreated: (character: PlayerCharacter) => void;
  onBackToMenu: () => void;
}

export interface FormValues {
    name: string;
    age: number;
    height: number;
    eyeColor: string;
    skinColor: string;
    hairColor: string;
    hairStyle: string;
    hasBeard: boolean;
    gender: string;
    sexualOrientation: string;
    scars: string;
    tattoos: string;
    accessories: string;
}

const formatHeight = (inches: number) => {
    return `${Math.floor(inches / 12)}' ${inches % 12}"`;
};

/**
 * Manages the multi-step character creation process. This component has been refactored
 * to act as a simple "orchestrator". All complex state related to the character creation
 * wizard is now managed by the dedicated `useCharacterCreationStore`.
 *
 * This component's responsibilities are now:
 * - To read the current `step` from the store and render the appropriate step component.
 * - To manage the `react-hook-form` instance for detailed text inputs (appearance/naming).
 * - To combine the data from the form and the store upon final submission to create the character.
 */
export const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onCharacterCreated, onBackToMenu }) => {
  const { 
    step,
    characterInProgress,
    setCustomBackgroundFeatureSlug,
    resetCreation,
  } = useCharacterCreationStore();
  const { race: selectedRace, characterClass: selectedClass } = characterInProgress;

  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: backgrounds, isLoading: isLoadingBackgrounds } = useQuery({
      queryKey: ['backgrounds'],
      queryFn: getBackgrounds,
      staleTime: Infinity,
  });
  
  useEffect(() => {
    if (backgrounds && backgrounds.length > 0 && !characterInProgress.customBgFeatureSlug) {
      setCustomBackgroundFeatureSlug(backgrounds[0].slug);
    }
  }, [backgrounds, characterInProgress.customBgFeatureSlug, setCustomBackgroundFeatureSlug]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
        name: '',
        age: 30,
        height: 68,
        eyeColor: '',
        skinColor: '',
        hairColor: '',
        hairStyle: 'Short and practical',
        hasBeard: false,
        gender: 'Male',
        sexualOrientation: 'Undefined',
        scars: '',
        tattoos: '',
        accessories: '',
    }
  });

  useEffect(() => {
    if (selectedRace) {
        const { customizationOptions: opts } = selectedRace;
        const typicalHeight = Math.round((opts.heightRange.min + opts.heightRange.max) / 2);
        setValue('age', opts.ageRange.typical);
        setValue('height', typicalHeight);
        setValue('eyeColor', opts.eyeColors[0] || '');
        setValue('skinColor', opts.skinColors[0] || '');
        setValue('hairColor', opts.hairColors[0] || '');
    }
  }, [selectedRace, setValue]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { race, subRace, characterClass, subClass, background, stats } = characterInProgress;
    if (!race || !characterClass || !background) return;

    setIsGenerating(true);
    
    let playerSpriteUrl: string | undefined = race.imageUrl;
    
    try {
        playerSpriteUrl = await generateCharacterSprite(
            race.name, 
            subRace ? subRace.name : null,
            characterClass.name,
            subClass ? subClass.name : null, 
            '3:4',
            { ...data, height: formatHeight(data.height) }
        );
    } catch (e: any) {
        console.error("Player sprite generation failed. Using fallback.", e);
    }

    const racialBonuses = getRacialBonuses(race, subRace);
    const finalStats: Record<Stat, number> = { ...stats };
    Object.keys(finalStats).forEach(statKey => {
        const stat = statKey as Stat;
        finalStats[stat] += racialBonuses[stat] || 0;
    });

    const conModifier = Math.floor((finalStats.constitution - 10) / 2);
    const intModifier = Math.floor((finalStats.intelligence - 10) / 2);
    
    const maxHp = 80 + conModifier * 10;
    const maxMana = 40 + intModifier * 10;
    
    let maxStamina = 0;
    const startingMartialAbilities: string[] = [];
    switch (characterClass.id) {
        case 'fighter': case 'barbarian': case 'paladin':
            maxStamina = 20 + conModifier * 2;
            startingMartialAbilities.push('power-strike', 'disarming-strike');
            break;
        case 'ranger': case 'rogue': case 'monk':
            maxStamina = 15 + conModifier * 2;
            startingMartialAbilities.push('power-strike', 'hamstring-shot');
            break;
        default: maxStamina = 5 + conModifier; break;
    }


    const startingSpells: string[] = [];
    if (['wizard', 'sorcerer', 'warlock'].includes(characterClass.id)) startingSpells.push('magic-missile', 'mage-armor', 'detect-magic', 'fire-bolt');
    else if (characterClass.id === 'cleric') startingSpells.push('cure-wounds', 'guiding-bolt', 'sacred-flame');
    else if (characterClass.id === 'bard') startingSpells.push('vicious-mockery', 'healing-word');
    else if (characterClass.id === 'paladin') startingSpells.push('bless', 'compelled-duel');

    const character: PlayerCharacter = {
        name: data.name,
        level: 1, xp: 0, xpToNextLevel: 100,
        currency: { cp: 0, sp: 0, gp: 15 },
        race: race, subRace: subRace,
        characterClass: characterClass, subClass: subClass,
        background: background,
        stats: { ...finalStats, hp: maxHp, maxHp, mana: maxMana, maxMana, stamina: maxStamina, maxStamina },
        inventory: Array(INVENTORY_SIZE).fill(null),
        equipment: { head: null, chest: null, legs: null, feet: null, hands: null, mainHand: null, offHand: null, ring: null, amulet: null },
        karma: 0, spells: startingSpells, martialAbilities: startingMartialAbilities,
        skills: [], feats: [],
        reputation: {},
        appearance: { ...data, height: formatHeight(data.height) },
        gender: data.gender, sexualOrientation: data.sexualOrientation,
        spriteUrl: playerSpriteUrl,
    };
   
    setIsGenerating(false);
    resetCreation();
    onCharacterCreated(character);
  };
  
  const getRacialBonuses = (race: Race | null, subRace: SubRace | null) => {
    const bonuses: Partial<Record<Stat, number>> = {};
    if (!race) return bonuses;
    Object.entries(race.statBonuses).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
    if (subRace) Object.entries(subRace.statBonuses || {}).forEach(([stat, val]) => bonuses[stat as Stat] = (bonuses[stat as Stat] || 0) + (val as number));
    return bonuses;
  };
  
  const handleBackToMenu = () => {
    resetCreation();
    onBackToMenu();
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
      case 1.5:
        return <RaceSelectionStep />;
      case 2:
      case 2.5:
        return <ClassSelectionStep />;
      case 3:
          return <BackgroundSelectionStep backgrounds={backgrounds || []} isLoading={isLoadingBackgrounds} />;
      case 3.5:
          const backgroundFeatures = backgrounds?.map(bg => ({ slug: bg.slug, name: bg.feature, desc: bg.feature_desc })) || [];
          return <CustomBackgroundStep backgroundFeatures={backgroundFeatures} />;
      case 4:
          return <AttributeAssignmentStep />;
      case 5:
          return <AppearanceDetailsStep register={register} watch={watch} setValue={setValue} race={selectedRace!} />;
      case 6:
          return <NamingStep register={register} isValid={isValid} />;
      case 7:
          return <SummaryStep isGenerating={isGenerating} formValues={watch()} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 flex flex-col justify-center items-center relative">
        <motion.button
            type="button"
            onClick={handleBackToMenu}
            aria-label="Close character creation and return to main menu"
            className="absolute top-6 right-8 text-stone-400 hover:text-amber-200 transition-colors font-medieval text-lg z-10 p-2 bg-stone-900/50 rounded-md border border-stone-700"
            whileHover={{ scale: 1.05, borderColor: '#fbbf24' }} // amber-400
            whileTap={{ scale: 0.95 }}
        >
            &times; Return to Main Menu
        </motion.button>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl p-6 bg-stone-900/60 rounded-lg border-2 border-stone-700/80 shadow-2xl">
           {isGenerating ? (
            <LoadingSpinner text="Forging your hero's image in the arcane fires..." />
           ) : (
            <AnimatePresence mode="wait">
              {renderCurrentStep()}
            </AnimatePresence>
           )}
        </form>
    </div>
  );
};
