import { canvas, ctx } from './canvas.js';
import { loadImages, images } from './images.js';
import { loadSounds, playLevelMusic } from './audio.js';
import { createCars, drawCars, moveCars, checkCollision } from './cars.js';
import { drawPlayer, resetPlayer, handleCollision } from './player.js';
import { drawLevel, switchToLevel, checkWin } from './levels.js';
import { updatePlanets, drawPlanets } from './planets.js';

let tileSize, rows, cols, spriteFrame = 0, lastFrameTime = 0, score = 0, highScore = parseInt(localStorage.getItem('solarSprintHighScore')) || 0, lastY = 0, flashState = true, flashCounter = 0;
const FRAME_WIDTH = 160, FRAME_HEIGHT = 160, TOTAL_FRAMES = 57, FRAME_DURATION = 50;

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

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('solarSprintHighScore', highScore);
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('New High Score! 🏆', canvas.width / 2, 100);
    }
}

function resetHighScore() {
    highScore = 0;
    localStorage.setItem('solarSprintHighScore', 0);
}

function updateScore() {
    if (!collisionState) {
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

function gameLoop() {
    drawBackground();
    updatePlanets();
    drawPlanets();
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

window.addEventListener('resize', resizeCanvas);

window.addEventListener('load', async () => {
    resizeCanvas();
    await loadImages({
        dancing: 'assets/images/dancingspritesheet.png',
        face: 'assets/images/face.png',
        faceboom: 'assets/images/faceboom.png',
        stripe: 'assets/images/stripe.png',
        monster3: 'assets/images/monster3.png',
        blob: 'assets/images/blob.png',
        monster1: 'assets/images/monster1.png',
        augurk: 'assets/images/augurk.png',
        monster2: 'assets/images/monster2.png',
        planet1: 'assets/images/planet1.png',
        planet2: 'assets/images/planet2.png',
        planet3: 'assets/images/planet3.png',
        planet4: 'assets/images/planet4.png',
        planet5: 'assets/images/planet5.png',
        planet6: 'assets/images/planet6.png',
        planet7: 'assets/images/planet7.png',
        planet8: 'assets/images/planet8.png'
    });
    await loadSounds();
    createCars(); // Ensure cars are created when the game starts
    gameLoop();
});