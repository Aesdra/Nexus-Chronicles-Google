import { GoogleGenAI, GenerateContentResponse, Modality, Chat } from "@google/genai";
import { GameState } from '../types';
import { getScene } from "./dataService";
import { LORE } from "../data/lore";
import { IMAGE_ASSETS } from "../data/assets";

let ai: GoogleGenAI | null = null;

/**
 * Initializes and/or returns a singleton instance of the GoogleGenAI client.
 * Throws an error if the API_KEY environment variable is not set.
 * @returns {GoogleGenAI} The initialized GoogleGenAI instance.
 */
const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

/**
 * Analyzes an image using the Gemini model to provide an in-character description.
 * @param {string} base64Image - The base64 encoded string of the image to analyze.
 * @param {string} mimeType - The IANA MIME type of the image (e.g., 'image/png').
 * @returns {Promise<string>} A promise that resolves to a mysterious, in-character description of the image.
 * @throws Will throw an error if the Gemini API returns an empty response.
 */
export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
    const aiInstance = getAI();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `You are a wise, ancient Loremaster in a D&D game. A player has shown you an object represented by this image. Describe it in a mysterious, in-character way. What could it be? What secrets might it hold? Keep it brief and intriguing.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };
    const textPart = { text: prompt };

    const response = await aiInstance.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Received empty analysis from Gemini.");
    }
    return text;
};

/**
 * Generates a short, surprising story twist for a procedural scene using the Gemini API.
 * The twist is formatted as a single sentence to be used as a player choice.
 * @param {GameState} gameState - The current state of the game for context.
 * @returns {Promise<string>} A promise that resolves to a creative story twist.
 * @throws Will throw an error if the player is not found or the API returns an empty response.
 */
export const generateStoryTwist = async (gameState: GameState): Promise<string> => {
    const aiInstance = getAI();
    const model = 'gemini-2.5-pro';

    if (!gameState.player) {
      throw new Error("Player not found in game state.");
    }

    const { player, party, currentSceneId } = gameState;
    // Use the first companion in the party for context if available
    const companion = party && party.length > 0 ? party[0] : null;

    const prompt = `
      You are a master storyteller for a Dungeons & Dragons style RPG.
      A player is at a crucial story moment. Generate a short, surprising, and engaging story twist.
      The twist should be a single sentence, no more than 20 words. It will be presented as a choice for the player.
      
      Current situation:
      - Player: ${player.name}, a ${player.subRace ? player.subRace.name : player.race.name} ${player.subClass ? player.subClass.name : player.characterClass.name}.
      - Location: At the entrance of a place called "${currentSceneId}".
      - Companion: ${companion ? `${companion.name} is with them, with an affinity level of ${companion.affinity}/100.` : 'They are alone.'}

      Generate a creative twist that makes the player think.
      Example twists: "Suddenly, your companion draws their weapon on you." or "A child's laughter echoes from the crypt entrance." or "The key in your pocket begins to hum with power."
      
      Your generated twist:
    `;

    const response = await aiInstance.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    
    const text = response.text?.trim();

    if (!text) {
      throw new Error("Received an empty response from Gemini API.");
    }
    
    return text.replace(/["*]/g, '');
};

interface CharacterDetails {
    age: number;
    height: string;
    eyeColor: string;
    skinColor: string;
    hairColor: string;
    hairStyle: string;
    hasBeard: boolean;
    gender: string;
    scars: string;
    tattoos: string;
    accessories: string;
}

/**
 * Generates a character sprite image using the Imagen model.
 * The function constructs a detailed prompt based on character race, class, and appearance details.
 * It ensures the generated image has a transparent background.
 * @param {string} raceName - The character's race.
 * @param {string | null} subRaceName - The character's sub-race, if any.
 * @param {string} className - The character's class.
 * @param {string | null} subClassName - The character's sub-class, if any.
 * @param {'1:1' | '3:4' | '4:3' | '9:16' | '16:9'} aspectRatio - The desired aspect ratio for the image.
 * @param {CharacterDetails} details - An object containing detailed appearance information.
 * @returns {Promise<string>} A promise that resolves to a base64-encoded PNG data URL.
 * In case of an error, it returns a URL to a placeholder image.
 */
export const generateCharacterSprite = async (
  raceName: string,
  subRaceName: string | null,
  className: string,
  subClassName: string | null,
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
  details: CharacterDetails
): Promise<string> => {
  try {
    const aiInstance = getAI();
    const model = 'gemini-3.1-flash-image-preview';
    
    let equipmentDescription = '';
    switch (className.toLowerCase()) {
        case 'artificer':
            equipmentDescription = 'The character wears practical leather or studded armor, perhaps with goggles. They should be equipped with intricate gadgets, tools, and possibly a crossbow or arcane firearm.';
            break;
        case 'barbarian':
            equipmentDescription = 'The character wears minimal armor like hides, fur, or leather, and wields a large, two-handed weapon such as a greataxe or greatsword. They should not have a shield or heavy plate armor.';
            break;
        case 'bard':
            equipmentDescription = 'The character wears stylish, non-restrictive clothing or light leather armor. They should be holding a musical instrument (like a lute or flute) and perhaps a light weapon like a rapier. No heavy armor or large weapons.';
            break;
        case 'cleric':
            equipmentDescription = 'The character wears medium armor like chain mail, possibly with some plate pieces, adorned with a holy symbol. They should carry a mace or warhammer and a shield.';
            break;
        case 'druid':
            equipmentDescription = 'The character wears armor made from natural materials like leather, hides, and wood. They should carry a wooden staff, a scimitar, or a simple wooden shield. Their appearance is wild and connected to nature.';
            break;
        case 'fighter':
            equipmentDescription = 'The character is a master of combat, wearing well-maintained heavy armor like plate mail. They can be equipped with a sword and shield, or a large two-handed weapon like a greatsword.';
            if (subClassName?.toLowerCase().includes('eldritch knight')) {
                equipmentDescription += ' As an Eldritch Knight, their weapon should have a faint arcane glow, or their off-hand should be crackling with magical energy, ready to cast a spell.';
            } else if (subClassName?.toLowerCase().includes('arcane archer')) {
                equipmentDescription = 'The character wears practical leather or studded armor. They MUST be equipped with an elegant longbow and a quiver of arrows. One of the arrows could be glowing with magical energy.';
            } else if (subClassName?.toLowerCase().includes('samurai')) {
                equipmentDescription = 'The character is a disciplined warrior clad in ornate samurai-style armor (lamellar or plate). They should wield a katana (as a longsword) or a greatsword (nodachi). Their presence is imposing and focused.';
            } else if (subClassName?.toLowerCase().includes('rune knight')) {
                equipmentDescription = 'A warrior who has learned the magic of giants, inscribing runes on their gear to gain supernatural abilities. Their armor or weapon should have glowing runes carved into it, and they might have a slightly larger, more imposing stature.';
            }
            break;
        case 'monk':
            if (subClassName?.toLowerCase().includes('kensei')) {
                equipmentDescription = 'The character wears simple, loose-fitting monastic robes that allow for free movement. They should be depicted wielding a single martial weapon they have mastered, such as a longsword or a battleaxe, with grace and precision. They do NOT wear armor or carry shields.';
            } else {
                equipmentDescription = 'The character wears simple, loose-fitting monastic robes that allow for free movement. They should be depicted as unarmed or with a simple weapon like a quarterstaff. It is critical that they do NOT wear any armor or carry shields or swords.';
            }
            break;
        case 'paladin':
            equipmentDescription = 'The character is a holy knight, clad in ornate, heavy plate armor, often decorated with sacred symbols. They should wield a longsword or greatsword, and may carry a shield.';
            break;
        case 'ranger':
            equipmentDescription = 'The character wears practical leather or studded armor, often with a hood and cloak for traversing the wilderness. They must be equipped with a longbow and a quiver of arrows. They might also have a shortsword or dagger.';
            break;
        case 'rogue':
            equipmentDescription = 'The character wears dark, form-fitting leather armor to allow for stealth. They should be equipped with daggers or a shortsword and appear nimble. A hood or mask is common. No heavy armor, shields, or large weapons.';
            break;
        case 'sorcerer':
            equipmentDescription = 'The character wears robes or fine clothing, NOT armor. They should be depicted casting a spell, with arcane energy around their hands, or holding a magical focus like a crystal or an orb. No shields or traditional weapons.';
            break;
        case 'warlock':
            if (subClassName?.toLowerCase().includes('hexblade')) {
                equipmentDescription = 'The character is a martial spellcaster, wearing medium armor like half-plate or chain mail. They MUST be wielding a sinister, shadowy martial weapon (like a longsword or battleaxe) that seems to be the source of their power. They may also carry a shield. Their eyes might glow with a faint, eerie light.';
            } else {
                equipmentDescription = 'The character wears dark, often ornate robes or strange attire hinting at their otherworldly pact. They might hold a mysterious tome, a strange staff, or have faint, eerie magical effects around them. No heavy armor or shields.';
            }
            break;
        case 'wizard':
            if (subClassName?.toLowerCase().includes('bladesinging')) {
                equipmentDescription = 'The character is an elven warrior-mage, wearing stylish light armor like studded leather. They should be wielding a single, elegant blade (like a rapier or scimitar) in one hand, while the other crackles with arcane energy. Their pose should be graceful and mobile, like a dancer ready to strike. They do NOT use a shield.';
            } else {
                equipmentDescription = 'The character wears scholarly robes and absolutely no armor or shield. They should be holding a spellbook or a magical staff. It is critical they are not depicted with swords or other martial weapons.';
            }
            break;
        default:
            equipmentDescription = 'The character is equipped appropriately for their class.';
    }

    const promptParts = [
      "Generate a high-quality, 2D digital illustration of a fantasy RPG character for a game sprite. The character MUST be rendered on a **fully transparent background (PNG with alpha channel)**. Do not include any background colors, textures, patterns, or environments. The character must be perfectly isolated.",
      "\n**Art Style:**",
      "- Detailed fantasy art, suitable for a video game.",
      "- Pose: A standard, slightly dynamic standing pose.",
      "- Perspective: Full-body portrait.",
      "\n**Character Concept:**",
      `- **Race:** ${raceName} ${subRaceName ? `(${subRaceName})` : ''}`,
      `- **Class:** ${className} ${subClassName ? `(${subClassName})` : ''}`,
      `- **Gender:** ${details.gender}`,
      `- **Age:** Approximately ${details.age} years old.`,
      "\n**Detailed Description & Appearance:**",
      `The character is a ${details.height} tall ${raceName}. Their skin is ${details.skinColor}, and their eyes are ${details.eyeColor}. Their hair is ${details.hairColor}, styled as ${details.hairStyle}.`,
      details.hasBeard ? 'They have a beard.' : '',
      details.scars ? `Visible scars include: ${details.scars}.` : '',
      details.tattoos ? `They are adorned with tattoos: ${details.tattoos}.` : '',
      details.accessories ? `Key accessories include: ${details.accessories}.` : '',
      `\n**Equipment (This is a crucial instruction):**`,
      `The character's gear MUST strictly match their class. The detailed description is: ${equipmentDescription}`
    ];

    const prompt = promptParts.filter(Boolean).join('\n');


    const response = await aiInstance.models.generateContent({
      model,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: "1K"
          },
      },
    });

    let base64ImageBytes = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        base64ImageBytes = part.inlineData.data;
        break;
      }
    }

    if (!base64ImageBytes) {
      throw new Error("Image generation failed, no images returned.");
    }

    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error: any) {
    console.error("Error generating character sprite:", error);
    
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("permission denied")) {
        // This often means the API key is missing or invalid for this model.
        // The UI should handle prompting the user to select a key.
        throw error; 
    }
    
    // As a fallback, return a placeholder or a default image URL
    return IMAGE_ASSETS.PLACEHOLDER_CHARACTER;
  }
};

/**
 * "Generates" the companion sprite. This currently returns a static, pre-generated image
 * to ensure consistency for the specific companion 'Lyra' and to conserve API calls.
 * @returns {Promise<string>} A promise that resolves to the URL of the companion's sprite.
 */
export const generateCompanionSprite = async (): Promise<string> => {
  // Using a static, pre-generated image for Lyra to ensure consistency and save API calls.
  return IMAGE_ASSETS.COMPANION_LYRA;
};

/**
 * Creates and initializes a new chat session with the Gemini API, role-playing as 'The Loremaster'.
 * It constructs a system instruction with the current game context (player info, location, unlocked lore)
 * to provide contextual and in-character responses.
 * @param {GameState} gameState - The current game state to use for context.
 * @returns {Promise<Chat>} A promise that resolves to an initialized `Chat` session object.
 * @throws Will throw an error if the player is not found in the game state.
 */
export const createLoremasterChat = async (gameState: GameState): Promise<Chat> => {
    const aiInstance = getAI();
    const model = 'gemini-2.5-pro';

    if (!gameState.player) {
      throw new Error("Player not found in game state.");
    }

    const { player, party, currentSceneId, unlockedLoreIds } = gameState;
    const companion = party && party.length > 0 ? party[0] : null;
    const currentScene = getScene(currentSceneId);
    
    const loreEntries = unlockedLoreIds.length > 0 ? LORE.filter(l => unlockedLoreIds.includes(l.id)) : [];
    const loreContext = loreEntries.map(l => `- ${l.title}: ${l.content.substring(0, 100)}...`).join('\n');

    const systemInstruction = `
        You are The Loremaster, an ancient and wise entity within the RPG world of Arathis. You answer player questions in-character.
        Your tone is wise, slightly mysterious, and helpful. You have vast knowledge but do not reveal everything at once.
        You are aware of the player's current situation and unlocked knowledge. Use this context to provide relevant answers.
        NEVER break character. Do not mention "the game", "the player", or anything that suggests this is not a real world. Refer to the user as "traveler" or "seeker".

        CURRENT CONTEXT:
        - Seeker's Name: ${player.name}
        - Seeker's Class: ${player.subClass ? player.subClass.name : player.characterClass.name}
        - Current Location: ${currentScene ? currentScene.text.substring(0, 100) : 'An unknown place'}...
        - Companion: ${companion ? companion.name : 'None'}
        - Unlocked Knowledge:
        ${loreContext || 'None yet.'}
    `;

    const chat = aiInstance.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    return chat;
};