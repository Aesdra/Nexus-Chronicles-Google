import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Key, ExternalLink } from 'lucide-react';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } else {
      // If not in AI Studio environment, assume key is handled via env
      setHasKey(true);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and proceed to app as per guidelines to avoid race conditions
      setHasKey(true);
    }
  };

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse text-slate-400 font-mono tracking-widest uppercase text-sm">
          Verifying Access...
        </div>
      </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-500/10 rounded-full">
              <Key className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            API Key Required
          </h2>
          
          <p className="text-slate-400 text-center mb-8 leading-relaxed">
            To generate high-quality character sprites and use advanced AI features, you must select an API key from a paid Google Cloud project.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Key className="w-5 h-5" />
              Select API Key
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Billing Documentation
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3 text-xs text-slate-500 italic">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              The selected key is used only for this session and is never stored on our servers.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
