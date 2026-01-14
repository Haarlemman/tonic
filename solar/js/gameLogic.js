export function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawStreetLines() {
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

export function drawPlayer() {
    // Player drawing logic
}

export function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'left';

    if (currentLevel === 5) {
        // Flash logic for level 5
    } else {
        ctx.fillText(`Level ${currentLevel}`, 20, 30);
    }
}

export function drawCars() {
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

export function moveCars() {
    cars.forEach(car => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.speed < 0 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });
}

export function checkCollision() {
    return cars.some(car =>
        player.x < car.x + car.width &&
        player.x + player.width > car.x &&
        player.y < car.y + car.height &&
        player.y + player.height > car.y
    );
}

export function movePlayer(direction) {
    if (collisionState) return;

    if (direction === 'up') player.y -= tileSize;
    if (direction === 'down') player.y += tileSize;
    if (direction === 'left') player.x -= tileSize;
    if (direction === 'right') player.x += tileSize;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

export function handleCollision() {
    collisionState = true;
    playSound('collision');
    score = Math.max(0, score - 200); // Penalty for collision, but don't go below 0
    if (collisionTimer) clearTimeout(collisionTimer);
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

export function switchToLevel(level) {
    if (level === 1) {
        score = 0; // Reset score only when starting a new game
    }
    currentLevel = level;
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
}

export function checkWin() {
    return player.y < 50; // Win condition
}

export function gameLoop() {
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
