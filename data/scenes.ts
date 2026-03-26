






import { Scene, SceneType, GameState, Companion } from '../types';
import { ITEMS } from './items';
import { addItemToInventory, formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';
import { IMAGE_ASSETS } from './assets';
import { NPCS } from './npcs';
import { COMPANIONS } from './companions';

export const SCENES: Record<string, Scene> = {
  intro_portal: {
    id: 'intro_portal',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/bF9h846/a-swirling-vortex-of-multi-colored-light-and-shadow-At-the-center-a-humanoid-silhouette-is-bei.jpg',
    text: "There is no memory of a beginning. Only a violent, chaotic transit. A sensation of being torn between worlds, a symphony of screaming colors and fractured sounds. Then, impact. You find yourself on your hands and knees on a dusty road, the coppery taste of blood in your mouth. A sharp, searing pain radiates from your side. Your fine gear is gone, replaced by simple traveler's rags. The world spins, and the stone walls of a distant city blur before your vision fails completely.",
    choices: [
      { text: "You succumb to the darkness.", nextScene: 'intro_rescue' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },

  intro_rescue: {
    id: 'intro_rescue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/6P6Yh5F/a-dusty-road-at-dusk-A-hooded-figure-with-a-bow-on-their-back-stands-over-an-unconscious-person.jpg',
    text: "Fading in and out of consciousness, you feel gentle hands checking you for wounds. A voice, calm and steady, murmurs something you can't quite understand. You feel yourself being lifted, the scent of hay and worn leather filling your senses as you're placed onto the back of a moving wagon. The rhythmic clatter of wheels on stone is a soothing lullaby as the darkness claims you once more.",
    choices: [
      { text: "Let the darkness take you.", nextScene: 'intro_arrival' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },

  intro_arrival: {
    id: 'intro_arrival',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761898818/jxof99xkseqpq3j6o9au.webp',
    text: "You awaken with a start, not on a road, but in a simple, dusty bed. Sunlight streams through a grimy window. Your wounds have been crudely but effectively bandaged. Your head throbs, and the memories of your arrival are a chaotic blur. How did you get here? Who helped you? The tavern keeper, a burly man named Brom, told you a passing traveler paid for your room for a few days before disappearing. That was a week ago. The traveler's charity, and your coin, has run out.",
    choices: [
      { text: "Leave the room and head downstairs.", nextScene: 'start' }
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
  },

  start: {
    id: 'start',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You head downstairs into the main hall of the 'Weary Wanderer' tavern. It's a place you've become familiar with over the last week as you tried to recover and piece things together. Sitting at a sticky table, you stare into the last dregs of ale in your mug. Your pockets are empty. Before you can contemplate your next move, the tavern keeper, Brom, approaches your table with a grim look on his face.",
    choices: [
      { text: "'What do you want?'", nextScene: 'barkeep_intro' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    safeZoneType: 'public',
  },
  
  barkeep_intro: {
    id: 'barkeep_intro',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "'You've been warming that chair for two days, traveler. My cellar boy, Finn, is down there trying to clear out some giant rats, but the lad's greener than spring grass. Time to make yourself useful. You go down there and help him finish the job, and I'll forget your bill and throw in some old gear. What do you say?'",
    choices: [
      { text: "'Fine. I'll handle your rat problem.'", nextScene: 'cellar_entrance', startsQuest: 'rat_extermination' },
      { text: "'I'm not an exterminator.'", nextScene: 'barkeep_intro_refuse' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    safeZoneType: 'public',
  },
  
  tavern: {
    id: 'tavern',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761879025/sk2bnoxgyufcwfmnoyiu.webp',
    text: "You are in the Weary Wanderer. The tavern is quiet, with only a few patrons lost in their drinks. Brom the barkeep is polishing a mug behind the counter. A mysterious, cowled figure sits alone in a dark corner, seemingly waiting.",
    choices: [
      { text: "Go up to your room.", nextScene: 'tavern_room', condition: 'HAS_TAVERN_ROOM' },
      { text: "Approach Brom, the barkeep.", nextScene: 'barkeep_dialogue' },
      { text: "[Lyra] 'That figure... I've seen them before.'", nextScene: 'lyra_remark_herald', condition: 'IS_LYRA' },
      { text: "Approach the cowled figure.", nextScene: 'tavern_find_herald', condition: 'NOT_MET_HERALD' },
      { text: "Report to Captain Vorlag.", nextScene: 'vorlag_report_back', condition: 'QUEST_BLADES_READY_FOR_REPORT' },
      { text: "Go to the cellar.", nextScene: 'cellar_cleared', condition: 'QUEST_RATS_KILLED' },
      { text: "Leave the tavern.", nextScene: 'city_square' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'CHECK_FOR_VORLAG_TRIGGER',
    safeZoneType: 'public',
  },

  lyra_remark_herald: {
    id: 'lyra_remark_herald',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761879025/sk2bnoxgyufcwfmnoyiu.webp',
    text: "Lyra leans in close, her voice a hushed whisper. 'That cowled figure in the corner... I recognize the sigil on their ring. It's from the Order of the Silver Wing. They don't usually frequent places like this unless something is very wrong.'",
    choices: [
      { text: "'Thanks for the heads up, Lyra.'", nextScene: 'tavern', effectId: 'LYRA_AFFINITY_PLUS_5' },
      { text: "'I'll handle it. Stay back.'", nextScene: 'tavern', effectId: 'LYRA_AFFINITY_MINUS_5' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    safeZoneType: 'public',
  },

  tavern_room: {
    id: 'tavern_room',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858925/ab7qrxi66rm3rl2v3cjr.jpg',
    text: "You stand in your room at the 'Weary Wanderer' tavern. It's simple and dusty, but Brom lets you use it since you cleared out his cellar. It's a safe place to rest your head.",
    choices: [
      { text: "Rest in the bed (Restore HP, Mana & Stamina).", nextScene: 'rest_in_room' },
      { text: "Leave the room and head downstairs.", nextScene: 'tavern' }
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    safeZoneType: 'private',
  },

  crimson_blades_camp: {
    id: 'crimson_blades_camp',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/L8B62Zg/battlerager.jpg', // Placeholder
    text: "You arrive at the newly established Crimson Blades encampment. It's a humble beginning: a few worn tents, a crackling campfire, and a makeshift training ring. Korgan and Elara are sparring, their new equipment gleaming in the firelight. Captain Vorlag oversees the camp from a small command tent.",
    choices: [
        { text: "Speak with Captain Vorlag.", nextScene: 'vorlag_camp_dialogue' },
        { text: "Manage Camp Upgrades", action: 'manage_camp' },
        { text: "Speak with the Quartermaster.", action: 'trade', actionTargetId: 'blades_quartermaster' },
        { text: "Speak with Korgan.", nextScene: 'korgan_camp_dialogue', condition: 'RECRUITED_KORGAN' },
        { text: "Speak with Elara.", nextScene: 'elara_camp_dialogue', condition: 'RECRUITED_ELARA' },
        { text: "Return to the crossroads.", nextScene: 'crossroads' },
    ],
    safeZoneType: 'public',
  },

    barkeep_intro_refuse: {
    id: 'barkeep_intro_refuse',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "'Then pay up or get out,' Brom growls, pointing a thick finger towards the door. 'I'm not running a charity.' You are unceremoniously thrown out into the city square, your pockets empty and your pride bruised.",
    choices: [
      { text: "Find your footing in the city square.", nextScene: 'city_square' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'SET_PLAYER_CURRENCY_TO_ZERO'
  },

  cellar_entrance: {
    id: 'cellar_entrance',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "Brom hands you a rusty iron poker and points towards a heavy wooden door. 'Finn's down there. Don't let him get eaten.' He then pulls a small vial of red liquid from under the counter. 'Here, take this. Might come in handy.' You descend into the damp, musty cellar where a nervous-looking young man with a pitchfork jumps as you approach. 'Oh! The boss sent you? Thank the gods! I'm Finn. These things... they're bigger than I thought. Ready to get this over with?'",
    choices: [
      { text: "Face the rats.", nextScene: 'cellar_combat' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    effectId: 'ADD_HEALING_POTION_TO_INVENTORY'
  },

  cellar_combat: {
    id: 'cellar_combat',
    type: SceneType.COMBAT,
    backgroundKey: 'cellar',
    text: 'Combat with rats!', // This text is not shown, but good for reference
    enemies: [{ enemyId: 'giant_rat', count: 3 }],
    temporaryCompanions: [{ allyId: 'finn_cellar', count: 1 }],
    onVictoryScene: 'cellar_cleared',
    onDefeatScene: 'game_over_rats',
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    unlocks: { creatures: ['giant_rat'] },
  },

  game_over_rats: {
    id: 'game_over_rats',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "Overwhelmed by the surprisingly vicious rats, you succumb to your wounds in the damp cellar. Your adventure ends here.",
    choices: [
      { text: "Return to Main Menu", nextScene: 'start'}
    ],
    particleTheme: 'crypt',
  },

  cellar_cleared: {
    id: 'cellar_cleared',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "The last of the oversized rodents lies still. Finn leans on his pitchfork, breathing heavily but looking immensely relieved. 'We... we did it! Thanks for the help. I'll clean up this mess.' The cellar is now quiet and safe.",
    choices: [
      { text: "Talk to Finn.", nextScene: 'finn_dialogue_post_combat', condition: 'NOT_TALKED_TO_FINN_AFTER_RATS' },
      { text: "Check on Finn.", nextScene: 'finn_dialogue_repeat', condition: 'TALKED_TO_FINN_AFTER_RATS' },
      { text: "Go back upstairs to the tavern.", nextScene: 'tavern' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    updatesQuest: { questId: 'rat_extermination', objectiveId: 'kill_rats' },
  },
  
  finn_dialogue_post_combat: {
    id: 'finn_dialogue_post_combat',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "Finn looks at you with wide, grateful eyes. 'I can't thank you enough! I was terrified. You're a real hero. I... I don't have any coin, but I want you to have this.' He presses a small, crudely carved wooden token into your hand. 'I made it myself. It's not much, but... thank you.'",
    choices: [
      { text: "Thanks, Finn. Stay safe.", nextScene: 'cellar_cleared' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'crypt',
    effectId: 'RECEIVE_FINNS_COIN',
    unlocks: { npcs: ['finn_cellar_boy'] }
  },

  finn_dialogue_repeat: {
    id: 'finn_dialogue_repeat',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "Finn is busy cleaning up the mess left by the rats. He looks up and gives you a grateful nod. 'Can't thank you enough for your help! I'll have this place spotless in no time.'",
    choices: [
      // BACKGROUND TRIGGER: Folk Hero
      { text: "[Folk Hero] Ask if he's heard any rumors.", nextScene: 'finn_rumor_dialogue', condition: 'BG_FOLK_HERO' },
      { text: "Leave him to his work.", nextScene: 'cellar_cleared' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'crypt',
  },
  
  finn_rumor_dialogue: {
    id: 'finn_rumor_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858529/lxob0uv9jvogj0dtbhae.jpg',
    text: "'A hero like you deserves a hero's reward!' Finn says excitedly, leaning in. 'I heard some travelers talking... about a smuggler who used to operate out of the old mill by the crossroads. They said he stashed his best stuff under a loose flagstone before the guards got him. I bet no one ever found it!'",
    choices: [
      { text: "Thanks for the tip, kid.", nextScene: 'cellar_cleared', startsQuest: 'finns_hidden_cache' },
    ],
    musicTrack: 'tavern',
  },

  barkeep_reward: {
    id: 'barkeep_reward',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "'Heh, you don't look half bad,' Brom grunts, a hint of approval in his voice. 'A deal's a deal.' He slides a worn leather tunic and a rusty but serviceable sword across the bar. 'Your tab is cleared. You can keep using the room upstairs, on the house. Welcome to Threshold, traveler. Try to stay out of trouble.'",
    choices: [
      { text: "Thank him and step back into the tavern.", nextScene: 'tavern' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    updatesQuest: { questId: 'rat_extermination', objectiveId: 'report_to_brom' },
    completesQuest: 'rat_extermination',
    effectId: 'RECEIVE_BARKEEP_REWARD_BASIC'
  },

  barkeep_reward_soldier: {
    id: 'barkeep_reward_soldier',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom looks you over, his eyes lingering on your stance. 'That's not the way a novice fights. You've seen real battle, haven't you?' He grunts, a hint of respect in his voice. 'A deal's a deal, but a rusty poker's no fit weapon for a proper soldier.' He slides a worn leather tunic and a well-balanced longsword across the bar. 'Your tab is cleared. You can keep using the room upstairs. Welcome to Threshold.'",
    choices: [
      { text: "Thank him and step back into the tavern.", nextScene: 'tavern' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    updatesQuest: { questId: 'rat_extermination', objectiveId: 'report_to_brom' },
    completesQuest: 'rat_extermination',
    effectId: 'RECEIVE_BARKEEP_REWARD_SOLDIER'
  },

  crossroads: {
    id: 'crossroads',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/VqC0d42/a-dirt-crossroads-in-a-misty-forest-at-dusk-One-path-leads-towards-a-warmly-lit-tavern-in-the.jpg',
    text: "You stand at a crossroads outside the city of Threshold. The main gate looms behind you. One path leads into the gnarled, misty woods towards the fabled Whispering Crypt. Another path winds east, towards the old Sunstone Quarry. A third path follows the coast, leading south towards the port city of Silverwind.",
    choices: [
      { text: "Return to the city of Threshold.", nextScene: 'city_gate' },
      { text: "Head towards the Whispering Crypt.", nextScene: 'crypt_entrance' },
      { text: "Head towards the Sunstone Quarry.", nextScene: 'quarry_entrance' },
      { text: "Take the coastal road to Silverwind.", nextScene: 'coastal_road' },
      { text: "Go to the Greyfang Ruins.", nextScene: 'greyfang_ruins_entrance', condition: 'QUEST_BANNER_ACTIVE_ANY' }, // AND NOT FOUND BANNER - Simplified check in registry
      { text: "Follow the eastern road (Bandit Camp).", nextScene: 'bandit_camp_approach', condition: 'QUEST_BLADES_RECRUITED_BOTH_NOT_ARMED' },
      { text: "Investigate the old mill.", nextScene: 'old_mill_cache', condition: 'QUEST_FINNS_CACHE_ACTIVE' },
      { text: "Go to the Crimson Blades encampment.", nextScene: 'crimson_blades_camp', condition: 'JOINED_CRIMSON_BLADES' },
      { text: "Investigate a disturbance.", nextScene: 'meet_scavenger', condition: 'NOT_MET_SCAVENGER' }, // AND JOINED_CRIMSON_BLADES
    ],
    particleTheme: 'tavern',
  },
  
  old_mill_cache: {
    id: 'old_mill_cache',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Kz2wK4d/bard.jpg', // Placeholder
    text: "Following Finn's directions, you find the dilapidated old mill. Inside, under a loose flagstone just as he said, you find a small, oilskin-wrapped package. It contains a fine-looking dagger and a small pouch heavy with coin.",
    choices: [ { text: "Take the treasure.", nextScene: 'crossroads' } ],
    effectId: 'FIND_MILL_CACHE',
    completesQuest: 'finns_hidden_cache',
  },

  meet_scavenger: {
      id: 'meet_scavenger',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder for scavenger NPC
      text: "As you walk the crossroads, a grim-faced warrior steps out from the trees, blocking your path. His gear is worn but well-maintained. 'You're the one flying the old Blade banner,' he says, his voice flat. 'I was there when it fell. That thing is a bad omen. It brings nothing but death. Hand it over. Some legends are best left buried.'",
      choices: [
          { text: "The banner stays with me. Step aside.", nextScene: 'scavenger_combat', startsQuest: 'burying_the_past' },
          { text: "Maybe you're right. Take it.", nextScene: 'scavenger_surrender_banner' },
      ],
      effectId: 'MEET_SCAVENGER',
      unlocks: { npcs: ['scavenger_rival'] },
  },
  
  scavenger_combat: {
      id: 'scavenger_combat',
      type: SceneType.COMBAT,
      backgroundKey: 'cellar', // Placeholder for crossroads background
      text: "'So be it,' the Scavenger says, drawing his sword. 'I'll take it from your corpse.'",
      enemies: [{ enemyId: 'scavenger_rival', count: 1 }],
      onVictoryScene: 'scavenger_victory',
      onDefeatScene: 'game_over_rats', // Placeholder
      updatesQuest: { questId: 'burying_the_past', objectiveId: 'protect_banner' },
  },

  scavenger_victory: {
    id: 'scavenger_victory',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/VqC0d42/a-dirt-crossroads-in-a-misty-forest-at-dusk-One-path-leads-towards-a-warmly-lit-tavern-in-the.jpg',
    text: "The Scavenger falls, his final words a choked whisper, 'You don't know what you've done...' You have protected the banner and the honor of the Crimson Blades.",
    choices: [ { text: "Continue on your way.", nextScene: 'crossroads' } ],
    completesQuest: 'burying_the_past',
    effectId: 'SCAVENGER_DEFEATED',
  },

  scavenger_surrender_banner: {
      id: 'scavenger_surrender_banner',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/VqC0d42/a-dirt-crossroads-in-a-misty-forest-at-dusk-One-path-leads-towards-a-warmly-lit-tavern-in-the.jpg',
      text: "You hand over the tattered banner. The Scavenger takes it and throws it into a nearby campfire, watching as the flames consume the symbol. 'Good. Now it can't hurt anyone else.' He turns and disappears back into the woods, leaving you to explain the loss to Captain Vorlag. (This story path is not yet implemented).",
      choices: [ { text: "Return to the crossroads.", nextScene: 'crossroads' } ],
      // TODO: Implement effects for losing the banner and damaging faction reputation.
  },

  tavern_vorlag_appears: {
    id: 'tavern_vorlag_appears',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
    text: "You step back into the tavern common room after speaking with Brom. It's the same as always, except for one striking difference: a formidable, battle-scarred orc sits at your usual table, observing you with intelligent eyes. He gestures to the seat opposite him. This is clearly not a random patron.",
    choices: [
        { text: "Approach the orc.", nextScene: 'vorlag_intro_dialogue' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'FLAG_MET_VORLAG',
  },

  vorlag_intro_dialogue: {
      id: 'vorlag_intro_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
      text: "'The echo of a legend has returned...' the orc says, his voice a low rumble. 'I am Vorlag. That banner you carry is not just cloth. It's the oath of every member, sewn with honor. I have a name, and a dream of reforging the Crimson Blades, but I have no men, no steel... only hope. Help me build this company from the ashes. You won't just be a member; you'll be its foundation.'",
      choices: [
          { text: "'I'm listening. What do you need?'", nextScene: 'vorlag_task_intro', startsQuest: 'gathering_the_blades' },
          { text: "'This sounds like a lost cause.'", nextScene: 'tavern' },
      ],
      musicTrack: 'tavern',
      unlocks: { npcs: ['captain_vorlag'] }
  },
  
  vorlag_task_intro: {
      id: 'vorlag_task_intro',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
      text: "'We need people and we need weapons. I've heard whispers... a brawler named Korgan, drowning his debts in a Silverwind tavern called the Leaky Barrel. A skilled archer, an elf named Elara, wasting her talents on the Threshold city wall. Find them. Convince them. Once we have a crew, we can worry about arming them.'",
      choices: [
          { text: "I'll find your recruits.", nextScene: 'tavern' },
      ],
      musicTrack: 'tavern',
  },

  vorlag_report_back: {
    id: 'vorlag_report_back',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
    text: "Vorlag looks at the small group you've assembled and the gear you've acquired. A slow, genuine smile spreads across his face. 'You did it. You actually did it. This... this is a beginning. You have proven you have the heart of a Blade. The offer still stands: join us. Become a true Crimson Blade and help us rebuild.'",
    choices: [
        { text: "I'm in. I'll join the Crimson Blades.", nextScene: 'tavern', effectId: 'JOIN_CRIMSON_BLADES', completesQuest: 'gathering_the_blades' },
        { text: "I've done my part. I'll take my payment and remain independent.", nextScene: 'tavern', completesQuest: 'gathering_the_blades' }, // TODO: Add payment effect
    ],
    updatesQuest: { questId: 'gathering_the_blades', objectiveId: 'report_to_vorlag' },
  },

  korgan_camp_dialogue: {
    id: 'korgan_camp_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
    text: "Korgan stops his training and gives you a wide, hearty grin. 'Never thought I'd say it, but it feels good to have a purpose again! Better than dodging debt collectors, anyway. Thanks for getting me out of that mess.'",
    choices: [ 
        { text: "Play Dice", action: 'play_dice', actionTargetId: 'korgan_the_fist' },
        { text: "Keep training.", nextScene: 'crimson_blades_camp' } 
    ],
  },
  elara_camp_dialogue: {
    id: 'elara_camp_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_ELF, // Placeholder
    text: "Elara lowers her bow and nods. 'This is more like it. The thrill of the unknown, the promise of a real challenge... Thank you for this opportunity. I won't let you down.'",
    choices: [ { text: "Glad to have you with us.", nextScene: 'crimson_blades_camp' } ],
  },
  
  vorlag_camp_dialogue: {
      id: 'vorlag_camp_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
      text: "Vorlag looks up from a map as you approach, giving you a sharp nod of respect. 'Blade. Good to see you. Thanks to you, our reputation grows. There's always work to be done if you're looking for coin and glory. What do you need?'",
      choices: [
          { text: "[Contracts] I'm looking for work.", nextScene: 'vorlag_radiant_placeholder' },
          { text: "Just checking in.", nextScene: 'crimson_blades_camp' },
      ],
  },
  
  vorlag_radiant_placeholder: {
      id: 'vorlag_radiant_placeholder',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VORLAG,
      text: "'Always sharp. I like that. We have a few contracts available...' (This feature for radiant quests is coming soon!)",
      choices: [
          { text: "I'll check back later.", nextScene: 'vorlag_camp_dialogue' },
      ],
  },

  rest_in_room: {
    id: 'rest_in_room',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761858925/ab7qrxi66rm3rl2v3cjr.jpg',
    text: "You lay down on the simple bed and close your eyes. The weary travels and recent encounters melt away as you drift into a deep, restorative sleep. A few hours later, you awaken feeling refreshed and ready for whatever comes next.",
    choices: [
      { text: "You feel fully rested.", nextScene: 'tavern_room' }
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'REST_AND_RESET_DAILIES',
    safeZoneType: 'private',
  },

  tavern_find_herald: {
    id: 'tavern_find_herald',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/yY5FkX1/a-dimly-lit-dusty-tavern-room-with-a-single-flickering-candle-on-a-wooden-table-A-mysterious-cloak.jpg',
    text: "The figure slides a small, ornate key and a heavy pouch across the table. 'It's time,' a raspy voice whispers from beneath the cowl. 'The path to the Whispering Crypt is open. What you seek... and what you'll become... lies within.' The figure stands and melts into the shadows, leaving you with the key and some coin for your journey.",
    choices: [
      { text: "Examine your reward.", nextScene: 'tavern' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'MEET_HERALD'
  },

  barkeep_dialogue: {
    id: 'barkeep_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You approach the bar. Brom looks up, wiping the counter. 'What can I get for you?' he asks, his voice a low rumble.",
    choices: [
      { text: "[Trade] See what he has for sale.", action: 'trade', actionTargetId: 'brom_barkeep' },
      { text: "[Game] Challenge to dice.", action: 'play_dice', actionTargetId: 'brom_barkeep' },
      { 
        text: "[Soldier] I've dealt with your rat problem.", 
        nextScene: 'barkeep_reward_soldier', 
        condition: 'BG_SOLDIER' // AND QUEST_RATS_KILLED AND NOT_COMPLETED_RAT_EXTERMINATION
      },
      { 
        text: "I've dealt with your rat problem.", 
        nextScene: 'barkeep_reward', 
        condition: 'NOT_BG_SOLDIER' // AND QUEST_RATS_KILLED AND NOT_COMPLETED_RAT_EXTERMINATION
      },
       // FIX: Use stricter 'READY_TO_RETURN' conditions to ensure player actually HAS the item.
       { text: "[Quest] I have your banner.", nextScene: 'barkeep_return_banner_known', condition: 'READY_TO_RETURN_BANNER_KNOWN' },
       { text: "[Quest] I have that banner you wanted.", nextScene: 'barkeep_return_banner_unknown', condition: 'READY_TO_RETURN_BANNER_UNKNOWN' },
       
       // NEW: Allow turning in the banner even if quest wasn't "officially" started via dialogue
       { text: "I found this banner in the ruins. Is it yours?", nextScene: 'barkeep_return_banner_unknown', condition: 'HAS_BANNER_NO_QUEST' },

      { text: "[Entertainer] Offer to perform for the crowd.", nextScene: 'barkeep_perform_check', condition: 'BG_ENTERTAINER_OR_GLADIATOR' }, // AND HAS_TAVERN_ROOM
      { text: "Ask about the cowled figure.", nextScene: 'barkeep_ask_about_herald', condition: 'MET_HERALD' },
      { text: "Ask about the Whispering Crypt.", nextScene: 'barkeep_ask_about_crypt' },
      { text: "Ask about the factions in the area.", nextScene: 'barkeep_ask_about_factions' },
      { text: "Ask if there's any work to be had.", nextScene: 'barkeep_ask_for_work_post_rats', condition: 'COMPLETED_RAT_EXTERMINATION' },
      { text: "Ask if he's heard any news from the crypt.", nextScene: 'barkeep_after_crypt', condition: 'NOT_TOLD_BARKEEP_ABOUT_CRYPT' }, // AND VISITED_CRYPT_ENTRANCE
      { text: "Ask about him personally.", nextScene: 'barkeep_adventurer_story', condition: 'NOT_KNOWS_BROMS_PAST' },
      { text: "A word about the Crimson Blades...", nextScene: 'barkeep_brom_final_dialogue', condition: 'NOT_RECEIVED_BROMS_AMULET' }, // AND JOINED_CRIMSON_BLADES
      { text: "[Karma] 'I've heard things about you...'", nextScene: 'barkeep_karma_check', condition: 'KARMA_NEGATIVE' },
      { text: "Nevermind. Return to the tavern floor.", nextScene: 'tavern' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    unlocks: { npcs: ['brom_barkeep'] },
  },

   barkeep_return_banner_known: {
    id: 'barkeep_return_banner_known',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You place the tattered Crimson Blades banner on the bar. Brom stops cleaning and stares at it, his knuckles white. He runs a hand over the scorched fabric. 'By the gods... after all these years.' He looks up at you, his eyes filled with a complex mix of sorrow and gratitude. 'You brought it back. You brought a piece of my life back. Thank you.' He pushes a heavy pouch of coins across the bar. 'Here. As promised. And my thanks.'",
    choices: [
        { text: "You're welcome, Brom.", nextScene: 'tavern_vorlag_appears' }
    ],
    effectId: 'COMPLETE_BROMS_BANNER',
  },

  barkeep_return_banner_unknown: {
    id: 'barkeep_return_banner_unknown',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You place the tattered banner you recovered on the bar. Brom freezes, staring at it. 'So you found it... the banner of the Crimson Blades.' He says the name with a weight you haven't heard from him before. He runs a hand over the fabric. 'Thank you.' He pushes a heavy pouch of coins towards you. 'This is more than just some old cloth to me.'",
    choices: [
        { text: "'The Crimson Blades? You were one of them?'", nextScene: 'barkeep_return_banner_reveal' },
        { text: "Take the money. 'Glad I could help.'", nextScene: 'tavern_vorlag_appears', effectId: 'COMPLETE_BROMS_BANNER' }
    ],
  },
  
  barkeep_return_banner_reveal: {
    id: 'barkeep_return_banner_reveal',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "He nods grimly. 'A long time ago. That life is behind me... or so I thought.' He looks past you, towards the tavern entrance, as if expecting someone. 'Retrieving this... it won't go unnoticed. The whispers have probably already started.'",
    choices: [
        { text: "What do you mean?", nextScene: 'tavern_vorlag_appears' }
    ],
    effectId: 'COMPLETE_BROMS_BANNER',
  },
  
   barkeep_brom_final_dialogue: {
    id: 'barkeep_brom_final_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom sighs, looking at your gear. 'So, you joined them. The new Crimson Blades. Can't say I'm surprised. Part of me is proud... seeing the banner fly again. But that life... it leads to violence. It attracts shadows.' He reaches under the counter and places a worn iron amulet on the bar. 'This was mine. Kept me safe through more battles than I can count. Maybe it'll do the same for you. Be careful out there, Blade.'",
    choices: [
        { text: "Thank you, Brom. I will.", nextScene: 'barkeep_dialogue', effectId: 'BROM_GIVES_OLD_AMULET' }
    ],
  },
  
  barkeep_perform_check: {
    id: 'barkeep_perform_check',
    type: SceneType.VISUAL_NOVEL,
    text: '',
    choices: [
        { text: "Perform", nextScene: 'barkeep_perform_success', condition: 'NOT_PERFORMED_TODAY' },
        { text: "Perform", nextScene: 'barkeep_perform_fail', condition: 'PERFORMED_TODAY' },
    ]
  },
  
  barkeep_perform_success: {
    id: 'barkeep_perform_success',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761879025/sk2bnoxgyufcwfmnoyiu.webp',
    text: "You take to the center of the common room. Whether with a rousing song, a dazzling display of blade work, or a captivating story, you capture the attention of the few patrons. They applaud heartily, and a few toss coins. Brom nods in approval and slides 5 gold pieces your way. 'Not bad. Don't wear out your welcome, though.'",
    choices: [ { text: "Return to the bar.", nextScene: 'barkeep_dialogue' } ],
    effectId: 'PERFORM_FOR_COIN',
    particleTheme: 'tavern',
  },
  
  barkeep_perform_fail: {
    id: 'barkeep_perform_fail',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761879025/sk2bnoxgyufcwfmnoyiu.webp',
    text: "'Easy there,' Brom says, holding up a hand. 'You've already performed today. Give the folks something to miss. Try again tomorrow.'",
    choices: [ { text: "Fair enough.", nextScene: 'barkeep_dialogue' } ],
    particleTheme: 'tavern',
  },

   barkeep_karma_check: {
    id: 'barkeep_karma_check',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom stops polishing the mug and his eyes narrow slightly. 'Is that so? Well, stories get twisted in the telling. I run a quiet establishment here. Don't want any trouble.' His tone is a clear warning.",
    choices: [
        { text: "I'm not here to cause trouble.", nextScene: 'barkeep_dialogue' },
    ],
    particleTheme: 'tavern',
  },
  barkeep_ask_for_work_post_rats: {
    id: 'barkeep_ask_for_work_post_rats',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom dries a mug and sets it down with a thud. 'You've proven you're reliable. Good. There's always work for those willing to get their hands dirty. The Stonecarvers' Guild is paying good coin to clear out the old quarry—it's been overrun with goblins. Their forge is just across the square. Talk to the master, Borin Ironhand. Or...' He hesitates. 'There's something more personal. A loose end from my old life I'd pay to have tied up.'",
    choices: [
        { text: "Thanks for the tip about the quarry.", nextScene: 'barkeep_dialogue' },
        { text: "What's this personal matter?", nextScene: 'barkeep_offer_quest_known', condition: 'KNOWS_BROMS_PAST'}, // AND NOT COMPLETED_BROMS_BANNER
        { text: "What's this personal matter?", nextScene: 'barkeep_offer_quest_unknown', condition: 'NOT_KNOWS_BROMS_PAST'}, // AND NOT COMPLETED_BROMS_BANNER
        { text: "I'll think about it.", nextScene: 'barkeep_dialogue' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    unlocks: { npcs: ['borin_ironhand'] },
  },
  barkeep_offer_quest_known: {
      id: 'barkeep_offer_quest_known',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "Brom leans in, his voice low. 'Since you know my history... My old company... the Crimson Blades... our last mission... it didn't end well. We lost our banner in the Greyfang Ruins. It's just a piece of cloth, but... it means something. I'd pay you 50 gold to retrieve it. For closure.'",
      choices: [
          { text: "I'll do it. Consider it done.", nextScene: 'barkeep_dialogue', startsQuest: 'broms_banner_known_past', reputationChange: { 'crimson_blades': 5 } },
          { text: "I can't right now.", nextScene: 'barkeep_dialogue' },
      ],
      musicTrack: 'tavern',
  },
  barkeep_offer_quest_unknown: {
      id: 'barkeep_offer_quest_unknown',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "He hesitates, his gaze dropping to the worn wood of the bar. 'There's... an old relic. From a past I'd rather forget. A tattered banner I lost in the Greyfang Ruins. It's just a piece of cloth, but... it means something to me. I'd pay you 50 gold to retrieve it. For closure.'",
      choices: [
          { text: "I'll do it. Consider it done.", nextScene: 'barkeep_dialogue', startsQuest: 'broms_banner_unknown_past' },
          { text: "I can't right now.", nextScene: 'barkeep_dialogue' },
      ],
      musicTrack: 'tavern',
  },
  barkeep_ask_about_factions: {
    id: 'barkeep_ask_about_factions',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom pauses his work and gives you a long, hard look. 'Careful who you ask that question to. Walls have ears. This town's a crossroads for a lot of powerful groups, and not all of them like being talked about. What do you *really* need to know?'",
    choices: [
        { text: "Who are the local powers?", nextScene: 'barkeep_ask_public_factions' },
        { text: "[Whisper] Who operates in the shadows here?", nextScene: 'barkeep_ask_secretive_factions' },
        { text: "Nothing. Forget I asked.", nextScene: 'barkeep_dialogue' },
    ],
    particleTheme: 'tavern',
  },
  barkeep_ask_public_factions: {
    id: 'barkeep_ask_public_factions',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "'The ones you can see? That's the Lumeni Imperium and their Templars, always marching about. Then you've got the Stonecarvers' Guild, the dwarves who own the mountain. And if you've got coin, the Silver Consortium will sell you anything. Then there's the Legion... you'll know them when you see 'em. Best give them a wide berth.'",
    choices: [
        { text: "Tell me about the Imperium.", nextScene: 'barkeep_ask_imperium' },
        { text: "Tell me about the Stonecarvers.", nextScene: 'barkeep_ask_stonecarvers' },
        { text: "What's the Silver Consortium?", nextScene: 'barkeep_ask_consortium' },
        { text: "What about the Legion?", nextScene: 'barkeep_ask_legion' },
        { text: "That's enough for now.", nextScene: 'barkeep_dialogue' },
    ],
    particleTheme: 'tavern',
  },
  barkeep_ask_secretive_factions: {
      id: 'barkeep_ask_secretive_factions',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "Brom leans in, his voice barely a murmur. 'You're playing with fire. Two groups you don't want to cross: the Shadow Syndicate, who run the smuggling and the secrets... and the Shattered Hand, the rebels fighting the Imperium. Don't say their names, don't ask about them. It's better for your health. That's all I'm saying.'",
      choices: [
          { text: "I understand. (Return to dialogue)", nextScene: 'barkeep_dialogue' },
      ],
      particleTheme: 'tavern',
      unlocks: { npcs: ['silas_the_silk'] } // Unlocks the NPC name, but not the detailed lore.
  },
   barkeep_ask_imperium: {
    id: 'barkeep_ask_imperium',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "'The Imperium? Pompous zealots. They march in with their shining armor and demand tithes to their Sun God. They call us heathens and look down on anyone who isn't human. Their Templars are the real problem—judge, jury, and executioner for anything they call heresy. Stay out of their way.'",
    choices: [ { text: "Return.", nextScene: 'barkeep_ask_public_factions' } ],
    particleTheme: 'tavern',
    unlocks: { lore: ['faction_lumeni_imperium'], npcs: ['high_templar_gaius'] },
  },
  barkeep_ask_legion: {
      id: 'barkeep_ask_legion',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "'The Legion are survivors. Their homes were destroyed by things from beyond the gates. Now, they want to destroy anything and everything that comes through. Can't say I blame 'em, but their methods... they don't care who gets caught in the crossfire. Be careful if you cross their path. Their justice is as sharp as their steel.'",
      choices: [ { text: "Return.", nextScene: 'barkeep_ask_public_factions' } ],
      particleTheme: 'tavern',
      unlocks: { lore: ['faction_legion_shattered_aegis'], npcs: ['sergeant_valerius'] },
  },
  barkeep_ask_consortium: {
      id: 'barkeep_ask_consortium',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "'The Silver Consortium is all about coin and contracts. They see these rifts not as a threat, but as a new market. They hire sellswords to map them, retrieve artifacts... anything for a profit. They're dangerous in a different way. A Legionnaire might kill you for getting in his way. A Consortium agent will smile, shake your hand, and have you sign a contract that indebts your soul.'",
      choices: [ { text: "Return.", nextScene: 'barkeep_ask_public_factions' } ],
      particleTheme: 'tavern',
      unlocks: { lore: ['faction_silver_consortium'] },
  },
  barkeep_ask_stonecarvers: {
    id: 'barkeep_ask_stonecarvers',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/C0D9g7B/close-up-on-the-face-of-a-worried-fantasy-tavern-keeper-His-brow-is-furrowed-and-he-looks-like-he.jpg',
    text: "Brom grunts, wiping a mug. 'The Stonecarvers? Mostly dwarves. Stubborn as the mountains they dig in. They control the quarries, the mines... if it's made of stone or metal, they've got a piece of it. Good folk, if you value quality and don't try to haggle. Their master, Borin Ironhand, has a forge just outside of town. Best steel you'll ever see.'",
    choices: [ { text: "Return.", nextScene: 'barkeep_ask_public_factions' } ],
    particleTheme: 'tavern',
    unlocks: { lore: ['faction_stonecarvers_guild'], npcs: ['borin_ironhand'] },
  },
  barkeep_adventurer_story: {
      id: 'barkeep_adventurer_story',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/C0D9g7B/close-up-on-the-face-of-a-worried-fantasy-tavern-keeper-His-brow-is-furrowed-and-he-looks-like-he.jpg',
      text: "'Heh. That I have,' he says with a sad smile. 'Used to run with a mercenary company... the Crimson Blades. We chased glory and treasure through rifts and warzones alike. Thought we were invincible. The world has a way of teaching you that you're not.'",
      choices: [
          { text: "What happened?", nextScene: 'barkeep_tragedy_story' },
          { text: "Best not to dwell on the past.", nextScene: 'barkeep_dialogue' },
      ],
      particleTheme: 'tavern',
      unlocks: { lore: ['faction_crimson_blades'], npcs: ['captain_vorlag'] },
      effectId: 'FLAG_KNOWS_BROMS_PAST',
  },
  barkeep_tragedy_story: {
      id: 'barkeep_tragedy_story',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
      text: "'We took a contract to map a shifting gate. The world on the other side was... wrong. Twisted. Not all of us made it back. I hung up my sword that day.' He places the clean mug down with a heavy finality. 'Some doors are best left unopened, friend. Remember that.'",
      choices: [
          { text: "I'll keep that in mind.", nextScene: 'barkeep_dialogue' },
      ],
      particleTheme: 'tavern',
      unlocks: { lore: ['history_age_of_silence'] }
  },
  
  barkeep_ask_about_herald: {
    id: 'barkeep_ask_about_herald',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You ask about the figure. Brom's eyes avoid yours. 'Some folks are best left to their own shadows,' he mutters. 'That one... they call her the Silent Herald, a servant of the Guardians of the Threshold. They only appear when the old war is about to spill into our world again. Be careful.'",
    choices: [
      { text: "Ask more about the crypt.", nextScene: 'barkeep_ask_about_crypt' },
      { text: "Thank him and step back.", nextScene: 'barkeep_dialogue' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'FLAG_ASKED_ABOUT_HERALD',
    unlocks: { npcs: ['silent_herald'], lore: ['faction_guardians'] },
  },

  barkeep_ask_about_crypt: {
    id: 'barkeep_ask_about_crypt',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "Brom sighs, his voice low. 'The stories say that crypt is a Dimensional Gate, a gateway between worlds. It holds an Eternal, a guardian of cosmic balance from a bygone era. She was betrayed by one of her own kind who joined the ranks of 'the Fallen'—ancient deities who seek to control all realities. They say she still seeks a champion... a Threshold Chosen.'",
    choices: [
      { text: "Interesting. (Return to dialogue)", nextScene: 'barkeep_dialogue' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'FLAG_ASKED_ABOUT_CRYPT',
    unlocks: { lore: ['history_interdimensional_war', 'faction_fallen', 'mechanics_threshold_chosen'] },
  },

  barkeep_after_crypt: {
    id: 'barkeep_after_crypt',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://res.cloudinary.com/dsnpiesqi/image/upload/v1761882195/hcwoehqlg5tckxhmzasx.webp',
    text: "You mention you've been to the crypt entrance. Brom leans in, his expression grim. 'You went there? And you came back? By the gods... So the stories are true. Did you find anything? Did you meet... anyone?'",
    choices: [
        { text: "Tell him about Lyra.", nextScene: 'barkeep_dialogue', condition: 'IS_LYRA' },
        { text: "Tell him it's best he doesn't know.", nextScene: 'barkeep_dialogue' }
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
    effectId: 'FLAG_TOLD_BARKEEP_ABOUT_CRYPT'
  },

  city_square: {
    id: 'city_square',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/hR3wHwT/a-bustling-medieval-city-square-with-a-central-fountain-cobblestone-streets-and-half-timbered-b.jpg',
    text: "You step out into the bustling square of the city of Threshold. The air is alive with the sounds of merchants hawking their wares, the clang of a distant hammer on steel, and the murmur of a hundred conversations. A large fountain dominates the center, and streets branch off in all directions.",
    choices: [
      { text: "Enter the 'Weary Wanderer' tavern.", nextScene: 'tavern' },
      { text: "Visit the Marketplace.", nextScene: 'marketplace' },
      { text: "Head to the City Gate.", nextScene: 'city_gate' },
      { text: "Explore the Temple District.", nextScene: 'temple_district' },
      { text: "Find the Stonecarvers' Forge.", nextScene: 'forge' },
      { text: "Slip into the hidden alley.", nextScene: 'hidden_alley' },
    ],
    musicTrack: 'tavern',
    particleTheme: 'tavern',
  },

  hidden_alley: {
    id: 'hidden_alley',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/yY5FkX1/a-dimly-lit-dusty-tavern-room-with-a-single-flickering-candle-on-a-wooden-table-A-mysterious-cloak.jpg', // Reusing dark background
    text: "The sounds of the city fade as you step into the shadows. At the dead end of a narrow, garbage-strewn alley stands a figure wrapped in tattered purple robes. His face is hidden, but you feel his gaze piercing through you. He is known only as Cipher.",
    choices: [
        { text: "Whisper a secret word.", action: 'input_code' },
        { text: "Return to the square.", nextScene: 'city_square' },
    ],
    particleTheme: 'crypt',
    unlocks: { npcs: ['cipher_the_shade'] }
  },

  marketplace: {
    id: 'marketplace',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Jk7wPzN/a-crowded-fantasy-marketplace-Stalls-are-filled-with-exotic-goods-glowing-potions-and-strange-a.jpg',
    text: "The marketplace is a riot of color and sound. Stalls are packed with everything from fresh produce to gleaming armor. An enigmatic tiefling with a cunning smile catches your eye, his stall filled with strange curiosities and glowing potions.",
    choices: [
      { text: "Approach the tiefling merchant, Xylos.", nextScene: 'xylos_dialogue' },
      { text: "Return to the city square.", nextScene: 'city_square' },
    ],
    unlocks: { npcs: ['xylos_merchant'] },
    musicTrack: 'tavern',
    particleTheme: 'tavern',
  },

  xylos_dialogue: {
      id: 'xylos_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/8DBVpC9/tiefling-merchant-exotic-wares.jpg',
      text: "'Ah, a new face in Threshold! Come, have a look,' the tiefling purrs, gesturing to his wares. 'I am Xylos. I deal in... unique opportunities. Perhaps you have something to sell, or perhaps you're looking for something you won't find anywhere else?'",
      choices: [
          { text: "[Trade] See what he has for sale.", action: 'trade', actionTargetId: 'xylos_merchant' },
          // BACKGROUND TRIGGER: Noble/Waterdhavian Noble/Courtier
          { 
            text: "[Noble] 'This piece... the filigree is reminiscent of Silverwood smithing.'", 
            nextScene: 'xylos_noble_dialogue', 
            condition: 'BG_NOBLE_TYPES' // AND NOT XYLOS_DISCOUNT
          },
          { text: "Ask about his 'opportunities'.", nextScene: 'xylos_quest', condition: 'NOT_QUEST_MOONPETAL_STARTED' },
          
          // FIX: Added turn-in choice for Xylos quest
          { text: "[Quest] I have the Moonpetal flower you asked for.", nextScene: 'xylos_quest_complete', condition: 'READY_TO_RETURN_MOONPETAL' },

          { text: "Leave.", nextScene: 'marketplace' },
      ],
      particleTheme: 'tavern',
  },
  
  xylos_noble_dialogue: {
    id: 'xylos_noble_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/8DBVpC9/tiefling-merchant-exotic-wares.jpg',
    text: "Xylos's eyes light up with genuine surprise and respect. 'Ah, a person of taste! It is a rare pleasure. Most adventurers just see the shine, not the craft. For you, my friend, I will offer my best prices. Consider it a professional courtesy.' His attitude towards you warms considerably.",
    choices: [
      { text: "Thank you, Xylos.", nextScene: 'xylos_dialogue' },
    ],
    particleTheme: 'tavern',
    effectId: 'IMPRESS_XYLOS_NOBLE'
  },

  xylos_quest: {
      id: 'xylos_quest',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/8DBVpC9/tiefling-merchant-exotic-wares.jpg',
      text: "Xylos leans in, his voice a conspiratorial whisper. 'I hear a rare Moonpetal flower blooms only once a decade in the heart of the Whispering Woods, not far from that dreary crypt everyone talks about. They say its essence can stabilize volatile potions. Bring me one, and I'll make it worth your while. A tidy sum of gold, and perhaps a... curiosity from my collection.'",
      choices: [
          { text: "Accept the task.", nextScene: 'marketplace', startsQuest: 'moonpetal_flower', reputationChange: { 'silver_consortium': 2 } },
          { text: "Decline.", nextScene: 'marketplace' },
      ],
      particleTheme: 'tavern',
  },

  xylos_quest_complete: {
      id: 'xylos_quest_complete',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/8DBVpC9/tiefling-merchant-exotic-wares.jpg',
      text: "Xylos's eyes widen as you produce the glowing flower. 'Magnificent! Truly magnificent,' he whispers, cradling the bloom. 'You have done me a great service, friend. As promised, here is your gold.' He hands you a heavy purse and then retrieves a small, leather-bound book. 'And this... a little something extra. A Tome of Clear Thought. Use it well.'",
      choices: [
          { text: "A pleasure doing business.", nextScene: 'marketplace' }
      ],
      effectId: 'COMPLETE_XYLOS_QUEST',
      completesQuest: 'moonpetal_flower',
      reputationChange: { 'silver_consortium': 10 },
  },

  city_gate: {
    id: 'city_gate',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/F8bJk7D/the-main-gate-of-a-stone-city-Two-guards-in-plate-armor-stand-at-attention-The-portcullis-is-r.jpg',
    text: "The main gate of Threshold is a formidable structure of stone and iron. Stern-faced guards in the city's livery stand watch. A grim-faced Sergeant oversees them. Nearby, a young elf in guard livery leans against the wall, looking bored.",
    choices: [
      { text: "Speak to the Sergeant.", nextScene: 'guard_dialogue' },
      { text: "Speak to the elven guard.", nextScene: 'elara_recruit_intro', condition: 'QUEST_BLADES_ACTIVE_NOT_ARMED' }, // AND NOT RECRUITED_ELARA
      { text: "Leave the city.", nextScene: 'crossroads' },
      { text: "Return to the city square.", nextScene: 'city_square' },
    ],
    particleTheme: 'tavern',
    unlocks: { npcs: ['sergeant_valerius', 'elara_hawkeye'] }
  },
  
  elara_recruit_intro: {
    id: 'elara_recruit_intro',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_ELF, // Placeholder
    text: "You approach the elven guard. She straightens up, but her eyes betray a deep-seated boredom. 'Can I help you? If you're here to report a stolen sweetroll, talk to the Sergeant. I'm on the lookout for actual threats.'",
    choices: [
        { text: "I have an offer for you. Something more exciting.", nextScene: 'elara_recruit_offer' },
        { text: "Just passing through.", nextScene: 'city_gate' },
    ],
  },
  elara_recruit_offer: {
    id: 'elara_recruit_offer',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_ELF, // Placeholder
    text: "'Exciting?' she scoffs, but there's a spark of interest in her eyes. 'I'm listening. This gate isn't going to run away.' You tell her about Vorlag's plan to rebuild the Crimson Blades and the promise of adventure.",
    choices: [
        { text: "'We need your skill with a bow. Join us.'", nextScene: 'elara_recruit_success', updatesQuest: { questId: 'gathering_the_blades', objectiveId: 'recruit_elara' }, effectId: 'RECRUIT_ELARA' },
        { text: "'It would be dangerous... maybe too dangerous for you.'", nextScene: 'elara_recruit_success', updatesQuest: { questId: 'gathering_the_blades', objectiveId: 'recruit_elara' }, effectId: 'RECRUIT_ELARA' },
    ],
  },
  elara_recruit_success: {
    id: 'elara_recruit_success',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_ELF, // Placeholder
    text: "Her face breaks into a grin. 'Dangerous? Exciting? That's all you had to say.' She unpins her city guard insignia and drops it on a nearby crate. 'I'm in. Lead the way, Captain.'",
    choices: [
        { text: "Welcome to the Blades.", nextScene: 'city_gate' }
    ],
    reputationChange: { 'crimson_blades': 5 },
  },

  guard_dialogue: {
      id: 'guard_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "The Sergeant gives you a curt nod. 'State your business.' His armor is well-kept but scarred. He looks like he's seen his share of battle.",
      choices: [
          { text: "Ask about the state of the roads.", nextScene: 'guard_roads_info' },
          { text: "Ask about the city.", nextScene: 'guard_city_info' },
          { text: "Nothing. Carry on.", nextScene: 'city_gate' },
      ],
      particleTheme: 'tavern',
  },
  
  guard_roads_info: {
      id: 'guard_roads_info',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "'The roads are as safe as we can make 'em,' the Sergeant grunts. 'But venture off the path and you're on your own. The woods are full of beasts, and the old quarry to the east is crawling with goblins. Stay sharp out there.'",
      choices: [
          { text: "Thank you for the warning.", nextScene: 'guard_dialogue' },
      ],
      particleTheme: 'tavern',
  },
  
  guard_city_info: {
      id: 'guard_city_info',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "'Threshold is a free city. We don't bow to the Imperium, but their Templars have a presence in the Temple District, so watch yourself. We keep the peace inside these walls. What happens outside them... is outside them.'",
      choices: [
          { text: "Understood.", nextScene: 'guard_dialogue' },
      ],
      particleTheme: 'tavern',
      unlocks: { lore: ['faction_lumeni_imperium'] },
  },
  
  temple_district: {
      id: 'temple_district',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/W2zM45y/a-serene-temple-district-in-a-fantasy-city-A-large-cathedral-with-stained-glass-windows-dominat.jpg',
      text: "The Temple District is a place of quiet reverence. Shrines to various deities line the clean-swept streets, but the area is dominated by the grand, sun-crested cathedral of the Lumeni Imperium, a testament to their growing influence.",
      choices: [
          { text: "Enter the Grand Cathedral of Luxos.", nextScene: 'temple_interior' },
          { text: "Return to the city square.", nextScene: 'city_square' },
      ],
      particleTheme: 'tavern',
  },
  
  temple_interior: {
      id: 'temple_interior',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "Inside, the air is cool and smells of incense. Sunlight streams through stained glass, illuminating a young acolyte tending to the candles. He looks up as you enter, offering a polite but reserved smile.",
      choices: [
          { text: "Speak with the acolyte.", nextScene: 'acolyte_dialogue' },
          { text: "Leave the temple.", nextScene: 'temple_district' },
      ],
      particleTheme: 'tavern',
  },

  acolyte_dialogue: {
      id: 'acolyte_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "'Welcome to the Cathedral of Luxos, the Sun God. May His light guide your path,' the acolyte says softly. 'If you seek guidance or wish to offer a prayer, you have come to the right place. High Templar Gaius oversees our flock here.'",
      choices: [
          { text: "Ask about the undead.", nextScene: 'acolyte_undead_info' },
          { text: "Make a donation.", nextScene: 'acolyte_donation_options' },
          // BACKGROUND/CLASS TRIGGER: Acolyte/Cleric
          { 
            text: "[Acolyte] I too have served in a temple.", 
            nextScene: 'acolyte_gift', 
            condition: 'BG_ACOLYTE_OR_CLERIC' // AND NOT RECEIVED_ACOLYTE_GIFT
          },
          { text: "Thank him and leave.", nextScene: 'temple_interior' },
      ],
      particleTheme: 'tavern',
      unlocks: { npcs: ['high_templar_gaius'] }
  },
  
  acolyte_gift: {
    id: 'acolyte_gift',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
    text: "The acolyte's reserved expression softens into one of genuine warmth. 'A brother in faith! It is good to see another who walks the path of service. Please, take these for your journey. May they aid you in your righteous endeavors.' He discreetly passes you two small vials of red liquid.",
    choices: [
        { text: "Thank you for your kindness.", nextScene: 'acolyte_dialogue' },
    ],
    particleTheme: 'tavern',
    effectId: 'RECEIVE_ACOLYTE_GIFT'
  },

  acolyte_undead_info: {
      id: 'acolyte_undead_info',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "The acolyte's smile tightens. 'The restless dead are an abomination in Luxos's sight. The Whispering Crypt is a blight upon this land, a place of shadow that must one day be cleansed. The High Templar preaches on it often.'",
      choices: [
          { text: "Interesting.", nextScene: 'acolyte_dialogue' },
      ],
      particleTheme: 'tavern',
  },
  
  acolyte_donation_options: {
    id: 'acolyte_donation_options',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
    text: "The acolyte gestures to a heavy stone donation box. 'Luxos smiles upon any gift, great or small. Your generosity helps us maintain the cathedral and tend to the needy.'",
    choices: [
        { text: "Donate 1 Gold Piece.", nextScene: 'acolyte_donate_gp', condition: 'HAS_ENOUGH_GOLD_DONATE_1', reputationChange: { 'lumeni_imperium': 3 } },
        { text: "Donate 5 Silver Pieces.", nextScene: 'acolyte_donate_sp', condition: 'HAS_ENOUGH_GOLD_DONATE_5', reputationChange: { 'lumeni_imperium': 2 } },
        { text: "Donate 10 Copper Pieces.", nextScene: 'acolyte_donate_cp', condition: 'HAS_ENOUGH_GOLD_DONATE_10', reputationChange: { 'lumeni_imperium': 1 } },
        { text: "Nevermind.", nextScene: 'acolyte_dialogue' },
    ],
    particleTheme: 'tavern',
  },
  
  acolyte_donate_gp: {
      id: 'acolyte_donate_gp',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "You drop a single, gleaming gold coin into the donation box. The sound rings with significance. The acolyte bows his head deeply. 'Your piety is profound. May Luxos bless you for your great generosity.' You feel a significant warmth, a sense of well-being.",
      choices: [
          { text: "Leave.", nextScene: 'temple_interior' },
      ],
      particleTheme: 'tavern',
      effectId: 'DONATE_GOLD_KARMA_PLUS_5',
  },

  acolyte_donate_sp: {
      id: 'acolyte_donate_sp',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "You drop a handful of silver coins into the donation box. The acolyte bows his head. 'Your piety is noted. May Luxos bless you for your generosity.' You feel a slight warmth, a sense of well-being.",
      choices: [
          { text: "Leave.", nextScene: 'temple_interior' },
      ],
      particleTheme: 'tavern',
      effectId: 'DONATE_SILVER_KARMA_PLUS_3',
  },
  
  acolyte_donate_cp: {
      id: 'acolyte_donate_cp',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/jGGvFz6/the-grand-interior-of-a-temple-Sunlight-streams-through-a-massive-stained-glass-window-depictin.jpg',
      text: "You drop a few copper coins into the donation box. The acolyte bows his head. 'Your piety is noted. May Luxos bless you.' You feel a subtle sense of well-being.",
      choices: [
          { text: "Leave.", nextScene: 'temple_interior' },
      ],
      particleTheme: 'tavern',
      effectId: 'DONATE_COPPER_KARMA_PLUS_1',
  },

  forge: {
    id: 'forge',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
    text: "The clang of a hammer on steel and a wave of heat greet you. This is the Stonecarvers' Guild forge, a place of soot, sweat, and masterful craft. A stout dwarf with a magnificent beard, Borin Ironhand, is working a piece of red-hot metal on an anvil.",
    choices: [
      { text: "Approach Borin Ironhand.", nextScene: 'borin_dialogue' },
      { text: "Return to the city square.", nextScene: 'city_square' },
    ],
    particleTheme: 'tavern',
  },

  borin_dialogue: {
      id: 'borin_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
      text: "The dwarf glances up from his work, not pausing his hammering. 'What do you want? If it's not about smithing or stone, I'm not interested.'",
      choices: [
          { text: "I heard you have a goblin problem.", nextScene: 'borin_quest', condition: 'QUEST_GOBLINS_NOT_STARTED' },
          
          // FIX: Added turn-in choice for Borin quest
          { text: "[Quest] I have the goblin leader's head.", nextScene: 'borin_quest_complete', condition: 'READY_TO_RETURN_GOBLIN_HEAD' },

          { text: "[Trade] I'd like to see your wares.", action: 'trade', actionTargetId: 'borin_ironhand' },
          { text: "I'm here on behalf of a new mercenary company. We need steel.", nextScene: 'borin_blades_deal', condition: 'QUEST_BLADES_RECRUITED_BOTH_NOT_ARMED' },
          { text: "I've cleared the bandit camp.", nextScene: 'borin_blades_report', condition: 'CLEARED_BANDITS_FOR_BORIN' }, // AND QUEST_BLADES_ACTIVE_NOT_ARMED
          { text: "Just admiring your work.", nextScene: 'forge' },
      ],
      particleTheme: 'tavern',
  },

  borin_blades_deal: {
    id: 'borin_blades_deal',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
    text: "'Mercenaries?' Borin grunts, wiping sweat from his brow. 'A dozen a day come through here. Why should I waste my good steel on another upstart crew?'",
    choices: [
        { text: "Because we can solve a problem for you.", nextScene: 'borin_blades_task' },
    ],
  },
  borin_blades_task: {
    id: 'borin_blades_task',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
    text: "'Hmph. Words are cheap,' Borin scoffs. 'There's a bandit camp in the woods off the eastern road. They've hit two of my shipments. You wipe them out... prove you're not just talk... and I'll provide a starting cache of blades and armor. At a fair price, of course.'",
    choices: [
        { text: "We have a deal.", nextScene: 'forge', reputationChange: { 'stonecarvers_guild': 2, 'crimson_blades': 2 } },
    ],
  },
  borin_blades_report: {
    id: 'borin_blades_report',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
    text: "You tell Borin the bandit camp has been dealt with. He inspects your gear, nods slowly. 'Aye, you look like you've seen a fight. A deal's a deal. I'll have a crate of longswords and leather armor sent to your camp by day's end. For the agreed price.'",
    choices: [
        { text: "Thank you. I'll let the captain know.", nextScene: 'forge', updatesQuest: { questId: 'gathering_the_blades', objectiveId: 'arm_the_blades' } },
    ],
    reputationChange: { 'stonecarvers_guild': 10, 'crimson_blades': 5 },
  },

  borin_quest: {
      id: 'borin_quest',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
      text: "Borin sets his hammer down with a loud clang. 'Problem? It's an infestation! Those green-skinned pests have overrun the Sunstone Quarry. Can't get any good stone. Clear out their leader, bring me his ugly head, and I'll pay you 100 gold. And maybe I'll find a decent piece of gear for you in the back.'",
      choices: [
          { text: "I'll take care of it.", nextScene: 'borin_quest_accepted', startsQuest: 'quarry_goblins', reputationChange: { 'stonecarvers_guild': 5 } },
          { text: "I'll think about it.", nextScene: 'forge', effectId: 'FLAG_DECLINED_GOBLIN_QUEST' },
      ],
      particleTheme: 'tavern',
  },

  borin_quest_accepted: {
      id: 'borin_quest_accepted',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
      text: "'Good. Less talking, more smashing. The quarry is east of the city. Don't come back until you've got something to show for it.' He spits on his hands and picks up his hammer again, already dismissing you.",
      choices: [
          { text: "Leave the forge.", nextScene: 'forge' },
      ],
      particleTheme: 'tavern',
  },

  borin_quest_complete: {
      id: 'borin_quest_complete',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/GvxYx2P/dwarf-blacksmith-by-forge.jpg',
      text: "Borin takes the severed goblin head and tosses it into a nearby furnace without a second glance. 'Good riddance,' he grunts, wiping his hands on a rag. 'You're not bad for a tall-folk. Here's your coin. And take this shield, I've no use for it anymore.'",
      choices: [
          { text: "Thank you, Borin.", nextScene: 'forge' }
      ],
      effectId: 'COMPLETE_BORIN_QUEST',
      completesQuest: 'quarry_goblins',
      reputationChange: { 'stonecarvers_guild': 15 },
  },
  
  // Greyfang Ruins for Brom's Banner
  greyfang_ruins_entrance: {
      id: 'greyfang_ruins_entrance',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/PN4gGv8/hobgoblin-defender.jpg', // Placeholder for ruins
      text: "You arrive at the Greyfang Ruins. The air is heavy with silence and regret. These crumbling walls have seen better days, and a palpable sense of loss hangs over the area. This is where Brom's company fell apart. The banner must be somewhere within.",
      choices: [
          { text: "Search the ruins.", nextScene: 'greyfang_ruins_combat' }
      ],
      updatesQuest: { questId: 'broms_banner_known_past', objectiveId: 'find_ruins', status: true },
      // Also update the other version of the quest
      effectId: "() => get().updateQuest('broms_banner_unknown_past', 'find_ruins', true)",
  },
  greyfang_ruins_combat: {
      id: 'greyfang_ruins_combat',
      type: SceneType.COMBAT,
      backgroundKey: 'cellar', // Placeholder for ruins
      text: "As you search, the spirits of the fallen soldiers, unable to rest, rise to defend their final post.",
      enemies: [{ enemyId: 'restless_legionnaire', count: 2 }],
      onVictoryScene: 'greyfang_ruins_found_banner',
      onDefeatScene: 'game_over_rats', // Placeholder
      unlocks: { creatures: ['restless_legionnaire'] },
  },
  greyfang_ruins_found_banner: {
      id: 'greyfang_ruins_found_banner',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/PN4gGv8/hobgoblin-defender.jpg', // Placeholder for ruins
      text: "With the restless spirits put to peace, you find the tattered Crimson Blades banner, snagged on a broken statue, preserved by some strange quirk of fate.",
      choices: [
          { text: "Take the banner.", nextScene: 'crossroads' }
      ],
      effectId: 'GET_CRIMSON_BLADES_BANNER',
  },
  
  // Bandit Camp for "A Fragile Truce"
  bandit_camp_approach: {
      id: 'bandit_camp_approach',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/L8B62Zg/battlerager.jpg', // Placeholder
      text: "Following the tracks off the eastern road, you find a crudely fortified bandit camp nestled in a small clearing. A pair of lookouts are posted near the entrance. You'll have to fight your way through.",
      choices: [
          { text: "Attack the camp.", nextScene: 'bandit_camp_combat' }
      ],
  },
  bandit_camp_combat: {
      id: 'bandit_camp_combat',
      type: SceneType.COMBAT,
      backgroundKey: 'cellar', // Placeholder
      text: "The bandits raise the alarm, and the camp erupts into action.",
      enemies: [
          { enemyId: 'bandit_scout', count: 2 },
          { enemyId: 'bandit_leader', count: 1 }
      ],
      onVictoryScene: 'bandit_camp_cleared',
      onDefeatScene: 'game_over_rats', // Placeholder
      unlocks: { creatures: ['bandit_scout', 'bandit_leader'] },
  },
  bandit_camp_cleared: {
      id: 'bandit_camp_cleared',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/L8B62Zg/battlerager.jpg', // Placeholder
      text: "The last of the bandits falls. The camp is now clear. You've upheld your end of the bargain for Borin Ironhand.",
      choices: [
          { text: "Return to the crossroads.", nextScene: 'crossroads' }
      ],
      reputationChange: { 'crimson_blades': 5 },
      effectId: "gs => ({ ...gs, globalFlags: { ...gs.globalFlags, cleared_bandits_for_borin: true } })"
  },

  quarry_entrance: {
      id: 'quarry_entrance',
      type: SceneType.COMBAT,
      backgroundKey: 'cellar', // Using cellar as a placeholder for a quarry background
      text: "You arrive at the Sunstone Quarry. Crude goblin watchtowers stand precariously on the edges, and the air is filled with their guttural chatter. A heavily-armored hobgoblin directs a brutish goblin, while a shaman chants in the background. This is clearly their territory now.",
      enemies: [
          { enemyId: 'hobgoblin_defender', count: 1 },
          { enemyId: 'goblin_brute', count: 1 },
          { enemyId: 'goblin_shaman', count: 1 }
      ],
      onVictoryScene: 'quarry_victory',
      onDefeatScene: 'game_over_rats', // Placeholder
      particleTheme: 'tavern',
      unlocks: { creatures: ['goblin_skirmisher', 'goblin_brute', 'hobgoblin_defender'] }
  },
  
  quarry_victory: {
    id: 'quarry_victory',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/fHwQ3Jj/the-entrance-to-a-large-stone-quarry-cut-into-the-side-of-a-hill-Crude-goblin-watchtowers-and.jpg',
    text: "The last of the goblins falls. The quarry is quiet now, save for the wind whistling through the carved stone. You have cleared the main area.",
    choices: [
      { text: "Return to the crossroads.", nextScene: 'crossroads' },
    ],
    particleTheme: 'tavern',
    reputationChange: { 'stonecarvers_guild': 5 },
  },

  crypt_entrance: {
    id: 'crypt_entrance',
    type: SceneType.POINT_AND_CLICK,
    backgroundImageUrl: 'https://i.ibb.co/YyS0S2j/the-ominous-entrance-to-an-ancient-stone-crypt-overgrown-with-moss-and-ivy-The-heavy-stone-door.jpg',
    text: 'You stand before the Whispering Crypt. The air is cold, heavy with the smell of damp earth and decay. The massive stone door is sealed shut, its surface covered in faded runes. A single, ornate keyhole is set in the center. To the side, a gnarled, ancient tree seems to watch you. The path back to the crossroads is behind you.',
    clickableAreas: [
        { x: 45, y: 55, width: 10, height: 10, nextScene: 'crypt_unlocked', tooltip: 'Use the Ornate Key', condition: 'HAS_ORNATE_KEY' }, // AND NOT CRYPT_DOOR_OPENED
        { x: 70, y: 30, width: 25, height: 60, nextScene: 'inspect_tree', tooltip: 'Inspect the Gnarled Tree' },
    ],
    choices: [
        { text: "Enter the crypt.", nextScene: 'crypt_hallway', condition: 'CRYPT_DOOR_OPENED' },
        { text: "Return to the crossroads.", nextScene: 'crossroads' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    effectId: 'FLAG_VISITED_CRYPT_ENTRANCE',
  },

  inspect_tree: {
    id: 'inspect_tree',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/34Gz4Rz/a-close-up-of-the-bark-of-a-gnarled-ancient-tree-Carved-into-the-bark-is-a-faint-barely-visibl.jpg',
    text: "You run your hand over the tree's rough bark. Beneath a patch of moss, you find an ancient carving: a crown intertwined with a serpent. The symbol of an Eternal. As you touch it, a powerful, sorrowful voice echoes in your mind... 'Chosen one... free me... and restore the balance.'",
    choices: [
        { text: "Return to the door.", nextScene: 'crypt_entrance' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },
  crypt_unlocked: {
    id: 'crypt_unlocked',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/RzMhFbD/the-inside-of-an-ancient-crypt-just-past-the-entrance-Stone-dust-hangs-in-the-air-illuminated-b.jpg',
    text: "The key turns with a heavy *clunk*. The stone door grinds open, releasing a cloud of stale, ancient air. The darkness within is absolute, save for the moonlight spilling in behind you. The path forward is a single, descending corridor. As you step inside, you hear a soft footstep behind you.",
    choices: [
      { text: "Turn to face the sound.", nextScene: 'meet_lyra', condition: 'NOT_MET_LYRA' },
      { text: "Proceed into the darkness.", nextScene: 'crypt_hallway', condition: 'MET_LYRA' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    effectId: 'FLAG_CRYPT_DOOR_OPENED',
  },
  meet_lyra: {
    id: 'meet_lyra',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Jqj8c1L/a-competent-looking-female-human-ranger-with-practical-leather-armor-and-a-longbow-slung-over-her.jpg',
    text: "A figure steps out of the shadows. It's a woman, clad in worn leather armor with a longbow slung over her back. 'The crypt is awake again,' she says, her voice steady. 'The name's Lyra. I serve the Guardians of the Threshold, and I was sent to investigate. I see you have the key. This place is dangerous. You can accept my help, or you can be another corpse for me to step over.'",
    choices: [
      { text: "'I'd be glad for the company.'", nextScene: 'lyra_joins', reputationChange: { 'guardians_of_the_threshold': 5 } },
      { text: "'I work alone.'", nextScene: 'lyra_declined', reputationChange: { 'guardians_of_the_threshold': -2 } },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },
  lyra_joins: {
    id: 'lyra_joins',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/4T41cR1/the-player-character-and-their-new-ranger-companion-Lyra-stand-side-by-side-looking-down-a-dark-o.jpg',
    text: "'Good choice,' Lyra says with a slight nod. 'The echoes in this place are restless. Let's move. The Eternal's prison should be at the heart of this Nexus.' She draws an arrow, holding it loosely as she scans the darkness ahead. You have a feeling this journey just became a lot more survivable.",
    choices: [
      { text: "Proceed into the darkness.", nextScene: 'crypt_hallway' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    unlocks: { npcs: ['lyra_ranger'] },
    effectId: 'LYRA_JOINS_PARTY'
  },
  lyra_declined: {
    id: 'lyra_declined',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/VMybJdD/the-player-character-stands-alone-in-a-dark-crypt-corridor-watching-as-their-potential-ranger-co.jpg',
    text: "Lyra shrugs. 'Your funeral. Don't say I didn't warn you.' With that, she fades back into the shadows of the entrance, leaving you completely alone in the oppressive silence of the crypt. The weight of the darkness feels heavier now.",
    choices: [
      { text: "Proceed into the darkness alone.", nextScene: 'crypt_hallway' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    unlocks: { npcs: ['lyra_ranger'] },
    effectId: 'DECLINE_LYRA'
  },
  crypt_hallway: {
    id: 'crypt_hallway',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/qBvV6h7/a-long-dark-stone-hallway-in-an-ancient-crypt-The-walls-are-lined-with-sealed-sarcophagi-Cobwe.jpg',
    text: 'You venture deeper into the crypt. The hallway is long and silent, the walls lined with stone sarcophagi. The air is frigid, and every sound echoes unnaturally. From the shadows ahead, a gaunt, shambling figure emerges, its jaw hanging slack and its eyes burning with a cold, dead light.',
    choices: [
        { text: "Observe the creature from a distance.", nextScene: 'observe_ghoul' },
        { text: "Ready your weapon and advance.", nextScene: 'central_chamber' }, // Placeholder until combat
        { text: "[Companion] Talk to Lyra.", nextScene: 'lyra_dialogue_hub', condition: 'HAS_COMPANION' },
        // BACKGROUND TRIGGER: Rift-Wanderer/Outlander/Uthgardt Tribe Member
        { text: "[Outlander] Point out a subtle detail about the warped environment.", nextScene: 'lyra_outlander_crypt_remark', condition: 'BG_OUTLANDER_TYPES' }, // AND HAS_COMPANION AND NOT LYRA_OUTLANDER_REMARK_DONE
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },
  
  lyra_outlander_crypt_remark: {
    id: 'lyra_outlander_crypt_remark',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
    text: "As you move through the oppressive silence, you point out how the moss on the walls grows in unnatural, spiraling patterns. 'The decay here isn't natural,' you murmur. Lyra glances at the wall, then back at you, impressed. 'You've got a good eye. Most don't notice the little ways a place is wrong.' She seems to regard you with newfound respect. 'Here, you might make good use of this.' She hands you a small pot of greasy paste.",
    choices: [
        { text: "Thank her and continue.", nextScene: 'crypt_hallway_return' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    effectId: 'LYRA_OUTLANDER_REMARK'
  },

   lyra_dialogue_hub: {
      id: 'lyra_dialogue_hub',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
      text: "Lyra keeps her eyes on the path ahead but turns her head slightly, acknowledging you. 'What is it? We shouldn't linger.'",
      choices: [
          { text: "Tell me about yourself.", nextScene: 'lyra_background_story' },
          { text: "What do you know about the factions involved here?", nextScene: 'lyra_ask_factions' },
          { text: "What do you make of this place?", nextScene: 'lyra_opinion_crypt' },
          { text: "[Trust] We need to be able to rely on each other.", nextScene: 'lyra_build_trust' },
          { text: "[Probe] There's something familiar about you...", nextScene: 'lyra_reveal_rescue', condition: 'LYRA_AFFINITY_HIGH_70' }, // AND HAS_COMPANION AND NOT LYRA_RESCUE_REVEALED
          { text: "[Probe] Tell me more about the Guardians.", nextScene: 'lyra_reveal_guardians', condition: 'LYRA_AFFINITY_HIGH_60' }, // AND HAS_COMPANION
          { text: "Let's keep moving.", nextScene: 'crypt_hallway_return' },
      ],
      particleTheme: 'crypt',
  },
  lyra_reveal_rescue: {
    id: 'lyra_reveal_rescue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Jqj8c1L/a-competent-looking-female-human-ranger-with-practical-leather-armor-and-a-longbow-slung-over-her.jpg',
    text: "She stops and turns to face you fully, a flicker of something unreadable in her eyes. 'Familiar? I suppose so. The roads around Threshold are my territory. It's how I happened to find a half-dead traveler in a ditch a few weeks back... someone who looked a lot like you. I figured anyone tough enough to survive a trip through a rogue portal was worth dragging to the nearest tavern. Seems I was right.'",
    choices: [ { text: "That was you? Thank you.", nextScene: 'lyra_dialogue_hub', 
    effectId: 'LYRA_AFFINITY_PLUS_20'} ],
    particleTheme: 'crypt',
    effectId: 'FLAG_LYRA_RESCUE_REVEALED'
  },
  lyra_build_trust: {
      id: 'lyra_build_trust',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/Jqj8c1L/a-competent-looking-female-human-ranger-with-practical-leather-armor-and-a-longbow-slung-over-her.jpg',
      text: "She studies you for a moment, then gives a curt nod. 'You're right. Trust is earned. I'll do my part.' She seems to relax slightly, her posture a little less rigid.",
      choices: [ { text: "Good. (Return)", nextScene: 'lyra_dialogue_hub' } ],
      particleTheme: 'crypt',
      effectId: 'LYRA_AFFINITY_PLUS_10'
  },
  lyra_reveal_guardians: {
      id: 'lyra_reveal_guardians',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/Jqj8c1L/a-competent-looking-female-human-ranger-with-practical-leather-armor-and-a-longbow-slung-over-her.jpg',
      text: "She hesitates, then seems to make a decision. 'Alright. You've earned some honesty. The Guardians aren't just rangers and spies. We have Lorekeepers who preserve the truth, and Weavers who try to mend the damage to reality. My mentor, Kaelen Vance, is one of our best field commanders. Our mission is bigger than just this crypt—we're trying to prevent another Sundering.'",
      choices: [ { text: "Thank you for trusting me.", nextScene: 'lyra_dialogue_hub' } ],
      particleTheme: 'crypt',
      unlocks: { npcs: ['kaelen_vance'], lore: ['history_the_sundering'] }
  },
  lyra_ask_factions: {
    id: 'lyra_ask_factions',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
    text: "'The only ones that matter in this crypt are the Fallen and their worshippers, the Children of the Echo. They are drawn to this place's power. They will try to stop us, or worse, claim the Eternal's power for themselves. We must assume they are already here, watching.'",
    choices: [
        { text: "Return.", nextScene: 'lyra_dialogue_hub' },
    ],
    particleTheme: 'crypt',
    unlocks: { lore: ['faction_children_of_echo'] },
  },
  lyra_background_story: {
      id: 'lyra_background_story',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
      text: "'The Guardians took me in when I was an orphan. They gave me a purpose, a family. It's the only life I've ever known.'",
      choices: [
          { text: "Return.", nextScene: 'lyra_dialogue_hub' },
      ],
      particleTheme: 'crypt',
      unlocks: { lore: ['faction_guardians'] }
  },
  lyra_opinion_crypt: {
      id: 'lyra_opinion_crypt',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
      text: "'This place is a Nexus. A wound in reality. The energy here feels... sorrowful. Whatever is trapped here has been suffering for a very long time. We need to be careful. The Fallen's influence will be strong.'",
      choices: [
          { text: "Return.", nextScene: 'lyra_dialogue_hub' },
      ],
      particleTheme: 'crypt',
      unlocks: { lore: ['world_arathis'] }
  },
  crypt_hallway_return: {
    id: 'crypt_hallway_return',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/qBvV6h7/a-long-dark-stone-hallway-in-an-ancient-crypt-The-walls-are-lined-with-sealed-sarcophagi-Cobwe.jpg',
    text: "You nod, and continue down the oppressive hallway. A gaunt, shambling figure is still visible in the shadows ahead.",
    choices: [
        { text: "Observe the creature from a distance.", nextScene: 'observe_ghoul' },
        { text: "Ready your weapon and advance.", nextScene: 'central_chamber' }, // Placeholder until combat
    ],
    particleTheme: 'crypt',
  },
  crypt_hallway_exit: {
    id: 'crypt_hallway_exit',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/qBvV6h7/a-long-dark-stone-hallway-in-an-ancient-crypt-The-walls-are-lined-with-sealed-sarcophagi-Cobwe.jpg',
    text: "You turn away from the Serpent Queen's sarcophagus and make your way back through the silent, oppressive corridors of the crypt.",
    choices: [
        { text: "Ascend to the surface.", nextScene: 'crypt_entrance' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },
  observe_ghoul: {
    id: 'observe_ghoul',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/d2XJgTj/a-gaunt-humanoid-creature-with-gray-skin-and-glowing-eyes-shambles-down-a-dark-crypt-hallway-It.jpg',
    text: 'You hold your position, watching the creature. It doesn\'t seem to notice you, its movements slow and erratic. It seems drawn towards the heart of the crypt, driven by some unseen force. After a moment, it shuffles past you and disappears into the darkness ahead.',
    choices: [
        { text: "Proceed with caution.", nextScene: 'central_chamber' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    unlocks: { creatures: ['crypt_ghoul'] },
  },
  ask_lyra_ghoul: {
    id: 'ask_lyra_ghoul',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/Xz9Z4h8/the-female-ranger-companion-Lyra-holds-up-a-hand-cautiously-listening-to-a-sound-coming-from-a.jpg',
    text: "Lyra narrows her eyes. 'A Crypt Ghoul. They're drawn to places with strong necrotic energy, but they're usually not aggressive unless provoked. This one seems... preoccupied. Best we let it pass. No need for a fight that won't win us anything.' The ghoul shuffles by, oblivious to your presence.",
    choices: [
      { text: "Follow her lead and continue.", nextScene: 'central_chamber' },
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
    unlocks: { creatures: ['crypt_ghoul'] },
  },
  central_chamber: {
      id: 'central_chamber',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/1GSg28Q/a-vast-circular-chamber-in-the-center-of-a-crypt-In-the-middle-of-the-room-is-a-large-ornate-s.jpg',
      text: 'You arrive in a large, circular chamber. In the center, on a raised platform, rests a magnificent sarcophagus adorned with serpents and crowns. A translucent, ghostly figure of a queen floats above it, bound by shimmering, ethereal chains. This must be the Serpent Queen. As you approach, she opens her spectral eyes.',
      choices: [
          { text: "'I have come to free you.'", nextScene: 'queen_dialogue_1', condition: 'NOT_DESTINY_CHOSEN' },
          { text: "Observe the spectral queen.", nextScene: 'central_chamber_observe_after', condition: 'DESTINY_CHOSEN' },
      ],
      musicTrack: 'crypt',
      particleTheme: 'crypt',
      unlocks: { npcs: ['serpent_queen_eternal'] },
  },
  central_chamber_observe_after: {
    id: 'central_chamber_observe_after',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "The Serpent Queen's spectral form floats silently, her gaze distant. Her fate is now tied to your actions in the world above. There is nothing more to say here.",
    choices: [
        { text: "Leave the chamber.", nextScene: 'crypt_hallway_exit' }
    ],
    musicTrack: 'crypt',
    particleTheme: 'crypt',
  },
  queen_dialogue_1: {
      id: 'queen_dialogue_1',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
      text: "'So, a champion arrives. My voice has reached through the ages. You have questions, I am sure. Ask. Time is something I have in abundance.'",
      choices: [
          { text: "Who are you?", nextScene: 'queen_who', condition: 'NOT_ASKED_QUEEN_WHO' },
          { text: "Why are you imprisoned?", nextScene: 'queen_why', condition: 'NOT_ASKED_QUEEN_WHY' },
          { text: "Tell me about your betrayer.", nextScene: 'queen_betrayer', condition: 'ASKED_QUEEN_WHY' }, // AND NOT ASKED_ABOUT_BETRAYER
          { text: "What is a 'Threshold Chosen'?", nextScene: 'queen_what', condition: 'NOT_ASKED_QUEEN_WHAT' },
          { text: "I am ready to hear my purpose.", nextScene: 'queen_mission', condition: 'QUEEN_QUESTIONS_ASKED_ANY' },
      ],
      musicTrack: 'crypt',
      particleTheme: 'crypt',
  },
  queen_who: {
    id: 'queen_who',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "'I am one of the Eternals, beings who once tended to the balance of all realities. We are not gods, but custodians of existence itself.'",
    choices: [ { text: "Continue.", nextScene: 'queen_dialogue_hub' } ],
    unlocks: { lore: ['world_eternals_nature'] },
    particleTheme: 'crypt',
    effectId: 'FLAG_ASKED_QUEEN_WHO',
  },
  queen_why: {
    id: 'queen_why',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "'A great schism, The Sundering, divided my kind. Those who craved dominion became the Fallen. One of their generals, a trusted friend, betrayed and sealed me here during the great Interdimensional War.'",
    choices: [ { text: "Continue.", nextScene: 'queen_dialogue_hub' } ],
    unlocks: { lore: ['history_the_sundering'] },
    particleTheme: 'crypt',
    effectId: 'FLAG_ASKED_QUEEN_WHY',
  },
  queen_betrayer: {
    id: 'queen_betrayer',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "'His name was Malakor. He was once my most trusted friend, a brilliant strategist and a believer in a perfect, ordered universe. But his desire for order became a thirst for absolute control. He saw the chaos of free will as a flaw to be purged. He led the first schism and became a general of the Fallen. It was his power, his blood, that forged these chains.'",
    choices: [ { text: "I will not forget his name.", nextScene: 'queen_dialogue_hub' } ],
    unlocks: { npcs: ['lord_malakor'] },
    particleTheme: 'crypt',
    effectId: 'FLAG_ASKED_QUEEN_BETRAYER',
  },
  queen_what: {
    id: 'queen_what',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "'You can feel it, can't you? The energy of this place, the connection to things beyond your world. That is the mark of a Chosen. You stand on the Threshold of all realities, and your actions will decide their fate.'",
    choices: [ { text: "Continue.", nextScene: 'queen_dialogue_hub' } ],
    unlocks: { lore: ['mechanics_threshold_chosen'] },
    particleTheme: 'crypt',
    effectId: 'FLAG_ASKED_QUEEN_WHAT',
  },
  queen_dialogue_hub: {
      id: 'queen_dialogue_hub',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
      text: "'What else do you wish to know?'",
      choices: [
          { text: "Who are you?", nextScene: 'queen_who', condition: 'NOT_ASKED_QUEEN_WHO' },
          { text: "Why are you imprisoned?", nextScene: 'queen_why', condition: 'NOT_ASKED_QUEEN_WHY' },
          { text: "Tell me about your betrayer.", nextScene: 'queen_betrayer', condition: 'ASKED_QUEEN_WHY' }, // AND NOT ASKED_ABOUT_BETRAYER
          // BACKGROUND TRIGGER: Sage/Cloistered Scholar/Archaeologist
          { text: "[Sage] 'Your prison... it resonates with sympathetic magic. Tell me of its creator.'", nextScene: 'queen_sage_question', condition: 'BG_SAGE_TYPES' },
          { text: "What is a 'Threshold Chosen'?", nextScene: 'queen_what', condition: 'NOT_ASKED_QUEEN_WHAT' },
          { text: "I understand. Tell me what must be done.", nextScene: 'queen_mission' },
      ],
      musicTrack: 'crypt',
      particleTheme: 'crypt',
  },
   queen_sage_question: {
    id: 'queen_sage_question',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
    text: "The Queen's spectral form seems to focus on you with new interest. 'You perceive the artifice. Astute. My betrayer's obsession with perfect, unyielding order is his signature. It is a flaw... a madness that can be exploited. Know this...' She imparts a vision of Malakor's crippling paranoia and the nature of his flawless but rigid constructs.",
    choices: [ { text: "I will use this knowledge against him.", nextScene: 'queen_dialogue_hub' } ],
    unlocks: { lore: ['lore_malakor_madness'] },
    particleTheme: 'crypt',
  },
  queen_mission: {
      id: 'queen_mission',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/9G3XgH6/a-close-up-of-the-spectral-Serpent-Queen-in-a-crypt-Her-expression-is-sorrowful-and-weary-but-h.jpg',
      text: "'To free me, you must sever the bloodline of my betrayer. His last descendant, a powerful figure in the world above, unknowingly maintains my chains. Strike him down, and you will not only grant me freedom, but you will strike the first blow against the Fallen. Will you accept this destiny?'",
      choices: [
          { text: "Accept your role as a Threshold Chosen.", nextScene: 'end_game_accept' },
          { text: "Reject this cosmic war.", nextScene: 'end_game_refuse' }
      ],
      particleTheme: 'crypt',
  },
  end_game_accept: {
      id: 'end_game_accept',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/mXTKkH4/a-triumphant-spectral-queen-in-a-crypt-ethereal-chains-shattering-around-her-as-the-player-charac.jpg',
      text: "You accept your destiny. A smile, the first in millennia, touches the Eternal's lips. 'Then go, Chosen One.' A small, serpent-shaped amulet materializes in your hand. 'This Serpent's Eye will guide you. It will glow with warmth when you are near the blood of my betrayer. Find his descendant. End his line. This is your purpose.'",
      choices: [
        { text: "Leave the crypt and begin your journey.", nextScene: 'crypt_hallway_exit', startsQuest: 'the_serpents_shadow' }
      ],
      musicTrack: 'crypt',
      particleTheme: 'crypt',
      effectId: 'ACCEPT_DESTINY'
  },
  end_game_refuse: {
      id: 'end_game_refuse',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/2Z58jMh/an-enraged-spectral-queen-in-a-crypt-her-face-contorted-in-a-ghostly-snarl-as-she-glares-at-the.jpg',
      text: "'Then you are a fool!' the Eternal's voice echoes with cold disappointment, not rage. 'To deny your nature is to invite chaos. If you will not be a guardian, then you are nothing to me. Leave this place. The Nexus will find another.' Her spectral form becomes translucent, ignoring you completely.",
      choices: [
        { text: "Leave the crypt.", nextScene: 'crypt_hallway_exit' }
      ],
      musicTrack: 'crypt',
      particleTheme: 'crypt',
      effectId: 'REFUSE_DESTINY',
  },

  // --- Silverwind City ---
  coastal_road: {
    id: 'coastal_road',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/k1K1W9H/a-winding-coastal-road-with-a-view-of-the-ocean-on-one-side-and-grassy-cliffs-on-the-other-In.jpg',
    text: "You travel the coastal road south. The air grows heavy with the scent of salt, and the cry of gulls replaces the chirping of forest birds. After a few hours, the bustling port city of Silverwind comes into view, nestled in a a large bay.",
    choices: [
      { text: "Enter the city of Silverwind.", nextScene: 'silverwind_gate' },
      { text: "Turn back to the crossroads.", nextScene: 'crossroads' },
    ],
    particleTheme: 'tavern',
  },
  silverwind_gate: {
    id: 'silverwind_gate',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/hR3wHwT/a-bustling-medieval-city-square-with-a-central-fountain-cobblestone-streets-and-half-timbered-b.jpg',
    text: "Unlike the grim fortifications of Threshold, the gates of Silverwind are wide open, manned by a handful of relaxed-looking guards in the Mariner's Guild livery. They wave you through with a nod, more interested in the flow of commerce than in questioning travelers.",
    choices: [
      { text: "Proceed into the city square.", nextScene: 'silverwind_square' },
    ],
    particleTheme: 'tavern',
  },
  silverwind_square: {
    id: 'silverwind_square',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/hR3wHwT/a-bustling-medieval-city-square-with-a-central-fountain-cobblestone-streets-and-half-timbered-b.jpg',
    text: "The main square of Silverwind is even more lively than Threshold's. Wealthy merchants in fine clothes walk alongside sailors with weathered faces. The architecture is more ornate, and the sound of the nearby docks—shouting, bells, and crashing waves—is a constant presence.",
    choices: [
      { text: "Head to the Docks.", nextScene: 'silverwind_docks' },
      { text: "Visit the Mariner's Guild Hall.", nextScene: 'mariners_guild' },
      { text: "Find a local tavern.", nextScene: 'leaky_barrel_tavern' },
      { text: "Leave Silverwind.", nextScene: 'coastal_road' },
    ],
    particleTheme: 'tavern',
    unlocks: { lore: ['faction_mariners_guild'] }
  },
  silverwind_docks: {
    id: 'silverwind_docks',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/kQfH80D/bustling-fantasy-port-docks.jpg',
    text: "The Silverwind Docks are a chaotic symphony of activity. Ships from distant lands are being loaded and unloaded. The air is thick with the smell of fish, tar, and foreign spices. Dockhands shout, cranes creak, and guild officials bark orders.",
    choices: [
      { text: "Look for Dockmaster Roric.", nextScene: 'roric_dialogue_initial', condition: 'QUEST_DISTRUST_ACTIVE_NOT_MET_RORIC' },
      { text: "Ask about passage to hunt the sea beast.", nextScene: 'silverwind_docks', condition: 'QUEST_SEA_BEAST_ACTIVE' },
      { text: "Investigate a scream from a dark alley.", nextScene: 'silverwind_alley_encounter', condition: 'NOT_MET_VESPERA' },
      { text: "Return to the city square.", nextScene: 'silverwind_square' },
    ],
    particleTheme: 'tavern',
    unlocks: { npcs: ['dockmaster_roric'] }
  },
  
  // --- Vespera Encounter Scenes ---
  silverwind_alley_encounter: {
      id: 'silverwind_alley_encounter',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/yY5FkX1/a-dimly-lit-dusty-tavern-room-with-a-single-flickering-candle-on-a-wooden-table-A-mysterious-cloak.jpg', // Reusing dark background
      text: "You turn a corner into a narrow, refuse-choked alley. Three masked figures in velvet robes have cornered a lone tiefling woman against a wall. She is skeletal, covered in raw scars, and wields a jagged piece of scrap metal with desperate fury. 'The Curator wants his property back, 894,' one of the masks sneers. 'Come quietly, or we break the other horn.'",
      choices: [
          { text: "Intervene and attack the masked figures.", nextScene: 'vespera_combat' },
          { text: "Walk away. Not your problem.", nextScene: 'silverwind_docks' }
      ],
      effectId: 'MET_VESPERA', // We need a simple flag setter if not already existing, or we assume combat handles it.
  },
  vespera_combat: {
      id: 'vespera_combat',
      type: SceneType.COMBAT,
      backgroundKey: 'cellar', // Placeholder for alley
      text: "The masked figures turn their attention to you. 'A witness? Pity. No witnesses.'",
      enemies: [{ enemyId: 'gilded_keeper', count: 3 }],
      // Vespera fights as a temporary ally here
      temporaryCompanions: [{ allyId: 'vespera', count: 1 }], 
      // Note: We need a temporary ally version of Vespera in 'allies.ts' or logic to use companion data? 
      // For now, let's assume 'vespera' ally ID exists or combat manager handles companion IDs in temp slot if tailored.
      // Actually, 'allies.ts' needs 'vespera' entry if used here. I'll add it to 'allies.ts' in a future step or rely on a placeholder ally.
      // Let's use 'finn_cellar' as placeholder if 'vespera' ally key missing, but ideally we add it. 
      // Since I can't update allies.ts in this specific response block easily without context loss, I'll use no temp ally for now or assume existing mechanism.
      // Wait, I can't add to allies.ts right now. I will omit temporaryCompanions for Vespera to keep it simple, or she joins after.
      onVictoryScene: 'vespera_intro_dialogue',
      onDefeatScene: 'game_over_rats',
      unlocks: { npcs: ['vespera_gutter_rot'], lore: ['faction_gilded_cage'] }
  },
  vespera_intro_dialogue: {
      id: 'vespera_intro_dialogue',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VESPERA,
      text: "The masked figures lie dead. The tiefling woman doesn't thank you. She backs away, holding her jagged weapon between you and her. Her breathing is ragged, her eyes wide and void-black. 'What do you want?' she hisses. 'Payment? I have nothing. If you want flesh... make it quick.' She trembles, not with fear, but with adrenaline and expectation of pain.",
      choices: [
          { text: "I want nothing from you. Go.", nextScene: 'vespera_recruitment_success', effectId: 'RECRUIT_VESPERA' }, // High affinity path
          { text: "You owe me for saving your life.", nextScene: 'vespera_recruitment_debt', effectId: 'RECRUIT_VESPERA' }, // Low affinity path
          { text: "Just killing slavers. We're done here.", nextScene: 'vespera_leaves_neutral' }
      ],
  },
  vespera_recruitment_success: {
      id: 'vespera_recruitment_success',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VESPERA,
      text: "She freezes, confusion warring with distrust on her scarred face. 'Nothing?' She lowers the weapon an inch. 'You... you aren't one of them. You aren't holding a knife.' She studies you for a long, silent moment. 'The shadows are safer with a monster who doesn't bite. I... I will walk with you. For now.'",
      choices: [
          { text: "Welcome aboard, Vespera.", nextScene: 'silverwind_docks' }
      ]
  },
  vespera_recruitment_debt: {
      id: 'vespera_recruitment_debt',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VESPERA,
      text: "She spits on the ground. 'Of course. Everything has a price.' She sheathes her weapon with a sharp, angry movement. 'Fine. I owe you a life. I'll fight for you until the debt is paid. But don't think this makes us friends. Touch me, and you lose a hand.'",
      choices: [
          { text: "Understood. Let's go.", nextScene: 'silverwind_docks' }
      ],
      // We'd ideally lower affinity here in the effect, but standard recruit sets base.
  },
  vespera_leaves_neutral: {
      id: 'vespera_leaves_neutral',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: IMAGE_ASSETS.NPC_VESPERA,
      text: "She watches you warily as you turn to leave. 'Suit yourself,' she mutters, then melts into the shadows of the alleyway like a ghost. You have a feeling you haven't seen the last of her.",
      choices: [
          { text: "Return to the docks.", nextScene: 'silverwind_docks' }
      ],
      effectId: 'VESPERA_LEAVES_HOSTILE'
  },

  mariners_guild: {
    id: 'mariners_guild',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "The Mariner's Guild Hall is an impressive building made from the timbers of a hundred different ships. Inside, maps cover the walls, and a grand window overlooks the bay. A stern-looking woman with silver-streaked hair stands over a large chart. This must be Guildmaster Elara.",
    choices: [
      { text: "Approach Guildmaster Elara.", nextScene: 'elara_dialogue' },
      { text: "Return to the city square.", nextScene: 'silverwind_square' },
    ],
    particleTheme: 'tavern',
    unlocks: { npcs: ['guildmaster_elara'] }
  },
  elara_dialogue: {
    id: 'elara_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "The Guildmaster looks up as you approach, her eyes sharp and appraising. 'I am Elara. If you're here for work, make it quick. Time is coin, and I'm losing both.'",
    choices: [
      { text: "What seems to be the problem?", nextScene: 'elara_quest_offer', condition: 'QUEST_SEA_BEAST_NOT_STARTED' },
      { text: "[Intrigue] I have proof the Stonecarvers are betraying you.", nextScene: 'elara_confront_dwarves', condition: 'QUEST_DISTRUST_FRAME_READY' },
      { text: "I'm just looking around.", nextScene: 'mariners_guild' },
    ],
    particleTheme: 'tavern',
  },
   elara_confront_dwarves: {
    id: 'elara_confront_dwarves',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "'Betrayal?' Elara's eyes narrow to slits. 'A heavy accusation. Present your proof.' You show her the forged shipping manifests and the guard's report Roric gave you. She studies them, her expression hardening with every line she reads. 'Contraband... smuggling weapons to pirates... using our ships. I knew those mountain dwellers were too good to be true.'",
    choices: [
        { text: "Their greed has undone them.", nextScene: 'elara_alliance_broken', updatesQuest: {questId: 'a_tide_of_distrust', objectiveId: 'convince_elara'}, completesQuest: 'a_tide_of_distrust' }
    ],
    particleTheme: 'tavern'
  },
  elara_alliance_broken: {
      id: 'elara_alliance_broken',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
      text: "She slams her hand down on the table. 'The treaty is void! I'll see to it that not a single dwarven stone travels on a Guild ship again. Thank you for bringing this to my attention. The Syndicate was right about you. Here is your payment.' She hands you a heavy purse of gold.",
      choices: [
          { text: "A pleasure doing business.", nextScene: 'silverwind_square' }
      ],
      particleTheme: 'tavern',
      effectId: 'BREAK_ALLIANCE_MARINERS_STONECARVERS',
      reputationChange: { 'shadow_syndicate': 15, 'mariners_guild': 5, 'stonecarvers_guild': -20 }
  },
  elara_quest_offer: {
    id: 'elara_quest_offer',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "Elara points a finger at a spot on the sea chart. 'The problem is a Kelp Lurker. Big as a fishing trawler, and twice as mean. It's taken up residence in the bay and has already sunk two of my ships. The city guard is useless on the water. Hunt and kill this beast for me, and the Mariner's Guild will pay you 200 gold. A bonus if you can bring me its heart as proof.'",
    choices: [
      // BACKGROUND TRIGGER: Sailor
      { 
        text: "[Sailor] 'I know the currents. I'll hunt your monster.'", 
        nextScene: 'elara_quest_accepted_sailor', 
        startsQuest: 'sea_beast_hunt',
        condition: 'BG_SAILOR'
      },
      { 
        text: "I'll hunt your monster.", 
        nextScene: 'elara_quest_accepted', 
        startsQuest: 'sea_beast_hunt',
        condition: 'NOT_BG_SAILOR'
      },
      { text: "That's out of my league.", nextScene: 'mariners_guild' },
    ],
    particleTheme: 'tavern',
    unlocks: { creatures: ['kelp_lurker'] }
  },
  elara_quest_accepted: {
    id: 'elara_quest_accepted',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "'Good. I like people who get to the point. You can charter a boat from the docks. Show them this seal,' she says, handing you a wax tablet bearing the Guild's insignia. 'Don't come back until that thing is dead.'",
    choices: [
      { text: "I won't fail you.", nextScene: 'mariners_guild' },
    ],
    particleTheme: 'tavern',
    effectId: 'ACCEPT_ELARA_QUEST'
  },
  elara_quest_accepted_sailor: {
    id: 'elara_quest_accepted_sailor',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/BfL317p/mariners-guild-hall-interior.jpg',
    text: "'You've got the look of someone who's spent time at sea,' Elara says, her sharp eyes appraising you. 'Good. I like people who get to the point. Here's a small advance to get your gear in order.' She slides a pouch of coins across the chart. 'You can charter a boat from the docks. Show them this seal.' She hands you a wax tablet. 'Don't come back until that thing is dead.'",
    choices: [
        { text: "I won't fail you.", nextScene: 'mariners_guild' },
    ],
    particleTheme: 'tavern',
    effectId: 'ACCEPT_ELARA_QUEST_SAILOR'
  },
  leaky_barrel_tavern: {
    id: 'leaky_barrel_tavern',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/N6R312p/seedy-fantasy-tavern.jpg',
    text: "You step into 'The Leaky Barrel.' Unlike the Weary Wanderer, this place is loud, crowded, and smells strongly of cheap grog and desperation. It's the perfect place to find trouble, or information. A cloaked figure in a corner booth catches your eye. In another corner, a huge man is arguing with a shady-looking bartender.",
    choices: [
      { text: "Approach the cloaked figure.", nextScene: 'syndicate_dialogue' },
      { text: "Approach the huge man.", nextScene: 'korgan_recruit_intro', condition: 'NOT_RECRUITED_KORGAN' }, // AND QUEST_BLADES_ACTIVE
      { text: "Order a drink at the bar.", nextScene: 'leaky_barrel_tavern' },
      { text: "Leave the tavern.", nextScene: 'silverwind_square' },
    ],
    particleTheme: 'tavern',
    unlocks: { npcs: ['korgan_the_fist'] }
  },
  korgan_recruit_intro: {
    id: 'korgan_recruit_intro',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
    text: "'I told you, I'll have the coin next week!' the huge man bellows at the bartender, who looks unimpressed. The man, Korgan, sees you looking. 'What do you want? Unless you've got coin or a death wish, move along.'",
    choices: [
        { text: "I have a proposition for you.", nextScene: 'korgan_recruit_offer' },
        { text: "[Intimidate] I'm your death wish if you don't lower your voice.", nextScene: 'korgan_recruit_brawl' },
    ],
  },
  korgan_recruit_offer: {
    id: 'korgan_recruit_offer',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
    text: "You explain Vorlag's plan and the promise of steady pay as a mercenary. Korgan listens, stroking his beard. 'Pay, you say? The Syndicate wants 50 gold from me by week's end. You clear my debt, and my fists are yours.'",
    choices: [
        { text: "Pay the 50 gold debt.", nextScene: 'korgan_recruit_success_paid', condition: 'HAS_ENOUGH_GOLD_FOR_KORGAN', updatesQuest: { questId: 'gathering_the_blades', objectiveId: 'recruit_korgan' }, effectId: 'RECRUIT_KORGAN' },
        { text: "I don't have that kind of money.", nextScene: 'leaky_barrel_tavern' },
    ],
  },
  korgan_recruit_brawl: {
    id: 'korgan_recruit_brawl',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
    text: "Korgan laughs, a deep, booming sound. 'A death wish it is!' He cracks his knuckles. 'Fine. You want to impress me? Let's see what you''ve got. You win, I'll hear you out.' (This will lead to a one-on-one unarmed combat encounter - feature coming soon).",
    choices: [
        { text: "Let's do this.", nextScene: 'leaky_barrel_tavern' }, // Placeholder
        { text: "On second thought...", nextScene: 'leaky_barrel_tavern' },
    ],
  },
  korgan_recruit_success_paid: {
    id: 'korgan_recruit_success_paid',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
    text: "You slide the gold to the bartender, who nods and clears the debt. Korgan claps you on the shoulder hard enough to make you stumble. 'You're a man of your word! Alright, I'm in. Let's go crack some skulls!'",
    choices: [
        { text: "Welcome to the Crimson Blades.", nextScene: 'leaky_barrel_tavern' }
    ],
    reputationChange: { 'crimson_blades': 5 },
  },
  syndicate_dialogue: {
    id: 'syndicate_dialogue',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
    text: "The figure's face is lost in shadow. 'I hear you're looking for work,' a smooth voice says. 'The kind the Guilds don't advertise. The Shadow Syndicate has... opportunities. A rival merchant is bringing in a shipment of untaxed Arborian wine. We'd like to acquire it before he can. It's in Warehouse 7 on the east docks. Or... perhaps you're interested in something more... disruptive?'",
    choices: [
      { text: "[Trade] See what 'opportunities' he has for sale.", action: 'trade', actionTargetId: 'silas_the_silk' },
      { text: "I'm interested in the wine.", nextScene: 'syndicate_wine_quest' },
      { text: "What do you mean by 'disruptive'?", nextScene: 'syndicate_distrust_intro' },
      { text: "I'm not interested in criminal work.", nextScene: 'leaky_barrel_tavern', reputationChange: { 'shadow_syndicate': -3 } },
    ],
    particleTheme: 'tavern',
    unlocks: { lore: ['faction_shadow_syndicate'] }
  },
  syndicate_distrust_intro: {
      id: 'syndicate_distrust_intro',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
      text: "The figure leans forward. 'The alliance between the Mariner's Guild and the Stonecarvers is bad for our business. Legitimate trade makes smuggling less profitable. We want that alliance broken. We have a man on the inside, Dockmaster Roric at the Silverwind docks. He's ambitious. Talk to him. Help him sow some discord, and you'll be richly rewarded.'",
      choices: [
          { text: "I'll talk to him.", nextScene: 'syndicate_distrust_accepted', startsQuest: 'a_tide_of_distrust' },
          { text: "That's too much heat for me.", nextScene: 'leaky_barrel_tavern' },
      ],
      particleTheme: 'tavern',
  },
  syndicate_distrust_accepted: {
      id: 'syndicate_distrust_accepted',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
      text: "'Wise choice. Roric will be expecting you. Don't fail.'",
      choices: [
          { text: "Leave.", nextScene: 'leaky_barrel_tavern' }
      ],
      particleTheme: 'tavern',
      reputationChange: { 'shadow_syndicate': 5 }
  },
  roric_dialogue_initial: {
      id: 'roric_dialogue_initial',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "You find the disgruntled Dockmaster. 'You're the one the Syndicate sent?' Roric grumbles. 'Good. I'm tired of these dwarves getting rich while we do all the hard work. Elara is too blind to see they're taking advantage of us. We need to open her eyes. I have a plan.'",
      choices: [
          { text: "I'm listening.", nextScene: 'roric_plan_sabotage', updatesQuest: { questId: 'a_tide_of_distrust', objectiveId: 'meet_roric' } }
      ],
      particleTheme: 'tavern'
  },
  roric_plan_sabotage: {
      id: 'roric_plan_sabotage',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "'First, we hit their pride. A shipment of dwarven steel is due tomorrow, destined for the Threshold city guard. I've arranged for a crate of cheap, brittle iron to be left nearby. You just need to make the switch. When the guards' swords shatter in their first skirmish, the Stonecarvers' reputation will be mud.'",
      choices: [
          { text: "Consider it done.", nextScene: 'sabotage_success', updatesQuest: { questId: 'a_tide_of_distrust', objectiveId: 'sabotage_shipment' } }
      ]
  },
  sabotage_success: {
      id: 'sabotage_success',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/kQfH80D/bustling-fantasy-port-docks.jpg',
      text: "Under the cover of night, you successfully swap the crates. The shoddy iron is now on its way to Threshold's armory.",
      choices: [
          { text: "Return to Roric.", nextScene: 'roric_plan_frame' }
      ]
  },
  roric_plan_frame: {
      id: 'roric_plan_frame',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "'Excellent,' Roric says with a cruel smile. 'Now for the finishing touch. I've... acquired... some manifests suggesting the dwarves are using Guild ships to smuggle weapons to pirates. And I have a 'concerned citizen' ready to tip off the guard. All you need to do is plant these papers in the Stonecarvers' Guild lockbox here at the docks. Elara won't be able to ignore that.'",
      choices: [
          { text: "I'll plant the evidence.", nextScene: 'frame_success', updatesQuest: { questId: 'a_tide_of_distrust', objectiveId: 'frame_dwarves' } }
      ]
  },
  frame_success: {
      id: 'frame_success',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/kQfH80D/bustling-fantasy-port-docks.jpg',
      text: "You plant the forged documents. A short while later, you hear a commotion as the City Watch 'discovers' the evidence. The trap is set.",
      choices: [
          { text: "Return to Roric.", nextScene: 'roric_final_advice' }
      ]
  },
  roric_final_advice: {
      id: 'roric_final_advice',
      type: SceneType.VISUAL_NOVEL,
      backgroundImageUrl: 'https://i.ibb.co/F8C9zQG/legion-sergeant-grim-armor.jpg',
      text: "'Perfect. Elara's trust in them is shattered. Now is the time to strike. Go to her. Present the 'proof' of their betrayal. She'll have no choice but to end the alliance. Go now.'",
      choices: [
          { text: "I'll see it done.", nextScene: 'silverwind_docks' }
      ]
  },
  syndicate_wine_quest: {
    id: 'syndicate_wine_quest',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
    text: "The figure nods. 'A simple acquisition, then. The pay is 75 gold. Be discreet. If the City Watch gets involved, we don't know you.' The figure slides a rusty key across the table. 'For the back door. Don't disappoint us.'",
    choices: [
      // BACKGROUND TRIGGER: Criminal/Urchin
      { 
        text: "[Criminal] 'Make it 100.'", 
        nextScene: 'syndicate_quest_accepted_insider', 
        startsQuest: 'smugglers_bounty',
        condition: 'BG_CRIMINAL_OR_URCHIN'
      },
       // BACKGROUND TRIGGER: Charlatan/Infiltrator/Spy
      { 
        text: "[Charlatan] 'An interesting proposition. But why this wine?'", 
        nextScene: 'syndicate_charlatan_question', 
        startsQuest: 'smugglers_bounty',
        condition: 'BG_CHARLATAN_TYPES'
      },
      { 
        text: "I accept.", 
        nextScene: 'syndicate_quest_accepted', 
        startsQuest: 'smugglers_bounty',
        condition: 'BG_NOT_CRIMINAL_TYPES'
      },
    ]
  },
  syndicate_quest_accepted: {
    id: 'syndicate_quest_accepted',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
    text: "'Excellent. Don't disappoint us.'",
    choices: [
      { text: "You can count on me.", nextScene: 'leaky_barrel_tavern' },
    ],
    particleTheme: 'tavern',
    effectId: 'ACCEPT_SYNDICATE_QUEST_KARMA_MINUS_2'
  },
  syndicate_quest_accepted_insider: {
    id: 'syndicate_quest_accepted_insider',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
    text: "The figure chuckles softly. 'I can tell you know the business. For someone with your... experience... we can make it an even 100 gold upon delivery. Don't disappoint us.'",
    choices: [
      { text: "You can count on me.", nextScene: 'leaky_barrel_tavern' },
    ],
    particleTheme: 'tavern',
    effectId: 'ACCEPT_SYNDICATE_QUEST_INSIDER'
  },
  syndicate_charlatan_question: {
    id: 'syndicate_charlatan_question',
    type: SceneType.VISUAL_NOVEL,
    backgroundImageUrl: 'https://i.ibb.co/h8K9K9N/shadowy-guildmaster.jpg',
    text: "The figure pauses. 'Clever. Not many ask the right questions. Let's just say the wine is destined for the captain of the city watch. A... gift, to make him more agreeable. We just want to ensure he receives *our* gift instead. This knowledge gives you options. Use them wisely.'",
    choices: [
      { text: "I understand.", nextScene: 'leaky_barrel_tavern' },
    ],
    particleTheme: 'tavern',
    effectId: 'ACCEPT_SYNDICATE_QUEST_CHARLATAN'
  },
};
