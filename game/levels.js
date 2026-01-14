export let currentLevel = 1, gameWon = false;

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

export function switchToLevel(level) {
    if (level === 1) {
        score = 0;
    }
    currentLevel = level;
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
}

export function checkWin() {
    return player.y < 50;
}