function playTrack(index) {
    if (!window.currentRoom || !window.roomContent || !window.roomContent[window.currentRoom]) {
        console.error("playTrack called too early – currentRoom =", window.currentRoom);
        return;
    }

    // Ensure audioPlayer exists
    if (!window.audioPlayer) {
        console.error("❌ audioPlayer not found! Attempting to initialize...");
        window.audioPlayer = document.getElementById('room-audio');
        if (!window.audioPlayer) {
            console.error("❌ CRITICAL: Cannot find #room-audio element!");
            return;
        }
    }

    try {
        const playlist = window.roomContent[window.currentRoom].playlist;
        if (!playlist || !playlist[index]) {
            console.warn("No playlist or track at index", index, "for room", window.currentRoom);
            return;
        }

        const targetSrc = playlist[index].src;

        // If already playing this track, don't restart it (prevent glitching)
        if (window.audioPlayer.src && window.audioPlayer.src.includes(targetSrc.substring(targetSrc.lastIndexOf('/') + 1)) && !window.audioPlayer.paused) {
            console.log('🎵 Track already playing:', targetSrc);
            window.currentTrackIndex = index;
            if (window.updateMusicPanelHighlight) window.updateMusicPanelHighlight();
            return;
        }

        window.currentTrackIndex = index;

        window.audioPlayer.src = targetSrc;
        console.log('🎵 Setting audio source:', targetSrc);

        // Ensure playlist progression (No Loop, Auto Next)
        window.audioPlayer.loop = false;

        // Remove previous 'ended' listener if it exists, then add a new one
        if (window._audioEndedHandler) {
            window.audioPlayer.removeEventListener('ended', window._audioEndedHandler);
        }

        window._audioEndedHandler = function () {
            console.log('🎵 Track ended, calling nextTrack');
            if (window.nextTrack) window.nextTrack();
        };

        window.audioPlayer.addEventListener('ended', window._audioEndedHandler);

        window.audioPlayer.load();

        const targetVol = playlist[index].volume || 0.5;
        window.audioPlayer.volume = Math.max(0, Math.min(1.0, targetVol));

        // Initialise analyser (creates AudioContext if needed)
        if (typeof initAudioAnalyser === 'function') initAudioAnalyser();

        // Resume AudioContext BEFORE calling play() — a suspended context silently
        // blocks playback on Chrome/Safari without throwing a visible error.
        const doPlay = () => {
            console.log('🎵 Playing track:', playlist[index].track || playlist[index].src);
            window.audioPlayer.play().then(() => {
                console.log('✅ Audio playback started successfully');
                window.isMusicPlaying = true;
                if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0x00ff00);

                if (window.interiorClickables) {
                    const btns = window.interiorClickables.filter(c => c && c.userData && c.userData.type === 'videoControlSingle');
                    btns.forEach(b => {
                        if (b.material) {
                            b.material.color.setHex(0xff0000);
                            if (b.material.emissive) b.material.emissive.setHex(0x440000);
                        }
                    });
                }

                // Don't recreate music panel if it already exists
                if (!document.querySelector('[data-music-panel]')) {
                    if (window.createMusicPanel) window.createMusicPanel(playlist);
                }
            }).catch(e => {
                console.error("❌ Play failed:", e);
                console.error("Audio context state:", window.audioContext ? window.audioContext.state : 'no context');
                if (typeof showPersistentAudioUnlock === 'function') showPersistentAudioUnlock();
            });
        };

        if (window.audioContext && window.audioContext.state === 'suspended') {
            console.log('🔊 Resuming suspended AudioContext before play...');
            window.audioContext.resume().then(doPlay).catch(doPlay);
        } else {
            doPlay();
        }

    } catch (criticalErr) {
        console.error("❌ Critical PlayTrack Error:", criticalErr);
        console.error("Stack:", criticalErr.stack);
    }
}
window.playTrack = playTrack;

// --- GLOBAL PLAYLIST CONTROLS ---

window.nextTrack = function () {
    console.log("🎵 nextTrack called");
    if (!window.currentRoom || !window.roomContent?.[window.currentRoom]?.playlist) return;
    const pl = window.roomContent[window.currentRoom].playlist;
    if (!pl || pl.length === 0) return;

    // Use playTrack for robust loading, cross-origin, and analysis (V-FIX)
    const nextIndex = (window.currentTrackIndex + 1) % pl.length;
    console.log(`⏭️ Advancing to Track ${nextIndex + 1}/${pl.length}: ${pl[nextIndex].track}`);

    if (window.playTrack) {
        window.playTrack(nextIndex);
    } else {
        console.warn("⚠️ window.playTrack not found, falling back to manual");
        window.currentTrackIndex = nextIndex;
        audioPlayer.src = pl[window.currentTrackIndex].src;
        audioPlayer.load();
        audioPlayer.play().catch(e => console.warn("Auto-play blocked:", e));
        if (window.createMusicPanel) window.createMusicPanel(pl);
    }
};

window.nextVideo = function () {
    console.log("🎬 nextVideo called");
    if (!window.currentRoom || !window.roomContent?.[window.currentRoom]?.videoPlaylist) return;
    const vpl = window.roomContent[window.currentRoom].videoPlaylist;
    if (!vpl || vpl.length === 0) return;

    if (typeof window.masterVideoIndex === 'undefined' || window.masterVideoIndex < 0) {
        window.masterVideoIndex = 0;
    } else {
        window.masterVideoIndex = (window.masterVideoIndex + 1) % vpl.length;
    }
    console.log(`⏭️ Advancing to Video ${window.masterVideoIndex + 1}/${vpl.length}: ${vpl[window.masterVideoIndex].title}`);

    if (window.videoElement) {
        const item = vpl[window.masterVideoIndex];
        window.videoElement.src = item.src;
        window.videoElement.muted = false;
        window.videoElement.volume = 1.0;
        window.videoElement.load();
        window.videoElement.play().catch(e => console.warn("Video auto-play blocked:", e));
    }
    if (window.updateVideoUI) window.updateVideoUI();
};

// --- REFLECTION MARKERS (CLICK TO POUP QUESTIONS) ---

function addReflectionMarker(roomKey, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Check whether this room has already been answered
    const isAnswered = !!(window.visitorData && window.visitorData.answers && window.visitorData.answers[roomKey]);

    // Colour scheme:
    //   Unanswered → bright pulsing GREEN (draws attention)
    //   Answered   → faded RED (calm, "done")
    const coreHex = isAnswered ? 0xff2200 : 0x00ff00;
    const shellHex = isAnswered ? 0xff2200 : 0x00ff00;
    const glowStop0 = isAnswered ? 'rgba(255,40,0,0.8)' : 'rgba(0,255,0,0.8)';
    const glowStop04 = isAnswered ? 'rgba(255,40,0,0.3)' : 'rgba(0,255,0,0.3)';
    const lightHex = isAnswered ? 0xff2200 : 0x00ff00;
    const shellOpacity = isAnswered ? 0.35 : 0.55; // Slightly increased opacity for answered red so it's visible
    const emissiveIntens = isAnswered ? 0.5 : 3.0;
    const glowOpacity = isAnswered ? 0.35 : 0.9;
    const lightIntensity = isAnswered ? 0.3 : 2.0;
    const lightRange = isAnswered ? 3 : 7;

    // Glowing Core
    const coreMat = new THREE.MeshBasicMaterial({ color: coreHex, toneMapped: false });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.224, 0), coreMat);
    group.add(core);

    // Outer Shell
    const shellMat = new THREE.MeshStandardMaterial({
        color: shellHex,
        transparent: true,
        opacity: shellOpacity,
        emissive: shellHex,
        emissiveIntensity: emissiveIntens,
        side: THREE.DoubleSide
    });
    const shell = new THREE.Mesh(new THREE.OctahedronGeometry(0.416, 1), shellMat);
    group.add(shell);

    // Outer glow sprite
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, glowStop0);
    grad.addColorStop(0.4, glowStop04);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        opacity: glowOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    glowSprite.scale.set(2.0, 2.0, 1);
    group.add(glowSprite);

    // Point Light
    const pl = new THREE.PointLight(lightHex, lightIntensity, lightRange);
    group.add(pl);

    group.userData = {
        type: 'reflection_trigger',
        roomKey: roomKey,
        tooltip: isAnswered ? 'REFLECTED ✓' : 'REFLECT',
        onClick: () => {
            if (window.showRoomQuestion) window.showRoomQuestion(roomKey);
        },
        update: (t) => {
            core.rotation.y = t * 2.0;
            shell.rotation.y = -t * 1.0;
            group.position.y = y + Math.sin(t * 2.0) * 0.08;

            if (!isAnswered) {
                // Unanswered: dramatic pulsing red glow
                const pulse = 2.5 + Math.sin(t * 4.0) * 1.5;
                shellMat.emissiveIntensity = pulse;
                pl.intensity = 1.5 + Math.sin(t * 4.0) * 0.8;
                glowSprite.material.opacity = 0.6 + Math.sin(t * 4.0) * 0.3;
            } else {
                // Answered: slow, dim fade — barely glowing
                shellMat.emissiveIntensity = 0.3 + Math.sin(t * 1.0) * 0.15;
                pl.intensity = 0.2 + Math.sin(t * 1.0) * 0.1;
            }
        }
    };

    group.scale.set(0.75, 0.75, 0.75);
    interiorGroup.add(group);
    if (window.interiorClickables) window.interiorClickables.push(group);

    return group;
}

window.createMusicPanel = function (playlist) {
    if (!window.currentRoom || !window.roomContent?.[window.currentRoom]) {
        return;
    }
    // 0. Define and Expose Controls (Must be outside/before any early returns)


    function toggleMusic() {
        if (!window.currentRoom || !window.roomContent?.[window.currentRoom]?.playlist) return;
        const pl = window.roomContent[window.currentRoom].playlist;
        if (!pl || pl.length === 0) return;

        if (window.audioPlayer && window.isMusicPlaying) {
            window.audioPlayer.pause();
            window.isMusicPlaying = false;
            // Update UI/Meshes
            if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
            // If in attic, sync video
            if (window.currentRoom === 'attic') {
                const atticVideo = document.getElementById('attic-video');
                if (atticVideo) {
                    atticVideo.muted = false;
                    const knobGroup = interiorGroup.children.find(c => c.userData && c.userData.type === 'atticAudioToggle');
                    if (knobGroup) {
                        knobGroup.userData.state = 'on';
                        if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0x00ff00);
                    }
                }
            }
            if (window.updateMusicPanelHighlight) window.updateMusicPanelHighlight();
        } else {
            // Stop other media
            if (window.currentRoom === 'attic') {
                const atticVideo = document.getElementById('attic-video');
                if (atticVideo) atticVideo.muted = true;
            } else if (['hall', 'studio'].indexOf(window.currentRoom) === -1 && window.videoElement && !window.videoElement.paused) {
                window.videoElement.pause();
            }
            if (window.currentRoom === 'living' && window.stopLivingVideo) window.stopLivingVideo();
            if (window.currentRoom === 'bathroom' && window.stopBathroomVideo) window.stopBathroomVideo();
            if (window.updateVideoUI) { window.masterVideoIndex = -1; window.updateVideoUI(); }

            // Use playTrack for robust loading and AudioContext resumption
            if (window.playTrack) {
                window.playTrack(window.currentTrackIndex || 0);
            }
        }
    }
    window.toggleMusic = toggleMusic;

    window.updateMusicPanelHighlight = function () {
        if (window.roomContent && window.currentRoom && window.roomContent[window.currentRoom]) {
            const pl = window.roomContent[window.currentRoom].playlist;
            if (pl) window.createMusicPanel(pl);
        }
    };

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
    const rData = window.roomContent[window.currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01;

    let yBase = 3.2; // Compensate for internal offset shift
    let zOffset = 0;
    let rotY = Math.PI / 2;

    if (rData.musicInterfacePos) {
        yBase = rData.musicInterfacePos.y;
        zOffset = rData.musicInterfacePos.z;
    }

    if (currentRoom === 'annex') {
        yBase = 3.7; // 6.0 - 2.3
    } else if (currentRoom === 'space') {
        yBase = 2.7; // 5.0 - 2.3
        zOffset = 2.0;
        rotY = Math.PI / 3;
    }

    if (currentRoom === 'bedroom') {
        // Alignment request: Bedroom video UI y=4.2.
        yBase = 4.2;
        zOffset = 0;
    }

    const panelGroup = new THREE.Group();
    panelGroup.userData = { type: 'musicPanelGroup' };
    panelGroup.position.set(wallX, yBase, zOffset);
    panelGroup.rotation.y = rotY;
    interiorGroup.add(panelGroup);

    if (currentRoom === 'annex' || currentRoom === 'toilet') {
        panelGroup.scale.setScalar(0.75);
    }
    musicPanelMesh = panelGroup;

    // 3. Create Static UI Elements (Relative to panelGroup)

    // Audio Button
    const switchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: window.isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.position.set(0.02, 2.5, 0); // Aligned with Video Button (y=2.5)
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    panelGroup.add(musicSwitchMesh);
    if (window.interiorClickables) window.interiorClickables.push(musicSwitchMesh);

    // Header
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 128; // Matched to Video (128)
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = 'rgba(0,0,0,0.8)'; pctx.shadowBlur = 4; pctx.shadowOffsetX = 2; pctx.shadowOffsetY = 2;
    const audioLabel = (typeof t === 'function') ? t('audio_header') : "AUDIO";
    pctx.fillText(audioLabel, 256, 64); // Centered in 128 height
    pctx.font = '14px Arial'; pctx.shadowBlur = 0;
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.position.set(0, 1.6, 0); // Aligned with Video Header (y=1.6)
    pHeadMesh.userData = { type: 'playlistHeader' };
    panelGroup.add(pHeadMesh);

    // 4. Create Dynamic Playlist Items
    playlist.forEach((item, i) => {
        const isCurrent = (typeof currentTrackIndex !== 'undefined' && i === currentTrackIndex);
        const yPos = 1.0 - (i * 0.9); // Aligned with Video Items start (y=1.0)

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
        sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
        sctx.fillText((i + 1) + ". " + item.track, 20, 60);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.position.set(0, yPos, 0);

        sMesh.userData = { type: 'songItem', index: i };
        panelGroup.add(sMesh);
        if (window.interiorClickables) window.interiorClickables.push(sMesh);
    });


};
function createHallInterior() {
    // -- BACKGROUND VIDEO --
    const hallVid = document.getElementById('hall-video');
    if (hallVid) {
        hallVid.muted = true;
        hallVid.loop = true;
        hallVid.setAttribute('playsinline', '');
        // Attempt play, retry on user interaction if needed
        const tryPlay = () => hallVid.play().catch(() => {
            document.addEventListener('click', () => hallVid.play().catch(() => { }), { once: true });
        });
        tryPlay();

        // ── HALL VIDEO SETTINGS — tweak these three values ──────────────────
        const HALL_VID_OPACITY = 1;  // 0.0 = invisible, 1.0 = fully opaque
        const HALL_VID_BRIGHTNESS = 0.55;  // < 1.0 = darker, 1.0 = original
        const HALL_VID_CONTRAST = 1.4;   // > 1.0 = more contrast, 1.0 = original
        // ────────────────────────────────────────────────────────────────────

        const hallTex = new THREE.VideoTexture(hallVid);
        hallTex.minFilter = THREE.LinearFilter;
        hallTex.magFilter = THREE.LinearFilter;

        const bgGeo = new THREE.PlaneGeometry(10, 8);

        // ShaderMaterial gives us brightness + contrast in one pass, no extra plane needed
        const bgMat = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: hallTex },
                uBrightness: { value: HALL_VID_BRIGHTNESS },
                uContrast: { value: HALL_VID_CONTRAST },
                uOpacity: { value: HALL_VID_OPACITY }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uBrightness;
                uniform float uContrast;
                uniform float uOpacity;
                varying vec2 vUv;
                void main() {
                    vec4 col = texture2D(uTexture, vUv);
                    // brightness
                    col.rgb *= uBrightness;
                    // contrast: pivot around 0.5
                    col.rgb = (col.rgb - 0.5) * uContrast + 0.5;
                    col.rgb = clamp(col.rgb, 0.0, 1.0);
                    gl_FragColor = vec4(col.rgb, col.a * uOpacity);
                }
            `,
            transparent: true,
            side: THREE.FrontSide
        });

        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.set(0, 4.0, -4.95);
        bgMesh.userData = { type: 'hallVideo', persistent: true };
        interiorGroup.add(bgMesh);

        // Keep video alive while in hall
        window._hallVideoMonitor = setInterval(() => {
            if (window.currentRoom === 'hall' && hallVid.paused && hallVid.readyState >= 2) {
                hallVid.play().catch(() => { });
            } else if (window.currentRoom !== 'hall') {
                clearInterval(window._hallVideoMonitor);
                window._hallVideoMonitor = null;
            }
        }, 1500);
    }

    // -- LIGHTING ADJUSTMENT --
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    const cozySpot = new THREE.SpotLight(0xccf0ff, 0.6); // Reduced from 1.2
    cozySpot.position.set(2, 5, 2);
    cozySpot.target.position.set(0, 0, 0);
    cozySpot.angle = Math.PI / 3;
    cozySpot.penumbra = 0.5; // Harsher Edge per Reference
    cozySpot.castShadow = true;
    // Strengthen shadows for curtains and R2D2
    cozySpot.shadow.mapSize.width = 1024; // Reduced from 2048 for performance/smoothness
    cozySpot.shadow.mapSize.height = 1024;
    cozySpot.shadow.bias = -0.0001;
    cozySpot.shadow.camera.near = 0.5;
    cozySpot.shadow.camera.far = 20;
    interiorGroup.add(cozySpot);
    interiorGroup.add(cozySpot.target);

    // Red Room Mood Ambient (Lowered for atmosphere)
    const hallAmbient = new THREE.AmbientLight(0xffffff, 0.1); // Reduced from 0.15
    interiorGroup.add(hallAmbient);

    // Additional directional light for stronger shadows (Soft Blue/White)
    const shadowLight = new THREE.DirectionalLight(0xbbeeff, 0.3); // Reduced from 0.6
    shadowLight.position.set(3, 6, 3);
    shadowLight.target.position.set(0, 0, 0);
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;
    shadowLight.shadow.camera.near = 0.5;
    shadowLight.shadow.camera.far = 20;
    shadowLight.shadow.bias = -0.0005;
    interiorGroup.add(shadowLight);
    interiorGroup.add(shadowLight.target);

    // --- CURTAINS ---
    // Left side (To the very edge of the wall)
    createHallCurtain(-4.99, 0, 4.8, Math.PI / 2);
    // Back wall, far right
    createHallCurtain(4.8, 0, -4.4, 0);

    // Internationalized Hall Sign
    window.refreshHallSign = function () {
        const wallTextCanvas = document.createElement('canvas');
        wallTextCanvas.width = 1024; wallTextCanvas.height = 512;
        const wtctx = wallTextCanvas.getContext('2d');
        wtctx.fillStyle = 'white';
        wtctx.textAlign = 'center';
        wtctx.shadowColor = "black"; wtctx.shadowBlur = 5;

        // Use global t() for internationalization
        const welcomeTxt = (typeof t === 'function') ? t('hall_welcome') : "Welcome to";
        const houseTxt = (typeof t === 'function') ? t('hall_house_name') : "the House of Awe";
        const taglineTxt = (typeof t === 'function') ? t('hall_tagline') : "Explore // Wonder // Dream";
        const recommendTxt = (typeof t === 'function') ? t('hall_recommend') : "Big screen and sound recommended";

        wtctx.font = '80px "Glass Antiqua", cursive';
        wtctx.fillText(welcomeTxt, 512, 130);

        // V-FIX: Dynamic font scaling for long titles (e.g. Dutch "Het Huis der Verwondering")
        let houseFontSize = 110;
        wtctx.font = `${houseFontSize}px "Glass Antiqua", cursive`;
        let metrics = wtctx.measureText(houseTxt);
        const maxW = 920; // 1024 width - padding

        if (metrics.width > maxW) {
            houseFontSize = Math.floor(houseFontSize * (maxW / metrics.width));
            wtctx.font = `${houseFontSize}px "Glass Antiqua", cursive`;
        }
        wtctx.fillText(houseTxt, 512, 250);

        wtctx.font = '40px "Lato", sans-serif';
        wtctx.fillText(taglineTxt, 512, 330);

        wtctx.font = '28px "Lato", sans-serif';
        wtctx.fillText(recommendTxt, 512, 410);

        const wallTex = new THREE.CanvasTexture(wallTextCanvas);

        // Find existing plane if it exists
        let plane = interiorGroup.children.find(c => c.userData.type === 'hall_sign');
        if (plane) {
            plane.material.map = wallTex;
            plane.material.needsUpdate = true;
        } else {
            plane = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 4),
                new THREE.MeshBasicMaterial({ map: wallTex, transparent: true })
            );
            plane.position.set(0, 4.0, -4.7);
            plane.userData.type = 'hall_sign';
            interiorGroup.add(plane);
        }
    };

    window.refreshHallSign();

    // -- SHADOW UNDER BB-8 --
    const bb8 = createBB8ForHall();
    if (typeof addReflectionMarker === 'function') {
        const marker = addReflectionMarker('hall', 3, 1.5, -2.5);
        if (marker && bb8) {
            const origUpdate = marker.userData.update;
            marker.userData.update = (t) => {
                if (origUpdate) origUpdate(t); // Updates rotations and sets base Y + bobbing

                // Follow the robot's floor position
                marker.position.x = bb8.position.x;
                marker.position.z = bb8.position.z;

                // Hover above the robot's head (which is in hoverGroup)
                if (bb8.hoverGroup) {
                    // head top is around +3.2 local to hoverGroup
                    // marker.position.y was just set by origUpdate to: 1.5 + local_nugget_bobbing
                    const currentBob = marker.position.y - 1.5;
                    marker.position.y = bb8.hoverGroup.position.y + 1.2 + currentBob;
                }
            };
        }
    }
}

function createHallCurtain(x, y, z, rotationY) {
    const curtainGroup = new THREE.Group();
    curtainGroup.position.set(x, y, z);
    curtainGroup.rotation.y = rotationY;

    const width = 1.2;
    const height = 8;
    const curtainGeo = new THREE.PlaneGeometry(width, height, 40, 40);
    const pos = curtainGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        let ux = pos.getX(i);
        const u = (ux + width / 2) / width;

        // VOLUMINOUS ROUND FOLDS (High density: 18 folds)
        const waveAmp = 0.35;
        const wave = Math.sin(u * Math.PI * 18) * waveAmp;

        pos.setZ(i, wave);
    }
    curtainGeo.computeVertexNormals();

    const curtainMat = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
    });

    const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
    curtainMesh.position.y = 4.0;
    curtainMesh.castShadow = true;
    curtainMesh.receiveShadow = true;
    curtainGroup.add(curtainMesh);

    // V-REFINE: Solid Backing Plane
    const backGeo = new THREE.PlaneGeometry(width, height);
    const backMesh = new THREE.Mesh(backGeo, curtainMat);
    backMesh.position.set(0, 4.0, -0.4);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    curtainGroup.add(backMesh);

    interiorGroup.add(curtainGroup);
}

function createHologram() {
    // HOLOGRAM: Control Instructions
    const group = new THREE.Group();
    group.position.set(0, 1.5, 2.0);


    // Moving along with the 3D environment (Rotation)
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Glow
    const g = ctx.createRadialGradient(256, 256, 120, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    // Text "In the Circle"
    ctx.fillStyle = '#ccffff';
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 4; // Reduced from 10
    ctx.font = 'bold 50px "Courier New", monospace'; ctx.textAlign = "center";
    ctx.fillText("FREE WILL", 256, 230);

    ctx.font = '30px "Courier New", monospace';
    ctx.fillText("DOES NOT EXIST", 256, 280);
    ctx.fillText("PROVE ME WRONG", 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.6, // Reduced from 0.9
        blending: THREE.NormalBlending, // Switched from Additive to Normal to prevent blowout
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), mat);
    mesh.position.y = 0.5;
    group.add(mesh);

    return group;
}

function createBB8ForHall() {
    const bb8Group = new THREE.Group();
    bb8Group.scale.set(0.4, 0.4, 0.4);
    bb8Group.position.set(3, 0, -2.5); // Moved from (0,0,1) to the side to prevent blocking the sign
    interiorGroup.add(bb8Group);

    bb8Group.userData = {
        type: 'narrative_robot',
        onClick: () => {
            if (!window.visitorData || !window.visitorData.name) {
                const overlay = document.getElementById('narrative-overlay');
                if (overlay) {
                    overlay.style.display = 'flex';
                    overlay.style.opacity = '1';
                }
            }
        }
    };
    if (window.interiorClickables) window.interiorClickables.push(bb8Group);

    // 1. Audio Setup
    let audioCtx = null;
    const playBleep = () => {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            const freq = 1200 + Math.random() * 800;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // Lowered for room ambience
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) { }
    };

    // 2. Ground Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grd = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.8)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grd;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 6.0), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.8, depthWrite: false }));
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.05;
    bb8Group.add(shadowMesh);

    // 3. Hover Group (Contains all robot parts except shadow)
    const hoverGroup = new THREE.Group();
    bb8Group.add(hoverGroup);

    // Body (The Rolling Part)
    const bodyGeometry = new THREE.SphereGeometry(2.18, 32, 32);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const robotBody = new THREE.Mesh(bodyGeometry, whiteMat);
    robotBody.castShadow = true;
    hoverGroup.add(robotBody);

    // Latitude Rings
    const latCount = 5;
    for (let i = -latCount; i <= latCount; i++) {
        const yOffset = (i / (latCount + 1)) * 2.18;
        const radiusAtY = Math.sqrt(Math.pow(2.18, 2) - Math.pow(yOffset, 2));
        if (radiusAtY > 0.1) {
            const ringGeo = new THREE.TorusGeometry(radiusAtY, 0.02, 8, 64);
            const ring = new THREE.Mesh(ringGeo, blueMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = yOffset;
            robotBody.add(ring);
        }
    }

    // 4. Stabilized Groups (Suit and Head)
    const stabilizedGroup = new THREE.Group();
    hoverGroup.add(stabilizedGroup);

    // Jacket (Dinnersuit)
    const matteBlackMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 1.0, metalness: 0.0 });
    const gapWidth = 0.65;
    const jacketGeo = new THREE.SphereGeometry(2.25, 32, 32, Math.PI / 2 + gapWidth / 2, Math.PI * 2 - gapWidth, 0, Math.PI);
    const jacketMesh = new THREE.Mesh(jacketGeo, matteBlackMat);
    stabilizedGroup.add(jacketMesh);

    // Buttons
    for (let i = 0; i < 3; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32);
        const btn = new THREE.Mesh(btnGeo, matteBlackMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(0, 0.5 - (i * 0.6), 2.22);
        stabilizedGroup.add(btn);
    }

    // 5. Head
    const headGeo = new THREE.SphereGeometry(1.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const robotHead = new THREE.Mesh(headGeo, redMat);
    robotHead.position.y = 1.9;
    robotHead.castShadow = true;
    stabilizedGroup.add(robotHead);

    const band = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.08, 16, 32), matteBlackMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.4;
    robotHead.add(band);

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, metalness: 0.9 }));
    eye.position.set(0, 0.6, 0.9);
    robotHead.add(eye);

    const eyePoint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    eyePoint.position.set(0, 0.6, 1.22);
    robotHead.add(eyePoint);

    const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    led1.position.set(-0.4, 0.5, 1.0);
    robotHead.add(led1);

    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    led2.position.set(0.4, 0.8, 0.7);
    robotHead.add(led2);

    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), matteBlackMat);
    ant.position.set(0.2, 1.5, -0.2);
    robotHead.add(ant);

    // 6. Hologram (REMOVED)
    // const instructions = createHologram();
    // instructions.name = 'Hologram';
    // instructions.scale.set(2.5, 2.5, 2.5);
    // instructions.position.set(0, 6.0, 1.5); 
    // stabilizedGroup.add(instructions);

    // 7. Hitbox
    const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 7.0, 16),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 2.0;
    hitBox.userData = { type: 'bb8', name: 'BB8' };
    hoverGroup.add(hitBox);
    interiorClickables.push(hitBox);

    // 8. Animation State
    let targetPos = new THREE.Vector3(0, 0, 0);
    let currentPos = new THREE.Vector3(0, 0, 1.0);
    let velocity = new THREE.Vector3(0, 0, 0);
    const arenaSize = 4.0;
    let isTwitching = false;
    let twitchTimer = 0;
    let nextTwitchTime = Math.random() * 3000 + 2000;
    let headBaseRotationY = 0;

    const pickTarget = () => {
        targetPos.x = (Math.random() - 0.5) * arenaSize;
        targetPos.z = (Math.random() - 0.5) * arenaSize;
    };
    pickTarget();

    bb8Group.userData.update = (t) => {
        const delta = 16.6; // Assuming ~60fps for internal timers
        const dist = currentPos.distanceTo(targetPos);
        if (dist < 0.2) pickTarget();

        const dir = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        velocity.lerp(dir.multiplyScalar(0.004), 0.03); // speed reduced from 0.01 to 0.004
        currentPos.add(velocity);
        bb8Group.position.copy(currentPos);

        // Hover/Float Logic
        const floatHeight = 2.18 + 0.5; // Radius + air gap
        const hoverY = floatHeight + Math.sin(t * 2.0) * 0.3; // Sinusoidal bobbing
        hoverGroup.position.y = hoverY;

        // Shadow Scale/Opacity pulse with hover
        const shadowScale = 1.0 - (Math.sin(t * 2.0) * 0.1);
        shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        shadowMesh.material.opacity = 0.9 - (Math.sin(t * 2.0) * 0.2);

        if (velocity.length() > 0.001) {
            const axis = new THREE.Vector3(-velocity.z, 0, velocity.x).normalize();
            const angle = velocity.length() / 2.18;
            const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            robotBody.quaternion.premultiply(q);

            // V-REFINE: "Faced towards us" bias (0 is roughly towards camera in Hall)
            const moveRot = Math.atan2(velocity.x, velocity.z);
            headBaseRotationY = THREE.MathUtils.lerp(0, moveRot, 0.2); // 80% bias towards user
            stabilizedGroup.rotation.y = headBaseRotationY;
        }

        // Twitching & LEDs
        twitchTimer += delta;
        if (!isTwitching && twitchTimer > nextTwitchTime) {
            isTwitching = true;
            twitchTimer = 0;
        }
        if (isTwitching) {
            const tp = twitchTimer / 500;
            if (tp < 1) {
                robotHead.rotation.y = headBaseRotationY + Math.sin(tp * Math.PI * 6) * 1.0;
                if (Math.random() > 0.95) playBleep();
            } else {
                isTwitching = false;
                twitchTimer = 0;
                nextTwitchTime = Math.random() * 4000 + 2000;
            }
        } else {
            robotHead.rotation.y = THREE.MathUtils.lerp(robotHead.rotation.y, headBaseRotationY, 0.1);
        }

        led1.material.opacity = Math.sin(t * 15) > 0 ? 1 : 0.3;
        led1.material.transparent = true;
        led2.material.opacity = Math.cos(t * 12) > 0 ? 1 : 0.3;
        led2.material.transparent = true;
        eyePoint.material.opacity = (Math.floor(t * 6) % 2 === 0) ? 1 : 0;
        eyePoint.material.transparent = true;
        robotHead.position.y = 1.9 + Math.sin(t * 5) * 0.02;
    };
    bb8Group.hoverGroup = hoverGroup; // Expose for attachment logic
    return bb8Group;
}

function createBathroomInterior() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY (Center)
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); vanity.castShadow = true; vanity.receiveShadow = true; interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); basin.castShadow = true; basin.receiveShadow = true; interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; faucet.castShadow = true; interiorGroup.add(faucet);


    // MIRROR FRAME
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 })); // 0x222222 -> 0x111111
    mirrorFrame.position.set(0, 3.8, -4.9);
    mirrorFrame.castShadow = true;
    interiorGroup.add(mirrorFrame);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256; shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    // Smoother Gradient Shadow
    const grad = sCtx.createRadialGradient(128, 128, 40, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0,0,0,0.9)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    // Scale plane to allow blur bleed area (Tightened to "a few cm" - 2.5cm per side)
    const shadowGeo = new THREE.PlaneGeometry(2.0, 3.25);
    const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.8,
        depthWrite: false // Prevent Z-fighting artifacts
    });

    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.z = -0.04; // Much closer for smoother bleed
    mirrorFrame.add(shadowPlane);

    // Button removed (Replaced by Universal Video UI)

    // 1. Remove default bright bulb
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // 2. Add Darker Ambience
    const darkAmb = new THREE.PointLight(0x223344, 0.15, 15);
    darkAmb.position.set(0, 6, 0);
    interiorGroup.add(darkAmb);

    // --- TL LIGHT ABOVE MIRROR (V-NEW) ---
    const tlGroup = new THREE.Group();
    tlGroup.position.set(0, 5.6, -4.85); // Above mirror frame
    interiorGroup.add(tlGroup);

    const tlBulbGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 12);
    const tlBulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const tlBulb = new THREE.Mesh(tlBulbGeo, tlBulbMat);
    tlBulb.rotation.z = Math.PI / 2;
    tlGroup.add(tlBulb);

    const tlFixture = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.15), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    tlFixture.position.z = -0.05;
    tlGroup.add(tlFixture);

    const tlLight = new THREE.PointLight(0xffffff, 1.2, 12); // Bright TL
    tlLight.position.set(0, -0.1, 0.1);
    tlLight.castShadow = true;
    tlLight.shadow.radius = 0; // Sharp shadows
    tlLight.shadow.mapSize.width = 1024;
    tlLight.shadow.mapSize.height = 1024;
    tlLight.shadow.bias = -0.0005; // Prevent shadow acne on nearby walls/shelves
    tlGroup.add(tlLight);
    window.bathroomTLLight = tlLight;
    window.bathroomTLBulbMat = tlBulbMat;
    const baseTLIntensity = 1.2;
    let tlTargetIntensity = baseTLIntensity;
    let tlTargetColor = new THREE.Color(0xffffff);

    // --- SHADER (SUPER PARALLAX) ---
    const mirrorVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const mirrorFragmentShader = `
        uniform float uViewRotation; 
        uniform float uViewPitch; // V-NEW: Vertical Tilt
        uniform float uTime;
        uniform sampler2D uMap;
        uniform float uScale;
        uniform float uUseVideo;
        varying vec2 vUv;
        
        void main() {
            float sensitiveAngle = uViewRotation * 4.0; 
            float horizon = 0.5 - (uViewPitch * 1.5); // Much stronger response
            float perspective = 1.0 / max(0.01, (horizon - vUv.y)); 
            
            // Checkerboard Reflection (Observer-position based only)
            float x = (vUv.x - 0.5) * perspective * uScale + (sensitiveAngle * 3.0);
            float y = perspective * uScale; 
            
            // Checkerboard pattern
            float check = mod(floor(x) + floor(y), 2.0);
            // Darker Tiles for Mirror (0.05/0.15)
            vec3 tileColor = (check < 0.5) ? vec3(0.05) : vec3(0.15);
            
            // Glare effect (Static relative to observer)
            float glarePos = 0.5 + (uViewRotation * 0.3);
            float streak = smoothstep(0.2, 0.0, abs(vUv.x - glarePos));
            float gloss = (1.0 - vUv.y) * 0.05 + (streak * 0.1); // Matte feel

            // Sharp horizon transition
            float voidFactor = step(horizon, vUv.y);
            
            vec3 finalColor;

            if (uUseVideo > 0.5) {
                // Video mode
                vec4 vid = texture2D(uMap, vUv);
                finalColor = (vid.rgb * 0.8) + vec3(gloss * 0.2); 
                // Do NOT darken video globally (Keep it reasonably bright)
            } else {
                // Reflection mode
                vec3 finalReflect = tileColor + vec3(gloss);
                // Mix to tinted void (Very Dark)
                finalColor = mix(finalReflect, vec3(0.005, 0.01, 0.015), voidFactor);
                finalColor *= 0.7; // Global dimmer for reflection
            }
            
            // Note: Removed global finalColor *= 0.7 outside if/else so video stays bright

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const mirrorMat = new THREE.ShaderMaterial({
        vertexShader: mirrorVertexShader,
        fragmentShader: mirrorFragmentShader,
        uniforms: {
            uViewRotation: { value: 0 },
            uViewPitch: { value: 0 },
            uTime: { value: 0 },
            uMap: { value: null },
            uScale: { value: 1.5 },
            uUseVideo: { value: 0.0 }
        }
    });

    window.bathroomVideoMaterial = mirrorMat; // Expose globally for guide compliance

    // Register for animation updates
    // METHOD A: Global List
    if (typeof animatedShaderMaterials !== 'undefined') {
        if (!animatedShaderMaterials.includes(mirrorMat)) animatedShaderMaterials.push(mirrorMat);
    }

    // METHOD B: Direct Update (Robust)
    mirrorFrame.userData.update = function (t) {
        // 1. Update Time
        mirrorMat.uniforms.uTime.value = t;

        // 2. Update Rotation & Pitch (Parallax)
        const cam = window.camera || camera;
        if (cam) {
            // YAW
            const angle = Math.atan2(cam.position.x, cam.position.z);
            mirrorMat.uniforms.uViewRotation.value = angle;

            // PITCH
            // Get look direction
            const dir = new THREE.Vector3();
            cam.getWorldDirection(dir);
            // dir.y is vertical component (-1 down, +1 up)
            mirrorMat.uniforms.uViewPitch.value = dir.y;

            // 3. TL Flicker
            if (window.bathroomTLLight && window.bathroomTLLight.intensity > 0.001) {
                // Slight Flicker logic
                if (Math.random() > 0.95) {
                    const f = 0.8 + Math.random() * 0.4;
                    window.bathroomTLLight.intensity = tlTargetIntensity * f;
                    if (window.bathroomTLBulbMat) {
                        window.bathroomTLBulbMat.color.copy(tlTargetColor).multiplyScalar(f);
                    }
                } else {
                    window.bathroomTLLight.intensity = THREE.MathUtils.lerp(window.bathroomTLLight.intensity, tlTargetIntensity, 0.1);
                    if (window.bathroomTLBulbMat) {
                        window.bathroomTLBulbMat.color.lerp(tlTargetColor, 0.1);
                    }
                }
                // Ensure light color is also synced
                window.bathroomTLLight.color.copy(tlTargetColor);
            }
        }

        // 3. Update Video Texture if playing
        if (window.videoElement && mirrorMat.uniforms.uMap.value) {
            if (!window.videoElement.paused) {
                // Ensure the texture updates every frame while playing
                mirrorMat.uniforms.uMap.value.needsUpdate = true;

                // Auto-Enter Screen Mode when playing (Fixes Universal Interface selection)
                if (mirrorMat.uniforms.uUseVideo.value < 1.0) mirrorMat.uniforms.uUseVideo.value = 1.0;
            }
        }
    };

    // MIRROR GLASS (Using mirrorMat)
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.70, 2.95), mirrorMat);
    mirrorGlass.position.z = 0.06; mirrorFrame.add(mirrorGlass);
    mirrorGlass.name = 'mirrorSurface';
    // V44: Make Mirror Surface Clickable Too
    mirrorGlass.userData = { type: 'bathroomMirrorButton' }; // Act like the button
    // Direct toggle (videoBtn removed)
    mirrorGlass.toggleMirror = function () {
        if (window.toggleBathroomMirror) window.toggleBathroomMirror();
    };
    interiorClickables.push(mirrorGlass);


    const tubGroup = new THREE.Group();

    const tubLength = 6.0; const tubWidth = 2.2; const radius = 0.5;
    const shape = new THREE.Shape();
    shape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius, 0, Math.PI / 2, false);
    shape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius, Math.PI / 2, Math.PI, false);
    shape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius, Math.PI, Math.PI * 1.5, false);
    shape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius, Math.PI * 1.5, Math.PI * 2, false);

    // Inner Hole
    const wallThick = 0.15;
    const hole = new THREE.Path();
    hole.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius - wallThick, 0, Math.PI / 2, false);
    hole.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius - wallThick, Math.PI / 2, Math.PI, false);
    hole.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius - wallThick, Math.PI, Math.PI * 1.5, false);
    hole.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius - wallThick, Math.PI * 1.5, Math.PI * 2, false);
    shape.holes.push(hole);

    const tubGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 1.4, bevelEnabled: false, curveSegments: 16
    });
    const tubMesh = new THREE.Mesh(tubGeo, whiteMat);
    tubMesh.rotation.x = -Math.PI / 2; // Lie flat so Z becomes Y (Height)
    tubMesh.castShadow = true;
    tubMesh.receiveShadow = true;

    // Floor (Inner Puck)
    const floorShape = new THREE.Shape();
    const innerR = radius - wallThick;
    floorShape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, innerR, 0, Math.PI / 2, false);
    floorShape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, innerR, Math.PI / 2, Math.PI, false);
    floorShape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), innerR, Math.PI, Math.PI * 1.5, false);
    floorShape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), innerR, Math.PI * 1.5, Math.PI * 2, false);

    const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
        depth: 0.5, // 0.5 thickness
        bevelEnabled: false
    });

    const tubFloorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1 });
    const tubFloor = new THREE.Mesh(floorGeo, tubFloorMat);
    tubFloor.rotation.x = -Math.PI / 2; // Z becomes Y (Height)
    tubFloor.position.y = 0.0; // Base at 0. Top will be at 0.5.
    tubFloor.castShadow = true;
    tubFloor.receiveShadow = true;

    tubGroup.add(tubMesh);
    tubGroup.add(tubFloor);

    // Water - Oval Plane
    const waterGeo = new THREE.ShapeGeometry(floorShape);
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        emissive: 0x004488,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.scale.set(0.98, 0.98, 1);
    water.position.y = 0.6; // Lowered slightly to look engaged
    tubGroup.add(water);

    tubGroup.position.set(3.5, 0, -2.0); // Y=0 because extrude starts at 0
    tubGroup.rotation.y = -Math.PI / 2;
    interiorGroup.add(tubGroup);


    // FLOOR - Checkered (High Contrast, Large)
    const checkCanvas = document.createElement('canvas');
    checkCanvas.width = 512; checkCanvas.height = 512;
    const cctx = checkCanvas.getContext('2d');
    cctx.fillStyle = '#888888'; cctx.fillRect(0, 0, 512, 512);
    cctx.fillStyle = '#111111';
    const checkSize = 128; // Large Squares
    for (let y = 0; y < 512; y += checkSize) {
        for (let x = 0; x < 512; x += checkSize) {
            if (((x / checkSize) + (y / checkSize)) % 2 !== 0) {
                cctx.fillRect(x, y, checkSize, checkSize);
            }
        }
    }
    const checkTex = new THREE.CanvasTexture(checkCanvas);
    checkTex.wrapS = THREE.RepeatWrapping;
    checkTex.wrapT = THREE.RepeatWrapping;
    checkTex.repeat.set(4, 4);
    checkTex.magFilter = THREE.NearestFilter;
    checkTex.minFilter = THREE.NearestFilter;
    checkTex.anisotropy = 16;

    const floorMat = new THREE.MeshStandardMaterial({
        map: checkTex,
        roughness: 0.8, // Less intense reflection (was 0.2)
        metalness: 0.05 // Reduced metalness (was 0.1)
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01;
    floor.receiveShadow = true; // Enable Shadows on Floor
    interiorGroup.add(floor);


    const matMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), matMat);
    bathMat.rotation.x = -Math.PI / 2;
    bathMat.position.set(0, 0.02, -2.0); // Slightly above floor
    interiorGroup.add(bathMat);
    // --- TRIANGULAR MEDICINE CABINET (V-CONSTRUCTION) ---
    const cabGroup = new THREE.Group();
    const cornerX = -4.9;
    const cornerZ = -4.9;
    cabGroup.position.set(cornerX, 3.2, cornerZ);

    const shelfMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        side: THREE.DoubleSide
    });

    const frameMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1
    });

    // Triangular Shelf Mesh Generator
    const createTriShelf = (yPos) => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1.4, 0); // Side 1
        shape.lineTo(0, 1.4); // Side 2
        shape.closePath();

        // Use ExtrudeGeometry for solid volume (0.05 height)
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
        const mesh = new THREE.Mesh(geo, shelfMat);
        mesh.rotation.x = -Math.PI / 2; // Flat on floor
        mesh.position.y = yPos + 0.025; // Center the depth
        mesh.castShadow = true; // Cast on walls, but don't receive on self (prevents mess)
        mesh.receiveShadow = false;

        // Edge frame (Three sides)
        const frameW = 0.03;
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, frameW, frameW), frameMat);
        e1.position.set(0.7, yPos, frameW / 2); cabGroup.add(e1);

        const e2 = new THREE.Mesh(new THREE.BoxGeometry(frameW, frameW, 1.4), frameMat);
        e2.position.set(frameW / 2, yPos, 0.7); cabGroup.add(e2);

        const diagLen = 1.4 * Math.sqrt(2);
        const e3 = new THREE.Mesh(new THREE.BoxGeometry(diagLen, frameW, frameW), frameMat);
        e3.rotation.y = Math.PI / 4;
        e3.position.set(0.7, yPos, 0.7); cabGroup.add(e3);

        return mesh;
    };

    // Vertical Frame Poles (Sleeker)
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 4.0, 8);
    const p1 = new THREE.Mesh(poleGeo, frameMat); p1.position.set(0.03, 0, 0.03); cabGroup.add(p1);
    const p2 = new THREE.Mesh(poleGeo, frameMat); p2.position.set(1.4, 0, 0.03); cabGroup.add(p2);
    const p3 = new THREE.Mesh(poleGeo, frameMat); p3.position.set(0.03, 0, 1.4); cabGroup.add(p3);

    const shelvesCount = 4;
    for (let i = 0; i < shelvesCount; i++) {
        const y = -1.8 + (i * 1.2);
        cabGroup.add(createTriShelf(y));

        const colors = [0xff5555, 0x55ff55, 0x5555ff, 0xffff66, 0xffffff, 0xffaa00, 0x00ffff];
        for (let j = 0; j < 6; j++) {
            const h = 0.15 + Math.random() * 0.2;
            const r = 0.06 + Math.random() * 0.04;
            const bottle = new THREE.Mesh(
                new THREE.CylinderGeometry(r, r, h, 8),
                new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
            );
            const bx = 0.2 + Math.random() * 0.8;
            const bz = 0.2 + Math.random() * (1.0 - bx);
            bottle.position.set(bx, y + h / 2 + 0.05, bz);
            bottle.castShadow = true;
            bottle.receiveShadow = false; // Prevent strange artifacts on bottles
            cabGroup.add(bottle);
        }
    }

    const cabCase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.0, 1.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    cabCase.position.set(0.7, 0, 0.7);
    cabGroup.add(cabCase);

    cabCase.userData = {
        type: 'medicineCabinet',
        // Interaction removed per user request
    };
    // interiorClickables.push(cabCase); // Removed from clickables

    const basePos = new THREE.Vector3(cornerX, 3.2, cornerZ);
    // cabGroup.userData.update removed (no tremor)
    // createMedicineHologram removed
    interiorGroup.add(cabGroup);


    // --- VIDEO LOGIC ---
    // START: Do NOT auto-play video. Start in Reflection Mode.
    // V-FIX 2: Ensure UI refers to the correct element (Fixes takeover from Living Room)
    window.videoElement = videoElement || document.getElementById('generic-video');

    if (window.videoElement) {
        // crossOrigin MUST be set before .src to take effect
        window.videoElement.crossOrigin = "anonymous";
        // V41: Correct Video from data.js
        window.videoElement.src = "assets/video/Time-Is-Now.mp4";
        window.videoElement.muted = true;
        window.videoElement.loop = false;
        window.videoElement.load(); // ensure browser picks up the new src

        // Immediate Texture Assignment
        // Do not wait for .play() or .then() - standard browsers need the texture set BEFORE playing to show first frame correctly
        if (!mirrorMat.uniforms.uMap.value) {
            mirrorMat.uniforms.uMap.value = new THREE.VideoTexture(window.videoElement);
        }
    }


    window.toggleBathroomMirror = function () {

        // Toggle Audio on Click
        if (window.videoElement) {
            window.videoElement.muted = !window.videoElement.muted;
        }

        const btn = interiorClickables.find(c => c && c.userData && c.userData.type === 'videoControlSingle');

        if (mirrorMat) {
            const currentMode = mirrorMat.uniforms.uUseVideo.value;

            // STATE MACHINE
            if (currentMode < 0.5) {
                // REFLECTION -> PLAY
                mirrorMat.uniforms.uUseVideo.value = 1.0;
                if (window.videoElement) {
                    window.videoElement.play();

                    // V-NEW: Universal Lighting Rule - Dim when video starts
                    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.2 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                    // ROBUST AUDIO STOP
                    if (window.stopVideosForAudio) {
                        if (window.audioPlayer) {
                            window.audioPlayer.pause();
                            window.isMusicPlaying = false;
                        }
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                    } else if (window.audioPlayer && typeof window.audioPlayer.pause === 'function') {
                        // Legacy fallback
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                    }
                }
                if (btn && btn.material.color) btn.material.color.setHex(0x00ff00); // Green

                // FADE TL LIGHT
                if (window.bathroomTLLight) {
                    new TWEEN.Tween(window.bathroomTLLight).to({ intensity: 0 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                }
            } else {
                // PLAY -> PAUSE
                if (window.videoElement && !window.videoElement.paused) {
                    window.videoElement.pause();
                    if (btn && btn.material.color) btn.material.color.setHex(0xffff00); // Yellow
                } else {
                    // PAUSE -> REFLECTION
                    mirrorMat.uniforms.uUseVideo.value = 0.0;
                    if (btn && btn.material.color) btn.material.color.setHex(0xff0000); // Red

                    // RESTORE TL LIGHT
                    if (window.bathroomTLLight) {
                        new TWEEN.Tween(window.bathroomTLLight).to({ intensity: baseTLIntensity }, 800).easing(TWEEN.Easing.Quadratic.Out).start();
                    }
                }
            }
        }
    };

    window.stopBathroomVideo = function () {
        if (mirrorMat) {
            mirrorMat.uniforms.uUseVideo.value = 0.0;
            // Reset Button Color
            const btn = interiorClickables.find(c => c && c.userData && c.userData.type === 'videoControlSingle');
            if (btn && btn.material.color) btn.material.color.setHex(0xff0000); // Red
        }
        if (videoElement) {
            videoElement.pause();
            videoElement.src = '';
            videoElement.load();
            videoElement.loop = false; // V-FIX: Reset loop!
        }

        // 1. Kill any active dimming tweens so they don't overwrite our reset
        TWEEN.getAll().forEach(t => t.stop());

        // 2. Reset Lights to Goldilocks Profile (0.35/0.45)
        if (dirLight) dirLight.intensity = 0.45;
        if (rimLight) rimLight.intensity = 0.3;
        if (ambientLight) ambientLight.intensity = 0.35;

        // 3. Restore TL Light
        tlTargetIntensity = baseTLIntensity;
        tlTargetColor.setHex(0xffffff);
        if (window.bathroomTLLight) {
            window.bathroomTLLight.intensity = baseTLIntensity;
            window.bathroomTLLight.color.setHex(0xffffff);
        }
    };

    // VIDEO PLAYLIST (Left of Mirror)
    if (window.createUniversalVideoInterface && window.roomContent.bathroom.videoPlaylist) {
        const posData = window.roomContent['bathroom'].videoInterfacePos || { x: -2.8, y: 2.8, z: -4.9 };
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), window.roomContent.bathroom.videoPlaylist, {
            scale: 0.75,
            onPlay: (index) => {
                // 6: Soft Darkening (Tween) - Restored
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.2 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                // DIM TL LIGHT
                tlTargetIntensity = 0.3; // Dimmed
                tlTargetColor.setHex(0xa8c8cf);
                if (window.bathroomTLLight) {
                    // Start intensity transition, color will be picked up by update()
                    new TWEEN.Tween(window.bathroomTLLight).to({ intensity: 0.3 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                }

                window.masterVideoIndex = index || 0;
                const clip = window.roomContent.bathroom.videoPlaylist[window.masterVideoIndex];

                // 1. Set Src & Play
                if (window.videoElement && clip && clip.src) {
                    window.videoElement.src = clip.src;
                    window.videoElement.muted = false;
                    window.videoElement.volume = 1.0;
                    window.videoElement.play().catch(e => console.error("Bathroom play error", e));

                    // 2. Mirror Mode -> Video
                    if (mirrorMat) mirrorMat.uniforms.uUseVideo.value = 1.0;

                    // 3. Stop Music
                    if (window.audioPlayer) {
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000); // Music Button Red
                    }

                    // 4. Update UI
                    if (window.updateVideoUI) window.updateVideoUI();

                    // 5. Update Local Button (Green)
                    const btn = interiorClickables.find(c => c && c.userData && c.userData.type === 'videoControlSingle');
                    if (btn) {
                        btn.material.color.setHex(0x00ff00);
                        btn.material.emissive.setHex(0x004400);
                    }
                }
            }
        });
    }
    if (typeof addReflectionMarker === 'function') addReflectionMarker('bathroom', 4, 1.5, 0);
}
function createAtticInterior() {

    let wisdomBoxRef = null;
    let beautyBoxRef = null;
    let knowledgeBoxRef = null;

    // Modified helper to return the box
    const createColoredBox = (labelText, labelColor, boxColor, x, z) => {
        // Box Base
        const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            roughness: 0.6,
            metalness: 0.1
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(x, 0.75, z);
        box.castShadow = true;
        box.receiveShadow = true;

        // 18: DARK INTERIOR (Simulation)
        // A black plane just above the solid box top to look like a void
        const voidGeo = new THREE.PlaneGeometry(1.4, 1.4);
        const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const voidPlane = new THREE.Mesh(voidGeo, voidMat);
        voidPlane.rotation.x = -Math.PI / 2;
        voidPlane.position.y = 0.76; // Slightly above box top (0.75)
        box.add(voidPlane);

        // 18: HINGED LID
        // Pivot Group at the back-top edge
        // Box Top Y = 0.75 (relative to 0 center? No, geometry is 1.5 height, so top is 0.75)
        // Box Back Z = -0.75
        const lidPivot = new THREE.Group();
        lidPivot.position.set(0, 0.75, -0.75); // Pivot at back edge

        const lidGeo = new THREE.BoxGeometry(1.6, 0.1, 1.6);
        const lid = new THREE.Mesh(lidGeo, boxMat);
        // Lid center needs to be offset so its back edge sits at the pivot
        // Lid Back Z must be at 0 relative to pivot. Lid depth is 1.6, so center is at +0.8
        // Lid Bottom Y should be at 0 relative to pivot. Height 0.1, center at +0.05
        lid.position.set(0, 0.05, 0.8);
        lid.castShadow = true;
        lid.receiveShadow = true;
        lid.name = "lid";

        lidPivot.add(lid);
        box.add(lidPivot);

        // Label (Text on Front)
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = labelColor;
        ctx.font = 'bold 60px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 256, 128);

        const tex = new THREE.CanvasTexture(canvas);
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.65), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        // 16: Move Label Forward (0.82)
        labelMesh.position.set(0, 0, 0.82);
        box.add(labelMesh);

        interiorGroup.add(box);

        // --- ARTIFACTS INSIDE ---
        const artBaseY = 0.35; // rests just inside the open box
        const artTopY = 2.6;  // hover height above box

        const artifactContainer = new THREE.Group();
        artifactContainer.position.set(x, artBaseY, z);
        artifactContainer.scale.set(1, 1, 1); // always full size — just hidden
        artifactContainer.visible = false;
        interiorGroup.add(artifactContainer);

        let artifact = new THREE.Group();
        artifactContainer.add(artifact);

        if (labelText === "BEAUTY") {
            const orb = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xcc0000, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.9 })
            );
            artifact.add(orb);
            const artLight = new THREE.PointLight(0xff0000, 1.5, 5);
            artifact.add(artLight);

            artifactContainer.userData.update = (t) => {
                artifact.rotation.y = Math.sin(t * 1.5) * 0.5;
                artifact.rotation.x = Math.cos(t * 1.0) * 0.3;
                orb.material.emissiveIntensity = 0.6 + Math.sin(t * 4) * 0.4;
                artLight.intensity = 1.5 + Math.sin(t * 3.5) * 1.0;
                if (box.userData.isFullyOpen) {
                    artifactContainer.position.y = artTopY + Math.sin(t * 1.8) * 0.25;
                }
            };
        }
        else if (labelText === "KNOWLEDGE") {
            const wireGeo = new THREE.IcosahedronGeometry(0.5, 1);
            const wireMat = new THREE.MeshBasicMaterial({ color: 0xffcc00, wireframe: true, transparent: true, opacity: 0.6 });
            const frame = new THREE.Mesh(wireGeo, wireMat);
            artifact.add(frame);
            const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff9900 }));
            artifact.add(core);
            const artLight = new THREE.PointLight(0xffff00, 2.0, 5);
            artifact.add(artLight);

            artifactContainer.userData.update = (t) => {
                frame.rotation.y = t * 3.0;
                frame.rotation.x = t * 2.2;
                artifact.rotation.y = Math.sin(t * 1.8) * 0.5;
                wireMat.opacity = 0.5 + Math.sin(t * 5) * 0.35;
                artLight.intensity = 2.0 + Math.sin(t * 4.5) * 1.5;
                if (box.userData.isFullyOpen) {
                    artifactContainer.position.y = artTopY + Math.sin(t * 2.2) * 0.3 + Math.cos(t * 3.5) * 0.1;
                }
            };
        }
        else if (labelText === "WISDOM") {
            // ── The REAL reflection nugget lives here ──
            const roomKey = 'attic';
            const isAnswered = !!(window.visitorData && window.visitorData.answers && window.visitorData.answers[roomKey]);
            const coreHex = isAnswered ? 0xff2200 : 0x00ff00;
            const shellHex = isAnswered ? 0xff2200 : 0x00ff00;

            const nuggetCore = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.224, 0),
                new THREE.MeshBasicMaterial({ color: coreHex, toneMapped: false })
            );
            const nuggetShell = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.416, 1),
                new THREE.MeshStandardMaterial({
                    color: shellHex, transparent: true, opacity: isAnswered ? 0.35 : 0.55,
                    emissive: shellHex, emissiveIntensity: isAnswered ? 0.5 : 3.0, side: THREE.DoubleSide
                })
            );
            const artLight = new THREE.PointLight(coreHex, isAnswered ? 0.3 : 2.0, isAnswered ? 3 : 7);
            artifact.add(nuggetCore, nuggetShell, artLight);

            // Make the artifact itself trigger the room question (but NOT close the box)
            artifactContainer.userData.type = 'reflection_trigger';
            artifactContainer.userData.roomKey = roomKey;
            artifactContainer.userData.tooltip = isAnswered ? 'REFLECTED ✓' : 'REFLECT';
            artifactContainer.userData.onClick = () => {
                if (window.showRoomQuestion) window.showRoomQuestion(roomKey);
            };

            artifactContainer.userData.update = (t) => {
                nuggetCore.rotation.y = t * 2.0;
                nuggetShell.rotation.y = -t * 1.0;
                if (!isAnswered) {
                    nuggetShell.material.emissiveIntensity = 2.5 + Math.sin(t * 4.0) * 1.5;
                    artLight.intensity = 1.5 + Math.sin(t * 4.0) * 0.8;
                }
                if (box.userData.isFullyOpen) {
                    artifactContainer.position.y = artTopY + Math.sin(t * 2.0) * 0.2;
                }
            };

            // Register as clickable so raycaster picks it up
            interiorClickables.push(artifactContainer);
        }

        // ── Unified open/close toggle ──
        const openBox = () => {
            if (!box.userData.isOpen) {
                // OPEN: lid swings up, then artifact rises
                box.userData.isOpen = true;
                box.userData.isClosing = false;
                box.userData.isFullyOpen = false; // wobble stays off until rise completes

                new TWEEN.Tween(lidPivot.rotation)
                    .to({ x: -Math.PI * 0.72 }, 700)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();

                setTimeout(() => {
                    artifactContainer.visible = true;
                    artifactContainer.position.set(x, artBaseY, z);
                    new TWEEN.Tween(artifactContainer.position)
                        .to({ y: artTopY }, 900)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start()
                        .onComplete(() => {
                            box.userData.isFullyOpen = true; // now start wobble
                        });
                }, 450);

            } else {
                // CLOSE: artifact descends, then lid closes
                box.userData.isOpen = false;
                box.userData.isClosing = true;
                box.userData.isFullyOpen = false;

                new TWEEN.Tween(artifactContainer.position)
                    .to({ y: artBaseY }, 700)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start()
                    .onComplete(() => {
                        artifactContainer.visible = false;
                        box.userData.isClosing = false;
                    });

                new TWEEN.Tween(lidPivot.rotation)
                    .to({ x: 0 }, 650)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .delay(650)
                    .start();
            }
        };

        box.userData.onClick = openBox;
        lid.userData.onClick = openBox;
        labelMesh.raycast = function () { };

        // Invisible hit-box covering the whole crate — always clickable to toggle
        const hitBoxMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 2.0, 2.0),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitBoxMesh.position.copy(box.position);
        hitBoxMesh.userData = { onClick: openBox, tooltip: labelText };
        interiorGroup.add(hitBoxMesh);
        interiorClickables.push(hitBoxMesh);

        return box;
    };




    // 1. LEFT BOX: RED "BEAUTY" (Spacing -2.5)
    createColoredBox("BEAUTY", '#ffffff', 0xd32f2f, -2.5, -1.8);

    // 2. MIDDLE BOX: YELLOW "KNOWLEDGE"
    createColoredBox("KNOWLEDGE", '#ffffff', 0xfbc02d, 0, -1.8);

    // 3. RIGHT BOX: DEEP-BLUE "WISDOM" (Spacing 2.5)
    createColoredBox("WISDOM", '#ffffff', 0x1a237e, 2.5, -1.8);

    // Dust Particles (Keep for atmosphere)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 10; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.1 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    particles.position.y = 3;
    particles.userData = { type: 'atticDust' };
    interiorGroup.add(particles);

    const lampGroup = new THREE.Group();
    // Restore to Wall-Mounted position.
    // Wall is at z = -5.0. Move to -4.8. 
    // Was floating at (-1.5, 2.5, -2.0)
    lampGroup.position.set(-4.0, 5.0, -4.8);

    // 1. Wall Mount (Brass Base)
    const mountGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.6, roughness: 0.3 });
    const mount = new THREE.Mesh(mountGeo, brassMat);
    mount.rotation.x = Math.PI / 2; // Flat against wall
    mount.position.z = -0.1;
    lampGroup.add(mount);

    // 2. Arm (Curved Brass Tube)
    const armGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16, Math.PI);
    const arm = new THREE.Mesh(armGeo, brassMat);
    arm.rotation.y = Math.PI / 2; // Arcing out from wall
    arm.position.set(0, 0.2, 0.3);
    lampGroup.add(arm);

    // 3. Shade (Old Fashioned Glass/Fabric Cone)
    const shadeGeo = new THREE.ConeGeometry(0.8, 0.6, 32, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
        color: 0xfdfbd3, // Creamy/Yellowish
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.5
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0, -0.2, 0.7); // Hanging from arm end
    lampGroup.add(shade);

    // 4. Bulb (Inside) - Enhanced with emissive for audio-reactive pulsing
    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.1
        })
    );
    bulb.position.y = -0.2;
    shade.add(bulb);

    // 5. The Light (ENHANCED: Very dark base, beat-reactive)
    const light = new THREE.PointLight(0xffaa00, 0.15, 25); // VERY DARK base (was 0.4)
    light.castShadow = true;
    light.shadow.radius = 4;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.y = -0.5;
    shade.add(light);

    // Expose for beat-sync in animate loop
    window.atticLampLight = light;

    // Store base intensity for beat calculations
    light.userData.baseIntensity = 0.15;
    light.userData.maxIntensity = 8.0; // Strong beats can make it very bright

    // ACTUALLY ADD IT TO THE SCENE!
    interiorGroup.add(lampGroup);

    // V-ATTIC: Force Global Lighting Override (Dark Mode)
    if (window.ambientLight) window.ambientLight.intensity = 0.05; // Almost pitch black
    if (window.dirLight) window.dirLight.intensity = 0.05; // No sunlight
    // Ensure we don't get overridden by default transition
    setTimeout(() => {
        if (window.currentRoom === 'attic') {
            if (window.ambientLight) window.ambientLight.intensity = 0.05;
            if (window.dirLight) window.dirLight.intensity = 0.05;
        }
    }, 500);
    // Attic reflection nugget is inside the WISDOM box (see createColoredBox "WISDOM" above)
}

let tvVideo, tvVideoTexture;
let tvScreensaver, tvScreensaverTexture; // V-NEW: Screensaver vars
// Need global access to lights for dimming (Cinema Mode)
window.livingCozyLight = null;
window.livingLibrarySpot = null;
// masterVideoIndex is global (house.js)

// Screensaver mechanism deleted per user request

function initTVVideo() {
    if (tvVideo) return;

    // Screensaver mechanism deleted per user request

    tvVideo = document.createElement('video');
    tvVideo.crossOrigin = 'anonymous'; // must be set before .src
    const livingData = roomContent['living'];
    if (livingData && livingData.videoPlaylist && livingData.videoPlaylist.length > 0) {
        tvVideo.src = livingData.videoPlaylist[0].src;
    } else {
        tvVideo.src = '/assets/video/premonition.mp4';
    }
    tvVideo.load(); // ensure browser picks up the src
    tvVideo.loop = false; tvVideo.muted = false; tvVideo.autoplay = false;
    tvVideo.preload = 'auto'; tvVideo.setAttribute('playsinline', '');

    // Auto-Next Listener for Living Room TV
    tvVideo.addEventListener('ended', () => {
        if (window.nextVideo) window.nextVideo();
    });

    window.videoElement = tvVideo;
    tvVideoTexture = new THREE.VideoTexture(tvVideo);
    tvVideoTexture.minFilter = THREE.LinearFilter;
    tvVideoTexture.magFilter = THREE.LinearFilter;
    // Ensure correct color/encoding and format for video textures to avoid white/blank surfaces
    if (THREE.VideoTexture && THREE.sRGBEncoding !== undefined) {
        try {
            tvVideoTexture.encoding = THREE.sRGBEncoding;
        } catch (e) {
            // fallback for older three.js
            tvVideoTexture.colorSpace = THREE.SRGBColorSpace;
        }
    } else {
        tvVideoTexture.colorSpace = THREE.SRGBColorSpace;
    }
    tvVideoTexture.format = THREE.RGBAFormat;
    tvVideoTexture.generateMipmaps = false;
    tvVideoTexture.needsUpdate = true;
    // Prevent wrapping issues for non-power-of-two video sizes
    tvVideoTexture.wrapS = THREE.ClampToEdgeWrapping;
    tvVideoTexture.wrapT = THREE.ClampToEdgeWrapping;
}

function playTVVideo(index) {
    const playlist = roomContent['living'].videoPlaylist;
    if (!playlist || !playlist[index]) return;
    window.masterVideoIndex = index;
    const clip = playlist[index];

    // Stop Music
    if (window.audioPlayer && !window.audioPlayer.paused) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
    }
    // Unhighlight Audio
    window.currentTrackIndex = -1;
    if (window.updateMusicPanelHighlight) window.updateMusicPanelHighlight();

    if (tvVideo) {
        tvVideo.crossOrigin = 'anonymous'; // ensure in case element was recreated
        tvVideo.src = clip.src;
        tvVideo.load();
        tvVideo.muted = false;
        tvVideo.volume = 1.0;

        // 1944: Use .play() promise to ensure atmosphere updates only on success
        tvVideo.play().then(() => {
            if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('dark');
        }).catch(e => {
            // Fallback: If blocked, still show the video texture (first frame usually)
            if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('dark');
        });
    }

    if (window.updateVideoUI) window.updateVideoUI();
    if (window.livingTVMesh) {
        // Revert to MeshBasic per 'nietzogoed' reference for correct brightness
        try {
            const vidMat = new THREE.MeshBasicMaterial({
                map: tvVideoTexture,
                color: 0xffffff,
                toneMapped: false,
                side: THREE.DoubleSide
            });
            vidMat.depthWrite = true;
            vidMat.depthTest = true;

            window.livingTVMesh.material = vidMat;
            window.livingTVMesh.material.needsUpdate = true;

            if (tvVideoTexture) {
                // Force Linear Encoding per reference
                if (THREE.LinearEncoding !== undefined) {
                    tvVideoTexture.encoding = THREE.LinearEncoding;
                }
                tvVideoTexture.needsUpdate = true;
            }
        } catch (e) {
            window.livingTVMesh.material.map = tvVideoTexture;
            window.livingTVMesh.material.needsUpdate = true;
        }
        window.livingTVMesh.userData.update = null;
    }
}

function createVideoPanel(playlist) {
    // Remove existing if any
    const toRemove = [];
    const clickablesToRemove = [];

    // 1. Identify Groups and Items
    interiorGroup.traverse(child => {
        // Remove Main Group
        if (child.userData && child.userData.type === 'videoInterfaceGroup') {
            toRemove.push(child);
        }
        // Remove known items (just in case they are orphaned or we need to clear clickables)
        if (child.userData && (child.userData.type === 'videoPanel' || child.userData.type === 'videoItem' || child.userData.type === 'tvVideoItem' || child.userData.type === 'videoHeader' || child.userData.type === 'videoControlSingle' || child.userData.type === 'universalVideoItem')) {
            // Note: If we remove the Group, children go with it from Scene, but we MUST remove from interiorClickables
            clickablesToRemove.push(child);
            // If it's a legacy item (direct child), add to toRemove
            if (child.parent === interiorGroup) toRemove.push(child);
        }
    });

    // 2. Clear Clickables
    clickablesToRemove.forEach(child => {
        const idx = interiorClickables.indexOf(child);
        if (idx > -1) interiorClickables.splice(idx, 1);
    });

    // 3. Remove Objects from Scene
    toRemove.forEach(child => {
        if (child.parent) child.parent.remove(child);
    });

    if (!playlist || playlist.length === 0) return;

    if (window.createUniversalVideoInterface) {
        // Position from Data or Fallback
        const posData = roomContent['living'].videoInterfacePos || { x: 3.0, y: 3.2, z: -4.9 };
        // Scale 0.5x
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), playlist, {
            scale: 0.5
        });
    }
}

window.stopLivingVideo = () => {
    if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('light');
    if (tvVideo) {
        tvVideo.pause(); tvVideo.muted = true;
        tvVideo.src = '';
        tvVideo.load();
        tvVideo.loop = false; // V-FIX: Reset loop!
        // Revert to static premonition screen
        if (window.livingTVMesh) {
            window.livingTVMesh.material.map = window.livingTVIdleTexture;
            window.livingTVMesh.userData.update = null;
        }
    }
    window.masterVideoIndex = -1;
    if (window.updateVideoUI) window.updateVideoUI();

    // V-FIX: Restore UI to generic video element after hijacking
    const genericVid = document.getElementById('generic-video');
    if (genericVid) window.videoElement = genericVid;
};

function nextTVContent() {
    // Ensure TV video is initialised before first use
    if (!tvVideo) initTVVideo();

    if (tvVideo) {
        if (tvVideo.paused) {
            // Stop music when TV plays
            if (window.audioPlayer && !window.audioPlayer.paused) {
                window.audioPlayer.pause();
                window.isMusicPlaying = false;
                if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
            }

            tvVideo.muted = false;
            tvVideo.volume = 1.0;

            // Mirror playTVVideo() exactly: MeshBasicMaterial + LinearEncoding = clear undarkened video
            if (window.livingTVMesh) {
                const vidMat2 = new THREE.MeshBasicMaterial({
                    map: tvVideoTexture,
                    color: 0xffffff,
                    toneMapped: false,
                    side: THREE.DoubleSide
                });
                vidMat2.depthWrite = true;
                vidMat2.depthTest = true;
                window.livingTVMesh.material = vidMat2;
                window.livingTVMesh.material.needsUpdate = true;
                window.livingTVMesh.userData.update = null;

                if (tvVideoTexture) {
                    // Force LinearEncoding to prevent gamma-darkening (matches playTVVideo)
                    if (THREE.LinearEncoding !== undefined) {
                        tvVideoTexture.encoding = THREE.LinearEncoding;
                    }
                    tvVideoTexture.needsUpdate = true;
                }
            }

            tvVideo.play().then(() => {
                if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('dark');
            }).catch(() => {
                if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('dark');
            });
        } else {
            tvVideo.pause();
            if (window.updateLivingAtmosphere) window.updateLivingAtmosphere('light');
        }
    }
}
window.nextTVContent = nextTVContent;
window.playTVVideo = playTVVideo;

function restoreCinemaLights() {

    // Default Fallbacks if capture failed
    const restore = window.preCinemaState || {
        cozy: 0.5, library: 0.5, spotL: 0.3, spotR: 0.3, ambient: 0.15,
    };

    try {
        if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: restore.cozy }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
        if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: restore.library }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore bookcase spots
        if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: restore.spotL }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
        if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: restore.spotR }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore Ambient
        if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: restore.ambient || 0.15 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore TV Glow
        if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 1.5 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore robot glow
        if (window.robotGlowLight) new TWEEN.Tween(window.robotGlowLight).to({ intensity: 2.5 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

    } catch (e) {
        if (window.livingCozyLight) window.livingCozyLight.intensity = restore.cozy;
    }

    // Allow re-capture next time
    window.preCinemaState = null;
}
// Export for global use
window.restoreCinemaLights = restoreCinemaLights;

// Duplicate function consolidated above

// Reverted to original Dark Wood for Living Room consistency
const createWoodMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Original Darkened Base Color
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 512, 512);

    // Wood Grain Pattern
    ctx.fillStyle = 'rgba(60, 30, 10, 0.2)';
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + Math.random() * 20 - 10, 170, x + Math.random() * 20 - 10, 340, x + Math.random() * 20 - 10, 512);
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.strokeStyle = 'rgba(40, 20, 5, 0.25)';
        ctx.stroke();
    }

    // Noise
    for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.01)';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xaa9977,
        roughness: 0.8,
        metalness: 0.1
    });
    return mat;
};

// Hall "Deep Green Textured" Material Generator
const createHallGreenMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep Green Base
    ctx.fillStyle = '#0b5532';
    ctx.fillRect(0, 0, 512, 512);

    // Texture: Organic/Slightly mottled
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 4 + 1;
        const alpha = Math.random() * 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(x, y, size, size);
    }

    // Subtle grit
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const alpha = Math.random() * 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;

    return new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
};

function createLivingRoomInterior() {
    // TV Idle Texture
    // START BLACK. No premonition.jpg
    window.livingTVIdleTexture = null;

    const wallsGroup = new THREE.Group();
    // Interior Walls
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0x451a00,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const wallGeoHB = new THREE.PlaneGeometry(10, 8);
    const wallGeoV = new THREE.PlaneGeometry(10, 8);

    const wallBack = new THREE.Mesh(wallGeoHB, wallMat);
    wallBack.position.set(0, 4.0, -5.0);
    wallBack.receiveShadow = true;
    wallsGroup.add(wallBack);

    const wallLeft = new THREE.Mesh(wallGeoV, wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-5.0, 4.0, 0);
    wallLeft.receiveShadow = true;
    wallsGroup.add(wallLeft);

    interiorGroup.add(wallsGroup);

    // --- LIGHTING ---
    // V-BRIGHTER: Significant boost to resolve "too dim" complaint
    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.8, 15); // Boosted from 0.25
    window.livingCozyLight.position.set(0, 5, 0);
    window.livingCozyLight.castShadow = true;
    window.livingCozyLight.shadow.mapSize.width = 2048;
    window.livingCozyLight.shadow.mapSize.height = 2048;
    window.livingCozyLight.shadow.radius = 8; // Soft edges
    window.livingCozyLight.shadow.bias = -0.0005;
    interiorGroup.add(window.livingCozyLight);

    // V-BRIGHTER: Significant boost to resolve "too dim" complaint
    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.8); // Boosted from 0.25
    window.livingLibrarySpot.position.set(3, 7, 3);
    window.livingLibrarySpot.angle = Math.PI / 4;
    window.livingLibrarySpot.penumbra = 0.5;
    window.livingLibrarySpot.castShadow = true;
    window.livingLibrarySpot.shadow.mapSize.width = 2048;
    window.livingLibrarySpot.shadow.mapSize.height = 2048;
    window.livingLibrarySpot.shadow.radius = 8; // Soft edges
    window.livingLibrarySpot.shadow.bias = -0.0005;
    window.livingLibrarySpot.target.position.set(3, 2, -4.9);
    interiorGroup.add(window.livingLibrarySpot);
    interiorGroup.add(window.livingLibrarySpot.target);

    // Moody Shelf lighting
    const bookcaseSpotL = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotL.position.set(-2, 6, -3.5);
    bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5);
    bookcaseSpotL.angle = Math.PI / 2.2;
    bookcaseSpotL.penumbra = 1.0;
    bookcaseSpotL.distance = 15;
    bookcaseSpotL.castShadow = true;
    bookcaseSpotL.shadow.mapSize.width = 1024;
    bookcaseSpotL.shadow.mapSize.height = 1024;
    interiorGroup.add(bookcaseSpotL);
    interiorGroup.add(bookcaseSpotL.target);
    window.bookcaseSpotL = bookcaseSpotL;

    const bookcaseSpotR = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotR.position.set(-2, 6, 3.5);
    bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5);
    bookcaseSpotR.angle = Math.PI / 2.2;
    bookcaseSpotR.penumbra = 1.0;
    bookcaseSpotR.distance = 15;
    bookcaseSpotR.castShadow = true;
    bookcaseSpotR.shadow.mapSize.width = 1024;
    bookcaseSpotR.shadow.mapSize.height = 1024;
    interiorGroup.add(bookcaseSpotR);
    interiorGroup.add(bookcaseSpotR.target);
    window.bookcaseSpotR = bookcaseSpotR;

    window.updateLivingAtmosphere = (mode) => {
        if (window.currentRoom !== 'living') return;

        let intensities;
        if (mode === 'dark' || mode === 'video') {
            // "DARK" State (Cinema Mode)
            // Kill ALL global lights including Moon (dirLight) and Sky (hemiLight)
            // AND the Robot Glow (cyan) which was reflecting off the right bookcase
            // Keep a touch of ambient/dir/hemi so the video doesn't appear excessively dark
            // Use slightly higher values for visibility during video playback
            intensities = {
                cozy: 0.0, library: 0.0, spotL: 0.0, spotR: 0.0,
                ambient: 0.12, dir: 0.12, hemi: 0.12, robot: 0.2, glow: 3.5, ruin: 0.1
            };
        } else {
            // "LIGHT" State (Normal / Audio)
            intensities = {
                cozy: 0.45, library: 0.45, spotL: 0.25, spotR: 0.25,
                ambient: 0.15, dir: 0.2, hemi: 0.15, robot: 2.5, glow: 1.0, ruin: 3.0
            };
        }

        // Ensure Red Button remains somewhat visible in dark mode
        if (window.musicSwitchMesh) {
            // Helper to check if it's currently RED
            const isRed = window.musicSwitchMesh.material.color.r > 0.6 && window.musicSwitchMesh.material.color.g < 0.2;
            if (isRed) {
                const emIntensity = (mode === 'dark' || mode === 'video') ? 0.4 : 0.0;
                new TWEEN.Tween(window.musicSwitchMesh.material.emissive).to({ r: emIntensity, g: 0, b: 0 }, 1000).start();
            } else {
                // If Green, maybe a subtle glow too?
                const emIntensity = (mode === 'dark' || mode === 'video') ? 0.4 : 0.0;
                new TWEEN.Tween(window.musicSwitchMesh.material.emissive).to({ r: 0, g: emIntensity, b: 0 }, 1000).start();
            }
        }

        const duration = 1500;
        if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: intensities.cozy }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: intensities.library }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: intensities.spotL }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: intensities.spotR }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: intensities.ambient }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: intensities.dir }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.hemiLight) new TWEEN.Tween(window.hemiLight).to({ intensity: intensities.hemi }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.robotGlowLight) new TWEEN.Tween(window.robotGlowLight).to({ intensity: intensities.robot }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: intensities.glow }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        if (window.ruinLight) new TWEEN.Tween(window.ruinLight).to({ intensity: intensities.ruin }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
    };

    // Procedural Wood Texture Helper
    const woodMat = createWoodMaterial();

    // --- BOOKCASES ---
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8, metalness: 0.1 });
    const bookColors = [0x991b1b, 0x1e40af, 0x166534, 0x854d0e, 0x3730a3, 0xfacc15];

    function createRuinArtifact() {
        const group = new THREE.Group();

        // 1. The Volcano Base
        const baseGeo = new THREE.CylinderGeometry(0.15, 0.4, 0.4, 8);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 1.0,
            flatShading: true
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);

        // 2. The Orb (Yellow & Higher)
        const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            emissive: 0xffaa00,
            emissiveIntensity: 1.0
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.y = 0.55;
        group.add(orb);

        // 3. Pulsating Light (Yellow)
        const light = new THREE.PointLight(0xffaa00, 2.5, 7);
        light.position.copy(orb.position);
        group.add(light);
        window.ruinLight = light; // Expose for atmosphere dimming

        // 4. BIG HITBOX (Covers Base + Orb + Surroundings)
        // Make it easy to click!
        const hitBox = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 0.9, 8), // Big cylinder
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hitBox.position.y = 0.45; // Center it
        group.add(hitBox);

        // Expose hitBox as the target
        group.userData.hitTarget = hitBox;

        group.userData = {
            update: (t) => {
                // V-NEW: Rhythmic 'Pounding' Pulse (fast rise, slow decay)
                const beat = Math.pow(Math.sin(t * 4), 4);
                const scalePulse = 1.0 + beat * 0.4;
                const glowPulse = 2.0 + beat * 6.0;

                light.intensity = glowPulse;
                orb.scale.setScalar(scalePulse);
                orb.material.emissiveIntensity = 1.0 + beat * 3.0;
            }
        };

        return group;
    }

    function createBookcase(posZ) {
        const bookcaseGroup = new THREE.Group();

        let pivotOffsetZ = 0;
        if (posZ < 0) {
            pivotOffsetZ = 1.2;
            // Explicitly assign Global Ref for Secret Door
            window.secretDoorGroup = bookcaseGroup;
            bookcaseGroup.userData.isSecretDoor = true; // Marker
        }

        const backing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.2, 2.4), shelfMat);
        backing.position.x = -0.4;
        backing.position.z = pivotOffsetZ; // Offset
        backing.castShadow = true; backing.receiveShadow = true;
        bookcaseGroup.add(backing);

        const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideL.position.z = -1.2 + pivotOffsetZ;
        sideL.castShadow = true; sideL.receiveShadow = true;
        bookcaseGroup.add(sideL);

        const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideR.position.z = 1.2 + pivotOffsetZ;
        sideR.castShadow = true; sideR.receiveShadow = true;
        bookcaseGroup.add(sideR);

        for (let row = 0; row < 5; row++) {
            const shelfY = 0.5 + (row * 1.0);
            const plank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.4), shelfMat);
            plank.position.y = shelfY - 2.5;
            plank.position.z = pivotOffsetZ;
            plank.castShadow = true; plank.receiveShadow = true;
            bookcaseGroup.add(plank);

            // Black Portal behind Right Bookcase
            if (row === 0 && posZ < 0) {
                // 1. The Visual Portal (Black Void)
                const portalMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const portal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 5.2), portalMat);
                portal.position.set(-4.95, 2.6, posZ);
                portal.rotation.y = Math.PI / 2;
                portal.userData = { name: 'void', type: 'decoration' };
                interiorGroup.add(portal);

                // 2. Interaction: Make the WHOLE VOID clickable (User Request)
                portal.userData = {
                    type: 'enter_annex', // Tag for debugging
                    onClick: () => {
                        // Only selectable AFTER door is rotated
                        if (window.secretDoorGroup && window.secretDoorGroup.userData.isOpen) {
                            enterRoom('annex');
                        } else {
                        }
                    }
                };
                interiorClickables.push(portal);

                // 3. Backup Hitbox (Invisible, In Front)
                // Catches clicks if the wall obscures the edges
                const portalHitBox = new THREE.Mesh(
                    new THREE.PlaneGeometry(2.0, 5.0),
                    new THREE.MeshBasicMaterial({ visible: false })
                );
                portalHitBox.position.z = 0.1; // Slightly in front of black plane
                portalHitBox.userData = { onClick: portal.userData.onClick };
                portal.add(portalHitBox);
                interiorClickables.push(portalHitBox);

                portal.userData.update = (t) => {
                };
            }

            if (row === 4 && posZ < 0) {
                const artifact = createRuinArtifact();

                artifact.scale.setScalar(1.5);
                artifact.position.set(0, shelfY - 2.45, 0 + pivotOffsetZ);

                const hitTarget = artifact.userData.hitTarget || artifact; // Fallback

                const toggleDoor = () => {
                    try {
                        const squeak = new Audio('/assets/audio/squeak.mp3');
                        squeak.volume = 1.0;
                        squeak.play().catch(e => console.error("Squeak Play Fail:", e));
                    } catch (err) {
                        console.error("Audio Init Fail:", err);
                    }

                    const target = window.secretDoorGroup;
                    if (!target) return;

                    if (!target.userData.isOpen) {
                        new TWEEN.Tween(target.rotation).to({ y: Math.PI / 2.5 }, 4000).easing(TWEEN.Easing.Quadratic.InOut).start();
                        target.userData.isOpen = true;
                    } else {
                        new TWEEN.Tween(target.rotation).to({ y: 0 }, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
                        target.userData.isOpen = false;
                    }
                };

                // Attach handler to the mesh userData
                hitTarget.userData = {
                    type: 'open_secret',
                    onClick: toggleDoor
                };

                // IMPORTANT: Push the Mesh (hitTarget) to interiorClickables
                interiorClickables.push(hitTarget);

                bookcaseGroup.add(artifact);
            }

            if (row === 1 && posZ < 0) {
                // RUBIK'S CUBE
                const cubeGroup = createRubiksCubeArtifact();
                cubeGroup.position.set(0.1, shelfY - 2.28, 0 + pivotOffsetZ);
                bookcaseGroup.add(cubeGroup);
            }
            else if (row === 4 && posZ > 0) {
                // TINTIN ROCKET
                const rocket = createRealisticRocketArtifact();
                rocket.scale.setScalar(0.022);

                rocket.position.set(-0.15, shelfY - 2.32, 0);
                bookcaseGroup.add(rocket);
            }
            else if (row === 2 && posZ > 0) {
                // GLOBE
                const globe = new THREE.Group();
                const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05), new THREE.MeshStandardMaterial({ color: 0x333333 }));
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
                ball.position.y = 0.3;
                globe.add(standBase, ball);
                globe.position.set(0.1, shelfY - 2.45, 0); // No offset for Left bookcase
                bookcaseGroup.add(globe);
            }
            else if (!(row === 4 && posZ < 0)) {
                for (let b = 0; b < 13; b++) {
                    const bW = 0.14;
                    const bH = 0.5 + Math.random() * 0.3;
                    const book = new THREE.Mesh(new THREE.BoxGeometry(0.6, bH, bW),
                        new THREE.MeshStandardMaterial({ color: bookColors[Math.floor(Math.random() * bookColors.length)] }));
                    const yPos = (shelfY - 2.5) + (bH / 2) + 0.05;
                    const zPos = (-0.9 + (b * 0.16)) + pivotOffsetZ; // Offset books
                    book.position.set(0.1, yPos, zPos);
                    bookcaseGroup.add(book);
                }
            }
        }

        // Hinge Logic for Secret Door
        if (posZ < 0) {
            window.secretDoorGroup = bookcaseGroup;
            bookcaseGroup.userData.isOpen = false;

            // V-NEW: Broad HitArea for Secret Door (User Request)
            // Instead of just clicking the temple, clicking ANYWHERE on the door works.
            const doorHitBox = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 5.2, 2.4),
                new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 })
            );
            // Position it to cover the entire front face of the bookcase
            doorHitBox.position.set(0, 0, pivotOffsetZ);

            // Define toggleDoor once and reuse it
            const toggleDoor = () => {
                try {
                    const squeak = new Audio('/assets/audio/squeak.mp3');
                    squeak.volume = 1.0;
                    squeak.play().catch(e => console.error("Squeak Play Fail:", e));
                } catch (err) {
                    console.error("Audio Init Fail:", err);
                }

                const target = window.secretDoorGroup;
                if (!target) return;

                if (!target.userData.isOpen) {
                    new TWEEN.Tween(target.rotation).to({ y: Math.PI / 2.5 }, 4000).easing(TWEEN.Easing.Quadratic.InOut).start();
                    target.userData.isOpen = true;
                } else {
                    new TWEEN.Tween(target.rotation).to({ y: 0 }, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
                    target.userData.isOpen = false;
                }
            };

            doorHitBox.userData = {
                type: 'secret_door_hitarea',
                onClick: toggleDoor
            };
            bookcaseGroup.add(doorHitBox);
            if (window.interiorClickables) interiorClickables.push(doorHitBox);
        }

        bookcaseGroup.position.set(-4.5, 2.6, posZ - pivotOffsetZ); // Apply Pivot Translation
        interiorGroup.add(bookcaseGroup);
    };

    createBookcase(-3.5); createBookcase(3.5);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1), woodMat);
    stand.position.set(0, 0.75, -4);
    stand.castShadow = true; stand.receiveShadow = true;
    interiorGroup.add(stand);

    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    tvFrame.position.set(0, 2.6, -4.5);
    interiorGroup.add(tvFrame);

    initTVVideo();

    // -- MILD GLOW BEHIND TV --
    const tvGlow = new THREE.PointLight(0x88ccff, 1.5, 8);
    tvGlow.position.set(0, 2.6, -4.8);
    interiorGroup.add(tvGlow);
    window.livingTVGlow = tvGlow;

    // Create Soft Gradient Texture for the backing
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const grd = gCtx.createRadialGradient(64, 64, 20, 64, 64, 60);
    grd.addColorStop(0, 'rgba(0, 100, 255, 0.4)'); // Blue center
    grd.addColorStop(0.5, 'rgba(0, 50, 150, 0.1)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gCtx.fillStyle = grd; gCtx.fillRect(0, 0, 128, 128);

    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowGeo = new THREE.PlaneGeometry(6, 4);
    const glowMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0.8,
        depthWrite: false, // Prevent occlusion issues
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 2.6, -4.95);
    interiorGroup.add(glowMesh);

    // Create Video Menu Panel
    if (roomContent['living'].videoPlaylist && roomContent['living'].videoPlaylist.length > 0) {
        createVideoPanel(roomContent['living'].videoPlaylist);
    }

    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    // Start with a subtle "Powered" look so it's not just a black hole
    window.livingTVMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({
        color: 0x111111, // Very dark gray instead of pitch black
        toneMapped: false
    }));
    window.livingTVMesh.position.set(0, 2.6, -4.39);

    interiorGroup.add(window.livingTVMesh);
    window.livingTVMesh.userData = {
        type: 'tv',
        onClick: () => {
            if (window.nextTVContent) window.nextTVContent();
        }
    };

    if (window.interiorClickables) interiorClickables.push(window.livingTVMesh);

    if (typeof addReflectionMarker === 'function') addReflectionMarker('living', 4, 1.5, 0);



    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 0.6, 2.25),
        woodMat
    );
    table.position.set(0, 0.3, -1.0);
    table.castShadow = true; table.receiveShadow = true;
    interiorGroup.add(table);

    // 4. Console Table (Center)

    function createBook(title, color, x, z, rotY, imagePath, synopsis, url) {
        const bGeo = new THREE.BoxGeometry(0.5, 0.08, 0.7);
        let coverMat;
        if (imagePath) {
            const diffTex = window.textureLoader ? window.textureLoader.load(imagePath) : new THREE.TextureLoader().load(imagePath);
            diffTex.colorSpace = THREE.SRGBColorSpace;
            coverMat = new THREE.MeshStandardMaterial({
                map: diffTex,
                color: 0xffffff,
                roughness: 0.5,
                metalness: 0.1
            });
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 356;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 356);
            ctx.fillStyle = '#c3bea6';
            ctx.font = 'bold 24px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, 128, 100);
            ctx.fillRect(10, 0, 20, 356);
            const tex = new THREE.CanvasTexture(canvas);
            coverMat = new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 0.8
            });
        }
        const bMat = [
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Muted Pages (was 0xeeeeee)
            new THREE.MeshStandardMaterial({ color: 0x888888 }),
            coverMat,
            new THREE.MeshStandardMaterial({ color: color }),
            new THREE.MeshStandardMaterial({ color: 0x888888 }),
            new THREE.MeshStandardMaterial({ color: 0x888888 })
        ];
        const mesh = new THREE.Mesh(bGeo, bMat);
        mesh.position.set(x, 0.65, z);
        mesh.rotation.y = rotY;
        mesh.castShadow = true;

        // Interactive Book Logic
        mesh.userData = {
            type: 'coffeetable_book',
            title: title.replace('\n', ' '),
            synopsis: synopsis,
            image: imagePath,
            url: url,
            onClick: () => {
                if (window.showBookPopup) window.showBookPopup(mesh.userData);
            }
        };
        if (window.interiorClickables) interiorClickables.push(mesh);

        interiorGroup.add(mesh);
    }

    createBook("Tonic for\nthe Bones", '#8b0000', -0.6, -1.4, 0.2, '/assets/images/tftb-cover.jpg', "A celebration of life amidst a dire diagnosis.", "https://www.tonicforthebones.com/tftb/");
    createBook("Phantom\nParents", '#1a237e', -0.4, -0.4, -0.1, '/assets/images/phantomparents-cover.jpg', "A personal and creative look at the experience of growing up- being an adoptee.", "https://www.amazon.com/gp/product/9090369449/");
    createBook("Tiny Socks and Vanishing Dopamine", '#065f46', 0.5, -0.9, -0.3, '/assets/images/gifts-cover.jpg', "A short story about fatherhood while dealing with Parkinson.", "https://www.amazon.com/dp/B0FCM11RH3");

    // Red Rug
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 64), new THREE.MeshStandardMaterial({ color: 0x6b0505, roughness: 1.0 }));
    rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02;
    rug.receiveShadow = true; // Receive Shadows (including Maria's shadow)
    interiorGroup.add(rug);

    // Couch
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    const couchGroup = new THREE.Group();

    // Helper function for rounded box
    const createRoundedBox = (width, height, depth, radius) => {
        const shape = new THREE.Shape();
        const x = -width / 2, y = -height / 2, w = width, h = height, r = radius;
        shape.moveTo(x, y + r);
        shape.lineTo(x, y + h - r);
        shape.quadraticCurveTo(x, y + h, x + r, y + h);
        shape.lineTo(x + w - r, y + h);
        shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
        shape.lineTo(x + w, y + r);
        shape.quadraticCurveTo(x + w, y, x + w - r, y);
        shape.lineTo(x + r, y);
        shape.quadraticCurveTo(x, y, x, y + r);
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    const s = new THREE.Mesh(createRoundedBox(3, 1.2, 0.4, 0.15), couchMat);
    s.rotation.set(Math.PI / 2, 0, 0);
    // Lifted slightly to sit on floor (geometry centered, height 1.2 means -0.6 to 0.6)
    s.position.y = 0.61; s.receiveShadow = true; s.castShadow = true; couchGroup.add(s);

    const b = new THREE.Mesh(createRoundedBox(3, 0.3, 1.2, 0.15), couchMat);
    b.rotation.set(Math.PI / 2, 0, 0);
    b.position.set(0, 1.0, 0.55); b.receiveShadow = true; b.castShadow = true; couchGroup.add(b);

    const aL = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aL.rotation.set(Math.PI / 2, 0, 0);
    aL.position.set(-1.6, 0.7, 0); aL.receiveShadow = true; aL.castShadow = true; couchGroup.add(aL);

    const aR = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aR.rotation.set(Math.PI / 2, 0, 0);
    aR.position.set(1.6, 0.7, 0); aR.receiveShadow = true; aR.castShadow = true; couchGroup.add(aR);

    couchGroup.position.set(0, 0, 2.5);
    interiorGroup.add(couchGroup);

    const chairGroup = new THREE.Group();
    const cS = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.4, 0.15), couchMat);
    cS.rotation.set(Math.PI / 2, 0, 0);
    cS.position.y = 0.61; cS.receiveShadow = true; cS.castShadow = true; chairGroup.add(cS);

    const cB = new THREE.Mesh(createRoundedBox(1.2, 0.3, 1.2, 0.15), couchMat);
    cB.rotation.set(Math.PI / 2, 0, 0);
    cB.position.set(0, 1.0, 0.55); cB.receiveShadow = true; cB.castShadow = true; chairGroup.add(cB);

    const cAL = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAL.rotation.set(Math.PI / 2, 0, 0);
    cAL.position.set(-0.7, 0.7, 0); cAL.receiveShadow = true; cAL.castShadow = true; chairGroup.add(cAL);

    const cAR = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAR.rotation.set(Math.PI / 2, 0, 0);
    cAR.position.set(0.7, 0.7, 0); cAR.receiveShadow = true; cAR.castShadow = true; chairGroup.add(cAR);

    chairGroup.position.set(3.5, 0, -1.0);
    chairGroup.rotation.y = Math.PI / 2;
    interiorGroup.add(chairGroup);

    try {
        if (typeof createMetropolisRobot === 'function') {
            window.metropolisRobot = createMetropolisRobot();
            window.metropolisRobot.position.set(4.5, 0, -4.0);
            window.metropolisRobot.rotation.y = -0.5;
            window.metropolisRobot.scale.set(1.125, 1.125, 1.125);

            // Maria is self-illuminating, so she should NOT cast shadows
            window.metropolisRobot.castShadow = false;
            window.metropolisRobot.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = false;
                }
            });

            interiorGroup.add(window.metropolisRobot);

            const robotGlow = new THREE.PointLight(0x00ffff, 2.5, 12);
            robotGlow.position.set(0, 1.5, 0.5);
            window.metropolisRobot.add(robotGlow);
            window.robotGlowLight = robotGlow;

            const hitGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 16);
            const hitMat = new THREE.MeshBasicMaterial({
                visible: true,
                color: 0xffff00,
                wireframe: false, // Hidden
                transparent: true,
                opacity: 0.0, // Hidden
                depthWrite: false // CRITICAL: Stop blocking the glow/rings behind it
            });
            const hitBox = new THREE.Mesh(hitGeo, hitMat);
            hitBox.position.y = 1.0;
            hitBox.userData = { type: 'MariaHitbox', parentRobot: true };
            window.metropolisRobot.add(hitBox);

        }
    } catch (e) {
    }
}
// --- ARTIFACT HELPERS ---
function createRubiksCubeArtifact() {
    const group = new THREE.Group();
    const cubeSize = 0.12;
    const spacing = 0.13;
    const colors = [0xffffff, 0xffff00, 0xff0000, 0xffa500, 0x0000ff, 0x00ff00]; // W, Y, R, O, B, G

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (x === 0 && y === 0 && z === 0) continue; // Hollow core

                const materials = [];
                for (let i = 0; i < 6; i++) {
                    // Random-ish rotation/scramble look
                    materials.push(new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)], roughness: 0.1 }));
                }

                // Black frame/border effect
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), materials);
                mesh.position.set(x * spacing, y * spacing, z * spacing);
                group.add(mesh);

                // Add dark edges
                const edges = new THREE.EdgesGeometry(mesh.geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
                mesh.add(line);
            }
        }
    }
    group.scale.setScalar(0.85); // Adjust for shelf fit
    return group;
}

function createRealisticRocketArtifact() {
    const rocket = new THREE.Group();
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const RED = '#d40000'; const WHITE = '#fcfcfc';
    const bottomEdge = 0.32 * size;
    const checkerHeight = 0.44 * size;
    const rowH = checkerHeight / 5;
    const cols = 10; const colW = size / cols;

    ctx.fillStyle = RED; ctx.fillRect(0, size - bottomEdge, size, bottomEdge);
    for (let i = 0; i < 5; i++) {
        const y = size - bottomEdge - (i + 1) * rowH;
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? RED : WHITE;
            ctx.fillRect(j * colW, y, colW, rowH);
        }
    }
    ctx.fillStyle = RED; ctx.fillRect(0, 0, size, size - bottomEdge - checkerHeight);

    const rocketTexture = new THREE.CanvasTexture(canvas);
    rocketTexture.wrapS = THREE.RepeatWrapping; rocketTexture.wrapT = THREE.RepeatWrapping;

    const rocketMat = new THREE.MeshStandardMaterial({ map: rocketTexture, roughness: 0.2, metalness: 0.1 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd40000, roughness: 0.32 });

    const points = [];
    const h = 30; const bulgePoint = 0.58; const baseRadius = 1.1; const maxRadius = 2.6;
    for (let i = 0; i <= 100; i++) {
        const t = i / 100; const y = t * h;
        let x;
        if (t < bulgePoint) {
            const localT = t / bulgePoint;
            x = baseRadius + (maxRadius - baseRadius) * Math.sin(localT * Math.PI / 2);
        } else {
            const localT = (t - bulgePoint) / (1 - bulgePoint);
            x = maxRadius * Math.pow(Math.cos(localT * Math.PI / 2), 0.8);
        }
        points.push(new THREE.Vector2(x, y));
    }
    points.unshift(new THREE.Vector2(0, 0));

    const body = new THREE.Mesh(new THREE.LatheGeometry(points, 32), rocketMat);
    rocket.add(body);

    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 3, 12), redMat);
    tip.position.y = h + 1.5;
    rocket.add(tip);

    for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group();
        legGroup.rotation.y = (i * Math.PI * 2) / 3;
        const legShape = new THREE.Shape();
        legShape.moveTo(1.2, 7.2); legShape.lineTo(2.2, 7.2);
        legShape.bezierCurveTo(9.0, 5.7, 10.5, -1.3, 10.5, -3.7);
        legShape.lineTo(8.0, -3.7);
        legShape.bezierCurveTo(8.0, -0.5, 4.0, 1.5, 1.2, 2.7);
        const leg = new THREE.Mesh(new THREE.ExtrudeGeometry(legShape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35, bevelSegments: 3 }), redMat);
        leg.position.set(0, 0, -0.8);
        const pod = new THREE.Mesh(new THREE.SphereGeometry(2.0, 16, 16), redMat);
        pod.scale.set(1, 1.35, 1); pod.position.set(9.2, -3.4, 0.8);
        leg.add(pod);
        legGroup.add(leg);
        rocket.add(legGroup);
    }
    return rocket;
}

window.createRealisticRocketArtifact = createRealisticRocketArtifact;
window.createRubiksCubeArtifact = createRubiksCubeArtifact;
window.createLivingRoomInterior = createLivingRoomInterior;
function createAnnexInterior() {
    // --- LIGHTING ---
    // --- CANDLE MESH & LIGHT ---
    const candleGroup = new THREE.Group();
    // 1. Wax Body
    const waxGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2);
    const waxMat = new THREE.MeshStandardMaterial({ color: 0xfffff0, roughness: 0.3 });
    const wax = new THREE.Mesh(waxGeo, waxMat);
    wax.position.y = 0.1; // Base at 0
    candleGroup.add(wax);

    // 2. Wick
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    wick.position.y = 0.22;
    candleGroup.add(wick);

    // 3. Flame Visual
    const flameGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.25;
    candleGroup.add(flame);

    // 4. Light Source
    // Darker (0.5 -> 0.3)
    const annexLight = new THREE.PointLight(0xffaa00, 0.3, 15); // Reduced range from 12 to 5 for intimacy
    annexLight.position.set(0, 0.35, 0); // Local to group
    annexLight.castShadow = true;
    // Soft/Blurry Shadows
    annexLight.shadow.radius = 4;
    annexLight.shadow.mapSize.width = 512;
    annexLight.shadow.mapSize.height = 512;
    // Shadow Bias to prevent self-shadowing artifacts (the "mysterious dark shadow")
    annexLight.shadow.bias = -0.001;
    annexLight.userData = {
        baseIntensity: 1.2,
        update: (t) => {
            const flicker = 1.2 + Math.sin(t * 15) * 0.15 + Math.cos(t * 33) * 0.15;
            annexLight.intensity = flicker;
            flame.scale.setScalar(0.8 + (flicker - 1.2) * 2); // Pulse visual flame too
        }
    };
    candleGroup.add(annexLight);

    // Position Group on Desk
    // Desk Top Surface: y=1.0 + 0.075 = 1.075
    candleGroup.position.set(1.0, 1.075, -1.0);
    interiorGroup.add(candleGroup);

    // Helper to run updates
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
    animator.castShadow = false; // Ensure hidden helper doesn't cast shadow
    animator.userData = { update: (t) => { annexLight.userData.update(t); } };
    interiorGroup.add(animator);

    // --- CONTENT ---

    // 1. Narrow Rounded Bed (Left Wall)
    const bedWidth = 1.8, bedDepth = 3.8, radius = 0.2;
    const shape = new THREE.Shape();
    shape.moveTo(-bedWidth / 2 + radius, -bedDepth / 2);
    shape.lineTo(bedWidth / 2 - radius, -bedDepth / 2);
    shape.absarc(bedWidth / 2 - radius, -bedDepth / 2 + radius, radius, -Math.PI / 2, 0, false);
    shape.lineTo(bedWidth / 2, bedDepth / 2 - radius);
    shape.absarc(bedWidth / 2 - radius, bedDepth / 2 - radius, radius, 0, Math.PI / 2, false);
    shape.lineTo(-bedWidth / 2 + radius, bedDepth / 2);
    shape.absarc(-bedWidth / 2 + radius, bedDepth / 2 - radius, radius, Math.PI / 2, Math.PI, false);
    shape.lineTo(-bedWidth / 2, -bedDepth / 2 + radius);
    shape.absarc(-bedWidth / 2 + radius, -bedDepth / 2 + radius, radius, Math.PI, Math.PI * 1.5, false);

    const bedGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false });
    bedGeo.rotateX(Math.PI / 2);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1.0 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    // Move away from wall (-1.0 -> -0.9) to fix shadow artifact
    bed.position.set(-0.9, 0.4, 0);
    bed.castShadow = true; bed.receiveShadow = true;
    interiorGroup.add(bed);

    // Rounded Rectangle Pillow
    const pW = 1.4, pD = 0.7, pR = 0.2;
    const pShape = new THREE.Shape();
    pShape.moveTo(-pW / 2 + pR, -pD / 2);
    pShape.lineTo(pW / 2 - pR, -pD / 2);
    pShape.absarc(pW / 2 - pR, -pD / 2 + pR, pR, -Math.PI / 2, 0, false);
    pShape.lineTo(pW / 2, pD / 2 - pR);
    pShape.absarc(pW / 2 - pR, pD / 2 - pR, pR, 0, Math.PI / 2, false);
    pShape.lineTo(-pW / 2 + pR, pD / 2);
    pShape.absarc(-pW / 2 + pR, pD / 2 - pR, pR, Math.PI / 2, Math.PI, false);
    pShape.lineTo(-pW / 2, -pD / 2 + pR);
    pShape.absarc(-pW / 2 + pR, -pD / 2 + pR, pR, Math.PI, Math.PI * 1.5, false);

    const pillowGeo = new THREE.ExtrudeGeometry(pShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
    pillowGeo.rotateX(Math.PI / 2);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0x555555 }));
    // Move together with bed (-0.9)
    pillow.position.set(-0.9, 0.45, 1.4);
    pillow.castShadow = true; pillow.receiveShadow = true;
    interiorGroup.add(pillow);

    // Blanket (Thin & Flush)
    // Reduced width (1.82 -> 1.75) to prevent clipping into wall
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 }));
    // Move with bed (-0.9)
    blanket.position.set(-0.9, 0.41, -0.1);
    interiorGroup.add(blanket);

    // Chair closer to desk (-0.8) and scaled (0.75)
    const chair = createAnnexChair();
    chair.position.set(0.5, 0, -0.8);
    chair.rotation.y = -0.3;
    interiorGroup.add(chair);

    // 2. Wall mounted Bookshelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const darkBooks = [0x1a1510, 0x2b1d14, 0x0a0a0a, 0x3e2723, 0x1b2612];

    function createWallShelf(x, y, z, rotY = 0) {
        const shelfGroup = new THREE.Group();
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.6), shelfMat);
        plank.castShadow = true; plank.receiveShadow = true;
        shelfGroup.add(plank);
        for (let i = 0; i < 10; i++) {
            const bH = 0.4 + Math.random() * 0.2, bW = 0.15 + Math.random() * 0.1;
            const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.4), new THREE.MeshStandardMaterial({ color: darkBooks[Math.floor(Math.random() * darkBooks.length)] }));
            book.position.set(-1.0 + (i * 0.22), 0.05 + bH / 2, 0);
            book.castShadow = true; book.receiveShadow = true;
            shelfGroup.add(book);
        }
        shelfGroup.position.set(x, y, z); shelfGroup.rotation.y = rotY;
        interiorGroup.add(shelfGroup);
    }
    // Moved from -1.95 to -1.7 to prevent wall piercing
    createWallShelf(-1.7, 2.0, 0, Math.PI / 2);
    createWallShelf(-1.7, 2.8, 0, Math.PI / 2);

    // 3. Narrow Suitcase — nugget hides inside, pops out on click
    const suitcase = createSuitcase();
    suitcase.scale.set(1.0, 1.0, 1.4);
    suitcase.position.set(1.4, 0.0, 1.6);
    suitcase.rotation.y = 0.4;
    interiorGroup.add(suitcase);

    // --- BUILD THE NUGGET (reflection marker) hidden inside the suitcase ---
    (function setupSuitcaseNugget() {
        const roomKey = 'annex';
        const isAnswered = !!(window.visitorData && window.visitorData.answers && window.visitorData.answers[roomKey]);
        const coreHex = isAnswered ? 0xff2200 : 0x00ff00;
        const shellHex = isAnswered ? 0xff2200 : 0x00ff00;
        const shellOpacity = isAnswered ? 0.35 : 0.55;
        const emissiveIntens = isAnswered ? 0.5 : 3.0;
        const lightIntensity = isAnswered ? 0.3 : 2.0;
        const lightRange = isAnswered ? 3 : 7;

        const nuggetGroup = new THREE.Group();
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.224 * 0.75, 0),
            new THREE.MeshBasicMaterial({ color: coreHex, toneMapped: false }));
        const shell = new THREE.Mesh(new THREE.OctahedronGeometry(0.416 * 0.75, 1),
            new THREE.MeshStandardMaterial({
                color: shellHex, transparent: true,
                opacity: shellOpacity, emissive: shellHex,
                emissiveIntensity: emissiveIntens, side: THREE.DoubleSide
            }));
        const pl = new THREE.PointLight(coreHex, lightIntensity, lightRange);
        nuggetGroup.add(core, shell, pl);
        nuggetGroup.scale.set(0.05, 0.05, 0.05);
        nuggetGroup.visible = false;

        // Place it at local suitcase lid-open hover position (world space)
        // Suitcase world pos: x=1.4, y=0, z=1.6, rotY=0.4
        // We manage nugget in world space via interiorGroup
        const nuggetBase = { x: 1.4, y: 0.25, z: 1.6 }; // inside the case
        const nuggetFloat = { x: 1.4, y: 1.5, z: 1.6 }; // above the case
        nuggetGroup.position.set(nuggetBase.x, nuggetBase.y, nuggetBase.z);
        interiorGroup.add(nuggetGroup);

        nuggetGroup.userData = {
            type: 'reflection_trigger',
            roomKey,
            tooltip: isAnswered ? 'REFLECTED ✓' : 'REFLECT',
            onClick: () => { if (window.showRoomQuestion) window.showRoomQuestion(roomKey); },
            update: (t) => {
                core.rotation.y = t * 2.0;
                shell.rotation.y = -t * 1.0;
                if (nuggetGroup.visible && nuggetGroup.scale.x > 0.5) {
                    nuggetGroup.position.y = nuggetFloat.y + Math.sin(t * 2.0) * 0.08;
                    if (!isAnswered) { shell.material.emissiveIntensity = 2.5 + Math.sin(t * 4.0) * 1.5; pl.intensity = 1.5 + Math.sin(t * 4.0) * 0.8; }
                }
            }
        };

        // Get the lidGroup from the suitcase children (index 1 = lidGroup)
        const lidGroupRef = suitcase.children[1]; // lidGroup added second
        let suitcaseOpen = false;

        const openSuitcase = () => {
            if (!suitcaseOpen) {
                suitcaseOpen = true;
                // 1. Flip lid open
                new TWEEN.Tween(lidGroupRef.rotation)
                    .to({ x: -Math.PI * 0.75 }, 600)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                // 2. After lid is halfway open, pop nugget out
                setTimeout(() => {
                    nuggetGroup.visible = true;
                    nuggetGroup.position.set(nuggetBase.x, nuggetBase.y, nuggetBase.z);
                    nuggetGroup.scale.set(0.05, 0.05, 0.05);
                    new TWEEN.Tween(nuggetGroup.scale)
                        .to({ x: 0.75, y: 0.75, z: 0.75 }, 600)
                        .easing(TWEEN.Easing.Back.Out)
                        .start();
                    new TWEEN.Tween(nuggetGroup.position)
                        .to({ y: nuggetFloat.y }, 900)
                        .easing(TWEEN.Easing.Back.Out)
                        .start();
                    // Make it clickable
                    if (window.interiorClickables && !window.interiorClickables.includes(nuggetGroup)) {
                        window.interiorClickables.push(nuggetGroup);
                    }
                }, 350);
            } else {
                suitcaseOpen = false;
                // 1. Pull nugget back into case
                new TWEEN.Tween(nuggetGroup.scale)
                    .to({ x: 0.05, y: 0.05, z: 0.05 }, 500)
                    .easing(TWEEN.Easing.Back.In)
                    .start();
                new TWEEN.Tween(nuggetGroup.position)
                    .to({ y: nuggetBase.y }, 500)
                    .easing(TWEEN.Easing.Back.In)
                    .onComplete(() => { nuggetGroup.visible = false; })
                    .start();
                // 2. Close lid after nugget is inside
                new TWEEN.Tween(lidGroupRef.rotation)
                    .to({ x: 0 }, 500)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .delay(550)
                    .start();
            }
        };

        // Make the suitcase group and all its meshes clickable
        const scHit = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.5, 0.7),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        scHit.position.set(1.4, 0.25, 1.6);
        scHit.userData = { onClick: openSuitcase, tooltip: 'SUITCASE' };
        interiorGroup.add(scHit);
        if (window.interiorClickables) window.interiorClickables.push(scHit);
    })();

    // 4. Desk
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 }); // Re-using woodMat from chair for consistency
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), woodMat);
    deskTop.position.y = 1.0;
    deskTop.castShadow = true; deskTop.receiveShadow = true;
    deskGroup.add(deskTop);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
    const legBR = new THREE.Mesh(legGeo, woodMat); legBR.position.set(1.4, 0.5, -0.45);
    legBR.castShadow = true; legBR.receiveShadow = true;
    const legFR = new THREE.Mesh(legGeo, woodMat); legFR.position.set(1.4, 0.5, 0.45);
    legFR.castShadow = true; legFR.receiveShadow = true;
    deskGroup.add(legBR, legFR);
    deskGroup.position.set(-0.4, 0, -1.3);

    addDeskItems(deskGroup);

    createDiaryHologram(deskGroup);
    interiorGroup.add(deskGroup);

    createRothkoPainting();
    // No addReflectionMarker here — nugget is hidden in the suitcase above
}

function createAnnexChair() {
    const chair = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), woodMat);
    seat.position.y = 0.5; seat.castShadow = true; seat.receiveShadow = true; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), woodMat);
    back.position.set(0, 0.9, 0.25); back.castShadow = true; back.receiveShadow = true; chair.add(back);
    for (let x of [-0.25, 0.25]) {
        for (let z of [-0.25, 0.25]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), woodMat);
            leg.position.set(x, 0.25, z); leg.castShadow = true; leg.receiveShadow = true; chair.add(leg);
        }
    }
    chair.scale.setScalar(1.1); return chair;
}

function createSuitcase() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });

    // 1. Bottom Part (Half Height)
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    bottom.castShadow = true; bottom.receiveShadow = true;
    bottom.position.y = 0.1; // 0 to 0.2
    group.add(bottom);

    // 2. Lid Group (Pivots at back Z edge)
    const lidGroup = new THREE.Group();
    // Pivot Point: Top of bottom part (y=0.2), Back edge (z=-0.25)
    lidGroup.position.set(0, 0.2, -0.25);

    // Lid Mesh (Offset so pivot is at corner)
    // Lid is 0.2 high. Center should be at z=0.25 relative to pivot?
    // Geometry center is 0. 
    // We want the mesh to sit from Z=0 to Z=0.5 relative to pivot Group?
    // Let's align it.
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    lidMesh.position.set(0, 0.1, 0.25); // Move up 0.1 and forward 0.25
    lidMesh.castShadow = true; lidMesh.receiveShadow = true;
    lidGroup.add(lidMesh);

    // Straps (Attached to Lid and Bottom)
    // Simplified: Just put straps on Lid for visual continuity when opening?
    // Or split straps. Let's put visual straps on Lid.
    const strapGeo = new THREE.BoxGeometry(0.05, 0.22, 0.52);
    const s1 = new THREE.Mesh(strapGeo, new THREE.MeshStandardMaterial({ color: 0x2b1d14 }));
    s1.position.set(-0.25, 0.1, 0.25);
    lidGroup.add(s1);
    const s2 = s1.clone();
    s2.position.set(0.25, 0.1, 0.25);
    lidGroup.add(s2);

    // Handle (On Lid)
    // Full Torus (Math.PI -> Math.PI * 2) to look complete
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI * 2), metalMat);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.x = -Math.PI / 2; // Flat on top
    handle.position.set(0, 0.2, 0.25); // On top of lid
    lidGroup.add(handle);

    group.add(lidGroup);

    return group;
}
function addDeskItems(deskGroup) {
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffffc, roughness: 0.8 });

    // 1. Scattered Papers
    for (let i = 0; i < 5; i++) {
        const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), paperMat); // A4 ratio
        paper.rotation.x = -Math.PI / 2;
        paper.position.set((Math.random() - 0.5) * 2.5, 1.08 + i * 0.001, (Math.random() - 0.5) * 0.8);
        paper.rotation.z = Math.random() * Math.PI;
        deskGroup.add(paper);
    }

    // 2. Newspapers
    const newsCanvas = document.createElement('canvas');
    newsCanvas.width = 256; newsCanvas.height = 256;
    const nctx = newsCanvas.getContext('2d');
    nctx.fillStyle = '#cccccc'; nctx.fillRect(0, 0, 256, 256);
    nctx.fillStyle = '#333333'; nctx.font = 'bold 20px serif';
    nctx.fillText("DAILY GAZETTE", 40, 50);
    nctx.fillRect(40, 60, 180, 2);
    for (let i = 0; i < 10; i++) nctx.fillRect(40, 80 + i * 15, 180, 8);
    const newsTex = new THREE.CanvasTexture(newsCanvas);
    const newsMat = new THREE.MeshStandardMaterial({ map: newsTex });

    const news = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), newsMat);
    news.rotation.x = -Math.PI / 2;
    news.position.set(1.2, 1.085, 0.2);
    news.rotation.z = 0.4;
    deskGroup.add(news);

    // 4. THE DIARY (Open)
    const diaryGroup = new THREE.Group();
    const pageGeo = new THREE.PlaneGeometry(0.25, 0.35);
    const leftPage = new THREE.Mesh(pageGeo, paperMat);
    leftPage.position.x = -0.125;
    leftPage.rotation.y = 0.15;

    const rightPage = new THREE.Mesh(pageGeo, paperMat);
    rightPage.position.x = 0.125;
    rightPage.rotation.y = -0.15;

    diaryGroup.add(leftPage, rightPage);
    diaryGroup.rotation.x = -Math.PI / 2;
    diaryGroup.position.set(0, 1.1, 0.1);

    // Restore standard Diary type for Hologram interaction
    diaryGroup.userData = { type: 'diary' };

    deskGroup.add(diaryGroup);
    interiorClickables.push(diaryGroup);

    // Make the stack of books clickable too (as user mentioned "pile of books")
    const bookColors = [0x451a03, 0x1a2e05, 0x051a45, 0x222222];
    for (let i = 0; i < 3; i++) {
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.45), new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] }));
        book.position.set(-1.1, 1.1 + i * 0.06, -0.2);
        book.rotation.y = 0.1 * i;

        // Make books clickable nuggets
        book.userData = { type: 'room_question', room: 'annex' };
        interiorClickables.push(book);

        deskGroup.add(book);
    }
}

function createMedicineHologram(parent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background 
    const grad = ctx.createRadialGradient(256, 512, 0, 256, 512, 512);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    grad.addColorStop(0.3, 'rgba(0, 255, 255, 0.2)');
    grad.addColorStop(0.6, 'rgba(0, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // 2. White Text with Cyan Glow
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.font = '900 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = [
        "Parkinson's is the",
        "fastest growing",
        "neurological",
        "disorder",
        "in the world"
    ];

    const startY = 320;
    const spacing = 70;
    lines.forEach((line, i) => {
        ctx.fillText(line, 256, startY + i * spacing);
    });

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), mat);
    mesh.geometry.translate(0, 2, 0);

    // Local Y = 0 is center of 2.0 height cabinet. 
    // We'll put it at Y= -0.5 to center the text block better visually
    mesh.position.set(0, -0.5, 0.8);
    mesh.scale.set(0, 0, 0);
    mesh.renderOrder = 9999;
    mesh.visible = false;

    parent.add(mesh);
    window.medicineHologram = mesh;
}

function createDiaryHologram(parent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background (Even Blurrier / More Diffuse Cyan)
    const grad = ctx.createRadialGradient(256, 512, 0, 256, 512, 512);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)'); // Reduced center opacity
    grad.addColorStop(0.3, 'rgba(0, 255, 255, 0.2)');
    grad.addColorStop(0.6, 'rgba(0, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // 2. White Courier Font Letters with Cyan Glow
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.font = '900 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = [
        '"Adversity',
        'is my',
        'teacher"'
    ];

    const startY = 320;
    const spacing = 70;
    lines.forEach((line, i) => {
        ctx.fillText(line, 256, startY + i * spacing);
    });

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending // Switch to Additive for glowing white text pop
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), mat);
    // Adjusted Pivot Logic - Move Geometry so Pivot is at Bottom (Y=0)
    mesh.geometry.translate(0, 2, 0); // Translation Y=2 for a height 4 plane puts pivot at 0

    // Position at desk surface (approx 1.0)
    mesh.position.set(0, 1.1, 0.2);
    mesh.scale.set(0, 0, 0); // Start Shrunk
    mesh.renderOrder = 9999;
    mesh.visible = false;

    parent.add(mesh);
    window.diaryHologram = mesh;
}



function createRothkoPainting() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 921;
    const ctx = canvas.getContext('2d');

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    // Use MeshStandard to react to environment but keep colors vivid
    const mat = new THREE.MeshStandardMaterial({
        map: tex,
        side: THREE.DoubleSide,
        roughness: 0.9,
        emissive: 0x111111, // Slight self-illumination for visibility
        emissiveIntensity: 0.2
    });

    const geo = new THREE.PlaneGeometry(1.5, 2.7);
    const light = new THREE.PointLight(0xffeecc, 0.3, 10);
    light.position.set(2, 4, 2);
    light.castShadow = true;
    interiorGroup.add(light);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-0.4, 3.5, -1.95);
    mesh.rotation.y = 0;
    interiorGroup.add(mesh);

    // Frame
    const frameGeo = new THREE.BoxGeometry(1.6, 2.8, 0.05);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(-0.4, 3.5, -2.0);
    frame.rotation.y = 0;
    frame.castShadow = true; frame.receiveShadow = true;
    interiorGroup.add(frame);

    // --- ROTHKO LOGIC ---
    const palettes = [
        ['#8B0000', '#FF4500', '#FFD700'],
        ['#4B0082', '#8B008B', '#FF1493'],
        ['#DC143C', '#FF6347', '#FFA07A'],
        ['#2F4F4F', '#1C1C1C', '#8B4513'],
        ['#191970', '#000080', '#4B0082'],
        ['#CD853F', '#D2691E', '#8B4513'],
        ['#FF4500', '#FFD700', '#FF8C00'],
        ['#00CED1', '#4682B4', '#1E90FF'],
        ['#BC8F8F', '#CD5C5C', '#F08080'],
    ];

    let blocks = [];
    let bgState = { h: 200, s: 30, l: 20 };
    let bgTarget = { h: 200, s: 30, l: 20 };
    let lastPaletteChange = 0;

    function hexToHSL(hex) {
        let r = parseInt(hex.substr(1, 2), 16) / 255;
        let g = parseInt(hex.substr(3, 2), 16) / 255;
        let b = parseInt(hex.substr(5, 2), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // Initialize Blocks (Persistent Objects)
    // We stick to 3 blocks for stability.
    // To switch between 2 and 3, we animate the weight of one block to 0.
    for (let i = 0; i < 3; i++) {
        blocks.push({
            h: 0, s: 70, l: 50,
            targetH: 0, targetS: 70, targetL: 50,
            weight: 1.0,
            targetWeight: 1.0,
            speed: Math.random() * 0.2 + 0.1
        });
    }

    function pickNewTargetPalette() {
        const palette = palettes[Math.floor(Math.random() * palettes.length)];
        const hsls = palette.map(hexToHSL);

        // Background target (Average)
        const avgH = hsls.reduce((a, c) => a + c.h, 0) / hsls.length;
        bgTarget.h = avgH;
        bgTarget.s = 30;
        bgTarget.l = 18;

        const mode2 = Math.random() > 0.5;
        let hideIndex = -1;
        if (mode2) {
            hideIndex = Math.floor(Math.random() * 3);
        }

        blocks.forEach((b, i) => {
            const c = hsls[i % hsls.length];
            b.targetH = c.h;
            b.targetS = c.s;
            b.targetL = c.l;

            if (i === hideIndex) {
                b.targetWeight = 0.0; // Shrink to nothing
            } else {
                // Randomize size slightly
                b.targetWeight = 1.0 + Math.random() * 0.5;
            }
        });
    }

    pickNewTargetPalette();
    // Initialize current to target immediately for start
    bgState = { ...bgTarget };
    blocks.forEach(b => {
        b.h = b.targetH; b.s = b.targetS; b.l = b.targetL;
        b.weight = b.targetWeight;
    });

    // Lerp Helper handles hue wrapping
    function lerpAngle(a, b, t) {
        let diff = b - a;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return a + diff * t;
    }
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    mesh.userData.update = (t) => {
        // Slowly change targets every 15s
        if (t - lastPaletteChange > 15) {
            pickNewTargetPalette();
            lastPaletteChange = t;
        }

        const dt = 0.005; // Transition speed factor

        // 1. Animate BG Color
        bgState.h = lerpAngle(bgState.h, bgTarget.h, dt);
        bgState.s = lerp(bgState.s, bgTarget.s, dt);
        bgState.l = lerp(bgState.l, bgTarget.l, dt);

        // 2. Clear & Draw BG
        ctx.fillStyle = `hsl(${bgState.h}, ${bgState.s}%, ${bgState.l}%)`;
        ctx.fillRect(0, 0, 512, 921);

        // 3. Draw Blocks
        const W = 512;
        const H = 921;
        const padX = 40;
        const padY = 50; // Top/Bottom padding
        const maxGap = 40; // Max gap between blocks

        ctx.filter = 'blur(30px)';

        let totalWeight = 0;
        let activeGapCount = 0;

        blocks.forEach(b => {
            b.weight = lerp(b.weight, b.targetWeight, dt);

            // Colors
            b.h = lerpAngle(b.h, b.targetH, dt);
            b.s = lerp(b.s, b.targetS, dt);
            b.l = lerp(b.l, b.targetL, dt);

            totalWeight += b.weight;
        });

        let totalGapUsage = 0;
        const gapSizes = [];

        for (let i = 0; i < blocks.length - 1; i++) {

            const w1 = Math.min(blocks[i].weight, 1.0);
            const w2 = Math.min(blocks[i + 1].weight, 1.0);
            const g = maxGap * w1 * w2;
            gapSizes.push(g);
            totalGapUsage += g;
        }

        const availH = H - (padY * 2) - totalGapUsage;

        let cursorY = padY;

        blocks.forEach((b, i) => {
            if (b.weight < 0.01) return; // Skip invisible

            const h = (b.weight / totalWeight) * availH;

            ctx.fillStyle = `hsl(${b.h}, ${b.s}%, ${b.l}%)`;
            ctx.fillRect(padX, cursorY, W - (padX * 2), h);

            cursorY += h;

            // Add gap if not last
            if (i < blocks.length - 1) {
                cursorY += gapSizes[i];
            }
        });

        ctx.filter = 'none';
        tex.needsUpdate = true;
    };
}

window.createAnnexInterior = createAnnexInterior;
function createToiletInterior() {

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0x8888aa, roughness: 0.2 });
    const toiletGroup = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 32), ceramicMat);
    bowl.position.y = 0.3; bowl.castShadow = true; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat);
    tank.position.set(0, 0.85, -0.3); tank.castShadow = true; toiletGroup.add(tank);

    // Water in Bowl
    const waterGeo = new THREE.CircleGeometry(0.3, 32);
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.4;
    toiletGroup.add(water);

    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.1 });
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 24, 64), blackWoodMat);
    seat.rotation.x = -Math.PI / 2;
    // seat.rotation.z = Math.PI; 
    seat.position.y = 0.6; // Sit nicely on rim
    // seat.scale.set(1, 1.2, 1);
    seat.castShadow = true;
    toiletGroup.add(seat);

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    // Shelf
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    // Narrow Shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), woodMat);
    shelf.position.set(0, 3.2, shelfZ);
    shelf.castShadow = true;
    interiorGroup.add(shelf);

    // Enlarged Notepad with BOLDER CENTERED TEXT
    const padGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const notepad = new THREE.Mesh(padGeo, padMat);
    notepad.position.set(0.3, 0.045, 0.05);
    notepad.castShadow = true;

    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = 512; lineCanvas.height = 512; // Higher res for clear text
    const lctx = lineCanvas.getContext('2d');
    lctx.fillStyle = '#ffeb3b'; lctx.fillRect(0, 0, 512, 512);
    // Lines
    lctx.fillStyle = '#ccc'; for (let i = 60; i < 512; i += 60) lctx.fillRect(0, i, 512, 2);
    // TEXT: "NOTEPAD" - BOLD & CENTERED
    lctx.fillStyle = '#000000';
    lctx.font = '900 80px "Glass Antiqua", cursive'; // Unification
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';

    // Visualize center of pad. 
    // Texture maps to Top face. Width=X, Height=Z.
    // Text should be centered.
    lctx.fillText("NOTEPAD", 256, 256);

    notepad.material.map = new THREE.CanvasTexture(lineCanvas);
    notepad.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(notepad);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(notepad);

    // HOLOGRAM "WRITE IDEAS"
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512; holoCanvas.height = 512;
    const hctx = holoCanvas.getContext('2d');

    // Glow
    const g = hctx.createRadialGradient(256, 256, 80, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    hctx.fillStyle = g; hctx.fillRect(0, 0, 512, 512);

    // Text "WRITE IDEAS"
    hctx.fillStyle = '#ccffff';
    hctx.shadowColor = "#00ffff"; hctx.shadowBlur = 10;
    hctx.font = 'bold 60px "Glass Antiqua", cursive'; hctx.textAlign = "center";
    hctx.fillText("WRITE", 256, 220);
    hctx.fillText("IDEAS", 256, 290);

    const holoTex = new THREE.CanvasTexture(holoCanvas);
    const holoMat = new THREE.MeshBasicMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const holoMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), holoMat);
    holoMesh.position.set(0.3, 1.2, 0.05); // Above notepad
    holoMesh.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(holoMesh);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(holoMesh);

    // VISIBLE LAMP FIXTURE & COZY LIGHT
    const lampGroup = new THREE.Group();

    lampGroup.position.set(0, 2.8, -0.45);
    shelf.add(lampGroup);

    // Fixture
    const fixtureGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x336699, metalness: 0.8, roughness: 0.2 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.rotation.x = Math.PI / 2;
    lampGroup.add(fixture);

    // Bulb/Glass (Warm Yellow)
    const bulbGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.z = 0.1;
    lampGroup.add(bulb);

    // COZY WARM LIGHT
    const backLight = new THREE.PointLight(0xffaa33, 0.15, 15);
    backLight.castShadow = true;
    backLight.shadow.mapSize.width = 1024; // Sharp Shadows
    backLight.shadow.mapSize.height = 1024;
    backLight.shadow.bias = -0.0001;
    lampGroup.add(backLight);

    // V: FLICKER ANIMATION (Stronger)
    lampGroup.userData = {
        baseIntensity: 0.15,
        update: function (t) {
            // Frequent Flicker (15% chance)
            if (Math.random() > 0.85) {
                // Stronger flicker range
                const flicker = (Math.random() - 0.5) * 0.4;
                backLight.intensity = Math.max(0.1, this.baseIntensity + flicker);

                // Visible Bulb Dimming
                const dim = 1 + flicker * 2;
                bulb.material.color.setHSL(0.08, 0.9, 0.5 * dim);
            } else {
                // Restore stability
                backLight.intensity += (this.baseIntensity - backLight.intensity) * 0.2;
                bulb.material.color.setHex(0xffaa33);
            }
        }
    };


    if (typeof addReflectionMarker === 'function') addReflectionMarker('toilet', 1.2, 1.5, 0);
}
function createBedroomInterior() {
    // BED
    const bedGroup = new THREE.Group();

    // -- DARK FLOOR
    const darkFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
    darkFloor.rotation.x = -Math.PI / 2; darkFloor.position.y = 0.01;
    interiorGroup.add(darkFloor);

    // Dark Grey Mattress
    const mattressColor = 0x555555;
    const matMat = new THREE.MeshStandardMaterial({ color: mattressColor });
    const cornerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);

    // 4 Corners
    const c1 = new THREE.Mesh(cornerGeo, matMat); c1.position.set(2.0, 0.5, 2.5); bedGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, matMat); c2.position.set(-2.0, 0.5, 2.5); bedGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, matMat); c3.position.set(2.0, 0.5, -2.5); bedGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, matMat); c4.position.set(-2.0, 0.5, -2.5); bedGroup.add(c4);

    // Fillers (Cross Shape)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 5.8), new THREE.MeshStandardMaterial({ color: 0x150b04 }));
    frame.position.y = 0.2; bedGroup.add(frame);
    const mainMattress = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.6, 6.0), matMat); mainMattress.position.y = 0.5; bedGroup.add(mainMattress);
    const crossMattress = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 5.0), matMat); crossMattress.position.y = 0.5; bedGroup.add(crossMattress);

    // Duvet
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 4.5), new THREE.MeshStandardMaterial({ color: 0x3d0f17 }));
    duvet.position.set(0, 0.8, -0.5); bedGroup.add(duvet);
    // PILLOW
    const pillowGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0x666666 })); // Dark Grey
    pillow.rotation.z = Math.PI / 2; // Lie horizontal
    pillow.scale.set(0.6, 1, 1); // Flatten height (local X)
    pillow.position.set(0, 0.85, 2.2);
    bedGroup.add(pillow);

    bedGroup.position.set(2.5, 0, -1);
    interiorGroup.add(bedGroup);

    // DESK
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x1e100b }));
    desk.position.set(-2.5, 0.6, -3); interiorGroup.add(desk);

    // Lamp on Table (Corner)
    const lampGroup = new THREE.Group();
    // Base
    lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x111111 })));
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    pole.position.y = 0.4; lampGroup.add(pole);
    // Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xcc8800, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    shade.position.y = 0.7; lampGroup.add(shade);
    const bulb = new THREE.PointLight(0xffaa00, 2.5, 8);
    bulb.position.y = 0.6;
    lampGroup.add(bulb);

    // Position on Desk (Left Back Corner)
    // Scale Up 2x
    lampGroup.scale.set(2, 2, 2);
    lampGroup.position.set(-3.8, 1.2, -3.5);
    interiorGroup.add(lampGroup);

    // WALL MOUNTED VIDEO PLAYER
    const phone = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
    phone.position.set(1.5, 4.5, -4.95);
    phone.userData = { type: 'videoPhone', state: 'stopped' };
    interiorGroup.add(phone);
    interiorClickables.push(phone);
    // V-FIX 2: Ensure UI refers to the correct element (Fixes takeover from Living Room)
    window.videoElement = videoElement || document.getElementById('generic-video');

    videoTexture = new THREE.VideoTexture(videoElement);
    // Force src to Bedroom Playlist (Fixes "wrong video" if coming from other room)
    if (roomContent.bedroom.videoPlaylist && roomContent.bedroom.videoPlaylist.length > 0) {
        videoElement.crossOrigin = "anonymous"; // must be before .src
        videoElement.src = roomContent.bedroom.videoPlaylist[0].src;
        videoElement.load(); // Ensure video is loaded
        videoElement.pause(); // Start Paused
        console.log('🎬 Bedroom video initialized:', videoElement.src);
    }

    const phoneScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.6), new THREE.MeshBasicMaterial({ map: videoTexture }));
    phoneScreenMesh.position.set(0, 0, 0.06);
    phoneScreenMesh.name = 'screen';
    phoneScreenMesh.userData = {
        type: 'screen',
        onClick: () => {
            if (window.videoElement.paused) {
                // Determine playlist index.
                let targetIdx = (typeof window.masterVideoIndex !== 'undefined' && window.masterVideoIndex >= 0)
                    ? window.masterVideoIndex
                    : 0;

                // Resume if it's the same video, else use playVideo (which calls startVideoClip)
                const currentSrc = window.videoElement.src;
                const targetClip = roomContent.bedroom.videoPlaylist[targetIdx];

                if (currentSrc.includes(targetClip.src) && window.videoElement.readyState >= 2) {
                    window.videoElement.play();
                    // Dim lights
                    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.005 }, 1000).start();
                    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.01 }, 1000).start();
                    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.01 }, 1000).start();
                } else {
                    playVideo(targetIdx);
                }
            } else {
                window.videoElement.pause();
                // Restore lights but DON'T clear src yet (allow resume)
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.25 }, 1000).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.3 }, 1000).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.3 }, 1000).start();

                // Update UI state
                if (window.updateVideoUI) window.updateVideoUI();
                if (window.interiorClickables) {
                    const ctrlBtn = window.interiorClickables.find(
                        c => c && c.userData && c.userData.type === 'videoControlSingle'
                    );
                    if (ctrlBtn) {
                        ctrlBtn.material.color.setHex(0xffff00); // Yellow for Paused
                        ctrlBtn.material.emissive.setHex(0x444400);
                    }
                }
            }
        }
    };
    phone.add(phoneScreenMesh);
    interiorClickables.push(phoneScreenMesh);

    if (roomContent.bedroom.videoPlaylist) {
        // Universal Video UI
        if (window.createUniversalVideoInterface) {
            const videoPos = new THREE.Vector3(-1.8, 4.2, -4.8);
            window.createUniversalVideoInterface(interiorGroup, videoPos, roomContent.bedroom.videoPlaylist, {
                onPlay: playVideo
            });
        } else {
            console.warn('⚠️ createUniversalVideoInterface not found');
        }
    }

    const shelfGeo = new THREE.BoxGeometry(0.8, 0.1, 1.2);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(-4.6, 3.5, 3.0);
    interiorGroup.add(shelf);

    // Drop Shadow for Shelf
    const shadowGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-4.6, 3.45, 3.0);
    interiorGroup.add(shadow);

    // Lava Lamp
    createLavaLamp(0.108, shelf.position);

    if (typeof addReflectionMarker === 'function') addReflectionMarker('bedroom', 4, 1.5, 0);
}

function createLavaLamp(scale = 1.0, anchorPos = new THREE.Vector3(0, 0, 0)) {
    const lampGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x080808,
        metalness: 1.0,
        roughness: 0.05
    });

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 2.2, 4.2, 32);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -4.5;
    lampGroup.add(base);

    // Cap
    const topGeo = new THREE.CylinderGeometry(0.6, 1.2, 2, 32);
    const topCap = new THREE.Mesh(topGeo, metalMat);
    topCap.position.y = 7.0;
    lampGroup.add(topCap);

    // Glass
    const glassGeo = new THREE.CylinderGeometry(1.1, 1.5, 10, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.0,
        transmission: 0.96,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        ior: 1.5,
        reflectivity: 1.0,
        clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 1.0;
    lampGroup.add(glass);

    // Liquid Core
    const coreGeo = new THREE.CylinderGeometry(0.98, 1.38, 9.8, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        transparent: true,
        opacity: 0.5,
        emissive: 0xff2200,
        emissiveIntensity: 1.2
    });
    const liquidCore = new THREE.Mesh(coreGeo, coreMaterial);
    liquidCore.position.y = 1.0;
    lampGroup.add(liquidCore);

    // Lights
    const internalPointLight = new THREE.PointLight(0xff4d00, 1.5, 5);
    internalPointLight.position.set(0, 0, 0);
    lampGroup.add(internalPointLight);

    const baseLight = new THREE.PointLight(0xff4d00, 1.5, 3);
    baseLight.position.set(0, -4.5, 0);
    lampGroup.add(baseLight);

    // Blobs
    const lavaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        emissive: 0xff4d00,
        emissiveIntensity: 4.0,
        roughness: 0.0
    });

    const blobs = [];
    const blobCount = 5;
    for (let i = 0; i < blobCount; i++) {
        const size = 0.6 + Math.random() * 0.7;
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const blob = new THREE.Mesh(geo, lavaMaterial);

        blob.userData = {
            yOffset: Math.random() * 10,
            speed: 0.5 + Math.random() * 0.5,
            rotationPhase: Math.random() * Math.PI * 2,
            baseSize: size,
            driftSpeed: 1.0 + Math.random() * 1.0
        };

        blobs.push(blob);
        lampGroup.add(blob);
    }

    // Animation Logic attached to Group
    let colorHue = 0.05;

    lampGroup.scale.set(scale, scale, scale);

    // Position: On Top of the Shelf
    let yPos = 1.2; // Fallback
    if (anchorPos) {
        yPos = anchorPos.y + 0.05 + (6.6 * scale);
    }

    let xPos = -1.2;
    let zPos = -3.5;
    if (anchorPos) {
        xPos = anchorPos.x;
        zPos = anchorPos.z;
    }

    lampGroup.position.set(xPos, yPos, zPos);

    lampGroup.userData.update = function (t) {
        // Color Shift
        colorHue += 0.001; // Slower
        if (colorHue > 1) colorHue = 0;
        const newColor = new THREE.Color();
        newColor.setHSL(colorHue, 1.0, 0.5);

        lavaMaterial.color.copy(newColor);
        lavaMaterial.emissive.copy(newColor);
        coreMaterial.color.copy(newColor);
        coreMaterial.emissive.copy(newColor);
        baseLight.color.copy(newColor);
        internalPointLight.color.copy(newColor);

        // Blobs
        blobs.forEach((blob) => {
            const data = blob.userData;
            const yAmplitude = 4.3;
            const yBase = 0.5;
            const timeVal = t;
            const yPos = yBase + Math.sin(timeVal * data.speed + data.yOffset) * yAmplitude;
            const normalizedY = (yPos - (yBase - yAmplitude)) / (yAmplitude * 2);
            const currentBottleRadius = 1.5 - (normalizedY * 0.4);
            const heightScaleFactor = 1.0 - (normalizedY * 0.5);
            // safeRadius adjusted to keep blobs inside
            const safeRadius = (currentBottleRadius - (data.baseSize * heightScaleFactor)) * 0.7;

            blob.position.y = yPos;
            blob.position.x = Math.sin(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;
            blob.position.z = Math.cos(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;

            const pulse = 1 + Math.sin(timeVal * 1.5 + data.yOffset) * 0.1;
            const finalScale = heightScaleFactor * pulse;
            blob.scale.set(finalScale, finalScale, finalScale);
        });
    };

    interiorGroup.add(lampGroup);
}

function nextBedroomVideo() {
    window.masterVideoIndex = ((window.masterVideoIndex || 0) + 1) % roomContent.bedroom.videoPlaylist.length;
    startVideoClip('bedroom');
    // Update UI
    if (window.updateVideoUI) window.updateVideoUI();
}

// Helper to Stop Video & Reset Lights (Bedroom specific)
window.stopBedroomVideo = function () {
    if (window.videoElement) {
        window.videoElement.pause();
        window.videoElement.muted = true;
        window.videoElement.volume = 0;
        window.videoElement.src = '';
        window.videoElement.load();
        window.videoElement.loop = false; // V-FIX: Reset loop!
    }

    // Restore Bedroom Defaults (Matches house.js ApplyRoomLighting V115)
    // Ambient 0.25, Dir 0.3, Rim 0.3
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.25 }, 1000).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.3 }, 1000).start();
    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.3 }, 1000).start();
};

function playVideo(index) {
    const playlist = window.roomContent.bedroom.videoPlaylist;
    if (!playlist || !playlist[index]) return;

    window.masterVideoIndex = index;
    startVideoClip('bedroom');

    // Make the room dark for the video
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.005 }, 1000).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.01 }, 1000).start();
    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.01 }, 1000).start();

    // Sync UI if available
    if (window.updateVideoUI) window.updateVideoUI();
}
window.createStudioInterior = function () {
    // -- STUDIO INTERIOR (Standard File Remastered) --

    // 1. FURNITURE
    // Scaling Group for Furniture
    const furnGroup = new THREE.Group();
    furnGroup.scale.set(1.25, 1.25, 1.25);
    interiorGroup.add(furnGroup);

    // Desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 1.5), deskMat);
    desk.position.set(0, 1.0, -1.5);
    desk.castShadow = true;
    furnGroup.add(desk);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.0, 0.1);
    const fl = new THREE.Mesh(legGeo, deskMat); fl.position.set(-1.4, -0.5, 0.65); fl.castShadow = true; desk.add(fl);
    const fr = new THREE.Mesh(legGeo, deskMat); fr.position.set(1.4, -0.5, 0.65); fr.castShadow = true; desk.add(fr);
    const bh = new THREE.Mesh(legGeo, deskMat); bh.position.set(-1.4, -0.5, -0.65); bh.castShadow = true; desk.add(bh);
    const br = new THREE.Mesh(legGeo, deskMat); br.position.set(1.4, -0.5, -0.65); br.castShadow = true; desk.add(br);

    // Laptop (Interactive)
    const laptopGroup = new THREE.Group();
    laptopGroup.scale.set(1.33, 1.33, 1.33);

    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    lapScreen.position.set(0, 0.2, -0.2);
    lapScreen.rotation.x = 0.2;
    const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0044aa }));
    screenGlow.position.z = 0.02;
    lapScreen.add(screenGlow);
    laptopGroup.add(lapBase); laptopGroup.add(lapScreen);
    laptopGroup.position.set(0, 0.15, 0);
    desk.add(laptopGroup);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.userData = { type: 'laptop' };
    hitBox.position.y = 0.3;
    laptopGroup.add(hitBox);
    if (window.interiorClickables) window.interiorClickables.push(hitBox);

    // "EXPAND YOUR MIND" Hologram
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512; holoCanvas.height = 256;
    const hctx = holoCanvas.getContext('2d');

    // Gradient Glow
    const grd = hctx.createRadialGradient(256, 128, 20, 256, 128, 200);
    grd.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    hctx.fillStyle = grd;
    hctx.fillRect(0, 0, 512, 256);

    // Text
    hctx.font = 'bold 40px "Glass Antiqua", cursive';
    hctx.textAlign = 'center';
    hctx.textBaseline = 'middle';
    hctx.shadowColor = 'cyan';
    hctx.shadowBlur = 10;

    // For static canvas, just draw once. 
    hctx.fillStyle = '#ccffff';
    hctx.fillText("EXPAND", 256, 80);
    hctx.fillText("YOUR MIND", 256, 150);

    const deskHoloTex = new THREE.CanvasTexture(holoCanvas);
    const deskHoloMat = new THREE.MeshBasicMaterial({
        map: deskHoloTex,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const deskHoloMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), deskHoloMat);
    deskHoloMesh.position.set(0, 0.8, 0); // Above laptop
    deskHoloMesh.userData = { type: 'studioHologram' }; // Clickable
    laptopGroup.add(deskHoloMesh);

    // Add to clickables so the raycaster hits it
    if (window.interiorClickables) window.interiorClickables.push(deskHoloMesh);

    // Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x332211 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), chairMat);
    seat.position.set(0, 0.8, 0.5);
    seat.castShadow = true;
    furnGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), chairMat);
    back.position.set(0, 0.5, 0.4);
    seat.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), chairMat);
    stem.position.set(0, -0.4, 0);
    seat.add(stem);

    // Rug
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0xAA0f31 }));
    rug.position.set(0, 0.02, 0);
    rug.receiveShadow = true;
    furnGroup.add(rug);

    // 2. VIDEO POSTERS
    const createVideoPoster = (src, opacity = 1) => {
        const vid = document.createElement('video');
        vid.src = src;
        vid.loop = true;
        vid.muted = true;
        vid.preload = 'auto';
        vid.crossOrigin = "anonymous";
        vid.setAttribute('playsinline', '');
        vid.setAttribute('loop', ''); // Explicitly set loop attribute
        vid.style.position = 'fixed';
        vid.style.top = '-10000px';
        vid.style.left = '-10000px';
        document.body.appendChild(vid);

        // Add ended event listener as a fallback to ensure looping
        vid.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play().catch(() => { });
        });

        vid.load();
        const p = vid.play();
        if (p !== undefined) {
            p.catch(error => {
                console.error("Auto-play blocked for " + src, error);
            });
        }

        const tex = new THREE.VideoTexture(vid);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            uniform sampler2D map;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(map, vUv);
                float dist = length(vUv - 0.5) * 1.414; 
                float feather = smoothstep(0.1, 0.8, dist); 
                color.a *= opacity * (1.0 - feather);
                gl_FragColor = color;
            }
        `;

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: tex },
                opacity: { value: opacity }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 6.3), mat);
        mesh.userData = { isVideo: true, videoElement: vid };
        return { mesh: mesh, video: vid };
    };

    // Metropolis (Right/'Back' Wall)
    const mepo = createVideoPoster('/assets/video/mepo.mp4', 0.8);
    mepo.mesh.position.set(1.0, 5, -4.9);
    interiorGroup.add(mepo.mesh);

    // Tron (Left Wall)
    const tron = createVideoPoster('/assets/video/tronai.mp4', 0.9);
    tron.mesh.scale.set(0.75, 0.75, 0.75);
    tron.mesh.position.set(-4.9, 5, 3.5);
    tron.mesh.rotation.y = Math.PI / 2;
    interiorGroup.add(tron.mesh);

    // Store video references globally for keepalive monitoring
    window.studioVideos = [mepo.video, tron.video];

    // Keepalive: Ensure videos keep playing even if something tries to pause them
    if (window.studioVideoMonitor) clearInterval(window.studioVideoMonitor);
    window.studioVideoMonitor = setInterval(() => {
        if (currentRoom === 'studio' && window.studioVideos) {
            window.studioVideos.forEach(vid => {
                if (vid && vid.paused && vid.readyState >= 2) {
                    vid.play().catch(() => { });
                }
            });
        }
    }, 1000); // Check every second

    // 3. MOLECULE (Atom Group)
    atomGroup = new THREE.Group();
    atomGroup.position.set(-3, 4, -3);
    interiorGroup.add(atomGroup);

    // nugget as nucleus
    if (typeof addReflectionMarker === 'function') {
        const studioNugget = addReflectionMarker('studio', 0, 0, 0);
        interiorGroup.remove(studioNugget); // Standard call puts it in interiorGroup
        atomGroup.add(studioNugget); // Move it to atomGroup center
    }

    const createOrbit = (rx, ry, rz, color, speedMult = 1) => {
        const orbitGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 50);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        orbitGroup.add(ring);

        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: color }));
        electron.position.x = 1.5;
        orbitGroup.add(electron);

        orbitGroup.rotation.set(rx, ry, rz);
        orbitGroup.userData = { speed: (Math.random() * 0.05 + 0.02) * speedMult, electron: electron };
        atomGroup.add(orbitGroup);
    };

    createOrbit(0, 0, 0, 0xff0000);
    createOrbit(Math.PI / 2, 0, 0, 0xffff00, 3.0); // Yellow electron 3x faster
    createOrbit(0, Math.PI / 2, Math.PI / 4, 0x00ccff);

    // 4. R2-D2 IN RIGHT CORNER
    createR2D2InCorner();
}

window.createR2D2InCorner = function () {
    const r2d2Group = new THREE.Group();
    r2d2Group.scale.set(0.33, 0.33, 0.33);
    r2d2Group.position.set(3.5, 0, -3.5);
    r2d2Group.rotation.y = -Math.PI / 4;
    interiorGroup.add(r2d2Group);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.32;

    // Body Group
    const bodyGroup = new THREE.Group();
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 40), white);
    bodyCyl.castShadow = true;
    bodyGroup.add(bodyCyl);

    // Body Details
    const ventGeo = new THREE.BoxGeometry(0.6, 0.4, 0.1);
    const vent1 = new THREE.Mesh(ventGeo, blue);
    vent1.position.set(0.4, 0.5, 1.35);
    bodyGroup.add(vent1);
    const vent2 = new THREE.Mesh(ventGeo, blue);
    vent2.position.set(-0.4, 0.5, 1.35);
    bodyGroup.add(vent2);

    // R2-D2 Body Rings
    const ringGeo = new THREE.TorusGeometry(1.41, 0.015, 8, 40);
    const ring1 = new THREE.Mesh(ringGeo, dark);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.8;
    bodyGroup.add(ring1);
    const ring2 = ring1.clone();
    ring2.position.y = -0.8;
    bodyGroup.add(ring2);

    bodyGroup.rotation.x = bodyTiltAngle;
    bodyGroup.position.y = bodyPivotY;
    r2d2Group.add(bodyGroup);

    // Dome
    const domeGroup = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), silver);
    domeGroup.add(dome);

    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20), dark);
    eye.rotation.x = Math.PI / 2;
    eye.position.set(0, 0.75, 1.3);
    domeGroup.add(eye);

    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12), silver);
    proj.rotation.x = 0.6;
    proj.position.set(0, 0.35, 1.3);
    domeGroup.add(proj);

    // Blinking Lights
    const lightRed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    lightRed.position.set(0.4, 0.6, 1.25);
    domeGroup.add(lightRed);
    const lightBlue = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    lightBlue.position.set(-0.4, 0.7, 1.25);
    domeGroup.add(lightBlue);
    const lightGreen = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff44 }));
    lightGreen.position.set(0, 0.9, 1.1);
    domeGroup.add(lightGreen);

    domeGroup.position.y = 1.5;
    bodyGroup.add(domeGroup);

    // FOOT
    function createFoot() {
        const foot = new THREE.Group();
        const footTop = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), white);
        footTop.scale.set(1, 1, 2.2);
        foot.add(footTop);
        return foot;
    }

    // Side Legs
    function createSideLeg(side) {
        const legGroup = new THREE.Group();
        const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), white);
        joint.rotation.z = Math.PI / 2;
        joint.position.x = side * 1.5;
        legGroup.add(joint);

        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.4, sideLegHeight, 0.7), white);
        strut.position.y = -sideLegHeight / 2;
        strut.position.x = side * 1.5;
        legGroup.add(strut);

        const foot = createFoot();
        foot.position.y = -sideLegHeight;
        foot.position.z = 0.1;
        foot.position.x = side * 1.5;
        legGroup.add(foot);

        legGroup.position.y = bodyPivotY;
        return legGroup;
    }

    r2d2Group.add(createSideLeg(1));
    r2d2Group.add(createSideLeg(-1));

    // Central Leg
    const centralLeg = new THREE.Group();
    const legSlant = -0.3;
    const cStrutHeight = 1.2;
    const cStrut = new THREE.Mesh(new THREE.BoxGeometry(0.4, cStrutHeight, 0.4), white);
    cStrut.position.y = -cStrutHeight / 2;
    centralLeg.add(cStrut);

    const cFoot = createFoot();
    cFoot.rotation.x = Math.abs(bodyTiltAngle) + Math.abs(legSlant);
    cFoot.position.y = -cStrutHeight;
    cFoot.position.z = 0.05;
    centralLeg.add(cFoot);

    centralLeg.position.set(0, -1.2, 0);
    centralLeg.rotation.x = legSlant;
    bodyGroup.add(centralLeg);

    // HOLOGRAM
    const vid = document.createElement('video');
    vid.src = '/assets/video/hologram.mp4';
    vid.loop = true;
    vid.muted = true;
    vid.preload = 'auto';
    vid.crossOrigin = "anonymous";
    vid.setAttribute('playsinline', '');
    vid.style.position = 'fixed';
    vid.style.top = '-10000px';
    vid.style.left = '-10000px';
    document.body.appendChild(vid);

    vid.load();
    const p = vid.play();
    if (p !== undefined) {
        p.catch(error => console.error("Auto-play blocked for hologram", error));
    }

    const holoTex = new THREE.VideoTexture(vid);
    holoTex.minFilter = THREE.LinearFilter;
    holoTex.magFilter = THREE.LinearFilter;

    const hologramGroup = new THREE.Group();

    const beamGeo = new THREE.ConeGeometry(0.35, 6, 32, 12, true);
    beamGeo.translate(0, -3, 0);

    const beamMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x44eeff) }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // High energy jitter
                float jitter = fract(sin(time * 10.0 + position.y * 20.0)) * 0.12;
                pos.x += jitter;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            
            void main() {
                // Finer grain for "particle cloud" look
                float grain = hash(vUv * 800.0 + time * 8.0);
                
                // Volume envelope - MUCH BLURRIER
                // Softer smoothsteps create a hazier, less defined edge
                float envelope = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.3, vUv.y);
                float sideFade = pow(sin(vUv.x * 3.14159), 3.0); 
                
                // Glitchy horizontal line cuts - less "ring-like"
                float glitchLines = step(0.98, hash(vec2(floor(time * 20.0), floor(vUv.y * 120.0))));
                
                // Pulsing glow - Removed vUv.y dependency to remove "rings" in the beam
                float pulse = 0.7 + 0.3 * sin(time * 12.0);
                
                // Final alpha combines grain (particles) with the volume shape
                float alpha = (grain * 0.4 + 0.6) * envelope * sideFade * pulse;
                alpha += glitchLines * 0.5;
                
                // Glowing color with random flicker
                float flicker = 0.5 + 0.5 * hash(vec2(time * 15.0, 0.0));
                vec3 finalColor = color + vec3(glitchLines * 0.7);
                
                gl_FragColor = vec4(finalColor, alpha * 0.35 * flicker);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.rotation.x = Math.PI;
    hologramGroup.add(beamMesh);

    const holoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        new THREE.ShaderMaterial({
            uniforms: {
                map: { value: holoTex },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float time;
                varying vec2 vUv;
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                }
                void main() {
                    vec2 uv = vUv;
                    
                    float glitchTime = floor(time * 12.0);
                    if (hash(vec2(glitchTime, 0.0)) > 0.85) {
                        uv.x += (hash(vec2(glitchTime, floor(uv.y * 10.0))) - 0.5) * 0.15;
                    }

                    float splitAmount = 0.012 + noise(vec2(time * 8.0, uv.y * 20.0)) * 0.02;
                    vec4 texColorR = texture2D(map, uv + vec2(splitAmount, 0.0));
                    vec4 texColorG = texture2D(map, uv);
                    vec4 texColorB = texture2D(map, uv - vec2(splitAmount, 0.0));
                    vec4 texColor = vec4(texColorR.r, texColorG.g, texColorB.b, texColorG.a);
                    
                    float greenness = texColor.g - max(texColor.r, texColor.b);
                    float alpha = 1.0 - smoothstep(0.2, 0.4, greenness);
                    
                    float flicker = 0.7 + hash(vec2(time * 30.0, 0.0)) * 0.3;
                    float scanline = sin(uv.y * 200.0 + time * 15.0) * 0.1 + 0.9;
                    float dropout = step(0.94, hash(vec2(time * 10.0, 0.0))); 
                    
                    float finalAlpha = alpha * flicker * scanline * (1.0 - dropout) * 0.85;
                    
                    gl_FragColor = vec4(texColor.rgb + vec3(noise(uv*50.0 + time)*0.1), finalAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );
    holoPlane.position.y = 6;
    holoPlane.rotation.y = Math.PI;
    hologramGroup.add(holoPlane);

    hologramGroup.position.set(0, 0.35, 1.3);
    hologramGroup.rotation.x = 0.7;
    hologramGroup.scale.set(1.5, 1.5, 1.5);
    domeGroup.add(hologramGroup);

    hologramGroup.userData.update = function (t) {
        // Fast time
        const fastTime = t * 1.5;
        if (beamMat.uniforms) beamMat.uniforms.time.value = fastTime;
        if (holoPlane.material.uniforms) holoPlane.material.uniforms.time.value = fastTime;
    };

    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    const studioLight = new THREE.PointLight(0xffffff, 0.4, 15);
    studioLight.position.set(0, 5, 0);
    studioLight.castShadow = true;
    studioLight.shadow.bias = -0.0001;
    studioLight.shadow.mapSize.width = 1024;
    studioLight.shadow.mapSize.height = 1024;
    studioLight.shadow.camera.near = 0.5;
    studioLight.shadow.camera.far = 15;
    interiorGroup.add(studioLight);

    if (!window.r2d2Elements) window.r2d2Elements = [];
    window.r2d2Elements.push({
        domeGroup: domeGroup,
        lightRed: lightRed,
        lightBlue: lightBlue,
        lightGreen: lightGreen,
        hologramGroup: hologramGroup,
        holoPlane: holoPlane,
        beamMat: beamMat
    });
}

// ===============================================
// GARAGE INTERIOR - Portal to the Void
// ===============================================
function createGarageInterior() {

    // Dark ambient garage environment
    const ambientDim = new THREE.AmbientLight(0x1a1a2a, 0.2);
    interiorGroup.add(ambientDim);

    // Dim overhead light
    const garageLight = new THREE.PointLight(0x4a4a3a, 0.5, 8);
    garageLight.position.set(0, 2.5, 0);
    interiorGroup.add(garageLight);

    // --- PARALLAX VOID PORTAL ---
    const voidPortalGroup = new THREE.Group();
    voidPortalGroup.position.set(0, 1.5, -2.3); // Back wall

    // Create layered starfield for parallax effect
    const layers = [
        { distance: -4, size: 10, numStars: 200, brightness: 0.3 },
        { distance: -2, size: 8, numStars: 150, brightness: 0.6 },
        { distance: -0.5, size: 6, numStars: 100, brightness: 1.0 }
    ];

    layers.forEach((layer, layerIndex) => {
        const layerGroup = new THREE.Group();
        layerGroup.position.z = layer.distance;

        // Stars
        const starGeo = new THREE.BufferGeometry();
        const pos = [];
        for (let i = 0; i < layer.numStars; i++) {
            pos.push(
                (Math.random() - 0.5) * layer.size,
                (Math.random() - 0.5) * layer.size,
                (Math.random() - 0.5) * 0.5
            );
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        const starMat = new THREE.PointsMaterial({
            size: 0.06,
            color: 0xffffff,
            transparent: true,
            opacity: layer.brightness
        });
        const stars = new THREE.Points(starGeo, starMat);
        layerGroup.add(stars);

        // Nebula glow
        const nebulaCanvas = document.createElement('canvas');
        nebulaCanvas.width = 512;
        nebulaCanvas.height = 512;
        const ctx = nebulaCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        grad.addColorStop(0, 'rgba(100, 50, 150, 0.4)');
        grad.addColorStop(0.7, 'rgba(50, 20, 80, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        const nebulaTex = new THREE.CanvasTexture(nebulaCanvas);
        const nebulaMat = new THREE.MeshBasicMaterial({
            map: nebulaTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const nebulaMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(layer.size, layer.size),
            nebulaMat
        );
        layerGroup.add(nebulaMesh);

        // Store parallax speed
        layerGroup.userData.parallaxSpeed = (3 - layerIndex) * 0.3;
        voidPortalGroup.add(layerGroup);
    });

    interiorGroup.add(voidPortalGroup);

    // --- CLICKABLE VOID ENTRANCE ---
    const voidEntrance = new THREE.Mesh(
        new THREE.PlaneGeometry(4.5, 4.5),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide
        })
    );
    voidEntrance.position.set(0, 1.5, -2.2);
    voidEntrance.userData = {
        type: 'voidEntrance',
        name: 'VoidEntrance',
        tooltip: 'ENTER THE VOID',
        onClick: () => {

            // Play door opening sound
            const openSound = new Audio('https://www.tonicforthebones.com/assets/audio/garage-door-opening.mp3');
            openSound.volume = 0.7;
            openSound.play().catch(() => { });

            // Enter space room
            if (window.enterRoom) {
                window.enterRoom('space');
            }
        }
    };
    interiorGroup.add(voidEntrance);
    interiorClickables.push(voidEntrance);

    // --- PARALLAX UPDATE FUNCTION ---
    voidPortalGroup.userData.update = function (deltaTime, camera) {
        if (camera) {
            const camAngle = Math.atan2(camera.position.x, camera.position.z);
            voidPortalGroup.children.forEach(layer => {
                const speed = layer.userData.parallaxSpeed || 0;
                layer.rotation.y = camAngle * 0.08 * speed;
            });
        }
    };

    // Make parallax active during updates
    window.garageVoidPortal = voidPortalGroup;
}

// Make garage interior function globally available
window.createGarageInterior = createGarageInterior;
