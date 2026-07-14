// Asset Loading Utilities
class AssetLoader {
    // Image Loader
    static async loadImages(imageSources) {
        const images = {};
        const promises = Object.entries(imageSources).map(([key, src]) => {
            return new Promise((resolve, reject) => {
                // Handle nested objects for characters
                if (typeof src === 'object') {
                    images[key] = {};
                    const subPromises = Object.entries(src).map(([subKey, subSrc]) => {
                        return Promise.all(subSrc.map((srcPath, index) => {
                            return this.loadSingleImage(srcPath, `${key}-${subKey}-${index}`);
                        })).then(loadedImages => {
                            images[key][subKey] = loadedImages;
                            resolve();
                        });
                    });
                } else {
                    // Regular single image loading
                    this.loadSingleImage(src, key).then(img => {
                        images[key] = img;
                        resolve();
                    });
                }
            });
        });
        
        await Promise.all(promises);
        return images;
    }

    // Single Image Loader
    static loadSingleImage(src, key) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(`Failed to load image ${key} from ${src}: ${error}`);
            img.src = src;
        });
    }

    // Sound Loader
    static async loadSounds(soundFiles, audioContext) {
        const sounds = {};
        const promises = Object.entries(soundFiles).map(async ([name, url]) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error(`Failed to load sound ${name} from ${url}:`, error);
            }
        });
        
        await Promise.all(promises);
        return sounds;
    }
}

// Export for module systems if needed
export default AssetLoader;
