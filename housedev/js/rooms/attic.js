
// --- ATTIC.JS ---
console.log("Loading Attic Room...");

window.createAtticInterior = function () {
    // 1. LEFT BOX: RED "BEAUTY"
    createColoredBox("BEAUTY", '#ffffff', 0xd32f2f, -2.5, -1.8);

    // 2. MIDDLE BOX: YELLOW "KNOWLEDGE"
    createColoredBox("KNOWLEDGE", '#000000', 0xfbc02d, 0, -1.8);

    // 3. RIGHT BOX: DEEP-BLUE "WISDOM"
    const wisdomBox = createColoredBox("WISDOM", '#ffffff', 0x1a237e, 2.5, -1.8);

    // Dust Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 10; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.1 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    particles.position.y = 3;
    interiorGroup.add(particles);

    // Wall Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-4.0, 5.0, -4.8);

    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.6 }));
    mount.rotation.x = Math.PI / 2; mount.position.z = -0.1; lampGroup.add(mount);

    const arm = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0xb5a642 }));
    arm.rotation.y = Math.PI / 2; arm.position.set(0, 0.2, 0.3); lampGroup.add(arm);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.6, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xfdfbd3, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    shade.position.set(0, -0.2, 0.7); lampGroup.add(shade);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    bulb.position.y = -0.2; shade.add(bulb);

    const light = new THREE.PointLight(0xffaa00, 2.5, 25);
    light.castShadow = true; light.shadow.radius = 4;
    light.position.y = -0.5; shade.add(light);

    interiorGroup.add(lampGroup);

    // Projector
    createProjector();
};

function createColoredBox(labelText, labelColor, boxColor, x, z) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: boxColor, roughness: 0.6 }));
    box.position.set(x, 0.75, z);
    box.castShadow = true; box.receiveShadow = true;

    // Void Top
    const voidPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    voidPlane.rotation.x = -Math.PI / 2; voidPlane.position.y = 0.76;
    box.add(voidPlane);

    // Lid
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.75, -0.75);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), box.material);
    lid.position.set(0, 0.05, 0.8);
    lidPivot.add(lid);
    box.add(lidPivot);

    // Label
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = labelColor; ctx.font = 'bold 60px "Courier Prime", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(labelText, 256, 128);
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.65), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
    labelMesh.position.set(0, 0, 0.82);
    box.add(labelMesh);

    interiorGroup.add(box);

    // Interaction
    if (labelText === "WISDOM") {
        let orbItem = null;
        if (typeof WordHunt !== 'undefined') orbItem = WordHunt.createInteractable('attic');
        // Fallback Orb
        if (!orbItem) {
            orbItem = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff }));
            orbItem.userData = { type: 'dummyOrb' };
        }

        if (orbItem) {
            orbItem.position.set(0, 0.5, 0); orbItem.scale.set(0.1, 0.1, 0.1); orbItem.visible = false;
            box.add(orbItem);
        }

        const openBox = () => {
            if (!box.userData.isOpen) {
                box.userData.isOpen = true;
                new TWEEN.Tween(lidPivot.rotation).to({ x: -Math.PI * 0.6 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
                if (orbItem) {
                    orbItem.visible = true; orbItem.userData.revealed = true;
                    new TWEEN.Tween(orbItem.position).to({ y: 1.8 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                    new TWEEN.Tween(orbItem.scale).to({ x: 1.0, y: 1.0, z: 1.0 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                }
            } else {
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

        // Hitbox
        const hitBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ visible: false }));
        hitBox.position.copy(box.position);
        hitBox.userData = { onClick: openBox, type: 'wisdomBox_HitBox' };
        interiorGroup.add(hitBox);
        if (window.interiorClickables) window.interiorClickables.push(hitBox);
    }
    return box;
}

function createProjector() {
    const projGroup = new THREE.Group();
    const iron = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 1.0, roughness: 0.2 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), iron); base.position.y = 0.1; projGroup.add(base);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.5), iron); body.position.y = 0.4; projGroup.add(body);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2), chrome); lens.rotation.x = Math.PI / 2; lens.position.set(0, 0.45, -0.35); projGroup.add(lens);

    // Beam
    const height = 3.5;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 2.5, height, 64, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(0, 1.5, -2.0); // Rough placement
    beam.rotation.x = Math.PI / 4;
    projGroup.add(beam);

    // Reels
    const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32), chrome);
    reel.rotation.z = Math.PI / 2; reel.position.set(0, 0.75, 0.1); projGroup.add(reel);
    const reel2 = reel.clone(); reel2.position.set(0, 0.75, -0.15); projGroup.add(reel2);

    // Place on Middle Box (Knowledge - Yellow)
    projGroup.position.set(0, 0.8, -1.8); // On top of Knowledge box
    projGroup.scale.set(1.5, 1.5, 1.5);
    interiorGroup.add(projGroup);
}
