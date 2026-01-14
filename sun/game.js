const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const spriteSheet = new Image();
let tileSize, rows, cols, player, cars = [], animationFrameId;
const images = {};

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

const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50;

spriteSheet.onload = () => console.log("Sprite sheet loaded");
spriteSheet.onerror = (err) => console.error("Sprite sheet error", err);


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

// Audio System - using HTML5 Audio for local file compatibility
const sounds = {
    collision: new Audio('sound/glitshowman.mp3'),
    hooray: new Audio('sound/hoorayscratch.mp3'),
    level1: new Audio('sound/level1.mp3'),
    level2: new Audio('sound/cool.wav'),
    level3: new Audio('sound/drum2.wav'),
    level4: new Audio('sound/drum3.wav'),
    victory: new Audio('sound/drum19.wav')
};

// Configure loops
sounds.level1.loop = true;
sounds.level2.loop = true;
sounds.level3.loop = true;
sounds.level4.loop = true;
sounds.victory.loop = true;

// Preload
Object.values(sounds).forEach(sound => sound.load());

let currentMusic = null;

function playSound(name) {
    if (sounds[name]) {
        // Clone for overlapping sounds (like collisions) or just reset
        if (name === 'collision' || name === 'hooray') {
             const soundClone = sounds[name].cloneNode();
             soundClone.play().catch(e => console.log("Sound play error", e));
        } else {
             sounds[name].currentTime = 0;
             sounds[name].play().catch(e => console.log("Sound play error", e));
        }
    }
}

function playLevelMusic(level) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    let musicName;
    switch (level) {
        case 1: musicName = 'level1'; break;
        case 2: musicName = 'level2'; break;
        case 3: musicName = 'level3'; break;
        case 4: musicName = 'level4'; break;
        case 5: musicName = 'victory'; break;
        default: return;
    }

    if (sounds[musicName]) {
        currentMusic = sounds[musicName];
        currentMusic.play().catch(e => console.log("Music play error (user interaction needed?)", e));
    }
}

// User interaction handling for audio context unlocking (not strictly needed for Audio element but good practice for auto-play policies)
function unlockAudio() {
    // For HTML5 Audio, explicit unlock isn't as critical as WebAudio, but playing on interaction helps
    if (currentMusic && currentMusic.paused) {
        currentMusic.play().catch(e => {});
    }
}

window.addEventListener('click', unlockAudio);
window.addEventListener('keydown', unlockAudio);
window.addEventListener('touchstart', unlockAudio);


// Add this function to draw the score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'right';
    // Current Score
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    
    // High Score 
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('solarSprintHighScore', highScore);
        
        // Show a "New High Score!" message
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('New High Score!', canvas.width / 2, 100);
    }
}

function resetHighScore() {
    highScore = 0;
    localStorage.setItem('solarSprintHighScore', 0);
}


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

function drawPlayer() {
    if (currentLevel === 5) {
        if (images.dancing) {
            const currentTime = performance.now();
            if (currentTime - lastFrameTime > FRAME_DURATION) {
                spriteFrame = (spriteFrame + 1) % TOTAL_FRAMES;
                lastFrameTime = currentTime;
            }

            const sourceX = spriteFrame * FRAME_WIDTH;
            const sourceY = 0;
            const scaleFactor = Math.min(tileSize * 3 / FRAME_WIDTH, tileSize * 3 / FRAME_HEIGHT);
            const scaledWidth = FRAME_WIDTH * scaleFactor;
            const scaledHeight = FRAME_HEIGHT * scaleFactor;
            const centerX = (canvas.width - scaledWidth) / 2;
            const centerY = (canvas.height - scaledHeight) / 2;

            ctx.drawImage(images.dancing, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, centerX, centerY, scaledWidth, scaledHeight);
            const playAgainButton = document.getElementById('playAgainLink');
            if (playAgainButton){
                playAgainButton.style.display = 'block';
                playAgainButton.style.top = (centerY + scaledHeight + 20) + 'px';
            }
        }
    } else {
        const playerImage = collisionState ? images.faceboom : images.face;
        if (playerImage) {
            const playerWidth = playerImage.width;
            const playerHeight = playerImage.height;
            const scaleFactor = Math.min(tileSize * 3 / playerWidth, tileSize * 3 / playerHeight);
            const scaledWidth = playerWidth * scaleFactor;
            const scaledHeight = playerHeight * scaleFactor;
            ctx.drawImage(playerImage, player.x, player.y, scaledWidth, scaledHeight);
        }
    }
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'left';

    if (currentLevel === 5) {
        // Increment counter and toggle flashState every 30 frames
        if (flashCounter % 30 === 0) {
            flashState = !flashState;
        }
        flashCounter++;

        if (flashState) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('LIT', 20, 30);
        }
    } else {
        ctx.fillText(`Level ${currentLevel}`, 20, 30);
    }
}


function drawCars() {
    cars.forEach((car) => {
        if (car.image) {
            const carWidth = car.image.width;
            const carHeight = car.image.height;
            const scaleFactor = Math.min(tileSize * 2 / carWidth, tileSize * 2 / carHeight);
            const scaledWidth = carWidth * scaleFactor;
            const scaledHeight = carHeight * scaleFactor;
            ctx.drawImage(car.image, car.x, car.y, scaledWidth, scaledHeight);
        }
    });
}

function moveCars() {
    cars.forEach(car => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.speed < 0 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });
}

function checkCollision() {
    return cars.some(car =>
        player.x < car.x + car.width &&
        player.x + player.width > car.x &&
        player.y < car.y + car.height &&
        player.y + player.height > car.y
    );
}

function movePlayer(direction) {
    if (collisionState) return;

    if (direction === 'up') player.y -= tileSize;
    if (direction === 'down') player.y += tileSize;
    if (direction === 'left') player.x -= tileSize;
    if (direction === 'right') player.x += tileSize;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function handleCollision() {
    collisionState = true;
    playSound('collision');
    score = Math.max(0, score - 200); // Penalty for collision, but don't go below 0
    if (collisionTimer) clearTimeout(collisionTimer);
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

function switchToLevel(level) {
    if (level === 1) {
        score = 0; // Reset score only when starting a new game
    }
    currentLevel = level;
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
}


function resetPlayer() {
    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * 2,  // Set width based on tileSize
        height: tileSize     // Set height based on tileSize
    };
    lastY = player.y; // Reset lastY position

}


function createCars() {
    cars = [];
    const maxRows = 4; // Reduced from 5 to 4 rows to make it more manageable
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        if (i === 2) selectedImage = images.monster3;
        else if (i === 1) selectedImage = images.blob;
        else if (i === 3) selectedImage = images.monster1;
        else selectedImage = images.augurk;

        // Reduce base speed range
        const baseSpeed = i === 2 ? -(Math.random() * 1.5 + 0.8) : Math.random() * 1.5 + 0.8;
        
        // Add some gaps between cars by randomizing starting positions
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.2, // Add 20% more space between rows
            width: tileSize * 2,
            height: tileSize,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}

function getSpeedForLevel(baseSpeed) {
    // Reduce the speed multiplier for higher levels
    const speedMultiplier = currentLevel === 1 ? 1 : 
                           currentLevel === 2 ? 1.2 : 
                           currentLevel === 3 ? 1.4 : 1.6;
    return baseSpeed * speedMultiplier;
}


function checkWin() {
    // Add logic to check if the player has won the level
    return player.y < 50; // Example: win if player is near the top of the canvas
}




function gameLoop() {
    drawBackground();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    drawScore();
    moveCars();
    updateScore();
    updateHighScore();

    if (checkWin()) {
        if (currentLevel < 5) {
            score += currentLevel * 1000;
            switchToLevel(currentLevel + 1);
        } else if (currentLevel === 5 && !gameWon) {
            score += 5000;
            gameWon = true;
            playLevelMusic(5);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('solarSprintHighScore', highScore);
            }
        }
    }

    if (checkCollision() && !collisionState) {
        handleCollision();
    }

    requestAnimationFrame(gameLoop);
}


function updateScore() {
    if (!collisionState) {
        // Award points for moving upward
        if (player.y < lastY) {
            score += Math.floor((lastY - player.y) / tileSize) * 50;
        }
        lastY = player.y;
    }
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    tileSize = Math.min(canvas.width, canvas.height) / 10;
    rows = Math.floor(canvas.height / tileSize);
    cols = Math.floor(canvas.width / tileSize);
    resetPlayer();
    createCars();
}

// Initialization Logic
async function initGame() {
    resizeCanvas();
    await loadImages({
        dancing: 'images/dancingspritesheet.png',
        face: 'images/dude.png',
        faceboom: 'images/faceboom.png',
        stripe: 'images/stripe.png',
        monster3: 'images/monster3.png',
        blob: 'images/blob.png',
        monster1: 'images/monster1.png',
        augurk: 'images/augurk.png',
        monster2: 'images/monster2.png'
    });
    // Sounds are already loaded via new Audio(), but we can ensure loop/music starts
    playLevelMusic(1);
    gameLoop();
}

// Handle initialization race condition
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM already loaded, run immediately
    initGame();
}


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

window.addEventListener('resize', resizeCanvas);
