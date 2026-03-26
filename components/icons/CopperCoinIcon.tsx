
import React from 'react';

export const CopperCoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-2.12 2.122h1.698c.065.228.16.44.267.648.107.208.228.404.364.582.136.179.286.342.449.488.164.146.342.274.53.384v1.698c-.22.07-.409.163-.567.267C8.07 15.901 7.5 15.12 7.5 14.25c0-.851.57-1.592 1.358-1.968a.75.75 0 01.375-.115z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM.5 10a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" clipRule="evenodd" />
    </svg>
);
