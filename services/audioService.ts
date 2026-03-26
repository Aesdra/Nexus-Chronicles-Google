
import { Howl } from 'howler';

const SOUNDS = {
  click: 'https://cdn.jsdelivr.net/gh/krshekhar/ld-43/res/sfx/click.wav',
  levelUp: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_8874893798.mp3',
};

const MUSIC_TRACKS: Record<string, string> = {
    'tavern': 'https://cdn.pixabay.com/download/audio/2022/03/21/audio_0924972842.mp3',
    'crypt': 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_886294d138.mp3',
    'default': 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_73130ef989.mp3',
};


class AudioManager {
  private currentMusic: Howl | null = null;
  private currentMusicKey: string | null = null;
  private sounds: { [key: string]: Howl } = {};

  constructor() {
    // Preload sounds
    for (const key in SOUNDS) {
        this.sounds[key] = new Howl({
            src: [SOUNDS[key as keyof typeof SOUNDS]],
            volume: 0.5,
        });
    }
  }

  playSound(sound: keyof typeof SOUNDS) {
    if (this.sounds[sound]) {
        this.sounds[sound].play();
    }
  }

  playMusic(trackKey?: string) {
    const key = trackKey && MUSIC_TRACKS[trackKey] ? trackKey : 'default';
    
    if (this.currentMusicKey === key) {
        if (this.currentMusic && !this.currentMusic.playing()) {
            this.currentMusic.play();
        }
        return;
    }

    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, 1000);
      this.currentMusic.once('fade', () => {
        this.currentMusic?.stop();
        this.startNewTrack(key);
      });
    } else {
        this.startNewTrack(key);
    }
  }

  private startNewTrack(key: string) {
    this.currentMusicKey = key;
    const trackUrl = MUSIC_TRACKS[key];
    if(!trackUrl) return;

    this.currentMusic = new Howl({
        src: [trackUrl],
        loop: true,
        volume: 0,
        html5: true, 
    });
    this.currentMusic.play();
    this.currentMusic.fade(0, 0.3, 1500);
  }
}

export const audioManager = new AudioManager();