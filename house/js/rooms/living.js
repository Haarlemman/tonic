function createSlideTexture(index) {
    const slide = roomContent.living.tvImages[index];
    if (slide.image) return textureLoader.load(slide.image);
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = slide.color; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 30px Arial'; ctx.textAlign = 'center';
    ctx.fillText(slide.text, 256, 110);
    return new THREE.CanvasTexture(canvas);
}

function nextTVContent() {
    if (!isTVVideoMode) {
        currentSlideIndex = (currentSlideIndex + 1) % roomContent.living.tvImages.length;
        if (tvMesh) { tvMesh.material.map = createSlideTexture(currentSlideIndex); tvMesh.material.needsUpdate = true; }
    }
}

function createLivingRoomInterior() {
    const wallsGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0x8a3500,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const wallGeoHB = new THREE.PlaneGeometry(10, 8);
    const wallGeoV = new THREE.PlaneGeometry(10, 8);

    const wallBack = new THREE.Mesh(wallGeoHB, wallMat);
    wallBack.position.set(0, 4.0, -5.0);
    wallsGroup.add(wallBack);

    const wallLeft = new THREE.Mesh(wallGeoV, wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-5.0, 4.0, 0);
    wallsGroup.add(wallLeft);

    interiorGroup.add(wallsGroup);

    // --- LIGHTING ---
    const cozyLight = new THREE.PointLight(0xffaa00, 1.2, 15);
    cozyLight.position.set(-3.0, 4.0, -2.0);
    interiorGroup.add(cozyLight);

    const librarySpot = new THREE.SpotLight(0xffffff, 2.0);
    librarySpot.position.set(-2, 7.5, 0);
    librarySpot.target.position.set(-5, 3, 0);
    librarySpot.angle = Math.PI / 3;
    librarySpot.penumbra = 0.3;
    interiorGroup.add(librarySpot);
    interiorGroup.add(librarySpot.target);

    // --- BOOKCASES ---
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 1.0 });
    const bookColors = [0x991b1b, 0x1e40af, 0x166534, 0x854d0e, 0x3730a3, 0xfacc15];

    const createBookcase = (posZ) => {
        const bookcaseGroup = new THREE.Group();
        const backing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.2, 2.4), shelfMat);
        backing.position.x = -0.4;
        bookcaseGroup.add(backing);

        const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideL.position.z = -1.2;
        bookcaseGroup.add(sideL);
        const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat);
        sideR.position.z = 1.2;
        bookcaseGroup.add(sideR);

        for (let row = 0; row < 5; row++) {
            const shelfY = 0.5 + (row * 1.0);
            const plank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.4), shelfMat);
            plank.position.y = shelfY - 2.5;
            bookcaseGroup.add(plank);

            if (row === 1 && posZ < 0) {
                // TINTIN ROCKET (Checkered Detailed Model)
                const rocket = new THREE.Group();
                const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
                const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                b2.position.y = 0.2;
                const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
                b3.position.y = 0.4;
                const nose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                nose.position.y = 0.62;
                rocket.add(b1, b2, b3, nose);

                // Iconic fins
                const finMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                for (let i = 0; i < 3; i++) {
                    const fg = new THREE.Group();
                    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.12), finMat);
                    fin.position.y = -0.15; fin.position.z = 0.14; fin.rotation.x = 0.4;
                    fg.add(fin); fg.rotation.y = (Math.PI * 2 / 3) * i; rocket.add(fg);
                }
                rocket.position.set(0.1, shelfY - 2.2, 0);
                bookcaseGroup.add(rocket);
            }
            else if (row === 2 && posZ > 0) {
                // GLOBE
                const globe = new THREE.Group();
                const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05), new THREE.MeshStandardMaterial({ color: 0x333333 }));
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
                ball.position.y = 0.3;
                globe.add(standBase, ball);
                globe.position.set(0.1, shelfY - 2.45, 0);
                bookcaseGroup.add(globe);
            }
            else {
                for (let b = 0; b < 13; b++) {
                    const bW = 0.14;
                    const bH = 0.5 + Math.random() * 0.3;
                    const book = new THREE.Mesh(new THREE.BoxGeometry(0.6, bH, bW),
                        new THREE.MeshStandardMaterial({ color: bookColors[Math.floor(Math.random() * bookColors.length)] }));
                    const yPos = (shelfY - 2.5) + (bH / 2) + 0.05;
                    const zPos = -0.9 + (b * 0.16);
                    book.position.set(0.1, yPos, zPos);
                    bookcaseGroup.add(book);
                }
            }
        }
        bookcaseGroup.position.set(-4.5, 2.6, posZ);
        interiorGroup.add(bookcaseGroup);
    };

    createBookcase(-3.5); createBookcase(3.5);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1), new THREE.MeshStandardMaterial({ color: 0x4a4a4a }));
    stand.position.set(0, 0.75, -4);
    interiorGroup.add(stand);

    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    tvFrame.position.set(0, 2.6, -4.5);
    interiorGroup.add(tvFrame);

    const screenGeo = new THREE.PlaneGeometry(3.3, 1.8);
    tvMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: createSlideTexture(0) }));
    tvMesh.position.set(0, 2.6, -4.39);
    tvMesh.userData = { type: 'tv', action: 'nextContent' };
    interiorGroup.add(tvMesh);
    interiorClickables.push(tvMesh);

    // --- COFFEE TABLE & DECK OF CARDS ---
    // V4: Table 50% Higher (0.4 -> 0.6) and with Shadow
    const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 0.6, 2.25),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 })
    );
    table.position.set(0, 0.3, -1.0); // Y = 0.3 (Half of 0.6)
    table.castShadow = true; table.receiveShadow = true;
    interiorGroup.add(table);

    // V4: BLACK BOOK
    const bookGeo = new THREE.BoxGeometry(0.5, 0.08, 0.8);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    // On top of table (Y=0.6). Book center Y = 0.6 + 0.04 = 0.64
    book.position.set(-0.6, 0.64, -1.2);
    book.rotation.y = 0.2;
    interiorGroup.add(book);

    const cardGeo = new THREE.BoxGeometry(0.6, 0.15, 0.9);
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 256; cardCanvas.height = 384;
    const cctx = cardCanvas.getContext('2d');
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 256, 384);
    cctx.fillStyle = '#000000'; cctx.font = 'bold 22px Arial'; cctx.textAlign = 'center';
    cctx.fillText("CONVERSATION", 128, 170);
    cctx.fillText("TOPICS", 128, 205);

    const cardTex = new THREE.CanvasTexture(cardCanvas);
    const cardMat = new THREE.MeshStandardMaterial({ map: cardTex });

    const cardMesh = new THREE.Mesh(cardGeo, [
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Right
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Left
        cardMat,                                             // Top (Label)
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Bottom
        new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Front
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })  // Back
    ]);
    cardMesh.position.set(0, 0.45, -1.0);
    cardMesh.userData = {
        type: 'deckOfCards',
        topics: ["Free Will", "Movies", "Music", "Relationships", "Family", "Art", "Travel", "Love", "The Future", "Childhood"],
        topicIndex: 0
    };
    interiorGroup.add(cardMesh);
    interiorClickables.push(cardMesh);

    // Hologram topic setup
    const topicCanvas = document.createElement('canvas');
    topicCanvas.width = 512; topicCanvas.height = 128;
    const tctx = topicCanvas.getContext('2d');
    const topicTex = new THREE.CanvasTexture(topicCanvas);
    const topicPlaneMat = new THREE.MeshBasicMaterial({
        map: topicTex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: false
    });
    const topicPlane = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), topicPlaneMat);
    topicPlane.position.set(0, 1.8, -1.0);
    topicPlane.visible = false;
    interiorGroup.add(topicPlane);

    // THE TOPIC SYSTEM - HOLOGRAM BEAM
    window.drawConversationTopic = function () {
        const topics = cardMesh.userData.topics;
        const index = cardMesh.userData.topicIndex;
        const topic = topics[index];

        tctx.clearRect(0, 0, 512, 128);

        // Transparent Cyber Background
        tctx.fillStyle = 'rgba(0, 200, 255, 0.1)';
        tctx.fillRect(0, 0, 512, 128);

        // Scanlines
        tctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        for (let py = 0; py < 128; py += 4) tctx.fillRect(0, py, 512, 1);

        // Frame
        tctx.strokeStyle = '#00ffff'; tctx.lineWidth = 6;
        tctx.strokeRect(4, 4, 504, 120);

        // Text
        tctx.fillStyle = '#ccffff';
        tctx.font = 'bold 50px "Courier New", monospace';
        tctx.textAlign = 'center'; tctx.textBaseline = 'middle';
        tctx.shadowBlur = 15; tctx.shadowColor = '#00ffff';
        tctx.fillText(topic.toUpperCase(), 256, 64);

        topicTex.needsUpdate = true;

        // Show Plane
        topicPlane.visible = true;
        topicPlane.position.set(0, 1.4, -1.0); // Start lower
        topicPlane.scale.set(0.1, 0.1, 0.1);   // Start small
        topicPlaneMat.opacity = 0;

        // Projection Beam Effect (Cone)
        if (!interiorGroup.getObjectByName('holoBeam')) {
            const beamGeo = new THREE.ConeGeometry(0.6, 1.5, 32, 1, true); // Open bottom? No, just cone.
            const beamMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.set(0, 1.0, -1.0); // Base at cards?
            beam.rotation.x = Math.PI; // Point down? No, point up.
            // Cone default points up. Tip at (0, 0.75), Base at (0, -0.75).
            // We want tip at cards (y ~ 0.5). Base at hologram (y ~ 1.8).
            // So we need to invert it?
            beam.geometry.translate(0, 0.75, 0); // Tip is now at 0, 1.5, 0. Base at 0, 0, 0 relative.
            // Actually, ConeGeometry origin is center.
            // Let's just place it.
            beam.position.set(0, 0.6, -1.0);
            beam.scale.set(1, 0.1, 1); // Start flat
            beam.name = 'holoBeam';
            interiorGroup.add(beam);

            // Animate Beam
            new TWEEN.Tween(beam.scale).to({ y: 1 }, 300).easing(TWEEN.Easing.Circular.Out).start();
            new TWEEN.Tween(beam.material).to({ opacity: 0.2 }, 300).start();
        }

        // Pop Up Animation
        new TWEEN.Tween(topicPlaneMat).to({ opacity: 0.9 }, 300).start();
        new TWEEN.Tween(topicPlane.scale).to({ x: 1, y: 1, z: 1 }, 400).easing(TWEEN.Easing.Back.Out).start();
        new TWEEN.Tween(topicPlane.position).to({ y: 1.8 }, 400).easing(TWEEN.Easing.Back.Out).start();

        cardMesh.userData.topicIndex = (index + 1) % topics.length;
    };

    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 32), new THREE.MeshStandardMaterial({ color: 0x7f1d1d })); // Darker Red (900)
    rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02;
    interiorGroup.add(rug);

    const couchMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const couchGroup = new THREE.Group();
    const s = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 1.2), couchMat);
    s.position.y = 0.5; couchGroup.add(s);
    const b = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.3), couchMat);
    b.position.set(0, 1.0, 0.55); couchGroup.add(b);
    const aL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.3), couchMat);
    aL.position.set(-1.6, 0.7, 0); couchGroup.add(aL);
    const aR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.3), couchMat);
    aR.position.set(1.6, 0.7, 0); couchGroup.add(aR);
    couchGroup.position.set(0, -0.3, 2.5); // Lowered to touch floor
    interiorGroup.add(couchGroup);

    const chairGroup = new THREE.Group();
    const cS = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), couchMat);
    cS.position.y = 0.5; chairGroup.add(cS);
    const cB = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.3), couchMat);
    cB.position.set(0, 1.0, 0.55); chairGroup.add(cB);
    const cAL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.3), couchMat);
    cAL.position.set(-0.7, 0.7, 0); chairGroup.add(cAL);
    const cAR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.3), couchMat);
    cAR.position.set(0.7, 0.7, 0); chairGroup.add(cAR);
    chairGroup.position.set(3.5, -0.3, -1.0); // Lowered
    chairGroup.rotation.y = Math.PI / 2;
    interiorGroup.add(chairGroup);

    // V4: Removed Arrow (User Request)
    // const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    // arrow.rotation.x = Math.PI;
    // arrow.position.set(0, 1.2, -1.2);
    // arrow.userData = { type: 'arrow', baseY: 1.2 };
    // interiorGroup.add(arrow);
}
