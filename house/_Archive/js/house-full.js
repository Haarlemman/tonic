/* house.js 
    FULL ENGINE - RESTORED V134
    Handles: Scene Setup, 3D Building, Atmospheric Intro, and Multi-Room Logic
*/

console.log("Loading House.js");

// --- GLOBAL VARIABLES ---
let openingFog;
let openingAnimationDone = false;
let lamppostLight = null;
let windowFlickerMaterials = [];
let animatedTrees = [];

let scene, camera, renderer, controls;
let textureLoader;
let worldGroup, interiorGroup;
let raycaster, mouse;
let state = 'HOUSE';
let currentRoom = null;
let currentTrackIndex = 0;
let hoveredObject = null;
const interiorClickables = [];

let tvMesh = null, currentSlideIndex = 0;
let videoElement = null, audioPlayer = null;
let musicSwitchMesh = null;
let isMusicPlaying = false;
let isTVVideoMode = false;

let pointerDownX = 0, pointerDownY = 0, isPossibleClick = false;

// --- INITIALIZATION ---
function init() {
    console.log("--- HOUSE.JS INITIALIZING FULL BUILD ---");
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a14, 20, 150);
    openingFog = scene.fog;
    scene.background = new THREE.Color(0x000000);
    scene.fog.color.setHex(0x050010);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 120);
    camera.lookAt(0, -2, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffa07a, 1.2);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    camera.add(dirLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, -2, 0); 

    worldGroup = new THREE.Group();
    scene.add(worldGroup);
    interiorGroup = new THREE.Group();
    scene.add(interiorGroup);
    interiorGroup.visible = false;

    // Building Environment & World (Uses 2000+ line building functions)
    buildWorld();
    buildEnvironment();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    audioPlayer = document.getElementById('room-audio');
    videoElement = document.getElementById('generic-video');

    setTimeout(() => {
        const loader = document.getElementById('loading');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 500);

    animate();
}

// --- OPENING CINEMATIC ---
function startOpeningAnimation() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    header.style.transform = 'translateY(-50%) scale(3.5)';
    header.style.top = '50%';
    header.style.opacity = '1';

    const animState = { px: 0, py: 5, pz: 120, ly: -2 };
    const targetState = { px: 8, py: 2, pz: 20, ly: 4 };

    new TWEEN.Tween(animState)
        .to(targetState, 6000)
        .onUpdate(() => {
            camera.position.set(animState.px, animState.py, animState.pz);
            controls.target.set(0, animState.ly, 0);
            controls.update();
        })
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
            controls.enabled = true;
            openingAnimationDone = true;
            window.introFinished = true;
        })
        .start();

    new TWEEN.Tween({ top: 50, scale: 3.5 })
        .to({ top: 15, scale: 1.0 }, 5000)
        .onUpdate((obj) => {
            header.style.top = obj.top + '%';
            header.style.transform = `translateY(-50%) scale(${obj.scale})`;
        })
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}

// --- INTERACTION ---
function performClick(event) {
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);

    if (state === 'HOUSE') {
        const intersects = raycaster.intersectObjects(worldGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            if (target.userData && target.userData.type === 'introSign') {
                enterRoom('hall');
                return;
            }
            while (target && (!target.userData || !target.userData.name)) target = target.parent;
            if (target && target.userData && target.userData.name) enterRoom(target.userData.name);
        }
    } else if (state === 'ROOM') {
        const intersects = raycaster.intersectObjects(interiorClickables, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target && (!target.userData || !target.userData.type) && target.parent) target = target.parent;

            // HANDLE DECK OF CARDS (LIVING ROOM)
            if (target && target.userData && target.userData.type === 'deckOfCards') {
                if (typeof window.drawConversationTopic === 'function') window.drawConversationTopic();
                return;
            }

            if (target.userData.type === 'tv') nextTVContent();
            else if (target.userData.type === 'musicSwitch') toggleMusic();
            else if (target.userData.type === 'musicPanel') nextTrack();
            else if (target.userData.type === 'songItem') playTrack(target.userData.index);
        }
    }
}

function checkIntersectionExternal() {
    if (!openingAnimationDone) return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(worldGroup.children, true);
    if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target && (!target.userData || !target.userData.name)) target = target.parent;
        if (target && target.userData && target.userData.name) {
            hoveredObject = target;
            document.body.style.cursor = 'pointer';
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.textContent = roomContent[target.userData.name].title;
                tooltip.style.opacity = 1;
            }
            return;
        }
    }
    document.body.style.cursor = 'default';
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.opacity = 0;
}

function checkIntersectionInternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interiorClickables, true);
    document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
}

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    controls.update();
    
    animatedTrees.forEach(leaves => {
        const sway = Math.sin(t * leaves.userData.swaySpeed + leaves.userData.phase) * 0.03;
        leaves.rotation.z = sway;
    });

    if (interiorGroup.visible) {
        interiorGroup.children.forEach(child => {
            if (child.userData.type === 'arrow') {
                child.position.y = child.userData.baseY + Math.sin(t * 3) * 0.1;
                child.rotation.y += 0.02;
            }
        });
    }

    renderer.render(scene, camera);
    TWEEN.update(time);
}

// --- HELPER WRAPPERS ---
function onPointerDown(event) { isPossibleClick = true; pointerDownX = event.clientX; pointerDownY = event.clientY; }
function onPointerMove(event) {
    const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
    if (dist > 10) isPossibleClick = false;
    updateMousePosition(event);
    if (state === 'HOUSE') checkIntersectionExternal();
    else if (state === 'ROOM') checkIntersectionInternal();
    const tooltip = document.getElementById('tooltip');
    if (tooltip) { tooltip.style.left = event.clientX + 'px'; tooltip.style.top = event.clientY + 'px'; }
}
function onPointerUp(event) { if (isPossibleClick) performClick(event); isPossibleClick = false; }
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function updateMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// ... All 2000 lines of room building logic (basement, attic, etc.) go here ...






console.log("Loading House.js");
let openingFog;
let openingAnimationDone = false;
let lamppostLight = null;
let windowFlickerMaterials = [];
let animatedShaderMaterials = [];
let animatedTrees = [];



// --- 3D SETUP ---
let scene, camera, renderer, controls;
let textureLoader;
let worldGroup, interiorGroup;
let raycaster, mouse;
let animationId;
let dirLight, rimLight, ambientLight, hemiLight;

let noteTextSprite = null;
let thoughtSprite = null;
let thoughtInterval = null;
let thoughtParticles = []; 

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
let videoElement = null, videoTexture = null;
let audioPlayer = null;
let musicSwitchMesh = null;
let musicPanelMesh = null;
let playlistPanelMesh = null;
let isMusicPlaying = false;



// Effects
let atomGroup = null;
let basementNodes = [];
let basementLines = null;
let audioContext, audioAnalyser, audioDataArray;

let pointerDownX = 0, pointerDownY = 0, isPossibleClick = false;




function init() {
    console.log("--- HOUSE.JS V134 LOADED ---");
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a14, 20, 150);
    openingFog = scene.fog;
    scene.background = new THREE.Color(0x000000);
    scene.fog.color.setHex(0x050010);
    scene.fog.near = 20;
    scene.fog.far = 200; 

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 120);
    camera.lookAt(0, -2, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffa07a, 1.2);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    camera.add(dirLight); 

    rimLight = new THREE.DirectionalLight(0xb266ff, 0.6);
    rimLight.position.set(-20, 10, -10); 
    camera.add(rimLight); 

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 1.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, -2, 0); 

    worldGroup = new THREE.Group();
    scene.add(worldGroup);
    interiorGroup = new THREE.Group();
    scene.add(interiorGroup);
    interiorGroup.visible = false;

    window.isZoomingToRoom = false;
    window.introFinished = false;

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

    animate();
}








window.enterExperience = function () {
    console.log("=== ENTER EXPERIENCE TRIGGERED ===");

    // 1. Fullscreen
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(e => console.log("Fullscreen failed:", e));
    } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
    }

    // 2. Play Audio - Simple Direct Approach
    const player = document.getElementById('room-audio');
    console.log("Audio element found:", !!player);

    if (player) {
        // Set source and properties
        player.src = 'assets/audio/Rats-KyleDixon_MichaelStein.mp3';
        player.volume = 0.8;
        player.loop = true;

        console.log("Attempting to play audio...");

        // Try to play immediately
        const playPromise = player.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("✓✓✓ AUDIO PLAYING SUCCESSFULLY ✓✓✓");
                isMusicPlaying = true;
            }).catch(error => {
                console.error("❌ Audio play blocked:", error);
                console.log("Will try again on next click...");

                // Fallback: play on next user interaction
                const retryPlay = () => {
                    player.play().then(() => {
                        console.log("✓ Audio playing after retry");
                        isMusicPlaying = true;
                        document.removeEventListener('click', retryPlay);
                        document.removeEventListener('touchstart', retryPlay);
                    }).catch(e => console.error("Retry failed:", e));
                };

                document.addEventListener('click', retryPlay, { once: true });
                document.addEventListener('touchstart', retryPlay, { once: true });
            });
        }
    } else {
        console.error("❌ Audio element not found!");
    }

    // 3. UI Updates
    const btn = document.getElementById('start-btn');
    if (btn) btn.style.display = 'none';

    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.remove('hidden');

    // 4. Start Animation
    if (typeof startOpeningAnimation === 'function') {
        startOpeningAnimation();
    } else {
        console.warn("startOpeningAnimation not found");
    }
};

window.exitExperience = function () {
    console.log("=== EXIT EXPERIENCE TRIGGERED ===");

    // 1. Exit Fullscreen
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.log("Exit Fullscreen error:", e));
    }

    // 2. Stop Audio/Video
    const player = document.getElementById('room-audio');
    if (player) {
        player.pause();
        isMusicPlaying = false;
    }
    const video = document.getElementById('generic-video');
    if (video) video.pause();

    // Stop attic video if playing
    const atticVideo = document.getElementById('attic-video');
    if (atticVideo) atticVideo.pause();


    // 3. Reset View specific if inside a room
    if (state === 'ROOM') {
        exitRoom();
        // exitRoom handles transition, but we want to ensure we go fully back to "start" state
        // exitRoom eventually sets state='HOUSE' and resets camera.
        // We might need to wait for it, or just rely on the UI overlay to cover it.
    }

    // 4. Restore UI (Header, Button)
    const header = document.getElementById('main-header');
    if (header) {
        // Reset to initial "overview" look?
        // Actually, just making it visible is probably enough, as the user said "header expanded".
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto'; // Re-enable interaction if it was disabled?
        // Note: The header has pointer-events-none initially in CSS? 
        // Line 38: pointer-events-none.
        // Wait, if it's pointer-events-none, how can we click the menu?
        // Ah, the `nav` or inner elements might have pointer-events-auto.
        // Let's check CSS... yes, line 68 has specific override.
        // But for safety, let's leave pointer-events alone if it works.
    }

    // Expand Header
    const headerContent = document.getElementById('header-content');
    if (headerContent) {
        // Use logic similar to layout.js / or just force classes
        headerContent.classList.remove('max-h-0', 'py-0', 'border-b-0', 'overflow-hidden');
        headerContent.classList.add('max-h-40', 'py-1', 'border-b-2', 'overflow-visible');
        localStorage.setItem('headerCollapsed', 'false');
    }

    // Show Start Button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.style.display = 'block';

    // Hide Exit Button
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.add('hidden');

    // Reset Camera/Fog to "start" state (optional, but nice)
    // If not in room, we are in HOUSE state. 
    // Maybe we should reset camera to the "Cinematic Start" position or just the "Landing" position?
    // User said "go back to the main overview page". 
    // Usually this means the state *before* they clicked Enter.
    // Before Enter, camera is at (0, 5, 120).
    // After Intro, camera is at (8, 2, 20).
    // If we exit, do we want to fly back out? Or just show the UI?
    // "Escape the fullscreen experience" suggests returning to the "Website" mode.
    // So yes, showing UI is key. Camera position is secondary.
    // I'll leave camera as is (unless in Room, where exitRoom resets it).

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

    // -- ENLARGED CLICK AREA FOR LIVING ROOM REMOVED (Handled in buildEnvironment) --
    // const liveHitBox = new THREE.Mesh(
    //     new THREE.BoxGeometry(3.5, 4.0, 6.0),
    //     new THREE.MeshBasicMaterial({ visible: false })
    // );
    // liveHitBox.position.set(-1.0, 2.5, 0); // Higher and much larger
    // liveHitBox.userData = { name: 'living', type: 'room' };
    // worldGroup.add(liveHitBox);

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

    // -- ENLARGED CLICK AREA FOR HALL REMOVED (Handled in buildEnvironment) --
    // Narrower box to avoid overlap with Living Room/Studio
    // const hallHitBox = new THREE.Mesh(
    //     new THREE.BoxGeometry(1.3, 3.0, 2.0), // Width 1.3 (was 2.0)
    //     new THREE.MeshBasicMaterial({ visible: false })
    // );
    // hallHitBox.position.set(0, 1.5, 3.0);
    // hallHitBox.userData = { name: 'hall', type: 'room' };
    // worldGroup.add(hallHitBox);

    const stepMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const stepWidth = 1.4;
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.2, 0.5), stepMat);
    step1.position.set(0, 0.6, 2.75);
    worldGroup.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth + 0.2, 0.2, 0.5), stepMat);
    step2.position.set(0, 0.4, 3.15);
    worldGroup.add(step2);
    const step3 = new THREE.Mesh(new THREE.BoxGeometry(stepWidth + 0.4, 0.2, 0.5), stepMat);
    step3.position.set(0, 0.2, 3.55);
    worldGroup.add(step3);
    createRoomBlock('toilet', 0, 1.1, -3.5, 1.2, 2.2, 2.0, roomContent.toilet.hex, [
        { type: 'dark', scale: 0.6, side: 'left', narrow: true },
        { type: 'dark', scale: 0.6, side: 'right', narrow: true }
    ]);
    createRoomBlock('bedroom', -1.0, 3.8, 0, 2.0, 2, 5, roomContent.bedroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);

    // -- ENLARGED CLICK AREA FOR BEDROOM REMOVED (Handled in buildEnvironment) --
    // Bedroom block is approx -1.0, 3.8, 0 with size 2.0, 2, 5. 
    // Hitbox should be larger. 
    // const bedHitBox = new THREE.Mesh(
    //     new THREE.BoxGeometry(3.5, 3.5, 7.0),
    //     new THREE.MeshBasicMaterial({ visible: false })
    // );
    // bedHitBox.position.set(-1.5, 3.8, 1.0);
    // bedHitBox.userData = { name: 'bedroom', type: 'room' };
    // worldGroup.add(bedHitBox);

    createRoomBlock('bathroom', 1.0, 3.8, 0, 2.0, 2, 5, roomContent.bathroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-3.0, 0); roofShape.lineTo(3.0, 0); roofShape.lineTo(0, 3.0); roofShape.lineTo(-3.0, 0);
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 5.2, bevelEnabled: false });
    roofGeo.center();
    const roofTexture = createRoofTexture();
    const roofTilesMat = new THREE.MeshStandardMaterial({ map: roofTexture, color: 0xffffff, roughness: 0.8, bumpMap: roofTexture, bumpScale: 0.02 });
    // V128: Darker Facade (Was 0xcdc7b9 -> 0x5d4037)
    const facadeMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
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
    ctx.fillStyle = '#3e2723'; ctx.fillRect(0, 0, 512, 512);
    const rows = 10; const cols = 8;
    const tileH = 512 / rows; const tileW = 512 / cols;
    for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (tileW / 2);
        for (let c = -1; c < cols + 1; c++) {
            const shade = Math.random() * 40;
            const val = 60 + shade;
            ctx.fillStyle = `rgb(${val}, ${val * 0.65}, ${val * 0.4})`;
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
    const group = new THREE.Group();
    // Position in front of camera (Camera at 0, 20, 85)
    // V13: Lower slightly to 14 (V12 was 16 - too high)
    group.position.set(0, 14, 70);
    group.rotation.x = -0.2; // Tilt up slightly

    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    pole.position.y = -5;
    group.add(pole);

    // Board
    const tex = createIntroSignTexture();
    const board = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 1.8, 0.2), // Smaller box (Was 6, 4)
        new THREE.MeshStandardMaterial({ map: tex, transparent: true }) // V7: Allow fade
    );
    board.userData = { type: 'introSign', name: 'introSign' }; // Important for raycaster
    group.add(board);

    // Pulsing Glow behind
    const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 6),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0 })
    );
    glow.position.z = -0.1;
    glow.userData = { isIntroGlow: true };
    board.add(glow);

    worldGroup.add(group);
}

function startInteractiveIntro() {
    // 1. Play Audio (Immediately)
    // Sound should start immediately after clicking 'ENTER'
    const audio = new Audio('assets/audio/Tension_Short_07.wav');
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
            .to({ y: -50 }, 4000) // 4s Drop
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                // V211: Do NOT remove, just hide so we can restore it on Exit
                sign.visible = false;
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

    // 3. Start Animation
    // V12: INSTANT SYNC
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
    const signTex = createSignTexture();
    const signWidth = 1.4; const signHeight = 0.7;
    const signGeo = new THREE.BoxGeometry(signWidth, signHeight, 0.05);
    const signMat = new THREE.MeshStandardMaterial({ map: signTex });
    const signBackMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const sign = new THREE.Mesh(signGeo, [signBackMat, signBackMat, signBackMat, signBackMat, signMat, signBackMat]);
    // V208: Make Sign Interactive -> Enter Hall
    sign.userData = { name: 'hall', type: 'room' };
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
    const planeMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1, color: 0x666666 });

    // V80: Planet "Mini-Earth" Environment
    const PLANET_RADIUS = 120;
    const planetGroup = new THREE.Group();
    // Center the sphere so its top surface touches (0,0,0)
    planetGroup.position.set(0, -PLANET_RADIUS, 0);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS, 128, 128), planeMat);
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

    for (let i = 0; i <= roadSegments; i++) {
        const ratio = i / roadSegments;
        const z = roadStartZ + (roadEndZ - roadStartZ) * ratio;

        // Lerp width
        const currentWidth = widthAtHouse + (widthAtHorizon - widthAtHouse) * ratio;

        // V84: Offset 0.1 to obscure z-fighting with plane
        const y = getPlanetY(0, z) + 0.1;

        // Normal at (0, y, z)
        const normal = new THREE.Vector3(0, y + PLANET_RADIUS, z).normalize();

        rVertices.push(-currentWidth / 2, y, z);
        rVertices.push(currentWidth / 2, y, z);

        rUVs.push(0, ratio);
        rUVs.push(1, ratio);

        if (i < roadSegments) {
            const base = i * 2;
            rIndices.push(base, base + 1, base + 2);
            rIndices.push(base + 2, base + 1, base + 3);
        }
    }

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
    // createHitBox('living', -1.0, 1.5, 3.8, 2.0, 3.0, 1.0);

    // Hall Hit Box (Center)
    // V143: Low & Precise.
    // Visual Width 1.2. Hit Width 1.0. Height 2.2. Z=3.2.
    // createHitBox('hall', 0, 1.5, 3.2, 1.0, 2.2, 1.0);

    // Bedroom Hit Box (Upper Left)
    // V143: Low & Precise.
    // Y=4.0. Height 2.5. Z=3.5.
    // createHitBox('bedroom', -1.0, 4.0, 3.5, 2.0, 2.5, 1.0);

    // V150: REFINED HITBOXES (No Overlap)
    // Living Room (Left) - Shifted left to avoid Hall overlap at x=0
    createHitBox('living', -1.3, 1.5, 3.8, 1.4, 3.0, 0.5);

    // Hall (Center) - Precise center strip
    createHitBox('hall', 0, 1.5, 3.8, 1.0, 2.2, 0.5);

    // Studio (Right) - NEW - Shifted right
    createHitBox('studio', 1.3, 1.5, 3.8, 1.4, 3.0, 0.5);

    // Bedroom (Top Left)
    createHitBox('bedroom', -1.3, 4.2, 3.8, 1.4, 2.5, 0.5);

    // Bathroom (Top Right) - NEW
    createHitBox('bathroom', 1.3, 4.2, 3.8, 1.4, 2.5, 0.5);

    // Attic (Top Center) - NEW
    createHitBox('attic', 0, 6.2, 3.8, 3.0, 2.0, 0.5);


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

// V102: Helper for Glow Texture
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(136, 0, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}


function startOpeningAnimation() {
    // "Cinematic" start: camera far away, heavy fog
    // V13 FIX: DO NOT JUMP TO z=60. Start from current z=85 to avoid "popping" sign (at z=70) behind camera.
    // camera.position.set(5, 25, 60); 

    // V73: Removed bad fog reset (300, 100) which caused purple flash. 
    // Uses init values (20, 80) instead.

    // Curve path: Swing right -> Arrive at Isometric angle (Front-Right Corner)
    // End pos: (6, 5, 16) -> More frontal to avoid trees
    // V6: Smooth start from (0, 20, 85)
    // Add current position as first point to avoid jump
    // End pos: (6, 5, 16) -> More frontal to avoid trees
    // V15: Start from new closer position (0, 15, 65)
    // V22: Reduce swing (X=20 -> X=5) to prevent "jumpy" feeling
    // V28: Straighten path even more (X=3) to remove "wobble/bump"
    // V45: Linear Path (Direct) to prevent "Jump" at end. 
    // Bezier/Catmull with 3 points often overshoots or snaps at end.
    const xCoords = 6;
    const yCoords = 5;
    const zCoords = 16;

    const fogTarget = { near: 14, far: 110 };  // Clearer weather

    // Animate Header UP Faster (With Scale)
    const header = document.getElementById('main-header');

    // V110: Big -> Small Animation (Starts HUGE)
    header.style.transform = 'translateY(-50%) scale(3.5)';
    header.style.top = '50%';
    header.style.opacity = '1';

    // V52: Collapse using CLASSES to keep sync with layout.js toggle logic
    // This ensures clicking the pixel band later will correctly "Expand" it.
    const headerContent = document.getElementById('header-content');
    if (headerContent) {
        // Remove Open Classes
        headerContent.classList.remove('max-h-40', 'py-1', 'border-b-2', 'overflow-visible');
        // Add Closed Classes
        headerContent.classList.add('max-h-0', 'py-0', 'border-b-0', 'overflow-hidden');
    }

    // DELAY START (Removed as per interaction update)
    // V63: Even Closer Start
    // Camera Animation
    // V84: Dynamic Camera Target Tween
    // Pos: (0, 5, 120) -> (0, 2, 20)
    // LookAt Y: -2 -> 4 (To look UP at roof, pushing house DOWN in frame)
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
            // V105: Continuous Sync
            controls.target.set(0, animState.ly, 0);
            controls.update(); // Keep internal state synced to manual moves
        })
        .easing(TWEEN.Easing.Cubic.InOut) // Smoother start/end
        .onComplete(() => {
            // V104: Fix Drop - Disable Damping during sync
            controls.enableDamping = false;

            camera.position.set(8, 2, 20); // Force Final Pos
            camera.lookAt(0, 4, 0);       // Force Final Look
            controls.target.set(0, 4, 0); // Match Target
            controls.update();            // Sync Controls

            controls.enableDamping = true; // Re-enable
            controls.enabled = true;

            // V52: Ensure Header Collapse
            if (headerContent) {
                // Header content logic
            }
            // Restore damping smoothly
            setTimeout(() => {
                controls.enableDamping = true;
            }, 100);

            // Sync final state
            controls.target.set(0, targetState.ly, 0);
            controls.update();

            // V117: Set Global Flag
            window.introFinished = true;
        })
        .start();

    // Fog Animation (Clearer)
    const fogTargetClear = { near: 20, far: 200 }; // V59: Much clearer
    new TWEEN.Tween(openingFog)
        .to({ near: fogTargetClear.near, far: fogTargetClear.far }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // Text Animation (Fade Out / Move Up)
    // V52: New Text Animation logic
    // Just fade out header since we want full view? 
    // Or keep the "Move Up" effect? 
    // The previous logic moved it up. 
    // Header is fixed in HTML.

    // V65: Text BIGGER AGAIN (3.0 -> 1.6)
    // Start Scale 3.0 (Was 2.2) -> End Scale 1.6 (Was 1.3)
    // V115: Dynamic Percent-Based Scaling (Animation Phase)
    // We already set valid Start Scale in init(). 
    // Now we just calc End Scale and animate to it.

    // Measure again just in case (cheap) or reuse logic
    header.style.transform = 'scale(1)'; // Reset to measure
    const h1 = header.querySelector('h1');
    let naturalWidth = 300;
    if (h1) {
        const range = document.createRange();
        range.selectNodeContents(h1);
        naturalWidth = range.getBoundingClientRect().width;
    }

    const isMobile = window.innerWidth < 768;
    const startTop = isMobile ? 30 : 50;

    // Recalc Start to be safe for the Tween start object
    const startPct = isMobile ? 0.9 : 0.8;
    const startScale = (window.innerWidth * startPct) / naturalWidth;

    const endPct = isMobile ? 0.8 : 0.6;
    const endScale = (window.innerWidth * endPct) / naturalWidth;

    new TWEEN.Tween({ top: startTop, scale: startScale })
        .to({ top: 15, scale: endScale }, 5000) // Shrink to calculated end scale
        .onUpdate((obj) => {
            header.style.top = obj.top + '%';
            header.style.transform = `translateY(-50%) scale(${obj.scale})`;
        })
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    // V67: Cleaned up duplicate/conflicting tweens
    // The previous code had a second fog tween and a second header tween here.
    // They are removed.

}



// --- INTERIOR BUILDER ---
// Global variable to track the current left wall position for dynamic UI placement
window.currentWallX = -5.0;

// [MOVED] enterExperience logic consolidated at line 257

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
    animatedShaderMaterials = [];

    const data = roomContent[roomKey];

    // --- CUSTOM ROOM DIMENSIONS ---
    // Toilet is Narrow (4.0), others are Standard (10.0)
    const roomWidth = (roomKey === 'toilet') ? 4.0 : 10.0;
    const wallOffset = roomWidth / 2; // 2.0 for toilet, 5.0 for others

    // CRITICAL: Update global wall position for music.js
    window.currentWallX = -wallOffset;

    // V128: Darker Floor
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    const wallMat = new THREE.MeshStandardMaterial({ color: data.hex, side: THREE.DoubleSide });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, 8), wallMat);
    backWall.position.set(0, 4, -5);
    interiorGroup.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-wallOffset, 4, 0);
    interiorGroup.add(leftWall);

    // Right Wall removed for visibility

    const bulb = new THREE.PointLight(0xffffff, 0.8, 20);
    bulb.position.set(0, 6, 0);
    interiorGroup.add(bulb);

    // Build Music Panel (will use window.currentWallX)
    createMusicPanel(data.playlist);

    if (roomKey === 'living') createLivingRoomInterior();
    else if (roomKey === 'bedroom') createBedroomInterior();
    else if (roomKey === 'studio') createStudioInterior();
    else if (roomKey === 'toilet') {
        if (typeof createToiletInterior === 'function') {
            createToiletInterior();
        } else {
            console.error("createToiletInterior missing. Check toilet-490.js");
        }
    }
    else if (roomKey === 'hall') createHallInterior();
    else if (roomKey === 'attic') createAtticInterior();
    else if (roomKey === 'basement') createBasementInterior();
    else if (roomKey === 'bathroom') createBathroomInterior();
    else createGenericInterior(data.title);
}











// --- HELPERS & LOGIC ---



// START VIDEO CLIP
function startVideoClip(room) {
    const playlist = roomContent[room].videoPlaylist;
    if (!playlist) return;
    const clip = playlist[currentVideoIndex];
    videoElement.src = clip.src;
    // V55: Ensure Unmuted
    videoElement.muted = false;
    // V205: Bedroom Volume 0.7
    videoElement.volume = (room === 'bedroom') ? 0.7 : 0.8;
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



// TOGGLE VIDEO (Button Click)
function toggleVideo() {
    const btn = interiorGroup.children.find(c => c.userData.type === 'videoPlayButton');
    if (!btn) return;

    if (videoElement.paused) {
        // PLAY
        // V55: Ensure Unmute
        videoElement.muted = false;
        // V205: Bedroom Volume 0.7
        videoElement.volume = (currentRoom === 'bedroom') ? 0.7 : 0.8;
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



// TOGGLE VIDEO POSTER (Studio)
function toggleVideoPoster(mesh) {
    const video = mesh.userData.videoElement;
    if (!video) return;

    if (video.paused) {
        video.play().catch(e => console.error("Poster play failed", e));
        mesh.material.opacity = 1.0; // Full brightness
    } else {
        video.pause();
        mesh.material.opacity = 0.5; // Dim when paused
    }
}

function openIdeaOverlay() {
    const overlay = document.getElementById('idea-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // Restore saved idea
        const saved = localStorage.getItem('tonic_idea');
        if (saved) document.getElementById('idea-text').value = saved;

        // Pause interactions
        if (controls) controls.enabled = false;
    }
}

window.closeIdeaOverlay = function () {
    const overlay = document.getElementById('idea-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        if (controls) controls.enabled = true;
    }
};

window.saveIdea = function () {
    const text = document.getElementById('idea-text').value;
    localStorage.setItem('tonic_idea', text);
    alert("Idea saved!");
    window.closeIdeaOverlay();
};

function saveIdea() { // Keep internal function specific handling if needed or just alias
    window.saveIdea();
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

// V110: 3D Laptop Message
function showLaptopMessage() {
    // Find laptop position
    let laptopPos = new THREE.Vector3(2, 2, -2); // Default fallback (Studio Desk)
    const laptop = interiorGroup.children.find(c => c.userData.type === 'laptop');
    if (laptop) {
        laptopPos.copy(laptop.position);
        laptopPos.y += 1.0; // Float above
    }

    // Create Sprite Label
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128; // Rectangular
    const ctx = canvas.getContext('2d');

    // Background (Optional, or just text)
    // ctx.fillStyle = 'rgba(0,0,0,0.5)';
    // ctx.fillRect(0,0,512,128);

    ctx.font = 'Bold 40px Courier New';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 10;
    ctx.fillText("Reality is Relative", 256, 80);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(laptopPos);
    sprite.scale.set(3, 0.75, 1); // Aspect ratio match

    interiorGroup.add(sprite);

    // Animate
    // Fade In
    new TWEEN.Tween(mat)
        .to({ opacity: 1 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // Fade Out after 2s
    setTimeout(() => {
        new TWEEN.Tween(mat)
            .to({ opacity: 0 }, 1000)
            .onComplete(() => {
                interiorGroup.remove(sprite);
            })
            .start();
    }, 2500);
}

function enterRoom(roomName) {
    state = 'TRANSITION';
    currentRoom = roomName;
    currentTrackIndex = 0;
    currentVideoIndex = 0;
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
            if (roomName === 'bedroom' || roomName === 'living' || roomName === 'attic') {
                if (dirLight) dirLight.intensity = 0.1;
                if (rimLight) rimLight.intensity = 0.1;
                // V137: Use ambientLight
                if (ambientLight) ambientLight.intensity = 0.1; // Attic might need even less? 0.1 is quite dark.
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
                // If attic, just silence the main player (Video will auto-play with sound)
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
                console.warn("Info Panel not found (Intentional removal?)");
            }

            document.getElementById('main-header').style.opacity = 0;
            const bBtn = document.getElementById('back-btn');
            if (bBtn) {
                bBtn.style.display = 'block';
                // Trigger Fade In
                // Needs a slight delay to allow display block to render before opacity change if using CSS transition
                // Assume it starts at opacity 0 in CSS or we force it? 
                // Currently style.css or defaults might be opacity 1. 
                // Let's force opacity 1.
                bBtn.style.opacity = '1';
            }
            document.getElementById('tooltip').style.opacity = 0;
            document.getElementById('instructions').textContent = "Click music board to cycle tracks • Drag to rotate";
            curtain.classList.remove('active');
            state = 'ROOM';

            // Auto-minimize REMOVED (Starts minimized)
            if (infoTimeout) clearTimeout(infoTimeout);

            // V201: Stop Attic Video if NOT in Attic
            const atticVideo = document.getElementById('attic-video');
            if (atticVideo && roomName !== 'attic') {
                atticVideo.pause();
                atticVideo.muted = true; // double safety
            }

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

    if (videoElement && !videoElement.paused) videoElement.pause();

    // V201: Stop Attic Video on Exit
    const atticVideo = document.getElementById('attic-video');
    if (atticVideo) {
        atticVideo.pause();
        atticVideo.muted = true;
    }

    audioPlayer.pause();
    isMusicPlaying = false;

    // Clear any pending info panel minimize timeout
    if (infoTimeout) clearTimeout(infoTimeout);

    // Fade Out Back Button
    const bBtn = document.getElementById('back-btn');
    if (bBtn) {
        bBtn.style.opacity = '0'; // Relies on CSS transition
    }

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
        // V212: Match Intro End State Exactly (8, 2, 20)
        camera.position.set(8, 2, 20);
        camera.lookAt(0, 4, 0);
        controls.target.set(0, 4, 0);
        controls.update();

        // Safe UI Reset
        const rInfo = document.getElementById('room-info');
        if (rInfo) rInfo.style.display = 'none';

        // V216: Restore House Overview UI (NOT Landing Page)
        // 1. Restore Main Header (No Offset, just 15%)
        const mHead = document.getElementById('main-header');
        if (mHead) {
            mHead.style.opacity = '1';
            mHead.style.pointerEvents = 'auto';
            // Reset Scale for accurate measure
            mHead.style.transform = 'scale(1)';

            const h1 = mHead.querySelector('h1');
            let naturalWidth = 300;
            if (h1) {
                const range = document.createRange();
                range.selectNodeContents(h1);
                naturalWidth = range.getBoundingClientRect().width;
            }
            const isMobile = window.innerWidth < 768;
            const endPct = isMobile ? 0.8 : 0.6;
            const targetScale = (window.innerWidth * endPct) / naturalWidth;

            // Simple 15% Top (No Global Header Offset)
            mHead.style.top = '15%';
            mHead.style.transform = `translateY(-50%) scale(${targetScale})`;
        }

        // 2. Ensure Start Button is HIDDEN (Overview Mode)
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.style.display = 'none';

        // 3. Restore Intro Sign (Lamppost) - User wanted this back
        const sign = worldGroup.children.find(c => {
            return c.children.some(child => child.userData && child.userData.type === 'introSign');
        });
        if (sign) {
            sign.visible = true;
            sign.position.y = 0;
            sign.scale.set(1, 1, 1);
            const board = sign.children.find(c => c.userData.type === 'introSign');
            if (board && board.material) {
                board.material.opacity = 1;
            }
        }

        const instr = document.getElementById('instructions');
        if (instr) instr.textContent = "Click a room to enter it • Drag to rotate";

        if (curtain) curtain.classList.remove('active');
        state = 'HOUSE';
        currentRoom = null;
        window.isZoomingToRoom = false;
    }, 2000); // V206: Wait 2s for fade out
}

window.exitExperience = function () {
    console.log("=== EXIT EXPERIENCE TRIGGERED ===");

    // 1. Exit Fullscreen
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.log("Exit Fullscreen error:", e));
    }

    // 2. Stop Audio/Video
    const player = document.getElementById('room-audio');
    if (player) {
        player.pause();
        isMusicPlaying = false;
    }
    const video = document.getElementById('generic-video');
    if (video) video.pause();

    // Stop attic video if playing
    const atticVideo = document.getElementById('attic-video');
    if (atticVideo) atticVideo.pause();


    // 3. Reset View specific if inside a room
    if (state === 'ROOM') {
        exitRoom();
    } else {
        resetUIOverlay();
    }

    // Hide Exit Button
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.add('hidden');
};

function resetUIOverlay() {
    // 4. Restore UI (Header, Button)
    const header = document.getElementById('main-header');
    if (header) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';

        // V213: CRITICAL FIX - Reset Scale to 1 before measuring to get true natural width
        header.style.transform = 'scale(1)';

        // 1. Measure Width
        const h1 = header.querySelector('h1');
        let naturalWidth = 300;
        if (h1) {
            const range = document.createRange();
            range.selectNodeContents(h1);
            naturalWidth = range.getBoundingClientRect().width;
        }

        // 2. Calculate Scale matches Intro End
        const isMobile = window.innerWidth < 768;
        const endPct = isMobile ? 0.8 : 0.6;
        const targetScale = (window.innerWidth * endPct) / naturalWidth;

        // V215: Use Dynamic Global Header Height (from layout.js) to avoid overlap. 
        // fallback 160px (max-h-40)
        header.style.top = 'calc(15% + var(--global-header-height, 160px))';
        header.style.transform = `translateY(-50%) scale(${targetScale})`;
    }

    // Expand Header Content
    const headerContent = document.getElementById('header-content');
    if (headerContent) {
        headerContent.classList.remove('max-h-0', 'py-0', 'border-b-0', 'overflow-hidden');
        headerContent.classList.add('max-h-40', 'py-1', 'border-b-2', 'overflow-visible');
        localStorage.setItem('headerCollapsed', 'false');
    }

    // Show Start Button (Centered)
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.style.display = 'block';

    // Ensure Container is Centered
    const startBtnCont = document.getElementById('start-btn-container');
    if (startBtnCont) {
        // V215: Maintain 50px buffer or use variable? 
        // 75% usually clears, but with a huge header, maybe push slightly. 
        // Let's stick to the user's "pushed down" request but keep it clean.
        startBtnCont.style.top = 'calc(75% + var(--global-header-height, 160px))';
        // V213: Force Width/Left to ensure centering
        startBtnCont.style.left = '0';
        startBtnCont.style.width = '100%';
        startBtnCont.style.transform = 'translateY(-50%)';
        startBtnCont.style.textAlign = 'center';
    }

    // V211: Restore Intro Sign (Lamppost)
    const sign = worldGroup.children.find(c => {
        return c.children.some(child => child.userData && child.userData.type === 'introSign');
    });
    if (sign) {
        sign.visible = true;
        sign.position.y = 0; // Restore to ground
        sign.scale.set(1, 1, 1); // Reset scale

        const board = sign.children.find(c => c.userData.type === 'introSign');
        if (board && board.material) {
            board.material.opacity = 1; // Restore Opacity
        }
    }
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





/**
 * performClick: Handles interactions with 3D objects.
 * Updated to support the new Conversation Topics system.
 */
function performClick(event) {
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    if (state === 'HOUSE') {
        const intersects = raycaster.intersectObjects(worldGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            if (target.userData && target.userData.type === 'introSign') {
                enterRoom('hall');
                return;
            }
            while (target && (!target.userData || !target.userData.name)) { target = target.parent; }
            if (target && target.userData && target.userData.name) { enterRoom(target.userData.name); }
        }
    } else if (state === 'ROOM') {
        const intersects = raycaster.intersectObjects(interiorClickables, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            const originalTarget = target; 
            
            while (target && (!target.userData || !target.userData.type) && target.parent) {
                target = target.parent;
            }

            // --- CONVERSATION TOPICS BOX HANDLER ---
            if (target && target.userData && target.userData.type === 'deckOfCards') {
                if (typeof window.drawConversationTopic === 'function') {
                    window.drawConversationTopic();
                }
                return; 
            }

            if (target && target.userData && target.userData.type === 'notepad') {
                openIdeaOverlay();
                return;
            }

            if (originalTarget.userData.isVideo) {
                toggleVideoPoster(originalTarget);
                return;
            }

            if (target.userData.type === 'tv') nextTVContent();
            else if (target.userData.type === 'videoPhone') toggleVideo();
            else if (target.userData.type === 'musicSwitch') toggleMusic();
            else if (target.userData.type === 'musicPanel') nextTrack();
            else if (target.userData.type === 'songItem') playTrack(target.userData.index);
            else if (target.userData.type === 'videoPlayButton') toggleVideo();
            else if (target.userData.type === 'laptop') showLaptopMessage();
            else if (target.userData.type === 'atticAudioToggle') {
                if (window.handleAtticToggleClick) window.handleAtticToggleClick(target);
            }
        }
    }
}







function checkIntersectionInternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interiorClickables);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
    // Cleaned up: Removed the old "topicsSprite" hover logic to clear the view.
}

function updateMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}
function onPointerDown(event) { isPossibleClick = true; pointerDownX = event.clientX; pointerDownY = event.clientY; }
function onPointerMove(event) {
    const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
    if (dist > 10) isPossibleClick = false;
    updateMousePosition(event);
    if (state === 'HOUSE') checkIntersectionExternal();
    else if (state === 'ROOM') checkIntersectionInternal();
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = event.clientX + 'px'; tooltip.style.top = event.clientY + 'px';
}
function onPointerUp(event) { if (isPossibleClick) performClick(event); isPossibleClick = false; }
function onWindowResize() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); }

function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    controls.update();
    animatedTrees.forEach(leaves => {
        const sway = Math.sin(t * leaves.userData.swaySpeed + leaves.userData.phase) * 0.03;
        leaves.rotation.z = sway;
        leaves.rotation.x = sway * 0.5;
    });
    if (interiorGroup.visible) {
        interiorGroup.children.forEach(child => {
            if (child.userData.type === 'arrow') {
                child.position.y = child.userData.baseY + Math.sin(t * 3) * 0.1;
                child.rotation.y += 0.02;
            }
        });
    }
    renderer.render(scene, camera);
    TWEEN.update(time);
}
window.onload = init;