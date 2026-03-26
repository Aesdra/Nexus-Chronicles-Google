import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { CharacterCreationSlice, Race, SubRace, CharacterClass, SubClass, Background, Stat } from '../types';

const initialStats: Record<Stat, number> = { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 };

const initialState = {
  step: 1,
  points: 27,
  characterInProgress: {
    race: null,
    subRace: null,
    characterClass: null,
    subClass: null,
    background: null,
    stats: { ...initialStats },
    customBgName: '',
    customBgDesc: '',
    customBgSkills: [],
    customBgToolsLangs: [],
    customBgFeatureSlug: '',
  }
};

/**
 * A dedicated, transient Zustand store for managing the multi-step character creation process.
 * This store encapsulates all state related to building a new character, allowing the UI components
 * for each step to be modular and decoupled. The state is reset once character creation is
 * complete or cancelled.
 */
export const useCharacterCreationStore = createWithEqualityFn<CharacterCreationSlice>()((set, get) => ({
  ...initialState,

  goToStep: (step) => set({ step }),

  selectRace: (race) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, race, subRace: null }
    }));
    if (race.subRaces && race.subRaces.length > 0) {
      get().goToStep(1.5);
    } else {
      get().goToStep(2);
    }
  },
  
  selectSubRace: (subRace) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, subRace }
    }));
    get().goToStep(2);
  },

  selectClass: (characterClass) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, characterClass, subClass: null }
    }));
    if (characterClass.subclasses && characterClass.subclasses.length > 0) {
      get().goToStep(2.5);
    } else {
      get().goToStep(3);
    }
  },
  
  selectSubClass: (subClass) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, subClass }
    }));
    get().goToStep(3);
  },

  selectBackground: (background) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, background }
    }));
    get().goToStep(4);
  },

  setStatsAndPoints: (stats, points) => {
    set(state => ({
      characterInProgress: { ...state.characterInProgress, stats },
      points,
    }));
  },

  setCustomBackgroundName: (name) => set(state => ({ characterInProgress: { ...state.characterInProgress, customBgName: name } })),
  setCustomBackgroundDesc: (desc) => set(state => ({ characterInProgress: { ...state.characterInProgress, customBgDesc: desc } })),
  setCustomBackgroundSkills: (skills) => set(state => ({ characterInProgress: { ...state.characterInProgress, customBgSkills: skills } })),
  setCustomBackgroundToolsLangs: (toolsLangs) => set(state => ({ characterInProgress: { ...state.characterInProgress, customBgToolsLangs: toolsLangs } })),
  setCustomBackgroundFeatureSlug: (slug) => set(state => ({ characterInProgress: { ...state.characterInProgress, customBgFeatureSlug: slug } })),

  resetCreation: () => set({ ...initialState }),
}), shallow);