
import { CompanionDialogue } from "../../types";

export const LYRA_DIALOGUES: CompanionDialogue[] = [
    // --- FLAVOR / HUB DIALOGUES ---
    {
        id: 'lyra_hub_intro',
        companionId: 'lyra',
        title: 'How are you holding up?',
        priority: 1,
        isOneTime: false,
        condition: 'ALWAYS_TRUE',
        rootNode: {
            id: 'root',
            text: "I'm fine. Just keeping my gear in check. You never know what's waiting around the next bend in a place like this.",
            choices: [
                { text: "Good to know you're ready." }
            ]
        }
    },
    {
        id: 'lyra_ask_past',
        companionId: 'lyra',
        title: 'Tell me about the Guardians.',
        priority: 5,
        isOneTime: true,
        condition: 'LYRA_AFFINITY_HIGH_30',
        rootNode: {
            id: 'root',
            text: "We aren't an army, if that's what you're thinking. We're... watchers. The walls between worlds are thinner than people realize. When something tries to break through, we push it back. Or we find someone who can.",
            choices: [
                { 
                    text: "Like me?", 
                    nextNode: {
                        id: 'like_me',
                        text: "Exactly. The Chosen are rare. Most who touch the Gates just... break. But you, you're stronger. Or luckier. I haven't decided which yet.",
                        choices: [
                             { text: "I'll take luck over strength any day." },
                             { text: "It's skill, Lyra. Pure skill." }
                        ]
                    }
                },
                { 
                    text: "Sounds like a lonely life.", 
                    nextNode: {
                        id: 'lonely',
                        text: "It can be. But the alternative is letting the Fallen turn our world into a playground. I'd rather be lonely than a slave.",
                        choices: [
                            { text: "I understand." }
                        ]
                    }
                }
            ]
        }
    },
    // --- EVENT SPECIFIC ---
    {
        id: 'lyra_react_crypt_clear',
        companionId: 'lyra',
        title: 'About what happened in the Crypt...',
        priority: 10, // High priority
        isOneTime: true,
        condition: 'DESTINY_CHOSEN',
        rootNode: {
            id: 'root',
            text: "I saw you with the Queen's spirit. I felt the energy shift. You're really doing this, aren't you? Taking on the Fallen?",
            choices: [
                {
                    text: "I have to. It's my destiny.",
                    effectId: 'LYRA_AFFINITY_PLUS_10',
                    nextNode: {
                        id: 'destiny_accepted',
                        text: "Destiny or not, it's a heavy burden. But you won't carry it alone. The Guardians will stand with you, and so will I.",
                        choices: [
                            { text: "I appreciate that, Lyra." }
                        ]
                    }
                },
                {
                    text: "I didn't have much of a choice.",
                    nextNode: {
                        id: 'no_choice',
                        text: "Maybe not. But how you handle it is a choice. Don't let them control you. We fight on our terms.",
                        choices: [
                            { text: "You're right. We fight." }
                        ]
                    }
                }
            ]
        }
    }
];
