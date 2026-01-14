function loadImages(callback) {
    console.log('Loading only player image...');
    playerImg.src = 'quiff.png';
    playerImg.onload = () => {
        console.log('Player image loaded.');
        callback();
    };
    playerImg.onerror = () => {
        console.error('Failed to load player image.');
        useCustomImages = false;
        callback();
    };
}