let openingFog;
let openingAnimationDone = false;
let lamppostLight = null;
let windowFlickerMaterials = [];
// V123: Global list for shader animations (e.g. Mirror)
let animatedShaderMaterials = [];
let animatedTrees = [];



// --- 3D SETUP ---
// Global Variables
let scene, camera, renderer, controls;
let textureLoader;
let worldGroup, interiorGroup;
let raycaster, mouse;
let animationId;
let dirLight, rimLight, ambientLight, hemiLight;

let noteTextSprite = null;
let thoughtSprite = null;
let thoughtInterval = null;
let thoughtParticles = []; // For floating words



let infoTimeout = null;

let state = 'HOUSE';
let currentRoom = null;
let currentTrackIndex = 0;
let currentVideoIndex = 0;
let isTVVideoMode = false;
let hoveredObject = null;
const interiorClickables = [];

let tvMesh = null, currentSlideIndex = 0;
let phoneScreenMesh = null;
var videoElement = null, videoTexture = null;
var audioPlayer = null;
var musicSwitchMesh = null;
var musicPanelMesh = null;
var playlistPanelMesh = null;
var isMusicPlaying = false;

// Effects
let atomGroup = null;
let basementNodes = [];
let basementLines = null;
let audioContext, audioAnalyser, audioDataArray;

let pointerDownX = 0, pointerDownY = 0, isPossibleClick = false;

function init() {
    // V516: Fixed Step Glitch & Removing Mist Shader
    console.log("--- HOUSE.JS V913-DEBUG LOADED ---");
    scene = new THREE.Scene();

    // Opening mist
    // Opening mist (V59: Less misty) -> V200: Mistier as requested
    scene.fog = new THREE.Fog(0x0a0a14, 10, 80);
    openingFog = scene.fog;



    // V59: Scene fog slightly clearer
    // V59: Scene fog slightly clearer
    // V65: FIX FOG BUG -    // V101: Night Mode (Black Sky & Stars)
    scene.background = new THREE.Color(0x000000);
    // V102: Atmosphere Mist (Deep Purple/Blue fog on Black Sky)
    scene.fog.color.setHex(0x050010);
    scene.fog.near = 20;
    scene.fog.far = 200; // V82: Much clearer visibility for Horizon View

    // V58: Increased Far Clip
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // V81: Horizon Start View
    // Start low and far to see the "curve" and house on horizon
    camera.position.set(0, 5, 120);
    // Look down/straight at house (adjusted for lower camera height)
    camera.lookAt(0, -2, 0);

    // V123: Add Camera to Scene so we can attach lights to it
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.filter = 'blur(0px)';
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    // AMBIENT LIGHT (Global)
    // V137: Use Global variable
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // V123: LIGHTS ATTACHED TO CAMERA (Sticky Light)
    // "The light can stay behind the ball at all times. Stuck to the back / canvas"
    // We attach them to the camera so they move WITH the view.

    // V137: Use Global variable
    dirLight = new THREE.DirectionalLight(0xffa07a, 1.2);
    // Position relative to Camera
    // Upper Right-ish Behind? Or just fixed angle relative to view.
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    // Important: Shadow Camera needs to cover the view frustum likely to be seen
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;

    camera.add(dirLight); // Child of Camera

    // V137: Use Global variable
    rimLight = new THREE.DirectionalLight(0xb266ff, 0.6);
    rimLight.position.set(-20, 10, -10); // Left Back
    camera.add(rimLight); // Child of Camera

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    // V131: Enable Pan (Right-Click Drag)
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 1.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // V113: Fix Invisible Floor - Clamp Rotation (Just below horizon)
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    // V51: Set target IMMEDIATELY to match the camera's lookAt.
    controls.target.set(0, -2, 0); // V83: Lower target (Street Level)

    worldGroup = new THREE.Group();
    scene.add(worldGroup);
    interiorGroup = new THREE.Group();
    scene.add(interiorGroup);
    interiorGroup.visible = false;

    // V119: Global Flags
    window.isZoomingToRoom = false;
    window.introFinished = false;

    // Initial State Logic (Same as before)
    buildWorld();
    buildEnvironment();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    videoElement = document.getElementById('generic-video');
    audioPlayer = document.getElementById('room-audio');

    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => document.getElementById('loading').style.display = 'none', 500);
    }, 500);


    // V115: Initialize Text Size ON LOAD
    const header = document.getElementById('main-header');
    if (header) {
        // Measure Natural Width
        header.style.transform = 'scale(1)'; // Reset to measure
        const h1 = header.querySelector('h1');
        let naturalWidth = 300; // Fallback
        if (h1) {
            const range = document.createRange();
            range.selectNodeContents(h1);
            naturalWidth = range.getBoundingClientRect().width;
        }
        // FAILSAFE: If hidden, width is 0 -> Scale becomes Infinity -> Disappears. Force min width.
        if (naturalWidth < 100) naturalWidth = 300;

        const isMobile = window.innerWidth < 768;
        const startTop = isMobile ? 30 : 50;

        // Start Percent Target
        const startPct = isMobile ? 1.2 : 0.8;
        const startScale = (window.innerWidth * startPct) / naturalWidth;

        // V930: Apply Initial Scale (Center Screen)
        // We do NOT call startOpeningAnimation() here. That waits for Enter.
        header.style.transform = `translateY(-50%) scale(${startScale})`;
        header.style.top = startTop + '%';
        header.style.opacity = '1';
    }

    // startOpeningAnimation(); // REMOVED V930: No Auto-Start!
    // createIntroSign(); // REMOVED V931: "Weird floating sign" issue
    // V56: Tie Pixel Band to Exit Experience
    // Since layout.js handles the visual toggle, we just need to ensure it exits fullscreen/logic.
    const pixelBand = document.getElementById('pixel-band');
    if (pixelBand) {
        pixelBand.onclick = function () {
            // If in strict fullscreen or "started" state
            if (document.fullscreenElement || document.getElementById('start-btn').style.display === 'none') {
                exitExperience();
                // layout.js will automatically expand the header because of its own listener
            }
        };
    }

    // V112: Explicit Info Listeners
    const minBtn = document.getElementById('min-btn');
    if (minBtn) minBtn.addEventListener('click', toggleInfo);

    // Also allow clicking header to toggle
    const infoHeader = document.querySelector('#room-info .room-header-flex');
    if (infoHeader) infoHeader.addEventListener('click', toggleInfo);

    try {
        animate();
    } catch (e) {
        console.error(e);
        alert("Animate Error: " + e.message);
    }
}

// Global Error Handler for Mobile Debugging
// Global Error Handler for Mobile Debugging (Non-blocking)
window.onerror = function (msg, url, line, col, error) {
    console.error("Global Error:", msg, url, line, error);
    const loading = document.getElementById('loading');
    if (loading) {
        // Append error, don't overwrite if multiple
        const errDiv = document.createElement('div');
        errDiv.style.color = '#ff4444';
        errDiv.style.fontSize = '12px';
        errDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
        errDiv.style.padding = '5px';
        errDiv.style.marginTop = '5px';
        errDiv.innerText = `ERR: ${msg} \nLine: ${line}`;
        loading.appendChild(errDiv);
        loading.style.display = 'flex';
        loading.style.flexDirection = 'column';
    }
    return false; // Let default handler run too (console)
};

// V532: Ensure init is robust
try {
    // init is called onload usually? 
    // Wait, typical three.js setup calls init() at start.
    // Let's check where init is called.
    // It's usually `init();` at the end or `window.onload = init;`
    // Looking at previous file views, I didn't see the call.
    // I will add the handler at the top of file or here.
} catch (e) { }

window.enterExperience = function () {
    console.log("enterExperience CLICKED - FORCE ENABLING NAVIGATION");

    // 0. IMMEDIATE FAILSAFE: Enable Navigation Logic
    // Even if audio fails, or animation crashes, user MUST be able to move.
    try {
        if (controls) {
            controls.enabled = true;
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.enableDamping = true;
        }
        window.introFinished = true; // Assume finished so clicks work
    } catch (e) { console.error("Critical Controls Error:", e); }

    try {
        // 1. Fullscreen
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) { docEl.requestFullscreen().catch(e => console.warn("Fullscreen toggle failed", e)); }
        else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); }

        // 2. Hide Header (Target the <header> tag injected by layout.js)
        // V15: User wants "expandable strip" to remain. Do NOT hide header.
        // const headerEl = document.querySelector('header');
        // if (headerEl) headerEl.style.display = 'none';

        // 3. Play Sound
        const audio = new Audio('/assets/audio/Tension_Short_07.mp3');
        audio.volume = 0.8;
        audio.currentTime = 1;

        audio.addEventListener('ended', () => {
            if (audioPlayer) {
                audioPlayer.src = "/assets/audio/quantumleap.mp3";
                audioPlayer.loop = true;
                setTimeout(() => {
                    audioPlayer.play().catch(e => console.warn("Quantum Leap Play Fail", e));
                }, 3000);
            }
        });

        audio.play().catch(e => console.warn("Audio play error", e));

        // 4. Hide Button
        const btn = document.getElementById('start-btn');
        if (btn) btn.style.display = 'none';

        // 5. Start Animation 
        startOpeningAnimation();

        // 5. Show Exit Button
        const exitBtn = document.getElementById('exit-btn');
        if (exitBtn) exitBtn.classList.remove('hidden');

        worldGroup.traverse((child) => {
            if (child.userData && child.userData.name === 'enterSign') {
                child.visible = false;
            }
        });
    } catch (err) {
        console.error("enterExperience non-critical error:", err);
    }
};

window.exitExperience = function () {
    // 1. Exit Fullscreen
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

    // 2. Show Header
    const headerEl = document.querySelector('header');
    if (headerEl) headerEl.style.display = 'flex'; // Reset display (layout.js uses flex)

    // 3. Hide Exit Button
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.add('hidden');

    // 4. Show Start Button again (Optional - if user wants to re-enter)
    // Note: We are just exiting fullscreen view. The 3D scene continues.
    // To "Reset" fully, reloading might be better, but for now we just toggle view.
    const startBtnContainer = document.getElementById('start-btn-container');
    if (startBtnContainer) startBtnContainer.style.display = 'block'; // Container was never hidden, but button was.

    // Actually we hid the BUTTON, not the container? Let's check logic.
    // "const btn = document.getElementById('start-btn'); if (btn) btn.style.display = 'none';"
    // So we show the button:
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.style.display = 'inline-block';

    // V528: Restore Enter Sign visibility
    worldGroup.traverse((child) => {
        if (child.userData && child.userData.name === 'enterSign') {
            child.visible = true;
        }
    });
};

// --- AUDIO ANALYSER SETUP ---
function initAudioAnalyser() {
    if (audioContext) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioAnalyser = audioContext.createAnalyser();
        audioAnalyser.fftSize = 256;
        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
        audioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    } catch (e) {
        console.warn("Audio Context init failed", e);
    }
}

// --- EXTERIOR BUILDER ---
// V79: Procedural Noise Texture for Grits
function createNoiseTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#A0A0A0'; // Lighter grey base (Was #808080)
    ctx.fillRect(0, 0, size, size);

    const idata = ctx.getImageData(0, 0, size, size);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
            // Add subtle noise
            const noise = (Math.random() - 0.5) * 20; // range -10 to 10
            // We manipulate R,G,B same amount to keep it greyscale noise
            // But doing it pixel by pixel via buffer is tricky with endianness.
            // Simpler loop:
        }
    }
    // Re-do simpler loop for safety
    for (let i = 0; i < idata.data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 30; // +/- 15
        idata.data[i] = Math.min(255, Math.max(0, 128 + grain));     // R
        idata.data[i + 1] = Math.min(255, Math.max(0, 128 + grain)); // G
        idata.data[i + 2] = Math.min(255, Math.max(0, 128 + grain)); // B
        idata.data[i + 3] = 255; // Alpha
    }

    ctx.putImageData(idata, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createRoomBlock(name, x, y, z, w, h, d, color, winConfigs = null) {
    const geo = new THREE.BoxGeometry(w, h, d);

    // V79: Apply Gritty Texture
    const noiseTex = createNoiseTexture();
    noiseTex.repeat.set(w / 2, h / 2); // Scale texture by size

    const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.9,
        bumpMap: noiseTex,
        bumpScale: 0.05, // Subtle bump
        map: noiseTex // Also apply as map to darken/grime it a bit? 
        // Wait, map will override color unless we blend. 
        // StandardMaterial multiplies map color with .color.
        // Our noise is grey (128). So it will dim the color by 50%.
        // That might be too dark.
        // Let's use lighter noise (200 base) or just bumpMap.
        // User asked for "texture". Bump map is best.
    });
    // IF we want visible grit dirt, maybe create a light map or use a lighter base for noise.
    // Let's try JUST bumpMap first to keep colors vibrant.
    // Actually, let's create a separate lighter noise for the map if needed, 
    // but just BumpMap is safer style-wise.

    // Re-adjusting createNoiseTexture to be just bump map (grey irrelevant, only contrast matters).

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { name: name, type: 'room' };

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
    mesh.add(line);

    if (winConfigs) {
        const configs = Array.isArray(winConfigs) ? winConfigs : [winConfigs];
        configs.forEach(cfg => {
            const s = cfg.scale || 1.0;
            const frameW = (cfg.narrow ? 0.4 : 1.0) * s;
            const frameH = cfg.height ? cfg.height : (1.0 * s);
            const shift = cfg.shift || 0;

            const frameDepth = 0.1;
            const frameColor = cfg.type === 'white' ? 0xffffff : 0x222222;

            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(frameW, frameH, frameDepth),
                new THREE.MeshStandardMaterial({ color: frameColor })
            );

            const zOffset = d / 2 + 0.02;
            const xOffset = w / 2 + 0.02;
            const side = cfg.side || 'front';

            if (side === 'front') {
                frame.position.set(shift, 0, zOffset);
            } else if (side === 'back') {
                frame.position.set(shift, 0, -zOffset);
                frame.rotation.y = Math.PI;
            } else if (side === 'left') {
                frame.position.set(-xOffset, 0, shift);
                frame.rotation.y = -Math.PI / 2;
            } else if (side === 'right') {
                frame.position.set(xOffset, 0, shift);
                frame.rotation.y = Math.PI / 2;
            }

            const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(frameW * 0.85, frameH * 0.85),
                new THREE.MeshStandardMaterial({
                    color: 0xffffcc,
                    emissive: 0xffaa00,
                    emissiveIntensity: 0.6,
                    roughness: 0.2
                })
            );
            glass.position.z = 0.06;

            // -- WINDOW ANIMATION SETUP --
            glass.material.userData = {
                baseEmissive: 0.6,
                speed: 1.5 + Math.random() * 2.0,
                phase: Math.random() * Math.PI * 20,
                hueSpeed: 0.05 + Math.random() * 0.05,
                hueOffset: Math.random(),
            };
            windowFlickerMaterials.push(glass.material);

            frame.add(glass);
            mesh.add(frame);
        });
    }
    worldGroup.add(mesh);
}



// Restored buildWorld
function buildWorld() {
    buildHouse();
}

function buildHouse() {
    createRoomBlock('basement', 0, 0.4, 0, 4.4, 0.8, 6.0, roomContent.basement.hex, { type: 'dark', scale: 0.5, shift: 1.2 });
    const baseWinGeo = new THREE.PlaneGeometry(1.5, 0.4);
    const baseWinMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.5 });
    const leftBaseWin = new THREE.Mesh(baseWinGeo, baseWinMat);
    leftBaseWin.rotation.y = -Math.PI / 2;
    leftBaseWin.position.set(-2.22, 0.5, 0);
    worldGroup.add(leftBaseWin);
    const rightBaseWin = new THREE.Mesh(baseWinGeo, baseWinMat);
    rightBaseWin.rotation.y = Math.PI / 2;
    rightBaseWin.position.set(2.22, 0.5, 0);
    worldGroup.add(rightBaseWin);

    createRoomBlock('living', -1.0, 1.8, 0, 2.0, 2, 5, roomContent.living.hex, [
        { type: 'dark', side: 'front', scale: 0.6, height: 1.0, shift: -0.2 },
        { type: 'dark', side: 'back', scale: 0.6, height: 1.0, shift: -0.2 }
    ]);

    // -- ENLARGED CLICK AREA FOR LIVING ROOM (REMOVED V528 - Too Loose) --
    // Using createHitBox() later for tighter control

    createRoomBlock('studio', 1.0, 1.8, 0, 2.0, 2, 5, roomContent.studio.hex, [
        { type: 'dark', side: 'front', scale: 0.6, height: 1.0, shift: 0.2 },
        { type: 'dark', side: 'back', scale: 0.6, height: 1.0, shift: 0.2 }
    ]);
    const doorFacade = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 0.05),
        // V128: Ochre (Dark Yellow) instead of White
        new THREE.MeshStandardMaterial({ color: 0xB99824, roughness: 0.5 })
    );
    doorFacade.position.set(0, 1.6, 2.51);
    doorFacade.userData = { name: 'hall', type: 'room' };
    worldGroup.add(doorFacade);
    const doorGeo = new THREE.BoxGeometry(0.8, 1.4, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.5, 2.54);
    door.userData = { name: 'hall', type: 'room' };
    worldGroup.add(door);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
    knob.position.set(0.3, 0, 0.08);
    door.add(knob);
    const doorWinGeo = new THREE.PlaneGeometry(0.4, 0.3);
    const doorWinMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.8 });
    const doorWin = new THREE.Mesh(doorWinGeo, doorWinMat);
    doorWin.position.set(0, 0.4, 0.06);
    door.add(doorWin);

    // -- HOUSE NUMBER PLATE (42) --
    // Resized and moved to "Studio" wall front, right next to door
    const plateGeo = new THREE.BoxGeometry(0.25, 0.2, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const plate = new THREE.Mesh(plateGeo, plateMat);

    // Door is at x=0, Studio starts approx x=0.2 (overlapping) to x=2.0
    // Studio front face z is 2.5
    // Position plate just to the right of the door frame
    plate.position.set(0.75, 1.8, 2.52);

    const numCanvas = document.createElement('canvas');
    numCanvas.width = 64; numCanvas.height = 64;
    const nctx = numCanvas.getContext('2d');
    nctx.fillStyle = '#eeeeee'; nctx.fillRect(0, 0, 64, 64);
    nctx.fillStyle = '#111111'; nctx.font = 'bold 40px "Courier New"';
    nctx.textAlign = 'center'; nctx.textBaseline = 'middle';
    nctx.fillText("42", 32, 34);
    const numTex = new THREE.CanvasTexture(numCanvas);
    const numMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.16), new THREE.MeshBasicMaterial({ map: numTex, transparent: true }));
    numMesh.position.z = 0.011;
    plate.add(numMesh);
    worldGroup.add(plate); // Add to world, not door

    // -- ENLARGED CLICK AREA FOR HALL (REMOVED V528 - Too Loose) --
    // Using createHitBox() later
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const stepWidth = 1.4;
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.6, 0.5), stepMat);
    // V536: Solid Shifted forward to 2.85 to clear wall
    step1.position.set(0, 0.3, 2.85);
    worldGroup.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth + 0.2, 0.4, 0.5), stepMat);
    step2.position.set(0, 0.2, 3.25); // Solid fill
    worldGroup.add(step2);
    const step3 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth + 0.4, 0.2, 0.5), stepMat);
    // V536: Lowered to ground (Y=0.1 for Height 0.2)
    step3.position.set(0, 0.1, 3.65);
    worldGroup.add(step3);
    createRoomBlock('toilet', 0, 1.1, -3.5, 1.2, 2.2, 2.0, roomContent.toilet.hex, [
        { type: 'dark', scale: 0.6, side: 'left', narrow: true },
        { type: 'dark', scale: 0.6, side: 'right', narrow: true }
    ]);
    // -- ENLARGED CLICK AREA FOR TOILET (REMOVED V528) --
    // Using createHitBox() later
    createRoomBlock('bedroom', -1.0, 3.8, 0, 2.0, 2, 5, roomContent.bedroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    // -- ENLARGED CLICK AREA FOR BEDROOM (REMOVED V528) --
    // Using createHitBox() later

    createRoomBlock('bathroom', 1.0, 3.8, 0, 2.0, 2, 5, roomContent.bathroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-3.0, 0); roofShape.lineTo(3.0, 0); roofShape.lineTo(0, 3.0); roofShape.lineTo(-3.0, 0);
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 5.2, bevelEnabled: false });
    roofGeo.center();
    const roofTexture = createRoofTexture();
    const roofTilesMat = new THREE.MeshStandardMaterial({ map: roofTexture, color: 0xffeecc, roughness: 0.8, bumpMap: roofTexture, bumpScale: 0.02 });    // V128: Darker Facade (Was 0xcdc7b9 -> 0x5d4037)
    // V920: Bright Off-White for Attic Walls as requested
    const facadeMat = new THREE.MeshStandardMaterial({ color: 0xa09c5f, roughness: 0.9 });
    const roof = new THREE.Mesh(roofGeo, [facadeMat, roofTilesMat]);
    roof.position.set(0, 6.0, 0);
    roof.userData = { name: 'attic', type: 'room' };
    const atticWinFrameFront = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    atticWinFrameFront.position.set(0, -0.6, 2.6);
    const atticWinGlassFront = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.6 }));
    atticWinGlassFront.position.z = 0.06;
    atticWinFrameFront.add(atticWinGlassFront);
    roof.add(atticWinFrameFront);
    const atticWinFrameBack = atticWinFrameFront.clone();
    atticWinFrameBack.position.set(0, -0.6, -2.6);
    atticWinFrameBack.rotation.y = Math.PI;
    roof.add(atticWinFrameBack);
    worldGroup.add(roof);



}

function createRoofTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5c0000'; ctx.fillRect(0, 0, 512, 512);
    const rows = 10; const cols = 8;
    const tileH = 512 / rows; const tileW = 512 / cols;
    for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (tileW / 2);
        for (let c = -1; c < cols + 1; c++) {
            const shade = Math.random() * 40;
            const redVal = 100 + shade;
            ctx.fillStyle = `rgb(${redVal}, 20, 20)`;
            ctx.beginPath();
            ctx.rect(c * tileW + offset + 2, r * tileH + 2, tileW - 4, tileH - 4);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2; ctx.stroke();
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    return tex;
}

function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f1f0a'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8000; i++) {
        const shade = Math.random();
        ctx.fillStyle = shade > 0.7 ? '#1a2e10' : (shade > 0.4 ? '#253d18' : '#0a1406');
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 3 + 1, Math.random() * 6 + 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    return tex;
}

function createIntroSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 200; // Reduced Height (Was 300) for tight fit
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0e0'; ctx.fillRect(0, 0, 512, 200);
    for (let i = 0; i < 150; i++) {
        ctx.fillStyle = `rgba(30,30,30,${Math.random() * 0.15})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 200, 4, 4);
    }
    // Border
    ctx.strokeStyle = '#2c1810'; ctx.lineWidth = 12; ctx.strokeRect(6, 6, 500, 188);
    ctx.lineWidth = 4; ctx.strokeRect(18, 18, 476, 164);

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    // V7: Just "ENTER"
    ctx.fillStyle = '#cc0000'; ctx.font = 'bold 80px "Courier New", monospace';
    ctx.fillText("ENTER", 256, 100); // Centered vertically in 200

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
}

// RESTORED ORIGINAL FOR LAMPOST
function createSignTexture(line1 = "ENTER", line2 = "at your own risk") {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0e0'; ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(30,30,30,${Math.random() * 0.15})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 256, 4, 4);
    }
    ctx.strokeStyle = '#2c1810'; ctx.lineWidth = 12; ctx.strokeRect(6, 6, 500, 244);
    ctx.lineWidth = 4; ctx.strokeRect(18, 18, 476, 220);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b91c1c'; ctx.font = 'bold 90px "Courier New", monospace'; ctx.fillText(line1, 256, 100);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 40px "Courier New", monospace'; ctx.fillText(line2, 256, 180);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
}

function createIntroSign() {
    console.log("createIntroSign DISABLED V932");
    // Disabled to fix "floating sign" issue
}

function startInteractiveIntro() {
    // 1. Play Audio (Immediately)
    // Sound should start immediately after clicking 'ENTER'
    const audio = new Audio('/assets/audio/Tension_Short_07.wav');
    audio.volume = 0.8;
    audio.play().catch(e => console.warn("Audio play error", e));

    // 2. Animate Sign GROW (Bigger), DROP (Below Screen), FADE
    // "slowly disappear below the screen, growing in size and dropping in transparency"

    const sign = worldGroup.children.find(c => {
        return c.children.some(child => child.userData && child.userData.type === 'introSign');
    });

    if (sign) {
        const board = sign.children.find(c => c.userData.type === 'introSign'); // The mesh with the map

        // Grow Scale (Much bigger)
        new TWEEN.Tween(sign.scale)
            .to({ x: 3.0, y: 3.0, z: 3.0 }, 3500) // Slower (3.5s)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        // Drop Down (Below screen) & Fade Out
        // Using this as the "master" tween for cleanup
        new TWEEN.Tween(sign.position)
            .to({ y: -50 }, 4000) // 4s Drop (User wanted "disappear below screen" -50 is safer than -30)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                if (sign.parent) sign.parent.remove(sign);
            })
            .start();

        // Fade Out (Transparency)
        if (board && board.material) {
            new TWEEN.Tween(board.material)
                .to({ opacity: 0 }, 3000) // 3s Fade
                .delay(0)
                .start();
        }
    }

    // 3. Start Animation (Shortly after click, overlapping)
    // V12: INSTANT SYNC (Remove V11 Delay)
    startOpeningAnimation();
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 180, 60, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function createVignetteAlphaMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Black background (transparent)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);

    // Soft white radial gradient (opaque center, transparent edges)
    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 280);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
}

function buildStreetlight(x, z, rotationY = 0) {
    const poleGroup = new THREE.Group();
    poleGroup.position.set(x, 0, z);
    poleGroup.rotation.y = rotationY;
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x707070, roughness: 0.4, metalness: 0.6 });
    const poleHeight = 4.0;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, poleHeight, 16), metalMat);
    pole.position.y = poleHeight / 2;
    poleGroup.add(pole);
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, poleHeight, 0),
        new THREE.Vector3(0, poleHeight + 2.0, 0),
        new THREE.Vector3(-1.8, poleHeight + 1.5, 0)
    );
    const arm = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.1, 8, false), metalMat);
    poleGroup.add(arm);
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(-1.8, poleHeight + 1.5, 0);
    lanternGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 0.2, 8), metalMat));
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7, emissive: 0xffaa00, emissiveIntensity: 0.5 });
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.6, 6), glassMat);
    glass.position.y = -0.4;
    lanternGroup.add(glass);
    const spotLight = new THREE.SpotLight(0xffaa00, 2.0);
    spotLight.position.set(0, -0.2, 0);
    spotLight.target.position.set(0, -5, 0);
    spotLight.angle = Math.PI / 3; spotLight.penumbra = 0.4; spotLight.castShadow = true; spotLight.distance = 15;
    lanternGroup.add(spotLight); lanternGroup.add(spotLight.target);
    const glowLight = new THREE.PointLight(0xffaa00, 1, 3);
    glowLight.position.y = -0.4;
    lanternGroup.add(glowLight);
    const spriteMat = new THREE.SpriteMaterial({ map: createGlowTexture(), color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const glowSprite = new THREE.Sprite(spriteMat);
    glowSprite.scale.set(3, 3, 3); glowSprite.position.y = -0.4;
    lanternGroup.add(glowSprite);
    poleGroup.add(lanternGroup);
    // Modified buildStreetlight to fix glowing sprite position or remove it if problematic
    // The previous implementation added a sprite below the lantern.
    // ...
    // poleGroup.add(sign); // Code continues below...

    // Keeping original code structure but verifying the insertion point for Mist Layer.
    // The Mist Layer logic will be added inside buildEnvironment().

    const signTex = createSignTexture();
    const signWidth = 1.4; const signHeight = 0.7;
    const signGeo = new THREE.BoxGeometry(signWidth, signHeight, 0.05);
    const signMat = new THREE.MeshStandardMaterial({ map: signTex });
    const signBackMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const sign = new THREE.Mesh(signGeo, [signBackMat, signBackMat, signBackMat, signBackMat, signMat, signBackMat]);
    // V528: Tag for hiding later
    sign.userData = { name: 'enterSign' };
    if (Math.abs(rotationY) > 0.1) {
        sign.position.set(0, 3.0, -0.15); sign.rotation.y = Math.PI;
    } else {
        sign.position.set(0, 3.0, 0.15);
    }
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.16), metalMat);
    bracket.position.y = signHeight / 2 - 0.05;
    bracket.position.z = Math.abs(rotationY) > 0.1 ? 0.05 : -0.05;
    sign.add(bracket);
    poleGroup.add(sign);
    worldGroup.add(poleGroup);

    // Return the light that we want to flicker
    return spotLight;
}

function buildEnvironment() {
    const groundTex = createGrassTexture();
    // V528: DoubleSide to prevent disappearance at angles
    const planeMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1, color: 0x666666, side: THREE.DoubleSide });

    // V80: Planet "Mini-Earth" Environment
    const PLANET_RADIUS = 120;
    const planetGroup = new THREE.Group();
    // Center the sphere so its top surface touches (0,0,0)
    planetGroup.position.set(0, -PLANET_RADIUS, 0);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS, 128, 128), planeMat);
    // V528: Disable frustum culling to prevent ground flicker/disappearance
    sphere.frustumCulled = false;
    planetGroup.add(sphere);

    worldGroup.add(planetGroup);

    // V84: Spherical Road (Visible Fix)
    // V100: DEBUG BOOSTER - Massive Perspective
    const widthAtHouse = 1.4;
    const widthAtHorizon = 30.0; // V100: Even wider (was 20.0)
    const roadSegments = 200;
    // V102: Road touches steps
    const roadStartZ = 2.5;
    const roadEndZ = 150; // Extend to Horizon (was 60)



    // Helper: Custom BufferGeometry
    const rVertices = [];
    const rIndices = [];
    const rUVs = [];

    // V537: Thicken Road (Slab)
    const roadThickness = 0.4;

    for (let i = 0; i <= roadSegments; i++) {
        const ratio = i / roadSegments;
        const z = roadStartZ + (roadEndZ - roadStartZ) * ratio;

        // Lerp width
        const currentWidth = widthAtHouse + (widthAtHorizon - widthAtHouse) * ratio;

        // V84: Offset 0.1 to obscure z-fighting with plane
        const yTop = getPlanetY(0, z) + 0.1;
        const yBot = yTop - roadThickness;

        // 4 Vertices per segment
        // 0: TL (-x, top), 1: TR (+x, top), 2: BL (-x, bot), 3: BR (+x, bot)
        rVertices.push(-currentWidth / 2, yTop, z);
        rVertices.push(currentWidth / 2, yTop, z);
        rVertices.push(-currentWidth / 2, yBot, z);
        rVertices.push(currentWidth / 2, yBot, z);

        // UVs
        rUVs.push(0, ratio);
        rUVs.push(1, ratio);
        rUVs.push(0, ratio); // Sides reuse edge UVs
        rUVs.push(1, ratio);

        if (i < roadSegments) {
            const base = i * 4;
            const next = base + 4;

            // Top Face
            rIndices.push(base, base + 1, next);
            rIndices.push(next, base + 1, next + 1);

            // Left Face (TL, BL, NextTL, NextBL)
            // Normal -X. (BL, TL, NextTL) -> (2, 0, 4)
            rIndices.push(base + 2, base + 4, base);
            rIndices.push(base + 2, base + 6, base + 4);

            // Right Face (TR, BR, NextTR, NextBR)
            // Normal +X. (TR, BR, NextTR) -> (1, 3, 5) ? No.
            // (TR, NextTR, BR) ?
            // TR(1), BR(3), NextTR(5), NextBR(7)
            // CounterClockwise: 1, 5, 3; 3, 5, 7.
            rIndices.push(base + 1, base + 5, base + 3);
            rIndices.push(base + 3, base + 5, base + 7);
        }
    }

    // Cap the Start (Facing the house)
    // 0(TL), 1(TR), 3(BR), 2(BL)
    rIndices.push(0, 1, 3);
    rIndices.push(3, 2, 0);

    const roadMeshGeo = new THREE.BufferGeometry();
    roadMeshGeo.setAttribute('position', new THREE.Float32BufferAttribute(rVertices, 3));
    roadMeshGeo.setAttribute('uv', new THREE.Float32BufferAttribute(rUVs, 2));
    roadMeshGeo.setIndex(rIndices);
    roadMeshGeo.computeVertexNormals();

    const road = new THREE.Mesh(roadMeshGeo, new THREE.MeshStandardMaterial({
        color: 0x222222, // V85: Darker Road
        roughness: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1
    }));
    worldGroup.add(road);

    // Helper: Get Height on Sphere for (x, z) relative to world origin (0,0,0)
    // Equation: x^2 + (y+R)^2 + z^2 = R^2
    // y = sqrt(R^2 - x^2 - z^2) - R
    function getPlanetY(x, z) {
        const r2 = PLANET_RADIUS * PLANET_RADIUS;
        const d2 = x * x + z * z;
        if (d2 >= r2) return -PLANET_RADIUS; // Fallback
        return Math.sqrt(r2 - d2) - PLANET_RADIUS;
    }

    // Helper: Orient Object to Normal
    function alignToPlanet(obj, x, z) {
        const y = getPlanetY(x, z);
        obj.position.set(x, y, z);
        // Normal vector is direction from Planet Center (0, -R, 0) to (x, y, z)
        // Planet center is (0, -120, 0).
        // Vector = (x, y+120, z)
        const normal = new THREE.Vector3(x, y + PLANET_RADIUS, z).normalize();
        obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    }

    // Capture the light object for animation
    // Init Lamppost at -2.2, 8
    lamppostLight = buildStreetlight(-2.2, 8, Math.PI);
    // Adjust Y and Rotation
    if (lamppostLight) {
        // Lamppost is built in a Group "poleGroup"
        // Find the group (parent of parent of light?)
        // Hierarchy: poleGroup -> lanternGroup -> spotLight
        // returned object is spotLight.
        let group = lamppostLight.parent.parent;
        if (group) {
            const lx = -2.2, lz = 8;
            const ly = getPlanetY(lx, lz);
            group.position.set(lx, ly, lz);

            // Keep original Y rotation (Math.PI) combined with Planet Normal?
            // It's tricky to mix LookAt/Quat with fixed Y rotation.
            // Simple approach: The pole is thin, slight tilt is fine.
            // Just set Y position. Tilt might look cool or might look wrong if leaning.
            // Let's try aligning it.
            const normal = new THREE.Vector3(lx, ly + PLANET_RADIUS, lz).normalize();
            const target = new THREE.Object3D();
            target.position.copy(group.position);
            target.lookAt(group.position.clone().add(normal)); // Z points up
            // Re-apply Y rotation?
            // Standard align:
            group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
            // Then rotate around local Y?
            group.rotateY(Math.PI);
        }

        lamppostLight.userData = {
            base: 2.0,
            speed: 2.0 + Math.random(),
            phase: Math.random() * Math.PI * 2
        };
    }

    // Updated Tree Function
    const addTree = (x, z, rawScale = 1) => {
        const scale = rawScale * 2.0;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));

        // Initial placement with offset for pivot
        // Trunk center is at 0,0,0 locally. We want the bottom to be at ground.
        // Shift Geometry? Or Offset Container?
        // Let's create a Container for the tree to easily manage pivot
        const treeGroup = new THREE.Group();
        trunk.position.y = 0.75 * scale; // Move trunk up so bottom is at 0
        treeGroup.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 2.5 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x0f2e22 }));
        leaves.position.y = 1.25 * scale; // Relative to trunk center? No, relative to trunk.
        // In previous code: trunk.add(leaves).
        // Here we add both to group for clean pivot.
        trunk.add(leaves);

        leaves.userData = { swaySpeed: 1.0 + Math.random(), phase: Math.random() * Math.PI * 2 };
        animatedTrees.push(leaves);
        trunk.castShadow = true;

        // Position on Planet
        alignToPlanet(treeGroup, x, z);

        worldGroup.add(treeGroup);
    };

    // Tree Positions
    addTree(-6, -5, 1.2); addTree(7, 3, 1.1); addTree(-5, 6, 0.9); addTree(8, -4, 1.3); addTree(-8, 2, 0.8);
    addTree(-12, 15, 0.9); addTree(3.5, 22, 1.1); addTree(-4, 28, 1.3);

    // Background Trees Helper (Returns Group now)
    function createSimpleTree() {
        const scale = 2.0;
        const group = new THREE.Group();

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        trunk.position.y = 0.75 * scale;
        group.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 2.5 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x0f2e22 }));
        leaves.position.y = 1.25 * scale;
        trunk.add(leaves);
        trunk.castShadow = true;

        return group; // Return the Group
    }

    // V131: Hit Box Helper
    // Creates an invisible box to expand click area
    const createHitBox = (name, x, y, z, w, h, d) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
        box.position.set(x, y, z);
        box.userData = { name: name, type: 'room' };
        worldGroup.add(box);
    };

    // Living Room Hit Box (Left Side)
    // V145: FULL COVERAGE & PRIORITY
    // Visual Center -1.0. Width 2.0. (Range -2.0 to 0.0).
    // Width 2.0 covers entire block. Z=3.8 ensures it beats Hall (3.2).
    // This allows clicking near the door (X=-0.2) and still hitting Living Room.
    createHitBox('living', -1.0, 1.5, 3.8, 2.0, 3.0, 1.0);

    // Hall Hit Box (Center)
    // V143: Low & Precise.
    // Visual Width 1.2. Hit Width 1.0. Height 2.2. Z=3.2.
    createHitBox('hall', 0, 1.5, 3.2, 1.0, 2.2, 1.0);

    // Bedroom Hit Box (Upper Left)
    // V143: Low & Precise.
    // Y=4.0. Height 2.5. Z=3.5.
    createHitBox('bedroom', -1.0, 4.0, 3.5, 2.0, 2.5, 1.0);

    // V528: Toilet Hit Box (Precise)
    // Center 0. Y=1.1. Z=-3.5.
    createHitBox('toilet', 0, 1.1, -3.5, 1.4, 2.4, 2.2);

    // Add more random trees
    // V6: More trees (increased loop)
    for (let i = 0; i < 60; i++) {
        // Calculate random position on the "disc" area we usually populate
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.random() * 60;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const tree = createSimpleTree();
        const s = 0.8 + Math.random() * 0.5;
        tree.scale.setScalar(s);

        alignToPlanet(tree, x, z);

        // V200: No Trees on Path (Approx X between -4 and 4)
        if (Math.abs(x) < 5) continue;

        worldGroup.add(tree);

        // Find leaves for animation (Grandchild: Group->Trunk->Leaves)
        const trunk = tree.children[0];
        if (trunk && trunk.children.length > 0) {
            const leaves = trunk.children[0];
            leaves.userData = { swaySpeed: 1.0 + Math.random(), phase: Math.random() * Math.PI * 2 };
            animatedTrees.push(leaves);
        }
    }

    // V64: Distant Fringe Trees
    for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 70 + Math.random() * 60;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const tree = createSimpleTree();
        const s = 1.0 + Math.random() * 0.6;
        tree.scale.setScalar(s);

        alignToPlanet(tree, x, z);

        worldGroup.add(tree);
        const trunk = tree.children[0];
        if (trunk && trunk.children.length > 0) {
            trunk.children[0].userData = { phase: Math.random() * Math.PI * 2, swaySpeed: 0.5 };
            animatedTrees.push(trunk.children[0]);
        }
    }

    // V102: Distant Sprite Glow (No Light pollution on house)
    const glowTex = createGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0x8800ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        fog: false // V103: Visible through fog
    });
    const glowSprite = new THREE.Sprite(glowMat);
    // V105: Massive and Lower (Ground Glow)
    glowSprite.position.set(0, -20, -150);
    glowSprite.scale.set(800, 800, 1);
    worldGroup.add(glowSprite);

    // V101: Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
        const r = 250 + Math.random() * 100; // Distant shell
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    worldGroup.add(stars);

    const ffGeo = new THREE.BufferGeometry();
    const ffCount = 200;
    const ffPos = new Float32Array(ffCount * 3);
    const ffSpeeds = [];
    for (let i = 0; i < ffCount * 3; i += 3) {
        // Random spread around house (radius 40, height 2-15)
        ffPos[i] = (Math.random() - 0.5) * 80; // X
        ffPos[i + 1] = Math.random() * 15 + 1; // Y
        ffPos[i + 2] = (Math.random() - 0.5) * 80; // Z
        ffSpeeds.push({
            x: (Math.random() - 0.5) * 0.03,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.03
        });
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    const ffMat = new THREE.PointsMaterial({ color: 0xaaff00, size: 0.15, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const fireflies = new THREE.Points(ffGeo, ffMat);
    fireflies.userData = { type: 'fireflies', speeds: ffSpeeds };
    worldGroup.add(fireflies);
}




function startOpeningAnimation() {
    console.log("startOpeningAnimation STARTED");

    // FAILSAFE: Unlock controls immediately to prevent "stuck" state
    if (controls) {
        controls.enabled = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
    }

    // "Cinematic" start: camera far away, heavy fog
    const xCoords = 6;
    const yCoords = 5;
    const zCoords = 16;

    const fogTarget = { near: 14, far: 110 };  // Clearer weather

    // Animate Header UP Faster (With Scale)
    const header = document.getElementById('main-header');

    if (header) {
        header.style.transform = 'translateY(-50%) scale(3.5)';
        header.style.top = '50%';
        header.style.opacity = '1';
    }

    // V52: Collapse using CLASSES
    const headerContent = document.getElementById('header-content');
    if (headerContent) {
        headerContent.classList.remove('max-h-40', 'py-1', 'border-b-2', 'overflow-visible');
        headerContent.classList.add('max-h-0', 'py-0', 'border-b-0', 'overflow-hidden');
    }

    // Camera Animation
    const animState = {
        px: 0, py: 5, pz: 120, // Position
        ly: -2 // LookAt Y
    };
    const targetState = {
        px: 8, py: 2, pz: 20, // V101: More Angled Landing (px=8)
        ly: 4
    };

    new TWEEN.Tween(animState)
        .to(targetState, 6000) // 6s Fly in
        .onUpdate(() => {
            camera.position.set(animState.px, animState.py, animState.pz);
            controls.target.set(0, animState.ly, 0);
            controls.update();
        })
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
            console.log("startOpeningAnimation COMPLETE");
            controls.enableDamping = false;

            camera.position.set(8, 2, 20);
            camera.lookAt(0, 4, 0);
            controls.target.set(0, 4, 0);
            controls.update();

            controls.enableDamping = true;
            controls.enabled = true;

            setTimeout(() => {
                controls.enableDamping = true;
            }, 100);

            controls.target.set(0, targetState.ly, 0);
            controls.update();

            window.introFinished = true;
        })
        .start();

    // Fog Animation
    const fogTargetClear = { near: 20, far: 120 };
    new TWEEN.Tween(openingFog)
        .to({ near: fogTargetClear.near, far: fogTargetClear.far }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // Header Text Animation
    if (header) {
        header.style.transform = 'scale(1)';
        const h1 = header.querySelector('h1');
        let naturalWidth = 300;
        if (h1) {
            const range = document.createRange();
            range.selectNodeContents(h1);
            naturalWidth = range.getBoundingClientRect().width;
        }

        const isMobile = window.innerWidth < 768;
        const startTop = isMobile ? 30 : 50;

        const startPct = isMobile ? 0.9 : 0.8;
        const startScale = (window.innerWidth * startPct) / naturalWidth;

        const endPct = isMobile ? 0.8 : 0.6;
        const endScale = (window.innerWidth * endPct) / naturalWidth;

        new TWEEN.Tween({ top: startTop, scale: startScale })
            .to({ top: 15, scale: endScale }, 5000)
            .onUpdate((obj) => {
                header.style.top = obj.top + '%';
                header.style.transform = `translateY(-50%) scale(${obj.scale})`;
            })
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }
}



// --- INTERIOR BUILDER ---
function buildInterior(roomKey) {
    if (thoughtInterval) clearInterval(thoughtInterval);
    thoughtInterval = null;

    while (interiorGroup.children.length > 0) { interiorGroup.remove(interiorGroup.children[0]); }
    interiorClickables.length = 0;
    atomGroup = null;
    noteTextSprite = null;
    thoughtSprite = null;
    basementNodes = [];
    basementLines = null;
    currentTrackIndex = 0;
    currentVideoIndex = 0;
    isTVVideoMode = false;
    musicPanelMesh = null;
    playlistPanelMesh = null;
    musicSwitchMesh = null;
    // Clear Shader Animations on room switch
    animatedShaderMaterials = [];

    const data = roomContent[roomKey];
    // V128: Darker Floor (Was 0xdddddd -> 0x2c2c2c)
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    const wallMat = new THREE.MeshStandardMaterial({ color: data.hex, side: THREE.DoubleSide });



    // Walls logic parameterized by room data
    const iW = data.interiorWidth || 10;
    const iD = data.interiorDepth || 10;
    const iH = 8;
    const halfW = iW / 2;
    const halfD = iD / 2;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(iW, iD), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    // Walls

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(iW, iH), wallMat);
    backWall.position.set(0, iH / 2, -halfD);
    interiorGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(iD, iH), wallMat); // Side walls length = iD
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-halfW, iH / 2, 0);
    interiorGroup.add(leftWall);

    // Open Plan: No Right Wall added for narrow rooms.

    const bulb = new THREE.PointLight(0xffffff, 0.8, 20);
    bulb.position.set(0, 6, 0);
    interiorGroup.add(bulb);

    createMusicPanel(data.playlist);

    if (roomKey === 'living') createLivingRoomInterior();
    else if (roomKey === 'bedroom') createBedroomInterior();
    else if (roomKey === 'studio') createStudioInterior();
    else if (roomKey === 'toilet') createToiletInterior();
    else if (roomKey === 'hall') createHallInterior();
    else if (roomKey === 'attic') createAtticInterior();
    else if (roomKey === 'basement') createBasementInterior();
    else if (roomKey === 'bathroom') createBathroomInterior();
    else createGenericInterior(data.title);
}

function performClick(event) {
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    if (state === 'HOUSE') {
        const intersects = raycaster.intersectObjects(worldGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target && (!target.userData || !target.userData.name)) { target = target.parent; }
            if (target && target.userData && target.userData.name) { enterRoom(target.userData.name); }
        }
    } else if (state === 'ROOM') {
        const intersects = raycaster.intersectObjects(interiorClickables, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            // Handle Parent Group clicks (like TV or Deck)
            while (target && (!target.userData || !target.userData.type) && target.parent) {
                target = target.parent;
            }

            if (target.userData.type === 'tv') nextTVContent();
            else if (target.userData.type === 'phone') toggleVideo(); // OLD logic kept for now
            else if (target.userData.type === 'videoPhone') toggleVideo(); // NEW Logic
            else if (target.userData.type === 'musicSwitch') toggleMusic();
            else if (target.userData.type === 'notepad') openIdeaOverlay();
            else if (target.userData.type === 'deckOfCards') {
                if (window.drawConversationTopic) window.drawConversationTopic();
            }
            else if (target.userData.type === 'atticAudioToggle') {
                if (target.toggleAudio) target.toggleAudio();
            }
        }
    }
}























// --- HELPERS & LOGIC ---



// START VIDEO CLIP
// START VIDEO CLIP
function startVideoClip(room) {
    const playlist = roomContent[room].videoPlaylist;
    if (!playlist) return;
    const clip = playlist[currentVideoIndex];
    videoElement.src = clip.src;
    // V55: Ensure Unmuted
    videoElement.muted = false;
    videoElement.volume = 0.8;
    videoElement.play().catch(e => console.warn("Video Play Error", e));

    // Stop room music when video starts
    if (isMusicPlaying) {
        audioPlayer.pause();
        isMusicPlaying = false;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
    }

    if (room === 'living' && tvMesh) {
        videoTexture = new THREE.VideoTexture(videoElement);
        tvMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture });
        tvMesh.material.needsUpdate = true;
    } else if (room === 'bedroom') {
        // Find screen on phone
        const phone = interiorGroup.children.find(c => c.userData.type === 'videoPhone');
        if (phone) {
            const phoneScreenMesh = phone.getObjectByName('screen');
            if (phoneScreenMesh) {
                videoTexture = new THREE.VideoTexture(videoElement);
                phoneScreenMesh.material.map = videoTexture;
                phoneScreenMesh.material.needsUpdate = true;
            }
        }
    }
}

function toggleBathroomVideo(btn) {
    console.log("toggleBathroomVideo called");
    // 1. Find Mirror Surface
    let mirrorSurface = null;
    let button = btn; // Use passed button logic

    // If we clicked the MIRROR, we need to find the BUTTON to check state
    if (!button || button.userData.type !== 'bathroomMirrorButton') {
        button = interiorGroup.children.find(c => c.userData.type === 'bathroomMirrorButton');
    }

    interiorGroup.traverse(child => {
        if (child.name === 'mirrorSurface') mirrorSurface = child;
    });

    if (!button) {
        console.error("Bathroom Button NOT FOUND");
        return;
    }

    if (!mirrorSurface) {
        console.error("Mirror Surface NOT FOUND");
        alert("Debug: Mirror Surface Not Found");
        return;
    }

    // Double-Click Check (Reset / Turn Off)
    const now = Date.now();
    if (button.userData.lastClick && (now - button.userData.lastClick < 400)) {
        console.log("Double Click Detected: RESET video");
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0; // Reset
        }

        // Reset Material to Shader
        // Locate proper shader from bathroom.js? 
        // We need to re-assign the original "Abstract/Checker" shader logic.
        // Or just let bathroom.js handle updates?
        // Simpler: Just set it back to the original material we might have saved?
        // Actually, we can regenerate it, OR, better:
        // We can just ask bathroom.js to reset it? No export.

        // For now, let's just make it "Black" or "Off" or re-create the shader?
        // Re-creating shader here is messy.
        // Let's use a simple trick: If video is stopped/reset, 
        // we can set a flag `isMirrorActive = false`. 

        // Actually, if we want to "Return to Reflection", we need the shader material back.
        // Let's store the original material on the object first!
        if (mirrorSurface.userData.originalMaterial) {
            mirrorSurface.material = mirrorSurface.userData.originalMaterial;
        } else {
            // Fallback if not saved (should be saved before swap)
            mirrorSurface.material = new THREE.MeshStandardMaterial({ color: 0x222222 });
        }

        button.userData.state = 'idle';
        button.material.color.setHex(0xff0000); // Red
        button.userData.lastClick = 0; // Reset double-click timer

        // Resume Music if it was playing before? (Optional)
        // User didn't ask.
        return;
    }
    button.userData.lastClick = now;

    if (button.userData.state === 'playing') {
        // Stop/Pause
        if (videoElement) videoElement.pause();
        button.userData.state = 'paused';
        button.material.color.setHex(0xff0000); // Red
    } else {
        // SAVE ORIGINAL MATERIAL if not saved yet
        if (!mirrorSurface.userData.originalMaterial) {
            mirrorSurface.userData.originalMaterial = mirrorSurface.material;
        }
        // Play
        // Fetch from Data.js
        const playlist = roomContent.bathroom.videoPlaylist;
        if (!playlist || playlist.length === 0) {
            console.warn("No video provider for bathroom in data.js");
            return;
        }

        console.log("Playing Bathroom Video:", playlist[0].src);

        if (!videoElement) {
            console.error("Generic Video Element not found!");
            return;
        }

        // V914: Resume Support
        // If the source is already correct, just play (resume)
        const isSameSource = videoElement.src.includes(playlist[0].src.substring(3)); // Handle relative path check roughly
        // Better: just check if src is set. Or check if we are 'paused' on this track.

        if (videoElement.src && videoElement.src.indexOf(playlist[0].src.split('/').pop()) > -1) {
            console.log("Resuming existing video...");
            videoElement.play();
        } else {
            videoElement.src = playlist[0].src;
            videoElement.muted = false; // Ensure Audio is ON
            videoElement.volume = 1.0;  // Full volume
            videoElement.loop = true;
            videoElement.setAttribute('playsinline', ''); // Mobile fix
            videoElement.crossOrigin = "anonymous";
            videoElement.play();
        }

        // We can just rely on .play() promise now
        // But need to ensure texture is applied if it wasn't

        // Wait for play? Or just assume?
        // Let's attach the texture logic always, to be safe (idempotent)
        const videoTex = new THREE.VideoTexture(videoElement);
        videoTex.minFilter = THREE.LinearFilter;
        videoTex.magFilter = THREE.LinearFilter;
        videoTex.format = THREE.RGBAFormat;

        // V916: Glitch & Gloss Shader
        const videoVertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const videoFragmentShader = `
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform float uViewRotation; // V917: Added View Rotation
            varying vec2 vUv;
            
            float rand(vec2 co) {
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = vUv;
                
                // GLITCH EFFECT (Kept subtle)
                float glitchIntensity = 0.0;
                float trigger = sin(uTime * 10.0) + sin(uTime * 23.0);
                if (trigger > 1.8) { 
                    glitchIntensity = 0.02;
                    if (rand(vec2(uTime, uv.y)) > 0.95) {
                        uv.x += (rand(vec2(uTime)) - 0.5) * 0.2;
                    }
                }
                
                float split = 0.002 + glitchIntensity * 2.0;
                vec4 r = texture2D(uTexture, uv + vec2(split, 0.0));
                vec4 g = texture2D(uTexture, uv);
                vec4 b = texture2D(uTexture, uv - vec2(split, 0.0));
                vec3 color = vec3(r.r, g.g, b.b);
                
                // V917: REACTIVE BROAD GLOSS
                // Move based on Camera Rotation instead of Time
                // Create a broad diagonal-ish band
                
                float glossAngle = uv.x * 0.5 + uv.y * 0.5; // Diagonal gradient
                // Shift based on View Rotation (Parallax)
                // Multiply view rotation to make it move fast enough
                float glossPos = glossAngle + uViewRotation * 1.5;
                
                // Use Sine to create repeating broad bands
                float gloss = sin(glossPos * 3.0); 
                
                // Sharp cut or smooth? User said "Big Broad Gloss"
                // Smoothstep to pick the peak of the sine wave
                float band = smoothstep(0.5, 1.0, gloss);
                
                // Mix gloss (White) 
                // Increased opacity slightly for visibility
                color = mix(color, vec3(1.0), band * 0.25); 
                
                // Scanlines
                color *= 0.95 + 0.05 * sin(uv.y * 800.0);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const videoMat = new THREE.ShaderMaterial({
            vertexShader: videoVertexShader,
            fragmentShader: videoFragmentShader,
            uniforms: {
                uTexture: { value: videoTex },
                uTime: { value: 0 },
                uViewRotation: { value: 0 }
            },
            side: THREE.FrontSide
        });

        // Register for animation updates
        if (typeof animatedShaderMaterials !== 'undefined') {
            animatedShaderMaterials.push(videoMat);
        }

        mirrorSurface.material = videoMat;

        button.userData.state = 'playing';
        button.material.color.setHex(0x00ff00); // Green

        // Stop Global Music
        if (isMusicPlaying) {
            audioPlayer.pause();
            isMusicPlaying = false;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
        }
        // The original catch block was for the playPromise, which is now removed.
        // If play() fails, it will throw an error directly, which can be caught by a try/catch around the play() call.
        // For now, we'll keep the error handling as a general fallback.
        videoElement.onerror = (e) => {
            console.error("Mirror Video Play Error:", e);
            alert("Video Play Failed: " + e.message + ". Setting Blue Screen.");
            mirrorSurface.material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue Fallback
        };
    }
}

// V921: Golden Ratio Animation (Transparent Overlay)
// V922: Music of the Spheres (MM) Animation - 3D Mesh Version
let mmAnimation = null;
let mmMesh = null;

function startGoldenRatioAnimation() {
    // Check if exists
    if (mmMesh) return;

    // 1. Instantiate Animation Engine
    // Check if class loaded
    if (typeof MMAnimation === 'undefined') {
        console.error("MMAnimation class not found! script tag missing?");
        return;
    }

    mmAnimation = new MMAnimation(1024, 1024);

    // 2. Create Texture
    const texture = new THREE.CanvasTexture(mmAnimation.getCanvas());
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 3. Create Mesh (Plane)
    const geometry = new THREE.PlaneGeometry(5, 5); // Larger projection (Was 3,3)
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, // Glowing effect
        depthWrite: false // Don't occlude
    });

    mmMesh = new THREE.Mesh(geometry, material);
    mmMesh.renderOrder = 9999; // V923: Ensure it renders on top of everything (especially for mobile/transparent layers)

    // Position: Above laptop using logic
    let laptop = interiorGroup.children.find(c => c.userData.type === 'laptop');
    if (!laptop) {
        interiorGroup.traverse(c => {
            if (c.userData.type === 'laptop') laptop = c;
        });
    }

    if (laptop) {
        const laptopGroup = laptop.parent;
        if (laptopGroup) {
            // Lower to screen center (approx 0.25 up from base)
            mmMesh.position.set(0, 0.25, 0);
            laptopGroup.add(mmMesh);
        }
    } else {
        // Fallback
        mmMesh.position.set(0, 1.5, -2);
        interiorGroup.add(mmMesh);
    }

    mmMesh.userData = { type: 'mmAnimationClose' };
    interiorClickables.push(mmMesh); // Make it clickable to close
}

// Function to stop/remove
function stopMMAnimation() {
    if (mmMesh) {
        // Remove from parent
        if (mmMesh.parent) mmMesh.parent.remove(mmMesh);

        // Dispose
        if (mmMesh.material.map) mmMesh.material.map.dispose();
        mmMesh.material.dispose();
        mmMesh.geometry.dispose();

        // Remove from clickables
        const idx = interiorClickables.indexOf(mmMesh);
        if (idx > -1) interiorClickables.splice(idx, 1);

        mmMesh = null;
    }
    mmAnimation = null; // Stop physics
}

// TOGGLE VIDEO (Button Click)
function stopVideo(mesh) {
    const btn = interiorGroup.children.find(c => c.userData.type === 'videoPlayButton');
    if (!btn) return;

    if (videoElement.paused) {
        // PLAY
        // V55: Ensure Unmute
        videoElement.muted = false;
        videoElement.volume = 0.8;
        videoElement.play().catch(e => console.warn("Play error", e));

        btn.userData.state = 'playing';
        btn.material.color.setHex(0x00ff00); // Green
        btn.material.emissive.setHex(0x004400);

        // Stop music
        if (isMusicPlaying) {
            audioPlayer.pause();
            isMusicPlaying = false;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
        }
    } else {
        // PAUSE
        videoElement.pause();
        btn.userData.state = 'paused';
        btn.material.color.setHex(0xff0000); // Red
        btn.material.emissive.setHex(0x440000);
    }
}



function openIdeaOverlay() {
    document.getElementById('idea-overlay').style.display = 'flex';
    const savedIdea = localStorage.getItem('memoryHouse_idea');
    if (savedIdea) document.getElementById('idea-text').value = savedIdea;
}

function closeIdeaOverlay() {
    document.getElementById('idea-overlay').style.display = 'none';
}

function saveIdea() {
    const text = document.getElementById('idea-text').value;
    localStorage.setItem('memoryHouse_idea', text);
    closeIdeaOverlay();
}

// V119: Robust Info Toggle (Direct Style)
function toggleInfo(e) {
    if (e) e.stopPropagation();
    if (infoTimeout) clearTimeout(infoTimeout);

    const panel = document.getElementById('room-info');
    const btn = document.getElementById('min-btn');

    // V122: Null Check
    if (!panel || !btn) return;

    // Check state by reading explicit style or class
    // We assume index.html sets initial transform to translateX(100%)

    // Check if Open
    const currentTransform = panel.style.transform;
    const isOpen = currentTransform === 'translateX(0%)';

    if (!isOpen) {
        // OPEN IT (Slide In)
        panel.style.transform = 'translateX(0%)';
        panel.style.pointerEvents = 'auto'; // Enable clicks

        // Icon: X / Dash
        btn.innerHTML = `<svg id="min-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8z"/></svg>`;
    } else {
        // CLOSE IT (Slide Out)
        panel.style.transform = 'translateX(100%)';
        panel.style.pointerEvents = 'none'; // Pass clicks through

        // Icon: i
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>`;
    }
}

function handlePanelClick(e) {
    const panel = document.getElementById('room-info');
    if (panel.classList.contains('minimized')) { toggleInfo(); }
}

// function showLaptopMessage() { REMOVED V921: Replaced by Hologram }

// Helper to clean up all audio/video sources
function stopAllAudio() {
    // 1. Main Music
    if (window.audioPlayer) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
    }
    // 2. Main Video (Living/Bedroom)
    if (window.videoElement && !window.videoElement.paused) {
        window.videoElement.pause();
    }
    // 3. Attic Video (Specific)
    const atticVideo = document.getElementById('attic-video');
    if (atticVideo && !atticVideo.paused) {
        atticVideo.pause();
        atticVideo.currentTime = 0; // Reset
    }
}

function enterRoom(roomName) {
    state = 'TRANSITION';
    currentRoom = roomName;
    currentTrackIndex = 0;
    currentVideoIndex = 0;

    // V913: Fix Ghost Clicks
    interiorClickables.length = 0;

    // Stop previous room's audio before building new one
    // But wait! If we stop all audio, we might kill music we want to keep?
    // No. The user wants "double audio" gone. 
    // Usually entering a room resets the state unless it's a seamless transition.
    // In this app, entering a room sets up new audio or video.
    // So stopping everything first is safe and cleaner.
    stopAllAudio();

    window.isZoomingToRoom = true; // V119 Loop Lock
    const curtain = document.getElementById('curtain');
    curtain.classList.add('active');
    setTimeout(() => {
        try {
            worldGroup.visible = false;
            buildInterior(roomName);
            interiorGroup.visible = true;
            // V15: Angled Camera (Zoomed out slightly)
            camera.position.set(4, 6, 9);
            camera.lookAt(0, 2.5, 0);
            controls.target.set(0, 2.5, 0);
            controls.update();

            // V136: Dark Mode for Bedroom
            // V152: Dark Mode for Living Room (Cozy Lamp)
            // V201: Dark Mode for Attic (Projection)
            // V913: Dark Mode for Bathroom (Requested by user)
            if (roomName === 'bedroom' || roomName === 'living' || roomName === 'attic' || roomName === 'toilet' || roomName === 'bathroom' || roomName === 'studio') {
                if (dirLight) dirLight.intensity = 0.1;
                if (rimLight) rimLight.intensity = 0.1;
                // V137: Use ambientLight
                if (ambientLight) ambientLight.intensity = 0.1;
            } else {
                // Reset to defaults
                if (dirLight) dirLight.intensity = 1.2; // Was 1.2? Init says 1.2. Reset to 1.2?
                // Init: dirLight 1.2. rimLight 0.6. ambientLight 0.6.
                // Resetting to '0.8' might be dimmer than init.
                // Let's reset to INIT values: 1.2, 0.6, 0.6.
                if (rimLight) rimLight.intensity = 0.6;
                if (ambientLight) ambientLight.intensity = 0.6;
            }

            const data = roomContent[roomName];
            // V201: Attic Audio Default = Video Audio (Not Playlist)
            if (data.playlist && data.playlist[0].src && roomName !== 'attic') {
                audioPlayer.src = data.playlist[0].src;
                // V78: Per-track volume support
                audioPlayer.volume = data.playlist[0].volume || 0.5;
                initAudioAnalyser();
                audioPlayer.play().then(() => {
                    isMusicPlaying = true;
                    if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
                }).catch(e => {
                    isMusicPlaying = false;
                    if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
                });
            } else {
                isMusicPlaying = false; audioPlayer.pause(); audioPlayer.src = "";
                if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
            }

            // V122: Safe UI Update
            const infoPanel = document.getElementById('room-info');
            if (infoPanel) {
                // infoPanel.classList.add('minimized'); // Removed logic
                infoPanel.style.transform = 'translateX(100%)'; // Ensure closed
                infoPanel.style.display = 'block';

                const contentContainer = document.getElementById('info-content');
                if (data && contentContainer) {
                    contentContainer.innerHTML = `<h2 class="text-2xl font-bold mb-2 text-gray-100 pr-8">${data.title}</h2><p class="text-gray-300 leading-relaxed">${data.description}</p>`;
                }
            } else {
                // console.warn("Info Panel not found (Intentional removal?)");
            }

            document.getElementById('main-header').style.opacity = 0;
            document.getElementById('back-btn').style.display = 'block';
            document.getElementById('tooltip').style.opacity = 0;
            document.getElementById('instructions').textContent = "Click music board to cycle tracks • Drag to rotate";
            curtain.classList.remove('active');
            state = 'ROOM';

            // Auto-minimize REMOVED (Starts minimized)
            if (infoTimeout) clearTimeout(infoTimeout);
        } catch (e) {
            console.error(e);
            // Display Error on Curtain?
            const loading = document.getElementById('loading');
            if (loading) {
                loading.innerHTML = `<h2 class="text-red-500 bg-black p-4">Room Error: ${e.message}</h2><pre class="text-xs text-white bg-black p-4">${e.stack}</pre>`;
                loading.style.opacity = 1;
                loading.style.display = 'flex';
                loading.style.zIndex = 9999;
            }
            curtain.classList.remove('active'); // Try to remove curtain so we see error
        }

    }, 800);
}

function exitRoom() {
    state = 'TRANSITION';
    const curtain = document.getElementById('curtain');
    if (curtain) curtain.classList.add('active');

    stopAllAudio(); // Replaces manual pausing
    isMusicPlaying = false; // Redundant but safe

    // Clear any pending info panel minimize timeout
    if (infoTimeout) clearTimeout(infoTimeout);

    if (infoTimeout) clearTimeout(infoTimeout);

    setTimeout(() => {
        // V136: Reset Lights on Exit
        // V137: Reset to Init Values (1.2, 0.6, 0.6)
        if (dirLight) dirLight.intensity = 1.2;
        if (rimLight) rimLight.intensity = 0.6;
        if (ambientLight) ambientLight.intensity = 0.6;

        // Clear interior group to remove all room-specific objects
        if (interiorGroup) {
            interiorGroup.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            interiorGroup.clear();
        }
        interiorGroup.visible = false;
        worldGroup.visible = true;
        atomGroup = null;
        basementNodes = [];
        basementLines = null;
        if (infoTimeout) clearTimeout(infoTimeout);

        // Reset View
        camera.position.set(14, 12, 18);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Safe UI Reset
        const rInfo = document.getElementById('room-info');
        if (rInfo) rInfo.style.display = 'none';

        const bBtn = document.getElementById('back-btn');
        if (bBtn) bBtn.style.display = 'none';

        const mHead = document.getElementById('main-header');
        if (mHead) mHead.style.opacity = 1;

        const instr = document.getElementById('instructions');
        if (instr) instr.textContent = "Click a room to enter it • Drag to rotate";

        if (curtain) curtain.classList.remove('active');
        state = 'HOUSE';
        currentRoom = null;
        window.isZoomingToRoom = false;
    }, 800);
}

function updateMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerDown(event) {
    isPossibleClick = true; pointerDownX = event.clientX; pointerDownY = event.clientY;
}

function onPointerMove(event) {
    const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
    if (dist > 10) isPossibleClick = false;
    updateMousePosition(event);
    if (state === 'HOUSE') checkIntersectionExternal();
    else if (state === 'ROOM') checkIntersectionInternal();
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = event.clientX + 'px'; tooltip.style.top = event.clientY + 'px';
}

function onPointerUp(event) {
    if (isPossibleClick) performClick(event);
    isPossibleClick = false;
}

function performClick(event) {
    updateMousePosition(event);
    console.log("Global performClick fired! State:", state); // DEBUG LOG
    raycaster.setFromCamera(mouse, camera);

    if (state === 'ROOM') {
        // console.log("Click Debug...");
    }
    if (state === 'HOUSE') {
        const intersects = raycaster.intersectObjects(worldGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            // Intro Sign Handler
            if (target.userData && target.userData.type === 'introSign') {
                startInteractiveIntro();
                return;
            }

            while (target && (!target.userData || !target.userData.name)) { target = target.parent; }
            if (target && target.userData && target.userData.name) { enterRoom(target.userData.name); }
        }
    } else if (state === 'ROOM') {
        const intersects = raycaster.intersectObjects(interiorClickables, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            // Traverse up to find functional parent
            while (target && (!target.userData || !target.userData.type) && target.parent) {
                target = target.parent;
            }

            // DEBUG: Identify what we clicked
            if (currentRoom === 'bathroom') {
                // Alert removed to prevent blocking Autoplay policy
                console.log("Clicked:", target);
                console.log("UserData:", JSON.stringify(target.userData)); // Explicit Dump
            }

            if (target.userData.type === 'tv') nextTVContent();
            else if (target.userData.type === 'phone') nextBedroomVideo(); // Keep legacy? User said "clicking the videophone .. plays". Maybe just use videoPhone type.
            // Actually, I setup the new phone mesh as `userData.type='videoPhone'`.
            // The old one was 'phone'.
            // I should probably remove the old logic if it conflicts, or just add the new one.

            else if (target.userData.type === 'videoPhone') {
                // V14: Screen Click = Toggle (Just like button)
                toggleVideo();
            }
            else if (target.userData.type === 'musicSwitch') toggleMusic();
            else if (target.userData.type === 'musicPanel') nextTrack();
            else if (target.userData.type === 'songItem') {
                // alert("DEBUG: Clicked Song Index " + target.userData.index); 
                playTrack(target.userData.index);
            }
            else if (target.userData.type === 'videoItem') playVideo(target.userData.index);
            else if (target.userData.type === 'bathroomMirrorButton' || target.userData.type === 'mirrorSurface') {
                toggleBathroomVideo(target);
            } else if (target.userData.type === 'atticAudioToggle') {
                console.log("Attic Audio Toggle Clicked!");
                if (target.toggleAudio) target.toggleAudio();
            }
            else if (target.userData.type === 'notepad') openIdeaOverlay();
            else if (target.userData.type === 'laptop') {
                // V921: Expanded Mind Animation
                startGoldenRatioAnimation();
            }
            else if (target.userData.type === 'studioHologram') {
                startGoldenRatioAnimation();
            }
            else if (target.userData.type === 'mmAnimationClose') {
                // Click the mesh itself to close it
                stopMMAnimation();
            }
            else if (target.userData.type === 'laptopMessage') {
                // Legacy support if specific hit logic used this
                startGoldenRatioAnimation();
            }
        }
    }
}
function checkIntersectionExternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(worldGroup.children, true);
    if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target && (!target.userData || !target.userData.name)) target = target.parent;
        if (target && target.userData && target.userData.name) {
            if (hoveredObject !== target) {
                hoveredObject = target;
                document.body.style.cursor = 'pointer';
                if (roomContent[hoveredObject.userData.name]) {
                    const tooltip = document.getElementById('tooltip');
                    tooltip.textContent = roomContent[hoveredObject.userData.name].title;
                    tooltip.style.opacity = 1;
                }
            }
            return;
        }
        // Hover Intro Sign
        if (target && target.userData && target.userData.type === 'introSign') {
            document.body.style.cursor = 'pointer';
            return;
        }
    }
    if (hoveredObject) {
        hoveredObject = null;
        document.body.style.cursor = 'default';
        document.getElementById('tooltip').style.opacity = 0;
    }
}

function checkIntersectionInternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interiorClickables);

    let isHoveringTopics = false;

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const target = intersects[0].object;

        if (target.userData.type === 'deckOfCards') {
            isHoveringTopics = true;
            // Lazy creation of tooltip
            if (!window.topicsSprite) {
                const canvas = document.createElement('canvas');
                canvas.width = 512; canvas.height = 256;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, 512, 256);
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.strokeRect(5, 5, 502, 246);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 30px Arial'; ctx.textAlign = 'center';
                ctx.fillText("TOPICS:", 256, 50);

                const topics = target.userData.topics || ["Art", "Life", "Love"];
                ctx.font = '24px Arial';
                // List them (split 2 lines?)
                ctx.fillText(topics.slice(0, 3).join(", "), 256, 100);
                ctx.fillText(topics.slice(3).join(", "), 256, 140);
                ctx.font = 'italic 20px Arial';
                ctx.fillStyle = '#aaaaaa';
                // ctx.fillText("(Click to Draw)", 256, 200); // Removed per user feedback

                const tex = new THREE.CanvasTexture(canvas);
                const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
                mat.opacity = 0.9;
                window.topicsSprite = new THREE.Sprite(mat);
                window.topicsSprite.scale.set(0.1, 0.05, 1); // Start Small
                window.topicsSprite.renderOrder = 999;
                interiorGroup.add(window.topicsSprite);
            }
            // Fix Revisit
            if (window.topicsSprite.parent !== interiorGroup) {
                interiorGroup.add(window.topicsSprite);
            }

            // Reset scale if it was hidden (re-trigger grow)
            if (!window.topicsSprite.visible) {
                window.topicsSprite.scale.set(0.1, 0.05, 1);
                window.topicsSprite.visible = true;
            }

            // Position above cards
            window.topicsSprite.position.set(0, 1.5, -1.2);
            window.topicsSprite.visible = true;
        }
    } else {
        document.body.style.cursor = 'default';
    }

    if (!isHoveringTopics && window.topicsSprite) {
        window.topicsSprite.visible = false;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    requestAnimationFrame(animate);
    try {
        const t = time * 0.001;

        // TWEEN.update(time); // Moved to end
        if (controls) controls.update();

        // Tree Sway
        animatedTrees.forEach(leaves => {
            const sway = Math.sin(t * leaves.userData.swaySpeed + leaves.userData.phase) * 0.03;
            leaves.rotation.z = sway;
            leaves.rotation.x = sway * 0.5;
        });

        // Fireflies Motion
        worldGroup.children.forEach(child => {
            if (child.userData.type === 'fireflies') {
                const pos = child.geometry.attributes.position.array;
                const speeds = child.userData.speeds;
                for (let i = 0; i < speeds.length; i++) {
                    pos[i * 3] += speeds[i].x;
                    pos[i * 3 + 1] += speeds[i].y;
                    pos[i * 3 + 2] += speeds[i].z;

                    // Boundaries
                    if (Math.abs(pos[i * 3]) > 40) speeds[i].x *= -1;
                    if (pos[i * 3 + 1] < 1 || pos[i * 3 + 1] > 16) speeds[i].y *= -1;
                    if (Math.abs(pos[i * 3 + 2]) > 40) speeds[i].z *= -1;
                }
                child.geometry.attributes.position.needsUpdate = true;
            }
        });

        // Interior Interactions (Sprite Grow / Arrow Bob)
        if (interiorGroup.visible) {
            // V800: Generic Update Loop for Interior Objects (Lava Lamp, etc)
            interiorGroup.traverse(child => {
                if (child.userData && typeof child.userData.update === 'function') {
                    child.userData.update(t);
                }
            });

            // Topics Grow
            if (window.topicsSprite) {
                const targetS = 3.0; // Target X Scale
                if (window.topicsSprite.scale.x < targetS) {
                    window.topicsSprite.scale.x += (targetS - window.topicsSprite.scale.x) * 0.1;
                    window.topicsSprite.scale.y += (1.5 - window.topicsSprite.scale.y) * 0.1;
                }
            }
            // Arrow Bob
            interiorGroup.children.forEach(child => {
                if (child.userData.type === 'arrow') {
                    child.position.y = child.userData.baseY + Math.sin(t * 3) * 0.1;
                    child.rotation.y += 0.02;
                }
            });
        }

        // --- ANIMATED LIGHTING ---

        // 1. Lamppost Flicker
        if (lamppostLight && lamppostLight.userData) {
            const u = lamppostLight.userData;
            // Combine sine waves for a more natural "flicker"
            const flicker = Math.sin(t * u.speed + u.phase) * 0.3 +
                Math.sin(t * 13.0) * 0.1 +
                (Math.random() - 0.5) * 0.2;
            lamppostLight.intensity = Math.max(0.2, u.base + flicker);
        }

        // 2. Window Lights (Independent Colors & Flicker)
        windowFlickerMaterials.forEach((mat, idx) => {
            if (mat.userData) {
                const u = mat.userData;

                // Flicker intensity
                const flicker = Math.sin(t * u.speed + u.phase) * 0.2;
                mat.emissiveIntensity = Math.max(0, u.baseEmissive + flicker);

                // Independent Color Cycle
                // We use HSL. Hue moves slowly.
                const hue = (u.hueOffset + t * u.hueSpeed) % 1.0;
                mat.color.setHSL(hue, 0.6, 0.6); // Base color
                mat.emissive.setHSL(hue, 0.8, 0.5); // Glow color
            }
        });

        // 3. Animated Shaders (e.g. Mirror)
        // V128: Add Camera Rotation for Parallax
        // Angle from 0 to 2PI approx
        const camAngle = Math.atan2(camera.position.x, camera.position.z);

        animatedShaderMaterials.forEach(mat => {
            if (mat.uniforms && mat.uniforms.uTime) {
                mat.uniforms.uTime.value = t;
            }
            if (mat.uniforms && mat.uniforms.uViewRotation) {
                mat.uniforms.uViewRotation.value = camAngle;
            }
        });

        // V922: Update MM Animation
        try {
            if (window.mmAnimation && window.mmMesh) {
                mmAnimation.update();
                if (mmMesh.material.map) mmMesh.material.map.needsUpdate = true;
            }
        } catch (mmErr) { console.warn("MM Anim Error", mmErr); }

        let avgFreq = 0;
        if (audioAnalyser) {
            audioAnalyser.getByteFrequencyData(audioDataArray);
            let sum = 0;
            for (let i = 0; i < audioDataArray.length; i++) sum += audioDataArray[i];
            avgFreq = sum / audioDataArray.length;
        }

        if (atomGroup) {
            atomGroup.rotation.y += 0.005;
            // V53: 3-Axis Rotation
            atomGroup.rotation.x += 0.002;
            atomGroup.rotation.z += 0.003;
            atomGroup.children.forEach(orbit => {
                if (orbit.userData.electron) orbit.rotation.z += orbit.userData.speed;
            });
        }

        if (currentRoom === 'basement' && basementNodes.length > 0) {
            const linePositions = [];
            const freqMod = avgFreq / 255;
            basementNodes.forEach((node, i) => {
                const ud = node.userData;
                node.position.add(ud.velocity);
                const scale = 1 + freqMod * 1.5;
                node.scale.set(scale, scale, scale);

                if (ud.isTruth) {
                    node.position.y = ud.originalY + Math.sin(time * 0.001 + i) * freqMod * 2;
                } else {
                    node.position.y = ud.originalY + Math.cos(time * 0.0015 + i) * freqMod * 2.5;
                }

                if (Math.abs(node.position.x) > 4.5) ud.velocity.x *= -1;
                if (node.position.y < 0.2 || node.position.y > 6.5) ud.velocity.y *= -1;
                if (Math.abs(node.position.z) > 4.5) ud.velocity.z *= -1;


                for (let j = i + 1; j < basementNodes.length; j++) {
                    const other = basementNodes[j];
                    const dist = node.position.distanceTo(other.position);
                    if (dist < 2.5) {
                        linePositions.push(node.position.x, node.position.y, node.position.z);
                        linePositions.push(other.position.x, other.position.y, other.position.z);
                    }
                }
            });
            if (basementLines) {
                basementLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                basementLines.geometry.attributes.position.needsUpdate = true;
                basementLines.material.opacity = 0.1 + freqMod * 0.4;
            }
        }

        if (noteTextSprite) {
            const scale = 1.5 + Math.sin(time * 0.003) * 0.1;
            noteTextSprite.scale.set(scale, scale * 0.58, 1);
        }

        // FLOATING THOUGHTS (BATHROOM)
        thoughtParticles.forEach((sprite, index) => {
            sprite.userData.life += 1;
            const life = sprite.userData.life;

            // Move Up
            sprite.position.y += sprite.userData.speed;

            // "coming out" -> Move Forward Z faster
            if (life < 100) sprite.position.z += 0.003;

            // Grow Continuously
            const progress = life / 300;
            const scale = 0.1 + progress * 12.0;
            sprite.scale.set(scale, scale * 0.12, 1);

            // Fade In Fast, Fade Out Slow
            if (life < 30) {
                sprite.material.opacity = life / 30;
            } else if (life > 200) {
                sprite.material.opacity = Math.max(0, 1 - (life - 200) / 100);
            } else {
                sprite.material.opacity = 1;
            }

            if (life > 300) {
                interiorGroup.remove(sprite);
                thoughtParticles.splice(index, 1);
            }
        });

        // Update Bottle Animation
        if (typeof updateBottle === 'function') {
            updateBottle(t);
        }
        // V119: Failsafe - UNCONDITIONAL Controls Enable (unless zooming)
        if (!window.isZoomingToRoom) {
            controls.enabled = true;
            controls.enableRotate = true;
            controls.enableZoom = true;
        }

        renderer.render(scene, camera);
        TWEEN.update(time);
    } catch (e) {
        // Prevent infinite alert loop, just log
        if (!window.hasLoggedAnimateError) {
            console.error("Critical Animate Error:", e);
            window.hasLoggedAnimateError = true;
        }
    }
}
try {
    init();
} catch (e) {
    console.error(e);
    const loading = document.getElementById('loading');
    if (loading) {
        loading.innerHTML = `<h2 class="text-red-500 bg-black p-4">Error: ${e.message}</h2><pre class="text-xs text-white bg-black p-4">${e.stack}</pre>`;
        loading.style.opacity = 1;
        loading.style.display = 'flex';
    }
}
