export const sounds = {};
export const soundFiles = {
    collision: '/solar/sound/glitshowman.mp3',
    hooray: '/solar/sound/hoorayscratch.mp3',
    level1: '/solar/sound/level1.mp3',
    level2: '/solar/sound/cool.wav',
    level3: '/solar/sound/drum2.wav',
    level4: '/solar/sound/drum3.wav',
    victory: '/solar/sound/drum19.wav'
};

export async function loadSounds() {
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
