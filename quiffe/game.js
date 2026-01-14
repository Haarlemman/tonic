const playerImg = new Image();
const backgroundImg = new Image();
const platformImg = new Image();
const obstacleImg = new Image();
const coinImg = new Image();
const exitImg = new Image(); // New exit sign image

let useCustomImages = true;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level'); // New level display element
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');

console.log('startButton:', startButton);
console.log('canvas:', canvas);
console.log('ctx:', ctx);

let gameRunning = false;
let score = 0;
let lives = 3;
let level = 1;
let animationFrameId;

const PLATFORM_HEIGHT = 20;
const PLAYER_SIZE = 30;
const OBSTACLE_SIZE = 25;
const COIN_SIZE = 15;
const PLAYER_SPEED = 5;
const GRAVITY = 0.5;
const JUMP_FORCE = 12;
const OBSTACLE_SPEED = 1.5;
const EXIT_SIZE = 40;

// Player state for sprite
let player = {
    x: 50,
    y: 50,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    grounded: false,
    color: '#5D9CEC',
    state: 'neutral', // neutral, happy, angry
    stateTimer: 0, // Tracks duration of happy/angry state
    blinking: false,
    blinkTimer: 0,
    blinkInterval: 0.1, // Blink every 0.1 seconds
    blinkDuration: 2 // Total blink duration in seconds
};

// Exit sign
let exitSign = {
    x: 0,
    y: 0,
    width: EXIT_SIZE,
    height: EXIT_SIZE
};

// Sprite sheet configuration
const SPRITE_FRAMES = {
    neutral: { x: 0, y: 0, width: 30, height: 30 },
    happy: { x: 30, y: 0, width: 30, height: 30 },
    angry: { x: 60, y: 0, width: 30, height: 30 }
};

let platforms = [];
let obstacles = [];
let coins = [];

const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

function initGameDimensions() {
    const containerWidth = document.getElementById('game-container').clientWidth;
    canvas.width = containerWidth;
    canvas.height = window.innerHeight * 0.7;
    console.log('Canvas dimensions set:', canvas.width, canvas.height);
    if (gameRunning) {
        initGameElements();
    }
}

function loadImages(callback) {
    console.log('Attempting to load images...');
    if (!useCustomImages) {
        console.log('useCustomImages is false, skipping image loading.');
        callback();
        return;
    }

    const images = {
        player: { img: playerImg, src: 'quiffe_sprite.png', loaded: false },
        background: { img: backgroundImg, src: 'bgrond.png', loaded: false },
        platform: { img: platformImg, src: 'gamebg.png', loaded: false },
        obstacle: { img: obstacleImg, src: 'obstacle.png', loaded: false },
        coin: { img: coinImg, src: 'coin.png', loaded: false },
        exit: { img: exitImg, src: 'exit.png', loaded: false }
    };
    let imagesToLoad = Object.keys(images).length;
    let failedImages = 0;

    function onImageLoadOrError() {
        imagesToLoad--;
        console.log(`Images remaining to load: ${imagesToLoad}`);
        if (imagesToLoad === 0) {
            console.log('Image load status:', {
                player: images.player.loaded,
                background: images.background.loaded,
                platform: images.platform.loaded,
                obstacle: images.obstacle.loaded,
                coin: images.coin.loaded,
                exit: images.exit.loaded
            });
            if (failedImages > 0) {
                console.warn(`Failed to load ${failedImages} images. Using available images and default shapes.`);
            } else {
                console.log('All images loaded successfully.');
            }
            callback();
        }
    }

    for (let key in images) {
        console.log(`Loading image: ${images[key].src}`);
        images[key].img.src = images[key].src;
        images[key].img.onload = () => {
            images[key].loaded = true;
            console.log(`Loaded ${key} image: ${images[key].src}, dimensions: ${images[key].img.naturalWidth}x${images[key].img.naturalHeight}`);
            onImageLoadOrError();
        };
        images[key].img.onerror = () => {
            console.error(`Failed to load ${key} image: ${images[key].src}. Check file path or file existence.`);
            failedImages++;
            onImageLoadOrError();
        };
    }
}

function initGameElements() {
    platforms = [];
    obstacles = [];
    coins = [];
    player.x = 50;
    player.y = 50;
    player.velocityX = 0;
    player.velocityY = 0;
    player.jumping = false;
    player.grounded = false;
    player.state = 'neutral';
    player.stateTimer = 0;
    player.blinking = false;
    player.blinkTimer = 0;

    const numPlatforms = 7;
    const platformSpacing = canvas.height / numPlatforms;
    
    // Update level display
    if (levelElement) {
        levelElement.textContent = `Level: ${level}`;
    }
    
    for (let i = 0; i < numPlatforms; i++) {
        const y = i * platformSpacing + platformSpacing / 2;
        const width = canvas.width * 0.7;
        const x = i % 2 === 0 ? 0 : canvas.width - width;
        if (i > 0) {
            const gapPosition = width * 0.4;
            const gapWidth = PLAYER_SIZE * 1.5;
            platforms.push({
                x: x,
                y: y,
                width: gapPosition,
                height: PLATFORM_HEIGHT,
                color: '#8CC152'
            });
            platforms.push({
                x: x + gapPosition + gapWidth,
                y: y,
                width: width - gapPosition - gapWidth,
                height: PLATFORM_HEIGHT,
                color: '#8CC152'
            });
        } else {
            platforms.push({
                x: x,
                y: y,
                width: width,
                height: PLATFORM_HEIGHT,
                color: '#8CC152'
            });
        }
    }

    // Add an exit sign at bottom right
    const lastPlatformIndex = platforms.length - 1;
    const lastPlatform = platforms[lastPlatformIndex];
    exitSign = {
        x: lastPlatform.x + lastPlatform.width - EXIT_SIZE,
        y: lastPlatform.y - EXIT_SIZE,
        width: EXIT_SIZE,
        height: EXIT_SIZE
    };

    // Add obstacles to platforms (more obstacles as level increases)
    let platformIndex = 0;
    platforms.forEach((platform, index) => {
        if (index === 0) return;
        if (platform.width > PLAYER_SIZE * 2) {
            // Calculate number of obstacles based on level
            const numObstacles = Math.min(1 + Math.floor(level/2), 3);
            
            for (let i = 0; i < numObstacles; i++) {
                const obstacleX = platform.x + (platform.width / (numObstacles + 2)) * (i + 1.5);
                const obstacleY = platform.y - OBSTACLE_SIZE;
                const maxVelocity = Math.min(platform.width / 100, OBSTACLE_SPEED);
                
                // Add a new type of obstacle at higher levels
                if (level > 2 && Math.random() > 0.7) {
                    // Bouncing obstacle that moves up and down
                    obstacles.push({
                        x: obstacleX,
                        y: obstacleY,
                        width: OBSTACLE_SIZE,
                        height: OBSTACLE_SIZE,
                        color: '#9B59B6', // Purple color for different obstacle
                        velocityX: (Math.random() - 0.5) * maxVelocity * level,
                        velocityY: -Math.random() * 2 - 1, // Initial upward velocity
                        platformIndex: platformIndex,
                        type: 'bouncing'
                    });
                } else {
                    // Standard obstacle
                    obstacles.push({
                        x: obstacleX,
                        y: obstacleY,
                        width: OBSTACLE_SIZE,
                        height: OBSTACLE_SIZE,
                        color: '#ED5565',
                        velocityX: (Math.random() - 0.5) * maxVelocity * level,
                        platformIndex: platformIndex,
                        type: 'standard'
                    });
                }
            }
        }
        platformIndex++;
    });

    // Add coins
    platforms.forEach((platform) => {
        const numCoins = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numCoins; i++) {
            const coinX = platform.x + Math.random() * (platform.width - COIN_SIZE);
            const coinY = platform.y - COIN_SIZE - 5;
            coins.push({
                x: coinX,
                y: coinY,
                width: COIN_SIZE,
                height: COIN_SIZE,
                color: '#F6BB42',
                collected: false
            });
        }
    });
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    if (!startButton) {
        console.error('startButton not found!');
        return;
    }
    startButton.addEventListener('click', () => {
        console.log('Start button clicked!');
        startGame();
    });
    restartButton.addEventListener('click', () => {
        console.log('Restart button clicked!');
        startGame();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
        if (e.key === 'ArrowUp') keys.up = true;
        if (e.key === 'ArrowDown') keys.down = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
        if (e.key === 'ArrowUp') keys.up = false;
        if (e.key === 'ArrowDown') keys.down = false;
    });

    document.getElementById('btn-left').addEventListener('touchstart', () => keys.left = true);
    document.getElementById('btn-left').addEventListener('touchend', () => keys.left = false);
    document.getElementById('btn-right').addEventListener('touchstart', () => keys.right = true);
    document.getElementById('btn-right').addEventListener('touchend', () => keys.right = false);
    document.getElementById('btn-up').addEventListener('touchstart', () => keys.up = true);
    document.getElementById('btn-up').addEventListener('touchend', () => keys.up = false);
    document.getElementById('btn-down').addEventListener('touchstart', () => keys.down = true);
    document.getElementById('btn-down').addEventListener('touchend', () => keys.down = false);

    document.getElementById('btn-left').addEventListener('mousedown', () => keys.left = true);
    document.getElementById('btn-left').addEventListener('mouseup', () => keys.left = false);
    document.getElementById('btn-right').addEventListener('mousedown', () => keys.right = true);
    document.getElementById('btn-right').addEventListener('mouseup', () => keys.right = false);
    document.getElementById('btn-up').addEventListener('mousedown', () => keys.up = true);
    document.getElementById('btn-up').addEventListener('mouseup', () => keys.up = false);
    document.getElementById('btn-down').addEventListener('mousedown', () => keys.down = true);
    document.getElementById('btn-down').addEventListener('mouseup', () => keys.down = false);
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function updatePlayer(deltaTime) {
    player.velocityY += GRAVITY;
    if (keys.left) player.velocityX = -PLAYER_SPEED;
    else if (keys.right) player.velocityX = PLAYER_SPEED;
    else player.velocityX = 0;
    if (keys.up && player.grounded) {
        player.velocityY = -JUMP_FORCE;
        player.jumping = true;
        player.grounded = false;
    }
    let dropThrough = false;
    if (keys.down && player.grounded) {
        dropThrough = true;
    }
    player.x += player.velocityX;
    player.y += player.velocityY;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height) {
        loseLife();
        return;
    }
    player.grounded = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (!dropThrough && player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
                player.jumping = false;
            }
        }
    });
    obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            player.state = 'angry';
            player.stateTimer = 1; // 1 second
            loseLife();
            return;
        }
    });
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            player.state = 'happy';
            player.stateTimer = 1; // 1 second
        }
    });
    
    // Check collision with exit sign
    if (checkCollision(player, exitSign)) {
        levelComplete();
        return;
    }
    
    // Update player state timer
    if (player.stateTimer > 0) {
        player.stateTimer -= deltaTime;
        if (player.stateTimer <= 0) {
            player.state = 'neutral';
            player.stateTimer = 0;
        }
    }
    
    // Update blinking
    if (player.blinking) {
        player.blinkTimer -= deltaTime;
        if (player.blinkTimer <= 0) {
            player.blinking = false;
        }
    }
}

function updateObstacles(deltaTime) {
    obstacles.forEach(obstacle => {
        // Horizontal movement
        obstacle.x += obstacle.velocityX;
        const platform = platforms[obstacle.platformIndex];
        
        if (obstacle.x <= platform.x || obstacle.x + obstacle.width >= platform.x + platform.width) {
            obstacle.velocityX *= -1;
        }
        
        // Vertical movement for bouncing obstacles
        if (obstacle.type === 'bouncing') {
            obstacle.y += obstacle.velocityY;
            
            // Bounce between platform and a height above
            const maxHeight = platform.y - OBSTACLE_SIZE - 30;
            if (obstacle.y <= maxHeight) {
                obstacle.velocityY *= -1;
            }
            
            // Don't go below platform
            if (obstacle.y >= platform.y - OBSTACLE_SIZE) {
                obstacle.y = platform.y - OBSTACLE_SIZE;
                obstacle.velocityY *= -1;
            }
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (useCustomImages && backgroundImg.complete && backgroundImg.naturalWidth > 0) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Platforms
    platforms.forEach(platform => {
        if (useCustomImages && platformImg.complete && platformImg.naturalWidth > 0) {
            ctx.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);
        } else {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#7F8C8D';
            for (let i = 0; i < platform.width; i += 20) {
                ctx.fillRect(platform.x + i, platform.y, 3, platform.height);
            }
        }
    });

    // Exit sign
    if (useCustomImages && exitImg.complete && exitImg.naturalWidth > 0) {
        ctx.drawImage(exitImg, exitSign.x, exitSign.y, exitSign.width, exitSign.height);
    } else {
        // Default exit sign
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(exitSign.x, exitSign.y, exitSign.width, exitSign.height);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('EXIT', exitSign.x + 5, exitSign.y + exitSign.height/2 + 5);
        
        // Add arrow
        ctx.beginPath();
        ctx.moveTo(exitSign.x + 10, exitSign.y + exitSign.height - 10);
        ctx.lineTo(exitSign.x + exitSign.width - 10, exitSign.y + exitSign.height - 10);
        ctx.lineTo(exitSign.x + exitSign.width - 15, exitSign.y + exitSign.height - 15);
        ctx.moveTo(exitSign.x + exitSign.width - 10, exitSign.y + exitSign.height - 10);
        ctx.lineTo(exitSign.x + exitSign.width - 15, exitSign.y + exitSign.height - 5);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Coins
    coins.forEach(coin => {
        if (!coin.collected) {
            if (useCustomImages && coinImg.complete && coinImg.naturalWidth > 0) {
                ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
            } else {
                ctx.fillStyle = coin.color;
                ctx.beginPath();
                ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#F39C12';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    });

    // Obstacles
    obstacles.forEach(obstacle => {
        if (useCustomImages && obstacleImg.complete && obstacleImg.naturalWidth > 0) {
            ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            // Different visual styles for different obstacle types
            if (obstacle.type === 'bouncing') {
                // Bouncing obstacle style (purple)
                ctx.fillStyle = obstacle.color;
                ctx.beginPath();
                ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add spikes
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const innerRadius = obstacle.width / 2;
                    const outerRadius = innerRadius * 1.3;
                    ctx.lineTo(
                        obstacle.x + obstacle.width/2 + Math.cos(angle) * outerRadius,
                        obstacle.y + obstacle.height/2 + Math.sin(angle) * outerRadius
                    );
                    ctx.lineTo(
                        obstacle.x + obstacle.width/2 + Math.cos(angle + Math.PI/8) * innerRadius,
                        obstacle.y + obstacle.height/2 + Math.sin(angle + Math.PI/8) * innerRadius
                    );
                }
                ctx.closePath();
                ctx.fillStyle = '#8E44AD';
                ctx.fill();
            } else {
                // Standard obstacle style (red triangle)
                ctx.fillStyle = obstacle.color;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.fillStyle = '#E74C3C';
                ctx.beginPath();
                ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
            }
        }
    });

    // Player (sprite sheet or default)
    // Skip drawing if blinking and on an off frame
    const shouldDraw = !player.blinking || Math.floor(Date.now() / 100) % 2 === 0;
    
    if (shouldDraw) {
        if (useCustomImages && playerImg.complete && playerImg.naturalWidth > 0) {
            const frame = SPRITE_FRAMES[player.state];
            ctx.drawImage(
                playerImg,
                frame.x, frame.y, frame.width, frame.height, // Source rectangle
                player.x, player.y, player.width, player.height // Destination rectangle
            );
        } else {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#4A89DC';
            ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height - 10);
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(player.x + 8, player.y + 8, 5, 5);
            ctx.fillRect(player.x + player.width - 13, player.y + 8, 5, 5);
            ctx.fillRect(player.x + 10, player.y + 18, player.width - 20, 3);
        }
    }

    // Display level number at top
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Level: ${level}`, canvas.width/2 - 40, 30);
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    // Calculate deltaTime (in seconds) for consistent timing
    const deltaTime = (timestamp - (gameLoop.lastTimestamp || timestamp)) / 1000;
    gameLoop.lastTimestamp = timestamp;

    updatePlayer(deltaTime);
    updateObstacles(deltaTime);
    drawGame();
    animationFrameId = requestAnimationFrame(gameLoop);
}
gameLoop.lastTimestamp = 0;

function startGame() {
    console.log('startGame called.');
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    score = 0;
    lives = 3;
    level = 1;
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    if (levelElement) {
        levelElement.textContent = `Level: ${level}`;
    }
    loadImages(() => {
        console.log('Images loaded, starting game loop.');
        gameRunning = true;
        initGameElements();
        gameLoop(performance.now());
    });
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    finalScoreElement.textContent = `Your score: ${score}`;
    gameOverScreen.style.display = 'flex';
}

function loseLife() {
    lives--;
    livesElement.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
        gameOver();
    } else {
        player.x = 50;
        player.y = 50;
        player.velocityX = 0;
        player.velocityY = 0;
        player.state = 'neutral';
        player.stateTimer = 0;
        
        // Make player blink for a moment
        player.blinking = true;
        player.blinkTimer = player.blinkDuration;
    }
}

function levelComplete() {
    level++;
    score += 50;
    scoreElement.textContent = `Score: ${score}`;
    if (levelElement) {
        levelElement.textContent = `Level: ${level}`;
    }
    
    // Respawn player at top left
    player.x = 50;
    player.y = 50;
    player.velocityX = 0;
    player.velocityY = 0;
    player.state = 'happy';
    player.stateTimer = 0.5;
    
    // Activate blinking effect
    player.blinking = true;
    player.blinkTimer = player.blinkDuration;
    
    // Initialize new level
    initGameElements();
}

window.addEventListener('resize', initGameDimensions);

// Create level display element if it doesn't exist
if (!document.getElementById('level')) {
    const levelDiv = document.createElement('div');
    levelDiv.id = 'level';
    levelDiv.textContent = 'Level: 1';
    levelDiv.style.color = 'white';
    levelDiv.style.fontFamily = 'Arial, sans-serif';
    levelDiv.style.fontSize = '18px';
    levelDiv.style.position = 'absolute';
    levelDiv.style.top = '10px';
    levelDiv.style.left = '50%';
    levelDiv.style.transform = 'translateX(-50%)';
    document.getElementById('game-container').appendChild(levelDiv);
}

initGameDimensions();
setupEventListeners();