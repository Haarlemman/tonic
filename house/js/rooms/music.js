function playTrack(index) {
    try {
        // alert("DEBUG: playTrack START. Index: " + index);
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist || !playlist[index]) return;

        currentTrackIndex = index;

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

        // Clear old music panel items and rebuild
        const toRemove = [];
        interiorGroup.traverse(child => {
            if (child.userData && (child.userData.type === 'musicPanel' || child.userData.type === 'songItem' || child.userData.type === 'playlistHeader' || child.userData.type === 'musicSwitch')) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => {
            interiorGroup.remove(child);
            const idx = interiorClickables.indexOf(child);
            if (idx > -1) interiorClickables.splice(idx, 1);
        });

        createMusicPanel(playlist);
    } catch (criticalErr) {
        console.error("Critical PlayTrack Error:", criticalErr);
        alert("System Error in playTrack: " + criticalErr.message);
    }
}

function createMusicPanel(playlist) {
    if (!playlist || playlist.length === 0) return;
    const currentTrack = playlist[currentTrackIndex];

    // Dynamic Wall Position
    const rData = roomContent[currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01; // Tighter fit to wall

    // -- 1. NOW PLAYING BOARD (CENTERED TOP) --
    // Z=0 (Center of wall), Y=5.5
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#4ade80'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center'; ctx.fillText("NOW PLAYING", 256, 60);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 45px Arial'; ctx.fillText(currentTrack.artist, 256, 130);
    ctx.font = 'italic 35px Arial'; ctx.fillText(currentTrack.track, 256, 190);

    const tex = new THREE.CanvasTexture(canvas);
    // V-REFINE: Scaling Down (3x1.5 -> 2.2x1.1)
    const npMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    npMesh.rotation.y = Math.PI / 2;
    npMesh.position.set(wallX, 5.5, 0);
    npMesh.userData = { type: 'musicPanel' };
    interiorGroup.add(npMesh);

    // -- 2. PLAYLIST HEADER --
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    // V-CHANGE: "AUDIO" instead of "PLAYLIST"
    pctx.shadowColor = '#ffffff'; pctx.shadowBlur = 15; // V-FIX: Glow
    pctx.fillText("AUDIO", 256, 32);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    // V-REFINE: Scaling Down (2x0.4 -> 1.5x0.3)
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.3), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(wallX, 4.4, 0); // Adjusted Y
    pHeadMesh.userData = { type: 'playlistHeader' };
    interiorGroup.add(pHeadMesh);

    // -- 3. INTERACTIVE SONG LIST --
    playlist.forEach((item, i) => {
        const isCurrent = i === currentTrackIndex;
        // INCREASED HEIGHT FOR 2 LINES
        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        if (isCurrent) {
            sctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#4ade80';
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
        sctx.fillStyle = isCurrent ? '#86efac' : '#94a3b8'; // Slightly dimmer for artist
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        // V-REFINE: Scaling Down (3.5x0.8 -> 2.5x0.6)
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.6), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        // Position: Stack closer
        sMesh.position.set(wallX, 3.8 - (i * 0.7), 0);
        sMesh.userData = { type: 'songItem', index: i };

        interiorGroup.add(sMesh);
        interiorClickables.push(sMesh);
    });

    // -- 4. ON/OFF SWITCH --
    // V-CHANGE: Square Button (0.3x0.3) matching Video UI
    const switchGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2; // V-FIX: Match panel rotation
    musicSwitchMesh.position.set(wallX + 0.02, 5.5, -1.45); // V-FIX: Nudge right to prevent overlap
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    interiorGroup.add(musicSwitchMesh);
    interiorClickables.push(musicSwitchMesh);
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

function toggleMusic() {
    const playlist = roomContent[currentRoom].playlist;
    if (!playlist) return;

    if (!audioPlayer.src || audioPlayer.src === '' || audioPlayer.src === window.location.href) {
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;
    }
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if (isMusicPlaying) {
        audioPlayer.pause(); isMusicPlaying = false;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
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

        audioPlayer.play().catch(e => console.log("Audio play failed", e));
        isMusicPlaying = true;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);

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
