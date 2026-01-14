import { canvas, ctx } from './canvas.js';

const sunX = canvas.width / 2;
const sunY = 100;

class Planet {
    constructor(imageSrc, distance, speed, rotationSpeed, opacity) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.distance = distance;
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
        this.opacity = opacity;
        this.angle = Math.random() * Math.PI * 2; // Start at a random angle
        this.rotationAngle = 0;
    }

    update() {
        this.angle += this.speed;
        this.rotationAngle += this.rotationSpeed;
        this.x = sunX + this.distance * Math.cos(this.angle);
        this.y = sunY + this.distance * Math.sin(this.angle);
    }

    draw() {
        if (this.image.complete) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x + this.image.width / 2, this.y + this.image.height / 2);
            ctx.rotate(this.rotationAngle);
            ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
            ctx.restore();
        }
    }
}

const planets = [
    new Planet('images/planet1.png', 100, 0.01, 0.01, 0.8),
    new Planet('images/planet2.png', 150, 0.02, 0.02, 0.6),
    new Planet('images/planet3.png', 200, 0.015, 0.015, 0.7),
    new Planet('images/planet4.png', 250, 0.03, 0.03, 0.5),
    new Planet('images/planet5.png', 300, 0.025, 0.025, 0.9),
    new Planet('images/planet6.png', 350, 0.02, 0.02, 0.4),
    new Planet('images/planet7.png', 400, 0.035, 0.035, 0.3),
    new Planet('images/planet8.png', 450, 0.04, 0.04, 0.2),
    // Add more planets as needed
];

export function drawSun() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
    ctx.fill();
}

export function updatePlanets() {
    planets.forEach(planet => {
        planet.update();
    });
}

export function drawPlanets() {
    drawSun();
    planets.forEach(planet => {
        planet.draw();
    });
}