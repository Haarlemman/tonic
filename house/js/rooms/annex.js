function createAnnexInterior() {
    // --- LIGHTING ---
    const candleLight = new THREE.PointLight(0xffaa00, 1.2, 12);
    candleLight.position.set(1.0, 1.8, -1.0); // On the rotated desk
    candleLight.castShadow = true;
    candleLight.userData = {
        baseIntensity: 1.2,
        update: (t) => { candleLight.intensity = 1.2 + Math.sin(t * 15) * 0.15 + Math.cos(t * 33) * 0.15; }
    };
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial({ visible: false }));
    animator.userData = { update: (t) => { candleLight.userData.update(t); } };
    interiorGroup.add(animator);
    interiorGroup.add(candleLight);

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
    bed.position.set(-1.0, 0.2, 0);
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

    // 2. Door-sized Desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.9 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.2), deskMat);
    desk.position.set(0.3, 1.1, -1.3);
    interiorGroup.add(desk);

    // Chair
    const chair = createAnnexChair();
    chair.position.set(0.2, 0, -0.6);
    interiorGroup.add(chair);

    // Candle on Desk
    const candleStick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffee }));
    candleStick.position.set(1.0, 1.35, -1.2);
    interiorGroup.add(candleStick);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    flame.position.set(1.0, 1.7, -1.2);
    interiorGroup.add(flame);

    // 3. Wall mounted Bookshelves
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

    // 4. Narrow Suitcase
    const suitcase = createSuitcase();
    suitcase.scale.set(1.0, 1.0, 1.4);
    suitcase.position.set(1.4, 0.2, 1.6);
    suitcase.rotation.y = 0.4;
    interiorGroup.add(suitcase);
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
