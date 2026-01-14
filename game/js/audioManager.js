class AudioManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;
        this.isMuted = false;
    }

    playMusic(key) {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        const audio = this.assetLoader.getSound(key);
        if (audio) {
            this.currentMusic = audio;
            audio.volume = this.musicVolume;
            audio.loop = true;
            
            const playPromise = audio.play();
            if (playPromise) {
                playPromise.catch(error => {
                    GameLogger.warn('Music autoplay prevented: ' + error);
                });
            }
        }
    }

    playSound(key) {
        const audio = this.assetLoader.getSound(key);
        if (audio) {
            const clone = audio.cloneNode();
            clone.volume = this.soundVolume;
            
            const playPromise = clone.play();
            if (playPromise) {
                playPromise.catch(error => {
                    GameLogger.warn('Sound autoplay prevented: ' + error);
                });
            }
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.currentMusic) {
            this.currentMusic.volume = this.isMuted ? 0 : this.musicVolume;
        }
    }
} 