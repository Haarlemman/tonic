class GameState {
    static States = {
        LOADING: 'loading',
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver',
        VICTORY: 'victory'
    };

    constructor() {
        this.currentState = GameState.States.LOADING;
        this.currentLevel = 1;
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.highScore = this.loadHighScore();
    }

    setState(state) {
        this.currentState = state;
        gameEvents.emit('stateChanged', state);
    }

    updateScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        gameEvents.emit('scoreUpdated', this.score);
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.setState(GameState.States.GAME_OVER);
        }
        gameEvents.emit('livesUpdated', this.lives);
    }

    nextLevel() {
        if (this.currentLevel < CONFIG.GAME.MAX_LEVEL) {
            this.currentLevel++;
            gameEvents.emit('levelChanged', this.currentLevel);
            return true;
        }
        this.setState(GameState.States.VICTORY);
        return false;
    }

    reset() {
        this.currentLevel = 1;
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.setState(GameState.States.MENU);
    }

    loadHighScore() {
        const saved = localStorage.getItem('highScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        localStorage.setItem('highScore', this.highScore.toString());
    }
} 