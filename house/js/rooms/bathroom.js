function createBathroomInterior() {
    // V135: Cabinet Wood
    // V140: Darker Wood (0x8d6e63 -> 0x463732)
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    // V140: Darker White (0xeeeeee -> 0x888888)
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY (Center)
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; interiorGroup.add(faucet);

    // MIRROR FRAME
    // V35: Aspect Ratio 9:16 (1.75 x 3.0)
    // V49: Thicker Border (1.95 x 3.20) -> Gap ~0.1 on sides
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 })); // 0x222222 -> 0x111111
    mirrorFrame.position.set(0, 3.8, -4.9);
    mirrorFrame.castShadow = true;
    interiorGroup.add(mirrorFrame);

    // V52: User requested "More Blurry" shadow.
    // We create a soft shadow texture via Canvas.
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
            // V-FIX: Adjusted Factor (0.8 -> 0.4) for Smoothness
            float horizon = 0.45 + (uViewRotation * 0.05) - (uViewPitch * 0.4); 
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
            } else {
                // Reflection mode
                vec3 finalReflect = tileColor + vec3(gloss);
                // Mix to tinted void (Very Dark)
                finalColor = mix(finalReflect, vec3(0.005, 0.01, 0.015), voidFactor);
            }

            // V-TUNE: Extra Darkening for "Blurry/Dim" feel
            finalColor *= 0.7; // Global dimmer

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


    // --- RESTORED TUB GEOMETRY (FROM BACKUP) ---
    const tubGroup = new THREE.Group();

    // V135: Rounded Hollow Tub
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
    // V43: RESTORED CHECKERED FLOOR (From V42 Blue Debug)
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
        roughness: 0.2,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; interiorGroup.add(floor);


    // V136: Beige Mat (Instead of Puddles) - Red as per previous request
    const matMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), matMat);
    bathMat.rotation.x = -Math.PI / 2;
    bathMat.position.set(0, 0.02, -2.0); // Slightly above floor
    interiorGroup.add(bathMat);


    // --- VIDEO LOGIC (V41: Time-Is-Now.mp4) ---
    // START: Do NOT auto-play video. Start in Reflection Mode.
    if (!window.videoElement) window.videoElement = document.getElementById('generic-video');

    if (window.videoElement) {
        // V41: Correct Video from data.js
        window.videoElement.src = "/assets/video/Time-Is-Now.mp4";
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

                    // V46: ROBUST AUDIO STOP
                    if (window.stopVideosForAudio) {
                        // This helper stops video too! Wait. We need to STOP MUSIC, not video.
                        // We need the opposite of stopVideosForAudio.
                        // We need "stopMusicForVideo".
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

        // Reset Lights (V289: Sync with Brighter World)
        if (dirLight) dirLight.intensity = 1.2;
        if (rimLight) rimLight.intensity = 0.4;
        if (ambientLight) ambientLight.intensity = 0.45;
    };

    // V180: VIDEO PLAYLIST (Left of Mirror)
    if (window.createUniversalVideoInterface && roomContent.bathroom.videoPlaylist) {
        // V-FIX: Universal Video UI - Positioned Left (-2.8) to avoid overlap, and Higher (2.8)
        // V-FIX: Custom Handler for Bathroom Playback (Avoid Living Room clash)
        const posData = roomContent['bathroom'].videoInterfacePos || { x: -2.8, y: 2.8, z: -4.5 };
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), roomContent.bathroom.videoPlaylist, {
            onPlay: (index) => {
                console.log("Bathroom Video Play:", index);
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
