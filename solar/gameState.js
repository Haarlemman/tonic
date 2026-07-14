import { GAME_STATES } from './constants.js';
import { resizeCanvas, resetPlayer, createCars, playLevelMusic, modifiedGameLoop } from './main.js';

let currentGameState = GAME_STATES.START_SCREEN;

function createStartScreen() {
    const startScreenDiv = document.createElement('div');
    startScreenDiv.id = 'start-screen';
    startScreenDiv.innerHTML = `
        <div class="start-screen-container">
            <h1>SOLAR SPRINT</h1>
            <div class="game-instructions">
                <h2>How to Play</h2>
                <ul>
                    <li>☀️ Reach the Sun at the top of the screen to go to the next level</li>
                    <li>👾 Avoid The monsters</li>
                    <li>⬆️⬇️⬅️➡️ Use arrow keys or on-screen buttons to move</li>
                    <li>🏆 Earn points by moving up and completing levels</li>
                </ul>
            </div>
            <button id="start-game-btn">START</button>
        </div>
    `;
    document.body.appendChild(startScreenDiv);

    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', startGame);
}

function startGame(event) {
    console.log("Start game button clicked");
    currentGameState = GAME_STATES.PLAYING; // Update the game state to PLAYING
    document.getElementById('start-screen').remove(); // Remove the start screen
    score = 0;
    currentLevel = 1;
    resizeCanvas();
    resetPlayer();
    createCars();
    playLevelMusic(1);
    requestAnimationFrame(modifiedGameLoop);
}

document.addEventListener('DOMContentLoaded', (event) => {
    createStartScreen();
});

export { currentGameState, createStartScreen, startGame };
