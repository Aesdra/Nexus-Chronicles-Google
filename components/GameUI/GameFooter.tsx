import React from 'react';
import { Scene, Choice } from '../../types';
import { AnimatedText } from '../AnimatedText';
import { ChoiceButton } from '../ChoiceButton';
import { LoadingSpinner } from '../LoadingSpinner';

interface GameFooterProps {
    scene: Scene;
    choices: Choice[];
    isLoading: boolean;
    onChoice: (choice: Choice) => void;
    focusedChoiceIndex: number;
}

/**
 * A dedicated, presentational component for rendering the game's footer UI,
 * which includes the main scene text and the player's available choices.
 * It receives all necessary data and callbacks as props, making it decoupled from
 * the main game logic.
 */
export const GameFooter: React.FC<GameFooterProps> = ({ scene, choices, isLoading, onChoice, focusedChoiceIndex }) => {
    return (
        <footer className="w-full p-4 z-20">
            <div className="max-w-4xl mx-auto bg-stone-900/80 border-2 border-stone-700/80 rounded-lg p-6 backdrop-blur-sm min-h-[250px] flex flex-col justify-between">
                <div className="text-gray-300 text-lg">
                    {/* The key forces the component to remount and re-animate on scene change */}
                    <AnimatedText key={scene.id} text={scene.text} />
                </div>
                <div className="overflow-y-auto max-h-[14rem] pr-2 mt-4" role="navigation" aria-label="Story choices">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        choices.map((choice, index) => (
                            <ChoiceButton 
                                key={index} 
                                text={choice.text} 
                                onClick={() => onChoice(choice)} 
                                isFocused={index === focusedChoiceIndex}
                            />
                        ))
                    )}
                </div>
            </div>
        </footer>
    );
};
