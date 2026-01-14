export const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};
const soundFiles = {
    collision: 'sound/glitshowman.mp3',
    hooray: 'sound/hoorayscratch.mp3',
    level1: 'sound/level1.mp3',
    level2: 'sound/cool.wav',
    level3: 'sound/drum2.wav',
    level4: 'sound/drum3.wav',
    victory: 'sound/drum19.wav'
};

async function loadSounds() {
  try {
    const soundPromises = Object.entries(soundFiles).map(async ([name, url]) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
    });
    await Promise.all(soundPromises);
    console.log("Sounds loaded");
  } catch (error) {
    console.error("Failed to load sounds:", error);
  }
}

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

window.addEventListener('click', initializeAudio);
window.addEventListener('keydown', initializeAudio);
window.addEventListener('touchstart', initializeAudio);

export function playSound(soundName) {
    if (!audioInitialized || !sounds[soundName]) return;
    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(audioContext.destination);
    source.start(0);
}

export function playLevelMusic(level) {
    if (!audioInitialized) return;
    if (currentMusicSource) currentMusicSource.stop();

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