import { createStartScreen, startGame } from './gameState.js';
import { drawBackground, drawStreetLines, drawPlayer, drawCars, drawScore, drawLevel } from './render.js';
import { initializeAudio } from './audio.js';
import { resizeCanvas } from './canvasUtils.js'; // Import resizeCanvas

let gameLoop;

window.addEventListener('load', async () => {
    createStartScreen();
    await loadImages({
        dancing: 'images/dancingspritesheet.png',
        face: 'images/dude.png',
        faceboom: 'images/faceboom.png',
        stripe: 'images/stripe.png',
        blob: 'images/blob.png',
        augurk: 'images/augurk.png',
        monster1: 'images/monster1.png',
        monster2: 'images/monster2.png',
        monster3: 'images/monster3.png',
        monster4Sprite: 'images/monster4_spritesheet.png',
        character_l1: 'images/character_l1.png',
        character_l2: 'images/character_l2.png',
        character_l3: 'images/character_l3.png',
        character_l4: 'images/character_l4.png',
        character_l1_hit: 'images/character_l1_hit.png',
        character_l2_hit: 'images/character_l2_hit.png',
        character_l3_hit: 'images/character_l3_hit.png',
        character_l4_hit: 'images/character_l4_hit.png',
    });
    await loadSounds();
    resizeCanvas();
    gameLoop = modifiedGameLoop;
    gameLoop();
});

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

export { resizeCanvas, resetPlayer, createCars, playLevelMusic, modifiedGameLoop };