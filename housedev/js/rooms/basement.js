
// --- BASEMENT.JS ---
console.log("Loading Basement Room...");

window.createBasementInterior = function () {
    // Metro Floor
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    const gridHelper = new THREE.GridHelper(10, 10, 0x00ffcc, 0x222222);
    gridHelper.position.y = 0.05;
    interiorGroup.add(gridHelper);

    // Floating Nodes
    window.basementNodes = [];
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
        window.basementNodes.push(node);
        interiorGroup.add(node);
    }

    // Lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry();
    window.basementLines = new THREE.LineSegments(lineGeo, lineMat);
    interiorGroup.add(window.basementLines);

    // TRON Video
    const videoElement = window.videoElement;
    videoElement.src = "../assets/video/tron-space.mp4";
    videoElement.muted = true; videoElement.loop = true;
    videoElement.play().catch(e => console.warn(e));

    const videoTexture = new THREE.VideoTexture(videoElement);
    const bgMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 8),
        new THREE.MeshBasicMaterial({ map: videoTexture, opacity: 0.5, transparent: true, blending: THREE.AdditiveBlending })
    );
    bgMesh.position.set(0, 4, -4.9);
    interiorGroup.add(bgMesh);

    // Word Hunt Item
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('basement');
        if (item) {
            item.position.set(-2, 2, -2);
            interiorGroup.add(item);
        }
    }
};
