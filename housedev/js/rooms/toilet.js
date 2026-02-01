
// --- TOILET.JS ---
console.log("Loading Toilet Room (V-Modular-Elite)...");

window.createToiletInterior = function () {
    const depth = 10, backZ = -5, toiletZ = backZ + 1, shelfZ = backZ + 0.5;
    const toiletGroup = new THREE.Group();
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0x8888aa, roughness: 0.2 });
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.6, 32), ceramicMat); bowl.position.y = 0.3; bowl.castShadow = true; toiletGroup.add(bowl);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), ceramicMat); tank.position.set(0, 0.85, -0.3); tank.castShadow = true; toiletGroup.add(tank);
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), new THREE.MeshPhongMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8, shininess: 100 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.4; toiletGroup.add(water);
    const seat = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 24, 64), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.1 })); seat.rotation.x = -Math.PI / 2; seat.position.y = 0.6; seat.castShadow = true; toiletGroup.add(seat);
    toiletGroup.scale.setScalar(2); toiletGroup.position.set(0, 0, toiletZ); interiorGroup.add(toiletGroup);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: 0x2e201b })); shelf.position.set(0, 3.2, shelfZ); shelf.castShadow = true; interiorGroup.add(shelf);

    const padGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffeb3b'; ctx.fillRect(0, 0, 512, 512); ctx.fillStyle = '#ccc'; for (let i = 60; i < 512; i += 60) ctx.fillRect(0, i, 512, 2);
    ctx.fillStyle = '#000000'; ctx.font = '900 80px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText("NOTEPAD", 256, 256);
    const notepad = new THREE.Mesh(padGeo, new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas), color: 0xffeb3b }));
    notepad.position.set(0.3, 0.045, 0.05); notepad.userData = { type: 'notepad', action: 'openKeyboard' }; shelf.add(notepad); interiorClickables.push(notepad);

    const hCan = document.createElement('canvas'); hCan.width = 512; hCan.height = 512;
    const hCtx = hCan.getContext('2d'); const g = hCtx.createRadialGradient(256, 256, 80, 256, 256, 250); g.addColorStop(0, 'rgba(0,255,255,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    hCtx.fillStyle = g; hCtx.fillRect(0, 0, 512, 512); hCtx.fillStyle = '#ccffff'; hCtx.shadowColor = "#00ffff"; hCtx.shadowBlur = 10; hCtx.font = 'bold 60px Arial'; hCtx.textAlign = "center";
    hCtx.fillText("WRITE", 256, 220); hCtx.fillText("IDEAS", 256, 290);
    const holoMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hCan), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    holoMesh.position.set(0.3, 1.2, 0.05); holoMesh.userData = { type: 'notepad', action: 'openKeyboard' }; shelf.add(holoMesh); interiorClickables.push(holoMesh);

    const lampGroup = new THREE.Group(); lampGroup.position.set(0, 2.8, -0.2); shelf.add(lampGroup);
    lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x336699, metalness: 0.8, roughness: 0.2 })));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffaa33 })); bulb.position.z = 0.1; lampGroup.add(bulb);
    const light = new THREE.PointLight(0xffaa33, 0.15, 15); light.castShadow = true; light.shadow.radius = 4; light.shadow.bias = -0.0001; lampGroup.add(light);
    lampGroup.userData.update = (t) => {
        if (Math.random() > 0.85) { const f = (Math.random() - 0.5) * 0.4; light.intensity = Math.max(0.1, 0.15 + f); bulb.material.color.setHSL(0.08, 0.9, 0.5 * (1 + f * 2)); }
        else { light.intensity += (0.15 - light.intensity) * 0.2; bulb.material.color.setHex(0xffaa33); }
    };
    const ticker = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false })); ticker.userData.update = (t) => lampGroup.userData.update(t); interiorGroup.add(ticker);

    const lavaLamp = window.createLavaLamp(0.108, new THREE.Vector3(-1.0, 0.25, 0.05)); shelf.add(lavaLamp);
    const lavaTicker = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false })); lavaTicker.userData.update = (t) => lavaLamp.userData.update(t); interiorGroup.add(lavaTicker);

    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('toilet');
        if (item) { item.position.set(0, 1.5, 1); interiorGroup.add(item); }
    }
};
