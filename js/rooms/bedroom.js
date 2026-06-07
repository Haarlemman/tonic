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
    // Light - Dimmer (Night Bed Lamp)
    const bulb = new THREE.PointLight(0xffaa00, 1.5, 8); // Intensity 1.5 (Was 5.0)
    bulb.position.y = 0.6;
    lampGroup.add(bulb);

    // Position on Desk (Left Back Corner)
    // Scale Up 2x
    lampGroup.scale.set(2, 2, 2);
    lampGroup.position.set(-3.8, 1.2, -3.5);
    interiorGroup.add(lampGroup);

    // WALL MOUNTED VIDEO PLAYER (BIGGER, BACK WALL)
    // User wants it bigger. Box 2.2 x 3.8
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

    // V14: Removed Indicator Light
    // const playBtn = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 }));
    // playBtn.position.set(0.9, -1.7, 0.07);
    // playBtn.name = "indicatorLight";
    // phone.add(playBtn);
    // interiorClickables.push(playBtn);

    // V7 FIX: Call createVideoPlaylistPanel !!
    if (roomContent.bedroom.videoPlaylist) {
        createVideoPlaylistPanel(roomContent.bedroom.videoPlaylist);
    }
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
