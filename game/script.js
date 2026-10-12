const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const spriteSheet = new Image();
spriteSheet.src = "images/dancingspritesheet.png";

let tileSize, rows, cols, player, cars = [], animationFrameId;
const images = {};
let collisionState = false;
let collisionTimer = null;
let currentLevel = 1;
let gameWon = false;
let audioInitialized = false;
let spriteFrame = 0;
let lastFrameTime = 0;
const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50; // milliseconds per frame



spriteSheet.onload = () => {
    console.log("Sprite sheet loaded successfully");
};
spriteSheet.onerror = (err) => {
    console.error("Error loading sprite sheet", err);
};




// Audio context and sources
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
    collision: new Audio('sound/glitshowman.mp3'),
    hooray: new Audio('sound/hoorayscratch.mp3'),
    level1: new Audio('sound/level1.mp3'),
    level2: new Audio('sound/cool.wav'),
    level3: new Audio('sound/drum2.wav'),
    level4: new Audio('sound/drum3.wav'),
    victory: new Audio('sound/techno3.wav')
};

// Configure audio settings
Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
});

// Set looping for background music
sounds.level1.loop = true;
sounds.level2.loop = true;
sounds.level3.loop = true;
sounds.level4.loop = true;
sounds.victory.loop = true;

// Load images for the game
async function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                images[key] = img;
                resolve();
            };
            img.onerror = (error) => {
                console.error(`Failed to load ${key} from ${src}:`, error);
                reject(`Failed to load ${src}`);
            };
            img.src = src;
        });
    });
    await Promise.all(promises);
}

// Initialize audio on user interaction
function initializeAudio() {
    if (!audioInitialized) {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully');
            audioInitialized = true;
            
            // Start the appropriate music based on current level
            playLevelMusic(currentLevel);
        }).catch(error => {
            console.error('Error resuming AudioContext:', error);
        });
    }
}

// Add event listeners for audio initialization
window.addEventListener('click', initializeAudio);
window.addEventListener('keydown', initializeAudio);
window.addEventListener('touchstart', initializeAudio);

// Function to play level music
function playLevelMusic(level) {
    if (!audioInitialized) return;

    // Stop all music first
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    // Play the appropriate music
    try {
        switch(level) {
            case 1:
                sounds.level1.play();
                break;
            case 2:
                sounds.level2.play();
                break;
            case 3:
                sounds.level3.play();
                break;
            case 4:
                sounds.level4.play();
                break;
            case 5:
                sounds.victory.play();
                break;
        }
    } catch (error) {
        console.error('Error playing level music:', error);
    }
}

// Modified handleCollision function
function handleCollision() {
    collisionState = true;
    if (audioInitialized) {
        sounds.collision.currentTime = 0;
        sounds.collision.play().catch(error => {
            console.log("Collision sound failed:", error);
        });
    }
    if (collisionTimer) {
        clearTimeout(collisionTimer);
    }
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

// Modified switchToLevel function
function switchToLevel(level) {
    currentLevel = level;

    if (audioInitialized) {
        sounds.hooray.currentTime = 0;
        sounds.hooray.play().catch(error => {
            console.log("Hooray sound failed:", error);
        });
        playLevelMusic(level);
    }

    resetPlayer();
    createCars();
}

// Rest of your existing code remains the same...
// Resize canvas and initialize game state
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    tileSize = Math.min(canvas.width, canvas.height) / 10;
    rows = 9;
    cols = Math.floor(canvas.width / tileSize);
}

// Helper function to get the speed based on the current level
function getSpeedForLevel(baseSpeed) {
    const speedMultiplier = currentLevel === 1 ? 1 : currentLevel === 2 ? 1.5 : 2;
    return baseSpeed * speedMultiplier;
}

// Create cars based on the level
function createCars() {
    cars = [];
    for (let i = 1; i < rows - 4; i++) {
        let selectedImage;
        if (i === 2) {
            selectedImage = images.monster3;
        } else if (i === 1) {
            selectedImage = images.blob;
        } else if (i === 3) {
            selectedImage = images.monster1;
        } else if (i === 4) {
            selectedImage = images.augurk;
        } else {
            selectedImage = images.monster2;
        }

        const baseSpeed = i === 2 ? -(Math.random() * 2 + 1) : Math.random() * 2 + 1;
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize,
            width: tileSize * 2,
            height: tileSize,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}

// Draw the background of the game
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw the street lines
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

// Draw the player on the canvas
function drawPlayer() {
    if (currentLevel === 5) {
        // Draw dancing animation centered in the canvas
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

            // Calculate the center position
            const centerX = (canvas.width - scaledWidth) / 2;
            const centerY = (canvas.height - scaledHeight) / 2;

            ctx.drawImage(
                images.dancing,
                sourceX, sourceY,
                FRAME_WIDTH, FRAME_HEIGHT,
                centerX, centerY,
                scaledWidth, scaledHeight
            );

            // Show the "Play Again" button below the dancing player
            const playAgainButton = document.getElementById('playAgainLink');
            playAgainButton.style.display = 'block';  // Show the button
            playAgainButton.style.top = (centerY + scaledHeight + 20) + 'px';  // Adjust position below the player
        }
    } else {
        // Draw regular player
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


// Draw the current level message
function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${currentLevel}`, 20, 30);
    if (currentLevel === 5 && !gameWon) {
        ctx.fillStyle = 'yellow';
        ctx.font = '30px Arial';
        ctx.fillText('YOU WON!!!', canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Draw the cars in the game
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

// Move the cars across the screen
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

// Check if the player has collided with any car
function checkCollision() {
    return cars.some(car => 
        player.x < car.x + car.width &&
        player.x + player.width > car.x &&
        player.y < car.y + car.height &&
        player.y + player.height > car.y
    );
}

// Check if the player has reached the top of the screen (goal)
function checkWin() {
    return player.y <= 0;
}

// Move the player based on user input
function movePlayer(direction) {
    if (collisionState) return;
    
    if (direction === 'up') player.y -= tileSize;
    if (direction === 'down') player.y += tileSize;
    if (direction === 'left') player.x -= tileSize;
    if (direction === 'right') player.x += tileSize;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// Game loop
function gameLoop() {
    drawBackground();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    moveCars();

    if (checkWin()) {
        if (currentLevel === 1) {
            switchToLevel(2);
        } else if (currentLevel === 2) {
            switchToLevel(3);
        } else if (currentLevel === 3) {
            switchToLevel(4);
        } else if (currentLevel === 4) {
            switchToLevel(5);
        }
    }

    if (checkCollision() && !collisionState) {
        handleCollision();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Reset player position
function resetPlayer() {
    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * 2,
        height: tileSize,
    };
}

// Event listeners for the buttons
upButton.addEventListener('click', () => movePlayer('up'));
downButton.addEventListener('click', () => movePlayer('down'));
leftButton.addEventListener('click', () => movePlayer('left'));
rightButton.addEventListener('click', () => movePlayer('right'));

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") movePlayer('up');
    if (e.key === "ArrowDown") movePlayer('down');
    if (e.key === "ArrowLeft") movePlayer('left');
    if (e.key === "ArrowRight") movePlayer('right');
});

// Start the game
window.addEventListener('load', () => {
    resizeCanvas();
   // Load non-dancing images first
loadImages({
    face: 'images/face.png',
    faceboom: 'images/faceboom.png',
    monster1: 'images/monster1.png',
    monster2: 'images/monster2.png',
    monster3: 'images/monster3.png',
    blob: 'images/blob.png',
    augurk: 'images/augurk.png',
    stripe: 'images/stripe.png'
}).then(() => {
    // After non-dancing images are loaded, load the dancing sprite sheet
    spriteSheet.onload = () => {
        console.log("Dancing sprite sheet loaded successfully");
        images.dancing = spriteSheet;  // Ensure it's loaded after the image is ready
        switchToLevel(1);
        gameLoop();
    };

    spriteSheet.onerror = (err) => {
        console.error("Error loading dancing sprite sheet", err);
    };

    spriteSheet.src = "images/dancingspritesheet.png"; // Load dancing sprite sheet here
}).catch(error => {
    console.error('Failed to load images:', error);
});
;
});

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    resetPlayer();
});