import { canvas, ctx } from '/game/js/canvas.js';
import { images } from '/game/js/images.js';
import { player } from '/game/js/player.js';
import { tileSize, currentLevel } from '/game/js/levels.js';

export let cars = [];

export function createCars() {
    cars = [];
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        if (i === 2) selectedImage = images.monster3;
        else if (i === 1) selectedImage = images.blob;
        else if (i === 3) selectedImage = images.monster1;
        else selectedImage = images.augurk;

        const baseSpeed = i === 2 ? -(Math.random() * 1.5 + 0.8) : Math.random() * 1.5 + 0.8;
        
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.2,
            width: tileSize * 2,
            height: tileSize,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}

export function drawCars() {
    cars.forEach((car) => {
        if (car.image) {
            const carWidth = car.image.width;
            const carHeight = car.image.height;
            const scaleFactor = Math.min(tileSize * 2 / carWidth, tileSize * 2 / carHeight);
            const scaledWidth = carWidth * scaleFactor;
            const scaledHeight = carHeight * scaleFactor;
            ctx.drawImage(car.image, car.x, car.y, scaledWidth, scaledHeight);
        }
    });
}

export function moveCars() {
    cars.forEach(car => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.speed < 0 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });
}

export function checkCollisionWithCars() {
    return cars.some(car =>
        player.x < car.x + car.width &&
        player.x + player.width > car.x &&
        player.y < car.y + car.height &&
        player.y + player.height > car.y
    );
}

function getSpeedForLevel(baseSpeed) {
    const speedMultiplier = currentLevel === 1 ? 1 : 
                           currentLevel === 2 ? 1.2 : 
                           currentLevel === 3 ? 1.4 :
                           currentLevel === 4 ? 1.6 :
                           currentLevel === 5 ? 0.3 :  // Slower speed for victory level
                           1;
    return baseSpeed * speedMultiplier;
}