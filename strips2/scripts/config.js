const CONFIG = {
    SHEET_ID: '2PACX-1vR-AJ2_vyyxvfpdRPd3v6MXbbI8bPF7-fLNpQx7jOGnm8mXoIhh-Gkza5xMtG8WKUHGy5ILCkBT5L-R',
    SHEET_GIDS: {
        'suske-wiske': '1026598690', // Suske & Wiske - 4 kleurenreeks
        'suske-wiske-buiten': '595534884', // Suske & Wiske - buiten reeks
        'franquin': '1889510080', // Franquin
        'disney': '253283921' // Disney
    },
    CATEGORIES: {
        'suske-wiske': {
            title: 'Suske en Wiske (4 kleurenreeks)',
            colors: ['#FF6B6B', '#FF8E53'],
            emoji: '????',
            description: 'De klassieke avonturen van Suske en Wiske door Willy Vandersteen.'
        },
        'suske-wiske-buiten': {
            title: 'Suske en Wiske (Buiten Reeks)',
            colors: ['#4ECDC4', '#44A08D'],
            emoji: '??',
            description: 'Speciale uitgaven en verhalen buiten de hoofdreeks.'
        },
        'franquin': {
            title: 'Franquin',
            colors: ['#667eea', '#764ba2'],
            emoji: '???',
            description: 'Strips van Andr� Franquin, zoals Robbedoes en Kwabbernoot.'
        },
        'disney': {
            title: 'Disney',
            colors: ['#f093fb', '#f5576c'],
            emoji: '??',
            description: 'Disney strips met Mickey Mouse, Donald Duck en meer.'
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
        prijs: ['prijs', 'price', '�', 'euro'],
        serie: ['serie']
    },
    IMAGE_BASE_URL: 'https://www.tonicforthebones.com/strips/images/',
    CONTACT: {
        EMAIL: 'david.enker@gmail.com',
        WEBSITE: 'https://www.tonicforthebones.com'
    },
    CACHE_DURATION: 5 * 60 * 1000,
    AUTO_REFRESH: {
        ENABLED: true,
        INTERVAL: 10 * 60 * 1000
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}