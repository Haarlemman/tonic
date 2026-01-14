function createToiletInterior() {
    console.log("Loading Toilet Interior v23 (V3 Feedback) - Lamp & Smooth Seat");

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.2 });
    const toiletGroup = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 32), ceramicMat); // Smoother bowl
    bowl.position.y = 0.3; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat);
    tank.position.set(0, 0.85, -0.3); toiletGroup.add(tank);

    // Black Toilet Seat (The "WC Bril") - Torus - SMOOTHED
    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.1 });
    // Increased segments: 12->24 (tubular), 32->64 (radial)
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 24, 64), blackWoodMat);
    seat.rotation.x = -Math.PI / 2;
    seat.position.y = 0.62;
    seat.scale.set(1, 1.2, 1); // Slightly oval
    toiletGroup.add(seat);

    // NO LID (Removed per request)

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    // Narrow Shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), woodMat);
    shelf.position.set(0, 3.2, shelfZ);
    interiorGroup.add(shelf);

    // Enlarged Notepad with TEXT
    const padGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const notepad = new THREE.Mesh(padGeo, padMat);
    notepad.position.set(0.3, 0.045, 0.05);

    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = 256; lineCanvas.height = 256;
    const lctx = lineCanvas.getContext('2d');
    lctx.fillStyle = '#ffeb3b'; lctx.fillRect(0, 0, 256, 256);
    // Lines
    lctx.fillStyle = '#ccc'; for (let i = 40; i < 256; i += 40) lctx.fillRect(0, i, 256, 2);
    // TEXT: "NOTEPAD"
    lctx.fillStyle = '#000000';
    lctx.font = 'bold 40px Courier New';
    lctx.textAlign = 'center';
    lctx.save();
    lctx.translate(128, 128);
    lctx.rotate(-Math.PI / 2); // Text running along the long side? Or just standard?
    // Let's keep it standard horizontal for now, maybe small at top
    lctx.restore();
    lctx.fillText("NOTEPAD", 128, 30); // Top center

    notepad.material.map = new THREE.CanvasTexture(lineCanvas);
    notepad.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(notepad);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(notepad);

    // HOLOGRAM "WRITE IDEAS" - CLICKABLE
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512; holoCanvas.height = 512;
    const hctx = holoCanvas.getContext('2d');

    // Glow
    const g = hctx.createRadialGradient(256, 256, 80, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    hctx.fillStyle = g; hctx.fillRect(0, 0, 512, 512);

    // Text "WRITE IDEAS"
    hctx.fillStyle = '#ccffff';
    hctx.shadowColor = "#00ffff"; hctx.shadowBlur = 10;
    hctx.font = "bold 60px Courier New"; hctx.textAlign = "center";
    hctx.fillText("WRITE", 256, 220);
    hctx.fillText("IDEAS", 256, 290);

    const holoTex = new THREE.CanvasTexture(holoCanvas);
    const holoMat = new THREE.MeshBasicMaterial({
        map: holoTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const holoMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), holoMat);
    holoMesh.position.set(0.3, 1.2, 0.05); // Above notepad
    // Clickable Hologram
    holoMesh.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(holoMesh);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(holoMesh);

    // VISIBLE LAMP FIXTURE & LIGHT
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, 2.0, -0.2); // Just above/behind shelf center
    shelf.add(lampGroup);

    // Fixture
    const fixtureGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.rotation.x = Math.PI / 2; // Stick out of wall
    lampGroup.add(fixture);

    // Bulb/Glass
    const bulbGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffee }); // Glowing appearance
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.z = 0.1;
    lampGroup.add(bulb);

    // High Contrast Light
    const backLight = new THREE.PointLight(0xffaa00, 1.5, 8); // Stronger intensity, lower range for contrast
    lampGroup.add(backLight);
}