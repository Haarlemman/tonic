class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    async loadAll() {
        const imagePromises = Object.entries(CONFIG.ASSETS.IMAGES).map(([key, path]) => 
            this.loadImage(key, path)
        );

        const soundPromises = Object.entries(CONFIG.ASSETS.SOUNDS).map(([key, path]) => 
            this.loadSound(key, path)
        );

        try {
            await Promise.all([...imagePromises, ...soundPromises]);
            GameLogger.log('All assets loaded successfully');
            return true;
        } catch (error) {
            GameLogger.error('Failed to load assets: ' + error);
            return false;
        }
    }

    loadImage(key, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                this.loadedAssets++;
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
            this.totalAssets++;
        });
    }

    loadSound(key, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.sounds[key] = audio;
                this.loadedAssets++;
                resolve();
            };
            audio.onerror = () => reject(new Error(`Failed to load sound: ${path}`));
            audio.src = path;
            this.totalAssets++;
        });
    }

    getImage(key) {
        return this.images[key];
    }

    getSound(key) {
        return this.sounds[key];
    }

    getLoadingProgress() {
        return this.totalAssets ? this.loadedAssets / this.totalAssets : 0;
    }
} 