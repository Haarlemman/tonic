// config.js
const CONFIG = {
    SHEET_ID: '2PACX-1vR-AJ2_vyyxvfpdRPd3v6MXbbI8bPF7-fLNpQx7jOGnm8mXoIhh-Gkza5xMtG8WKUHGy5ILCkBT5L-R',
    SHEET_GIDS: {
        'suske-wiske': '1889510080',
        'suske-wiske-buiten': '253283921',
        'franquin': '1026598690',
        'disney': '595534884'
    },
    CATEGORIES: {
        'suske-wiske': {
            title: 'Suske en Wiske (4 kleurenreeks)',
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
    COLUMNS: {
        nr: ['nr', 'nummer', '#'],
        title: ['title', 'titel', 'naam'],
        image: ['image', 'afbeelding', 'img', 'cover'],
        druk: ['druk', 'date', 'datum', 'jaar', 'ed'],
        conditie: ['conditie', 'staat', 'staat/conditie'],
        bijzonderheden: ['bijzonderheden', 'notities', 'opmerkingen'],
        link: ['link', 'url', 'lastdodo'],
        prijs: ['prijs', 'price', '€', 'euro'],
        serie: ['serie']
    },
    IMAGE_BASE_URL: 'https://www.tonicforthebones.com/strips/images/',
    CONTACT: {
        EMAIL: 'david.enker@gmail.com',
        WEBSITE: 'https://www.tonicforthebones.com'
    },
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    AUTO_REFRESH: {
        ENABLED: true,
        INTERVAL: 10 * 60 * 1000 // 10 minutes
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}