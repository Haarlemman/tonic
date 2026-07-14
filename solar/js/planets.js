import { canvas, ctx } from './canvas.js';
import { images } from './images.js';

export class Planet {
    constructor(orbitRadius, speed, planetNumber) {
        // More random orbit variation (±50 pixels)
        this.orbitRadius = orbitRadius + (Math.random() * 100 - 50);
        this.speed = speed;
        this.image = images[`planet${planetNumber}`];
        this.angle = Math.PI + (Math.random() * Math.PI); // Random start position
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02) + 0.01;
    }

    update() {
        this.angle += this.speed;
        this.rotation += this.rotationSpeed;
        
        this.x = canvas.width/2 + Math.cos(this.angle) * this.orbitRadius;
        this.y = -20 + Math.sin(this.angle) * this.orbitRadius;
    }

    draw() {
        if (this.image) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = 0.5;  // 50% transparency
            ctx.drawImage(
                this.image, 
                -this.image.width/2, 
                -this.image.height/2, 
                this.image.width, 
                this.image.height
            );
            ctx.restore();
        }
    }
}

export function createPlanets() {
    return [
        new Planet(120, 0.02, 1),    // Mercury - closer to sun
        new Planet(200, 0.018, 2),   // Venus
        new Planet(280, 0.016, 3),   // Earth
        new Planet(360, 0.014, 4),   // Mars
        new Planet(440, 0.012, 5),   // Jupiter
        new Planet(520, 0.01, 6),    // Saturn
        new Planet(600, 0.008, 7),   // Uranus
        new Planet(700, 0.006, 8)    // Neptune - much farther out
    ];
}

export let planets = [];

export function initPlanets() {
    planets = createPlanets();
}

export function updatePlanets() {
    planets.forEach(planet => planet.update());
}

export function drawPlanets() {
    // Draw orbit paths
    planets.forEach(planet => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.arc(canvas.width/2, -20, planet.orbitRadius, Math.PI, Math.PI * 2);
        ctx.stroke();
    });
    
    planets.forEach(planet => planet.draw());
}

export function drawSun() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI * 2);
    ctx.fill();
}
