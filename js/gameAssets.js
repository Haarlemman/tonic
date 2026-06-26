async function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { images[key] = img; resolve(); };
            img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
            img.src = src;
        });
    });
    try {
      await Promise.all(promises);
      console.log("Images loaded")
    } catch (error) {
      console.error("Failed to load images:", error)
    }
}



function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;  // 80% of the window height
    tileSize = Math.min(canvas.width, canvas.height) / 10;  // Set tileSize based on canvas size
    rows = Math.floor(canvas.height / tileSize);  // Calculate number of rows based on tileSize
    cols = Math.floor(canvas.width / tileSize);  // Calculate number of columns based on tileSize
    resetPlayer();  // Reset player position after resizing
    createCars();   // Recreate the cars when resizing
}



// Declare images object globally
const images = {};

function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                images[key] = img;  // Store the loaded image in the images object
                resolve();
            };
            img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
            img.src = src;
        });
    });

    // Wait for all images to load
    return Promise.all(promises)
        .then(() => console.log('Images loaded'))
        .catch((error) => console.error('Failed to load images:', error));
}



function resetPlayer() {
    // Reset player position, health, or other properties
    player.x = 0; // Example for resetting player's position
    player.y = 0;
    player.health = 100; // Example for resetting player's health
    console.log("Player has been reset.");
}
