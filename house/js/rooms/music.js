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
            const btn = interiorGroup.children.find(c => c.userData.type === 'videoPlayButton');
            if (btn) {
                btn.userData.state = 'paused';
                btn.material.color.setHex(0xff0000);
                btn.material.emissive.setHex(0x440000);
            }

        }).catch(e => {
            console.error("Play failed", e);
            // alert("Audio Fail: " + e.message);
        });

        // ... rest of logic ...



        // Only pause video if we are NOT in rooms with persistent background videos (Studio, Hall, Basement)
        // Living Room and Bedroom videos are "active" content with sound potential, so they pause when music starts.
        if (['hall', 'studio', 'basement'].indexOf(currentRoom) === -1 && videoElement && !videoElement.paused) {
            videoElement.pause();
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
    const npMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    npMesh.rotation.y = Math.PI / 2;
    npMesh.position.set(wallX, 5.5, 0);
    npMesh.userData = { type: 'musicPanel' };
    interiorGroup.add(npMesh);

    // -- 2. PLAYLIST HEADER --
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 40px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.fillText("PLAYLIST", 256, 32);
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.4), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(wallX, 4.2, 0);
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
        // Increased mesh height to match new aspect (3.5 width / 512 * 120 approx 0.8)
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        // Position: stack downwards from 3.5, with larger gap
        sMesh.position.set(wallX, 3.5 - (i * 0.9), 0);
        sMesh.userData = { type: 'songItem', index: i };

        interiorGroup.add(sMesh);
        interiorClickables.push(sMesh);
    });

    // -- 4. ON/OFF SWITCH --
    const switchGeo = new THREE.BoxGeometry(0.2, 0.5, 0.5);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.position.set(wallX + 0.02, 5.5, -2.0); // Slightly pop out
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

        audioPlayer.play().catch(e => console.log("Audio play failed", e));
        isMusicPlaying = true;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
    }
}
