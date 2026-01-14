const sequence = document.getElementById('sequence');
const frameWidth = 321;
const numFrames = 45;
let currentFrame = 0;
let animationFrameId;
let animationDirection = 1;
let backgroundPositions = [];

// Pre-calculate background positions
for (let i = 0; i < numFrames; i++) {
    backgroundPositions.push(`-${i * frameWidth}px 0`);
}

function animate() {
    sequence.style.backgroundPosition = backgroundPositions[currentFrame];
    currentFrame += animationDirection;

    if (currentFrame >= numFrames) {
        currentFrame = numFrames - 2;
        animationDirection = -1;
    } else if (currentFrame < 0) {
        currentFrame = 1;
        animationDirection = 1;
    }

    animationFrameId = requestAnimationFrame(animate);
}

const spriteSheet = new Image();
spriteSheet.onload = () => {
    sequence.style.backgroundImage = `url(${spriteSheet.src})`;
    animate();
};
spriteSheet.onerror = () => {
    console.error("Error loading sprite sheet!");
};
spriteSheet.src = 'assets/images/spritesheet.png'; 