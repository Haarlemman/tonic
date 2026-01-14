class Car {
    constructor(assetLoader, level) {
        this.assetLoader = assetLoader;
        this.level = level;
        this.width = CONFIG.GAME.TILE_SIZE;
        this.height = CONFIG.GAME.TILE_SIZE;
        this.speed = this.calculateSpeed();
        this.direction = Math.random() < 0.5 ? 'left' : 'right';
        this.init();
    }

    init() {
        // Select random monster image
        const monsterTypes = ['monster1', 'monster2', 'monster3', 'blob', 'augurk'];
        const imageKey = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
        this.image = this.assetLoader.getImage(imageKey);

        // Set initial position
        this.y = this.getRandomLane();
        if (this.direction === 'left') {
            this.x = window.innerWidth;
        } else {
            this.x = -this.width;
        }
    }

    getRandomLane() {
        const lanes = Math.floor(window.innerHeight / CONFIG.GAME.TILE_SIZE);
        return Math.floor(Math.random() * lanes) * CONFIG.GAME.TILE_SIZE;
    }

    calculateSpeed() {
        const baseSpeed = CONFIG.OBSTACLES.BASE_SPEED;
        const multiplier = CONFIG.OBSTACLES.SPEED_MULTIPLIER[`LEVEL${this.level}`] || 1;
        return baseSpeed * multiplier;
    }

    update() {
        if (this.direction === 'left') {
            this.x -= this.speed * CONFIG.GAME.TILE_SIZE;
            if (this.x + this.width < 0) {
                this.init();
            }
        } else {
            this.x += this.speed * CONFIG.GAME.TILE_SIZE;
            if (this.x > window.innerWidth) {
                this.init();
            }
        }
    }

    checkCollision(player) {
        if (player.isDamaged) return false;

        return (this.x < player.x + player.width &&
                this.x + this.width > player.x &&
                this.y < player.y + player.height &&
                this.y + this.height > player.y);
    }

    reset() {
        this.init();
    }
} 