// Audio System Configuration
const AUDIO_CONFIG = {
    musicVolume: 0.7,
    sfxVolume: 1.0,
    fadeTime: 0.5, // seconds for fade transitions
    retryAttempts: 3
};

// Audio State Management
const audioState = {
    musicVolume: AUDIO_CONFIG.musicVolume,
    sfxVolume: AUDIO_CONFIG.sfxVolume,
    isMuted: false,
    victoryMusicPlayed: false,
    currentMusicSource: null,
    gainNodes: new Map(), // Store gain nodes for volume control
    activeAudioSources: new Set() // Track all active audio sources
};

// Initialize audio system with error handling and retries
async function initializeAudioSystem() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.resume();
            console.log("Audio system initialized successfully");
            return true;
        } catch (error) {
            console.error("Failed to initialize audio system:", error);
            return false;
        }
    }
    return true;
}

// Enhanced sound loading with retries and progress tracking
async function loadSounds() {
    let loadedCount = 0;
    const totalSounds = Object.keys(soundFiles).length;

    const loadSound = async (name, url, attempts = 0) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            sounds[name] = audioBuffer;
            loadedCount++;
            console.log(`Loaded sound ${name} (${loadedCount}/${totalSounds})`);
        } catch (error) {
            if (attempts < AUDIO_CONFIG.retryAttempts) {
                console.warn(`Retrying loading sound ${name}, attempt ${attempts + 1}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return loadSound(name, url, attempts + 1);
            }
            console.error(`Failed to load sound ${name}:`, error);
        }
    };

    try {
        await Promise.all(Object.entries(soundFiles).map(([name, url]) => loadSound(name, url)));
        console.log("All sounds loaded successfully");
    } catch (error) {
        console.error("Error loading sounds:", error);
    }
}

// Enhanced music playback with fade transitions
function playLevelMusic(level) {
    if (!audioContext || !audioInitialized) return;

    // Don't play music if system is muted
    if (audioState.isMuted) return;

    // Don't replay victory music
    if (level === 5 && audioState.victoryMusicPlayed) return;

    const fadeOut = async () => {
        if (audioState.currentMusicSource) {
            const gainNode = audioState.gainNodes.get(audioState.currentMusicSource);
            if (gainNode) {
                gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + AUDIO_CONFIG.fadeTime);
                await new Promise(resolve => setTimeout(resolve, AUDIO_CONFIG.fadeTime * 1000));
                audioState.currentMusicSource.stop();
                audioState.currentMusicSource = null;
            }
        }
    };

    const startNewMusic = (buffer, loop = true) => {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = loop;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            audioState.musicVolume, 
            audioContext.currentTime + AUDIO_CONFIG.fadeTime
        );
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        audioState.gainNodes.set(source, gainNode);
        audioState.currentMusicSource = source;
        audioState.activeAudioSources.add(source);
        
        source.onended = () => {
            audioState.activeAudioSources.delete(source);
            audioState.gainNodes.delete(source);
        };
        
        source.start(0);
    };

    // Determine which music to play
    let musicSound;
    switch (level) {
        case 1: musicSound = 'level1'; break;
        case 2: musicSound = 'level2'; break;
        case 3: musicSound = 'level3'; break;
        case 4: musicSound = 'level4'; break;
        case 5: 
            musicSound = 'victory';
            audioState.victoryMusicPlayed = true;
            break;
        default: return;
    }

    if (sounds[musicSound]) {
        fadeOut().then(() => {
            startNewMusic(sounds[musicSound], level !== 5);
        });
    }
}

// Enhanced sound effect playback with volume control
function playSound(soundName) {
    if (!audioContext || !audioInitialized || audioState.isMuted) return;
    
    if (!sounds[soundName]) {
        console.warn(`Sound "${soundName}" not found`);
        return;
    }

    try {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = sounds[soundName];
        gainNode.gain.value = audioState.sfxVolume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        audioState.activeAudioSources.add(source);
        source.onended = () => audioState.activeAudioSources.delete(source);
        
        source.start(0);
    } catch (error) {
        console.error(`Error playing sound "${soundName}":`, error);
    }
}

// Volume control functions
function setMusicVolume(volume) {
    audioState.musicVolume = Math.max(0, Math.min(1, volume));
    if (audioState.currentMusicSource) {
        const gainNode = audioState.gainNodes.get(audioState.currentMusicSource);
        if (gainNode) {
            gainNode.gain.setValueAtTime(audioState.musicVolume, audioContext.currentTime);
        }
    }
}

function setSFXVolume(volume) {
    audioState.sfxVolume = Math.max(0, Math.min(1, volume));
}

function toggleMute() {
    audioState.isMuted = !audioState.isMuted;
    audioState.activeAudioSources.forEach(source => {
        const gainNode = audioState.gainNodes.get(source);
        if (gainNode) {
            gainNode.gain.setValueAtTime(
                audioState.isMuted ? 0 : audioState.musicVolume,
                audioContext.currentTime
            );
        }
    });
}

// Reset audio state when starting new game
function resetAudioState() {
    audioState.victoryMusicPlayed = false;
    audioState.activeAudioSources.forEach(source => {
        try {
            source.stop();
        } catch (error) {
            console.warn("Error stopping audio source:", error);
        }
    });
    audioState.activeAudioSources.clear();
    audioState.gainNodes.clear();
    audioState.currentMusicSource = null;
}

// Update startGame function to include audio reset
function startGame() {
    requestAnimationFrame(modifiedGameLoop);

    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.remove();
    }

    currentGameState = GAME_STATES.PLAYING;
    score = 0;
    currentLevel = 1;
    
    resetAudioState();
    resizeCanvas();
    resetPlayer();
    createCars();
    playLevelMusic(1);
}

// Add cleanup function for when game is closed/reset
function cleanupAudio() {
    audioState.activeAudioSources.forEach(source => {
        try {
            source.stop();
        } catch (error) {
            console.warn("Error stopping audio source:", error);
        }
    });
    audioState.activeAudioSources.clear();
    audioState.gainNodes.clear();
    if (audioContext) {
        audioContext.close();
    }
}

// Event listener for page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        audioState.activeAudioSources.forEach(source => {
            const gainNode = audioState.gainNodes.get(source);
            if (gainNode) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            }
        });
    } else {
        if (audioState.currentMusicSource && !audioState.isMuted) {
            const gainNode = audioState.gainNodes.get(audioState.currentMusicSource);
            if (gainNode) {
                gainNode.gain.setValueAtTime(audioState.musicVolume, audioContext.currentTime);
            }
        }
    }
});