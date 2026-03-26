
import { Faction } from '../types';

export const FACTIONS: Faction[] = [
  {
    id: 'guardians_of_the_threshold',
    name: 'Guardians of the Threshold',
    description: 'A clandestine order dedicated to maintaining the delicate balance of the multiverse by protecting the Dimensional Gates from those who would exploit or destroy them.',
    motives: 'Preservation of reality, duty to a forgotten cosmic order, protection of innocent lives across all dimensions.',
    goals: 'Monitor and stabilize Dimensional Gates. Recruit and guide Threshold Chosen. Counter the influence of the Fallen and other destabilizing forces.',
    beliefs: 'Balance is paramount. The chaos of the multiverse is a natural state that must be protected, not controlled. Direct intervention should be a last resort.',
    hierarchy: 'Led by a council of unseen master Guardians. Field agents like the Silent Heralds act as messengers, while operatives like Lyra and Kaelen Vance carry out missions.',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/3a5a40/dad7cd?text=G',
    rank: 'major',
    relations: {
        allies: [],
        enemies: ['the_fallen', 'children_of_the_echo']
    }
  },
  {
    id: 'the_fallen',
    name: 'The Fallen',
    description: 'Once Eternals, these powerful beings now seek to impose their own twisted order upon all existence. They are the primary antagonists in the cosmic war.',
    motives: 'Desire for absolute control, belief in their own superiority, and a twisted sense of order that requires the subjugation of all free will.',
    goals: 'Corrupt or destroy other Eternals. Seize control of all Dimensional Gates. Remake the multiverse into a single, unchanging reality under their dominion.',
    beliefs: 'Free will is a flaw. Chaos is a disease. Only through absolute, unwavering order can the multiverse achieve perfection. Suffering is a necessary tool for purification.',
    hierarchy: 'A pantheon of god-like generals, such as Lord Malakor, each commanding legions of corrupted beings and mortal cultists.',
    joinable: false,
    iconUrl: 'https://placehold.co/64x64/8c2f39/ffc857?text=F',
    rank: 'major',
    relations: {
        allies: ['children_of_the_echo'],
        enemies: ['guardians_of_the_threshold']
    }
  },
  {
    id: 'silver_consortium',
    name: 'The Silver Consortium',
    description: 'A vast, interdimensional merchant guild that profits from chaos and opportunity. They are officially neutral, trading with anyone for the right price.',
    motives: 'Acquisition of wealth, power, and rare commodities, utilizing any means necessary—be it interdimensional trade, political manipulation, or wartime profiteering.',
    goals: 'Establish secure trade routes through stable gates. Monopolize the market on rare goods. Gain enough wealth and influence to rival kingdoms and cosmic powers.',
    beliefs: 'Everything has a price. Morality is a luxury, and loyalty is a commodity. The only truly sacred thing is a signed contract.',
    hierarchy: 'Governed by a board of directors. Operations are handled by trade princes and contracted agents like the merchant Xylos.',
    joinable: false,
    iconUrl: 'https://placehold.co/64x64/7d7c7c/f2f2f2?text=SC',
    rank: 'major',
    relations: {
        allies: [],
        enemies: ['shadow_syndicate']
    }
  },
  {
    id: 'legion_of_the_shattered_aegis',
    name: 'The Legion of the Shattered Aegis',
    description: 'A hardened military order of survivors from worlds destroyed by dimensional rifts. They are zealous and uncompromising in their mission to purge all perceived threats to their reality.',
    motives: 'Vengeance, a deep-seated fear of the unknown, and a fanatical desire to protect their reality from any and all outside influence.',
    goals: 'Destroy any unstable Dimensional Gates they find. Hunt down and exterminate all beings of extra-dimensional origin. Suppress unsanctioned magic.',
    beliefs: 'The only good anomaly is a dead anomaly. Diplomacy is weakness. Strength and purity of purpose are the only virtues. Their zealotry has grown, and many now view any powerful, unsanctioned magic or non-human influence as a potential dimensional threat, leading to persecution of mages and xenophobia.',
    hierarchy: 'A strict military command structure led by a Lord Commander. Field units are led by officers like Sergeant Valerius.',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/9d2c22/f8d2d0?text=LA',
    rank: 'major',
    relations: {
        allies: ['lumeni_imperium'],
        enemies: ['shadow_syndicate', 'the_fallen', 'children_of_the_echo', 'shattered_hand']
    }
  },
  {
    id: 'lumeni_imperium',
    name: 'The Lumeni Imperium',
    description: 'A powerful, expansionist theocracy that worships a sun deity. The Imperium is human-centric and deeply suspicious of arcane magic and non-human races.',
    motives: 'Religious conversion, territorial expansion, and the enforcement of their divine law. They seek to bring "enlightenment" to the entire continent. They are deeply suspicious of arcane magic, which they view as heretical, and are openly hostile towards non-human races, seeing them as "unclean" or soulless.',
    goals: 'Unify the continent under the banner of their Sun God. Suppress or control all forms of arcane magic. Purge "heretical" beliefs and "unclean" races.',
    beliefs: 'Their Sun God, Luxos, is the one true deity and the source of all legitimate power. Humans are his chosen people. Divine magic is a gift; arcane magic is a corrupting pact with darkness.',
    hierarchy: 'Ruled by a divine Emperor. A council of High Priests and inquisitors enforces religious law, while legions of Templars expand its borders.',
    joinable: false,
    iconUrl: 'https://placehold.co/64x64/fbbF24/fef9c3?text=LI',
    rank: 'major',
    relations: {
        allies: ['legion_of_the_shattered_aegis'],
        enemies: ['shattered_hand', 'shadow_syndicate']
    }
  },
  {
    id: 'shadow_syndicate',
    name: 'The Shadow Syndicate',
    description: 'A sprawling criminal organization that operates in the shadows of major cities. They control the black market, smuggling rings, and a network of spies and assassins.',
    motives: 'Wealth and influence within urban centers. They thrive in the cracks of society, exploiting local corruption and needs.',
    goals: 'Maintain a monopoly on illicit trade within key cities. Control local political figures through blackmail and bribery. Eliminate rivals and protect their operations.',
    beliefs: 'Coin is king. Loyalty is a transaction. Secrets are more valuable than gold. Order and law are just obstacles to be navigated.',
    hierarchy: 'A shadowy guildmaster known only as "The Silk" sits at the top. Below are various lieutenants controlling different territories and operations (theft, assassination, smuggling).',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/4a4a4a/a3a3a3?text=SS',
    rank: 'lesser',
    relations: {
        allies: ['shattered_hand'],
        enemies: ['lumeni_imperium', 'legion_of_the_shattered_aegis', 'mariners_guild']
    },
    ranks: [
      { name: 'Outsider', reputationThreshold: -100 },
      { name: 'Neutral', reputationThreshold: 0 },
      { name: 'Asset', reputationThreshold: 10 },
      { name: 'Agent', reputationThreshold: 25 },
      { name: 'Shadow', reputationThreshold: 50 },
      { name: 'Mastermind', reputationThreshold: 75 },
    ]
  },
  {
    id: 'crimson_blades',
    name: 'The Crimson Blades',
    description: 'A once-renowned mercenary company fallen on hard times, now seeking to rebuild its name. Known for their brutal effectiveness and adherence to contracts.',
    motives: 'Gold, glory, and the bonds of camaraderie. They are soldiers of fortune who sell their martial prowess to the highest bidder.',
    goals: 'To be the most respected and feared mercenary company in the land. To fulfill every contract to the letter. To ensure their members are well-paid and well-equipped.',
    beliefs: 'A contract is a sacred bond. One\'s word is one\'s honor. Loyalty is to the company and the coin that pays them. A sharp sword solves more problems than a lengthy debate.',
    hierarchy: 'Led by a Mercenary Captain, with sergeants commanding individual squads. Reputation and skill determine rank.',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/b91c1c/fecaca?text=CB',
    rank: 'lesser',
    relations: {
        allies: [],
        enemies: []
    },
    ranks: [
      { name: 'Outsider', reputationThreshold: -100 },
      { name: 'Neutral', reputationThreshold: 0 },
      { name: 'Hopeful', reputationThreshold: 5 },
      { name: 'Recruit', reputationThreshold: 15 },
      { name: 'Blade', reputationThreshold: 30 },
      { name: 'Veteran', reputationThreshold: 50 },
      { name: 'Honored', reputationThreshold: 75 },
    ]
  },
  {
    id: 'stonecarvers_guild',
    name: 'The Stonecarvers\' Guild',
    description: 'A powerful and ancient guild of artisans, miners, and architects (predominantly dwarves) who hold a monopoly on stonework and quarrying. They are a major economic power focused on quality, tradition, and protecting their trade secrets.',
    motives: 'Maintaining their economic dominance, preserving the ancient craft of their ancestors, and upholding the integrity of their work.',
    goals: 'Control the trade of all stone, metal, and precious gems. Construct enduring monuments and impregnable fortresses for wealthy clients. Fiercely protect their guild\'s secret techniques.',
    beliefs: 'True quality endures for eternity, unlike fleeting power or politics. The mountain provides all that is needed. A deal sealed in stone is unbreakable.',
    hierarchy: 'Led by a Guildmaster, a position earned through unparalleled skill. Master artisans oversee different disciplines (mining, masonry, smithing). Apprentices must toil for decades to earn the rank of journeyman.',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/6b7280/e5e7eb?text=SG',
    rank: 'lesser',
    relations: {
        allies: ['mariners_guild'],
        enemies: []
    },
    ranks: [
      { name: 'Stranger', reputationThreshold: -100 },
      { name: 'Neutral', reputationThreshold: 0 },
      { name: 'Client', reputationThreshold: 10 },
      { name: 'Friend-of-the-Forge', reputationThreshold: 25 },
      { name: 'Stone-Sworn', reputationThreshold: 50 },
      { name: 'Venerated', reputationThreshold: 75 },
    ]
  },
  {
    id: 'mariners_guild',
    name: 'The Mariner\'s Guild',
    description: 'The lifeblood of coastal trade, the Mariner\'s Guild is a powerful consortium of ship captains, merchants, and dockworkers who control the sea lanes.',
    motives: 'Profit, the expansion of sea trade, and the protection of their members and assets from maritime threats.',
    goals: 'Chart new, safe sea routes. Eliminate pirate threats and dangerous sea creatures. Maintain a monopoly on shipping and tariffs in key port cities like Silverwind.',
    beliefs: 'The sea is a cruel mistress, but a generous one to those who respect her power. A signed charter is as binding as an oath. There is no problem that cannot be solved with enough ships, sailors, and coin.',
    hierarchy: 'Led by a Guildmaster who oversees all operations. Port Masters manage individual cities, while Ship Captains are given significant autonomy on the open sea.',
    joinable: true,
    iconUrl: 'https://placehold.co/64x64/0e7490/a5f3fc?text=MG',
    rank: 'lesser',
     relations: {
        allies: ['stonecarvers_guild'],
        enemies: ['shadow_syndicate']
    }
  },
  {
    id: 'the_gilded_cage',
    name: 'The Sodality of the Gilded Cage',
    description: 'A clandestine and high-end trafficking ring that masquerades as an exclusive social club. Originally founded as the "Auspice of Vanity", they believe true freedom lies in the total domination of another\'s will.',
    motives: 'Profit, blackmail, and the exercise of absolute power over others.',
    goals: 'To maintain their network of influence among the elite while remaining invisible to the public eye. To acquire unique and exotic "specimens" for their clientele.',
    beliefs: 'Sentient beings are merely clay to be sculpted for the pleasure of their betters. Morality is a shackle for the poor.',
    hierarchy: 'Run by a mysterious inner circle known as the "Sculptors." They employ slavers, magical surgeons, and enforcers to carry out their work.',
    joinable: false,
    iconUrl: 'https://placehold.co/64x64/b91c1c/000000?text=GC',
    rank: 'lesser',
    relations: {
        allies: [],
        enemies: ['guardians_of_the_threshold'] // Natural enemies of freedom
    }
  },
   {
    id: 'local_populace',
    name: 'Local Populace',
    description: 'The common folk of a region—farmers, artisans, and villagers just trying to get by. Their concerns are local and immediate.',
    motives: 'Safety, prosperity, and the well-being of their community.',
    goals: 'To live their lives in peace, free from the interference of monsters, wars, and cosmic conflicts.',
    beliefs: 'A blend of local superstitions, folk wisdom, and a healthy distrust of outsiders and grand powers.',
    hierarchy: 'Typically led by a village elder, a mayor, or a respected community figure like a tavern keeper.',
    joinable: false,
    iconUrl: 'https://placehold.co/64x64/a16207/fef08a?text=LP',
    rank: 'lesser',
     relations: {
        allies: [],
        enemies: []
    }
  },
];
