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

    // -- 1. AUDIO BUTTON (TOP, SQUARE) --
    // Y=5.5, Z=0 (Centered relative to group rotation)
    // V-CHANGE: Square Button (0.3x0.3) matching Video UI
    const switchGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2; // Flush with wall
    musicSwitchMesh.position.set(wallX + 0.02, 5.5, 0); // Centered
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    interiorGroup.add(musicSwitchMesh);
    interiorClickables.push(musicSwitchMesh);

    // -- 2. HEADER "AUDIO" (BELOW BUTTON) --
    // Y=4.8
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = '#ffffff'; pctx.shadowBlur = 15; // Glow
    pctx.fillText("AUDIO", 256, 32);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.3), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(wallX, 4.8, 0);
    pHeadMesh.userData = { type: 'playlistHeader' };
    interiorGroup.add(pHeadMesh);

    // -- 3. TRACK LIST (BOTTOM) --
    playlist.forEach((item, i) => {
        const isCurrent = i === currentTrackIndex;
        // Start at 4.2 go down
        const yPos = 4.2 - (i * 0.7);

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        if (isCurrent) {
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
