// --- UI COMPONENTS ---
// Extracted from house.js to reduce complexity
// V154: Refined Layout (Button Top, Header Middle, Tracks Bottom)

console.log("--- UI COMPONENTS LOADED V184-FIX ---");
window.createUniversalVideoInterface = function (root, pos, playlist, options = {}) {
    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(pos);
    trafficGroup.userData = { type: 'videoInterfaceGroup' }; // V-FIX: Tag for cleanup
    console.log("Creating Refined Video UI at", pos);
    root.add(trafficGroup);

    // --- 1. SQUARE BUTTON (TOP) ---
    // User requested: "Square and ABOVE everything"
    // Geometry: Box (0.3 width, 0.3 height, 0.1 depth) -> Square
    const btnGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const btnMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x440000
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    // Position High Up
    btn.position.set(0, 2.0, 0);

    // Initial State Check
    if (window.videoElement && !window.videoElement.paused) {
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    btn.userData = {
        type: 'videoControlSingle',
        onClick: () => {
            if (!window.videoElement) {
                console.warn("No Window.VideoElement found");
                return;
            }

            if (window.videoElement.paused) {
                // PLAY
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                // If no src, use first in playlist or fallback
                if (!window.videoElement.src || window.videoElement.src === '' || window.videoElement.src === window.location.href) {
                    if (playlist && playlist.length > 0) window.videoElement.src = playlist[0].src;
                }

                // V-FIX: Robust Play
                window.videoElement.play().catch(e => console.error("Video Play Error:", e));

                btn.material.color.setHex(0x00ff00); // Green
                btn.material.emissive.setHex(0x004400);
            } else {
                // PAUSE
                window.videoElement.pause();
                btn.material.color.setHex(0xffff00); // Yellow
                btn.material.emissive.setHex(0x444400);
            }
        }
    };
    trafficGroup.add(btn);
    if (window.interiorClickables) window.interiorClickables.push(btn);

    // --- 2. HEADER "VIDEO" (MIDDLE) ---
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512; hCanvas.height = 128;
    const hctx = hCanvas.getContext('2d');
    hctx.fillStyle = 'rgba(0,0,0,0)';
    hctx.fillStyle = '#ffffff';
    hctx.font = 'bold 60px Arial'; // V-FIX: Match Audio Font
    hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
    // V-FIX: Black Shadow (No Green Glow)
    hctx.shadowColor = 'rgba(0,0,0,0.8)'; hctx.shadowBlur = 4; hctx.shadowOffsetX = 2; hctx.shadowOffsetY = 2;
    hctx.fillText("VIDEO", 256, 64);

    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), new THREE.MeshBasicMaterial({ map: hTex, transparent: true }));
    hMesh.position.set(0, 1.5, 0); // Below Button (2.0)
    trafficGroup.add(hMesh);

    // --- 3. TRACKS (BOTTOM) ---

    // Helper to refresh all items
    const updateAllItems = () => {
        if (window.interiorClickables) {
            window.interiorClickables.forEach(c => {
                if (c.userData.type === 'universalVideoItem' && c.userData.updateState) {
                    c.userData.updateState();
                }
            });
        }
    };
    window.updateVideoUI = updateAllItems; // V-FIX: Expose for external syncing (living.js)

    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            // Start at 1.0 and go down
            const yPos = 1.0 - (i * 0.6); // V-FIX: Increased spacing (0.5 -> 0.6) to avoid overlap

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');

            const sTex = new THREE.CanvasTexture(sCanvas);
            const itemMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.4), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
            itemMesh.position.set(0, yPos, 0);

            // Dynamic Update Function
            itemMesh.userData.updateState = () => {
                const isActive = (typeof window.masterVideoIndex !== 'undefined' && window.masterVideoIndex === i);
                if (isActive) {
                    sctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 50% Transparent Black
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#00ff00'; // Green Text
                } else {
                    sctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Default faint white
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#ffffff'; // White Text
                }
                sctx.font = 'bold 40px Arial';
                sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
                sctx.fillText((i + 1) + ". " + item.title, 20, 50);
                sTex.needsUpdate = true;
            };

            // Initial Draw
            itemMesh.userData.updateState();

            itemMesh.userData.type = 'universalVideoItem';
            itemMesh.userData.index = i;
            itemMesh.userData.onClick = () => {
                console.log("Universal Video Click (Fixed):", i);

                // 1. Update Global State
                window.masterVideoIndex = i;

                // 2. Play Video (Check Play Helper or Direct)
                // V-FIX: Check for custom onPlay handler FIRST (e.g. Bathroom)
                if (options.onPlay && typeof options.onPlay === 'function') {
                    options.onPlay(i);
                }
                else if (window.playTVVideo && typeof window.playTVVideo === 'function') {
                    // Use Living Room helper if available (handles Index update + Refresh)
                    window.playTVVideo(i);
                } else if (window.videoElement) {
                    // Fallback
                    window.videoElement.src = item.src;
                    window.videoElement.muted = false;
                    window.videoElement.volume = 1.0;
                    window.videoElement.load();
                    window.videoElement.play().catch(e => console.error(e));
                }

                // 3. UI Update (Local & Global) - CRITICAL: This is what fixes the highlight
                updateAllItems();

                // 4. Update Button State
                if (window.interiorClickables) {
                    const btn = window.interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                    if (btn) {
                        btn.material.color.setHex(0x00ff00);
                        btn.material.emissive.setHex(0x004400);
                    }
                }

                // 5. Stop Music
                if (window.audioPlayer) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }
            };

            trafficGroup.add(itemMesh);
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};
