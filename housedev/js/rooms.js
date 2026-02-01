
// --- ROOMS.JS (LITE) ---
// This file is now a legacy stub. Room logic is modularized in js/rooms/*.js
console.log("Rooms logic loaded via modular architecture.");

// Shared helpers that might still be expected by some parts of the system
window.stopVideosForAudio = function () {
    // Stop any active video players when music starts
    if (window.videoElement) window.videoElement.pause();
    if (window.stopLivingVideo) window.stopLivingVideo();
    if (window.stopBedroomVideo) window.stopBedroomVideo();
};

window.applyRoomLighting = function (room) {
    // Proxy to engine profile system if it exists
    if (window.setRoomLightingProfile) window.setRoomLightingProfile(room);
};
