// Tron-Style Population Tracker JavaScript

// Population data with growth rates
const populationData = {
    global: { count: 8118835421, rate: 2.3 },
    europe: { count: 748935267, rate: 0.08 },
    uk: { count: 67886011, rate: 0.02 },
    netherlands: { count: 17564014, rate: 0.004 },
    haarlem: { count: 162543, rate: 0.0003 }
};

// DOM elements
const elements = {
    global: document.getElementById('global-counter'),
    europe: document.getElementById('europe-counter'),
    uk: document.getElementById('uk-counter'),
    netherlands: document.getElementById('netherlands-counter'),
    haarlem: document.getElementById('haarlem-counter'),
    currentTime: document.getElementById('current-time'),
    currentDate: document.getElementById('current-date'),
    lastUpdate: document.getElementById('last-update')
};

// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#00ffff' : '#0080ff'
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Pulse opacity
            particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01;
            particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
        
        // Draw connections
        this.drawConnections();
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowBlur = 5;
                    this.ctx.shadowColor = '#00ffff';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            });
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Tron-style number animation
function animateCounter(element, start, end, duration = 800) {
    if (!element) return;
    
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Tron-style easing with slight overshoot
        const easeOutBack = 1 + 2.7 * Math.pow(progress - 1, 3) + 1.7 * Math.pow(progress - 1, 2);
        const currentValue = startValue + (endValue - startValue) * easeOutBack;
        
        element.textContent = formatNumber(currentValue);
        
        // Add glitch effect occasionally
        if (Math.random() < 0.05) {
            element.style.textShadow = '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff';
            setTimeout(() => {
                element.style.textShadow = '';
            }, 100);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = formatNumber(endValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update population counters
function updatePopulation() {
    const now = new Date();
    
    Object.keys(populationData).forEach(region => {
        const data = populationData[region];
        const element = elements[region];
        
        if (element) {
            const oldValue = data.count;
            data.count += data.rate;
            
            // Animate with Tron-style effects
            animateCounter(element, oldValue, data.count, 600);
            
            // Add scanning effect
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            
            // Create scanning line effect
            if (!element.querySelector('.scan-line')) {
                const scanLine = document.createElement('div');
                scanLine.className = 'scan-line';
                scanLine.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
                    animation: scanMove 1s ease-out;
                    pointer-events: none;
                `;
                element.appendChild(scanLine);
                
                setTimeout(() => {
                    if (scanLine.parentNode) {
                        scanLine.parentNode.removeChild(scanLine);
                    }
                }, 1000);
            }
        }
    });
    
    // Update timestamps
    if (elements.currentTime) {
        elements.currentTime.textContent = formatTime(now);
    }
    
    if (elements.currentDate) {
        elements.currentDate.textContent = formatDate(now);
    }
    
    if (elements.lastUpdate) {
        elements.lastUpdate.textContent = formatTime(now);
    }
}

// Initialize counters
function initializeCounters() {
    Object.keys(populationData).forEach(region => {
        const element = elements[region];
        if (element) {
            element.textContent = formatNumber(populationData[region].count);
        }
    });
    
    const now = new Date();
    if (elements.currentTime) {
        elements.currentTime.textContent = formatTime(now);
    }
    
    if (elements.currentDate) {
        elements.currentDate.textContent = formatDate(now);
    }
    
    if (elements.lastUpdate) {
        elements.lastUpdate.textContent = formatTime(now);
    }
}

// Add Tron-style visual effects
function addTronEffects() {
    // Add hover effects to grid items
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
            item.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '';
        });
    });
    
    // Add click effects
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY);
    });
}

// Create click ripple effect
function createClickEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        border: 2px solid #00ffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: rippleEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            opacity: 0;
        }
    }
    
    @keyframes scanMove {
        from { left: -100%; }
        to { left: 100%; }
    }
`;
document.head.appendChild(style);

// Performance monitoring
let updateCount = 0;
let lastPerformanceCheck = performance.now();

function monitorPerformance() {
    updateCount++;
    const now = performance.now();
    
    if (now - lastPerformanceCheck > 10000) {
        const updatesPerSecond = updateCount / 10;
        console.log(`GRID PERFORMANCE: ${updatesPerSecond.toFixed(1)} updates/second`);
        updateCount = 0;
        lastPerformanceCheck = now;
    }
}

// Error handling with Tron-style alerts
function handleError(error) {
    console.error('GRID SYSTEM ERROR:', error);
    
    // Show Tron-style error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 64, 0.9);
        border: 2px solid #ff0040;
        color: #ffffff;
        padding: 15px 20px;
        font-family: 'Orbitron', monospace;
        font-size: 0.9rem;
        letter-spacing: 1px;
        z-index: 10000;
        box-shadow: 0 0 20px #ff0040;
        animation: errorPulse 0.5s ease-out;
    `;
    errorDiv.textContent = 'GRID SYSTEM ERROR DETECTED';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Visibility API optimization
let isVisible = true;
let updateInterval;

function handleVisibilityChange() {
    if (document.hidden) {
        isVisible = false;
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    } else {
        isVisible = true;
        startUpdates();
    }
}

// Start the update cycle
function startUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    updateInterval = setInterval(() => {
        try {
            updatePopulation();
            monitorPerformance();
        } catch (error) {
            handleError(error);
        }
    }, 1000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize particle system
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            new ParticleSystem(canvas);
        }
        
        // Initialize counters and effects
        initializeCounters();
        addTronEffects();
        startUpdates();
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                location.reload();
            }
            
            // Easter egg: press 'T' for extra Tron effects
            if (e.key.toLowerCase() === 't') {
                document.body.style.animation = 'tronFlash 0.5s ease-out';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 500);
            }
        });
        
        console.log('GRID SYSTEM INITIALIZED - ALL SYSTEMS ONLINE');
    } catch (error) {
        handleError(error);
    }
});

// Add Tron flash effect
const tronStyle = document.createElement('style');
tronStyle.textContent = `
    @keyframes tronFlash {
        0% { filter: brightness(1); }
        50% { filter: brightness(1.5) hue-rotate(180deg); }
        100% { filter: brightness(1); }
    }
    
    @keyframes errorPulse {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(tronStyle);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Export for external use
window.TronGrid = {
    data: populationData,
    elements: elements,
    updatePopulation: updatePopulation,
    formatNumber: formatNumber
};

