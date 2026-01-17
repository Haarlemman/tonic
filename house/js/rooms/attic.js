function createAtticInterior() {
    const createLabeledBox = (labelText, x, z, color) => {
        const boxGeo = new THREE.BoxGeometry(1.5, 1.2, 1.5);
        const boxMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(x, 0.6, z);
        const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.6), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        lid.position.y = 0.6;
        box.add(lid);
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f5f5dc'; ctx.fillRect(56, 56, 400, 144);
        ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 4; ctx.strokeRect(60, 60, 392, 136);
        ctx.fillStyle = '#000000'; ctx.font = 'bold 40px "Courier Prime", monospace'; ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = labelText.split('|');
        if (words.length > 1) {
            ctx.fillText(words[0], 256, 110); ctx.font = 'bold 30px "Courier Prime", monospace';
            ctx.fillText(words[1], 256, 160);
        } else {
            ctx.fillText(labelText, 256, 128);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        labelMesh.position.set(0, 0, 0.76); box.add(labelMesh);
        interiorGroup.add(box); interiorClickables.push(box);
    };
    createLabeledBox("", -2.5, -2, 0xd7ccc8); // Very Light Brown / Beige
    createLabeledBox("The History|of Mankind", 0, -2, 0xeefebe); // Almost Cream/White-ish
    createLabeledBox("", 2.5, -2, 0xcfcfc4); // Light Grey/Beige
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 10; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    particles.position.y = 3;
    particles.userData = { type: 'atticDust' };
    interiorGroup.add(particles);

    // V201: Attic Video Projection (History Trailer)
    // ------------------------------------------------
    const atticVideo = document.getElementById('attic-video');

    // Create Vignette Alpha Map for Blending
    const vignetteCanvas = document.createElement('canvas');
    vignetteCanvas.width = 512; vignetteCanvas.height = 512;
    const vCtx = vignetteCanvas.getContext('2d');
    // Create radial gradient (white center, black edges)
    const gradient = vCtx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    vCtx.fillStyle = gradient;
    vCtx.fillRect(0, 0, 512, 512);

    const vignetteTex = new THREE.CanvasTexture(vignetteCanvas);
    const videoTex = new THREE.VideoTexture(atticVideo);

    // Material with Alpha Map for blending
    const projMat = new THREE.MeshBasicMaterial({
        map: videoTex,
        alphaMap: vignetteTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending, // Optional: for 'light projection' feel
        side: THREE.DoubleSide
    });

    const projMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.5), projMat);
    // Position on back wall
    projMesh.position.set(0, 3.9, -4.95);
    interiorGroup.add(projMesh);

    // Ensure video loops and plays sound initially
    atticVideo.muted = false; // V210: Auto-play SOUND
    atticVideo.volume = 1.0;
    atticVideo.play().catch(e => console.warn("Attic video autoplay blocked", e));

    // MUTE MAIN AUDIO IMMEDIATELY
    if (window.audioPlayer) {
        window.audioPlayer.pause();
        window.isMusicPlaying = false;
        // Turn Main Music Button RED
        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
    }

    // Audio Toggle Logic
    // Create a physical toggle switch/model
    const toggleGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeo, baseMat);

    const knobGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    // V210: Start GREEN (On)
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.z = 0.1;

    toggleGroup.add(base);
    toggleGroup.add(knob);
    toggleGroup.position.set(2, 1.5, -4.8); // Right side wall/floor area
    toggleGroup.userData = { type: 'atticAudioToggle', state: 'on' }; // Start ON

    interiorGroup.add(toggleGroup);
    interiorClickables.push(toggleGroup);

    // Add Label
    const createToggleLabel = () => {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("PROJECTION AUDIO", 128, 32);
        const t = new THREE.CanvasTexture(c);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
        m.position.set(0, 0.4, 0);
        toggleGroup.add(m);
    };
    createToggleLabel();

    // Toggle Handler
    toggleGroup.toggleAudio = () => {
        const isOff = toggleGroup.userData.state === 'off';
        if (isOff) {
            // Turn ON
            toggleGroup.userData.state = 'on';
            knob.material.color.setHex(0x00ff00); // Green
            atticVideo.muted = false;
            atticVideo.volume = 1.0;

            // Mute Main Audio
            // Mute Main Audio
            if (window.audioPlayer) {
                console.log("Knob ON: Pausing Music");
                window.audioPlayer.pause();
                window.isMusicPlaying = false;

                // Try window global or just global
                if (typeof musicSwitchMesh !== 'undefined') {
                    musicSwitchMesh.material.color.setHex(0xff0000);
                } else if (window.musicSwitchMesh) {
                    window.musicSwitchMesh.material.color.setHex(0xff0000);
                }
            }
        } else {
            // Turn OFF
            toggleGroup.userData.state = 'off';
            knob.material.color.setHex(0xff0000); // Red
            atticVideo.muted = true;
        }
    };

    createProjector();
}

function createProjector() {
    const projGroup = new THREE.Group();
    // Material
    const iron = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.2 });

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
    lenscyl.position.set(0, 0.45, -0.35); // Pointing Back (-Z) or Front?
    projGroup.add(lenscyl);

    // -- LIGHT BEAM --
    // Goal: Narrow at Lens, Very Wide at Wall (Video), Pointing UP at Video.
    // Lens Global: (0, 1.25, -2.35) [Group (0,0.8,-2) + Lens (0,0.45,-0.35)]
    // Target Global (Video Center): (0, 3.0, -4.95)

    // Calculate Vector from Lens to Target relative to Projector Group
    // Lens Local: (0, 0.45, -0.35)
    // Target Local: Target Global - Group Pos
    // Target Global = (0, 3.0, -4.95). Group Pos = (0, 0.8, -2).
    // Target Local = (0, 2.2, -2.95).

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

    // Orientation:
    // Cylinder Y axis is (0, 1, 0).
    // We want +Y (Top/Narrow) to point to Lens (from Midpoint? No, Lens is Top).
    // Vector Top->Bottom is (0, -1, 0).
    // Vector Lens->Target is `vec`.
    // So we want (0, -1, 0) to align with `vec` direction.
    // Or (0, 1, 0) to align with `lensLocal - targetLocal` (which is -vec).
    // Let's align UP (0,1,0) to Vector(Target -> Lens).
    // Target->Lens is -vec.
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
