function createHallInterior() {
    // -- BACKGROUND VIDEO --
    videoElement.src = "/assets/video/dots.mp4";
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));

    videoTexture = new THREE.VideoTexture(videoElement);
    // Full wall size (10 width, 8 height)
    const bgGeo = new THREE.PlaneGeometry(10, 8);
    const bgMat = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0.3, // V209: More transparent (was 0.6)
        blending: THREE.AdditiveBlending
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 4.0, -4.95);
    interiorGroup.add(bgMesh);

    // -- COAT HANGER REMOVED --

    // -- TEXT ON BACK WALL (CENTERED) --
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = "black"; ctx.shadowBlur = 5;

    ctx.font = 'bold 80px "Glass Antiqua", cursive';
    ctx.fillText("Welcome to", 512, 130);

    ctx.font = 'bold 120px "Glass Antiqua", cursive';
    ctx.fillText("The House of Awe", 512, 250);

    ctx.font = '40px "Lato"';
    ctx.fillText("Explore // Wonder // Dream", 512, 330);

    ctx.font = '28px "Lato"';
    ctx.fillText("Big screen and sound recommended", 512, 410);

    const tex = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    plane.position.set(0, 4.0, -4.8);
    interiorGroup.add(plane);

    // -- LIGHTING ADJUSTMENT --
    // Remove the default bright bulb added by house.js
    const defaultBulb = interiorGroup.children.find(c => c.isPointLight && c.position.y === 6);
    if (defaultBulb) interiorGroup.remove(defaultBulb);

    // Add Cozy Warm SpotLight
    const cozySpot = new THREE.SpotLight(0xffaa00, 2.0);
    cozySpot.position.set(2, 5, 2);
    cozySpot.target.position.set(0, 0, 0);
    cozySpot.angle = Math.PI / 4;
    cozySpot.penumbra = 0.5;
    cozySpot.castShadow = true;
    interiorGroup.add(cozySpot);
    interiorGroup.add(cozySpot.target);

    // -- SHADOW UNDER R2D2 --
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128; shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grd = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grd;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.02, 0); // Just above floor
    interiorGroup.add(shadowMesh);

    createHologram();
    createR2D2ForHall();

    // Human-sized Bottle - RESTORED
    if (typeof createBottle === 'function') {
        console.log("Calling createBottle inside Hall");
        createBottle(interiorGroup, 3.5, 0, -3.5, 0.19); // Moved right to x=3.5, Scaled up 25%
    } else {
        console.error("createBottle function not found!");
    }
}

function createHologram() {
    // HOLOGRAM: Control Instructions
    const group = new THREE.Group();
    group.position.set(0, 2.5, 0); // Center of room

    // Moving along with the 3D environment (Rotation)
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Glow
    const g = ctx.createRadialGradient(256, 256, 120, 256, 256, 250);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    // Text "In the Circle"
    ctx.fillStyle = '#ccffff';
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10;
    // V209: "INSTRUCTIONS"
    ctx.font = "bold 50px Courier New"; ctx.textAlign = "center";
    ctx.fillText("INSTRUCTIONS", 256, 230);

    ctx.font = "30px Courier New";
    ctx.fillText("DRAG TO ROTATE", 256, 280);
    ctx.fillText("CLICK TO INTERACT", 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    // DoubleSide so it's visible from all angles as it rotates
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });

    // Vertical Plane inside the ring
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), mat);
    mesh.position.y = 0.5;
    group.add(mesh);

    interiorGroup.add(group);
}

function createR2D2ForHall() {
    const r2d2Group = new THREE.Group();
    r2d2Group.scale.set(0.4, 0.4, 0.4);
    r2d2Group.position.set(0, 0, 0);
    r2d2Group.rotation.y = 0;
    interiorGroup.add(r2d2Group);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.1; // Less tilt for standing "happily"

    // Body Group
    const bodyGroup = new THREE.Group();
    const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3, 40), white);
    bodyCyl.castShadow = true;
    bodyGroup.add(bodyCyl);

    // Body Details
    const ventGeo = new THREE.BoxGeometry(0.6, 0.4, 0.1);
    const vent1 = new THREE.Mesh(ventGeo, blue);
    vent1.position.set(0.4, 0.5, 1.35);
    bodyGroup.add(vent1);
    const vent2 = new THREE.Mesh(ventGeo, blue);
    vent2.position.set(-0.4, 0.5, 1.35);
    bodyGroup.add(vent2);

    // R2-D2 Body Rings
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

    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12), silver);
    proj.rotation.x = 0.6;
    proj.position.set(0, 0.35, 1.3);
    domeGroup.add(proj);

    // Blinking Lights
    const lightRed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    lightRed.position.set(0.4, 0.6, 1.25);
    domeGroup.add(lightRed);
    const lightBlue = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    lightBlue.position.set(-0.4, 0.7, 1.25);
    domeGroup.add(lightBlue);
    const lightGreen = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff44 }));
    lightGreen.position.set(0, 0.9, 1.1);
    domeGroup.add(lightGreen);

    domeGroup.position.y = 1.5;
    bodyGroup.add(domeGroup);

    // FOOT
    function createFoot() {
        const foot = new THREE.Group();
        const footTop = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), white);
        footTop.scale.set(1, 1, 2.2);
        foot.add(footTop);
        return foot;
    }

    // Side Legs
    function createSideLeg(side) {
        const legGroup = new THREE.Group();
        const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), white);
        joint.rotation.z = Math.PI / 2;
        joint.position.x = side * 1.5;
        legGroup.add(joint);

        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.4, sideLegHeight, 0.7), white);
        strut.position.y = -sideLegHeight / 2;
        strut.position.x = side * 1.5;
        legGroup.add(strut);

        const foot = createFoot();
        foot.position.y = -sideLegHeight;
        foot.position.z = 0.1;
        foot.position.x = side * 1.5;
        legGroup.add(foot);

        legGroup.position.y = bodyPivotY;
        return legGroup;
    }

    r2d2Group.add(createSideLeg(1));
    r2d2Group.add(createSideLeg(-1));

    // Central Leg
    const centralLeg = new THREE.Group();
    const legSlant = -0.1; // Less slant
    const cStrutHeight = 1.2;
    const cStrut = new THREE.Mesh(new THREE.BoxGeometry(0.4, cStrutHeight, 0.4), white);
    cStrut.position.y = -cStrutHeight / 2;
    centralLeg.add(cStrut);

    const cFoot = createFoot();
    cFoot.rotation.x = Math.abs(bodyTiltAngle) + Math.abs(legSlant);
    cFoot.position.y = -cStrutHeight;
    cFoot.position.z = 0.05;
    centralLeg.add(cFoot);

    centralLeg.position.set(0, -1.2, 0);
    centralLeg.rotation.x = legSlant;
    bodyGroup.add(centralLeg);

    // -- HAPPY HEAD ROTATION --
    // Oscillate between -0.5 and 0.5 radians approx
    const startRot = { y: -0.6 };
    const targetRot = { y: 0.6 };

    // Initial Tween
    const tweenRight = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: 0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    const tweenLeft = new TWEEN.Tween(domeGroup.rotation)
        .to({ y: -0.6 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut);

    // Chain them
    tweenRight.chain(tweenLeft);
    tweenLeft.chain(tweenRight);

    // Random start delay
    setTimeout(() => {
        tweenRight.start();
    }, Math.random() * 1000);

    // Make him clickable? Optional.
    r2d2Group.userData = { type: 'r2d2', name: 'R2D2' };
}


