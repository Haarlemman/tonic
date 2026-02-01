
// --- MM-UNIVERSE.JS ---

console.log("--- MM-UNIVERSE.JS LOADED ---");

class MMAnimation {
    constructor(width, height) {
        this.width = width || 1024;
        this.height = height || 1024;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d', { alpha: true });

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.scrollPos = 0;
        this.targetScroll = 0;
        this.time = 0;
        this.objects = [];
        this.stars = [];
        this.FL = 500;
        this.WORLD_END = 15500;

        this.UNIVERSE_CONFIG = {
            palette: {
                stars: '#eeeeff', singularity: '#ffee99', bangLines: '#eeddaa',
                quantum: '#0000ff', atomOrbits: '#990000', electrons: '#00FFFF',
                dna: '#ffeeaa', neural: '#6699FF', fibonacci: '#ffee00',
                geometry: '#FF9900', tesseract: '#00CCFF', solar: '#FF5555',
                web: '#eedd00', horizon: '#ff0000'
            },
            physics: { baseSpeed: 15, brakeStart: 11500 }
        };

        this.initWorld();
        this.universeStarted = true;
    }

    getCanvas() { return this.canvas; }

    initWorld() {
        // Stars
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * 5000, y: (Math.random() - 0.5) * 5000,
                z: Math.random() * 2000, zOffset: Math.random() * this.WORLD_END
            });
        }
        // Objects (Singularity, etc.) - Simplified Set
        this.objects.push({ type: 'singularity', z: 600, x: 0, y: 0 });
        for (let i = 0; i < 40; i++) this.objects.push({ type: 'bang', z: 1200, x: 0, y: 0, angle: Math.random() * 6.28, len: 100 + Math.random() * 100 });
        this.objects.push({ type: 'atom', z: 3400, x: 0, y: 0, r: 180 });
        this.objects.push({ type: 'horizon', z: 15500, x: 0, y: 0, r: 150 });
    }

    update() {
        // Scroll
        let speed = this.UNIVERSE_CONFIG.physics.baseSpeed;
        if (this.targetScroll > this.UNIVERSE_CONFIG.physics.brakeStart) {
            // Brake logic
            speed *= 0.5;
        }
        this.targetScroll += speed;
        if (this.targetScroll >= this.WORLD_END) { this.targetScroll = 0; this.scrollPos = 0; }

        this.scrollPos = this.scrollPos + (this.targetScroll - this.scrollPos) * 0.1;
        this.time += 0.02;

        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Stars
        ctx.fillStyle = '#fff';
        this.stars.forEach(s => {
            let rz = s.z + s.zOffset - this.scrollPos;
            while (rz < 0) rz += this.WORLD_END;
            if (rz > 10 && rz < 3000) {
                const sc = this.FL / rz;
                ctx.fillRect(this.cx + s.x * sc, this.cy + s.y * sc, sc, sc);
            }
        });

        // Objects
        this.objects.forEach(obj => {
            let rz = obj.z - this.scrollPos;
            if (rz < 10 || rz > 4000) return;
            const sc = this.FL / rz;
            const x = this.cx + obj.x * sc;
            const y = this.cy + obj.y * sc;

            if (obj.type === 'singularity') {
                ctx.fillStyle = '#ffee99'; ctx.beginPath(); ctx.arc(x, y, 5 * sc, 0, 6.28); ctx.fill();
            } else if (obj.type === 'atom') {
                ctx.strokeStyle = '#990000'; ctx.beginPath(); ctx.ellipse(x, y, 180 * sc, 50 * sc, this.time, 0, 6.28); ctx.stroke();
            }
        });
    }
}
window.MMAnimation = MMAnimation;
