function createBathroomInterior() {
    // V128: Cabinet Wood
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.1 });

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
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
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

    // BUTTON (Left of Mirror)
    // V49: Adjusted position for wider frame
    const btnGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const videoBtn = new THREE.Mesh(btnGeo, btnMat);
    videoBtn.position.set(-1.6, 3.5, -4.85); // Moved left (-1.4 -> -1.6)
    videoBtn.userData = { type: 'bathroomMirrorButton' };

    // Toggle Function
    videoBtn.toggleMirror = function () {
        if (window.toggleBathroomMirror) window.toggleBathroomMirror();
    };

    interiorGroup.add(videoBtn);
    interiorClickables.push(videoBtn);

    // 1. Remove default bright bulb
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // 2. Add Darker Ambience
    const darkAmb = new THREE.PointLight(0x223344, 0.5, 15);
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
        uniform float uTime;
        uniform sampler2D uMap;
        uniform float uScale;   // 6.0
        uniform float uUseVideo; // 0.0 = Reflection, 1.0 = Video
        varying vec2 vUv;
        
        void main() {
             // V45 Refinement: SUPER SENSITIVE
             // The user says "Not responding".
             // We will amplify uViewRotation massively (4.0) and use inverted Y for drift.
             
             float sensitiveAngle = uViewRotation * 4.0; 
             
             float angle = vUv.x * 1.0 + vUv.y * 0.1; 
             float move = sensitiveAngle + (uTime * 0.1); 
             float p = fract(angle - move);
             
             // Pseudo-3D Checkboard
             float depth = 1.0 / max(0.01, (1.0 - vUv.y)); 
             float x = vUv.x * depth * uScale + (sensitiveAngle * 2.0); // Add parallax to texture lookup directly
             float y = depth * uScale;
             
             // Checkboard
             float check = mod(floor(x) + floor(y), 2.0);
             vec3 tileColor = (check < 0.5) ? vec3(0.1) : vec3(0.9);
             
             // Gloss (Animated) - V53 INTERACTIVE GLARE
             // Reacts strongly to uViewRotation (Parallax) -> "Interactive"
             float glarePos = 0.5 + (sensitiveAngle * 0.5) + (sin(uTime * 0.8) * 0.15);
             float glareWidth = 0.15;
             float gloss = (1.0 - vUv.y) * 0.2; // Base ambient gloss
             // Bright interactive streak
             float streak = smoothstep(glareWidth, 0.0, abs(vUv.x - glarePos));
             gloss += streak * 0.4; // Strong glare add

             // V47: HORIZON VOID (Darken Top)
             float voidFactor = smoothstep(0.6, 0.98, vUv.y);
             
             vec3 finalColor;

             if (uUseVideo > 0.5) {
                 vec4 vid = texture2D(uMap, vUv);
                 // V54: Add Glare to Video (Screen Effect)
                 // We add the gloss/streak on top of the video pixels
                 finalColor = vid.rgb + vec3(gloss * 0.5); // Slightly reduced intensity for video readability
             } else {
                 // Checkboard Reflection
                 vec3 finalReflect = tileColor + vec3(gloss);
                 finalColor = mix(finalReflect, vec3(0.0), voidFactor);
             }

             gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const mirrorMat = new THREE.ShaderMaterial({
        vertexShader: mirrorVertexShader,
        fragmentShader: mirrorFragmentShader,
        uniforms: {
            uViewRotation: { value: 0 },
            uTime: { value: 0 },
            uMap: { value: null },
            uScale: { value: 6.0 },
            uUseVideo: { value: 0.0 }
        }
    });

    // Register for animation updates
    // METHOD A: Global List
    if (typeof animatedShaderMaterials !== 'undefined') {
        animatedShaderMaterials.push(mirrorMat);
    }

    // METHOD B: Direct Update (Robust)
    mirrorFrame.userData.update = function (t) {
        // 1. Update Time
        mirrorMat.uniforms.uTime.value = t;

        // 2. Update Rotation (Parallax)
        const cam = window.camera || camera;
        if (cam) {
            // V45: Debug Log Every 100 frames to prove it's working
            const angle = Math.atan2(cam.position.x, cam.position.z);
            mirrorMat.uniforms.uViewRotation.value = angle;
        }

        // 3. Update Video Texture if playing
        if (videoElement && !videoElement.paused && mirrorMat.uniforms.uMap.value) {
            mirrorMat.uniforms.uMap.value.needsUpdate = true;
        }
    };


    // MIRROR GLASS (Using mirrorMat)
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.70, 2.95), mirrorMat);
    mirrorGlass.position.z = 0.06; mirrorFrame.add(mirrorGlass);
    mirrorGlass.name = 'mirrorSurface';
    // V44: Make Mirror Surface Clickable Too
    mirrorGlass.userData = { type: 'bathroomMirrorButton' }; // Act like the button
    mirrorGlass.toggleMirror = videoBtn.toggleMirror; // Share function
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
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 512, 512);
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
    if (!videoElement) videoElement = document.getElementById('generic-video');

    if (videoElement) {
        // V41: Correct Video from data.js
        videoElement.src = "/assets/video/Time-Is-Now.mp4";
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.crossOrigin = "anonymous";

        // Pre-load texture but don't show it (Pause immediately)
        videoElement.play().then(() => {
            videoElement.pause();
            // Create texture ONCE
            if (!mirrorMat.uniforms.uMap.value) {
                const vTex = new THREE.VideoTexture(videoElement);
                mirrorMat.uniforms.uMap.value = vTex;
            }
        }).catch(e => console.warn("Mirror Video Init fail", e));
    }

    window.toggleBathroomMirror = function () {
        console.log("V46: toggleBathroomMirror CLICKED!");

        // Toggle Audio on Click
        if (videoElement) {
            videoElement.muted = !videoElement.muted;
        }

        const btn = interiorClickables.find(c => c.userData.type === 'bathroomMirrorButton');

        if (mirrorMat) {
            const currentMode = mirrorMat.uniforms.uUseVideo.value;

            // STATE MACHINE
            if (currentMode < 0.5) {
                // REFLECTION -> PLAY
                mirrorMat.uniforms.uUseVideo.value = 1.0;
                if (videoElement) {
                    videoElement.play();

                    // V46: ROBUST AUDIO STOP
                    if (window.audioPlayer && typeof window.audioPlayer.pause === 'function') {
                        console.log("V46: Stopping Room Music...");
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                    }
                    // Kill the Music Switch LED (Turn RED)
                    let ms = null;
                    if (window.getMusicSwitch) ms = window.getMusicSwitch();
                    if (!ms && window.musicSwitchMesh) ms = window.musicSwitchMesh;

                    if (ms) {
                        ms.material.color.setHex(0xff0000); // Red
                        console.log("V46: Music Switch turned OFF (Red)");
                    }
                }
                if (btn) btn.material.color.setHex(0x00ff00); // Green
            } else {
                // PLAY -> PAUSE
                if (videoElement && !videoElement.paused) {
                    videoElement.pause();
                    if (btn) btn.material.color.setHex(0xffff00); // Yellow
                } else {
                    // PAUSE -> REFLECTION
                    mirrorMat.uniforms.uUseVideo.value = 0.0;
                    if (btn) btn.material.color.setHex(0xff0000); // Red
                }
            }
        }
    };
}
