const GAME_STATES = {
    START_SCREEN: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameover'
};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const spriteSheet = new Image();
const maxLevel = 5;
const images = {};
const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};
const soundFiles = {
    collision: 'sound/glitshowman.mp3',
    hooray: 'sound/hoorayscratch.mp3',
    level1: 'sound/level1.mp3',
    level2: 'sound/cool.wav',
    level3: 'sound/drum2.wav',
    level4: 'sound/drum3.wav',
    victory: 'sound/drum19.wav',
	ohdear: 'sound/ohdear.mp3',
	owman: 'sound/owman.mp3',
	blah: 'sound/blah.mp3',
};
const levelCollisionSounds = {
    1: 'collision',
    2: 'ohdear',
    3: 'owman',
    4: 'blah',
    5: 'victory'
};

let currentGameState = GAME_STATES.START_SCREEN;
let tileSize, rows, cols, player, cars = [], animationFrameId;
let lastX = 0;
let collisionState = false;
let collisionTimer = null;
let currentLevel = 1;
let gameWon = false;
let spriteFrame = 0;
let lastFrameTime = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('solarSprintHighScore')) || 0;
let lastY = 0;
let flashState = true;
let flashCounter = 0;
let levelStartTime = Date.now();
let audioInitialized = false;
let currentMusicSource = null;
let deltaTime = 0;
let lastTime = 0;
let frameDuration = 120;

spriteSheet.onload = () => console.log("Sprite sheet loaded");
spriteSheet.onerror = (err) => console.error("Sprite sheet error", err);

window.addEventListener('load', async () => {
    createStartScreen();

    await loadImages({
    });
    await loadSounds();

    gameLoop = modifiedGameLoop;
    gameLoop();
});	
window.addEventListener('click', initializeAudio);
window.addEventListener('keydown', initializeAudio);
window.addEventListener('touchstart', initializeAudio)
window.addEventListener('load', () => {
    initializeMobileSupport();
    window.addEventListener('resize', resizeCanvas);
});
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', async () => {
    resizeCanvas();
	// Call this in your window load or initialization
function initializeMobileSupport() {
    resizeCanvas();
    setupMobileControls();
    
    // Improve button sizes for mobile
    const buttons = [upButton, downButton, leftButton, rightButton];
    buttons.forEach(btn => {
        btn.style.width = '60px';
        btn.style.height = '60px';
        btn.style.fontSize = '16px';
    });
}
    await loadImages({
        dancing: 'assets/images/dancingspritesheet.png',
        face: 'assets/images/dude.png',
        faceboom: 'assets/images/faceboom.png',
        stripe: 'assets/images/stripe.png',
        blob: 'assets/images/blob.png',
        augurk: 'assets/images/augurk.png',
        monster1: 'assets/images/monster1.png',
        monster2: 'assets/images/monster2.png',
        monster3: 'assets/images/monster3.png',
		monster4Sprite: 'assets/images/monster4_spritesheet.png', // Load the sprite sheet
        character_l1: 'assets/images/character_l1.png',
        character_l2: 'assets/images/character_l2.png',
        character_l3: 'assets/images/character_l3.png',
        character_l4: 'assets/images/character_l4.png',
		character_l1_hit: 'assets/images/character_l1_hit.png',
		character_l2_hit: 'assets/images/character_l2_hit.png',
		character_l3_hit: 'assets/images/character_l3_hit.png',
		character_l4_hit: 'assets/images/character_l4_hit.png',
    });
    await loadSounds();
    gameLoop();  // Start the game loop after loading all assets
});

upButton.addEventListener('click', () => movePlayer('up'));
downButton.addEventListener('click', () => movePlayer('down'));
leftButton.addEventListener('click', () => movePlayer('left'));
rightButton.addEventListener('click', () => movePlayer('right'));

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowUp": movePlayer('up'); break;
        case "ArrowDown": movePlayer('down'); break;
        case "ArrowLeft": movePlayer('left'); break;
        case "ArrowRight": movePlayer('right'); break;
    }
});
