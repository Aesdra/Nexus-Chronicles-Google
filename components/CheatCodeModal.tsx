
import React, { useState } from 'react';
import { ModalFrame } from './ui/ModalFrame';
import { Button } from './ui/Button';
import { processCheatCode } from '../services/cheatService';
import { cn } from '../lib/utils';

interface CheatCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CheatCodeModal: React.FC<CheatCodeModalProps> = ({ isOpen, onClose }) => {
    const [code, setCode] = useState('');
    const [response, setResponse] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        const result = processCheatCode(code);
        setResponse(result);
        setCode('');
    };

    const handleClose = () => {
        setResponse(null);
        setCode('');
        onClose();
    };

    return (
        <ModalFrame 
            isOpen={isOpen} 
            onClose={handleClose} 
            title="The Whispering Shade" 
            containerClassName="max-w-md border-purple-900/50 bg-stone-950"
        >
            <div className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-black rounded-full border-2 border-purple-500 mb-6 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <span className="text-4xl">👁️</span>
                </div>
                
                <p className="text-stone-300 italic text-center mb-6 font-medieval text-lg">
                    "Speak the word of power, traveler. The void listens."
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter secret word..."
                        className="w-full bg-black/50 border-b-2 border-purple-800 text-center text-xl text-purple-100 p-2 focus:outline-none focus:border-purple-500 font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-700"
                        autoFocus
                    />
                    
                    <Button 
                        type="submit" 
                        className="w-full bg-purple-900/30 hover:bg-purple-900/50 border-purple-800 text-purple-200 font-medieval text-xl"
                    >
                        Whisper
                    </Button>
                </form>

                {response && (
                    <div className={cn(
                        "mt-6 p-4 rounded border text-center w-full animate-in fade-in slide-in-from-bottom-2",
                        response.includes("power") || response.includes("silent") 
                            ? "bg-red-950/30 border-red-900 text-red-200" 
                            : "bg-purple-950/30 border-purple-900 text-purple-200"
                    )}>
                        <p className="font-medieval">{response}</p>
                    </div>
                )}
            </div>
        </ModalFrame>
    );
};
