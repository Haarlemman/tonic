function playTrack(index) {
    try {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist || !playlist[index]) return;

        window.currentTrackIndex = index;

        audioPlayer.crossOrigin = "anonymous";
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.load();
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

        initAudioAnalyser();
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();

        console.log("Attempting to play track:", playlist[currentTrackIndex]);

        audioPlayer.play().then(() => {
            isMusicPlaying = true;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);

            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }

            createMusicPanel(playlist, window.currentMusicScale || 1.0);

        }).catch(e => {
            console.error("Play failed", e);
        });

        if (window.stopVideosForAudio) {
            window.stopVideosForAudio();
        }

        if (currentRoom === 'attic') {
            const atticVideo = document.getElementById('attic-video');
            if (atticVideo) {
                atticVideo.muted = true;
                const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                if (knobGroup) {
                    knobGroup.userData.state = 'off';
                    if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                }
            }
        }

    } catch (criticalErr) {
        console.error("Critical PlayTrack Error:", criticalErr);
        alert("System Error in playTrack: " + criticalErr.message);
    }
}

// Consolidated createMusicPanel with Cleanup and Scaling
window.createMusicPanel = function (playlist, scale = 1.0) {
    console.log("v309: Creating Music Panel. Playlist length:", playlist ? playlist.length : 0);
    if (!playlist || playlist.length === 0) return;

    // 1. Cleanup Old UI
    if (typeof interiorGroup !== 'undefined') {
        const toRemove = [];
        interiorGroup.traverse(child => {
            if (child.userData && (child.userData.type === 'musicPanel' || child.userData.type === 'songItem' || child.userData.type === 'playlistHeader' || child.userData.type === 'musicSwitch')) {
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

    // 2. Initialize Root Group
    const rootGroup = new THREE.Group();
    rootGroup.scale.set(scale, scale, scale);
    musicPanelMesh = rootGroup;
    interiorGroup.add(rootGroup);

    // 3. Initialize Variables
    const rData = roomContent[currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01;

    let yBase = 5.5;
    if (currentRoom === 'annex') {
        yBase = 6.6;
    }

    // 4. Create Static UI Elements
    // Audio Button
    const switchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2;
    musicSwitchMesh.position.set(wallX + 0.02, yBase + 0.5, 0);
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    rootGroup.add(musicSwitchMesh);
    if (window.interiorClickables) window.interiorClickables.push(musicSwitchMesh);

    // Header
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = 'rgba(0,0,0,0.8)'; pctx.shadowBlur = 4; pctx.shadowOffsetX = 2; pctx.shadowOffsetY = 2;
    pctx.fillText("AUDIO", 256, 32);
    pctx.font = '12px Arial'; pctx.shadowBlur = 0; pctx.fillText("v309", 480, 50);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.6), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(wallX, yBase - 0.5, 0);
    pHeadMesh.userData = { type: 'playlistHeader' };
    rootGroup.add(pHeadMesh);

    // 5. Create Dynamic Playlist Items
    playlist.forEach((item, i) => {
        const isCurrent = i === currentTrackIndex;
        // Start at yBase - 1.3 go down
        const yPos = (yBase - 1.3) - (i * 1.0); // Explicit calculation base

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        if (isCurrent && isMusicPlaying) {
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

        sctx.font = 'italic 28px Arial'; sctx.textBaseline = 'top';
        sctx.fillStyle = isCurrent ? '#86efac' : '#94a3b8';
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        sMesh.position.set(wallX, yPos, 0);

        // V311: Fix Cleanup bug (Required for createMusicPanel traversal)
        sMesh.userData = { type: 'songItem' };

        rootGroup.add(sMesh);
        if (window.interiorClickables) window.interiorClickables.push(sMesh);
    });

    // Define nextTrack globally so it can be referenced
    function nextTrack() {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist) return;
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

        const wasPlaying = isMusicPlaying;
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

        if (wasPlaying) {
            audioPlayer.play();
        }
        createMusicPanel(playlist, window.currentMusicScale || 1.0);
    }

    // Global Auto-Next Listener (Idempotent)
    if (window.audioPlayer && !window.audioPlayer.hasNextTrackListener) {
        window.audioPlayer.addEventListener('ended', nextTrack);
        window.audioPlayer.hasNextTrackListener = true;
    }

    // Expose for external updates (e.g. from Video UI)
    window.createMusicPanel = createMusicPanel;
    window.updateMusicPanelHighlight = function () {
        if (window.roomContent && window.currentRoom && window.roomContent[window.currentRoom]) {
            const playlist = window.roomContent[window.currentRoom].playlist;
            if (playlist) createMusicPanel(playlist, window.currentMusicScale || 1.0);
        }
    };

    function toggleMusic() {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist) return;

        if (!audioPlayer.src || audioPlayer.src === '' || audioPlayer.src === window.location.href) {
            if (currentTrackIndex < 0) currentTrackIndex = 0;
            audioPlayer.src = playlist[currentTrackIndex].src;
            audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;
        }
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();

        if (isMusicPlaying) {
            audioPlayer.pause(); isMusicPlaying = false;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
            createMusicPanel(playlist, window.currentMusicScale || 1.0);
        } else {
            if (currentRoom === 'attic') {
                const atticVideo = document.getElementById('attic-video');
                if (atticVideo) {
                    atticVideo.muted = true;
                    // Turn Knob RED
                    const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                    if (knobGroup) {
                        knobGroup.userData.state = 'off';
                        if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                    }
                }
            }
            else if (['hall', 'studio'].indexOf(currentRoom) === -1 && videoElement && !videoElement.paused) {
                videoElement.pause();
            }

            if (currentRoom === 'living' && window.stopLivingVideo) {
                window.stopLivingVideo();
            }

            if (window.updateVideoUI) {
                window.masterVideoIndex = -1;
                window.updateVideoUI();
            }

            audioPlayer.play().catch(e => console.log("Audio play failed", e));
            isMusicPlaying = true;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
            createMusicPanel(playlist, window.currentMusicScale || 1.0);

            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }
        }
    }
    window.toggleMusic = toggleMusic;
};
