// Game Configuration Constants
const GAME_CONFIG = {
    STATES: {
        START_SCREEN: 'start',
        PLAYING: 'playing',
        GAME_OVER: 'gameover'
    },
    LEVELS: {
        MAX: 5,
        BONUSES: [100, 250, 500, 750, 1000]
    },
    SOUNDS: {
        FILES: {
            collision: '/solar/sound/glitshowman.mp3',
            hooray: '/solar/sound/hoorayscratch.mp3',
            level1: '/solar/sound/level1.mp3',
            level2: '/solar/sound/cool.wav',
            level3: '/solar/sound/drum2.wav',
            level4: '/solar/sound/drum3.wav',
            victory: '/solar/sound/drum19.wav'
        }
    },
    IMAGES: {
        dancing: '/solar/images/dancingspritesheet.png',
        face: '/solar/images/dude.png',
        faceboom: '/solar/images/faceboom.png',
        stripe: '/solar/images/stripe.png',
        blob: '/solar/images/blob.png',
        augurk: '/solar/images/augurk.png',
        monster1: '/solar/images/monster1.png',
        monster2: '/solar/images/monster2.png',
        monster3: '/solar/images/monster3.png',
        characters: {
            normal: [
                '/solar/images/character_l1.png',
                '/solar/images/character_l2.png',
                '/solar/images/character_l3.png',
                '/solar/images/character_l4.png'
            ],
            hit: [
                '/solar/images/character_l1_hit.png',
                '/solar/images/character_l2_hit.png',
                '/solar/images/character_l3_hit.png',
                '/solar/images/character_l4_hit.png'
            ]
        }
    }
};

// Export for module systems if needed
export default GAME_CONFIG;
