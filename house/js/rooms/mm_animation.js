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
