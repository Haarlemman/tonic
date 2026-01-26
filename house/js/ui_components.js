// --- UI COMPONENTS ---
// Extracted from house.js to reduce complexity
// V154: Refined Layout (Button Top, Header Middle, Tracks Bottom)

console.log("--- UI COMPONENTS LOADED V156 ---");
window.createUniversalVideoInterface = function (root, pos, playlist) {
    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(pos);
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
    hctx.shadowColor = '#00ff00'; hctx.shadowBlur = 10; // Green Glow
    hctx.fillText("VIDEO", 256, 64);

    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), new THREE.MeshBasicMaterial({ map: hTex, transparent: true }));
    hMesh.position.set(0, 1.5, 0); // Below Button (2.0)
    trafficGroup.add(hMesh);

    // --- 3. TRACKS (BOTTOM) ---
    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            // Start at 1.0 and go down
            const yPos = 1.0 - (i * 0.5);

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');

            sctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            sctx.fillRect(0, 0, 512, 100);
            sctx.fillStyle = '#ffffff';
            sctx.font = 'bold 40px Arial';
            sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
            sctx.fillText((i + 1) + ". " + item.title, 20, 50);

            const sTex = new THREE.CanvasTexture(sCanvas);
            const itemMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.4), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
            itemMesh.position.set(0, yPos, 0);

            itemMesh.userData = {
                type: 'universalVideoItem',
                index: i,
                onClick: () => {
                    console.log("Universal Video Click:", i);
                    if (window.videoElement) {
                        // V-FIX: Load new source explicitly & Unmute
                        window.videoElement.src = item.src;
                        window.videoElement.muted = false;
                        window.videoElement.volume = 1.0;
                        window.videoElement.load(); // Ensure load
                        window.videoElement.play().catch(e => console.error(e));

                        // Sync Button State
                        if (window.interiorClickables) {
                            const btn = window.interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                            if (btn) {
                                btn.material.color.setHex(0x00ff00);
                                btn.material.emissive.setHex(0x004400);
                            }
                        }
                    }
                    if (window.audioPlayer) {
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                    }
                }
            };

            trafficGroup.add(itemMesh);
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};
