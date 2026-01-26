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
    const candleLight = new THREE.PointLight(0xffaa00, 1.2, 5); // Reduced range from 12 to 5 for intimacy
    candleLight.position.set(0, 0.35, 0); // Local to group
    candleLight.castShadow = true;
    candleLight.userData = {
        baseIntensity: 1.2,
        update: (t) => {
            const flicker = 1.2 + Math.sin(t * 15) * 0.15 + Math.cos(t * 33) * 0.15;
            candleLight.intensity = flicker;
            flame.scale.setScalar(0.8 + (flicker - 1.2) * 2); // Pulse visual flame too
        }
    };
    candleGroup.add(candleLight);

    // Position Group on Desk
    // Desk Top Surface: y=1.0 + 0.075 = 1.075
    candleGroup.position.set(1.0, 1.075, -1.0);
    interiorGroup.add(candleGroup);

    // Helper to run updates
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
    animator.userData = { update: (t) => { candleLight.userData.update(t); } };
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
    // V-FIX: Raise from 0.2 to 0.4 to sit on floor
    bed.position.set(-1.0, 0.4, 0);
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
    pillow.position.set(-1.0, 0.45, 1.4);
    interiorGroup.add(pillow);

    // Blanket (Thin & Flush)
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 }));
    blanket.position.set(-1.0, 0.41, -0.1);
    interiorGroup.add(blanket);

    // Chair
    const chair = createAnnexChair();
    chair.position.set(0.2, 0, -0.6);
    interiorGroup.add(chair);

    // 2. Wall mounted Bookshelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const darkBooks = [0x1a1510, 0x2b1d14, 0x0a0a0a, 0x3e2723, 0x1b2612];

    function createWallShelf(x, y, z, rotY = 0) {
        const shelfGroup = new THREE.Group();
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.6), shelfMat);
        shelfGroup.add(plank);
        for (let i = 0; i < 10; i++) {
            const bH = 0.4 + Math.random() * 0.2, bW = 0.15 + Math.random() * 0.1;
            const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.4), new THREE.MeshStandardMaterial({ color: darkBooks[Math.floor(Math.random() * darkBooks.length)] }));
            book.position.set(-1.0 + (i * 0.22), 0.05 + bH / 2, 0);
            shelfGroup.add(book);
        }
        shelfGroup.position.set(x, y, z); shelfGroup.rotation.y = rotY;
        interiorGroup.add(shelfGroup);
    }
    createWallShelf(-1.95, 1.8, 0, Math.PI / 2);
    createWallShelf(-1.95, 3.2, 0, Math.PI / 2);

    // 3. Narrow Suitcase
    const suitcase = createSuitcase();
    suitcase.scale.set(1.0, 1.0, 1.4);
    suitcase.position.set(1.4, 0.2, 1.6);
    suitcase.rotation.y = 0.4;
    interiorGroup.add(suitcase);

    // 4. Desk
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 }); // Re-using woodMat from chair for consistency
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), woodMat);
    deskTop.position.y = 1.0;
    deskGroup.add(deskTop);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
    // V173: Removed left legs (mounted to wall)
    const legBR = new THREE.Mesh(legGeo, woodMat); legBR.position.set(1.4, 0.5, -0.45);
    const legFR = new THREE.Mesh(legGeo, woodMat); legFR.position.set(1.4, 0.5, 0.45);
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
}

function createAnnexChair() {
    const chair = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), woodMat);
    seat.position.y = 0.5; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), woodMat);
    back.position.set(0, 0.9, 0.25); chair.add(back);
    for (let x of [-0.25, 0.25]) {
        for (let z of [-0.25, 0.25]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), woodMat);
            leg.position.set(x, 0.25, z); chair.add(leg);
        }
    }
    chair.scale.setScalar(1.1); return chair;
}

function createSuitcase() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), bodyMat); group.add(body);
    const strapGeo = new THREE.BoxGeometry(0.05, 0.42, 0.52);
    const s1 = new THREE.Mesh(strapGeo, new THREE.MeshStandardMaterial({ color: 0x2b1d14 }));
    s1.position.x = -0.25; group.add(s1);
    const s2 = s1.clone(); s2.position.x = 0.25; group.add(s2);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI), metalMat);
    handle.position.y = 0.2; handle.rotation.z = Math.PI / 2; group.add(handle);
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
    ctx.font = '900 42px "Courier New", Courier, monospace'; // Slightly smaller (48 -> 42)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = [
        '"You should',
        'always be',
        'prepared to',
        'pack your',
        'bags and',
        'move West..."'
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
