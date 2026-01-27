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
function createPlutoUsher() {
    const group = new THREE.Group();

    // --- Materials (MATCHING ORIGINAL PROTOTYPE) ---
    const skinMaterial = new THREE.MeshPhysicalMaterial({ color: 0x6655aa, roughness: 0.4, clearcoat: 0.5 });
    const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0xe5b80b, roughness: 0.8 });
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa44, roughness: 0.9 });
    const collarMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const bellyMaterial = new THREE.MeshStandardMaterial({ color: 0xaa88cc });
    const eyelidMaterial = skinMaterial;
    const droneMaterial = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.8, roughness: 0.2 });
    const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xe4f0ef });
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x051b2a });
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4444, roughness: 0.3, emissive: 0x331111, emissiveIntensity: 0.5 });
    const spikeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff00aa, emissive: 0x550022, transmission: 0.5, opacity: 0.9, thickness: 1 });

    // --- Geometry Helper ---
    function createLimb(x, y, z, rotZ, h = 0.6, isLeg = false) {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.rotation.z = rotZ;

        const r = 0.18;
        const mat = isLeg ? skinMaterial : shirtMaterial;
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat);
        g.add(cyl);

        const capTop = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), mat);
        capTop.position.y = h / 2; g.add(capTop);
        const capBot = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), mat);
        capBot.position.y = -h / 2; g.add(capBot);

        // Cuffs
        const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 16), pantsMaterial);
        cuff.position.y = isLeg ? 0.2 : -0.35;
        g.add(cuff);

        // Toes
        for (let t = -1; t <= 1; t++) {
            const toe = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), isLeg ? bellyMaterial : pantsMaterial);
            toe.position.set(t * 0.08, isLeg ? -0.3 : -0.45, 0.12);
            toe.castShadow = true;
            g.add(toe);
        }

        g.traverse(c => { if (c.isMesh) c.castShadow = true; });
        return g;
    }

    // --- Body (V288: Adjusted Y to ground feet at -1.23) ---
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 1.23;
    group.add(bodyGroup);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), skinMaterial);
    body.scale.set(0.9, 1.1, 0.9);
    bodyGroup.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), bellyMaterial);
    belly.position.set(0, 0.3, 0.6); belly.scale.set(1, 0.8, 0.5);
    body.add(belly);

    // Spikes
    for (let i = 0; i < 5; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 8), spikeMaterial);
        spike.position.set(0, 0.5 - (i * 0.25), -0.75 - (i * 0.1));
        spike.rotation.x = -Math.PI / 4;
        body.add(spike);
    }

    // Limbs (V286: Original High-Fidelity)
    bodyGroup.add(createLimb(-0.85, 0.3, 0.2, -0.7, 0.8, false)); // Left Arm
    bodyGroup.add(createLimb(0.85, 0.3, 0.2, 0.7, 0.8, false));  // Right Arm
    bodyGroup.add(createLimb(-0.45, -0.8, 0.3, 0, 0.5, true));  // Left Leg
    bodyGroup.add(createLimb(0.45, -0.8, 0.3, 0, 0.5, true));   // Right Leg

    // Shirt & Pants & Collar (Original Prototype)
    const shirt = new THREE.Mesh(new THREE.SphereGeometry(0.87, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), shirtMaterial);
    shirt.scale.set(0.91, 1.11, 0.91); bodyGroup.add(shirt);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 16, 64), collarMaterial);
    collar.rotation.x = Math.PI / 2; collar.position.y = 1.0; collar.scale.set(1.1, 1, 0.5); bodyGroup.add(collar);
    const pants = new THREE.Mesh(new THREE.SphereGeometry(0.88, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), pantsMaterial);
    pants.scale.set(0.92, 1.12, 0.92); pants.position.y = 0.1; bodyGroup.add(pants);

    // Tail (Original Prototype)
    const tailGroup = new THREE.Group(); tailGroup.position.set(0, -0.7, -0.7); bodyGroup.add(tailGroup);
    for (let i = 0; i < 8; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.14 - (i * 0.015), 16, 16), skinMaterial);
        s.position.set(0, i * 0.15, -(i * 0.25)); tailGroup.add(s);
    }

    // --- Head (V287: Rotation handled globally in house.js) ---
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.1;
    // headGroup.rotation.y = 0; // Reset to face forward (global rotation handles it)
    bodyGroup.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 64), skinMaterial);
    head.scale.set(1.15, 0.95, 1);
    headGroup.add(head);

    // Muzzle & Nose
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), bellyMaterial);
    muzzle.position.set(0, -0.25, 1.1); muzzle.scale.set(1.2, 0.8, 0.8);
    headGroup.add(muzzle);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), noseMaterial);
    nose.position.set(0, 0.1, 0.4); muzzle.add(nose);

    // Antennae/Stalks (Original Prototype)
    const stalkGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.8, 16);
    const lStalk = new THREE.Mesh(stalkGeo, skinMaterial); lStalk.position.set(-0.6, 0.8, 0); lStalk.rotation.z = 0.5; headGroup.add(lStalk);
    const rStalk = new THREE.Mesh(stalkGeo, skinMaterial); rStalk.position.set(0.6, 0.8, 0); rStalk.rotation.z = -0.5; headGroup.add(rStalk);

    // Eyes (Verified Prototype V282)
    const upperLids = [];
    [-0.5, 0.5].forEach((x, i) => {
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(x, 0.15, 0.95); eyeGroup.rotation.y = i === 0 ? 0.15 : -0.15;
        headGroup.add(eyeGroup);

        const r = 0.44;
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), eyeWhiteMaterial);
        sclera.position.z = -0.02; eyeGroup.add(sclera);

        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), pupilMaterial);
        pupil.position.z = r - 0.02 + 0.001; eyeGroup.add(pupil);

        const glint = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        glint.position.set(i === 0 ? -0.12 : 0.12, 0.15, r - 0.02 + 0.002);
        eyeGroup.add(glint);

        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5), eyelidMaterial);
        lid.rotation.x = -Math.PI * 0.3; lid.position.z = 0.03;
        eyeGroup.add(lid);
        upperLids.push(lid);
    });

    // --- Accessories (Refined V287) ---
    const shadow = createUsherShadow();
    shadow.position.y = 0.01; // sits directly on world pivot ground
    group.add(shadow);

    const halo = createGlitchyHalo();
    halo.position.set(0, 3.2, 0.05); // Above head, slightly forward
    headGroup.add(halo);

    const text = createUsherText();
    text.position.set(0, 3.2, 0.1); // Spaced same as halo but slightly more forward
    headGroup.add(text);

    // Drone Hat
    const drone = new THREE.Group();
    drone.position.y = 1.8;
    headGroup.add(drone);
    drone.add(new THREE.Mesh(new THREE.SphereGeometry(0.2), droneMaterial));
    const propeller = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.02, 0.1), droneMaterial);
    drone.add(propeller);

    // V288: Enable Shadows for everything except the light planes
    group.traverse(c => {
        if (c.isMesh && c.name !== 'holograph') {
            c.castShadow = true;
        }
    });

    // Update Function
    group.userData.update = function (t) {
        bodyGroup.position.y = 1.23 + Math.sin(t * 1.5) * 0.05;
        // headGroup.rotation.y is fixed or subtle sway
        headGroup.rotation.y = Math.sin(t * 0.6) * 0.05;

        // Tail Sway
        tailGroup.rotation.z = Math.sin(t * 1.5) * 0.15;
        // Stalk Sway
        lStalk.rotation.z = 0.5 + Math.sin(t * 2.5) * 0.05;
        rStalk.rotation.z = -0.5 + Math.cos(t * 2.5) * 0.05;

        if (Math.sin(t * 2.0) > 0.96) {
            upperLids.forEach(l => l.rotation.x = 0);
        } else {
            upperLids.forEach(l => l.rotation.x = -Math.PI * 0.3);
        }

        propeller.rotation.y += 0.4;
        drone.position.y = 1.8 + Math.cos(t * 4) * 0.08;

        if (halo.userData.update) halo.userData.update(t);
    };

    return group;
}
