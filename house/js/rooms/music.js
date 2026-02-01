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
window.createMusicPanel = function (playlist) {
    console.log("v315-FIXED: Creating Music Panel. Playlist length:", playlist ? playlist.length : 0);
    if (!playlist || playlist.length === 0) return;

    // 1. Cleanup Old UI (Self-contained within createMusicPanel)
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
    if (currentRoom === 'annex') {
        yBase = 6.0; // V-FIX: Moved up for visibility (was 5.0)
    }

    // V326: Bedroom-specific alignment (Centered on wall)
    let zOffset = 0;
    if (currentRoom === 'bedroom') zOffset = 0;

    const panelGroup = new THREE.Group();
    panelGroup.userData = { type: 'musicPanelGroup' };
    panelGroup.position.set(wallX, yBase, zOffset);
    interiorGroup.add(panelGroup);

    // Apply Scaling Factor
    if (currentRoom === 'annex' || currentRoom === 'toilet') {
        panelGroup.scale.setScalar(0.75);
    }
    musicPanelMesh = panelGroup;

    // 3. Create Static UI Elements (Relative to panelGroup)

    // Audio Button
    const switchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2;
    musicSwitchMesh.position.set(0.02, 0.5, 0); // 0.5 above anchor
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    panelGroup.add(musicSwitchMesh);
    if (window.interiorClickables) window.interiorClickables.push(musicSwitchMesh);

    // Header
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = 'rgba(0,0,0,0.8)'; pctx.shadowBlur = 4; pctx.shadowOffsetX = 2; pctx.shadowOffsetY = 2;
    pctx.fillText("AUDIO", 256, 32);
    // V-FIX: Exact reference font and spacing
    pctx.font = '14px Arial'; pctx.shadowBlur = 0; pctx.fillText("v315-RELOADED-6", 450, 52);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.6), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(0, -0.5, 0); // 0.5 below anchor
    pHeadMesh.userData = { type: 'playlistHeader' };
    panelGroup.add(pHeadMesh);

    // 4. Create Dynamic Playlist Items
    playlist.forEach((item, i) => {
        const isCurrent = (typeof currentTrackIndex !== 'undefined' && i === currentTrackIndex);
        const yPos = -1.3 - (i * 0.9); // Relative to anchor

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

        sctx.font = '28px Arial'; sctx.textBaseline = 'top';
        sctx.fillStyle = isCurrent ? '#aaff00' : '#cccccc'; // Lighter grey for better contrast
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        sMesh.position.set(0, yPos, 0);

        sMesh.userData = { type: 'songItem', index: i };
        panelGroup.add(sMesh);
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
        window.createMusicPanel(playlist);
    }

    // Global Auto-Next Listener (Idempotent)
    if (window.audioPlayer && !window.audioPlayer.hasNextTrackListener) {
        window.audioPlayer.addEventListener('ended', nextTrack);
        window.audioPlayer.hasNextTrackListener = true;
    }

    // Expose for external updates (e.g. from Video UI)
    window.updateMusicPanelHighlight = function () {
        if (window.roomContent && window.currentRoom && window.roomContent[window.currentRoom]) {
            const playlist = window.roomContent[window.currentRoom].playlist;
            if (playlist) window.createMusicPanel(playlist);
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
            window.createMusicPanel(playlist);
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
            // V-FIX 24: Ensure Bathroom Video Stop (Reset Lights) is called too!
            if (currentRoom === 'bathroom' && window.stopBathroomVideo) {
                window.stopBathroomVideo();
            }

            if (window.updateVideoUI) {
                window.masterVideoIndex = -1;
                window.updateVideoUI();
            }

            audioPlayer.play().catch(e => console.log("Audio play failed", e));
            isMusicPlaying = true;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
            window.createMusicPanel(playlist);

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
