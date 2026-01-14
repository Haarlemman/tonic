// Game Configuration
const GAME_CONFIG = {
    STATES: {
        START_SCREEN: 'start',
        PLAYING: 'playing',
        GAME_OVER: 'gameover'
    },
    LEVELS: {
        MAX: 5,
        BONUSES: [100, 250, 500, 750, 1000]
    }
};

// Game State Management
class SolarSprintGame {
    constructor(canvas, imagesources, soundFiles) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imageLoader = new ImageLoader(imageources);
        this.soundLoader = new SoundLoader(soundFiles, new AudioContext());
        
        this.state = GAME_CONFIG.STATES.START_SCREEN;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.currentLevel = 1;
        this.player = null;
        this.cars = [];
        this.tileSize = 0;
        this.rows = 0;
        this.cols = 0;
        
        this.collisionState = false;
        this.collisionTimer = null;
        
        this.setupEventListeners();
    }
    
    async initialize() {
        await this.imageLoader.loadAll();
        await this.soundLoader.loadAll();
        this.resizeCanvas();
        this.createStartScreen();
    }
    
    createStartScreen() {
        const startScreenDiv = document.createElement('div');
        startScreenDiv.id = 'start-screen';
        startScreenDiv.innerHTML = `
            <div class="start-screen-container">
                <h1>SOLAR SPRINT</h1>
                <div class="game-instructions">
                    <h2>How to Play</h2>
                    <ul>
                        <li>☀️ Reach the Sun at the top of the screen to go to the next level</li>
                        <li>👾 Avoid The monsters</li>
                        <li>⬆️⬇️⬅️➡️ Use arrow keys or on-screen buttons to move</li>
                        <li>🏆 Earn points by moving up and completing levels</li>
                    </ul>
                </div>
                <button id="start-game-btn">START</button>
            </div>
        `;
        document.body.appendChild(startScreenDiv);
        
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn.addEventListener('click', () => this.startGame());
    }
    
    startGame() {
        // Remove start screen
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.remove();
        }
        
        // Reset game state
        this.state = GAME_CONFIG.STATES.PLAYING;
        this.score = 0;
        this.currentLevel = 1;
        this.resetPlayer();
        this.createCars();
        this.playLevelMusic(1);
        
        // Start game loop
        this.gameLoop();
    }
    
    gameLoop() {
        if (this.state !== GAME_CONFIG.STATES.PLAYING) return;
        
        this.drawBackground();
        this.drawStreetLines();
        this.drawCars();
        this.drawPlayer();
        this.drawLevel();
        this.drawScore();
        this.moveCars();
        this.updateScore();
        
        if (this.checkWin()) {
            this.handleLevelCompletion();
        }
        
        if (this.checkCollision() && !this.collisionState) {
            this.handleCollision();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    handleLevelCompletion() {
        if (this.currentLevel < GAME_CONFIG.LEVELS.MAX) {
            const levelBonus = GAME_CONFIG.LEVELS.BONUSES[this.currentLevel - 1];
            this.score += levelBonus;
            this.currentLevel++;
            this.playSound('hooray');
            this.playLevelMusic(this.currentLevel);
            this.resetPlayer();
            this.createCars();
        } else {
            this.handleGameVictory();
        }
    }
    
    handleGameVictory() {
        this.score += 5000;
        this.playLevelMusic(GAME_CONFIG.LEVELS.MAX);
        this.updateHighScore();
        // Trigger victory screen or animation
    }
    
    updateScore() {
        // Vertical movement points
        if (this.player.y < this.player.lastY) {
            const verticalProgress = Math.floor((this.player.lastY - this.player.y) / 10);
            this.score += verticalProgress * this.currentLevel;
            this.player.lastY = this.player.y;
        }
    }
    
    handleCollision() {
        this.collisionState = true;
        const collisionSound = this.getLevelCollisionSound();
        this.playSound(collisionSound);
        
        // Moderate point penalty
        this.score = Math.max(0, this.score - 100);
        
        if (this.collisionTimer) clearTimeout(this.collisionTimer);
        this.collisionTimer = setTimeout(() => {
            this.collisionState = false;
            this.resetPlayer();
        }, 1000);
    }
    
    // Other methods like resetPlayer, createCars, drawBackground, etc. would be implemented here
	
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
    const maxRows = 4;
    for (let i = 1; i <= maxRows; i++) {
        let selectedImage;
        let scaleFactor = 1.5; // Reduce scale factor for monsters

        if (i === 2) {
            selectedImage = images.monster3;
            scaleFactor = 1.2; // Even smaller for level 2
        }
        else if (i === 1) selectedImage = images.blob;
        else if (i === 3) {
            selectedImage = images.monster1;
            scaleFactor = 1.3; // Slightly smaller for level 3
        }
        else selectedImage = images.augurk;

        const baseSpeed = i === 2 ? -(Math.random() * 1.5 + 0.8) : Math.random() * 1.5 + 0.8;
        
        cars.push({
            x: i === 2 ? canvas.width : Math.random() * canvas.width,
            y: i * tileSize * 1.2,
            width: tileSize * scaleFactor,
            height: tileSize * scaleFactor,
            speed: getSpeedForLevel(baseSpeed),
            image: selectedImage
        });
    }
}


	
	function drawBackground() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

	
	
	
	
	
    
    // Utility methods
    loadHighScore() {
        return parseInt(localStorage.getItem('solarSprintHighScore')) || 0;
    }
    
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('solarSprintHighScore', this.highScore);
        }
    }
    
    // Additional helper methods would be added here
}

// Image Loading Utility
class ImageLoader {
    constructor(sources) {
        this.sources = sources;
        this.images = {};
    }
    
    async loadAll() {
        const promises = Object.entries(this.sources).map(([key, src]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
                img.src = src;
            });
        });
        
        try {
            await Promise.all(promises);
            console.log("Images loaded");
        } catch (error) {
            console.error("Failed to load images:", error);
        }
    }
}

// Sound Loading Utility
class SoundLoader {
    constructor(soundFiles, audioContext) {
        this.soundFiles = soundFiles;
        this.audioContext = audioContext;
        this.sounds = {};
    }
    
    async loadAll() {
        try {
            const soundPromises = Object.entries(this.soundFiles).map(async ([name, url]) => {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                this.sounds[name] = await this.audioContext.decodeAudioData(arrayBuffer);
            });
            
            await Promise.all(soundPromises);
            console.log("Sounds loaded");
        } catch (error) {
            console.error("Failed to load sounds:", error);
        }
    }
}

// Game Initialization
window.addEventListener('load', async () => {
    const canvas = document.getElementById('gameCanvas');
    
    const imageSources = {
        dancing: 'images/dancingspritesheet.png',
        face: 'images/dude.png',
		dancing: 'images/dancingspritesheet.png',
        faceboom: 'images/faceboom.png',
        stripe: 'images/stripe.png',
        blob: 'images/blob.png',
        augurk: 'images/augurk.png',
        monster1: 'images/monster1.png',
        monster2: 'images/monster2.png',
        monster3: 'images/monster3.png',
        character_l1: 'images/character_l1.png',
        character_l2: 'images/character_l2.png',
        character_l3: 'images/character_l3.png',
        character_l4: 'images/character_l4.png',
		character_l1_hit: 'images/character_l1_hit.png',
		character_l2_hit: 'images/character_l2_hit.png',
		character_l3_hit: 'images/character_l3_hit.png',
		character_l4_hit: 'images/character_l4_hit.png',    };
    
    const soundFiles = {
    collision: 'sound/glitshowman.mp3',
    hooray: 'sound/hoorayscratch.mp3',
    level1: 'sound/level1.mp3',
    level2: 'sound/cool.wav',
    level3: 'sound/drum2.wav',
    level4: 'sound/drum3.wav',
    victory: 'sound/drum19.wav',
	ohdear: 'sound/ohdear.mp3',
	owman: 'sound/owman.mp3',
	blah: 'sound/blah.mp3',    };
    
    const game = new SolarSprintGame(canvas, imageSources, soundFiles);
    await game.initialize();
});