import { Race } from '../types';
import { IMAGE_ASSETS } from './assets';

export const RACES: Race[] = [
  { 
    id: 'human', 
    name: 'Human', 
    description: 'Versatile and ambitious, with a knack for adaptation.', 
    imageUrl: IMAGE_ASSETS.RACE_HUMAN,
    statBonuses: {},
    subRaces: [
        { id: 'highlander', name: 'Highlander', description: 'Hardy folk from the mountains, known for their strength and resilience.', imageUrl: IMAGE_ASSETS.SUBRACE_HIGHLANDER, statBonuses: { strength: 2, constitution: 1 } },
        { id: 'riverfolk', name: 'Riverfolk', description: 'Adaptable people of the waterways, skilled in trade and diplomacy.', imageUrl: IMAGE_ASSETS.SUBRACE_RIVERFOLK, statBonuses: { dexterity: 1, charisma: 2 } },
        { id: 'nomad', name: 'Desert Nomad', description: 'Wandering tribes of the arid wastes, with deep survival instincts.', imageUrl: IMAGE_ASSETS.SUBRACE_NOMAD, statBonuses: { constitution: 2, wisdom: 1 } },
        { id: 'urbanite', name: 'Urbanite', description: 'Cosmopolitan and savvy, they thrive in the bustling heart of civilization, masters of trade and intrigue.', imageUrl: IMAGE_ASSETS.SUBRACE_URBANITE, statBonuses: { dexterity: 2, intelligence: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 18, max: 90, typical: 30 },
      heightRange: { min: 60, max: 78 }, // 5' to 6'6"
      skinColors: ['Fair', 'Tanned', 'Olive', 'Brown', 'Dark'],
      eyeColors: ['Brown', 'Blue', 'Green', 'Hazel', 'Grey'],
      hairColors: ['Black', 'Brown', 'Blonde', 'Red', 'White'],
    }
  },
  { 
    id: 'elf', 
    name: 'Elf', 
    description: 'Graceful and wise, with a deep connection to nature and magic.', 
    imageUrl: IMAGE_ASSETS.RACE_ELF,
    statBonuses: { dexterity: 2 },
    subRaces: [
      { id: 'high-elf', name: 'High Elf', description: 'Heirs of a mystical tradition, masters of arcane arts.', imageUrl: IMAGE_ASSETS.SUBRACE_HIGH_ELF, statBonuses: { intelligence: 1 } },
      { id: 'wood-elf', name: 'Wood Elf', description: 'Swift and stealthy hunters, at one with the forest.', imageUrl: IMAGE_ASSETS.SUBRACE_WOOD_ELF, statBonuses: { wisdom: 1 } },
      { id: 'sea-elf', name: 'Sea Elf', description: 'At home in the ocean depths, they are mysterious and graceful, with an ancient connection to the tides.', imageUrl: IMAGE_ASSETS.SUBRACE_SEA_ELF, statBonuses: { constitution: 1 } },
      { id: 'eladrin', name: 'Eladrin (Fey Elf)', description: 'Fey creatures of intense emotion, their appearance and powers shift with the seasons.', imageUrl: IMAGE_ASSETS.SUBRACE_ELADRIN, statBonuses: { charisma: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 100, max: 750, typical: 150 },
      heightRange: { min: 65, max: 75 }, // 5'5" to 6'3"
      skinColors: ['Pale', 'Fair', 'Copper', 'Ethereal White', 'Aquamarine'],
      eyeColors: ['Green', 'Blue', 'Violet', 'Silver', 'Gold'],
      hairColors: ['Silver', 'White', 'Blonde', 'Black', 'Copper'],
    }
  },
  {
    id: 'drow',
    name: 'Drow',
    description: 'Exiled to the shadowy Underdark, Drow are a race of elegant yet ruthless survivors, masters of shadow magic and subterfuge.',
    imageUrl: IMAGE_ASSETS.RACE_DROW,
    statBonuses: { dexterity: 2 },
    subRaces: [
        { id: 'lolth-sworn', name: 'Lolth-Sworn', description: 'Devout followers of the Spider Queen, they are ruthless, ambitious, and trained in the arts of poison and deception.', imageUrl: IMAGE_ASSETS.SUBRACE_LOLTH_DROW, statBonuses: { charisma: 1 } },
        { id: 'seldarine-drow', name: 'Seldarine Drow', description: 'Rebels who have rejected the cruel dogma of Lolth, seeking a new destiny on the surface or in hidden enclaves.', imageUrl: IMAGE_ASSETS.SUBRACE_SELDARINE_DROW, statBonuses: { wisdom: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 100, max: 750, typical: 140 },
      heightRange: { min: 64, max: 72 }, // 5'4" to 6'
      skinColors: ['Obsidian Black', 'Charcoal Grey', 'Deep Indigo', 'Pale Violet'],
      eyeColors: ['Pale Lilac', 'Bright Red', 'Pink', 'Silver'],
      hairColors: ['Snow White', 'Pale Silver', 'Light Yellow'],
    }
  },
  { 
    id: 'dwarf', 
    name: 'Dwarf', 
    description: 'Sturdy and resilient, masters of craft and combat.', 
    imageUrl: IMAGE_ASSETS.RACE_DWARF,
    statBonuses: { constitution: 2 },
    subRaces: [
        { id: 'mountain-dwarf', name: 'Mountain Dwarf', description: 'Strong and martial dwarves, at home in the roots of mountains.', imageUrl: IMAGE_ASSETS.SUBRACE_MOUNTAIN_DWARF, statBonuses: { strength: 2 } },
        { id: 'hill-dwarf', name: 'Hill Dwarf', description: 'Wiser and more intuitive dwarves, with strong ties to the surface world.', imageUrl: IMAGE_ASSETS.SUBRACE_HILL_DWARF, statBonuses: { wisdom: 1 } },
        { id: 'deep-dwarf', name: 'Deep Dwarf (Duergar)', description: 'Grim and resilient denizens of the deepest caverns, possessing innate psionic abilities.', imageUrl: IMAGE_ASSETS.SUBRACE_DEEP_DWARF, statBonuses: { strength: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 50, max: 350, typical: 120 },
      heightRange: { min: 48, max: 60 }, // 4' to 5'
      skinColors: ['Ruddy', 'Fair', 'Tanned', 'Grey-toned'],
      eyeColors: ['Brown', 'Steel Grey', 'Blue', 'Green'],
      hairColors: ['Black', 'Brown', 'Grey', 'Red', 'White'],
    }
  },
  { 
    id: 'orc', 
    name: 'Orc', 
    description: 'Fiercely strong and proud, with an unyielding spirit.', 
    imageUrl: IMAGE_ASSETS.RACE_ORC,
    statBonuses: {},
    subRaces: [
        { id: 'grak-thul', name: 'Grak-Thul (Mountain-Breaker)', description: 'Known for their brute strength and adherence to tradition.', imageUrl: IMAGE_ASSETS.SUBRACE_GRAKTHUL, statBonuses: { strength: 2, constitution: 1 } },
        { id: 'fel-kor', name: 'Fel-Kor (Wasteland-Stalker)', description: 'Known for their cunning and resilience in harsh environments.', imageUrl: IMAGE_ASSETS.SUBRACE_FELKOR, statBonuses: { dexterity: 2, constitution: 1 } },
        { id: 'iron-tusk', name: 'Iron Tusk (Elemental)', description: 'Orcs who have embraced elemental fury, their shamans command the power of the storm.', imageUrl: IMAGE_ASSETS.SUBRACE_IRONTUSK, statBonuses: { strength: 1, wisdom: 2 } },
    ],
    customizationOptions: {
      ageRange: { min: 16, max: 60, typical: 25 },
      heightRange: { min: 70, max: 84 }, // 5'10" to 7'
      skinColors: ['Green', 'Grey', 'Brown', 'Ashen'],
      eyeColors: ['Red', 'Yellow', 'Black', 'Brown'],
      hairColors: ['Black', 'Dark Brown', 'Grey'],
    }
  },
  { 
    id: 'gnome', 
    name: 'Gnome', 
    description: 'Small in stature, but great in intellect and curiosity.', 
    imageUrl: IMAGE_ASSETS.RACE_GNOME,
    statBonuses: { intelligence: 2 },
    subRaces: [
        { id: 'rock-gnome', name: 'Rock Gnome', description: 'Natural inventors and tinkers, with a mastery of all things mechanical.', imageUrl: IMAGE_ASSETS.SUBRACE_ROCK_GNOME, statBonuses: { constitution: 1 } },
        { id: 'forest-gnome', name: 'Forest Gnome', description: 'Masters of stealth and illusion, with a natural connection to the animals of the woods.', imageUrl: IMAGE_ASSETS.SUBRACE_FOREST_GNOME, statBonuses: { dexterity: 1 } },
        { id: 'deep-gnome', name: 'Deep Gnome (Svirfneblin)', description: 'Stealthy and serious, they navigate the treacherous Underdark with an affinity for stone.', imageUrl: IMAGE_ASSETS.SUBRACE_DEEP_GNOME, statBonuses: { dexterity: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 40, max: 500, typical: 100 },
      heightRange: { min: 36, max: 48 }, // 3' to 4'
      skinColors: ['Fair', 'Tanned', 'Woodsy Brown', 'Stony Grey'],
      eyeColors: ['Blue', 'Green', 'Brown', 'Violet', 'Grey'],
      hairColors: ['Blonde', 'Brown', 'White', 'Vibrant (Blue/Pink/Green)'],
    }
  },
  { 
    id: 'halfling', 
    name: 'Halfling', 
    description: 'Comfort-loving folk who are braver than they appear.', 
    imageUrl: IMAGE_ASSETS.RACE_HALFLING,
    statBonuses: { dexterity: 2 },
    subRaces: [
        { id: 'lightfoot', name: 'Lightfoot', description: 'Naturally stealthy and prone to wanderlust, they are adept at going unnoticed.', imageUrl: IMAGE_ASSETS.SUBRACE_LIGHTFOOT, statBonuses: { charisma: 1 } },
        { id: 'stout', name: 'Stout', description: 'More resilient and hardy than their kin, with a resistance to poisons.', imageUrl: IMAGE_ASSETS.SUBRACE_STOUT, statBonuses: { constitution: 1 } },
        { id: 'ghostwise', name: 'Ghostwise', description: 'Nomadic and reclusive, these halflings communicate telepathically and revere the natural world.', imageUrl: IMAGE_ASSETS.SUBRACE_GHOSTWISE, statBonuses: { wisdom: 1 } },
    ],
    customizationOptions: {
      ageRange: { min: 20, max: 150, typical: 40 },
      heightRange: { min: 30, max: 42 }, // 2'6" to 3'6"
      skinColors: ['Fair', 'Ruddy', 'Tanned'],
      eyeColors: ['Brown', 'Hazel', 'Blue'],
      hairColors: ['Brown', 'Blonde', 'Black', 'Sandy'],
    }
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    description: 'Touched by the lower planes, they bear an infernal heritage.',
    imageUrl: IMAGE_ASSETS.RACE_TIEFLING,
    statBonuses: { charisma: 2 },
    subRaces: [
        { id: 'asmodeus-tiefling', name: 'Asmodeus Tiefling', description: 'Bound to the Lord of the Nine Hells, they command infernal fire.', imageUrl: IMAGE_ASSETS.SUBRACE_ASMODEUS, statBonuses: { intelligence: 1 } },
        { id: 'mephistopheles-tiefling', name: 'Mephistopheles Tiefling', description: 'Descended from the archdevil of Cania, they have a natural affinity for arcane magic.', imageUrl: IMAGE_ASSETS.SUBRACE_MEPHISTOPHELES, statBonuses: { intelligence: 1 } },
        { id: 'zariel-tiefling', name: 'Zariel Tiefling', description: 'Heirs to the legacy of the Archduchess of Avernus, they possess martial prowess and divine might.', imageUrl: IMAGE_ASSETS.SUBRACE_ZARIEL, statBonuses: { strength: 1 } },
        { id: 'dispater-tiefling', name: 'Dispater Tiefling', description: 'Masters of secrets, their infernal legacy grants them subtle powers of deception and espionage.', imageUrl: IMAGE_ASSETS.SUBRACE_DISPATER, statBonuses: { dexterity: 1 } },
        { id: 'levistus-tiefling', name: 'Levistus Tiefling', description: 'Descended from the archdevil of Stygia, they are imbued with an infernal cold and a survivor\'s resilience.', imageUrl: IMAGE_ASSETS.RACE_TIEFLING, statBonuses: { constitution: 1 } },
    ],
    customizationOptions: {
        ageRange: { min: 18, max: 110, typical: 35 },
        heightRange: { min: 60, max: 78 },
        skinColors: ['Crimson Red', 'Deep Purple', 'Ashen Grey', 'Human Tones'],
        eyeColors: ['Solid Gold', 'Solid Silver', 'Pitch Black', 'Fiery Red'],
        hairColors: ['Black', 'Dark Brown', 'Red', 'Silver'],
    }
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    description: 'A proud race of draconic humanoids, born of dragons.',
    imageUrl: IMAGE_ASSETS.RACE_DRAGONBORN,
    statBonuses: {},
    subRaces: [
        { id: 'red-dragonborn', name: 'Red (Chromatic)', description: 'Proud and fierce, with the power of fire burning in their veins.', imageUrl: IMAGE_ASSETS.SUBRACE_RED_DRAGONBORN, statBonuses: { strength: 2, intelligence: 1 } },
        { id: 'gold-dragonborn', name: 'Gold (Metallic)', description: 'Wise and just, with a breath of weakening gas and a strong sense of duty.', imageUrl: IMAGE_ASSETS.SUBRACE_GOLD_DRAGONBORN, statBonuses: { strength: 1, wisdom: 2 } }
    ],
    customizationOptions: {
        ageRange: { min: 15, max: 80, typical: 30 },
        heightRange: { min: 66, max: 80 },
        skinColors: ['Scarlet', 'Gold', 'Brass', 'Copper', 'Bronze', 'Silver', 'White', 'Blue', 'Green', 'Black'],
        eyeColors: ['Red', 'Gold', 'Amber', 'Green', 'Blue'],
        hairColors: [], // Dragonborn typically don't have hair
    }
  },
  {
    id: 'aasimar',
    name: 'Aasimar',
    description: 'Mortals with a touch of the divine, descended from celestial beings, who carry a light within them.',
    imageUrl: IMAGE_ASSETS.RACE_AASIMAR,
    statBonuses: { charisma: 2 },
    subRaces: [
        { id: 'protector-aasimar', name: 'Protector Aasimar', description: 'Champions of good, they possess a radiant, angelic presence and can manifest spectral wings.', imageUrl: IMAGE_ASSETS.SUBRACE_PROTECTOR_AASIMAR, statBonuses: { wisdom: 1 } },
        { id: 'scourge-aasimar', name: 'Scourge Aasimar', description: 'Imbued with a divine energy that constantly burns within, which they can unleash upon their foes.', imageUrl: IMAGE_ASSETS.SUBRACE_SCOURGE_AASIMAR, statBonuses: { constitution: 1 } },
        { id: 'fallen-aasimar', name: 'Fallen Aasimar', description: 'Aasimar whose inner light has been touched by shadow, granting them powers of fear and intimidation.', imageUrl: IMAGE_ASSETS.SUBRACE_FALLEN_AASIMAR, statBonuses: { strength: 1 } },
    ],
    customizationOptions: {
        ageRange: { min: 20, max: 160, typical: 40 },
        heightRange: { min: 60, max: 78 },
        skinColors: ['Fair', 'Pale', 'Golden', 'Silver-toned', 'Light Blue', 'Human Tones'],
        eyeColors: ['Glowing Gold', 'Silver', 'Violet', 'Radiant Blue', 'Emerald', 'Human Tones'],
        hairColors: ['Silver', 'White', 'Platinum Blonde', 'Golden', 'Jet Black', 'Human Tones'],
    }
  }
];