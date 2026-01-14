// Functions related to the player (like movement, drawing the player, etc.)
export function resetPlayer() {
    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * 2,
        height: tileSize
    };
    lastY = player.y;
}

export function drawPlayer() {
    // Code to draw player based on level
}
