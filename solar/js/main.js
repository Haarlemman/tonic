import { canvas, ctx, resizeCanvas } from '/game/js/canvas.js';
import { loadImages, images } from '/game/js/images.js';
import { loadSounds, initSounds, playSound, playLevelMusic, SOUNDS } from '/game/js/audio.js';
import { initializeControls } from '/game/js/controls.js';
import { 
    resetPlayer, 
    handleCollision, 
    updateLastY, 
    getLastY, 
    drawPlayer,
    player
} from '/game/js/player.js';
import { createCars, moveCars, checkCollisionWithCars, drawCars } from '/game/js/cars.js';
import { 
    currentLevel, 
    gameWon, 
    score, 
    switchToLevel, 
    checkWin, 
    updateScore, 
    updateHighScore,
    drawLevel,
    drawScore,
    tileSize 
} from '/game/js/levels.js';
import { updatePlanets, drawPlanets, initPlanets } from '/game/js/planets.js';

let animationFrameId;
let rows = Math.floor(window.innerHeight / tileSize);
const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50;
let spriteFrame = 0;
let lastFrameTime = 0;
let flashState = true;
let flashCounter = 0;

function drawBackground() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

function drawStreetLines() {
    if (images.stripe) {
        const stripeWidth = tileSize / 3;
        const stripeHeight = tileSize / 40;
        const gap = stripeWidth * 1;

        for (let i = 1; i < rows - 1; i++) {
            for (let x = 0; x < canvas.width; x += stripeWidth + gap) {
                ctx.drawImage(images.stripe, x, i * tileSize + (tileSize / 2) - (stripeHeight / 2), stripeWidth, stripeHeight);
            }
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlanets();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    drawScore();
}

function gameLoop() {
    drawGame();
    moveCars();
    updatePlanets();
    
    if (checkWin()) {
        console.log('Win detected, current level:', currentLevel);
        if (currentLevel < 5) {
            console.log('Advancing to next level');
            switchToLevel(currentLevel + 1);
        } else if (currentLevel === 5 && !gameWon) {
            console.log('Final level complete!');
            score += 5000;
            gameWon = true;
            updateHighScore();
        }
    }

    if (checkCollisionWithCars()) {
        handleCollision();
    }

    updateScore(player.y, getLastY());
    updateLastY();

    animationFrameId = requestAnimationFrame(gameLoop);
}

async function initGame() {
    try {
        console.log('Game initializing...');
        resizeCanvas();
        
        const imageSources = {
            background: '/game/images/ruimte.jpg',
            dancing: '/game/images/dancingspritesheet.png',
            face: '/game/images/face.png',
            faceboom: '/game/images/faceboom.png',
            stripe: '/game/images/stripe.png',
            planet1: '/game/images/planet1.png',
            planet2: '/game/images/planet2.png',
            planet3: '/game/images/planet3.png',
            planet4: '/game/images/planet4.png',
            planet5: '/game/images/planet5.png',
            planet6: '/game/images/planet6.png',
            planet7: '/game/images/planet7.png',
            planet8: '/game/images/planet8.png',
            monster3: '/game/images/monster3.png',
            blob: '/game/images/blob.png',
            monster1: '/game/images/monster1.png',
            augurk: '/game/images/augurk.png',
            monster2: '/game/images/monster2.png'
        };
        
        await loadImages(imageSources);
        initSounds();
        initializeControls();
        resetPlayer();
        createCars();
        initPlanets();
        gameLoop();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Start the game when the window loads
window.addEventListener('load', initGame);
window.addEventListener('resize', resizeCanvas);
