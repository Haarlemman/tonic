class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
        this.setupResizeHandler();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(gameObjects, gameState) {
        this.clear();

        // Render game objects
        gameObjects.forEach(obj => {
            if (obj.image) {
                this.ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
            }
        });

        // Render UI
        this.renderUI(gameState);
    }

    renderUI(gameState) {
        // Score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${gameState.score}`, 20, 30);

        // Level
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Level ${gameState.currentLevel}`, this.canvas.width / 2, 30);

        // Lives
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Lives: ${gameState.lives}`, this.canvas.width - 20, 30);

        // Game Over or Victory screen
        if (gameState.currentState === GameState.States.GAME_OVER) {
            this.renderGameOver();
        } else if (gameState.currentState === GameState.States.VICTORY) {
            this.renderVictory();
        }
    }

    renderGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    }

    renderVictory() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2);
    }
} 