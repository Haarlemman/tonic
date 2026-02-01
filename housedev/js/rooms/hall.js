
// --- HALL.JS ---
console.log("Loading Hall Room... (v315+)");

window.createHallInterior = function () {
    // -- BACKGROUND VIDEO --
    videoElement.src = "../assets/video/dots.mp4";
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));

    window.videoTexture = new THREE.VideoTexture(videoElement);
    const bgGeo = new THREE.PlaneGeometry(10, 8);
    const bgMat = new THREE.MeshBasicMaterial({
        map: window.videoTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 4.0, -4.95);
    interiorGroup.add(bgMesh);

    // -- LIGHTING ADJUSTMENT --
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    const cozySpot = new THREE.SpotLight(0xffaa00, 1.5);
    cozySpot.position.set(2, 5, 2);
    cozySpot.target.position.set(0, 0, 0);
    cozySpot.angle = Math.PI / 3;
    cozySpot.penumbra = 0.5;
    cozySpot.castShadow = true;
    cozySpot.shadow.mapSize.width = 2048;
    cozySpot.shadow.mapSize.height = 2048;
    cozySpot.shadow.bias = -0.0001;
    cozySpot.shadow.camera.near = 0.5;
    cozySpot.shadow.camera.far = 20;
    interiorGroup.add(cozySpot);
    interiorGroup.add(cozySpot.target);

    const hallAmbient = new THREE.AmbientLight(0xffffff, 0.15);
    interiorGroup.add(hallAmbient);

    const shadowLight = new THREE.DirectionalLight(0xffaa00, 0.8);
    shadowLight.position.set(3, 6, 3);
    shadowLight.target.position.set(0, 0, 0);
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;
    shadowLight.shadow.camera.near = 0.5;
    shadowLight.shadow.camera.far = 20;
    shadowLight.shadow.bias = -0.0005;
    interiorGroup.add(shadowLight);
    interiorGroup.add(shadowLight.target);

    // --- CURTAINS ---
    createHallCurtain(-4.99, 0, 4.8, Math.PI / 2);
    createHallCurtain(4.8, 0, -4.4, 0);

    // --- WALL TEXT ---
    const wallTextCanvas = document.createElement('canvas');
    wallTextCanvas.width = 1024; wallTextCanvas.height = 512;
    const wtctx = wallTextCanvas.getContext('2d');
    wtctx.fillStyle = 'white';
    wtctx.textAlign = 'center';
    wtctx.shadowColor = "black"; wtctx.shadowBlur = 5;

    wtctx.font = 'bold 80px "Glass Antiqua", cursive';
    wtctx.fillText("Welcome to", 512, 130);

    wtctx.font = 'bold 110px "Glass Antiqua", cursive';
    wtctx.fillText("the House of Meaning", 512, 250);

    wtctx.font = '40px "Lato", sans-serif';
    wtctx.fillText("Explore // Wonder // Dream", 512, 330);

    wtctx.font = '28px "Lato", sans-serif';
    wtctx.fillText("Big screen and sound recommended", 512, 410);

    const wallTex = new THREE.CanvasTexture(wallTextCanvas);
    const wallTextPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4),
        new THREE.MeshBasicMaterial({ map: wallTex, transparent: true })
    );
    wallTextPlane.position.set(0, 4.0, -4.7);
    interiorGroup.add(wallTextPlane);

    createR2D2ForHall();
};

function createHallCurtain(x, y, z, rotationY) {
    const curtainGroup = new THREE.Group();
    curtainGroup.position.set(x, y, z);
    curtainGroup.rotation.y = rotationY;

    const width = 1.2;
    const height = 8;
    const curtainGeo = new THREE.PlaneGeometry(width, height, 40, 40);
    const pos = curtainGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        let ux = pos.getX(i);
        const u = (ux + width / 2) / width;
        const waveAmp = 0.35;
        const wave = Math.sin(u * Math.PI * 18) * waveAmp;
        pos.setZ(i, wave);
    }
    curtainGeo.computeVertexNormals();

    const curtainMat = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
    });

    const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
    curtainMesh.position.y = 4.0;
    curtainMesh.castShadow = true;
    curtainMesh.receiveShadow = true;
    curtainGroup.add(curtainMesh);

    const backGeo = new THREE.PlaneGeometry(width, height);
    const backMesh = new THREE.Mesh(backGeo, curtainMat);
    backMesh.position.set(0, 4.0, -0.4);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    curtainGroup.add(backMesh);

    interiorGroup.add(curtainGroup);
}

function createR2D2ForHall() {
    const r2d2Group = new THREE.Group();
    r2d2Group.scale.set(0.4, 0.4, 0.4);
    r2d2Group.position.set(0, 0, 1.0);
    interiorGroup.add(r2d2Group);

    // Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grd = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.9)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grd;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 1.0, depthWrite: false });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 5.0), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.05, 0);
    r2d2Group.add(shadowMesh);

    // Hologram
    const instructions = createHologram();
    instructions.scale.set(2.5, 2.5, 2.5);
    instructions.position.set(0, 7.0, 1.5);
    r2d2Group.add(instructions);

    // Mesh Details
    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.1;

    // Body
    const bodyGroup = new THREE.Group();
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 40), white);
    bodyCyl.castShadow = true;
    bodyGroup.add(bodyCyl);

    const ringGeo = new THREE.TorusGeometry(1.41, 0.015, 8, 40);
    const ring1 = new THREE.Mesh(ringGeo, dark);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.8;
    bodyGroup.add(ring1);
    const ring2 = ring1.clone();
    ring2.position.y = -0.8;
    bodyGroup.add(ring2);

    bodyGroup.rotation.x = bodyTiltAngle;
    bodyGroup.position.y = bodyPivotY;
    r2d2Group.add(bodyGroup);

    // Dome
    const domeGroup = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), silver);
    domeGroup.add(dome);

    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20), dark);
    eye.rotation.x = Math.PI / 2;
    eye.position.set(0, 0.75, 1.3);
    domeGroup.add(eye);

    domeGroup.position.y = 1.5;
    bodyGroup.add(domeGroup);

    // Legs
    [-1, 1].forEach(side => {
        const legGroup = new THREE.Group();
        const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), white);
        joint.rotation.z = Math.PI / 2; joint.position.x = side * 1.5; legGroup.add(joint);
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.4, sideLegHeight, 0.7), white);
        strut.position.y = -sideLegHeight / 2; strut.position.x = side * 1.5; legGroup.add(strut);
        legGroup.position.y = bodyPivotY;
        r2d2Group.add(legGroup);
    });

    // Animation
    new TWEEN.Tween(domeGroup.rotation)
        .to({ y: 0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .yoyo(true).repeat(Infinity)
        .start();

    const p1 = { x: -2.0, z: 1.0, ry: 0.5 };
    const p2 = { x: 2.0, z: -1.0, ry: -0.5 };
    const pHome = { x: 0, z: 1.0, ry: 0 };

    const patrol1 = new TWEEN.Tween(r2d2Group.position).to({ x: p1.x, z: p1.z }, 4000).easing(TWEEN.Easing.Sinusoidal.InOut);
    const rotate1 = new TWEEN.Tween(r2d2Group.rotation).to({ y: p1.ry }, 1000);
    const patrol2 = new TWEEN.Tween(r2d2Group.position).to({ x: p2.x, z: p2.z }, 5000).easing(TWEEN.Easing.Sinusoidal.InOut);
    const rotate2 = new TWEEN.Tween(r2d2Group.rotation).to({ y: p2.ry }, 1000);
    const patrolHome = new TWEEN.Tween(r2d2Group.position).to({ x: pHome.x, z: pHome.z }, 3000).easing(TWEEN.Easing.Sinusoidal.InOut);
    const rotateHome = new TWEEN.Tween(r2d2Group.rotation).to({ y: pHome.ry }, 1000);

    patrol1.chain(rotate1); rotate1.chain(patrol2); patrol2.chain(rotate2); rotate2.chain(patrolHome); patrolHome.chain(rotateHome); rotateHome.chain(patrol1);
    patrol1.start();

    // WordHunt Logic
    if (typeof WordHunt !== 'undefined') {
        const item = WordHunt.createInteractable('hall');
        if (item) {
            item.position.set(0, 1.0, 0); item.scale.set(0.1, 0.1, 0.1); item.visible = false;
            r2d2Group.add(item);

            const orbHitBox = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), new THREE.MeshBasicMaterial({ visible: false }));
            orbHitBox.userData.onClick = () => { if (item.userData.onClick) item.userData.onClick(); };
            item.add(orbHitBox);

            const r2ClickHandler = () => {
                if (item.userData.revealed) return;
                item.visible = true; item.userData.revealed = true;
                new TWEEN.Tween(item.position).to({ y: 12.5 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
                new TWEEN.Tween(item.scale).to({ x: 3.0, y: 3.0, z: 3.0 }, 1500).easing(TWEEN.Easing.Elastic.Out).start();
            };
            r2d2Group.userData.onClick = r2ClickHandler;
            if (window.interiorClickables) { window.interiorClickables.push(r2d2Group); window.interiorClickables.push(item); window.interiorClickables.push(orbHitBox); }
        }
    }
}

function createHologram() {
    const group = new THREE.Group();
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(256, 256, 120, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#ccffff'; ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10;
    ctx.font = 'bold 50px "Courier New", monospace'; ctx.textAlign = "center";
    ctx.fillText("FREE WILL", 256, 230);
    ctx.font = '30px "Courier New", monospace';
    ctx.fillText("DOES NOT EXIST", 256, 280);
    ctx.fillText("CLICK FOR MORE", 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), mat);
    mesh.position.y = 0.5;
    group.add(mesh);
    return group;
}
