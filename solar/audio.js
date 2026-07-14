const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};
let audioInitialized = false;
let currentMusicSource = null;

function initializeAudio() {
    if (!audioInitialized) {
        audioContext.resume().then(() => {
            audioInitialized = true;
            playLevelMusic(currentLevel);
        }).catch(err => console.error("Audio resume error:", err));
    }
}

function playSound(soundName) {
    if (!audioInitialized || !sounds[soundName]) return;
    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(audioContext.destination);
    source.start(0);
}

function playLevelMusic(level) {
    if (!audioInitialized) return;
    if (currentMusicSource) {
        currentMusicSource.stop();
        currentMusicSource = null;
    }

    let musicSound;
    switch (level) {
        case 1: musicSound = 'level1'; break;
        case 2: musicSound = 'level2'; break;
        case 3: musicSound = 'level3'; break;
        case 4: musicSound = 'level4'; break;
        case 5: musicSound = 'victory'; break;
        default: return;
    }

    if (sounds[musicSound]) {
        currentMusicSource = audioContext.createBufferSource();
        currentMusicSource.buffer = sounds[musicSound];
        currentMusicSource.loop = true;
        currentMusicSource.connect(audioContext.destination);
        currentMusicSource.start(0);
    }
}

export { initializeAudio, playSound, playLevelMusic };
