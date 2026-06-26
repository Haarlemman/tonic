// Google Sheets Configuration
const CONFIG = {
    // Your Google Sheets ID
    SHEET_ID: '1ugyJAZ1sXX7bizSs28hPsyo52_fclmRPnms2zlYIiH0',
    
    // Sheet GIDs for each category
    // To find GIDs: Open your Google Sheet, each tab URL contains #gid=XXXXXX
    SHEET_GIDS: {
        'suske-wiske': 1026598690,           // Main Suske en Wiske tab (usually 0)
        'suske-wiske-buiten': 595534884, // Replace with actual GID when you create the tab
        'franquin': 1889510080,           // Replace with actual GID when you create the tab
        'disney': 253283921              // Replace with actual GID when you create the tab
    },
    
    // Category metadata
    CATEGORIES: {
        'suske-wiske': {
            title: 'Suske en Wiske',
            colors: ['#FF6B6B', '#FF8E53'],
            emoji: '👦👧',
            description: 'De klassieke avonturen van Suske en Wiske door Willy Vandersteen. Ontdek de volledige reeks van deze iconische Vlaamse strips.'
        },
        'suske-wiske-buiten': {
            title: 'Suske en Wiske (Buiten Reeks)',
            colors: ['#4ECDC4', '#44A08D'],
            emoji: '📚',
            description: 'Speciale uitgaven en verhalen buiten de hoofdreeks. Zeldzame en bijzondere Suske en Wiske albums.'
        },
        'franquin': {
            title: 'Franquin',
            colors: ['#667eea', '#764ba2'],
            emoji: '🐿️',
            description: 'Strips van de meesterlijke André Franquin, waaronder Robbedoes en Kwabbernoot, Guust Flater en meer.'
        },
        'disney': {
            title: 'Disney',
            colors: ['#f093fb', '#f5576c'],
            emoji: '🏰',
            description: 'Disney strips en verhalen met Mickey Mouse, Donald Duck en alle andere geliefde Disney karakters.'
        }
    },
    
    // CSV column mapping (adjust these based on your Google Sheets structure)
    COLUMNS: {
        IMAGE: 0,           // Column A - Image URL
        NUMBER: 1,          // Column B - Comic Number
        TITLE: 2,           // Column C - Title
        EDITION: 3,         // Column D - Edition (Druk)
        CONDITION: 4,       // Column E - Condition (Conditie)
        NOTES: 5,          // Column F - Notes (Bijzonderheden)
        LINK: 6,           // Column G - External Link
        PRICE: 7           // Column H - Price (Prijs)
    },
    
    // Image settings
    IMAGE_BASE_URL: 'https://davidenker.com/strips/images/',
    
    // Contact information
    CONTACT: {
        EMAIL: 'david.enker@gmail.com',
        WEBSITE: 'https://www.tonicforthebones.com'
    },
    
    // Cache settings (in milliseconds)
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    
    // Auto-refresh settings
    AUTO_REFRESH: {
        ENABLED: true,
        INTERVAL: 10 * 60 * 1000 // Check for updates every 10 minutes
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}