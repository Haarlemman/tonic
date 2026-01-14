import { createStartScreen, startGame } from './gameState.js';
import { drawBackground, drawStreetLines, drawPlayer, drawCars, drawScore, drawLevel } from './render.js';
import { initializeAudio } from './audio.js';
import { resizeCanvas } from './canvasUtils.js'; // Import resizeCanvas

let gameLoop;

window.addEventListener('load', async () => {
    createStartScreen();
    await loadImages({
        dancing: 'assets/images/dancingspritesheet.png',
        face: 'assets/images/dude.png',
        faceboom: 'assets/images/faceboom.png',
        stripe: 'assets/images/stripe.png',
        blob: 'assets/images/blob.png',
        augurk: 'assets/images/augurk.png',
        monster1: 'assets/images/monster1.png',
        monster2: 'assets/images/monster2.png',
        monster3: 'assets/images/monster3.png',
        monster4Sprite: 'assets/images/monster4_spritesheet.png',
        character_l1: 'assets/images/character_l1.png',
        character_l2: 'assets/images/character_l2.png',
        character_l3: 'assets/images/character_l3.png',
        character_l4: 'assets/images/character_l4.png',
        character_l1_hit: 'assets/images/character_l1_hit.png',
        character_l2_hit: 'assets/images/character_l2_hit.png',
        character_l3_hit: 'assets/images/character_l3_hit.png',
        character_l4_hit: 'assets/images/character_l4_hit.png',
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