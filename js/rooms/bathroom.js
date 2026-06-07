function createBathroomInterior() {
    // V128: Cabinet Wood
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.1 });

    // SINK & VANITY (Center)
    // Use woodMat for cabinet
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), woodMat);
    vanity.position.set(0, 0.6, -4.2); interiorGroup.add(vanity);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), whiteMat);
    basin.position.set(0, 1.3, -4.2); interiorGroup.add(basin);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chromeMat);
    faucet.position.set(0, 1.6, -4.7); faucet.rotation.x = Math.PI / 4; interiorGroup.add(faucet);

    // MIRROR
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    mirrorFrame.position.set(0, 3.5, -4.9); interiorGroup.add(mirrorFrame);

    // V123: "Simulate" 3D - Abstract Shader (Cyan/Black/White moving angled blocks)
    const mirrorVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const mirrorFragmentShader = `
        uniform float uViewRotation; // Camera Rotation (Radians)
        varying vec2 vUv;
        
        void main() {
            // Angled movement: Rotated 90 degrees
            // Original: x*0.3 + y*1.0
            // Rotated: x*1.0 + y*0.3 (Swap weights)
            float angle = vUv.x * 1.0 + vUv.y * 0.3; 
            
            // Movement based on Camera Rotation (Parallax)
            // Opposite direction: subtract rotation
            // 0.5 multiplier to tune speed/sensitivity
            float move = uViewRotation * 0.8; 
            
            // Pattern 
            float p = fract(angle - move);
            
            vec3 color = vec3(0.0);
            
            if (p < 0.45) {
                color = vec3(0.0, 0.8, 0.9); // Cyan
            } else if (p < 0.85) {
                color = vec3(0.05, 0.05, 0.05); // Black
            } else {
                color = vec3(1.0, 1.0, 1.0); // White
            }
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const mirrorMat = new THREE.ShaderMaterial({
        vertexShader: mirrorVertexShader,
        fragmentShader: mirrorFragmentShader,
        uniforms: {
            uViewRotation: { value: 0 }
        }
    });

    // Register for animation updates
    if (typeof animatedShaderMaterials !== 'undefined') {
        animatedShaderMaterials.push(mirrorMat);
    }

    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), mirrorMat);
    mirrorGlass.position.z = 0.06; mirrorFrame.add(mirrorGlass);

    // BATHTUB (Right Wall - HOLLOW)
    // BATHTUB (Right Wall - ROUNDED HOLLOW)
    const tubGroup = new THREE.Group();

    // V135: Rounded Hollow Tub
    const tubLength = 6.0; const tubWidth = 2.2; const radius = 0.5;
    const shape = new THREE.Shape();
    // Rounded Rect with Bevels? Or Shape Path?
    // Move to X,Y with radius
    shape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius, 0, Math.PI / 2, false);
    shape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius, Math.PI / 2, Math.PI, false);
    shape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius, Math.PI, Math.PI * 1.5, false);
    shape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius, Math.PI * 1.5, Math.PI * 2, false);

    // Inner Hole
    const wallThick = 0.15;
    const hole = new THREE.Path();
    hole.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, radius - wallThick, 0, Math.PI / 2, false);
    hole.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, radius - wallThick, Math.PI / 2, Math.PI, false);
    hole.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), radius - wallThick, Math.PI, Math.PI * 1.5, false);
    hole.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), radius - wallThick, Math.PI * 1.5, Math.PI * 2, false);
    shape.holes.push(hole);

    const tubGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 1.4, bevelEnabled: false, curveSegments: 16
    });
    // Extrude creates depth in Z. We want Height.
    const tubMesh = new THREE.Mesh(tubGeo, whiteMat);
    tubMesh.rotation.x = -Math.PI / 2; // Lie flat so Z becomes Y (Height)
    // Adjust Y position. Center Z of extrude is 0 to 1.4? No, starts at 0.
    // We want bottom to have a floor.

    // Floor (Inner Puck)
    // Use the exact shape of the "Hole" to fill the bottom
    const floorShape = new THREE.Shape();
    const innerR = radius - wallThick;
    floorShape.absarc(tubLength / 2 - radius, tubWidth / 2 - radius, innerR, 0, Math.PI / 2, false);
    floorShape.absarc(-(tubLength / 2 - radius), tubWidth / 2 - radius, innerR, Math.PI / 2, Math.PI, false);
    floorShape.absarc(-(tubLength / 2 - radius), -(tubWidth / 2 - radius), innerR, Math.PI, Math.PI * 1.5, false);
    floorShape.absarc(tubLength / 2 - radius, -(tubWidth / 2 - radius), innerR, Math.PI * 1.5, Math.PI * 2, false);

    // V161: Solid Extruded PUCK for Floor (Physical Thickness)
    // Prevents Z-Fighting by being a solid thick object on top of tiles
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
        depth: 0.5, // 0.5 thickness
        bevelEnabled: false
    });

    const tubFloorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1 });
    const tubFloor = new THREE.Mesh(floorGeo, tubFloorMat);
    tubFloor.rotation.x = -Math.PI / 2; // Z becomes Y (Height)
    tubFloor.position.y = 0.0; // Base at 0. Top will be at 0.5.
    // Room floor is at 0.01. So 0.0 to 0.5 definitely covers it.

    tubGroup.add(tubMesh);
    tubGroup.add(tubFloor);

    // Water - Oval Plane
    const waterGeo = new THREE.ShapeGeometry(floorShape);
    // V164: Force Blue Color (Phong + Emissive) - No more black water
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        emissive: 0x004488,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.scale.set(0.98, 0.98, 1);
    water.position.y = 0.6; // Lowered slightly to look engaged
    tubGroup.add(water);

    // Position: Center Center
    // Right Edge (3.5). Tub Width is 2.2? No, Width is Z in logic above.
    // Tub Length 6.0 (X). 
    // Position at X=3.5?? 
    // Previous code: tubGroup.position.set(3.5, 0.7, -2.0); tubGroup.rotation.y = -Math.PI/2;
    // Rotated Y -90: Local X becomes World Z. Local Z becomes World X.
    // Local X is Length (6.0). So World Z is Length.
    // Local Y is Width (2.2). (Wait, Shape is X/Y).

    // Extrude was rotated X -90.
    // Shape X -> World X. Shape Y -> World Z. Extrude Z -> World Y.
    // Shape X = Length (6.0). Shape Y = Width (2.2).
    // So Tub is 6.0 wide (X) and 2.2 deep (Z) before group rotation.

    // Group Rotation Y -90:
    // Tub X (6.0) -> World Z.
    // Tub Z (2.2) -> World X.
    // Tub is along Z axis.

    tubGroup.position.set(3.5, 0, -2.0); // Y=0 because extrude starts at 0
    tubGroup.rotation.y = -Math.PI / 2;
    interiorGroup.add(tubGroup);


    // FLOOR - Checkered (High Contrast, Large)
    const checkCanvas = document.createElement('canvas');
    checkCanvas.width = 512; checkCanvas.height = 512;
    const cctx = checkCanvas.getContext('2d');
    cctx.fillStyle = '#ffffff'; cctx.fillRect(0, 0, 512, 512);
    cctx.fillStyle = '#111111'; // Not pure black, but very dark
    const checkSize = 128; // Large Squares
    for (let y = 0; y < 512; y += checkSize) {
        for (let x = 0; x < 512; x += checkSize) {
            if (((x / checkSize) + (y / checkSize)) % 2 !== 0) {
                cctx.fillRect(x, y, checkSize, checkSize);
            }
        }
    }
    const checkTex = new THREE.CanvasTexture(checkCanvas);
    checkTex.wrapS = THREE.RepeatWrapping;
    checkTex.wrapT = THREE.RepeatWrapping;
    checkTex.repeat.set(4, 4);
    checkTex.magFilter = THREE.NearestFilter;
    checkTex.minFilter = THREE.NearestFilter;
    checkTex.anisotropy = 16;

    const floorMat = new THREE.MeshStandardMaterial({
        map: checkTex,
        roughness: 0.2,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; interiorGroup.add(floor);

    // floor...

    // V136: Beige Mat (Instead of Puddles) - Red as per previous request
    const matMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const bathMat = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), matMat);
    bathMat.rotation.x = -Math.PI / 2;
    bathMat.position.set(0, 0.02, -2.0); // Slightly above floor
    interiorGroup.add(bathMat);


    // THOUGHTS
    const thoughts = ["Who am I really?", "Life is but a brief crack of light", "Control vs Chaos", "Am I going to be a good father", "I'm a floating meatball"];
    thoughtInterval = setInterval(() => {
        if (state !== 'ROOM') return;
        const text = thoughts[Math.floor(Math.random() * thoughts.length)];
        const canvas = document.createElement('canvas');
        canvas.width = 1024; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 512, 80);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set((Math.random() - 0.5) * 1.5, 2.4, -4.9);
        sprite.scale.set(0.1, 0.1, 1);
        sprite.userData = { life: 0, speed: 0.015 + Math.random() * 0.01 };
        interiorGroup.add(sprite);
        thoughtParticles.push(sprite);
    }, 2500);
}
