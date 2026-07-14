
// Add this function to draw the score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '25px "Smooch Sans", serif';
    ctx.textAlign = 'right';
    // Current Score
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    
    // High Score 
    ctx.fillStyle = score > highScore ? 'yellow' : 'white';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 20, 60);
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('solarSprintHighScore', highScore);
        
        // Show a "New High Score!" message
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('New High Score!', canvas.width / 2, 100);
    }
}

function resetHighScore() {
    highScore = 0;
    localStorage.setItem('solarSprintHighScore', 0);
}
