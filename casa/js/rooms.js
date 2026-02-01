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
    pctx.font = '14px Arial'; pctx.shadowBlur = 0;
    // V326: Version string removed per user request
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
        sctx.fillStyle = isCurrent ? '#aaff00' : '#cccccc';
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
function createHallInterior() {
    // -- BACKGROUND VIDEO --
    videoElement.src = "../assets/video/dots.mp4";
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));

    videoTexture = new THREE.VideoTexture(videoElement);
    // Full wall size (10 width, 8 height)
    const bgGeo = new THREE.PlaneGeometry(10, 8);
    const bgMat = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0.6, // V209: Adjusted brightness (was 0.3)
        blending: THREE.AdditiveBlending
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 4.0, -4.95);
    interiorGroup.add(bgMesh);

    // -- LIGHTING ADJUSTMENT --
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // Add Cozy Warm SpotLight
    // V-NEW: Reduced Intensity (2.0 -> 0.5)
    // V311: Significantly brighter (0.25 -> 2.5)
    const cozySpot = new THREE.SpotLight(0xffaa00, 1.5); // V-REFINE: Lower intensity (was 3.5)
    cozySpot.position.set(2, 5, 2); // V-REFINE: Moved down (from 6.0) per Reference
    cozySpot.target.position.set(0, 0, 0);
    cozySpot.angle = Math.PI / 3; // V-REFINE: Narrower (from PI/2.5) per Reference
    cozySpot.penumbra = 0.5; // V-REFINE: Harsher Edge per Reference
    cozySpot.castShadow = true;
    // V-NEW: Strengthen shadows for curtains and R2D2
    cozySpot.shadow.mapSize.width = 2048;
    cozySpot.shadow.mapSize.height = 2048;
    cozySpot.shadow.bias = -0.0001;
    cozySpot.shadow.camera.near = 0.5;
    cozySpot.shadow.camera.far = 20;
    interiorGroup.add(cozySpot);
    interiorGroup.add(cozySpot.target);

    // V-REFINE: Red Room Mood Ambient (Lowered for atmosphere)
    const hallAmbient = new THREE.AmbientLight(0xffffff, 0.15);
    interiorGroup.add(hallAmbient);

    // V-NEW: Additional directional light for stronger shadows
    const shadowLight = new THREE.DirectionalLight(0xffaa00, 0.8);
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
    // Back wall, far right (V-FIX: Shifted forward to avoid clipping)
    createHallCurtain(4.8, 0, -4.4, 0);

    // V-REFINE: Restore "Welcome to Meaning House" wall text (Match Reference)
    const wallTextCanvas = document.createElement('canvas');
    wallTextCanvas.width = 1024; wallTextCanvas.height = 512;
    const wtctx = wallTextCanvas.getContext('2d');
    wtctx.fillStyle = 'white';
    wtctx.textAlign = 'center';
    wtctx.shadowColor = "black"; wtctx.shadowBlur = 5;

    wtctx.font = 'bold 80px "Glass Antiqua", cursive';
    wtctx.fillText("Welcome to", 512, 130);

    wtctx.font = 'bold 110px "Glass Antiqua", cursive'; // Slightly smaller to fit "the House of Meaning"
    wtctx.fillText("the House of Meaning", 512, 250);

    wtctx.font = '40px "Lato", sans-serif';
    wtctx.fillText("Explore // Wonder // Dream", 512, 330);

    wtctx.font = '28px "Lato", sans-serif';
    wtctx.fillText("Big screen and sound recommended", 512, 410);

    const wallTex = new THREE.CanvasTexture(wallTextCanvas);
    const wallTextPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4),
        new THREE.MeshBasicMaterial({ map: wallTex, transparent: true })
    );
    wallTextPlane.position.set(0, 4.0, -4.7);
    interiorGroup.add(wallTextPlane);

    // -- SHADOW UNDER R2D2 --
    // V-REFINE: Ground Shadow logic moved to createR2D2ForHall to avoid reference error
    createR2D2ForHall();
}

function createHallCurtain(x, y, z, rotationY) {
    const curtainGroup = new THREE.Group();
    curtainGroup.position.set(x, y, z);
    curtainGroup.rotation.y = rotationY;

    // V-REFINE: Narrow, Denser, Opaque Draped Curtain
    const width = 1.2; // V-FIX: Narrower to avoid obscuring wall text
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
    // V-FIX: Moved further back (-0.4) to avoid Z-fighting/flickering with waves
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
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10;
    // V209: "INSTRUCTIONS" (V-REFINE: Exact Reference size 50/30)
    ctx.font = 'bold 50px "Courier New", monospace'; ctx.textAlign = "center";
    ctx.fillText("FREE WILL", 256, 230);

    ctx.font = '30px "Courier New", monospace';
    ctx.fillText("DOES NOT EXIST", 256, 280);
    ctx.fillText("CLICK FOR MORE", 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    // DoubleSide so it's visible from all angles as it rotates
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });

    // Vertical Plane inside the ring
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), mat);
    mesh.position.y = 0.5; // Slightly above ring
    // NO ROTATION -> Make sure it faces the entrance (-Z direction) or +Z?
    // Room Camera enters from +Z looking -Z.
    // So Plane should face +Z.
    // Default plane faces +Z. So default rotation is fine.
    group.add(mesh);

    return group;
}

function createR2D2ForHall() {
    const r2d2Group = new THREE.Group();
    // V1: Scale 0.4 (Slightly larger than studio to be visible)
    r2d2Group.scale.set(0.4, 0.4, 0.4);
    // V311: R2D2 starting pos shifted
    r2d2Group.position.set(0, 0, 1.0);
    r2d2Group.rotation.y = 0;
    interiorGroup.add(r2d2Group);

    // V-FIX: Add Ground Shadow directly to the group here (V22)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grd = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.9)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grd;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 1.0, depthWrite: false });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 5.0), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.05, 0);
    r2d2Group.add(shadowMesh);

    // Parent Instructions to R2D2 so they move together
    const instructions = createHologram();
    // Scale BACK UP (Since R2 is 0.4x, we need 2.5x to get back to 1.0 world scale)
    instructions.scale.set(2.5, 2.5, 2.5);
    instructions.position.set(0, 7.0, 1.5); // Floating even higher above R2 (V318)
    r2d2Group.add(instructions);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.1; // Less tilt for standing "happily"

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
    const legSlant = -0.1; // Less slant
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

    // -- HAPPY HEAD ROTATION --
    // Oscillate between -0.5 and 0.5 radians approx
    const startRot = { y: -0.6 };
    const targetRot = { y: 0.6 };

    // Initial Tween
    const tweenRight = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: 0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    const tweenLeft = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: -0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    // Chain them
    tweenRight.chain(tweenLeft);
    tweenLeft.chain(tweenRight);
    tweenRight.start();


    // Complex Patrol Animation
    const p1 = { x: -2.0, z: 1.0, ry: 0.5 };
    const p2 = { x: 2.0, z: -1.0, ry: -0.5 };
    const pHome = { x: 0, z: 1.0, ry: 0 };

    const patrol1 = new TWEEN.Tween(r2d2Group.position)
        .to({ x: p1.x, z: p1.z }, 4000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotate1 = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: p1.ry }, 1000);

    const patrol2 = new TWEEN.Tween(r2d2Group.position)
        .to({ x: p2.x, z: p2.z }, 5000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotate2 = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: p2.ry }, 1000);

    const patrolHome = new TWEEN.Tween(r2d2Group.position)
        .to({ x: pHome.x, z: pHome.z }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotateHome = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: pHome.ry }, 1000);

    // Chain Patrol
    patrol1.chain(rotate1);
    rotate1.chain(patrol2);
    patrol2.chain(rotate2);
    rotate2.chain(patrolHome);
    patrolHome.chain(rotateHome);
    rotateHome.chain(patrol1);

    patrol1.start();

    // Make him clickable? Optional.
    r2d2Group.userData = { type: 'r2d2', name: 'R2D2' };

    // V-FIX 22: Explicit Hitbox for easier clicking (Visible but transparent)
    const hitGeo = new THREE.CylinderGeometry(2.5, 2.5, 7.0, 16);
    const hitMat = new THREE.MeshBasicMaterial({
        visible: true,
        color: 0xffff00,
        wireframe: false,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
    });
    const hitBox = new THREE.Mesh(hitGeo, hitMat);
    hitBox.position.y = 2.0;
    // Name it for debug
    hitBox.userData = { name: "R2D2_HitBox", type: "r2d2" };
    r2d2Group.add(hitBox);

    // V-WORDHUNT: Hidden Orb in R2D2
    if (typeof WordHunt !== 'undefined') {
        console.log("WordHunt Found in Hall. Initializing R2D2 Orb...");
        const item = WordHunt.createInteractable('hall');
        if (item) {
            // Hide inside R2 initially
            item.position.set(0, 1.0, 0);
            item.scale.set(0.1, 0.1, 0.1); // Tiny initially
            item.visible = false;
            r2d2Group.add(item);

            // V-FIX 19: SUPER HITBOX FOR ORB
            // The default one might be too small or bubbling fails.
            // Let's add a massive explicit HitBox to the Orb Item Group.
            const orbHitGeo = new THREE.SphereGeometry(1.0, 16, 16); // Radius 1.0 * Scale 3.0 = HUGE
            const orbHitMat = new THREE.MeshBasicMaterial({ visible: false }); // Invisible Material
            const orbHitBox = new THREE.Mesh(orbHitGeo, orbHitMat);
            orbHitBox.userData.onClick = () => {
                console.log("R2D2 Orb HitBox Clicked!");
                // Call the original handler on the group if it exists
                if (item.userData.onClick) item.userData.onClick();
            };
            orbHitBox.userData.isOrbHitBox = true;
            item.add(orbHitBox);

            // Click Handler for R2D2
            const r2ClickHandler = () => {
                // If orb is already revealed, do nothing (orb itself handles the collection click)
                if (item.userData.revealed) return;

                console.log("R2D2 Clicked! Popping out orb...");
                item.visible = true;
                item.userData.revealed = true;

                // Animate Pop Out (Up and Scale Up)
                new TWEEN.Tween(item.position)
                    .to({ y: 12.5 }, 1500) // V-FIX: Even Higher (12.5)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(() => console.log("Orb Y:", item.position.y)) // Debug
                    .start();

                new TWEEN.Tween(item.scale)
                    .to({ x: 3.0, y: 3.0, z: 3.0 }, 1500) // V-FIX: SUPER BIG (3.0)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
            };

            r2d2Group.userData.onClick = r2ClickHandler;
            hitBox.userData.onClick = r2ClickHandler; // Double bind

            // Register R2D2 as clickable
            if (window.interiorClickables) {
                window.interiorClickables.push(r2d2Group);
                window.interiorClickables.push(hitBox); // Push hitbox too
                // V-FIX: Push the Orb Item so it can be clicked when revealed!
                window.interiorClickables.push(item);
                // Also push our new Super HitBox
                window.interiorClickables.push(orbHitBox);
                console.log("R2D2, Hitbox, Orb, and SuperOrbHitBox added to interiorClickables");
            }
        } else {
            console.error("WordHunt.createInteractable returned null for 'hall'");
        }
    } else {
        console.error("WordHunt is undefined in hall.js");
    }
}
function createBathroomInterior() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY (Center)
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; interiorGroup.add(faucet);

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bathroom');
        if (item) {
            // V-FIX: Move to Sink/Vanity Area (Better visibility)
            // Was: (3.5, 0.5, -2.0) (Bathtub)
            item.position.set(0, 1.5, -4.2);
            item.scale.set(0.8, 0.8, 0.8); // Slightly smaller to fit vanity
            interiorGroup.add(item);
        }
    }

    // MIRROR FRAME
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 })); // 0x222222 -> 0x111111
    mirrorFrame.position.set(0, 3.8, -4.9);
    mirrorFrame.castShadow = true;
    interiorGroup.add(mirrorFrame);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128; // Low res is fine for blur
    const sCtx = shadowCanvas.getContext('2d');
    // Draw blurred box
    sCtx.shadowColor = "rgba(0, 0, 0, 0.8)";
    sCtx.shadowBlur = 20;
    sCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    // Draw slightly smaller rect to allow blur to bleed
    sCtx.fillRect(20, 20, 88, 88);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    // Scale plane to allow blur bleed area
    const shadowGeo = new THREE.PlaneGeometry(2.4, 3.8);
    const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.6,
        depthWrite: false // Prevent Z-fighting artifacts
    });

    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.z = -0.08; // Safe distance
    mirrorFrame.add(shadowPlane);

    // Button removed (Replaced by Universal Video UI)

    // 1. Remove default bright bulb
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // 2. Add Darker Ambience (V289: Boosted 0.05 -> 0.15)
    const darkAmb = new THREE.PointLight(0x223344, 0.15, 15);
    darkAmb.position.set(0, 6, 0);
    interiorGroup.add(darkAmb);

    // --- V45 SHADER (SUPER PARALLAX) ---
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
            // V180 Fix: Single horizon calculation
            float sensitiveAngle = uViewRotation * 4.0; 
            
            // V-NEW: Added uViewPitch response (-0.5 to 0.5 usually)
            // If camera looks DOWN (pitch < 0), Horizon should move UP? Or down?
            // User feedback: "horizon should move 'up' when it goes down".
            // If "it" refers to view/pitch going down, horizon must go UP.
            // Pitch < 0 -> Horizon increases.
            // So: - (uViewPitch * factor). 
            // V-FIX: Increased Pitch Sensitivity (0.4 -> 1.5) and Range
            // When looking DOWN (pitch < 0), we want horizon to go UP significantly to show "floor" reflection.
            // When looking UP, horizon goes DOWN to show ceiling.
            float horizon = 0.5 - (uViewPitch * 1.5); // Much stronger response
            float perspective = 1.0 / max(0.01, (horizon - vUv.y)); 
            
            // Checkerboard Reflection 
            float x = (vUv.x - 0.5) * perspective * uScale + (sensitiveAngle * 3.0);
            float y = perspective * uScale + (uTime * 0.2); 
            
            // Checkerboard pattern
            float check = mod(floor(x) + floor(y), 2.0);
            // V-FIX: Darker Tiles for Mirror (0.05/0.15)
            vec3 tileColor = (check < 0.5) ? vec3(0.05) : vec3(0.15);
            
            // Glare effect (Reduced)
            float glarePos = 0.5 + (uViewRotation * 0.3) + (sin(uTime * 0.5) * 0.1);
            float streak = smoothstep(0.2, 0.0, abs(vUv.x - glarePos));
            float gloss = (1.0 - vUv.y) * 0.05 + (streak * 0.1); // Much closer to matte

            // Sharp horizon transition
            float voidFactor = step(horizon, vUv.y);
            
            vec3 finalColor;

            if (uUseVideo > 0.5) {
                // Video mode
                vec4 vid = texture2D(uMap, vUv);
                finalColor = (vid.rgb * 0.8) + vec3(gloss * 0.2); 
                // V-FIX: Do NOT darken video globally (Keep it reasonably bright)
            } else {
                // Reflection mode
                vec3 finalReflect = tileColor + vec3(gloss);
                // Mix to tinted void (Very Dark)
                finalColor = mix(finalReflect, vec3(0.005, 0.01, 0.015), voidFactor);
                // V-TUNE: Extra Darkening for "Blurry/Dim" feel ONLY in reflection mode?
                // Or apply dimmer? Legacy code had global dimmer.
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

            // DEBUG: Log every ~60 frames
            if (Math.floor(t * 60) % 60 === 0) {
                console.log("Mirror Update: Yaw=", angle.toFixed(3), "Pitch=", dir.y.toFixed(3));
            }
        }

        // 3. Update Video Texture if playing
        if (window.videoElement && mirrorMat.uniforms.uMap.value) {
            if (!window.videoElement.paused) {
                mirrorMat.uniforms.uMap.value.needsUpdate = true;
                // V-FIX: Auto-Enter Screen Mode when playing (Fixes Universal Interface selection)
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
    // V-FIX: Direct toggle (videoBtn removed)
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
    cctx.fillStyle = '#888888'; cctx.fillRect(0, 0, 512, 512); // V140: Darker White
    cctx.fillStyle = '#111111'; // Not pure black, but very dark
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
        roughness: 0.8, // V-FIX: Less intense reflection (was 0.2)
        metalness: 0.05 // Reduced metalness (was 0.1)
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; interiorGroup.add(floor);


    const matMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), matMat);
    bathMat.rotation.x = -Math.PI / 2;
    bathMat.position.set(0, 0.02, -2.0); // Slightly above floor
    interiorGroup.add(bathMat);


    // --- VIDEO LOGIC ---
    // START: Do NOT auto-play video. Start in Reflection Mode.
    if (!window.videoElement) window.videoElement = document.getElementById('generic-video');

    if (window.videoElement) {
        // V41: Correct Video from data.js
        window.videoElement.src = "../assets/video/Time-Is-Now.mp4";
        window.videoElement.muted = true;
        window.videoElement.loop = true;
        window.videoElement.crossOrigin = "anonymous";

        // Pre-load texture but don't show it (Pause immediately)
        window.videoElement.play().then(() => {
            window.videoElement.pause();
            // Create texture ONCE
            if (!mirrorMat.uniforms.uMap.value) {
                const vTex = new THREE.VideoTexture(window.videoElement);
                mirrorMat.uniforms.uMap.value = vTex;
            }
        }).catch(e => console.warn("Mirror Video Init fail", e));
    }

    // V-NEW: External Helper for Global Sync
    window.stopBathroomVideo = function () {
        if (mirrorMat) mirrorMat.uniforms.uUseVideo.value = 0.0;
        if (window.videoElement) {
            window.videoElement.pause();
        }
        // Reset Button Color (Red = Reflection Mode)
        const btn = interiorClickables.find(c => c.userData.type === 'bathroomMirrorButton');
        if (btn) btn.material.color.setHex(0xff0000);
    };

    window.toggleBathroomMirror = function () {
        console.log("V46: toggleBathroomMirror CLICKED!");

        // Toggle Audio on Click
        if (window.videoElement) {
            window.videoElement.muted = !window.videoElement.muted;
        }

        const btn = interiorClickables.find(c => c.userData.type === 'videoControlSingle');

        if (mirrorMat) {
            const currentMode = mirrorMat.uniforms.uUseVideo.value;

            // STATE MACHINE
            if (currentMode < 0.5) {
                // REFLECTION -> PLAY
                mirrorMat.uniforms.uUseVideo.value = 1.0;
                if (window.videoElement) {
                    window.videoElement.play();

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
            } else {
                // PLAY -> PAUSE
                if (window.videoElement && !window.videoElement.paused) {
                    window.videoElement.pause();
                    if (btn && btn.material.color) btn.material.color.setHex(0xffff00); // Yellow
                } else {
                    // PAUSE -> REFLECTION
                    mirrorMat.uniforms.uUseVideo.value = 0.0;
                    if (btn && btn.material.color) btn.material.color.setHex(0xff0000); // Red
                }
            }
        }
    };

    // V-NEW: Helper to Stop Video & Reset Lights
    window.stopBathroomVideo = function () {
        if (mirrorMat) {
            mirrorMat.uniforms.uUseVideo.value = 0.0;
            // Reset Button Color
            const btn = interiorClickables.find(c => c.userData.type === 'videoControlSingle');
            if (btn && btn.material.color) btn.material.color.setHex(0xff0000); // Red
        }
        if (videoElement && !videoElement.paused) videoElement.pause();

        // V-FIX 22: Tween Safety & Goldilocks Reset
        // 1. Kill any active dimming tweens so they don't overwrite our reset
        TWEEN.getAll().forEach(t => t.stop());

        // 2. Reset Lights to Goldilocks Profile (0.35/0.45)
        if (dirLight) dirLight.intensity = 0.45;
        if (rimLight) rimLight.intensity = 0.3;
        if (ambientLight) ambientLight.intensity = 0.35;
    };

    // VIDEO PLAYLIST (Left of Mirror)
    if (window.createUniversalVideoInterface && roomContent.bathroom.videoPlaylist) {
        const posData = roomContent['bathroom'].videoInterfacePos || { x: -2.8, y: 2.8, z: -4.5 };
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), roomContent.bathroom.videoPlaylist, {
            scale: 0.75, // V306: Scale 0.75x
            onPlay: (index) => {
                // V-FIX 6: Soft Darkening (Tween) - Restored
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.2 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                console.log("Bathroom Video Play: Darkening Room (Soft)");
                window.masterVideoIndex = index;
                const clip = roomContent.bathroom.videoPlaylist[index];

                // 1. Set Src & Play
                if (window.videoElement) {
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
                    const btn = interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                    if (btn) {
                        btn.material.color.setHex(0x00ff00);
                        btn.material.emissive.setHex(0x004400);
                    }
                }
            }
        });
    }
}
function createAtticInterior() {
    // V-WORDHUNT: Logic is now handled inside createColoredBox for "WISDOM"
    // Refactored to capture the box explicitly without fragile lookups.

    let wisdomBoxRef = null;

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

        // V-FIX 18: DARK INTERIOR (Simulation)
        // A black plane just above the solid box top to look like a void
        const voidGeo = new THREE.PlaneGeometry(1.4, 1.4);
        const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const voidPlane = new THREE.Mesh(voidGeo, voidMat);
        voidPlane.rotation.x = -Math.PI / 2;
        voidPlane.position.y = 0.76; // Slightly above box top (0.75)
        box.add(voidPlane);

        // V-FIX 18: HINGED LID
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
        // V-FIX 16: Move Label Forward (0.82)
        labelMesh.position.set(0, 0, 0.82);
        box.add(labelMesh);

        interiorGroup.add(box);

        // V-FIX: Direct Interaction Logic for WISDOM Box
        if (labelText === "WISDOM") {
            // Check for WordHunt Item
            let orbItem = null;
            if (typeof WordHunt !== 'undefined') {
                orbItem = WordHunt.createInteractable('attic');
            }

            // V-FIX 10: Fallback Orb
            if (!orbItem) {
                console.log("Attic: Creating Fallback (Dummy) Orb");
                const dummyGeo = new THREE.SphereGeometry(0.3, 16, 16);
                const dummyMat = new THREE.MeshStandardMaterial({
                    color: 0x00ffff,
                    emissive: 0x0088ff,
                    emissiveIntensity: 0.5,
                    roughness: 0.2
                });
                orbItem = new THREE.Mesh(dummyGeo, dummyMat);
            }

            if (orbItem) {
                console.log("Attic: Injecting Orb into WISDOM box");
                // Start inside the "void"
                orbItem.position.set(0, 0.5, 0);
                orbItem.scale.set(0.1, 0.1, 0.1);
                orbItem.visible = false;
                box.add(orbItem);
            }

            // Click Handler
            const openBox = () => {
                if (!box.userData.isOpen) {
                    console.log("Wisdom Box Clicked (Hinged) - OPENING");
                    box.userData.isOpen = true;
                    new TWEEN.Tween(lidPivot.rotation).to({ x: -Math.PI * 0.6 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                    if (orbItem) {
                        orbItem.visible = true; orbItem.userData.revealed = true;
                        new TWEEN.Tween(orbItem.position).to({ y: 1.8 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                        new TWEEN.Tween(orbItem.scale).to({ x: 1.0, y: 1.0, z: 1.0 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                    }
                } else {
                    console.log("Wisdom Box Clicked (Hinged) - SHUTTING");
                    box.userData.isOpen = false;
                    new TWEEN.Tween(lidPivot.rotation).to({ x: 0 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    if (orbItem) {
                        new TWEEN.Tween(orbItem.position).to({ y: 0.5 }, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(() => { if (!box.userData.isOpen) orbItem.visible = false; }).start();
                        new TWEEN.Tween(orbItem.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    }
                }
            };

            box.userData.onClick = openBox;
            lid.userData.onClick = openBox;

            // V-FIX 21: NUCLEAR OPTION - Disable Label Raycast
            // Ensure the label (which is in front) NEVER blocks the click
            labelMesh.raycast = function () { };

            // V-FIX 21: SUPER HITBOX (Opacity 0, NOT Visible: False)
            // Visible: False sometimes fails raycasting depending on setup.
            // Opacity 0 is reliable.
            // Size 2.0 ensures it engulfs the Label (at Z=0.82) completely.
            const hitBoxGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
            const hitBoxMat = new THREE.MeshBasicMaterial({
                visible: true,
                color: 0xffff00, // Debug color (invisible via opacity)
                transparent: true,
                opacity: 0.0,
                depthWrite: false, // V-FIX 23: IMPORTANT! Don't hide stuff behind me!
                side: THREE.DoubleSide
            });
            const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
            hitBox.position.copy(box.position);

            // Interaction Data
            hitBox.userData = {
                onClick: openBox,
                type: 'wisdomBox_HitBox'
            };

            interiorGroup.add(hitBox);
            interiorClickables.push(hitBox);
            console.log("Attic: Added NUCLEAR HitBox (Op0, Size 2.0) for Wisdom Box");

            // Keep visuals just in case, but HitBox should catch everything
            interiorClickables.push(box);
            interiorClickables.push(lid);
        }

        return box;
    };

    // 1. LEFT BOX: RED "BEAUTY" (Spacing -2.5)
    createColoredBox("BEAUTY", '#ffffff', 0xd32f2f, -2.5, -1.8);

    // 2. MIDDLE BOX: YELLOW "KNOWLEDGE"
    createColoredBox("KNOWLEDGE", '#000000', 0xfbc02d, 0, -1.8);

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
    // V310: Restore to Wall-Mounted position.
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

    // 4. Bulb (Inside)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    bulb.position.y = -0.2;
    shade.add(bulb);

    // 5. The Light (Stronger)
    const light = new THREE.PointLight(0xffaa00, 2.5, 25);
    light.castShadow = true;
    // V315: Soften Shadows
    light.shadow.radius = 4;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.y = -0.5;
    shade.add(light);

    // V-FIX: ACTUALLY ADD IT TO THE SCENE!
    interiorGroup.add(lampGroup);

    // Logic for WISDOM box interaction is now handled inside createColoredBox
}

function createProjector() {
    const projGroup = new THREE.Group();
    // Material
    const iron = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 1.0, roughness: 0.2 });

    // Base Box
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), iron);
    base.position.y = 0.1;
    projGroup.add(base);

    // Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.5), iron);
    body.position.y = 0.4;
    projGroup.add(body);

    // Lens
    const lenscyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2), chrome);
    lenscyl.rotation.x = Math.PI / 2;
    lenscyl.position.set(0, 0.45, -0.35);
    projGroup.add(lenscyl);


    const lensLocal = new THREE.Vector3(0, 0.45, -0.35);
    const targetLocal = new THREE.Vector3(0, 2.2, -2.95);
    const vec = new THREE.Vector3().subVectors(targetLocal, lensLocal);
    const height = vec.length(); // Length of beam

    // Geometry: Top(0.05) -> Bottom(2.5 = Width 5.0)
    // Top is +Y, Bottom is -Y.
    const beamGeo = new THREE.CylinderGeometry(0.05, 2.5, height, 64, 1, true);

    // Texture: Constant Noise + Gradient Mask
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 128; bCanvas.height = 512;
    const bCtx = bCanvas.getContext('2d');

    // 1. Noise
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 512; j++) {
            const val = Math.floor(Math.random() * 255);
            bCtx.fillStyle = `rgba(${val},${val},${val},0.15)`;
            bCtx.fillRect(i, j, 1, 1);
        }
    }

    // 2. Gradient (Top Opaque -> Bottom Transparent)
    // GLOW EFFECT: Strong white at Top (0), fading out.
    const g = bCtx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Bright Glow at Lens
    g.addColorStop(0.2, 'rgba(255, 255, 255, 0.35)'); // Quick fade to beam body
    g.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fade to transparent

    bCtx.globalCompositeOperation = 'destination-in';
    bCtx.fillStyle = g;
    bCtx.fillRect(0, 0, 128, 512);

    const beamTex = new THREE.CanvasTexture(bCanvas);
    const beamMat = new THREE.MeshBasicMaterial({
        map: beamTex,
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const beam = new THREE.Mesh(beamGeo, beamMat);

    // Position at Midpoint
    const mid = new THREE.Vector3().addVectors(lensLocal, targetLocal).multiplyScalar(0.5);
    beam.position.copy(mid);

    const axis = new THREE.Vector3(0, 1, 0);
    const targetDir = vec.clone().negate().normalize();
    beam.quaternion.setFromUnitVectors(axis, targetDir);

    projGroup.add(beam);


    // Reels (Two big circles on top)
    const reelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
    const reel1 = new THREE.Mesh(reelGeo, chrome);
    reel1.rotation.z = Math.PI / 2;
    reel1.position.set(0, 0.75, 0.1);
    projGroup.add(reel1);

    const reel2 = new THREE.Mesh(reelGeo, chrome);
    reel2.rotation.z = Math.PI / 2;
    reel2.position.set(0, 0.75, -0.15);
    projGroup.add(reel2);

    // Place on the Middle Box
    // Middle box is at x=0, z=-2. Lid is at y=0.6 + 0.1 = 0.7.
    projGroup.position.set(0, 0.8, -2);
    // Scale it nicely
    projGroup.scale.set(1.5, 1.5, 1.5);

    interiorGroup.add(projGroup);
}
let tvVideo, tvVideoTexture;
let tvScreensaver, tvScreensaverTexture; // V-NEW: Screensaver vars
// Need global access to lights for dimming (Cinema Mode)
window.livingCozyLight = null;
window.livingLibrarySpot = null;
// masterVideoIndex is global (house.js)

// V-NEW: TV Screensaver
// V-NEW: Image Slideshow Screensaver (v222)
// V-ENHANCED: Fade Transitions
function createTVScreensaver() {
    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 576; // Higher resolution for images
    const ctx = canvas.getContext('2d');

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;

    // 2. Logic Data
    const slides = roomContent['living'].tvImages || [];
    if (slides.length === 0) return null; // Fallback to video if no slides

    const duration = 5000; // 5 seconds per slide
    const fadeDuration = 800; // 800ms fade transition
    let currentIndex = -1; // Start at -1 to force first draw
    let previousCanvas = null; // Store previous slide for crossfade

    // Preload Images
    const images = {};
    slides.forEach(slide => {
        if (slide.image) {
            const img = new Image();
            img.src = slide.image;
            images[slide.image] = img;
        }
    });

    // Helper to draw a slide to a canvas
    const drawSlide = (targetCtx, slide, targetWidth, targetHeight) => {
        // Draw Background
        targetCtx.fillStyle = slide.color || '#000000';
        targetCtx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw Image if available and loaded
        if (slide.image && images[slide.image]) {
            const img = images[slide.image];
            // Check if image is loaded successfully (not broken)
            if (img.complete && img.naturalWidth > 0) {
                // Scale to fit "contain"
                const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const x = (targetWidth - w) / 2;
                const y = (targetHeight - h) / 2;
                targetCtx.drawImage(img, x, y, w, h);
            }
        }

        // Draw Text
        if (slide.text) {
            targetCtx.fillStyle = '#ffffff';
            targetCtx.font = 'bold 40px "Courier Prime", monospace';
            targetCtx.textAlign = 'center';
            targetCtx.textBaseline = 'middle';
            // Add text shadow
            targetCtx.shadowColor = 'rgba(0,0,0,0.8)';
            targetCtx.shadowBlur = 4;
            targetCtx.shadowOffsetX = 2;
            targetCtx.shadowOffsetY = 2;
            targetCtx.fillText(slide.text, targetWidth / 2, targetHeight - 76); // Bottom center
            targetCtx.shadowColor = 'transparent';
        }
    };

    tex.userData = {
        update: (time) => {
            const nowMs = time * 1000;
            const index = Math.floor(nowMs / duration) % slides.length;
            const slideProgress = (nowMs % duration) / duration; // 0 to 1 within current slide
            const fadeProgress = Math.min(slideProgress * duration / fadeDuration, 1); // 0 to 1 during fade

            if (index !== currentIndex || currentIndex === -1) {
                // New slide - save previous canvas for crossfade
                if (currentIndex !== -1 && previousCanvas === null) {
                    previousCanvas = document.createElement('canvas');
                    previousCanvas.width = 1024;
                    previousCanvas.height = 576;
                    const prevCtx = previousCanvas.getContext('2d');
                    prevCtx.drawImage(canvas, 0, 0);
                }

                currentIndex = index;
            }

            const slide = slides[currentIndex];

            // Draw current slide to a temp canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 1024;
            tempCanvas.height = 576;
            const tempCtx = tempCanvas.getContext('2d');
            drawSlide(tempCtx, slide, 1024, 576);

            // Crossfade if we have a previous canvas and we're in fade period
            if (previousCanvas && fadeProgress < 1) {
                // Draw previous slide
                ctx.globalAlpha = 1 - fadeProgress;
                ctx.drawImage(previousCanvas, 0, 0);

                // Draw current slide on top with fade
                ctx.globalAlpha = fadeProgress;
                ctx.drawImage(tempCanvas, 0, 0);

                ctx.globalAlpha = 1; // Reset
            } else {
                // No fade, just draw current slide
                ctx.clearRect(0, 0, 1024, 576);
                ctx.drawImage(tempCanvas, 0, 0);

                // Clear previous canvas after fade completes
                if (fadeProgress >= 1) {
                    previousCanvas = null;
                }
            }

            tex.needsUpdate = true;
        }
    };

    return tex;
}

function initTVVideo() {
    console.log("LIVING.JS v179-FIX: initTVVideo called.");
    if (tvVideo) return;

    tvScreensaverTexture = createTVScreensaver();

    tvVideo = document.createElement('video');
    const livingData = roomContent['living'];
    if (livingData && livingData.videoPlaylist && livingData.videoPlaylist.length > 0) {
        tvVideo.src = livingData.videoPlaylist[0].src;
    } else {
        tvVideo.src = '../assets/video/premonition.mp4';
    }
    tvVideo.loop = true; tvVideo.muted = false; tvVideo.autoplay = false;
    tvVideo.preload = 'auto'; tvVideo.setAttribute('playsinline', '');
    window.videoElement = tvVideo;
    tvVideoTexture = new THREE.VideoTexture(tvVideo);
    tvVideoTexture.minFilter = THREE.LinearFilter;
    tvVideoTexture.magFilter = THREE.LinearFilter;
    tvVideoTexture.colorSpace = THREE.SRGBColorSpace;
}

function playTVVideo(index) {
    const playlist = roomContent['living'].videoPlaylist;
    if (!playlist || !playlist[index]) return;
    window.masterVideoIndex = index;
    const clip = playlist[index];
    console.log("Play TV Video:", clip.title);
    if (window.audioPlayer && !window.audioPlayer.paused) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
    }
    // Unhighlight Audio
    window.currentTrackIndex = -1;
    if (window.updateMusicPanelHighlight) window.updateMusicPanelHighlight();
    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);

    if (tvVideo) {
        tvVideo.src = clip.src; tvVideo.load();
        if (tvVideo.paused) nextTVContent();
        else tvVideo.play().catch(e => console.warn(e));
    }
    if (window.updateVideoUI) window.updateVideoUI();
    if (window.livingTVMesh) {
        window.livingTVMesh.material.map = tvVideoTexture;
        window.livingTVMesh.material.needsUpdate = true;
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
        // V306: Scale 0.5x
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), playlist, {
            scale: 0.5
        });
    }
}

window.stopLivingVideo = () => {
    restoreCinemaLights();
    if (tvVideo) {
        tvVideo.pause(); tvVideo.muted = true;
        console.log("Living Room Video Stopped & Muted (Cleanup)");
        /*
        const applyScreensaver = (mesh) => {
             if (tvScreensaverTexture) {
                 mesh.material.map = tvScreensaverTexture;
                 mesh.userData.update = tvScreensaverTexture.userData.update; 
             }
        };
        if (window.livingTVMesh) applyScreensaver(window.livingTVMesh);
        else if (typeof tvMesh !== 'undefined') applyScreensaver(tvMesh);
        */
        // Revert to paused video texture (Premonition frame)
        if (window.livingTVMesh) {
            window.livingTVMesh.material.map = tvVideoTexture;
            window.livingTVMesh.userData.update = null;
        }
        else if (typeof tvMesh !== 'undefined') {
            tvMesh.material.map = tvVideoTexture;
            tvMesh.userData.update = null;
        }
    }
    window.masterVideoIndex = -1;
    if (window.updateVideoUI) window.updateVideoUI();
};

function nextTVContent() {
    // V-REFINE: Click toggles Play/Pause
    if (tvVideo) {
        if (tvVideo.paused) {
            // --- ENTER CINEMA MODE (PLAY) ---
            // STOP MUSIC when TV plays
            if (window.audioPlayer && !window.audioPlayer.paused) {
                window.audioPlayer.pause();
                window.isMusicPlaying = false;
                if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000); // Red = Off
            }
            // V-FIX: Ensure Button Is Red even if music was already off
            if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);


            console.log("Cinema Mode: Capturing & Dimming Lights (LOCAL ONLY V-FIX)");

            // 1. CAPTURE CURRENT STATE (Dynamic "Reverse" capability)
            // V-FIX: Only capture if we haven't already (prevents capturing dimmed state when switching videos)
            if (!window.preCinemaState) {
                window.preCinemaState = {
                    cozy: window.livingCozyLight ? window.livingCozyLight.intensity : 0.25, // Updated default
                    library: window.livingLibrarySpot ? window.livingLibrarySpot.intensity : 0.25,
                    spotL: window.bookcaseSpotL ? window.bookcaseSpotL.intensity : 0.25,
                    spotR: window.bookcaseSpotR ? window.bookcaseSpotR.intensity : 0.25,
                };
            }

            const dimTime = 1000;
            const dimLevel = 0.0; // PITCH BLACK for cinema mode

            try {
                // PAUSE continuous lighting override during cinema mode
                if (window.livingRoomLightingOverride) {
                    clearInterval(window.livingRoomLightingOverride);
                    console.log('Cinema mode: Paused continuous lighting override');
                }

                // Dim Room Lights to PITCH BLACK
                if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V294: Bloom TV Glow behind set
                if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 3.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V-FIX: Dim global lights to near-black
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // Robot Glow - Keep it BRIGHT! (Do NOT dim)
                if (window.metropolisRobot) {
                    // Ensure robot is visible?
                }
                if (window.robotGlowLight) new TWEEN.Tween(window.robotGlowLight).to({ intensity: 2.5 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

            } catch (e) {
                console.error("TWEEN ERROR:", e);
                // Fallback
                if (window.livingCozyLight) window.livingCozyLight.intensity = dimLevel;
            }

            // V143: Fix Audio - Explicitly Unmute and Max Volume on Play
            tvVideo.muted = false;
            tvVideo.volume = 1.0;
            tvVideo.play().catch(e => console.warn("TV Play Error", e));
            tvVideo.play().catch(e => console.warn("TV Play Error", e));
        } else {
            // --- EXIT CINEMA MODE (PAUSE) ---
            restoreCinemaLights();
            if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 1.5 }, 500).easing(TWEEN.Easing.Quadratic.Out).start();
            tvVideo.pause();
        }
    }
}
window.nextTVContent = nextTVContent;
window.playTVVideo = playTVVideo;

function restoreCinemaLights() {
    console.log("Cinema Mode: Restoring Lights (LOCAL ONLY)");

    // Default Fallbacks if capture failed (V298: Moody Normal State)
    // Updated V315-RELOADED-5: Brighter Defaults
    const restore = window.preCinemaState || {
        cozy: 0.5, library: 0.5, spotL: 0.3, spotR: 0.3, ambient: 0.15,
    };

    try {
        if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: restore.cozy }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
        if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: restore.library }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore bookcase spots
        if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: restore.spotL }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
        if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: restore.spotR }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore Ambient (V298: Moody Normal Default)
        if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: restore.ambient || 0.15 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // V294: Restore TV Glow
        if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 1.5 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

        // Restore robot glow
        if (window.robotGlowLight) new TWEEN.Tween(window.robotGlowLight).to({ intensity: 2.5 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

    } catch (e) {
        if (window.livingCozyLight) window.livingCozyLight.intensity = restore.cozy;
    }

    // V-FIX: Allow re-capture next time
    window.preCinemaState = null;
}
// Export for global use
window.restoreCinemaLights = restoreCinemaLights;

window.stopLivingVideo = () => {
    restoreCinemaLights();
    if (tvVideo) {
        tvVideo.pause();
        tvVideo.muted = true;
        tvVideo.pause();
        tvVideo.muted = true;
        console.log("Living Room Video Stopped & Muted (Cleanup)");

        // V-NEW: Revert to Screensaver
        // Need to find tvMesh. It is local to createLivingRoomInterior, but global 'tvMesh' variable might be used?
        // Wait, 'tvMesh' is declared inside createLivingRoomInterior without 'let/const' in my view? 
        // Line 639: 'tvMesh = ...' (Global assignment check). 
        // If it is global, we can use it. If not, we should have assigned it to window.
        if (window.livingTVMesh) {
            if (tvScreensaverTexture) window.livingTVMesh.material.map = tvScreensaverTexture;
        } else if (typeof tvMesh !== 'undefined') {
            if (tvScreensaverTexture) tvMesh.material.map = tvScreensaverTexture;
        }
    }
};

// V326: Reverted to original Dark Wood for Living Room consistency
const createWoodMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // V326: Original Darkened Base Color
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

// V327: Hall "Deep Green Textured" Material Generator
const createHallGreenMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep Green Base
    ctx.fillStyle = '#062c1a';
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
    // V-NEW: TV Idle Texture (Static Image)
    let tvIdleTexture = null;
    const tvIdleLoader = new THREE.TextureLoader();
    tvIdleLoader.load(
        '../assets/images/tv.jpg',
        (texture) => {
            tvIdleTexture = texture;
            console.log('TV idle texture loaded');
        },
        undefined,
        (err) => {
            console.warn('TV idle texture failed to load, using fallback', err);
        }
    );

    const wallsGroup = new THREE.Group();
    // V138: Darker Interior Walls (0x8a3500 -> 0x451a00)
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
    // V-BRIGHTER: Increased for better visibility (was 0.1, now 0.25)
    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.25, 15);
    window.livingCozyLight.position.set(0, 5, 0);
    window.livingCozyLight.castShadow = true;
    window.livingCozyLight.shadow.mapSize.width = 2048;
    window.livingCozyLight.shadow.mapSize.height = 2048;
    window.livingCozyLight.shadow.radius = 8; // Soft edges
    window.livingCozyLight.shadow.bias = -0.0005;
    interiorGroup.add(window.livingCozyLight);

    // V-BRIGHTER: Increased for better visibility (was 0.1, now 0.25)
    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.25);
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

    // V298: Moody Shelf lighting
    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    // V-BRIGHTER: Increased for better visibility (was 0.05, now 0.15)
    const bookcaseSpotL = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotL.position.set(-2, 6, -3.5);
    bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5);
    bookcaseSpotL.angle = Math.PI / 2.2;
    bookcaseSpotL.penumbra = 1.0;
    bookcaseSpotL.distance = 15;
    bookcaseSpotL.castShadow = true;
    bookcaseSpotL.shadow.mapSize.width = 2048;
    bookcaseSpotL.shadow.mapSize.height = 2048;
    bookcaseSpotL.shadow.radius = 8; // Soft edges
    bookcaseSpotL.shadow.bias = -0.0005;
    interiorGroup.add(bookcaseSpotL);
    interiorGroup.add(bookcaseSpotL.target);
    window.bookcaseSpotL = bookcaseSpotL;

    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    // V-BRIGHTER: Increased for better visibility (was 0.05, now 0.15)
    const bookcaseSpotR = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotR.position.set(-2, 6, 3.5);
    bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5);
    bookcaseSpotR.angle = Math.PI / 2.2;
    bookcaseSpotR.penumbra = 1.0;
    bookcaseSpotR.distance = 15;
    bookcaseSpotR.castShadow = true;
    bookcaseSpotR.shadow.mapSize.width = 2048;
    bookcaseSpotR.shadow.mapSize.height = 2048;
    bookcaseSpotR.shadow.radius = 8; // Soft edges
    bookcaseSpotR.shadow.bias = -0.0005;
    interiorGroup.add(bookcaseSpotR);
    interiorGroup.add(bookcaseSpotR.target);
    window.bookcaseSpotR = bookcaseSpotR;

    // V-DEBUG: Log light intensities to verify they're being set
    console.log('Living Room Lighting Applied:', {
        cozyLight: window.livingCozyLight.intensity,
        librarySpot: window.livingLibrarySpot.intensity,
        bookcaseL: bookcaseSpotL.intensity,
        bookcaseR: bookcaseSpotR.intensity
    });

    // V-FIX: CONTINUOUS override to fight V123 lighting system
    console.log('🔥🔥🔥 FILE VERSION: 2026-01-31 21:06 - BRIGHTER LIGHTS 0.15-0.25 🔥🔥🔥');
    let overrideCount = 0;
    const livingRoomLightingOverride = setInterval(() => {
        // Force global lights to brighter values for normal mode
        if (window.ambientLight) window.ambientLight.intensity = 0.15;
        if (window.dirLight) window.dirLight.intensity = 0.2;

        // Force room-specific lights to brighter values for normal mode
        if (window.livingCozyLight) window.livingCozyLight.intensity = 0.25;
        if (window.livingLibrarySpot) window.livingLibrarySpot.intensity = 0.25;
        if (window.bookcaseSpotL) window.bookcaseSpotL.intensity = 0.15;
        if (window.bookcaseSpotR) window.bookcaseSpotR.intensity = 0.15;

        overrideCount++;
        if (overrideCount === 1 || overrideCount % 20 === 0) {
            console.log(`Living room lighting enforced (count: ${overrideCount})`);
        }
    }, 100); // Run every 100ms

    // Store interval ID for potential cleanup
    window.livingRoomLightingOverride = livingRoomLightingOverride;

    // V201: Procedural Wood Texture Helper
    const woodMat = createWoodMaterial();

    // --- BOOKCASES ---
    // V202: Reverted to Dark Shelf (User Request: "Only coffeetable and TV cupboard wood")
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const bookColors = [0x991b1b, 0x1e40af, 0x166534, 0x854d0e, 0x3730a3, 0xfacc15];

    // ... (Helper unchanged)

    // (Helper Function body skipped, assuming context allows)
    // Wait, createBookcase uses shelfMat, need to ensure helper sees new shelfMat

    // ... Skipping Helper Body ...

    // RUG & COUCH
    // V138: Darker Rug (0x450a0a -> 0x220505)
    // V138: Darker Couch (0x5d4037 -> 0x2e201b)

    // Applying to lower section now...

    // V147: Menorah Artifact (User Request)
    // Traditional 7-branched Menorah. Middle candle lit.
    // V224: Floating 7 Lights (User Request)
    // V225: Floating Orb Artifact (User Request)
    // V235: Ruin Artifact (User Request: Dark ruin, broad base, container for orb)
    // V242: Refined Ruin (Volcano-like)
    // V243: Refined Ruin (Yellow Orb, Higher, Clickable)
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
        const orbGeo = new THREE.SphereGeometry(0.12, 16, 16); // Slightly bigger
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); // Yellow/Gold
        const orb = new THREE.Mesh(orbGeo, orbMat);
        // V-REFINE: Higher placement (0.35 -> 0.55) to float/sit prominently
        orb.position.y = 0.55;
        group.add(orb);

        // 3. Pulsating Light (Yellow)
        const light = new THREE.PointLight(0xffaa00, 2.0, 7);
        light.position.copy(orb.position);
        group.add(light);

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
                const pulse = 1.0 + Math.sin(t * 2) * 0.3;
                light.intensity = 2.0 + pulse;
                orb.scale.setScalar(1.0 + Math.sin(t * 4) * 0.05);
            }
        };

        return group;
    }

    // V317: Void Candle Removed per user request
    /*
    function createVoidCandle() {
        ...
    }
    */

    function createBookcase(posZ) {
        const bookcaseGroup = new THREE.Group();

        // V-REFINE: Right Hinge Offset Logic
        // If it's the Right Bookcase (posZ < 0), we want the Pivot at the Right Edge (+Z relative to center).
        // Center of Geometry logic: Backing x=-0.4. Width Z=2.4 (-1.2 to 1.2).
        // Right Edge is +1.2.
        // So offset children by -1.2 Z.
        // And offset Group Buffer position by +1.2 Z.
        // posZ is the center position passed (-3.5 or 3.5).
        // WAIT. 3.5 is the positive one?
        // Line 446 calls: createBookcase(-3.5); createBookcase(3.5);
        // Living Room Wall is along X=-5. Z axis runs along wall.
        // "Right" when facing wall (-X) is +Z. So posZ = 3.5 is Right Bookcase.
        // Wait, User said "open right bookcase (Z < 0)".
        // Line 283 (`row === 4 && posZ < 0`) placed artifact on Z < 0.
        // So User considers Z < 0 "Right".
        // Facing -X (Wall), Z is RIGHT? 
        // 3D Coords: X Right, Y Up, Z Forward (out of screen).
        // If Wall is Back (-Z), then X is L/R.
        // Here Wall is LEFT (-X). So we face -X.
        // Forward is -X. Up is +Y. Right is -Z.
        // So "Right Bookcase" is `posZ < 0`. Correct.
        // Right Edge of this bookcase is -Z (further right).
        // Center is `posZ` (-3.5).
        // Width 2.4. Extent -1.2 to +1.2.
        // "Right Edge" (locally) is -1.2 (Mesh coords).
        // But relative to ROOM, "Right" is -Z direction.
        // So "Right Edge" is the one with smaller Z value?
        // Yes. `posZ - 1.2`.
        // So we want Pivot at `posZ - 1.2`.
        // So move Group to `posZ - 1.2`.
        // Move Children `+1.2`.

        let pivotOffsetZ = 0;
        if (posZ < 0) {
            pivotOffsetZ = 1.2;
            // V-FIX: Explicitly assign Global Ref for Secret Door
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

            // V-NEW: Black Portal behind Right Bookcase
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
                        console.log("Black Void Clicked -> Enter Annex");
                        enterRoom('annex');
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


                // 4. Candle Decoration REMOVED (V317)
                /*
                const candle = createVoidCandle();
                ...
                */

                // Visibility Logic (Minimal)
                portal.userData.update = (t) => {
                    // console.log("Void interaction active");
                };
            }

            // V-NEW: Artifact on Top Shelf of Right Bookcase (posZ < 0)
            if (row === 4 && posZ < 0) {
                // V235: Ruin Artifact
                const artifact = createRuinArtifact();
                // Sith on shelf. Base height ~0.4. Scaled 1.5 -> 0.6.
                // Origin y=0.2 -> 0.3. Bottom at 0.
                // Shelf Y is `shelfY`. Plank top `shelfY - 2.45`.
                artifact.scale.setScalar(1.5);
                artifact.position.set(0, shelfY - 2.45, 0 + pivotOffsetZ);

                // CLICK TRIGGER - Attach to hitTarget (The Base Mesh)
                const hitTarget = artifact.userData.hitTarget || artifact; // Fallback

                // Define the Handler
                const toggleDoor = () => {
                    console.log("Ruin Clicked! Toggle Secret Door...");
                    try {
                        const squeak = new Audio('../assets/audio/squeak.mp3');
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
                // V166: RUBIK'S CUBE (Replaces old Tintin rocket)
                const cubeGroup = createRubiksCubeArtifact();
                cubeGroup.position.set(0.1, shelfY - 2.15, 0 + pivotOffsetZ);
                bookcaseGroup.add(cubeGroup);
            }
            else if (row === 4 && posZ > 0) {
                // V166: REALISTIC TINTIN ROCKET (on Top Left Shelf)
                const rocket = createRealisticRocketArtifact();
                rocket.scale.setScalar(0.022);
                // V-FIX: Adjust Y to sit on shelf (was shelfY - 2.47 sinking in)
                // Corrected to shelfY - 2.32
                rocket.position.set(0.1, shelfY - 2.32, 0);
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
        }

        bookcaseGroup.position.set(-4.5, 2.6, posZ - pivotOffsetZ); // Apply Pivot Translation
        interiorGroup.add(bookcaseGroup);
    };

    createBookcase(-3.5); createBookcase(3.5);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1), woodMat); // V202: Wood Texture
    stand.position.set(0, 0.75, -4);
    stand.castShadow = true; stand.receiveShadow = true;
    interiorGroup.add(stand);

    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    tvFrame.position.set(0, 2.6, -4.5);
    interiorGroup.add(tvFrame);

    initTVVideo();

    // -- MILD GLOW BEHIND TV --
    // V-REFINE: Soft Blue Glow (Texture based, not rectangle)
    // V294: Atmospheric TV Glow (Pulsates in Cinema Mode)
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
    const glowGeo = new THREE.PlaneGeometry(6, 4); // Slightly larger
    const glowMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0.8,
        depthWrite: false, // Prevent occlusion issues
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending // Glowy look
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 2.6, -4.95); // Just off wall
    interiorGroup.add(glowMesh);

    // V-WORDHUNT: Moved to Maria Interaction

    // V-NEW: Create Video Menu Panel
    if (roomContent['living'].videoPlaylist && roomContent['living'].videoPlaylist.length > 0) {
        createVideoPanel(roomContent['living'].videoPlaylist);
    }

    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    // V-FIX: Start with TV Idle Image
    tvMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({
        map: tvIdleTexture,
        color: 0xffffff
    }));
    tvMesh.position.set(0, 2.6, -4.39);

    interiorGroup.add(tvMesh); // Ensure added using Variable reference (implied context)
    tvMesh.userData = { type: 'tv', action: 'toggleVideo' };

    // V294: TV Gloss Overlay (Glass Reflection)
    const glassGeo = new THREE.PlaneGeometry(3.3, 1.8);
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.1,
        metalness: 0.9,
        roughness: 0.1,
        depthWrite: false
    });
    const tvGlass = new THREE.Mesh(glassGeo, glassMat);
    tvGlass.position.set(0, 2.6, -4.37); // Just in front of screen
    interiorGroup.add(tvGlass);

    // Attach Screensaver Update if active
    if (tvScreensaverTexture && tvScreensaverTexture.userData.update) {
        tvMesh.userData.update = tvScreensaverTexture.userData.update;
    }

    interiorGroup.add(tvMesh);
    interiorClickables.push(tvMesh);
    window.livingTVMesh = tvMesh; // V-FIX: Expose for screensaver revert

    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 0.6, 2.25),
        woodMat // V201: Use Shared Wood Material
    );
    table.position.set(0, 0.3, -1.0);
    table.castShadow = true; table.receiveShadow = true;
    interiorGroup.add(table);

    // 4. Console Table (Center)

    function createBook(title, color, x, z, rotY, imagePath) {
        const bGeo = new THREE.BoxGeometry(0.5, 0.08, 0.7);
        let coverMat;
        if (imagePath) {
            const diffTex = new THREE.TextureLoader().load(imagePath);
            diffTex.colorSpace = THREE.SRGBColorSpace;
            coverMat = new THREE.MeshStandardMaterial({ map: diffTex, color: 0xffffff });
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 356;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 356);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, 128, 100);
            ctx.fillRect(10, 0, 20, 356);
            const tex = new THREE.CanvasTexture(canvas);
            coverMat = new THREE.MeshStandardMaterial({ map: tex });
        }
        const bMat = [
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
            coverMat,
            new THREE.MeshStandardMaterial({ color: color }),
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
            new THREE.MeshStandardMaterial({ color: 0xeeeeee })
        ];
        const mesh = new THREE.Mesh(bGeo, bMat);
        mesh.position.set(x, 0.65, z);
        mesh.rotation.y = rotY;
        mesh.castShadow = true;
        interiorGroup.add(mesh);
    }

    createBook("Tonic for\nthe Bones", '#8b0000', -0.6, -1.4, 0.2, '../assets/images/tftb-cover.jpg');
    createBook("Phantom\nParents", '#1a237e', -0.4, -0.4, -0.1, '../assets/images/phantomparents-cover.jpg');
    createBook("Gifts", '#065f46', 0.5, -0.9, -0.3, '../assets/images/gifts-cover.jpg');

    const cardGeo = new THREE.BoxGeometry(0.6, 0.15, 0.9);
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 256; cardCanvas.height = 384;
    const cctx = cardCanvas.getContext('2d');
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 256, 384);
    cctx.fillStyle = '#000000'; cctx.font = 'bold 22px Arial, sans-serif'; cctx.textAlign = 'center';
    cctx.fillText("CONVERSATION", 128, 185);
    const cardTex = new THREE.CanvasTexture(cardCanvas);
    const cardMat = new THREE.MeshStandardMaterial({ map: cardTex });
    const cardMesh = new THREE.Mesh(cardGeo, [
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
        cardMat,
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    ]);
    cardMesh.position.set(0, 0.45, -1.0);
    cardMesh.userData = { type: 'decoration' };
    interiorGroup.add(cardMesh); // Updated: Removed click logic/hologram

    // V171: Dark Red Rug (0x220505 -> 0x6b0505)
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 64), new THREE.MeshStandardMaterial({ color: 0x6b0505, roughness: 1.0 }));
    rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02;
    rug.receiveShadow = true; // V204: Receive Shadows (including Maria's shadow)
    interiorGroup.add(rug);

    // V138: Darker Couch (0x5d4037 -> 0x2e201b)
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
    s.position.y = 0.5; s.receiveShadow = true; couchGroup.add(s);

    const b = new THREE.Mesh(createRoundedBox(3, 1.2, 0.3, 0.15), couchMat);
    b.rotation.set(Math.PI / 2, 0, 0);
    b.position.set(0, 1.0, 0.55); b.receiveShadow = true; couchGroup.add(b);

    const aL = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aL.rotation.set(Math.PI / 2, 0, 0);
    aL.position.set(-1.6, 0.7, 0); aL.receiveShadow = true; couchGroup.add(aL);

    const aR = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aR.rotation.set(Math.PI / 2, 0, 0);
    aR.position.set(1.6, 0.7, 0); aR.receiveShadow = true; couchGroup.add(aR);

    couchGroup.position.set(0, -0.3, 2.5);
    interiorGroup.add(couchGroup);

    const chairGroup = new THREE.Group();
    const cS = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.4, 0.15), couchMat);
    cS.rotation.set(Math.PI / 2, 0, 0);
    cS.position.y = 0.5; cS.receiveShadow = true; chairGroup.add(cS);

    const cB = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.3, 0.15), couchMat);
    cB.rotation.set(Math.PI / 2, 0, 0);
    cB.position.set(0, 1.0, 0.55); cB.receiveShadow = true; chairGroup.add(cB);

    const cAL = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAL.rotation.set(Math.PI / 2, 0, 0);
    cAL.position.set(-0.7, 0.7, 0); cAL.receiveShadow = true; chairGroup.add(cAL);

    const cAR = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAR.rotation.set(Math.PI / 2, 0, 0);
    cAR.position.set(0.7, 0.7, 0); cAR.receiveShadow = true; chairGroup.add(cAR);

    chairGroup.position.set(3.5, -0.3, -1.0);
    chairGroup.rotation.y = Math.PI / 2;
    interiorGroup.add(chairGroup);

    try {
        if (typeof createMetropolisRobot === 'function') {
            window.metropolisRobot = createMetropolisRobot();
            window.metropolisRobot.position.set(4.5, 0, -4.0);
            window.metropolisRobot.rotation.y = -0.5;
            window.metropolisRobot.scale.set(1.125, 1.125, 1.125);

            // V-SHADOW: Enable shadow casting for Maria
            window.metropolisRobot.castShadow = true;
            window.metropolisRobot.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            interiorGroup.add(window.metropolisRobot);

            const robotGlow = new THREE.PointLight(0x00ffff, 2.5, 12);
            robotGlow.position.set(0, 1.5, 0.5);
            window.metropolisRobot.add(robotGlow);
            window.robotGlowLight = robotGlow;

            // V-FIX: Explicit Hitbox for Maria (Easier Clicking)
            // V-FIX 19: Enable depthWrite: false to preventing occluding the Glow/Rings!
            // V-FIX 21: Invisible again (User verified)
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

            // V-WORDHUNT: Hidden Orb in Maria
            if (typeof WordHunt !== 'undefined') {
                const item = WordHunt.createInteractable('living');
                if (item) {
                    item.position.set(0, 1.5, 0);
                    item.scale.set(0.1, 0.1, 0.1);
                    item.visible = false;
                    window.metropolisRobot.add(item);

                    // Click Handler for Robot
                    // We need to ensure the robot mesh itself is clickable or we add a hitbox
                    window.metropolisRobot.userData.type = 'MariaRobot';
                    window.metropolisRobot.userData.onClick = () => {
                        if (item.userData.revealed) return;

                        console.log("Maria Clicked! Popping out orb...");
                        item.visible = true;
                        item.userData.revealed = true;

                        // Animate Pop Out
                        new TWEEN.Tween(item.position)
                            .to({ y: 3.0 }, 1500)
                            .easing(TWEEN.Easing.Elastic.Out)
                            .start();

                        new TWEEN.Tween(item.scale)
                            .to({ x: 1.0, y: 1.0, z: 1.0 }, 1500)
                            .easing(TWEEN.Easing.Elastic.Out)
                            .start();
                    };

                    // V-FIX: Double-Bind! Attach ONE handler to the Hitbox too
                    hitBox.userData.onClick = window.metropolisRobot.userData.onClick;

                    if (window.interiorClickables) {
                        window.interiorClickables.push(window.metropolisRobot);
                        // Push hitbox too just in case raycaster hits it first and stops?
                        // (intersectObjects true handles children, but pushing explicit is safer if hierarchy logic is strict)
                        // Actually, pushing the GROUP (robot) is usually enough.
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Living Room Robot Init Failed", e);
    }
}
// --- ARTIFACT HELPERS (V166) ---

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
    // V306: Darker (0.5 -> 0.3)
    const annexLight = new THREE.PointLight(0xffaa00, 0.3, 15); // Reduced range from 12 to 5 for intimacy
    annexLight.position.set(0, 0.35, 0); // Local to group
    annexLight.castShadow = true;
    // V-FIX: Soft/Blurry Shadows
    annexLight.shadow.radius = 4;
    annexLight.shadow.mapSize.width = 512;
    annexLight.shadow.mapSize.height = 512;
    // V-FIX: Shadow Bias to prevent self-shadowing artifacts (the "mysterious dark shadow")
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
    animator.castShadow = false; // V-FIX: Ensure hidden helper doesn't cast shadow
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
    // V-FIX: Move away from wall (-1.0 -> -0.9) to fix shadow artifact
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
    // V-FIX: Move together with bed (-0.9)
    pillow.position.set(-0.9, 0.45, 1.4);
    pillow.castShadow = true; pillow.receiveShadow = true;
    interiorGroup.add(pillow);

    // Blanket (Thin & Flush)
    // V-FIX: Reduced width (1.82 -> 1.75) to prevent clipping into wall
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 }));
    // V-FIX: Move with bed (-0.9)
    blanket.position.set(-0.9, 0.41, -0.1);
    interiorGroup.add(blanket);

    // V-FIX: Chair closer to desk (-0.8) and scaled (0.75)
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
    // V311: Moved from -1.95 to -1.7 to prevent wall piercing
    createWallShelf(-1.7, 2.0, 0, Math.PI / 2);
    createWallShelf(-1.7, 2.8, 0, Math.PI / 2);

    // 3. Narrow Suitcase
    const suitcase = createSuitcase();
    suitcase.scale.set(1.0, 1.0, 1.4);
    // V-FIX: On the Floor (y=0.0) - Was y=0.2 (floating)
    suitcase.position.set(1.4, 0.0, 1.6);
    suitcase.rotation.y = 0.4;
    interiorGroup.add(suitcase);

    // 4. Desk
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 }); // Re-using woodMat from chair for consistency
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), woodMat);
    deskTop.position.y = 1.0;
    deskTop.castShadow = true; deskTop.receiveShadow = true;
    deskGroup.add(deskTop);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
    // V173: Removed left legs (mounted to wall)
    const legBR = new THREE.Mesh(legGeo, woodMat); legBR.position.set(1.4, 0.5, -0.45);
    legBR.castShadow = true; legBR.receiveShadow = true;
    const legFR = new THREE.Mesh(legGeo, woodMat); legFR.position.set(1.4, 0.5, 0.45);
    legFR.castShadow = true; legFR.receiveShadow = true;
    deskGroup.add(legBR, legFR);
    // V173: Mounted to Left Wall (X=-2), so group shifts by -0.4 (Center at -0.4, Width 3.2)
    deskGroup.position.set(-0.4, 0, -1.3);

    // V171: Populate desk with items
    addDeskItems(deskGroup);

    // V173: Diary Hologram in 3D Space
    createDiaryHologram(deskGroup);

    interiorGroup.add(deskGroup);

    // V-NEW: Moving Rothko Painting (High up on Wall)
    createRothkoPainting();

    // V-WORDHUNT: Add Word Hunt Orb - "Remember"
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('annex');
        if (item) {
            item.position.set(0, 1.5, 0); // Near Chair
            interiorGroup.add(item);
        }
    }
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
    // V-FIX: Full Torus (Math.PI -> Math.PI * 2) to look complete
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI * 2), metalMat);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.x = -Math.PI / 2; // Flat on top
    handle.position.set(0, 0.2, 0.25); // On top of lid
    lidGroup.add(handle);

    group.add(lidGroup);

    // V-WORDHUNT Integration (Directly here to couple with Suitcase logic)
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('annex');
        if (item) {
            // Hide "Inside" (Sitting on bottom)
            item.position.set(0, 0.3, 0);
            item.scale.set(0.1, 0.1, 0.1);
            item.visible = false;
            group.add(item); // Add to Suitcase Group

            // Click Handler
            const openSuitcase = () => {
                if (!lidGroup.userData.isOpen) {
                    console.log("Suitcase Clicked - OPENING");
                    lidGroup.userData.isOpen = true;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: -Math.PI / 2.5 }, 1200).easing(TWEEN.Easing.Quadratic.Out).start();
                    item.visible = true; item.userData.revealed = true;
                    new TWEEN.Tween(item.position).to({ y: 1.5 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                    new TWEEN.Tween(item.scale).to({ x: 1.0, y: 1.0, z: 1.0 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                } else {
                    console.log("Suitcase Clicked - SHUTTING");
                    lidGroup.userData.isOpen = false;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: 0 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    new TWEEN.Tween(item.position).to({ y: 0.3 }, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(() => { if (!lidGroup.userData.isOpen) item.visible = false; }).start();
                    new TWEEN.Tween(item.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                }
            };

            // Hitbox for clicking
            const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
            hitBox.position.y = 0.3;
            hitBox.castShadow = false; // V-FIX: No shadow for hitbox
            hitBox.userData = { onClick: openSuitcase, type: 'suitcase' };
            group.add(hitBox);

            if (window.interiorClickables) interiorClickables.push(hitBox);
        }
    }

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

    // 3. Books
    const bookColors = [0x451a03, 0x1a2e05, 0x051a45, 0x222222];
    for (let i = 0; i < 3; i++) {
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.45), new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] }));
        book.position.set(-1.1, 1.1 + i * 0.06, -0.2);
        book.rotation.y = 0.1 * i;
        deskGroup.add(book);
    }

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
    diaryGroup.userData = { type: 'diary' };

    deskGroup.add(diaryGroup);
    interiorClickables.push(diaryGroup);
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
    ctx.font = '900 42px Arial, sans-serif'; // V326 Unification
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = [
        '"You should',
        'always be',
        'prepared to',
        'pack your',
        'bags and',
        'move west..."'
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
    // V178: Adjusted Pivot Logic - Move Geometry so Pivot is at Bottom (Y=0)
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
    // 5x9 Portrait Ratio
    // Placed on Back Wall (-0.4, 3.5, -1.95) based on previous fix
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
    // V304: Darker Annex (0.6 -> 0.3)
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

        // Decide Mode: 2 Fields or 3 Fields?
        const mode2 = Math.random() > 0.5;
        let hideIndex = -1;
        if (mode2) {
            // Pick one random block to hide (0, 1, or 2)
            hideIndex = Math.floor(Math.random() * 3);
        }

        // Block targets
        blocks.forEach((b, i) => {
            const c = hsls[i % hsls.length];
            b.targetH = c.h;
            b.targetS = c.s;
            b.targetL = c.l;

            // Weight Logic
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

        // V-REFINE: "Tiny bit less blurry" -> 30px (was 45)
        ctx.filter = 'blur(30px)';

        // Lerp weights and Calculate Total Layout
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

        // Dynamic Gap Calculation
        // Gap contributes to layout only if adjacent blocks exist. 
        // We simulate gap "weight" based on block presence.
        // Simple approx: Gap height = maxGap * (weight of block above?)
        // Let's just sum (gap * smoothed_presence)
        // Actually, simpler: 
        // We have 2 internal gaps for 3 blocks.
        // If mid block is gone, we have 1 big gap or 2 gaps merged?
        // Layout: gap belongs to the block visually above it (index 0, 1). Last block (2) has no gap below.

        let totalGapUsage = 0;
        const gapSizes = [];

        for (let i = 0; i < blocks.length - 1; i++) {
            // Gap exists if BOTH current and next block have weight?
            // Or if we just treat gap as attached to the block.
            // If block 0 shrinks, gap 0 should shrink too to avoid big empty space at top?
            // Yes: gap size = maxGap * Math.min(b[i].weight, 1.0) * Math.min(b[i+1].weight, 1.0)?
            // If adjacent blocks are both visible, gap is full. If one fades, gap fades.

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
    console.log("Loading Toilet Interior v24 (V4 Feedback) - Cozy Lamp & Perfect Seat");

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    // V140: Darker Ceramic (0xeeeeff -> 0x8888aa)
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

    // Black Toilet Seat - LARGER TO COVER RIM
    // V140: Darker Seat (0x111111 -> 0x050505)
    // Bowl top radius is 0.5.
    // Seat should match.
    // TorusGeometry(radius, tube, radial, tubular)
    // radius = 0.5, tube = 0.1
    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.1 });
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 24, 64), blackWoodMat);
    seat.rotation.x = -Math.PI / 2;
    // seat.rotation.z = Math.PI; 
    seat.position.y = 0.6; // Sit nicely on rim
    // seat.scale.set(1, 1.2, 1); // Oval? Bowl is cylinder (circle).
    seat.castShadow = true;
    toiletGroup.add(seat);

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    // V140: Darker Shelf (0x5D4037 -> 0x2e201b)
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
    lctx.font = '900 80px "Glass Antiqua", cursive'; // V326 Unification
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
    // Moved UP: Y=2.0 -> 3.5 (relative to shelf) ?? Wait, shelf is at 3.2. 
    // Previous lamp was at shelf.add(lampGroup) at pos (0, 2.0, -0.2).
    // So absolute Y was 3.2 + 2.0 = 5.2. That is quite high.
    // Maybe user meant visible mesh was too low?
    // Let's ensure it's high on the wall.
    // Let's set it to y=2.5 relative to shelf -> Absolute 5.7.
    lampGroup.position.set(0, 2.8, -0.2);
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

    // COZY WARM LIGHT (Brighter)
    // V140: Dimmed (0.6 -> 0.3) -> V-FIX: Darker (0.15)
    const backLight = new THREE.PointLight(0xffaa33, 0.15, 15);
    backLight.castShadow = true;
    backLight.shadow.mapSize.width = 1024; // V-REFINE: Sharp Shadows
    backLight.shadow.mapSize.height = 1024;
    backLight.shadow.bias = -0.0001;
    lampGroup.add(backLight);

    // V: FLICKER ANIMATION (Stronger)
    lampGroup.userData = {
        baseIntensity: 0.15, // V-FIX: Match new base
        update: function (t) {
            // Frequent Flicker (15% chance)
            if (Math.random() > 0.85) {
                // Stronger flicker range
                const flicker = (Math.random() - 0.5) * 0.4;
                backLight.intensity = Math.max(0.1, this.baseIntensity + flicker);

                // Visible Bulb Dimming
                // 0.1 Hue = Orange/Yellow. 0.5 * dim controls lightness.
                const dim = 1 + flicker * 2;
                bulb.material.color.setHSL(0.08, 0.9, 0.5 * dim);
            } else {
                // Restore stability
                backLight.intensity += (this.baseIntensity - backLight.intensity) * 0.2;
                bulb.material.color.setHex(0xffaa33);
            }
        }
    };

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('toilet');
        if (item) {
            item.position.set(0, 1.5, 1); // Floating inside room, away from shelf
            interiorGroup.add(item);
        }
    }

    // Bathroom code removed.
}
function createBedroomInterior() {
    // BED (Rounded Corners)
    const bedGroup = new THREE.Group();

    // -- VIDEO PLAYLIST PANEL --
    // V-FIX 257: Removed redundant manual button (Universal UI handles it)

    // -- DARK FLOOR
    const darkFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
    darkFloor.rotation.x = -Math.PI / 2; darkFloor.position.y = 0.01;
    interiorGroup.add(darkFloor);

    // V142: Dark Grey Mattress (0xaaaaaa -> 0x555555)
    const mattressColor = 0x555555;
    const matMat = new THREE.MeshStandardMaterial({ color: mattressColor });
    const cornerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);

    // 4 Corners
    const c1 = new THREE.Mesh(cornerGeo, matMat); c1.position.set(2.0, 0.5, 2.5); bedGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, matMat); c2.position.set(-2.0, 0.5, 2.5); bedGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, matMat); c3.position.set(2.0, 0.5, -2.5); bedGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, matMat); c4.position.set(-2.0, 0.5, -2.5); bedGroup.add(c4);

    // Fillers (Cross Shape)
    // V142: Black/Brown Frame (0x251b14 -> 0x150b04)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 5.8), new THREE.MeshStandardMaterial({ color: 0x150b04 }));
    frame.position.y = 0.2; bedGroup.add(frame);
    const mainMattress = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.6, 6.0), matMat); mainMattress.position.y = 0.5; bedGroup.add(mainMattress);
    const crossMattress = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 5.0), matMat); crossMattress.position.y = 0.5; bedGroup.add(crossMattress);

    // V142: Dark Maroon Duvet (0x7a1f2f -> 0x3d0f17)
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 4.5), new THREE.MeshStandardMaterial({ color: 0x3d0f17 }));
    duvet.position.set(0, 0.8, -0.5); bedGroup.add(duvet);
    // PILLOW (Rounded - Horizontal Cylinder)
    const pillowGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0x666666 })); // V142: Dark Grey
    pillow.rotation.z = Math.PI / 2; // Lie horizontal
    pillow.scale.set(0.6, 1, 1); // Flatten height (local X)
    pillow.position.set(0, 0.85, 2.2);
    bedGroup.add(pillow);

    bedGroup.position.set(2.5, 0, -1);
    interiorGroup.add(bedGroup);

    // DESK (Without Phone)
    // V142: Darkest Wood Desk (0x2e201b -> 0x1e100b)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x1e100b }));
    desk.position.set(-2.5, 0.6, -3); interiorGroup.add(desk);

    // V135: Lamp on Table (Corner) - Bigger & Brighter
    const lampGroup = new THREE.Group();
    // Base
    lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x111111 })));
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    pole.position.y = 0.4; lampGroup.add(pole);
    // Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xcc8800, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    shade.position.y = 0.7; lampGroup.add(shade);
    // Light - Dimmer (Night Bed Lamp) - Darker
    // V142: Reduced Intensity (0.8 -> 0.4) -> V-NEW (0.15) -> V257 (1.2) -> V261 (2.5)
    const bulb = new THREE.PointLight(0xffaa00, 2.5, 8);
    bulb.position.y = 0.6;
    lampGroup.add(bulb);

    // Position on Desk (Left Back Corner)
    // Scale Up 2x
    lampGroup.scale.set(2, 2, 2);
    lampGroup.position.set(-3.8, 1.2, -3.5);
    interiorGroup.add(lampGroup);

    // WALL MOUNTED VIDEO PLAYER (BIGGER, BACK WALL)
    const phone = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
    phone.position.set(3.2, 4.5, -4.95); // V501: Extreme right for NO overlap
    phone.userData = { type: 'videoPhone', state: 'stopped' };
    interiorGroup.add(phone);
    interiorClickables.push(phone);

    videoTexture = new THREE.VideoTexture(videoElement);
    // Force src to Bedroom Playlist (Fixes "wrong video" if coming from other room)
    if (roomContent.bedroom.videoPlaylist && roomContent.bedroom.videoPlaylist.length > 0) {
        videoElement.src = roomContent.bedroom.videoPlaylist[0].src;
        videoElement.pause(); // Start Paused
    }

    const phoneScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.6), new THREE.MeshBasicMaterial({ map: videoTexture }));
    phoneScreenMesh.position.set(0, 0, 0.06);
    phoneScreenMesh.name = 'screen';
    phone.add(phoneScreenMesh);

    if (roomContent.bedroom.videoPlaylist) {
        // V-FIX: Universal Video UI
        if (window.createUniversalVideoInterface) {
            // Position adjusted to match previous header height (y=6.0 approx)
            // V-FIX: Moved Right (-2.8 -> -1.5) per User Request
            // V306: Move screen "more to the right" (User Request)
            // Was -2.8 -> Moved to -1.5 (Closer to center/desk)
            // V501: Extreme left for NO overlap with screen
            const videoPos = new THREE.Vector3(-1.8, 4.2, -4.8);
            window.createUniversalVideoInterface(interiorGroup, videoPos, roomContent.bedroom.videoPlaylist, {
                onPlay: playVideo // V-FIX 257: Pass correct handler
            });
        }
    }

    const shelfGeo = new THREE.BoxGeometry(0.8, 0.1, 1.2);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(-4.6, 3.5, 3.0);
    interiorGroup.add(shelf);

    // V-FIX 264: Drop Shadow for Shelf
    const shadowGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-4.6, 3.45, 3.0); // Slightly below
    interiorGroup.add(shadow);

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bedroom');
        if (item) {
            item.position.set(0, 3, 0); // Above bed/center
            interiorGroup.add(item);
        }
    }

    // Lava Lamp
    createLavaLamp(0.108, shelf.position);
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
        // V142: Duller Glow (1.6 -> 0.8) -> V261 (1.2)
        emissiveIntensity: 1.2
    });
    const liquidCore = new THREE.Mesh(coreGeo, coreMaterial);
    liquidCore.position.y = 1.0;
    lampGroup.add(liquidCore);

    // Lights
    // V142: Dimmer Lights (4 -> 2) -> V-NEW (0.5) -> V261 (1.5)
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
        // V142: Duller Blobs (6.4 -> 3.2) -> V261 (4.0)
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
            speed: 0.5 + Math.random() * 0.5, // Faster relative speed for small cleanup
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
        // Shelf Top is anchorPos.y + 0.05
        // Lamp Bottom Offset is 6.6 * scale
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
            // Original code used `time` in ms * 0.001. `t` passed from update is likely seconds.
            // But let's check `t` in house.js... animate(time). 
            // `t = time * 0.001` (seconds).

            // Re-tuning physics for 't' (seconds)
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
    masterVideoIndex = (masterVideoIndex + 1) % roomContent.bedroom.videoPlaylist.length;
    startVideoClip('bedroom');
    // V-FIX 257: Update UI
    if (window.updateVideoUI) window.updateVideoUI();
}

// V-FIX 9: Helper to Stop Video & Reset Lights (Bedroom specific)
window.stopBedroomVideo = function () {
    if (window.videoElement && !window.videoElement.paused) window.videoElement.pause();

    // Restore Bedroom Defaults (Matches house.js ApplyRoomLighting)
    // Dark/Moody
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.02 }, 1000).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.05 }, 1000).start();
    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.05 }, 1000).start();

    console.log("Bedroom Video Stopped: Restoring Lights");
};

function playVideo(index) {
    const playlist = roomContent.bedroom.videoPlaylist;
    if (!playlist || !playlist[index]) return;

    masterVideoIndex = index;
    // V-FIX 257: Direct Play & UI Update
    startVideoClip('bedroom');

    // V-FIX: User reported room SHOULD get dark (like cinema)
    if (window.applyRoomLighting) {
        window.applyRoomLighting('basement'); // Use 'basement' profile for darkness
    }

    // Sync UI if available
    if (window.updateVideoUI) window.updateVideoUI();
}
window.createStudioInterior = function () {
    // -- STUDIO INTERIOR (Standard File Remastered) --
    // Content: Furniture (Desk/Chair/Rug) + Video Posters (Metropolis/Tron) + Molecule (Atom)

    // 1. FURNITURE
    // Scaling Group for Furniture
    const furnGroup = new THREE.Group();
    furnGroup.scale.set(1.25, 1.25, 1.25);
    interiorGroup.add(furnGroup);

    // Desk
    // Desk
    // V140: Darker Desk (0x8d6e63 -> 0x463732)
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 1.5), deskMat);
    desk.position.set(0, 1.0, -1.5);
    furnGroup.add(desk);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.0, 0.1);
    const fl = new THREE.Mesh(legGeo, deskMat); fl.position.set(-1.4, -0.5, 0.65); desk.add(fl);
    const fr = new THREE.Mesh(legGeo, deskMat); fr.position.set(1.4, -0.5, 0.65); desk.add(fr);
    const bh = new THREE.Mesh(legGeo, deskMat); bh.position.set(-1.4, -0.5, -0.65); desk.add(bh);
    const br = new THREE.Mesh(legGeo, deskMat); br.position.set(1.4, -0.5, -0.65); desk.add(br);

    // Laptop (Interactive)
    const laptopGroup = new THREE.Group();
    // V921: Scaled up 33% 
    // Was default 1.0. New scale 1.33.
    // Note: Furniture group is already 1.25. 
    // This scales it further relative to the desk.
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
    interiorClickables.push(hitBox);

    // V921: "EXPAND YOUR MIND" Hologram (Replacing "Reality is Relative" popup)
    // Create new Hologram visible in 3D space permanently (or looping)
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

    // Animation loop handled via texture update? 
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
    interiorClickables.push(deskHoloMesh);

    // Chair
    // V140: Darker Chair (0x333333 -> 0x111111)
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), chairMat);
    seat.position.set(0, 0.8, 0.5);
    seat.castShadow = true; // V306: Shadows
    furnGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), chairMat);
    back.position.set(0, 0.5, 0.4);
    seat.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), chairMat);
    stem.position.set(0, -0.4, 0);
    seat.add(stem);

    // Rug
    // V140: Darker Rug (0xe91e63 -> 0x750f31)
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0x750f31 }));
    rug.position.set(0, 0.02, 0);
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
        vid.style.position = 'fixed';
        vid.style.top = '-10000px';
        vid.style.left = '-10000px';
        document.body.appendChild(vid);

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

    // Metropolis (Back Wall)
    const mepo = createVideoPoster('../assets/video/mepo.mp4', 0.8);
    mepo.mesh.position.set(1.0, 5, -4.9);
    interiorGroup.add(mepo.mesh);

    // Tron (Left Wall)
    const tron = createVideoPoster('../assets/video/tronai.mp4', 0.9);
    tron.mesh.scale.set(0.75, 0.75, 0.75);
    tron.mesh.position.set(-4.9, 5, 3.5);
    tron.mesh.rotation.y = Math.PI / 2;
    interiorGroup.add(tron.mesh);

    // 3. MOLECULE (Atom Group)
    atomGroup = new THREE.Group();
    atomGroup.position.set(-3, 4, -3);
    interiorGroup.add(atomGroup);

    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 }));
    atomGroup.add(nucleus);

    const createOrbit = (rx, ry, rz, color) => {
        const orbitGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 50);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        orbitGroup.add(ring);

        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: color }));
        electron.position.x = 1.5;
        orbitGroup.add(electron);

        orbitGroup.rotation.set(rx, ry, rz);
        orbitGroup.userData = { speed: Math.random() * 0.05 + 0.02, electron: electron };
        atomGroup.add(orbitGroup);
    };

    createOrbit(0, 0, 0, 0xff0000);
    createOrbit(Math.PI / 2, 0, 0, 0xffff00);
    createOrbit(0, Math.PI / 2, Math.PI / 4, 0x00ccff);

    // V-WORDHUNT: Hidden Orb in Molecule
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('studio');
        if (item) {
            // Hide inside Nucleus initially
            item.position.set(0, 0, 0);
            item.scale.set(0.1, 0.1, 0.1);
            item.visible = false;
            atomGroup.add(item); // Add to atomGroup so it moves with it

            // Make Nucleus Clickable
            // Nucleus is the first child of atomGroup usually, or we can add a hitbox
            nucleus.userData = {
                type: 'atom_nucleus',
                onClick: () => {
                    if (item.userData.revealed) return;
                    console.log("Atom Nucleus Clicked! Finding Word...");

                    item.visible = true;
                    item.userData.revealed = true;

                    // Animate Pop Out (Explode out)
                    new TWEEN.Tween(item.position)
                        .to({ y: 1.5, x: 0.5, z: 0.5 }, 1500)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start();

                    new TWEEN.Tween(item.scale)
                        .to({ x: 1.0, y: 1.0, z: 1.0 }, 1500)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start();
                }
            };
            interiorClickables.push(nucleus);

            // Hitbox for easier clicking (Nucleus is small 0.4)
            const nHit = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            nHit.userData = nucleus.userData;
            atomGroup.add(nHit);
            interiorClickables.push(nHit);
        }
    }

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

    // R2-D2 Body Rings (Restored/Kept)
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
    vid.src = '../assets/video/hologram.mp4';
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

    // BEAM: Modified to be "really more blurry" and a "glowing particle cloud"
    // We removed the banded pulse to get rid of the "rings" in the beam.
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
    hologramGroup.scale.set(1.5, 1.5, 1.5); // Bigger (was 1.0)
    domeGroup.add(hologramGroup);

    // 50% Faster Animation
    hologramGroup.userData.update = function (t) {
        // Fast time
        const fastTime = t * 1.5;
        if (beamMat.uniforms) beamMat.uniforms.time.value = fastTime;
        if (holoPlane.material.uniforms) holoPlane.material.uniforms.time.value = fastTime;
    };

    // DARKER LIGHTING
    // Remove default bulb
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // Add darker custom light
    // Add darker custom light
    // V140: Dimmed (0.4 -> 0.2) -> V-NEW: 0.05
    // V306: Darker (0.8 -> 0.4)
    const studioLight = new THREE.PointLight(0xffffff, 0.4, 15);
    studioLight.position.set(0, 5, 0);
    studioLight.castShadow = true; // V306: Shadows
    studioLight.shadow.bias = -0.0001;
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
