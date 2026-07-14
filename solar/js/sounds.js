// Sound management
const soundFiles = {
    boom: new Audio('sound/glitshowman.mp3'),      // for collisions
    win: new Audio('sound/hoorayscratch.mp3'),     // for winning
    level1: new Audio('sound/level1.mp3'),
    level2: new Audio('sound/cool.wav'),
    level3: new Audio('sound/drum2.wav'),
    level4: new Audio('sound/drum3.wav'),
    victory: new Audio('sound/drum19.wav')
};

// Set volume for all sounds
Object.values(soundFiles).forEach(sound => {
    sound.volume = 0.4;
});

// Initialize all sounds
export function initSounds() {
    console.log('Loading sounds...');
    // Pre-load all sounds
    Object.values(soundFiles).forEach(sound => {
        sound.load();
    });
    
    // Enable sounds on first interaction
    const enableSounds = () => {
        console.log('Enabling sounds...');
        // Try to play and immediately pause each sound
        Object.values(soundFiles).forEach(sound => {
            sound.play()
                .then(() => {
                    sound.pause();
                    sound.currentTime = 0;
                    console.log('Sound initialized successfully');
                })
                .catch(err => console.log('Sound init error:', err));
        });
    };

    // Listen for user interaction
    document.addEventListener('click', enableSounds, { once: true });
    document.addEventListener('touchstart', enableSounds, { once: true });
}

export function playSound(name) {
    const sound = soundFiles[name];
    if (sound) {
        console.log('Playing sound:', name);
        // Reset the sound
        sound.currentTime = 0;
        
        // Play the sound
        sound.play()
            .catch(err => console.log('Sound play error:', err));
    }
} 
