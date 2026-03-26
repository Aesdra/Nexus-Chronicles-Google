import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ModalFrame } from './ui/ModalFrame';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  result: string | null;
  isLoading: boolean;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, imageSrc, result, isLoading }) => {
  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="Consult the Loremaster" containerClassName="max-w-2xl">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {imageSrc && (
            <div className="md:w-1/2 flex-shrink-0">
              <img src={imageSrc} alt="Item for analysis" className="w-full h-auto object-contain rounded-md border-2 border-stone-600 p-1 bg-stone-300" />
            </div>
          )}
          <div className="md:w-1/2 flex-grow min-h-[200px] flex items-center justify-center">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner text="Reading the arcane weaves..." />
              </div>
            ) : (
              <div className="prose prose-p:text-gray-300 prose-p:text-lg">
                  <p className="whitespace-pre-wrap">{result}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};
