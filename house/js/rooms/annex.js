function createAnnexInterior() {
    // --- LIGHTING ---
    // Only 1 candle source
    const candleLight = new THREE.PointLight(0xffaa00, 0.8, 8);
    candleLight.position.set(0, 1.2, 0); // Center of room, low float
    candleLight.castShadow = true;
    // Flicker logic via UserData update
    candleLight.userData = {
        baseIntensity: 0.8,
        speed: 10,
        update: (t) => {
            candleLight.intensity = 0.8 + Math.sin(t * 15) * 0.1 + Math.cos(t * 33) * 0.1;
        }
    };
    // Hook into global animator if possible, or add to interiorGroup Children loop hack
    // We'll add a helper mesh for update loop
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial({ visible: false }));
    animator.userData = {
        update: (t) => { candleLight.userData.update(t); }
    };
    interiorGroup.add(animator);
    interiorGroup.add(candleLight);

    // --- CONTENT ---

    // 1. Simple Bed (Mattress on floor)
    const bedGeo = new THREE.BoxGeometry(1.2, 0.2, 2.0);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Dark Grey
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(-1.0, 0.1, -0.5);
    interiorGroup.add(bed);

    // Pillow
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.5), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    pillow.position.set(-1.0, 0.25, -1.2);
    interiorGroup.add(pillow);

    // 2. Candle on a Crate
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    crate.position.set(0, 0.3, 0);
    interiorGroup.add(crate);

    const candleStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffee }));
    candleStick.position.set(0, 0.75, 0);
    interiorGroup.add(candleStick);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    flame.position.set(0, 0.95, 0);
    interiorGroup.add(flame);

    // 3. Pile of Books
    const bookColors = [0x5d4037, 0x2e7d32, 0x1565c0, 0xb71c1c];
    for (let i = 0; i < 5; i++) {
        const bGeo = new THREE.BoxGeometry(0.3, 0.05, 0.4);
        const bMat = new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] });
        const book = new THREE.Mesh(bGeo, bMat);
        // Stacked messily
        book.position.set(1.0 + (Math.random() * 0.1), 0.025 + (i * 0.05), 0.5 + (Math.random() * 0.1));
        book.rotation.y = Math.random() * 0.5;
        interiorGroup.add(book);
    }
}
