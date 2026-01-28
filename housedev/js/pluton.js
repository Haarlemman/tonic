/**
 * PLUTON.JS
 * 
 * Logic for the "Plutonian Star-Whisker" character (Usher).
 * Refactored V282 for High-Fidelity (Reference: pluton/index.html).
 */
console.log("--- PLUTON.JS LOADED V282 (REFINED) ---");

// --- Holographic Text Helper ---
// --- Holographic Text Helper (Light Plane V287) ---
function createUsherText() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background (Matching Annex style)
    const grad = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    grad.addColorStop(0.3, 'rgba(0, 255, 255, 0.2)');
    grad.addColorStop(0.6, 'rgba(0, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 2. Text with Glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff'; // Pure white text like Annex
    ctx.textAlign = 'center';

    // Line 1: Welcome
    ctx.font = 'bold 90px "Courier Prime", monospace';
    ctx.fillText("Welcome!", 512, 180);

    // Line 2: Subtext
    ctx.font = '45px "Courier Prime", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.fillText("Explore the 9 Rooms of Life", 512, 280);
    ctx.fillText("by navigation in and around the house.", 512, 350);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), mat);
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
    mesh.position.y = 0.02; // Just above ground
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
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    // Faces the user (Default +Z)
    return mesh;
}

// --- Main Character Creator ---
// --- Main Character Creator ---
function createPlutoUsher() {
    const group = new THREE.Group();

    // V302: Removing Pluton Body (User Request: "Little friend has got to go")
    // Keeping Hologram Only.

    // --- Accessories (Refined V287) ---
    // Remove Shadow (Body is gone)
    // const shadow = createUsherShadow(); ...

    const halo = createGlitchyHalo();
    // V319: Centered on path, slightly higher, and further forward (foreground pop)
    const baseH = 1.3;
    halo.position.set(-0.3, baseH, 5.5);
    group.add(halo);

    const text = createUsherText();
    text.position.set(-0.3, baseH, 5.6);
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
