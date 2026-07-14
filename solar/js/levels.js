import { canvas, ctx } from '/game/js/canvas.js';
import { playSound, playLevelMusic } from '/game/js/audio.js';
import { resetPlayer, player, collisionState } from '/game/js/player.js';
import { createCars } from '/game/js/cars.js';

export let currentLevel = 1;
export let gameWon = false;
export let score = 0;
export let highScore = parseInt(localStorage.getItem('solarSprintHighScore')) || 0;
export const tileSize = Math.min(window.innerWidth, window.innerHeight) / 10;

let flashState = true;
let flashCounter = 0;

export function drawLevel() {
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

export function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
}

export function switchToLevel(level) {
    console.log('Switching to level:', level); // Debug log
    currentLevel = level;
    score += (level - 1) * 1000; // Add bonus points for completing previous level
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
}

export function checkWin() {
    const winCondition = player.y <= tileSize;
    if (winCondition) {
        console.log('Win condition met!'); // Debug log
        return true;
    }
    return false;
}

export function updateScore(playerY, lastY) {
    if (!collisionState) {
        if (playerY < lastY) {
            score += Math.floor((lastY - playerY) / tileSize) * 50;
        }
    }
}

export function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('solarSprintHighScore', highScore);
        return true;
    }
    return false;
}
