// Image loading and management
export const images = {};

export async function loadImages(imageSources) {
    const promises = Object.entries(imageSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { 
                images[key] = img; 
                console.log(`Loaded image: ${key}`);
                resolve(); 
            };
            img.onerror = (error) => reject(`Failed to load ${src}: ${error}`);
            img.src = src;
        });
    });

    try {
        await Promise.all(promises);
        console.log("All images loaded successfully");
    } catch (error) {
        console.error("Failed to load images:", error);
        throw error;
    }
}