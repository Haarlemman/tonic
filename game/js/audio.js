// Sound management using basic Audio elements
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};
const soundFiles = {
    collision: '/game/sound/glitshowman.mp3',
    hooray: '/game/sound/hoorayscratch.mp3',
    level1: '/game/sound/level1.mp3',
    level2: '/game/sound/cool.wav',
    level3: '/game/sound/drum2.wav',
    level4: '/game/sound/drum3.wav',
    victory: '/game/sound/drum19.wav'
};

export async function loadSounds() {
    const soundPromises = Object.entries(soundFiles).map(async ([name, url]) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
    });
    await Promise.all(soundPromises);
}

export function initSounds() {
    audioContext.resume();
}

export function playSound(name) {
    if (sounds[name]) {
        const source = audioContext.createBufferSource();
        source.buffer = sounds[name];
        source.connect(audioContext.destination);
        source.start(0);
    }
}

export function playLevelMusic(level) {
    const musicName = `level${level}`;
    playSound(musicName);
}

export const SOUNDS = {
    COLLISION: 'collision',
    HOORAY: 'hooray',
    LEVEL1: 'level1',
    LEVEL2: 'level2',
    LEVEL3: 'level3',
    LEVEL4: 'level4',
    VICTORY: 'victory'
};