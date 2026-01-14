// Game constants and variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Initialize game variables
let tileSize = Math.min(window.innerWidth, window.innerHeight) / 10;
let rows = Math.floor(window.innerHeight / tileSize);
let cols = Math.floor(window.innerWidth / tileSize);
let player = {
    x: 0,
    y: 0,
    width: tileSize * 2,
    height: tileSize
};
let cars = [];
let animationFrameId;
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

// Image loading
async function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { 
                images[key] = img; 
                console.log(`Loaded image: ${key}`);
                resolve(); 
            };
            img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
            img.src = src;
        });
    });
    try {
        await Promise.all(promises);
        console.log("All images loaded successfully");
    } catch (error) {
        console.error("Failed to load images:", error);
        throw error;
    }
}

// Drawing functions
function drawBackground() {
    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the background image if it exists in the images object
    if (images.background) {
        ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    }
}

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

            ctx.drawImage(images.dancing, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, 
                         centerX, centerY, scaledWidth, scaledHeight);
            
            const playAgainButton = document.getElementById('playAgainLink');
            if (playAgainButton) {
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
            // Update player hitbox
            player.width = scaledWidth;
            player.height = scaledHeight;
        }
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
            // Update car hitbox
            car.width = scaledWidth;
            car.height = scaledHeight;
        }
    });
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    if (currentLevel === 5) {
        if (flashCounter % 30 === 0) {
            flashState = !flashState;
        }
        flashCounter++;

        if (flashState) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('Enlightened', 20, 30);
        }
    } else {
        ctx.fillText(`Level ${currentLevel}`, 20, 30);
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`🏆 High Score: ${highScore}`, canvas.width - 20, 60);
}

// Game mechanics
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

function movePlayer(direction) {
    if (collisionState) return;

    if (direction === 'up') player.y -= tileSize;
    if (direction === 'down') player.y += tileSize;
    if (direction === 'left') player.x -= tileSize;
    if (direction === 'right') player.x += tileSize;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function checkCollision() {
    return cars.some(car =>
        player.x < car.x + car.width &&
        player.x + player.width > car.x &&
        player.y < car.y + car.height &&
        player.y + player.height > car.y
    );
}

function handleCollision() {
    collisionState = true;
    playSound('collision');
    score = Math.max(0, score - 200);
    if (collisionTimer) clearTimeout(collisionTimer);
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

function checkWin() {
    // Add logic to check if the player has won the level
    return player.y < 50; // Win if player is near the top of the canvas
}

// Game state management
function createCars() {
    cars = [];
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        if (i === 2) selectedImage = images.monster3;
        else if (i === 1) selectedImage = images.blob;
        else if (i === 3) selectedImage = images.monster1;
        else selectedImage = images.augurk;

        const baseSpeed = i === 2 ? -(Math.random() * 1.5 + 0.8) : Math.random() * 1.5 + 0.8;
        
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.2,
            width: tileSize * 2,
            height: tileSize,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}

function getSpeedForLevel(baseSpeed) {
    const speedMultiplier = currentLevel === 1 ? 1 : 
                           currentLevel === 2 ? 1.2 : 
                           currentLevel === 3 ? 1.4 : 1.6;
    return baseSpeed * speedMultiplier;
}

function switchToLevel(level) {
    if (level === 1) {
        score = 0;
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
        width: tileSize * 2,
        height: tileSize
    };
    lastY = player.y;
}

function updateScore() {
    if (!collisionState) {
        if (player.y < lastY) {
            score += Math.floor((lastY - player.y) / tileSize) * 50;
        }
        lastY = player.y;
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('solarSprintHighScore', highScore);
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

// Game loop
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

// Event listeners
window.addEventListener('load', async () => {
    try {
        console.log('Game initializing...');
        resizeCanvas();
        await loadImages({
            background: 'assets/images/ruimte.jpg',  // Add background image
            dancing: 'assets/images/dancingspritesheet.png',
            face: 'assets/images/face.png',
            faceboom: 'assets/images/faceboom.png',
            stripe: 'assets/images/stripe.png',
            monster3: 'assets/images/monster3.png',
            blob: 'assets/images/blob.png',
            monster1: 'assets/images/monster1.png',
            augurk: 'assets/images/augurk.png',
            monster2: 'assets/images/monster2.png'
        });
        
        createCars();
        gameLoop();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
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

window.addEventListener('resize', resizeCanvas);