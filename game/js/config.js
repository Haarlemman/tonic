const CONFIG = {
    GAME: {
        TILE_SIZE: 64,
        INITIAL_LIVES: 3,
        MAX_LEVEL: 5,
        FRAME_DURATION: 50,
        FRAME_WIDTH: 160,
        FRAME_HEIGHT: 160,
        TOTAL_FRAMES: 57
    },
    
    SCORING: {
        LEVEL_COMPLETION: 1000,
        MOVEMENT_BONUS: 50,
        COLLISION_PENALTY: 200
    },
    
    PLAYER: {
        INITIAL_SPEED: 1,
        MAX_SPEED: 3,
        COLLISION_TIMEOUT: 1000
    },
    
    OBSTACLES: {
        BASE_SPEED: 0.8,
        SPEED_MULTIPLIER: {
            LEVEL1: 1,
            LEVEL2: 1.2,
            LEVEL3: 1.4,
            LEVEL4: 1.6
        }
    },

    ASSETS: {
        IMAGES: {
            dancing: '/game/images/dancingspritesheet.png',
            face: '/game/images/face.png',
            faceboom: '/game/images/faceboom.png',
            stripe: '/game/images/stripe.png',
            monster3: '/game/images/monster3.png',
            blob: '/game/images/blob.png',
            monster1: '/game/images/monster1.png',
            augurk: '/game/images/augurk.png',
            monster2: '/game/images/monster2.png'
        },
        SOUNDS: {
            collision: '/game/sound/glitshowman.mp3',
            hooray: '/game/sound/hoorayscratch.mp3',
            level1: '/game/sound/level1.mp3',
            level2: '/game/sound/cool.wav',
            level3: '/game/sound/drum2.wav',
            level4: '/game/sound/drum3.wav',
            victory: '/game/sound/drum19.wav'
        }
    }
};

Object.freeze(CONFIG); 