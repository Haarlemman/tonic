
// --- AISPACE.JS ---
console.log("Loading AI Space (V-Modular-Elite)...");

window.createAISpaceInterior = function () {
    const bg = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })); interiorGroup.add(bg);
    const starGeo = new THREE.BufferGeometry(); const starPos = [];
    for (let i = 0; i < 800; i++) {
        const r = 20 + Math.random() * 15, t = Math.random() * Math.PI * 2, p = Math.acos((Math.random() * 2) - 1);
        starPos.push(r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p));
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    interiorGroup.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })));

    const floatGrp = new THREE.Group(); floatGrp.position.set(0, 2, -3); interiorGroup.add(floatGrp);
    floatGrp.add(new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 })));
    const lap = new THREE.Group(); lap.position.y = 0.1; floatGrp.add(lap);
    lap.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x888888 })));
    const scr = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: 0x0000ff })); scr.position.set(0, 0.35, -0.25); scr.rotation.x = 0.2; lap.add(scr);

    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
    tick.userData.update = (t) => { floatGrp.position.y = 2 + Math.sin(t) * 0.2; floatGrp.rotation.z = Math.sin(t * 0.5) * 0.05; };
    interiorGroup.add(tick);

    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('aispace');
        if (item) {
            item.position.set(0, 4, 0); interiorGroup.add(item);
            const l = new THREE.PointLight(0xffaa00, 2, 10); l.position.set(0, 4, 0); interiorGroup.add(l);
            const lTick = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
            lTick.userData.update = (t) => { l.intensity = 2 + Math.sin(t * 3) * 0.5; item.position.y = 4 + Math.sin(t * 2) * 0.1; };
            interiorGroup.add(lTick);
        }
    }

    const shoot = () => {
        if (currentRoom !== 'aispace') return;
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        s.position.set(-20, 10 + Math.random() * 5, -10); interiorGroup.add(s);
        new TWEEN.Tween(s.position).to({ x: 20, y: 5, z: -10 }, 1000).onComplete(() => interiorGroup.remove(s)).start();
        setTimeout(shoot, 2000 + Math.random() * 3000);
    };
    shoot();
};
