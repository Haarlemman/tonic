function createBasementInterior() {
    // -- METROPOLIS --
    // V140: Darker Floor (0x111111 -> 0x050505)
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    interiorGroup.add(floor);

    const gridHelper = new THREE.GridHelper(10, 10, 0x00ffcc, 0x222222);
    gridHelper.position.y = 0.05;
    interiorGroup.add(gridHelper);

    // Floating Nodes
    const nodeCount = 60;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    for (let i = 0; i < nodeCount; i++) {
        const isTruth = i % 2 === 0;
        const nodeMat = new THREE.MeshBasicMaterial({ color: isTruth ? 0x00ffcc : 0xff00ff });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set((Math.random() - 0.5) * 8, Math.random() * 6 + 0.5, (Math.random() - 0.5) * 8);
        node.userData = {
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01),
            originalY: node.position.y,
            isTruth: isTruth
        };
        basementNodes.push(node);
        interiorGroup.add(node);
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry();
    basementLines = new THREE.LineSegments(lineGeo, lineMat);
    interiorGroup.add(basementLines);

    // TRON VIDEO
    videoElement.src = "/assets/video/tron-space.mp4";
    videoElement.muted = true; videoElement.loop = true;
    videoElement.play().catch(e => console.warn("Video play failed", e));
    videoTexture = new THREE.VideoTexture(videoElement);
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: videoTexture, opacity: 0.5, transparent: true, blending: THREE.AdditiveBlending }));
    bgMesh.position.set(0, 4, -4.9);
    interiorGroup.add(bgMesh);

    // -- DETROIT MODEL PHI (Replica) --
    if (typeof TechnoEngine !== 'undefined' && !window.technoEngine) {
        window.technoEngine = new TechnoEngine();
    }

    const consoleGeo = new THREE.BoxGeometry(2.4, 0.1, 1.4);
    const drumCanvas = document.createElement('canvas');
    drumCanvas.width = 1024; drumCanvas.height = 1024; // Higher res
    const ctx = drumCanvas.getContext('2d');
    const drumTexture = new THREE.CanvasTexture(drumCanvas);

    // UI HELPER CONSTANTS
    const UI = {
        bg: '#050505',
        panel: 'rgba(17, 24, 39, 0.8)',
        border: 'rgba(55, 65, 81, 0.5)',
        text: '#cccccc',
        accent1: '#f97316', // Orange (303)
        accent2: '#eab308', // Yellow (Moog)
        accent3: '#a855f7', // Purple (Drone)
        gridTop: 350,
        gridHeight: 300,
        gridWidth: 960,
        gridLeft: 32
    };

    const drawPanel = (x, y, w, h, title, color) => {
        ctx.fillStyle = UI.panel;
        ctx.strokeStyle = UI.border;
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        if (title) {
            ctx.fillStyle = color;
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(title, x + 15, y + 25);
        }
    };

    const drawSlider = (x, y, label, valPerc, color) => {
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + 15, y - 10);
        // Track
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x, y, 30, 100);
        // Thumb (Inverted Y)
        const thumbY = y + 100 - (valPerc * 100);
        ctx.fillStyle = color;
        ctx.fillRect(x - 5, thumbY - 5, 40, 10);
    };

    const updateDrumTexture = () => {
        if (!window.technoEngine) return;
        const eng = window.technoEngine;
        const w = 1024, h = 1024;

        // Reset
        ctx.fillStyle = UI.bg; ctx.fillRect(0, 0, w, h);

        // HEADER
        ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, w, 60);
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(40, 30, 10, 0, Math.PI * 2); ctx.fill(); // Logo Dot
        ctx.fillStyle = '#e5e7eb'; ctx.font = 'bold 40px monospace'; ctx.textAlign = 'left'; ctx.fillText("φ DETROIT MODEL", 60, 45);

        // CONTROLS (Play/Rec)
        // CONTROLS (Play/Rec)
        // Play
        // V-REFINE: Bigger Button (Radius 35)
        ctx.fillStyle = eng.isPlaying ? '#22c55e' : '#111827';
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(950, 40, 35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Triangle Size increased
        ctx.fillStyle = eng.isPlaying ? '#000' : '#22c55e';
        ctx.beginPath(); ctx.moveTo(940, 25); ctx.lineTo(965, 40); ctx.lineTo(940, 55); ctx.fill();

        // 1. TB-303 PANEL (Top)
        // Sliders: Cutoff, Res, Env, Decay
        drawPanel(32, 80, 460, 200, "TB-303 BASS", UI.accent1);
        drawSlider(60, 140, "CUT", 0.3, UI.accent1);
        drawSlider(160, 140, "RES", 0.5, UI.accent1);
        drawSlider(260, 140, "ENV", 0.6, UI.accent1);
        drawSlider(360, 140, "DEC", 0.2, UI.accent1);

        // 2. SEQUENCER GRID (Middle)
        drawPanel(32, UI.gridTop, 960, 320, "", UI.border);
        const rows = 6; const cols = 16;
        const padW = 58; const padH = 45;
        const gap = 2;

        const TRACKS = [
            { name: "BD 808", color: "#ff5555" }, { name: "SD 808", color: "#ffaa55" },
            { name: "CH 808", color: "#ffff55" }, { name: "BD 909", color: "#55ff55" },
            { name: "OH 909", color: "#55aaff" }, { name: "ACID", color: "#ff55ff" }
        ];

        eng.grid.forEach((row, r) => {
            const track = TRACKS[r];
            // Label
            ctx.fillStyle = '#6b7280'; ctx.font = '14px monospace'; ctx.textAlign = 'right';
            ctx.fillText(track.name, 90, UI.gridTop + 40 + r * (padH + gap));

            row.forEach((active, c) => {
                const x = 110 + c * (padW + gap);
                const y = UI.gridTop + 20 + r * (padH + gap);
                ctx.fillStyle = active ? track.color : '#1f2937';
                ctx.fillRect(x, y, padW, padH);

                // Beat Marker
                if (c % 4 === 0) { ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1; ctx.strokeRect(x, y, padW, padH); }

                // Playhead
                if (eng.isPlaying && eng.currentStep === c) {
                    ctx.fillStyle = 'rgba(255,255,255,0.4)';
                    ctx.fillRect(x, y, padW, padH);
                }
            });
        });

        // 3. MODEL-D (Bottom Left)
        drawPanel(32, 700, 460, 250, "MODEL-D", UI.accent2);
        drawSlider(60, 760, "FILT", 0.5, UI.accent2);
        drawSlider(160, 760, "DET", 0.3, UI.accent2);
        drawSlider(260, 760, "GLD", 0.1, UI.accent2);
        // Keys visual
        ctx.fillStyle = '#000'; ctx.fillRect(60, 900, 400, 40);
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = '#fff'; ctx.fillRect(60 + i * 50, 900, 48, 40);
        }

        // 4. CHAOS PAD / DRONE (Bottom Right)
        drawPanel(512, 700, 480, 250, "CHAOS / DRONE", UI.accent3);
        // Scope BG
        ctx.fillStyle = '#000'; ctx.fillRect(530, 740, 440, 150);
        ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(750, 740); ctx.lineTo(750, 890); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(530, 815); ctx.lineTo(970, 815); ctx.stroke();

        // Scope Trace
        if (eng.analyser) {
            const bufferLength = eng.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            eng.analyser.getByteTimeDomainData(dataArray);
            ctx.lineWidth = 2; ctx.strokeStyle = '#3b82f6'; ctx.beginPath();
            const sliceWidth = 440 / bufferLength;
            let x = 530;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = 815 + (v - 1) * 75;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.stroke();
        }

        drumTexture.needsUpdate = true;
    };

    updateDrumTexture();

    const animateDrum = (t) => {
        // Redraw for playhead or scope
        updateDrumTexture();
    };

    const blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const consoleMats = [
        blackMat, // +x
        blackMat, // -x
        new THREE.MeshBasicMaterial({ map: drumTexture }), // +y (TOP)
        blackMat, // -y (Bottom)
        blackMat, // +z
        blackMat  // -z
    ];
    // V112: FINAL FIX - Floating Board (No Legs) + Higher
    const drumGroup = new THREE.Group();
    // Position: Raised to 1.7 (Floating)
    drumGroup.position.set(1.6, 1.7, 2.2);
    drumGroup.rotation.y = 0;
    interiorGroup.add(drumGroup);

    // 1. BOARD (Tilted)
    const drumMachine = new THREE.Mesh(consoleGeo, consoleMats);
    drumMachine.rotation.x = 0.5; // Ergonomic Tilt
    drumMachine.userData = {
        type: 'drum_machine',
        update: animateDrum,
        onClick: (intersection) => {
            if (!window.technoEngine) return;
            const eng = window.technoEngine;
            if (eng.ctx.state === 'suspended') eng.ctx.resume();

            // UV MAPPING
            const uv = intersection.uv;
            if (!uv) return;
            const x = uv.x * 1024;
            const y = (1 - uv.y) * 1024;

            // 1. Play Button
            if (y < 80 && x > 900) {
                if (eng.isPlaying) {
                    eng.stop();
                } else {
                    eng.start();
                    // Stop House Music
                    if (window.audioPlayer && !window.audioPlayer.paused) {
                        window.audioPlayer.pause();
                        window.isMusicPlaying = false;
                        if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                    }
                }
                return;
            }

            // 2. Grid Steps
            if (y > 370 && y < 370 + (6 * 47) && x > 110 && x < 110 + (16 * 60)) {
                const r = Math.floor((y - 370) / 47);
                const c = Math.floor((x - 110) / 60);
                if (r >= 0 && r < 6 && c >= 0 && c < 16) {
                    eng.grid[r][c] = !eng.grid[r][c];
                }
            }

            // 3. Chaos Pad
            if (y > 700 && x > 512) {
                eng.drone.toggle();
            }
        }
    };
    drumGroup.add(drumMachine);
    interiorClickables.push(drumMachine);

    // LEGS REMOVED (Floating Look)

    // V105: Expose for Interactive Debugging
    window.drumMachineGroup = drumGroup;
    console.log("V112: Use window.drumMachineGroup.rotation.y to tweak!");

    // Line 2240 in house.js (approx): "Interior Interactions (Sprite Grow...)"
    // It does traversal for Shader uniforms.
    // It does NOT call generic .update() method on all children.
    // FIX: I'll attach this update function to 'animatedShaderMaterials' or similar array?
    // Or just rely on 'onClick' updates mostly?
    // For 'isPlaying' step highlight, we need a loop.
    // I'll add `drumMachine.userData` to a global like `animatedTrees`? No.
    // Easier: `window.activeDrumMachine = drumMachine`.
    // And update it in `animate()` in `house.js`?
    // Or just hack it into `animatedShaderMaterials` which IS looped.
    // `animatedShaderMaterials` iterates materials.
    // I can pass a dummy object with `.uniforms.time`?
    // Better: Add `drumMachine.userData` to `animatedTrees`? No.
    // I will add a line in `house.js` `animate` loop to check `window.activeDrumMachine`.

    window.activeDrumMachine = drumMachine;
    // V113: Removed "Words" (Fears, Truths, etc) per user request
}
