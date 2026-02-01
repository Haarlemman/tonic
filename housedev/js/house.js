function createGenericInterior(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.font = 'bold 40px "Glass Antiqua", cursive'; ctx.textAlign = 'center';
    ctx.shadowColor = "black"; ctx.shadowBlur = 4; ctx.fillText(text, 256, 128);
    const tex = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    plane.position.set(0, 4, -4.9);
    interiorGroup.add(plane);
}
class MMAnimation {
    constructor(width, height) {
        this.width = width || 1024;
        this.height = height || 1024;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d', { alpha: true }); // Enable Alpha

        this.cx = this.width / 2;
        this.cy = this.height / 2;

        this.scrollPos = 0;
        this.targetScroll = 0;
        this.time = 0;

        this.universeStarted = false;
        this.lastInteraction = Date.now();
        this.isAutoPlaying = true; // Default auto-play

        // CONFIG (Adapted from mm/index.html)
        this.UNIVERSE_CONFIG = {
            // General Settings
            background: 'transparent', // Transparent background! 
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
                baseSpeed: 15, // Speed up slightly since no scroll interaction?
                brakeStart: 11500,
                idleDelay: 3000
            }
        };

        this.FL = 500;
        this.WORLD_END = 15500;
        this.objects = [];
        this.stars = [];

        this.initWorld();

        // Auto-start immediately
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
        // Audio would go here if we ported it, but for 3D mesh focus we might skip audio first
        // or hook it up later. User focused on visuals "lines coming out".
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
                // Keep center transparent if possible? Original code drew black.
                // ctx.fillStyle = '#000'; // Void center stays black
                // Let's use transparent for the void to see through!
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
function createBasementInterior() {
    // -- METROPOLIS --
    // V140: Darker Floor (0x111111 -> 0x050505)
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    const gridHelper = new THREE.GridHelper(10, 10, 0x00ffcc, 0x222222);
    gridHelper.position.y = 0.05;
    interiorGroup.add(gridHelper);

    // Floating Nodes
    const nodeCount = 60;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    for (let i = 0; i < nodeCount; i++) {
        const isTruth = i % 2 === 0;
        const nodeMat = new THREE.MeshBasicMaterial({ color: isTruth ? 0x00ffcc : 0xff00ff });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set((Math.random() - 0.5) * 8, Math.random() * 6 + 0.5, (Math.random() - 0.5) * 8);
        node.userData = {
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01),
            originalY: node.position.y,
            isTruth: isTruth
        };
        basementNodes.push(node);
        interiorGroup.add(node);
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry();
    basementLines = new THREE.LineSegments(lineGeo, lineMat);
    interiorGroup.add(basementLines);

    // TRON VIDEO
    videoElement.src = "../assets/video/tron-space.mp4";
    videoElement.muted = true; videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));
    videoTexture = new THREE.VideoTexture(videoElement);
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: videoTexture, opacity: 0.5, transparent: true, blending: THREE.AdditiveBlending }));
    bgMesh.position.set(0, 4, -4.9);
    interiorGroup.add(bgMesh);

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('basement');
        if (item) {
            item.position.set(-2, 2, -2); // Near nodes
            interiorGroup.add(item);
        }
    }


}
console.log("--- HOUSE.JS LOADED ---");

let openingFog;
let openingAnimationDone = false;
let fireflies = [];
let mistLayer = null;
window.metropolisRobot = null; // V-REFINE: Global Robot Reference
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
// HOUSE MUSIC STATE
let houseMusicTime = 0;
const HOUSE_TRACK = "../assets/audio/premonition.mp3";

// -- LIGHTS --
let dirLight, rimLight, ambientLight, hemiLight;

let noteTextSprite = null;
let thoughtSprite = null;
let thoughtInterval = null;
let thoughtParticles = [];
let infoTimeout = null;

let state = 'HOUSE';
let currentRoom = null;
window.currentTrackIndex = 0; // V-FIX: Global for Music Highlight
window.masterVideoIndex = 0;  // V-FIX: Global for Video Highlight
let isTVVideoMode = false;
let hoveredObject = null;
const interiorClickables = [];
window.interiorClickables = interiorClickables; // V-FIX: Global Access for Room Scripts

let tvMesh = null, currentSlideIndex = 0;
let phoneScreenMesh = null;
var isMusicPlaying = false;

let atomGroup = null;
let basementNodes = [];
let basementLines = null;
let audioContext, audioAnalyser, audioDataArray;
let pointerDownX = 0, pointerDownY = 0, isPossibleClick = false;



// Wrapped Init
console.log("--- HOUSE.JS V305-HOLOGRAM-RESTORED ---");
console.log("%c V500 - UNBREAKABLE SYNC LOADED ", "background: #222; color: #bada55; font-size: 20px;");
scene = new THREE.Scene();
// V-REFINE: Clarity Boost (Lighter and Less Foggy per User Request)
scene.fog = new THREE.Fog(0x2d1b4e, 30, 600); // Lighter (Was 10, 250)
openingFog = scene.fog;
// V-TEST: Red Background Removed
scene.background = new THREE.Color(0x2d1b4e);

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2.8, 51.9, 175.9); // V-FIX: Match Flight Start to prevent Jump
camera.lookAt(-1.94, -20.5, -0.94);
window.camera = camera;
scene.add(camera);

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.domElement.style.filter = 'blur(0px)';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // V204: Soft Shadows
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

textureLoader = new THREE.TextureLoader();

// LIGHTS
// V-REFINE: Lighter Exterior Atmosphere (0.25 -> 0.45)
ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
window.ambientLight = ambientLight;
scene.add(ambientLight);

// Dim Global Fill
// V-REFINE: Lighter Fill (0.3 -> 0.45)
hemiLight = new THREE.HemisphereLight(0xffffff, 0x442288, 0.45);
window.hemiLight = hemiLight;
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// V-REFINE: Brighter Moon (0.7 -> 1.1)
dirLight = new THREE.DirectionalLight(0xfffaed, 1.1);
window.dirLight = dirLight;
dirLight.position.set(50, 80, 30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -50; dirLight.shadow.camera.right = 50; dirLight.shadow.camera.top = 50; dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

rimLight = new THREE.PointLight(0x88ccff, 0.4);
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
scene.add(worldGroup);
interiorGroup = new THREE.Group();
scene.add(interiorGroup);
interiorGroup.visible = false;

window.isZoomingToRoom = false;
window.introFinished = false;

buildWorld();
// buildEnvironment called in buildWorld


// Initialize Word Hunt
if (typeof WordHunt !== 'undefined') {
    WordHunt.init();
}

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
    console.log("Global Interaction Listeners Initialized");
}

// V-AUDIT: Consolidated Media Manager (Audit Item 2, 3, 4)
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
videoElement = window.mediaManager.video;
audioPlayer = window.mediaManager.audio;
window.audioPlayer = audioPlayer;
window.videoElement = videoElement;
window.musicSwitchMesh = null;
window.getMusicSwitch = () => musicSwitchMesh;

function handleGlobalClick(event) {
    // 1. Pixel Band Exit Logic
    if (event.target && event.target.closest('#pixel-band')) {
        if (document.fullscreenElement || document.getElementById('start-btn').style.display === 'none') {
            exitExperience();
        }
    }

    // 2. Room State Logic (Audit Recommendation)
    // if (state === 'HOUSE') handleHouseClick(event);
    // if (state === 'ROOM') handleRoomClick(event);
}

// V290: Robust Loader Logic (Wait for Build)
window.hideLoader = function () {
    console.log("--- Hiding 3D Loader ---");
    const loader = document.getElementById('loading');
    if (loader) {
        loader.style.transition = 'opacity 0.8s ease';
        loader.style.opacity = '0';
        const topControls = document.getElementById('top-controls');
        if (topControls) topControls.style.opacity = '1';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
    window.introFinished = true;
};

const header = document.getElementById('main-header');
if (header) {
    header.style.transform = 'scale(1)';
    const h1 = header.querySelector('h1');
    let naturalWidth = 300;
    if (h1) {
        const range = document.createRange();
        range.selectNodeContents(h1);
        naturalWidth = range.getBoundingClientRect().width;
    }
    header.dataset.naturalWidth = naturalWidth;
    const isMobile = window.innerWidth < 768;
    const startPct = isMobile ? 0.8 : 0.7;
    const startScale = (window.innerWidth * startPct) / naturalWidth;
    header.style.transform = `scale(${startScale})`;
    header.style.opacity = '1';
}

// Redundant click listener commented out (Audit Item 5)
/*
document.addEventListener('click', function (e) {
    if (e.target && e.target.closest('#pixel-band')) {
        if (document.fullscreenElement || document.getElementById('start-btn').style.display === 'none') {
            exitExperience();
        }
    }
});
*/

const minBtn = document.getElementById('min-btn');
if (minBtn) minBtn.addEventListener('click', toggleInfo);
const infoHeader = document.querySelector('#room-info .room-header-flex');
if (infoHeader) infoHeader.addEventListener('click', toggleInfo);

const headerContent = document.getElementById('header-content');
if (headerContent) {
    headerContent.classList.remove('max-h-0', 'overflow-hidden');
    headerContent.classList.add('max-h-40', 'overflow-visible');
    headerContent.style.maxHeight = '160px';
    localStorage.setItem('headerCollapsed', 'false');
}

animate();

// V290: Trigger hide after build is complete
// Redundant fallback timeout removed (Audit Item 7)
/*
setTimeout(() => {
    if (window.hideLoader) window.hideLoader();
}, 2500); // 2.5s safe minimum (was 1.5s)
*/


window.exitExperience = function () {
    // 1. Exit Fullscreen
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();

    // 2. Show Header
    const headerEl = document.getElementById('main-header');
    if (headerEl) {
        headerEl.style.display = 'flex'; // Restore visibility
        headerEl.style.opacity = '1';
        headerEl.classList.remove('header-move-up'); // Reset position
        // Force reflow?
        void headerEl.offsetWidth;
    }

    // 3. Hide Exit Button
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) exitBtn.classList.add('hidden');

    // 4. Show Start Button again
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.style.display = 'inline-block';
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

    // V138: Reverted Darkening (User said it affected exterior only)
    const darkColor = color; // No multiplier

    const mat = new THREE.MeshStandardMaterial({
        color: darkColor,
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
            // V-FIX: Ensure Frame is Clickable (Propagate Name)
            frame.userData = { name: name, type: 'room' };

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
                    // V303: Darker Interior Glow (0.6 -> 0.4)
                    emissiveIntensity: 0.4,
                    roughness: 0.2
                })
            );
            glass.position.z = 0.06;

            // -- WINDOW ANIMATION SETUP --
            glass.material.userData = {
                // V303: Base 0.4
                baseEmissive: 0.4,
                speed: 1.5 + Math.random() * 2.0,
                phase: Math.random() * Math.PI * 20,
                hueSpeed: 0.05 + Math.random() * 0.05,
                hueOffset: Math.random(),
            };
            windowFlickerMaterials.push(glass.material);

            // V-FIX: Ensure Glass is Clickable
            glass.userData = { name: name, type: 'room' };

            frame.add(glass);
            mesh.add(frame);
        });
    }
    worldGroup.add(mesh);
}



// Restored buildWorld
function buildWorld() {
    buildHouse();
    buildEnvironment();
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
    // V326: Shrink hitboxes (was 2.5/2.0) to prevent Living Room selection issues
    const liveHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 5.0), new THREE.MeshBasicMaterial({ visible: true, transparent: true, opacity: 0 }));
    liveHitBox.position.set(-1.6, 1.8, 0);
    liveHitBox.userData = { name: 'living', type: 'room' };
    worldGroup.add(liveHitBox);

    createRoomBlock('studio', 1.0, 1.8, 0, 2.0, 2, 5, roomContent.studio.hex, [
        { type: 'dark', side: 'front', scale: 0.6, height: 1.0, shift: 0.2 },
        { type: 'dark', side: 'back', scale: 0.6, height: 1.0, shift: 0.2 }
    ]);
    const studioHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 5.0), new THREE.MeshBasicMaterial({ visible: true, transparent: true, opacity: 0 }));
    studioHitBox.position.set(1.5, 1.8, 0);
    studioHitBox.userData = { name: 'studio', type: 'room' };
    worldGroup.add(studioHitBox);
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
    // V311: Resized (0.4->0.28) to fit in gap (0.6-0.9)
    const plateGeo = new THREE.BoxGeometry(0.28, 0.3, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const plate = new THREE.Mesh(plateGeo, plateMat);

    // V-FIX: Centered in wall gap (0.75) and moved forward (2.54) to ensure visibility
    plate.position.set(0.75, 1.8, 2.54);

    // V-FIX 2: High Contrast Debug Version
    const numCanvas = document.createElement('canvas');
    numCanvas.width = 256; numCanvas.height = 256;
    const nctx = numCanvas.getContext('2d');

    // White Background
    nctx.fillStyle = '#ffffff';
    nctx.fillRect(0, 0, 256, 256);

    // Black Text (Arial)
    nctx.fillStyle = '#000000';
    nctx.font = 'bold 160px Arial, sans-serif';
    nctx.textAlign = 'center';
    nctx.textBaseline = 'middle';
    nctx.fillText("42", 128, 138);

    const numTex = new THREE.CanvasTexture(numCanvas);
    numTex.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space if available

    // Plane slightly smaller than plate to avoid edge overlap
    const numMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.26, 0.28),
        new THREE.MeshBasicMaterial({ map: numTex, transparent: false }) // Opaque for safety
    );

    // V-FIX: Massive Z-gap (0.05) to guarantee visibility
    numMesh.position.z = 0.05;
    plate.add(numMesh);
    worldGroup.add(plate);

    const hallHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.4, 1.0), // V326: Slightly narrowed
        new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true })
    );
    hallHitBox.position.set(0, 1.3, 3.0);
    hallHitBox.userData = { name: 'hall', type: 'room' };
    worldGroup.add(hallHitBox);

    // --- STAIRS SETUP (V230: User Geometry Fix) ---
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const stepW = 1.4; // Width
    const stepH = 0.2; // Height of each individual step
    const stepD = 0.4; // Depth of each tread

    // We want 3 steps leading to the door (which is at Y=1.5)
    // Step 3 (Lowest, furthest out)
    const s3 = new THREE.Mesh(new THREE.BoxGeometry(stepW + 0.4, stepH, stepD), stepMat);
    s3.position.set(0, stepH / 2, 3.5); // Y=0.1
    worldGroup.add(s3);

    // Step 2 (Middle)
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(stepW + 0.2, stepH, stepD), stepMat);
    s2.position.set(0, stepH + (stepH / 2), 3.1); // Y=0.3
    worldGroup.add(s2);

    // Step 1 (Highest, near door)
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, stepD), stepMat);
    s1.position.set(0, (stepH * 2) + (stepH / 2), 2.7); // Y=0.5
    worldGroup.add(s1);
    createRoomBlock('toilet', 0, 1.1, -3.5, 1.2, 2.2, 2.0, roomContent.toilet.hex, [
        { type: 'dark', scale: 0.6, side: 'left', narrow: true },
        { type: 'dark', scale: 0.6, side: 'right', narrow: true }
    ]);
    // -- CLICK AREA FOR TOILET --
    const toiletHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 2.4, 2.2),
        new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true })
    );
    toiletHitBox.position.set(0, 1.1, -3.5); // Fixed: Aligned with visual mesh (was 2.0)
    toiletHitBox.userData = { name: 'toilet', type: 'room' };
    worldGroup.add(toiletHitBox);

    createRoomBlock('bedroom', -1.0, 3.8, 0, 2.0, 2, 5, roomContent.bedroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    // -- CLICK AREA FOR BEDROOM --
    const bedHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.5, 5.2),
        new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true })
    );
    bedHitBox.position.set(-1.0, 3.8, 0);
    bedHitBox.userData = { name: 'bedroom', type: 'room' };
    worldGroup.add(bedHitBox);

    createRoomBlock('bathroom', 1.0, 3.8, 0, 2.0, 2, 5, roomContent.bathroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);

    // -- CLICK AREA FOR BATHROOM --
    const bathHitBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.5, 5.2),
        new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true })
    );
    bathHitBox.position.set(1.0, 3.8, 0);
    bathHitBox.userData = { name: 'bathroom', type: 'room' };
    worldGroup.add(bathHitBox);

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
    atticWinFrameFront.userData = { name: 'attic', type: 'room' }; // V-FIX
    const atticWinGlassFront = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.6 }));
    atticWinGlassFront.position.z = 0.06;
    atticWinGlassFront.userData = { name: 'attic', type: 'room' }; // V-FIX
    atticWinFrameFront.add(atticWinGlassFront);
    roof.add(atticWinFrameFront);

    const atticWinFrameBack = atticWinFrameFront.clone();
    atticWinFrameBack.position.set(0, -0.6, -2.6);
    atticWinFrameBack.rotation.y = Math.PI;
    // Clone ensures userData (shallow copy) but let's be sure
    atticWinFrameBack.userData = { name: 'attic', type: 'room' };
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




function createMistTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Clear transparent
    // ctx.clearRect(0, 0, 512, 512);
    // DEBUG: Add base fill to ensure visibility
    ctx.fillStyle = 'rgba(100, 0, 200, 0.2)';
    ctx.fillRect(0, 0, 512, 512);

    // Draw multiple soft "puffs" for a cloud-like effect
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 50 + Math.random() * 100;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const opacity = 0.5 + Math.random() * 0.4; // Significantly Increased for visibility
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
    tex.repeat.set(20, 20); // Repeat "cloud" hundreds of times (conceptually) for volume
    return tex;
}

function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // V301: Slightly Lighter Grass (User feedback: "too dark")
    // Base: Dark Green (was #050a03) -> #0a1406
    ctx.fillStyle = '#0a1406'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8000; i++) {
        const shade = Math.random();
        // Blades: Slightly lighter range
        // Was: #0d1808 / #12200c / #030802
        // New: #16260e / #1e3314 / #050a03
        ctx.fillStyle = shade > 0.7 ? '#16260e' : (shade > 0.4 ? '#1e3314' : '#050a03');
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
    ctx.fillStyle = '#cc0000'; ctx.font = 'bold 80px "Glass Antiqua", cursive';
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
    ctx.fillStyle = '#b91c1c'; ctx.font = 'bold 90px "Glass Antiqua", cursive'; ctx.fillText(line1, 256, 100);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 40px Arial, sans-serif'; ctx.fillText(line2, 256, 180);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
}

function createIntroSign() {
    const group = new THREE.Group();
    // Position in front of camera (Camera at 0, 20, 85)
    // V13: Lower slightly to 14 (V12 was 16 - too high)
    // V-FIX: Moved forward 2m (70 -> 72)
    group.position.set(0, 14, 72);
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
    const audio = new Audio('audio/Tension_Short_07.wav');
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
    const spotLight = new THREE.SpotLight(0xffaa00, 3.0); // V-FIX: Brighter but tighter
    spotLight.position.set(0, -0.2, 0);
    spotLight.target.position.set(0, -5, 0);
    spotLight.angle = Math.PI / 4; // V-FIX: Tighter Angle (PI/3 -> PI/4)
    spotLight.penumbra = 0.6; // Softer edges
    spotLight.castShadow = true;
    spotLight.distance = 12; // V-FIX: Tighter reach (15 -> 12)
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

    const signTex = createNewSignTexture();
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

    // V97: Make Sign Interactive -> REMOVED per user request
    // sign.userData = { type: 'enterSign', name: 'EnterSign' };

    poleGroup.add(sign);
    worldGroup.add(poleGroup);

    // Return the light that we want to flicker
    return spotLight;
}

function buildEnvironment() {
    const groundTex = createGrassTexture();
    // V-FIX: White color to let Green Texture show (was 0x666666)
    const planeMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1, color: 0xffffff });

    // V230: Planet Curvature Update (Flatter)
    const PLANET_RADIUS = 500;
    const planetGroup = new THREE.Group();
    // Center the sphere so its top surface touches (0,0,0)
    planetGroup.position.set(0, -PLANET_RADIUS, 0);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(PLANET_RADIUS, 128, 128), planeMat);
    sphere.receiveShadow = true; // V288: Enable Lamppost Shadows on ground
    planetGroup.add(sphere);

    worldGroup.add(planetGroup);

    worldGroup.add(planetGroup);

    // V130: Removed Mist Layer (User Request "Mist Leftover")
    mistLayer = null;

    // Helper: Get Height on Sphere for (x, z) relative to world origin (0,0,0)
    function getPlanetY(x, z) {
        const R = PLANET_RADIUS;
        const term = R * R - x * x - z * z;
        if (term < 0) return 0;
        return Math.sqrt(term) - R;
    }

    // Helper: Orient Object to Normal
    function alignToPlanet(obj, x, z) {
        const y = getPlanetY(x, z);
        obj.position.set(x, y, z);
        const normal = new THREE.Vector3(x, y + PLANET_RADIUS, z).normalize();
        obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    }

    // V44: Spherical Road (Epic Scale)
    const widthAtSteps = 1.4;
    const widthAtHorizon = 30.0; // V44: WIDE Horizon
    const stepZ = 2.7;
    const horizonZ = 150.0; // V44: Far Horizon
    const widthSlope = (widthAtHorizon - widthAtSteps) / (horizonZ - stepZ);

    // V-FIX: Road from distance toward house (ends at roundabout)
    const roadSegments = 100; // More segments for longer road
    const roadStartZ = 150; // Start far away
    const roadEndZ = 20; // End at roundabout position
    console.log("Road Config: From distance. Start:", roadStartZ, "End:", roadEndZ);

    const rVertices = [];
    const rIndices = [];
    const rUVs = [];
    const roadThickness = 0.5;

    for (let i = 0; i <= roadSegments; i++) {
        const ratio = i / roadSegments;
        const z = roadStartZ + (roadEndZ - roadStartZ) * ratio;

        // V-FIX: Constant Width Road (No taper, follows curvature)
        const currentWidth = 8.0; // Wider constant width

        const yTop = getPlanetY(0, z) + 0.1;
        const yBottom = yTop - roadThickness;

        rVertices.push(-currentWidth / 2, yTop, z);
        rVertices.push(currentWidth / 2, yTop, z);
        rVertices.push(-currentWidth / 2, yBottom, z);
        rVertices.push(currentWidth / 2, yBottom, z);

        rUVs.push(0, ratio);
        rUVs.push(1, ratio);
        rUVs.push(0, ratio);
        rUVs.push(1, ratio);

        if (i < roadSegments) {
            const base = i * 4;
            rIndices.push(base, base + 1, base + 4);
            rIndices.push(base + 4, base + 1, base + 5);
            rIndices.push(base + 2, base + 6, base + 3);
            rIndices.push(base + 6, base + 7, base + 3);
            rIndices.push(base + 2, base, base + 6);
            rIndices.push(base, base + 4, base + 6);
            rIndices.push(base + 1, base + 3, base + 5);
            rIndices.push(base + 3, base + 7, base + 5);
        }
    }

    const roadMeshGeo = new THREE.BufferGeometry();
    roadMeshGeo.setAttribute('position', new THREE.Float32BufferAttribute(rVertices, 3));
    roadMeshGeo.setAttribute('uv', new THREE.Float32BufferAttribute(rUVs, 2));
    roadMeshGeo.setIndex(rIndices);
    roadMeshGeo.computeVertexNormals();

    const road = new THREE.Mesh(roadMeshGeo, new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: 1
    }));
    worldGroup.add(road);

    // V-NEW: Roundabout at road end (z=20)
    const roundaboutRadius = 6;
    const roundaboutSegments = 32;
    const roundaboutVertices = [];
    const roundaboutIndices = [];
    const roundaboutZ = 20;

    for (let i = 0; i <= roundaboutSegments; i++) {
        const angle = (i / roundaboutSegments) * Math.PI * 2;
        const x = Math.cos(angle) * roundaboutRadius;
        const z = roundaboutZ + Math.sin(angle) * roundaboutRadius;
        const yTop = getPlanetY(x, z) + 0.1;
        const yBottom = yTop - roadThickness;

        roundaboutVertices.push(x, yTop, z);
        roundaboutVertices.push(x, yBottom, z);

        if (i < roundaboutSegments) {
            const base = i * 2;
            roundaboutIndices.push(base, base + 1, base + 2);
            roundaboutIndices.push(base + 2, base + 1, base + 3);
        }
    }

    const roundaboutGeo = new THREE.BufferGeometry();
    roundaboutGeo.setAttribute('position', new THREE.Float32BufferAttribute(roundaboutVertices, 3));
    roundaboutGeo.setIndex(roundaboutIndices);
    roundaboutGeo.computeVertexNormals();

    const roundabout = new THREE.Mesh(roundaboutGeo, new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        side: THREE.DoubleSide
    }));
    worldGroup.add(roundabout);

    // V-NEW: Gravel driveway in front of house
    // V-FIX: Black/white noise pattern for footpath
    // V-FIX: Realistic Gravel (Noise + Color) + Driveway
    function createGravelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#7a7a6a'; ctx.fillRect(0, 0, 512, 512); // Base Earthy Grey

        for (let i = 0; i < 20000; i++) {
            const shade = Math.random();
            // Mix of grey, brown, white stones
            if (shade > 0.8) ctx.fillStyle = '#9a9a8a';
            else if (shade > 0.5) ctx.fillStyle = '#5a5a4a';
            else if (shade > 0.2) ctx.fillStyle = '#8a7a6a'; // Brownish
            else ctx.fillStyle = '#3a3a3a';

            const size = Math.random() * 2 + 1;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 8);
        return tex;
    }


    const gravelTex = createGravelTexture();

    // Circle around house
    const footpathShape = new THREE.Shape();
    const radius = 7; // Slightly larger
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        footpathShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }

    const gravelGeo1 = new THREE.ShapeGeometry(footpathShape);

    // Driveway to Road (Z=6 to Z=16, Width 6)
    const drivewayGeo = new THREE.PlaneGeometry(6, 12); // 12m long (4 to 16)
    // Offset to connect circle (Z=4) to Roundabout (Z=~16)
    drivewayGeo.translate(0, 0, 10); // Center at 10 (spans 4 to 16)

    // Merge
    // Note: Merging geometries simpler by just adding second mesh for now to avoid complexity

    const gravelMat = new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 1.0 });
    const gravelArea = new THREE.Mesh(gravelGeo1, gravelMat);
    const gravelY = getPlanetY(0, 0) + 0.04;
    gravelArea.position.set(0, gravelY, 0);
    gravelArea.rotation.x = -Math.PI / 2;
    gravelArea.receiveShadow = true;
    worldGroup.add(gravelArea);

    const driveway = new THREE.Mesh(drivewayGeo, gravelMat);
    driveway.position.set(0, gravelY, 0); // Already translated geo
    driveway.rotation.x = -Math.PI / 2;
    driveway.receiveShadow = true;
    worldGroup.add(driveway);


    // V-NEW: Garage building with split-off road
    function buildGarage() {
        const garageGroup = new THREE.Group();

        // Garage structure (4m wide × 3m deep × 2.5m tall)

        // V-FIX: Resize Garage (Smaller) & Tiled Roof
        // Garage body: 3.2m wide, 2.2m tall, 2.6m deep
        const garageWidth = 3.2;
        const garageHeight = 2.2;
        const garageDepth = 2.6;

        const garageMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.8 });
        const garageBody = new THREE.Mesh(new THREE.BoxGeometry(garageWidth, garageHeight, garageDepth), garageMat);
        garageBody.position.y = garageHeight / 2;
        garageBody.castShadow = true;
        garageBody.receiveShadow = true;
        garageGroup.add(garageBody);

        // V-NEW: Tiled Roof Texture
        function createTiledRoofTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#8a3324'; ctx.fillRect(0, 0, 512, 512);

            // Draw Tiles
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            const tilesX = 10; const tilesY = 10;
            const tw = 512 / tilesX; const th = 512 / tilesY;

            for (let y = 0; y < tilesY; y++) {
                for (let x = 0; x < tilesX; x++) {
                    // Shading gradient for each tile
                    const g = ctx.createLinearGradient(x * tw, y * th, x * tw, y * th + th);
                    g.addColorStop(0, 'rgba(255,255,255,0.1)');
                    g.addColorStop(1, 'rgba(0,0,0,0.3)');
                    ctx.fillStyle = g;
                    ctx.fillRect(x * tw + 2, y * th + 2, tw - 4, th - 4);
                }
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 2);
            return tex;
        }

        // V-NEW: Interactive garage door with starry parallax
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.1), doorMat);
        door.position.set(0, 1, 1.5);
        door.userData = { type: 'garageDoor', isOpen: false };
        garageGroup.add(door);

        // Starry parallax plane (visible when door opens)
        function createStarTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000011'; ctx.fillRect(0, 0, 512, 512);
            // Add stars
            for (let i = 0; i < 200; i++) {
                ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : '#aaaaff';
                const size = Math.random() * 2 + 0.5;
                ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
            }
            return new THREE.CanvasTexture(canvas);
        }

        const starTex = createStarTexture();
        const starPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(3.5, 2.5),
            new THREE.MeshBasicMaterial({ map: starTex })
        );
        starPlane.position.set(0, 1, 1.4); // Behind door
        starPlane.visible = false;
        garageGroup.add(starPlane);

        // Door click handler
        // V-FIX: 2-Stage Interaction (Open -> Wait -> Enter)
        door.userData.state = 'closed'; // closed, opening, open

        door.userData.onClick = () => {
            const state = door.userData.state;

            if (state === 'closed') {
                // Slower animation: Rotate open to reveal parallax
                door.userData.state = 'opening';
                starPlane.visible = true;

                // Rotates up 90 degrees
                new TWEEN.Tween(door.rotation)
                    .to({ x: -Math.PI / 2 }, 3000) // Slow reveal (3s)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onComplete(() => {
                        door.userData.state = 'open';
                        door.userData.isOpen = true; // Legacy flag
                    })
                    .start();

                // Subtle star drift
                new TWEEN.Tween(starPlane.position)
                    .to({ z: 1.3 }, 2000)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .repeat(Infinity)
                    .yoyo(true)
                    .start();

            } else if (state === 'open') {
                // Already open - transition to AI Space
                if (typeof enterRoom === 'function') {
                    enterRoom('aispace');
                }
            }
            // If 'opening', ignore clicks
        };

        // Make door clickable
        if (typeof worldClickables !== 'undefined') {
            worldClickables.push(door);
        }

        // Small window
        const windowMat = new THREE.MeshStandardMaterial({ color: 0x88aacc, emissive: 0x444444, emissiveIntensity: 0.3 });
        const window = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), windowMat);
        window.position.set(1.5, 1.8, 0.05);
        garageGroup.add(window);


        // V-FIX: Fitted Gable Roof (Scaled down)
        const roofWidth = 3.8;
        const roofHeight = 1.4;
        const roofDepth = 3.2;

        const roofShape = new THREE.Shape();
        roofShape.moveTo(-roofWidth / 2, 0);
        roofShape.lineTo(0, roofHeight);
        roofShape.lineTo(roofWidth / 2, 0);
        roofShape.lineTo(-roofWidth / 2, 0);

        const extrudeSettings = { steps: 1, depth: roofDepth, bevelEnabled: false };
        const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
        roofGeo.translate(0, 0, -roofDepth / 2); // Center Z

        const roofTexture = createTiledRoofTexture();
        const roofMat = new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.9, color: 0xcc6655 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, garageHeight, 0); // Sit exactly on top box
        roof.castShadow = true;
        garageGroup.add(roof);

        // Position garage to right of house
        const garageX = 10, garageZ = 5;
        alignToPlanet(garageGroup, garageX, garageZ);
        garageGroup.userData = { type: 'room', name: 'garage' };
        worldGroup.add(garageGroup);

        // V-FIX: Curvy split-off road to garage (bezier-like curve)
        const garageRoadVertices = [];
        const garageRoadIndices = [];
        const garageRoadWidth = 4.0;
        const garageRoadSegments = 20; // More segments for smooth curve

        for (let i = 0; i <= garageRoadSegments; i++) {
            const t = i / garageRoadSegments;
            // V-FIX: Stronger S-curve - control point (8, 12) for more pronounced curve
            const t2 = t * t;
            const t3 = 1 - t;
            const t4 = t3 * t3;
            const x = t4 * 0 + 2 * t3 * t * 8 + t2 * garageX; // Stronger curve
            const z = t4 * roundaboutZ + 2 * t3 * t * 12 + t2 * garageZ;
            const yTop = getPlanetY(x, z) + 0.1;
            const yBottom = yTop - roadThickness;

            garageRoadVertices.push(x - garageRoadWidth / 2, yTop, z);
            garageRoadVertices.push(x + garageRoadWidth / 2, yTop, z);
            garageRoadVertices.push(x - garageRoadWidth / 2, yBottom, z);
            garageRoadVertices.push(x + garageRoadWidth / 2, yBottom, z);

            if (i < garageRoadSegments) {
                const base = i * 4;
                garageRoadIndices.push(base, base + 1, base + 4);
                garageRoadIndices.push(base + 4, base + 1, base + 5);
            }
        }

        const garageRoadGeo = new THREE.BufferGeometry();
        garageRoadGeo.setAttribute('position', new THREE.Float32BufferAttribute(garageRoadVertices, 3));
        garageRoadGeo.setIndex(garageRoadIndices);
        garageRoadGeo.computeVertexNormals();

        const garageRoad = new THREE.Mesh(garageRoadGeo, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9,
            side: THREE.DoubleSide
        }));
        worldGroup.add(garageRoad);
    }

    buildGarage();

    // Capture the light object for animation
    const lx_lamp = -2.2, lz_lamp = 8; // V157: Restored to proximity as requested
    lamppostLight = buildStreetlight(lx_lamp, lz_lamp, Math.PI);
    if (lamppostLight) {
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
    }

    // V-CLEAN: Removed legacy Tree helpers and manual placements (Superseded by Skyscraper Loop)

    // V132: Street Glow Texture (Orange)
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

    // V133: Independent Street Lights (Not children)
    const streetLights = [];
    window.streetLights = streetLights;

    // Background Blocks Helper
    // V-NEW: Universal Skyscraper Factory (Renamed to force update)
    function createMegaBlock() {
        // 1. Generate LED Texture (Top Only)
        // ... (Texture logic remains same, just brief header here)
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, 32, 64);

        // V-PERF: Minimal LED Logic for old devices (3->2 LEDs)
        for (let i = 0; i < 2; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#00ff00';
            ctx.fillRect(Math.random() * 30, Math.random() * 10, 2, 2);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;

        // V-FIX: Wider & Shorter Base (3.5 x 0.8) - Less thin/tall appearance
        const geo = new THREE.BoxGeometry(3.5, 0.8, 3.5);
        geo.translate(0, 0.5, 0); // Keep pivot

        // V-FIX: Balanced Palette with Purple Tints Throughout
        const palette = [
            // Dark purple-greys (base)
            0x2a1a2a, 0x3a2a3a, 0x4a3a4a, 0x5a4a5a,
            // Medium purple-greys
            0x4a4a5a, 0x5a5a6a, 0x6a6a7a, 0x7a7a8a,
            // Deep purples (accent)
            0x332244, 0x442255, 0x553366, 0x664477,
            // Purple-browns (warmth)
            0x3e2744, 0x4e3755, 0x5e4766,
            // Blue-purples (cool)
            0x3a3a55, 0x4a4a66, 0x5a5a77,
            // Lighter purple-greys (highlights)
            0x6a5a7a, 0x7a6a8a, 0x8a7a9a
        ];
        const randomColor = palette[Math.floor(Math.random() * palette.length)];

        // Adjust Metalness/Roughness based on color type (heuristic)
        // If it's a "Metal" grey (blue-ish 0x60..., 0x78..., 0x90...), make it more metallic
        const isMetal = (randomColor === 0x607d8b || randomColor === 0x78909c || randomColor === 0x90a4ae || randomColor === 0xaaaaaa);

        const mat = new THREE.MeshStandardMaterial({
            color: randomColor,
            roughness: isMetal ? 0.3 : 0.8,
            metalness: isMetal ? 0.8 : 0.1,
            emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 2.0 // Keep LEDs
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = {
            isSkyscraper: true,
            phase: Math.random() * Math.PI * 2,
            speed: 2 + Math.random() * 3,
            baseScaleY: 1.0
        };

        return mesh;
    }
    function createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        // V-FIX: Softer Gradient (No hard core)
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 200, 100, 1)'); // Warm white center
        gradient.addColorStop(0.2, 'rgba(255, 160, 0, 0.4)'); // Rapid falloff to transparency
        gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    // V158: Perspective-Synced Path Lights (Hero Foreground + Scaling)
    // V158: Perspective-Synced Path Lights (Hero Foreground + Scaling)
    function spawnPathLights() {
        const lampGroup = new THREE.Group();

        // V-REFINE 315: Modern Art Nouveau / Organic Design (Curved Stalk)
        const stemsMat = new THREE.MeshStandardMaterial({
            color: 0x111111, // Dark Iron
            roughness: 0.6,
            metalness: 0.5
        });

        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 3.0 // V-FIX: Brighter Bulb
        });

        // GEOMETRY REUSE
        // 1. Tapered Stalk (Base to Curve start)
        const stalkGeo = new THREE.CylinderGeometry(0.06, 0.12, 3.2, 8);

        // 2. The Loop/Curve (Torus Segment)
        // Radius 0.5, Tube 0.05, Arc ~230 degrees
        const curveGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 16, Math.PI * 1.3);

        // 3. The Bulb (Large Sphere)
        const bulbGeo = new THREE.SphereGeometry(0.3, 32, 32);

        // V-FIX: One material for Glow Sprite
        const glowTex = createGlowTexture();
        const spriteMat = new THREE.SpriteMaterial({
            map: glowTex, color: 0xffaa00, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false
        });

        // Taper variables
        const wSteps = 1.4, wHorizon = 30.0, zSteps = 2.7, zHorizon = 150.0;
        const slope = (wHorizon - wSteps) / (zHorizon - zSteps);

        // V-FIX 275: Brighter Lamps, Removed Close Lamp, Visible Usher
        // 1. Loop stops earlier (z >= 35)
        for (let z = 115; z >= 35; z -= 15) {
            // V-FIX: Parallel Alignment (Constant Width)
            const currentRoadWidth = 8.0; // Matches road
            const xPos = currentRoadWidth / 2 + 1.2; // 4 + 1.2 = 5.2m from center
            // V-FIX: Remove perspective scaling overshoot
            const perspectiveScale = 1.0; // Keep uniform scale

            const postGroup = new THREE.Group();

            // 1. Stalk (Y: 1.6)
            const stalk = new THREE.Mesh(stalkGeo, stemsMat);
            stalk.position.y = 1.6;
            postGroup.add(stalk);

            // 2. Curve (Top)
            const curve = new THREE.Mesh(curveGeo, stemsMat);
            // Position at top of stalk, rotated to look like a hook
            curve.position.set(0.3, 3.2, 0);
            curve.rotation.z = Math.PI / 1.5;
            postGroup.add(curve);

            // 3. Bulb (Nestled in curve)
            const bulb = new THREE.Mesh(bulbGeo, bulbMat);
            // Positioned "hanging" or held by the curve
            bulb.position.set(0.4, 3.2, 0);
            postGroup.add(bulb);

            // Light & Glow (Brighter V315)
            // V-PERF: Shadow disabled for performance
            const pLight = new THREE.PointLight(0xffaa00, 3.0, 15);
            pLight.castShadow = false; // V-PERF
            pLight.position.set(0.4, 3.2, 0);
            postGroup.add(pLight);
            streetLights.push(pLight);

            const spriteL = new THREE.Sprite(spriteMat);
            spriteL.scale.set(2.5, 2.5, 1.0); // Larger Glow
            spriteL.position.set(0.4, 3.2, 0);
            postGroup.add(spriteL);


            // Left
            alignToPlanet(postGroup, -xPos, z);
            postGroup.scale.setScalar(perspectiveScale);
            // Look at road center, slightly
            postGroup.lookAt(new THREE.Vector3(0, postGroup.position.y, z));
            lampGroup.add(postGroup);

            // Right
            const postGroupR = postGroup.clone();
            alignToPlanet(postGroupR, xPos, z);
            postGroupR.scale.setScalar(perspectiveScale);
            postGroupR.lookAt(new THREE.Vector3(0, postGroupR.position.y, z));
            // Extract Light for animation array
            postGroupR.traverse(c => { if (c.isPointLight) streetLights.push(c); });
            lampGroup.add(postGroupR);
        }
        worldGroup.add(lampGroup);

        // V-NEW: Spawn Pluto Usher!
        if (typeof createPlutoUsher === 'function') {
            // V-FIX 280: Singleton Check (Prevent "Double" glitches)
            if (window.usherCharacter) {
                if (window.usherCharacter.parent) window.usherCharacter.parent.remove(window.usherCharacter);
                window.usherCharacter = null;
            }

            console.log("--- FOUND createPlutoUsher... Spawning REFINED V286 ---");
            const usher = createPlutoUsher();
            usher.scale.set(0.36, 0.36, 0.36); // V286: 2x the size (User req)

            // V-FIX 283: Opposite the ENTER sign (lx_lamp=-2.2, lz_lamp=8) -> Right Side Z=8
            // V305: Centered on Path (x=0)
            alignToPlanet(usher, 0, 8);

            // V-FIX 284: Proper Upright Angle & Height
            // 1. Up vector must point away from planet center (0, -500, 0)
            const normal = new THREE.Vector3(usher.position.x, usher.position.y + 500, usher.position.z).normalize();
            usher.up.copy(normal);
            // 2. Look across the road (towards center) THEN rotate 90deg left to face user
            usher.lookAt(new THREE.Vector3(0, usher.position.y, 8));
            // usher.rotateY(Math.PI / 2); // No rotation needed if looking at 0,0,8 (itself?)
            // Wait, lookAt(0,y,8) means look at center of path.
            // If x=0, looking at 0 means... looking nowhere?
            // Try looking at camera start: (0, 20, 85)
            // Or look at (0, y, 9) (slightly forward)
            usher.lookAt(new THREE.Vector3(0, usher.position.y, 80)); // Look towards entrance/camera

            // 3. Grounding (V288: Exact model alignment)
            usher.translateY(0.02);

            worldGroup.add(usher);
            window.usherCharacter = usher;

            console.log("--- PLUTO USHER SPAWNED V305 (Centered, Z=8) ---");
        } else {
            console.error("CRITICAL: createPlutoUsher function not found! Check pluton.js loading.");
        }
    }


    spawnPathLights();
    // V148: Removed spawnStreetLights call


    // V326: Restored MESSY CITY OF CUBES (User: "Without the clean up")
    // V326: BIT-PERFECT RESTORATION FROM ORIGINAL FILE
    console.log("--- V326: RESTORING ORIGINAL MESSY SKYLINE ---");
    for (let i = 0; i < 800; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.pow(Math.random(), 2) * 120;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // V-FIX: Updated road culling for main road + roundabout
        if (Math.abs(x) < 10 && z > 15 && z < 155) continue; // Main road path
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue; // Roundabout circle

        const mesh = createMegaBlock();
        const distFactor = (radius - 25) / 120;
        // V-FIX: Restored variety with taller buildings (4-12)
        const minH = 4.0 + distFactor * 4.0;
        const maxH = 8.0 + distFactor * 4.0;
        const h = minH + Math.random() * (maxH - minH);

        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);

        alignToPlanet(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh); // City blocks participate in float animation
    }

    // V-NEW: Scatter simple lampposts between buildings
    function createSimpleLamppost() {
        const lampGroup = new THREE.Group();

        // Simple pole
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.3 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.5, 8), poleMat);
        pole.position.y = 1.25;
        pole.castShadow = true;
        lampGroup.add(pole);

        // Bulb
        const bulbMat = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 2.0
        });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), bulbMat);
        bulb.position.y = 2.5;
        lampGroup.add(bulb);

        // V-FIX: Add back point light with reduced intensity for performance
        // V-PERF: Reduce range and intensity further, NO SHADOWS
        const light = new THREE.PointLight(0xffaa00, 0.5, 5);
        light.castShadow = false;
        light.position.y = 2.5;
        lampGroup.add(light);

        return lampGroup;
    }

    // V-PERF: Reduced from 100 to 30 lampposts to prevent crash
    for (let i = 0; i < 20; i++) { // V-PERF: Even fewer (20)
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 110;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Same culling as buildings
        if (Math.abs(x) < 10 && z > 15 && z < 155) continue;
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue;
        if (radius < 15) continue;

        const lamp = createSimpleLamppost();
        alignToPlanet(lamp, x, z);
        worldGroup.add(lamp);
    }

    // V326: Horizon Mega-Blocks (Far Distance)
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 130;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (z > -10 && z < 250 && Math.abs(x) < 30.0) continue;

        const mesh = createMegaBlock();
        // V-FIX: Restored tall horizon skyscrapers (10-25)
        const h = 10.0 + Math.random() * 15.0;
        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);
        alignToPlanet(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh);
    }

    // V132: Simple Tree Helper
    function createSimpleTree(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        // V299: Darker Trunk (Was 0x3e2723 -> 0x221111)
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.5), new THREE.MeshStandardMaterial({ color: 0x221111, roughness: 0.9 }));
        trunk.position.y = 0.75; group.add(trunk);
        // V299: Darker Leaves (Was 0x1b5e20 -> 0x0a220a)
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.0, 8), new THREE.MeshStandardMaterial({ color: 0x0a220a, roughness: 0.9 }));
        leaves.position.y = 3.0; group.add(leaves);

        // V166: Scale variation
        const s = 0.7 + Math.random() * 0.8;
        group.scale.set(s, s, s);

        worldGroup.add(group);
        return group; // Added return for alignment (V166)
    }
    // V132: Manual Trees
    alignToPlanet(createSimpleTree(5, 0), 5, 0);
    alignToPlanet(createSimpleTree(6, 2), 6, 2);
    alignToPlanet(createSimpleTree(6, -2), 6, -2);
    alignToPlanet(createSimpleTree(-5, -4), -5, -4);
    alignToPlanet(createSimpleTree(0, -12), 0, -12); // V-FIX: Moved further back (was -6)

    // V166: Procedural Forest (Denser Foliage)
    for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 50;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // V-FIX: Culling for new road layout (avoid main road z=20-150, roundabout, garage area)
        if (Math.abs(x) < 10 && z > 15 && z < 155) continue; // Main road
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue; // Roundabout area
        if (x > 5 && x < 15 && z > 0 && z < 25) continue; // Garage area
        if (radius < 12) continue; // Inner circle clear

        // V166: Fix floating trees - call alignToPlanet
        const treeInstance = createSimpleTree(x, z);
        alignToPlanet(treeInstance, x, z);
    }

    // V-CLEAN: Removed V64 Fringe Trees loop


    // V-NEW: Dancing Mini-Skyscrapers (Matte Black + Top LEDs)
    // V-CLEAN: Removed duplicate legacy landscape logic


    // V292: Purple Sky Glow (V102 Restoration)
    const glowTex = createGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0x8800ff, // V292: Vivid Purple
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        fog: false
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.position.set(0, -20, -180); // V292: Further back for better backdrop
    glowSprite.scale.set(1000, 800, 1); // V292: Epic Scale
    worldGroup.add(glowSprite);

    // V-REFINE: METROPOLIS ROBOT (Moved to Living Room)
    // Removed from Exterior

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
    // V149: Fix redeclaration error. 'fireflies' is global (line 3).
    // Re-assign to global var
    fireflies = new THREE.Points(ffGeo, ffMat); // Removed 'const' or 'let'
    fireflies.userData = { type: 'fireflies', speeds: ffSpeeds };
    worldGroup.add(fireflies);
    // V150: Re-added closing brace (was wrongfully removed)
}



// --- ANIMATION & NAVIGATION REPAIR ---
// --- ANIMATION & NAVIGATION REPAIR ---
function startOpeningAnimation() {
    // V-NEW: FLIGHT TWEAKER READ INPUTS
    const getVal = (id, def) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Flight Tweaker: Input #${id} not found. Using default: ${def}`);
            return def;
        }
        const val = parseFloat(el.value);
        if (isNaN(val)) {
            console.warn(`Flight Tweaker: Input #${id} is NaN. Using default: ${def}`);
            return def;
        }
        return val;
    };

    // V99/V100: SMOOTH CAMERA (No Bump)
    const animState = {
        px: getVal('fc-sx', -2.8),
        py: getVal('fc-sy', 51.9),
        pz: getVal('fc-sz', 175.9),
        tx: getVal('fc-slx', -1.94),
        ty: getVal('fc-sly', -20.5),
        tz: getVal('fc-slz', -0.94),
        fogFar: 500
    };

    console.log("--- START OPENING ANIMATION ---");
    console.log("Start State:", animState);

    // Force Camera there immediately
    camera.position.set(animState.px, animState.py, animState.pz);
    controls.target.set(animState.tx, animState.ty, animState.tz);
    controls.update(); // V-FIX: Force update immediately to snap camera

    const targetState = {
        px: getVal('fc-ex', 0.2),
        py: getVal('fc-ey', 2.6),
        pz: getVal('fc-ez', 16.8),
        tx: getVal('fc-elx', -0.01),
        ty: getVal('fc-ely', 1.6),
        tz: getVal('fc-elz', -9.05),
        fogFar: 300
    };

    console.log("Target State:", targetState);

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

            // V-NEW: Show Word Hunt UI (Delayed)
            if (typeof WordHunt !== 'undefined' && WordHunt.showUI) {
                setTimeout(() => WordHunt.showUI(), 500);
            }
        })
        .start();

    // Header animation handled in enterExperience
}

// V-NEW: Global Test Function
window.testFlightPath = function () {
    console.log("--- TESTING FLIGHT PATH v2 ---");

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
    const header = document.getElementById('main-header');

    // V136: CSS-BASED ANIMATION TRIGGER
    // We simply add the class. CSS does the heavy lifting (transform + transition).
    console.log("--- startHeaderAnimation V136 CALLED (CSS CLASS) ---");

    if (header) {
        // Force Reflow ensures the browser acknowledges the 'before' state
        void header.offsetWidth;

        // Add the class defined in index.html
        header.classList.add('header-move-up');
    }

    // Also fade out the button container explicitly (though it should be hidden by enterExperience)
    // Just ensuring smooth transition if concurrent
    const btnContainer = document.getElementById('start-btn-container');
    if (btnContainer) btnContainer.style.opacity = '0';
}

// V92: Ensure Header Fades In ON LOAD (Before Click)
// This was missing, causing "Initial view not showing"
function revealHeader() {
    const header = document.getElementById('main-header');
    if (header) {
        setTimeout(() => {
            header.style.opacity = '1';
        }, 500);
    }
}
// Call it immediately if script loaded late, or wait for DOM
if (document.readyState === 'complete') revealHeader();
else window.addEventListener('load', revealHeader);

window.enterExperience = function () {
    // 1. Fullscreen
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) { docEl.requestFullscreen().catch(e => console.log(e)); }
    else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); }

    // 2. Play Tension Audio 
    const audio = new Audio(houseConfig.audio.tension);
    audio.volume = 0.8;
    audio.currentTime = 0.5; // V-FIX: Start Offset (Skip first 0.5s silence)
    audio.play().catch(e => console.warn("Audio play error", e));

    // V-FIX: End too late? Fade out/Stop when Animation completes (6s)
    setTimeout(() => {
        // Simple fade out attempt or just stop
        const fadeOut = setInterval(() => {
            if (audio.volume > 0.05) audio.volume -= 0.05;
            else {
                audio.pause();
                clearInterval(fadeOut);
            }
        }, 100);
    }, 6000); // Match Animation Duration

    // Chain Main Music: Wait for Tension to FINISH, then wait 2s, then start
    audio.onended = () => {
        if (audioPlayer) {
            setTimeout(() => {
                audioPlayer.src = houseConfig.audio.intro;
                audioPlayer.loop = true;
                audioPlayer.play().catch(e => console.warn("Music Play Fail", e));
            }, 2000); // 2s Gap of Silence
        }
    };

    const sBtn = document.getElementById('start-btn');
    if (sBtn) {
        sBtn.classList.add('btn-out');
        setTimeout(() => {
            sBtn.style.display = 'none';
            sBtn.classList.add('hidden');
        }, 1000);
    }

    // 3. Start Header Animation Immediately
    startHeaderAnimation();

    // 4. Start Flight Immediately
    startOpeningAnimation();

    // Removed fixed timeout for NightDrive (handled by onended above)

    // 6. Force Header Collapse (Manually & Completely)
    const headerContent = document.getElementById('header-content');
    if (headerContent) {
        // V80: FULL COLLAPSE (Remove padding/borders too)
        // Matches layout.js collapse logic perfectly
        headerContent.classList.remove('max-h-40', 'overflow-visible', 'py-1', 'border-b-2');
        headerContent.classList.add('max-h-0', 'overflow-hidden', 'py-0', 'border-b-0');
        headerContent.style.maxHeight = '0px';
        localStorage.setItem('headerCollapsed', 'true');

        // Update arrow rotation if it exists
        const arrow = document.getElementById('collapse-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
};



function buildInterior(roomKey) {
    if (thoughtInterval) clearInterval(thoughtInterval);
    thoughtInterval = null;

    // V-FIX: Stop Living Room Video if playing
    if (window.stopLivingVideo) window.stopLivingVideo();

    while (interiorGroup.children.length > 0) { interiorGroup.remove(interiorGroup.children[0]); }
    interiorClickables.length = 0;
    atomGroup = null;
    noteTextSprite = null;
    thoughtSprite = null;
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

    const data = roomContent[roomKey];

    // V101: Crash Fix - Safeguard against invalid room keys
    if (!data) {
        console.error(`buildInterior: Room data not found for key '${roomKey}'`);
        return;
    }

    // V128: Darker Floor (Was 0xdddddd -> 0x2c2c2c)
    // V113: Even Darker for Basement
    const floorColor = roomKey === 'basement' ? 0x050505 : 0x2c2c2c;
    const floorMat = new THREE.MeshStandardMaterial({ color: floorColor });
    let wallMat = new THREE.MeshStandardMaterial({ color: data.hex || 0xffffff, side: THREE.DoubleSide });

    // V326: Hall Floor Pattern (Checkered like Bathroom)
    if (roomKey === 'hall') {
        const checkCanvas = document.createElement('canvas');
        // V-NEW: Twin Peaks Chevron Floor (Hall Only)
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
        } else {
            const checkCanvas = document.createElement('canvas');
            checkCanvas.width = 512; checkCanvas.height = 512;
            const cctx = checkCanvas.getContext('2d');
            const size = 64;
            for (let y = 0; y < 512; y += size) {
                for (let x = 0; x < 512; x += size) {
                    cctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#111111' : '#333333';
                    cctx.fillRect(x, y, size, size);
                    cctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    cctx.strokeRect(x, y, size, size);
                }
            }
            const tex = new THREE.CanvasTexture(checkCanvas);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 2);
            floorMat.map = tex;
            floorMat.color.set(0xffffff);
            floorMat.roughness = 0.2;
        }
    }

    // V-FIX 113: Audio Analyser Initialization
    if (!window.initAudioAnalyser) {
        window.initAudioAnalyser = function () {
            if (window.audioAnalyser) return;
            if (!window.audioContext) { window.audioContext = new (window.AudioContext || window.webkitAudioContext)(); }
            if (!window.audioPlayer) return;
            const source = window.audioContext.createMediaElementSource(window.audioPlayer);
            window.audioAnalyser = window.audioContext.createAnalyser();
            window.audioAnalyser.fftSize = 256;
            source.connect(window.audioAnalyser);
            window.audioAnalyser.connect(window.audioContext.destination);
            window.audioDataArray = new Uint8Array(window.audioAnalyser.frequencyBinCount);
        };
    }
    if ((roomKey === 'basement' || roomKey === 'music') && window.initAudioAnalyser) window.initAudioAnalyser();

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

    // V327: Hall Left Wall (Music Wall) Deep Green Texture
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
    createMusicPanel(data.playlist);

    if (roomKey === 'living') createLivingRoomInterior();
    else if (roomKey === 'bedroom') createBedroomInterior();
    else if (roomKey === 'studio') createStudioInterior();
    else if (roomKey === 'toilet') createToiletInterior();
    else if (roomKey === 'hall') {
        createHallInterior();

    }
    else if (roomKey === 'attic') createAtticInterior();
    else if (roomKey === 'basement') createBasementInterior();
    else if (roomKey === 'bathroom') createBathroomInterior();
    else if (roomKey === 'annex') {
        // V148: Annex Interior (Added)
        // Set specific lights? Handled by buildInterior generic dark logic below?
        // Actually line 1752 handles 'dark' for most rooms.
        // We'll createInterior here.
        createAnnexInterior();
    }
    else createGenericInterior(data.title);

    // V114: Force Lighting Update for Room
    if (window.applyRoomLighting) window.applyRoomLighting(roomKey);
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
        // V-DEBUG: Log what we are checking against
        // console.log("Raycasting against", interiorClickables.length, "objects");
        const intersects = raycaster.intersectObjects(interiorClickables, true);

        if (intersects.length > 0) {
            // V-DEBUG: Log the very first thing we hit
            console.log("Raycast Hit:", intersects[0].object.type, intersects[0].object.userData);
            console.log("Distance:", intersects[0].distance);

            let target = intersects[0].object;
            let handlerFound = false;

            while (target && target !== interiorGroup) {
                // V-DEBUG: Bubbling up...
                // console.log("Checking:", target.userData);

                if (target.userData && target.userData.onClick) {
                    // FOUND A CUSTOM HANDLER
                    console.log("Custom Handler Found on:", target.userData.name || "Unnamed Object");
                    target.userData.onClick(intersects[0]);
                    handlerFound = true;
                    break;
                }

                // Fallback for older type-based logic if no explicit onClick but has type
                // (Only if we haven't standardized everything to onClick yet)
                if (target.userData && target.userData.type) {
                    if (target.userData.type === 'tv') {
                        console.log("CLICK DETECTED: TV Mesh");
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
                }

                target = target.parent;
            }

            if (!handlerFound) {
                console.log("Clicked object has no handler:", intersects[0].object);
            }
        }
    }
}


// --- HELPERS & LOGIC ---


// START VIDEO CLIP
function startVideoClip(room) {
    const playlist = roomContent[room].videoPlaylist;
    if (!playlist) return;
    const clip = playlist[masterVideoIndex];
    videoElement.src = clip.src;
    // V55: Ensure Unmuted
    videoElement.muted = false;
    // V-FIX 259: Per-clip volume (Default lowered to 0.6 from 0.8)
    videoElement.volume = (typeof clip.volume !== 'undefined') ? clip.volume : 0.6;
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

        // V-FIX 265: Darker Environment for Video (But keep a base glow V289)
        console.log("Video Mode: Darkening Living Room");
        if (window.ambientLight) window.ambientLight.intensity = 0.0; // V298: BLACKOUT
        if (window.dirLight) window.dirLight.intensity = 0.0; // V298: BLACKOUT
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

        // V-FIX 265: Darken if Living Room (V289: Brighter Video Shadows)
        if (typeof currentRoom !== 'undefined' && currentRoom === 'living') {
            if (window.ambientLight) window.ambientLight.intensity = 0.0;
            if (window.dirLight) window.dirLight.intensity = 0.0;
        }

    } else {
        // PAUSE
        videoElement.pause();
        btn.userData.state = 'paused';
        btn.material.color.setHex(0xff0000); // Red
        btn.material.emissive.setHex(0x440000);

        // V-FIX 265: Restore Light if Living Room (V289: Brighter Room Defaults)
        if (typeof currentRoom !== 'undefined' && currentRoom === 'living') {
            if (window.ambientLight) window.ambientLight.intensity = 0.15; // V298: Moody Normal (Visible)
            if (window.dirLight) window.dirLight.intensity = 0.2; // V298: Moody Normal
        }
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

// V171: Diary Popup (Annex) - Updated to 3D Hologram with Animation
window.openDiaryPopup = function () {
    console.log("openDiaryPopup called, diaryHologram exists:", !!window.diaryHologram);
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

        // Icon: Back Arrow Circle (User Request)
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>`;
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

        // V-FIX 9: Reset Lights if in Bedroom/Living
        if (typeof currentRoom !== 'undefined') {
            if (currentRoom === 'bedroom' && window.stopBedroomVideo) window.stopBedroomVideo();
            if (currentRoom === 'living' && window.stopLivingVideo) window.stopLivingVideo();
        }
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
    console.log("V123: Apply Dark Room Lighting for", roomName);

    // Ambient 0.45 matches what exitRoom() uses
    let targetAmbient = 0.6; // V-FIX: Brighter default
    let targetDir = 1.2;
    let targetRim = 0.6;
    let targetHemi = 0.6;

    // PER-ROOM OVERRIDES
    if (roomName === 'basement') {
        targetAmbient = 0.15; // Visible dark
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
        targetAmbient = 0.3;
        targetDir = 0.5;
        targetRim = 0.3;
        targetHemi = 0.2;
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

    // Apply
    if (window.ambientLight) window.ambientLight.intensity = targetAmbient;
    if (window.dirLight) window.dirLight.intensity = targetDir;
    if (window.rimLight) window.rimLight.intensity = targetRim;
    if (window.hemiLight) window.hemiLight.intensity = targetHemi;

    console.log("Lighting Applied: Amb", targetAmbient, "Dir", targetDir, "Rim", targetRim, "Hemi", targetHemi);
};

function enterRoom(roomName) {
    state = 'TRANSITION';
    currentRoom = roomName;
    currentTrackIndex = 0;
    masterVideoIndex = 0;

    // Stop previous room's audio before building new one
    if (audioPlayer && audioPlayer.src && audioPlayer.src.includes("NightDrive")) {
        houseMusicTime = audioPlayer.currentTime;
    }
    stopAllAudio();

    window.isZoomingToRoom = true;
    const curtain = document.getElementById('curtain');
    curtain.classList.add('active');
    setTimeout(() => {
        try {
            worldGroup.visible = false;

            if (mistLayer) mistLayer.visible = false;

            // V-FIX: Hide Top Header Bar to prevent interaction/visual clash
            const appHeader = document.getElementById('app-header');
            if (appHeader) appHeader.style.display = 'none';

            buildInterior(roomName);
            interiorGroup.visible = true;
            // V15: Angled Camera (Zoomed out slightly)
            camera.position.set(4, 6, 9);
            camera.lookAt(0, 2.5, 0);
            controls.target.set(0, 2.5, 0);
            controls.update();

            // V114: Force Lighting Update (Replaces old inline logic)
            if (window.applyRoomLighting) window.applyRoomLighting(roomName);


            const data = roomContent[roomName];
            // V201: Attic Audio Default = Video Audio (Not Playlist)
            if (data && data.playlist && data.playlist[0].src && roomName !== 'attic') {
                audioPlayer.src = data.playlist[0].src;
                // V78: Per-track volume support
                audioPlayer.volume = data.playlist[0].volume || 0.5;
                initAudioAnalyser();
                audioPlayer.play().then(() => {
                    isMusicPlaying = true;
                    if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
                    // V204: Update Music Panel status on Auto-Play
                    if (window.createMusicPanel) window.createMusicPanel(data.playlist);
                }).catch(e => {
                    console.error("Room Audio Play Error:", e); // V-FIX: Debugging
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
                console.warn("Info Panel not found (Intentional removal?)");
            }

            document.getElementById('main-header').style.setProperty('display', 'none', 'important'); // V_FINAL: Force Hide
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
    // V-FIX: Ensure Living Room Video/Audio is killed immediately
    if (window.stopLivingVideo) window.stopLivingVideo();

    const curtain = document.getElementById('curtain');
    if (curtain) curtain.classList.add('active');

    stopAllAudio(); // Replaces manual pausing
    isMusicPlaying = false; // Redundant but safe

    if (audioPlayer) {
        audioPlayer.src = houseConfig.audio.intro;
        audioPlayer.currentTime = houseMusicTime || 0;
        audioPlayer.loop = true;
        audioPlayer.volume = 0.5; // Default volume
        audioPlayer.play().catch(e => console.warn("Resume House Music Fail", e));
        isMusicPlaying = true;
    }

    // Clear any pending info panel minimize timeout
    if (infoTimeout) clearTimeout(infoTimeout);

    if (infoTimeout) clearTimeout(infoTimeout);

    setTimeout(() => {
        if (dirLight) dirLight.intensity = 0.7;
        if (rimLight) rimLight.intensity = 0.4;
        if (ambientLight) ambientLight.intensity = 0.25;
        if (hemiLight) hemiLight.intensity = 0.3; // Restore Global Fill

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
        interiorGroup.visible = false;
        worldGroup.visible = true;

        if (mistLayer) mistLayer.visible = true;


        atomGroup = null;
        basementNodes = [];
        basementLines = null;
        interiorClickables.length = 0; // V39: Prevent Ghost Clicks
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

        // V-FIX: Restore Top Header Bar
        const appHeader = document.getElementById('app-header');
        if (appHeader) appHeader.style.display = 'block';

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

function performClick(event) {
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
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

            if (target.userData.type === 'tv') nextTVContent();
            else if (target.userData.type === 'phone') nextBedroomVideo();
            else if (target.userData.type === 'universalVideoItem') {
                // alert("DEBUG: Clicked Universal Item Index " + target.userData.index);
                console.log("V-FIX: Universal Item Clicked", target.userData.index);
                if (target.userData.onClick) {
                    try {
                        target.userData.onClick();
                    } catch (e) {
                        alert("Click Error: " + e.message);
                    }
                } else {
                    alert("Debug: No onClick handler found on this item!");
                }
            }

            else if (target.userData.type === 'videoPhone') {
                toggleVideo();
            }
            else if (target.userData.type === 'musicSwitch') toggleMusic();
            else if (target.userData.type === 'musicPanel') nextTrack();
            else if (target.userData.type === 'songItem') playTrack(target.userData.index);
            else if (target.userData.type === 'tvVideoItem') {
                if (typeof playTVVideo === 'function') playTVVideo(target.userData.index);
            }
            else if (target.userData.type === 'videoItem') playVideo(target.userData.index);
            else if (target.userData.type === 'universalVideoItem') {
                console.log("V-FIX: Universal Item Clicked", target.userData.index);
                if (target.userData.onClick) target.userData.onClick();
            }
            else if (target.userData.type === 'videoControlSingle') {
                if (target.userData.onClick) target.userData.onClick();
            }
            else if (target.userData.type === 'videoPlayButton') toggleVideo();
            else if (target.userData.type === 'bathroomMirrorButton') {
                if (target.toggleMirror) target.toggleMirror();
            }
            else if (target.userData.type === 'bathroomPlaylistItem') {
                // V-FIX: Explicit handler for bathroom playlist
                if (target.userData.onClick) target.userData.onClick();
            }
            else if (target.userData.type === 'atticAudioToggle') {
                console.log("Attic Audio Toggle Clicked!");
                if (target.toggleAudio) target.toggleAudio();
            }
            else if (target.userData.type === 'mmAnimationClose') {
                stopMMAnimation();
            }
            else if (target.userData.type === 'notepad') openIdeaOverlay();
            else if (target.userData.type === 'diary') openDiaryPopup();
            else if (target.userData.type === 'laptop') {
                startGoldenRatioAnimation();
            }
            else if (target.userData.onClick) {
                target.userData.onClick(intersects[0]);
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
            const name = target.userData.name;

            if (roomContent[name]) {
                if (hoveredObject !== target) {
                    hoveredObject = target;
                    document.body.style.cursor = 'pointer';
                    const tooltip = document.getElementById('tooltip');
                    tooltip.textContent = roomContent[name].title;
                    tooltip.style.opacity = 1;
                }
                return;
            } else if (name === 'EnterSign') {
                if (hoveredObject !== target) {
                    hoveredObject = target;
                    document.body.style.cursor = 'pointer';
                    const tooltip = document.getElementById('tooltip');
                    tooltip.textContent = "ENTER EXPERIENCE";
                    tooltip.style.opacity = 1;
                }
                return;
            }
        }
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
    const intersects = raycaster.intersectObjects(interiorClickables, true); // true = recursive

    let isHoveringTopics = false;

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';

        // V-FIX 15: DEBUG CLICK HIT
        // Logging what we hit to debug Attic issues
        // console.log("Raycast Hit:", intersects[0].object.name || intersects[0].object.uuid, intersects[0].object);

        // V-FIX: Bubble up to find clickable parent
        let target = intersects[0].object;
        while (target && (!target.userData || !target.userData.onClick)) {
            target = target.parent;
            // Stop if we hit scene or root of interior
            if (!target || target === interiorGroup) break;
        }

        if (target && target.userData && target.userData.type === 'deckOfCards') {
            ;
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
    const t = time * 0.001;

    // DEBUG OVERLAY UPDATE REMOVED

    TWEEN.update(time); // Enabled TWEEN for Cinema Mode
    controls.update();

    // Mist Animation
    if (mistLayer && mistLayer.visible) {
        // Slighly rotate the sphere and drift the texture
        mistLayer.rotation.y += 0.001;
        if (mistLayer.material.map) {
            mistLayer.material.map.offset.x += 0.0005;
            mistLayer.material.map.offset.y += 0.0002;
        }
    }

    // Funky Landscape: Pulsating Blocks Animation
    animatedTrees.forEach(block => {
        const u = block.userData;
        // Pounding Rhythm: Sharp beats (Power function)
        // V141: Really Slow Motion (User Request) -> Multiply time by 0.1
        const val = Math.sin((t * 0.1) * u.speed + u.phase);
        const pulse = Math.pow(Math.max(0, val), 8.0); // Spiky pulse only positive

        // Scale Y (Beat) - Grow from bottom
        // Use baseScaleY (Total Height) * Pulse Factor
        // V123 Fix: Multiply, don't just add to 1.0
        block.scale.y = u.baseScaleY * (1.0 + pulse * 0.2); // Pulse 20% height

        // Emissive Pulse (Glow)
        if (block.material) {
            block.material.emissiveIntensity = 0.1 + (pulse * 0.8);
        }
        // V133: Block Glow Removed (Moved to Independent Street Lights)
    });

    // V133: Animate Street Lights (Independent Pulse)
    if (window.streetLights) {
        window.streetLights.forEach(glow => {
            const u = glow.userData;
            // Similar pulse logic
            const speed = u && u.speed ? u.speed : 1.5;
            const phase = u && u.phase ? u.phase : 0;

            const val = Math.sin(t * speed + phase);
            const pulse = Math.pow(Math.max(0, val), 4.0); // Softer pulse

            // V-FIX 263: Differentiate Types (Sprite vs PointLight)
            if (glow.material) {
                // Sprite / Mesh
                glow.material.opacity = 0.3 + (pulse * 0.7);
            } else if (glow.isPointLight) {
                // Light Intensity (Base 0.8 + Pulse)
                glow.intensity = 0.8 + (pulse * 0.8);
            }
        });
    }

    // Fireflies Motion
    worldGroup.children.forEach(child => {
        if (child.userData.type === 'fireflies') {
            // V-FIX: Robust checks to prevent crashes if geometry/attributes missing
            if (child.geometry && child.geometry.attributes.position && child.userData.speeds) {
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
        }
    });

    // Metropolis Robot Animation
    if (metropolisRobot && metropolisRobot.userData.update) {
        metropolisRobot.userData.update(t);
    }

    // V-FIX 278: Pluto Usher Animation (Explicit)
    if (window.usherCharacter && window.usherCharacter.userData.update) {
        window.usherCharacter.userData.update(t);
    }

    // Interior Interactions (Sprite Grow / Arrow Bob)
    if (interiorGroup.visible) {
        // V-NEW: Drum Machine Animation
        if (window.activeDrumMachine && window.activeDrumMachine.userData.update) {
            window.activeDrumMachine.userData.update(t);
        }
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

        // V-Refine: Generic Shader Update (For Studio Hologram etc)
        interiorGroup.traverse(child => {
            if (child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(m => {
                    if (m.uniforms && m.uniforms.time) {
                        m.uniforms.time.value = t;
                    }
                });
            }
        });

        // V-Refine: R2D2 Animation (Blinking Lights)
        if (window.r2d2Elements) {
            window.r2d2Elements.forEach(r2 => {
                if (Math.random() > 0.9) r2.lightRed.material.color.setHex(0xff0000); else r2.lightRed.material.color.setHex(0x330000);
                if (Math.random() > 0.9) r2.lightBlue.material.color.setHex(0x00aaff); else r2.lightBlue.material.color.setHex(0x002244);
                if (Math.random() > 0.9) r2.lightGreen.material.color.setHex(0x00ff44); else r2.lightGreen.material.color.setHex(0x003311);
                // Holo Beam Flicker
                if (r2.beamMat && r2.beamMat.uniforms.time) r2.beamMat.uniforms.time.value = t;
            });
        }
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

    // 3. Word Hunt Items Animation
    interiorGroup.children.forEach(child => {
        if (child.userData.type === 'wordHuntItem' && child.userData.update) {
            child.userData.update(t);
        }
    });

    // 3. Animated Shaders (e.g. Mirror)
    // V128: Add Camera Rotation for Parallax
    // Angle from 0 to 2PI approx
    if (state === 'ROOM' && currentRoom === 'bathroom') {
        const camAngle = Math.atan2(camera.position.x, camera.position.z);
        // V-NEW: Add Pitch for Vertical Parallax
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

    // V-Refine: Update Interior Objects (Lamps, Holograms)
    updateInteriorObjects(t);

    // V-REFINE: Generic Room Item Updates (Mirror, etc.)
    if (state === 'ROOM' && currentRoom === 'bathroom') {
        // DEBUG: Verify loop is running
        if (Math.floor(t * 60) % 300 === 0) console.log("Animate Loop: Bathroom Update Active");

        interiorGroup.traverse(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(t);
            }
        });
    }

    let avgFreq = 0;
    if (audioAnalyser) {
        audioAnalyser.getByteFrequencyData(audioDataArray);
        let sum = 0;
        for (let i = 0; i < audioDataArray.length; i++) sum += audioDataArray[i];
        avgFreq = sum / audioDataArray.length;
    }

    if (atomGroup) {
        atomGroup.rotation.y += 0.005;
        atomGroup.rotation.x += 0.002;
        atomGroup.rotation.z += 0.003;
        atomGroup.children.forEach(orbit => {
            if (orbit.userData.electron) orbit.rotation.z += orbit.userData.speed;
        });
    }

    // V-Refine: Universe Animation Loop
    if (window.mmAnimation) {
        window.mmAnimation.update();
        if (window.mmMesh && window.mmMesh.material.map) window.mmMesh.material.map.needsUpdate = true;
    }

    // V23: Manual Drum Machine Update
    if (window.activeDrumMachine && window.activeDrumMachine.userData.update) {
        window.activeDrumMachine.userData.update(time);
    }

    // V-CLEAN: Removed duplicate stopVideosForAudio definition

    // --- RENDER ---

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
    // V119: Failsafe - UNCONDITIONAL Controls Enable (unless zooming)
    if (!window.isZoomingToRoom) {
        controls.enabled = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
    }

    renderer.render(scene, camera);
    TWEEN.update(time);
}


// V2003: Universe Expanding Animation (Ported from Archive)
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

function updateInteriorObjects(t) {
    // Lava Lamp and other animated interior objects
    // Recursively check userData.update? Or just iterate top level?
    // Usually added to interiorGroup.
    interiorGroup.children.forEach(child => {
        if (child.userData && child.userData.update) {
            child.userData.update(t);
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
        console.log("--- HOUSE.JS INIT STARTING ---");
        console.log("--- HOUSE.JS INIT STARTING ---");
        // V136: Fixed Init Crash (init() was removed, calling buildWorld direct)
        buildWorld();
        console.log("--- HOUSE.JS INIT FINISHED ---");
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
    ctx.font = 'bold 110px Courier Prime, monospace';
    ctx.fillText("ENTER", 256, 120);

    // Line 2: Click on the front door
    ctx.font = 'bold 30px Courier Prime, monospace';
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
    const iconOn = document.getElementById('icon-fullscreen-on');
    const iconOff = document.getElementById('icon-fullscreen-off');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
    }
}

// V-NEW: Pluto Usher (Ported from Pluto Project)
// Moved to js/pluton.js

// V-INTEGRATION: Metropolis Robot (Ported from metropolis/claude.html)
function createMetropolisRobot() {
    const group = new THREE.Group();
    // V315-RELOADED-5: Enable Dynamic Shadows
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
            // V-REFINE: Bolder Rings (Radius 0.03), Narrower Diameter (0.4 instead of 0.6)
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

            // V-REFINE: Brighter Opacity (Max 1.0)
            ring.material.opacity = Math.pow(curve, 0.8) * 1.0;

            // V-REFINE: Variable Diameter Animation
            // "Smaller at top; grow; go down; contract at legs"
            // Base Scale 0.4 -> Grow to 1.3 -> Back to 0.4
            const swell = 0.4 + (curve * 0.9);

            // Keep subtle pulse
            const pulse = 1.0 + Math.sin(time * 3 + idx) * 0.05;

            // Apply Swell * Pulse
            const finalScale = swell * pulse;
            ring.scale.set(finalScale, finalScale, 1);
        });
    };

    // V315-RELOADED-5: Ensure every mesh casts shadow
    group.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return group;
}

// V-NEW: Global Video Stop Helper (For Audio Sync)
window.stopVideosForAudio = function () {
    console.log("Sync: Stopping all videos for Audio Playback");

    // 1. Stop Main Helper (Skip for Basement - Tron Video should persist)
    if (currentRoom !== 'basement' && window.videoElement && !window.videoElement.paused) {
        window.videoElement.pause();
    }

    // V-FIX: Clear Video UI Selection (User Request: "No active video")
    window.masterVideoIndex = -1;
    if (window.updateVideoUI) window.updateVideoUI();

    // 2. Room Specifics
    if (currentRoom === 'living' && window.stopLivingVideo) {
        window.stopLivingVideo(); // Resets TV and Lights
    }

    // 3. Bathroom Specific
    if (currentRoom === 'bathroom' && window.stopBathroomVideo) {
        window.stopBathroomVideo(); // Resets Mirror and Lights
    }

    // 4. Reset Lights (Safety Fallback)
    // If not handled by room helpers, force V298 Moody Normal
    if (currentRoom === 'living') {
        if (window.ambientLight) window.ambientLight.intensity = 0.15; // V298: Moody Normal
        if (window.dirLight) window.dirLight.intensity = 0.2; // V298: Moody Normal
    } else if (currentRoom === 'bathroom') {
        // V-FIX 25: Don't clobber stopBathroomVideo!
        // Only apply fallback if the helper didn't run.
        if (!window.stopBathroomVideo) {
            if (window.ambientLight) window.ambientLight.intensity = 0.35; // Goldilocks
            if (window.dirLight) window.dirLight.intensity = 0.45;
        }
    }
};

