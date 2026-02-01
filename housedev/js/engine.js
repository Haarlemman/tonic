
// --- ENGINE.JS ---
// Core Three.js setup and Global State

console.log("--- ENGINE.JS LOADED ---");

// GLOBAL VARIABLES
let scene, camera, renderer, controls;
let textureLoader;
let worldGroup, interiorGroup;
let raycaster, mouse;
let animationId;

// State
let state = 'HOUSE';
let currentRoom = null;
let isMusicPlaying = false;
let openingAnimationDone = false;
let introFinished = false;

// Lights
let dirLight, rimLight, ambientLight, hemiLight;

// Global Arrays/Objects
const interiorClickables = [];
window.interiorClickables = interiorClickables;
window.worldClickables = [];

// Audio Context
let audioContext, audioAnalyser, audioDataArray;

// Media Manager
class GlobalMediaManager {
    constructor() {
        this.audio = document.getElementById('room-audio');
        this.video = document.getElementById('generic-video');
        console.log("GlobalMediaManager Initialized");
    }

    playAudio(src, options = {}) {
        if (!this.audio) return;
        this.audio.src = src;
        if (options.volume !== undefined) this.audio.volume = options.volume;
        if (options.loop !== undefined) this.audio.loop = options.loop;
        return this.audio.play();
    }

    pauseAudio() {
        if (this.audio) this.audio.pause();
    }

    playVideo(src, options = {}) {
        if (!this.video) return;
        this.video.src = src;
        if (options.volume !== undefined) this.video.volume = options.volume;
        if (options.loop !== undefined) this.video.loop = options.loop;
        if (options.muted !== undefined) this.video.muted = options.muted;
        return this.video.play();
    }

    pauseVideo() {
        if (this.video) this.video.pause();
    }
}

window.mediaManager = new GlobalMediaManager();
window.audioPlayer = window.mediaManager.audio;
window.videoElement = window.mediaManager.video;

// GLOBAL INIT
function initEngine() {
    scene = new THREE.Scene();
    // V-REFINE: Clarity Boost
    scene.fog = new THREE.Fog(0x2d1b4e, 30, 600);
    scene.background = new THREE.Color(0x2d1b4e);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-2.8, 51.9, 175.9);
    camera.lookAt(-1.94, -20.5, -0.94);
    window.camera = camera;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);
    else document.body.appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    // Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    hemiLight = new THREE.HemisphereLight(0xffffff, 0x442288, 0.45);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(0xfffaed, 1.1);
    dirLight.position.set(50, 80, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50; dirLight.shadow.camera.right = 50; dirLight.shadow.camera.top = 50; dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    rimLight = new THREE.PointLight(0x88ccff, 0.4);
    rimLight.position.set(-20, 20, -20);
    scene.add(rimLight);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.target.set(-1.94, -20.5, -0.94);

    // Groups
    worldGroup = new THREE.Group();
    scene.add(worldGroup);
    interiorGroup = new THREE.Group();
    scene.add(interiorGroup);
    interiorGroup.visible = false;

    // Helpers
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Events
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    document.addEventListener('click', handleGlobalClick);

    // Start Loop
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (controls && controls.enabled) controls.update();

    // TWEEN
    if (typeof TWEEN !== 'undefined') TWEEN.update();

    // Determine Loop
    const deltaTime = 0.016; // Approx 60fps
    const time = Date.now() * 0.001;

    // Render
    renderer.render(scene, camera);
}

// Interaction Handlers (Stubs - to be filled or imported)
let pointerDownX = 0, pointerDownY = 0;
function onPointerDown(e) {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
}
function onPointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}
function onPointerUp(e) {
    const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    if (dist < 5) {
        // Click
        processClick(mouse);
    }
}

function processClick(mousePos) {
    raycaster.setFromCamera(mousePos, camera);

    if (state === 'HOUSE') {
        const intersects = raycaster.intersectObjects(window.worldClickables || worldGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            // Traverse up to find clickable userData
            while (target && (!target.userData || !target.userData.onClick) && target.parent) {
                target = target.parent;
            }
            if (target && target.userData && target.userData.onClick) {
                target.userData.onClick();
            }
        }
    } else if (state === 'ROOM') {
        const intersects = raycaster.intersectObjects(window.interiorClickables || interiorGroup.children, true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            // Traverse
            while (target && (!target.userData || !target.userData.onClick) && target.parent) {
                target = target.parent;
            }
            if (target && target.userData && target.userData.onClick) {
                target.userData.onClick();
            }
        }
    }
}

function handleGlobalClick(e) {
    // Pixel Band Exit
    if (e.target && e.target.closest('#pixel-band')) {
        if (typeof exitExperience === 'function') exitExperience();
    }
}

// Global Exports
window.initEngine = initEngine;
window.animate = animate;
