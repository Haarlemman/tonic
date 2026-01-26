// Fibonacci Screensaver Port for TV Texture
// Original: ../fib/2.html

window.createFibonacciScreensaver = function (width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    let active = true;

    // Geometric State
    let fib = [8, 8];
    let segments = [];
    let cx = 0, cy = 0;
    let dir = 0; // 0:R, 1:D, 2:L, 3:U
    let progress = 0;
    let scale = 1.0;
    let camX = 0, camY = 0;
    let hue = 190;

    const w = width;
    const h = height;

    // Pre-fill some history so it doesn't look empty at start
    // (Optional, but let's just let it run)

    return {
        canvas: canvas,
        update: function () {
            if (!active) return;

            const target = fib[fib.length - 1];
            // Speed logic
            const moveSpeed = (2.5 / scale) + 2.2;
            progress += moveSpeed;
            hue = (hue + 0.25) % 360;

            if (progress >= target) {
                const vec = [[1, 0], [0, 1], [-1, 0], [0, -1]][dir];
                const ex = cx + vec[0] * target;
                const ey = cy + vec[1] * target;

                segments.push({ x1: cx, y1: cy, x2: ex, y2: ey, h: hue });

                cx = ex; cy = ey;

                // Prevent infinite array growth
                const nextFib = fib[fib.length - 1] + fib[fib.length - 2];
                // Reset if too huge? Or let it spiral? 
                // The original logic just pushes forever but shifts segments > 200.
                // But `fib` array grows. 
                if (!isFinite(nextFib)) {
                    // Reset
                    fib = [8, 8]; segments = []; cx = 0; cy = 0; progress = 0;
                } else {
                    fib.push(nextFib);
                }

                dir = (dir + 1) % 4;
                progress = 0;

                if (segments.length > 200) segments.shift();
            }

            const vec = [[1, 0], [0, 1], [-1, 0], [0, -1]][dir];
            const headX = cx + vec[0] * progress;
            const headY = cy + vec[1] * progress;

            // Camera: Keep (0,0) as the emotional anchor initially
            const dist = Math.max(Math.abs(headX), Math.abs(headY), 30);
            const targetS = (Math.min(w, h) * 0.4) / dist;

            // Damping logic
            scale += (targetS - scale) * 0.04;

            // We use a softer follow at the beginning
            const followEase = fib.length < 6 ? 0.02 : 0.08;
            camX += (-headX * scale - camX) * followEase;
            camY += (-headY * scale - camY) * followEase;

            // DRAW
            // Trail Fade
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(0, 0, w, h);

            // Center coordinate system
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
            ctx.translate(w / 2 + camX, h / 2 + camY);
            ctx.scale(scale, scale);

            // History
            segments.forEach((s, i) => {
                const alpha = (i + 1) / (segments.length + 1);
                ctx.strokeStyle = `hsla(${s.h}, 90%, 60%, ${alpha})`;
                ctx.lineWidth = 3 / scale;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
                ctx.stroke();
            });

            // Active head
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 5 / scale;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + vec[0] * progress, cy + vec[1] * progress);
            ctx.stroke();

            // Head Sparkle
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(cx + vec[0] * progress, cy + vec[1] * progress, 6 / scale, 0, Math.PI * 2);
            ctx.fill();
        }
    };
};
