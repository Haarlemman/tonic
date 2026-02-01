function createToiletInterior() {
    console.log("Loading Toilet Interior v24 (V4 Feedback) - Cozy Lamp & Perfect Seat");

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    // V140: Darker Ceramic (0xeeeeff -> 0x8888aa)
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0x8888aa, roughness: 0.2 });
    const toiletGroup = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 32), ceramicMat);
    bowl.position.y = 0.3; bowl.castShadow = true; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat);
    tank.position.set(0, 0.85, -0.3); tank.castShadow = true; toiletGroup.add(tank);

    // Water in Bowl
    const waterGeo = new THREE.CircleGeometry(0.3, 32);
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.4;
    toiletGroup.add(water);

    // Black Toilet Seat - LARGER TO COVER RIM
    // V140: Darker Seat (0x111111 -> 0x050505)
    // Bowl top radius is 0.5.
    // Seat should match.
    // TorusGeometry(radius, tube, radial, tubular)
    // radius = 0.5, tube = 0.1
    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.1 });
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 24, 64), blackWoodMat);
    seat.rotation.x = -Math.PI / 2;
    // seat.rotation.z = Math.PI; 
    seat.position.y = 0.6; // Sit nicely on rim
    // seat.scale.set(1, 1.2, 1); // Oval? Bowl is cylinder (circle).
    seat.castShadow = true;
    toiletGroup.add(seat);

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    // V140: Darker Shelf (0x5D4037 -> 0x2e201b)
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    // Narrow Shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), woodMat);
    shelf.position.set(0, 3.2, shelfZ);
    shelf.castShadow = true;
    interiorGroup.add(shelf);

    // Enlarged Notepad with BOLDER CENTERED TEXT
    const padGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const notepad = new THREE.Mesh(padGeo, padMat);
    notepad.position.set(0.3, 0.045, 0.05);
    notepad.castShadow = true;

    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = 512; lineCanvas.height = 512; // Higher res for clear text
    const lctx = lineCanvas.getContext('2d');
    lctx.fillStyle = '#ffeb3b'; lctx.fillRect(0, 0, 512, 512);
    // Lines
    lctx.fillStyle = '#ccc'; for (let i = 60; i < 512; i += 60) lctx.fillRect(0, i, 512, 2);
    // TEXT: "NOTEPAD" - BOLD & CENTERED
    lctx.fillStyle = '#000000';
    lctx.font = '900 80px "Courier New"'; // Heavy Bold
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';

    // Visualize center of pad. 
    // Texture maps to Top face. Width=X, Height=Z.
    // Text should be centered.
    lctx.fillText("NOTEPAD", 256, 256);

    notepad.material.map = new THREE.CanvasTexture(lineCanvas);
    notepad.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(notepad);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(notepad);

    // HOLOGRAM "WRITE IDEAS"
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
    holoMesh.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(holoMesh);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(holoMesh);

    // VISIBLE LAMP FIXTURE & COZY LIGHT
    const lampGroup = new THREE.Group();
    // Moved UP: Y=2.0 -> 3.5 (relative to shelf) ?? Wait, shelf is at 3.2. 
    // Previous lamp was at shelf.add(lampGroup) at pos (0, 2.0, -0.2).
    // So absolute Y was 3.2 + 2.0 = 5.2. That is quite high.
    // Maybe user meant visible mesh was too low?
    // Let's ensure it's high on the wall.
    // Let's set it to y=2.5 relative to shelf -> Absolute 5.7.
    lampGroup.position.set(0, 2.8, -0.2);
    shelf.add(lampGroup);

    // Fixture
    const fixtureGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x336699, metalness: 0.8, roughness: 0.2 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.rotation.x = Math.PI / 2;
    lampGroup.add(fixture);

    // Bulb/Glass (Warm Yellow)
    const bulbGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.z = 0.1;
    lampGroup.add(bulb);

    // COZY WARM LIGHT (Brighter)
    // V140: Dimmed (0.6 -> 0.3) -> V-FIX: Darker (0.15)
    const backLight = new THREE.PointLight(0xffaa33, 0.15, 15);
    backLight.castShadow = true;
    backLight.shadow.mapSize.width = 1024; // V-REFINE: Sharp Shadows
    backLight.shadow.mapSize.height = 1024;
    backLight.shadow.bias = -0.0001;
    lampGroup.add(backLight);

    // V: FLICKER ANIMATION (Stronger)
    lampGroup.userData = {
        baseIntensity: 0.15, // V-FIX: Match new base
        update: function (t) {
            // Frequent Flicker (15% chance)
            if (Math.random() > 0.85) {
                // Stronger flicker range
                const flicker = (Math.random() - 0.5) * 0.4;
                backLight.intensity = Math.max(0.1, this.baseIntensity + flicker);

                // Visible Bulb Dimming
                // 0.1 Hue = Orange/Yellow. 0.5 * dim controls lightness.
                const dim = 1 + flicker * 2;
                bulb.material.color.setHSL(0.08, 0.9, 0.5 * dim);
            } else {
                // Restore stability
                backLight.intensity += (this.baseIntensity - backLight.intensity) * 0.2;
                bulb.material.color.setHex(0xffaa33);
            }
        }
    };

    // V-WORDHUNT
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('toilet');
        if (item) {
            item.position.set(0, 1.5, 1); // Floating inside room, away from shelf
            interiorGroup.add(item);
        }
    }

    // Bathroom code removed.
}