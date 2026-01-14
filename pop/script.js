// Population data with growth rates (per second)
const populationData = {
    global: { count: 8118835421, rate: 2.3 },
    europe: { count: 748935267, rate: 0.08 },
    uk: { count: 67886011, rate: 0.02 },
    netherlands: { count: 17564014, rate: 0.004 },
    haarlem: { count: 162543, rate: 0.0003 }
};

// DOM elements
const elements = {
    global: document.getElementById('global-population'),
    europe: document.getElementById('europe-population'),
    uk: document.getElementById('uk-population'),
    netherlands: document.getElementById('netherlands-population'),
    haarlem: document.getElementById('haarlem-population'),
    timestamp: document.getElementById('timestamp'),
    lastUpdate: document.getElementById('last-update')
};

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Animation function for smooth number transitions
function animateValue(element, start, end, duration = 500) {
    if (!element) return;
    
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        element.textContent = formatNumber(currentValue);
        
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
            
            // Use animation for smoother updates
            animateValue(element, oldValue, data.count, 800);
        }
    });
    
    // Update timestamps
    if (elements.timestamp) {
        elements.timestamp.textContent = formatTime(now);
    }
    
    if (elements.lastUpdate) {
        elements.lastUpdate.textContent = formatDate(now);
    }
}

// Initialize counters with current values
function initializeCounters() {
    Object.keys(populationData).forEach(region => {
        const element = elements[region];
        if (element) {
            element.textContent = formatNumber(populationData[region].count);
        }
    });
    
    const now = new Date();
    if (elements.timestamp) {
        elements.timestamp.textContent = formatTime(now);
    }
    
    if (elements.lastUpdate) {
        elements.lastUpdate.textContent = formatDate(now);
    }
}

// Add visual feedback for updates
function addUpdateEffect(element) {
    if (!element) return;
    
    element.style.transform = 'scale(1.02)';
    element.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// Enhanced update function with visual effects
function updatePopulationWithEffects() {
    Object.keys(populationData).forEach(region => {
        const data = populationData[region];
        const element = elements[region];
        
        if (element) {
            const oldValue = data.count;
            data.count += data.rate;
            
            // Add visual effect
            addUpdateEffect(element);
            
            // Update with animation
            setTimeout(() => {
                animateValue(element, oldValue, data.count, 600);
            }, 100);
        }
    });
    
    // Update timestamps
    const now = new Date();
    if (elements.timestamp) {
        elements.timestamp.textContent = formatTime(now);
    }
    
    if (elements.lastUpdate) {
        elements.lastUpdate.textContent = formatDate(now);
    }
}

// Performance monitoring
let updateCount = 0;
let lastPerformanceCheck = performance.now();

function monitorPerformance() {
    updateCount++;
    const now = performance.now();
    
    if (now - lastPerformanceCheck > 10000) { // Check every 10 seconds
        const updatesPerSecond = updateCount / 10;
        console.log(`Performance: ${updatesPerSecond.toFixed(1)} updates/second`);
        updateCount = 0;
        lastPerformanceCheck = now;
    }
}

// Error handling
function handleError(error) {
    console.error('Population tracker error:', error);
    
    // Show error state in UI
    Object.values(elements).forEach(element => {
        if (element && element.classList) {
            element.classList.add('error');
        }
    });
}

// Visibility API for performance optimization
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
            updatePopulationWithEffects();
            monitorPerformance();
        } catch (error) {
            handleError(error);
        }
    }, 1000);
}

// Intersection Observer for performance optimization
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeCounters();
        startUpdates();
        setupIntersectionObserver();
        
        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                location.reload();
            }
        });
        
        console.log('Population tracker initialized successfully');
    } catch (error) {
        handleError(error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Export for potential external use
window.PopulationTracker = {
    data: populationData,
    elements: elements,
    updatePopulation: updatePopulationWithEffects,
    formatNumber: formatNumber
};

