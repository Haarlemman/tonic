// --- TV VIDEO SETUP ---
let tvVideo, tvVideoTexture;
// Need global access to lights for dimming (Cinema Mode)
window.livingCozyLight = null;
window.livingLibrarySpot = null;

function initTVVideo() {
    if (tvVideo) return;
    tvVideo = document.createElement('video');
    tvVideo.src = '/assets/video/premonition.mp4';
    tvVideo.loop = true;
    tvVideo.muted = false; // User can unmute via global controls or logic?
    // User asked for "paused at opening shot". auto-play off.
    tvVideo.autoplay = false;
    tvVideo.preload = 'auto';
    tvVideo.setAttribute('playsinline', '');

    tvVideoTexture = new THREE.VideoTexture(tvVideo);
    tvVideoTexture.minFilter = THREE.LinearFilter;
    tvVideoTexture.magFilter = THREE.LinearFilter;
    tvVideoTexture.colorSpace = THREE.SRGBColorSpace;
}

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

            console.log("Cinema Mode: Capturing & Dimming Lights");

            // 1. CAPTURE CURRENT STATE (Dynamic "Reverse" capability)
            window.preCinemaState = {
                cozy: window.livingCozyLight ? window.livingCozyLight.intensity : 0.15,
                library: window.livingLibrarySpot ? window.livingLibrarySpot.intensity : 0.2,
                spotL: window.bookcaseSpotL ? window.bookcaseSpotL.intensity : 1.2,
                spotR: window.bookcaseSpotR ? window.bookcaseSpotR.intensity : 1.2,
                ambient: window.ambientLight ? window.ambientLight.intensity : 0.6,
                dir: window.dirLight ? window.dirLight.intensity : 1.2,
                rim: window.rimLight ? window.rimLight.intensity : 0.4
            };

            const dimTime = 1000;
            const dimLevel = 0.0; // PITCH BLACK

            try {
                // Dim Room Lights
                if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: dimLevel }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // Dim Global Lights
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.1 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start(); // Low moonlight
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                // Helper for duplicates if any
                if (window.rimLight2) new TWEEN.Tween(window.rimLight2).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // Robot Glow - Keep it BRIGHT! (Do NOT dim)
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
        } else {
            // --- EXIT CINEMA MODE (PAUSE) ---
            console.log("Cinema Mode: Restoring Lights (Reversing Action)");

            // Default Fallbacks if capture failed
            const restore = window.preCinemaState || {
                cozy: 0.15, library: 0.2, spotL: 1.2, spotR: 1.2,
                ambient: 0.6, dir: 1.2, rim: 0.4
            };

            try {
                if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: restore.cozy }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: restore.library }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                // Restore bookcase spots
                if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: restore.spotL }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: restore.spotR }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                // Restore Global Lights
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: restore.ambient }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: restore.dir }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: restore.rim }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.rimLight2) new TWEEN.Tween(window.rimLight2).to({ intensity: 0.6 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start(); // If exposed, restore default

                // Restore robot glow
                if (window.robotGlowLight) new TWEEN.Tween(window.robotGlowLight).to({ intensity: 2.5 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

            } catch (e) {
                if (window.livingCozyLight) window.livingCozyLight.intensity = restore.cozy;
            }

            tvVideo.pause();
        }
    }
}
window.nextTVContent = nextTVContent;
window.stopLivingVideo = () => {
    if (typeof restoreCinemaLights === 'function') restoreCinemaLights();
    if (tvVideo) {
        tvVideo.pause();
        tvVideo.muted = true;
        console.log("Living Room Video Stopped & Muted (Cleanup)");
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
    // V138: Reduced Local Light Intensities
    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.1, 15); // 0.15 -> 0.1
    window.livingCozyLight.position.set(-3.0, 4.0, -2.0);
    window.livingCozyLight.castShadow = true;
    window.livingCozyLight.shadow.bias = -0.0001;
    interiorGroup.add(window.livingCozyLight);

    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.1); // 0.2 -> 0.1
    window.livingLibrarySpot.position.set(-2, 7.5, 0);
    window.livingLibrarySpot.target.position.set(-5, 3, 0);
    window.livingLibrarySpot.castShadow = true;
    window.livingLibrarySpot.angle = Math.PI / 3;
    window.livingLibrarySpot.penumbra = 0.5;
    interiorGroup.add(window.livingLibrarySpot);
    interiorGroup.add(window.livingLibrarySpot.target);

    // Bookcase Specific Spots
    const bookcaseSpotL = new THREE.SpotLight(0xffeedd, 0.6); // 1.2 -> 0.6
    bookcaseSpotL.position.set(-2, 6, -3.5);
    bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5); // Left Bookcase
    bookcaseSpotL.angle = Math.PI / 4;
    bookcaseSpotL.penumbra = 1.0;
    bookcaseSpotL.castShadow = true;
    interiorGroup.add(bookcaseSpotL);
    interiorGroup.add(bookcaseSpotL.target);
    window.bookcaseSpotL = bookcaseSpotL;

    const bookcaseSpotR = new THREE.SpotLight(0xffeedd, 0.6); // 1.2 -> 0.6
    bookcaseSpotR.position.set(-2, 6, 3.5);
    bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5); // Right Bookcase
    bookcaseSpotR.angle = Math.PI / 4;
    bookcaseSpotR.penumbra = 1.0;
    bookcaseSpotR.castShadow = true;
    interiorGroup.add(bookcaseSpotR);
    interiorGroup.add(bookcaseSpotR.target);
    window.bookcaseSpotR = bookcaseSpotR;

    // --- BOOKCASES ---
    // V138: Darker Shelf (0x2b1d14 -> 0x150e0a)
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
    function createMenorahArtifact() {
        const group = new THREE.Group();
        // Gold Material
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 1.0,
            roughness: 0.2, // Shiny
        });
        const candleMat = new THREE.MeshStandardMaterial({ color: 0xffffee, roughness: 0.9 });
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

        // 1. BASE
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 0.1, 8), goldMat);
        base.position.y = 0.05;
        group.add(base);

        // 2. CENTRAL STEM
        // V148: Shorter Stem (1.2 -> 1.0)
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), goldMat);
        stem.position.set(0, 0.6, 0);
        group.add(stem);

        // 3. ARMS (3 U-Shapes)
        // We use Torus segments cut in half (arc = Math.PI)
        // Rotated to stand up.
        // Radii: 0.15, 0.30, 0.45
        for (let i = 1; i <= 3; i++) {
            const radius = 0.15 * i;
            // TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
            const armGeo = new THREE.TorusGeometry(radius, 0.03, 8, 16, Math.PI);
            const arm = new THREE.Mesh(armGeo, goldMat);
            arm.position.y = 0.8;
            arm.rotation.z = Math.PI; // Invert U to be U shape (default Torus arc is top half?)
            group.add(arm);

            // 4. CANDLES (Left and Right for this Arm)
            // Ends of Torus are at x = +/- radius, y = center.
            // We need cups and candles there.
            const cupGeo = new THREE.CylinderGeometry(0.05, 0.02, 0.1, 8);

            // Left Side
            const cupL = new THREE.Mesh(cupGeo, goldMat);
            cupL.position.set(-radius, 0.8, 0);
            group.add(cupL);
            const candL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2), candleMat);
            candL.position.set(-radius, 0.95, 0);
            group.add(candL);

            // Right Side
            const cupR = new THREE.Mesh(cupGeo, goldMat);
            cupR.position.set(radius, 0.8, 0);
            group.add(cupR);
            const candR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2), candleMat);
            candR.position.set(radius, 0.95, 0);
            group.add(candR);
        }

        // 5. CENTRAL CANDLE
        const centerCup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.1, 8), goldMat);
        // V148: Lower Center Cup (1.2 -> 1.05) to match shorter stem (base+1.0 approx) or just above arms (0.8+r?)
        // Top of stem is at y=0.05 + 1.0 = 1.05? Base is 0.1 high, y=0.05.
        // Actually Base Center Y=0.05. Height 0.1. Top=0.1.
        // Stem Center Y=0.6. Height 1.0. Range 0.1 -> 1.1.
        // So Cup at 1.1.
        centerCup.position.set(0, 1.1, 0); // Top of Stem
        group.add(centerCup);

        const centerCandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25), candleMat);
        centerCandle.position.set(0, 1.25, 0);
        group.add(centerCandle);

        // 6. FLAME (Middle Only)
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), flameMat);
        flame.position.set(0, 1.45, 0);
        group.add(flame);

        const light = new THREE.PointLight(0xffaa00, 1.0, 3);
        light.position.set(0, 1.5, 0);
        // V147: Gentle flicker logic will be added to update
        group.add(light);


        // HIT BOX (Inclusive)
        const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.5), new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true }));
        hitBox.position.y = 0.8;
        group.add(hitBox);

        // Animation
        group.userData = {
            update: (t) => {
                // Gentle Flame Flicker
                const flicker = 0.8 + Math.sin(t * 10) * 0.1 + Math.cos(t * 23) * 0.1;
                light.intensity = flicker;
                flame.scale.setScalar(0.8 + flicker * 0.2);

                // V147: Remove Rotation? User didn't ask for spin, just "pointing".
                // Menorah should be static usually, maybe slight wobble if "magical".
                // Let's remove the wobble to be safe (Traditional = Stable).
            }
        };

        // Scale/Rotate
        group.scale.setScalar(0.7);
        // Default Rotation? Bookcase is facing +Z (Right case).
        // Artifact is usually placed on shelf.
        // We probably want the Menorah Flat against the back? Or Perpendicular?
        // Usually flat (XY plane visible).
        // If shelf is along Z axis (Side walls of bookcase are Z), backing is X.
        // We want it facing into the room (-X direction).
        // Geometry is built in XY plane.
        // So rotate Y = -Math.PI / 2 to face -X?
        group.rotation.y = -Math.PI / 2;

        window.livingArtifact = group;
        return group;
    }

    const createBookcase = (posZ) => {
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
            pivotOffsetZ = 1.2; // Move children Positive (Left in Room Frame) so Pivot is Negative (Right in Room Frame)?
            // Wait.
            // Desired Pivot World Z: `posZ - 1.2` (-3.5 - 1.2 = -4.7).
            // Current Group Z: `posZ` (-3.5).
            // Change Group Z to `-4.7`.
            // To keep Visuals at same place, move children `+1.2` (relative).
            // Visual Z = Group Z + Child Z.
            // -3.5 = -4.7 + 1.2. Correct.
        }

        const backing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.2, 2.4), shelfMat);
        backing.position.x = -0.4;
        backing.position.z = pivotOffsetZ; // Offset
        bookcaseGroup.add(backing);

        const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideL.position.z = -1.2 + pivotOffsetZ;
        bookcaseGroup.add(sideL);
        const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideR.position.z = 1.2 + pivotOffsetZ;
        bookcaseGroup.add(sideR);

        for (let row = 0; row < 5; row++) {
            const shelfY = 0.5 + (row * 1.0);
            const plank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.4), shelfMat);
            plank.position.y = shelfY - 2.5;
            plank.position.z = pivotOffsetZ;
            bookcaseGroup.add(plank);

            // V-NEW: Black Portal behind Right Bookcase
            if (row === 0 && posZ < 0) {
                const portalMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const portal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 5.2), portalMat);
                // V148: Make Portal Clickable to Enter Annex
                portal.position.set(-4.95, 2.6, posZ);
                portal.rotation.y = Math.PI / 2;
                portal.userData = { name: 'annex', type: 'room' };
                // Add to clickables? Wait, createLivingRoomInterior adds interiorGroup children to what?
                // No, we must push to `interiorClickables` manually if it's special.
                // Standard 'type: room' logic in house.js traverses `worldGroup`.
                // BUT this portal is in `interiorGroup`.
                // house.js `performClick` checks `interiorClickables`.
                // Does `performClick` handle `userData.name` (switch room) for interior objects?
                // Let's check house.js...
                // It has specific handlers for tv, phone...
                // line 1439: checks `interiorClickables`.
                // line 1445: Target found.
                // Checks TV, Phone, etc.
                // Does it handle Generic Room Switch?
                // Looking at house.js again...
                // It has specific handlers for tv, phone...
                // line 1991: `else if (target.userData.onClick)`.
                // It DOES NOT seem to have a generic "enter room" handler for INTERIOR objects.
                // `startInteractiveIntro` checks `worldGroup`.
                // So I need a custom onClick or add generic support.
                // I will add custom onClick to Portal.
                portal.userData.onClick = () => {
                    console.log("Portal Clicked -> Enter Annex");
                    enterRoom('annex');
                };

                interiorClickables.push(portal); // IMPORTANT!
                interiorGroup.add(portal);
            }

            // V-NEW: Artifact on Top Shelf of Right Bookcase (posZ < 0)
            if (row === 4 && posZ < 0) {
                // V147: Create Menorah instead of Ray Artifact
                const artifact = createMenorahArtifact(); // Was createIntenseRayArtifact
                artifact.position.set(0, shelfY - 2.15, 0 + pivotOffsetZ); // Sit on shelf + Offset
                // CLICK TRIGGER
                artifact.userData = {
                    type: 'open_secret',
                    onClick: () => {
                        console.log("Artifact Clicked!");
                        // Toggle Secret Door
                        const target = window.secretDoorGroup;
                        if (!target) return;

                        if (!target.userData.isOpen) {
                            // To open out (into room +X) from Right Pivot (-Z), we need POSITIVE Y Rotation (CCW).
                            new TWEEN.Tween(target.rotation).to({ y: Math.PI / 2.5 }, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
                            // No position tween needed if pivot logic is correct!
                            target.userData.isOpen = true;
                        } else {
                            new TWEEN.Tween(target.rotation).to({ y: 0 }, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
                            target.userData.isOpen = false;
                        }
                    }
                };
                interiorClickables.push(artifact);
                bookcaseGroup.add(artifact);
            }

            if (row === 1 && posZ < 0) {
                // TINTIN ROCKET
                const rocket = new THREE.Group();
                const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
                const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                b2.position.y = 0.2;
                const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
                b3.position.y = 0.4;
                const nose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                nose.position.y = 0.62;
                rocket.add(b1, b2, b3, nose);

                const finMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                for (let i = 0; i < 3; i++) {
                    const fg = new THREE.Group();
                    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.12), finMat);
                    fin.position.y = -0.15; fin.position.z = 0.14; fin.rotation.x = 0.4;
                    fg.add(fin); fg.rotation.y = (Math.PI * 2 / 3) * i; rocket.add(fg);
                }
                rocket.position.set(0.1, shelfY - 2.2, 0 + pivotOffsetZ);
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

    const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x4a4a4a }));
    stand.position.set(0, 0.75, -4);
    interiorGroup.add(stand);

    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    tvFrame.position.set(0, 2.6, -4.5);
    interiorGroup.add(tvFrame);

    initTVVideo();
    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    tvMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: tvVideoTexture }));
    tvMesh.position.set(0, 2.6, -4.39);
    tvMesh.userData = { type: 'tv', action: 'toggleVideo' };
    interiorGroup.add(tvMesh);
    interiorClickables.push(tvMesh);

    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 0.6, 2.25),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 })
    );
    table.position.set(0, 0.3, -1.0);
    table.castShadow = true; table.receiveShadow = true;
    interiorGroup.add(table);

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

    // V138: Darker Rug (0x450a0a -> 0x220505)
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 32), new THREE.MeshStandardMaterial({ color: 0x220505 }));
    rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02;
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
window.createLivingRoomInterior = createLivingRoomInterior;
