import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import { markdownToHtml } from '../lib/utils';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const [isSkipped, setIsSkipped] = useState(false);

  // When text (scene) changes, reset the skip state to start typing again
  useEffect(() => {
    setIsSkipped(false);
  }, [text]);

  const handleSkip = () => {
    setIsSkipped(true);
  };

  const htmlText = markdownToHtml(text);

  return (
    <div onClick={handleSkip} className="cursor-pointer min-h-[6rem] text-lg text-gray-300">
      {isSkipped ? (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      ) : (
        <Typewriter
          options={{
            delay: 30,
            cursorClassName: "text-amber-300",
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(htmlText)
              .callFunction((state) => {
                // Hide cursor at the end of typing
                if (state.elements.cursor) {
                    state.elements.cursor.style.display = 'none';
                }
              })
              .start();
          }}
        />
      )}
    </div>
  );
};
