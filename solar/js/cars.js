export function createCars() {
    cars = [];
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        // Image selection logic
        cars.push({
            x: Math.random() * canvas.width,
            y: i * tileSize * 1.2,
            width: tileSize * 2,
            height: tileSize,
            speed: Math.random() * 1.5 + 0.8,
            image: selectedImage
        });
    }
}

export function drawCars() {
    // Logic to draw cars
}
