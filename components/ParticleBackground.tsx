import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import type { Container, Engine, RecursivePartial, IOptions } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

interface ParticleBackgroundProps {
    theme?: string;
}

const mainMenuOptions: RecursivePartial<IOptions> = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    interactivity: {
        events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
        color: { value: '#f59e0b' },
        links: { color: '#eab308', distance: 150, enable: true, opacity: 0.3, width: 1 },
        move: { direction: 'none', enable: true, outModes: { default: 'out' }, random: true, speed: 1, straight: false },
        number: { density: { enable: true, area: 800 }, value: 50 },
        opacity: { value: {min: 0.1, max: 0.5}, animation: { enable: true, speed: 1, sync: false } },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
};

const tavernOptions: RecursivePartial<IOptions> = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: { events: { onHover: { enable: false }, resize: true } },
    particles: {
        color: { value: '#fefce8' }, // yellow-50
        links: { enable: false },
        move: { 
            direction: 'top', 
            enable: true, 
            outModes: { default: 'out' }, 
            random: true, 
            speed: 0.5, 
            straight: false 
        },
        number: { density: { enable: true, area: 800 }, value: 80 },
        opacity: { value: { min: 0.1, max: 0.4 } },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
};

const cryptOptions: RecursivePartial<IOptions> = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
        events: { onHover: { enable: true, mode: 'grab' }, resize: true },
        modes: { grab: { distance: 140, links: { opacity: 0.2 } } },
    },
    particles: {
        color: { value: '#e0f2fe' }, // sky-100
        links: { enable: false },
        move: { 
            direction: 'top', 
            enable: true, 
            outModes: { default: 'out' }, 
            random: false, 
            speed: 0.3, 
            straight: false 
        },
        number: { density: { enable: true, area: 800 }, value: 40 },
        opacity: { 
            value: { min: 0.1, max: 0.6 },
            animation: { enable: true, speed: 0.8, sync: false }
        },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
};


const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme = 'main_menu' }) => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // You can perform actions once the particles are loaded
    }, []);
    
    const particleOptions = useMemo(() => {
        switch(theme) {
            case 'tavern':
                return tavernOptions;
            case 'crypt':
                return cryptOptions;
            case 'main_menu':
            default:
                return mainMenuOptions;
        }
    }, [theme]);

    return (
        <Particles
            id="tsparticles"
            key={theme} // Add key to force re-initialization on theme change
            init={particlesInit}
            loaded={particlesLoaded}
            options={particleOptions}
            className="absolute inset-0 z-0"
        />
    );
};

export default ParticleBackground;