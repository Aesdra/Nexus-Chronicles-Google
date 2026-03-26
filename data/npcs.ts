

import { NPCData } from '../types';
import { IMAGE_ASSETS } from './assets';

export const NPCS: Record<string, NPCData> = {
    brom_barkeep: {
        id: 'brom_barkeep',
        name: 'Brom',
        description: `The owner and barkeep of the 'Weary Wanderer' tavern. He is a large, burly man with a quiet disposition, but his eyes reveal a depth of knowledge about the local area and its many secrets. He seems to know more than he lets on about the strange happenings in the region.`,
        imageUrl: IMAGE_ASSETS.NPC_BROM,
        role: 'Tavern Keeper & Informant',
        faction: 'Local Populace (Ex-Crimson Blades)',
        factionId: 'local_populace',
        attitude: 20,
        inventory: [
            { itemId: 'potion-of-healing', stock: 5 },
            { itemId: 'leather-armor', stock: 1 },
            { itemId: 'rusty-sword', stock: 2 },
        ]
    },
    lyra_ranger: {
        id: 'lyra_ranger',
        name: 'Lyra',
        description: `A pragmatic and skilled ranger sworn to the Guardians of the Threshold. Lyra is a capable survivalist and archer, tasked with aiding the Threshold Chosen. She is focused and mission-oriented, but possesses a strong sense of loyalty to her cause and companions.`,
        imageUrl: IMAGE_ASSETS.NPC_LYRA,
        role: 'Companion & Guardian Agent',
        faction: 'Guardians of the Threshold',
        factionId: 'guardians_of_the_threshold',
    },
    finn_cellar_boy: {
        id: 'finn_cellar_boy',
        name: 'Finn',
        description: `The young, nervous cellar boy at the 'Weary Wanderer' tavern. He seems easily frightened but is good-hearted.`,
        imageUrl: IMAGE_ASSETS.NPC_FINN,
        role: 'Cellar Boy',
        faction: 'Local Populace',
        factionId: 'local_populace',
    },
    silent_herald: {
        id: 'silent_herald',
        name: 'The Silent Herald',
        description: `A mysterious, cowled figure who serves as a messenger and guide for the Guardians of the Threshold. They appear only when great events are in motion, setting the Chosen on their path. Their true identity and nature are unknown.`,
        imageUrl: IMAGE_ASSETS.NPC_HERALD,
        role: 'Mysterious Guide',
        faction: 'Guardians of the Threshold',
        factionId: 'guardians_of_the_threshold',
    },
    serpent_queen_eternal: {
        id: 'serpent_queen_eternal',
        name: 'The Serpent Queen',
        description: `An ancient, powerful being known as an Eternal, a guardian of cosmic balance. Betrayed during the Interdimensional War, she has been imprisoned within the Whispering Crypt for millennia. She seeks a champion to free her and restore balance to the multiverse.`,
        imageUrl: IMAGE_ASSETS.NPC_QUEEN,
        role: 'Imprisoned Eternal',
        faction: 'Eternals',
        factionId: 'guardians_of_the_threshold', // Aligned with Guardians
    },
    kaelen_vance: {
        id: 'kaelen_vance',
        name: 'Kaelen Vance',
        description: `A veteran warrior of the Guardians of the Threshold, Kaelen is Lyra's mentor and a seasoned field commander. His face is a roadmap of scars from countless battles across different dimensions. While he appears aloof and weary, he possesses an unshakeable resolve and a deep-seated hatred for the Fallen. He is a master strategist and swordsman, but the long war has taken its toll, leaving him cynical and wary of newcomers. He is fiercely protective of his charges, especially Lyra.`,
        imageUrl: IMAGE_ASSETS.NPC_KAELEN,
        role: 'Guardian Commander & Mentor',
        faction: 'Guardians of the Threshold',
        factionId: 'guardians_of_the_threshold',
    },
    lord_malakor: {
        id: 'lord_malakor',
        name: 'Lord Malakor',
        description: `A high-ranking general of the Fallen, Malakor was once a celebrated Eternal who believed in imposing absolute order upon the multiverse. His fall from grace was born of impatience and arrogance, believing the 'chaos' of free will was a flaw to be corrected. Now, he is a being of immense power and cruelty, clad in obsidian armor that seems to drink the light. He is the one who betrayed and imprisoned the Serpent Queen, and his bloodline unknowingly maintains her chains. He is a master of corruption, turning heroes into his pawns and twisting realities to his will.`,
        imageUrl: IMAGE_ASSETS.NPC_MALAKOR,
        role: 'General of the Fallen & Antagonist',
        faction: 'The Fallen',
        factionId: 'the_fallen',
    },
    the_curator: {
        id: 'the_curator',
        name: 'The Curator',
        description: `A nightmarish figure who leads the Gilded Cage. He conceals his true form beneath powerful illusion magic and opulent velvet robes. Rumors suggest he is not merely undead, but a parasitic consciousness that hops between "perfected" bodies, discarding them when they show the slightest sign of age or flaw. To him, living beings are simply clay to be fired, painted, and broken.`,
        imageUrl: 'https://placehold.co/64x64/000000/FFFFFF?text=Curator', // Placeholder
        role: 'Leader of The Gilded Cage',
        faction: 'The Sodality of the Gilded Cage',
        factionId: 'the_gilded_cage',
    },
    borin_ironhand: {
        id: 'borin_ironhand',
        name: 'Borin Ironhand',
        description: `The finest blacksmith this side of the Dragon's Tooth mountains. Borin is a mountain dwarf of few words and a temper as hot as his forge. His creations are legendary, said to be imbued with the resilience of the mountain itself. He lost his clan hold to a dimensional rift decades ago and now harbors a deep distrust of all things magical and otherworldly. Despite his gruff exterior, he values integrity and quality above all else, and might be persuaded to craft powerful gear for a worthy champion.`,
        imageUrl: IMAGE_ASSETS.NPC_BORIN,
        role: 'Master Blacksmith',
        faction: 'The Stonecarvers\' Guild',
        factionId: 'stonecarvers_guild',
        attitude: 10,
        inventory: [
            { itemId: 'longsword-of-the-legion', stock: 1 },
            { itemId: 'aegis-of-the-devout', stock: 1 },
        ],
        factionRankInventory: {
            'Friend-of-the-Forge': [
                { itemId: 'greatsword-of-the-peaks', stock: 1 },
            ],
            'Venerated': [
                { itemId: 'barbarians-greataxe', stock: 1 },
            ]
        }
    },
    elara_meadowlight: {
        id: 'elara_meadowlight',
        name: 'Elara Meadowlight',
        description: `An elven Loremaster and archivist who resides in the hidden library of Silverwood. Elara has dedicated her long life to studying the Interdimensional War and the nature of the Dimensional Gates. She is one of the few mortals who understands the true scale of the conflict. As a member of the Circle of Weavers, she believes knowledge is the key to controlling reality, not simply preserving it. She offers her wisdom cautiously, aware that knowledge can be as dangerous as any sword.`,
        imageUrl: IMAGE_ASSETS.NPC_ELARA_LORE,
        role: 'Loremaster & Weaver Archivist',
        faction: 'The Circle of Weavers',
        factionId: 'circle_of_weavers',
    },
    xylos_merchant: {
        id: 'xylos_merchant',
        name: 'Xylos',
        description: `A charismatic and enigmatic tiefling merchant who deals in 'curiosities' from other dimensions. His wares are exotic and powerful, but always come with a steep and often non-monetary price. As a high-ranking agent of the Silver Consortium, his true allegiance is to profit. He operates on the fringes of society, equally at home in a bustling marketplace or a shadowed alley. Dealing with Xylos is always a gamble; he may offer the very item you need to save the world, or a cursed artifact that will seal your doom.`,
        imageUrl: IMAGE_ASSETS.NPC_XYLOS,
        role: 'Interdimensional Merchant',
        faction: 'The Silver Consortium',
        factionId: 'silver_consortium',
        attitude: 5,
        inventory: [
            { itemId: 'potion-of-healing', stock: -1 }, // -1 for infinite
            { itemId: 'potion-of-mana', stock: -1 },
            { itemId: 'potion-of-stamina', stock: -1 },
            { itemId: 'elven-chainmail', stock: 1 },
            { itemId: 'tome-of-clear-thought', stock: 1 },
            { itemId: 'grimoire-of-the-pact', stock: 1 },
            { itemId: 'amulet-of-shielding', stock: 1 },
        ]
    },
    sergeant_valerius: {
        id: 'sergeant_valerius',
        name: 'Sergeant Valerius',
        description: `A grim human warrior of the Legion of the Shattered Aegis, currently serving as a Sergeant in the Threshold City Watch. His face is perpetually locked in a scowl, and his plate armor is scarred and blackened. Valerius is a man of action, not words. He lost his family to a demonic incursion and now lives only to maintain order and protect the innocent within the city walls.`,
        imageUrl: IMAGE_ASSETS.NPC_VALERIUS,
        role: 'Sergeant, Threshold City Watch',
        faction: 'The Legion of the Shattered Aegis',
        factionId: 'legion_of_the_shattered_aegis',
    },
    whispering_zealot: {
        id: 'whispering_zealot',
        name: 'Whispering Zealot',
        description: `A devotee of the Children of the Echo. Their face is always hidden by a deep hood, and their voice is a sibilant whisper that seems to slither into the mind. They speak in cryptic prophecies of a coming 'silence' that will end all suffering. They are fanatically loyal to the Fallen and will sacrifice themselves without a second thought to further their masters' goals. To encounter one is to touch the edge of madness.`,
        imageUrl: IMAGE_ASSETS.NPC_ZEALOT,
        role: 'Cultist',
        faction: 'The Children of the Echo',
        factionId: 'children_of_the_echo',
    },
    high_templar_gaius: {
        id: 'high_templar_gaius',
        name: 'High Templar Gaius',
        description: `The stern, unwavering commander of the Lumeni Imperium's local garrison. Clad in ornate, sun-crested plate armor, Gaius is the embodiment of the Imperium's zealous authority. He is a devout follower of Luxos, viewing all arcane magic as heresy and all non-humans with suspicion. He is not necessarily evil, but his rigid dogma and absolute belief in his cause make him a dangerous and uncompromising obstacle to any who do not conform to his worldview.`,
        imageUrl: IMAGE_ASSETS.NPC_GAIUS,
        role: 'Templar Commander',
        faction: 'The Lumeni Imperium',
        factionId: 'lumeni_imperium',
    },
    silas_the_silk: {
        id: 'silas_the_silk',
        name: 'Silas "The Silk"',
        description: `The enigmatic guildmaster of the local Shadow Syndicate branch. No one has seen his true face, as he always appears shrouded in illusion or cloaked in shadow. Silas is a master of information, a puppeteer who pulls the strings of politicians and merchants alike. He is pragmatic and utterly amoral, valuing loyalty and competence above all else. He respects talent, regardless of its origin, and is always looking for new pawns... or partners.`,
        imageUrl: IMAGE_ASSETS.NPC_SILAS,
        role: 'Guildmaster',
        faction: 'The Shadow Syndicate',
        factionId: 'shadow_syndicate',
        inventory: [
            { itemId: 'potion-of-stamina', stock: 5 },
            { itemId: 'fine-dagger', stock: 2 },
        ],
        factionRankInventory: {
            'Agent': [
                { itemId: 'venomous-dagger', stock: 1 },
            ],
            'Mastermind': [
                { itemId: 'hexblades-shadow-touched-blade', stock: 1 },
            ]
        }
    },
    captain_vorlag: {
        id: 'captain_vorlag',
        name: 'Captain Vorlag',
        description: `A battle-hardened orc and the self-proclaimed captain of the new Crimson Blades. Vorlag is a cunning tactician who dreams of restoring the mercenary company to its former glory. He possesses the name and the will, but currently lacks the manpower and reputation. He sees the recovery of the company's legendary banner as a sign, and you as the key to its future.`,
        imageUrl: IMAGE_ASSETS.NPC_VORLAG,
        role: 'Mercenary Captain',
        faction: 'The Crimson Blades',
        factionId: 'crimson_blades',
    },
    scavenger_rival: {
        id: 'scavenger_rival',
        name: 'The Scavenger',
        description: 'A grim, pragmatic warrior and a former member of a rival company that was wiped out by the old Crimson Blades. He believes the banner is a symbol of death and destruction that should stay buried, and he will stop at nothing to see the legend die for good.',
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        role: 'Rival Mercenary',
        faction: 'Unaffiliated',
        factionId: 'local_populace',
    },
    blades_quartermaster: {
        id: 'blades_quartermaster',
        name: 'Blades Quartermaster',
        description: 'A pragmatic quartermaster for the resurgent Crimson Blades. She handles the company\'s gear and supplies.',
        imageUrl: IMAGE_ASSETS.RACE_HALFLING, // Placeholder
        role: 'Merchant',
        faction: 'The Crimson Blades',
        factionId: 'crimson_blades',
        attitude: 30,
        inventory: [
            { itemId: 'potion-of-healing', stock: 10 },
            { itemId: 'potion-of-stamina', stock: 10 },
            { itemId: 'longsword-of-the-legion', stock: 2 },
        ],
        factionRankInventory: {
            'Blade': [ { itemId: 'mercenarys-plate', stock: 1 } ],
            'Veteran': [ { itemId: 'vorlags-battleaxe', stock: 1 } ],
        }
    },
    korgan_the_fist: {
        id: 'korgan_the_fist',
        name: 'Korgan "The Fist"',
        description: `A massive human brawler and ex-gladiator. His strength is undeniable, but a string of bad luck and worse gambling has left him indebted to the Shadow Syndicate in Silverwind. He's a man of simple needs: a good fight, a full mug, and a clear debt.`,
        imageUrl: IMAGE_ASSETS.RACE_HUMAN, // Placeholder
        role: 'Brawler',
        faction: 'Unaffiliated',
        factionId: 'local_populace',
    },
    elara_hawkeye: {
        id: 'elara_hawkeye',
        name: 'Elara "Hawkeye"',
        description: `A young, sharp-eyed wood elf serving as a watchwoman on the walls of Threshold. She finds her duties dull and yearns for the thrill of the hunt in the untamed wilds. Her skill with a bow is said to be unmatched, but she has yet to be truly tested.`,
        imageUrl: IMAGE_ASSETS.RACE_ELF, // Placeholder
        role: 'Scout',
        faction: 'Unaffiliated',
        factionId: 'local_populace',
    },
    ysera_windwhisper: {
        id: 'ysera_windwhisper',
        name: 'Ysera Windwhisper',
        description: `The Archdruid of the nearby ancient forest and a prominent elder in the Verdant Wardens. An ancient elf who has seen empires rise and fall, Ysera's patience has worn thin with the encroachments of civilization. She is the voice of the forest, and her judgment can be as sudden as a lightning strike or as slow as a creeping vine. She is wary of all outsiders, viewing them as potential threats to her sacred groves, but might be reasoned with if one can prove they respect the natural order.`,
        imageUrl: IMAGE_ASSETS.NPC_YSERA,
        role: 'Archdruid',
        faction: 'The Verdant Wardens',
        factionId: 'verdant_wardens',
    },
    guildmaster_elara: {
        id: 'guildmaster_elara',
        name: 'Guildmaster Elara',
        description: `The head of the Silverwind Mariner's Guild. A woman in her late fifties with sharp eyes and silver-streaked hair tied back in a severe bun. She is pragmatic, no-nonsense, and deeply concerned with the Guild's profits and the safety of her crews. She has no time for magic or prophecies, trusting only in sturdy ships, reliable maps, and cold, hard coin.`,
        imageUrl: IMAGE_ASSETS.NPC_ELARA_GUILD,
        role: 'Guildmaster',
        faction: "The Mariner's Guild",
        factionId: 'mariners_guild',
    },
    dockmaster_roric: {
        id: 'dockmaster_roric',
        name: 'Dockmaster Roric',
        description: `The dockmaster for Silverwind's eastern wharf. A grizzled man with a permanent scowl, Roric is ambitious and feels the Mariner's Guild is getting a raw deal in their alliance with the dwarves.`,
        imageUrl: IMAGE_ASSETS.NPC_VALERIUS, // Using placeholder
        role: 'Dockmaster',
        faction: "The Mariner's Guild",
        factionId: 'mariners_guild',
    },
    vespera_gutter_rot: {
        id: 'vespera_gutter_rot',
        name: "Vespera 'Gutter-Rot' Thorne",
        description: "Skeletal and harrowing. Her ash-grey skin is mapped with weeping chemical burn scars—self-inflicted with lye to erase the memory of touch. Her left horn is jaggedly sawn off at the skull. Her eyes are solid, void-black. She wears 'armor' cobbled together from refuse: sharp scrap metal, broken glass, and rusted barbed wire wrapped around her limbs to injure anyone who attempts to grab her. She smells of harsh disinfectant and stale narcotics.",
        imageUrl: IMAGE_ASSETS.NPC_VESPERA,
        role: 'Companion',
        faction: 'Unaffiliated', // Formerly property of 'The Gilded Cage', now an outcast.
        factionId: 'local_populace',
        attitude: -20, // Starts distrustful
        inventory: [
            { itemId: 'milk-of-the-poppy', stock: 5 },
            { itemId: 'charred-finger-bones', stock: 1 },
            { itemId: 'the-mercy', stock: 1 },
        ]
    },
    cipher_the_shade: {
        id: 'cipher_the_shade',
        name: 'Cipher',
        description: 'A hooded figure lurking in the deepest shadows of Threshold\'s alleys. He claims to know the "words of power" that can bend reality itself. Some say he is a madman; others say he is an avatar of a forgotten trickster god.',
        imageUrl: IMAGE_ASSETS.NPC_HERALD, // Placeholder using Herald image
        role: 'Keeper of Secrets',
        faction: 'Unaffiliated',
        factionId: 'local_populace',
    }
};
