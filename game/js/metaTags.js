function insertMetaTags() {
    const metaTags = [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "description", content: "Play 'Solar Sprint', an exciting game that offers thrilling challenges and fun gameplay. Play now and enjoy hours of entertainment!" },
        { name: "keywords", content: "game, play, online game, action game, adventure game" },
        { property: "og:title", content: "Solar Sprint" },
        { property: "og:description", content: "Play 'Solar Sprint' for endless fun | A Prime Paradox Production" },
        { property: "og:image", content: "/game/images/solar.jpg" },
        { property: "og:url", content: "/game/game.html" },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: "Solar Sprint" },
        { name: "twitter:description", content: "Play 'Solar Sprint' now for the ultimate gaming experience!" },
        { name: "twitter:image", content: "/game/images/solar.jpg" },
        { name: "twitter:card", content: "/game/images/primeparadox.jpg" }
    ];

    const linkTags = [
        { rel: "icon", type: "/game/image/svg+xml", href: "/game/images/fav.svg" },
        { rel: "icon", type: "/game/image/png", href: "/game/images/apple-touch-icon.png" },
        { rel: "icon", type: "/game/image/x-icon", href: "/game/images/fav.ico" },
        { rel: "stylesheet", href: "/game/css/style.css" }
    ];

    metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        Object.entries(tag).forEach(([key, value]) => {
            meta.setAttribute(key, value);
        });
        document.head.appendChild(meta);
    });

    linkTags.forEach(tag => {
        const link = document.createElement('link');
        Object.entries(tag).forEach(([key, value]) => {
            link.setAttribute(key, value);
        });
        document.head.appendChild(link);
    });
} 