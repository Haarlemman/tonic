const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};
const soundFiles = {
    collision: '/solar/sound/glitshowman.mp3',
    hooray: '/solar/sound/hoorayscratch.mp3',
    level1: '/solar/sound/level1.mp3',
    level2: '/solar/sound/cool.wav',
    level3: '/solar/sound/drum2.wav',
    level4: '/solar/sound/drum3.wav',
    victory: '/solar/sound/drum19.wav'
};

async function loadSounds() {
    try {
        const soundPromises = Object.entries(soundFiles).map(async ([name, url]) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
        });
        await Promise.all(soundPromises);
        console.log("Sounds loaded");
    } catch (error) {
        console.error("Failed to load sounds:", error);
    }
}
