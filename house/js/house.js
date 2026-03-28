
class MMAnimation {
    constructor(width, height) {
        this.width = width || 512;
        this.height = height || 512;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d', { alpha: true });

        this.cx = this.width / 2;
        this.cy = this.height / 2;

        this.scrollPos = 0;
        this.targetScroll = 0;
        this.time = 0;

        this.universeStarted = false;
        this.lastInteraction = Date.now();
        this.isAutoPlaying = true;

        // CONFIG
        this.UNIVERSE_CONFIG = {
            background: 'transparent',
            textGlow: '#00FFFF',

            palette: {
                stars: '#eeeeff',
                singularity: '#ffee99',
                bangLines: '#eeddaa',
                quantum: '#0000ff',
                atomOrbits: '#990000',
                electrons: '#00FFFF',
                dna: '#ffeeaa',
                neural: '#6699FF',
                fibonacci: '#ffee00',
                geometry: '#FF9900',
                tesseract: '#00CCFF',
                solar: '#FF5555',
                web: '#eedd00',
                horizon: '#ff0000'
            },
            physics: {
                baseSpeed: 15,
                brakeStart: 11500,
                idleDelay: 3000
            }
        };

        this.FL = 500;
        this.WORLD_END = 15500;
        this.objects = [];
        this.stars = [];

        this.initWorld();

        this.launchUniverse();
    }

    getCanvas() {
        return this.canvas;
    }

    initWorld() {
        this.objects = [];
        this.stars = [];
        // Stars
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * 5000,
                y: (Math.random() - 0.5) * 5000,
                z: Math.random() * 2000,
                zOffset: Math.random() * this.WORLD_END
            });
        }
        // Objects
        this.objects.push({ type: 'singularity', z: 600, x: 0, y: 0 });
        for (let i = 0; i < 60; i++) {
            this.objects.push({
                type: 'bang', z: 1200,
                x: 0, y: 0, angle: Math.random() * Math.PI * 2,
                speed: 2 + Math.random() * 8, len: 50 + Math.random() * 200
            });
        }
        for (let i = 0; i < 80; i++) {
            this.objects.push({
                type: 'quantum', z: 2400 + (Math.random() - 0.5) * 500,
                x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400,
                phase: Math.random() * Math.PI * 2
            });
        }
        this.objects.push({ type: 'atom', z: 3400, x: 0, y: 0, r: 180 });
        for (let i = 0; i < 60; i++) {
            this.objects.push({
                type: 'dna', z: 4400 + (i * 12),
                x: 0, y: 0, index: i, width: 100
            });
        }
        for (let i = 0; i < 15; i++) {
            this.objects.push({
                type: 'node', z: 5400 + (Math.random() - 0.5) * 600,
                x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600,
                size: 2 + Math.random() * 4
            });
        }
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < 150; i++) {
            let r = Math.sqrt(i) * 35;
            let theta = i * goldenAngle;
            this.objects.push({
                type: 'fib', z: 6400, x: r * Math.cos(theta), y: r * Math.sin(theta), idx: i
            });
        }
        this.objects.push({ type: 'geo', z: 7400, x: 0, y: 0, r: 250 });
        this.objects.push({ type: 'tesseract', z: 8400, x: 0, y: 0, s: 300 });
        this.objects.push({ type: 'solar', z: 9400, x: 0, y: 0, r: 400 });
        for (let i = 0; i < 25; i++) {
            this.objects.push({
                type: 'web', z: 10800 + (Math.random() - 0.5) * 1000,
                x: (Math.random() - 0.5) * 1000, y: (Math.random() - 0.5) * 1000,
                size: 10 + Math.random() * 20
            });
        }
        this.objects.push({ type: 'horizon', z: 15500, x: 0, y: 0, r: 150 });
    }

    launchUniverse() {
        this.universeStarted = true;
        this.isAutoPlaying = true;
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    update() {
        if (!this.universeStarted) return;

        // Auto Scroll Logic
        let speed = this.UNIVERSE_CONFIG.physics.baseSpeed;
        if (this.targetScroll > this.UNIVERSE_CONFIG.physics.brakeStart) {
            let endDist = this.WORLD_END - this.UNIVERSE_CONFIG.physics.brakeStart;
            let endProgress = (this.targetScroll - this.UNIVERSE_CONFIG.physics.brakeStart) / endDist;
            if (endProgress > 1) endProgress = 1;
            speed = this.UNIVERSE_CONFIG.physics.baseSpeed - (endProgress * (this.UNIVERSE_CONFIG.physics.baseSpeed - 2));
        }
        this.targetScroll += speed;
        if (this.targetScroll >= this.WORLD_END) {
            this.targetScroll = 0;
            this.scrollPos = 0;
        }

        this.scrollPos = this.lerp(this.scrollPos, this.targetScroll, 0.1);
        this.time += 0.02;

        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        const cx = this.cx;
        const cy = this.cy;
        const scrollPos = this.scrollPos;
        const time = this.time;
        const FL = this.FL;
        const WORLD_END = this.WORLD_END;
        const UNIVERSE_CONFIG = this.UNIVERSE_CONFIG;

        // CLEAR with Transparent
        ctx.clearRect(0, 0, width, height);

        let globalOpacity = 1;
        if (scrollPos > 14500) globalOpacity = Math.max(0, (15500 - scrollPos) / 1000);
        if (globalOpacity <= 0.01) return;

        // DRAW STARS
        if (scrollPos > 1200) this.drawStars(globalOpacity);

        this.objects.forEach(obj => {
            let relZ = obj.z - scrollPos;
            if (scrollPos < 800) { if (obj.type !== 'singularity' && obj.type !== 'bang') return; }
            if (obj.type === 'horizon' && scrollPos > 15300) return;
            if (relZ < 10 || relZ > 3500) return;

            let scale = FL / relZ;
            if (scale > 20) return;
            let x2d = cx + obj.x * scale;
            let y2d = cy + obj.y * scale;
            let alpha = Math.min(1, (3500 - relZ) / 1000) * globalOpacity;

            // Suck Logic (End tunnel)
            if (scrollPos > 11000 && obj.type !== 'horizon') {
                let suck = Math.min(1.0, (scrollPos - 11000) / 4500);
                x2d = this.lerp(x2d, cx, suck);
                y2d = this.lerp(y2d, cy, suck);
                let ang = Math.atan2(y2d - cy, x2d - cx) + suck * 3;
                let dist = Math.sqrt((x2d - cx) ** 2 + (y2d - cy) ** 2);
                x2d = cx + Math.cos(ang) * dist;
                y2d = cy + Math.sin(ang) * dist;
            }

            ctx.globalAlpha = alpha;

            if (obj.type === 'singularity') {
                ctx.fillStyle = UNIVERSE_CONFIG.palette.singularity;
                let pulse = 2 * scale;
                if (scrollPos > 100) pulse += Math.sin(time * 20) * 2;
                ctx.beginPath(); ctx.arc(x2d, y2d, pulse, 0, Math.PI * 2); ctx.fill();
            }
            else if (obj.type === 'bang') {
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.bangLines;
                ctx.lineWidth = 3.0; // Bolder
                let progress = (scrollPos - 600) / 800;
                if (progress < 0) progress = 0;
                let burst = Math.pow(progress, 2) * 2000;
                if (burst > 0) {
                    let ex = x2d + Math.cos(obj.angle) * burst * scale;
                    let ey = y2d + Math.sin(obj.angle) * burst * scale;
                    let tx = x2d + Math.cos(obj.angle) * (burst - obj.len) * scale;
                    let ty = y2d + Math.sin(obj.angle) * (burst - obj.len) * scale;
                    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex, ey); ctx.stroke();
                }
            }
            else if (obj.type === 'quantum') {
                ctx.fillStyle = UNIVERSE_CONFIG.palette.quantum;
                let jx = x2d + (Math.sin(time * 5 + obj.phase) * 10 * scale);
                let jy = y2d + (Math.cos(time * 5 + obj.phase) * 10 * scale);
                ctx.beginPath(); ctx.arc(jx, jy, 1.5 * scale, 0, Math.PI * 2); ctx.fill();
            }
            else if (obj.type === 'atom') {
                let r = obj.r * scale;
                let minorR = r * 0.5;
                for (let i = 0; i < 3; i++) {
                    ctx.strokeStyle = UNIVERSE_CONFIG.palette.atomOrbits;
                    ctx.lineWidth = 2.0;
                    ctx.beginPath();
                    let angleTilt = (Math.PI / 3) * i;
                    ctx.ellipse(x2d, y2d, r, minorR, angleTilt + time * 0.5, 0, Math.PI * 2);
                    ctx.stroke();
                    if (i < 2) {
                        let speed = (i === 0) ? time * 3 : time * 4 + 2;
                        let ex_local = r * Math.cos(speed);
                        let ey_local = minorR * Math.sin(speed);
                        let rotation = angleTilt + time * 0.5;
                        let ex_rot = ex_local * Math.cos(rotation) - ey_local * Math.sin(rotation);
                        let ey_rot = ex_local * Math.sin(rotation) + ey_local * Math.cos(rotation);
                        let electronX = x2d + ex_rot;
                        let electronY = y2d + ey_rot;
                        ctx.fillStyle = UNIVERSE_CONFIG.palette.electrons;
                        ctx.beginPath(); ctx.arc(electronX, electronY, 4 * scale, 0, Math.PI * 2); ctx.fill();
                    }
                }
                ctx.fillStyle = UNIVERSE_CONFIG.palette.atomOrbits;
                ctx.beginPath(); ctx.arc(x2d, y2d, 5 * scale, 0, Math.PI * 2); ctx.fill();
            }
            else if (obj.type === 'dna') {
                ctx.fillStyle = UNIVERSE_CONFIG.palette.dna;
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.dna;
                ctx.lineWidth = 3.0;
                let w = obj.width * scale;
                let twistSpeed = time * 2;
                let strandTwist = obj.index * 0.3;
                let tumbleAngle = time * 0.5;
                let phase = strandTwist + twistSpeed;
                let localX = Math.sin(phase) * w;
                let rx1 = localX * Math.cos(tumbleAngle);
                let ry1 = localX * Math.sin(tumbleAngle);
                let rx2 = -localX * Math.cos(tumbleAngle);
                let ry2 = -localX * Math.sin(tumbleAngle);
                let px1 = x2d + rx1;
                let py1 = y2d + ry1;
                let px2 = x2d + rx2;
                let py2 = y2d + ry2;
                ctx.fillRect(px1 - scale, py1 - scale, 2 * scale, 2 * scale);
                ctx.fillRect(px2 - scale, py2 - scale, 2 * scale, 2 * scale);
                if (obj.index % 2 === 0) {
                    ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.stroke();
                }
            }
            else if (obj.type === 'node') {
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.neural;
                ctx.fillStyle = UNIVERSE_CONFIG.palette.neural;
                ctx.lineWidth = 3.0;
                for (let k = 0; k < 3; k++) {
                    let a = (Math.PI * 2 / 3) * k + time * 0.2;
                    let len = 30 * scale;
                    ctx.beginPath(); ctx.moveTo(x2d, y2d); ctx.lineTo(x2d + Math.cos(a) * len, y2d + Math.sin(a) * len); ctx.stroke();
                }
                ctx.beginPath(); ctx.arc(x2d, y2d, 4 * scale, 0, Math.PI * 2); ctx.fill();
            }
            else if (obj.type === 'fib') {
                ctx.fillStyle = UNIVERSE_CONFIG.palette.fibonacci;
                let r = Math.sqrt(obj.x * obj.x + obj.y * obj.y);
                let baseAng = Math.atan2(obj.y, obj.x);
                let finalAng = baseAng + time * 0.5;
                let rotX = r * Math.cos(finalAng);
                let rotY = r * Math.sin(finalAng);
                let finalX = cx + rotX * scale;
                let finalY = cy + rotY * scale;
                let dotSize = (1.5 + (obj.idx / 50)) * scale;
                ctx.beginPath(); ctx.arc(finalX, finalY, dotSize, 0, Math.PI * 2); ctx.fill();
            }
            else if (obj.type === 'geo') {
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.geometry;
                ctx.lineWidth = 3.0;
                let r = obj.r * scale;
                ctx.save();
                ctx.translate(x2d, y2d); ctx.rotate(time * 0.5);
                ctx.beginPath();
                ctx.moveTo(0, -r); ctx.lineTo(r * 0.866, r * 0.5); ctx.lineTo(-r * 0.866, r * 0.5);
                ctx.closePath(); ctx.stroke();
                ctx.rotate(time * 0.2);
                ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
                ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.stroke();
                ctx.restore();
            }
            else if (obj.type === 'tesseract') {
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.tesseract;
                ctx.lineWidth = 3.0;
                let s = obj.s * scale;
                ctx.save();
                ctx.translate(x2d, y2d);
                ctx.rotate(time);
                ctx.strokeRect(-s / 2, -s / 2, s, s);
                ctx.rotate(time);
                let is = s * 0.5;
                ctx.strokeRect(-is / 2, -is / 2, is, is);
                ctx.beginPath();
                ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(-is / 2, -is / 2);
                ctx.moveTo(s / 2, -s / 2); ctx.lineTo(is / 2, -is / 2);
                ctx.moveTo(s / 2, s / 2); ctx.lineTo(is / 2, is / 2);
                ctx.moveTo(-s / 2, s / 2); ctx.lineTo(-is / 2, is / 2);
                ctx.stroke();
                ctx.restore();
            }
            else if (obj.type === 'solar') {
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.solar;
                ctx.lineWidth = 3.0;
                let r = obj.r * scale;
                ctx.beginPath(); ctx.arc(x2d, y2d, 10 * scale, 0, Math.PI * 2); ctx.stroke();
                for (let i = 1; i < 5; i++) {
                    let or = (r / 5) * i;
                    ctx.beginPath(); ctx.ellipse(x2d, y2d, or, or * 0.4, time * 0.1, 0, Math.PI * 2); ctx.stroke();
                }
            }
            else if (obj.type === 'web') {
                ctx.fillStyle = UNIVERSE_CONFIG.palette.web;
                ctx.strokeStyle = UNIVERSE_CONFIG.palette.web;
                let r = obj.size * scale;
                ctx.beginPath(); ctx.arc(x2d, y2d, r, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(x2d, y2d); ctx.lineTo(cx, cy);
                ctx.globalAlpha = alpha * 0.2; ctx.stroke();
            }
            else if (obj.type === 'horizon') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath(); ctx.arc(x2d, y2d, obj.r * scale, 0, Math.PI * 2); ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                ctx.strokeStyle = UNIVERSE_CONFIG.palette.horizon;
                ctx.lineWidth = 4.0;
                let r = obj.r * scale;
                ctx.beginPath(); ctx.arc(x2d, y2d, r, 0, Math.PI * 2); ctx.stroke();
                ctx.save();
                ctx.translate(x2d, y2d);
                ctx.scale(1, 0.1);
                ctx.rotate(time * 0.2 + Math.sin(time) * 0.1);
                ctx.beginPath(); ctx.arc(0, 0, r * 2.0, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2); ctx.stroke();
                ctx.restore();
            }
        });

        ctx.globalAlpha = 1;
    }

    drawStars(opacity) {
        const ctx = this.ctx;
        const UNIVERSE_CONFIG = this.UNIVERSE_CONFIG;
        const scrollPos = this.scrollPos;
        const WORLD_END = this.WORLD_END;
        const FL = this.FL;
        const cx = this.cx;
        const cy = this.cy;

        ctx.fillStyle = UNIVERSE_CONFIG.palette.stars;
        ctx.strokeStyle = UNIVERSE_CONFIG.palette.stars;
        this.stars.forEach(s => {
            let relativeZ = (s.z + s.zOffset - scrollPos);
            while (relativeZ < 0) relativeZ += WORLD_END;
            while (relativeZ > 2000) relativeZ -= 2000;
            if (relativeZ < 10) return;
            let scale = FL / relativeZ;
            if (scale > 20) return;
            let x2d = cx + s.x * scale;
            let y2d = cy + s.y * scale;
            let size = (scale > 3) ? 3 : scale;

            if (scrollPos > 11000) {
                let suck = (scrollPos - 11000) / 4500;
                let dx = x2d - cx;
                let dy = y2d - cy;
                let factor = Math.max(0, 1 - suck * 0.8);
                let sx = cx + dx * factor;
                let sy = cy + dy * factor;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                let streakLen = suck * 0.3;
                ctx.lineTo(sx - dx * streakLen, sy - dy * streakLen);
                ctx.stroke();
            } else {
                ctx.globalAlpha = Math.min(1, relativeZ / 1500) * opacity;
                ctx.fillRect(x2d, y2d, size, size);
            }
        });
    }
}

let openingFog;
let openingAnimationDone = false;
let fireflies = [];
let mistLayer = null;
window.metropolisRobot = null; // Global Robot Reference
let lamppostLight = null;
let animatedShaderMaterials = [];
let animatedTrees = [];
let sharedGeos = null;
let skyscraperMaterialPool = [];
let windowFlickerMaterials = [];
// --- WAKE LOCK (Audit: Prevent Screen Sleep) ---
let wakeLock = null;
window.requestWakeLock = async () => {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            // console.log("Wake Lock is active.");
        }
    } catch (err) {
        // console.warn(`${err.name}, ${err.message}`);
    }
};
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await window.requestWakeLock();
    }
});


// --- 3D SETUP ---
let scene, camera, renderer, controls;
let loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    const bar = document.getElementById('progress-bar');
    const msg = document.getElementById('loading-msg');

    if (bar) bar.style.width = progress + '%';
    if (msg) {
        const fileName = url.split('/').pop().split('?')[0];
        msg.innerText = `${fileName}  [${Math.round(progress)}%]`;
    }
};
loadingManager.onLoad = function () {
    console.log("All assets loaded via LoadingManager.");
    if (window.hideLoader) window.hideLoader();
};
loadingManager.onError = function (url) {
    console.error("Error loading asset:", url);
    // Force-hide loader after a short delay so the experience can still start
    // (though some textures/audio might be missing)
    setTimeout(() => {
        if (window.hideLoader) window.hideLoader();
    }, 1000);
};
let textureLoader = new THREE.TextureLoader(loadingManager);
window.loadingManager = loadingManager;
window.textureLoader = textureLoader;
let worldGroup, interiorGroup, foregroundGroup;
// Debug helper for confirming runtime configuration and values
window.houseDebug = window.houseDebug || { version: 'FORCE_SYNC_V1944' };
let raycaster, mouse;
let animationId;
const clock = new THREE.Clock();
// HOUSE MUSIC STATE
let houseMusicTime = 0;
const HOUSE_TRACK = "/assets/audio/premonition.mp3";

// -- LIGHTS --
let dirLight, rimLight, ambientLight, hemiLight;

let noteTextSprite = null;
let infoTimeout = null;

let state = 'HOUSE';
let currentRoom = null;
window.currentTrackIndex = 0;
window.masterVideoIndex = 0;
let isTVVideoMode = false;
let isTransitioning = false;
let streetLights = [];
let hoveredObject = null;
window.interiorClickables = []; // Global Access for Room Scripts

let tvMesh = null, currentSlideIndex = 0;
let phoneScreenMesh = null;
window.isMusicPlaying = false;

let atomGroup = null;
let basementNodes = [];
let basementLines = null;
var audioContext, audioAnalyser, audioDataArray; // Standardized global sharing
let pointerDownX = 0, pointerDownY = 0, isPossibleClick = false;
let prevCameraPos = null;
let videoElement, videoTexture; // Video playback for basement



// --- House Environment Defaults ---
const HOUSE_DEFAULTS = {
    ambientIntensity: 0.25,
    hemiIntensity: 0.25,
    dirIntensity: 0.4,
    rimIntensity: 0.4,
    fogColor: 0x3a2560,
    bgColor: 0x25232d,
    fogNear: 80,
    fogFar: 700
};

// Wrapped Init
scene = new THREE.Scene();
worldGroup = new THREE.Group();
interiorGroup = new THREE.Group();
foregroundGroup = new THREE.Group();
scene.add(worldGroup);
scene.add(interiorGroup);
scene.add(foregroundGroup);
// Clarity Boost (V-SYNC to Housedev Preferred)
scene.fog = new THREE.Fog(HOUSE_DEFAULTS.fogColor, HOUSE_DEFAULTS.fogNear, HOUSE_DEFAULTS.fogFar);
openingFog = scene.fog;
scene.background = new THREE.Color(HOUSE_DEFAULTS.bgColor);

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000); // FAR PLANE 2000 for Space Room
camera.position.set(-2.8, 51.9, 175.9); // Match Flight Start to prevent Jump
camera.lookAt(-1.94, -20.5, -0.94);
window.camera = camera;
scene.add(camera);

// PERF: disable antialiasing on mobile to reduce GPU fill-rate pressure (prevents "Aw, Snap!" OOM crashes)
const _isMobileDevice = window.matchMedia('(max-width: 768px)').matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
renderer = new THREE.WebGLRenderer({ antialias: !_isMobileDevice, alpha: true });
renderer.domElement.style.filter = 'blur(0px)';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // V-FIX: Soft Shadows
// V-REFINE: Simplified Rendering (No Tone Mapping per user request)
// PERF: cap at 1.5 on mobile — cuts GPU fill rate ~44% vs 2.0 with negligible visual difference
renderer.setPixelRatio(Math.min(window.devicePixelRatio, _isMobileDevice ? 1.5 : 2));

document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- WebGL context loss / restore recovery ---
renderer.domElement.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    console.error('⚠️ WebGL context lost — showing recovery UI');
    // Pause the render loop
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    // Show recovery overlay
    let recoveryEl = document.getElementById('webgl-recovery');
    if (!recoveryEl) {
        recoveryEl = document.createElement('div');
        recoveryEl.id = 'webgl-recovery';
        recoveryEl.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:10000',
            'background:rgba(0,0,0,0.95)',
            'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
            'gap:20px', 'color:#fff', 'font-family:"Share Tech Mono",monospace'
        ].join(';');
        recoveryEl.innerHTML = `
            <div style="font-size:11px; color:#60a5fa; letter-spacing:0.2em; text-transform:uppercase;">Graphics Error</div>
            <p style="font-size:13px; color:#aaa; max-width:320px; text-align:center; line-height:1.7;">
                The 3D scene ran out of GPU memory.<br>This can happen on mobile devices.
            </p>
            <button id="webgl-retry-btn" style="
                padding:12px 32px; background:transparent;
                border:1px solid #60a5fa; color:#60a5fa;
                font-family:'Share Tech Mono',monospace; font-size:12px;
                letter-spacing:0.15em; cursor:pointer;
                text-transform:uppercase; transition:all 0.3s ease;
            ">RETRY</button>
        `;
        document.body.appendChild(recoveryEl);
        document.getElementById('webgl-retry-btn').onclick = function () {
            window.location.reload();
        };
    }
    recoveryEl.style.display = 'flex';
}, false);

renderer.domElement.addEventListener('webglcontextrestored', function () {
    console.log('✅ WebGL context restored — resuming render loop');
    const recoveryEl = document.getElementById('webgl-recovery');
    if (recoveryEl) recoveryEl.style.display = 'none';
    // Restart the render loop
    if (!animationId) animate();
}, false);


// LIGHTS (V-SYNC to Housedev Preferred)
ambientLight = new THREE.AmbientLight(0xfff0ff, HOUSE_DEFAULTS.ambientIntensity);
window.ambientLight = ambientLight;
scene.add(ambientLight);

hemiLight = new THREE.HemisphereLight(0x88aaff, 0x111111, HOUSE_DEFAULTS.hemiIntensity);
window.hemiLight = hemiLight;
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

dirLight = new THREE.DirectionalLight(0xfffaed, HOUSE_DEFAULTS.dirIntensity);
window.dirLight = dirLight;
dirLight.position.set(-22.5, 60, 30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = _isMobileDevice ? 512 : 1024;
dirLight.shadow.mapSize.height = _isMobileDevice ? 512 : 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -50; dirLight.shadow.camera.right = 50; dirLight.shadow.camera.top = 50; dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

rimLight = new THREE.PointLight(0x88ccff, HOUSE_DEFAULTS.rimIntensity);
window.rimLight = rimLight;
rimLight.position.set(-20, 20, -20);
scene.add(rimLight);


controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.panSpeed = 1.0;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(-1.94, -20.5, -0.94);

worldGroup = new THREE.Group();
window.worldGroup = worldGroup;
scene.add(worldGroup);

interiorGroup = new THREE.Group();
window.interiorGroup = interiorGroup;
scene.add(interiorGroup);
interiorGroup.visible = false;

// FOREGROUND GROUP: Objects that should always render above interiors/world (e.g., Tintin rocket)
foregroundGroup = new THREE.Group();
window.foregroundGroup = foregroundGroup;
foregroundGroup.renderOrder = 99999;
scene.add(foregroundGroup);



class GlobalMediaManager {
    constructor() {
        this.audio = document.getElementById('room-audio');
        this.video = document.getElementById('generic-video');

        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => {
                if (window.updateLyricsUI) window.updateLyricsUI();
            });
        }
        if (this.video) {
            this.video.addEventListener('ended', () => {
                if (window.nextVideo) window.nextVideo();
            });
        }
    }

    playAudio(src, options = {}) {
        if (!this.audio) return;
        this.audio.src = src;
        this.audio.volume = options.volume || 0.5;
        this.audio.play().catch(() => { });
    }

    pauseAudio() {
        if (this.audio) this.audio.pause();
    }

    playVideo(src, options = {}) {
        if (!this.video) return;
        this.video.src = src;
        this.video.muted = options.muted || false;
        this.video.loop = options.loop || false;
        this.video.play().catch(() => { });
    }

    pauseVideo() {
        if (this.video) this.video.pause();
    }
}

window.mediaManager = new GlobalMediaManager();
videoElement = window.mediaManager.video;
audioPlayer = window.mediaManager.audio;
window.audioPlayer = audioPlayer;
window.videoElement = videoElement;

// V-LYRICS: Sync lyrics with audio
// V-LYRICS: Sync lyrics with audio
window.updateLyricsUI = function () {
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsText = document.getElementById('lyrics-text');
    if (!lyricsContainer || !lyricsText || !window.audioPlayer) return;

    // Use window.currentRoom to find the correct playlist
    const roomKey = window.currentRoom;
    if (!roomKey) {
        lyricsContainer.style.opacity = '0';
        return;
    }

    const rData = window.roomContent ? window.roomContent[roomKey] : null;
    if (!rData || !rData.playlist) {
        lyricsContainer.style.opacity = '0';
        return;
    }

    const track = rData.playlist[window.currentTrackIndex];
    if (!track || !track.lyrics) {
        lyricsContainer.style.opacity = '0';
        return;
    }

    const currentTime = window.audioPlayer.currentTime;
    let currentLyric = "";

    // Find the latest lyric that is <= current audio time
    for (let i = track.lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= track.lyrics[i].time) {
            // V-FIX: Support Dutch lyrics — read from window.currentLanguage (the live variable set by SET_LANGUAGE)
            currentLyric = (window.currentLanguage === 'nl' && track.lyrics[i].text_nl)
                ? track.lyrics[i].text_nl
                : track.lyrics[i].text;
            break;
        }
    }

    if (currentLyric && currentLyric.trim() !== "") {
        if (lyricsText.innerText !== currentLyric) {
            lyricsText.innerText = currentLyric;
            // console.log(`🎵 Lyrics [${roomKey}]:`, currentLyric);
        }
        lyricsContainer.style.opacity = '1';
    } else {
        lyricsContainer.style.opacity = '0';
    }
};

window.musicSwitchMesh = null;
window.isZoomingToRoom = false;

// buildEnvironment called in buildWorld


raycaster = new THREE.Raycaster();

mouse = new THREE.Vector2();

// Interaction Safety Guard (Audit Item 1)
if (!window.interactionsSet) {
    window.addEventListener('resize', onWindowResize);
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    // Centralised Document Click Handler (Audit Item 5)
    document.addEventListener('click', handleGlobalClick);

    window.interactionsSet = true;
}

// ---- WASD Keyboard Movement ----
window._wasdKeys = { w: false, a: false, s: false, d: false };
window._wasdEnabled = false; // Enabled once inside a room

const isUserTyping = () => {
    const el = document.activeElement;
    const tag = el ? el.tagName.toUpperCase() : '';
    const typing = (tag === 'INPUT' || tag === 'TEXTAREA' || (el && el.isContentEditable));

    // Also block if narrative or question overlays are visible in the house
    const qOverlay = document.getElementById('question-overlay');
    const nOverlay = document.getElementById('narrative-overlay');
    const overlayVisible = (qOverlay && qOverlay.style.display !== 'none' && qOverlay.style.display !== '') ||
        (nOverlay && nOverlay.style.display !== 'none' && nOverlay.style.display !== '');

    return typing || overlayVisible;
};

document.addEventListener('keydown', (e) => {
    // V-FIX: Prevent movement/scrolling if typing in a popup or input field
    if (isUserTyping()) return;

    if (['KeyW', 'ArrowUp', 'KeyA', 'ArrowLeft', 'KeyS', 'ArrowDown', 'KeyD', 'ArrowRight'].includes(e.code)) {
        // e.preventDefault(); // Optional: used to stop scroll but can be annoying
    }

    if (!window._wasdKeys) window._wasdKeys = { w: false, a: false, s: false, d: false };

    switch (e.code) {
        case 'KeyW': case 'ArrowUp': window._wasdKeys.w = true; break;
        case 'KeyA': case 'ArrowLeft': window._wasdKeys.a = true; break;
        case 'KeyS': case 'ArrowDown': window._wasdKeys.s = true; break;
        case 'KeyD': case 'ArrowRight': window._wasdKeys.d = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    // V-FIX: ALWAYS clear key state on keyup to prevent "stuck" keys if focus shifts
    if (!window._wasdKeys) return;
    switch (e.code) {
        case 'KeyW': case 'ArrowUp': window._wasdKeys.w = false; break;
        case 'KeyA': case 'ArrowLeft': window._wasdKeys.a = false; break;
        case 'KeyS': case 'ArrowDown': window._wasdKeys.s = false; break;
        case 'KeyD': case 'ArrowRight': window._wasdKeys.d = false; break;
    }
});


window.getMusicSwitch = () => musicSwitchMesh;

function handleGlobalClick(event) {
    if (!event) return; // Guard against undefined event
    // 0. Ensure Audio Context is Active
    if (window.audioContext && window.audioContext.state === 'suspended') {
        window.audioContext.resume().then(() => {
            // console.log('🔊 AudioContext resumed via global click');
        });
    }

    // V-FIX: Recover from autoplay blocks
    if (window.isMusicPlaying && window.audioPlayer && window.audioPlayer.paused) {
        window.audioPlayer.play().catch(() => { });
    }

    // 1. Pixel Band Exit Logic
    if (event.target && event.target.closest('#pixel-band')) {
        if (document.fullscreenElement || document.getElementById('start-btn').style.display === 'none') {
            exitExperience();
        }
    }
}

// Robust Loader Logic (Wait for Build)
window.hideLoader = function () {
    if (window.hasCriticalError) {
        console.warn("Loader hide aborted due to critical error: window.hasCriticalError is true");
        return;
    }
    if (window.isLoaderHiding) return;
    window.isLoaderHiding = true;

    const loader = document.getElementById('loading');

    const startTime = window.loaderStartTime || Date.now();
    const minTime = 3000; // Minimum 3s to let the animation be seen

    const finishHide = () => {
        if (!loader) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minTime - elapsed);

        setTimeout(() => {
            // Visualize completion to parent
            if (window.parent) window.parent.postMessage({ type: 'EXPERIENCE_LOADED' }, '*');

            loader.style.transition = 'opacity 1.5s ease';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1500);
        }, remaining);
    };

    if (loader) {
        // If there's an SVG path animation, prefer a clone-based restart to avoid jumping between still frames
        const path = loader.querySelector('.house-path');
        if (path) {
            try {
                const animations = (path.getAnimations) ? path.getAnimations() : [];

                // If a WAAPI animation is running and not finished, wait for it
                if (animations && animations.length && animations[0].playState !== 'finished') {
                    let timedOut = false;
                    const to = setTimeout(() => { timedOut = true; finishHide(); }, 4000);
                    animations[0].finished.then(() => { if (!timedOut) { clearTimeout(to); finishHide(); } }).catch(() => { if (!timedOut) { clearTimeout(to); finishHide(); } });
                } else {
                    // Otherwise, replace the path with a fresh clone so the CSS animation starts from the initial frame
                    const clone = path.cloneNode(true);
                    // Clear any inline animation overrides
                    clone.style.animation = '';
                    path.parentNode.replaceChild(clone, path);

                    let handled = false;
                    const onEnd = () => { if (handled) return; handled = true; clone.removeEventListener('animationend', onEnd); finishHide(); };
                    clone.addEventListener('animationend', onEnd);

                    // Safety timeout
                    setTimeout(() => { if (!handled) { handled = true; clone.removeEventListener('animationend', onEnd); finishHide(); } }, 4000);
                }
            } catch (e) {
                // If anything goes wrong, do a short fade to avoid locking UI
                setTimeout(finishHide, 500);
            }
        } else {
            // No path found - short delay to allow visual transition
            setTimeout(finishHide, 500);
        }
    } else {
        window.introFinished = true;
    }

    window.introFinished = true;
};

const header = document.getElementById('main-header') || (window.parent && window.parent.document.getElementById('landing-header'));
if (header) {
    header.style.transform = 'scale(1)';
    const h1 = header.querySelector('h1');
    let naturalWidth = header.dataset.naturalWidth ? parseFloat(header.dataset.naturalWidth) : 300;
    if (h1 && !header.dataset.naturalWidth) {
        const range = document.createRange();
        range.selectNodeContents(h1);
        const rect = range.getBoundingClientRect();
        naturalWidth = rect.width || 300;
        header.dataset.naturalWidth = naturalWidth;
    }

    // V-FIX 2026: Responsive scaling for the header
    const isMobile = window.innerWidth < 768;
    const startPct = isMobile ? 0.85 : 0.7;
    const startScale = Math.min(1, (window.innerWidth * startPct) / naturalWidth);
    header.style.transform = `scale(${startScale})`;
    header.style.opacity = '1';
}

const minBtn = document.getElementById('min-btn');
if (minBtn) minBtn.addEventListener('click', toggleInfo);
const infoHeader = document.querySelector('#room-info .room-header-flex');
if (infoHeader) infoHeader.addEventListener('click', toggleInfo);

// Header Content block removed (non-existent element)

animate();

// PERF: Pause rendering when tab is hidden — saves significant battery/CPU on mobile
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        renderer.setAnimationLoop(null); // pause
    } else {
        requestAnimationFrame(animate);   // resume
    }
});

window.exitExperience = function () {
    // 1. Exit Fullscreen (Signal Parent too for iOS fallback)
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

    if (window.parent) window.parent.postMessage({ type: 'EXIT_FULLSCREEN' }, '*');

    // 2. Show Header
    const headerEl = document.getElementById('main-header') || (window.parent && window.parent.document.getElementById('landing-header'));
    if (headerEl) {
        headerEl.style.display = 'flex';
        headerEl.style.opacity = '1';
        headerEl.classList.remove('header-move-up');
        void headerEl.offsetWidth;
    }

    // 3. Hide Exit Button
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.add('hidden');

    // 4. Show Start Button again (Signal parent)
    if (window.parent) window.parent.postMessage({ type: 'SHOW_START_BTN' }, '*');
};

// --- AUDIO ANALYSER SETUP ---
function initAudioAnalyser() {
    // Skip Web Audio analyser when running from file:// protocol.
    // crossOrigin + createMediaElementSource requires http/https — on file://
    // the browser blocks the audio request with a CORS error, silencing playback.
    if (window.location.protocol === 'file:') return;

    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            window.audioContext = audioContext;
        } catch (e) {
            console.warn('AudioContext creation failed:', e);
            return;
        }
    }

    // Guard: createMediaElementSource can only be called ONCE per element.
    // Calling it again throws InvalidStateError which silently kills audio output.
    if (audioContext && !window._audioSourceNodeCreated) {
        try {
            window._audioSourceNodeCreated = true;
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 256;
            const source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(audioAnalyser);
            audioAnalyser.connect(audioContext.destination);
            audioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
            window.audioAnalyser = audioAnalyser;
            window.audioDataArray = audioDataArray;
        } catch (e) {
            console.warn('initAudioAnalyser error (analyser disabled):', e);
            window._audioSourceNodeCreated = false;
        }
    } else if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => { });
    }
}

// --- EXTERIOR BUILDER ---
function createNoiseTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, size, size);

    const idata = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < idata.data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 30;
        idata.data[i] = Math.min(255, Math.max(0, 128 + grain));
        idata.data[i + 1] = Math.min(255, Math.max(0, 128 + grain));
        idata.data[i + 2] = Math.min(255, Math.max(0, 128 + grain));
        idata.data[i + 3] = 255;
    }

    ctx.putImageData(idata, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createBrickTexture(type = 'amsterdam') {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const isAmsterdam = (type === 'amsterdam');
    const baseColor = isAmsterdam ? '#8b4513' : '#f0e68c'; // Deep brick vs Dudok cream
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16, cols = 8;
    const h = 512 / rows, w = 512 / cols;

    for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (w / 2);
        for (let c = -1; c < cols + 1; c++) {
            const vari = Math.random() * 30 - 15;
            if (isAmsterdam) {
                const rVal = 139 + vari;
                const gVal = 69 + vari * 0.5;
                const bVal = 19 + vari * 0.2;
                ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
            } else {
                const rVal = 240 + vari;
                const gVal = 230 + vari;
                const bVal = 140 + vari;
                ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
            }
            ctx.fillRect(c * w + offset + 2, r * h + 2, w - 4, h - 4);

            // Subtle mortar
            ctx.strokeStyle = isAmsterdam ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(c * w + offset + 2, r * h + 2, w - 4, h - 4);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 8);
    return tex;
}

function createHouseNumberTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128; // Higher res
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128); // Transparent background
    ctx.fillStyle = '#ffffff'; // White text
    ctx.font = 'bold 80px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('42', 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

function createRoomBlock(name, x, y, z, w, h, d, color, winConfigs = null) {
    const geo = new THREE.BoxGeometry(w, h, d);

    // Gritty Texture
    const noiseTex = createNoiseTexture();
    noiseTex.repeat.set(w / 2, h / 2);

    // Lighten the room colors significantly
    const roomColor = new THREE.Color(color).addScalar(0.3);

    const mat = new THREE.MeshStandardMaterial({
        color: roomColor,
        roughness: 0.9,
        bumpMap: noiseTex,
        bumpScale: 0.05, // Subtle bump
        map: noiseTex
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
        name: name,
        type: 'room',
        onClick: () => window.enterRoom(name)
    };

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
            // Ensure Frame is Clickable (Propagate Name and Handler)
            frame.userData = {
                name: name,
                type: 'room',
                onClick: () => window.enterRoom(name)
            };

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
                    emissiveIntensity: 0.4,
                    roughness: 0.2
                })
            );
            glass.position.z = 0.06;

            // -- WINDOW ANIMATION SETUP --
            glass.material.userData = {
                baseEmissive: 0.4,
                speed: 1.5 + Math.random() * 2.0,
                phase: Math.random() * Math.PI * 20,
                hueSpeed: 0.05 + Math.random() * 0.05,
                hueOffset: Math.random(),
            };
            windowFlickerMaterials.push(glass.material);

            // Ensure Glass is Clickable
            glass.userData = {
                name: name,
                type: 'room',
                onClick: () => window.enterRoom(name)
            };

            frame.add(glass);
            mesh.add(frame);
        });
    }
    worldGroup.add(mesh);
}



// Restored buildWorld
function buildWorld() {
    // V-PERF: Shared Geometry Pool
    if (!sharedGeos) {
        sharedGeos = {
            skyscraper: new THREE.BoxGeometry(6.0, 1.0, 6.0),
            treeTrunk: new THREE.CylinderGeometry(0.15, 0.25, 1.5, 12),
            treeLeaves: new THREE.ConeGeometry(1.1, 3.0, 16),
            bushSphere: new THREE.SphereGeometry(0.5, 16, 12),
            bushShadow: new THREE.PlaneGeometry(1.5, 1.5).rotateX(-Math.PI / 2),
            treeShadow: new THREE.PlaneGeometry(3.5, 1.4).rotateX(-Math.PI / 2)
        };
        sharedGeos.skyscraper.translate(0, 0.5, 0);
        sharedGeos.treeTrunk.translate(0, 0.75, 0);
        sharedGeos.treeLeaves.translate(0, 3.0, 0);
    }

    // V-FIX: Initialise Groups (Ensure they are empty if reused)
    if (worldGroup) {
        while (worldGroup.children.length > 0) worldGroup.remove(worldGroup.children[0]);
    }
    if (interiorGroup) {
        while (interiorGroup.children.length > 0) interiorGroup.remove(interiorGroup.children[0]);
    }
    if (foregroundGroup) {
        while (foregroundGroup.children.length > 0) foregroundGroup.remove(foregroundGroup.children[0]);
    }

    // V-FIX: Prevent Double Invocation
    if (window.worldBuilt) {
        return;
    }
    window.worldBuilt = true;

    // V-PERF: Reset animation arrays
    animatedTrees = [];
    window.swayTrees = [];
    window.streetLights = [];
    windowFlickerMaterials = [];

    // PRE-CACHE Advanced Textures
    window.brickAmsterdamTex = createBrickTexture('amsterdam');
    window.brickDudokTex = createBrickTexture('dudok');

    buildHouse();
    buildEnvironment();

    // --- GARAGE RESTORATION ---
    if (window.createGarageDoor) {
        window.enhancedGarage = window.createGarageDoor(worldGroup, new THREE.Vector3(10, 0, 3.5));
        if (typeof window.alignToPlanet === 'function') window.alignToPlanet(window.enhancedGarage, 10, 3.5);
    }

    // Word Sculpture "House of Awe" (Neon)
    if (typeof createWordSculpture === 'function') createWordSculpture();

    // --- CAR MODELS ---
    if (window.initCars) window.initCars(worldGroup);

    // ENHANCED FEATURES (from house-add.js)
    if (window.createDistantBuildings) window.createDistantBuildings(scene);
}



function buildHouse() {
    // --- FOUNDATION: DUDOK BRICK BASE (DARK BROWN) ---
    createRoomBlock('basement', 0, 0.4, 0, 7.5, 0.8, 6.5, 0x3d1f0d, { type: 'dark', scale: 0.5, shift: 1.8 });
    const basementMesh = worldGroup.children.find(c => c.userData.name === 'basement');
    if (basementMesh) {
        basementMesh.material.map = window.brickDudokTex;
        basementMesh.material.color.setHex(0x3d1f0d); // Tint it dark
        basementMesh.material.polygonOffset = true;
        basementMesh.material.polygonOffsetFactor = 2;
        basementMesh.material.polygonOffsetUnits = 2;
    }

    // --- HORIZONTAL PLANES (DARK REDDISH BROWN) ---
    const planeGeo = new THREE.BoxGeometry(7.5, 0.1, 6.5);
    const planeMat = new THREE.MeshStandardMaterial({
        color: 0x5c0000, // Dark red-brown instead of white
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: 1
    });
    const midPlane = new THREE.Mesh(planeGeo, planeMat);
    midPlane.position.set(0, 0.85, 0); // Higher offset
    midPlane.userData = { ignore: true };
    worldGroup.add(midPlane);

    // --- LIVING ROOM: AMSTERDAM SCHOOL CURVE (DEEP BROWN) ---
    // Moved further left, door-side edge kept fixed at x=-0.6
    const livingX = -2.05, livingY = 2.1, livingZ = 0;
    const livingW = 2.9, livingH = 2.4, livingD = 5;
    const livingGroup = new THREE.Group();
    livingGroup.position.set(livingX, livingY, livingZ);
    worldGroup.add(livingGroup);

    const amsterdamMat = new THREE.MeshStandardMaterial({ color: 0x4d2600, map: window.brickAmsterdamTex, roughness: 0.8 });
    const livingBody = new THREE.Mesh(new THREE.BoxGeometry(livingW, livingH, livingD), amsterdamMat);
    livingBody.castShadow = true; livingBody.receiveShadow = true;
    livingBody.userData = { name: 'living', type: 'room' };
    livingGroup.add(livingBody);

    // Windows
    const winGeo = new THREE.BoxGeometry(1.5, 0.4, 0.1);
    const winMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, emissive: 0xffaa44, emissiveIntensity: 0.2 });
    const lWin = new THREE.Mesh(winGeo, winMat);
    lWin.position.set(0, 0.4, 2.55);
    livingGroup.add(lWin);

    // BACK WINDOW: Livingroom
    const lWinBack = new THREE.Mesh(winGeo, winMat);
    lWinBack.position.set(0, 0.4, -2.55);
    livingGroup.add(lWinBack);

    // Living Room Hitbox (Large and accessible)
    const liveHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 3.5, 0.5),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    liveHitBox.position.set(livingX - 0.5, livingY, 3.5); // Way forward
    liveHitBox.userData = {
        name: 'living',
        type: 'room',
        onClick: () => window.enterRoom('living')
    };
    worldGroup.add(liveHitBox);

    // --- STUDIO: DE STIJL BOX (REDDISH-ORANGE BROWN - No White) ---
    const studioX = 2.0, studioY = 2.05, studioZ = 0;
    const studioW = 2.8, studioH = 2.4, studioD = 5;
    const studioBody = new THREE.Mesh(
        new THREE.BoxGeometry(studioW, studioH, studioD),
        new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4, metalness: 0.1 })
    );
    studioBody.position.set(studioX, studioY, studioZ);
    studioBody.userData = { name: 'studio', type: 'room' };
    worldGroup.add(studioBody);

    // BACK WINDOW: Studio
    const sWinBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.1), winMat);
    sWinBack.position.set(studioX, studioY + 0.4, studioZ - 2.55);
    worldGroup.add(sWinBack);

    // CIRCULAR WINDOW — centered on front face (studioZ + depth/2 = 2.5)
    const circWinGroup = new THREE.Group();
    circWinGroup.position.set(studioX, studioY, studioZ + 2.52);
    const circFrame = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 32), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    circWinGroup.add(circFrame);
    const circGlass = new THREE.Mesh(new THREE.CircleGeometry(0.6, 32), new THREE.MeshStandardMaterial({ color: 0x222233, emissive: 0x333366, emissiveIntensity: 0.4, transparent: true, opacity: 0.9 }));
    circGlass.userData = { name: 'studio', type: 'room' };
    circWinGroup.add(circGlass);
    worldGroup.add(circWinGroup);

    // Studio side Windows
    const sWinMat = new THREE.MeshStandardMaterial({ color: 0x574a63, emissive: 0x996600, emissiveIntensity: 0.5 });
    const sWinSpan = 3.2;
    const sWinZCenter = studioZ - 0.0;
    for (let i = 0; i < 5; i++) {
        const sWinSquare = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.5), sWinMat);
        const zPos = (sWinZCenter - sWinSpan / 2) + (i * (sWinSpan / 4));
        sWinSquare.position.set(studioX + 1.42, studioY + 0.3, zPos);
        worldGroup.add(sWinSquare);
    }

    // DE STIJL ACCENTS - Red Plate covering the Studio Roof
    // Dimensions match Studio: W=2.8, D=5.0. Thickness 0.05.
    const redPlate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 5.0), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    // Position: Center X=2.0 (studioX), Top Y=2.05+1.2+0.025=3.275, Center Z=0
    redPlate.position.set(studioX, studioY + studioH / 2 + 0.025, studioZ);
    redPlate.receiveShadow = true;
    worldGroup.add(redPlate);



    // Studio Hitbox (Large and accessible)
    const studioHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 3.5, 0.5),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    studioHitBox.position.set(studioX + 0.4, studioY, 3.5); // Way forward, shifted slightly right
    studioHitBox.userData = {
        name: 'studio',
        type: 'room',
        onClick: () => window.enterRoom('studio')
    };
    worldGroup.add(studioHitBox);

    // --- ENTRANCE: PRACTICAL PORCH ---
    const doorFacade = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x5c3317, roughness: 0.5 })
    );
    doorFacade.position.set(0, 1.6, 2.45);
    worldGroup.add(doorFacade);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.1), new THREE.MeshStandardMaterial({ color: 0x3d1f0d }));
    door.position.set(0, 1.6, 2.57);
    door.userData = {
        name: 'hall',
        type: 'room',
        onClick: () => window.enterRoom('hall')
    };

    // Hall Hitbox (Large and accessible)
    const hallHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 3.5, 0.5),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    hallHitBox.position.set(0, 1.6, 3.5); // Way forward
    hallHitBox.userData = {
        name: 'hall',
        type: 'room',
        onClick: () => window.enterRoom('hall')
    };
    worldGroup.add(hallHitBox);

    // Basement Hitbox — wide, tall, deep so the hatch is easy to click/tap
    const basementHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(7.0, 2.5, 6.0),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    basementHitBox.position.set(0, -0.5, 1.5); // centred below the house, close to camera
    basementHitBox.userData = {
        name: 'basement',
        type: 'room',
        onClick: () => window.enterRoom('basement')
    };
    worldGroup.add(basementHitBox);
    worldGroup.add(door);

    // Triangular window on the door (top half, centered)
    const windowShape = new THREE.Shape();
    windowShape.moveTo(0, 0.15); // Top point
    windowShape.lineTo(-0.1, -0.05); // Bottom left
    windowShape.lineTo(0.1, -0.05); // Bottom right
    windowShape.lineTo(0, 0.15); // Close the triangle

    const windowGeometry = new THREE.ShapeGeometry(windowShape);
    const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const triangularWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    triangularWindow.position.set(0, 0.4, 0.06); // Middle of top half, slightly in front
    door.add(triangularWindow);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshStandardMaterial({ color: 0x996633 }));
    knob.position.set(0.3, 0, 0.08); door.add(knob);

    // Number 42 (Plain on wall)
    const numberTex = createHouseNumberTexture();
    const numberMat = new THREE.MeshBasicMaterial({ map: numberTex, transparent: true });
    const numberPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), numberMat);
    numberPlane.position.set(0, 2.7, 2.56);
    worldGroup.add(numberPlane);

    worldGroup.add(numberPlane);

    // --- HALL ENCLOSURE (Ceiling & Back Wall) ---
    // Ceiling connecting Living and Studio (Gap is 1.2)
    const hallCeiling = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.2, 5.0), // 1.25 allows minimal overlap to seal gap
        new THREE.MeshStandardMaterial({ color: 0x221100 })
    );
    // Studio Top is ~3.25. Living Top is ~3.3. Align to 3.25.
    // Center at 3.15 (Top face at 3.25)
    hallCeiling.position.set(0, 3.15, 0);
    hallCeiling.castShadow = true;
    worldGroup.add(hallCeiling);

    // Back Wall (Closing the corridor)
    const hallBack = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 2.4, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x5c3317 })
    );
    hallBack.position.set(0, 2.0, -2.4);
    hallBack.castShadow = true;
    worldGroup.add(hallBack);

    // Front Upper Wall (Above door)
    // Door facade top is at 1.6 + 0.9 = 2.5
    // Ceiling bottom is 3.15 - 0.1 = 3.05
    // Height = 0.55. Center = 2.775
    const hallFrontUpper = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.55, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x5c3317 })
    );
    hallFrontUpper.position.set(0, 2.775, 2.45);
    hallFrontUpper.castShadow = true;
    worldGroup.add(hallFrontUpper);

    // --- THE LITTLE ROOM (Toilet): EXTERIOR OUTHOUSE ---
    // Replaced manual construction with simpler helper function (0.35 scale, slanted walls)
    // Position preserved from legacy code: (0, 0, -3.5)

    // Ensure the helper function is available (hoisted)
    if (typeof createToiletExterior === 'function') {
        createToiletExterior(worldGroup, new THREE.Vector3(0, 0, -3.5));
    } else {
        console.error('createToiletExterior function missing!');
    }

    // --- UPPER FLOOR: CLASHING VOLUMES ---
    // BEDROOM: Cantilevered Overhang + Corner Window
    const bedX = -1.8, bedY = 4.5, bedZ = 0.5; // Upward nudge
    createRoomBlock('bedroom', bedX, bedY, bedZ, 3.2, 2.4, 4.0, 0x5c3317, [
        { type: 'dark', side: 'front', scale: 0.8 },
        { type: 'dark', side: 'back', scale: 0.4 }
    ]);

    // Add side window for bedroom
    const bWinSide = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.5), winMat);
    bWinSide.position.set(bedX - 1.65, bedY, bedZ);
    bWinSide.userData = { name: 'bedroom', type: 'room', onClick: () => window.enterRoom('bedroom') };
    worldGroup.add(bWinSide);

    // BATHROOM: Vertical Brick Tower (Amsterdam Style)
    const bathX = 2.0, bathY = 5.05, bathZ = 0; // Upward nudge
    const bathMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 6.0, 2.5), amsterdamMat);
    bathMesh.position.set(bathX, bathY, bathZ);
    bathMesh.userData = { name: 'bathroom', type: 'room' };
    worldGroup.add(bathMesh);

    // Bathroom Windows (Slits on side)
    for (let i = 0; i < 3; i++) {
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.4), winMat);
        slit.position.set(bathX + 1.03, bathY + i * 1.2 - 0.1, 0);
        worldGroup.add(slit);
    }

    // BACK WINDOWS: 3 on the tall bathroom
    for (let i = 0; i < 3; i++) {
        const slitBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.1), winMat);
        slitBack.position.set(bathX, bathY + i * 1.2 - 0.1, bathZ - 1.27);
        worldGroup.add(slitBack);
    }

    const bathHitBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 6.0, 0.8), new THREE.MeshBasicMaterial({ visible: false, transparent: true }));
    bathHitBox.position.set(bathX, bathY, 1.3);
    bathHitBox.userData = { name: 'bathroom', type: 'room' };
    worldGroup.add(bathHitBox);

    // --- BATHROOM RED TILED ROOF ---
    const bathRoofTex = createRoofTexture();
    const bathRoofTopY = bathY + 3.0 + 0.06;
    const bathRoof = new THREE.Mesh(
        new THREE.BoxGeometry(2.0 + 0.3, 0.12, 2.5 + 0.3),
        new THREE.MeshStandardMaterial({ map: bathRoofTex, color: 0xcc1010, roughness: 0.85 })
    );
    bathRoof.position.set(bathX, bathRoofTopY, bathZ);
    bathRoof.castShadow = true; bathRoof.receiveShadow = true;
    worldGroup.add(bathRoof);

    // --- BATHROOM SOLAR PANELS (1 col x 2 rows) ---
    (function () {
        const _frameMat2 = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.6 });
        const _roofY2 = bathRoofTopY + 0.07;
        const _pW2 = 0.65, _pD2 = 0.55, _pT2 = 0.04, _gap2 = 0.14;
        const _cols2 = 1, _rows2 = 2;
        const _sx2 = bathX - ((_cols2 - 1) * (_pW2 + _gap2)) / 2;
        const _sz2 = bathZ - ((_rows2 - 1) * (_pD2 + _gap2)) / 2;
        const _sc2 = document.createElement('canvas'); _sc2.width = 64; _sc2.height = 64;
        const _s2ctx = _sc2.getContext('2d');
        _s2ctx.fillStyle = '#0a2a55'; _s2ctx.fillRect(0, 0, 64, 64);
        _s2ctx.strokeStyle = '#1a4a80'; _s2ctx.lineWidth = 2;
        for (let _i2 = 1; _i2 < 4; _i2++) {
            _s2ctx.beginPath(); _s2ctx.moveTo(_i2 * 16, 0); _s2ctx.lineTo(_i2 * 16, 64); _s2ctx.stroke();
            _s2ctx.beginPath(); _s2ctx.moveTo(0, _i2 * 16); _s2ctx.lineTo(64, _i2 * 16); _s2ctx.stroke();
        }
        const _cellTex2 = new THREE.CanvasTexture(_sc2);
        for (let _c2 = 0; _c2 < _cols2; _c2++) {
            for (let _r2 = 0; _r2 < _rows2; _r2++) {
                const _px2 = _sx2 + _c2 * (_pW2 + _gap2), _pz2 = _sz2 + _r2 * (_pD2 + _gap2);
                const _frame2 = new THREE.Mesh(new THREE.BoxGeometry(_pW2 + 0.06, _pT2 + 0.02, _pD2 + 0.06), _frameMat2);
                _frame2.position.set(_px2, _roofY2, _pz2); worldGroup.add(_frame2);
                const _panel2 = new THREE.Mesh(new THREE.BoxGeometry(_pW2, _pT2, _pD2),
                    new THREE.MeshStandardMaterial({ color: 0x0a2a55, roughness: 0.2, metalness: 0.8, map: _cellTex2 }));
                _panel2.position.set(_px2, _roofY2 + 0.02, _pz2); worldGroup.add(_panel2);
            }
        }
    })();

    // Rounded balcony (Quarter cylinder on the corner)
    // const balcony = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.8, 16, 1, false, 0, Math.PI / 2), amsterdamMat);
    // Position at Right-Front corner (X=3.0, Z=1.25)
    // bathX=2.0. Right edge is ~3.0. Front edge is ~1.25.
    // balcony.position.set(bathX + 0.9, bathY - 1.48, 1.2);
    // balcony.rotation.y = -Math.PI / 2; // Curve connects Front (+Z) to Right (+X)
    // worldGroup.add(balcony);

    // --- ROOF & ATTIC: AMSTERDAM FLAT BOX STYLE ---
    const roofBaseY = 6.6; // Higher offset
    const flatRoof = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.2, 6.0), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    flatRoof.position.set(0, roofBaseY, 0);
    worldGroup.add(flatRoof);

    // Flat Attic Cube
    const atticX = -1.2, atticY = roofBaseY + 1.25, atticZ = 0;
    const atticW = 3.6, atticH = 2.4, atticD = 4.5;

    // BACK WINDOW: Attic
    createRoomBlock('attic', atticX, atticY, atticZ, atticW, atticH, atticD, 0x4d2600, { type: 'dark', side: 'back', scale: 0.8 });
    // Note: createRoomBlock already adds the mesh to worldGroup

    // Row of taller, narrow Amsterdam-school slit windows
    const rowWinGeo = new THREE.BoxGeometry(0.12, 1.2, 0.1); // Narrower and taller
    for (let i = 0; i < 6; i++) {
        const slit = new THREE.Mesh(rowWinGeo, winMat);
        slit.position.set(atticX - 1.5 + i * 0.6, atticY + 0.2, atticZ + 2.28);
        worldGroup.add(slit);
    }

    const atticHitBox = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 5), new THREE.MeshBasicMaterial({ visible: false, transparent: true }));
    atticHitBox.position.set(atticX, atticY, 0);
    atticHitBox.userData = { name: 'attic', type: 'room' };
    worldGroup.add(atticHitBox);

    // --- ATTIC RED TILED ROOF ---
    const atticRoofTex = createRoofTexture();
    const atticRoof = new THREE.Mesh(
        new THREE.BoxGeometry(atticW + 0.3, 0.12, atticD + 0.3),
        new THREE.MeshStandardMaterial({ map: atticRoofTex, color: 0xcc1010, roughness: 0.85 })
    );
    atticRoof.position.set(atticX, atticY + atticH / 2 + 0.06, atticZ);
    atticRoof.castShadow = true; atticRoof.receiveShadow = true;
    worldGroup.add(atticRoof);

    // --- ATTIC SOLAR PANELS (2 cols x 3 rows) ---
    (function () {
        const _frameMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.6 });
        const _roofY = atticY + atticH / 2 + 0.13;
        const _pW = 0.7, _pD = 0.55, _pT = 0.04, _gap = 0.12;
        const _cols = 2, _rows = 3;
        const _sx = atticX - ((_cols - 1) * (_pW + _gap)) / 2;
        const _sz = atticZ - ((_rows - 1) * (_pD + _gap)) / 2;
        const _sc = document.createElement('canvas'); _sc.width = 64; _sc.height = 64;
        const _sctx = _sc.getContext('2d');
        _sctx.fillStyle = '#0a2a55'; _sctx.fillRect(0, 0, 64, 64);
        _sctx.strokeStyle = '#1a4a80'; _sctx.lineWidth = 2;
        for (let _i = 1; _i < 4; _i++) {
            _sctx.beginPath(); _sctx.moveTo(_i * 16, 0); _sctx.lineTo(_i * 16, 64); _sctx.stroke();
            _sctx.beginPath(); _sctx.moveTo(0, _i * 16); _sctx.lineTo(64, _i * 16); _sctx.stroke();
        }
        const _cellTex = new THREE.CanvasTexture(_sc);
        for (let _c = 0; _c < _cols; _c++) {
            for (let _r = 0; _r < _rows; _r++) {
                const _px = _sx + _c * (_pW + _gap), _pz = _sz + _r * (_pD + _gap);
                const _frame = new THREE.Mesh(new THREE.BoxGeometry(_pW + 0.06, _pT + 0.02, _pD + 0.06), _frameMat);
                _frame.position.set(_px, _roofY, _pz); worldGroup.add(_frame);
                const _panel = new THREE.Mesh(new THREE.BoxGeometry(_pW, _pT, _pD),
                    new THREE.MeshStandardMaterial({ color: 0x0a2a55, roughness: 0.2, metalness: 0.8, map: _cellTex }));
                _panel.position.set(_px, _roofY + 0.02, _pz); worldGroup.add(_panel);
            }
        }
    })();

    // --- STAIRS ---
    const stepDarkMat = new THREE.MeshStandardMaterial({ color: 0x1a0d00 });
    const stepWhiteMat = new THREE.MeshStandardMaterial({ color: 0xbfb5ae });
    const stepMats = [
        stepDarkMat, // Right
        stepDarkMat, // Left
        stepDarkMat, // Top
        stepDarkMat, // Bottom
        stepWhiteMat, // Front
        stepDarkMat  // Back
    ];

    for (let i = 0; i < 4; i++) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(2.0 - i * 0.2, 0.2, 0.4), stepMats);
        s.position.set(0, 0.1 + i * 0.22, 4.75 - i * 0.4);
        worldGroup.add(s);
    }
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

function createMistTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(100, 0, 200, 0.03)';
    ctx.fillRect(0, 0, 512, 512);

    // Draw multiple soft "puffs" for a cloud-like effect
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 50 + Math.random() * 100;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const opacity = 0.08 + Math.random() * 0.10;
        g.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
}

function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Greener base with subtle gradient
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#1d4d11');
    g.addColorStop(1, '#2b6a1b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);

    // Gravel-like speckles (mostly green, a little stone noise)
    for (let i = 0; i < 12000; i++) {
        const r = Math.random();
        if (r > 0.95) ctx.fillStyle = '#9aa39a';      // small stone (rare)
        else if (r > 0.7) ctx.fillStyle = '#5aa84a'; // bright green speck
        else if (r > 0.35) ctx.fillStyle = '#2f6e2b'; // mid green
        else ctx.fillStyle = '#15300a';              // dark green

        const size = Math.random() * 3 + 1; // 1-4
        ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
    }

    // Slight blur to soften speckles (creates gravel/noise look)
    try {
        ctx.filter = 'blur(1px)';
        const blurred = document.createElement('canvas');
        blurred.width = 512; blurred.height = 512;
        const bctx = blurred.getContext('2d');
        bctx.filter = 'blur(1px)';
        bctx.drawImage(canvas, 0, 0);
        // copy back
        ctx.filter = 'none';
        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(blurred, 0, 0);
    } catch (e) {
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;

    return texture;
}


function createIntroSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 200;
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
    ctx.fillStyle = '#cc0000'; ctx.font = 'bold 80px "Glass Antiqua", cursive';
    ctx.fillText("ENTER", 256, 100); // Centered vertically in 200

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return tex;
}

// --- WORD SCULPTURE (HOUSE OF AWE) ---
function createWordSculpture() {
    if (!window.worldGroup) return;

    const sculptureGroup = new THREE.Group();
    sculptureGroup.name = "wordSculpture";

    // Positioned left (scX=1.0) and elevated to float (sculptureGroup.position.y lift)
    const scX = 1.0, scZ = 8.5;
    if (typeof window.alignToPlanetUpright === 'function') {
        window.alignToPlanetUpright(sculptureGroup, scX, scZ);
        sculptureGroup.position.y += 0.4; // Floating elevation
    } else {
        sculptureGroup.position.set(scX, 1.2, scZ);
    }
    worldGroup.add(sculptureGroup);

    window.refreshWordSculpture = function () {
        // Clear children
        while (sculptureGroup.children.length > 0) {
            const child = sculptureGroup.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
            sculptureGroup.remove(child);
        }

        const loader = new THREE.FontLoader();
        loader.load('/assets/fonts/droid_sans_regular.typeface.json', function (font) {

            const neonBlue = 0x1133cc;
            const neonRed = 0xcc0000;
            const fontSize = 0.9;
            const depth = 0.05;
            const textGap = 0.42;

            const createNeonMesh = (text, color, xOffset) => {
                const geometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: fontSize,
                    height: depth,
                    curveSegments: 16,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.015,
                    bevelSegments: 5
                });
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 3.5,
                    roughness: 0.1,
                    metalness: 0.1
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = xOffset;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                return mesh;
            };

            const lineGroup = new THREE.Group();

            // Logic for split text
            let text1 = "House of";
            let text2 = "Awe";

            if (window.currentLanguage === 'nl') {
                text1 = "Huis der";
                text2 = "Verwondering";
            } else if (window.t) {
                // Fallback attempt to split translated text
                const fullText = t('sculpture_text');
                const lastSpace = fullText.lastIndexOf(' ');
                if (lastSpace !== -1) {
                    text1 = fullText.substring(0, lastSpace);
                    text2 = fullText.substring(lastSpace + 1);
                }
            }

            const mesh1 = createNeonMesh(text1, neonBlue, 0);
            mesh1.geometry.computeBoundingBox();
            const width1 = mesh1.geometry.boundingBox.max.x - mesh1.geometry.boundingBox.min.x;

            const mesh2 = createNeonMesh(text2, neonRed, width1 + textGap);
            mesh2.geometry.computeBoundingBox();
            const width2 = mesh2.geometry.boundingBox.max.x - mesh2.geometry.boundingBox.min.x;

            lineGroup.add(mesh1);
            lineGroup.add(mesh2);

            const totalWidth = width1 + textGap + width2;
            lineGroup.position.x = -totalWidth / 2;
            sculptureGroup.add(lineGroup);

            const blueLight = new THREE.PointLight(neonBlue, 1.6, 7);
            blueLight.position.set(-totalWidth / 4, 0.5, 0.5);
            sculptureGroup.add(blueLight);

            const redLight = new THREE.PointLight(neonRed, 1.8, 7);
            redLight.position.set(totalWidth / 4, 0.5, 0.5);
            sculptureGroup.add(redLight);
        });
    };

    window.refreshWordSculpture();
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
    ctx.fillStyle = '#b91c1c'; ctx.font = 'bold 90px "Glass Antiqua", cursive'; ctx.fillText(line1, 256, 100);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 40px Arial, sans-serif'; ctx.fillText(line2, 256, 180);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return tex;
}

function createIntroSign() {
    const group = new THREE.Group();
    // Position in front of camera (Camera at 0, 20, 85)
    group.position.set(0, 14, 72);
    group.rotation.x = -0.2; // Tilt up slightly

    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    pole.position.y = -5;
    group.add(pole);

    // Board
    const tex = createIntroSignTexture();
    const board = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 1.8, 0.2),
        new THREE.MeshStandardMaterial({ map: tex, transparent: true })
    );
    board.userData = {
        type: 'introSign',
        name: 'introSign',
        onClick: function () {
            startInteractiveIntro();
        }
    }; // Important for raycaster
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
    const audioPath = (window.houseConfig && window.houseConfig.audio) ? window.houseConfig.audio.tension : '/assets/audio/drone.mp3';
    const audio = new Audio(audioPath);
    audio.volume = 0.8;
    audio.play().catch(() => { });

    // 2. Animate Sign GROW (Bigger), DROP (Below Screen), FADE
    const sign = worldGroup.children.find(c => {
        return c.children.some(child => child.userData && child.userData.type === 'introSign');
    });

    if (sign) {
        const board = sign.children.find(c => c.userData.type === 'introSign');

        // Grow Scale (Much bigger)
        new TWEEN.Tween(sign.scale)
            .to({ x: 3.0, y: 3.0, z: 3.0 }, 3500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        // Drop Down (Below screen) & Fade Out
        new TWEEN.Tween(sign.position)
            .to({ y: -50 }, 4000)
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

function buildStreetlight(x, z, rotationY = 0, intensity = 4.0) {
    const poleGroup = new THREE.Group();
    poleGroup.position.set(x, 0, z);
    poleGroup.rotation.y = rotationY;
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x303030, roughness: 0.4, metalness: 0.6 }); // Darker pole
    const poleHeight = 4.0;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, poleHeight, 16), metalMat);
    pole.position.y = poleHeight / 2;
    pole.castShadow = true;
    pole.receiveShadow = true;
    poleGroup.add(pole);
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, poleHeight, 0),
        new THREE.Vector3(0, poleHeight + 2.0, 0),
        new THREE.Vector3(-1.8, poleHeight + 1.5, 0)
    );
    const arm = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.1, 8, false), metalMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    poleGroup.add(arm);
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(-1.8, poleHeight + 1.5, 0);
    const lanternHood = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 0.2, 8), metalMat);
    lanternHood.castShadow = true;
    lanternGroup.add(lanternHood);

    // DIMMER & WARMER LIGHT (User Request)
    const lightColor = 0xffeebb;
    const glassMat = new THREE.MeshStandardMaterial({ color: lightColor, transparent: true, opacity: 0.6, emissive: lightColor, emissiveIntensity: 0.3 });
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.6, 6), glassMat);
    glass.position.y = -0.4;
    lanternGroup.add(glass);

    const spotLight = new THREE.SpotLight(lightColor, intensity / 20); // Much lower intensity
    spotLight.position.set(0, -0.2, 0);
    spotLight.target.position.set(0, -10, 0);
    spotLight.angle = Math.PI / 2.5;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.distance = 40;
    lanternGroup.add(spotLight);
    lanternGroup.add(spotLight.target);
    const glowLight = new THREE.PointLight(lightColor, intensity / 40, 3);
    glowLight.position.y = -0.4;
    lanternGroup.add(glowLight);
    const spriteMat = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: lightColor,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glowSprite = new THREE.Sprite(spriteMat);
    // V-FIX: Much smaller glow
    const glowScale = 1.5;
    glowSprite.scale.set(glowScale, glowScale, glowScale);
    glowSprite.position.y = -0.4;
    lanternGroup.add(glowSprite);
    poleGroup.add(lanternGroup);

    const signTex = createSignTexture();
    const signWidth = 1.4; const signHeight = 0.7;
    const signGeo = new THREE.BoxGeometry(signWidth, signHeight, 0.05);
    const signMat = new THREE.MeshStandardMaterial({ map: signTex });
    const signBackMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const sign = new THREE.Mesh(signGeo, [signBackMat, signBackMat, signBackMat, signBackMat, signMat, signBackMat]);
    if (Math.abs(rotationY) > 0.1) {
        sign.position.set(0, 3.0, -0.15); sign.rotation.y = Math.PI;
    } else {
        sign.position.set(0, 3.0, 0.15);
    }
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.16), metalMat);
    bracket.position.y = signHeight / 2 - 0.05;
    bracket.position.z = Math.abs(rotationY) > 0.1 ? 0.05 : -0.05;
    sign.add(bracket);

    worldGroup.add(poleGroup);

    return spotLight;
}

function buildEnvironment() {
    const groundTex = createGrassTexture();
    const planeMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1, color: 0xffffff });

    // Planet Curvature
    const PLANET_RADIUS = 500;
    const planetGroup = new THREE.Group();
    // Center the sphere so its top surface touches (0,0,0)
    planetGroup.position.set(0, -PLANET_RADIUS, 0);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS, 512, 512), planeMat); // V-ENHANCED: Much higher density to match road math
    sphere.receiveShadow = true; // Enable Lamppost Shadows on ground
    planetGroup.add(sphere);

    worldGroup.add(planetGroup);

    // Occupancy Map for collisions
    const placedPoints = [];
    function isLocationValid(x, z, minDist = 8) {
        const distToHouse = Math.sqrt(x * x + z * z);
        const distToGarage = Math.sqrt((x - 10) * (x - 10) + (z - 3.5) * (z - 3.5));
        if (distToHouse < 8) return false;
        if (distToGarage < 6) return false;

        for (let p of placedPoints) {
            const dx = x - p.x; const dz = z - p.z;
            if (dx * dx + dz * dz < minDist * minDist) return false;
        }
        return true;
    }
    mistLayer = null;

    function getPlanetY(x, z) {
        const R = PLANET_RADIUS;
        const term = R * R - x * x - z * z;
        if (term < 0) return 0;
        return Math.sqrt(term) - R;
    }
    window.getPlanetY = getPlanetY;

    function alignToPlanet(obj, x, z) {
        const y = getPlanetY(x, z);
        obj.position.set(x, y, z);
        const normal = new THREE.Vector3(x, y + PLANET_RADIUS, z).normalize();
        obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    }
    window.alignToPlanet = alignToPlanet;

    // alignToPlanetUpright: positions on curved surface but keeps object vertical (for buildings)
    function alignToPlanetUpright(obj, x, z) {
        const y = getPlanetY(x, z);
        obj.position.set(x, y, z);
        // No quaternion tilt - buildings stay perfectly vertical
    }
    window.alignToPlanetUpright = alignToPlanetUpright;

    // Spherical Road (Epic Scale)
    const widthAtSteps = 1.4;
    const widthAtHorizon = 30.0;
    const stepZ = 2.7;
    const horizonZ = 250.0;
    const widthSlope = (widthAtHorizon - widthAtSteps) / (horizonZ - stepZ);

    const roadSegments = 300;
    const roadStartZ = 27.0;
    const roadEndZ = 250.0;

    const rVertices = [];
    const rIndices = [];
    const rUVs = [];
    const roadThickness = 0.5;

    const roadWidth = 6.0;
    const Z_START = 250.0;
    const Z_END = 27.2; // Road stops exactly at roundabout outer rim — flare handles z=27.2 down to z=20
    const step = 2.0;

    // Create segments as a single buffer geometry
    for (let z = Z_START; z > Z_END; z -= step) {
        const nextZ = z - step;
        const ratio = (Z_START - z) / (Z_START - Z_END);

        // Zig-Zag Logic
        let xOffset = 0;
        let nextXOffset = 0;

        const zigFactor = Math.max(0, 1.0 - (ratio * 1.5)); // Fade out zig zag
        // Use cosine with smaller amplitude for a straighter, reversed initial curve
        const curveAmp = 3.0;
        // Expose for debugging
        try { window.houseDebug.curveAmp = curveAmp; window.houseDebug.roadZStart = Z_START; window.houseDebug.roadZEnd = Z_END; } catch (e) { }
        xOffset = -Math.cos(z * 0.1) * curveAmp * zigFactor;
        nextXOffset = -Math.cos(nextZ * 0.1) * curveAmp * zigFactor;

        // Current Segment
        const y1 = getPlanetY(xOffset, z) + 0.035; // V-FIX: Higher offset to prevent grass clipping
        const y2 = getPlanetY(nextXOffset, nextZ) + 0.035;

        rVertices.push(xOffset - roadWidth / 2, y1, z);
        rVertices.push(nextXOffset - roadWidth / 2, y2, nextZ);
        rVertices.push(xOffset + roadWidth / 2, y1, z);

        rVertices.push(nextXOffset - roadWidth / 2, y2, nextZ);
        rVertices.push(nextXOffset + roadWidth / 2, y2, nextZ);
        rVertices.push(xOffset + roadWidth / 2, y1, z);

        // Simple UVs
        rUVs.push(0, ratio);
        rUVs.push(0, ratio + 0.01);
        rUVs.push(1, ratio);
        rUVs.push(0, ratio + 0.01);
        rUVs.push(1, ratio + 0.01);
        rUVs.push(1, ratio);
    }

    const roadMeshGeo = new THREE.BufferGeometry();
    roadMeshGeo.setAttribute('position', new THREE.Float32BufferAttribute(rVertices, 3));
    roadMeshGeo.setAttribute('uv', new THREE.Float32BufferAttribute(rUVs, 2));
    roadMeshGeo.computeVertexNormals();

    const road = new THREE.Mesh(roadMeshGeo, new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: 1
    }));
    road.receiveShadow = true;
    road.castShadow = true; // V-FIX: Cast shadows to ground to hide floating gap
    worldGroup.add(road);

    // Circular approach disc — fills the area under and around the roundabout ring
    // so the road meets the ring cleanly without rectangular flares.
    {
        const discSegs = 48;
        const discR = 7.4;
        const discVerts = [];
        const discIdx = [];
        const rz = 20;
        discVerts.push(0, getPlanetY(0, rz) + 0.028, rz);
        for (let i = 0; i <= discSegs; i++) {
            const a = (i / discSegs) * Math.PI * 2;
            const vx = Math.cos(a) * discR;
            const vz = rz + Math.sin(a) * discR;
            discVerts.push(vx, getPlanetY(vx, vz) + 0.028, vz);
        }
        for (let i = 1; i <= discSegs; i++) {
            discIdx.push(0, i, i + 1);
        }
        const discGeo = new THREE.BufferGeometry();
        discGeo.setAttribute('position', new THREE.Float32BufferAttribute(discVerts, 3));
        discGeo.setIndex(discIdx);
        discGeo.computeVertexNormals();
        const discMesh = new THREE.Mesh(discGeo, new THREE.MeshStandardMaterial({
            color: 0x2a2a2a, roughness: 0.9,
            polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: 1
        }));
        discMesh.receiveShadow = true;
        worldGroup.add(discMesh);
    }

    // Capture the light object for animation
    const lx_lamp = -7, lz_lamp = 10; // Back on gravel, but still far-left corner
    lamppostLight = buildStreetlight(lx_lamp, lz_lamp, Math.PI, 0.08); // Toned down nudge from 0.15 to 0.08
    if (lamppostLight) {
        // CUSTOM GLOW BOOST (User Request)
        if (lamppostLight.parent) {
            lamppostLight.parent.children.forEach(c => {
                if (c.isSprite) {
                    c.scale.set(6.0, 6.0, 1.0); // Larger Glow
                    c.material.opacity = 0.9;   // Brighter Glow
                }
            });
        }

        let group = lamppostLight.parent.parent;
        if (group) {
            const ly = getPlanetY(lx_lamp, lz_lamp);
            group.position.set(lx_lamp, ly, lz_lamp);
            const normal = new THREE.Vector3(lx_lamp, ly + PLANET_RADIUS, lz_lamp).normalize();
            group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
            group.rotateY(Math.PI);
        }
        lamppostLight.userData = {
            base: 2.0,
            speed: 2.0 + Math.random(),
            phase: Math.random() * Math.PI * 2
        };

        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(10, 0, 6.5);
        scene.add(lightTarget);
        lamppostLight.target = lightTarget;
        lamppostLight.castShadow = true;
        if (lamppostLight.shadow) {
            // PERF: 512 shadow maps — halves memory vs 1024 with minimal visible difference at distance
            lamppostLight.shadow.mapSize.width = 512;
            lamppostLight.shadow.mapSize.height = 512;
            lamppostLight.shadow.camera.near = 0.5;
            lamppostLight.shadow.camera.far = 40;
            lamppostLight.shadow.radius = 3; // Soft shadow edges
        }

        // Create a quick soft shadow texture
        function createShadowTexture() {
            const sc = document.createElement('canvas'); sc.width = 64; sc.height = 64;
            const sctx = sc.getContext('2d');
            const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, 'rgba(0,0,0,1.0)'); // Darker core
            g.addColorStop(1, 'rgba(0,0,0,0)');
            sctx.fillStyle = g; sctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(sc);
        }
        window.createShadowTexture = createShadowTexture;

        // Add shadow for lamppost itself (Manual Plane)
        const shadowGeo = new THREE.PlaneGeometry(8, 3); // V-FIX: X-long to match trees
        shadowGeo.rotateX(-Math.PI / 2); // Bake rotation so Local Y is Normal

        const postShadowPlane = new THREE.Mesh(
            shadowGeo,
            new THREE.MeshBasicMaterial({
                map: createShadowTexture(),
                transparent: true,
                opacity: 0.7, // V-FIX: Softer
                depthWrite: false
            })
        );
        // Position and Orient to Planet Surface natively
        alignToPlanet(postShadowPlane, lx_lamp, lz_lamp);

        postShadowPlane.translateY(0.12);

        const moonShadowAngle = Math.atan2(50, -30);
        postShadowPlane.rotation.y = moonShadowAngle;

        postShadowPlane.translateX(-4);

        worldGroup.add(postShadowPlane);
        placedPoints.push({ x: lx_lamp, z: lz_lamp });
    }

    function createStreetGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const color = '#ffaa00';
        const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
        g.addColorStop(0, color); g.addColorStop(0.4, color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
    }

    // Independent Street Lights (Not children)
    const streetLights = [];
    window.streetLights = streetLights;

    // Background Blocks Helper
    // Universal Skyscraper Factory (Refactored for Material Pooling)
    function createMegaBlock() {
        // V-PERF: Material Pooling (6 variations instead of 990 unique canvases)
        if (skyscraperMaterialPool.length < 8) {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            const palette = [0x2a2e32, 0x3a3f44, 0x1e1a16, 0x2f2820, 0x4a4e52, 0x353030];
            const color = palette[skyscraperMaterialPool.length % palette.length];

            // Re-enabled screens (LEDs)
            for (let i = 0; i < 12; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#9d13a9' : '#0a8aba';
                ctx.fillRect(Math.random() * 28, Math.random() * 18, 2, 2);
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;

            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.9,
                metalness: 0.1,
                emissiveMap: tex,
                emissive: 0xffffff,
                emissiveIntensity: 2.0
            });
            skyscraperMaterialPool.push(mat);
        }

        const randomMat = skyscraperMaterialPool[Math.floor(Math.random() * skyscraperMaterialPool.length)];
        const mesh = new THREE.Mesh(sharedGeos.skyscraper, randomMat);

        mesh.userData = {
            isSkyscraper: true,
            phase: Math.random() * Math.PI * 2,
            speed: 1.5 + Math.random() * 2,
            baseScaleY: 1.0
        };
        // Distant skyscrapers don't need to cast shadows (huge savings)
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        return mesh;
    }
    function createPathGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 200, 100, 1)'); // Warm white center
        gradient.addColorStop(0.2, 'rgba(255, 160, 0, 0.4)'); // Rapid falloff to transparency
        gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    function spawnPathLights() {
        const lampGroup = new THREE.Group();

        const stemsMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.6,
            metalness: 0.5
        });

        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 3.0
        });

        // 1. Tapered Stalk (Base to Curve start)
        const stalkGeo = new THREE.CylinderGeometry(0.06, 0.12, 3.2, 8);

        // 2. The Loop/Curve (Torus Segment)
        const curveGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 16, Math.PI * 1.3);

        // 3. The Bulb (Large Sphere)
        const bulbGeo = new THREE.SphereGeometry(0.3, 32, 32);

        // One material for Glow Sprite
        const glowTex = createGlowTexture();
        const spriteMat = new THREE.SpriteMaterial({
            map: glowTex, color: 0xffaa00, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false
        });

        // Constant Road Width (No Perspective Cheating)
        const ROAD_WIDTH = 6.0;

        // Lampposts continue far into the distance
        for (let z = 220; z >= 35; z -= 15) {
            const xPos = ROAD_WIDTH / 2 + 1.2;

            const postGroup = new THREE.Group();
            postGroup.scale.setScalar(1.2); // 20% BIGGER (Generic Lampposts)

            // 1. Stalk (Y: 1.6)
            const stalk = new THREE.Mesh(stalkGeo, stemsMat);
            stalk.position.y = 1.6;
            postGroup.add(stalk);

            // 2. Curve (Top)
            const curve = new THREE.Mesh(curveGeo, stemsMat);
            curve.position.set(0.3, 3.2, 0);
            curve.rotation.z = Math.PI / 1.5;
            postGroup.add(curve);

            // 3. Bulb (Nestled in curve)
            const bulb = new THREE.Mesh(bulbGeo, bulbMat);
            bulb.position.set(0.4, 3.2, 0);
            postGroup.add(bulb);

            // Light & Glow
            const pLight = new THREE.PointLight(0xffaa00, 10.0, 18); // ROAD LIGHTS: Very Intense (15.0)
            pLight.position.set(0.4, 3.2, 0);
            postGroup.add(pLight);
            streetLights.push(pLight);

            const spriteL = new THREE.Sprite(spriteMat);
            spriteL.scale.set(3.5, 3.5, 1.0); // LARGER GLOW
            spriteL.position.set(0.4, 3.2, 0);
            postGroup.add(spriteL);

            // Left
            alignToPlanet(postGroup, -xPos, z);
            postGroup.lookAt(new THREE.Vector3(0, postGroup.position.y, z));
            lampGroup.add(postGroup);

            // Right
            const postGroupR = postGroup.clone();
            alignToPlanet(postGroupR, xPos, z);
            postGroupR.lookAt(new THREE.Vector3(0, postGroupR.position.y, z));
            postGroupR.traverse(c => { if (c.isPointLight) streetLights.push(c); });
            lampGroup.add(postGroupR);
        }
        worldGroup.add(lampGroup);

    }


    spawnPathLights();

    const placedBlocks = [];
    const BLOCK_MIN_DIST = 12.0;

    const SKY_BASE_RADIUS = 45; window.houseDebug.skyBaseRadius = SKY_BASE_RADIUS;
    for (let i = 0; i < 600; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Start skyscrapers further out so they don't crowd the back of the house
        const radius = SKY_BASE_RADIUS + Math.pow(Math.random(), 2) * 120; // Increased base radius (was 25)
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Prevent any blocks from spawning too close to house center
        if (Math.sqrt(x * x + z * z) < 40.0) continue;

        if (z > -50 && z < 250 && Math.abs(x) < 50.0) continue;

        if (!isLocationValid(x, z, BLOCK_MIN_DIST)) continue;
        placedPoints.push({ x: x, z: z });

        const mesh = createMegaBlock();
        const distFactor = (radius - 25) / 120;
        const minH = 6.0 + distFactor * 6.0;
        const maxH = 10.0 + distFactor * 15.0;
        const h = minH + Math.random() * (maxH - minH);

        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);

        alignToPlanetUpright(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh); // City blocks participate in glow animation
    }

    // Horizon Mega-Blocks (Far Distance)
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 130;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (z > -50 && z < 270 && Math.abs(x) < 80.0) continue;

        let overlap = false;
        for (let pb of placedBlocks) {
            const dx = x - pb.x;
            const dz = z - pb.z;
            if (dx * dx + dz * dz < BLOCK_MIN_DIST * BLOCK_MIN_DIST) {
                overlap = true;
                break;
            }
        }
        if (overlap) continue;
        placedBlocks.push({ x: x, z: z });

        const mesh = createMegaBlock();
        const h = 20.0 + Math.random() * 30.0;
        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);
        alignToPlanetUpright(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh);
    }

    // V-NEW: Near-house building blocks (adjusted - slightly further back and less dense)
    window.houseDebug.nearHouseDesired = 90; window.houseDebug.nearHousePlaced = 0;
    for (let i = 0; i < 90; i++) {
        const x = (Math.random() - 0.5) * 48;
        const z = -25 - Math.random() * 48;
        // Skip if too close to house center
        if (Math.sqrt(x * x + z * z) < 12.0) continue;
        // Simple collision guard
        if (!isLocationValid(x, z, 10.0)) continue;
        placedPoints.push({ x: x, z: z });

        const mesh = createMegaBlock();
        const h = 6.0 + Math.random() * 12.0;
        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);
        alignToPlanetUpright(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh);
        window.houseDebug.nearHousePlaced++;
    }

    // Leaf Texture
    function createLeafTexture() {
        const c = document.createElement('canvas'); c.width = 128; c.height = 128;
        const ctx = c.getContext('2d');
        // Brighter leaf base
        ctx.fillStyle = '#1e6f2a';
        ctx.fillRect(0, 0, 128, 128);

        // Denser brighter speckles
        for (let i = 0; i < 1400; i++) {
            const r = Math.random();
            if (r > 0.9) ctx.fillStyle = '#9ad56a';      // highlight (light)
            else if (r > 0.6) ctx.fillStyle = '#58b05a'; // bright mid
            else if (r > 0.3) ctx.fillStyle = '#2f7f36'; // mid
            else ctx.fillStyle = '#184a20';              // deep

            const size = Math.random() * 2 + 1.0;
            ctx.fillRect(Math.random() * 128, Math.random() * 128, size, size);
        }

        // soft blur for painterly clusters
        try {
            ctx.filter = 'blur(0.7px)';
            const tmp = document.createElement('canvas'); tmp.width = 128; tmp.height = 128;
            const tctx = tmp.getContext('2d');
            tctx.filter = 'blur(0.7px)';
            tctx.drawImage(c, 0, 0);
            ctx.filter = 'none';
            ctx.clearRect(0, 0, 128, 128);
            ctx.drawImage(tmp, 0, 0);
        } catch (e) { }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipMapLinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
        return tex;
    }
    const leafTex = createLeafTexture();

    // V-NEW: Extra trees close behind the house for depth (closer, denser V6)
    for (let i = 0; i < 100; i++) {
        const z = -15 - Math.random() * 60;
        const x = (Math.random() - 0.5) * 80;
        if (!isLocationValid(x, z, 3.0)) continue; // Dense forest allowance
        try {
            const t = createSimpleTree(x, z);
            if (typeof alignToPlanet === 'function') alignToPlanet(t, x, z);
            t.translateY(0.02);
            t.scale.multiplyScalar(0.7 + Math.random() * 0.9);
            placedPoints.push({ x, z });
        } catch (e) { /* non-fatal */ }
    }

    // Simple Tree Helper (Refactored for Performance)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 });
    const leafMatPool = [];

    function createSimpleTree(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const trunk = new THREE.Mesh(sharedGeos.treeTrunk, trunkMat);
        group.add(trunk);

        // V-PERF: Pool a few leaf material variations
        if (leafMatPool.length < 4) {
            leafMatPool.push(new THREE.MeshStandardMaterial({
                map: leafTex,
                color: 0xffffff,
                roughness: 0.9
            }));
        }

        const leaves = new THREE.Mesh(sharedGeos.treeLeaves, leafMatPool[Math.floor(Math.random() * leafMatPool.length)]);
        group.add(leaves);

        // --- TREE SHADOW PLANE ---
        if (window.createShadowTexture) {
            const shadow = new THREE.Mesh(
                sharedGeos.treeShadow,
                new THREE.MeshBasicMaterial({
                    map: window.createShadowTexture(),
                    transparent: true,
                    opacity: 0.6,
                    depthWrite: false
                })
            );
            shadow.position.y = 0.05;
            const moonShadowAngle = Math.atan2(50, -30);
            shadow.rotation.y = moonShadowAngle;
            group.add(shadow);
        }

        // Disable shadows for trees unless very close (V-PERF)
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter < 50) {
            leaves.castShadow = true;
        }

        const s = (0.5 + Math.random() * 0.7) * 1.5;
        group.scale.set(s, s, s);

        if (!window.swayTrees) window.swayTrees = [];
        group.userData.baseRotX = group.rotation.x;
        group.userData.baseRotZ = group.rotation.z;
        window.swayTrees.push(group);

        worldGroup.add(group);
        return group;
    }
    // Bush Helper (Refactored for Performance)
    const bushMatPool = [];
    function createBush(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        if (bushMatPool.length < 3) {
            bushMatPool.push(new THREE.MeshStandardMaterial({
                map: leafTex,
                color: 0x888888,
                roughness: 1.0,
                flatShading: true
            }));
        }
        const bushMat = bushMatPool[Math.floor(Math.random() * bushMatPool.length)];

        for (let i = 0; i < 5; i++) {
            const s = 0.3 + Math.random() * 0.4;
            const sphere = new THREE.Mesh(sharedGeos.bushSphere, bushMat);
            sphere.position.set(
                (Math.random() - 0.5) * 0.8,
                s * 0.5,
                (Math.random() - 0.5) * 0.8
            );
            sphere.scale.setScalar(s * 2.0);
            // Disable shadow casting for bushes to save draw calls
            sphere.castShadow = false;
            sphere.receiveShadow = true;
            group.add(sphere);
        }
        const scale = 0.7 + Math.random() * 0.6;
        group.scale.set(scale, scale, scale);

        if (window.createShadowTexture) {
            const shadow = new THREE.Mesh(
                sharedGeos.bushShadow,
                new THREE.MeshBasicMaterial({
                    map: window.createShadowTexture(),
                    transparent: true,
                    opacity: 0.5,
                    depthWrite: false
                })
            );
            shadow.position.y = 0.02;
            group.add(shadow);
        }
        worldGroup.add(group);
        return group;
    }

    // V-FIX: Absolute Precision Bush placement ONLY at the gravel borders
    // Gravel: x: [-8, 12], z: [-7, 11]
    const gXMin = -8.5, gXMax = 12.5, gZMin = -7.5, gZMax = 11.5; // Pushed out by 0.5 to stay CLEAR of path

    function placeDenseHedge(iCount, isVertical) {
        for (let i = 0; i < iCount; i++) {
            let x, z;
            if (isVertical) {
                x = (Math.random() > 0.5 ? gXMin : gXMax);
                z = gZMin + Math.random() * (gZMax - gZMin);
            } else {
                z = (Math.random() > 0.5 ? gZMin : gZMax);
                x = gXMin + Math.random() * (gXMax - gXMin);
            }

            // STRICT CLEARANCE: Avoid Path
            if (window.isLocationBlocked && window.isLocationBlocked(x, z)) continue;

            const b = createBush(x, z);
            if (typeof alignToPlanet === 'function') alignToPlanet(b, x, z);
        }
    }
    // Bush placement along gravel edges (reduced count for performance)
    placeDenseHedge(60, true);   // Vertical edges
    placeDenseHedge(60, false);  // Horizontal edges
    // REMOVED: All scattered roundabout bushes to ensure clean borders.


    // V166: Procedural Forest (Denser + 1.5x Scale focus)
    for (let i = 0; i < 500; i++) {
        const z = (Math.random() * 500) - 100; // Wider range

        // Funnel Logic: Clearing widens near house, narrows at distance
        let progress = Math.min(1.0, Math.max(0, z / 250));
        if (z < 0) progress = 0;

        // V-FIX: Wider Clearing (min 8.0 instead of 1.5) to protect road
        // V-FIX: Narrower Clearing (min 10.0 instead of 14.0)
        const clearingWidth = THREE.MathUtils.lerp(10, 8.0, progress);

        // V-FIX: Road Path Awareness (Zig-Zag Offset)
        const ratio = Math.max(0, 1.0 - (Math.min(1.0, (250 - z) / 223) * 1.5));
        const roadX = -Math.cos(z * 0.1) * 3.0 * ratio;

        let x;
        if (Math.random() > 0.5) {
            // Left side
            x = (roadX - clearingWidth) - (Math.random() * 120);
        } else {
            // Right side
            x = (roadX + clearingWidth) + (Math.random() * 120);
        }

        if (!isLocationValid(x, z, 4.0)) continue;

        // Culling: Avoid house (0,0) and garage (10, 3.5)
        const distToHouse = Math.sqrt(x * x + z * z);
        const distToGarage = Math.sqrt((x - 10) * (x - 10) + (z - 3.5) * (z - 3.5));
        if (distToHouse < 12.0) continue; // Pushed back for bushes
        if (distToGarage < 10.0) continue;

        // V-FIX: Explicit Road Center Check (8.0 units safety)
        if (Math.abs(x - roadX) < 8.0 && z > 20) continue;

        const treeInstance = createSimpleTree(x, z);
        if (z > 100) {
            const extraScale = 1.0 + (z - 100) * 0.005;
            treeInstance.scale.multiplyScalar(extraScale);
        }
        alignToPlanet(treeInstance, x, z);
        placedPoints.push({ x, z });
    }

    // --- ITEM 3: Additional trees further from house ---
    for (let i = 0; i < 30; i++) {
        const distance = 40 + Math.random() * 80;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        // Road check (approximation)
        const ratio = Math.max(0, 1.0 - (Math.min(1.0, (250 - z) / 223) * 1.5));
        const roadX = -Math.cos(z * 0.1) * 3.0 * ratio;

        // Avoid road and roundabout areas
        const toRoadCenter = Math.abs(x - roadX);
        const toRoundabout = Math.sqrt(x * x + (z - 20) * (z - 20));

        // Avoid Gravel Path (Approx px=2, pz=2, size 20x18)
        const toGravel = Math.max(Math.abs(x - 2) - 10, Math.abs(z - 2) - 9);

        if (toRoadCenter > 8 && toRoundabout > 12 && toGravel > 2) {
            const tree = createSimpleTree(x, z);
            if (typeof alignToPlanet === 'function') alignToPlanet(tree, x, z);
        }
    }


    // --- STRICT CLEARANCE CHECK ---
    function isLocationBlocked(x, z) {
        // Road/Driveway exclusion zones
        const distToHouse = Math.sqrt(x * x + z * z);
        const distToRoundabout = Math.sqrt(x * x + (z - 20) * (z - 20));

        if (distToHouse < 10) return true; // House/Gravel clearance
        if (distToRoundabout < 7.5) return true; // Roundabout clearance (inc wide transition)

        // V-FIX: Block Main Road
        if (z > 26 && Math.abs(x) < 5) return true;

        // V-FIX: Block Driveway (Simple bounding box/path check for P0-P1-P2)
        // Main limb (Roundabout to Corner): x in [0, 10], z in [18, 28] roughly
        if (x > -2 && x < 12 && z > 18 && z < 28) return true;
        // Second limb (To Garage): x in [8, 12], z in [3, 20] roughly
        if (x > 7.5 && x < 12.5 && z > 3 && z < 20) return true;

        return false;
    }
    window.isLocationBlocked = isLocationBlocked;


    // --- ITEM 16: Far Forest Enrichment (V5 Denser) ---
    for (let i = 0; i < 40; i++) {
        const z = 150 + Math.random() * 100; // Far end (150-250)
        const ratio = Math.max(0, 1.0 - (Math.min(1.0, (250 - z) / 223) * 1.5));
        const roadX = -Math.cos(z * 0.1) * 3.0 * ratio;

        const x = (roadX + (Math.random() - 0.5) * 150);

        if (Math.abs(x - roadX) < 10.0) continue;
        if (!isLocationValid(x, z, 5.0)) continue;

        const tree = createSimpleTree(x, z);
        tree.scale.multiplyScalar(0.8);
        if (typeof alignToPlanet === 'function') alignToPlanet(tree, x, z);
        placedPoints.push({ x, z });
    }

    // CLEANUP PASS: Remove any trees accidentally placed on the road or driveway
    if (window.swayTrees && window.swayTrees.length > 0) {
        const kept = [];
        for (let t of window.swayTrees) {
            const x = t.position.x;
            const z = t.position.z;
            // Reuse same exclusions as isLocationBlocked (road, driveway, roundabout)
            const onRoad = (z > 26 && Math.abs(x) < 5);
            const onDriveway = (x > -2 && x < 12 && z > 18 && z < 28) || (x > 7.5 && x < 12.5 && z > 3 && z < 20);
            if (onRoad || onDriveway || (typeof window.isLocationBlocked === 'function' && window.isLocationBlocked(x, z))) {
                try { worldGroup.remove(t); } catch (e) { }
            } else {
                kept.push(t);
            }
        }
        window.swayTrees = kept;
    }

    const glowTex = createGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0x8800ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        fog: false
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.position.set(0, -20, -180);
    glowSprite.scale.set(1000, 800, 1);
    worldGroup.add(glowSprite);

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
    const ffMat = new THREE.PointsMaterial({ color: 0xaacc00, size: 0.15, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });

    fireflies = new THREE.Points(ffGeo, ffMat); // Removed 'const' or 'let'
    fireflies.userData = { type: 'fireflies', speeds: ffSpeeds };
    worldGroup.add(fireflies);

    const roundaboutRadius = 7.2; // V-ENHANCED: 1.2x bigger (was 6)
    const roundaboutInnerRadius = 3.5; // KEPT SAME AS REQUESTED
    const roundaboutSegments = 32;
    const roundaboutVertices = [];
    const roundaboutIndices = [];
    const roundaboutZ = 20;

    for (let i = 0; i <= roundaboutSegments; i++) {
        const angle = (i / roundaboutSegments) * Math.PI * 2;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Outer Vertex
        const xOut = cos * roundaboutRadius;
        const zOut = roundaboutZ + sin * roundaboutRadius;
        const yOut = getPlanetY(xOut, zOut) + 0.03; // V-FIX: Higher

        // Inner Vertex
        const xIn = cos * roundaboutInnerRadius;
        const zIn = roundaboutZ + sin * roundaboutInnerRadius;
        const yIn = getPlanetY(xIn, zIn) + 0.03; // V-FIX: Higher

        roundaboutVertices.push(xOut, yOut, zOut); // Even indices: Outer
        roundaboutVertices.push(xIn, yIn, zIn);    // Odd indices: Inner

        if (i < roundaboutSegments) {
            const base = i * 2;
            // Two triangles to form quad
            roundaboutIndices.push(base, base + 2, base + 1); // Out1, Out2, In1
            roundaboutIndices.push(base + 1, base + 2, base + 3); // In1, Out2, In2
        }
    }

    const roundaboutGeo = new THREE.BufferGeometry();
    roundaboutGeo.setAttribute('position', new THREE.Float32BufferAttribute(roundaboutVertices, 3));
    roundaboutGeo.setIndex(roundaboutIndices);
    roundaboutGeo.computeVertexNormals();

    const roundabout = new THREE.Mesh(roundaboutGeo, new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1, // V-UNIFIED
        polygonOffsetUnits: 1
    }));
    roundabout.receiveShadow = true;
    roundabout.castShadow = true; // V-FIX: Hide gap with shadows
    worldGroup.add(roundabout);

    // V-REMOVED: 'LP record' ring as requested by user.






    const moundGeo = new THREE.CylinderGeometry(roundaboutInnerRadius, roundaboutInnerRadius, 0.05, 32);
    const moundMat = new THREE.MeshStandardMaterial({
        map: groundTex,
        color: 0xffffff, // UNTINTED to perfectly match ground texture
        roughness: 1.0
    });
    const mound = new THREE.Mesh(moundGeo, moundMat);

    // Align to Planet Surface
    const mY = getPlanetY(0, roundaboutZ);
    // V-FIX: Layering. Ground (0) -> Road (0.02) -> Mound (0.05)
    mound.position.set(0, mY + 0.01, roundaboutZ); // V-FIX: Lowered (was 0.05)
    mound.name = 'roundaboutMound';

    if (mound.material.map) {
        const moundTex = mound.material.map.clone();
        moundTex.repeat.set(2, 2); // 2x2 tiles on the mound itself
        mound.material.map = moundTex;
    }
    worldGroup.add(mound);

    // V-FIX: Explicitly add the kerb/edge to the mound
    if (typeof addRoundaboutKerb === 'function') {
        addRoundaboutKerb(mound);
    }

    // --- ROUNDABOUT KERB (Fixes Floating Look) ---
    function addRoundaboutKerb(mound) {
        const kerbGeo = new THREE.TorusGeometry(3.55, 0.25, 8, 50); // Bolder Kerb
        const kerbMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5 });
        const kerb = new THREE.Mesh(kerbGeo, kerbMat);
        kerb.rotation.x = Math.PI / 2;
        kerb.position.y = -0.1; // Sits partly in ground
        mound.add(kerb);
    }

    const flowerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8);
    const flowerCols = [0x990000, 0xcc0000, 0x990033];

    for (let p = 0; p < 5; p++) {
        // Create 5 distinct clusters
        const pTheta = Math.random() * Math.PI * 2;
        const pR = Math.random() * (roundaboutInnerRadius * 0.6);
        const pxPatch = pR * Math.cos(pTheta);
        const pzPatch = pR * Math.sin(pTheta);

        for (let i = 0; i < 15; i++) {
            const mat = new THREE.MeshStandardMaterial({ color: flowerCols[Math.floor(Math.random() * flowerCols.length)] });
            const flower = new THREE.Mesh(flowerGeo, mat);
            const r = Math.random() * 0.8;
            const theta = Math.random() * Math.PI * 2;
            // Sitting on top of our flush disk
            flower.position.set(pxPatch + r * Math.cos(theta), 0.03, pzPatch + r * Math.sin(theta));
            mound.add(flower);
        }
    }

    // V-NEW: Black and White Gravel Footpath
    function createBWGravelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 30000; i++) {
            const shade = Math.random();
            // Darker gravel: #111111 mixed with #333333
            ctx.fillStyle = shade > 0.5 ? '#333333' : '#111111';
            const size = Math.random() * 3 + 1;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 12);
        return tex;
    }

    const gravelTex = createBWGravelTexture();

    // Gravel platform — 20 wide × 18 deep, centred at (2,2) so north edge reaches z=11
    // (inside the bush line at gZMax=11.5). Matches /house/ dimensions.
    const platGeo = new THREE.PlaneGeometry(20, 18);
    platGeo.rotateX(-Math.PI / 2);

    const gravelMat = new THREE.MeshStandardMaterial({
        map: gravelTex,
        roughness: 1.0,
        color: 0xdddddd,
        transparent: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: 1
    });
    const gravelPlatform = new THREE.Mesh(platGeo, gravelMat);
    const px = 2, pz = 2; // centred at (2,2) — north edge at z=11, south edge at z=-7
    alignToPlanet(gravelPlatform, px, pz);

    // V-FIX Layering: Driveway (0.08) -> Road (0.10) -> Gravel (0.12)
    gravelPlatform.translateY(0.12);
    gravelPlatform.renderOrder = 5;

    gravelPlatform.receiveShadow = true;
    worldGroup.add(gravelPlatform);

    // V-FIX: DRIVEWAY — curved path from roundabout → garage (matches /house/)
    function buildDriveway() {
        // Quadratic bezier sweeping from the road/roundabout junction (x=0, z=26)
        // hard-right to x=10 (east/garage side), then down to garage at z=5.
        // This path runs OUTSIDE the compound on the grass — it IS the visible
        // connecting road between the roundabout and the compound/garage.
        const P0_drive = new THREE.Vector2(0, 26);   // Match main road end at roundabout
        const P1_drive = new THREE.Vector2(10, 22);  // Curve corner
        const P2_drive = new THREE.Vector2(10, 5.0); // Reach toward garage (10, 3.5)

        const drivewayPoints = [];
        const segmentsArr = 80;
        for (let i = 0; i <= segmentsArr; i++) {
            const t = i / segmentsArr;
            const bx = (1 - t) * (1 - t) * P0_drive.x + 2 * (1 - t) * t * P1_drive.x + t * t * P2_drive.x;
            const bz = (1 - t) * (1 - t) * P0_drive.y + 2 * (1 - t) * t * P1_drive.y + t * t * P2_drive.y;
            drivewayPoints.push(new THREE.Vector2(bx, bz));
        }

        const dVertices = [];
        const dIndices = [];

        for (let i = 0; i < drivewayPoints.length; i++) {
            const p = drivewayPoints[i];
            const prev = drivewayPoints[Math.max(0, i - 1)];
            const next = drivewayPoints[Math.min(drivewayPoints.length - 1, i + 1)];
            const tangent = new THREE.Vector2().subVectors(next, prev).normalize();
            if (tangent.lengthSq() === 0) tangent.set(1, 0);
            const normal = new THREE.Vector2(-tangent.y, tangent.x);

            // Constant width — no flare
            const w = 4.5;

            const pL = new THREE.Vector2().copy(p).addScaledVector(normal, -w / 2);
            const pR = new THREE.Vector2().copy(p).addScaledVector(normal, w / 2);

            const yL = getPlanetY(pL.x, pL.y) + 0.08;
            const yR = getPlanetY(pR.x, pR.y) + 0.08;

            dVertices.push(pL.x, yL, pL.y);
            dVertices.push(pR.x, yR, pR.y);

            if (i < drivewayPoints.length - 1) {
                const base = i * 2;
                dIndices.push(base, base + 1, base + 2);
                dIndices.push(base + 2, base + 1, base + 3);
            }
        }

        const dGeo = new THREE.BufferGeometry();
        dGeo.setAttribute('position', new THREE.Float32BufferAttribute(dVertices, 3));
        dGeo.setIndex(dIndices);
        dGeo.computeVertexNormals();

        const dRoad = new THREE.Mesh(dGeo, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: 1
        }));
        dRoad.renderOrder = 10;
        dRoad.receiveShadow = true;
        worldGroup.add(dRoad);
    }
    buildDriveway();

} // End of buildWorld block




function startOpeningAnimation() {
    const getVal = (id, def) => {
        const el = document.getElementById(id);
        if (!el) {
            return def;
        }
        const val = parseFloat(el.value);
        if (isNaN(val)) {
            return def;
        }
        return val;
    };

    const animState = {
        px: getVal('fc-sx', -2.8),
        py: getVal('fc-sy', 51.9),
        pz: getVal('fc-sz', 175.9),
        tx: getVal('fc-slx', -1.94),
        ty: getVal('fc-sly', -20.5),
        tz: getVal('fc-slz', -0.94),
        fogFar: 500
    };

    // Force Camera there immediately
    camera.position.set(animState.px, animState.py, animState.pz);
    controls.target.set(animState.tx, animState.ty, animState.tz);
    controls.update();

    const targetState = {
        px: getVal('fc-ex', 14.0),
        py: getVal('fc-ey', 12.0),
        pz: getVal('fc-ez', 18.0),
        tx: getVal('fc-elx', 0),
        ty: getVal('fc-ely', 0),
        tz: getVal('fc-elz', 0),
        fogFar: 300 // V-SYNC
    };

    const duration = getVal('fc-dur', 6000);

    // 1. Mist Animation REMOVED (V130)

    // Hide Start Button
    const startBtnContainer = document.getElementById('start-btn-container');
    if (startBtnContainer) {
        startBtnContainer.style.opacity = '0';
        setTimeout(() => { startBtnContainer.style.display = 'none'; }, 1000);
    }

    // 2. Camera Tween
    window.isZoomingToRoom = true;
    controls.enabled = false;

    new TWEEN.Tween(animState)
        .to(targetState, duration)
        .onUpdate(() => {
            camera.position.set(animState.px, animState.py, animState.pz);
            controls.target.set(animState.tx, animState.ty, animState.tz);
            controls.update();
            if (scene.fog) scene.fog.far = animState.fogFar;
        })

        // V-REFINE: Smoother Landing (Cubic Out) vs Quadratic InOut
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
            controls.enabled = true;
            window.introFinished = true;
            window.isZoomingToRoom = false;

            // Trigger Narrative Prompt (Name entry) — shortly after flight lands & settles

            // V-FIX: Fade in navigation icons after landing
            const navs = ['top-left-controls', 'top-controls'];
            navs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.opacity = '1';
                    el.style.pointerEvents = 'auto';
                }
            });

            // Signal parent (index.html) to show sidebar controls
            if (window.parent) {
                window.parent.postMessage('introFinished', '*');
            }

            setTimeout(() => {
                if (window.initNarrativePrompt) {
                    window.initNarrativePrompt(true); // forceShow=true so the overlay actually appears
                }
            }, 1500);
        })
        .start();

}

window.testFlightPath = function () {

    // 1. Force Disable Free Roam (to prevent conflicts)
    if (window.isFreeRoam) {
        window.toggleFreeRoam();
    }

    // 2. Kill existing tweens to prevent fighting
    TWEEN.removeAll();

    // 3. Reset State
    window.introFinished = false;

    // 4. Re-run animation
    startOpeningAnimation();
};

window.isFreeRoam = false;
window.toggleFreeRoam = function () {
    window.isFreeRoam = !window.isFreeRoam;
    const btn = document.getElementById('btn-freeroam');
    if (window.isFreeRoam) {
        controls.enabled = true;
        window.isZoomingToRoom = false; // unlock
        if (btn) {
            btn.innerText = "DISABLE FREE ROAM";
            btn.style.background = "#0f0";
            btn.style.color = "#000";
        }
    } else {
        controls.enabled = false; // Default during intro/house view
        if (btn) {
            btn.innerText = "ENABLE FREE ROAM";
            btn.style.background = "#444";
            btn.style.color = "#fff";
        }
    }
};

window.capturePosition = function (type) {
    const p = camera.position;
    const prefix = type === 's' ? 'fc-s' : 'fc-e';
    document.getElementById(prefix + 'x').value = p.x.toFixed(1);
    document.getElementById(prefix + 'y').value = p.y.toFixed(1);
    document.getElementById(prefix + 'z').value = p.z.toFixed(1);
};

window.captureTarget = function (type) {
    const t = controls.target;
    // Default to 's' if undefined (legacy safety) but UI passes 's' or 'e' now
    const kind = type || 's';
    const prefix = kind === 's' ? 'fc-sl' : 'fc-el';

    // Check if element exists before setting (robustness)
    const elX = document.getElementById(prefix + 'x');
    if (elX) elX.value = t.x.toFixed(2);

    const elY = document.getElementById(prefix + 'y');
    if (elY) elY.value = t.y.toFixed(2);

    const elZ = document.getElementById(prefix + 'z');
    if (elZ) elZ.value = t.z.toFixed(2);
};

function startHeaderAnimation() {
    // Send message to parent (index.html) to trigger animation
    if (window.parent) window.parent.postMessage({ type: 'START_HEADER_ANIM' }, '*');

    // Also fade out the button container explicitly
    const btnContainer = document.getElementById('start-btn-container');
    if (btnContainer) btnContainer.style.opacity = '0';
}

// --- 3D INTRO TRIGGER (V1950) ---
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'START_EXPERIENCE') {
        window.enterExperience();
    }
});

window.enterExperience = function () {
    // 1. Fullscreen (Target the whole doc or container)
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => { });

    // 1.5 Wake Lock
    if (window.requestWakeLock) window.requestWakeLock();

    // V-FIX 2026: Show top controls only after JUMP IN
    const topControls = document.getElementById('top-controls');
    if (topControls) {
        topControls.style.opacity = '1';
        topControls.style.pointerEvents = 'auto';
    }

    const topLeftControls = document.getElementById('top-left-controls');
    if (topLeftControls) {
        topLeftControls.style.opacity = '1';
        topLeftControls.style.pointerEvents = 'auto';
    }

    // 2. Play Tension Audio
    const audio = new Audio(houseConfig.audio.tension);
    audio.volume = 0.8;
    audio.currentTime = 0.5;
    audio.play().catch(() => { });

    setTimeout(() => {
        const fadeOut = setInterval(() => {
            if (audio.volume > 0.05) audio.volume -= 0.05;
            else {
                audio.pause();
                clearInterval(fadeOut);
            }
        }, 100);
    }, 6000);

    // Chain Main Music
    audio.onended = () => {
        // V-FIX: ONLY play intro music if we are NOT already in a room
        if (window.audioPlayer && !window.currentRoom) {
            setTimeout(() => {
                if (window.currentRoom) return; // double check
                window.audioPlayer.src = houseConfig.audio.intro;
                window.audioPlayer.loop = true; // Intro should loop
                window.audioPlayer.play().then(() => {
                    window.isMusicPlaying = true;
                }).catch(() => {
                    window.isMusicPlaying = true; // Still mark as wanting to play for global click recovery
                });
            }, 2000);
        }
    };

    // 4. Start Flight Immediately
    startOpeningAnimation();

};




function createBasementInterior() {
    // -- METROPOLIS --
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    const gridHelper = new THREE.GridHelper(10, 10, 0x00ffcc, 0x222222);
    gridHelper.position.y = 0.05;
    interiorGroup.add(gridHelper);

    // Floating Nodes - enhanced 3D appearance
    const nodeCount = 60;
    for (let i = 0; i < nodeCount; i++) {
        const isTruth = i % 2 === 0;
        // Use small icosahedron for faceted 3D look, with slight size variation
        const size = 0.06 + Math.random() * 0.06;
        const nodeGeo = new THREE.IcosahedronGeometry(size, 1);

        // Physical material for highlights + emissive core for depth
        const baseColor = isTruth ? 0x0033cc : 0xcc3300;
        const nodeMat = new THREE.MeshPhysicalMaterial({
            color: baseColor,
            emissive: baseColor,
            emissiveIntensity: 0.4,
            roughness: 0.35,
            metalness: 0.6,
            clearcoat: 0.2,
            reflectivity: 0.5
        });

        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.castShadow = false; node.receiveShadow = false;

        // Add small inner glow sprite for volumetric feel
        const spriteCanvas = document.createElement('canvas'); spriteCanvas.width = 64; spriteCanvas.height = 64;
        const sctx = spriteCanvas.getContext('2d');
        const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,0.8)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.25)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        sctx.fillStyle = grad; sctx.fillRect(0, 0, 64, 64);
        const spriteTex = new THREE.CanvasTexture(spriteCanvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex, color: baseColor, transparent: true, opacity: 0.6, depthWrite: false }));
        sprite.scale.set(size * 3.5, size * 3.5, 1);
        sprite.position.set(0, 0, 0);
        node.add(sprite);

        // Slight positional jitter and starting position
        node.position.set((Math.random() - 0.5) * 7.5, Math.random() * 6 + 0.8, (Math.random() - 0.5) * 7.5);
        node.userData = {
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.012),
            originalY: node.position.y,
            isTruth: isTruth,
            baseSize: size
        };
        basementNodes.push(node);
        interiorGroup.add(node);
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry();
    basementLines = new THREE.LineSegments(lineGeo, lineMat);
    interiorGroup.add(basementLines);

    // TRON VIDEO - Robust playback with retry
    if (window.isMusicPlaying && typeof initAudioAnalyser === 'function') {
        initAudioAnalyser();
    }

    // Stop any existing video playback to prevent conflicts
    if (videoElement && !videoElement.paused) {
        videoElement.pause();
    }

    // RIGHT WALL VIDEO // Set up video with proper sequencing
    videoElement.src = "/assets/video/brin.mp4";
    videoElement.muted = true; // Must start muted for autoplay
    videoElement.loop = false;

    videoElement.setAttribute('playsinline', '');

    // Create texture BEFORE loading to ensure it's ready
    videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Create and add mesh BEFORE playing video
    const bgMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 8),
        new THREE.MeshBasicMaterial({
            map: videoTexture,
            opacity: 0.5,
            transparent: true,
            blending: THREE.AdditiveBlending
        })
    );
    bgMesh.position.set(0, 4, -4.9);
    bgMesh.userData = { type: 'basementVideo', persistent: true };
    interiorGroup.add(bgMesh);

    // LEFT WALL VIDEO - behind the playlist
    if (!window.basementLeftVideo) {
        window.basementLeftVideo = document.createElement('video');
        window.basementLeftVideo.crossOrigin = "anonymous";
        window.basementLeftVideo.loop = true;
        window.basementLeftVideo.muted = true;
        window.basementLeftVideo.setAttribute('playsinline', '');
    }
    window.basementLeftVideo.src = "/assets/video/links.mp4";
    window.basementLeftVideo.load();
    const leftVideoTexture = new THREE.VideoTexture(window.basementLeftVideo);

    // V-FIX: Intermittent Glitch Shader for Left Video
    const glitchMat = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: leftVideoTexture },
            uTime: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float uTime;

            float rand(vec2 co) {
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = vUv;
                
                // Burst-based glitch triggers
                float timeStep = floor(uTime * 15.0); 
                float glitchThreshold = 0.93; // Bursty
                float g = rand(vec2(timeStep, 0.0));
                
                float jump = 0.0;
                float split = 0.0;

                if (g > glitchThreshold) {
                    float intensity = (g - glitchThreshold) / (1.0 - glitchThreshold);
                    
                    // 1. Precise Jitter (Thinner segments, smaller offset)
                    float stripY = floor(uv.y * 80.0); // Thinner strips
                    if (rand(vec2(timeStep, stripY)) > 0.7) {
                        jump = (rand(vec2(timeStep, stripY)) - 0.5) * 0.02 * intensity;
                    }
                    
                    // 2. Refined RGB Split
                    split = 0.015 * intensity;
                }

                // Apply Shifts
                uv.x += jump;

                float r = texture2D(uTexture, uv + vec2(split, 0.0)).r;
                float g_col = texture2D(uTexture, uv).g;
                float b = texture2D(uTexture, uv - vec2(split, 0.0)).b;

                vec4 texColor = vec4(r, g_col, b, 1.0);
                
                // Micro-noise during glitch (Very subtle)
                if (g > glitchThreshold) {
                    float noise = rand(uv + uTime) * 0.08;
                    texColor.rgb += noise;
                }

                gl_FragColor = texColor * 0.55;
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    animatedShaderMaterials.push(glitchMat);

    const leftMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 8),
        glitchMat
    );
    // Position on Left Wall (x = -4.995 to be behind playlist at -4.99)
    leftMesh.position.set(-4.995, 4, 0);
    leftMesh.rotation.y = Math.PI / 2;
    leftMesh.userData = { type: 'basementLeftVideo', persistent: true };
    interiorGroup.add(leftMesh);

    // Retry logic for playback
    let playAttempts = 0;
    const maxAttempts = 3;

    const attemptPlay = () => {
        playAttempts++;

        // Play main video
        videoElement.play().catch(() => { });

        // Play left video
        if (window.basementLeftVideo) {
            window.basementLeftVideo.play()
                .then(() => {
                    if (!window.basementVideoMonitor) {
                        window.basementVideoMonitor = setInterval(() => {
                            if (currentRoom === 'basement') {
                                // Monitor back wall video
                                if (videoElement && videoElement.paused && videoElement.readyState >= 2) {
                                    videoElement.play().catch(() => { });
                                }
                                // Monitor left wall video
                                if (window.basementLeftVideo && window.basementLeftVideo.paused && window.basementLeftVideo.readyState >= 2) {
                                    window.basementLeftVideo.play().catch(() => { });
                                }
                            }
                        }, 1000);
                    }
                })
                .catch(e => {
                    if (playAttempts < maxAttempts) {
                        setTimeout(attemptPlay, 500);
                    }
                });
        }
    };

    // Start playback after a brief delay to ensure mesh is in scene
    setTimeout(attemptPlay, 100);

    // V-FIX: Ensure audio analyser is active for basement nodes
    if (window.isMusicPlaying && typeof initAudioAnalyser === 'function') {
        initAudioAnalyser();
    }

    if (window.addReflectionMarker) window.addReflectionMarker('basement', 0, 1.5, -4.5);
}

function buildInterior(roomKey) {
    // V-FIX: Stop Living Room Video if playing
    if (window.stopLivingVideo) window.stopLivingVideo();

    // Cleanup Studio video monitor when leaving Studio
    if (window.studioVideoMonitor) {
        clearInterval(window.studioVideoMonitor);
        window.studioVideoMonitor = null;
        window.studioVideos = null;
    }

    // Cleanup Basement video monitor when leaving Basement
    if (window.basementVideoMonitor) {
        clearInterval(window.basementVideoMonitor);
        window.basementVideoMonitor = null;
    }

    while (interiorGroup.children.length > 0) { interiorGroup.remove(interiorGroup.children[0]); }
    interiorClickables.length = 0;
    atomGroup = null;
    noteTextSprite = null;
    basementNodes = [];
    basementLines = null;
    currentTrackIndex = 0;
    masterVideoIndex = -1; // V-FIX: Default to NO video selected (Screensaver/Paused frame)
    isTVVideoMode = false;
    musicPanelMesh = null;
    playlistPanelMesh = null;
    musicSwitchMesh = null;
    // Clear Shader Animations on room switch
    animatedShaderMaterials = [];

    let data = roomContent[roomKey];
    if (!data && roomKey === 'space') {
        data = { title: 'The Void', description: 'Beyond the known world' };
    }

    if (!data) return;

    if (roomKey === 'space') {
        try {
            createSpaceInterior();
            if (window.applyRoomLighting) window.applyRoomLighting(roomKey);
        } catch (err) {
            console.error(`Failed to create space interior: ${err.message} `, err);
            // Fallback: ensure at least the background is set
            scene.background = new THREE.Color(0x0a0412);
            if (scene.fog) {
                scene.fog.color.setHex(0x0a0412);
                scene.fog.far = 2000;
            }
            // Add a diagnostic sphere so we know something rendered
            const debugSphere = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0xff0080, wireframe: false })
            );
            debugSphere.position.set(0, 1.5, 0);
            interiorGroup.add(debugSphere);
        }
        return;
    }

    const floorColor = roomKey === 'basement' ? 0x050505 : 0x2c2c2c;
    const floorMat = new THREE.MeshStandardMaterial({ color: floorColor });
    let wallMat = new THREE.MeshStandardMaterial({ color: data.hex || 0xffffff, side: THREE.DoubleSide });

    // Hall Floor Pattern
    if (roomKey === 'hall') {
        const checkCanvas = document.createElement('canvas');
        checkCanvas.width = 512; checkCanvas.height = 512;
        const cctx = checkCanvas.getContext('2d');
        cctx.fillStyle = '#ffffff';
        cctx.fillRect(0, 0, 512, 512);
        cctx.fillStyle = '#111111';
        const w = 512, h = 512;
        const stepX = 128, stepY = 128;
        for (let y = -stepY; y < h + stepY; y += stepY) {
            cctx.beginPath();
            cctx.moveTo(0, y);
            for (let x = 0; x <= w; x += stepX / 2) {
                const alt = (x / (stepX / 2)) % 2 === 0 ? 0 : stepY / 2;
                cctx.lineTo(x, y + alt);
            }
            cctx.lineTo(w, y + stepY);
            for (let x = w; x >= 0; x -= stepX / 2) {
                const alt = (x / (stepX / 2)) % 2 === 0 ? stepY / 2 : stepY;
                cctx.lineTo(x, y + alt);
            }
            cctx.closePath();
            cctx.fill();
        }
        const tex = new THREE.CanvasTexture(checkCanvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        floorMat.map = tex;
        floorMat.color.set(0xffffff);
        floorMat.roughness = 0.4;
    }

    // Audio Analyser Initialization
    if ((roomKey === 'basement' || roomKey === 'music' || roomKey === 'attic') && typeof initAudioAnalyser === 'function') {
        initAudioAnalyser();
    }

    // Walls logic parameterized by room data
    const iW = data.interiorWidth || 10;
    const iD = data.interiorDepth || 10;
    const iH = 8;
    const halfW = iW / 2;
    const halfD = iD / 2;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(iW, iD), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    interiorGroup.add(floor);

    // Walls

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(iW, iH), wallMat);
    backWall.position.set(0, iH / 2, -halfD);
    backWall.receiveShadow = true; // V-REFINE: Shadows
    interiorGroup.add(backWall);

    // Hall Left Wall (Music Wall) Deep Green Texture
    let finalLeftWallMat = wallMat;
    if (roomKey === 'hall' && typeof createHallGreenMaterial === 'function') {
        finalLeftWallMat = createHallGreenMaterial();
    }

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(iD, iH), finalLeftWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-halfW, iH / 2, 0);
    leftWall.receiveShadow = true; // V-REFINE: Shadows
    interiorGroup.add(leftWall);

    // Open Plan: No Right Wall added for narrow rooms.

    // V-FIX: Do NOT add generic bulb for Living Room (It has custom lighting)
    if (roomKey !== 'living') {
        const bulb = new THREE.PointLight(0xffffff, 0.8, 20);
        bulb.position.set(0, 6, 0);
        interiorGroup.add(bulb);
    }

    // V325-v326: Scale and zOffset now handled internally by music.js
    // V325-v326: Scale and zOffset now handled internally by music.js
    if (window.createMusicPanel) {
        window.createMusicPanel(data.playlist);
    } else {
    }

    // Auto-play music when entering room
    if (data.playlist && data.playlist.length > 0) {
        setTimeout(() => {
            // Force play if paused OR if not marked as playing
            const shouldStart = !window.isMusicPlaying || (window.audioPlayer && window.audioPlayer.paused);
            if (window.toggleMusic && shouldStart) {
                // If it was marked as playing but is actually paused, toggleMusic might pause it again.
                // So if isMusicPlaying is true, we should probably reset it or call playTrack directly.
                if (window.isMusicPlaying && window.playTrack) {
                    window.playTrack(window.currentTrackIndex || 0);
                } else {
                    window.toggleMusic();
                }
            }
        }, 500); // 500ms delay to ensure everything is initialized
    }

    if (roomKey === 'living') {
        if (typeof createLivingRoomInterior === 'function') createLivingRoomInterior();
    }
    else if (roomKey === 'bedroom') {
        if (typeof createBedroomInterior === 'function') createBedroomInterior();
    }
    else if (roomKey === 'studio') {
        if (typeof createStudioInterior === 'function') createStudioInterior();
    }
    else if (roomKey === 'toilet') {
        if (typeof createToiletInterior === 'function') createToiletInterior();
    }
    else if (roomKey === 'hall') {
        if (typeof createHallInterior === 'function') createHallInterior();
    }
    else if (roomKey === 'attic') {
        if (typeof createAtticInterior === 'function') createAtticInterior();
    }
    else if (roomKey === 'basement') {
        // Safety check for basement interior
        if (typeof createBasementInterior === 'function') {
            createBasementInterior();
        } else {
            createGenericInterior(data.title);
        }
    }
    else if (roomKey === 'bathroom') {
        if (typeof createBathroomInterior === 'function') createBathroomInterior();
    }
    else if (roomKey === 'annex') {
        // V148: Annex Interior (Added)
        // Set specific lights? Handled by buildInterior generic dark logic below?
        // Actually line 1752 handles 'dark' for most rooms.
        // We'll createInterior here.
        if (typeof createAnnexInterior === 'function') {
            createAnnexInterior();
        } else {
            createGenericInterior(data.title);
        }
    }
    else if (roomKey === 'garage') {
        // Garage Interior - shows void portal to space
        if (typeof createGarageInterior === 'function') {
            createGarageInterior();
        } else {
            createGenericInterior(data.title);
        }
    }

    else createGenericInterior(data.title);

    // V114: Force Lighting Update for Room
    if (window.applyRoomLighting) window.applyRoomLighting(roomKey);
}

function performClick(event) {
    if (!event) return; // V-FIX: Guard against undefined event
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    if (state === 'HOUSE') {
        // V-FIX: Support custom handlers (like Garage Door) in HOUSE state
        const intersects = raycaster.intersectObjects(worldGroup.children, true);

        let validTarget = null;
        let intersectInfo = null;

        for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            if (obj.userData && obj.userData.ignore) continue;

            let bubbleTarget = obj;
            let found = false;
            while (bubbleTarget && bubbleTarget !== worldGroup) {
                if ((bubbleTarget.userData && bubbleTarget.userData.onClick) ||
                    (bubbleTarget.userData && bubbleTarget.userData.name && window.roomContent && window.roomContent[bubbleTarget.userData.name])) {
                    found = true;
                    break;
                }
                bubbleTarget = bubbleTarget.parent;
            }
            if (found) {
                validTarget = obj;
                intersectInfo = intersects[i];
                break;
            }
        }

        if (validTarget) {
            let target = validTarget;
            let handlerFound = false;

            // 1. Check for Custom Handler first
            let bubbleTarget = target;
            while (bubbleTarget && bubbleTarget !== worldGroup) {
                if (bubbleTarget.userData && bubbleTarget.userData.onClick) {
                    bubbleTarget.userData.onClick(intersectInfo);
                    handlerFound = true;
                    break;
                }
                bubbleTarget = bubbleTarget.parent;
            }

            if (handlerFound) return;

            // 2. Fallback to Room Entry (Original Logic)
            while (target && (!target.userData || !target.userData.name)) { target = target.parent; }
            if (target && target.userData && target.userData.name) {
                // Only enter if it's a valid room (avoid garage components triggering entry errors)
                if (window.roomContent && window.roomContent[target.userData.name]) {
                    enterRoom(target.userData.name);
                } else {
                    console.log("roomContent not loaded");
                }
            }
        }
    } else if (state === 'ROOM') {
        // V-DEBUG: Log what we are checking against
        const intersects = raycaster.intersectObjects(interiorClickables, true);

        let validTarget = null;
        let intersectInfo = null;

        for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            if (obj.userData && obj.userData.ignore) continue;

            let bubbleTarget = obj;
            let found = false;
            while (bubbleTarget && bubbleTarget !== interiorGroup) {
                if ((bubbleTarget.userData && bubbleTarget.userData.onClick) ||
                    (bubbleTarget.userData && bubbleTarget.userData.type)) {
                    found = true;
                    break;
                }
                bubbleTarget = bubbleTarget.parent;
            }
            if (found) {
                validTarget = obj;
                intersectInfo = intersects[i];
                break;
            }
        }

        if (validTarget) {
            let target = validTarget;
            let handlerFound = false;

            while (target && target !== interiorGroup) {
                // V-DEBUG: Bubbling up...
                if (target.userData && target.userData.onClick) {
                    target.userData.onClick(intersectInfo);
                    handlerFound = true;
                    break;
                }

                // Fallback for older type-based logic if no explicit onClick but has type
                // (Only if we haven't standardized everything to onClick yet)
                if (target.userData && target.userData.type) {
                    if (target.userData.type === 'tv') {
                        if (window.nextTVContent) window.nextTVContent();
                        else console.error("nextTVContent function not found!");
                        handlerFound = true; break;
                    }
                    else if (target.userData.type === 'phone') { toggleVideo(); handlerFound = true; break; }
                    else if (target.userData.type === 'videoPhone') { toggleVideo(); handlerFound = true; break; }
                    else if (target.userData.type === 'musicSwitch') { toggleMusic(); handlerFound = true; break; }
                    else if (target.userData.type === 'notepad') { openIdeaOverlay(); handlerFound = true; break; }
                    else if (target.userData.type === 'deckOfCards') {
                        if (window.drawConversationTopic) window.drawConversationTopic();
                        handlerFound = true; break;
                    }
                    else if (target.userData.type === 'atticAudioToggle') {
                        if (target.toggleAudio) target.toggleAudio();
                        handlerFound = true; break;
                    }
                    else if (target.userData.type === 'bathroomMirrorButton') {
                        if (target.toggleMirror) target.toggleMirror();
                        else if (target.userData.toggleMirror) target.userData.toggleMirror();
                        else if (window.toggleBathroomMirror) window.toggleBathroomMirror();
                        handlerFound = true; break;
                    }
                    else if (target.userData.type === 'musicPanel') { nextTrack(); handlerFound = true; break; }
                    else if (target.userData.type === 'songItem') { playTrack(target.userData.index); handlerFound = true; break; }
                    else if (target.userData.type === 'tvVideoItem') { if (typeof playTVVideo === 'function') playTVVideo(target.userData.index); handlerFound = true; break; }
                    else if (target.userData.type === 'videoItem') { playVideo(target.userData.index); handlerFound = true; break; }
                    else if (target.userData.type === 'videoPlayButton') { toggleVideo(); handlerFound = true; break; }
                    else if (target.userData.type === 'mmAnimationClose') { stopMMAnimation(); handlerFound = true; break; }
                    else if (target.userData.type === 'diary') { openDiaryPopup(); handlerFound = true; break; }
                    else if (target.userData.type === 'laptop') { startGoldenRatioAnimation(); handlerFound = true; break; }
                }

                target = target.parent;
            }

            if (!handlerFound) {
            }
        }
    }
}


// --- HELPERS & LOGIC ---


// START VIDEO CLIP
function startVideoClip(room) {
    const playlist = roomContent[room].videoPlaylist;
    if (!playlist) {
        console.warn('⚠️ No video playlist for room:', room);
        return;
    }
    const clip = playlist[masterVideoIndex];
    if (!clip) {
        console.warn('⚠️ No clip at index:', masterVideoIndex);
        return;
    }

    console.log('🎬 Starting video clip:', clip.title || clip.src, 'in room:', room);

    videoElement.crossOrigin = 'anonymous'; // must precede .src assignment
    videoElement.src = clip.src;
    videoElement.load(); // V-FIX: Ensure video loads
    // V55: Ensure Unmuted
    videoElement.muted = false;
    videoElement.loop = false; // V-FIX: Reset loop state for each clip
    // V-FIX 259: Per-clip volume (Default lowered to 0.3 from 0.6)
    videoElement.volume = (typeof clip.volume !== 'undefined') ? clip.volume : 0.3;

    videoElement.play().catch((err) => {
        console.error('❌ Video play error:', err);
        // Try to resume audio context if suspended
        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume().then(() => {
                console.log('🔊 Audio context resumed, retrying video play');
                videoElement.play().catch(e => console.error('❌ Retry failed:', e));
            });
        }
    });

    // Stop room music when video starts
    if (window.audioPlayer && !window.audioPlayer.paused) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
        if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
    }

    if (room === 'living' && tvMesh) {
        videoTexture = new THREE.VideoTexture(videoElement);
        tvMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture });
        tvMesh.material.needsUpdate = true;

        // V-FIX 265: Darker Environment for Video (But keep a base glow V289)
        if (window.ambientLight) window.ambientLight.intensity = 0.0; // V298: BLACKOUT
        if (window.dirLight) window.dirLight.intensity = 0.0; // V298: BLACKOUT
    } else if (room === 'bedroom') {
        // Find screen on phone
        const phone = interiorGroup.children.find(c => c.userData.type === 'videoPhone');
        if (phone) {
            const phoneScreenMesh = phone.getObjectByName('screen');
            if (phoneScreenMesh) {
                // V-FIX: Create new texture each time to ensure it updates
                videoTexture = new THREE.VideoTexture(videoElement);
                phoneScreenMesh.material.map = videoTexture;
                phoneScreenMesh.material.needsUpdate = true;
                console.log('✅ Bedroom video texture updated');
            } else {
                console.warn('⚠️ Phone screen mesh not found');
            }
        } else {
            console.warn('⚠️ Video phone not found in bedroom');
        }
    }
}



// TOGGLE VIDEO (Button Click)
function toggleVideo() {
    let btn = interiorGroup.children.find(c => c.userData.type === 'videoPlayButton');
    // V-FIX: Support Bedroom/Bathroom's single button control type
    if (!btn) {
        interiorGroup.traverse(c => {
            if (c.userData.type === 'videoControlSingle') btn = c;
        });
    }
    if (!btn) return;

    if (videoElement.paused) {
        // PLAY
        // V55: Ensure Unmute
        videoElement.muted = false;
        videoElement.volume = 0.8;
        videoElement.play().catch(() => { });

        btn.userData.state = 'playing';
        btn.material.color.setHex(0x00ff00); // Green
        btn.material.emissive.setHex(0x004400);

        // Stop music
        if (window.isMusicPlaying) {
            window.audioPlayer.pause();
            window.isMusicPlaying = false;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
        }

        // V-FIX 265: Darken if Living Room (V289: Brighter Video Shadows)
        if (typeof currentRoom !== 'undefined' && currentRoom === 'living') {
            if (window.ambientLight) window.ambientLight.intensity = 0.0;
            if (window.dirLight) window.dirLight.intensity = 0.0;
        }

    } else {
        // PAUSE
        videoElement.pause();
        btn.userData.state = 'paused';
        btn.material.color.setHex(0xffff00); // Yellow for Paused
        btn.material.emissive.setHex(0x444400);

        // Restore Lights
        if (typeof currentRoom !== 'undefined') {
            if (currentRoom === 'living') {
                if (window.ambientLight) window.ambientLight.intensity = HOUSE_DEFAULTS.ambientIntensity;
                if (window.dirLight) window.dirLight.intensity = HOUSE_DEFAULTS.dirIntensity;
            } else if (currentRoom === 'bedroom') {
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.25 }, 1000).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.3 }, 1000).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.3 }, 1000).start();
            }
        }
    }
}



function openIdeaOverlay() {
    document.getElementById('idea-overlay').style.display = 'flex';
    try {
        const savedIdea = localStorage.getItem('memoryHouse_idea');
        if (savedIdea) document.getElementById('idea-text').value = savedIdea;
    } catch (e) { }
}

function closeIdeaOverlay() {
    document.getElementById('idea-overlay').style.display = 'none';
}

function saveIdea() {
    const text = document.getElementById('idea-text').value;
    try {
        localStorage.setItem('memoryHouse_idea', text);
    } catch (e) { }
    closeIdeaOverlay();
}

// Diary Popup (Annex) - Updated to 3D Hologram with Animation
window.openDiaryPopup = function () {
    if (!window.diaryHologram) return;

    if (!window.diaryHologram.userData.isOpen) {
        // --- GROW ---
        window.diaryHologram.visible = true;
        window.diaryHologram.scale.set(0, 0, 0);
        new TWEEN.Tween(window.diaryHologram.scale)
            .to({ x: 1, y: 1, z: 1 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        window.diaryHologram.userData.isOpen = true;
    } else {
        // --- SHRINK ---
        new TWEEN.Tween(window.diaryHologram.scale)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                window.diaryHologram.visible = false;
            })
            .start();
        window.diaryHologram.userData.isOpen = false;
    }
};

window.closeDiaryPopup = function () {
    if (window.diaryHologram && window.diaryHologram.userData.isOpen) {
        window.diaryHologram.userData.isOpen = false;
        new TWEEN.Tween(window.diaryHologram.scale)
            .to({ x: 0, y: 0, z: 0 }, 500)
            .onComplete(() => { window.diaryHologram.visible = false; })
            .start();
    }
};

// Robust Info Toggle (Direct Style)
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
        btn.innerHTML = `<svg id="min-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8z" /></svg>`;
    } else {
        // CLOSE IT (Slide Out)
        panel.style.transform = 'translateX(100%)';
        panel.style.pointerEvents = 'none'; // Pass clicks through

        // Icon: Back Arrow Circle (User Request)
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" /></svg>`;
    }
}

function handlePanelClick(e) {
    const panel = document.getElementById('room-info');
    if (panel.classList.contains('minimized')) { toggleInfo(); }
}

// 3D Laptop Message
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

// Helper to clean up all audio/video sources
function stopAllAudio() {
    // 1. Main Music
    if (window.audioPlayer) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
    }
    // 2. Main Video (Living/Bedroom/Bathroom)
    if (window.videoElement && !window.videoElement.paused) {
        window.videoElement.pause();

        // V-FIX 9: Reset Lights if in Bedroom/Living
        if (typeof currentRoom !== 'undefined') {
            if (currentRoom === 'bedroom' && window.stopBedroomVideo) window.stopBedroomVideo();
            if (currentRoom === 'living' && window.stopLivingVideo) window.stopLivingVideo();
        }
    }
    // Clear videoElement src entirely so iOS doesn't resume it in the background
    if (window.videoElement) {
        window.videoElement.pause();
        window.videoElement.removeAttribute('src');
        window.videoElement.load(); // Abort any pending network request
    }
    // 3. Attic Video (Specific)
    const atticVideo = document.getElementById('attic-video');
    if (atticVideo && !atticVideo.paused) {
        atticVideo.pause();
        atticVideo.currentTime = 0; // Reset
    }
}

// V115: Robust Room Lighting System (Global Control)

window.applyRoomLighting = function (roomName) {

    // Default to HOUSE_DEFAULTS as baseline
    let targetAmbient = HOUSE_DEFAULTS.ambientIntensity;
    let targetDir = HOUSE_DEFAULTS.dirIntensity;
    let targetRim = HOUSE_DEFAULTS.rimIntensity;
    let targetHemi = HOUSE_DEFAULTS.hemiIntensity;

    // PER-ROOM OVERRIDES (Kept minimal to match reference style)
    if (roomName === 'basement') {
        targetAmbient = 0.15;
        targetDir = 0.2;
        targetRim = 0.2;
        targetHemi = 0.1;
    }
    else if (roomName === 'bathroom') {
        targetAmbient = 0.6;
        targetDir = 0.8;
        targetRim = 0.5;
        targetHemi = 0.4;
    }
    else if (roomName === 'toilet') {
        targetAmbient = 0.25;
        targetDir = 0.4;
        targetRim = 0.25;
        targetHemi = 0.2;
    } else if (roomName === 'hall') {
        targetAmbient = 0.5;
        targetDir = 0.8;
        targetRim = 0.4;
        targetHemi = 0.3;
    } else if (roomName === 'studio' || roomName === 'annex') {
        targetAmbient = 0.4;
        targetDir = 0.6;
        targetRim = 0.3;
        targetHemi = 0.2;
    } else if (roomName === 'attic') {
        // V-ENHANCED: VERY DARK for beat-reactive lamp atmosphere
        targetAmbient = 0.05;
        targetDir = 0.1;
        targetRim = 0.1;
        targetHemi = 0.05;
    }
    else if (roomName === 'living') {
        targetAmbient = 0.4;
        targetDir = 0.5;
        targetRim = 0.3;
        targetHemi = 0.3;
    }
    else if (roomName === 'bedroom') {
        targetAmbient = 0.25;
        targetDir = 0.3;
        targetRim = 0.3;
        targetHemi = 0.2;
    }
    else if (roomName === 'space') {
        targetAmbient = 0.05;
        targetDir = 0.2;
        targetRim = 0.1;
        targetHemi = 0.05;
    }

    // Apply with Smooth Transitions
    const duration = 1200;
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: targetAmbient }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: targetDir }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: targetRim }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
    if (window.hemiLight) new TWEEN.Tween(window.hemiLight).to({ intensity: targetHemi }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
};

function enterRoom(roomName) {
    // 1. Set room context IMMEDIATELY (V-FIX for UI/Playlist timing)
    window.currentRoom = roomName;
    currentRoom = roomName; // V-FIX: Sync local variable if it exists
    window.currentTrackIndex = 0;
    window.masterVideoIndex = 0;
    state = 'TRANSITION';
    window._wasdEnabled = true; // Enable WASD movement inside rooms

    // 2. Stop prior audio (Non-destructive - no src clearing)
    if (window.audioPlayer) {
        window.audioPlayer.pause();
        window.audioPlayer.currentTime = 0;
        window.isMusicPlaying = false;
    }
    stopAllAudio();

    // V-NEW: Show Room Description Popup
    if (window.showRoomDescription) {
        window.showRoomDescription(roomName);
    }

    if (window.roomContent && window.roomContent[roomName]) {
        const rData = window.roomContent[roomName];

        // Trigger onEnter Hook if defined
        if (rData.onEnter) {
            rData.onEnter();
        }

        if (rData.playlist && rData.playlist.length > 0) {
            setTimeout(() => {
                console.log('🎵 Starting music for room:', roomName);

                // Create music panel first
                if (window.createMusicPanel) window.createMusicPanel(rData.playlist);

                // Auto-play music using playTrack for reliability
                if (window.playTrack) {
                    console.log('🎵 Calling playTrack(0) for:', roomName);
                    window.playTrack(0); // Start first track

                    // CRITICAL for attic: Initialize audio analyzer for reactive lighting
                    if (roomName === 'attic' && typeof initAudioAnalyser === 'function') {
                        setTimeout(() => {
                            console.log('🎵 Initializing audio analyzer for attic lighting');
                            initAudioAnalyser();
                        }, 500);
                    }
                } else if (window.audioPlayer) {
                    // Fallback if playTrack not available
                    console.log('🎵 Using fallback audio player for:', roomName);
                    window.audioPlayer.src = rData.playlist[0].src;
                    window.audioPlayer.volume = rData.playlist[0].volume || 0.5;
                    window.audioPlayer.play().then(() => {
                        console.log('✅ Audio playing successfully');
                        window.isMusicPlaying = true;

                        // Initialize analyzer for attic
                        if (roomName === 'attic' && typeof initAudioAnalyser === 'function') {
                            setTimeout(() => {
                                console.log('🎵 Initializing audio analyzer for attic lighting (fallback)');
                                initAudioAnalyser();
                            }, 500);
                        }
                    }).catch(e => {
                        console.error('❌ Music play error:', e);
                        console.error('Audio context state:', window.audioContext ? window.audioContext.state : 'no context');
                    });
                } else {
                    console.error('❌ No playTrack or audioPlayer available!');
                }
            }, 1000);
        } else {
            console.log('ℹ️ No playlist for room:', roomName);
        }
    }

    if (window.audioPlayer && window.audioPlayer.src && window.audioPlayer.src.includes("NightDrive")) {
        houseMusicTime = window.audioPlayer.currentTime;
    }

    window.isZoomingToRoom = true;
    if (window.parent) window.parent.postMessage({ type: 'ENTERED_ROOM' }, '*');
    const _rvBtn = document.getElementById('reset-view-btn');
    if (_rvBtn) {
        _rvBtn.style.display = 'none'; // Hide reset button when in room
    }
    const bBtn = document.getElementById('back-btn');
    if (bBtn) {
        bBtn.style.display = 'flex'; // Show explicit back button
    }
    const curtain = document.getElementById('curtain');
    curtain.classList.add('active');
    setTimeout(() => {
        try {
            worldGroup.visible = false;

            if (mistLayer) mistLayer.visible = false;

            // V-FIX: Keep Top Header Bar available
            // const appHeader = document.getElementById('app-header');
            // if (appHeader) appHeader.style.display = 'none';

            if (roomName === 'space') {
                scene.background = new THREE.Color(0x0a0412); // DARK VOID PURPLE
                if (scene.fog) {
                    scene.fog.color.setHex(0x0a0412); // Match Fog Color
                    scene.fog.far = 2000;
                }
            } else {
                scene.background = new THREE.Color(0x111111);
                if (scene.fog) {
                    scene.fog.color.setHex(0x111111);
                    scene.fog.far = HOUSE_DEFAULTS.fogFar;
                }
            }

            buildInterior(roomName);
            interiorGroup.visible = true;
            // V15: Angled Camera (Zoomed out slightly)
            if (roomName === 'space') {
                // Space Room Specific Camera - Zoomed IN per user request
                camera.position.set(0, 1.5, 16);
                camera.fov = 45;
                camera.updateProjectionMatrix();
                controls.target.set(0, 1.5, 0); // Look at Center
            } else {
                // Reset FOV in case it was changed by a previous room
                if (camera.fov !== 45) { camera.fov = 45; camera.updateProjectionMatrix(); }

                // V-NEW: Wider zoom on phones for interior environments
                if (window.innerWidth < 768) {
                    camera.position.set(6, 8, 12);
                } else {
                    camera.position.set(4, 6, 9);
                }

                camera.lookAt(0, 2.5, 0);
                controls.target.set(0, 2.5, 0);
            }
            controls.update();

            // V114: Force Lighting Update (Replaces old inline logic)
            if (window.applyRoomLighting) window.applyRoomLighting(roomName);

            if (roomName === 'space' && typeof enhanceSpaceLighting === 'function') {
                setTimeout(enhanceSpaceLighting, 100);
            }

            // V130: Clean Room Info — populated but NOT auto-shown (user clicks nugget for question)
            const data = window.roomContent[roomName];
            const infoPanel = document.getElementById('room-info');
            if (infoPanel) {
                const contentContainer = document.getElementById('info-content');
                if (data && data.description && contentContainer) {
                    const lang = window.currentLanguage || 'en';
                    const displayTitle = (lang === 'nl' && data.title_nl) ? data.title_nl : data.title;
                    const displayDesc = (lang === 'nl' && data.description_nl) ? data.description_nl : data.description;
                    contentContainer.innerHTML = `
                        <h2>${displayTitle}</h2>
                        <p class="text-gray-300 leading-relaxed text-[10px]">${displayDesc}</p>
                    `;
                }
                // Do NOT auto-show panel — keep it hidden until user needs it
                infoPanel.style.display = 'none';
                infoPanel.style.transform = 'translateX(120%)';
            }

            // const mHeader = document.getElementById('main-header');
            // if (mHeader) mHeader.style.setProperty('display', 'none', 'important');

            // Hide discover-btn — auto-discovery happens on room entry now
            const dBtn = document.getElementById('discover-btn');
            if (dBtn) dBtn.style.display = 'none';

            // Auto-discover room silently (notify parent index page)
            (function autoDiscover() {
                const room = roomName;
                let discoveries = {};
                try { discoveries = JSON.parse(localStorage.getItem('houseDiscovery') || '{}'); } catch (e) { }
                if (!discoveries[room]) {
                    discoveries[room] = true;
                    try { localStorage.setItem('houseDiscovery', JSON.stringify(discoveries)); } catch (e) { }
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'VISIT_ROOM', room: room }, '*');
                    }
                }
            })();

            // Lightbulb button removed per user request (Mystery Nugget is the cue)

            document.getElementById('tooltip').style.opacity = 0;
            const instructions = document.getElementById('instructions');
            if (instructions) instructions.textContent = "Click music board to cycle tracks • Drag to rotate";

            // Force reflow and give browser a tiny window to upload textures before fading up
            setTimeout(() => {
                if (curtain) curtain.classList.remove('active');
            }, 50);

            state = 'ROOM';
            window.isZoomingToRoom = false; // V-FIX: Unlock controls

            if (infoTimeout) clearTimeout(infoTimeout);

            // V-FIX: Questions are now manually triggered in-room
            /*
            setTimeout(() => {
                if (window.showRoomQuestion) window.showRoomQuestion(roomName);
            }, 10000); 
            */
        } catch (e) {
            console.error(e);
            const loading = document.getElementById('loading');
            if (loading) {
                loading.innerHTML = `<h2 class="text-red-500 bg-black p-4"> Room Error: ${e.message}</h2>`;
                loading.style.display = 'flex';
            }
            if (curtain) curtain.classList.remove('active');
        }
    }, 1250);
}

window.discoverRoom = function () {
    const room = window.currentRoom;
    if (!room) return;

    // Save to localStorage
    // Save to localStorage with safety
    let discoveries = {};
    try {
        discoveries = JSON.parse(localStorage.getItem('houseDiscovery') || '{}');
    } catch (e) { }

    const isNew = !discoveries[room];

    discoveries[room] = true;
    try {
        localStorage.setItem('houseDiscovery', JSON.stringify(discoveries));
    } catch (e) { }

    // Play victory tune on 10th room discovery (V-NEW)
    if (isNew && Object.keys(discoveries).length === 10) {
        try {
            const victoryPath = (window.houseConfig && window.houseConfig.audio) ? window.houseConfig.audio.victory : '/assets/audio/victory.wav';
            const victoryTune = new Audio(victoryPath);
            victoryTune.volume = 0.6;
            victoryTune.play().catch(e => console.warn("Victory tune play blocked:", e));
        } catch (err) {
            console.error("Victory audio error:", err);
        }
    }

    // Notify parent if in iframe
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'VISIT_ROOM', room: room }, '*');
    }

    // Visual feedback
    const dBtn = document.getElementById('discover-btn');
    if (dBtn) {
        dBtn.style.color = '#4ade80'; // Success green
        const text = dBtn.querySelector('span');
        if (text) text.innerText = 'RECORDED';
        setTimeout(() => {
            dBtn.style.display = 'none';
        }, 1500);
    }
};

function exitRoom() {
    state = 'TRANSITION';
    window._wasdEnabled = false; // Disable WASD movement outside rooms

    // Hard-stop video immediately — belt-and-suspenders fix for bedroom audio bleed.
    // stopBedroomVideo/stopLivingVideo handle room-specific lighting resets below,
    // but we mute & detach src here first so there is zero chance of audio escaping
    // during the transition, regardless of which room we're leaving.
    if (window.videoElement) {
        window.videoElement.pause();
        window.videoElement.muted = true;
        window.videoElement.volume = 0;
    }

    if (window.stopLivingVideo) window.stopLivingVideo();
    if (window.stopBedroomVideo) window.stopBedroomVideo();

    // V-FIX 2: Automatically close the physical garage door on exit from space
    const activeRoom = window.currentRoom || currentRoom;
    if (activeRoom === 'space' || activeRoom === 'garage') {
        const garage = window.garageForVoid || window.enhancedGarage;
        if (garage && garage.userData.closeDoor) {
            garage.userData.closeDoor();
        }
    }

    const curtain = document.getElementById('curtain');
    if (curtain) curtain.classList.add('active');

    // ── Audio bleed fix ───────────────────────────────────────────────────────
    // 1. Null out currentRoom NOW (before any audio work) so that if the
    //    'ended' event fires during src reassignment, nextTrack()'s guard
    //    "if (!window.currentRoom)" kills it immediately.
    window.currentRoom = null;
    currentRoom = null;

    // 2. Detach the track-ended handler that was registered by playTrack().
    //    Without this, changing audioPlayer.src can fire 'ended' on the old
    //    src (browser-dependent), which calls nextTrack() → playTrack() →
    //    reloads the room playlist, overwriting the intro music we're about
    //    to set.
    if (window._audioEndedHandler && window.audioPlayer) {
        window.audioPlayer.removeEventListener('ended', window._audioEndedHandler);
        window._audioEndedHandler = null;
    }
    // ─────────────────────────────────────────────────────────────────────────

    // V-FIX: Explicit Pause and Reset to prevent audio bleed
    if (window.audioPlayer) {
        window.audioPlayer.pause();
        window.audioPlayer.currentTime = 0; // V-NEW: Reset to start
        window.isMusicPlaying = false;
    }
    stopAllAudio();
    isMusicPlaying = false;

    if (audioPlayer) {
        audioPlayer.src = houseConfig.audio.intro;
        audioPlayer.currentTime = houseMusicTime || 0;
        audioPlayer.loop = true;
        audioPlayer.volume = 0.5; // Default volume
        audioPlayer.play().catch(() => { });
        window.isMusicPlaying = true;
    }

    // Clear any pending info panel minimize timeout
    if (infoTimeout) clearTimeout(infoTimeout);

    if (infoTimeout) clearTimeout(infoTimeout);

    setTimeout(() => {
        const duration = 1500; // Smooth return to house lighting
        if (dirLight) new TWEEN.Tween(dirLight).to({ intensity: HOUSE_DEFAULTS.dirIntensity }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        if (rimLight) new TWEEN.Tween(rimLight).to({ intensity: HOUSE_DEFAULTS.rimIntensity }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        if (ambientLight) new TWEEN.Tween(ambientLight).to({ intensity: HOUSE_DEFAULTS.ambientIntensity }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        if (hemiLight) new TWEEN.Tween(hemiLight).to({ intensity: HOUSE_DEFAULTS.hemiIntensity }, duration).easing(TWEEN.Easing.Quadratic.Out).start();

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
            window.metropolisRobot = null; // Clean reference
        }

        // FIXED: Clear foregroundGroup to remove rocket and other overlay elements
        if (foregroundGroup) {
            foregroundGroup.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            foregroundGroup.clear();
        }

        interiorGroup.visible = false;
        worldGroup.visible = true;

        if (mistLayer) mistLayer.visible = true;


        atomGroup = null;
        basementNodes = [];
        basementLines = null;
        interiorClickables.length = 0; // V39: Prevent Ghost Clicks
        if (infoTimeout) clearTimeout(infoTimeout);

        // Reset View (Angled "Landing")
        camera.position.set(14, 12, 18);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Safe UI Reset
        const rInfo = document.getElementById('room-info');
        if (rInfo) rInfo.style.display = 'none';

        const bBtn = document.getElementById('back-btn');
        if (bBtn) bBtn.style.display = 'none';

        const dBtn = document.getElementById('discover-btn');
        if (dBtn) dBtn.style.display = 'none';

        if (window.parent) window.parent.postMessage({ type: 'EXITED_ROOM' }, '*');
        if (window.parent) window.parent.postMessage({ type: 'SHOW_HEADER' }, '*');

        // Restore the local reset button
        const _rvBtnExit = document.getElementById('reset-view-btn');
        if (_rvBtnExit) {
            _rvBtnExit.style.display = 'block';
            _rvBtnExit.title = 'Reset View';
            _rvBtnExit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </svg>`;
        }

        // V-FIX: Restore Top Header Bar
        const appHeader = document.getElementById('app-header');
        if (appHeader) appHeader.style.display = 'block';

        const instr = document.getElementById('instructions');
        if (instr) instr.textContent = "Click a room to enter it • Drag to rotate";

        // Give the renderer a tiny gap to render the wireframe house before fading out curtain
        setTimeout(() => {
            if (curtain) curtain.classList.remove('active');
        }, 50);

        window.currentRoom = null;
        currentRoom = null;

        // V-FIX: Restore Background and Fog (Synchronized with Housedev)
        scene.background = new THREE.Color(0x2d1b4e);
        if (scene.fog) {
            scene.fog.color.setHex(0x2d1b4e);
            scene.fog.far = 300;
        }

        state = 'HOUSE';
        currentRoom = null;
        window.isZoomingToRoom = false;
    }, 1250);
}

function updateMousePosition(event) {
    if (!event) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerDown(event) {
    isPossibleClick = true; pointerDownX = event.clientX; pointerDownY = event.clientY;
}

function onPointerMove(event) {
    const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
    if (dist > 50) isPossibleClick = false; // V179: Increased threshold (25 -> 50) for easier clicking on touch/low-dpi
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


// --- MOUSEOVER GLOW SYSTEM ---
function setRoomGlow(target, isHover) {
    // V-FIX: Ditching mouseover glow again as it causes color issues
    return;
}

function checkIntersectionExternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(worldGroup.children, true);

    let newHovered = null;

    for (let i = 0; i < intersects.length; i++) {
        let target = intersects[i].object;
        if (target.userData && target.userData.ignore) continue;

        // Check for onClick first up the chain
        let bubble = target;
        let foundClickable = false;
        while (bubble && bubble !== worldGroup) {
            if (bubble.userData && bubble.userData.onClick) {
                newHovered = bubble;
                foundClickable = true;
                break;
            }
            bubble = bubble.parent;
        }

        if (foundClickable) break;

        // Check for room name up the chain
        bubble = target;
        while (bubble && bubble !== worldGroup) {
            if (bubble.userData && bubble.userData.name && roomContent[bubble.userData.name]) {
                newHovered = bubble;
                foundClickable = true;
                break;
            }
            bubble = bubble.parent;
        }

        if (foundClickable) break;
    }

    if (newHovered !== hoveredObject) {
        // V-FIX: No glow calls here
        hoveredObject = newHovered;
        if (hoveredObject) {
            document.body.style.cursor = 'pointer';
            const tooltip = document.getElementById('tooltip');

            // Standardize tooltip text
            let tipText = "INTERACT";
            if (hoveredObject.userData.name && roomContent[hoveredObject.userData.name]) {
                tipText = roomContent[hoveredObject.userData.name].title;
            } else if (hoveredObject.userData.onClick) {
                tipText = hoveredObject.userData.tooltip || (hoveredObject.userData.name === 'VoidEntrance' ? "ENTER THE VOID" : (hoveredObject.name === 'garageSystem' ? "GARAGE" : "INTERACT"));
            }

            tooltip.textContent = tipText;
            // V-FIX: FORCE HIDE TOOLTIP PER USER REQUEST
            tooltip.style.opacity = 0;
            tooltip.style.display = 'none';
        } else {
            document.body.style.cursor = 'default';
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.style.opacity = 0;
                tooltip.style.display = 'none';
            }
        }
    }
}

let hoveredInternalObject = null;
function checkIntersectionInternal() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interiorClickables, true); // true = recursive

    let newHovered = null;

    for (let i = 0; i < intersects.length; i++) {
        let target = intersects[i].object;
        if (target.userData && target.userData.ignore) continue;

        let clickableParent = target;
        while (clickableParent && (!clickableParent.userData || !clickableParent.userData.onClick)) {
            clickableParent = clickableParent.parent;
            if (!clickableParent || clickableParent === interiorGroup) break;
        }
        if (clickableParent && clickableParent.userData && clickableParent.userData.onClick) {
            newHovered = clickableParent;
            break;
        }
    }

    if (newHovered !== hoveredInternalObject) {
        // V-FIX: No glow calls here
        hoveredInternalObject = newHovered;
        if (hoveredInternalObject) {
            document.body.style.cursor = 'pointer';
            if (hoveredInternalObject.userData) hoveredInternalObject.userData.isHovered = true;
        } else {
            document.body.style.cursor = 'default';
        }
    }
}



// -- MERGED LOGIC FROM COMPREHENSIVE-FIX --
let mouseNormX = 0, mouseNormY = 0;
function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseNormX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseNormY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }, { passive: true });
}
if (!window.mouseTrackingSetup) {
    setupMouseTracking();
    window.mouseTrackingSetup = true;
}

// Export enterRoom for global access
window.enterRoom = enterRoom;

window.updateSpaceRoom = function (time) {
    if (window.currentRoom !== 'space') return;
    if (!window.spaceCharacter) return;
    const t = time * 0.001;
    if (window.spaceCharacter.userData && window.spaceCharacter.userData.update) {
        window.spaceCharacter.userData.update(t, mouseNormX, mouseNormY);
    }
    if (typeof interiorGroup !== 'undefined' && interiorGroup) {
        interiorGroup.children.forEach(child => {
            if (child !== window.spaceCharacter && child.userData && child.userData.update) {
                try { child.userData.update(t); } catch (e) { }
            }
        });
    }
};

function enhanceSpaceLighting() {
    if (window.currentRoom !== 'space') return;
    if (window.spaceCharacter && window.interiorGroup) {
        if (!window.spaceExtraLight) {
            const spotlight = new THREE.SpotLight(0xffffff, 3.0, 50, Math.PI / 4);
            spotlight.position.set(0, 10, 5);
            spotlight.target = window.spaceCharacter;
            window.interiorGroup.add(spotlight);
            window.spaceExtraLight = spotlight;
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    const deltaTime = clock.getDelta();
    requestAnimationFrame(animate);
    const currentTime = time || performance.now();
    const t = currentTime * 0.001;

    // Update Enhanced Garage Door
    if (window.enhancedGarage && window.enhancedGarage.userData.update) {
        window.enhancedGarage.userData.update(deltaTime, camera);
    }

    // DEBUG OVERLAY UPDATE REMOVED

    TWEEN.update(time); // Enabled TWEEN for Cinema Mode
    controls.update();

    // V-FIX 2026: Prevent "Flipped Underworld" glitch (stay above ground)
    if (camera && camera.position.y < 0.3) {
        camera.position.y = 0.3;
    }
    if (controls && controls.target.y < -5) {
        // Allow some panning down but not infinite underworld
        controls.target.y = -5;
    }

    // ---- WASD Camera Movement ----
    const wasdSpeed = 0.12;
    if (window._wasdEnabled && window._wasdKeys && camera) {
        const fwd = new THREE.Vector3();
        const right = new THREE.Vector3();
        camera.getWorldDirection(fwd);
        fwd.y = 0; fwd.normalize();
        right.crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();

        const move = new THREE.Vector3();
        if (window._wasdKeys.w) move.addScaledVector(fwd, wasdSpeed);
        if (window._wasdKeys.s) move.addScaledVector(fwd, -wasdSpeed);
        if (window._wasdKeys.a) move.addScaledVector(right, -wasdSpeed);
        if (window._wasdKeys.d) move.addScaledVector(right, wasdSpeed);

        if (move.length() > 0) {
            camera.position.add(move);
            controls.target.add(move);
            controls.update();
        }
    }


    // V-NEW: Global Animated Objects Support
    if (window.animatedObjects) {
        window.animatedObjects.forEach(obj => {
            if (obj.update) obj.update(t, deltaTime);
        });
    }

    // V-AUDIO: Real-time Frequency Analysis — only when music is actively playing
    let lowFreq = 0, midFreq = 0, avgFreq = 0;
    if (window.audioAnalyser && window.audioDataArray && window.isMusicPlaying) {
        window.audioAnalyser.getByteFrequencyData(window.audioDataArray); // PERF: guarded by isMusicPlaying

        let lowSum = 0;
        const lowCount = Math.floor(window.audioDataArray.length * 0.1);
        for (let i = 0; i < lowCount; i++) lowSum += window.audioDataArray[i];
        lowFreq = (lowSum / lowCount) / 255.0; // 0..1

        let midSum = 0;
        const midStart = Math.floor(window.audioDataArray.length * 0.2);
        const midEnd = Math.floor(window.audioDataArray.length * 0.5);
        for (let i = midStart; i < midEnd; i++) midSum += window.audioDataArray[i];
        midFreq = (midSum / (midEnd - midStart)) / 255.0; // 0..1
    }

    // Attic lamp audio-reactivity is handled later in the animation loop (inside interiorGroup.visible check)

    // V-FIX 1944: Generic Room Updates (e.g. Attic Box Artifacts)
    if (typeof interiorGroup !== 'undefined' && interiorGroup) {
        interiorGroup.children.forEach(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(t);
            }
            // Also check deeper children if needed, but for now top-level interior items
            if (child.children) {
                child.children.forEach(sub => {
                    if (sub.userData && sub.userData.update) sub.userData.update(t);
                });
            }
        });
    }

    // PERF: garage update already called above — duplicate removed

    // Mist Animation
    if (mistLayer && mistLayer.visible) {
        // Slighly rotate the sphere and drift the texture
        mistLayer.rotation.y += 0.001;
        if (mistLayer.material.map) {
            mistLayer.material.map.offset.x += 0.0005;
            mistLayer.material.map.offset.y += 0.0002;
        }
    }

    // V-PERF: Frame-Multiplexed background animations (reduces frame time spikes)
    const frameSkip = Math.floor(currentTime / 32) % 4;

    // Frame 0: Tree Sways
    if (frameSkip === 0 && window.swayTrees) {
        window.swayTrees.forEach((tree, i) => {
            const sway = Math.sin(t * 1.5 + i) * 0.05;
            tree.rotation.z = (tree.userData && tree.userData.baseRotZ || 0) + sway;
            tree.rotation.x = (tree.userData && tree.userData.baseRotX || 0) + sway * 0.5;
        });
    }

    // Frame 1: Animate Street Lights (Independent Pulse)
    if (frameSkip === 1 && window.streetLights) {
        window.streetLights.forEach(glow => {
            const u = glow.userData;
            const speed = u && u.speed ? u.speed : 1.5;
            const phase = u && u.phase ? u.phase : 0;
            const val = Math.sin(t * speed + phase);
            const pulse = Math.pow(Math.max(0, val), 4.0);
            if (glow.material) {
                glow.material.opacity = 0.3 + (pulse * 0.7);
            } else if (glow.isPointLight) {
                glow.intensity = 0.8 + (pulse * 0.8);
            }
        });
    }

    // Frame 2: Pulse Skyscrapers
    if (frameSkip === 2) {
        animatedTrees.forEach(block => {
            const u = block.userData;
            if (!u.isSkyscraper) return;
            const val = Math.sin(t * u.speed + u.phase);
            const pulse = Math.pow(Math.max(0, val), 3.0);
            block.scale.y = u.baseScaleY * (1.0 + pulse * 0.3);
            if (block.material) {
                block.material.emissiveIntensity = 0.05 + (pulse * 1.2);
            }
        });
    }

    // Frame 3: Fireflies Motion
    if (frameSkip === 3 && worldGroup) {
        if (!window._cachedFireflies) {
            window._cachedFireflies = worldGroup.children.filter(c => c.userData.type === 'fireflies');
        }
        window._cachedFireflies.forEach(child => {
            if (child.geometry && child.geometry.attributes.position && child.userData.speeds) {
                const pos = child.geometry.attributes.position.array;
                const speeds = child.userData.speeds;
                for (let i = 0; i < speeds.length; i++) {
                    pos[i * 3] += speeds[i].x;
                    pos[i * 3 + 1] += speeds[i].y;
                    pos[i * 3 + 2] += speeds[i].z;
                    if (Math.abs(pos[i * 3]) > 40) speeds[i].x *= -1;
                    if (pos[i * 3 + 1] < 1 || pos[i * 3 + 1] > 16) speeds[i].y *= -1;
                    if (Math.abs(pos[i * 3 + 2]) > 40) speeds[i].z *= -1;
                }
                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    // Metropolis Robot Animation
    if (metropolisRobot && metropolisRobot.userData.update) {
        metropolisRobot.userData.update(t);
    }

    // V-FIX 278: Pluto Usher Animation (Explicit)
    if (window.usherCharacter && window.usherCharacter.userData.update) {
        window.usherCharacter.userData.update(t);
    }

    // Interior Interactions (Sprite Grow / Arrow Bob)
    if (interiorGroup && interiorGroup.visible) {
        // V-NEW: Living Artifact Animation
        if (window.livingArtifact && window.livingArtifact.userData.update) {
            window.livingArtifact.userData.update(t);
        }

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

        // V-AUDIO: Early Frequency Analysis — PERF: only sample when music is playing
        if (audioAnalyser && window.isMusicPlaying) {
            // Robust Resume for Modern Browsers
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().catch(() => { });
            }
            audioAnalyser.getByteFrequencyData(audioDataArray);

            let sum = 0;
            for (let i = 0; i < audioDataArray.length; i++) sum += audioDataArray[i];
            avgFreq = sum / Math.max(1, audioDataArray.length);

            // Calculate Specific Bands
            // Low: 0-10% of bins
            let lowSum = 0;
            let lowCount = Math.floor(audioDataArray.length * 0.1) || 1;
            for (let i = 0; i < lowCount; i++) lowSum += audioDataArray[i];
            lowFreq = (lowSum / lowCount) / 255;

            // Mid: 20-50%
            let midSum = 0;
            let midStart = Math.floor(audioDataArray.length * 0.2);
            let midEnd = Math.floor(audioDataArray.length * 0.5);
            let midCount = midEnd - midStart || 1;
            for (let i = midStart; i < midEnd; i++) midSum += audioDataArray[i];
            midFreq = (midSum / midCount) / 255;

            // Global Safety Caps
            if (isNaN(lowFreq)) lowFreq = 0;
            if (isNaN(midFreq)) midFreq = 0;
        }

        // V-Refine: Generic Shader Update (For Studio Hologram etc)
        interiorGroup.traverse(child => {
            if (child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(m => {
                    if (m.uniforms && m.uniforms.time) {
                        m.uniforms.time.value = t;
                    }
                    // Audio-Reactive Uniforms
                    if (m.uniforms && m.uniforms.uAudioLow && typeof lowFreq !== 'undefined') {
                        m.uniforms.uAudioLow.value = lowFreq;
                    }
                });
            }
        });

        // V-AUDIO: Pulse Laptop and Light (Space Room)
        if (currentRoom === 'space') {
            const pulse = 4.0 + (midFreq * 14.0);

            if (interiorGroup.userData.reactiveLight) {
                interiorGroup.userData.reactiveLight.intensity = pulse;
            }
            if (interiorGroup.userData.laptopScreen) {
                interiorGroup.userData.laptopScreen.material.emissiveIntensity = 1.0 + (midFreq * 4.0);
            }
            // Ensure ambient light isn't pitch black
            if (window.ambientLight && window.ambientLight.intensity < 0.2) {
                window.ambientLight.intensity = 0.2 + (midFreq * 0.5);
            }
        }

        // V-AUDIO: Attic Light Response (Enhanced with Bulb Pulsing)
        if (currentRoom === 'attic' && window.atticLampLight) {
            const base = window.atticLampLight.userData.baseIntensity || 0.15;
            const max = window.atticLampLight.userData.maxIntensity || 8.0;

            if (window.isMusicPlaying && lowFreq > 0) {
                // Strong Low/Bass response with smoothing
                const targetIntensity = base + (lowFreq * (max - base));
                window.atticLampLight.intensity += (targetIntensity - window.atticLampLight.intensity) * 0.3;

                // Debug logging (1% of frames)
                if (Math.random() < 0.01) {
                    console.log(`🔊 Attic Lamp: lowFreq=${lowFreq.toFixed(3)}, intensity=${window.atticLampLight.intensity.toFixed(2)}`);
                }

                // Pulse the bulb emissive material
                if (window.atticLampLight.parent) {
                    window.atticLampLight.parent.traverse(child => {
                        if (child.isMesh && child.material) {
                            // Pulse the bulb's emissive intensity
                            if (child.material.emissive) {
                                child.material.emissiveIntensity = 0.5 + (lowFreq * 2.5);
                            }
                            if (child.material.color && child.geometry && child.geometry.type === 'SphereGeometry') {
                                const brightness = 1.0 + (lowFreq * 0.5);
                                child.material.color.setHSL(0.1, 1.0, 0.3 + (lowFreq * 0.4));
                            }
                        }
                    });
                }
            } else {
                // Fade back to base when music stops
                window.atticLampLight.intensity += (base - window.atticLampLight.intensity) * 0.1;
                if (window.atticLampLight.parent) {
                    window.atticLampLight.parent.traverse(child => {
                        if (child.isMesh && child.material) {
                            if (child.material.emissive) {
                                child.material.emissiveIntensity += (0.5 - child.material.emissiveIntensity) * 0.1;
                            }
                            if (child.material.color && child.geometry && child.geometry.type === 'SphereGeometry') {
                                child.material.color.setHSL(0.1, 1.0, 0.3);
                            }
                        }
                    });
                }
            }

            // Optional: Shake dust particles with bass
            const dust = interiorGroup.children.find(c => c.userData.type === 'atticDust');
            if (dust) {
                dust.position.y = 3 + Math.sin(t * 2) * 0.1 + (lowFreq * 0.5);
            }
        }

        // Animation (Blinking Lights)
        if (window.r2d2Elements) {
            window.r2d2Elements.forEach(r2 => {
                if (Math.random() > 0.9) r2.lightRed.material.color.setHex(0xff0000); else r2.lightRed.material.color.setHex(0x330000);
                if (Math.random() > 0.9) r2.lightBlue.material.color.setHex(0x00aaff); else r2.lightBlue.material.color.setHex(0x002244);
                if (Math.random() > 0.9) r2.lightGreen.material.color.setHex(0x00ff44); else r2.lightGreen.material.color.setHex(0x003311);
                // Holo Beam Flicker
                if (r2.beamMat && r2.beamMat.uniforms.time) r2.beamMat.uniforms.time.value = t;
            });
        }

        // V-NEW: Global Interior Update Hook (Fixes Static Rocket/Playlist)
        interiorGroup.traverse(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(t);

                // --- ITEM 8: Star Parallax ---
                if (child.isPoints && child.userData.update && currentRoom === 'space') {
                    if (prevCameraPos) {
                        const cameraDelta = new THREE.Vector3().subVectors(camera.position, prevCameraPos);
                        child.rotation.y += cameraDelta.x * 0.0001;
                        child.rotation.x += cameraDelta.y * 0.0001;
                    }
                }
            }
        });
        prevCameraPos = camera.position.clone();
    }

    // Also check foregroundGroup even if interior is hidden (Rocket flybys)
    if (foregroundGroup) {
        foregroundGroup.traverse(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(t);
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
    if (typeof windowFlickerMaterials !== 'undefined' && windowFlickerMaterials) {
        windowFlickerMaterials.forEach((mat, idx) => {
            if (mat.userData) {
                const u = mat.userData;

                // Flicker intensity
                const flicker = Math.sin(t * u.speed + u.phase) * 0.2;
                mat.emissiveIntensity = Math.max(0, u.baseEmissive + flicker);

                // Independent Color Cycle
                const hue = (u.hueOffset + t * u.hueSpeed) % 1.0;
                mat.color.setHSL(hue, 0.6, 0.6); // Base color
                mat.emissive.setHSL(hue, 0.8, 0.5); // Glow color
            }
        });
    }

    // 3. Animated Shaders
    if (state === 'ROOM') {
        const camAngle = Math.atan2(camera.position.x, camera.position.z);
        // Add Pitch for Vertical Parallax
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        const camPitch = camDir.y;

        animatedShaderMaterials.forEach(mat => {
            if (mat.uniforms && mat.uniforms.uTime) {
                mat.uniforms.uTime.value = t;
            }
            if (mat.uniforms && mat.uniforms.uViewRotation) {
                mat.uniforms.uViewRotation.value = camAngle;
            }
            // Enable Global Pitch Update
            if (mat.uniforms && mat.uniforms.uViewPitch) {
                mat.uniforms.uViewPitch.value = camPitch;
            }
        });
    }

    // Update Interior Objects (Lamps, Holograms)
    updateInteriorObjects(t, mouse.x, mouse.y);

    // Generic Room Item Updates (Mirror, etc.)
    if (state === 'ROOM' && window.currentRoom === 'bathroom') {
        if (Math.floor(t * 60) % 300 === 0) interiorGroup.traverse(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(t);
            }
        });
    }

    // Garage Void Portal Parallax
    if (state === 'ROOM' && currentRoom === 'garage' && window.garageVoidPortal) {
        if (window.garageVoidPortal.userData.update) {
            window.garageVoidPortal.userData.update(deltaTime, camera);
        }
    }

    // AvgFreq calculated earlier
    // avgFreq is now available here if needed for legacy code


    if (atomGroup) {
        atomGroup.rotation.y += 0.005;
        atomGroup.rotation.x += 0.002;
        atomGroup.rotation.z += 0.003;
        atomGroup.children.forEach(orbit => {
            if (orbit.userData.electron) orbit.rotation.z += orbit.userData.speed;
        });
    }

    // Universe Animation Loop
    if (window.updateSpaceRoom) window.updateSpaceRoom(currentTime);

    if (window.mmAnimation) {
        window.mmAnimation.update();
        if (window.mmMesh && window.mmMesh.material.map) window.mmMesh.material.map.needsUpdate = true;
    }


    // --- RENDER ---
    if (window.currentRoom === 'basement' && basementNodes.length > 0) {
        const linePositions = [];
        const freqMod = avgFreq / 255;
        basementNodes.forEach((node, i) => {
            const ud = node.userData;
            node.position.add(ud.velocity);

            const pulseBase = (avgFreq || 20) / 255;
            const pulse = 1.0 + pulseBase * 2.0;

            const base = ud.baseSize || 0.06;
            const s = base * (pulse + Math.sin(t * (0.8 + (i % 7) * 0.02)) * 0.08);
            node.scale.setScalar(s / base);

            if (ud.isTruth) {
                node.position.y = ud.originalY + Math.sin(t * 1.0 + i) * pulseBase * 1.8;
            } else {
                node.position.y = ud.originalY + Math.cos(t * 1.5 + i) * pulseBase * 2.2;
            }

            if (Math.abs(node.position.x) > 4.5) ud.velocity.x *= -1;
            if (node.position.y < 0.2 || node.position.y > 6.5) ud.velocity.y *= -1;
            if (Math.abs(node.position.z) > 4.5) ud.velocity.z *= -1;

            // PERF: O(n²) line check — only run every 3 frames
            if (renderer.info.render.frame % 3 === 0) {
                for (let j = i + 1; j < basementNodes.length; j++) {
                    const other = basementNodes[j];
                    const dist = node.position.distanceTo(other.position);
                    if (dist < 2.5) {
                        linePositions.push(node.position.x, node.position.y, node.position.z);
                        linePositions.push(other.position.x, other.position.y, other.position.z);
                    }
                }
            }
        });
        if (basementLines && renderer.info.render.frame % 3 === 0) {
            basementLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            basementLines.geometry.attributes.position.needsUpdate = true;
            basementLines.material.opacity = 0.1 + freqMod * 0.4;
        }
    }

    if (noteTextSprite) {
        const scale = 1.5 + Math.sin(t * 3.0) * 0.1;
        noteTextSprite.scale.set(scale, scale * 0.58, 1);
    }

    // Failsafe - UNCONDITIONAL Controls Enable (unless zooming)
    if (!window.isZoomingToRoom) {
        controls.enabled = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
    }

    renderer.render(scene, camera);
    // PERF: TWEEN.update already called at top of animate() — duplicate removed
}


// Universe Expanding Animation
function startGoldenRatioAnimation() {
    // Check if exists
    if (window.mmMesh) return;

    // 1. Instantiate Animation Engine
    if (typeof MMAnimation === 'undefined') {
        console.error("MMAnimation class not found! script tag missing?");
        return;
    }

    if (!window.mmAnimation) {
        window.mmAnimation = new MMAnimation(1024, 1024);
    }

    // 2. Create Texture
    const texture = new THREE.CanvasTexture(window.mmAnimation.getCanvas());
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 3. Create Mesh (Plane)
    const geometry = new THREE.PlaneGeometry(5, 5); // Larger projection
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, // Glowing effect
        depthWrite: false // Don't occlude
    });

    window.mmMesh = new THREE.Mesh(geometry, material);
    window.mmMesh.renderOrder = 9999;

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
            window.mmMesh.position.set(0, 0.25, 0);
            laptopGroup.add(window.mmMesh);
        }
    } else {
        // Fallback
        window.mmMesh.position.set(0, 1.5, -2);
        interiorGroup.add(window.mmMesh);
    }

    window.mmMesh.userData = { type: 'mmAnimationClose', name: 'Universe' };
    interiorClickables.push(window.mmMesh); // Make it clickable to close
}

function stopMMAnimation() {
    if (window.mmMesh) {
        if (window.mmMesh.parent) window.mmMesh.parent.remove(window.mmMesh);
        if (window.mmMesh.material.map) window.mmMesh.material.map.dispose();
        window.mmMesh.material.dispose();
        window.mmMesh.geometry.dispose();

        const idx = interiorClickables.indexOf(window.mmMesh);
        if (idx > -1) interiorClickables.splice(idx, 1);

        window.mmMesh = null;
    }
    // Don't kill animation engine.
    window.mmAnimation = null;
}

function updateInteriorObjects(t, mouseX = 0, mouseY = 0) {
    // Lava Lamp and other animated interior objects
    interiorGroup.children.forEach(child => {
        if (child.userData && child.userData.update) {
            // Pass mouse coordinates for interactive characters (Pluton)
            child.userData.update(t, mouseX, mouseY);
        }
        // Check direct children too (e.g. LampGroup on Shelf)
        if (child.children) {
            child.children.forEach(grandChild => {
                if (grandChild.userData && grandChild.userData.update) {
                    grandChild.userData.update(t);
                }
                // One more level for safety (e.g. Shelf -> Lamp)
                if (grandChild.children) {
                    grandChild.children.forEach(ggChild => {
                        if (ggChild.userData && ggChild.userData.update) {
                            ggChild.userData.update(t);
                        }
                    });
                }
            });
        }
    });
}


// Defer init to allow UI to render and Safety Timeout to register
setTimeout(() => {
    try {
        // V136: Fixed Init Crash (init() was removed, calling buildWorld direct)
        buildWorld();
        if (window.hideLoader) window.hideLoader(); // V291: Immediate Hide after build
    } catch (e) {
        console.error("CRITICAL INIT ERROR:", e);
        const errBox = document.getElementById('loading-error');
        if (errBox) {
            errBox.classList.remove('hidden');
            errBox.innerHTML = "CRITICAL ERROR: " + e.message;
        }
    }
}, 100);

// V-REFINE: New Sign Texture (User Request)
function createNewSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background: Metallic/Wood Sign
    ctx.fillStyle = '#eaddcf'; // Light wood/parchment
    ctx.fillRect(0, 0, 512, 256);

    // Border
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 246);

    // Text
    ctx.fillStyle = '#3e2723';
    ctx.textAlign = 'center';

    // Line 1: ENTER (Larger & Lower)
    ctx.font = 'bold 110px "Courier Prime", monospace';
    ctx.fillText("ENTER", 256, 120);

    // Line 2: Click on the front door
    ctx.font = 'bold 30px "Courier Prime", monospace';
    ctx.fillText("Click on the front door", 256, 200);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

// V-REFINE: Global Controls
function toggleGlobalSound() {
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');

    // Toggle Mute Logic
    if (window.audioPlayer) {
        window.audioPlayer.muted = !window.audioPlayer.muted;
        // Update Video too if active
        if (window.videoElement) window.videoElement.muted = window.audioPlayer.muted;

        // Update Icons
        if (window.audioPlayer.muted) {
            iconOn.classList.add('hidden');
            iconOff.classList.remove('hidden');
        } else {
            iconOn.classList.remove('hidden');
            iconOff.classList.add('hidden');
        }
    }
}

function toggleGlobalFullscreen() {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;

    // On iOS, we toggle a parent class because the Fullscreen API is not supported on elements.
    if (isIOS) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'TOGGLE_FULLSCREEN' }, '*');
        }
        return;
    }

    const iconOn = document.getElementById('icon-fullscreen-on');
    const iconOff = document.getElementById('icon-fullscreen-off');

    const docEl = document.documentElement;
    const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    if (!isFullScreen) {
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => { });
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
        else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
        else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();

        if (iconOn) iconOn.classList.add('hidden');
        if (iconOff) iconOff.classList.remove('hidden');
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();

        if (iconOn) iconOn.classList.remove('hidden');
        if (iconOff) iconOff.classList.add('hidden');
    }
}

// Metropolis Robot (Ported from metropolis/claude.html)
function createMetropolisRobot() {
    const group = new THREE.Group();
    // Enable Dynamic Shadows
    group.castShadow = true;
    group.receiveShadow = true;
    // 1. Materials
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffcc00, metalness: 0.9, roughness: 0.3,
        emissive: 0x331100, emissiveIntensity: 0.2
    });
    const glowRingMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending
    });

    // 2. Geometry Construction (Simplified High-Performance)
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), goldMat);
    head.position.y = 1.75; head.scale.set(0.9, 1.2, 1);
    group.add(head);

    // Eyes (Pupils Added)
    [-0.08, 0.08].forEach(x => {
        // Socket/White
        const eye = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        eye.position.set(x, 1.78, 0.17); // Slightly closer to head
        eye.rotation.y = x > 0 ? 0.2 : -0.2;
        group.add(eye);

        // Pupil (Black)
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        pupil.position.set(0, 0, 0.01); // In front of eye
        eye.add(pupil);
    });

    // Torso (Slightly tapered)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.14, 0.8, 16), goldMat);
    torso.position.y = 1.1;
    group.add(torso);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2), goldMat);
    neck.position.y = 1.55;
    group.add(neck);

    // Arms
    [-1, 1].forEach(side => {
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.08), goldMat);
        sh.position.set(0.26 * side, 1.4, 0); group.add(sh);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.7), goldMat);
        arm.position.set(0.32 * side, 1.05, 0); group.add(arm);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05), goldMat);
        hand.position.set(0.32 * side, 0.7, 0); group.add(hand);
    });

    // Legs
    [-1, 1].forEach(side => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.8), goldMat);
        leg.position.set(0.12 * side, 0.4, 0); group.add(leg);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.18), goldMat);
        foot.position.set(0.12 * side, 0.02, 0.05); group.add(foot);
    });

    // 3. Rings Animation Logic
    const rings = [];
    const ringCount = 6;
    const rangeY = 2.2;

    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.4, 0.03, 8, 32),
            glowRingMat.clone()
        );
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        rings.push(ring);
    }

    // Attach Update Logic
    group.userData.update = function (t) {
        // Update Rings (Flow Up/Down)
        rings.forEach((ring, idx) => {
            const time = t;

            // Move Downwards
            ring.position.y = 2.2 - ((time * 0.4 + idx * (rangeY / ringCount)) % rangeY);

            // Normalized Height (0.0 = Bottom, 1.0 = Top)
            let p = Math.min(Math.max(ring.position.y / rangeY, 0), 1);

            // Curve for Opacity/Scale (Sine wave: 0 -> 1 -> 0)
            const curve = Math.sin(p * Math.PI);

            // Brighter Opacity (Max 1.0)
            ring.material.opacity = Math.pow(curve, 0.8) * 1.0;

            // Variable Diameter Animation
            const swell = 0.4 + (curve * 0.9);

            // Keep subtle pulse
            const pulse = 1.0 + Math.sin(time * 3 + idx) * 0.05;

            // Apply Swell * Pulse
            const finalScale = swell * pulse;
            ring.scale.set(finalScale, finalScale, 1);
        });
    };

    // Ensure every mesh casts shadow
    group.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return group;
}

// Global Video Stop Helper (For Audio Sync)
window.stopVideosForAudio = function () {

    // 1. Stop Main Helper (Skip for Basement and Studio - Background videos should persist)
    if (['basement', 'studio'].indexOf(currentRoom) === -1 && window.videoElement && !window.videoElement.paused) {
        window.videoElement.pause();
    }

    // Clear Video UI Selection
    window.masterVideoIndex = -1;
    if (window.updateVideoUI) window.updateVideoUI();

    // 2. Room Specifics
    if (currentRoom === 'living' && window.stopLivingVideo) {
        window.stopLivingVideo(); // Resets TV and Lights
    }

    // Bedroom — explicit stop (audio bleed fix)
    if (currentRoom === 'bedroom' && window.stopBedroomVideo) {
        window.stopBedroomVideo();
    }

    // 3. Bathroom Specific
    if (currentRoom === 'bathroom' && window.stopBathroomVideo) {
        window.stopBathroomVideo(); // Resets Mirror and Lights
    }

    // 4. Reset Lights (Safety Fallback)
    // Removed manual overrides - now handled by room scripts
    if (currentRoom === 'bathroom' && !window.stopBathroomVideo) {
        if (window.ambientLight) window.ambientLight.intensity = HOUSE_DEFAULTS.ambientIntensity;
        if (window.dirLight) window.dirLight.intensity = HOUSE_DEFAULTS.dirIntensity;
    }
};


// --- SPACE ROOM HELPERS (Ported from Tintin) ---

// 1. STARFIELD
function createStarTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function createStarField() {
    const starCount = 2500; // Increased density for "filled" look
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const offsets = [];

    for (let i = 0; i < starCount; i++) {
        // Spread much farther (X, Y) and push Deep (Z)
        positions.push(
            (Math.random() - 0.5) * 3000, // X
            (Math.random() - 0.5) * 3000, // Y
            -Math.random() * 1000 - 100    // Z (Always in front of camera, far away)
        );
        offsets.push(Math.random() * 2000.0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1));

    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: createStarTexture() },
            uSpeed: { value: 2.0 }, // Downward speed
            uAudioLow: { value: 0.0 } // V-AUDIO: Reactive Bass
        },
        vertexShader: `
            uniform float uTime;
            uniform float uAudioLow;
            uniform float uSpeed;
            attribute float offset;
            varying float vOpacity;
            void main() {
                // vOpacity pulses with time AND can be boosted by audio
                float basePulse = 0.4 + 0.6 * sin(uTime * (1.5 + mod(offset, 2.0)) + offset);
                vOpacity = basePulse + (uAudioLow * 0.5); // Add up to 0.5 additional brightness

                vec3 pos = position;
                // Extremely Slow Downward Move (Cosmic Scale)
                float drop = mod(uTime * 0.8 + offset, 2000.0);
                pos.y -= drop;
                if (pos.y < -1000.0) pos.y += 2000.0;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                float sizeBoost = 1.0 + uAudioLow * 2.0; // Bass makes stars larger
                gl_PointSize = sizeBoost * 4.0 * (1500.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
            `,
        fragmentShader: `
            uniform sampler2D uTexture;
            varying float vOpacity;
            void main() {
                vec4 texColor = texture2D(uTexture, gl_PointCoord);
                gl_FragColor = texColor * clamp(vOpacity, 0.0, 1.5);
            }
            `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const starField = new THREE.Points(geometry, starMaterial);

    // Animation Update
    starField.userData.update = function (t) {
        starMaterial.uniforms.uTime.value = t;
    };

    return starField;
}

// 2. TINTIN ROCKET
function createTintinRocket() {
    const rocket = new THREE.Group();
    rocket.castShadow = true;

    const size = 1024;
    const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    const RED = '#d40000';
    const WHITE = '#fcfcfc';

    // Checker Texture Generation
    const bottomEdge = 0.32 * size;
    const checkerHeight = 0.44 * size;
    const rowH = checkerHeight / 5;
    const cols = 10;
    const colW = size / cols;

    ctx.fillStyle = RED;
    ctx.fillRect(0, size - bottomEdge, size, bottomEdge); // Red Base
    for (let i = 0; i < 5; i++) {
        const y = size - bottomEdge - (i + 1) * rowH;
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? RED : WHITE;
            ctx.fillRect(j * colW, y, colW, rowH);
        }
    }
    ctx.fillStyle = RED; // Red Top
    ctx.fillRect(0, 0, size, size - bottomEdge - checkerHeight);

    const rocketTexture = new THREE.CanvasTexture(canvas);
    rocketTexture.wrapS = THREE.RepeatWrapping;
    rocketTexture.wrapT = THREE.RepeatWrapping;

    const rocketMat = new THREE.MeshStandardMaterial({
        map: rocketTexture, roughness: 0.2, metalness: 0.4,
        emissive: 0x220000, emissiveIntensity: 0.2
    });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd40000, roughness: 0.32 });

    // Lathe Body
    const points = [];
    const height = 30;
    const bulgePoint = 0.58;
    const baseRadius = 1.1;
    const maxRadius = 2.6;

    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const y = t * height;
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

    const body = new THREE.Mesh(new THREE.LatheGeometry(points, 64), rocketMat);
    rocket.add(body);

    // Tip
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 3, 12), redMat);
    tip.position.y = height + 1.5;
    rocket.add(tip);

    // Legs
    for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 3;
        legGroup.rotation.y = angle;

        const legShape = new THREE.Shape();
        legShape.moveTo(1.2, 7.2);
        legShape.lineTo(2.2, 7.2);
        legShape.bezierCurveTo(9.0, 5.7, 10.5, -1.3, 10.5, -3.7);
        legShape.lineTo(8.0, -3.7);
        legShape.bezierCurveTo(8.0, -0.5, 4.0, 1.5, 1.2, 2.7);

        const extrudeSettings = { depth: 1.6, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35, bevelSegments: 5 };
        const leg = new THREE.Mesh(new THREE.ExtrudeGeometry(legShape, extrudeSettings), redMat);
        leg.position.set(0, 0, -0.8);

        const pod = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), redMat);
        pod.scale.set(1, 1.35, 1);
        pod.position.set(9.2, -3.4, 0.8);
        leg.add(pod);

        legGroup.add(leg);
        rocket.add(legGroup);
    }

    // Keep rocket visible and prefer foreground rendering
    // Keep rocket visible
    rocket.renderOrder = 3000;
    rocket.frustumCulled = false;
    rocket.traverse(c => { if (c.material) { c.material.depthTest = true; c.material.depthWrite = true; c.material.transparent = true; } });

    // Default scale (more visible in scene)
    rocket.scale.set(0.45, 0.45, 0.45);

    // Animation Update
    rocket.userData.update = function (t) {
        const loopDuration = 10;
        const loopCount = Math.floor(t / loopDuration);
        const progress = (t % loopDuration) / loopDuration;
        const isSwoop = (loopCount % 4 === 3); // Every 4th loop is a close pass

        if (isSwoop) {
            // FOREGROUND PASS: big, close, but slightly offset from center UI
            rocket.position.x = 4.5; // Offset to the right to avoid blocking text
            rocket.position.z = 10.0; // Foreground pass
            rocket.position.y = -20 + progress * 100;
            rocket.scale.setScalar(0.85); // Reduced overwhelming scale
            rocket.renderOrder = 5000;
        } else {
            // Background pass: still visible but smaller
            rocket.position.x = -15;
            rocket.position.z = -40;
            rocket.position.y = -40 + progress * 80;
            rocket.scale.setScalar(0.45);
            rocket.renderOrder = 3000;
        }

        rocket.rotation.y = t * 0.4; // Still spin for depth
    };

    return rocket;
}

// 4. MAIN SPACE INTERIOR (The Void) - Simplified without Pluton character

function createSpaceInterior() {
    try {
        while (interiorGroup.children.length > 0) interiorGroup.remove(interiorGroup.children[0]);
        if (foregroundGroup) while (foregroundGroup.children.length > 0) foregroundGroup.remove(foregroundGroup.children[0]);
        interiorClickables.length = 0;

        scene.background = new THREE.Color(0x0a0412);
        if (scene.fog) { scene.fog.color.setHex(0x0a0412); scene.fog.far = 2000; }

        const glowGeo = new THREE.PlaneGeometry(1200, 800);
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        g.addColorStop(0, 'rgba(80, 0, 160, 0.45)'); g.addColorStop(0.6, 'rgba(40, 0, 80, 0.2)'); g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
        const eventHorizon = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
        eventHorizon.position.set(0, 0, -400); interiorGroup.add(eventHorizon);

        if (typeof createStarField === 'function') {
            try {
                const stars = createStarField();
                if (stars) interiorGroup.add(stars);
            } catch (err) {
            }
        }

        const laptopGroup = new THREE.Group();
        const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.3, metalness: 0.8 }));
        laptopBase.position.set(0, -0.025, 0); laptopGroup.add(laptopBase);
        const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, roughness: 0.1 }));
        laptopScreen.position.set(0, 0.375, -0.4); laptopScreen.rotation.x = -Math.PI / 8; laptopGroup.add(laptopScreen);
        laptopGroup.position.set(5, 0, 2); laptopGroup.userData = {
            update: (t) => {
                laptopGroup.rotation.x = Math.sin(t * 0.3) * 0.2; laptopGroup.rotation.y = t * 0.2;
                laptopGroup.rotation.z = Math.cos(t * 0.45) * 0.15; laptopGroup.position.y = Math.sin(t * 0.5) * 0.1;
                if (laptopScreen && laptopScreen.material) {
                    const hue = (t * 0.1) % 1.0;
                    laptopScreen.material.color.setHSL(hue, 0.8, 0.5);
                    laptopScreen.material.emissive.setHSL(hue, 0.9, 0.5);
                }
            }, onClick: () => { }
        };
        interiorClickables.push(laptopGroup); interiorGroup.add(laptopGroup);

        if (typeof createTintinRocket === 'function') {
            try {
                const rocket = createTintinRocket();
                if (rocket) {
                    if (foregroundGroup) foregroundGroup.add(rocket); else interiorGroup.add(rocket);
                }
            } catch (err) {
            }
        }

        if (window.createBB8ForHall) {
            try {
                const spaceBB8 = createBB8ForHall(); spaceBB8.scale.set(1.0, 1.0, 1.0); interiorGroup.add(spaceBB8);
                spaceBB8.traverse(node => { if (node.isLight && node.color.getHex() === 0x00ffff) node.intensity = 0; if (node.name === 'Hologram') node.visible = false; });
                const bb8Glow = new THREE.PointLight(0xffaa00, 15.0, 20); spaceBB8.add(bb8Glow);
                const rim = new THREE.SpotLight(0xffffff, 10); rim.position.set(0, 5, 0); spaceBB8.add(rim);
                spaceBB8.userData.update = (t) => {
                    spaceBB8.position.x = Math.sin(t * 0.08) * 15; spaceBB8.position.y = 3 + Math.cos(t * 0.12) * 4;
                    spaceBB8.position.z = -10 + Math.sin(t * 0.06) * 12;
                    spaceBB8.rotation.x = t * 0.2; spaceBB8.rotation.y = t * 0.3; spaceBB8.rotation.z = t * 0.1;
                };
            } catch (err) {
            }
        }

        if (window.ambientLight) window.ambientLight.intensity = 0.4;
        if (window.dirLight) window.dirLight.intensity = 0.6;
        const localLight = new THREE.PointLight(0x00ffff, 4.0, 40); localLight.position.set(2, 5, 2); interiorGroup.add(localLight);
        if (typeof addReflectionMarker === 'function') addReflectionMarker('space', 5, 1.5, -5);

        if (window.currentRoom === 'space' && window.playTrack) { window.playTrack(0); }
    } catch (err) {
        console.error("Space Interior Creation Error:", err, err.stack);
        scene.background = new THREE.Color(0x0a0412);
    }
}
window.createSpaceInterior = createSpaceInterior;

// V-NEW: Specialized Void Music Hook (REMOVED - Unified with playTrack)


// Persistent Audio Unlock Overlay (accessible globally)
function showPersistentAudioUnlock() {
    // DISABLED: Audio warning is annoying - rely on global click handler instead
    return;

    /* ORIGINAL CODE - DISABLED
    if (document.getElementById('audio-unlock-persistent')) return;
    const container = document.createElement('div');
    container.id = 'audio-unlock-persistent';
    container.style.position = 'fixed';
    container.style.left = '50%'; container.style.top = '20%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '100000';
    container.style.padding = '18px 24px';
    container.style.background = 'rgba(0,0,0,0.9)';
    container.style.color = '#fff';
    container.style.fontFamily = 'Courier New, monospace';
    container.style.textAlign = 'center';
    container.style.borderRadius = '8px';
    container.innerHTML = '<div style="font-size:14px; margin-bottom:8px;">AUDIO BLOCKED: Click to enable sound</div>';
 
    const btn = document.createElement('button');
    btn.textContent = 'ENABLE SOUND';
    btn.style.padding = '10px 14px';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.background = '#00aaff';
    btn.style.color = '#001';
    btn.onclick = function () {
        if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => { });
        if (window.startVoidMusic) window.startVoidMusic();
        const el = document.getElementById('audio-unlock-persistent'); if (el && el.parentNode) el.parentNode.removeChild(el);
    };
 
    container.appendChild(btn);
    document.body.appendChild(container);
    */
}

// One-time user gesture listener to attempt to enable audio (helps autoplay policies)
if (!window._audioGestureListenerSet) {
    window._audioGestureListenerSet = true;
    const enableAudioGesture = function () {
        try {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('🔊 Audio context resumed via user gesture');
                }).catch(() => { });
            }
            if (window.startVoidMusic) window.startVoidMusic();

            // Remove ALL audio unlock warnings
            const el = document.getElementById('audio-unlock-persistent');
            if (el && el.parentNode) el.parentNode.removeChild(el);
            const el2 = document.getElementById('audio-unlock-space');
            if (el2 && el2.parentNode) el2.parentNode.removeChild(el2);

            // Try to start any paused audio
            if (window.audioPlayer && window.audioPlayer.paused && window.audioPlayer.src) {
                window.audioPlayer.play().catch(() => { });
            }
        } catch (e) {
            console.warn('Audio gesture handler error:', e);
        }
        // Remove listener after first interaction
        window.removeEventListener('pointerdown', enableAudioGesture, true);
        window.removeEventListener('click', enableAudioGesture, true);
    };

    // Listen to both pointerdown AND click for maximum coverage
    window.addEventListener('pointerdown', enableAudioGesture, { passive: true, capture: true });
    window.addEventListener('click', enableAudioGesture, { passive: true, capture: true });
}

// Final Cleanup
if (window.roomContent && window.roomContent.space && window.roomContent.space.onEnter) {
}
// --- ENHANCED GRASS TEXTURE (Pixelated Style) ---
function createPixelatedGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base grass color (Deep Dark Green)
    ctx.fillStyle = '#0a1a05';
    ctx.fillRect(0, 0, 512, 512);

    // V-FIX: Gravel-style Treatment (15,000 Speckles, Larger Pixels)
    for (let i = 0; i < 15000; i++) {
        const shade = Math.random();
        // Grass shades: Moss, Forest, Midnight, Shadow
        if (shade > 0.8) ctx.fillStyle = '#2d5a1e';      // Moss (Brighter)
        else if (shade > 0.5) ctx.fillStyle = '#1a330a'; // Forest
        else if (shade > 0.2) ctx.fillStyle = '#0f2205'; // Midnight
        else ctx.fillStyle = '#0a1a05';                  // Darkest shadow

        const size = Math.random() * 3 + 2; // V-FIX: Bigger Pixels (2-5)
        ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    texture.magFilter = THREE.NearestFilter; // Keeps pixels sharp
    texture.minFilter = THREE.NearestFilter;

    return texture;
}

// --- BUSH GENERATOR (Along Gravel Path) ---
function createBush(size = 1) {
    const group = new THREE.Group();

    // V-FIX: Dark Noise Speckles for Bushes
    if (!window.bushNoiseTex) {
        const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#052203'; ctx.fillRect(0, 0, 64, 64);
        for (let i = 0; i < 400; i++) {
            ctx.fillStyle = Math.random() > 0.7 ? '#000000' : '#0a1a05';
            const s = Math.random() * 2 + 1;
            ctx.fillRect(Math.random() * 64, Math.random() * 64, s, s);
        }
        window.bushNoiseTex = new THREE.CanvasTexture(canvas);
    }

    const bushColors = [0x052203, 0x0a2a05, 0x082604];
    const numClusters = 4 + Math.floor(Math.random() * 3);

    const material = new THREE.MeshStandardMaterial({
        map: window.bushNoiseTex,
        color: 0x888888, // Darkened
        roughness: 1.0,
        flatShading: true
    });

    for (let i = 0; i < numClusters; i++) {
        const radius = size * (0.3 + Math.random() * 0.4);
        const geometry = new THREE.SphereGeometry(radius, 8, 8);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * size * 0.6,
            radius * 0.8,
            (Math.random() - 0.5) * size * 0.6
        );
        group.add(sphere);
    }

    return group;
}

// --- PATH CLEARING LOGIC ---
function isLocationBlocked(x, z) {
    // 1. Road Check (Z > 25)
    if (z > 25) {
        const ratio = Math.max(0, 1.0 - (((250 - z) / 223) * 1.5));
        const roadX = -Math.cos(z * 0.1) * 3.0 * ratio;
        if (Math.abs(x - roadX) < 4.5) return true; // Asphalt + Clearance
    }

    // 2. Roundabout Check (Z around 20)
    const roundaboutZ = 20;
    const distToRoundaboutCenter = Math.sqrt(x * x + (z - roundaboutZ) * (z - roundaboutZ));
    // Road is between radial 3.5 and 7.2 approx
    if (distToRoundaboutCenter > 3.2 && distToRoundaboutCenter < 8.2) return true;

    // 3. Driveway Check (Bezier curve between house and garage)
    if (x > -2 && x < 12 && z > 2 && z < 22) {
        // Simple Bezier approximation check
        const P0 = { x: 0, z: 20 };
        const P1 = { x: 10, z: 20 };
        const P2 = { x: 10, z: 5 };

        for (let t = 0; t <= 1; t += 0.1) {
            const bx = (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x;
            const bz = (1 - t) * (1 - t) * P0.z + 2 * (1 - t) * t * P1.z + t * t * P2.z;
            const dist = Math.sqrt((x - bx) * (x - bx) + (z - bz) * (z - bz));
            if (dist < 2.5) return true; // Driveway width clearance
        }
    }

    return false;
}
window.isLocationBlocked = isLocationBlocked;

// --- PLACE BUSHES ALONG GRAVEL PATH ---
function addBushesAlongPath(scene, houseGroup) {
    const bushGroup = new THREE.Group();
    bushGroup.name = 'bushes';

    // Define gravel path boundaries
    const pathInnerRadius = 12.0;

    // Place more bushes but check for path clearance
    const numBushes = 60; // Increased density

    for (let i = 0; i < numBushes; i++) {
        const angle = (i / numBushes) * Math.PI * 2;
        const radius = pathInnerRadius + (Math.random() - 0.5) * 4.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // STRICT CLEARANCE CHECK
        if (isLocationBlocked(x, z)) continue;

        const bush = createBush(0.5 + Math.random() * 0.7);
        bush.position.set(x, 0, z);
        bush.rotation.y = Math.random() * Math.PI * 2;

        // Randomly align to planet if helper exists
        if (window.alignToPlanet) window.alignToPlanet(bush, x, z);

        bushGroup.add(bush);
    }

    // Add some bushes in the roundabout center (safe zone)
    for (let i = 0; i < 15; i++) {
        const r = Math.random() * 2.8;
        const a = Math.random() * Math.PI * 2;
        const x = Math.cos(a) * r;
        const z = 20 + Math.sin(a) * r;

        const bush = createBush(0.4 + Math.random() * 0.4);
        bush.position.set(x, 0, z);
        if (window.alignToPlanet) window.alignToPlanet(bush, x, z);
        bushGroup.add(bush);
    }

    if (houseGroup) {
        houseGroup.add(bushGroup);
    } else {
        scene.add(bushGroup);
    }

    return bushGroup;
}

// --- DISTANT BUILDINGS (Background Skyline) ---
function createDistantBuildings(scene) {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = 'distantBuildings';

    const distanceFromCenter = 80; // Far behind the house
    const numBuildings = 12;

    for (let i = 0; i < numBuildings; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const distance = distanceFromCenter + Math.random() * 20;

        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        // Only place buildings in back half (behind house)
        if (z < -20) {
            const height = 8 + Math.random() * 25;
            const width = 3 + Math.random() * 5;
            const depth = 3 + Math.random() * 5;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshStandardMaterial({
                color: 0x25232d,
                roughness: 0.7,
                metalness: 0.4
            });

            const building = new THREE.Mesh(geometry, material);
            building.position.set(x, height / 2, z);
            building.castShadow = true;

            // Add windows
            const windowGeo = new THREE.PlaneGeometry(width * 0.8, height * 0.8);
            const windowMat = new THREE.MeshBasicMaterial({
                color: 0xffff88,
                transparent: true,
                opacity: 0.3
            });

            const windows = new THREE.Mesh(windowGeo, windowMat);
            windows.position.z = depth / 2 + 0.01;
            building.add(windows);

            buildingGroup.add(building);
        }
    }

    // --- SKY MOON (Davicon 3-Coloured Disc) ---
    // Place a giant, distant version of the 3-coloured davicon in the sky behind the skyscrapers
    if (window.textureLoader) {
        // Using /house/assets/images/davicon.png as per final clarification
        const davTex = window.textureLoader.load('assets/images/davicon.png');
        const davMat = new THREE.SpriteMaterial({ 
            map: davTex, 
            transparent: true,
            opacity: 0.35, // Very high transparency to smoothly blend directly into the sky backdrop
            blending: THREE.NormalBlending, 
            color: 0xffffff,
            depthWrite: false, // Ensures it sits well behind translucent things
            fog: false // CRITICAL: Stop the deep purple distance mist from washing out its original colors!
        });
        const davMoon = new THREE.Sprite(davMat);
        davMoon.name = 'skyMoonDavicon';
        
        // Lower to horizon (y: 30), pushed back comfortably
        davMoon.position.set(0, 30, -180); 
        davMoon.scale.set(30, 30, 1); 
        buildingGroup.add(davMoon);
    }

    // V-FIX: Ensure buildings are inside worldGroup so they hide during room transitions
    const targetGroup = window.worldGroup || scene;
    targetGroup.add(buildingGroup);
    return buildingGroup;
}

// --- ENHANCED GARAGE DOOR WITH PARALLAX VOID & BUILDING ---
function createGarageDoor(parentGroup, position) {
    const garageGroup = new THREE.Group();
    // V-FIX 1944: Lowered from 0.15 to 0.05 to sit correctly on gravel (driveway is 0.13)
    if (position) garageGroup.position.set(position.x, position.y + 0.05, position.z);
    garageGroup.name = 'garageSystem';

    // Building dimensions
    const garageWidth = 3.2;
    const garageHeight = 2.2;
    const garageDepth = 2.6;
    const doorWidth = 2.8;
    const doorHeight = 1.8;
    const doorThickness = 0.1;

    // --- 1. WALLS & STRUCTURE (V-FIX: No more gaps!) ---
    const garageExtMat = new THREE.MeshStandardMaterial({
        color: 0x4a3a2a, // Exterior Brown
        roughness: 0.8
    });
    const garageIntMat = new THREE.MeshBasicMaterial({
        color: 0x000000 // Pitch Black Interior
    });

    const walls = new THREE.Group();

    // Reusable Wall Creator (Box instead of Plane for thickness/gaps)
    function createWall(w, h, d, x, y, z, ry = 0) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), garageExtMat);
        wall.position.set(x, y, z);
        wall.rotation.y = ry;
        wall.castShadow = true;
        wall.receiveShadow = true;
        walls.add(wall);

        // Add matching interior lining (Black)
        const lining = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.01, h - 0.01), garageIntMat);
        lining.position.set(0, 0, d / 2 + 0.01); // Slightly in front of the box face
        wall.add(lining);
    }

    // Back Wall
    createWall(garageWidth, garageHeight, 0.2, 0, garageHeight / 2, -garageDepth / 2);

    // Side Walls
    createWall(garageDepth, garageHeight, 0.2, -garageWidth / 2, garageHeight / 2, 0, Math.PI / 2);
    createWall(garageDepth, garageHeight, 0.2, garageWidth / 2, garageHeight / 2, 0, -Math.PI / 2);

    // Floor
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(garageWidth, 0.1, garageDepth),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
    );
    floor.position.y = 0.05; // 0.1 height / 2
    walls.add(floor);

    // Floor extension in front to cover driveway (fixes "missing gravel")
    const floorExt = new THREE.Mesh(
        new THREE.PlaneGeometry(garageWidth, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 })
    );
    floorExt.rotation.x = -Math.PI / 2;
    floorExt.position.set(0, 0.01, garageDepth / 2 + 0.25);
    walls.add(floorExt);

    // Ceiling (Simple interior flat ceiling)
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(garageWidth, 0.1, garageDepth), garageExtMat);
    ceil.position.y = garageHeight;
    walls.add(ceil);

    const ceilInt = new THREE.Mesh(new THREE.PlaneGeometry(garageWidth - 0.1, garageDepth - 0.1), garageIntMat);
    ceilInt.rotation.x = Math.PI / 2;
    ceilInt.position.set(0, -0.06, 0); // Under ceiling
    ceil.add(ceilInt);

    // Front Facade (framing the door)
    const fw = (garageWidth - doorWidth) / 2;
    const frameZ = garageDepth / 2;

    if (fw > 0) {
        // Left frame
        const lf = new THREE.Mesh(new THREE.BoxGeometry(fw, doorHeight, 0.1), garageExtMat);
        lf.position.set(-garageWidth / 2 + fw / 2, doorHeight / 2, frameZ);
        walls.add(lf);
        // Right frame
        const rf = new THREE.Mesh(new THREE.BoxGeometry(fw, doorHeight, 0.1), garageExtMat);
        rf.position.set(garageWidth / 2 - fw / 2, doorHeight / 2, frameZ);
        walls.add(rf);
    }

    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(garageWidth, garageHeight - doorHeight, 0.1), garageExtMat);
    topFrame.position.set(0, doorHeight + (garageHeight - doorHeight) / 2, frameZ);
    walls.add(topFrame);

    // V-ADD 1944: Small stars on interior walls for "Deep Space" feel
    function addWallStars(parent, count = 20) {
        const starGeo = new THREE.BufferGeometry();
        const pos = [];
        for (let i = 0; i < count; i++) pos.push((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5, 0.02);
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.03, color: 0xffffff, transparent: true, opacity: 0.8 }));
        parent.add(stars);
    }
    walls.children.forEach(w => {
        // Find the 'lining' mesh if it exists
        w.children.forEach(child => {
            if (child.material === garageIntMat) addWallStars(child, 25);
        });
    });

    garageGroup.add(walls);

    // Side Window
    const sideWinMat = new THREE.MeshStandardMaterial({ color: 0x88aacc, emissive: 0x444444, emissiveIntensity: 0.3 });
    const sideWin = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), sideWinMat);
    sideWin.position.set(garageWidth / 2 + 0.11, 1.4, 0);
    sideWin.rotation.y = Math.PI / 2;
    garageGroup.add(sideWin);

    // --- 2. DOOR GROUP for proper pivot (at top) ---
    const doorPivot = new THREE.Group();
    doorPivot.position.set(0, doorHeight, frameZ + 0.05); // Pivot at the top edge
    garageGroup.add(doorPivot);

    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.6,
        metalness: 0.2,
        emissive: 0x331a0a,
        emissiveIntensity: 0.2
    });

    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.y = -doorHeight / 2; // Offset so it hangs down from pivot
    door.name = 'garageDoor';
    door.userData.type = 'garageDoorTrigger';
    door.userData.onClick = () => {
        if (!doorOpen) {
            // If closed, open it
            garageGroup.userData.toggleDoor();
        } else {
            // If already open, enter the void
            if (window.enterRoom) {
                window.garageForVoid = garageGroup;
                window.enterRoom('space');
            }
        }
    };
    doorPivot.add(door);

    // Door Panels
    const panelCanvas = document.createElement('canvas');
    panelCanvas.width = 512; panelCanvas.height = 512;
    const pctx = panelCanvas.getContext('2d');
    pctx.fillStyle = '#8B4513'; pctx.fillRect(0, 0, 512, 512);
    pctx.strokeStyle = '#5d2906'; pctx.lineWidth = 10;
    for (let i = 0; i < 4; i++) {
        pctx.strokeRect(20, i * 120 + 20, 472, 100);
    }
    const doorTex = new THREE.CanvasTexture(panelCanvas);
    door.material.map = doorTex;

    // --- 3. PARALLAX VOID ---
    const voidGroup = new THREE.Group();
    voidGroup.position.set(0, doorHeight / 2, frameZ - 0.1);
    voidGroup.name = 'voidSpace';
    voidGroup.visible = false;

    // Add dark background plane for deep space darkness
    const darkBg = new THREE.Mesh(
        new THREE.PlaneGeometry(garageWidth - 0.1, garageHeight - 0.1),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    darkBg.position.z = -2.49; // Slightly in front of the back wall to prevent Z-fighting
    voidGroup.add(darkBg);

    const layers = [
        { distance: -2.0, size: 4.0, numStars: 150, brightness: 0.15 },
        { distance: -1.2, size: 3.5, numStars: 100, brightness: 0.25 },
        { distance: -0.4, size: 3.0, numStars: 50, brightness: 0.4 }
    ];

    layers.forEach((layer, layerIndex) => {
        const layerGroup = new THREE.Group();
        layerGroup.position.z = layer.distance;

        const starGeo = new THREE.BufferGeometry();
        const pos = [];
        for (let i = 0; i < layer.numStars; i++) {
            pos.push((Math.random() - 0.5) * layer.size, (Math.random() - 0.5) * layer.size, (Math.random() - 0.5) * 0.5);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: layer.brightness });
        layerGroup.add(new THREE.Points(starGeo, starMat));

        const nebulaCanvas = document.createElement('canvas');
        nebulaCanvas.width = 512; nebulaCanvas.height = 512;
        const ctx = nebulaCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        grad.addColorStop(0, 'rgba(60, 30, 90, 0.08)'); // Much darker purple
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 512);

        const nebMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(nebulaCanvas), transparent: true, blending: THREE.AdditiveBlending });
        layerGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(layer.size, layer.size), nebMat));

        layerGroup.userData.parallaxSpeed = (3 - layerIndex) * 0.5;
        voidGroup.add(layerGroup);
    });
    garageGroup.add(voidGroup);

    // --- 4. ROOF ---
    const roofWidth = garageWidth + 0.4;
    const roofHeight = 1.0;
    const roofDepth = garageDepth + 0.2; // Reduced overhang in front
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-roofWidth / 2, 0);
    roofShape.lineTo(0, roofHeight);
    roofShape.lineTo(roofWidth / 2, 0);
    roofShape.lineTo(-roofWidth / 2, 0);
    const extrudeSettings = {
        depth: roofDepth,
        bevelEnabled: false
    };
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofGeo.translate(0, 0, -roofDepth / 2 - 0.1);
    const roofTex = createRoofTexture();
    const tRoofMat = new THREE.MeshStandardMaterial({
        map: roofTex,
        color: 0xcc1010,
        roughness: 0.85,
        side: THREE.DoubleSide
    });
    // Material 0: Front/Back caps (Wood), Material 1: Extruded Sides (Red Roof)
    const roofMats = [garageExtMat, tRoofMat];
    const roof = new THREE.Mesh(roofGeo, roofMats);
    roof.position.set(0, garageHeight + 0.01, 0);
    roof.castShadow = true;
    garageGroup.add(roof);

    // --- 5. INTERACTION ---
    let doorOpen = false;
    let doorRotAmt = 0;
    const openSound = new Audio('/assets/audio/garage-door-opening.mp3');
    const closeSound = new Audio('/assets/audio/garage-door-closing.mp3');

    garageGroup.userData.openDoor = function () {
        if (doorOpen) return;
        doorOpen = true;
        openSound.currentTime = 0;
        openSound.play().catch(err => { });
        voidGroup.visible = true;
        if (voidClickArea) voidClickArea.visible = true;
    };

    garageGroup.userData.closeDoor = function () {
        if (!doorOpen) return;
        doorOpen = false;
        closeSound.currentTime = 0;
        closeSound.play().catch(err => { });
        voidGroup.visible = false;
        if (voidClickArea) voidClickArea.visible = false;
    };

    garageGroup.userData.toggleDoor = function () {
        if (doorOpen) garageGroup.userData.closeDoor();
        else garageGroup.userData.openDoor();
    };

    const clickArea = new THREE.Mesh(
        new THREE.PlaneGeometry(doorWidth, doorHeight),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0 })
    );
    clickArea.position.set(0, doorHeight / 2, frameZ + 0.1);
    clickArea.userData.type = 'garageDoorTrigger';
    clickArea.userData.name = 'space'; // Corrected name to match roomContent['space']
    clickArea.userData.tooltip = 'THE VOID';
    clickArea.userData.onClick = () => {
        if (!doorOpen) {
            garageGroup.userData.toggleDoor();
        } else {
            if (window.enterRoom) {
                window.garageForVoid = garageGroup;
                window.enterRoom('space');
            }
        }
    };
    garageGroup.add(clickArea);

    const voidClickArea = new THREE.Mesh(
        new THREE.PlaneGeometry(doorWidth, doorHeight),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 })
    );
    voidClickArea.position.set(0, doorHeight / 2, frameZ - 0.2);
    voidClickArea.userData.type = 'voidEntrance';
    voidClickArea.userData.name = 'space';
    voidClickArea.userData.tooltip = 'ENTER THE VOID';
    voidClickArea.userData.onClick = () => {
        if (doorOpen && window.enterRoom) {
            window.garageForVoid = garageGroup;
            window.enterRoom('space');
        }
    };
    voidClickArea.visible = false;
    garageGroup.add(voidClickArea);

    garageGroup.userData.update = function (deltaTime, camera) {
        const target = doorOpen ? -Math.PI / 1.5 : 0;
        doorRotAmt += (target - doorRotAmt) * 0.8 * deltaTime;
        doorPivot.rotation.x = doorRotAmt;

        if (voidGroup.visible && camera) {
            // Parallax Logic
            const worldPos = new THREE.Vector3();
            garageGroup.getWorldPosition(worldPos);

            const relX = (camera.position.x - worldPos.x) * 0.03;
            const relY = (camera.position.y - worldPos.y) * 0.03;
            const camAngle = Math.atan2(camera.position.x - worldPos.x, camera.position.z - worldPos.z);

            voidGroup.children.forEach((layer, i) => {
                if (layer.userData && layer.userData.parallaxSpeed) {
                    const speed = layer.userData.parallaxSpeed;
                    // Rotation parallax
                    layer.rotation.y = camAngle * 0.1 * speed;

                    // Texture/Shift parallax
                    layer.children.forEach(child => {
                        if (child.material && child.material.map) {
                            child.material.map.offset.set(-relX * speed, -relY * speed);
                        }
                    });
                }
            });
        }
    };

    // Local Light REMOVED per user request (was too bright/glitchy)
    // const gLight = new THREE.PointLight(0xfff0dd, 2.0, 10);
    // gLight.position.set(0, 1.5, 0);
    // garageGroup.add(gLight);

    parentGroup.add(garageGroup);
    if (window.interiorClickables) {
        window.interiorClickables.push(door);
        window.interiorClickables.push(voidClickArea);
    }
    return garageGroup;

}

// --- TOILET EXTERIOR (The "Little Room") ---
// --- TOILET EXTERIOR (The "Little Room") ---
function createToiletExterior(parentGroup, position) {
    const toiletGroup = new THREE.Group();
    if (position) toiletGroup.position.copy(position);
    toiletGroup.name = 'toiletExterior';

    // Dimensions - Turned Around design
    // Design: Lean-to. High at Back (-Z), Low at Front (+Z).
    const width = 1.3;          // Tightened width (was 1.6)
    const heightAtHouse = 2.9;  // Levelling with neighbors
    const heightAtGarden = 2.1; // Low point (Front)
    const depth = 2.5;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xdcb28b, roughness: 0.9 });

    // 1. Side Walls
    // Draw shape in XY. 
    // Let's define shape from Front(Low) to Back(High).
    // x=0 is Low, x=depth is High.
    const sideShape = new THREE.Shape();
    sideShape.moveTo(0, 0);
    sideShape.lineTo(depth, 0);
    sideShape.lineTo(depth, heightAtHouse);
    sideShape.lineTo(0, heightAtGarden);
    sideShape.lineTo(0, 0);

    const sideGeo = new THREE.ExtrudeGeometry(sideShape, { depth: 0.1, bevelEnabled: false });

    // Left Wall
    const leftWall = new THREE.Mesh(sideGeo, wallMat);
    // Rotate -90 Y: Shape X becomes World Z.
    // Shape X=0 (Low/Garden) -> World -Z relative to pivot.
    // Shape X=depth (High/House) -> World +Z relative to pivot.
    leftWall.rotation.y = -Math.PI / 2;
    // Position Pivot: Center X, Low Z.
    // We want Low Z to be at -depth/2 (Garden).
    // So Pivot (Shape 0) should be at -depth/2.
    leftWall.position.set(-width / 2, 0, -depth / 2);
    leftWall.castShadow = true;
    toiletGroup.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(sideGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(width / 2 + 0.1, 0, -depth / 2);
    rightWall.castShadow = true;
    toiletGroup.add(rightWall);

    // Front Wall (Low side, Z = -depth/2) - Garden Facing
    const frontGeo = new THREE.BoxGeometry(width - 0.05, heightAtGarden, 0.1); // Slightly narrower to fit inside sides
    const frontWall = new THREE.Mesh(frontGeo, wallMat);
    frontWall.position.set(0, heightAtGarden / 2, -depth / 2);
    frontWall.castShadow = true;
    toiletGroup.add(frontWall);

    // Back Wall (High side) -> REMOVED to prevent Z-fighting with main house walls
    // Since it leans against the house, we don't need a back face.

    // 2. Shed Roof (Slanted Platform)
    // Sloping UP from Garden (-Z) to House (+Z)
    const roofLength = Math.sqrt(Math.pow(depth, 2) + Math.pow(heightAtHouse - heightAtGarden, 2));
    const roofGeo = new THREE.BoxGeometry(width + 0.4, 0.15, roofLength + 0.4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeo, roofMat);

    // Position: Center (y averaged, z=0)
    roof.position.set(0, (heightAtHouse + heightAtGarden) / 2 + 0.1, 0);

    // Rotation: 
    // Low at -Z, High at +Z.
    // Rot X neg -> +Z goes UP.
    const angle = Math.atan2(heightAtHouse - heightAtGarden, depth);
    roof.rotation.x = -angle;

    roof.castShadow = true;
    toiletGroup.add(roof);

    // 3. Door (Front - Low side - Garden Facing)
    const doorGeo = new THREE.PlaneGeometry(0.7, 1.8);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, side: THREE.DoubleSide });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.9, -depth / 2 - 0.06);
    door.rotation.y = Math.PI; // Face garden
    toiletGroup.add(door);

    // Symbol
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), new THREE.MeshBasicMaterial({ color: 0x110000 }));
    hole.position.set(0, 1.8, -depth / 2 - 0.07); // Adjusted height
    hole.rotation.y = Math.PI;
    toiletGroup.add(hole);

    // Interaction Hitbox
    const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, heightAtHouse, depth + 0.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = heightAtHouse / 2;
    hitBox.userData = {
        name: 'toilet',
        tooltip: 'Little Room',
        onClick: () => { if (window.enterRoom) window.enterRoom('toilet'); }
    };
    toiletGroup.add(hitBox);

    if (window.interiorClickables) {
        window.interiorClickables.push(hitBox);
    }

    parentGroup.add(toiletGroup);
    return toiletGroup;
}


// --- MAIN HOUSE SETUP FUNCTION ---
function setupEnhancedHouse(scene, camera) {
    const houseGroup = new THREE.Group();
    houseGroup.name = 'mainHouse';

    // 1. Pixelated Grass Ground
    const grassTexture = createPixelatedGrassTexture();
    const groundGeometry = new THREE.CircleGeometry(50, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        roughness: 0.9
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. House structure (placeholder - adapt to your existing house)
    const houseBody = new THREE.Mesh(
        new THREE.BoxGeometry(10, 6, 8),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    houseBody.position.y = 3;
    houseBody.castShadow = true;
    houseGroup.add(houseBody);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(7, 3, 4);
    const roof = new THREE.Mesh(
        roofGeometry,
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    roof.position.y = 7.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // 3. Add Garage Door (on the side)
    const garageDoor = createGarageDoor(houseGroup, new THREE.Vector3(7, 0, 0));

    // 4. Add "Little Room" (Toilet) Exterior (on the left)
    createToiletExterior(houseGroup, new THREE.Vector3(-6, 0.05, 0));

    // 5. Add Bushes
    addBushesAlongPath(scene, houseGroup);

    scene.add(houseGroup);

    // Animation loop hook
    window.updateHouse = function (deltaTime) {
        if (garageDoor && garageDoor.userData.update) {
            garageDoor.userData.update(deltaTime, camera);
        }
    };

    return houseGroup;
}

// Export for use in main script
if (typeof window !== 'undefined') {
    window.setupEnhancedHouse = setupEnhancedHouse;
    window.createGarageDoor = createGarageDoor;
    window.createToiletExterior = createToiletExterior;
    window.addBushesAlongPath = addBushesAlongPath;
    window.createDistantBuildings = createDistantBuildings;
    window.createPixelatedGrassTexture = createPixelatedGrassTexture;
}

// --- NEW HELPERS ---
window.resetToIdleView = function () {
    // If inside a room, exit it
    if (state === 'ROOM') {
        exitRoom();
        return;
    }
    // If already in house, just reset camera
    if (state === 'HOUSE') {
        // Smoothly tween back to idle
        if (controls) {
            // controls.reset() works if we used saveState(), but we might explicit set
            new TWEEN.Tween(camera.position)
                .to({ x: 14, y: 12, z: 18 }, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            new TWEEN.Tween(controls.target)
                .to({ x: 0, y: 0, z: 0 }, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => controls.update())
                .start();
        }
    }
};


// --- INFO PANEL TOGGLE LOGIC ---
window.initInfoPanelToggle = function () {
    const btn = document.getElementById('info-toggle-btn');
    if (!btn) return;

    // Clone to remove old listeners
    const newBtn = btn.cloneNode(true);
    if (btn.parentNode) btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent raycaster click
        e.preventDefault();

        const content = document.getElementById('info-content');
        const icon = document.getElementById('info-toggle-icon');
        const panel = document.getElementById('room-info');

        if (!content || !panel) return;

        const isMinimised = content.style.display === 'none';

        if (isMinimised) {
            // EXPAND
            content.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)'; // V-Shape
            panel.classList.remove('w-10', 'h-10'); // Remove minimised size
            panel.classList.add('w-64'); // Restore width
            newBtn.title = "Minimize Info";
        } else {
            // MINIMISE
            content.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)'; // Triangle Shape
            panel.classList.remove('w-64');
            panel.classList.add('w-10', 'h-10'); // Shrink to button size
            newBtn.title = "Expand Info";
        }
    });
};

// Auto-run init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initInfoPanelToggle);
} else {
    window.initInfoPanelToggle();
}
