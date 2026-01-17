function createBedroomInterior() {
    // BED (Rounded Corners)
    const bedGroup = new THREE.Group();

    // -- VIDEO PLAYLIST PANEL --
    const buttonGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
    const greenBtn = new THREE.Mesh(buttonGeo, buttonMat);
    greenBtn.position.set(1.8, 4.5, -4.9);
    greenBtn.userData = { type: 'videoPlayButton', state: 'paused' }; // Initial state might need sync? Defaults to paused/ready.
    interiorGroup.add(greenBtn);
    interiorClickables.push(greenBtn);

    greenBtn.material.color.setHex(0xff0000);
    greenBtn.material.emissive.setHex(0x440000);

    // -- DARKER FLOOR FOR BEDROOM --
    const darkFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    darkFloor.rotation.x = -Math.PI / 2; darkFloor.position.y = 0.01;
    interiorGroup.add(darkFloor);

    const mattressColor = 0xfafafa;
    const matMat = new THREE.MeshStandardMaterial({ color: mattressColor });
    const cornerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);

    // 4 Corners
    const c1 = new THREE.Mesh(cornerGeo, matMat); c1.position.set(2.0, 0.5, 2.5); bedGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, matMat); c2.position.set(-2.0, 0.5, 2.5); bedGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, matMat); c3.position.set(2.0, 0.5, -2.5); bedGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, matMat); c4.position.set(-2.0, 0.5, -2.5); bedGroup.add(c4);

    // Fillers (Cross Shape)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 5.8), new THREE.MeshStandardMaterial({ color: 0x4a3728 }));
    frame.position.y = 0.2; bedGroup.add(frame);
    const mainMattress = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.6, 6.0), matMat); mainMattress.position.y = 0.5; bedGroup.add(mainMattress);
    const crossMattress = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 5.0), matMat); crossMattress.position.y = 0.5; bedGroup.add(crossMattress);

    const duvet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.1, 4.5), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    duvet.position.set(0, 0.8, -0.5); bedGroup.add(duvet);
    // PILLOW (Rounded - Horizontal Cylinder)
    const pillowGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
    pillow.rotation.z = Math.PI / 2; // Lie horizontal
    pillow.scale.set(0.6, 1, 1); // Flatten height (local X)
    pillow.position.set(0, 0.85, 2.2);
    bedGroup.add(pillow);

    bedGroup.position.set(2.5, 0, -1);
    interiorGroup.add(bedGroup);

    // DESK (Without Phone)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x5D4037 }));
    desk.position.set(-2.5, 0.6, -3); interiorGroup.add(desk);

    // V135: Lamp on Table (Corner) - Bigger & Brighter
    const lampGroup = new THREE.Group();
    // Base
    lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x222222 })));
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    pole.position.y = 0.4; lampGroup.add(pole);
    // Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    shade.position.y = 0.7; lampGroup.add(shade);
    // Light - Dimmer (Night Bed Lamp) - Darker
    const bulb = new THREE.PointLight(0xffaa00, 0.5, 8); // Reduced to 0.5 (was 1.5)
    bulb.position.y = 0.6;
    lampGroup.add(bulb);

    // Position on Desk (Left Back Corner)
    // Scale Up 2x
    lampGroup.scale.set(2, 2, 2);
    lampGroup.position.set(-3.8, 1.2, -3.5);
    interiorGroup.add(lampGroup);

    // WALL MOUNTED VIDEO PLAYER (BIGGER, BACK WALL)
    const phone = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
    phone.position.set(0, 4.5, -4.95);
    phone.userData = { type: 'videoPhone', state: 'stopped' };
    interiorGroup.add(phone);
    interiorClickables.push(phone);

    videoTexture = new THREE.VideoTexture(videoElement);
    // Force src to Bedroom Playlist (Fixes "wrong video" if coming from other room)
    if (roomContent.bedroom.videoPlaylist && roomContent.bedroom.videoPlaylist.length > 0) {
        videoElement.src = roomContent.bedroom.videoPlaylist[0].src;
        videoElement.pause(); // Start Paused
    }

    const phoneScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.6), new THREE.MeshBasicMaterial({ map: videoTexture }));
    phoneScreenMesh.position.set(0, 0, 0.06);
    phoneScreenMesh.name = 'screen';
    phone.add(phoneScreenMesh);

    if (roomContent.bedroom.videoPlaylist) {
        createVideoPlaylistPanel(roomContent.bedroom.videoPlaylist);
    }

    const shelfGeo = new THREE.BoxGeometry(0.8, 0.1, 1.2);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(-4.6, 3.5, 3.0);
    interiorGroup.add(shelf);

    // Lava Lamp
    createLavaLamp(0.108, shelf.position);
}

function createLavaLamp(scale = 1.0, anchorPos = new THREE.Vector3(0, 0, 0)) {
    const lampGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x080808,
        metalness: 1.0,
        roughness: 0.05
    });

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 2.2, 4.2, 32);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -4.5;
    lampGroup.add(base);

    // Cap
    const topGeo = new THREE.CylinderGeometry(0.6, 1.2, 2, 32);
    const topCap = new THREE.Mesh(topGeo, metalMat);
    topCap.position.y = 7.0;
    lampGroup.add(topCap);

    // Glass
    const glassGeo = new THREE.CylinderGeometry(1.1, 1.5, 10, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.0,
        transmission: 0.96,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        ior: 1.5,
        reflectivity: 1.0,
        clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 1.0;
    lampGroup.add(glass);

    // Liquid Core
    const coreGeo = new THREE.CylinderGeometry(0.98, 1.38, 9.8, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        transparent: true,
        opacity: 0.5,
        emissive: 0xff2200,
        emissiveIntensity: 1.6 // Reduced to 80% (was 2.0)
    });
    const liquidCore = new THREE.Mesh(coreGeo, coreMaterial);
    liquidCore.position.y = 1.0;
    lampGroup.add(liquidCore);

    // Lights
    const internalPointLight = new THREE.PointLight(0xff4d00, 4, 5); // Reduced 80% (was 10)
    internalPointLight.position.set(0, 0, 0);
    lampGroup.add(internalPointLight);

    const baseLight = new THREE.PointLight(0xff4d00, 4, 3); // Reduced 80% (was 5)
    baseLight.position.set(0, -4.5, 0);
    lampGroup.add(baseLight);

    // Blobs
    const lavaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4d00,
        emissive: 0xff4d00,
        emissiveIntensity: 6.4, // Reduced 80% (was 8.0)
        roughness: 0.0
    });

    const blobs = [];
    const blobCount = 5;
    for (let i = 0; i < blobCount; i++) {
        const size = 0.6 + Math.random() * 0.7;
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const blob = new THREE.Mesh(geo, lavaMaterial);

        blob.userData = {
            yOffset: Math.random() * 10,
            speed: 0.5 + Math.random() * 0.5, // Faster relative speed for small cleanup
            rotationPhase: Math.random() * Math.PI * 2,
            baseSize: size,
            driftSpeed: 1.0 + Math.random() * 1.0
        };

        blobs.push(blob);
        lampGroup.add(blob);
    }

    // Animation Logic attached to Group
    let colorHue = 0.05;

    lampGroup.scale.set(scale, scale, scale);

    // Position: On Top of the Shelf
    let yPos = 1.2; // Fallback
    if (anchorPos) {
        // Shelf Top is anchorPos.y + 0.05
        // Lamp Bottom Offset is 6.6 * scale
        yPos = anchorPos.y + 0.05 + (6.6 * scale);
    }

    let xPos = -1.2;
    let zPos = -3.5;
    if (anchorPos) {
        xPos = anchorPos.x;
        zPos = anchorPos.z;
    }

    lampGroup.position.set(xPos, yPos, zPos);

    lampGroup.userData.update = function (t) {
        // Color Shift
        colorHue += 0.001; // Slower
        if (colorHue > 1) colorHue = 0;
        const newColor = new THREE.Color();
        newColor.setHSL(colorHue, 1.0, 0.5);

        lavaMaterial.color.copy(newColor);
        lavaMaterial.emissive.copy(newColor);
        coreMaterial.color.copy(newColor);
        coreMaterial.emissive.copy(newColor);
        baseLight.color.copy(newColor);
        internalPointLight.color.copy(newColor);

        // Blobs
        blobs.forEach((blob) => {
            const data = blob.userData;
            // Original code used `time` in ms * 0.001. `t` passed from update is likely seconds.
            // But let's check `t` in house.js... animate(time). 
            // `t = time * 0.001` (seconds).

            // Re-tuning physics for 't' (seconds)
            const yAmplitude = 4.3;
            const yBase = 0.5;

            const timeVal = t;

            const yPos = yBase + Math.sin(timeVal * data.speed + data.yOffset) * yAmplitude;
            const normalizedY = (yPos - (yBase - yAmplitude)) / (yAmplitude * 2);

            const currentBottleRadius = 1.5 - (normalizedY * 0.4);
            const heightScaleFactor = 1.0 - (normalizedY * 0.5);
            // safeRadius adjusted to keep blobs inside
            const safeRadius = (currentBottleRadius - (data.baseSize * heightScaleFactor)) * 0.7;

            blob.position.y = yPos;
            blob.position.x = Math.sin(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;
            blob.position.z = Math.cos(timeVal * data.driftSpeed + data.rotationPhase) * safeRadius;

            const pulse = 1 + Math.sin(timeVal * 1.5 + data.yOffset) * 0.1;
            const finalScale = heightScaleFactor * pulse;
            blob.scale.set(finalScale, finalScale, finalScale);
        });
    };

    interiorGroup.add(lampGroup);
}

function nextBedroomVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % roomContent.bedroom.videoPlaylist.length;
    startVideoClip('bedroom');
}

function playVideo(index) {
    const playlist = roomContent.bedroom.videoPlaylist;
    if (!playlist || !playlist[index]) return;

    currentVideoIndex = index;
    startVideoClip('bedroom');

    // Update Button State to Green (Playing)
    const btn = interiorGroup.children.find(c => c.userData.type === 'videoPlayButton');
    if (btn) {
        btn.userData.state = 'playing';
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    // Clear video items
    const toRemove = [];
    interiorGroup.traverse(child => {
        if (child.userData && (child.userData.type === 'videoItem' || child.userData.type === 'videoHeader')) {
            toRemove.push(child);
        }
    });

    toRemove.forEach(child => {
        interiorGroup.remove(child);
        const idx = interiorClickables.indexOf(child);
        if (idx > -1) interiorClickables.splice(idx, 1);
    });

    createVideoPlaylistPanel(playlist);
}

function createVideoPlaylistPanel(playlist) {
    if (!playlist || playlist.length === 0) return;

    // Header
    const headCanvas = document.createElement('canvas');
    headCanvas.width = 256; headCanvas.height = 64;
    const hctx = headCanvas.getContext('2d');
    // V12: Removed Black Background (Transparent)
    hctx.clearRect(0, 0, 256, 64);
    // hctx.fillStyle = '#000000'; hctx.fillRect(0, 0, 256, 64); 
    hctx.fillStyle = '#ffffff'; hctx.font = 'bold 36px Arial'; hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
    hctx.fillText("VIDEOS", 128, 32);
    const headTex = new THREE.CanvasTexture(headCanvas);
    // V13 FIX: Add transparent: true to Material!
    const headMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.4), new THREE.MeshBasicMaterial({ map: headTex, transparent: true }));
    // V6: Move slightly forward -4.8
    headMesh.position.set(-2.8, 6.0, -4.8);
    headMesh.userData = { type: 'videoHeader' };
    interiorGroup.add(headMesh);

    playlist.forEach((item, i) => {
        const isCurrent = i === currentVideoIndex;
        // INCREASED HEIGHT FOR 2 LINES (Artist Support)
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // V61: Revert Playlist to Green Tint
        if (isCurrent) {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
            ctx.fillRect(0, 0, 512, 128);
            ctx.fillStyle = '#4ade80'; // Bright Green Text
        } else {
            // Transparent background (Very faint white for hit area logging?)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, 512, 128);
            ctx.fillStyle = '#ffffff'; // White Text
        }

        // LINE 1: Title
        ctx.font = 'bold 44px Arial'; // Bigger font
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText((i + 1) + ". " + item.title, 20, 60);

        // LINE 2: Artist
        if (item.artist) {
            ctx.font = 'italic 32px Arial'; ctx.textBaseline = 'top';
            // V14: Artist stays BRIGHT GREEN if current
            ctx.fillStyle = isCurrent ? '#4ade80' : '#cccccc';
            ctx.fillText(item.artist, 50, 70);
        }

        const tex = new THREE.CanvasTexture(canvas);
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));

        // Position: V6 move to -4.8
        mesh.position.set(-2.8, 5.5 - (i * 0.7), -4.8);
        mesh.userData = { type: 'videoItem', index: i };
        interiorGroup.add(mesh);
        interiorClickables.push(mesh);
    });
}
