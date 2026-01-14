import GAME_CONFIG from '/solar/js/game-config.js';
import AssetLoader from '/solar/js/asset-loader.js';

class SolarSprintGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Game state variables
        this.state = GAME_CONFIG.STATES.START_SCREEN;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.currentLevel = 1;
        this.player = null;
        this.cars = [];
        this.tileSize = 0;
        
        // Asset containers
        this.images = {};
        this.sounds = {};
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Collision and game flow variables
        this.collisionState = false;
        this.collisionTimer = null;
        
        // Bind methods to ensure correct 'this' context
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.startGame = this.startGame.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    async initialize() {
        // Load assets
        this.images = await AssetLoader.loadImages(GAME_CONFIG.IMAGES);
        this.sounds = await AssetLoader.loadSounds(
            GAME_CONFIG.SOUNDS.FILES, 
            this.audioContext
        );
        
        // Setup canvas and initial game state
        this.resizeCanvas();
        this.createStartScreen();
        this.setupEventListeners();
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
        
        // Add event listener for start button
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn.addEventListener('click', this.startGame);
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "ArrowUp": this.movePlayer('up'); break;
                case "ArrowDown": this.movePlayer('down'); break;
                case "ArrowLeft": this.movePlayer('left'); break;
                case "ArrowRight": this.movePlayer('right'); break;
            }
        });
        
        // Mobile/touch controls
        const upButton = document.getElementById("upButton");
        const downButton = document.getElementById("downButton");
        const leftButton = document.getElementById("leftButton");
        const rightButton = document.getElementById("rightButton");
        
        upButton.addEventListener('click', () => this.movePlayer('up'));
        downButton.addEventListener('click', () => this.movePlayer('down'));
        leftButton.addEventListener('click', () => this.movePlayer('left'));
        rightButton.addEventListener('click', () => this.movePlayer('right'));
        
        // Resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
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
        
        // Initial game setup
        this.resetPlayer();
        this.createCars();
        this.playLevelMusic(1);
        
        // Start game loop
        this.gameLoop();
    }
    
    gameLoop() {
        if (this.state !== GAME_CONFIG.STATES.PLAYING) return;
        
        // Clear and redraw canvas
        this.drawBackground();
        this.drawStreetLines();
        this.drawCars();
        this.drawPlayer();
        this.drawLevel();
        this.drawScore();
        
        // Update game entities
        this.moveCars();
        this.updateScore();
        
        // Check game progression conditions
        if (this.checkWin()) {
            this.handleLevelCompletion();
        }
        
        if (this.checkCollision() && !this.collisionState) {
            this.handleCollision();
        }
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop);
    }
    
    // Other methods like movePlayer, drawBackground, etc. would be implemented here
    // ... (these would be similar to the previous implementation)
    
    // Placeholder methods to be implemented
    resizeCanvas() {}
    resetPlayer() {}
    createCars() {}
    drawBackground() {}
    drawStreetLines() {}
    drawCars() {}
    drawPlayer() {}
    drawLevel() {}
    drawScore() {}
    moveCars() {}
    updateScore() {}
    checkWin() { return false; }
    handleLevelCompletion() {}
    handleCollision() {}
    playLevelMusic() {}
    
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
    
    movePlayer(direction) {
        if (this.collisionState) return;
        
        // Implement player movement logic
        switch (direction) {
            case 'up': 
                this.player.y -= this.tileSize;
                break;
            case 'down':
                this.player.y += this.tileSize;
                break;
            case 'left':
                this.player.x -= this.tileSize;
                break;
            case 'right':
                this.player.x += this.tileSize;
                break;
        }
        
        // Constrain player within canvas
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
    }
}

// Game Initialization
window.addEventListener('load', async () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new SolarSprintGame(canvas);
    await game.initialize();
});

export default SolarSprintGame;