import { Quest } from '../types';

// This defines the template for quests. The 'status' will be added dynamically when the quest is started.
export const QUESTS: Record<string, Omit<Quest, 'status'>> = {
  'the_serpents_shadow': {
    id: 'the_serpents_shadow',
    title: "The Serpent's Shadow",
    description: "The Serpent Queen has revealed my destiny. To free her, I must find the last descendant of her betrayer, Lord Malakor. The Queen's vision showed that this descendant is a powerful figure within the Lumeni Imperium, ruling from their capital city of Lumen. I must travel there and use the Serpent's Eye Amulet to identify my target.",
    objectives: [
      { id: 'travel_to_lumen', text: 'Travel to the Imperium capital of Lumen', isCompleted: false },
      { id: 'find_descendant', text: "Use the Serpent's Eye Amulet to identify Malakor's descendant", isCompleted: false },
    ]
  },
  'rat_extermination': {
    id: 'rat_extermination',
    title: 'Rat Extermination',
    description: "Brom, the keeper of the 'Weary Wanderer' tavern, is plagued by giant rats in his cellar. He has offered to clear my tab and provide some old gear in exchange for clearing out the infestation.",
    objectives: [
      { id: 'kill_rats', text: 'Defeat the giant rats in the cellar', isCompleted: false },
      { id: 'report_to_brom', text: 'Report back to Brom', isCompleted: false },
    ]
  },
  'quarry_goblins': {
      id: 'quarry_goblins',
      title: 'The Sunstone Quarry Infestation',
      description: "Borin Ironhand, the dwarven smith of the Stonecarvers' Guild, can't get any good stone because goblins have overrun the Sunstone Quarry. He's offered a handsome reward of 100 gold and some gear for the head of the goblin leader.",
      objectives: [
          { id: 'defeat_guards', text: 'Defeat the goblin guards at the quarry entrance', isCompleted: false },
          { id: 'defeat_leader', text: 'Defeat the goblin boss deeper in the quarry', isCompleted: false },
          { id: 'take_head', text: "Take the goblin boss's head as proof", isCompleted: false },
          { id: 'return_to_borin', text: 'Return to Borin Ironhand at the forge', isCompleted: false },
      ]
  },
   'broms_banner_known_past': {
      id: 'broms_banner_known_past',
      title: 'A Mercenary\'s Honor',
      description: "Brom confessed he used to be a mercenary with the Crimson Blades. His company lost their banner in the Greyfang Ruins on a mission that went wrong. Knowing that I am aware of his past, he has asked me to retrieve it for him for 50 gold and some closure.",
      objectives: [
          { id: 'find_ruins', text: 'Travel to the Greyfang Ruins', isCompleted: false },
          { id: 'find_banner', text: 'Find the lost banner of the Crimson Blades', isCompleted: false },
          { id: 'return_banner', text: 'Return the banner to Brom', isCompleted: false },
      ]
  },
   'broms_banner_unknown_past': {
      id: 'broms_banner_unknown_past',
      title: 'A Personal Favor',
      description: "Brom asked me to retrieve a personal item for him from the Greyfang Ruins: a tattered old banner. He seemed reluctant to talk about it, only saying it was for 'closure'. He offered 50 gold for its return.",
      objectives: [
          { id: 'find_ruins', text: 'Travel to the Greyfang Ruins', isCompleted: false },
          { id: 'find_banner', text: 'Find the tattered banner', isCompleted: false },
          { id: 'return_banner', text: 'Return the banner to Brom', isCompleted: false },
      ]
  },
  'gathering_the_blades': {
    id: 'gathering_the_blades',
    title: 'Forging the Blades',
    description: "Captain Vorlag is little more than a veteran with a legendary name. To rebuild the Crimson Blades, he needs people and steel. He has asked me to find promising recruits and then secure a cache of weapons for them.",
    objectives: [
      { id: 'recruit_korgan', text: 'Recruit Korgan "The Fist" in the Leaky Barrel tavern in Silverwind', isCompleted: false },
      { id: 'recruit_elara', text: 'Recruit Elara "Hawkeye" at the Threshold city gate', isCompleted: false },
      { id: 'arm_the_blades', text: "Secure a deal for weapons with Borin Ironhand by clearing the bandit camp on the eastern road", isCompleted: false },
      { id: 'report_to_vorlag', text: 'Report back to Captain Vorlag at the new encampment', isCompleted: false },
    ]
  },
  'burying_the_past': {
    id: 'burying_the_past',
    title: 'Burying the Past',
    description: "A rival from the Crimson Blades' past, known only as the Scavenger, has appeared. He believes the banner's legend should remain dead and has demanded I hand it over. I must decide how to deal with this threat to my new company.",
    objectives: [
      { id: 'confront_scavenger', text: 'Confront the Scavenger', isCompleted: true },
      { id: 'protect_banner', text: 'Protect the Crimson Blades banner', isCompleted: false },
    ]
  },
  'moonpetal_flower': {
    id: 'moonpetal_flower',
    title: 'A Rare Bloom',
    description: "Xylos, the tiefling merchant, wants a rare Moonpetal flower which is said to bloom near the Whispering Crypt. He's offered gold and a 'curiosity' from his collection for it.",
    objectives: [
        { id: 'find_flower', text: 'Find the Moonpetal flower in the Whispering Woods', isCompleted: false },
        { id: 'return_to_xylos', text: 'Bring the flower to Xylos in the marketplace', isCompleted: false },
    ]
  },
   'sea_beast_hunt': {
    id: 'sea_beast_hunt',
    title: 'The Beast of the Bay',
    description: "Guildmaster Elara of the Silverwind Mariner's Guild has a problem: a massive Kelp Lurker is sinking ships in the bay. She has offered 200 gold to anyone who can slay the beast, with a bonus for bringing back its heart as proof.",
    objectives: [
        { id: 'charter_boat', text: 'Charter a boat from the Silverwind Docks', isCompleted: false },
        { id: 'kill_beast', text: 'Slay the Kelp Lurker in Silverwind Bay', isCompleted: false },
        { id: 'collect_heart', text: "Collect the Kelp Lurker's heart", isCompleted: false },
        { id: 'report_to_elara', text: 'Report back to Guildmaster Elara', isCompleted: false },
    ]
  },
  'smugglers_bounty': {
    id: 'smugglers_bounty',
    title: "The Syndicate's Acquisition",
    description: "An agent of the Shadow Syndicate in 'The Leaky Barrel' tavern wants me to 'acquire' a shipment of untaxed Arborian wine from a rival merchant. The shipment is in Warehouse 7 on the east docks. The pay is 75 gold.",
    objectives: [
        { id: 'find_warehouse', text: 'Find Warehouse 7 on the east docks', isCompleted: false },
        { id: 'get_wine', text: 'Acquire the Arborian wine from the warehouse', isCompleted: false },
        { id: 'deliver_wine', text: 'Deliver the wine to the Syndicate contact at The Leaky Barrel', isCompleted: false },
    ]
  },
   'finns_hidden_cache': {
    id: 'finns_hidden_cache',
    title: "Finn's Hidden Cache",
    description: "Finn the cellar boy told me about a smuggler's cache hidden under a loose flagstone at the old mill by the crossroads. It might be worth investigating.",
    objectives: [
        { id: 'find_cache', text: "Find the smuggler's cache at the old mill", isCompleted: false },
    ]
  },
  'a_tide_of_distrust': {
    id: 'a_tide_of_distrust',
    title: "A Tide of Distrust",
    description: "The Shadow Syndicate wants to disrupt the alliance between the Mariner's Guild and the Stonecarvers' Guild. I've been tasked to work with a disgruntled dockmaster, Roric, to sow discord between them.",
    objectives: [
      { id: 'meet_roric', text: 'Meet Dockmaster Roric at the Silverwind Docks', isCompleted: false },
      { id: 'sabotage_shipment', text: 'Sabotage the dwarven steel shipment', isCompleted: false },
      { id: 'frame_dwarves', text: 'Plant false evidence to frame the dwarves for smuggling', isCompleted: false },
      { id: 'convince_elara', text: 'Present the "evidence" to Guildmaster Elara', isCompleted: false },
    ]
  },
};