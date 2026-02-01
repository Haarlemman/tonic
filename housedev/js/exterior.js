
// --- EXTERIOR.JS ---
// World Building & Logic

console.log("--- EXTERIOR.JS LOADED (MODULAR) ---");

// --- GLOBAL STATE (RE-DECLARED FOR MODULE) ---
// Note: These are assumes to be initialized in engine.js
// but we might need to reference them if they are let/const there.
// If they are on window, we are fine.

window.buildWorld = function () {
    buildHouse();
    buildEnvironment();
    buildGarage();
    window.introFinished = true;
};

// --- ALIGNMENT HELPER ---
window.alignToPlanet = function (mesh, x, z) {
    const planetCenter = new THREE.Vector3(0, -120, 0); // V326: Matches planetRadius
    const pos = new THREE.Vector3(x, 0, z);
    const dir = pos.clone().sub(planetCenter).normalize();
    mesh.position.copy(planetCenter).add(dir.multiplyScalar(120));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
};

window.buildEnvironment = function () {
    // 1. Sky/Ground
    const planetRadius = 120;
    const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.9 });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.y = -planetRadius;
    planet.receiveShadow = true;
    worldGroup.add(planet);

    // 2. Road (Curved Plane logic)
    const roadGeo = new THREE.PlaneGeometry(8, 200);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = 50;
    road.receiveShadow = true;
    worldGroup.add(road);

    // 3. Roundabout at Z=20
    const roundGeo = new THREE.CircleGeometry(8, 32);
    const round = new THREE.Mesh(roundGeo, roadMat);
    round.rotation.x = -Math.PI / 2;
    round.position.set(0, 0.05, 20);
    round.receiveShadow = true;
    worldGroup.add(round);

    // 4. Gravel & Driveway
    const gravelTex = createGravelTexture();
    const gravelMat = new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 1.0 });

    const drivewayGeo = new THREE.PlaneGeometry(6, 12); // Z=4 to Z=16
    const driveway = new THREE.Mesh(drivewayGeo, gravelMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(0, 0.06, 10);
    driveway.receiveShadow = true;
    worldGroup.add(driveway);

    const pathGeo = new THREE.CircleGeometry(7, 32);
    const path = new THREE.Mesh(pathGeo, gravelMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.06, 0);
    path.receiveShadow = true;
    worldGroup.add(path);

    // 5. Lampposts
    spawnPathLights();

    // 6. City Generation (MESSY CITY OF CUBES)
    console.log("--- EXTERIOR: RESTORING ORIGINAL MESSY SKYLINE ---");
    for (let i = 0; i < 800; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.pow(Math.random(), 2) * 120;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (Math.abs(x) < 10 && z > 15 && z < 155) continue;
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue;

        const mesh = createMegaBlock();
        const distFactor = (radius - 25) / 120;
        const minH = 4.0 + distFactor * 4.0;
        const maxH = 8.0 + distFactor * 4.0;
        const h = minH + Math.random() * (maxH - minH);

        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);

        alignToPlanet(mesh, x, z);
        worldGroup.add(mesh);
        if (window.animatedTrees) animatedTrees.push(mesh);
    }

    // 7. Scatter simple lampposts
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 110;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (Math.abs(x) < 10 && z > 15 && z < 155) continue;
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue;
        if (radius < 15) continue;

        const lamp = createSimpleLamppost();
        alignToPlanet(lamp, x, z);
        worldGroup.add(lamp);
    }

    // 8. Horizon Mega-Blocks
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 130;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (z > -10 && z < 250 && Math.abs(x) < 30.0) continue;

        const mesh = createMegaBlock();
        const h = 10.0 + Math.random() * 15.0;
        mesh.userData.baseScaleY = h;
        mesh.scale.set(1, h, 1);
        alignToPlanet(mesh, x, z);
        worldGroup.add(mesh);
        if (window.animatedTrees) animatedTrees.push(mesh);
    }

    // 9. Procedural Forest
    for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 50;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (Math.abs(x) < 10 && z > 15 && z < 155) continue;
        if (Math.sqrt(x * x + (z - 20) * (z - 20)) < 10) continue;
        if (x > 5 && x < 15 && z > 0 && z < 25) continue;
        if (radius < 12) continue;

        const treeInstance = createSimpleTree(x, z);
        alignToPlanet(treeInstance, x, z);
    }

    // 10. Stars & Fireflies
    spawnStars();
    spawnFireflies();
};

window.buildHouse = function () {
    createRoomBlock('basement', 0, 0.4, 0, 4.4, 0.8, 6.0, roomContent.basement.hex, { type: 'dark', scale: 0.5, shift: 1.2 });

    // Base Windows
    const baseWinGeo = new THREE.PlaneGeometry(1.5, 0.4);
    const baseWinMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.5 });
    const leftBaseWin = new THREE.Mesh(baseWinGeo, baseWinMat);
    leftBaseWin.rotation.y = -Math.PI / 2;
    leftBaseWin.position.set(-2.22, 0.5, 0);
    worldGroup.add(leftBaseWin);
    const rightBaseWin = new THREE.Mesh(baseWinGeo, baseWinMat);
    rightBaseWin.rotation.y = Math.PI / 2;
    rightBaseWin.position.set(2.22, 0.5, 0);
    worldGroup.add(rightBaseWin);

    createRoomBlock('living', -1.0, 1.8, 0, 2.0, 2, 5, roomContent.living.hex, [
        { type: 'dark', side: 'front', scale: 0.6, height: 1.0, shift: -0.2 },
        { type: 'dark', side: 'back', scale: 0.6, height: 1.0, shift: -0.2 }
    ]);
    const liveHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 5.0), new THREE.MeshBasicMaterial({ visible: true, transparent: true, opacity: 0 }));
    liveHitBox.position.set(-1.6, 1.8, 0);
    liveHitBox.userData = { name: 'living', type: 'room' };
    worldGroup.add(liveHitBox);

    createRoomBlock('studio', 1.0, 1.8, 0, 2.0, 2, 5, roomContent.studio.hex, [
        { type: 'dark', side: 'front', scale: 0.6, height: 1.0, shift: 0.2 },
        { type: 'dark', side: 'back', scale: 0.6, height: 1.0, shift: 0.2 }
    ]);
    const studioHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 5.0), new THREE.MeshBasicMaterial({ visible: true, transparent: true, opacity: 0 }));
    studioHitBox.position.set(1.5, 1.8, 0);
    studioHitBox.userData = { name: 'studio', type: 'room' };
    worldGroup.add(studioHitBox);

    // Door & Hall
    const doorFacade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.05), new THREE.MeshStandardMaterial({ color: 0xB99824, roughness: 0.5 }));
    doorFacade.position.set(0, 1.6, 2.51);
    doorFacade.userData = { name: 'hall', type: 'room' };
    worldGroup.add(doorFacade);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    door.position.set(0, 1.5, 2.54);
    door.userData = { name: 'hall', type: 'room' };
    worldGroup.add(door);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
    knob.position.set(0.3, 0, 0.08);
    door.add(knob);

    const doorWin = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.8 }));
    doorWin.position.set(0, 0.4, 0.06);
    door.add(doorWin);

    // House Number Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    plate.position.set(0.75, 1.8, 2.54);
    const numCanvas = document.createElement('canvas'); numCanvas.width = 256; numCanvas.height = 256;
    const nctx = numCanvas.getContext('2d');
    nctx.fillStyle = '#ffffff'; nctx.fillRect(0, 0, 256, 256);
    nctx.fillStyle = '#000000'; nctx.font = 'bold 160px Arial, sans-serif'; nctx.textAlign = 'center'; nctx.textBaseline = 'middle';
    nctx.fillText("42", 128, 138);
    const numMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.28), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(numCanvas) }));
    numMesh.position.z = 0.05;
    plate.add(numMesh);
    worldGroup.add(plate);

    const hallHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 1.0), new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true }));
    hallHitBox.position.set(0, 1.3, 3.0);
    hallHitBox.userData = { name: 'hall', type: 'room' };
    worldGroup.add(hallHitBox);

    // Stairs
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const steps = [
        { w: 1.8, h: 0.2, d: 0.4, z: 3.5, y: 0.1 },
        { w: 1.6, h: 0.2, d: 0.4, z: 3.1, y: 0.3 },
        { w: 1.4, h: 0.2, d: 0.4, z: 2.7, y: 0.5 }
    ];
    steps.forEach(s => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, s.d), stepMat);
        step.position.set(0, s.y, s.z);
        worldGroup.add(step);
    });

    // Other Rooms
    createRoomBlock('toilet', 0, 1.1, -3.5, 1.2, 2.2, 2.0, roomContent.toilet.hex, [
        { type: 'dark', scale: 0.6, side: 'left', narrow: true },
        { type: 'dark', scale: 0.6, side: 'right', narrow: true }
    ]);
    const toiletHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 2.2), new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true }));
    toiletHitBox.position.set(0, 1.1, -3.5);
    toiletHitBox.userData = { name: 'toilet', type: 'room' };
    worldGroup.add(toiletHitBox);

    createRoomBlock('bedroom', -1.0, 3.8, 0, 2.0, 2, 5, roomContent.bedroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    const bedHitBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 5.2), new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true }));
    bedHitBox.position.set(-1.0, 3.8, 0);
    bedHitBox.userData = { name: 'bedroom', type: 'room' };
    worldGroup.add(bedHitBox);

    createRoomBlock('bathroom', 1.0, 3.8, 0, 2.0, 2, 5, roomContent.bathroom.hex, [{ type: 'dark', side: 'front' }, { type: 'dark', side: 'back' }]);
    const bathHitBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 5.2), new THREE.MeshBasicMaterial({ visible: true, opacity: 0, transparent: true }));
    bathHitBox.position.set(1.0, 3.8, 0);
    bathHitBox.userData = { name: 'bathroom', type: 'room' };
    worldGroup.add(bathHitBox);

    // Roof & Attic
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-3.0, 0); roofShape.lineTo(3.0, 0); roofShape.lineTo(0, 3.0); roofShape.lineTo(-3.0, 0);
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 5.2, bevelEnabled: false });
    roofGeo.center();
    const roofTex = createRoofTexture();
    const roof = new THREE.Mesh(roofGeo, [
        new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.8, bumpMap: roofTex, bumpScale: 0.02 })
    ]);
    roof.position.set(0, 6.0, 0);
    roof.userData = { name: 'attic', type: 'room' };
    worldGroup.add(roof);

    const atticWin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    atticWin.position.set(0, 5.4, 2.6);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.6 }));
    glass.position.z = 0.06;
    atticWin.add(glass);
    atticWin.userData = { name: 'attic', type: 'room' };
    worldGroup.add(atticWin);

    // Intro Sign
    const signTex = createNewSignTexture();
    const introSign = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshStandardMaterial({ map: signTex }));
    introSign.position.set(0, 2, 22); // Near roundabout
    introSign.rotation.y = Math.PI; // Face incoming camera
    introSign.userData = { type: 'introSign' };
    worldGroup.add(introSign);
};

window.buildGarage = function () {
    const garageGroup = new THREE.Group();
    garageGroup.position.set(10, 0, 10);
    garageGroup.rotation.y = -Math.PI / 6;

    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.8 }));
    body.position.y = 1.1;
    body.castShadow = true; body.receiveShadow = true;
    garageGroup.add(body);

    const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.2), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 }));
    door.position.set(0, 0.9, 1.3);
    door.userData = {
        type: 'garageDoor', state: 'closed', onClick: () => {
            if (door.userData.state === 'closed') {
                door.userData.state = 'opening';
                starPlane.visible = true;
                new TWEEN.Tween(door.rotation).to({ x: -Math.PI / 2 }, 3000).onComplete(() => door.userData.state = 'open').start();
            } else if (door.userData.state === 'open') {
                if (window.enterRoom) window.enterRoom('aispace');
            }
        }
    };
    garageGroup.add(door);
    if (window.worldClickables) worldGroup.push(door); // Wait, worldClickables or just worldGroup? Standard raycast uses worldGroup.

    const starTex = createStarTexture();
    const starPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.0), new THREE.MeshBasicMaterial({ map: starTex }));
    starPlane.position.set(0, 0.9, 1.0);
    starPlane.visible = false;
    garageGroup.add(starPlane);

    const roofShape = new THREE.Shape();
    roofShape.moveTo(-1.9, 0); roofShape.lineTo(0, 1.4); roofShape.lineTo(1.9, 0); roofShape.lineTo(-1.9, 0);
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 3.2, bevelEnabled: false });
    roofGeo.translate(0, 0, -1.6);
    const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0xcc6655, roughness: 0.9 }));
    roof.position.y = 2.2;
    garageGroup.add(roof);

    worldGroup.add(garageGroup);
};

// --- HELPERS ---

function createRoomBlock(name, x, y, z, w, h, d, color, winConfigs = null) {
    const noiseTex = createNoiseTexture();
    noiseTex.repeat.set(w / 2, h / 2);
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.9, bumpMap: noiseTex, bumpScale: 0.05 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData = { name: name, type: 'room' };

    const line = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
    mesh.add(line);

    if (winConfigs) {
        const configs = Array.isArray(winConfigs) ? winConfigs : [winConfigs];
        configs.forEach(cfg => {
            const s = cfg.scale || 1.0;
            const fw = (cfg.narrow ? 0.4 : 1.0) * s, fh = cfg.height || (1.0 * s);
            const frame = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.1), new THREE.MeshStandardMaterial({ color: cfg.type === 'white' ? 0xffffff : 0x222222 }));
            frame.userData = { name: name, type: 'room' };
            const side = cfg.side || 'front', offsetZ = d / 2 + 0.02, offsetX = w / 2 + 0.02, shift = cfg.shift || 0;
            if (side === 'front') frame.position.set(shift, 0, offsetZ);
            else if (side === 'back') { frame.position.set(shift, 0, -offsetZ); frame.rotation.y = Math.PI; }
            else if (side === 'left') { frame.position.set(-offsetX, 0, shift); frame.rotation.y = -Math.PI / 2; }
            else if (side === 'right') { frame.position.set(offsetX, 0, shift); frame.rotation.y = Math.PI / 2; }

            const glass = new THREE.Mesh(new THREE.PlaneGeometry(fw * 0.85, fh * 0.85), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffaa00, emissiveIntensity: 0.4, roughness: 0.2 }));
            glass.position.z = 0.06;
            glass.userData = { name: name, type: 'room' };
            frame.add(glass);
            mesh.add(frame);
            if (window.windowFlickerMaterials) window.windowFlickerMaterials.push(glass.material);
        });
    }
    worldGroup.add(mesh);
}

function createMegaBlock() {
    const palette = [0x1a1a1a, 0x2c2c2c, 0x3d3d3d, 0x607d8b, 0x78909c, 0x90a4ae, 0xaaaaaa];
    const geo = new THREE.BoxGeometry(1.5 + Math.random() * 2, 1, 1.5 + Math.random() * 2);
    geo.translate(0, 0.5, 0);
    const color = palette[Math.floor(Math.random() * palette.length)];
    const isMetal = [0x607d8b, 0x78909c, 0x90a4ae].includes(color);
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: isMetal ? 0.3 : 0.8, metalness: isMetal ? 0.8 : 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { phase: Math.random() * Math.PI * 2, speed: 1 + Math.random() * 2 };
    return mesh;
}

function spawnPathLights() {
    const lampGroup = new THREE.Group();
    const stemsMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.5 });
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 3.0 });
    const stalkGeo = new THREE.CylinderGeometry(0.06, 0.12, 3.2, 8);
    const curveGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 16, Math.PI * 1.3);
    const bulbGeo = new THREE.SphereGeometry(0.3, 32, 32);

    for (let z = 115; z >= 35; z -= 15) {
        [-1, 1].forEach(side => {
            const post = new THREE.Group();
            const stalk = new THREE.Mesh(stalkGeo, stemsMat); stalk.position.y = 1.6; post.add(stalk);
            const curve = new THREE.Mesh(curveGeo, stemsMat); curve.position.set(0.3, 3.2, 0); curve.rotation.z = Math.PI / 1.5; post.add(curve);
            const bulb = new THREE.Mesh(bulbGeo, bulbMat); bulb.position.set(0.4, 3.2, 0); post.add(bulb);
            const light = new THREE.PointLight(0xffaa00, 3.0, 15); light.position.set(0.4, 3.2, 0); post.add(light);
            if (window.streetLights) streetLights.push(light);

            alignToPlanet(post, side * 5.2, z);
            post.lookAt(new THREE.Vector3(0, post.position.y, z));
            lampGroup.add(post);
        });
    }
    worldGroup.add(lampGroup);
}

function createSimpleLamppost() {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.5, 8), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    pole.position.y = 1.25; group.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2.0 }));
    bulb.position.y = 2.5; group.add(bulb);
    const light = new THREE.PointLight(0xffaa00, 0.5, 5); light.position.y = 2.5; group.add(light);
    return group;
}

function createSimpleTree(x, z) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.5), new THREE.MeshStandardMaterial({ color: 0x221111 }));
    trunk.position.y = 0.75; group.add(trunk);
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.0, 8), new THREE.MeshStandardMaterial({ color: 0x0a220a }));
    leaves.position.y = 3.0; group.add(leaves);
    group.scale.setScalar(0.7 + Math.random() * 0.8);
    worldGroup.add(group);
    return group;
}

function spawnStars() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
        const r = 250 + Math.random() * 100, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
        pos[i] = r * Math.sin(phi) * Math.cos(theta); pos[i + 1] = r * Math.sin(phi) * Math.sin(theta); pos[i + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    worldGroup.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 })));
}

function spawnFireflies() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(600), speeds = [];
    for (let i = 0; i < 600; i += 3) {
        pos[i] = (Math.random() - 0.5) * 80; pos[i + 1] = Math.random() * 15 + 1; pos[i + 2] = (Math.random() - 0.5) * 80;
        speeds.push({ x: (Math.random() - 0.5) * 0.03, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.03 });
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const ff = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xaaff00, size: 0.15, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
    ff.userData = { type: 'fireflies', speeds: speeds };
    worldGroup.add(ff);
}

function createNoiseTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const idata = ctx.createImageData(512, 512);
    for (let i = 0; i < idata.data.length; i += 4) {
        const g = 128 + (Math.random() - 0.5) * 30;
        idata.data[i] = idata.data[i + 1] = idata.data[i + 2] = g; idata.data[i + 3] = 255;
    }
    ctx.putImageData(idata, 0, 0); return new THREE.CanvasTexture(canvas);
}

function createRoofTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#5c0000'; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#4a0000';
    for (let r = 0; r < 10; r++) {
        for (let c = -1; c < 8; c++) ctx.fillRect(c * 64 + (r % 2 ? 32 : 0), r * 51, 60, 48);
    }
    return new THREE.CanvasTexture(canvas);
}

function createGravelTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#665544'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#776655' : '#332211';
        ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 2, Math.random() * 2);
    }
    return new THREE.CanvasTexture(canvas);
}

function createNewSignTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eaddcf'; ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 10; ctx.strokeRect(5, 5, 502, 246);
    ctx.fillStyle = '#3e2723'; ctx.textAlign = 'center';
    ctx.font = 'bold 110px Courier Prime, monospace'; ctx.fillText("ENTER", 256, 120);
    ctx.font = 'bold 30px Courier Prime, monospace'; ctx.fillText("Click on the front door", 256, 200);
    return new THREE.CanvasTexture(canvas);
}

function createStarTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000011'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    return new THREE.CanvasTexture(canvas);
}
