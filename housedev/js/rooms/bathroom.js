
// --- BATHROOM.JS ---
console.log("Loading Bathroom Room...");

window.createBathroomInterior = function () {
    // Materials
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; interiorGroup.add(faucet);

    // WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bathroom');
        if (item) {
            item.position.set(0, 1.5, -4.2);
            item.scale.set(0.8, 0.8, 0.8);
            interiorGroup.add(item);
        }
    }

    // MIRROR FRAME
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    mirrorFrame.position.set(0, 3.8, -4.9);
    mirrorFrame.castShadow = true;
    interiorGroup.add(mirrorFrame);

    // Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    sCtx.shadowColor = "rgba(0, 0, 0, 0.8)"; sCtx.shadowBlur = 20; sCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    sCtx.fillRect(20, 20, 88, 88);
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, opacity: 0.6, depthWrite: false }));
    shadowPlane.position.z = -0.08;
    mirrorFrame.add(shadowPlane);

    // Lights
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);
    const darkAmb = new THREE.PointLight(0x223344, 0.15, 15);
    darkAmb.position.set(0, 6, 0);
    interiorGroup.add(darkAmb);

    // SHADER (MIRROR)
    const mirrorVertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const mirrorFragmentShader = `
        uniform float uViewRotation; uniform float uViewPitch; uniform float uTime;
        uniform sampler2D uMap; uniform float uScale; uniform float uUseVideo;
        varying vec2 vUv;
        void main() {
            float sensitiveAngle = uViewRotation * 4.0; 
            float horizon = 0.5 - (uViewPitch * 1.5); 
            float perspective = 1.0 / max(0.01, (horizon - vUv.y)); 
            float x = (vUv.x - 0.5) * perspective * uScale + (sensitiveAngle * 3.0);
            float y = perspective * uScale + (uTime * 0.2); 
            float check = mod(floor(x) + floor(y), 2.0);
            vec3 tileColor = (check < 0.5) ? vec3(0.05) : vec3(0.15);
            float glarePos = 0.5 + (uViewRotation * 0.3) + (sin(uTime * 0.5) * 0.1);
            float streak = smoothstep(0.2, 0.0, abs(vUv.x - glarePos));
            float gloss = (1.0 - vUv.y) * 0.05 + (streak * 0.1); 
            float voidFactor = step(horizon, vUv.y);
            vec3 finalColor;
            if (uUseVideo > 0.5) {
                vec4 vid = texture2D(uMap, vUv);
                finalColor = (vid.rgb * 0.8) + vec3(gloss * 0.2); 
            } else {
                vec3 finalReflect = tileColor + vec3(gloss);
                finalColor = mix(finalReflect, vec3(0.005, 0.01, 0.015), voidFactor);
                finalColor *= 0.7; 
            }
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const mirrorMat = new THREE.ShaderMaterial({
        vertexShader: mirrorVertexShader, fragmentShader: mirrorFragmentShader,
        uniforms: { uViewRotation: { value: 0 }, uViewPitch: { value: 0 }, uTime: { value: 0 }, uMap: { value: null }, uScale: { value: 1.5 }, uUseVideo: { value: 0.0 } }
    });

    // Update Logic
    mirrorFrame.userData.update = function (t) {
        mirrorMat.uniforms.uTime.value = t;
        const cam = window.camera;
        if (cam) {
            mirrorMat.uniforms.uViewRotation.value = Math.atan2(cam.position.x, cam.position.z);
            const dir = new THREE.Vector3(); cam.getWorldDirection(dir);
            mirrorMat.uniforms.uViewPitch.value = dir.y;
        }
        if (window.videoElement && mirrorMat.uniforms.uMap.value && !window.videoElement.paused) {
            mirrorMat.uniforms.uMap.value.needsUpdate = true;
            if (mirrorMat.uniforms.uUseVideo.value < 1.0) mirrorMat.uniforms.uUseVideo.value = 1.0;
        }
    };

    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.70, 2.95), mirrorMat);
    mirrorGlass.position.z = 0.06; mirrorFrame.add(mirrorGlass);
    mirrorGlass.userData = { type: 'bathroomMirrorButton', onClick: window.toggleBathroomMirror };
    if (window.interiorClickables) window.interiorClickables.push(mirrorGlass);

    // TUB
    const tubGroup = new THREE.Group();
    const tubLength = 6.0; const tubWidth = 2.2; const radius = 0.5;
    const shape = new THREE.Shape();
    shape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius, 0, Math.PI / 2);
    shape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius, Math.PI / 2, Math.PI);
    shape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius, Math.PI, Math.PI * 1.5);
    shape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius, Math.PI * 1.5, Math.PI * 2);

    const hole = new THREE.Path();
    hole.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius - 0.15, 0, Math.PI / 2);
    hole.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius - 0.15, Math.PI / 2, Math.PI);
    hole.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius - 0.15, Math.PI, Math.PI * 1.5);
    hole.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius - 0.15, Math.PI * 1.5, Math.PI * 2);
    shape.holes.push(hole);

    const tubGeo = new THREE.ExtrudeGeometry(shape, { depth: 1.4, bevelEnabled: false, curveSegments: 16 });
    const tubMesh = new THREE.Mesh(tubGeo, whiteMat);
    tubMesh.rotation.x = -Math.PI / 2;

    // Floor
    const floorShape = new THREE.Shape();
    floorShape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius - 0.15, 0, Math.PI / 2);
    floorShape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius - 0.15, Math.PI / 2, Math.PI);
    floorShape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius - 0.15, Math.PI, Math.PI * 1.5);
    floorShape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius - 0.15, Math.PI * 1.5, Math.PI * 2);
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, { depth: 0.5, bevelEnabled: false });
    const tubFloor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    tubFloor.rotation.x = -Math.PI / 2;

    tubGroup.add(tubMesh); tubGroup.add(tubFloor);

    // Water
    const water = new THREE.Mesh(new THREE.ShapeGeometry(floorShape), new THREE.MeshPhongMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8, shininess: 100 }));
    water.rotation.x = -Math.PI / 2; water.position.y = 0.6;
    tubGroup.add(water);

    tubGroup.position.set(3.5, 0, -2.0); tubGroup.rotation.y = -Math.PI / 2;
    interiorGroup.add(tubGroup);

    // Floor (Checkered)
    const checkCanvas = document.createElement('canvas'); checkCanvas.width = 512; checkCanvas.height = 512;
    const cctx = checkCanvas.getContext('2d');
    cctx.fillStyle = '#888888'; cctx.fillRect(0, 0, 512, 512);
    cctx.fillStyle = '#111111';
    for (let y = 0; y < 512; y += 128) for (let x = 0; x < 512; x += 128) if (((x + y) / 128) % 2 !== 0) cctx.fillRect(x, y, 128, 128);
    const floorMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(checkCanvas), roughness: 0.8, metalness: 0.05 });
    floorMat.map.repeat.set(4, 4); floorMat.map.wrapS = THREE.RepeatWrapping; floorMat.map.wrapT = THREE.RepeatWrapping;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01;
    interiorGroup.add(floor);

    // Bath Mat
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
    bathMat.rotation.x = -Math.PI / 2; bathMat.position.set(0, 0.02, -2.0);
    interiorGroup.add(bathMat);

    // Video Init
    if (!window.videoElement) window.videoElement = document.getElementById('generic-video');
    if (window.videoElement) {
        window.videoElement.src = "../assets/video/Time-Is-Now.mp4";
        window.videoElement.muted = true; window.videoElement.loop = true;
        window.videoElement.crossOrigin = "anonymous";
        window.videoElement.play().then(() => {
            window.videoElement.pause();
            if (!mirrorMat.uniforms.uMap.value) mirrorMat.uniforms.uMap.value = new THREE.VideoTexture(window.videoElement);
        }).catch(e => { });
    }

    // Toggle Function
    window.toggleBathroomMirror = function () {
        if (window.videoElement) window.videoElement.muted = !window.videoElement.muted;
        if (mirrorMat.uniforms.uUseVideo.value < 0.5) {
            mirrorMat.uniforms.uUseVideo.value = 1.0;
            if (window.videoElement) window.videoElement.play();
            if (window.stopVideosForAudio && window.audioPlayer) {
                window.audioPlayer.pause(); window.isMusicPlaying = false;
                if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
            }
        } else {
            if (window.videoElement && !window.videoElement.paused) window.videoElement.pause();
            else mirrorMat.uniforms.uUseVideo.value = 0.0;
        }
    };
    window.stopBathroomVideo = function () {
        if (mirrorMat) mirrorMat.uniforms.uUseVideo.value = 0.0;
        if (window.videoElement) window.videoElement.pause();
        if (window.dirLight) window.dirLight.intensity = 0.45;
    };
};
