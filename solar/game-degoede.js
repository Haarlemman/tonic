const GAME_STATES = {
    START_SCREEN: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameover'
};

let currentGameState = GAME_STATES.START_SCREEN;

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
    console.log("Start game button clicked");
    requestAnimationFrame(modifiedGameLoop);

    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.remove();
    }

    currentGameState = GAME_STATES.PLAYING;
    score = 0; //
    currentLevel = 1; 
    resizeCanvas();
    resetPlayer();
    createCars();
    playLevelMusic(1);
	
}

function resetLevel() {
    levelStartTime = Date.now();
    lastY = player.y;
	lastX = player.x;
	}

    
function modifiedGameLoop() {
    if (currentGameState === GAME_STATES.START_SCREEN) {
        return; 
    }
    drawBackground();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    drawScore();
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

window.addEventListener('load', async () => {
    createStartScreen();

    await loadImages({
    });
    await loadSounds();

    gameLoop = modifiedGameLoop;
    gameLoop();
});	
	
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const spriteSheet = new Image();
let tileSize, rows, cols, player, cars = [], animationFrameId;
const images = {};

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


let audioInitialized = false;
let currentMusicSource = null;

function initializeAudio() {
    if (!audioInitialized) {
        audioContext.resume().then(() => {
            audioInitialized = true;
            playLevelMusic(currentLevel);
        }).catch(err => console.error("Audio resume error:", err));
    }
}

window.addEventListener('click', initializeAudio);
window.addEventListener('keydown', initializeAudio);
window.addEventListener('touchstart', initializeAudio);

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
    if (!audioInitialized || !sounds[soundName]) return;
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
            const scaleFactor = isMobile ? 2.4 : 1.5;
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

let deltaTime = 0;
let lastTime = 0;
let frameDuration = 120; // Adjust as needed

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
    const collisionPadding = 0.3;
    
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
	
const levelCollisionSounds = {
    1: 'collision',
    2: 'ohdear',
    3: 'owman',
    4: 'blah',
    5: 'victory'
};

function handleCollision() {
    collisionState = true;
    const collisionSound = levelCollisionSounds[currentLevel] || 'collision';
    playSound(collisionSound); // Plays a level-specific collision sound
    score = Math.max(0, score - 200); // Penalty for collision, but don't go below 0
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
        score = 0; // Reset score only when starting a new game
    }
    currentLevel = level;
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
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
    const scaleFactor = isMobile ? 2.4 : 1.5;

    cars = [];
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        // Individual scaling adjustments for each monster type
        let carScaleFactor = scaleFactor * (
            i === 2 ? 0.9 : // monster3
            i === 1 ? 0.85 : // blob
            i === 3 ? 0.8 : // monster1
            0.85 
        );
		
		let isSprite = false; // Add a flag to identify the sprite car


        // Select monster based on level and position
       if (currentLevel === 4 && i === 3) { // Correct condition: Level 4 AND row 3
            selectedImage = images.monster4Sprite;
            isSprite = true;
        } else {
            if (currentLevel === 4) {
                switch (i) {
                    case 1: selectedImage = images.monster1; break;
                    case 2: selectedImage = images.monster3; break;
                    default: selectedImage = images.blob; // Use blob if not the sprite row
                }
            } else { // All other levels
                switch (i) {
                    case 1: selectedImage = images.blob; break;
                    case 2: selectedImage = images.monster3; break;
                    case 3: selectedImage = images.monster1; break;
                    default: selectedImage = images.augurk;
                }
            }
        }


        // Adjusted speeds based on platform
        const baseSpeed = i === 2 ?
            -(Math.random() * (isMobile ? 1.2 : 1.5) + 0.8) :
            Math.random() * (isMobile ? 1.1 : 1.4) + 0.6;

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
        (currentLevel === 1 ? 0.8 : // Faster but still controllable for mobile
         currentLevel === 2 ? 1.2 : 
         currentLevel === 3 ? 1.6 : 
         currentLevel === 4 ? 2.0 : 2.2) :
        // Desktop speeds - even more dynamic
        (currentLevel === 1 ? 1.0 : 
         currentLevel === 2 ? 1.4 : 
         currentLevel === 3 ? 1.8 : 
         currentLevel === 4 ? 2.2 : 2.4);
    
    return baseSpeed * speedMultiplier;
	
	const randomFactor = 0.9 + (Math.random() * 0.4); // Random value between 0.9 and 1.3
    
    // Limit maximum speed
    const maxSpeed = isMobile ? 3.5 : 4.0;
    return Math.min(baseSpeed * speedMultiplier * randomFactor, maxSpeed);
}

function checkWin() {
    return player.y <= 0; // Win when the player reaches the top of the screen
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

// Improved canvas and tile size calculation
function resizeCanvas() {
    const isMobile = window.innerWidth < 768; // Mobile breakpoint
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (isMobile ? 0.7 : 0.7);
    
    // Adaptive tile sizing
    tileSize = isMobile 
        ? Math.min(canvas.width, canvas.height) / 08  // Smaller tiles for mobile
        : Math.min(canvas.width, canvas.height) / 10;
    
    rows = Math.floor(canvas.height / tileSize);
    cols = Math.floor(canvas.width / tileSize);
    
    resetPlayer();
    createCars();
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


function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    winMessage.style.display = 'block';

    // Optionally, hide the message after a delay
    setTimeout(() => {
        winMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}
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



// Enhanced touch controls
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



// Add this to your initialization code
window.addEventListener('load', () => {
    initializeMobileSupport();
    window.addEventListener('resize', resizeCanvas);
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

window.onload = async () => {
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
		monster4Sprite: 'assets/images/monster4_spritesheet.png',
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
    gameLoop(); // Start the game loop after everything is loaded
};
