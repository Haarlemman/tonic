import { movePlayer } from './player.js';

export function initializeControls() {
    const upButton = document.getElementById("upButton");
    const downButton = document.getElementById("downButton");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");

    // Touch controls
    upButton.addEventListener('click', () => movePlayer('up'));
    downButton.addEventListener('click', () => movePlayer('down'));
    leftButton.addEventListener('click', () => movePlayer('left'));
    rightButton.addEventListener('click', () => movePlayer('right'));

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "ArrowUp": movePlayer('up'); break;
            case "ArrowDown": movePlayer('down'); break;
            case "ArrowLeft": movePlayer('left'); break;
            case "ArrowRight": movePlayer('right'); break;
        }
    });
}
