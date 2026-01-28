let tvVideo, tvVideoTexture;
let tvScreensaver, tvScreensaverTexture; // V-NEW: Screensaver vars
// Need global access to lights for dimming (Cinema Mode)
window.livingCozyLight = null;
window.livingLibrarySpot = null;
// masterVideoIndex is global (house.js)

// V-NEW: TV Screensaver
// V-NEW: Image Slideshow Screensaver (v222)
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
    let currentIndex = -1; // Start at -1 to force first draw

    // Preload Images
    const images = {};
    slides.forEach(slide => {
        if (slide.image) {
            const img = new Image();
            img.src = slide.image;
            images[slide.image] = img;
        }
    });

    tex.userData = {
        update: (time) => {
            const nowMs = time * 1000;
            const index = Math.floor(nowMs / duration) % slides.length;

            if (index !== currentIndex || currentIndex === -1) {
                currentIndex = index;
                const slide = slides[currentIndex];

                // Draw Background
                ctx.fillStyle = slide.color || '#000000';
                ctx.fillRect(0, 0, 1024, 576);

                // Draw Image if available and loaded
                if (slide.image && images[slide.image] && images[slide.image].complete) {
                    // Scale to fit "contain"
                    const img = images[slide.image];
                    const scale = Math.min(1024 / img.width, 576 / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    const x = (1024 - w) / 2;
                    const y = (576 - h) / 2;
                    ctx.drawImage(img, x, y, w, h);
                }

                // Draw Text
                if (slide.text) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    // Add text shadow
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillText(slide.text, 512, 500); // Bottom center
                    ctx.shadowColor = 'transparent';
                }

                tex.needsUpdate = true;
            } else {
                // Check if image loaded late
                const slide = slides[currentIndex];
                if (slide.image && images[slide.image] && images[slide.image].complete && !tex.frameDrawn) {
                    // Redraw to capture loaded image
                    // Optimized: Set a flag or just force redraw if not sure?
                    // We'll just rely on the next tick or force it in a simpler way if needed.
                    // For now, let's just force redraw every frame if image is loading? No, expensive.
                    // Let's assume preloading works fast enough or it catches next cycle.
                }
            }
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
        tvVideo.src = '/assets/video/premonition.mp4';
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
            const dimLevel = 0.0; // PITCH BLACK (Local)

            try {
                // Dim Room Lights (LOCAL ONLY)
                if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V294: Bloom TV Glow behind set
                if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 3.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V-FIX: Re-enable Ambient Dimming (Address "Too Bright" feedback)
                // But Keep DirLight (Moon) ACTIVE for Outside visibility
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

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

function createLivingRoomInterior() {
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
    // V298: Balanced Local Light Intensities
    // V303: Darker Interior (0.25 -> 0.15) -> V-FIX: Brighten (0.25)
    // 5. Lighting (Brighter V315-RELOADED-5: 0.5)
    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.5, 15);
    window.livingCozyLight.position.set(0, 5, 0);
    window.livingCozyLight.castShadow = true;
    // window.livingCozyLight.shadow.bias = -0.0001; // Reduce artifacts
    interiorGroup.add(window.livingCozyLight);

    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.5);
    window.livingLibrarySpot.position.set(3, 7, 3);
    window.livingLibrarySpot.angle = Math.PI / 4;
    window.livingLibrarySpot.penumbra = 0.5;
    window.livingLibrarySpot.castShadow = true;
    window.livingLibrarySpot.target.position.set(3, 2, -4.9);
    interiorGroup.add(window.livingLibrarySpot);
    interiorGroup.add(window.livingLibrarySpot.target);

    // V298: Moody Shelf lighting
    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    const bookcaseSpotL = new THREE.SpotLight(0xfffaed, 0.3);
    bookcaseSpotL.position.set(-2, 6, -3.5);
    bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5);
    bookcaseSpotL.angle = Math.PI / 2.2;
    bookcaseSpotL.penumbra = 1.0;
    bookcaseSpotL.distance = 15;
    bookcaseSpotL.castShadow = true;
    bookcaseSpotL.shadow.radius = 4; // V204
    interiorGroup.add(bookcaseSpotL);
    interiorGroup.add(bookcaseSpotL.target);
    window.bookcaseSpotL = bookcaseSpotL;

    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    const bookcaseSpotR = new THREE.SpotLight(0xfffaed, 0.3);
    bookcaseSpotR.position.set(-2, 6, 3.5);
    bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5);
    bookcaseSpotR.angle = Math.PI / 2.2;
    bookcaseSpotR.penumbra = 1.0;
    bookcaseSpotR.distance = 15;
    bookcaseSpotR.castShadow = true;
    bookcaseSpotR.shadow.radius = 4; // V204
    interiorGroup.add(bookcaseSpotR);
    interiorGroup.add(bookcaseSpotR.target);
    window.bookcaseSpotR = bookcaseSpotR;

    // V201: Procedural Wood Texture Helper
    const createWoodMaterial = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Base Color (Light Brown / Oak)
        ctx.fillStyle = '#d2b48c'; // Tan/Burlywood
        ctx.fillRect(0, 0, 512, 512);

        // Wood Grain Pattern
        ctx.fillStyle = 'rgba(101, 67, 33, 0.1)'; // Dark Brown, low opacity
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const w = 512; // Long horizontal streaks? vertical?
            // Let's do vertical grain for furniture usually, but texture mapping varies.
            // Irregular wavy lines.
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.bezierCurveTo(x + Math.random() * 20 - 10, 170, x + Math.random() * 20 - 10, 340, x + Math.random() * 20 - 10, 512);
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.strokeStyle = 'rgba(139, 69, 19, 0.15)'; // SaddleBrown
            ctx.stroke();
        }

        // Noise
        for (let i = 0; i < 20000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)';
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;

        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            color: 0xddccaa, // tint
            roughness: 0.8,
            metalness: 0.1
        });
        return mat;
    };

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

    // V-NEW: Create Video Menu Panel
    if (roomContent['living'].videoPlaylist && roomContent['living'].videoPlaylist.length > 0) {
        createVideoPanel(roomContent['living'].videoPlaylist);
    }

    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    // V-FIX: Start with Screensaver (Slideshow) if available
    tvMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: tvScreensaverTexture || tvVideoTexture }));
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

    createBook("Tonic for\nthe Bones", '#8b0000', -0.6, -1.4, 0.2, '/assets/images/tftb-cover.jpg');
    createBook("Phantom\nParents", '#1a237e', -0.4, -0.4, -0.1, '/assets/images/phantomparents-cover.jpg');
    createBook("Gifts", '#065f46', 0.5, -0.9, -0.3, '/assets/images/gifts-cover.jpg');

    const cardGeo = new THREE.BoxGeometry(0.6, 0.15, 0.9);
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 256; cardCanvas.height = 384;
    const cctx = cardCanvas.getContext('2d');
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 256, 384);
    cctx.fillStyle = '#000000'; cctx.font = 'bold 22px Arial'; cctx.textAlign = 'center';
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
    rug.receiveShadow = true; // V204: Receive Shadows
    interiorGroup.add(rug);

    // V138: Darker Couch (0x5d4037 -> 0x2e201b)
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    const couchGroup = new THREE.Group();
    const s = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 1.2), couchMat);
    s.position.y = 0.5; couchGroup.add(s);
    const b = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.3), couchMat);
    b.position.set(0, 1.0, 0.55); couchGroup.add(b);
    const aL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.3), couchMat);
    aL.position.set(-1.6, 0.7, 0); couchGroup.add(aL);
    const aR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.3), couchMat);
    aR.position.set(1.6, 0.7, 0); couchGroup.add(aR);
    couchGroup.position.set(0, -0.3, 2.5);
    interiorGroup.add(couchGroup);

    const chairGroup = new THREE.Group();
    const cS = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), couchMat);
    cS.position.y = 0.5; chairGroup.add(cS);
    const cB = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.3), couchMat);
    cB.position.set(0, 1.0, 0.55); chairGroup.add(cB);
    const cAL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.3), couchMat);
    cAL.position.set(-0.7, 0.7, 0); chairGroup.add(cAL);
    const cAR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.3), couchMat);
    cAR.position.set(0.7, 0.7, 0); chairGroup.add(cAR);
    chairGroup.position.set(3.5, -0.3, -1.0);
    chairGroup.rotation.y = Math.PI / 2;
    interiorGroup.add(chairGroup);

    try {
        if (typeof createMetropolisRobot === 'function') {
            window.metropolisRobot = createMetropolisRobot();
            window.metropolisRobot.position.set(4.5, 0, -4.0);
            window.metropolisRobot.rotation.y = -0.5;
            window.metropolisRobot.scale.set(1.125, 1.125, 1.125);
            interiorGroup.add(window.metropolisRobot);

            const robotGlow = new THREE.PointLight(0x00ffff, 2.5, 12);
            robotGlow.position.set(0, 1.5, 0.5);
            window.metropolisRobot.add(robotGlow);
            window.robotGlowLight = robotGlow;
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
