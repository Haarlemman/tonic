
async function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { images[key] = img; resolve(); };
            img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
            img.src = src;
        });
    });
    try {
      await Promise.all(promises);
      console.log("Images loaded")
    } catch (error) {
      console.error("Failed to load images:", error)
    }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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