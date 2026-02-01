const roomContent = {
    hall: {
        title: "Welcome Hall",
        hex: 0x2c3e50,
        description: "Welcome to The House of Meaning. <br><br>Life is complicated, full of surprises, twists and turns, but -within a framework - there is still control. The more you learn, the more you realise you know nothing. This space is a collection of art, music, literature, philosophy, and personal history.",
        playlist: [
            { artist: "Hofesh Shechter", track: "Sun", src: "../assets/audio/Sun.mp3" },
            { artist: "Hugo Kant", track: "Entering the Black Hole", src: "../assets/audio/HugoKant-EnteringtheBlackHole.mp3" },
            { artist: "Jun Miyake", track: "Lmt Act 3 Prologue", src: "../assets/audio/JunMiyake-LmtAct3Prologue.mp3" }
        ]
    },
    living: {
        title: "Living Room",
        hex: 0xe65100,
        description: "Click the TV to switch between Photos and Video Clips.",
        playlist: [
            { artist: "Hazel English", track: "Nine Stories", src: "../assets/audio/HazelEnglish-NineStories.mp3" },
            { artist: "Kalkbrenner/Stromae", track: "Que ce soit clair", src: "../assets/audio/KalkbrennerStromae.mp3" },
            { artist: "Fazerdaze", track: "Bigger", src: "../assets/audio/Fazerdaze-Bigger.mp3" }
        ],
        videoPlaylist: [
            { title: "The Premonition", src: "../assets/video/premonition.mp4" },
            { title: "The History of Mankind", src: "../assets/video/historytrailer.mp4" },
            { title: "LIFE or DREAM?", src: "../assets/video/life-or-dream.mp4" }
        ],
        videoInterfacePos: { x: 3.0, y: 3.2, z: -4.9 },
        tvImages: [
            { image: "../assets/images/tv.jpg", color: "#000", text: "" },
            { image: "../assets/images/brug.jpg", color: "#990000", text: "" },
            { image: "../assets/images/bavo1.jpg", color: "#000099", text: "" },
            { image: "../assets/images/spaarne1.jpg", color: "#009900", text: "" },
            { image: "../assets/images/spaarne2.jpg", color: "#330066", text: "" },
            { image: "../assets/images/sea.jpg", color: "#0000aa", text: "" }
        ]
    },
    studio: {
        title: "Studio",
        hex: 0x6366f1,
        description: "Dissecting the 'why' of human behavior.",
        playlist: [
            { artist: "Amon Tobin", track: "Feed", src: "../assets/audio/AmonTobin-Feed.mp3" },
            { artist: "Floating Points", track: "Nespole", src: "../assets/audio/FloatingPoints-Nespole.mp3" },
            { artist: "Kraftwerk", track: "Spacelab", src: "../assets/audio/KraftwerkSpacelab.mp3", volume: 1 }
        ]
    },
    bedroom: {
        title: "Bedroom",
        hex: 0x004d40,
        description: "Where dreaming happens. Use the phone to watch video clips.",
        playlist: [
            { artist: "Nick Drake", track: "From The Morning", src: "../assets/audio/NickDrake-FromTheMorning.mp3" },
            { artist: "David Bowie", track: "A New Career in a New Town", src: "../assets/audio/DavidBowie-ANewCareerinaNewTown.mp3" },
            { artist: "Miles Davis", track: "Ascenseur pour l'échafaud", src: "../assets/audio/miles-lift.mp3" }
        ],
        videoPlaylist: [
            { title: "Night After Night", artist: "Paradox Prime", src: "../assets/video/nain.mp4", volume: 0.4 },
            { title: "The Spirit", artist: "David Enker", src: "../assets/video/spirit.mp4" },
            { title: "Dreaming", artist: "Paradox Prime", src: "../assets/video/dreaming.mp4" },

        ]
    },
    attic: {
        title: "Attic",
        hex: 0x5d4037,
        description: "Beauty | Knowledge | Wisdom",
        playlist: [
            { artist: "Billie Holiday", track: "Gloomy Sunday", src: "../assets/audio/GloomySunday-BillieHoliday.mp3" },
            { artist: "Jóhann Jóhannssone", track: "The Theory of Everything", src: "../assets/audio/JóhannJóhannsson.mp3" },
            { artist: "Fyodorov Sisters", track: "Little Star", src: "../assets/audio/FyodorovSisters-LittleStar.mp3" }
        ]
    },
    bathroom: {
        title: "Bathroom",
        hex: 0x0696a4,
        description: "The mirror reflects the physical reality. In the quiet of the morning, thoughts are most audible.",
        playlist: [
            { artist: "Little Dragon", track: "Lover Chanting", src: "../assets/audio/LittleDragon-LoverChanting.mp3" },
        ],
        videoPlaylist: [
            { title: "Time Is Now", src: "../assets/video/Time-Is-Now.mp4" },
            { title: "Walk In", src: "../assets/video/walkin1.mp4" }
        ],
        videoInterfacePos: { x: -2.8, y: 2.8, z: -4.5 } // V197: Defined in Data
    },
    toilet: {
        title: "The Little Room",
        hex: 0x046896,
        interiorWidth: 3.0,
        interiorDepth: 5.0,
        description: "The Think Tank. A quiet place for politics, religion, and rough drafts. Click the notepad to write.",
        playlist: [
            { artist: "Chrysalis", track: "Chrysalis", src: "../assets/audio/chrysalis.mp3" },
            { artist: "John Lurie", track: "The Lamposts Are Mine", src: "../assets/audio/JohnLurieTheLampostsAreMine.mp3" }
        ]
    },
    basement: {
        title: "Basement",
        hex: 0x334155,
        description: "The Engine Room. Dancing nodes react to the baseline. Secrets, fears, and absolute truths live here.",
        playlist: [
            { artist: "I-F", track: "Spiegelbeeld", src: "../assets/audio/IF-Spiegelbeeld.mp3" },
            { artist: "Model 500", track: "I See The Light", src: "../assets/audio/Model500-ISeeTheLight.mp3" },
            { artist: "Vlinder Vos", track: "Reality", src: "../assets/audio/Reality-VlinderVos.mp3" }
        ]
    },
    annex: {
        title: "The Annex",
        hex: 0x1a1a1a,
        interiorWidth: 4,
        interiorDepth: 4,
        description: "A small, quiet space at the edge of the property. For contemplation and solitary rest.",
        playlist: [
            { artist: "Mica Levi", track: "Lonely Void", src: "../assets/audio/mica-levi-lonely-void.mp3" }
        ]
    }
};

const houseConfig = {
    audio: {
        tension: "../assets/audio/Tension_Short_07.mp3",
        intro: "../assets/audio/premonition.mp3",
        nightDrive: "../assets/audio/NightDrive-RobSimonsen.mp3",
        squeak: "../assets/audio/squeak.mp3"
    }
};
// --- SCALES & CONSTANTS ---
const STEPS = 16;
const TRACKS = [
    { name: "BD 808", color: "#ff5555" }, { name: "SD 808", color: "#ffaa55" },
    { name: "CH 808", color: "#ffff55" }, { name: "BD 909", color: "#55ff55" },
    { name: "OH 909", color: "#55aaff" }, { name: "ACID", color: "#ff55ff" }
];

const SCALES = {
    "C Min": [65.41, 77.78, 87.31, 98.00, 116.54, 130.81, 155.56, 174.61],
    "E Min": [82.41, 98.00, 110.00, 123.47, 146.83, 164.81, 196.00, 220.00],
    "F Maj": [87.31, 98.00, 110.00, 130.81, 146.83, 174.61, 196.00, 220.00],
    "A Min": [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66]
};
const NOTES = ["1", "2", "3", "4", "5", "6", "7", "8"];
let currentScale = "C Min";

// --- SYNTH CLASSES ---

class Minimoog {
    constructor(ctx, dest) { this.ctx = ctx; this.dest = dest; this.params = { cutoff: 1500, detune: 15, glide: 0.05 }; this.lastFreq = 0; }
    trigger(freq) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        const oscs = [0, 1, -1].map(offset => {
            const o = this.ctx.createOscillator(); o.type = offset === 0 ? 'sawtooth' : 'square';
            o.detune.value = offset * this.params.detune;
            if (this.lastFreq > 0) { o.frequency.setValueAtTime(this.lastFreq, now); o.frequency.linearRampToValueAtTime(freq, now + this.params.glide); }
            else { o.frequency.value = freq; }
            return o;
        });
        const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 6;
        f.frequency.setValueAtTime(this.params.cutoff, now); f.frequency.linearRampToValueAtTime(this.params.cutoff / 2, now + 0.2);
        const g = this.ctx.createGain(); g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.3, now + 0.02); g.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
        oscs.forEach(o => { o.connect(f); o.start(now); o.stop(now + 1.0); });
        f.connect(g); g.connect(this.dest); this.lastFreq = freq;
    }
}

class Drone {
    constructor(ctx, dest) { this.ctx = ctx; this.dest = dest; this.gain = ctx.createGain(); this.gain.gain.value = 0; this.gain.connect(dest); this.oscs = []; this.isOn = false; }
    toggle() {
        this.isOn = !this.isOn;
        if (this.isOn) {
            const freqs = [65.41, 98.00, 130.81];
            this.oscs = freqs.map((f, i) => { const o = this.ctx.createOscillator(); o.type = i % 2 == 0 ? 'sawtooth' : 'triangle'; o.frequency.value = f; o.connect(this.gain); o.start(); return o; });
            this.gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1);
        } else {
            this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5); setTimeout(() => { this.oscs.forEach(o => o.stop()); this.oscs = []; }, 500);
        }
        return this.isOn;
    }
    update(pitch, vol) {
        if (this.oscs.length) { const bases = [65.41, 98.00, 130.81]; this.oscs.forEach((o, i) => o.frequency.setTargetAtTime(bases[i] * pitch, this.ctx.currentTime, 0.1)); }
        if (this.isOn) this.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
}

class Theremin {
    constructor(ctx, dest) { this.ctx = ctx; this.dest = dest; this.osc = null; this.g = null; this.f = null; }
    update(x, y, active) {
        if (active) {
            if (!this.osc) {
                this.osc = this.ctx.createOscillator(); this.osc.type = 'sine';
                this.f = this.ctx.createBiquadFilter(); this.f.Q.value = 10;
                this.g = this.ctx.createGain(); this.g.gain.value = 0;
                this.osc.connect(this.f); this.f.connect(this.g); this.g.connect(this.dest);
                this.osc.start();
            }
            this.osc.frequency.setTargetAtTime(100 + x * x * 1900, this.ctx.currentTime, 0.05);
            this.f.frequency.setTargetAtTime(200 + y * 4800, this.ctx.currentTime, 0.05);
            this.g.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);
        } else {
            if (this.g) { this.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1); setTimeout(() => { if (this.osc) { this.osc.stop(); this.osc = null; } }, 200); }
        }
    }
}

// --- MAIN ENGINE ---

class TechnoEngine {
    constructor() {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;
        this.comp = this.ctx.createDynamicsCompressor();
        this.comp.threshold.value = -20;
        this.masterGain.connect(this.comp);

        // Analyzer for Scope
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.comp.connect(this.analyser);
        this.comp.connect(this.ctx.destination);

        this.minimoog = new Minimoog(this.ctx, this.masterGain);
        this.drone = new Drone(this.ctx, this.masterGain);
        this.theremin = new Theremin(this.ctx, this.masterGain);

        this.tempo = 120; // Default
        this.isPlaying = false;
        this.currentStep = 0;
        this.nextNoteTime = 0.0;

        this.params303 = { cutoff: 400, res: 15, env: 2500, decay: 0.2, wave: 'sawtooth' };
        this.seq303 = this.gen303();

        // GRID DATA (Default Pattern)
        this.grid = [
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // BD 808
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // SD 808
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // CH 808
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // BD 909
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // OH 909
            [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0]  // ACID
        ];
        this.TRACKS = TRACKS; // Backward compatibility
    }

    gen303() {
        const scale = SCALES[currentScale].slice(0, 6);
        return Array.from({ length: 16 }, () => ({
            freq: scale[Math.floor(Math.random() * scale.length)],
            accent: Math.random() > 0.7, slide: Math.random() > 0.7
        }));
    }

    playDrum(type, time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.masterGain);
        if (type === 0) { // BD 808
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.start(time); osc.stop(time + 0.5);
        } else if (type === 1) { // SD 808
            osc.type = 'triangle'; osc.frequency.setValueAtTime(250, time);
            gain.gain.setValueAtTime(0.6, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            osc.start(time); osc.stop(time + 0.1);
            this.playNoise(time, 0.2, 1000);
        } else if (type === 2) { // CH 808
            this.playNoise(time, 0.05, 7000, 0.2);
        } else if (type === 3) { // BD 909
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
            gain.gain.setValueAtTime(0.8, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            osc.start(time); osc.stop(time + 0.3);
        } else if (type === 4) { // OH 909
            this.playNoise(time, 0.4, 7000, 0.25);
        }
    }

    playNoise(time, dur, freq, vol = 0.3) {
        const bSize = this.ctx.sampleRate * dur;
        const buff = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const d = buff.getChannelData(0);
        for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource(); src.buffer = buff;
        const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = freq;
        const g = this.ctx.createGain();
        src.connect(f); f.connect(g); g.connect(this.masterGain);
        g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(0.01, time + dur);
        src.start(time);
    }

    play303(time, step) {
        const n = this.seq303[step];
        const osc = this.ctx.createOscillator();
        const f = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();
        osc.type = this.params303.wave; osc.frequency.value = n.freq;
        f.type = 'lowpass'; f.Q.value = this.params303.res;
        const cut = this.params303.cutoff; const mod = this.params303.env * (n.accent ? 1.5 : 1);
        f.frequency.setValueAtTime(cut, time);
        f.frequency.linearRampToValueAtTime(cut + mod, time + 0.005);
        f.frequency.exponentialRampToValueAtTime(cut, time + this.params303.decay);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(0.7 * (n.accent ? 1.2 : 1), time + 0.005);
        g.gain.exponentialRampToValueAtTime(0.01, time + this.params303.decay);
        osc.connect(f); f.connect(g); g.connect(this.masterGain);
        osc.start(time); osc.stop(time + this.params303.decay + 0.1);
    }

    start() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.isPlaying = true;
        this.nextNoteTime = this.ctx.currentTime + 0.1;
        this.schedule();
    }

    stop() {
        this.isPlaying = false;
    }

    schedule() {
        while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
            // Play Tracks
            if (this.grid[0][this.currentStep]) this.playDrum(0, this.nextNoteTime);
            if (this.grid[1][this.currentStep]) this.playDrum(1, this.nextNoteTime);
            if (this.grid[2][this.currentStep]) this.playDrum(2, this.nextNoteTime);
            if (this.grid[3][this.currentStep]) this.playDrum(3, this.nextNoteTime);
            if (this.grid[4][this.currentStep]) this.playDrum(4, this.nextNoteTime);
            if (this.grid[5][this.currentStep]) this.play303(this.nextNoteTime, this.currentStep);

            const secondsPerBeat = 60.0 / this.tempo;
            this.nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
            this.currentStep = (this.currentStep + 1) % STEPS;
        }
        if (this.isPlaying) {
            setTimeout(() => this.schedule(), 25);
        }
    }
}

// Expose
window.TechnoEngine = TechnoEngine;
window.TECHNO_TRACKS = TRACKS;
// --- UI COMPONENTS ---
// Extracted from house.js to reduce complexity
// V308: REWRITE to fix syntax errors

console.log("--- UI COMPONENTS LOADED V308-REWRITE ---");

window.createUniversalVideoInterface = function (parentGroup, position, playlist, options) {
    if (!options) options = {};
    const scale = options.scale || 1.0;

    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(position);
    trafficGroup.scale.set(scale, scale, scale);

    trafficGroup.userData = { type: 'videoInterfaceGroup' };
    console.log("Creating Refined Video UI at", position, "Scale:", scale);
    parentGroup.add(trafficGroup);

    // --- 1. SQUARE BUTTON (TOP) ---
    const btnGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const btnMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x440000
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0, 2.5, 0);

    // Initial State Check
    if (window.videoElement && !window.videoElement.paused) {
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    btn.userData = {
        type: 'videoControlSingle',
        onClick: () => {
            if (!window.videoElement) {
                console.warn("No Window.VideoElement found");
                return;
            }

            if (window.videoElement.paused) {
                // PLAY
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                // If no src, use first in playlist or fallback
                if (!window.videoElement.src || window.videoElement.src === '' || window.videoElement.src === window.location.href) {
                    if (playlist && playlist.length > 0) window.videoElement.src = playlist[0].src;
                }

                window.videoElement.play().catch(e => console.error("Video Play Error:", e));

                btn.material.color.setHex(0x00ff00); // Green
                btn.material.emissive.setHex(0x004400);
            } else {
                // PAUSE
                window.videoElement.pause();
                btn.material.color.setHex(0xffff00); // Yellow
                btn.material.emissive.setHex(0x444400);
            }
        }
    };
    trafficGroup.add(btn);
    if (window.interiorClickables) window.interiorClickables.push(btn);

    // --- 2. HEADER "VIDEO" (MIDDLE) ---
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512; hCanvas.height = 128;
    const hctx = hCanvas.getContext('2d');
    hctx.fillStyle = 'rgba(0,0,0,0)';
    hctx.fillStyle = '#ffffff';
    hctx.font = 'bold 60px Arial';
    hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
    hctx.shadowColor = 'rgba(0,0,0,0.8)'; hctx.shadowBlur = 4; hctx.shadowOffsetX = 2; hctx.shadowOffsetY = 2;
    hctx.fillText("VIDEO", 256, 64);

    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: hTex, transparent: true }));
    hMesh.position.set(0, 1.6, 0);
    trafficGroup.add(hMesh);

    // --- 3. TRACKS (BOTTOM) ---
    const updateAllItems = () => {
        if (window.interiorClickables) {
            window.interiorClickables.forEach(c => {
                if (c.userData.type === 'universalVideoItem' && c.userData.updateState) {
                    c.userData.updateState();
                }
            });
        }
    };
    window.updateVideoUI = updateAllItems;

    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            const yPos = 1.0 - (i * 0.9);

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');

            const sTex = new THREE.CanvasTexture(sCanvas);
            const itemMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
            itemMesh.position.set(0, yPos, 0);

            // Dynamic Update Function
            itemMesh.userData.updateState = () => {
                const isActive = (typeof window.masterVideoIndex !== 'undefined' && window.masterVideoIndex === i);
                if (isActive) {
                    sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#00ff00';
                } else {
                    sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#ffffff';
                }
                sctx.font = 'bold 40px Arial';
                sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
                sctx.fillText((i + 1) + ". " + item.title, 20, 50);
                sTex.needsUpdate = true;
            };

            // Initial Draw
            itemMesh.userData.updateState();

            itemMesh.userData.type = 'universalVideoItem';
            itemMesh.userData.index = i;
            itemMesh.userData.onClick = () => {
                console.log("Universal Video Click (Fixed):", i);

                window.masterVideoIndex = i;

                if (options.onPlay && typeof options.onPlay === 'function') {
                    options.onPlay(i);
                }
                else if (window.playTVVideo && typeof window.playTVVideo === 'function') {
                    window.playTVVideo(i);
                } else if (window.videoElement) {
                    window.videoElement.src = item.src;
                    window.videoElement.muted = false;
                    window.videoElement.volume = 1.0;
                    window.videoElement.load();
                    window.videoElement.play().catch(e => console.error(e));
                }

                updateAllItems();

                if (window.interiorClickables) {
                    const btn = window.interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                    if (btn) {
                        btn.material.color.setHex(0x00ff00);
                        btn.material.emissive.setHex(0x004400);
                    }
                }

                if (window.audioPlayer) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }
            };

            trafficGroup.add(itemMesh);
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};
console.log("UI Components Loaded Successfully");
console.log("--- PLUTON.JS LOADED ---");

// --- Holographic Text Helper ---
function createUsherText() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background (Perfectly Circular)
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 510);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    grad.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Text with Glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Line 1: Welcome 
    ctx.font = 'bold 90px "Courier New", monospace';
    ctx.fillText("Welcome", 512, 400);

    // Line 2: Subtext
    ctx.font = '45px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 1;
    ctx.fillText("Explore the 9 rooms", 512, 500);
    ctx.fillText("Collect the 9 words", 512, 570);
    ctx.fillText("And win a surprise!", 512, 640);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    return mesh;
}

// --- Ground Shadow Helper (V287) ---
function createUsherShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.05; // Just above ground
    return mesh;
}

// --- Hall-Style Holograph Helper (V285) ---
function createGlitchyHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Soft Radial Glow to ground the text (Exactly like Hall reference)
    const g = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.6, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    // Faces the user (Default +Z)
    return mesh;
}

// --- Main Character Creator ---
function createPlutoUsher() {
    const group = new THREE.Group();

    const halo = createGlitchyHalo();
    const baseH = 1.8;
    halo.position.set(-0.3, baseH, 7.5);
    group.add(halo);

    const text = createUsherText();
    text.position.set(-0.3, baseH, 7.6);
    group.add(text);

    // Update Function
    group.userData.update = function (t) {
        // Simple Bobbing for Hologram
        const bob = Math.sin(t * 1.5) * 0.1;
        halo.position.y = baseH + bob;
        text.position.y = baseH + bob;

        if (halo.userData.update) halo.userData.update(t);
    };

    return group;
}

const WordHunt = (function () {
    // --- STATE ---
    const TOTAL_WORDS = 9;

    // The list of words and their corresponding rooms
    const WORDS = {
        hall: "Wonder",
        living: "Communicate",
        studio: "Create",
        bedroom: "Dream",
        bathroom: "Contemplate",
        attic: "Think",
        basement: "Feel",
        toilet: "Stories",
        annex: "Remember"
    };

    let foundWords = [];

    // --- DOM ELEMENTS ---
    let container = null;
    let icon = null;
    let listContainer = null;
    let prizeOverlay = null;

    // --- INITIALIZATION ---
    function init() {
        console.log("--- Word Hunt Initialized ---");
        loadState();
        createUI();
        updateUI();
    }

    function loadState() {
        const saved = localStorage.getItem('tonic_wordhunt_found');
        if (saved) {
            try {
                foundWords = JSON.parse(saved);
            } catch (e) {
                console.warn("Failed to parse saved words", e);
                foundWords = [];
            }
        }
    }

    function saveState() {
        localStorage.setItem('tonic_wordhunt_found', JSON.stringify(foundWords));
    }

    // --- UI CREATION ---
    function createUI() {
        // 1. Main Icon (Bottom Right, near other controls?)
        // Let's put it on the top-right, under the header, or bottom-left. 
        // Bottom-Left seems free (Minimap area?). Let's try Top-Right (fixed).

        container = document.createElement('div');
        container.id = 'word-hunt-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2000;
            display: none; /* V-FIX: Initially Hidden */
            flex-direction: column-reverse; /* Reverse visual order: later elements appear above */
            align-items: flex-end;
            font-family: 'Arial', sans-serif;
        `;

        // Icon / Counter
        icon = document.createElement('div');
        icon.id = 'word-hunt-icon';
        icon.style.cssText = `
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            text-shadow: 0 0 5px #00ffff;
            transition: all 0.3s;
            user-select: none;
        `;
        icon.innerHTML = `<span style="font-size: 12px;">WORDS: <span id="word-count">0</span>/${TOTAL_WORDS}</span>`;

        icon.onmouseenter = () => icon.style.background = 'rgba(0,0,0,0.8)';
        icon.onmouseleave = () => icon.style.background = 'rgba(0,0,0,0.6)';
        icon.onclick = toggleList;

        container.appendChild(icon);

        // V-NEW: Word Stack Container (Above Counter)
        const wordStack = document.createElement('div');
        wordStack.id = 'word-stack';
        wordStack.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            margin-bottom: 8px;
        `;
        // Insert AFTER icon so it appears above with column layout
        container.appendChild(wordStack);

        // List (Initially Hidden)
        listContainer = document.createElement('div');
        listContainer.id = 'word-hunt-list';
        listContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #444;
            margin-top: 10px;
            padding: 15px;
            border-radius: 4px;
            display: none;
            flex-direction: column;
            gap: 5px;
            min-width: 150px;
        `;
        container.appendChild(listContainer);

        document.body.appendChild(container);

        // Prize Overlay
        createPrizeOverlay();
    }

    function createPrizeOverlay() {
        prizeOverlay = document.createElement('div');
        prizeOverlay.id = 'word-hunt-prize';
        prizeOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95);
            z-index: 3000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            opacity: 0;
            transition: opacity 1s ease;
        `;

        prizeOverlay.innerHTML = `
            <h1 style="font-family: 'Glass Antiqua', serif; font-size: 60px; color: #ffd700; text-shadow: 0 0 20px #ffaa00; margin-bottom: 20px;">CONGRATULATIONS</h1>
            <p style="font-family: 'Glass Antiqua', cursive; font-size: 24px; max-width: 600px; text-align: center; line-height: 1.5; color: #ccc;">
                You have found all the hidden words. The essence of the house is now yours.
            </p>
            <div style="margin-top: 40px; border: 2px solid #ffd700; padding: 20px; border-radius: 10px;">
                <p style="font-size: 20px; color: #ffd700;">[ PRIZE PLACEHOLDER ]</p>
                <p style="font-size: 14px; margin-top: 10px;">(A secret video or link will appear here)</p>
            </div>
            <button id="close-prize-btn" style="margin-top: 50px; background: transparent; border: 1px solid #fff; color: #fff; padding: 10px 30px; cursor: pointer; font-family: 'Courier New';">CLOSE</button>
        `;

        document.body.appendChild(prizeOverlay);

        document.getElementById('close-prize-btn').addEventListener('click', () => {
            prizeOverlay.style.opacity = '0';
            setTimeout(() => { prizeOverlay.style.display = 'none'; }, 1000);
        });
    }

    function toggleList() {
        if (listContainer.style.display === 'none') {
            renderList();
            listContainer.style.display = 'flex';
        } else {
            listContainer.style.display = 'none';
        }
    }

    function renderList() {
        listContainer.innerHTML = '';
        Object.keys(WORDS).forEach(room => {
            const word = WORDS[room];
            const isFound = foundWords.includes(word);

            const item = document.createElement('div');
            item.style.cssText = `
                color: ${isFound ? '#00ff00' : '#555'};
                font-size: 14px;
                display: flex;
                justify-content: space-between;
            `;
            item.innerHTML = `
                <span>${room.toUpperCase()}</span>
                <span>${isFound ? word : '???'}</span>
            `;
            listContainer.appendChild(item);
        });
    }

    function updateUI() {
        const count = document.getElementById('word-count');
        if (count) count.innerText = foundWords.length;
        if (listContainer && listContainer.style.display !== 'none') renderList();
    }

    // V-NEW: Add Word to Stack with Animation
    function addWordToStack(word) {
        const wordStack = document.getElementById('word-stack');
        if (!wordStack) return;

        const wordEl = document.createElement('div');
        wordEl.style.cssText = `
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            text-shadow: 0 0 5px #00ffff;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        wordEl.textContent = word.toUpperCase();
        wordStack.appendChild(wordEl);

        // Trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                wordEl.style.opacity = '1';
                wordEl.style.transform = 'translateY(0)';
            });
        });
    }

    // --- GAME LOGIC ---
    function collectWord(roomName) {
        const word = WORDS[roomName];
        if (!word) return;

        if (!foundWords.includes(word)) {
            console.log(`Collect Word: ${word} in ${roomName}`);
            foundWords.push(word);
            saveState();
            updateUI();

            // Animation / Feedback
            showCollectionFeedback(word);
            addWordToStack(word);

            if (foundWords.length === TOTAL_WORDS) {
                setTimeout(triggerWinState, 1500);
            }
        } else {
            console.log(`Word already collected: ${word}`);
            // Optional: Smaller feedback "Already collected"
        }
    }

    function showCollectionFeedback(word) {
        // Create a temporary floating element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            font-family: 'Glass Antiqua', cursive;
            font-size: 80px;
            color: #00ffff;
            text-shadow: 0 0 20px #00ffff;
            pointer-events: none;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 2500;
        `;
        feedback.innerText = word;
        document.body.appendChild(feedback);

        // Pop In
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1.0)';
        }, 50);

        // Float Up and Fade Out
        setTimeout(() => {
            feedback.style.transform = 'translate(-50%, -150%) scale(1.2)';
            feedback.style.opacity = '0';
        }, 1500);

        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2500);
    }

    function triggerWinState() {
        console.log("WINNER! Playing Prize Video...");

        // Create Video Overlay
        const vidOverlay = document.createElement('div');
        vidOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: black;
            z-index: 5000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 1s;
        `;

        const video = document.createElement('video');
        video.src = '../assets/video/kado.mp4';
        video.style.cssText = "max-width: 90%; max-height: 80vh; box-shadow: 0 0 50px #ffd700;";
        video.controls = true;
        video.autoplay = true;

        // Link Container
        const linkContainer = document.createElement('div');
        linkContainer.style.marginTop = '20px';
        linkContainer.innerHTML = `
            <a href="https://tonic.davidenker.com/" target="_blank" style="color: #ffd700; font-family: 'Glass Antiqua', cursive; font-size: 24px; text-decoration: none; border-bottom: 2px solid #ffd700;">
                CLAIM YOUR ESSENCE
            </a>
            <p style="color: #888; font-family: 'Arial', sans-serif; margin-top: 10px; font-size: 14px;">(Click to proceed)</p>
            <button id="close-win-btn" style="margin-top: 30px; background: transparent; border: 1px solid #555; color: #555; padding: 8px 20px; cursor: pointer;">CLOSE</button>
        `;

        vidOverlay.appendChild(video);
        vidOverlay.appendChild(linkContainer);
        document.body.appendChild(vidOverlay);

        // Fade In
        setTimeout(() => vidOverlay.style.opacity = '1', 100);

        // Close Handler
        const closeBtn = linkContainer.querySelector('#close-win-btn');
        closeBtn.onclick = () => {
            vidOverlay.style.opacity = '0';
            setTimeout(() => document.body.removeChild(vidOverlay), 1000);
        };
    }


    // --- 3D INTERACTABLE CREATION ---
    function createInteractable(roomName, fontSize = 60, color = "#00ffff") {
        const word = WORDS[roomName];
        if (!word) return null;

        // Create a glowing orb/symbol instead of the text directly? 
        // Or floating text that says "?" until clicked?
        // Plan says: "Hidden Word interactables" -> let's make them 3D Text that reveals itself?
        // OR: Small distinct objects.
        // Let's go with a floating "Orb of Knowledge" or a stylized question mark.

        // For distinctness, let's use a standard "Word Hunt Orb" geometry.

        const group = new THREE.Group();
        group.userData = {
            type: 'wordHuntItem',
            isCollectible: true, // Audit Fix: Explicit flag for raycaster
            name: 'WordHunt_' + roomName, // Used for raycasting identification
            onClick: () => collectWord(roomName)
        };

        // 1. The Orb
        const orbGeo = new THREE.IcosahedronGeometry(0.15, 0);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0088aa,
            emissiveIntensity: 0.8,
            wireframe: true
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        group.add(orb);

        // 2. Inner Glow
        const glowGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        group.add(glow);

        // 3. Large Hitbox (Invisible)
        const hitGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: true });
        const hitBox = new THREE.Mesh(hitGeo, hitMat);
        group.add(hitBox);

        // Animation Loop (Self-contained)
        group.userData.update = (t) => {
            orb.rotation.y = t * 2.0;
            orb.rotation.z = t * 1.5;
            const pulse = Math.sin(t * 3.0) * 0.1 + 1.0;
            orb.scale.set(pulse, pulse, pulse);
        };

        // V-FIX: Ensure it is clickable
        if (window.interiorClickables) {
            window.interiorClickables.push(group);
        }

        return group;
    }

    function showUI() {
        if (container) container.style.display = 'flex';
    }

    return {
        init,
        createInteractable,
        showUI, // V-NEW: Exposed for house.js
        // Debug
        collectWord,
        triggerWinState
    };

})();

window.WordHunt = WordHunt;
function playTrack(index) {
    try {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist || !playlist[index]) return;

        window.currentTrackIndex = index;

        audioPlayer.crossOrigin = "anonymous";
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.load();
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

        initAudioAnalyser();
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();

        console.log("Attempting to play track:", playlist[currentTrackIndex]);

        audioPlayer.play().then(() => {
            isMusicPlaying = true;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);

            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }

            createMusicPanel(playlist, window.currentMusicScale || 1.0);

        }).catch(e => {
            console.error("Play failed", e);
        });

        if (window.stopVideosForAudio) {
            window.stopVideosForAudio();
        }

        if (currentRoom === 'attic') {
            const atticVideo = document.getElementById('attic-video');
            if (atticVideo) {
                atticVideo.muted = true;
                const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                if (knobGroup) {
                    knobGroup.userData.state = 'off';
                    if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                }
            }
        }

    } catch (criticalErr) {
        console.error("Critical PlayTrack Error:", criticalErr);
        alert("System Error in playTrack: " + criticalErr.message);
    }
}

// Consolidated createMusicPanel with Cleanup and Scaling
window.createMusicPanel = function (playlist) {
    console.log("v315-FIXED: Creating Music Panel. Playlist length:", playlist ? playlist.length : 0);
    if (!playlist || playlist.length === 0) return;

    // 1. Cleanup Old UI (Self-contained within createMusicPanel)
    if (typeof interiorGroup !== 'undefined') {
        const toRemove = [];
        interiorGroup.traverse(child => {
            if (child.userData && (child.userData.type === 'musicPanelGroup' || child.userData.type === 'musicPanel' || child.userData.type === 'songItem' || child.userData.type === 'playlistHeader' || child.userData.type === 'musicSwitch')) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => {
            if (child.parent) child.parent.remove(child);
            if (window.interiorClickables) {
                const idx = window.interiorClickables.indexOf(child);
                if (idx > -1) window.interiorClickables.splice(idx, 1);
            }
        });
    }

    // 2. Setup Anchor and Group
    const rData = roomContent[currentRoom];
    const iW = rData.interiorWidth || 10;
    const wallX = -(iW / 2) + 0.01;

    let yBase = 5.5;
    if (currentRoom === 'annex') {
        yBase = 6.0; // V-FIX: Moved up for visibility (was 5.0)
    }

    // V326: Bedroom-specific alignment (Centered on wall)
    let zOffset = 0;
    if (currentRoom === 'bedroom') zOffset = 0;

    const panelGroup = new THREE.Group();
    panelGroup.userData = { type: 'musicPanelGroup' };
    panelGroup.position.set(wallX, yBase, zOffset);
    interiorGroup.add(panelGroup);

    // Apply Scaling Factor
    if (currentRoom === 'annex' || currentRoom === 'toilet') {
        panelGroup.scale.setScalar(0.75);
    }
    musicPanelMesh = panelGroup;

    // 3. Create Static UI Elements (Relative to panelGroup)

    // Audio Button
    const switchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: isMusicPlaying ? 0x00ff00 : 0xff0000 });
    musicSwitchMesh = new THREE.Mesh(switchGeo, switchMat);
    musicSwitchMesh.rotation.y = Math.PI / 2;
    musicSwitchMesh.position.set(0.02, 0.5, 0); // 0.5 above anchor
    musicSwitchMesh.userData = { type: 'musicSwitch', action: 'toggleMusic' };
    panelGroup.add(musicSwitchMesh);
    if (window.interiorClickables) window.interiorClickables.push(musicSwitchMesh);

    // Header
    const pHeadCanvas = document.createElement('canvas');
    pHeadCanvas.width = 512; pHeadCanvas.height = 64;
    const pctx = pHeadCanvas.getContext('2d');
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 60px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
    pctx.shadowColor = 'rgba(0,0,0,0.8)'; pctx.shadowBlur = 4; pctx.shadowOffsetX = 2; pctx.shadowOffsetY = 2;
    pctx.fillText("AUDIO", 256, 32);
    pctx.font = '14px Arial'; pctx.shadowBlur = 0;
    // V326: Version string removed per user request
    const pHeadTex = new THREE.CanvasTexture(pHeadCanvas);
    const pHeadMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.6), new THREE.MeshBasicMaterial({ map: pHeadTex, transparent: true }));
    pHeadMesh.rotation.y = Math.PI / 2;
    pHeadMesh.position.set(0, -0.5, 0); // 0.5 below anchor
    pHeadMesh.userData = { type: 'playlistHeader' };
    panelGroup.add(pHeadMesh);

    // 4. Create Dynamic Playlist Items
    playlist.forEach((item, i) => {
        const isCurrent = (typeof currentTrackIndex !== 'undefined' && i === currentTrackIndex);
        const yPos = -1.3 - (i * 0.9); // Relative to anchor

        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512; sCanvas.height = 120;
        const sctx = sCanvas.getContext('2d');

        if (isCurrent && isMusicPlaying) {
            sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#00ff00';
        } else {
            sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            sctx.fillRect(0, 0, 512, 120);
            sctx.fillStyle = '#ffffff';
        }

        sctx.font = 'bold 36px Arial';
        sctx.textAlign = 'left'; sctx.textBaseline = 'bottom';
        sctx.fillText((i + 1) + ". " + item.track, 20, 55);

        sctx.font = '28px Arial'; sctx.textBaseline = 'top';
        sctx.fillStyle = isCurrent ? '#aaff00' : '#cccccc';
        sctx.fillText(item.artist, 50, 65);

        const sTex = new THREE.CanvasTexture(sCanvas);
        const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
        sMesh.rotation.y = Math.PI / 2;
        sMesh.position.set(0, yPos, 0);

        sMesh.userData = { type: 'songItem', index: i };
        panelGroup.add(sMesh);
        if (window.interiorClickables) window.interiorClickables.push(sMesh);
    });

    // Define nextTrack globally so it can be referenced
    function nextTrack() {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist) return;
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

        const wasPlaying = isMusicPlaying;
        audioPlayer.src = playlist[currentTrackIndex].src;
        audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;

        if (wasPlaying) {
            audioPlayer.play();
        }
        window.createMusicPanel(playlist);
    }

    // Global Auto-Next Listener (Idempotent)
    if (window.audioPlayer && !window.audioPlayer.hasNextTrackListener) {
        window.audioPlayer.addEventListener('ended', nextTrack);
        window.audioPlayer.hasNextTrackListener = true;
    }

    // Expose for external updates (e.g. from Video UI)
    window.updateMusicPanelHighlight = function () {
        if (window.roomContent && window.currentRoom && window.roomContent[window.currentRoom]) {
            const playlist = window.roomContent[window.currentRoom].playlist;
            if (playlist) window.createMusicPanel(playlist);
        }
    };

    function toggleMusic() {
        const playlist = roomContent[currentRoom].playlist;
        if (!playlist) return;

        if (!audioPlayer.src || audioPlayer.src === '' || audioPlayer.src === window.location.href) {
            if (currentTrackIndex < 0) currentTrackIndex = 0;
            audioPlayer.src = playlist[currentTrackIndex].src;
            audioPlayer.volume = playlist[currentTrackIndex].volume || 0.5;
        }
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();

        if (isMusicPlaying) {
            audioPlayer.pause(); isMusicPlaying = false;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0xff0000);
            window.createMusicPanel(playlist);
        } else {
            if (currentRoom === 'attic') {
                const atticVideo = document.getElementById('attic-video');
                if (atticVideo) {
                    atticVideo.muted = true;
                    // Turn Knob RED
                    const knobGroup = interiorGroup.children.find(c => c.userData.type === 'atticAudioToggle');
                    if (knobGroup) {
                        knobGroup.userData.state = 'off';
                        if (knobGroup.children[1]) knobGroup.children[1].material.color.setHex(0xff0000);
                    }
                }
            }
            else if (['hall', 'studio'].indexOf(currentRoom) === -1 && videoElement && !videoElement.paused) {
                videoElement.pause();
            }

            if (currentRoom === 'living' && window.stopLivingVideo) {
                window.stopLivingVideo();
            }
            // V-FIX 24: Ensure Bathroom Video Stop (Reset Lights) is called too!
            if (currentRoom === 'bathroom' && window.stopBathroomVideo) {
                window.stopBathroomVideo();
            }

            if (window.updateVideoUI) {
                window.masterVideoIndex = -1;
                window.updateVideoUI();
            }

            audioPlayer.play().catch(e => console.log("Audio play failed", e));
            isMusicPlaying = true;
            if (musicSwitchMesh) musicSwitchMesh.material.color.setHex(0x00ff00);
            window.createMusicPanel(playlist);

            if (window.interiorClickables) {
                const btns = window.interiorClickables.filter(c => c.userData.type === 'videoControlSingle');
                btns.forEach(b => {
                    if (b.material) {
                        b.material.color.setHex(0xff0000);
                        if (b.material.emissive) b.material.emissive.setHex(0x440000);
                    }
                });
            }
        }
    }
    window.toggleMusic = toggleMusic;
};
function createHallInterior() {
    // -- BACKGROUND VIDEO --
    videoElement.src = "../assets/video/dots.mp4";
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));

    videoTexture = new THREE.VideoTexture(videoElement);
    // Full wall size (10 width, 8 height)
    const bgGeo = new THREE.PlaneGeometry(10, 8);
    const bgMat = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0.6, // V209: Adjusted brightness (was 0.3)
        blending: THREE.AdditiveBlending
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 4.0, -4.95);
    interiorGroup.add(bgMesh);

    // -- LIGHTING ADJUSTMENT --
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // Add Cozy Warm SpotLight
    // V-NEW: Reduced Intensity (2.0 -> 0.5)
    // V311: Significantly brighter (0.25 -> 2.5)
    const cozySpot = new THREE.SpotLight(0xffaa00, 1.5); // V-REFINE: Lower intensity (was 3.5)
    cozySpot.position.set(2, 5, 2); // V-REFINE: Moved down (from 6.0) per Reference
    cozySpot.target.position.set(0, 0, 0);
    cozySpot.angle = Math.PI / 3; // V-REFINE: Narrower (from PI/2.5) per Reference
    cozySpot.penumbra = 0.5; // V-REFINE: Harsher Edge per Reference
    cozySpot.castShadow = true;
    // V-NEW: Strengthen shadows for curtains and R2D2
    cozySpot.shadow.mapSize.width = 2048;
    cozySpot.shadow.mapSize.height = 2048;
    cozySpot.shadow.bias = -0.0001;
    cozySpot.shadow.camera.near = 0.5;
    cozySpot.shadow.camera.far = 20;
    interiorGroup.add(cozySpot);
    interiorGroup.add(cozySpot.target);

    // V-REFINE: Red Room Mood Ambient (Lowered for atmosphere)
    const hallAmbient = new THREE.AmbientLight(0xffffff, 0.15);
    interiorGroup.add(hallAmbient);

    // V-NEW: Additional directional light for stronger shadows
    const shadowLight = new THREE.DirectionalLight(0xffaa00, 0.8);
    shadowLight.position.set(3, 6, 3);
    shadowLight.target.position.set(0, 0, 0);
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;
    shadowLight.shadow.camera.near = 0.5;
    shadowLight.shadow.camera.far = 20;
    shadowLight.shadow.bias = -0.0005;
    interiorGroup.add(shadowLight);
    interiorGroup.add(shadowLight.target);

    // --- CURTAINS ---
    // Left side (To the very edge of the wall)
    createHallCurtain(-4.99, 0, 4.8, Math.PI / 2);
    // Back wall, far right (V-FIX: Shifted forward to avoid clipping)
    createHallCurtain(4.8, 0, -4.4, 0);

    // V-REFINE: Restore "Welcome to Meaning House" wall text (Match Reference)
    const wallTextCanvas = document.createElement('canvas');
    wallTextCanvas.width = 1024; wallTextCanvas.height = 512;
    const wtctx = wallTextCanvas.getContext('2d');
    wtctx.fillStyle = 'white';
    wtctx.textAlign = 'center';
    wtctx.shadowColor = "black"; wtctx.shadowBlur = 5;

    wtctx.font = 'bold 80px "Glass Antiqua", cursive';
    wtctx.fillText("Welcome to", 512, 130);

    wtctx.font = 'bold 110px "Glass Antiqua", cursive'; // Slightly smaller to fit "the House of Meaning"
    wtctx.fillText("the House of Meaning", 512, 250);

    wtctx.font = '40px "Lato", sans-serif';
    wtctx.fillText("Explore // Wonder // Dream", 512, 330);

    wtctx.font = '28px "Lato", sans-serif';
    wtctx.fillText("Big screen and sound recommended", 512, 410);

    const wallTex = new THREE.CanvasTexture(wallTextCanvas);
    const wallTextPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4),
        new THREE.MeshBasicMaterial({ map: wallTex, transparent: true })
    );
    wallTextPlane.position.set(0, 4.0, -4.7);
    interiorGroup.add(wallTextPlane);

    // -- SHADOW UNDER R2D2 --
    // V-REFINE: Ground Shadow logic moved to createR2D2ForHall to avoid reference error
    createR2D2ForHall();
}

function createHallCurtain(x, y, z, rotationY) {
    const curtainGroup = new THREE.Group();
    curtainGroup.position.set(x, y, z);
    curtainGroup.rotation.y = rotationY;

    // V-REFINE: Narrow, Denser, Opaque Draped Curtain
    const width = 1.2; // V-FIX: Narrower to avoid obscuring wall text
    const height = 8;
    const curtainGeo = new THREE.PlaneGeometry(width, height, 40, 40);
    const pos = curtainGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        let ux = pos.getX(i);
        const u = (ux + width / 2) / width;

        // VOLUMINOUS ROUND FOLDS (High density: 18 folds)
        const waveAmp = 0.35;
        const wave = Math.sin(u * Math.PI * 18) * waveAmp;

        pos.setZ(i, wave);
    }
    curtainGeo.computeVertexNormals();

    const curtainMat = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
    });

    const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
    curtainMesh.position.y = 4.0;
    curtainMesh.castShadow = true;
    curtainMesh.receiveShadow = true;
    curtainGroup.add(curtainMesh);

    // V-REFINE: Solid Backing Plane
    // V-FIX: Moved further back (-0.4) to avoid Z-fighting/flickering with waves
    const backGeo = new THREE.PlaneGeometry(width, height);
    const backMesh = new THREE.Mesh(backGeo, curtainMat);
    backMesh.position.set(0, 4.0, -0.4);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    curtainGroup.add(backMesh);

    interiorGroup.add(curtainGroup);
}

function createHologram() {
    // HOLOGRAM: Control Instructions
    const group = new THREE.Group();
    group.position.set(0, 1.5, 2.0);


    // Moving along with the 3D environment (Rotation)
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Glow
    const g = ctx.createRadialGradient(256, 256, 120, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    // Text "In the Circle"
    ctx.fillStyle = '#ccffff';
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10;
    // V209: "INSTRUCTIONS" (V-REFINE: Exact Reference size 50/30)
    ctx.font = 'bold 50px "Courier New", monospace'; ctx.textAlign = "center";
    ctx.fillText("FREE WILL", 256, 230);

    ctx.font = '30px "Courier New", monospace';
    ctx.fillText("DOES NOT EXIST", 256, 280);
    ctx.fillText("CLICK FOR MORE", 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    // DoubleSide so it's visible from all angles as it rotates
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });

    // Vertical Plane inside the ring
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), mat);
    mesh.position.y = 0.5; // Slightly above ring
    // NO ROTATION -> Make sure it faces the entrance (-Z direction) or +Z?
    // Room Camera enters from +Z looking -Z.
    // So Plane should face +Z.
    // Default plane faces +Z. So default rotation is fine.
    group.add(mesh);

    return group;
}

function createR2D2ForHall() {
    const r2d2Group = new THREE.Group();
    // V1: Scale 0.4 (Slightly larger than studio to be visible)
    r2d2Group.scale.set(0.4, 0.4, 0.4);
    // V311: R2D2 starting pos shifted
    r2d2Group.position.set(0, 0, 1.0);
    r2d2Group.rotation.y = 0;
    interiorGroup.add(r2d2Group);

    // V-FIX: Add Ground Shadow directly to the group here (V22)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grd = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.9)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grd;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 1.0, depthWrite: false });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 5.0), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.05, 0);
    r2d2Group.add(shadowMesh);

    // Parent Instructions to R2D2 so they move together
    const instructions = createHologram();
    // Scale BACK UP (Since R2 is 0.4x, we need 2.5x to get back to 1.0 world scale)
    instructions.scale.set(2.5, 2.5, 2.5);
    instructions.position.set(0, 7.0, 1.5); // Floating even higher above R2 (V318)
    r2d2Group.add(instructions);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.1; // Less tilt for standing "happily"

    // Body Group
    const bodyGroup = new THREE.Group();
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 40), white);
    bodyCyl.castShadow = true;
    bodyGroup.add(bodyCyl);

    // Body Details
    const ventGeo = new THREE.BoxGeometry(0.6, 0.4, 0.1);
    const vent1 = new THREE.Mesh(ventGeo, blue);
    vent1.position.set(0.4, 0.5, 1.35);
    bodyGroup.add(vent1);
    const vent2 = new THREE.Mesh(ventGeo, blue);
    vent2.position.set(-0.4, 0.5, 1.35);
    bodyGroup.add(vent2);

    // R2-D2 Body Rings
    const ringGeo = new THREE.TorusGeometry(1.41, 0.015, 8, 40);
    const ring1 = new THREE.Mesh(ringGeo, dark);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.8;
    bodyGroup.add(ring1);
    const ring2 = ring1.clone();
    ring2.position.y = -0.8;
    bodyGroup.add(ring2);

    bodyGroup.rotation.x = bodyTiltAngle;
    bodyGroup.position.y = bodyPivotY;
    r2d2Group.add(bodyGroup);

    // Dome
    const domeGroup = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), silver);
    domeGroup.add(dome);

    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20), dark);
    eye.rotation.x = Math.PI / 2;
    eye.position.set(0, 0.75, 1.3);
    domeGroup.add(eye);

    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12), silver);
    proj.rotation.x = 0.6;
    proj.position.set(0, 0.35, 1.3);
    domeGroup.add(proj);

    // Blinking Lights
    const lightRed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    lightRed.position.set(0.4, 0.6, 1.25);
    domeGroup.add(lightRed);
    const lightBlue = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    lightBlue.position.set(-0.4, 0.7, 1.25);
    domeGroup.add(lightBlue);
    const lightGreen = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff44 }));
    lightGreen.position.set(0, 0.9, 1.1);
    domeGroup.add(lightGreen);

    domeGroup.position.y = 1.5;
    bodyGroup.add(domeGroup);

    // FOOT
    function createFoot() {
        const foot = new THREE.Group();
        const footTop = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), white);
        footTop.scale.set(1, 1, 2.2);
        foot.add(footTop);
        return foot;
    }

    // Side Legs
    function createSideLeg(side) {
        const legGroup = new THREE.Group();
        const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), white);
        joint.rotation.z = Math.PI / 2;
        joint.position.x = side * 1.5;
        legGroup.add(joint);

        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.4, sideLegHeight, 0.7), white);
        strut.position.y = -sideLegHeight / 2;
        strut.position.x = side * 1.5;
        legGroup.add(strut);

        const foot = createFoot();
        foot.position.y = -sideLegHeight;
        foot.position.z = 0.1;
        foot.position.x = side * 1.5;
        legGroup.add(foot);

        legGroup.position.y = bodyPivotY;
        return legGroup;
    }

    r2d2Group.add(createSideLeg(1));
    r2d2Group.add(createSideLeg(-1));

    // Central Leg
    const centralLeg = new THREE.Group();
    const legSlant = -0.1; // Less slant
    const cStrutHeight = 1.2;
    const cStrut = new THREE.Mesh(new THREE.BoxGeometry(0.4, cStrutHeight, 0.4), white);
    cStrut.position.y = -cStrutHeight / 2;
    centralLeg.add(cStrut);

    const cFoot = createFoot();
    cFoot.rotation.x = Math.abs(bodyTiltAngle) + Math.abs(legSlant);
    cFoot.position.y = -cStrutHeight;
    cFoot.position.z = 0.05;
    centralLeg.add(cFoot);

    centralLeg.position.set(0, -1.2, 0);
    centralLeg.rotation.x = legSlant;
    bodyGroup.add(centralLeg);

    // -- HAPPY HEAD ROTATION --
    // Oscillate between -0.5 and 0.5 radians approx
    const startRot = { y: -0.6 };
    const targetRot = { y: 0.6 };

    // Initial Tween
    const tweenRight = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: 0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    const tweenLeft = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: -0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    // Chain them
    tweenRight.chain(tweenLeft);
    tweenLeft.chain(tweenRight);
    tweenRight.start();


    // Complex Patrol Animation
    const p1 = { x: -2.0, z: 1.0, ry: 0.5 };
    const p2 = { x: 2.0, z: -1.0, ry: -0.5 };
    const pHome = { x: 0, z: 1.0, ry: 0 };

    const patrol1 = new TWEEN.Tween(r2d2Group.position)
        .to({ x: p1.x, z: p1.z }, 4000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotate1 = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: p1.ry }, 1000);

    const patrol2 = new TWEEN.Tween(r2d2Group.position)
        .to({ x: p2.x, z: p2.z }, 5000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotate2 = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: p2.ry }, 1000);

    const patrolHome = new TWEEN.Tween(r2d2Group.position)
        .to({ x: pHome.x, z: pHome.z }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

    const rotateHome = new TWEEN.Tween(r2d2Group.rotation)
        .to({ y: pHome.ry }, 1000);

    // Chain Patrol
    patrol1.chain(rotate1);
    rotate1.chain(patrol2);
    patrol2.chain(rotate2);
    rotate2.chain(patrolHome);
    patrolHome.chain(rotateHome);
    rotateHome.chain(patrol1);

    patrol1.start();

    // Make him clickable? Optional.
    r2d2Group.userData = { type: 'r2d2', name: 'R2D2' };

    // V-FIX 22: Explicit Hitbox for easier clicking (Visible but transparent)
    const hitGeo = new THREE.CylinderGeometry(2.5, 2.5, 7.0, 16);
    const hitMat = new THREE.MeshBasicMaterial({
        visible: true,
        color: 0xffff00,
        wireframe: false,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
    });
    const hitBox = new THREE.Mesh(hitGeo, hitMat);
    hitBox.position.y = 2.0;
    // Name it for debug
    hitBox.userData = { name: "R2D2_HitBox", type: "r2d2" };
    r2d2Group.add(hitBox);

    // V-WORDHUNT: Hidden Orb in R2D2
    if (typeof WordHunt !== 'undefined') {
        console.log("WordHunt Found in Hall. Initializing R2D2 Orb...");
        const item = WordHunt.createInteractable('hall');
        if (item) {
            // Hide inside R2 initially
            item.position.set(0, 1.0, 0);
            item.scale.set(0.1, 0.1, 0.1); // Tiny initially
            item.visible = false;
            r2d2Group.add(item);

            // V-FIX 19: SUPER HITBOX FOR ORB
            // The default one might be too small or bubbling fails.
            // Let's add a massive explicit HitBox to the Orb Item Group.
            const orbHitGeo = new THREE.SphereGeometry(1.0, 16, 16); // Radius 1.0 * Scale 3.0 = HUGE
            const orbHitMat = new THREE.MeshBasicMaterial({ visible: false }); // Invisible Material
            const orbHitBox = new THREE.Mesh(orbHitGeo, orbHitMat);
            orbHitBox.userData.onClick = () => {
                console.log("R2D2 Orb HitBox Clicked!");
                // Call the original handler on the group if it exists
                if (item.userData.onClick) item.userData.onClick();
            };
            orbHitBox.userData.isOrbHitBox = true;
            item.add(orbHitBox);

            // Click Handler for R2D2
            const r2ClickHandler = () => {
                // If orb is already revealed, do nothing (orb itself handles the collection click)
                if (item.userData.revealed) return;

                console.log("R2D2 Clicked! Popping out orb...");
                item.visible = true;
                item.userData.revealed = true;

                // Animate Pop Out (Up and Scale Up)
                new TWEEN.Tween(item.position)
                    .to({ y: 12.5 }, 1500) // V-FIX: Even Higher (12.5)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(() => console.log("Orb Y:", item.position.y)) // Debug
                    .start();

                new TWEEN.Tween(item.scale)
                    .to({ x: 3.0, y: 3.0, z: 3.0 }, 1500) // V-FIX: SUPER BIG (3.0)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
            };

            r2d2Group.userData.onClick = r2ClickHandler;
            hitBox.userData.onClick = r2ClickHandler; // Double bind

            // Register R2D2 as clickable
            if (window.interiorClickables) {
                window.interiorClickables.push(r2d2Group);
                window.interiorClickables.push(hitBox); // Push hitbox too
                // V-FIX: Push the Orb Item so it can be clicked when revealed!
                window.interiorClickables.push(item);
                // Also push our new Super HitBox
                window.interiorClickables.push(orbHitBox);
                console.log("R2D2, Hitbox, Orb, and SuperOrbHitBox added to interiorClickables");
            }
        } else {
            console.error("WordHunt.createInteractable returned null for 'hall'");
        }
    } else {
        console.error("WordHunt is undefined in hall.js");
    }
}
function createBathroomInterior() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY (Center)
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; interiorGroup.add(faucet);

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bathroom');
        if (item) {
            // V-FIX: Move to Sink/Vanity Area (Better visibility)
            // Was: (3.5, 0.5, -2.0) (Bathtub)
            item.position.set(0, 1.5, -4.2);
            item.scale.set(0.8, 0.8, 0.8); // Slightly smaller to fit vanity
            interiorGroup.add(item);
        }
    }

    // MIRROR FRAME
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.95, 3.20, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 })); // 0x222222 -> 0x111111
    mirrorFrame.position.set(0, 3.8, -4.9);
    mirrorFrame.castShadow = true;
    interiorGroup.add(mirrorFrame);

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
            // V-FIX: Increased Pitch Sensitivity (0.4 -> 1.5) and Range
            // When looking DOWN (pitch < 0), we want horizon to go UP significantly to show "floor" reflection.
            // When looking UP, horizon goes DOWN to show ceiling.
            float horizon = 0.5 - (uViewPitch * 1.5); // Much stronger response
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
                // V-FIX: Do NOT darken video globally (Keep it reasonably bright)
            } else {
                // Reflection mode
                vec3 finalReflect = tileColor + vec3(gloss);
                // Mix to tinted void (Very Dark)
                finalColor = mix(finalReflect, vec3(0.005, 0.01, 0.015), voidFactor);
                // V-TUNE: Extra Darkening for "Blurry/Dim" feel ONLY in reflection mode?
                // Or apply dimmer? Legacy code had global dimmer.
                finalColor *= 0.7; // Global dimmer for reflection
            }
            
            // Note: Removed global finalColor *= 0.7 outside if/else so video stays bright

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


    const tubGroup = new THREE.Group();

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
        roughness: 0.8, // V-FIX: Less intense reflection (was 0.2)
        metalness: 0.05 // Reduced metalness (was 0.1)
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; interiorGroup.add(floor);


    const matMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), matMat);
    bathMat.rotation.x = -Math.PI / 2;
    bathMat.position.set(0, 0.02, -2.0); // Slightly above floor
    interiorGroup.add(bathMat);


    // --- VIDEO LOGIC ---
    // START: Do NOT auto-play video. Start in Reflection Mode.
    if (!window.videoElement) window.videoElement = document.getElementById('generic-video');

    if (window.videoElement) {
        // V41: Correct Video from data.js
        window.videoElement.src = "../assets/video/Time-Is-Now.mp4";
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

                    // ROBUST AUDIO STOP
                    if (window.stopVideosForAudio) {
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

        // V-FIX 22: Tween Safety & Goldilocks Reset
        // 1. Kill any active dimming tweens so they don't overwrite our reset
        TWEEN.getAll().forEach(t => t.stop());

        // 2. Reset Lights to Goldilocks Profile (0.35/0.45)
        if (dirLight) dirLight.intensity = 0.45;
        if (rimLight) rimLight.intensity = 0.3;
        if (ambientLight) ambientLight.intensity = 0.35;
    };

    // VIDEO PLAYLIST (Left of Mirror)
    if (window.createUniversalVideoInterface && roomContent.bathroom.videoPlaylist) {
        const posData = roomContent['bathroom'].videoInterfacePos || { x: -2.8, y: 2.8, z: -4.5 };
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(posData.x, posData.y, posData.z), roomContent.bathroom.videoPlaylist, {
            scale: 0.75, // V306: Scale 0.75x
            onPlay: (index) => {
                // V-FIX 6: Soft Darkening (Tween) - Restored
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.2 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

                console.log("Bathroom Video Play: Darkening Room (Soft)");
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
function createAtticInterior() {
    // V-WORDHUNT: Logic is now handled inside createColoredBox for "WISDOM"
    // Refactored to capture the box explicitly without fragile lookups.

    let wisdomBoxRef = null;

    // Modified helper to return the box
    const createColoredBox = (labelText, labelColor, boxColor, x, z) => {
        // Box Base
        const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            roughness: 0.6,
            metalness: 0.1
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(x, 0.75, z);
        box.castShadow = true;
        box.receiveShadow = true;

        // V-FIX 18: DARK INTERIOR (Simulation)
        // A black plane just above the solid box top to look like a void
        const voidGeo = new THREE.PlaneGeometry(1.4, 1.4);
        const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const voidPlane = new THREE.Mesh(voidGeo, voidMat);
        voidPlane.rotation.x = -Math.PI / 2;
        voidPlane.position.y = 0.76; // Slightly above box top (0.75)
        box.add(voidPlane);

        // V-FIX 18: HINGED LID
        // Pivot Group at the back-top edge
        // Box Top Y = 0.75 (relative to 0 center? No, geometry is 1.5 height, so top is 0.75)
        // Box Back Z = -0.75
        const lidPivot = new THREE.Group();
        lidPivot.position.set(0, 0.75, -0.75); // Pivot at back edge

        const lidGeo = new THREE.BoxGeometry(1.6, 0.1, 1.6);
        const lid = new THREE.Mesh(lidGeo, boxMat);
        // Lid center needs to be offset so its back edge sits at the pivot
        // Lid Back Z must be at 0 relative to pivot. Lid depth is 1.6, so center is at +0.8
        // Lid Bottom Y should be at 0 relative to pivot. Height 0.1, center at +0.05
        lid.position.set(0, 0.05, 0.8);
        lid.castShadow = true;
        lid.receiveShadow = true;
        lid.name = "lid";

        lidPivot.add(lid);
        box.add(lidPivot);

        // Label (Text on Front)
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = labelColor;
        ctx.font = 'bold 60px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 256, 128);

        const tex = new THREE.CanvasTexture(canvas);
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.65), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        // V-FIX 16: Move Label Forward (0.82)
        labelMesh.position.set(0, 0, 0.82);
        box.add(labelMesh);

        interiorGroup.add(box);

        // V-FIX: Direct Interaction Logic for WISDOM Box
        if (labelText === "WISDOM") {
            // Check for WordHunt Item
            let orbItem = null;
            if (typeof WordHunt !== 'undefined') {
                orbItem = WordHunt.createInteractable('attic');
            }

            // V-FIX 10: Fallback Orb
            if (!orbItem) {
                console.log("Attic: Creating Fallback (Dummy) Orb");
                const dummyGeo = new THREE.SphereGeometry(0.3, 16, 16);
                const dummyMat = new THREE.MeshStandardMaterial({
                    color: 0x00ffff,
                    emissive: 0x0088ff,
                    emissiveIntensity: 0.5,
                    roughness: 0.2
                });
                orbItem = new THREE.Mesh(dummyGeo, dummyMat);
            }

            if (orbItem) {
                console.log("Attic: Injecting Orb into WISDOM box");
                // Start inside the "void"
                orbItem.position.set(0, 0.5, 0);
                orbItem.scale.set(0.1, 0.1, 0.1);
                orbItem.visible = false;
                box.add(orbItem);
            }

            // Click Handler
            const openBox = () => {
                if (!box.userData.isOpen) {
                    console.log("Wisdom Box Clicked (Hinged) - OPENING");
                    box.userData.isOpen = true;
                    new TWEEN.Tween(lidPivot.rotation).to({ x: -Math.PI * 0.6 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                    if (orbItem) {
                        orbItem.visible = true; orbItem.userData.revealed = true;
                        new TWEEN.Tween(orbItem.position).to({ y: 1.8 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                        new TWEEN.Tween(orbItem.scale).to({ x: 1.0, y: 1.0, z: 1.0 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                    }
                } else {
                    console.log("Wisdom Box Clicked (Hinged) - SHUTTING");
                    box.userData.isOpen = false;
                    new TWEEN.Tween(lidPivot.rotation).to({ x: 0 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    if (orbItem) {
                        new TWEEN.Tween(orbItem.position).to({ y: 0.5 }, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(() => { if (!box.userData.isOpen) orbItem.visible = false; }).start();
                        new TWEEN.Tween(orbItem.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    }
                }
            };

            box.userData.onClick = openBox;
            lid.userData.onClick = openBox;

            // V-FIX 21: NUCLEAR OPTION - Disable Label Raycast
            // Ensure the label (which is in front) NEVER blocks the click
            labelMesh.raycast = function () { };

            // V-FIX 21: SUPER HITBOX (Opacity 0, NOT Visible: False)
            // Visible: False sometimes fails raycasting depending on setup.
            // Opacity 0 is reliable.
            // Size 2.0 ensures it engulfs the Label (at Z=0.82) completely.
            const hitBoxGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
            const hitBoxMat = new THREE.MeshBasicMaterial({
                visible: true,
                color: 0xffff00, // Debug color (invisible via opacity)
                transparent: true,
                opacity: 0.0,
                depthWrite: false, // V-FIX 23: IMPORTANT! Don't hide stuff behind me!
                side: THREE.DoubleSide
            });
            const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
            hitBox.position.copy(box.position);

            // Interaction Data
            hitBox.userData = {
                onClick: openBox,
                type: 'wisdomBox_HitBox'
            };

            interiorGroup.add(hitBox);
            interiorClickables.push(hitBox);
            console.log("Attic: Added NUCLEAR HitBox (Op0, Size 2.0) for Wisdom Box");

            // Keep visuals just in case, but HitBox should catch everything
            interiorClickables.push(box);
            interiorClickables.push(lid);
        }

        return box;
    };

    // 1. LEFT BOX: RED "BEAUTY" (Spacing -2.5)
    createColoredBox("BEAUTY", '#ffffff', 0xd32f2f, -2.5, -1.8);

    // 2. MIDDLE BOX: YELLOW "KNOWLEDGE"
    createColoredBox("KNOWLEDGE", '#000000', 0xfbc02d, 0, -1.8);

    // 3. RIGHT BOX: DEEP-BLUE "WISDOM" (Spacing 2.5)
    createColoredBox("WISDOM", '#ffffff', 0x1a237e, 2.5, -1.8);

    // Dust Particles (Keep for atmosphere)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 10; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.1 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    particles.position.y = 3;
    particles.userData = { type: 'atticDust' };
    interiorGroup.add(particles);

    const lampGroup = new THREE.Group();
    // V310: Restore to Wall-Mounted position.
    // Wall is at z = -5.0. Move to -4.8. 
    // Was floating at (-1.5, 2.5, -2.0)
    lampGroup.position.set(-4.0, 5.0, -4.8);

    // 1. Wall Mount (Brass Base)
    const mountGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.6, roughness: 0.3 });
    const mount = new THREE.Mesh(mountGeo, brassMat);
    mount.rotation.x = Math.PI / 2; // Flat against wall
    mount.position.z = -0.1;
    lampGroup.add(mount);

    // 2. Arm (Curved Brass Tube)
    const armGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16, Math.PI);
    const arm = new THREE.Mesh(armGeo, brassMat);
    arm.rotation.y = Math.PI / 2; // Arcing out from wall
    arm.position.set(0, 0.2, 0.3);
    lampGroup.add(arm);

    // 3. Shade (Old Fashioned Glass/Fabric Cone)
    const shadeGeo = new THREE.ConeGeometry(0.8, 0.6, 32, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
        color: 0xfdfbd3, // Creamy/Yellowish
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.5
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0, -0.2, 0.7); // Hanging from arm end
    lampGroup.add(shade);

    // 4. Bulb (Inside)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    bulb.position.y = -0.2;
    shade.add(bulb);

    // 5. The Light (Stronger)
    const light = new THREE.PointLight(0xffaa00, 2.5, 25);
    light.castShadow = true;
    // V315: Soften Shadows
    light.shadow.radius = 4;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.y = -0.5;
    shade.add(light);

    // V-FIX: ACTUALLY ADD IT TO THE SCENE!
    interiorGroup.add(lampGroup);

    // Logic for WISDOM box interaction is now handled inside createColoredBox
}

function createProjector() {
    const projGroup = new THREE.Group();
    // Material
    const iron = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 1.0, roughness: 0.2 });

    // Base Box
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), iron);
    base.position.y = 0.1;
    projGroup.add(base);

    // Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.5), iron);
    body.position.y = 0.4;
    projGroup.add(body);

    // Lens
    const lenscyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2), chrome);
    lenscyl.rotation.x = Math.PI / 2;
    lenscyl.position.set(0, 0.45, -0.35);
    projGroup.add(lenscyl);


    const lensLocal = new THREE.Vector3(0, 0.45, -0.35);
    const targetLocal = new THREE.Vector3(0, 2.2, -2.95);
    const vec = new THREE.Vector3().subVectors(targetLocal, lensLocal);
    const height = vec.length(); // Length of beam

    // Geometry: Top(0.05) -> Bottom(2.5 = Width 5.0)
    // Top is +Y, Bottom is -Y.
    const beamGeo = new THREE.CylinderGeometry(0.05, 2.5, height, 64, 1, true);

    // Texture: Constant Noise + Gradient Mask
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 128; bCanvas.height = 512;
    const bCtx = bCanvas.getContext('2d');

    // 1. Noise
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 512; j++) {
            const val = Math.floor(Math.random() * 255);
            bCtx.fillStyle = `rgba(${val},${val},${val},0.15)`;
            bCtx.fillRect(i, j, 1, 1);
        }
    }

    // 2. Gradient (Top Opaque -> Bottom Transparent)
    // GLOW EFFECT: Strong white at Top (0), fading out.
    const g = bCtx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Bright Glow at Lens
    g.addColorStop(0.2, 'rgba(255, 255, 255, 0.35)'); // Quick fade to beam body
    g.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fade to transparent

    bCtx.globalCompositeOperation = 'destination-in';
    bCtx.fillStyle = g;
    bCtx.fillRect(0, 0, 128, 512);

    const beamTex = new THREE.CanvasTexture(bCanvas);
    const beamMat = new THREE.MeshBasicMaterial({
        map: beamTex,
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const beam = new THREE.Mesh(beamGeo, beamMat);

    // Position at Midpoint
    const mid = new THREE.Vector3().addVectors(lensLocal, targetLocal).multiplyScalar(0.5);
    beam.position.copy(mid);

    const axis = new THREE.Vector3(0, 1, 0);
    const targetDir = vec.clone().negate().normalize();
    beam.quaternion.setFromUnitVectors(axis, targetDir);

    projGroup.add(beam);


    // Reels (Two big circles on top)
    const reelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
    const reel1 = new THREE.Mesh(reelGeo, chrome);
    reel1.rotation.z = Math.PI / 2;
    reel1.position.set(0, 0.75, 0.1);
    projGroup.add(reel1);

    const reel2 = new THREE.Mesh(reelGeo, chrome);
    reel2.rotation.z = Math.PI / 2;
    reel2.position.set(0, 0.75, -0.15);
    projGroup.add(reel2);

    // Place on the Middle Box
    // Middle box is at x=0, z=-2. Lid is at y=0.6 + 0.1 = 0.7.
    projGroup.position.set(0, 0.8, -2);
    // Scale it nicely
    projGroup.scale.set(1.5, 1.5, 1.5);

    interiorGroup.add(projGroup);
}
let tvVideo, tvVideoTexture;
let tvScreensaver, tvScreensaverTexture; // V-NEW: Screensaver vars
// Need global access to lights for dimming (Cinema Mode)
window.livingCozyLight = null;
window.livingLibrarySpot = null;
// masterVideoIndex is global (house.js)

// V-NEW: TV Screensaver
// V-NEW: Image Slideshow Screensaver (v222)
// V-ENHANCED: Fade Transitions
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
    const fadeDuration = 800; // 800ms fade transition
    let currentIndex = -1; // Start at -1 to force first draw
    let previousCanvas = null; // Store previous slide for crossfade

    // Preload Images
    const images = {};
    slides.forEach(slide => {
        if (slide.image) {
            const img = new Image();
            img.src = slide.image;
            images[slide.image] = img;
        }
    });

    // Helper to draw a slide to a canvas
    const drawSlide = (targetCtx, slide, targetWidth, targetHeight) => {
        // Draw Background
        targetCtx.fillStyle = slide.color || '#000000';
        targetCtx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw Image if available and loaded
        if (slide.image && images[slide.image]) {
            const img = images[slide.image];
            // Check if image is loaded successfully (not broken)
            if (img.complete && img.naturalWidth > 0) {
                // Scale to fit "contain"
                const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const x = (targetWidth - w) / 2;
                const y = (targetHeight - h) / 2;
                targetCtx.drawImage(img, x, y, w, h);
            }
        }

        // Draw Text
        if (slide.text) {
            targetCtx.fillStyle = '#ffffff';
            targetCtx.font = 'bold 40px "Courier Prime", monospace';
            targetCtx.textAlign = 'center';
            targetCtx.textBaseline = 'middle';
            // Add text shadow
            targetCtx.shadowColor = 'rgba(0,0,0,0.8)';
            targetCtx.shadowBlur = 4;
            targetCtx.shadowOffsetX = 2;
            targetCtx.shadowOffsetY = 2;
            targetCtx.fillText(slide.text, targetWidth / 2, targetHeight - 76); // Bottom center
            targetCtx.shadowColor = 'transparent';
        }
    };

    tex.userData = {
        update: (time) => {
            const nowMs = time * 1000;
            const index = Math.floor(nowMs / duration) % slides.length;
            const slideProgress = (nowMs % duration) / duration; // 0 to 1 within current slide
            const fadeProgress = Math.min(slideProgress * duration / fadeDuration, 1); // 0 to 1 during fade

            if (index !== currentIndex || currentIndex === -1) {
                // New slide - save previous canvas for crossfade
                if (currentIndex !== -1 && previousCanvas === null) {
                    previousCanvas = document.createElement('canvas');
                    previousCanvas.width = 1024;
                    previousCanvas.height = 576;
                    const prevCtx = previousCanvas.getContext('2d');
                    prevCtx.drawImage(canvas, 0, 0);
                }

                currentIndex = index;
            }

            const slide = slides[currentIndex];

            // Draw current slide to a temp canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 1024;
            tempCanvas.height = 576;
            const tempCtx = tempCanvas.getContext('2d');
            drawSlide(tempCtx, slide, 1024, 576);

            // Crossfade if we have a previous canvas and we're in fade period
            if (previousCanvas && fadeProgress < 1) {
                // Draw previous slide
                ctx.globalAlpha = 1 - fadeProgress;
                ctx.drawImage(previousCanvas, 0, 0);

                // Draw current slide on top with fade
                ctx.globalAlpha = fadeProgress;
                ctx.drawImage(tempCanvas, 0, 0);

                ctx.globalAlpha = 1; // Reset
            } else {
                // No fade, just draw current slide
                ctx.clearRect(0, 0, 1024, 576);
                ctx.drawImage(tempCanvas, 0, 0);

                // Clear previous canvas after fade completes
                if (fadeProgress >= 1) {
                    previousCanvas = null;
                }
            }

            tex.needsUpdate = true;
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
        tvVideo.src = '../assets/video/premonition.mp4';
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
            const dimLevel = 0.0; // PITCH BLACK for cinema mode

            try {
                // PAUSE continuous lighting override during cinema mode
                if (window.livingRoomLightingOverride) {
                    clearInterval(window.livingRoomLightingOverride);
                    console.log('Cinema mode: Paused continuous lighting override');
                }

                // Dim Room Lights to PITCH BLACK
                if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V294: Bloom TV Glow behind set
                if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 3.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

                // V-FIX: Dim global lights to near-black
                if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();
                if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.0 }, dimTime).easing(TWEEN.Easing.Quadratic.Out).start();

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

// V326: Reverted to original Dark Wood for Living Room consistency
const createWoodMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // V326: Original Darkened Base Color
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 512, 512);

    // Wood Grain Pattern
    ctx.fillStyle = 'rgba(60, 30, 10, 0.2)';
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + Math.random() * 20 - 10, 170, x + Math.random() * 20 - 10, 340, x + Math.random() * 20 - 10, 512);
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.strokeStyle = 'rgba(40, 20, 5, 0.25)';
        ctx.stroke();
    }

    // Noise
    for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.01)';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xaa9977,
        roughness: 0.8,
        metalness: 0.1
    });
    return mat;
};

// V327: Hall "Deep Green Textured" Material Generator
const createHallGreenMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep Green Base
    ctx.fillStyle = '#062c1a';
    ctx.fillRect(0, 0, 512, 512);

    // Texture: Organic/Slightly mottled
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 4 + 1;
        const alpha = Math.random() * 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(x, y, size, size);
    }

    // Subtle grit
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const alpha = Math.random() * 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;

    return new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
};

function createLivingRoomInterior() {
    // V-NEW: TV Idle Texture (Static Image)
    let tvIdleTexture = null;
    const tvIdleLoader = new THREE.TextureLoader();
    tvIdleLoader.load(
        '../assets/images/tv.jpg',
        (texture) => {
            tvIdleTexture = texture;
            console.log('TV idle texture loaded');
        },
        undefined,
        (err) => {
            console.warn('TV idle texture failed to load, using fallback', err);
        }
    );

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
    // V-BRIGHTER: Increased for better visibility (was 0.1, now 0.25)
    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.25, 15);
    window.livingCozyLight.position.set(0, 5, 0);
    window.livingCozyLight.castShadow = true;
    window.livingCozyLight.shadow.mapSize.width = 2048;
    window.livingCozyLight.shadow.mapSize.height = 2048;
    window.livingCozyLight.shadow.radius = 8; // Soft edges
    window.livingCozyLight.shadow.bias = -0.0005;
    interiorGroup.add(window.livingCozyLight);

    // V-BRIGHTER: Increased for better visibility (was 0.1, now 0.25)
    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.25);
    window.livingLibrarySpot.position.set(3, 7, 3);
    window.livingLibrarySpot.angle = Math.PI / 4;
    window.livingLibrarySpot.penumbra = 0.5;
    window.livingLibrarySpot.castShadow = true;
    window.livingLibrarySpot.shadow.mapSize.width = 2048;
    window.livingLibrarySpot.shadow.mapSize.height = 2048;
    window.livingLibrarySpot.shadow.radius = 8; // Soft edges
    window.livingLibrarySpot.shadow.bias = -0.0005;
    window.livingLibrarySpot.target.position.set(3, 2, -4.9);
    interiorGroup.add(window.livingLibrarySpot);
    interiorGroup.add(window.livingLibrarySpot.target);

    // V298: Moody Shelf lighting
    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    // V-BRIGHTER: Increased for better visibility (was 0.05, now 0.15)
    const bookcaseSpotL = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotL.position.set(-2, 6, -3.5);
    bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5);
    bookcaseSpotL.angle = Math.PI / 2.2;
    bookcaseSpotL.penumbra = 1.0;
    bookcaseSpotL.distance = 15;
    bookcaseSpotL.castShadow = true;
    bookcaseSpotL.shadow.mapSize.width = 2048;
    bookcaseSpotL.shadow.mapSize.height = 2048;
    bookcaseSpotL.shadow.radius = 8; // Soft edges
    bookcaseSpotL.shadow.bias = -0.0005;
    interiorGroup.add(bookcaseSpotL);
    interiorGroup.add(bookcaseSpotL.target);
    window.bookcaseSpotL = bookcaseSpotL;

    // V315-RELOADED-5: Brighter Spots (0.15 -> 0.3)
    // V-BRIGHTER: Increased for better visibility (was 0.05, now 0.15)
    const bookcaseSpotR = new THREE.SpotLight(0xfffaed, 0.15);
    bookcaseSpotR.position.set(-2, 6, 3.5);
    bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5);
    bookcaseSpotR.angle = Math.PI / 2.2;
    bookcaseSpotR.penumbra = 1.0;
    bookcaseSpotR.distance = 15;
    bookcaseSpotR.castShadow = true;
    bookcaseSpotR.shadow.mapSize.width = 2048;
    bookcaseSpotR.shadow.mapSize.height = 2048;
    bookcaseSpotR.shadow.radius = 8; // Soft edges
    bookcaseSpotR.shadow.bias = -0.0005;
    interiorGroup.add(bookcaseSpotR);
    interiorGroup.add(bookcaseSpotR.target);
    window.bookcaseSpotR = bookcaseSpotR;

    // V-DEBUG: Log light intensities to verify they're being set
    console.log('Living Room Lighting Applied:', {
        cozyLight: window.livingCozyLight.intensity,
        librarySpot: window.livingLibrarySpot.intensity,
        bookcaseL: bookcaseSpotL.intensity,
        bookcaseR: bookcaseSpotR.intensity
    });

    // V-FIX: CONTINUOUS override to fight V123 lighting system
    console.log('🔥🔥🔥 FILE VERSION: 2026-01-31 21:06 - BRIGHTER LIGHTS 0.15-0.25 🔥🔥🔥');
    let overrideCount = 0;
    const livingRoomLightingOverride = setInterval(() => {
        // Force global lights to brighter values for normal mode
        if (window.ambientLight) window.ambientLight.intensity = 0.15;
        if (window.dirLight) window.dirLight.intensity = 0.2;

        // Force room-specific lights to brighter values for normal mode
        if (window.livingCozyLight) window.livingCozyLight.intensity = 0.25;
        if (window.livingLibrarySpot) window.livingLibrarySpot.intensity = 0.25;
        if (window.bookcaseSpotL) window.bookcaseSpotL.intensity = 0.15;
        if (window.bookcaseSpotR) window.bookcaseSpotR.intensity = 0.15;

        overrideCount++;
        if (overrideCount === 1 || overrideCount % 20 === 0) {
            console.log(`Living room lighting enforced (count: ${overrideCount})`);
        }
    }, 100); // Run every 100ms

    // Store interval ID for potential cleanup
    window.livingRoomLightingOverride = livingRoomLightingOverride;

    // V201: Procedural Wood Texture Helper
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

    // V-WORDHUNT: Moved to Maria Interaction

    // V-NEW: Create Video Menu Panel
    if (roomContent['living'].videoPlaylist && roomContent['living'].videoPlaylist.length > 0) {
        createVideoPanel(roomContent['living'].videoPlaylist);
    }

    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    // V-FIX: Start with TV Idle Image
    tvMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({
        map: tvIdleTexture,
        color: 0xffffff
    }));
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

    createBook("Tonic for\nthe Bones", '#8b0000', -0.6, -1.4, 0.2, '../assets/images/tftb-cover.jpg');
    createBook("Phantom\nParents", '#1a237e', -0.4, -0.4, -0.1, '../assets/images/phantomparents-cover.jpg');
    createBook("Gifts", '#065f46', 0.5, -0.9, -0.3, '../assets/images/gifts-cover.jpg');

    const cardGeo = new THREE.BoxGeometry(0.6, 0.15, 0.9);
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 256; cardCanvas.height = 384;
    const cctx = cardCanvas.getContext('2d');
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 256, 384);
    cctx.fillStyle = '#000000'; cctx.font = 'bold 22px Arial, sans-serif'; cctx.textAlign = 'center';
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
    rug.receiveShadow = true; // V204: Receive Shadows (including Maria's shadow)
    interiorGroup.add(rug);

    // V138: Darker Couch (0x5d4037 -> 0x2e201b)
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    const couchGroup = new THREE.Group();

    // Helper function for rounded box
    const createRoundedBox = (width, height, depth, radius) => {
        const shape = new THREE.Shape();
        const x = -width / 2, y = -height / 2, w = width, h = height, r = radius;
        shape.moveTo(x, y + r);
        shape.lineTo(x, y + h - r);
        shape.quadraticCurveTo(x, y + h, x + r, y + h);
        shape.lineTo(x + w - r, y + h);
        shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
        shape.lineTo(x + w, y + r);
        shape.quadraticCurveTo(x + w, y, x + w - r, y);
        shape.lineTo(x + r, y);
        shape.quadraticCurveTo(x, y, x, y + r);
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    const s = new THREE.Mesh(createRoundedBox(3, 1.2, 0.4, 0.15), couchMat);
    s.rotation.set(Math.PI / 2, 0, 0);
    s.position.y = 0.5; s.receiveShadow = true; couchGroup.add(s);

    const b = new THREE.Mesh(createRoundedBox(3, 1.2, 0.3, 0.15), couchMat);
    b.rotation.set(Math.PI / 2, 0, 0);
    b.position.set(0, 1.0, 0.55); b.receiveShadow = true; couchGroup.add(b);

    const aL = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aL.rotation.set(Math.PI / 2, 0, 0);
    aL.position.set(-1.6, 0.7, 0); aL.receiveShadow = true; couchGroup.add(aL);

    const aR = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat);
    aR.rotation.set(Math.PI / 2, 0, 0);
    aR.position.set(1.6, 0.7, 0); aR.receiveShadow = true; couchGroup.add(aR);

    couchGroup.position.set(0, -0.3, 2.5);
    interiorGroup.add(couchGroup);

    const chairGroup = new THREE.Group();
    const cS = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.4, 0.15), couchMat);
    cS.rotation.set(Math.PI / 2, 0, 0);
    cS.position.y = 0.5; cS.receiveShadow = true; chairGroup.add(cS);

    const cB = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.3, 0.15), couchMat);
    cB.rotation.set(Math.PI / 2, 0, 0);
    cB.position.set(0, 1.0, 0.55); cB.receiveShadow = true; chairGroup.add(cB);

    const cAL = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAL.rotation.set(Math.PI / 2, 0, 0);
    cAL.position.set(-0.7, 0.7, 0); cAL.receiveShadow = true; chairGroup.add(cAL);

    const cAR = new THREE.Mesh(createRoundedBox(0.2, 1.3, 0.9, 0.1), couchMat);
    cAR.rotation.set(Math.PI / 2, 0, 0);
    cAR.position.set(0.7, 0.7, 0); cAR.receiveShadow = true; chairGroup.add(cAR);

    chairGroup.position.set(3.5, -0.3, -1.0);
    chairGroup.rotation.y = Math.PI / 2;
    interiorGroup.add(chairGroup);

    try {
        if (typeof createMetropolisRobot === 'function') {
            window.metropolisRobot = createMetropolisRobot();
            window.metropolisRobot.position.set(4.5, 0, -4.0);
            window.metropolisRobot.rotation.y = -0.5;
            window.metropolisRobot.scale.set(1.125, 1.125, 1.125);

            // V-SHADOW: Enable shadow casting for Maria
            window.metropolisRobot.castShadow = true;
            window.metropolisRobot.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            interiorGroup.add(window.metropolisRobot);

            const robotGlow = new THREE.PointLight(0x00ffff, 2.5, 12);
            robotGlow.position.set(0, 1.5, 0.5);
            window.metropolisRobot.add(robotGlow);
            window.robotGlowLight = robotGlow;

            // V-FIX: Explicit Hitbox for Maria (Easier Clicking)
            // V-FIX 19: Enable depthWrite: false to preventing occluding the Glow/Rings!
            // V-FIX 21: Invisible again (User verified)
            const hitGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 16);
            const hitMat = new THREE.MeshBasicMaterial({
                visible: true,
                color: 0xffff00,
                wireframe: false, // Hidden
                transparent: true,
                opacity: 0.0, // Hidden
                depthWrite: false // CRITICAL: Stop blocking the glow/rings behind it
            });
            const hitBox = new THREE.Mesh(hitGeo, hitMat);
            hitBox.position.y = 1.0;
            hitBox.userData = { type: 'MariaHitbox', parentRobot: true };
            window.metropolisRobot.add(hitBox);

            // V-WORDHUNT: Hidden Orb in Maria
            if (typeof WordHunt !== 'undefined') {
                const item = WordHunt.createInteractable('living');
                if (item) {
                    item.position.set(0, 1.5, 0);
                    item.scale.set(0.1, 0.1, 0.1);
                    item.visible = false;
                    window.metropolisRobot.add(item);

                    // Click Handler for Robot
                    // We need to ensure the robot mesh itself is clickable or we add a hitbox
                    window.metropolisRobot.userData.type = 'MariaRobot';
                    window.metropolisRobot.userData.onClick = () => {
                        if (item.userData.revealed) return;

                        console.log("Maria Clicked! Popping out orb...");
                        item.visible = true;
                        item.userData.revealed = true;

                        // Animate Pop Out
                        new TWEEN.Tween(item.position)
                            .to({ y: 3.0 }, 1500)
                            .easing(TWEEN.Easing.Elastic.Out)
                            .start();

                        new TWEEN.Tween(item.scale)
                            .to({ x: 1.0, y: 1.0, z: 1.0 }, 1500)
                            .easing(TWEEN.Easing.Elastic.Out)
                            .start();
                    };

                    // V-FIX: Double-Bind! Attach ONE handler to the Hitbox too
                    hitBox.userData.onClick = window.metropolisRobot.userData.onClick;

                    if (window.interiorClickables) {
                        window.interiorClickables.push(window.metropolisRobot);
                        // Push hitbox too just in case raycaster hits it first and stops?
                        // (intersectObjects true handles children, but pushing explicit is safer if hierarchy logic is strict)
                        // Actually, pushing the GROUP (robot) is usually enough.
                    }
                }
            }
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
function createAnnexInterior() {
    // --- LIGHTING ---
    // --- CANDLE MESH & LIGHT ---
    const candleGroup = new THREE.Group();
    // 1. Wax Body
    const waxGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2);
    const waxMat = new THREE.MeshStandardMaterial({ color: 0xfffff0, roughness: 0.3 });
    const wax = new THREE.Mesh(waxGeo, waxMat);
    wax.position.y = 0.1; // Base at 0
    candleGroup.add(wax);

    // 2. Wick
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    wick.position.y = 0.22;
    candleGroup.add(wick);

    // 3. Flame Visual
    const flameGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.25;
    candleGroup.add(flame);

    // 4. Light Source
    // V306: Darker (0.5 -> 0.3)
    const annexLight = new THREE.PointLight(0xffaa00, 0.3, 15); // Reduced range from 12 to 5 for intimacy
    annexLight.position.set(0, 0.35, 0); // Local to group
    annexLight.castShadow = true;
    // V-FIX: Soft/Blurry Shadows
    annexLight.shadow.radius = 4;
    annexLight.shadow.mapSize.width = 512;
    annexLight.shadow.mapSize.height = 512;
    // V-FIX: Shadow Bias to prevent self-shadowing artifacts (the "mysterious dark shadow")
    annexLight.shadow.bias = -0.001;
    annexLight.userData = {
        baseIntensity: 1.2,
        update: (t) => {
            const flicker = 1.2 + Math.sin(t * 15) * 0.15 + Math.cos(t * 33) * 0.15;
            annexLight.intensity = flicker;
            flame.scale.setScalar(0.8 + (flicker - 1.2) * 2); // Pulse visual flame too
        }
    };
    candleGroup.add(annexLight);

    // Position Group on Desk
    // Desk Top Surface: y=1.0 + 0.075 = 1.075
    candleGroup.position.set(1.0, 1.075, -1.0);
    interiorGroup.add(candleGroup);

    // Helper to run updates
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
    animator.castShadow = false; // V-FIX: Ensure hidden helper doesn't cast shadow
    animator.userData = { update: (t) => { annexLight.userData.update(t); } };
    interiorGroup.add(animator);

    // --- CONTENT ---

    // 1. Narrow Rounded Bed (Left Wall)
    const bedWidth = 1.8, bedDepth = 3.8, radius = 0.2;
    const shape = new THREE.Shape();
    shape.moveTo(-bedWidth / 2 + radius, -bedDepth / 2);
    shape.lineTo(bedWidth / 2 - radius, -bedDepth / 2);
    shape.absarc(bedWidth / 2 - radius, -bedDepth / 2 + radius, radius, -Math.PI / 2, 0, false);
    shape.lineTo(bedWidth / 2, bedDepth / 2 - radius);
    shape.absarc(bedWidth / 2 - radius, bedDepth / 2 - radius, radius, 0, Math.PI / 2, false);
    shape.lineTo(-bedWidth / 2 + radius, bedDepth / 2);
    shape.absarc(-bedWidth / 2 + radius, bedDepth / 2 - radius, radius, Math.PI / 2, Math.PI, false);
    shape.lineTo(-bedWidth / 2, -bedDepth / 2 + radius);
    shape.absarc(-bedWidth / 2 + radius, -bedDepth / 2 + radius, radius, Math.PI, Math.PI * 1.5, false);

    const bedGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false });
    bedGeo.rotateX(Math.PI / 2);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1.0 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    // V-FIX: Move away from wall (-1.0 -> -0.9) to fix shadow artifact
    bed.position.set(-0.9, 0.4, 0);
    bed.castShadow = true; bed.receiveShadow = true;
    interiorGroup.add(bed);

    // Rounded Rectangle Pillow
    const pW = 1.4, pD = 0.7, pR = 0.2;
    const pShape = new THREE.Shape();
    pShape.moveTo(-pW / 2 + pR, -pD / 2);
    pShape.lineTo(pW / 2 - pR, -pD / 2);
    pShape.absarc(pW / 2 - pR, -pD / 2 + pR, pR, -Math.PI / 2, 0, false);
    pShape.lineTo(pW / 2, pD / 2 - pR);
    pShape.absarc(pW / 2 - pR, pD / 2 - pR, pR, 0, Math.PI / 2, false);
    pShape.lineTo(-pW / 2 + pR, pD / 2);
    pShape.absarc(-pW / 2 + pR, pD / 2 - pR, pR, Math.PI / 2, Math.PI, false);
    pShape.lineTo(-pW / 2, -pD / 2 + pR);
    pShape.absarc(-pW / 2 + pR, -pD / 2 + pR, pR, Math.PI, Math.PI * 1.5, false);

    const pillowGeo = new THREE.ExtrudeGeometry(pShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
    pillowGeo.rotateX(Math.PI / 2);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0x555555 }));
    // V-FIX: Move together with bed (-0.9)
    pillow.position.set(-0.9, 0.45, 1.4);
    pillow.castShadow = true; pillow.receiveShadow = true;
    interiorGroup.add(pillow);

    // Blanket (Thin & Flush)
    // V-FIX: Reduced width (1.82 -> 1.75) to prevent clipping into wall
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 }));
    // V-FIX: Move with bed (-0.9)
    blanket.position.set(-0.9, 0.41, -0.1);
    interiorGroup.add(blanket);

    // V-FIX: Chair closer to desk (-0.8) and scaled (0.75)
    const chair = createAnnexChair();
    chair.position.set(0.5, 0, -0.8);
    chair.rotation.y = -0.3;
    interiorGroup.add(chair);

    // 2. Wall mounted Bookshelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const darkBooks = [0x1a1510, 0x2b1d14, 0x0a0a0a, 0x3e2723, 0x1b2612];

    function createWallShelf(x, y, z, rotY = 0) {
        const shelfGroup = new THREE.Group();
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.6), shelfMat);
        plank.castShadow = true; plank.receiveShadow = true;
        shelfGroup.add(plank);
        for (let i = 0; i < 10; i++) {
            const bH = 0.4 + Math.random() * 0.2, bW = 0.15 + Math.random() * 0.1;
            const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.4), new THREE.MeshStandardMaterial({ color: darkBooks[Math.floor(Math.random() * darkBooks.length)] }));
            book.position.set(-1.0 + (i * 0.22), 0.05 + bH / 2, 0);
            book.castShadow = true; book.receiveShadow = true;
            shelfGroup.add(book);
        }
        shelfGroup.position.set(x, y, z); shelfGroup.rotation.y = rotY;
        interiorGroup.add(shelfGroup);
    }
    // V311: Moved from -1.95 to -1.7 to prevent wall piercing
    createWallShelf(-1.7, 2.0, 0, Math.PI / 2);
    createWallShelf(-1.7, 2.8, 0, Math.PI / 2);

    // 3. Narrow Suitcase
    const suitcase = createSuitcase();
    suitcase.scale.set(1.0, 1.0, 1.4);
    // V-FIX: On the Floor (y=0.0) - Was y=0.2 (floating)
    suitcase.position.set(1.4, 0.0, 1.6);
    suitcase.rotation.y = 0.4;
    interiorGroup.add(suitcase);

    // 4. Desk
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 }); // Re-using woodMat from chair for consistency
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), woodMat);
    deskTop.position.y = 1.0;
    deskTop.castShadow = true; deskTop.receiveShadow = true;
    deskGroup.add(deskTop);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
    // V173: Removed left legs (mounted to wall)
    const legBR = new THREE.Mesh(legGeo, woodMat); legBR.position.set(1.4, 0.5, -0.45);
    legBR.castShadow = true; legBR.receiveShadow = true;
    const legFR = new THREE.Mesh(legGeo, woodMat); legFR.position.set(1.4, 0.5, 0.45);
    legFR.castShadow = true; legFR.receiveShadow = true;
    deskGroup.add(legBR, legFR);
    // V173: Mounted to Left Wall (X=-2), so group shifts by -0.4 (Center at -0.4, Width 3.2)
    deskGroup.position.set(-0.4, 0, -1.3);

    // V171: Populate desk with items
    addDeskItems(deskGroup);

    // V173: Diary Hologram in 3D Space
    createDiaryHologram(deskGroup);

    interiorGroup.add(deskGroup);

    // V-NEW: Moving Rothko Painting (High up on Wall)
    createRothkoPainting();

    // V-WORDHUNT: Add Word Hunt Orb - "Remember"
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('annex');
        if (item) {
            item.position.set(0, 1.5, 0); // Near Chair
            interiorGroup.add(item);
        }
    }
}

function createAnnexChair() {
    const chair = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), woodMat);
    seat.position.y = 0.5; seat.castShadow = true; seat.receiveShadow = true; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), woodMat);
    back.position.set(0, 0.9, 0.25); back.castShadow = true; back.receiveShadow = true; chair.add(back);
    for (let x of [-0.25, 0.25]) {
        for (let z of [-0.25, 0.25]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), woodMat);
            leg.position.set(x, 0.25, z); leg.castShadow = true; leg.receiveShadow = true; chair.add(leg);
        }
    }
    chair.scale.setScalar(1.1); return chair;
}

function createSuitcase() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });

    // 1. Bottom Part (Half Height)
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    bottom.castShadow = true; bottom.receiveShadow = true;
    bottom.position.y = 0.1; // 0 to 0.2
    group.add(bottom);

    // 2. Lid Group (Pivots at back Z edge)
    const lidGroup = new THREE.Group();
    // Pivot Point: Top of bottom part (y=0.2), Back edge (z=-0.25)
    lidGroup.position.set(0, 0.2, -0.25);

    // Lid Mesh (Offset so pivot is at corner)
    // Lid is 0.2 high. Center should be at z=0.25 relative to pivot?
    // Geometry center is 0. 
    // We want the mesh to sit from Z=0 to Z=0.5 relative to pivot Group?
    // Let's align it.
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    lidMesh.position.set(0, 0.1, 0.25); // Move up 0.1 and forward 0.25
    lidMesh.castShadow = true; lidMesh.receiveShadow = true;
    lidGroup.add(lidMesh);

    // Straps (Attached to Lid and Bottom)
    // Simplified: Just put straps on Lid for visual continuity when opening?
    // Or split straps. Let's put visual straps on Lid.
    const strapGeo = new THREE.BoxGeometry(0.05, 0.22, 0.52);
    const s1 = new THREE.Mesh(strapGeo, new THREE.MeshStandardMaterial({ color: 0x2b1d14 }));
    s1.position.set(-0.25, 0.1, 0.25);
    lidGroup.add(s1);
    const s2 = s1.clone();
    s2.position.set(0.25, 0.1, 0.25);
    lidGroup.add(s2);

    // Handle (On Lid)
    // V-FIX: Full Torus (Math.PI -> Math.PI * 2) to look complete
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI * 2), metalMat);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.x = -Math.PI / 2; // Flat on top
    handle.position.set(0, 0.2, 0.25); // On top of lid
    lidGroup.add(handle);

    group.add(lidGroup);

    // V-WORDHUNT Integration (Directly here to couple with Suitcase logic)
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('annex');
        if (item) {
            // Hide "Inside" (Sitting on bottom)
            item.position.set(0, 0.3, 0);
            item.scale.set(0.1, 0.1, 0.1);
            item.visible = false;
            group.add(item); // Add to Suitcase Group

            // Click Handler
            const openSuitcase = () => {
                if (!lidGroup.userData.isOpen) {
                    console.log("Suitcase Clicked - OPENING");
                    lidGroup.userData.isOpen = true;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: -Math.PI / 2.5 }, 1200).easing(TWEEN.Easing.Quadratic.Out).start();
                    item.visible = true; item.userData.revealed = true;
                    new TWEEN.Tween(item.position).to({ y: 1.5 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                    new TWEEN.Tween(item.scale).to({ x: 1.0, y: 1.0, z: 1.0 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                } else {
                    console.log("Suitcase Clicked - SHUTTING");
                    lidGroup.userData.isOpen = false;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: 0 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    new TWEEN.Tween(item.position).to({ y: 0.3 }, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(() => { if (!lidGroup.userData.isOpen) item.visible = false; }).start();
                    new TWEEN.Tween(item.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                }
            };

            // Hitbox for clicking
            const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
            hitBox.position.y = 0.3;
            hitBox.castShadow = false; // V-FIX: No shadow for hitbox
            hitBox.userData = { onClick: openSuitcase, type: 'suitcase' };
            group.add(hitBox);

            if (window.interiorClickables) interiorClickables.push(hitBox);
        }
    }

    return group;
}
function addDeskItems(deskGroup) {
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffffc, roughness: 0.8 });

    // 1. Scattered Papers
    for (let i = 0; i < 5; i++) {
        const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), paperMat); // A4 ratio
        paper.rotation.x = -Math.PI / 2;
        paper.position.set((Math.random() - 0.5) * 2.5, 1.08 + i * 0.001, (Math.random() - 0.5) * 0.8);
        paper.rotation.z = Math.random() * Math.PI;
        deskGroup.add(paper);
    }

    // 2. Newspapers
    const newsCanvas = document.createElement('canvas');
    newsCanvas.width = 256; newsCanvas.height = 256;
    const nctx = newsCanvas.getContext('2d');
    nctx.fillStyle = '#cccccc'; nctx.fillRect(0, 0, 256, 256);
    nctx.fillStyle = '#333333'; nctx.font = 'bold 20px serif';
    nctx.fillText("DAILY GAZETTE", 40, 50);
    nctx.fillRect(40, 60, 180, 2);
    for (let i = 0; i < 10; i++) nctx.fillRect(40, 80 + i * 15, 180, 8);
    const newsTex = new THREE.CanvasTexture(newsCanvas);
    const newsMat = new THREE.MeshStandardMaterial({ map: newsTex });

    const news = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), newsMat);
    news.rotation.x = -Math.PI / 2;
    news.position.set(1.2, 1.085, 0.2);
    news.rotation.z = 0.4;
    deskGroup.add(news);

    // 3. Books
    const bookColors = [0x451a03, 0x1a2e05, 0x051a45, 0x222222];
    for (let i = 0; i < 3; i++) {
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.45), new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] }));
        book.position.set(-1.1, 1.1 + i * 0.06, -0.2);
        book.rotation.y = 0.1 * i;
        deskGroup.add(book);
    }

    // 4. THE DIARY (Open)
    const diaryGroup = new THREE.Group();
    const pageGeo = new THREE.PlaneGeometry(0.25, 0.35);
    const leftPage = new THREE.Mesh(pageGeo, paperMat);
    leftPage.position.x = -0.125;
    leftPage.rotation.y = 0.15;

    const rightPage = new THREE.Mesh(pageGeo, paperMat);
    rightPage.position.x = 0.125;
    rightPage.rotation.y = -0.15;

    diaryGroup.add(leftPage, rightPage);
    diaryGroup.rotation.x = -Math.PI / 2;
    diaryGroup.position.set(0, 1.1, 0.1);
    diaryGroup.userData = { type: 'diary' };

    deskGroup.add(diaryGroup);
    interiorClickables.push(diaryGroup);
}

function createDiaryHologram(parent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background (Even Blurrier / More Diffuse Cyan)
    const grad = ctx.createRadialGradient(256, 512, 0, 256, 512, 512);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)'); // Reduced center opacity
    grad.addColorStop(0.3, 'rgba(0, 255, 255, 0.2)');
    grad.addColorStop(0.6, 'rgba(0, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 1024);

    // 2. White Courier Font Letters with Cyan Glow
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.font = '900 42px Arial, sans-serif'; // V326 Unification
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = [
        '"You should',
        'always be',
        'prepared to',
        'pack your',
        'bags and',
        'move west..."'
    ];

    const startY = 320;
    const spacing = 70;
    lines.forEach((line, i) => {
        ctx.fillText(line, 256, startY + i * spacing);
    });

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending // Switch to Additive for glowing white text pop
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), mat);
    // V178: Adjusted Pivot Logic - Move Geometry so Pivot is at Bottom (Y=0)
    mesh.geometry.translate(0, 2, 0); // Translation Y=2 for a height 4 plane puts pivot at 0

    // Position at desk surface (approx 1.0)
    mesh.position.set(0, 1.1, 0.2);
    mesh.scale.set(0, 0, 0); // Start Shrunk
    mesh.renderOrder = 9999;
    mesh.visible = false;

    parent.add(mesh);
    window.diaryHologram = mesh;
}



function createRothkoPainting() {
    // 5x9 Portrait Ratio
    // Placed on Back Wall (-0.4, 3.5, -1.95) based on previous fix
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 921;
    const ctx = canvas.getContext('2d');

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    // Use MeshStandard to react to environment but keep colors vivid
    const mat = new THREE.MeshStandardMaterial({
        map: tex,
        side: THREE.DoubleSide,
        roughness: 0.9,
        emissive: 0x111111, // Slight self-illumination for visibility
        emissiveIntensity: 0.2
    });

    const geo = new THREE.PlaneGeometry(1.5, 2.7);
    // V304: Darker Annex (0.6 -> 0.3)
    const light = new THREE.PointLight(0xffeecc, 0.3, 10);
    light.position.set(2, 4, 2);
    light.castShadow = true;
    interiorGroup.add(light);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-0.4, 3.5, -1.95);
    mesh.rotation.y = 0;
    interiorGroup.add(mesh);

    // Frame
    const frameGeo = new THREE.BoxGeometry(1.6, 2.8, 0.05);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(-0.4, 3.5, -2.0);
    frame.rotation.y = 0;
    frame.castShadow = true; frame.receiveShadow = true;
    interiorGroup.add(frame);

    // --- ROTHKO LOGIC ---
    const palettes = [
        ['#8B0000', '#FF4500', '#FFD700'],
        ['#4B0082', '#8B008B', '#FF1493'],
        ['#DC143C', '#FF6347', '#FFA07A'],
        ['#2F4F4F', '#1C1C1C', '#8B4513'],
        ['#191970', '#000080', '#4B0082'],
        ['#CD853F', '#D2691E', '#8B4513'],
        ['#FF4500', '#FFD700', '#FF8C00'],
        ['#00CED1', '#4682B4', '#1E90FF'],
        ['#BC8F8F', '#CD5C5C', '#F08080'],
    ];

    let blocks = [];
    let bgState = { h: 200, s: 30, l: 20 };
    let bgTarget = { h: 200, s: 30, l: 20 };
    let lastPaletteChange = 0;

    function hexToHSL(hex) {
        let r = parseInt(hex.substr(1, 2), 16) / 255;
        let g = parseInt(hex.substr(3, 2), 16) / 255;
        let b = parseInt(hex.substr(5, 2), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // Initialize Blocks (Persistent Objects)
    // We stick to 3 blocks for stability.
    // To switch between 2 and 3, we animate the weight of one block to 0.
    for (let i = 0; i < 3; i++) {
        blocks.push({
            h: 0, s: 70, l: 50,
            targetH: 0, targetS: 70, targetL: 50,
            weight: 1.0,
            targetWeight: 1.0,
            speed: Math.random() * 0.2 + 0.1
        });
    }

    function pickNewTargetPalette() {
        const palette = palettes[Math.floor(Math.random() * palettes.length)];
        const hsls = palette.map(hexToHSL);

        // Background target (Average)
        const avgH = hsls.reduce((a, c) => a + c.h, 0) / hsls.length;
        bgTarget.h = avgH;
        bgTarget.s = 30;
        bgTarget.l = 18;

        // Decide Mode: 2 Fields or 3 Fields?
        const mode2 = Math.random() > 0.5;
        let hideIndex = -1;
        if (mode2) {
            // Pick one random block to hide (0, 1, or 2)
            hideIndex = Math.floor(Math.random() * 3);
        }

        // Block targets
        blocks.forEach((b, i) => {
            const c = hsls[i % hsls.length];
            b.targetH = c.h;
            b.targetS = c.s;
            b.targetL = c.l;

            // Weight Logic
            if (i === hideIndex) {
                b.targetWeight = 0.0; // Shrink to nothing
            } else {
                // Randomize size slightly
                b.targetWeight = 1.0 + Math.random() * 0.5;
            }
        });
    }

    pickNewTargetPalette();
    // Initialize current to target immediately for start
    bgState = { ...bgTarget };
    blocks.forEach(b => {
        b.h = b.targetH; b.s = b.targetS; b.l = b.targetL;
        b.weight = b.targetWeight;
    });

    // Lerp Helper handles hue wrapping
    function lerpAngle(a, b, t) {
        let diff = b - a;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return a + diff * t;
    }
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    mesh.userData.update = (t) => {
        // Slowly change targets every 15s
        if (t - lastPaletteChange > 15) {
            pickNewTargetPalette();
            lastPaletteChange = t;
        }

        const dt = 0.005; // Transition speed factor

        // 1. Animate BG Color
        bgState.h = lerpAngle(bgState.h, bgTarget.h, dt);
        bgState.s = lerp(bgState.s, bgTarget.s, dt);
        bgState.l = lerp(bgState.l, bgTarget.l, dt);

        // 2. Clear & Draw BG
        ctx.fillStyle = `hsl(${bgState.h}, ${bgState.s}%, ${bgState.l}%)`;
        ctx.fillRect(0, 0, 512, 921);

        // 3. Draw Blocks
        const W = 512;
        const H = 921;
        const padX = 40;
        const padY = 50; // Top/Bottom padding
        const maxGap = 40; // Max gap between blocks

        // V-REFINE: "Tiny bit less blurry" -> 30px (was 45)
        ctx.filter = 'blur(30px)';

        // Lerp weights and Calculate Total Layout
        let totalWeight = 0;
        let activeGapCount = 0;

        blocks.forEach(b => {
            b.weight = lerp(b.weight, b.targetWeight, dt);

            // Colors
            b.h = lerpAngle(b.h, b.targetH, dt);
            b.s = lerp(b.s, b.targetS, dt);
            b.l = lerp(b.l, b.targetL, dt);

            totalWeight += b.weight;
        });

        // Dynamic Gap Calculation
        // Gap contributes to layout only if adjacent blocks exist. 
        // We simulate gap "weight" based on block presence.
        // Simple approx: Gap height = maxGap * (weight of block above?)
        // Let's just sum (gap * smoothed_presence)
        // Actually, simpler: 
        // We have 2 internal gaps for 3 blocks.
        // If mid block is gone, we have 1 big gap or 2 gaps merged?
        // Layout: gap belongs to the block visually above it (index 0, 1). Last block (2) has no gap below.

        let totalGapUsage = 0;
        const gapSizes = [];

        for (let i = 0; i < blocks.length - 1; i++) {
            // Gap exists if BOTH current and next block have weight?
            // Or if we just treat gap as attached to the block.
            // If block 0 shrinks, gap 0 should shrink too to avoid big empty space at top?
            // Yes: gap size = maxGap * Math.min(b[i].weight, 1.0) * Math.min(b[i+1].weight, 1.0)?
            // If adjacent blocks are both visible, gap is full. If one fades, gap fades.

            const w1 = Math.min(blocks[i].weight, 1.0);
            const w2 = Math.min(blocks[i + 1].weight, 1.0);
            const g = maxGap * w1 * w2;
            gapSizes.push(g);
            totalGapUsage += g;
        }

        const availH = H - (padY * 2) - totalGapUsage;

        let cursorY = padY;

        blocks.forEach((b, i) => {
            if (b.weight < 0.01) return; // Skip invisible

            const h = (b.weight / totalWeight) * availH;

            ctx.fillStyle = `hsl(${b.h}, ${b.s}%, ${b.l}%)`;
            ctx.fillRect(padX, cursorY, W - (padX * 2), h);

            cursorY += h;

            // Add gap if not last
            if (i < blocks.length - 1) {
                cursorY += gapSizes[i];
            }
        });

        ctx.filter = 'none';
        tex.needsUpdate = true;
    };
}

window.createAnnexInterior = createAnnexInterior;
function createToiletInterior() {
    console.log("Loading Toilet Interior v24 (V4 Feedback) - Cozy Lamp & Perfect Seat");

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    // V140: Darker Ceramic (0xeeeeff -> 0x8888aa)
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0x8888aa, roughness: 0.2 });
    const toiletGroup = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 32), ceramicMat);
    bowl.position.y = 0.3; bowl.castShadow = true; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat);
    tank.position.set(0, 0.85, -0.3); tank.castShadow = true; toiletGroup.add(tank);

    // Water in Bowl
    const waterGeo = new THREE.CircleGeometry(0.3, 32);
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.4;
    toiletGroup.add(water);

    // Black Toilet Seat - LARGER TO COVER RIM
    // V140: Darker Seat (0x111111 -> 0x050505)
    // Bowl top radius is 0.5.
    // Seat should match.
    // TorusGeometry(radius, tube, radial, tubular)
    // radius = 0.5, tube = 0.1
    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.1 });
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 24, 64), blackWoodMat);
    seat.rotation.x = -Math.PI / 2;
    // seat.rotation.z = Math.PI; 
    seat.position.y = 0.6; // Sit nicely on rim
    // seat.scale.set(1, 1.2, 1); // Oval? Bowl is cylinder (circle).
    seat.castShadow = true;
    toiletGroup.add(seat);

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    // V140: Darker Shelf (0x5D4037 -> 0x2e201b)
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    // Narrow Shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), woodMat);
    shelf.position.set(0, 3.2, shelfZ);
    shelf.castShadow = true;
    interiorGroup.add(shelf);

    // Enlarged Notepad with BOLDER CENTERED TEXT
    const padGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const notepad = new THREE.Mesh(padGeo, padMat);
    notepad.position.set(0.3, 0.045, 0.05);
    notepad.castShadow = true;

    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = 512; lineCanvas.height = 512; // Higher res for clear text
    const lctx = lineCanvas.getContext('2d');
    lctx.fillStyle = '#ffeb3b'; lctx.fillRect(0, 0, 512, 512);
    // Lines
    lctx.fillStyle = '#ccc'; for (let i = 60; i < 512; i += 60) lctx.fillRect(0, i, 512, 2);
    // TEXT: "NOTEPAD" - BOLD & CENTERED
    lctx.fillStyle = '#000000';
    lctx.font = '900 80px "Glass Antiqua", cursive'; // V326 Unification
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';

    // Visualize center of pad. 
    // Texture maps to Top face. Width=X, Height=Z.
    // Text should be centered.
    lctx.fillText("NOTEPAD", 256, 256);

    notepad.material.map = new THREE.CanvasTexture(lineCanvas);
    notepad.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(notepad);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(notepad);

    // HOLOGRAM "WRITE IDEAS"
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512; holoCanvas.height = 512;
    const hctx = holoCanvas.getContext('2d');

    // Glow
    const g = hctx.createRadialGradient(256, 256, 80, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    hctx.fillStyle = g; hctx.fillRect(0, 0, 512, 512);

    // Text "WRITE IDEAS"
    hctx.fillStyle = '#ccffff';
    hctx.shadowColor = "#00ffff"; hctx.shadowBlur = 10;
    hctx.font = 'bold 60px "Glass Antiqua", cursive'; hctx.textAlign = "center";
    hctx.fillText("WRITE", 256, 220);
    hctx.fillText("IDEAS", 256, 290);

    const holoTex = new THREE.CanvasTexture(holoCanvas);
    const holoMat = new THREE.MeshBasicMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const holoMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), holoMat);
    holoMesh.position.set(0.3, 1.2, 0.05); // Above notepad
    holoMesh.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(holoMesh);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(holoMesh);

    // VISIBLE LAMP FIXTURE & COZY LIGHT
    const lampGroup = new THREE.Group();
    // Moved UP: Y=2.0 -> 3.5 (relative to shelf) ?? Wait, shelf is at 3.2. 
    // Previous lamp was at shelf.add(lampGroup) at pos (0, 2.0, -0.2).
    // So absolute Y was 3.2 + 2.0 = 5.2. That is quite high.
    // Maybe user meant visible mesh was too low?
    // Let's ensure it's high on the wall.
    // Let's set it to y=2.5 relative to shelf -> Absolute 5.7.
    lampGroup.position.set(0, 2.8, -0.2);
    shelf.add(lampGroup);

    // Fixture
    const fixtureGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x336699, metalness: 0.8, roughness: 0.2 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.rotation.x = Math.PI / 2;
    lampGroup.add(fixture);

    // Bulb/Glass (Warm Yellow)
    const bulbGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.z = 0.1;
    lampGroup.add(bulb);

    // COZY WARM LIGHT (Brighter)
    // V140: Dimmed (0.6 -> 0.3) -> V-FIX: Darker (0.15)
    const backLight = new THREE.PointLight(0xffaa33, 0.15, 15);
    backLight.castShadow = true;
    backLight.shadow.mapSize.width = 1024; // V-REFINE: Sharp Shadows
    backLight.shadow.mapSize.height = 1024;
    backLight.shadow.bias = -0.0001;
    lampGroup.add(backLight);

    // V: FLICKER ANIMATION (Stronger)
    lampGroup.userData = {
        baseIntensity: 0.15, // V-FIX: Match new base
        update: function (t) {
            // Frequent Flicker (15% chance)
            if (Math.random() > 0.85) {
                // Stronger flicker range
                const flicker = (Math.random() - 0.5) * 0.4;
                backLight.intensity = Math.max(0.1, this.baseIntensity + flicker);

                // Visible Bulb Dimming
                // 0.1 Hue = Orange/Yellow. 0.5 * dim controls lightness.
                const dim = 1 + flicker * 2;
                bulb.material.color.setHSL(0.08, 0.9, 0.5 * dim);
            } else {
                // Restore stability
                backLight.intensity += (this.baseIntensity - backLight.intensity) * 0.2;
                bulb.material.color.setHex(0xffaa33);
            }
        }
    };

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('toilet');
        if (item) {
            item.position.set(0, 1.5, 1); // Floating inside room, away from shelf
            interiorGroup.add(item);
        }
    }

    // Bathroom code removed.
}
function createBedroomInterior() {
    // BED (Rounded Corners)
    const bedGroup = new THREE.Group();

    // -- VIDEO PLAYLIST PANEL --
    // V-FIX 257: Removed redundant manual button (Universal UI handles it)

    // -- DARK FLOOR
    const darkFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
    darkFloor.rotation.x = -Math.PI / 2; darkFloor.position.y = 0.01;
    interiorGroup.add(darkFloor);

    // V142: Dark Grey Mattress (0xaaaaaa -> 0x555555)
    const mattressColor = 0x555555;
    const matMat = new THREE.MeshStandardMaterial({ color: mattressColor });
    const cornerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);

    // 4 Corners
    const c1 = new THREE.Mesh(cornerGeo, matMat); c1.position.set(2.0, 0.5, 2.5); bedGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, matMat); c2.position.set(-2.0, 0.5, 2.5); bedGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, matMat); c3.position.set(2.0, 0.5, -2.5); bedGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, matMat); c4.position.set(-2.0, 0.5, -2.5); bedGroup.add(c4);

    // Fillers (Cross Shape)
    // V142: Black/Brown Frame (0x251b14 -> 0x150b04)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 5.8), new THREE.MeshStandardMaterial({ color: 0x150b04 }));
    frame.position.y = 0.2; bedGroup.add(frame);
    const mainMattress = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.6, 6.0), matMat); mainMattress.position.y = 0.5; bedGroup.add(mainMattress);
    const crossMattress = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 5.0), matMat); crossMattress.position.y = 0.5; bedGroup.add(crossMattress);

    // V142: Dark Maroon Duvet (0x7a1f2f -> 0x3d0f17)
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 4.5), new THREE.MeshStandardMaterial({ color: 0x3d0f17 }));
    duvet.position.set(0, 0.8, -0.5); bedGroup.add(duvet);
    // PILLOW (Rounded - Horizontal Cylinder)
    const pillowGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0x666666 })); // V142: Dark Grey
    pillow.rotation.z = Math.PI / 2; // Lie horizontal
    pillow.scale.set(0.6, 1, 1); // Flatten height (local X)
    pillow.position.set(0, 0.85, 2.2);
    bedGroup.add(pillow);

    bedGroup.position.set(2.5, 0, -1);
    interiorGroup.add(bedGroup);

    // DESK (Without Phone)
    // V142: Darkest Wood Desk (0x2e201b -> 0x1e100b)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x1e100b }));
    desk.position.set(-2.5, 0.6, -3); interiorGroup.add(desk);

    // V135: Lamp on Table (Corner) - Bigger & Brighter
    const lampGroup = new THREE.Group();
    // Base
    lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x111111 })));
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    pole.position.y = 0.4; lampGroup.add(pole);
    // Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xcc8800, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    shade.position.y = 0.7; lampGroup.add(shade);
    // Light - Dimmer (Night Bed Lamp) - Darker
    // V142: Reduced Intensity (0.8 -> 0.4) -> V-NEW (0.15) -> V257 (1.2) -> V261 (2.5)
    const bulb = new THREE.PointLight(0xffaa00, 2.5, 8);
    bulb.position.y = 0.6;
    lampGroup.add(bulb);

    // Position on Desk (Left Back Corner)
    // Scale Up 2x
    lampGroup.scale.set(2, 2, 2);
    lampGroup.position.set(-3.8, 1.2, -3.5);
    interiorGroup.add(lampGroup);

    // WALL MOUNTED VIDEO PLAYER (BIGGER, BACK WALL)
    const phone = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
    phone.position.set(3.2, 4.5, -4.95); // V501: Extreme right for NO overlap
    phone.userData = { type: 'videoPhone', state: 'stopped' };
    interiorGroup.add(phone);
    interiorClickables.push(phone);

    videoTexture = new THREE.VideoTexture(videoElement);
    // Force src to Bedroom Playlist (Fixes "wrong video" if coming from other room)
    if (roomContent.bedroom.videoPlaylist && roomContent.bedroom.videoPlaylist.length > 0) {
        videoElement.src = roomContent.bedroom.videoPlaylist[0].src;
        videoElement.pause(); // Start Paused
    }

    const phoneScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.6), new THREE.MeshBasicMaterial({ map: videoTexture }));
    phoneScreenMesh.position.set(0, 0, 0.06);
    phoneScreenMesh.name = 'screen';
    phone.add(phoneScreenMesh);

    if (roomContent.bedroom.videoPlaylist) {
        // V-FIX: Universal Video UI
        if (window.createUniversalVideoInterface) {
            // Position adjusted to match previous header height (y=6.0 approx)
            // V-FIX: Moved Right (-2.8 -> -1.5) per User Request
            // V306: Move screen "more to the right" (User Request)
            // Was -2.8 -> Moved to -1.5 (Closer to center/desk)
            // V501: Extreme left for NO overlap with screen
            const videoPos = new THREE.Vector3(-1.8, 4.2, -4.8);
            window.createUniversalVideoInterface(interiorGroup, videoPos, roomContent.bedroom.videoPlaylist, {
                onPlay: playVideo // V-FIX 257: Pass correct handler
            });
        }
    }

    const shelfGeo = new THREE.BoxGeometry(0.8, 0.1, 1.2);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(-4.6, 3.5, 3.0);
    interiorGroup.add(shelf);

    // V-FIX 264: Drop Shadow for Shelf
    const shadowGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-4.6, 3.45, 3.0); // Slightly below
    interiorGroup.add(shadow);

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bedroom');
        if (item) {
            item.position.set(0, 3, 0); // Above bed/center
            interiorGroup.add(item);
        }
    }

    // Lava Lamp
    createLavaLamp(0.108, shelf.position);
}

function createLavaLamp(scale = 1.0, anchorPos = new THREE.Vector3(0, 0, 0)) {
    const lampGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x080808,
        metalness: 1.0,
        roughness: 0.05
    });

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 2.2, 4.2, 32);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -4.5;
    lampGroup.add(base);

    // Cap
    const topGeo = new THREE.CylinderGeometry(0.6, 1.2, 2, 32);
    const topCap = new THREE.Mesh(topGeo, metalMat);
    topCap.position.y = 7.0;
    lampGroup.add(topCap);

    // Glass
    const glassGeo = new THREE.CylinderGeometry(1.1, 1.5, 10, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.0,
        transmission: 0.96,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        ior: 1.5,
        reflectivity: 1.0,
        clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 1.0;
    lampGroup.add(glass);

    // Liquid Core
    const coreGeo = new THREE.CylinderGeometry(0.98, 1.38, 9.8, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        transparent: true,
        opacity: 0.5,
        emissive: 0xff2200,
        // V142: Duller Glow (1.6 -> 0.8) -> V261 (1.2)
        emissiveIntensity: 1.2
    });
    const liquidCore = new THREE.Mesh(coreGeo, coreMaterial);
    liquidCore.position.y = 1.0;
    lampGroup.add(liquidCore);

    // Lights
    // V142: Dimmer Lights (4 -> 2) -> V-NEW (0.5) -> V261 (1.5)
    const internalPointLight = new THREE.PointLight(0xff4d00, 1.5, 5);
    internalPointLight.position.set(0, 0, 0);
    lampGroup.add(internalPointLight);

    const baseLight = new THREE.PointLight(0xff4d00, 1.5, 3);
    baseLight.position.set(0, -4.5, 0);
    lampGroup.add(baseLight);

    // Blobs
    const lavaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        emissive: 0xff4d00,
        // V142: Duller Blobs (6.4 -> 3.2) -> V261 (4.0)
        emissiveIntensity: 4.0,
        roughness: 0.0
    });

    const blobs = [];
    const blobCount = 5;
    for (let i = 0; i < blobCount; i++) {
        const size = 0.6 + Math.random() * 0.7;
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const blob = new THREE.Mesh(geo, lavaMaterial);

        blob.userData = {
            yOffset: Math.random() * 10,
            speed: 0.5 + Math.random() * 0.5, // Faster relative speed for small cleanup
            rotationPhase: Math.random() * Math.PI * 2,
            baseSize: size,
            driftSpeed: 1.0 + Math.random() * 1.0
        };

        blobs.push(blob);
        lampGroup.add(blob);
    }

    // Animation Logic attached to Group
    let colorHue = 0.05;

    lampGroup.scale.set(scale, scale, scale);

    // Position: On Top of the Shelf
    let yPos = 1.2; // Fallback
    if (anchorPos) {
        // Shelf Top is anchorPos.y + 0.05
        // Lamp Bottom Offset is 6.6 * scale
        yPos = anchorPos.y + 0.05 + (6.6 * scale);
    }

    let xPos = -1.2;
    let zPos = -3.5;
    if (anchorPos) {
        xPos = anchorPos.x;
        zPos = anchorPos.z;
    }

    lampGroup.position.set(xPos, yPos, zPos);

    lampGroup.userData.update = function (t) {
        // Color Shift
        colorHue += 0.001; // Slower
        if (colorHue > 1) colorHue = 0;
        const newColor = new THREE.Color();
        newColor.setHSL(colorHue, 1.0, 0.5);

        lavaMaterial.color.copy(newColor);
        lavaMaterial.emissive.copy(newColor);
        coreMaterial.color.copy(newColor);
        coreMaterial.emissive.copy(newColor);
        baseLight.color.copy(newColor);
        internalPointLight.color.copy(newColor);

        // Blobs
        blobs.forEach((blob) => {
            const data = blob.userData;
            // Original code used `time` in ms * 0.001. `t` passed from update is likely seconds.
            // But let's check `t` in house.js... animate(time). 
            // `t = time * 0.001` (seconds).

            // Re-tuning physics for 't' (seconds)
            const yAmplitude = 4.3;
            const yBase = 0.5;

            const timeVal = t;

            const yPos = yBase + Math.sin(timeVal * data.speed + data.yOffset) * yAmplitude;
            const normalizedY = (yPos - (yBase - yAmplitude)) / (yAmplitude * 2);

            const currentBottleRadius = 1.5 - (normalizedY * 0.4);
            const heightScaleFactor = 1.0 - (normalizedY * 0.5);
            // safeRadius adjusted to keep blobs inside
            const safeRadius = (currentBottleRadius - (data.baseSize * heightScaleFactor)) * 0.7;

            blob.position.y = yPos;
            blob.position.x = Math.sin(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;
            blob.position.z = Math.cos(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;

            const pulse = 1 + Math.sin(timeVal * 1.5 + data.yOffset) * 0.1;
            const finalScale = heightScaleFactor * pulse;
            blob.scale.set(finalScale, finalScale, finalScale);
        });
    };

    interiorGroup.add(lampGroup);
}

function nextBedroomVideo() {
    masterVideoIndex = (masterVideoIndex + 1) % roomContent.bedroom.videoPlaylist.length;
    startVideoClip('bedroom');
    // V-FIX 257: Update UI
    if (window.updateVideoUI) window.updateVideoUI();
}

// V-FIX 9: Helper to Stop Video & Reset Lights (Bedroom specific)
window.stopBedroomVideo = function () {
    if (window.videoElement && !window.videoElement.paused) window.videoElement.pause();

    // Restore Bedroom Defaults (Matches house.js ApplyRoomLighting)
    // Dark/Moody
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.02 }, 1000).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.05 }, 1000).start();
    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.05 }, 1000).start();

    console.log("Bedroom Video Stopped: Restoring Lights");
};

function playVideo(index) {
    const playlist = roomContent.bedroom.videoPlaylist;
    if (!playlist || !playlist[index]) return;

    masterVideoIndex = index;
    // V-FIX 257: Direct Play & UI Update
    startVideoClip('bedroom');

    // V-FIX: User reported room SHOULD get dark (like cinema)
    if (window.applyRoomLighting) {
        window.applyRoomLighting('basement'); // Use 'basement' profile for darkness
    }

    // Sync UI if available
    if (window.updateVideoUI) window.updateVideoUI();
}
window.createStudioInterior = function () {
    // -- STUDIO INTERIOR (Standard File Remastered) --
    // Content: Furniture (Desk/Chair/Rug) + Video Posters (Metropolis/Tron) + Molecule (Atom)

    // 1. FURNITURE
    // Scaling Group for Furniture
    const furnGroup = new THREE.Group();
    furnGroup.scale.set(1.25, 1.25, 1.25);
    interiorGroup.add(furnGroup);

    // Desk
    // Desk
    // V140: Darker Desk (0x8d6e63 -> 0x463732)
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 1.5), deskMat);
    desk.position.set(0, 1.0, -1.5);
    furnGroup.add(desk);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.0, 0.1);
    const fl = new THREE.Mesh(legGeo, deskMat); fl.position.set(-1.4, -0.5, 0.65); desk.add(fl);
    const fr = new THREE.Mesh(legGeo, deskMat); fr.position.set(1.4, -0.5, 0.65); desk.add(fr);
    const bh = new THREE.Mesh(legGeo, deskMat); bh.position.set(-1.4, -0.5, -0.65); desk.add(bh);
    const br = new THREE.Mesh(legGeo, deskMat); br.position.set(1.4, -0.5, -0.65); desk.add(br);

    // Laptop (Interactive)
    const laptopGroup = new THREE.Group();
    // V921: Scaled up 33% 
    // Was default 1.0. New scale 1.33.
    // Note: Furniture group is already 1.25. 
    // This scales it further relative to the desk.
    laptopGroup.scale.set(1.33, 1.33, 1.33);

    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    lapScreen.position.set(0, 0.2, -0.2);
    lapScreen.rotation.x = 0.2;
    const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0044aa }));
    screenGlow.position.z = 0.02;
    lapScreen.add(screenGlow);
    laptopGroup.add(lapBase); laptopGroup.add(lapScreen);
    laptopGroup.position.set(0, 0.15, 0);
    desk.add(laptopGroup);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.userData = { type: 'laptop' };
    hitBox.position.y = 0.3;
    laptopGroup.add(hitBox);
    interiorClickables.push(hitBox);

    // V921: "EXPAND YOUR MIND" Hologram (Replacing "Reality is Relative" popup)
    // Create new Hologram visible in 3D space permanently (or looping)
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512; holoCanvas.height = 256;
    const hctx = holoCanvas.getContext('2d');

    // Gradient Glow
    const grd = hctx.createRadialGradient(256, 128, 20, 256, 128, 200);
    grd.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    hctx.fillStyle = grd;
    hctx.fillRect(0, 0, 512, 256);

    // Text
    hctx.font = 'bold 40px "Glass Antiqua", cursive';
    hctx.textAlign = 'center';
    hctx.textBaseline = 'middle';
    hctx.shadowColor = 'cyan';
    hctx.shadowBlur = 10;

    // Animation loop handled via texture update? 
    // For static canvas, just draw once. 
    hctx.fillStyle = '#ccffff';
    hctx.fillText("EXPAND", 256, 80);
    hctx.fillText("YOUR MIND", 256, 150);

    const deskHoloTex = new THREE.CanvasTexture(holoCanvas);
    const deskHoloMat = new THREE.MeshBasicMaterial({
        map: deskHoloTex,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const deskHoloMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), deskHoloMat);
    deskHoloMesh.position.set(0, 0.8, 0); // Above laptop
    deskHoloMesh.userData = { type: 'studioHologram' }; // Clickable
    laptopGroup.add(deskHoloMesh);

    // Add to clickables so the raycaster hits it
    interiorClickables.push(deskHoloMesh);

    // Chair
    // V140: Darker Chair (0x333333 -> 0x111111)
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), chairMat);
    seat.position.set(0, 0.8, 0.5);
    seat.castShadow = true; // V306: Shadows
    furnGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), chairMat);
    back.position.set(0, 0.5, 0.4);
    seat.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), chairMat);
    stem.position.set(0, -0.4, 0);
    seat.add(stem);

    // Rug
    // V140: Darker Rug (0xe91e63 -> 0x750f31)
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0x750f31 }));
    rug.position.set(0, 0.02, 0);
    furnGroup.add(rug);

    // 2. VIDEO POSTERS
    const createVideoPoster = (src, opacity = 1) => {
        const vid = document.createElement('video');
        vid.src = src;
        vid.loop = true;
        vid.muted = true;
        vid.preload = 'auto';
        vid.crossOrigin = "anonymous";
        vid.setAttribute('playsinline', '');
        vid.style.position = 'fixed';
        vid.style.top = '-10000px';
        vid.style.left = '-10000px';
        document.body.appendChild(vid);

        vid.load();
        const p = vid.play();
        if (p !== undefined) {
            p.catch(error => {
                console.error("Auto-play blocked for " + src, error);
            });
        }

        const tex = new THREE.VideoTexture(vid);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            uniform sampler2D map;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(map, vUv);
                float dist = length(vUv - 0.5) * 1.414; 
                float feather = smoothstep(0.1, 0.8, dist); 
                color.a *= opacity * (1.0 - feather);
                gl_FragColor = color;
            }
        `;

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: tex },
                opacity: { value: opacity }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 6.3), mat);
        mesh.userData = { isVideo: true, videoElement: vid };
        return { mesh: mesh, video: vid };
    };

    // Metropolis (Back Wall)
    const mepo = createVideoPoster('../assets/video/mepo.mp4', 0.8);
    mepo.mesh.position.set(1.0, 5, -4.9);
    interiorGroup.add(mepo.mesh);

    // Tron (Left Wall)
    const tron = createVideoPoster('../assets/video/tronai.mp4', 0.9);
    tron.mesh.scale.set(0.75, 0.75, 0.75);
    tron.mesh.position.set(-4.9, 5, 3.5);
    tron.mesh.rotation.y = Math.PI / 2;
    interiorGroup.add(tron.mesh);

    // 3. MOLECULE (Atom Group)
    atomGroup = new THREE.Group();
    atomGroup.position.set(-3, 4, -3);
    interiorGroup.add(atomGroup);

    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 }));
    atomGroup.add(nucleus);

    const createOrbit = (rx, ry, rz, color) => {
        const orbitGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 50);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        orbitGroup.add(ring);

        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: color }));
        electron.position.x = 1.5;
        orbitGroup.add(electron);

        orbitGroup.rotation.set(rx, ry, rz);
        orbitGroup.userData = { speed: Math.random() * 0.05 + 0.02, electron: electron };
        atomGroup.add(orbitGroup);
    };

    createOrbit(0, 0, 0, 0xff0000);
    createOrbit(Math.PI / 2, 0, 0, 0xffff00);
    createOrbit(0, Math.PI / 2, Math.PI / 4, 0x00ccff);

    // V-WORDHUNT: Hidden Orb in Molecule
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('studio');
        if (item) {
            // Hide inside Nucleus initially
            item.position.set(0, 0, 0);
            item.scale.set(0.1, 0.1, 0.1);
            item.visible = false;
            atomGroup.add(item); // Add to atomGroup so it moves with it

            // Make Nucleus Clickable
            // Nucleus is the first child of atomGroup usually, or we can add a hitbox
            nucleus.userData = {
                type: 'atom_nucleus',
                onClick: () => {
                    if (item.userData.revealed) return;
                    console.log("Atom Nucleus Clicked! Finding Word...");

                    item.visible = true;
                    item.userData.revealed = true;

                    // Animate Pop Out (Explode out)
                    new TWEEN.Tween(item.position)
                        .to({ y: 1.5, x: 0.5, z: 0.5 }, 1500)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start();

                    new TWEEN.Tween(item.scale)
                        .to({ x: 1.0, y: 1.0, z: 1.0 }, 1500)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start();
                }
            };
            interiorClickables.push(nucleus);

            // Hitbox for easier clicking (Nucleus is small 0.4)
            const nHit = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            nHit.userData = nucleus.userData;
            atomGroup.add(nHit);
            interiorClickables.push(nHit);
        }
    }

    // 4. R2-D2 IN RIGHT CORNER
    createR2D2InCorner();
}

window.createR2D2InCorner = function () {
    const r2d2Group = new THREE.Group();
    r2d2Group.scale.set(0.33, 0.33, 0.33);
    r2d2Group.position.set(3.5, 0, -3.5);
    r2d2Group.rotation.y = -Math.PI / 4;
    interiorGroup.add(r2d2Group);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.32;

    // Body Group
    const bodyGroup = new THREE.Group();
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 40), white);
    bodyCyl.castShadow = true;
    bodyGroup.add(bodyCyl);

    // Body Details
    const ventGeo = new THREE.BoxGeometry(0.6, 0.4, 0.1);
    const vent1 = new THREE.Mesh(ventGeo, blue);
    vent1.position.set(0.4, 0.5, 1.35);
    bodyGroup.add(vent1);
    const vent2 = new THREE.Mesh(ventGeo, blue);
    vent2.position.set(-0.4, 0.5, 1.35);
    bodyGroup.add(vent2);

    // R2-D2 Body Rings (Restored/Kept)
    const ringGeo = new THREE.TorusGeometry(1.41, 0.015, 8, 40);
    const ring1 = new THREE.Mesh(ringGeo, dark);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.8;
    bodyGroup.add(ring1);
    const ring2 = ring1.clone();
    ring2.position.y = -0.8;
    bodyGroup.add(ring2);

    bodyGroup.rotation.x = bodyTiltAngle;
    bodyGroup.position.y = bodyPivotY;
    r2d2Group.add(bodyGroup);

    // Dome
    const domeGroup = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), silver);
    domeGroup.add(dome);

    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20), dark);
    eye.rotation.x = Math.PI / 2;
    eye.position.set(0, 0.75, 1.3);
    domeGroup.add(eye);

    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12), silver);
    proj.rotation.x = 0.6;
    proj.position.set(0, 0.35, 1.3);
    domeGroup.add(proj);

    // Blinking Lights
    const lightRed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    lightRed.position.set(0.4, 0.6, 1.25);
    domeGroup.add(lightRed);
    const lightBlue = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    lightBlue.position.set(-0.4, 0.7, 1.25);
    domeGroup.add(lightBlue);
    const lightGreen = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff44 }));
    lightGreen.position.set(0, 0.9, 1.1);
    domeGroup.add(lightGreen);

    domeGroup.position.y = 1.5;
    bodyGroup.add(domeGroup);

    // FOOT
    function createFoot() {
        const foot = new THREE.Group();
        const footTop = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), white);
        footTop.scale.set(1, 1, 2.2);
        foot.add(footTop);
        return foot;
    }

    // Side Legs
    function createSideLeg(side) {
        const legGroup = new THREE.Group();
        const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), white);
        joint.rotation.z = Math.PI / 2;
        joint.position.x = side * 1.5;
        legGroup.add(joint);

        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.4, sideLegHeight, 0.7), white);
        strut.position.y = -sideLegHeight / 2;
        strut.position.x = side * 1.5;
        legGroup.add(strut);

        const foot = createFoot();
        foot.position.y = -sideLegHeight;
        foot.position.z = 0.1;
        foot.position.x = side * 1.5;
        legGroup.add(foot);

        legGroup.position.y = bodyPivotY;
        return legGroup;
    }

    r2d2Group.add(createSideLeg(1));
    r2d2Group.add(createSideLeg(-1));

    // Central Leg
    const centralLeg = new THREE.Group();
    const legSlant = -0.3;
    const cStrutHeight = 1.2;
    const cStrut = new THREE.Mesh(new THREE.BoxGeometry(0.4, cStrutHeight, 0.4), white);
    cStrut.position.y = -cStrutHeight / 2;
    centralLeg.add(cStrut);

    const cFoot = createFoot();
    cFoot.rotation.x = Math.abs(bodyTiltAngle) + Math.abs(legSlant);
    cFoot.position.y = -cStrutHeight;
    cFoot.position.z = 0.05;
    centralLeg.add(cFoot);

    centralLeg.position.set(0, -1.2, 0);
    centralLeg.rotation.x = legSlant;
    bodyGroup.add(centralLeg);

    // HOLOGRAM
    const vid = document.createElement('video');
    vid.src = '../assets/video/hologram.mp4';
    vid.loop = true;
    vid.muted = true;
    vid.preload = 'auto';
    vid.crossOrigin = "anonymous";
    vid.setAttribute('playsinline', '');
    vid.style.position = 'fixed';
    vid.style.top = '-10000px';
    vid.style.left = '-10000px';
    document.body.appendChild(vid);

    vid.load();
    const p = vid.play();
    if (p !== undefined) {
        p.catch(error => console.error("Auto-play blocked for hologram", error));
    }

    const holoTex = new THREE.VideoTexture(vid);
    holoTex.minFilter = THREE.LinearFilter;
    holoTex.magFilter = THREE.LinearFilter;

    const hologramGroup = new THREE.Group();

    // BEAM: Modified to be "really more blurry" and a "glowing particle cloud"
    // We removed the banded pulse to get rid of the "rings" in the beam.
    const beamGeo = new THREE.ConeGeometry(0.35, 6, 32, 12, true);
    beamGeo.translate(0, -3, 0);

    const beamMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x44eeff) }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // High energy jitter
                float jitter = fract(sin(time * 10.0 + position.y * 20.0)) * 0.12;
                pos.x += jitter;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            
            void main() {
                // Finer grain for "particle cloud" look
                float grain = hash(vUv * 800.0 + time * 8.0);
                
                // Volume envelope - MUCH BLURRIER
                // Softer smoothsteps create a hazier, less defined edge
                float envelope = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.3, vUv.y);
                float sideFade = pow(sin(vUv.x * 3.14159), 3.0); 
                
                // Glitchy horizontal line cuts - less "ring-like"
                float glitchLines = step(0.98, hash(vec2(floor(time * 20.0), floor(vUv.y * 120.0))));
                
                // Pulsing glow - Removed vUv.y dependency to remove "rings" in the beam
                float pulse = 0.7 + 0.3 * sin(time * 12.0);
                
                // Final alpha combines grain (particles) with the volume shape
                float alpha = (grain * 0.4 + 0.6) * envelope * sideFade * pulse;
                alpha += glitchLines * 0.5;
                
                // Glowing color with random flicker
                float flicker = 0.5 + 0.5 * hash(vec2(time * 15.0, 0.0));
                vec3 finalColor = color + vec3(glitchLines * 0.7);
                
                gl_FragColor = vec4(finalColor, alpha * 0.35 * flicker);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.rotation.x = Math.PI;
    hologramGroup.add(beamMesh);

    const holoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        new THREE.ShaderMaterial({
            uniforms: {
                map: { value: holoTex },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float time;
                varying vec2 vUv;
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                }
                void main() {
                    vec2 uv = vUv;
                    
                    float glitchTime = floor(time * 12.0);
                    if (hash(vec2(glitchTime, 0.0)) > 0.85) {
                        uv.x += (hash(vec2(glitchTime, floor(uv.y * 10.0))) - 0.5) * 0.15;
                    }

                    float splitAmount = 0.012 + noise(vec2(time * 8.0, uv.y * 20.0)) * 0.02;
                    vec4 texColorR = texture2D(map, uv + vec2(splitAmount, 0.0));
                    vec4 texColorG = texture2D(map, uv);
                    vec4 texColorB = texture2D(map, uv - vec2(splitAmount, 0.0));
                    vec4 texColor = vec4(texColorR.r, texColorG.g, texColorB.b, texColorG.a);
                    
                    float greenness = texColor.g - max(texColor.r, texColor.b);
                    float alpha = 1.0 - smoothstep(0.2, 0.4, greenness);
                    
                    float flicker = 0.7 + hash(vec2(time * 30.0, 0.0)) * 0.3;
                    float scanline = sin(uv.y * 200.0 + time * 15.0) * 0.1 + 0.9;
                    float dropout = step(0.94, hash(vec2(time * 10.0, 0.0))); 
                    
                    float finalAlpha = alpha * flicker * scanline * (1.0 - dropout) * 0.85;
                    
                    gl_FragColor = vec4(texColor.rgb + vec3(noise(uv*50.0 + time)*0.1), finalAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );
    holoPlane.position.y = 6;
    holoPlane.rotation.y = Math.PI;
    hologramGroup.add(holoPlane);

    hologramGroup.position.set(0, 0.35, 1.3);
    hologramGroup.rotation.x = 0.7;
    hologramGroup.scale.set(1.5, 1.5, 1.5); // Bigger (was 1.0)
    domeGroup.add(hologramGroup);

    // 50% Faster Animation
    hologramGroup.userData.update = function (t) {
        // Fast time
        const fastTime = t * 1.5;
        if (beamMat.uniforms) beamMat.uniforms.time.value = fastTime;
        if (holoPlane.material.uniforms) holoPlane.material.uniforms.time.value = fastTime;
    };

    // DARKER LIGHTING
    // Remove default bulb
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // Add darker custom light
    // Add darker custom light
    // V140: Dimmed (0.4 -> 0.2) -> V-NEW: 0.05
    // V306: Darker (0.8 -> 0.4)
    const studioLight = new THREE.PointLight(0xffffff, 0.4, 15);
    studioLight.position.set(0, 5, 0);
    studioLight.castShadow = true; // V306: Shadows
    studioLight.shadow.bias = -0.0001;
    interiorGroup.add(studioLight);

    if (!window.r2d2Elements) window.r2d2Elements = [];
    window.r2d2Elements.push({
        domeGroup: domeGroup,
        lightRed: lightRed,
        lightBlue: lightBlue,
        lightGreen: lightGreen,
        hologramGroup: hologramGroup,
        holoPlane: holoPlane,
        beamMat: beamMat
    });
}
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

    // V326: Detroit Model Phi Drum Machine removed per user request
    if (window.technoEngine) {
        if (window.technoEngine.isPlaying) window.technoEngine.stop();
        window.technoEngine = null;
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

    const roadSegments = 200;
    const roadStartZ = 2.7; // Start exactly at steps
    const roadEndZ = 150.0;
    console.log("Road Config V44: Epic Scale (150m). Start:", roadStartZ, "End:", roadEndZ);

    const rVertices = [];
    const rIndices = [];
    const rUVs = [];
    const roadThickness = 0.5;

    for (let i = 0; i <= roadSegments; i++) {
        const ratio = i / roadSegments;
        const z = roadStartZ + (roadEndZ - roadStartZ) * ratio;

        // V23: Precise Formula relative to Steps
        const currentWidth = widthAtSteps + (z - stepZ) * widthSlope;

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

        // Simpler LED Logic for speed
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#00ff00';
            ctx.fillRect(Math.random() * 30, Math.random() * 10, 2, 2);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;

        // V125: Base Height 1.0, Width 2.5 (Medium/Short)
        const geo = new THREE.BoxGeometry(2.5, 1.0, 2.5);
        geo.translate(0, 0.5, 0); // Keep pivot

        // V146: Grey Scale Palette + V-NEW: Added Brown-ish shades
        const palette = [
            0x1a1a1a, 0x2c2c2c, 0x333333, 0x444444, 0x555555,
            0x666666, 0x777777, 0x888888, 0x999999, 0xaaaaaa,
            0x121212, 0x242424, 0x383838, 0x4a4a4a, 0x222233, // Subtle blue-grey
            0x3e2723, 0x4e342e, 0x5d4037, 0x6d4c41, 0x795548  // V-NEW: Brown-ish shades
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
            const currentRoadWidth = wSteps + (z - zSteps) * slope;
            const xPos = currentRoadWidth / 2 + 0.8;
            const distRatio = (z - 20) / (115 - 20);
            const perspectiveScale = 1.0 + distRatio * 1.0;

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
            const pLight = new THREE.PointLight(0xffaa00, 4.0, 18); // V-FIX: Much Brighter (Massive intensity)
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

        // ORIGINAL ROAD CULLING (Culling road path)
        if (z > -5 && z < 180 && Math.abs(x) < 20.0) continue;

        const mesh = createMegaBlock();
        const distFactor = (radius - 25) / 120;
        const minH = 6.0 + distFactor * 6.0;
        const maxH = 10.0 + distFactor * 15.0;
        const h = minH + Math.random() * (maxH - minH);

        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);

        alignToPlanet(mesh, x, z);
        worldGroup.add(mesh);
        animatedTrees.push(mesh); // City blocks participate in float animation
    }

    // V326: Horizon Mega-Blocks (Far Distance)
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 130;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (z > -10 && z < 250 && Math.abs(x) < 30.0) continue;

        const mesh = createMegaBlock();
        const h = 20.0 + Math.random() * 30.0;
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

        // Culling: Avoid house (approx center) and road (z road)
        if (Math.abs(x) < 8 && z > -20 && z < 100) continue;
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

