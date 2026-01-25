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
