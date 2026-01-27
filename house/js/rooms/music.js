function playTrack(index) {
    try {
        // alert("DEBUG: playTrack START. Index: " + index);
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist || !playlist[index]) return;

        window.currentTrackIndex = index; // V-FIX: Explicit Global Sync

        // User Requested Fix: Enable CORS for Analyser
        audioPlayer.crossOrigin = "anonymous";
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.load();
        // V78: Per-track volume support
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

        initAudioAnalyser(); // Re-enabled for Visualizer
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();

        console.log("Attempting to play track:", playlist[currentTrackIndex]);
        console.log("Source:", audioPlayer.src);

        audioPlayer.play().then(() => {
            isMusicPlaying = true;
            console.log("Audio Play Success");
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);

            // V14: Turn Video Button RED if music starts
            // Search traverse-safe via clickables
            // V-FIX: Find ALL video buttons (in case multiple or just to be safe)
            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    console.log("Music Play -> Turning Video Button RED", b);
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }

            // V204: Update UI AFTER state change confirmed
            createMusicPanel(playlist);

        }).catch(e => {
            console.error("Play failed", e);
            // alert("Audio Fail: " + e.message);
        });

        // ... rest of logic ...



        // V-FIX: Global Sync - Stop Videos/Reset Lights when Audio starts
        if (window.stopVideosForAudio) {
            window.stopVideosForAudio();
        }

        // V210: Attic Audio Precedence for "Click Song"
        if (currentRoom === 'attic') {
            const atticVideo = document.getElementById('attic-video');
            if (atticVideo) {
                console.log("Music PlayTrack: Muting Attic Video");
                atticVideo.muted = true;
                const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                if (knobGroup) {
                    knobGroup.userData.state = 'off';
                    if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                }
            }
        }

        // V-FIX 251: Removed synchronous panel cleanup here to prevent UI flashing/disappearing.
        // Cleanup is now handled solely by createMusicPanel logic.

        // V204: MOVED createMusicPanel inside .then() above to ensure isMusicPlaying is true
        // But we must create it even if play fails? 
        // No, if play fails, isMusicPlaying is false, so it draws unhighlighted.
        // Wait, if we move it inside .then, and play FAILS, logic below for cleanup ran, so NO PANEL?
        // Logic flaw!
        // We removed panel items.
        // We MUST recreate panel always.
        // So we keep it here, but ALSO call it in .then()?
        // Re-drawing twice is inefficient but safe.
        // Better: Just call it here. Why did it fail before?
        // Because here 'isMusicPlaying' is still false (async).
        // So we draw it here (unhighlighted).
        // AND THEN inside .then() we draw it again (highlighted).
        // We need to clear previous items inside .then() as well? Or createMusicPanel handles clearing?
        // createMusicPanel does NOT clear items (see line 89-.. it starts creating).
        // Wait, the "Clear old music panel" block (lines 70-80) runs before.
        // If we call createMusicPanel inside .then(), we get duplicate panels unless we clear again.
        // REFACTOR:
        // Update playTrack to:
        // 1. Cleanup old panel (Synchronous).
        // 2. Define helper to build panel.
        // 3. Call helper immediately (Synchronous) -> Draws Unhighlighted.
        // 4. Inside .then(): Cleanup old panel AGAIN (or update existing?), then Draw Highlighted.
        // EASIER:
        // Just call `createMusicPanel(playlist)` inside `.then()`.
        // BUT `createMusicPanel` doesn't clear.
        // So we need to call the "Clear" logic again inside `.then()`.
        // OR make `createMusicPanel` robust to clear its own garbage?
        // `createMusicPanel` in music.js DOES NOT clear.
        // The cleanup logic is inline in `playTrack` (lines 70-80) and `createVideoPanel` (lines 88-99 in living.js).
        // I should probably move cleanup into `createMusicPanel` to make it robust.
        // Let's do that first.

    } catch (criticalErr) {
        console.error("Critical PlayTrack Error:", criticalErr);
        alert("System Error in playTrack: " + criticalErr.message);
    }
}

function createMusicPanel(playlist, skipCleanup = false) {
    console.log("v179: Creating Music Panel. Playlist length:", playlist ? playlist.length : 0);
    if (!playlist || playlist.length === 0) return;

    // V204: Self-Cleanup Logic
    if (!skipCleanup) {
        const toRemove = [];
        // Need to access interiorGroup, assuming it's global or passed (it's global in room scripts scope usually)
        if (typeof interiorGroup !== 'undefined') {
            interiorGroup.traverse(child => {
                if (child.userData && (child.userData.type === 'musicPanel' || child.userData.type === 'songItem' || child.userData.type === 'playlistHeader' || child.userData.type === 'musicSwitch')) {
                    toRemove.push(child);
                }
            });
            toRemove.forEach(child => {
                if (child.parent) child.parent.remove(child); // V-FIX: Safe removal
                if (window.interiorClickables) {
                    const idx = window.interiorClickables.indexOf(child);
                    if (idx > -1) window.interiorClickables.splice(idx, 1);
                }
            });
        }
    }

    const currentTrack = (window.currentTrackIndex >= 0 && playlist[window.currentTrackIndex]) ? playlist[window.currentTrackIndex] : null;

    // Dynamic Wall Position
    const rData = roomContent[currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01; // Tighter fit to wall

    // V-FIX 251: Height Adjustment for Annex (Tall space)
    let yBase = 5.5; // Default (Living Room / Standard)
    if (currentRoom === 'annex') {
        yBase = 6.6; // High but visible
    }

    // -- 1. AUDIO BUTTON (TOP, SQUARE) --
    // Y=yBase
    // V-CHANGE: Square Button (0.3x0.3) matching Video UI
    const switchGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2; // Flush with wall
    musicSwitchMesh.position.set(wallX + 0.02, yBase, 0); // Centered
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    interiorGroup.add(musicSwitchMesh);
    interiorClickables.push(musicSwitchMesh);

    // -- 2. HEADER "AUDIO" (BELOW BUTTON) --
    // Y=yBase - 0.7
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = 'rgba(0,0,0,0.8)'; pctx.shadowBlur = 4; pctx.shadowOffsetX = 2; pctx.shadowOffsetY = 2; // V-FIX: Black Shadow
    pctx.fillText("AUDIO", 256, 32);
    // V-DEBUG: Visible Version
    pctx.font = '12px Arial'; pctx.shadowBlur = 0; pctx.fillText("v254", 480, 50);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.3), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(wallX, yBase - 0.7, 0);
    pHeadMesh.userData = { type: 'playlistHeader' };
    interiorGroup.add(pHeadMesh);

    // -- 3. TRACK LIST (BOTTOM) --
    playlist.forEach((item, i) => {
        const isCurrent = i === currentTrackIndex;
        // Start at yBase - 1.3 go down
        const yPos = (yBase - 1.3) - (i * 0.7);

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        // V200: Only highlight if music is playing
        if (isCurrent && isMusicPlaying) {
            // V-CHANGE: 50% Black Background
            sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            sctx.fillRect(0, 0, 512, 120);
            // V-CHANGE: Bright Green Text
            sctx.fillStyle = '#00ff00';
        } else {
            sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#ffffff';
        }

        // LINE 1: Track Name
        sctx.font = 'bold 36px Arial';
        sctx.textAlign = 'left'; sctx.textBaseline = 'bottom';
        sctx.fillText((i + 1) + ". " + item.track, 20, 55);

        // LINE 2: Artist Name
        sctx.font = 'italic 28px Arial'; sctx.textBaseline = 'top';
        sctx.fillStyle = isCurrent ? '#86efac' : '#94a3b8';
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.6), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        sMesh.position.set(wallX, yPos, 0); // Centered
        sMesh.userData = { type: 'songItem', index: i };

        interiorGroup.add(sMesh);
        interiorClickables.push(sMesh);
    });
}

// Define nextTrack globally so it can be referenced
function nextTrack() {
    const playlist = roomContent[currentRoom].playlist;
    if (!playlist) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

    const wasPlaying = isMusicPlaying;
    audioPlayer.src = playlist[currentTrackIndex].src;
    // V78: Volume
    audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

    if (wasPlaying) {
        audioPlayer.play();
    }
    createMusicPanel(playlist); // Refresh panel UI
}

// Global Auto-Next Listener (Idempotent)
if (window.audioPlayer && !window.audioPlayer.hasNextTrackListener) {
    window.audioPlayer.addEventListener('ended', nextTrack);
    window.audioPlayer.hasNextTrackListener = true;
}

// V-NEW: Expose for external updates (e.g. from Video UI)
window.createMusicPanel = createMusicPanel;
window.updateMusicPanelHighlight = function () {
    if (window.roomContent && window.currentRoom && window.roomContent[window.currentRoom]) {
        const playlist = window.roomContent[window.currentRoom].playlist;
        if (playlist) createMusicPanel(playlist);
    }
};

function toggleMusic() {
    const playlist = roomContent[currentRoom].playlist;
    if (!playlist) return;

    if (!audioPlayer.src || audioPlayer.src === '' || audioPlayer.src === window.location.href) {
        // V-FIX: Handle -1 index if starting fresh
        if (currentTrackIndex < 0) currentTrackIndex = 0;

        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;
    }
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if (isMusicPlaying) {
        audioPlayer.pause(); isMusicPlaying = false;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
        createMusicPanel(playlist); // V200: Refresh UI to remove highlight
    } else {
        // If a video is playing, stop it (UNLESS it's a background video)
        // ATTIC SPECIAL PRECEDENCE:
        if (currentRoom === 'attic') {
            const atticVideo = document.getElementById('attic-video');
            if (atticVideo) {
                console.log("ToggleMusic: Muting Attic Video");
                atticVideo.muted = true;
                // Turn Knob RED
                const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                if (knobGroup) {
                    knobGroup.userData.state = 'off';
                    // Knob is child 1 (0 is base)
                    if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                }
            }
        }
        else if (['hall', 'studio'].indexOf(currentRoom) === -1 && videoElement && !videoElement.paused) {
            // Standard behavior for other rooms (Living, Bedroom)
            videoElement.pause();
        }

        // V-FIX: Stop Living Room TV when toggling music ON
        if (currentRoom === 'living' && window.stopLivingVideo) {
            window.stopLivingVideo();
        }

        // V-FIX: Clear Video Highlight logic if any
        if (window.updateVideoUI) {
            window.masterVideoIndex = -1;
            window.updateVideoUI();
        }

        audioPlayer.play().catch(e => console.log("Audio play failed", e));
        isMusicPlaying = true;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
        createMusicPanel(playlist); // V200: Refresh UI to show highlight (using currentTrackIndex)

        // V-FIX: Sync Video Buttons (RED) when Music Toggled ON
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
window.toggleMusic = toggleMusic; // Expose global
