
// --- STUDIO.JS ---
console.log("Loading Studio (V-Modular-Elite)...");

window.createStudioInterior = function () {
    const furnGroup = new THREE.Group(); furnGroup.scale.setScalar(1.25); interiorGroup.add(furnGroup);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x463732 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 1.5), deskMat); desk.position.set(0, 1.0, -1.5); desk.receiveShadow = true; furnGroup.add(desk);
    [[-1.4, 0.65], [1.4, 0.65], [-1.4, -0.65], [1.4, -0.65]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.1), deskMat); l.position.set(p[0], -0.5, p[1]); l.castShadow = true; desk.add(l);
    });

    const laptop = new THREE.Group(); laptop.scale.setScalar(1.33); laptop.position.y = 0.15; desk.add(laptop);
    laptop.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 })));
    const lScreen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: 0x111111 })); lScreen.position.set(0, 0.2, -0.2); lScreen.rotation.x = 0.2; laptop.add(lScreen);
    lScreen.add(new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0044aa, emissiveIntensity: 2.0 })));

    const hCan = document.createElement('canvas'); hCan.width = 512; hCan.height = 256;
    const ctx = hCan.getContext('2d'); const g = ctx.createRadialGradient(256, 128, 20, 256, 128, 200); g.addColorStop(0, 'rgba(0,255,255,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256); ctx.font = 'bold 40px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#ccffff'; ctx.shadowColor = 'cyan'; ctx.shadowBlur = 10;
    ctx.fillText("EXPAND", 256, 80); ctx.fillText("YOUR MIND", 256, 150);
    const holo = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hCan), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    holo.position.y = 0.8; laptop.add(holo);

    const chairMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), chairMat); seat.position.set(0, 0.8, 0.5); seat.castShadow = true; furnGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), chairMat); back.position.set(0, 0.5, 0.4); seat.add(back);
    seat.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), chairMat)).position.y = -0.4;

    furnGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0x750f31 }))).position.y = 0.02;

    const createVideoPoster = (src, op, pos, rot, scl) => {
        const v = document.createElement('video'); v.src = src; v.loop = true; v.muted = true; v.autoplay = true; v.playsInline = true; v.play();
        const m = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 6.3), new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(v), transparent: true, opacity: op, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
        m.position.copy(pos); m.rotation.set(rot.x, rot.y, rot.z); m.scale.setScalar(scl); interiorGroup.add(m);
    };
    createVideoPoster('../assets/video/mepo.mp4', 0.8, new THREE.Vector3(1.0, 5, -4.9), new THREE.Vector3(0, 0, 0), 1);
    createVideoPoster('../assets/video/tronai.mp4', 0.9, new THREE.Vector3(-4.9, 5, 3.5), new THREE.Vector3(0, Math.PI / 2, 0), 0.75);

    const atomGroup = new THREE.Group(); atomGroup.position.set(-3, 4, -3); interiorGroup.add(atomGroup);
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 })); atomGroup.add(nucleus);
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('studio');
        if (item) {
            item.position.setScalar(0); item.scale.setScalar(0.1); item.visible = false; atomGroup.add(item);
            nucleus.userData = {
                onClick: () => {
                    if (item.userData.revealed) return;
                    item.visible = true; item.userData.revealed = true;
                    new TWEEN.Tween(item.position).to({ y: 1.5, x: 0.5, z: 0.5 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                    new TWEEN.Tween(item.scale).to({ x: 1, y: 1, z: 1 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                }
            };
            interiorClickables.push(new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ visible: false })).add(nucleus).parent); // Wrap nucleus in hitBox
            interiorClickables.push(nucleus);
        }
    }
    const createOrbit = (col, rx, ry, rz, speed) => {
        const g = new THREE.Group(); g.rotation.set(rx, ry, rz); atomGroup.add(g);
        g.add(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.02, 8, 50), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3 })));
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: col })); e.position.x = 1.5; g.add(e);
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
        t.userData.update = (time) => { e.position.set(Math.cos(time * speed) * 1.5, Math.sin(time * speed) * 1.5, 0); };
        g.add(t);
    };
    createOrbit(0xff0000, 0, 0, 0, 5); createOrbit(0xffff00, Math.PI / 2, 0, 0, 4); createOrbit(0x00ccff, 0, Math.PI / 2, Math.PI / 4, 6);

    // R2D2
    const r2 = new THREE.Group(); r2.scale.setScalar(0.33); r2.position.set(3.5, 0, -3.5); r2.rotation.y = -Math.PI / 4; interiorGroup.add(r2);
    r2.add(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 32), new THREE.MeshStandardMaterial({ color: 0xbbbbbb })));
    const d = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16, 0, 6.28, 0, 1.57), new THREE.MeshStandardMaterial({ color: 0xaaaaaa })); d.position.y = 1.5; r2.add(d);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.35, 6, 32, 12, true), new THREE.MeshBasicMaterial({ color: 0x44eeff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    beam.rotation.x = Math.PI; beam.position.set(0, 1.5, 1.3); beam.rotation.x += 0.7; d.add(beam);
};
