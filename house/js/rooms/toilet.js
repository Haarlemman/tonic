function createToiletInterior() {
    console.log("Loading Toilet Interior v19 (Restored/Dynamic v2) - WRITE IDEAS");

    const tData = roomContent.toilet;
    const depth = tData.interiorDepth || 10;
    const backZ = -(depth / 2);
    const toiletZ = backZ + 1.0;
    const shelfZ = backZ + 0.5;

    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.2 });
    const toiletGroup = new THREE.Group();
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 16), ceramicMat);
    bowl.position.y = 0.3; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat);
    tank.position.set(0, 0.85, -0.3); toiletGroup.add(tank);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    lid.position.y = 0.62; toiletGroup.add(lid);

    // Scale 2.0 per archive
    toiletGroup.scale.set(2.0, 2.0, 2.0);
    toiletGroup.position.set(0, 0, toiletZ);
    interiorGroup.add(toiletGroup);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
    // Narrow Shelf (2.9 Width - Fits inside 3.0 Room Block)
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), woodMat);
    shelf.position.set(0, 2.5, shelfZ); // Center X=0
    interiorGroup.add(shelf);

    const padGeo = new THREE.BoxGeometry(0.35, 0.02, 0.45);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const notepad = new THREE.Mesh(padGeo, padMat);
    notepad.position.set(0.3, 0.035, 0.05);
    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = 64; lineCanvas.height = 64;
    const lctx = lineCanvas.getContext('2d');
    lctx.fillStyle = '#ffeb3b'; lctx.fillRect(0, 0, 64, 64);
    lctx.fillStyle = '#ccc'; for (let i = 10; i < 64; i += 10) lctx.fillRect(0, i, 64, 1);
    notepad.material.map = new THREE.CanvasTexture(lineCanvas);
    notepad.userData = { type: 'notepad', action: 'openKeyboard' };
    shelf.add(notepad);

    if (typeof interiorClickables !== 'undefined') interiorClickables.push(notepad);

    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512; textCanvas.height = 300;
    const tctx = textCanvas.getContext('2d');
    tctx.font = 'bold 80px "Courier New"'; tctx.fillStyle = '#ffff00'; tctx.textAlign = 'center'; tctx.textBaseline = 'middle';
    tctx.strokeStyle = 'black'; tctx.lineWidth = 4;
    tctx.strokeText("WRITE IDEAS", 256, 100); tctx.fillText("WRITE IDEAS", 256, 100);
    tctx.fillStyle = '#ffff00'; tctx.beginPath(); tctx.moveTo(230, 150); tctx.lineTo(282, 150); tctx.lineTo(256, 220); tctx.fill();
    const textTex = new THREE.CanvasTexture(textCanvas);
    const noteTextSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTex, transparent: true }));
    noteTextSprite.scale.set(1.5, 0.88, 1);
    noteTextSprite.position.set(0.3, 0.5, 0.05);
    shelf.add(noteTextSprite);
}