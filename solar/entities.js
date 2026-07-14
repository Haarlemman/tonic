let player, cars = [];

function resetPlayer() {
    // Reset player position and state
}

function createCars(level) {
    // Create cars for the given level
}

function movePlayer(direction) {
    if (collisionState) return;

    if (direction === 'up') player.y -= tileSize;
    if (direction === 'down') player.y += tileSize;
    if (direction === 'left') player.x -= tileSize;
    if (direction === 'right') player.x += tileSize;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

export { player, cars, resetPlayer, createCars, movePlayer };
