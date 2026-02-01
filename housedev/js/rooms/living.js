
// --- LIVING.JS ---
console.log("Loading Living Room (V-Modular-Elite)...");

// GLOBAL VARS FOR LIVING ROOM
window.livingCozyLight = null;
window.livingLibrarySpot = null;
window.bookcaseSpotL = null;
window.bookcaseSpotR = null;
window.livingTVGlow = null;
window.livingTVMesh = null;
let livingTVVideo, livingTVVideoTexture, livingTVScreensaverTexture;

// --- HELPERS ---

function createLivingWoodMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = 'rgba(60, 30, 10, 0.2)';
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        ctx.beginPath(); ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + Math.random() * 20 - 10, 170, x + Math.random() * 20 - 10, 340, x + Math.random() * 20 - 10, 512);
        ctx.lineWidth = 1 + Math.random() * 2; ctx.strokeStyle = 'rgba(40,20,5,0.25)'; ctx.stroke();
    }
    for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.01)';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: tex, color: 0xaa9977, roughness: 0.8, metalness: 0.1 });
}

function createLivingTVScreensaver() {
    const slides = (roomContent['living'] && roomContent['living'].tvImages) || [];
    if (slides.length === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 576;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const duration = 5000;
    const fadeDuration = 800;
    const images = {};
    slides.forEach(s => { if (s.image) { const i = new Image(); i.src = s.image; images[s.image] = i; } });

    let currentIndex = -1;
    let previousCanvas = null;

    const drawSlide = (targetCtx, slide, tw, th) => {
        targetCtx.fillStyle = slide.color || '#000000';
        targetCtx.fillRect(0, 0, tw, th);
        if (slide.image && images[slide.image] && images[slide.image].complete) {
            const img = images[slide.image];
            const scale = Math.min(tw / img.width, th / img.height);
            const w = img.width * scale; const h = img.height * scale;
            targetCtx.drawImage(img, (tw - w) / 2, (th - h) / 2, w, h);
        }
        if (slide.text) {
            targetCtx.fillStyle = '#ffffff'; targetCtx.font = 'bold 40px "Courier Prime", monospace';
            targetCtx.textAlign = 'center'; targetCtx.textBaseline = 'middle';
            targetCtx.shadowColor = 'rgba(0,0,0,0.8)'; targetCtx.shadowBlur = 4;
            targetCtx.fillText(slide.text, tw / 2, th - 76);
        }
    };

    tex.userData = {
        update: (time) => {
            const nowMs = time * 1000;
            const index = Math.floor(nowMs / duration) % slides.length;
            const slideProgress = (nowMs % duration) / duration;
            const fadeProgress = Math.min(slideProgress * duration / fadeDuration, 1);

            if (index !== currentIndex || currentIndex === -1) {
                if (currentIndex !== -1 && !previousCanvas) {
                    previousCanvas = document.createElement('canvas');
                    previousCanvas.width = 1024; previousCanvas.height = 576;
                    previousCanvas.getContext('2d').drawImage(canvas, 0, 0);
                }
                currentIndex = index;
            }

            const tempC = document.createElement('canvas');
            tempC.width = 1024; tempC.height = 576;
            drawSlide(tempC.getContext('2d'), slides[currentIndex], 1024, 576);

            if (previousCanvas && fadeProgress < 1) {
                ctx.globalAlpha = 1 - fadeProgress; ctx.drawImage(previousCanvas, 0, 0);
                ctx.globalAlpha = fadeProgress; ctx.drawImage(tempC, 0, 0);
                ctx.globalAlpha = 1;
            } else {
                ctx.clearRect(0, 0, 1024, 576); ctx.drawImage(tempC, 0, 0);
                if (fadeProgress >= 1) previousCanvas = null;
            }
            tex.needsUpdate = true;
        }
    };
    return tex;
}

function initTVVideo() {
    if (livingTVVideo) return;
    livingTVScreensaverTexture = createLivingTVScreensaver();
    livingTVVideo = document.createElement('video');
    const ld = roomContent['living'];
    livingTVVideo.src = (ld && ld.videoPlaylist && ld.videoPlaylist.length > 0) ? ld.videoPlaylist[0].src : '../assets/video/premonition.mp4';
    livingTVVideo.loop = true; livingTVVideo.muted = false; livingTVVideo.autoplay = false;
    livingTVVideo.preload = 'auto';
    window.videoElement = livingTVVideo;
    livingTVVideoTexture = new THREE.VideoTexture(livingTVVideo);
    livingTVVideoTexture.colorSpace = THREE.SRGBColorSpace;
}

function createLivingRuinArtifact() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.4, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0, flatShading: true }));
    base.position.y = 0.2; base.castShadow = true; group.add(base);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
    orb.position.y = 0.55; group.add(orb);
    const light = new THREE.PointLight(0xffaa00, 2.0, 7); light.position.copy(orb.position); group.add(light);
    const hitBox = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.9, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.position.y = 0.45; group.add(hitBox);
    group.userData.hitTarget = hitBox;
    group.userData.update = (t) => {
        const pulse = 1.0 + Math.sin(t * 2) * 0.3; light.intensity = 2.0 + pulse; orb.scale.setScalar(1.0 + Math.sin(t * 4) * 0.05);
    };
    return group;
}

function createLivingRubiksCubeArtifact() {
    const group = new THREE.Group();
    const colors = [0xffffff, 0xffff00, 0xff0000, 0xffa500, 0x0000ff, 0x00ff00];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const mats = []; for (let i = 0; i < 6; i++) mats.push(new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * 6)], roughness: 0.1 }));
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), mats);
        m.position.set(x * 0.13, y * 0.13, z * 0.13);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x000000 }));
        m.add(edges); group.add(m);
    }
    group.scale.setScalar(0.85);
    return group;
}

function createLivingRealisticRocketArtifact() {
    const rocket = new THREE.Group();
    const size = 512; const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const RED = '#d40000', WHITE = '#fcfcfc';
    ctx.fillStyle = RED; ctx.fillRect(0, 0.68 * size, size, 0.32 * size);
    for (let i = 0; i < 5; i++) {
        const y = 0.68 * size - (i + 1) * (0.44 * size / 5);
        for (let j = 0; j < 10; j++) { ctx.fillStyle = (i + j) % 2 === 0 ? RED : WHITE; ctx.fillRect(j * (size / 10), y, size / 10, 0.44 * size / 5); }
    }
    ctx.fillStyle = RED; ctx.fillRect(0, 0, size, 0.24 * size);
    const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    const pts = []; const h = 30;
    for (let i = 0; i <= 100; i++) {
        const t = i / 100; const y = t * h;
        let x = (t < 0.58) ? 1.1 + 1.5 * Math.sin((t / 0.58) * (Math.PI / 2)) : 2.6 * Math.pow(Math.cos(((t - 0.58) / 0.42) * (Math.PI / 2)), 0.8);
        pts.push(new THREE.Vector2(x, y));
    }
    pts.unshift(new THREE.Vector2(0, 0));
    rocket.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 32), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.2, metalness: 0.1 })));
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 3, 12), new THREE.MeshStandardMaterial({ color: 0xd40000, roughness: 0.32 }));
    tip.position.y = h + 1.5; rocket.add(tip);
    for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group(); legGroup.rotation.y = (i * Math.PI * 2) / 3;
        const legShape = new THREE.Shape(); legShape.moveTo(1.2, 7.2); legShape.lineTo(2.2, 7.2); legShape.bezierCurveTo(9.0, 5.7, 10.5, -1.3, 10.5, -3.7); legShape.lineTo(8.0, -3.7); legShape.bezierCurveTo(8.0, -0.5, 4.0, 1.5, 1.2, 2.7);
        const leg = new THREE.Mesh(new THREE.ExtrudeGeometry(legShape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35, bevelSegments: 3 }), tip.material);
        leg.position.set(0, 0, -0.8);
        const pod = new THREE.Mesh(new THREE.SphereGeometry(2.0, 16, 16), tip.material); pod.scale.set(1, 1.35, 1); pod.position.set(9.2, -3.4, 0.8); leg.add(pod);
        legGroup.add(leg); rocket.add(legGroup);
    }
    return rocket;
}

function createLivingMetropolisRobot() {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.9, roughness: 0.3, emissive: 0x331100, emissiveIntensity: 0.2 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), goldMat); head.position.y = 1.75; head.scale.set(0.9, 1.2, 1); group.add(head);
    [-0.08, 0.08].forEach(x => {
        const eye = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); eye.position.set(x, 1.78, 0.17); eye.rotation.y = x > 0 ? 0.2 : -0.2; head.add(eye);
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), new THREE.MeshBasicMaterial({ color: 0x000000 })); pupil.position.set(0, 0, 0.01); eye.add(pupil);
    });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.14, 0.8, 16), goldMat); torso.position.y = 1.1; group.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2), goldMat); neck.position.y = 1.55; group.add(neck);
    [-1, 1].forEach(side => {
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.08), goldMat); sh.position.set(0.26 * side, 1.4, 0); group.add(sh);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.7), goldMat); arm.position.set(0.32 * side, 1.05, 0); group.add(arm);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05), goldMat); hand.position.set(0.32 * side, 0.7, 0); group.add(hand);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.8), goldMat); leg.position.set(0.12 * side, 0.4, 0); group.add(leg);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.18), goldMat); foot.position.set(0.12 * side, 0.02, 0.05); group.add(foot);
    });
    const rings = []; const ringCount = 6; const rangeY = 2.2;
    const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    for (let i = 0; i < ringCount; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 8, 32), glowRingMat.clone()); ring.rotation.x = Math.PI / 2; group.add(ring); rings.push(ring);
    }
    group.userData.update = function (t) {
        rings.forEach((ring, idx) => {
            ring.position.y = 2.2 - ((t * 0.4 + idx * (rangeY / ringCount)) % rangeY);
            let p = Math.min(Math.max(ring.position.y / rangeY, 0), 1); const curve = Math.sin(p * Math.PI); ring.material.opacity = Math.pow(curve, 0.8) * 1.0;
            const swell = 0.4 + (curve * 0.9); const pulse = 1.0 + Math.sin(t * 3 + idx) * 0.05; ring.scale.set(swell * pulse, swell * pulse, 1);
        });
    };
    group.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    return group;
}

window.createLivingRoomInterior = function () {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x451a00, roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide });
    const wBack = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), wallMat); wBack.position.set(0, 4, -5); wBack.receiveShadow = true; interiorGroup.add(wBack);
    const wLeft = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), wallMat); wLeft.rotation.y = Math.PI / 2; wLeft.position.set(-5, 4, 0); wLeft.receiveShadow = true; interiorGroup.add(wLeft);

    window.livingCozyLight = new THREE.PointLight(0xffaa00, 0.25, 15);
    window.livingCozyLight.position.set(0, 5, 0); window.livingCozyLight.castShadow = true; window.livingCozyLight.shadow.radius = 8; window.livingCozyLight.shadow.bias = -0.0005;
    interiorGroup.add(window.livingCozyLight);

    window.livingLibrarySpot = new THREE.SpotLight(0xffffff, 0.25);
    window.livingLibrarySpot.position.set(3, 7, 3); window.livingLibrarySpot.target.position.set(3, 2, -4.9); window.livingLibrarySpot.castShadow = true; window.livingLibrarySpot.shadow.radius = 8;
    interiorGroup.add(window.livingLibrarySpot); interiorGroup.add(window.livingLibrarySpot.target);

    window.bookcaseSpotL = new THREE.SpotLight(0xfffaed, 0.15); window.bookcaseSpotL.position.set(-2, 6, -3.5); window.bookcaseSpotL.target.position.set(-4.5, 2.5, -3.5); window.bookcaseSpotL.castShadow = true; interiorGroup.add(window.bookcaseSpotL); interiorGroup.add(window.bookcaseSpotL.target);
    window.bookcaseSpotR = new THREE.SpotLight(0xfffaed, 0.15); window.bookcaseSpotR.position.set(-2, 6, 3.5); window.bookcaseSpotR.target.position.set(-4.5, 2.5, 3.5); window.bookcaseSpotR.castShadow = true; interiorGroup.add(window.bookcaseSpotR); interiorGroup.add(window.bookcaseSpotR.target);

    if (window.livingRoomLightingOverride) clearInterval(window.livingRoomLightingOverride);
    window.livingRoomLightingOverride = setInterval(() => {
        if (livingTVVideo && !livingTVVideo.paused) return; // Don't override in cinema mode
        if (window.ambientLight) window.ambientLight.intensity = 0.15;
        if (window.dirLight) window.dirLight.intensity = 0.2;
        if (window.livingCozyLight) window.livingCozyLight.intensity = 0.25;
        if (window.livingLibrarySpot) window.livingLibrarySpot.intensity = 0.25;
        if (window.bookcaseSpotL) window.bookcaseSpotL.intensity = 0.15;
        if (window.bookcaseSpotR) window.bookcaseSpotR.intensity = 0.15;
    }, 100);

    const woodMat = createLivingWoodMaterial();
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x150e0a, roughness: 1.0 });
    const bookColors = [0x991b1b, 0x1e40af, 0x166534, 0x854d0e, 0x3730a3, 0xfacc15];

    function createBookcase(posZ) {
        const grp = new THREE.Group();
        let pOff = (posZ < 0) ? 1.2 : 0;
        if (posZ < 0) { window.secretDoorGroup = grp; grp.userData.isSecretDoor = true; }

        const backing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.2, 2.4), shelfMat); backing.position.set(-0.4, 0, pOff); backing.receiveShadow = true; grp.add(backing);
        const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat); sideL.position.z = -1.2 + pOff; sideL.receiveShadow = true; grp.add(sideL);
        const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.1), shelfMat); sideR.position.z = 1.2 + pOff; sideR.receiveShadow = true; grp.add(sideR);

        for (let r = 0; r < 5; r++) {
            const y = 0.5 + r * 1.0;
            const plank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.4), shelfMat); plank.position.set(0, y - 2.5, pOff); plank.receiveShadow = true; grp.add(plank);

            if (r === 0 && posZ < 0) {
                const portal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 5.2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
                portal.position.set(-4.95, 2.6, posZ); portal.rotation.y = Math.PI / 2;
                portal.userData = { type: 'enter_annex', onClick: () => enterRoom('annex') };
                interiorGroup.add(portal); interiorClickables.push(portal);
            }
            if (r === 4 && posZ < 0) {
                const art = createLivingRuinArtifact(); art.scale.setScalar(1.5); art.position.set(0, y - 2.45, pOff);
                const hit = art.userData.hitTarget;
                hit.userData = {
                    type: 'open_secret', onClick: () => {
                        const t = window.secretDoorGroup;
                        if (t.userData.isOpen) { new TWEEN.Tween(t.rotation).to({ y: 0 }, 2000).easing(TWEEN.Easing.Quadratic.InOut).start(); t.userData.isOpen = false; }
                        else { new TWEEN.Tween(t.rotation).to({ y: Math.PI / 2.5 }, 4000).easing(TWEEN.Easing.Quadratic.InOut).start(); t.userData.isOpen = true; }
                    }
                };
                interiorClickables.push(hit); grp.add(art);
            }
            if (r === 1 && posZ < 0) { const c = createLivingRubiksCubeArtifact(); c.position.set(0.1, y - 2.15, pOff); grp.add(c); }
            if (r === 4 && posZ > 0) { const rk = createLivingRealisticRocketArtifact(); rk.scale.setScalar(0.022); rk.position.set(0.1, y - 2.32, 0); grp.add(rk); }
            if (r === 2 && posZ > 0) {
                const globe = new THREE.Group();
                globe.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05), new THREE.MeshStandardMaterial({ color: 0x333333 })));
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6 })); ball.position.y = 0.3; globe.add(ball);
                globe.position.set(0.1, y - 2.45, 0); grp.add(globe);
            }
            if (!(r === 4 && posZ < 0) && r !== 0) {
                for (let b = 0; b < 13; b++) {
                    const bH = 0.5 + Math.random() * 0.3;
                    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.6, bH, 0.14), new THREE.MeshStandardMaterial({ color: bookColors[Math.floor(Math.random() * 6)] }));
                    bk.position.set(0.1, (y - 2.5) + (bH / 2) + 0.05, (-0.9 + b * 0.16) + pOff); grp.add(bk);
                }
            }
        }
        grp.position.set(-4.5, 2.6, posZ - pOff); interiorGroup.add(grp);
    }
    createBookcase(-3.5); createBookcase(3.5);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1), woodMat); stand.position.set(0, 0.75, -4); stand.castShadow = true; stand.receiveShadow = true; interiorGroup.add(stand);
    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.2), new THREE.MeshStandardMaterial({ color: 0x111111 })); tvFrame.position.set(0, 2.6, -4.5); interiorGroup.add(tvFrame);
    window.livingTVGlow = new THREE.PointLight(0x88ccff, 1.5, 8); window.livingTVGlow.position.set(0, 2.6, -4.8); interiorGroup.add(window.livingTVGlow);

    initTVVideo();
    const tvMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    tvMesh.position.set(0, 2.6, -4.39); tvMesh.userData = { type: 'tv', action: 'toggleVideo' };
    if (livingTVScreensaverTexture) { tvMesh.material.map = livingTVScreensaverTexture; tvMesh.userData.update = livingTVScreensaverTexture.userData.update; }
    window.livingTVMesh = tvMesh; interiorGroup.add(tvMesh); interiorClickables.push(tvMesh);

    const tvGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.8), new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.1, metalness: 0.9, roughness: 0.1, depthWrite: false }));
    tvGlass.position.set(0, 2.6, -4.37); interiorGroup.add(tvGlass);

    if (roomContent['living'].videoPlaylist) createVideoPanel(roomContent['living'].videoPlaylist);

    const table = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.6, 2.25), woodMat); table.position.set(0, 0.3, -1); table.castShadow = true; table.receiveShadow = true; interiorGroup.add(table);
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 64), new THREE.MeshStandardMaterial({ color: 0x6b0505, roughness: 1.0 })); rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02; rug.receiveShadow = true; interiorGroup.add(rug);

    const createRoundedBox = (w, h, d, r) => {
        const shape = new THREE.Shape(); const x = -w / 2, y = -h / 2;
        shape.moveTo(x, y + r); shape.lineTo(x, y + h - r); shape.quadraticCurveTo(x, y + h, x + r, y + h); shape.lineTo(x + w - r, y + h); shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r); shape.lineTo(x + w, y + r); shape.quadraticCurveTo(x + w, y, x + w - r, y); shape.lineTo(x + r, y); shape.quadraticCurveTo(x, y, x, y + r);
        return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    };

    const couchMat = new THREE.MeshStandardMaterial({ color: 0x2e201b });
    const couch = new THREE.Group();
    const cBase = new THREE.Mesh(createRoundedBox(3, 1.2, 0.4, 0.15), couchMat); cBase.rotation.x = Math.PI / 2; cBase.position.y = 0.5; cBase.castShadow = true; cBase.receiveShadow = true; couch.add(cBase);
    const cBack = new THREE.Mesh(createRoundedBox(3, 0.3, 1.2, 0.15), couchMat); cBack.rotation.x = Math.PI / 2; cBack.position.set(0, 1.0, 0.55); cBack.castShadow = true; cBack.receiveShadow = true; couch.add(cBack);
    const armL = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat); armL.rotation.x = Math.PI / 2; armL.position.set(-1.6, 0.7, 0); armL.castShadow = true; couch.add(armL);
    const armR = new THREE.Mesh(createRoundedBox(0.4, 1.3, 0.9, 0.1), couchMat); armR.rotation.x = Math.PI / 2; armR.position.set(1.6, 0.7, 0); armR.castShadow = true; couch.add(armR);
    couch.position.set(0, -0.3, 2.5); interiorGroup.add(couch);

    const chair = new THREE.Group();
    const chBase = new THREE.Mesh(createRoundedBox(1.2, 1.2, 0.4, 0.15), couchMat); chBase.rotation.x = Math.PI / 2; chBase.position.y = 0.5; chBase.castShadow = true; chBase.receiveShadow = true; chair.add(chBase);
    const chBack = new THREE.Mesh(createRoundedBox(1.2, 0.3, 1.2, 0.15), couchMat); chBack.rotation.x = Math.PI / 2; chBack.position.set(0, 1.0, 0.55); chBack.castShadow = true; chBack.receiveShadow = true; chair.add(chBack);
    chair.position.set(3.5, -0.3, -1); chair.rotation.y = Math.PI / 2; interiorGroup.add(chair);

    window.metropolisRobot = createLivingMetropolisRobot();
    window.metropolisRobot.position.set(4.5, 0, -4.0); window.metropolisRobot.rotation.y = -0.5; window.metropolisRobot.scale.set(1.125, 1.125, 1.125);
    interiorGroup.add(window.metropolisRobot);
    const robotGlow = new THREE.PointLight(0x00ffff, 2.5, 12); robotGlow.position.set(0, 1.5, 0.5); window.robotGlowLight = robotGlow; window.metropolisRobot.add(robotGlow);

    const mariaHit = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.5, 16), new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0, depthWrite: false }));
    mariaHit.position.y = 1.0; window.metropolisRobot.add(mariaHit);
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('living');
        if (item) {
            item.position.set(0, 1.5, 0); item.scale.setScalar(0.1); item.visible = false; window.metropolisRobot.add(item);
            mariaHit.userData.onClick = () => {
                if (item.userData.revealed) return;
                item.visible = true; item.userData.revealed = true;
                new TWEEN.Tween(item.position).to({ y: 3.0 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                new TWEEN.Tween(item.scale).to({ x: 1, y: 1, z: 1 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
            };
            interiorClickables.push(mariaHit);
        }
    }
};

window.playTVVideo = function (index) {
    if (!livingTVVideo) return;
    const pl = roomContent['living'].videoPlaylist;
    if (!pl || !pl[index]) return;
    window.masterVideoIndex = index;
    if (window.audioPlayer && !window.audioPlayer.paused) { window.audioPlayer.pause(); window.isMusicPlaying = false; if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000); }
    livingTVVideo.src = pl[index].src; livingTVVideo.load();
    if (livingTVVideo.paused) nextTVContent(); else livingTVVideo.play().catch(e => console.warn(e));
    if (window.livingTVMesh) { window.livingTVMesh.material.map = livingTVVideoTexture; window.livingTVMesh.userData.update = null; }
};

function nextTVContent() {
    if (livingTVVideo) {
        if (livingTVVideo.paused) {
            if (!window.preCinemaState) {
                window.preCinemaState = {
                    cozy: window.livingCozyLight ? window.livingCozyLight.intensity : 0.25,
                    library: window.livingLibrarySpot ? window.livingLibrarySpot.intensity : 0.25,
                    spotL: window.bookcaseSpotL ? window.bookcaseSpotL.intensity : 0.15,
                    spotR: window.bookcaseSpotR ? window.bookcaseSpotR.intensity : 0.15,
                    ambient: window.ambientLight ? window.ambientLight.intensity : 0.15,
                    dir: window.dirLight ? window.dirLight.intensity : 0.2
                };
            }
            const dimTime = 1000;
            if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: 0 }, dimTime).start();
            if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: 0 }, dimTime).start();
            if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: 0 }, dimTime).start();
            if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: 0 }, dimTime).start();
            if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0 }, dimTime).start();
            if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0 }, dimTime).start();
            if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 3.0 }, dimTime).start();
            livingTVVideo.muted = false; livingTVVideo.volume = 1.0; livingTVVideo.play().catch(e => console.warn(e));
        } else {
            restoreCinemaLights();
            if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 1.5 }, 500).start();
            livingTVVideo.pause();
        }
    }
}
window.nextTVContent = nextTVContent;

function restoreCinemaLights() {
    const r = window.preCinemaState || { cozy: 0.25, library: 0.25, spotL: 0.15, spotR: 0.15, ambient: 0.15, dir: 0.2 };
    const t = 1000;
    if (window.livingCozyLight) new TWEEN.Tween(window.livingCozyLight).to({ intensity: r.cozy }, t).start();
    if (window.livingLibrarySpot) new TWEEN.Tween(window.livingLibrarySpot).to({ intensity: r.library }, t).start();
    if (window.bookcaseSpotL) new TWEEN.Tween(window.bookcaseSpotL).to({ intensity: r.spotL }, t).start();
    if (window.bookcaseSpotR) new TWEEN.Tween(window.bookcaseSpotR).to({ intensity: r.spotR }, t).start();
    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: r.ambient }, t).start();
    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: r.dir }, t).start();
    if (window.livingTVGlow) new TWEEN.Tween(window.livingTVGlow).to({ intensity: 1.5 }, t).start();
    window.preCinemaState = null;
}
window.restoreCinemaLights = restoreCinemaLights;

window.stopLivingVideo = () => {
    restoreCinemaLights();
    if (livingTVVideo) { livingTVVideo.pause(); livingTVVideo.muted = true; }
    if (window.livingTVMesh && livingTVScreensaverTexture) {
        window.livingTVMesh.material.map = livingTVScreensaverTexture; window.livingTVMesh.userData.update = livingTVScreensaverTexture.userData.update;
    }
    window.masterVideoIndex = -1;
};

function createVideoPanel(playlist) {
    if (window.createUniversalVideoInterface) {
        const pos = roomContent['living'].videoInterfacePos || { x: 3.0, y: 3.2, z: -4.9 };
        window.createUniversalVideoInterface(interiorGroup, new THREE.Vector3(pos.x, pos.y, pos.z), playlist, { scale: 0.5 });
    }
}
