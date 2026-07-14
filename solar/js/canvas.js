// Canvas setup and drawing functions
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export function resizeCanvas() {
    // Set canvas height to window height minus space for controls
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100; // Leave 100px for controls
    
    // Position canvas at the top
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    // Make sure navigation stays below canvas
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.position = 'absolute';
        nav.style.bottom = '0';
        nav.style.width = '100%';
    }
}

export function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
