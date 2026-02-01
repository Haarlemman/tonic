
// --- MUSIC.JS ---
// Music Player Logic & UI

console.log("--- MUSIC.JS LOADED ---");

// Global Music Functions
window.playTrack = function (index) {
    try {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist || !playlist[index]) return;

        window.currentTrackIndex = index;

        window.audioPlayer.crossOrigin = "anonymous";
        window.audioPlayer.src = playlist[index].src;
        window.audioPlayer.load();
        window.audioPlayer.volume = playlist[index].volume || 0.5;

        // Visualizer Init
        if (typeof initAudioAnalyser === 'function') initAudioAnalyser();
        if (window.audioContext && window.audioContext.state === 'suspended') window.audioContext.resume();

        console.log("Attempting to play track:", playlist[index]);

        window.audioPlayer.play().then(() => {
            window.isMusicPlaying = true;
            if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0x00ff00);

            // Highlight SINGLE Video Controls as OFF (since music is playing)
            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }

            window.createMusicPanel(playlist);

        }).catch(e => {
            console.error("Play failed", e);
        });

        if (window.stopVideosForAudio) window.stopVideosForAudio();

    } catch (criticalErr) {
        console.error("Critical PlayTrack Error:", criticalErr);
    }
};

window.createMusicPanel = function (playlist) {
    console.log("Creating Music Panel. Items:", playlist ? playlist.length : 0);
    if (!playlist || playlist.length === 0) return;

    // 1. Cleanup Old UI
    if (typeof interiorGroup !== 'undefined') {
        const toRemove = [];
        interiorGroup.traverse(child => {
            if (child.userData && (child.userData.type === 'musicPanelGroup' || child.userData.type === 'musicPanel' || child.userData.type === 'songItem' || child.userData.type === 'playlistHeader' || child.userData.type === 'musicSwitch')) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => {
            if (child.parent) child.parent.remove(child);
            if (window.interiorClickables) {
                const idx = window.interiorClickables.indexOf(child);
                if (idx > -1) window.interiorClickables.splice(idx, 1);
            }
        });
    }

    // 2. Setup Anchor and Group
    const rData = roomContent[currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01;

    let yBase = 5.5;
    if (currentRoom === 'annex') yBase = 6.0;

    let zOffset = 0;
    if (currentRoom === 'bedroom') zOffset = 0;

    const panelGroup = new THREE.Group();
    panelGroup.userData = { type: 'musicPanelGroup' };
    panelGroup.position.set(wallX, yBase, zOffset);
    interiorGroup.add(panelGroup);

    if (currentRoom === 'annex' || currentRoom === 'toilet') {
        panelGroup.scale.setScalar(0.75);
    }
    window.musicPanelMesh = panelGroup;

    // 3. UI Elements
    // Audio Button
    const switchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: window.isMusicPlaying ? 0x00ff00 : 0xff0000 });
    window.musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    window.musicSwitchMesh.rotation.y = Math.PI / 2;
    window.musicSwitchMesh.position.set(0.02, 0.5, 0);
    window.musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic', onClick: window.toggleMusic };
    panelGroup.add(window.musicSwitchMesh);
    if (window.interiorClickables) window.interiorClickables.push(window.musicSwitchMesh);

    // Header POI
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 300; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial';
    pctx.fillText("AUDIO", 0, 50);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.6), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(0, -0.5, 0);
    panelGroup.add(pHeadMesh);

    // 4. Playlist Items
    playlist.forEach((item, i) => {
        const isCurrent = (typeof window.currentTrackIndex !== 'undefined' && i === window.currentTrackIndex);
        const yPos = -1.3 - (i * 0.9);

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        if (isCurrent && window.isMusicPlaying) {
            sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#00ff00';
        } else {
            sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#ffffff';
        }

        sctx.font = 'bold 36px Arial';
        sctx.textAlign = 'left'; sctx.textBaseline = 'bottom';
        sctx.fillText((i + 1) + ". " + item.track, 20, 55);
        sctx.font = '28px Arial'; sctx.textBaseline = 'top';
        sctx.fillStyle = isCurrent ? '#aaff00' : '#cccccc';
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        sMesh.position.set(0, yPos, 0);

        sMesh.userData = { type: 'songItem', index: i, onClick: () => window.playTrack(i) };
        panelGroup.add(sMesh);
        if (window.interiorClickables) window.interiorClickables.push(sMesh);
    });

    // Auto-Next Listener
    if (window.audioPlayer && !window.audioPlayer.hasNextTrackListener) {
        window.audioPlayer.addEventListener('ended', function () {
            const pl = roomContent[currentRoom].playlist;
            let nextI = (window.currentTrackIndex + 1) % pl.length;
            window.playTrack(nextI);
        });
        window.audioPlayer.hasNextTrackListener = true;
    }
};

window.toggleMusic = function () {
    const playlist = roomContent[currentRoom].playlist;
    if (!playlist) return;

    if (!window.audioPlayer.src || window.audioPlayer.src === '' || window.audioPlayer.src === window.location.href) {
        if (window.currentTrackIndex < 0) window.currentTrackIndex = 0;
        window.audioPlayer.src = playlist[window.currentTrackIndex].src;
    }

    if (window.isMusicPlaying) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
        window.createMusicPanel(playlist);
    } else {
        window.audioPlayer.play();
        window.isMusicPlaying = true;
        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0x00ff00);
        window.createMusicPanel(playlist);

        // Stop Videos
        if (typeof window.stopVideosForAudio === 'function') window.stopVideosForAudio();
    }
};
