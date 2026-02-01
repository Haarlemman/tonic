
// --- BEDROOM.JS ---
console.log("Loading Bedroom (V-Modular-Elite)...");

window.createBedroomInterior = function () {

    const bedGroup = new THREE.Group();
    const matMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const cGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);
    [[2, 2.5], [-2, 2.5], [2, -2.5], [-2, -2.5]].forEach(p => { const c = new THREE.Mesh(cGeo, matMat); c.position.set(p[0], 0.3, p[1]); bedGroup.add(c); });

    const frame = new THREE.Mesh(window.createRoundedBox(4.8, 5.8, 0.4, 0.3), new THREE.MeshStandardMaterial({ color: 0x150b04 }));
    frame.rotation.x = Math.PI / 2; frame.position.y = 0.2; bedGroup.add(frame);
    const m1 = new THREE.Mesh(window.createRoundedBox(4, 6, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    m1.rotation.x = Math.PI / 2; m1.position.y = 0.5; bedGroup.add(m1);
    const duvet = new THREE.Mesh(window.createRoundedBox(4.3, 4.5, 0.1, 0.4), new THREE.MeshStandardMaterial({ color: 0x1a070a }));
    duvet.rotation.x = Math.PI / 2; duvet.position.set(0, 0.8, -0.5); bedGroup.add(duvet);
    const pillow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    pillow.rotation.z = Math.PI / 2; pillow.scale.set(0.6, 1, 1); pillow.position.set(0, 0.85, 2.2); bedGroup.add(pillow);
    bedGroup.position.set(2.5, 0, -1); interiorGroup.add(bedGroup);

    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x111111 })); desk.position.set(-2.5, 0.6, -3); interiorGroup.add(desk);

    const lamp = new THREE.Group();
    lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16), matMat));
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), matMat); pole.position.y = 0.4; lamp.add(pole);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xcc8800, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })); shade.position.y = 0.7; lamp.add(shade);
    const bLight = new THREE.PointLight(0xffaa00, 2.5, 8); bLight.position.y = 0.6; bLight.castShadow = true; lamp.add(bLight);
    lamp.scale.setScalar(2); lamp.position.set(-3.8, 1.2, -3.5); interiorGroup.add(lamp);

    const phone = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.2 }));
    phone.position.set(3.2, 4.5, -4.95); interiorGroup.add(phone); interiorClickables.push(phone);
    if (!window.videoElement) { window.videoElement = document.createElement('video'); }
    window.videoTexture = new THREE.VideoTexture(window.videoElement);
    if (roomContent.bedroom.videoPlaylist) { window.videoElement.src = roomContent.bedroom.videoPlaylist[0].src; window.videoElement.pause(); }
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.6), new THREE.MeshBasicMaterial({ map: window.videoTexture })); screen.position.z = 0.06; phone.add(screen);
    phone.userData = { onClick: () => { if (window.videoElement.paused) window.videoElement.play(); else window.videoElement.pause(); } };

    if (roomContent.bedroom.videoPlaylist && window.createUniversalVideoInterface) {
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(-1.8, 4.2, -4.8), roomContent.bedroom.videoPlaylist, { scale: 0.5 });
    }

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1.2), new THREE.MeshStandardMaterial({ color: 0x111111 })); shelf.position.set(-4.6, 3.5, 3.0); interiorGroup.add(shelf);
    const lavaLamp = window.createLavaLamp(0.108, shelf.position); shelf.add(lavaLamp);
    const lavaTicker = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false })); lavaTicker.userData.update = (t) => lavaLamp.userData.update(t); interiorGroup.add(lavaTicker);

    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('bedroom');
        if (item) { item.position.set(0, 3, 0); interiorGroup.add(item); }
    }
};

window.playBedroomVideo = function (index) {
    const pl = roomContent.bedroom.videoPlaylist;
    if (!pl || !pl[index]) return;
    window.videoElement.src = pl[index].src; window.videoElement.load(); window.videoElement.play();
};
