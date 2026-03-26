import { CharacterClass } from '../types';
import { IMAGE_ASSETS } from './assets';

export const CLASSES: CharacterClass[] = [
  {
    id: 'artificer',
    name: 'Artificer',
    description: 'Masters of invention who use magic to create mechanical devices and potent elixirs.',
    imageUrl: IMAGE_ASSETS.CLASS_ARTIFICER,
    scalesWith: ['intelligence'],
    subclasses: [
      { id: 'alchemist', name: 'Alchemist', description: 'Specializes in brewing potent elixirs that can heal allies, grant powerful buffs, or create other magical effects, making them an invaluable support specialist.', imageUrl: IMAGE_ASSETS.SUBCLASS_ALCHEMIST },
      { id: 'armorer', name: 'Armorer', description: 'An expert who modifies armor to become a potent conduit for magic. Their Arcane Armor can be customized for frontline assault or stealthy infiltration.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARMORER },
      { id: 'artillerist', name: 'Artillerist', description: 'A master of destructive magic who forges and deploys arcane cannons on the battlefield, providing devastating ranged support and battlefield control.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARTILLERIST },
      { id: 'battle-smith', name: 'Battle Smith', description: 'A master of artifice who forges a loyal Steel Defender companion. They blend martial prowess with their creations, fighting as a team on the battlefield.', imageUrl: IMAGE_ASSETS.SUBCLASS_BATTLE_SMITH }
    ]
  },
  {
    id: 'barbarian',
    name: 'Barbarian',
    description: 'A fierce warrior from the savage wilds who can enter a battle rage.',
    imageUrl: IMAGE_ASSETS.CLASS_BARBARIAN,
    scalesWith: ['strength', 'constitution'],
    subclasses: [
      { id: 'path-of-the-berserker', name: 'Path of the Berserker', description: 'A warrior who succumbs to a frenzied rage, becoming a whirlwind of destruction.', imageUrl: IMAGE_ASSETS.SUBCLASS_BERSERKER },
      { id: 'path-of-the-totem-warrior', name: 'Path of the Totem Warrior', description: 'A barbarian who channels animal spirits to gain their powers in battle.', imageUrl: IMAGE_ASSETS.SUBCLASS_TOTEM_WARRIOR },
      { id: 'path-of-the-battlerager', name: 'Path of the Battlerager', description: 'A dwarven warrior who uses spiked armor as a weapon, excelling at grappling and close-quarters combat.', imageUrl: IMAGE_ASSETS.SUBCLASS_BATTLERAGER },
      { id: 'path-of-the-storm-herald', name: 'Path of the Storm Herald', description: 'A warrior whose rage manifests as a magical storm aura, damaging foes or protecting allies.', imageUrl: IMAGE_ASSETS.SUBCLASS_STORM_HERALD },
      { id: 'path-of-the-ancestral-guardian', name: 'Path of the Ancestral Guardian', description: 'A spiritual warrior who summons ancestral spirits to protect their allies and hinder their foes.', imageUrl: IMAGE_ASSETS.SUBCLASS_ANCESTRAL_GUARDIAN },
      { id: 'path-of-the-zealot', name: 'Path of the Zealot', description: 'A divine champion whose rage is fueled by a god, making them a resilient and powerful striker.', imageUrl: IMAGE_ASSETS.SUBCLASS_ZEALOT },
      { id: 'path-of-the-beast', name: 'Path of the Beast', description: 'A barbarian whose rage causes a physical transformation, growing natural weapons like claws, fangs, or a tail.', imageUrl: IMAGE_ASSETS.SUBCLASS_BEAST },
      { id: 'path-of-wild-magic', name: 'Path of Wild Magic', description: 'A warrior infused with untamed magic that unleashes chaotic effects whenever they rage.', imageUrl: IMAGE_ASSETS.SUBCLASS_WILD_MAGIC_BARB },
      { id: 'path-of-the-giant', name: 'Path of the Giant', description: 'A barbarian who channels the might of giants, growing in size and imbuing their attacks with elemental power.', imageUrl: IMAGE_ASSETS.SUBCLASS_GIANT },
    ]
  },
  {
    id: 'bard',
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    imageUrl: IMAGE_ASSETS.CLASS_BARD,
    scalesWith: ['charisma'],
    subclasses: [
      { id: 'college-of-lore', name: 'College of Lore', description: 'A seeker of knowledge who uses their wits and magic to overcome any obstacle.', imageUrl: IMAGE_ASSETS.SUBCLASS_LORE },
      { id: 'college-of-valor', name: 'College of Valor', description: 'A skald of the old north, inspiring allies with tales of heroism while engaging in battle.', imageUrl: IMAGE_ASSETS.SUBCLASS_VALOR },
      { id: 'college-of-glamour', name: 'College of Glamour', description: 'A student of the vibrant Feywild, mastering magics of enchantment and illusion to delight and captivate audiences.', imageUrl: IMAGE_ASSETS.SUBCLASS_GLAMOUR },
      { id: 'college-of-swords', name: 'College of Swords', description: 'A daring, sword-wielding performer who practices blade flourishes and acrobatic feats, blending martial prowess with magic.', imageUrl: IMAGE_ASSETS.SUBCLASS_SWORDS },
      { id: 'college-of-whispers', name: 'College of Whispers', description: 'A master of intrigue who uses secrets and psychological warfare as weapons, sowing paranoia and fear.', imageUrl: IMAGE_ASSETS.SUBCLASS_WHISPERS },
      { id: 'college-of-creation', name: 'College of Creation', description: 'A bard who believes the universe was sung into existence, using cosmic music to create and animate objects with their magic.', imageUrl: IMAGE_ASSETS.SUBCLASS_CREATION },
      { id: 'college-of-eloquence', name: 'College of Eloquence', description: 'A silver-tongued orator whose words can stir hearts, inspire armies, and unravel the will of their enemies.', imageUrl: IMAGE_ASSETS.SUBCLASS_ELOQUENCE },
    ]
  },
  { 
    id: 'cleric', 
    name: 'Cleric', 
    description: 'A divine agent who channels the power of their deity for healing and protection.', 
    imageUrl: IMAGE_ASSETS.CLASS_CLERIC,
    scalesWith: ['wisdom'],
    subclasses: [
        { id: 'arcana-domain', name: 'Arcana Domain', description: 'Clerics who blend divine faith with the study of arcane magic, seeing the weave of magic as a divine creation.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARCANA },
        { id: 'death-domain', name: 'Death Domain', description: 'Serving gods of the end, these clerics wield necrotic energy to drain life and command the forces of death.', imageUrl: IMAGE_ASSETS.SUBCLASS_DEATH },
        { id: 'forge-domain', name: 'Forge Domain', description: 'Worshippers of artisan gods, they are masters of creation, imbuing weapons and armor with divine power.', imageUrl: IMAGE_ASSETS.SUBCLASS_FORGE },
        { id: 'grave-domain', name: 'Grave Domain', description: 'Guardians of the line between life and death, they ensure the departed rest peacefully and smite the undead.', imageUrl: IMAGE_ASSETS.SUBCLASS_GRAVE },
        { id: 'knowledge-domain', name: 'Knowledge Domain', description: 'Clerics who value learning and understanding above all. They are masters of information, lore, and divination.', imageUrl: IMAGE_ASSETS.SUBCLASS_KNOWLEDGE },
        { id: 'life-domain', name: 'Life Domain', description: 'A supreme healer whose divine magic can mend the most grievous of wounds.', imageUrl: IMAGE_ASSETS.SUBCLASS_LIFE },
        { id: 'light-domain', name: 'Light Domain', description: 'A cleric who wields the radiant power of the sun to smite darkness and protect the innocent.', imageUrl: IMAGE_ASSETS.SUBCLASS_LIGHT },
        { id: 'nature-domain', name: 'Nature Domain', description: 'These clerics draw power from the natural world, commanding plants and animals and wielding the elements.', imageUrl: IMAGE_ASSETS.SUBCLASS_NATURE },
        { id: 'order-domain', name: 'Order Domain', description: 'Upholders of law and discipline, these clerics use their divine authority to command others and create order from chaos.', imageUrl: IMAGE_ASSETS.SUBCLASS_ORDER },
        { id: 'peace-domain', name: 'Peace Domain', description: 'Emissaries of tranquility, they forge bonds of unity between allies, offering protection and solace in times of conflict.', imageUrl: IMAGE_ASSETS.SUBCLASS_PEACE },
        { id: 'tempest-domain', name: 'Tempest Domain', description: 'Worshippers of storm gods, they command thunder, lightning, and the fury of the sea.', imageUrl: IMAGE_ASSETS.SUBCLASS_TEMPEST },
        { id: 'trickery-domain', name: 'Trickery Domain', description: 'Masters of deception and illusion, these clerics serve gods of mischief and chaos, using their powers to sow confusion.', imageUrl: IMAGE_ASSETS.SUBCLASS_TRICKERY },
        { id: 'twilight-domain', name: 'Twilight Domain', description: 'Guardians against the horrors of the night, they draw power from the transition between light and dark to protect and inspire.', imageUrl: IMAGE_ASSETS.SUBCLASS_TWILIGHT },
        { id: 'war-domain', name: 'War Domain', description: 'Battle-hardened clerics who find divinity in the clash of steel, inspiring allies and crushing foes on the front lines.', imageUrl: IMAGE_ASSETS.SUBCLASS_WAR },
    ]
  },
  {
    id: 'druid',
    name: 'Druid',
    description: 'A priest of the old faith, wielding the raw power of nature and taking the shape of wild beasts.',
    imageUrl: IMAGE_ASSETS.CLASS_DRUID,
    scalesWith: ['wisdom'],
    subclasses: [
      { id: 'circle-of-the-land', name: 'Circle of the Land', description: 'A keeper of ancient traditions, drawing power and spells directly from a chosen terrain.', imageUrl: IMAGE_ASSETS.SUBCLASS_LAND },
      { id: 'circle-of-the-moon', name: 'Circle of the Moon', description: 'A master of shapeshifting, able to take the form of powerful wild beasts in combat.', imageUrl: IMAGE_ASSETS.SUBCLASS_MOON },
      { id: 'circle-of-dreams', name: 'Circle of Dreams', description: 'A guardian of the Feywild\'s magic, offering healing and solace drawn from the realm of dreams.', imageUrl: IMAGE_ASSETS.SUBCLASS_DREAMS },
      { id: 'circle-of-the-shepherd', name: 'Circle of the Shepherd', description: 'A spiritual leader who summons nature spirits to protect and empower their allies and summoned creatures.', imageUrl: IMAGE_ASSETS.SUBCLASS_SHEPHERD },
      { id: 'circle-of-spores', name: 'Circle of Spores', description: 'A master of fungi and decay, using spores to control the battlefield, poison foes, and animate the dead.', imageUrl: IMAGE_ASSETS.SUBCLASS_SPORES },
      { id: 'circle-of-stars', name: 'Circle of Stars', description: 'An astrologer who draws on the power of the constellations, transforming into a starry form to heal, attack, or guide.', imageUrl: IMAGE_ASSETS.SUBCLASS_STARS },
      { id: 'circle-of-wildfire', name: 'Circle of Wildfire', description: 'A druid who embraces destruction and rebirth, commanding a wildfire spirit to burn foes and teleport allies.', imageUrl: IMAGE_ASSETS.SUBCLASS_WILDFIRE }
    ]
  },
  { 
    id: 'fighter', 
    name: 'Fighter', 
    description: 'A master of martial combat, skilled with a variety of weapons and armor.', 
    imageUrl: IMAGE_ASSETS.CLASS_FIGHTER,
    scalesWith: ['strength', 'dexterity'],
    subclasses: [
      { id: 'battle-master', name: 'Battle Master', description: 'A strategic fighter who uses maneuvers to control the battlefield and outwit foes.', imageUrl: IMAGE_ASSETS.SUBCLASS_BATTLE_MASTER },
      { id: 'champion', name: 'Champion', description: 'An athletic warrior who focuses on pure physical power and resilience.', imageUrl: IMAGE_ASSETS.SUBCLASS_CHAMPION },
      { id: 'eldritch-knight', name: 'Eldritch Knight', description: 'A warrior who combines martial mastery with the ability to cast arcane spells, weaving magic and steel together.', imageUrl: IMAGE_ASSETS.SUBCLASS_ELDRITCH_KNIGHT },
      { id: 'purple-dragon-knight', name: 'Purple Dragon Knight', description: 'An inspiring leader who rallies allies, turning the tide of battle with their courage and tactical commands.', imageUrl: IMAGE_ASSETS.SUBCLASS_PURPLE_DRAGON_KNIGHT },
      { id: 'arcane-archer', name: 'Arcane Archer', description: 'A master of elven archery who imbues their arrows with potent magical effects, striking foes from afar.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARCANE_ARCHER },
      { id: 'cavalier', name: 'Cavalier', description: 'A mounted combatant without equal, defending their allies and charging down their enemies with unstoppable force.', imageUrl: IMAGE_ASSETS.SUBCLASS_CAVALIER },
      { id: 'samurai', name: 'Samurai', description: 'A disciplined warrior whose fighting spirit allows them to deliver swift, precise strikes and endure a storm of blows.', imageUrl: IMAGE_ASSETS.SUBCLASS_SAMURAI },
      { id: 'echo-knight', name: 'Echo Knight', description: 'A fighter who uses dunamancy to summon a ghostly echo of themself, attacking from multiple positions at once.', imageUrl: IMAGE_ASSETS.SUBCLASS_ECHO_KNIGHT },
      { id: 'psi-warrior', name: 'Psi Warrior', description: 'A fighter who awakens psionic power, using the force of their mind to move objects and protect allies.', imageUrl: IMAGE_ASSETS.SUBCLASS_PSI_WARRIOR },
      { id: 'rune-knight', name: 'Rune Knight', description: 'A warrior who has learned the magic of giants, inscribing runes on their gear to gain supernatural abilities.', imageUrl: IMAGE_ASSETS.SUBCLASS_RUNE_KNIGHT },
    ]
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'A master of martial arts who harnesses the power of the body for physical and spiritual perfection.',
    imageUrl: IMAGE_ASSETS.CLASS_MONK,
    scalesWith: ['dexterity', 'wisdom'],
    subclasses: [
      { id: 'way-of-the-open-hand', name: 'Way of the Open Hand', description: 'Masters of unarmed combat who can push, trip, or stun their foes with precise strikes.', imageUrl: IMAGE_ASSETS.SUBCLASS_OPEN_HAND },
      { id: 'way-of-the-four-elements', name: 'Way of the Four Elements', description: 'Monks who harness the elements, unleashing blasts of fire, wind, water, and earth.', imageUrl: IMAGE_ASSETS.SUBCLASS_FOUR_ELEMENTS },
      { id: 'way-of-shadow', name: 'Way of Shadow', description: 'Ninja-like monks who use stealth and darkness to teleport and strike unseen.', imageUrl: IMAGE_ASSETS.SUBCLASS_SHADOW },
      { id: 'way-of-the-drunken-master', name: 'Way of the Drunken Master', description: 'A fighter who uses an unpredictable, swaying style to redirect attacks and outmaneuver opponents.', imageUrl: IMAGE_ASSETS.SUBCLASS_DRUNKEN_MASTER },
      { id: 'way-of-the-kensei', name: 'Way of the Kensei', description: 'A weapon master who has extended their ki to a chosen set of martial weapons, blending blade work with unarmed prowess.', imageUrl: IMAGE_ASSETS.SUBCLASS_KENSEI },
      { id: 'way-of-the-long-death', name: 'Way of the Long Death', description: 'Obsessed with the mechanics of death, these monks can drain life force from their foes and defy death itself.', imageUrl: IMAGE_ASSETS.SUBCLASS_LONG_DEATH },
      { id: 'way-of-mercy', name: 'Way of Mercy', description: 'Masked monks who act as physicians of life and death, able to heal allies or inflict necrotic wounds with a touch.', imageUrl: IMAGE_ASSETS.SUBCLASS_MERCY },
      { id: 'way-of-the-astral-self', name: 'Way of the Astral Self', description: 'A monk who summons a ghostly manifestation of their ki, fighting with ethereal arms that extend their reach and power.', imageUrl: IMAGE_ASSETS.SUBCLASS_ASTRAL_SELF },
      { id: 'way-of-the-ascendant-dragon', name: 'Way of the Ascendant Dragon', description: 'Monks who channel draconic power, unleashing elemental breath attacks and manifesting draconic might.', imageUrl: IMAGE_ASSETS.SUBCLASS_ASCENDANT_DRAGON },
    ]
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'A holy warrior bound by an oath to a divine cause.',
    imageUrl: IMAGE_ASSETS.CLASS_PALADIN,
    scalesWith: ['strength', 'charisma'],
    subclasses: [
      { id: 'oath-of-devotion', name: 'Oath of Devotion', description: 'A classic heroic paladin who follows the highest ideals of justice, virtue, and order.', imageUrl: IMAGE_ASSETS.SUBCLASS_DEVOTION },
      { id: 'oath-of-the-ancients', name: 'Oath of the Ancients', description: 'A "green knight" who champions the light and life of the natural world against darkness and decay.', imageUrl: IMAGE_ASSETS.SUBCLASS_ANCIENTS },
      { id: 'oath-of-vengeance', name: 'Oath of Vengeance', description: 'A grim avenger dedicated to punishing evil by any means necessary, hunting down their foes with relentless focus.', imageUrl: IMAGE_ASSETS.SUBCLASS_VENGEANCE },
      { id: 'oathbreaker', name: 'Oathbreaker', description: 'An anti-paladin who has willfully abandoned their sacred vows for a dark cause, commanding undead and fiends.', imageUrl: IMAGE_ASSETS.SUBCLASS_OATHBREAKER },
      { id: 'oath-of-the-crown', name: 'Oath of the Crown', description: 'A paladin whose devotion is to law, order, and the sovereign of a nation, acting as the embodiment of civilization.', imageUrl: IMAGE_ASSETS.SUBCLASS_CROWN },
      { id: 'oath-of-conquest', name: 'Oath of Conquest', description: 'A knight tyrant who believes in crushing chaos and evil through overwhelming force and iron-fisted rule.', imageUrl: IMAGE_ASSETS.SUBCLASS_CONQUEST },
      { id: 'oath-of-redemption', name: 'Oath of Redemption', description: 'A paladin following a path of peace and forgiveness, using violence only as a last resort against those who will not repent.', imageUrl: IMAGE_ASSETS.SUBCLASS_REDEMPTION },
      { id: 'oath-of-glory', name: 'Oath of Glory', description: 'A hero who strives for legendary acts, comparing themselves to the champions of old and inspiring others with their prowess.', imageUrl: IMAGE_ASSETS.SUBCLASS_GLORY },
      { id: 'oath-of-the-watchers', name: 'Oath of the Watchers', description: 'A vigilant guardian who protects the mortal realms from the predations of extraplanar threats like fiends and aberrations.', imageUrl: IMAGE_ASSETS.SUBCLASS_WATCHERS },
    ]
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'A warrior of the wilderness, at home in the wild and a master of archery and tracking.',
    imageUrl: IMAGE_ASSETS.CLASS_RANGER,
    scalesWith: ['dexterity', 'wisdom'],
    subclasses: [
      { id: 'hunter', name: 'Hunter', description: 'A master of monster slaying, using specialized techniques to take down the deadliest of foes.', imageUrl: IMAGE_ASSETS.SUBCLASS_HUNTER },
      { id: 'beast-master', name: 'Beast Master', description: 'A ranger who forms a powerful bond with an animal companion, fighting as a unified team.', imageUrl: IMAGE_ASSETS.SUBCLASS_BEAST_MASTER },
      { id: 'gloom-stalker', name: 'Gloom Stalker', description: 'Masters of stealth and ambushes, specializing in hunting in darkness and subterranean environments.', imageUrl: IMAGE_ASSETS.SUBCLASS_GLOOM_STALKER },
      { id: 'horizon-walker', name: 'Horizon Walker', description: 'Guards the mortal world against planar threats and utilizes planar magic to teleport and strike.', imageUrl: IMAGE_ASSETS.SUBCLASS_HORIZON_WALKER },
      { id: 'monster-slayer', name: 'Monster Slayer', description: 'Specializes in hunting monstrous foes by studying their weaknesses and exploiting them with supernatural power.', imageUrl: IMAGE_ASSETS.SUBCLASS_MONSTER_SLAYER },
      { id: 'fey-wanderer', name: 'Fey Wanderer', description: 'A ranger infused with the chaotic magic of the Feywild, granting them beguiling social and combat abilities.', imageUrl: IMAGE_ASSETS.SUBCLASS_FEY_WANDERER },
      { id: 'swarmkeeper', name: 'Swarmkeeper', description: 'Accompanied by a nature-attuned swarm that can be commanded to attack, move foes, or even grant flight.', imageUrl: IMAGE_ASSETS.SUBCLASS_SWARMKEEPER },
      { id: 'drakewarden', name: 'Drakewarden', description: 'Accompanied by a faithful, draconic companion that grows stronger as the ranger levels up, eventually becoming a mount.', imageUrl: IMAGE_ASSETS.SUBCLASS_DRAKEWARDEN },
    ]
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    imageUrl: IMAGE_ASSETS.CLASS_ROGUE,
    scalesWith: ['dexterity'],
    subclasses: [
      { id: 'thief', name: 'Thief', description: 'A master of infiltration, sleight of hand, and quick actions, able to use their Cunning Action for more than just a dash, disengage, or hide.', imageUrl: IMAGE_ASSETS.SUBCLASS_THIEF },
      { id: 'assassin', name: 'Assassin', description: 'A deadly killer who specializes in infiltration and ambush, trained to take down targets quickly and efficiently with the first strike.', imageUrl: IMAGE_ASSETS.SUBCLASS_ASSASSIN },
      { id: 'arcane-trickster', name: 'Arcane Trickster', description: 'A rogue who blends stealth with magic, using illusions and enchantments from the wizard spell list to enhance their abilities.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARCANE_TRICKSTER },
      { id: 'inquisitive', name: 'Inquisitive', description: 'An expert at spotting hidden clues and ferreting out secrets, using observational skills to gain advantages in combat.', imageUrl: IMAGE_ASSETS.SUBCLASS_INQUISITIVE },
      { id: 'mastermind', name: 'Mastermind', description: 'An adept tactician and planner skilled at gathering information. They can use their bonus action to provide the Help action from a distance.', imageUrl: IMAGE_ASSETS.SUBCLASS_MASTERMIND },
      // FIX: Corrected the truncated and invalid asset path for the Scout subclass.
      { id: 'scout', name: 'Scout', description: 'A highly mobile skirmisher and survivalist comfortable in the wilderness. They are difficult to pin down in combat and excellent at moving quickly.', imageUrl: IMAGE_ASSETS.SUBCLASS_SCOUT },
      { id: 'swashbuckler', name: 'Swashbuckler', description: 'A charismatic duelist who blends swordplay with acrobatic flair, fighting with a confident and stylish grace.', imageUrl: IMAGE_ASSETS.SUBCLASS_SWASHBUCKLER },
      { id: 'phantom', name: 'Phantom', description: 'A rogue who has a mystical connection to death, using soul trinkets to gain knowledge from the departed.', imageUrl: IMAGE_ASSETS.SUBCLASS_PHANTOM },
      { id: 'soulknife', name: 'Soulknife', description: 'A psionic rogue who can manifest blades of pure psychic energy, striking at the minds and bodies of their foes.', imageUrl: IMAGE_ASSETS.SUBCLASS_SOULKNIFE },
    ]
  },
  {
    id: 'sorcerer',
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
    imageUrl: IMAGE_ASSETS.CLASS_SORCERER,
    scalesWith: ['charisma'],
    subclasses: [
      { id: 'draconic-bloodline', name: 'Draconic Bloodline', description: 'Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors.', imageUrl: IMAGE_ASSETS.SUBCLASS_DRACONIC_SORC },
      { id: 'wild-magic', name: 'Wild Magic', description: 'Your spellcasting can unleash surges of untamed magic, with unpredictable and chaotic results.', imageUrl: IMAGE_ASSETS.SUBCLASS_WILD_MAGIC_SORC },
      { id: 'divine-soul', name: 'Divine Soul', description: 'Your magic springs from a divine source, granting you access to spells from the cleric spell list.', imageUrl: IMAGE_ASSETS.SUBCLASS_DIVINE_SOUL },
      { id: 'shadow-magic', name: 'Shadow Magic', description: 'Your magic comes from the Shadowfell, granting you control over darkness and the ability to see in magical blackness.', imageUrl: IMAGE_ASSETS.SUBCLASS_SHADOW_MAGIC },
      { id: 'storm-sorcery', name: 'Storm Sorcery', description: 'Your magic comes from the power of elemental air, allowing you to control wind and lightning.', imageUrl: IMAGE_ASSETS.SUBCLASS_STORM_SORCERY },
      { id: 'aberrant-mind', name: 'Aberrant Mind', description: 'Your mind has been touched by an alien consciousness, granting you psionic and telepathic abilities.', imageUrl: IMAGE_ASSETS.SUBCLASS_ABERRANT_MIND },
      { id: 'clockwork-soul', name: 'Clockwork Soul', description: 'Your magic comes from the plane of mechanistic order, allowing you to impose law on the chaos of magic.', imageUrl: IMAGE_ASSETS.SUBCLASS_CLOCKWORK_SOUL },
      { id: 'lunar-sorcery', name: 'Lunar Sorcery', description: 'Your magic is tied to the cycles of the moon, granting you different abilities based on its phases.', imageUrl: IMAGE_ASSETS.SUBCLASS_LUNAR_SORCERY },
    ]
  },
  {
    id: 'warlock',
    name: 'Warlock',
    description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.',
    imageUrl: IMAGE_ASSETS.CLASS_WARLOCK,
    scalesWith: ['charisma'],
    subclasses: [
      { id: 'the-archfey', name: 'The Archfey', description: 'Your patron is a lord or lady of the fey, a creature of legend who holds secrets that were forgotten before the mortal races were born.', imageUrl: IMAGE_ASSETS.SUBCLASS_ARCHFEY },
      { id: 'the-fiend', name: 'The Fiend', description: 'You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against them.', imageUrl: IMAGE_ASSETS.SUBCLASS_FIEND },
      { id: 'the-great-old-one', name: 'The Great Old One', description: 'Your patron is a mysterious entity from the Far Realm, whose motives are incomprehensible to mortal minds.', imageUrl: IMAGE_ASSETS.SUBCLASS_GREAT_OLD_ONE },
      { id: 'the-celestial', name: 'The Celestial', description: 'Your patron is a powerful being of the Upper Planes, guiding you to strike at the forces of evil.', imageUrl: IMAGE_ASSETS.SUBCLASS_CELESTIAL },
      { id: 'the-hexblade', name: 'The Hexblade', description: 'You have made your pact with a mysterious entity from the Shadowfell — a force that manifests in sentient magic weapons.', imageUrl: IMAGE_ASSETS.SUBCLASS_HEXBLADE },
      { id: 'the-fathomless', name: 'The Fathomless', description: 'You have plunged into a pact with the deep, with a being that lurks in the ocean\'s abyss.', imageUrl: IMAGE_ASSETS.SUBCLASS_FATHOMLESS },
      { id: 'the-genie', name: 'The Genie', description: 'Your patron is a powerful elemental genie, granting you magic that reflects their nature.', imageUrl: IMAGE_ASSETS.SUBCLASS_GENIE },
      { id: 'the-undead', name: 'The Undead', description: 'Your patron is a mighty undead being, such as a lich or a vampire, granting you a sliver of their deathless power.', imageUrl: IMAGE_ASSETS.SUBCLASS_UNDEAD },
      { id: 'the-undying', name: 'The Undying', description: 'Your patron is a powerful being who has cheated death, and they have taught you some of their secrets.', imageUrl: IMAGE_ASSETS.SUBCLASS_UNDYING },
    ]
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of reality.',
    imageUrl: IMAGE_ASSETS.CLASS_WIZARD,
    scalesWith: ['intelligence'],
    subclasses: [
      { id: 'school-of-abjuration', name: 'School of Abjuration', description: 'Focuses on magic that blocks, banishes, or protects. Abjurers are masters of wards and defensive spells.', imageUrl: IMAGE_ASSETS.SUBCLASS_ABJURATION },
      { id: 'school-of-conjuration', name: 'School of Conjuration', description: 'Masters of summoning creatures and creating objects out of thin air.', imageUrl: IMAGE_ASSETS.SUBCLASS_CONJURATION },
      { id: 'school-of-divination', name: 'School of Divination', description: 'Seers of the future and the past, who use magic to gain information and glimpse what is to come.', imageUrl: IMAGE_ASSETS.SUBCLASS_DIVINATION },
      { id: 'school-of-enchantment', name: 'School of Enchantment', description: 'Spellcasters who specialize in charming and beguiling other people and monsters.', imageUrl: IMAGE_ASSETS.SUBCLASS_ENCHANTMENT },
      { id: 'school-of-evocation', name: 'School of Evocation', description: 'Wielders of destructive elemental magic, focusing on spells that create powerful explosions of fire, ice, and lightning.', imageUrl: IMAGE_ASSETS.SUBCLASS_EVOCATION },
      { id: 'school-of-illusion', name: 'School of Illusion', description: 'Masters of deception who create images, sounds, and phantoms to deceive and confuse their enemies.', imageUrl: IMAGE_ASSETS.SUBCLASS_ILLUSION },
      { id: 'school-of-necromancy', name: 'School of Necromancy', description: 'Wizards who study the cosmic forces of life, death, and undeath, and can command legions of skeletal minions.', imageUrl: IMAGE_ASSETS.SUBCLASS_NECROMANCY },
      { id: 'school-of-transmutation', name: 'School of Transmutation', description: 'Wizards who can alter the physical properties of creatures and objects, changing their form and composition.', imageUrl: IMAGE_ASSETS.SUBCLASS_TRANSMUTATION },
      { id: 'war-magic', name: 'War Magic', description: 'A wizard who blends principles of evocation and abjuration, equally adept at defending themselves and destroying their foes.', imageUrl: IMAGE_ASSETS.SUBCLASS_WAR_MAGIC },
      { id: 'bladesinging', name: 'Bladesinging', description: 'An elven tradition that blends swordplay and arcane magic into a graceful, deadly dance.', imageUrl: IMAGE_ASSETS.SUBCLASS_BLADESINGING },
      { id: 'chronurgy-magic', name: 'Chronurgy Magic', description: 'A student of time magic, able to manipulate the flow of moments to their advantage.', imageUrl: IMAGE_ASSETS.SUBCLASS_CHRONURGY },
      { id: 'graviturgy-magic', name: 'Graviturgy Magic', description: 'A wizard who can manipulate the fundamental force of gravity, altering the weight and density of objects and creatures.', imageUrl: IMAGE_ASSETS.SUBCLASS_GRAVITURGY },
      { id: 'order-of-scribes', name: 'Order of Scribes', description: 'A wizard whose focus is their spellbook, which they can awaken and use as a magical focus.', imageUrl: IMAGE_ASSETS.SUBCLASS_SCRIBES },
      { id: 'draconic-bloodline-wiz', name: 'Draconic Bloodline (Wizard)', description: 'A wizard who studies the magic of dragons, learning to emulate their powerful abilities.', imageUrl: IMAGE_ASSETS.SUBCLASS_DRACONIC_WIZ },
    ]
  }
];
