// Tonic Bottle Asset - Rounder & Bubbly
// Tonic Bottle Asset - Rounder & Bubbly & Shiny
let bottleGroup;
let bubbles = [];
let envMap = null; // Generated reflection map


// Smoother Bottle Profile
// Using more points for rounded corners
function getBottlePoints() {
    const p = [];
    p.push(new THREE.Vector2(0, 0));
    // Rounded Base
    p.push(new THREE.Vector2(2.0, 0));
    p.push(new THREE.Vector2(2.6, 0.2));
    p.push(new THREE.Vector2(2.9, 0.6));
    p.push(new THREE.Vector2(3.0, 1.2));

    // Main Body
    p.push(new THREE.Vector2(3.0, 11.0));

    // Rounded Shoulder
    p.push(new THREE.Vector2(2.9, 13.0)); // Start curving in earlier
    p.push(new THREE.Vector2(2.5, 14.5));
    p.push(new THREE.Vector2(1.8, 15.5));
    p.push(new THREE.Vector2(1.2, 16.0));

    // Neck
    p.push(new THREE.Vector2(1.0, 18.0));
    p.push(new THREE.Vector2(1.0, 19.5));
    // Lip
    p.push(new THREE.Vector2(1.2, 19.8));
    p.push(new THREE.Vector2(1.0, 20.0));
    return p;
}

// points and geometry will be initialized lazily in createBottle
let bottlePoints = null;
let bottleGeometry = null;

function createBottle(parentGroup, x, y, z, scale = 1) {
    console.log("Creating Round Bubbly Bottle at", x, y, z);
    if (!parentGroup) console.error("createBottle: parentGroup is null!");

    bottleGroup = new THREE.Group();


    // 0. GENERATE ENV MAP (If not exists)
    if (!envMap) envMap = createSimpleEnvMap();

    // 0.1 LAZY INIT GEOMETRY
    if (!bottleGeometry) {
        bottlePoints = getBottlePoints();
        bottleGeometry = new THREE.LatheGeometry(bottlePoints, 64);
    }


    // 1. GLASS SHELL - Realistic Physical Blue Tint
    // "Hint of blue" for the glass itself
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaddff,        // Blue tint
        transmission: 0.6,      // Less clear (was 1.0)
        opacity: 0.9,           // Slightly opaque
        roughness: 0.2,         // More visible surface (was 0.05)
        metalness: 0.3,         // More reflection (was 0.1)
        ior: 1.5,               // Glass IOR
        thickness: 0.5,         // Thin glass
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,      // Handle transparency sorting
        envMap: envMap,         // Add Reflection
        envMapIntensity: 2.5    // Boost reflections
    });


    const shell = new THREE.Mesh(bottleGeometry, glassMat);
    shell.castShadow = false; // V4: Disable shadow to prevent base artifacts
    shell.receiveShadow = false;
    bottleGroup.add(shell);


    // 1.5 DARKER BOTTOM - REMOVED (User Request "paddistal pops up... that can go")
    // const baseGeo = new THREE.CylinderGeometry(2.6, 2.6, 1.2, 32);
    // const baseMat = new THREE.MeshBasicMaterial({ color: 0x000511, opacity: 0.9, transparent: true });
    // const base = new THREE.Mesh(baseGeo, baseMat);
    // base.position.y = 0.6;
    // base.scale.set(0.9, 1, 0.9);
    // bottleGroup.add(base);


    // 2. LIQUID VOLUME
    // Calculate profile for liquid
    const liquidHeight = 14.0;
    const intersectionX = 2.63;

    const liquidPoints = bottlePoints.filter(p => p.y < liquidHeight).map(p => p.clone());
    liquidPoints.push(new THREE.Vector2(intersectionX, liquidHeight)); // Wall contact
    liquidPoints.push(new THREE.Vector2(0, liquidHeight)); // Center (Flat surface)

    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 32);

    // "More transparent" liquid
    const liquidMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,        // White base (clear)
        emissive: 0x000000,
        transmission: 1.0,      // 100% transmission
        opacity: 0.0,           // 0 opacity (relies on refraction)
        roughness: 0.0,
        metalness: 0,
        ior: 1.33,              // Water
        thickness: 0.0,         // Minimal thickness to avoid milky volume
        transparent: true,
        side: THREE.FrontSide,  // Single side for volume usually better for refraction? Double side is safer for now.
        envMap: envMap,
        envMapIntensity: 1.5
    });


    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.scale.set(0.96, 0.96, 0.96);
    // V3: Fix Z-fighting. Lift liquid slightly so it doesn't fight with bottle floor.
    liquid.position.y = 0.05;
    bottleGroup.add(liquid);
    liquid.castShadow = false;
    liquid.receiveShadow = false;



    // 3. BUBBLES
    // "More like outlines" -> Transparent center, visible rim.
    const bubbleGeo = new THREE.SphereGeometry(0.1, 16, 16); // Slightly better res
    const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,       // White/Clear
        transmission: 1.0,     // Perfectly clear
        opacity: 0.4,          // V2: "More transparent" - lowered from 1.0
        roughness: 0.0,
        metalness: 0.0,        // Less metallic
        ior: 1.1,
        thickness: 0.01,
        transparent: true,
        side: THREE.FrontSide,
        envMap: envMap,
        envMapIntensity: 2.0,  // Slightly reduced reflection strength
        sheen: 0.5,            // Reduced sheen for softer outline
        sheenColor: 0xffffff
    });



    const localBubbles = [];
    const bubbleCount = 1000;

    for (let i = 0; i < bubbleCount; i++) {
        const b = new THREE.Mesh(bubbleGeo, bubbleMat);
        resetBubble(b, liquidHeight);
        b.position.y = Math.random() * liquidHeight;
        localBubbles.push(b);
        bottleGroup.add(b);
    }
    bottleGroup.userData.bubbles = localBubbles;
    bottleGroup.userData.liquidHeight = liquidHeight;
    bubbles.push(...localBubbles);

    // 4. CAP
    const capPoints = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1.2, 0),
        new THREE.Vector2(1.2, 1.2),
        new THREE.Vector2(0.8, 1.8),
        new THREE.Vector2(0, 2.0)
    ];
    const capGeo = new THREE.LatheGeometry(capPoints, 32);
    const capMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 19.8;
    bottleGroup.add(cap);

    // 5. INTERNAL GLOW LIGHT
    const pointLight = new THREE.PointLight(0xaaffff, 3, 30);
    pointLight.position.set(0, 7, 0);
    bottleGroup.add(pointLight);

    bottleGroup.position.set(x, y, z);
    bottleGroup.scale.set(scale, scale, scale);

    parentGroup.add(bottleGroup);
    return bottleGroup;
}

function resetBubble(b, maxHeight = 14) {
    const angle = Math.random() * Math.PI * 2;
    // "Not evenly distributed" -> Clustered near walls or outlines
    // Bias towards the outer radius (2.0 to 2.4)
    // Random between 0 and 1. If > 0.5, push to edge.
    // Let's make 70% of them "wall huggers"
    let rBias;
    if (Math.random() > 0.3) {
        // Edge cluster: 2.0 to 2.5
        rBias = 2.0 + Math.random() * 0.5;
    } else {
        // Inner scatter: 0 to 2.0
        rBias = Math.random() * 2.0;
    }
    // Clamp to bottle width approx 2.6
    const radius = Math.min(2.5, rBias);

    b.position.x = Math.cos(angle) * radius;
    b.position.y = 0.1;
    b.position.z = Math.sin(angle) * radius;
    b.userData.speed = 0.05 + Math.random() * 0.15;
    // V2: Larger bubbles for "outlines" visibility? Or varied.
    const scale = 0.4 + Math.random() * 0.8;
    b.scale.set(scale, scale, scale);
    b.userData.wobblePhase = Math.random() * Math.PI * 2;
}

// Helper: Create a simple Studio Lighting Environment Map (Equirectangular-ish)
function createSimpleEnvMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size / 2; // 2:1 ratio for equirectangular
    const ctx = canvas.getContext('2d');

    // 1. Background (Dark Blue/Grey)
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, size, size / 2);

    // 2. Softbox Highlight (Top)
    const g1 = ctx.createLinearGradient(0, 0, 0, size / 2);
    g1.addColorStop(0, '#ffffff');
    g1.addColorStop(0.2, '#444455');
    g1.addColorStop(1, '#050510');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, size, size / 2);

    // 3. Bright Window/Strip Light (Side)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 50, 100, 150);

    // 4. Warm Ground Reflection (Bottom)
    const g2 = ctx.createLinearGradient(0, size / 2 - 50, 0, size / 2);
    g2.addColorStop(0, 'rgba(50, 30, 0, 0)');
    g2.addColorStop(1, 'rgba(100, 60, 20, 0.5)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, size / 2 - 50, size, 50);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
}


function updateBottle(time) {
    const t = performance.now() * 0.001;
    bubbles.forEach(b => {
        b.position.y += b.userData.speed;
        b.position.x += Math.sin(t * 5 + b.userData.wobblePhase) * 0.005;
        b.position.z += Math.cos(t * 5 + b.userData.wobblePhase) * 0.005;
        const limit = 13.8;
        if (b.position.y > limit) resetBubble(b, limit);
    });
}
