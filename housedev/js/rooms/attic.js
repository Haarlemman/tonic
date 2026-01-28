function createAtticInterior() {
    const createColoredBox = (labelText, labelColor, boxColor, x, z) => {
        // Box
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

        const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), boxMat);
        lid.position.y = 0.8;
        lid.castShadow = true;
        lid.receiveShadow = true;
        box.add(lid);

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
        labelMesh.position.set(0, 0, 0.76); // Front face
        box.add(labelMesh);

        interiorGroup.add(box);
    };

    // 1. LEFT BOX: RED "BEAUTY"
    // V306: Moved from -3.0 to -1.8 (Inside walls)
    createColoredBox("BEAUTY", '#ffffff', 0xd32f2f, -1.8, -1.8);

    // 2. MIDDLE BOX: YELLOW "KNOWLEDGE"
    // V306: Moved from (0, -3.0) to (0, -1.8)
    createColoredBox("KNOWLEDGE", '#000000', 0xfbc02d, 0, -1.8);

    // 3. RIGHT BOX: DEEP-BLUE "WISDOM"
    // V306: Moved from 3.0 to 1.8 (Inside walls) and Z -1.8
    createColoredBox("WISDOM", '#ffffff', 0x1a237e, 1.8, -1.8);

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

    interiorGroup.add(lampGroup);
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
