

function switchToLevel(level) {
    if (level === 1) {
        score = 0; // Reset score only when starting a new game
    }
    currentLevel = level;
    playSound('hooray');
    playLevelMusic(level);
    resetPlayer();
    createCars();
}


function resetPlayer() {
    player = {
        x: canvas.width / 2 - tileSize,
        y: canvas.height - tileSize * 2,
        width: tileSize * 2,  // Set width based on tileSize
        height: tileSize     // Set height based on tileSize
    };
    lastY = player.y; // Reset lastY position

}


function createCars() {
    cars = [];
    const maxRows = 4; // Reduced from 5 to 4 rows to make it more manageable
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        if (i === 2) selectedImage = images.monster3;
        else if (i === 1) selectedImage = images.blob;
        else if (i === 3) selectedImage = images.monster1;
        else selectedImage = images.augurk;

        // Reduce base speed range
        const baseSpeed = i === 2 ? -(Math.random() * 1.5 + 0.8) : Math.random() * 1.5 + 0.8;
        
        // Add some gaps between cars by randomizing starting positions
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.2, // Add 20% more space between rows
            width: tileSize * 2,
            height: tileSize,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}

function getSpeedForLevel(baseSpeed) {
    // Reduce the speed multiplier for higher levels
    const speedMultiplier = currentLevel === 1 ? 1 : 
                           currentLevel === 2 ? 1.2 : 
                           currentLevel === 3 ? 1.4 : 1.6;
    return baseSpeed * speedMultiplier;
}


function checkWin() {
    // Add logic to check if the player has won the level
    return player.y < 50; // Example: win if player is near the top of the canvas
}
