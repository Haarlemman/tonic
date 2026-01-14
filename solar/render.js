import { FRAME_WIDTH, FRAME_HEIGHT, TOTAL_FRAMES, FRAME_DURATION } from './constants.js';
import { player, cars } from './entities.js';

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    // Drawing player logic
}

function drawCars() {
    // Drawing cars logic
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
}

function drawLevel() {
    // Drawing level logic
}

export { drawBackground, drawStreetLines, drawPlayer, drawCars, drawScore, drawLevel };