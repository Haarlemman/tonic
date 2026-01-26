// --- UI COMPONENTS ---
// Extracted from house.js to reduce complexity
// V153: Separation of Concerns

window.createUniversalVideoInterface = function (root, pos, playlist) {
    // 1. CONTAINER
    // We attach primarily to 'root' (interiorGroup)
    // Create a group for the controls to position them easily
    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(pos);
    console.log("Creating Universal Video UI at", pos);
    root.add(trafficGroup);

    // 2. SINGLE TOGGLE BUTTON (Rectangular)
    // Geometry: Box (0.5 width, 0.3 height, 0.1 depth)
    const btnGeo = new THREE.BoxGeometry(0.5, 0.3, 0.1);
    const btnMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x440000
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0, 0, 0.06); // Sit on backing/plate if any. 

    // Initial State Check
    if (window.videoElement && !window.videoElement.paused) {
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    btn.userData = {
        type: 'videoControlSingle',
        onClick: () => {
            // Logic: If Playing -> Pause. If Paused -> Play.
            if (!window.videoElement) {
                console.warn("No Window.VideoElement found for Universal Control");
                return;
            }

            if (window.videoElement.paused) {
                // PLAY
                // Stop Music First
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                // If no src, use first in playlist
                if (!window.videoElement.src || window.videoElement.src === '' || window.videoElement.src === window.location.href) {
                    if (playlist && playlist.length > 0) window.videoElement.src = playlist[0].src;
                }

                window.videoElement.play().catch(e => console.error(e));
                btn.material.color.setHex(0x00ff00); // Green
                btn.material.emissive.setHex(0x004400);
            } else {
                // PAUSE
                window.videoElement.pause();
                // Simple toggle: Yellow for paused.
                btn.material.color.setHex(0xffff00);
                btn.material.emissive.setHex(0x444400);
            }
        }
    };
    trafficGroup.add(btn);

    // Add to Global Clickables
    if (window.interiorClickables) {
        window.interiorClickables.push(btn);
    }

    // 3. RECTANGULAR PLAYLIST
    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            const yPos = 0.8 - (i * 0.5); // Stack downwards

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');

            // Initial Draw (Inactive)
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
                    // Play this video
                    console.log("Universal Video Click:", i);
                    if (window.videoElement) {
                        window.videoElement.src = item.src;
                        window.videoElement.play();

                        // Sync Button State (Turn Green)
                        if (window.interiorClickables) {
                            const btn = window.interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                            if (btn) {
                                btn.material.color.setHex(0x00ff00);
                                btn.material.emissive.setHex(0x004400);
                            }
                        }
                    }
                    // Stop Music
                    if (window.audioPlayer) {
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                    }
                }
            };

            trafficGroup.add(itemMesh); // Add to group, not root directly
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};
