export let player, collisionState = false, collisionTimer = null;

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
    score = Math.max(0, score - 200);
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
}