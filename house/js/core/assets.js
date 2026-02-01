
if (!window.MeaningHouse) window.MeaningHouse = {};
if (!window.MeaningHouse.Core) window.MeaningHouse.Core = {};

window.MeaningHouse.Core.Assets = (function () {

    // --- PRIVATE ---
    const manager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(manager);
    const textureCache = new Map();
    const modelCache = new Map();

    // Setup Manager Events
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onLoad = function () {
        console.log('Loading complete!');
        if (window.hideLoader) window.hideLoader(); // Integrate with existing loader
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        // TODO: Could update a progress bar here
    };

    manager.onError = function (url) {
        console.error('There was an error loading ' + url);
    };

    // --- PUBLIC API ---

    /**
     * Load a texture with caching
     * @param {string} url - Path to texture
     * @returns {THREE.Texture}
     */
    function loadTexture(url) {
        if (textureCache.has(url)) {
            return textureCache.get(url);
        }

        // Handle "magic" procedural textures if needed, or simple file loads
        // For now, simple file loads:
        const tex = textureLoader.load(url);
        textureCache.set(url, tex);
        return tex;
    }

    /**
     * Get the global loading manager to hook listeners
     * @returns {THREE.LoadingManager}
     */
    function getManager() {
        return manager;
    }

    /**
     * Clear caches (useful for memory management)
     */
    function dispose() {
        console.log("--- DISPOSING ASSETS ---");
        textureCache.forEach(tex => tex.dispose());
        textureCache.clear();
        modelCache.clear();
    }

    return {
        loadTexture: loadTexture,
        getManager: getManager,
        dispose: dispose
    };

})();
