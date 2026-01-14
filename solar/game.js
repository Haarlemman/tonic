// Game States and Constants
const GAME_STATES = {
    START_SCREEN: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameover'
};
const INITIAL_LIVES = 3;
const COLLISIONS_PER_LIFE = 4;

// Game Variables
let currentGameState = GAME_STATES.START_SCREEN;
let collisionState = false;
let collisionTimer = null;
let lives = INITIAL_LIVES;
let collisionCount = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('solarSprintHighScore')) || 0;

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
    awman: 'sound/awman.mp3',
    hooray: 'sound/hoorayscratch.mp3',
    level1: 'sound/level1.mp3',
    level2: 'sound/cool.wav',
    level3: 'sound/drum2.wav',
    level4: 'sound/drum3.wav',
    victory: 'sound/drum22.wav',
    ohdear: 'sound/ohdear.mp3',
    owman: 'sound/owman.mp3',
    blah: 'sound/blah.mp3',
    passinglevel: 'sound/hoorayscratch.mp3',
    yaaay: 'sound/yaaay.mp3'
};
const levelCollisionSounds = {
    1: 'collision',
    2: 'ohdear',
    3: 'owman',
    4: 'blah',
};
const spriteConfig = {
    monster5Sprite: {
        frameWidth: 200,  // Adjust based on your sprite sheet
        frameHeight: 200,
        frameCount: 4,   // Total number of frames in the sheet
        frameSpeed: 2,  // Milliseconds per frame
    }
};

let tileSize, rows, cols, player, cars = [], animationFrameId;
let lastX = 0;
let currentLevel = 1;
let gameWon = false;
let spriteFrame = 0;
let lastFrameTime = 0;
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


window.addEventListener('click', initializeAudio);
window.addEventListener('keydown', initializeAudio);
window.addEventListener('touchstart', initializeAudio);

window.addEventListener('resize', resizeCanvas);

function initializeMobileSupport() {
    resizeCanvas();
    setupMobileControls();
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

async function loadSounds() {
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

function createGameOverScreen() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over-screen';
    gameOverDiv.innerHTML = `
        <div class="start-screen-container">
            <img src="assets/images/gameover.gif" alt="Game Over" class="game-over-image">
            <div class="game-stats">
                <h2>Final Score: ${score}</h2>
                <h2>High Score: ${highScore}</h2>
            </div>
            <img src="assets/images/but-playagain.png" alt="Play Again" id="restart-game-btn" class="play-again-button" style="cursor: pointer;">
        </div>
    `;
    document.body.appendChild(gameOverDiv);

    const restartBtn = document.getElementById('restart-game-btn');
    restartBtn.addEventListener('click', startGame);
}

function createStartScreen() {
    const startScreenDiv = document.createElement('div');
    startScreenDiv.id = 'start-screen';
    startScreenDiv.innerHTML = `
        <div class="start-screen-container">
            <h1>SOLAR SPRINT</h1>
            <div class="game-instructions">
                <h2>How to Play</h2>
                <ul>
                    <li>☀️ Reach the Sun at the top of the screen to go to the next level</li>
                    <li>👾 Avoid The monsters</li>
                    <li>⬆️⬇️⬅️➡️ Use arrow keys or on-screen buttons to move</li>
                    <li>🏆 Earn points by moving up and completing levels</li>
                </ul>
            </div>
            <button id="start-game-btn">START</button>
           
        </div>
    `;
    document.body.appendChild(startScreenDiv);

    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', startGame);
}

function startGame() {
    try {
        console.log("Start game button clicked");

        // Remove start or game over screen
        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over-screen');
        if (startScreen) startScreen.remove();
        if (gameOverScreen) gameOverScreen.remove();

        // Reset game state
        currentGameState = GAME_STATES.PLAYING;
        lives = INITIAL_LIVES;
        collisionCount = 0;
        score = 0;
        currentLevel = 1;
        gameWon = false;
        flashCounter = 0;

        // Reset player and cars
        resetPlayer();
        createCars();

        // Reset level
        resetLevel();

        // Reset collision state
        collisionState = false;
        if (collisionTimer) {
            clearTimeout(collisionTimer);
            collisionTimer = null;
        }

        // Reset music
        if (currentMusicSource) {
            currentMusicSource.stop();
            currentMusicSource = null;
        }
        playLevelMusic(1);

        // Ensure the canvas is properly sized
        resizeCanvas();

        // Start the game loop
        requestAnimationFrame(modifiedGameLoop);
    } catch (error) {
        console.error("Error in startGame:", error);
        alert("Error starting game: " + error.message);
    }
}



function modifiedGameLoop() {
    if (currentGameState === GAME_STATES.START_SCREEN ||
        currentGameState === GAME_STATES.GAME_OVER) {
        return;
    }

    drawBackground();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    drawScore();
    drawLives();
    moveCars();
    updateScore();
    updateHighScore();

    if (!collisionState && checkWin()) {
        score += 50;
        console.log('Flawless Victory! +50 points');
    }

    if (checkCollision() && !collisionState) {
        handleCollision();
        score = Math.max(0, score - 10);
    }

    if (checkWin()) {
        currentLevel++;
        console.log(`Level Up! Welcome to Level ${currentLevel}`);
        resetPlayer();
        createCars(currentLevel);
        playLevelMusic(currentLevel);
        requestAnimationFrame(modifiedGameLoop);
        return;
    }

    requestAnimationFrame(modifiedGameLoop);
}

function initializeAudio() {
    if (!audioInitialized) {
        audioContext.resume().then(() => {
            audioInitialized = true;
            playLevelMusic(currentLevel);
        }).catch(err => console.error("Audio resume error:", err));
    }
}

function drawLives() {
    if (images.live) {
        const startX = 20;
        const y = 50;
        const spacing = 30;

        for (let i = 0; i < lives; i++) {
            ctx.drawImage(images.live, startX + (i * spacing), y, 30, 30);
        }
    }
}

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
    }
}

function resetHighScore() {
    highScore = 0;
    localStorage.setItem('solarSprintHighScore', 0);
}

function playSound(soundName) {
    if (!audioInitialized || !sounds[soundName]) {
        return;
    }
    // ... rest of the playSound() function
    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(audioContext.destination);
    source.start(0);
}

function playLevelMusic(level) {
    if (!audioInitialized) return;
    // Stop any currently playing music
    if (currentMusicSource) {
        currentMusicSource.stop();
        currentMusicSource = null;
    }

    let musicSound;
    if (level < 5) {
        switch (level) {
            case 1: musicSound = 'level1'; break;
            case 2: musicSound = 'level2'; break;
            case 3: musicSound = 'level3'; break;
            case 4: musicSound = 'level4'; break;
        }
    } else {
        musicSound = 'victory';
    }

    if (sounds[musicSound]) {
        currentMusicSource = audioContext.createBufferSource();
        currentMusicSource.buffer = sounds[musicSound];
        currentMusicSource.loop = true;
        currentMusicSource.connect(audioContext.destination);
        currentMusicSource.start(0);
    }
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
            const isMobile = window.innerWidth < 768;
            const scaleFactor = isMobile ? 3.0 : 1.5;
            const displayWidth = FRAME_WIDTH * scaleFactor;
            const displayHeight = FRAME_HEIGHT * scaleFactor;
            const centerX = (canvas.width - displayWidth) / 2;
            const centerY = (canvas.height - displayHeight) / 2;

            ctx.drawImage(
                images.dancing,
                sourceX, sourceY,
                FRAME_WIDTH, FRAME_HEIGHT,
                centerX, centerY,
                displayWidth, displayHeight
            );

            const playAgainButton = document.getElementById('playAgainLink');
            if (playAgainButton) {
                playAgainButton.style.display = 'block';
                playAgainButton.style.top = (centerY + displayHeight + 20) + 'px';
            }
        }
    } else {
        let playerImage;
        switch (currentLevel) {
            case 1:
                playerImage = collisionState ? images.character_l1_hit : images.character_l1;
                break;
            case 2:
                playerImage = collisionState ? images.character_l2_hit : images.character_l2;
                break;
            case 3:
                playerImage = collisionState ? images.character_l3_hit : images.character_l3;
                break;
            case 4:
                playerImage = collisionState ? images.character_l4_hit : images.character_l4;
                break;
            default:
                playerImage = collisionState ? images.faceboom : images.face;
        }

        if (playerImage) {
            const isMobile = window.innerWidth < 768;
            const originalWidth = playerImage.width;
            const originalHeight = playerImage.height;

            const desiredWidth = tileSize * 2;
            const scaleFactor = desiredWidth / originalWidth;
            const displayWidth = originalWidth * scaleFactor;
            const displayHeight = originalHeight * scaleFactor;
            ctx.drawImage(
                playerImage,
                player.x, player.y,
                displayWidth, displayHeight
            );
            player.width = displayWidth;
            player.height = displayHeight;
        }
    }
}

function drawLevel() {
    if (currentLevel === 5) {
        if (flashCounter % 30 === 0) {
            flashState = !flashState;
        }
        flashCounter++;
        if (flashState) {
            ctx.fillStyle = 'yellow';
            ctx.font = '88px "Smooch Sans", serif';
            ctx.textAlign = 'center';
            ctx.fillText('YOU WIN!!!', canvas.width / 2, (canvas.height / 2) - FRAME_HEIGHT / 2 - 20);
        }
    } else {
        ctx.fillStyle = 'white';
        ctx.font = '25px "Smooch Sans", serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Level ${currentLevel}`, 20, 30);
    }
}

function drawCars() {
    const now = performance.now();
    deltaTime = now - lastTime;
    lastTime = now;

    cars.forEach((car) => {
        if (car.image) {
            let displayWidth, displayHeight;

            if (car.isSprite) { // Only animate if it's a sprite
                const frameWidth = 200;
                const frameHeight = 200;
                const numFrames = 4;

                car.spriteTimer += deltaTime;

                if (car.spriteTimer >= frameDuration) {
                    car.spriteTimer -= frameDuration;
                    car.spriteFrame = (car.spriteFrame + 1) % numFrames;
                }

                const sourceX = car.spriteFrame * frameWidth;
                const sourceY = 0;

                const originalWidth = frameWidth;
                const originalHeight = frameHeight;
                const desiredWidth = tileSize * 2.5;
                const scaleFactor = desiredWidth / originalWidth;
                displayWidth = originalWidth * scaleFactor;
                displayHeight = originalHeight * scaleFactor;

                ctx.drawImage(
                    car.image,
                    sourceX, sourceY,
                    frameWidth, frameHeight,
                    car.x, car.y,
                    displayWidth, displayHeight
                );
            } else { // Regular image drawing
                const carWidth = car.image.width;
                const carHeight = car.image.height;
                const scaleFactor = Math.min(tileSize * 2 / carWidth, tileSize * 2 / carHeight);
                displayWidth = carWidth * scaleFactor;
                displayHeight = carHeight * scaleFactor;
                ctx.drawImage(car.image, car.x, car.y, displayWidth, displayHeight);
            }
            car.width = displayWidth;
            car.height = displayHeight;
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
    const collisionPadding = 0.4;

    for (const car of cars) {
        const playerCollisionWidth = player.width * (1 - collisionPadding);
        const playerCollisionHeight = player.height * (1 - collisionPadding);
        const carCollisionWidth = car.width * (1 - collisionPadding);
        const carCollisionHeight = car.height * (1 - collisionPadding);

        const playerCollisionX = player.x + (player.width - playerCollisionWidth) / 2;
        const playerCollisionY = player.y + (player.height - playerCollisionHeight) / 2;
        const carCollisionX = car.x + (car.width - carCollisionWidth) / 2;
        const carCollisionY = car.y + (car.height - carCollisionHeight) / 2;

        if (
            playerCollisionX < carCollisionX + carCollisionWidth &&
            playerCollisionX + playerCollisionWidth > carCollisionX &&
            playerCollisionY < carCollisionY + carCollisionHeight &&
            playerCollisionY + playerCollisionHeight > carCollisionY
        ) {
            return true; // Collision detected
        }
    }
    return false; // No collision
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
    const collisionSound = levelCollisionSounds[currentLevel] || 'collision';
    playSound(collisionSound);
    score = Math.max(0, score - 200);

    collisionCount++;
    if (collisionCount >= COLLISIONS_PER_LIFE) {
        lives--;
        collisionCount = 0;
        playSound('awman');

        if (lives <= 0) {
            handleGameOver();
            return;
        }
    }

    // Visual feedback for collision
    ctx.fillStyle = 'rgba(240, 56, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (collisionTimer) clearTimeout(collisionTimer);
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

function showPointsGained(points, x, y) {
    const canvasRect = canvas.getBoundingClientRect();
    const pointsText = document.createElement('div');
    pointsText.className = 'points-gained';
    pointsText.style.left = `${canvasRect.left + x}px`; // Adjust for canvas offset
    pointsText.style.top = `${canvasRect.top + y}px`;
    pointsText.innerText = `+${points}`;
    document.body.appendChild(pointsText);

    setTimeout(() => pointsText.remove(), 1000);
}

function switchToLevel(level) {
    if (level === 1) {
        score = 0;
    }
    currentLevel = level;

    if (level < 4) {
        console.log("Should play passinglevel");
        playSound('passinglevel');
    } else if (level === 4) {
        console.log("Should play yaaay");
        playSound('yaaay');
    }

    playLevelMusic(level);
    resetPlayer();
    createCars();
}

function handleLevelCompletion() {
    if (currentLevel < 4) {
        // Play passinglevel.mp3 for levels 1-3
        playSound('passinglevel');
        setTimeout(() => {
            currentLevel++;
            resetLevel();
            playLevelMusic(currentLevel);
        }, 1000); // Wait for the sound to finish before transitioning
    } else if (currentLevel === 4) {
        // Play yaaay.mp3 for level 4 completion
        playSound('yaaay');
        setTimeout(() => {
            currentLevel++;
            resetLevel();
            playLevelMusic(currentLevel); // This will play drum19.wav on loop
        }, 2000); // Wait for the sound to finish before transitioning
    }
}

function handleGameOver() {
    currentGameState = GAME_STATES.GAME_OVER;

    // Stop any playing music
    if (currentMusicSource) {
        currentMusicSource.stop();
        currentMusicSource = null;
    }

    // Remove any existing game over screen first
    const existingScreen = document.getElementById('game-over-screen');
    if (existingScreen) {
        existingScreen.remove();
    }

    // Create game over screen with same structure as start screen
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over-screen';
    gameOverDiv.classList.add('screen-overlay'); // Using shared class with start screen

    gameOverDiv.innerHTML = `
        <div class="start-screen-container">
            <img src="assets/images/gameover.gif" alt="Game Over" class="game-over-image">
            <div class="game-stats">
                <h2>Final Score: ${score}</h2>
                <h2>High Score: ${highScore}</h2>
            </div>
            <img src="assets/images/but-playagain.png" alt="Play Again" id="restart-game-btn" class="play-again-button" style="cursor: pointer;">
        </div>
    `;

    document.body.appendChild(gameOverDiv);

    // Add event listener to the restart button
    const restartBtn = document.getElementById('restart-game-btn');
    restartBtn.addEventListener('click', () => {
        gameOverDiv.remove();
        startGame();
    });
}

function resetPlayer() {
    const isMobile = window.innerWidth < 768;
    // Increased scale for desktop, reduced for mobile
    const scaleFactor = isMobile ? 2.4 : 1.5;

    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * scaleFactor,
        height: tileSize * scaleFactor
    };
}

function createCars() {
    const isMobile = window.innerWidth < 768;
    // Adjusted scale factors for both platforms
    // Increased desktop scale to make it harder to dodge
    const scaleFactor = isMobile ? 2.4 : 2.0;

    cars = [];
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        // Individual scaling adjustments for each monster type
        let carScaleFactor = scaleFactor * (
            i === 1 ? 0.85 : // blob
                i === 2 ? 0.9 : // monster3
                    i === 3 ? 0.8 : // monster1
                        i === 4 ? 0.85 : // Added case for i === 4
                            0.85
        );

        let isSprite = false;

        if (currentLevel === 4) {
            switch (i) {
                case 1: selectedImage = images.monster1; break;
                case 2: selectedImage = images.monster3; break;
                case 3:
                    selectedImage = images.monster4Sprite;
                    isSprite = true;
                    break;
                case 4: selectedImage = images.monster6; break; // Added monster6 for level 4
                default: selectedImage = images.blob;
            }
        } else if (currentLevel === 3) {
            switch (i) {
                case 1: selectedImage = images.blob; break;
                case 2:
                    selectedImage = images.monster5Sprite; // Ensure this exists!
                    isSprite = true;
                    break;
                case 3: selectedImage = images.monster1; break;
                default: selectedImage = images.augurk;
            }
        } else { // Levels 1 and 2
            switch (i) {
                case 1: selectedImage = images.blob; break;
                case 2: selectedImage = images.monster3; break;
                case 3: selectedImage = images.monster1; break;
                case 4: selectedImage = images.monster7; break;
                default: selectedImage = images.augurk;
            }
        }




        // Adjusted speeds based on platform
        const baseSpeed = i === 2 ?
            -(Math.random() * (isMobile ? 1.2 : 2.5) + (isMobile ? 0.8 : 1.5)) :
            Math.random() * (isMobile ? 1.1 : 2.4) + (isMobile ? 0.6 : 1.2);

        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.5,
            width: tileSize * carScaleFactor,
            height: tileSize * carScaleFactor,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage,
            spriteFrame: 0,
            spriteTimer: 0,
            isSprite: isSprite
        });
    }
}

function getSpeedForLevel(baseSpeed) {
    const isMobile = window.innerWidth < 768;
    // Significantly reduced speed multipliers for both mobile and desktop
    const speedMultiplier = isMobile ?
        (currentLevel === 1 ? 1.5 : // Faster but still controllable for mobile
            currentLevel === 2 ? 1.8 :
                currentLevel === 3 ? 2.2 :
                    currentLevel === 4 ? 2.4 : 2.6) :
        // Desktop speeds - EXTREME difficulty
        (currentLevel === 1 ? 6.0 : // Increased from 4.5
            currentLevel === 2 ? 8.0 : // Increased from 5.5
                currentLevel === 3 ? 10.0 : // Increased from 6.5
                    currentLevel === 4 ? 12.0 : 14.0); // Increased from 7.5/8.5

    // Limit maximum speed
    const maxSpeed = isMobile ? 3.5 : 15.0; // Increased max speed for desktop from 8.0 to 15.0
    return Math.min(baseSpeed * speedMultiplier, maxSpeed);
}


function checkWin() {
    if (player.y <= 0) {
        // Play appropriate sound based on current level
        if (currentLevel < 4) {
            playSound('passinglevel');
        } else if (currentLevel === 4) {
            playSound('yaaay');
        }
        return true;
    }
    return false;
}

function updateScore() {
    // Points for horizontal movement
    const horizontalProgress = Math.abs(player.x - lastX);
    if (horizontalProgress > 0) {
        const horizontalPoints = Math.floor(horizontalProgress / tileSize) * 2 * currentLevel;
        if (horizontalPoints > 0) {
            score += horizontalPoints;
        }
    }
    // Points for vertical movement
    if (player.y < lastY) {
        const verticalProgress = Math.floor((lastY - player.y) / tileSize);
        const basePoints = 10;
        const levelMultiplier = currentLevel;
        const pointsGained = verticalProgress * basePoints * levelMultiplier;

        if (pointsGained > 0) {
            score += pointsGained;
        }
    }

    // Level completion bonus
    if (checkWin()) {
        const baseBonus = 200;
        const levelBonus = baseBonus * currentLevel;
        const timeBonus = Math.floor(Math.max(0, 30 - (Date.now() - levelStartTime) / 1000)) * 20;
        const totalBonus = levelBonus + timeBonus;
        score += totalBonus;
        console.log(`Level ${currentLevel} Complete! Bonus: ${totalBonus} points`);
    }

    // Update last positions
    lastX = player.x;
    lastY = player.y;
}

function resetLevel() {
    levelStartTime = Date.now();
    lastY = player.y;
    lastX = player.x;
}

function resizeCanvas() {
    const isMobile = window.innerWidth < 768; // Mobile breakpoint
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (isMobile ? 0.7 : 0.7);

    // Adaptive tile sizing
    tileSize = isMobile
        ? Math.min(canvas.width, canvas.height) / 8  // Smaller tiles for mobile
        : Math.min(canvas.width, canvas.height) / 10;

    rows = Math.floor(canvas.height / tileSize);
    cols = Math.floor(canvas.width / tileSize);

    resetPlayer();
    createCars();
}

function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    winMessage.style.display = 'block';

    // Optionally, hide the message after a delay
    setTimeout(() => {
        winMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

function setupMobileControls() {
    // Add swipe detection
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Determine direction based on larger movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            movePlayer(deltaX > 0 ? 'right' : 'left');
        } else {
            // Vertical movement
            movePlayer(deltaY > 0 ? 'down' : 'up');
        }
    });

    // Prevent default touch behaviors that might interfere with game
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

// Initialize game immediately since script is loaded dynamically
(async function initGame() {
    console.log("Game script initializing...");
    try {
        createStartScreen();
        initializeMobileSupport();

        await loadImages({
            dancing: 'assets/images/dancingspritesheet.png',
            live: 'assets/images/leven.png',
            face: 'assets/images/dude.png',
            faceboom: 'assets/images/faceboom.png',
            stripe: 'assets/images/stripe.png',
            blob: 'assets/images/blob.png',
            augurk: 'assets/images/augurk.png',
            monster1: 'assets/images/monster1.png',
            monster2: 'assets/images/monster2.png',
            monster3: 'assets/images/monster3.png',
            monster6: 'assets/images/monster6.png',
            monster7: 'assets/images/monster7.png',
            monster4Sprite: 'assets/images/monster4_spritesheet.png',
            monster5Sprite: 'assets/images/monster5_spritesheet.png',
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
        resizeCanvas();
        console.log("Game initialized successfully");
    } catch (error) {
        console.error("Initialization error:", error);
        // Manually trigger error handler if it exists
        if (window.onerror) {
            window.onerror(error.message, 'game.js', 0, 0, error);
        }
    }
})();
