import React, { useState, useEffect, useRef } from 'react';
import { createLoremasterChat } from '../services/geminiService';
import { Chat } from '@google/genai';
import { LoadingSpinner } from './LoadingSpinner';
import { useGameStore } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { audioManager } from '../services/audioService';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBotModal: React.FC<ChatBotModalProps> = ({ isOpen, onClose }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const initializeChat = async () => {
        setIsSessionReady(false);
        setMessages([]);
        try {
          const newChat = await createLoremasterChat(useGameStore.getState());
          setChatSession(newChat);
          setMessages([
            { sender: 'bot', text: "Greetings, traveler. I am the Loremaster. Ask, and perhaps the weaves of fate will grant you an answer." }
          ]);
          setIsSessionReady(true);
        } catch (error) {
          console.error("Failed to create chat session:", error);
          setMessages([{ sender: 'bot', text: "The connection to the arcane weaves is weak. I cannot answer at this time." }]);
        }
      }
      initializeChat();
    } else {
      setChatSession(null);
      setUserInput('');
      setIsLoading(false);
      setIsSessionReady(false);
    }
  }, [isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading || !chatSession) return;
    
    audioManager.playSound('click');
    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const stream = await chatSession.sendMessageStream({ message: currentInput });
      
      let botResponse = '';
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "My apologies, traveler. The echoes of the Nexus are faint. I cannot speak on that matter right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="Consult the Loremaster" containerClassName="max-w-2xl h-[80vh]">
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 overflow-y-auto" aria-live="polite">
            {!isSessionReady && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner text="Reading the arcane weaves..."/>
                </div>
            ) : (
                messages.map((msg, index) => (
                <div key={index} className={cn('flex my-2', { 'justify-end': msg.sender === 'user', 'justify-start': msg.sender === 'bot' })}>
                    <div className={cn('max-w-[80%] p-3 rounded-lg', { 
                        'bg-amber-900/60 text-white': msg.sender === 'user', 
                        'bg-stone-700/60 text-gray-300': msg.sender === 'bot'
                    })}>
                    <p className="whitespace-pre-wrap text-lg">{msg.text}</p>
                    </div>
                </div>
                ))
            )}
            {isLoading && !messages.some(m => m.sender === 'bot' && m.text === '') && (
                <div className="flex justify-start my-2">
                <div className="max-w-[80%] p-3 rounded-lg bg-stone-700/60 text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>
                </div>
            )}
            <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 bg-stone-800/70 border-t-2 border-amber-900/60 flex-shrink-0">
                <div className="flex gap-2">
                    <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isSessionReady ? "Ask a question..." : "Awaiting connection to the weaves..."}
                    className={cn("flex-grow bg-stone-900 border-2 border-stone-600 rounded p-2 text-lg text-amber-100 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-60")}
                    disabled={isLoading || !isSessionReady}
                    aria-label="Your message to the Loremaster"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim() || !isSessionReady}
                        className="font-medieval"
                    >
                        Send
                    </Button>
                </div>
            </footer>
        </div>
    </ModalFrame>
  );
};
