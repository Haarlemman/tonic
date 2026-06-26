upButton.addEventListener('click', () => movePlayer('up'));
downButton.addEventListener('click', () => movePlayer('down'));
leftButton.addEventListener('click', () => movePlayer('left'));
rightButton.addEventListener('click', () => movePlayer('right'));

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowUp": movePlayer('up'); break;
        case "ArrowDown": movePlayer('down'); break;
        case "ArrowLeft": movePlayer('left'); break;
        case "ArrowRight": movePlayer('right'); break;
    }
});
