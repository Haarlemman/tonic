
let playAgainButtonImage;

// Load images for the game (add the play-again button image)
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

    // Add the play again button image to the list of sources
    playAgainButtonImage = new Image();
    playAgainButtonImage.src = 'assets/images/but-playagain.png';

    await Promise.all(promises);
}

// Draw the player and the Play Again button
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

            // Draw the Play Again button below the player
            const buttonX = (canvas.width - playAgainButtonImage.width) / 2;
            const buttonY = centerY + scaledHeight + 20; // 20px below the player
            ctx.drawImage(playAgainButtonImage, buttonX, buttonY);

            // Add click listener for the Play Again button
            canvas.addEventListener('click', (event) => {
                if (
                    event.clientX >= buttonX &&
                    event.clientX <= buttonX + playAgainButtonImage.width &&
                    event.clientY >= buttonY &&
                    event.clientY <= buttonY + playAgainButtonImage.height
                ) {
                    resetGame(); // Reset the game when the button is clicked
                }
            });
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




document.getElementById('playAgainButton').addEventListener('click', () => {
    location.reload();  // Refresh the page
});
