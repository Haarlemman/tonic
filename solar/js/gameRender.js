function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
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
        let playerImage;
        switch (currentLevel) {
            case 1:
                playerImage = collisionState ? images.faceboom : images.character_l1;
                break;
            case 2:
                playerImage = collisionState ? images.faceboom : images.character_l2;
                break;
            case 3:
                playerImage = collisionState ? images.faceboom : images.character_l3;
                break;
            case 4:
                playerImage = collisionState ? images.faceboom : images.character_l4;
                break;
            default:
                playerImage = collisionState ? images.faceboom : images.face;
        }
        
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

	
function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'left';

    if (currentLevel === 5) {
        // Increment counter and toggle flashState every 30 frames
        if (flashCounter % 30 === 0) {
            flashState = !flashState;
        }
        flashCounter++;

        if (flashState) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('LIT', 20, 30);
        }
    } else {
        ctx.fillText(`Level ${currentLevel}`, 20, 30);
    }
}


function drawCars() {
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



function gameLoop() {
    drawBackground();
    drawStreetLines();
    drawCars();
    drawPlayer();
    drawLevel();
    drawScore();
    moveCars();
    updateScore();
    updateHighScore();
    if (checkCollision() && !collisionState) {
        handleCollision();
    }
    requestAnimationFrame(gameLoop);
}
