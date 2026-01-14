function createBasementInterior() {
    // -- METROPOLIS --
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    const gridHelper = new THREE.GridHelper(10, 10, 0x00ffcc, 0x222222);
    gridHelper.position.y = 0.05;
    interiorGroup.add(gridHelper);

    const nodeCount = 60;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
        const isTruth = i % 2 === 0;
        const nodeMat = new THREE.MeshBasicMaterial({ color: isTruth ? 0x00ffcc : 0xff00ff });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set((Math.random() - 0.5) * 8, Math.random() * 6 + 0.5, (Math.random() - 0.5) * 8);
        node.userData = {
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01),
            originalY: node.position.y,
            isTruth: isTruth
        };
        basementNodes.push(node);
        interiorGroup.add(node);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry();
    basementLines = new THREE.LineSegments(lineGeo, lineMat);
    interiorGroup.add(basementLines);

    // -- V16: TRON SPACE VIDEO ON BACK WALL (Kept) --
    videoElement.src = "video/tron-space.mp4";
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));

    videoTexture = new THREE.VideoTexture(videoElement);
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: videoTexture, opacity: 0.5, transparent: true, blending: THREE.AdditiveBlending }));
    bgMesh.position.set(0, 4, -4.9);
    interiorGroup.add(bgMesh);

    // V21: Tron Entry removed per user request (V23)

    const labels = ["SUBCONSCIOUS", "FEARS", "TRUTHS", "MEMORIES"];
    labels.forEach((txt, idx) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        // UPDATED: Use Share Tech Mono font
        ctx.fillStyle = 'white'; ctx.font = 'bold 50px "Share Tech Mono", monospace';
        ctx.textAlign = 'center'; ctx.fillText(txt, 256, 80);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sprite.scale.set(3.5, 0.85, 1);
        sprite.position.set((idx % 2 === 0 ? -3.5 : 3.5), 1.5 + (idx * 1.5), -4.5);
        interiorGroup.add(sprite);
    });
}
