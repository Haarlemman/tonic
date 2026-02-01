
// --- ANNEX.JS ---
console.log("Loading Annex Room (V-Modular-Elite)...");

function createAnnexChair() {
    const chair = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), woodMat);
    seat.position.y = 0.5; seat.castShadow = true; seat.receiveShadow = true; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), woodMat);
    back.position.set(0, 0.9, 0.25); back.castShadow = true; back.receiveShadow = true; chair.add(back);
    const legGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
    for (let x of [-0.25, 0.25]) for (let z of [-0.25, 0.25]) {
        const leg = new THREE.Mesh(legGeo, woodMat); leg.position.set(x, 0.25, z); leg.castShadow = true; leg.receiveShadow = true; chair.add(leg);
    }
    chair.scale.setScalar(1.1); return chair;
}

function createSuitcase() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    bottom.castShadow = true; bottom.receiveShadow = true; bottom.position.y = 0.1; group.add(bottom);

    const lidGroup = new THREE.Group(); lidGroup.position.set(0, 0.2, -0.25);
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.5), bodyMat);
    lidMesh.position.set(0, 0.1, 0.25); lidMesh.castShadow = true; lidMesh.receiveShadow = true; lidGroup.add(lidMesh);
    const strapGeo = new THREE.BoxGeometry(0.05, 0.22, 0.52);
    const s1 = new THREE.Mesh(strapGeo, new THREE.MeshStandardMaterial({ color: 0x2b1d14 })); s1.position.set(-0.25, 0.1, 0.25); lidGroup.add(s1);
    const s2 = s1.clone(); s2.position.set(0.25, 0.1, 0.25); lidGroup.add(s2);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI * 2), metalMat);
    handle.rotation.set(-Math.PI / 2, 0, Math.PI / 2); handle.position.set(0, 0.2, 0.25); lidGroup.add(handle);
    group.add(lidGroup);

    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('annex');
        if (item) {
            item.position.set(0, 0.3, 0); item.scale.setScalar(0.1); item.visible = false; group.add(item);
            const openSuitcase = () => {
                if (!lidGroup.userData.isOpen) {
                    lidGroup.userData.isOpen = true;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: -Math.PI / 2.5 }, 1200).easing(TWEEN.Easing.Quadratic.Out).start();
                    item.visible = true; item.userData.revealed = true;
                    new TWEEN.Tween(item.position).to({ y: 1.5 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                    new TWEEN.Tween(item.scale).to({ x: 1, y: 1, z: 1 }, 1800).easing(TWEEN.Easing.Elastic.Out).start();
                } else {
                    lidGroup.userData.isOpen = false;
                    new TWEEN.Tween(lidGroup.rotation).to({ x: 0 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                    new TWEEN.Tween(item.position).to({ y: 0.3 }, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(() => { if (!lidGroup.userData.isOpen) item.visible = false; }).start();
                    new TWEEN.Tween(item.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 800).easing(TWEEN.Easing.Quadratic.In).start();
                }
            };
            const hit = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
            hit.position.y = 0.3; hit.userData = { onClick: openSuitcase, type: 'suitcase' }; group.add(hit);
            if (window.interiorClickables) window.interiorClickables.push(hit);
        }
    }
    return group;
}

function addDeskItems(deskGroup) {
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffffc, roughness: 0.8 });
    for (let i = 0; i < 5; i++) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), paperMat);
        p.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI);
        p.position.set((Math.random() - 0.5) * 2.5, 1.08 + i * 0.001, (Math.random() - 0.5) * 0.8);
        deskGroup.add(p);
    }
    const newsCanvas = document.createElement('canvas'); newsCanvas.width = 256; newsCanvas.height = 256;
    const nctx = newsCanvas.getContext('2d'); nctx.fillStyle = '#cccccc'; nctx.fillRect(0, 0, 256, 256);
    nctx.fillStyle = '#333333'; nctx.font = 'bold 20px serif'; nctx.fillText("DAILY GAZETTE", 40, 50); nctx.fillRect(40, 60, 180, 2);
    for (let i = 0; i < 10; i++) nctx.fillRect(40, 80 + i * 15, 180, 8);
    const news = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(newsCanvas) }));
    news.rotation.x = -Math.PI / 2; news.position.set(1.2, 1.085, 0.2); news.rotation.z = 0.4; deskGroup.add(news);

    const diaryGroup = new THREE.Group();
    const pageGeo = new THREE.PlaneGeometry(0.25, 0.35);
    const leftPage = new THREE.Mesh(pageGeo, paperMat); leftPage.position.x = -0.125; leftPage.rotation.y = 0.15;
    const rightPage = new THREE.Mesh(pageGeo, paperMat); rightPage.position.x = 0.125; rightPage.rotation.y = -0.15;
    diaryGroup.add(leftPage, rightPage); diaryGroup.rotation.x = -Math.PI / 2; diaryGroup.position.set(0, 1.1, 0.1);
    diaryGroup.userData = {
        type: 'diary', onClick: () => {
            if (!window.diaryHologram) return;
            if (window.diaryHologram.visible) {
                new TWEEN.Tween(window.diaryHologram.scale).to({ x: 0, y: 0, z: 0 }, 500).onComplete(() => { window.diaryHologram.visible = false; }).start();
            } else {
                window.diaryHologram.visible = true;
                new TWEEN.Tween(window.diaryHologram.scale).to({ x: 1, y: 1, z: 1 }, 1000).easing(TWEEN.Easing.Elastic.Out).start();
            }
        }
    };
    deskGroup.add(diaryGroup);
    if (window.interiorClickables) window.interiorClickables.push(diaryGroup);
}

function createDiaryHologram(parent) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(256, 512, 0, 256, 512, 512); g.addColorStop(0, 'rgba(0,255,255,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 1024);
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 15; ctx.font = '900 42px Arial'; ctx.textAlign = 'center';
    const lines = ['"You should', 'always be', 'prepared to', 'pack your', 'bags and', 'move west..."'];
    lines.forEach((l, i) => ctx.fillText(l, 256, 320 + i * 70));
    const mat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 4), mat);
    mesh.geometry.translate(0, 2, 0); mesh.position.set(0, 1.1, 0.2); mesh.scale.setScalar(0); mesh.visible = false;
    parent.add(mesh); window.diaryHologram = mesh;
}

function createRothkoPainting() {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 921;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9, emissive: 0x111111, emissiveIntensity: 0.2 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.7), mat);
    mesh.position.set(-0.4, 3.5, -1.95); interiorGroup.add(mesh);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.05), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }));
    frame.position.set(-0.4, 3.5, -2.0); frame.castShadow = true; frame.receiveShadow = true; interiorGroup.add(frame);
    const light = new THREE.PointLight(0xffeecc, 0.3, 10); light.position.set(2, 4, 2); light.castShadow = true; interiorGroup.add(light);

    const palettes = [['#8B0000', '#FF4500', '#FFD700'], ['#4B0082', '#8B008B', '#FF1493'], ['#2F4F4F', '#1C1C1C', '#8B4513']];
    let bgState = { h: 200, s: 30, l: 20 }, bgTarget = { h: 200, s: 30, l: 20 };
    const blocks = [{ h: 0, s: 70, l: 50, targetH: 0, targetS: 70, targetL: 50, weight: 1, targetWeight: 1 }, { h: 0, s: 70, l: 50, targetH: 0, targetS: 70, targetL: 50, weight: 1, targetWeight: 1 }, { h: 0, s: 70, l: 50, targetH: 0, targetS: 70, targetL: 50, weight: 1, targetWeight: 1 }];
    const hexToHSL = (hex) => {
        let r = parseInt(hex.substr(1, 2), 16) / 255, g = parseInt(hex.substr(3, 2), 16) / 255, b = parseInt(hex.substr(5, 2), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
        if (max === min) h = s = 0; else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
        return { h: h * 360, s: s * 100, l: l * 100 };
    };
    const pick = () => {
        const p = palettes[Math.floor(Math.random() * palettes.length)].map(hexToHSL);
        bgTarget.h = p.reduce((a, c) => a + c.h, 0) / p.length;
        blocks.forEach((b, i) => { const c = p[i % p.length]; b.targetH = c.h; b.targetS = c.s; b.targetL = c.l; b.targetWeight = 1.0 + Math.random() * 0.5; });
    };
    pick();
    mesh.userData.update = (t) => {
        if (Math.random() > 0.995) pick();
        const dt = 0.01;
        bgState.h += (bgTarget.h - bgState.h) * dt; bgState.l += (bgTarget.l - bgState.l) * dt;
        ctx.fillStyle = `hsl(${bgState.h},${bgState.s}%,${bgState.l}%)`; ctx.fillRect(0, 0, 512, 921);
        ctx.filter = 'blur(30px)';
        let y = 50, totW = blocks.reduce((a, b) => a + b.weight, 0);
        blocks.forEach(b => {
            b.weight += (b.targetWeight - b.weight) * dt; b.h += (b.targetH - b.h) * dt; b.l += (b.targetL - b.l) * dt;
            const h = (b.weight / totW) * (921 - 100);
            ctx.fillStyle = `hsl(${b.h},${b.s}%,${b.l}%)`; ctx.fillRect(40, y, 432, h); y += h + 10;
        });
        ctx.filter = 'none'; tex.needsUpdate = true;
    };
}

window.createAnnexInterior = function () {
    const createRoundedBox = (w, h, d, r) => {
        const shape = new THREE.Shape(); const x = -w / 2, y = -h / 2;
        shape.moveTo(x, y + r); shape.lineTo(x, y + h - r); shape.quadraticCurveTo(x, y + h, x + r, y + h); shape.lineTo(x + w - r, y + h); shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r); shape.lineTo(x + w, y + r); shape.quadraticCurveTo(x + w, y, x + w - r, y); shape.lineTo(x + r, y); shape.quadraticCurveTo(x, y, x, y + r);
        return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
    };

    const bed = new THREE.Mesh(createRoundedBox(1.8, 3.8, 0.4, 0.2), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1.0 }));
    bed.rotation.x = Math.PI / 2; bed.position.set(-0.9, 0.4, 0); bed.castShadow = true; bed.receiveShadow = true; interiorGroup.add(bed);
    const pillow = new THREE.Mesh(createRoundedBox(1.4, 0.7, 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    pillow.rotation.x = Math.PI / 2; pillow.position.set(-0.9, 0.45, 1.4); pillow.castShadow = true; pillow.receiveShadow = true; interiorGroup.add(pillow);
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0 }));
    blanket.position.set(-0.9, 0.41, -0.1); interiorGroup.add(blanket);

    const chair = createAnnexChair(); chair.position.set(0.5, 0, -0.8); chair.rotation.y = -0.3; interiorGroup.add(chair);

    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const darkBooks = [0x1a1510, 0x2b1d14, 0x0a0a0a, 0x3e2723, 0x1b2612];
    function createWallShelf(x, y, z) {
        const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.6), shelfMat));
        for (let i = 0; i < 10; i++) {
            const bH = 0.4 + Math.random() * 0.2, bW = 0.15 + Math.random() * 0.1;
            const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.4), new THREE.MeshStandardMaterial({ color: darkBooks[Math.floor(Math.random() * darkBooks.length)] }));
            book.position.set(-1.0 + (i * 0.22), 0.05 + bH / 2, 0); book.castShadow = true; book.receiveShadow = true; g.add(book);
        }
        g.position.set(x, y, z); g.rotation.y = Math.PI / 2; interiorGroup.add(g);
    }
    createWallShelf(-1.7, 2.0, 0); createWallShelf(-1.7, 2.8, 0);

    const sc = createSuitcase(); sc.scale.set(1.0, 1.0, 1.4); sc.position.set(1.4, 0.0, 1.6); sc.rotation.y = 0.4; interiorGroup.add(sc);

    const deskGroup = new THREE.Group();
    const dt = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    dt.position.y = 1.0; dt.castShadow = true; dt.receiveShadow = true; deskGroup.add(dt);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0);
    const l1 = new THREE.Mesh(legGeo, dt.material); l1.position.set(1.4, 0.5, -0.45); l1.castShadow = true; deskGroup.add(l1);
    const l2 = new THREE.Mesh(legGeo, dt.material); l2.position.set(1.4, 0.5, 0.45); l2.castShadow = true; deskGroup.add(l2);
    deskGroup.position.set(-0.4, 0, -1.3); addDeskItems(deskGroup); createDiaryHologram(deskGroup); interiorGroup.add(deskGroup);

    const candleGroup = new THREE.Group();
    candleGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0xfffff0, roughness: 0.3 })));
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({ color: 0xffaa00 })); flame.position.y = 0.25; candleGroup.add(flame);
    const light = new THREE.PointLight(0xffaa00, 0.3, 5); light.castShadow = true; light.shadow.radius = 4; light.position.y = 0.35; candleGroup.add(light);
    candleGroup.userData.update = (t) => { const f = 1.2 + Math.sin(t * 15) * 0.15; light.intensity = f; flame.scale.setScalar(0.8 + (f - 1.2) * 2); };
    const animator = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
    animator.userData.update = (t) => candleGroup.userData.update(t); interiorGroup.add(animator);
    candleGroup.position.set(1.0, 1.075, -1.0); interiorGroup.add(candleGroup);

    createRothkoPainting();
};
