import { canvas, ctx } from '/game/js/canvas.js';
import { playSound } from '/game/js/audio.js';
import { checkCollisionWithCars } from '/game/js/cars.js';
import { tileSize, currentLevel } from '/game/js/levels.js';
import { images } from '/game/js/images.js';

// Add animation constants
const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const TOTAL_FRAMES = 57;
const FRAME_DURATION = 50;
let spriteFrame = 0;
let lastFrameTime = 0;

export let player = {
    x: 0,
    y: 0,
    width: tileSize * 2,
    height: tileSize,
    speed: 5,
    image: images.face,
    boomImage: images.faceboom,
    isDead: false
};

export let collisionState = false;
let collisionTimer = null;
let lastY = 0;

export function drawPlayer() {
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
    if (collisionTimer) clearTimeout(collisionTimer);
    collisionTimer = setTimeout(() => {
        collisionState = false;
        resetPlayer();
    }, 1000);
}

export function resetPlayer() {
    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * 2,
        height: tileSize
    };
    lastY = player.y;
    collisionState = false;
}

export function getLastY() {
    return lastY;
}

export function updateLastY() {
    lastY = player.y;
}

export function initPlayer() {
    player = {
        x: canvas.width / 2,
        y: canvas.height - 50,  // 50px from bottom of canvas
        width: 50,
        height: 50,
        speed: 5,
        image: images.face,
        boomImage: images.faceboom,
        isDead: false
    };
}