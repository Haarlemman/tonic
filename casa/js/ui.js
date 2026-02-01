// --- UI COMPONENTS ---

console.log("--- 20260201 ---");

window.createUniversalVideoInterface = function (parentGroup, position, playlist, options) {
    if (!options) options = {};
    const scale = options.scale || 1.0;

    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(position);
    trafficGroup.scale.set(scale, scale, scale);

    trafficGroup.userData = { type: 'videoInterfaceGroup' };
    console.log("Creating Refined Video UI at", position, "Scale:", scale);
    parentGroup.add(trafficGroup);

    // --- 1. SQUARE BUTTON (TOP) ---
    const btnGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const btnMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x440000
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0, 2.5, 0);

    // Initial State Check
    if (window.videoElement && !window.videoElement.paused) {
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    btn.userData = {
        type: 'videoControlSingle',
        onClick: () => {
            if (!window.videoElement) {
                console.warn("No Window.VideoElement found");
                return;
            }

            if (window.videoElement.paused) {
                // PLAY
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                // If no src, use first in playlist or fallback
                if (!window.videoElement.src || window.videoElement.src === '' || window.videoElement.src === window.location.href) {
                    if (playlist && playlist.length > 0) window.videoElement.src = playlist[0].src;
                }

                window.videoElement.play().catch(e => console.error("Video Play Error:", e));

                btn.material.color.setHex(0x00ff00); // Green
                btn.material.emissive.setHex(0x004400);
            } else {
                // PAUSE
                window.videoElement.pause();
                btn.material.color.setHex(0xffff00); // Yellow
                btn.material.emissive.setHex(0x444400);
            }
        }
    };
    trafficGroup.add(btn);
    if (window.interiorClickables) window.interiorClickables.push(btn);

    // --- 2. HEADER "VIDEO" (MIDDLE) ---
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512; hCanvas.height = 128;
    const hctx = hCanvas.getContext('2d');
    hctx.fillStyle = 'rgba(0,0,0,0)';
    hctx.fillStyle = '#ffffff';
    hctx.font = 'bold 60px Arial';
    hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
    hctx.shadowColor = 'rgba(0,0,0,0.8)'; hctx.shadowBlur = 4; hctx.shadowOffsetX = 2; hctx.shadowOffsetY = 2;
    hctx.fillText("VIDEO", 256, 64);

    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: hTex, transparent: true }));
    hMesh.position.set(0, 1.6, 0);
    trafficGroup.add(hMesh);

    // --- 3. TRACKS (BOTTOM) ---
    const updateAllItems = () => {
        if (window.interiorClickables) {
            window.interiorClickables.forEach(c => {
                if (c.userData.type === 'universalVideoItem' && c.userData.updateState) {
                    c.userData.updateState();
                }
            });
        }
    };
    window.updateVideoUI = updateAllItems;

    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            const yPos = 1.0 - (i * 0.9);

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');

            const sTex = new THREE.CanvasTexture(sCanvas);
            const itemMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 0.8), new THREE.MeshBasicMaterial({ map: sTex, transparent: true }));
            itemMesh.position.set(0, yPos, 0);

            // Dynamic Update Function
            itemMesh.userData.updateState = () => {
                const isActive = (typeof window.masterVideoIndex !== 'undefined' && window.masterVideoIndex === i);
                if (isActive) {
                    sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#00ff00';
                } else {
                    sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#ffffff';
                }
                sctx.font = 'bold 40px Arial';
                sctx.textAlign = 'left'; sctx.textBaseline = 'middle';
                sctx.fillText((i + 1) + ". " + item.title, 20, 50);
                sTex.needsUpdate = true;
            };

            // Initial Draw
            itemMesh.userData.updateState();

            itemMesh.userData.type = 'universalVideoItem';
            itemMesh.userData.index = i;
            itemMesh.userData.onClick = () => {
                console.log("Universal Video Click (Fixed):", i);

                window.masterVideoIndex = i;

                if (options.onPlay && typeof options.onPlay === 'function') {
                    options.onPlay(i);
                }
                else if (window.playTVVideo && typeof window.playTVVideo === 'function') {
                    window.playTVVideo(i);
                } else if (window.videoElement) {
                    window.videoElement.src = item.src;
                    window.videoElement.muted = false;
                    window.videoElement.volume = 1.0;
                    window.videoElement.load();
                    window.videoElement.play().catch(e => console.error(e));
                }

                updateAllItems();

                if (window.interiorClickables) {
                    const btn = window.interiorClickables.find(c => c.userData.type === 'videoControlSingle');
                    if (btn) {
                        btn.material.color.setHex(0x00ff00);
                        btn.material.emissive.setHex(0x004400);
                    }
                }

                if (window.audioPlayer) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }
            };

            trafficGroup.add(itemMesh);
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};
console.log("UI Components Loaded Successfully");
console.log("--- PLUTON.JS LOADED ---");

// --- Holographic Text Helper ---
function createUsherText() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Glowing Background (Perfectly Circular)
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 510);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    grad.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Text with Glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Line 1: Welcome 
    ctx.font = 'bold 90px "Courier New", monospace';
    ctx.fillText("Welcome", 512, 400);

    // Line 2: Subtext
    ctx.font = '45px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 1;
    ctx.fillText("Explore the 9 rooms", 512, 500);
    ctx.fillText("Collect the 9 words", 512, 570);
    ctx.fillText("And win a surprise!", 512, 640);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    return mesh;
}

// --- Ground Shadow Helper (V287) ---
function createUsherShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.05; // Just above ground
    return mesh;
}

// --- Hall-Style Holograph Helper (V285) ---
function createGlitchyHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Soft Radial Glow to ground the text (Exactly like Hall reference)
    const g = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.6, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    // Faces the user (Default +Z)
    return mesh;
}

// --- Main Character Creator ---
function createPlutoUsher() {
    const group = new THREE.Group();

    const halo = createGlitchyHalo();
    const baseH = 1.8;
    halo.position.set(-0.3, baseH, 7.5);
    group.add(halo);

    const text = createUsherText();
    text.position.set(-0.3, baseH, 7.6);
    group.add(text);

    // Update Function
    group.userData.update = function (t) {
        // Simple Bobbing for Hologram
        const bob = Math.sin(t * 1.5) * 0.1;
        halo.position.y = baseH + bob;
        text.position.y = baseH + bob;

        if (halo.userData.update) halo.userData.update(t);
    };

    return group;
}

const WordHunt = (function () {
    // --- STATE ---
    const TOTAL_WORDS = 9;

    // The list of words and their corresponding rooms
    const WORDS = {
        hall: "Wonder",
        living: "Communicate",
        studio: "Create",
        bedroom: "Dream",
        bathroom: "Contemplate",
        attic: "Think",
        basement: "Feel",
        toilet: "Stories",
        annex: "Remember"
    };

    let foundWords = [];

    // --- DOM ELEMENTS ---
    let container = null;
    let icon = null;
    let listContainer = null;
    let prizeOverlay = null;

    // --- INITIALIZATION ---
    function init() {
        console.log("--- Word Hunt Initialized ---");
        loadState();
        createUI();
        updateUI();
    }

    function loadState() {
        const saved = localStorage.getItem('tonic_wordhunt_found');
        if (saved) {
            try {
                foundWords = JSON.parse(saved);
            } catch (e) {
                console.warn("Failed to parse saved words", e);
                foundWords = [];
            }
        }
    }

    function saveState() {
        localStorage.setItem('tonic_wordhunt_found', JSON.stringify(foundWords));
    }

    // --- UI CREATION ---
    function createUI() {
        // 1. Main Icon (Bottom Right, near other controls?)
        // Let's put it on the top-right, under the header, or bottom-left. 
        // Bottom-Left seems free (Minimap area?). Let's try Top-Right (fixed).

        container = document.createElement('div');
        container.id = 'word-hunt-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2000;
            display: none; /* V-FIX: Initially Hidden */
            flex-direction: column-reverse; /* Reverse visual order: later elements appear above */
            align-items: flex-end;
            font-family: 'Arial', sans-serif;
        `;

        // Icon / Counter
        icon = document.createElement('div');
        icon.id = 'word-hunt-icon';
        icon.style.cssText = `
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            text-shadow: 0 0 5px #00ffff;
            transition: all 0.3s;
            user-select: none;
        `;
        icon.innerHTML = `<span style="font-size: 12px;">WORDS: <span id="word-count">0</span>/${TOTAL_WORDS}</span>`;

        icon.onmouseenter = () => icon.style.background = 'rgba(0,0,0,0.8)';
        icon.onmouseleave = () => icon.style.background = 'rgba(0,0,0,0.6)';
        icon.onclick = toggleList;

        container.appendChild(icon);

        // V-NEW: Word Stack Container (Above Counter)
        const wordStack = document.createElement('div');
        wordStack.id = 'word-stack';
        wordStack.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            margin-bottom: 8px;
        `;
        // Insert AFTER icon so it appears above with column layout
        container.appendChild(wordStack);

        // List (Initially Hidden)
        listContainer = document.createElement('div');
        listContainer.id = 'word-hunt-list';
        listContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #444;
            margin-top: 10px;
            padding: 15px;
            border-radius: 4px;
            display: none;
            flex-direction: column;
            gap: 5px;
            min-width: 150px;
        `;
        container.appendChild(listContainer);

        document.body.appendChild(container);

        // Prize Overlay
        createPrizeOverlay();
    }

    function createPrizeOverlay() {
        prizeOverlay = document.createElement('div');
        prizeOverlay.id = 'word-hunt-prize';
        prizeOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95);
            z-index: 3000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            opacity: 0;
            transition: opacity 1s ease;
        `;

        prizeOverlay.innerHTML = `
            <h1 style="font-family: 'Glass Antiqua', serif; font-size: 60px; color: #ffd700; text-shadow: 0 0 20px #ffaa00; margin-bottom: 20px;">CONGRATULATIONS</h1>
            <p style="font-family: 'Glass Antiqua', cursive; font-size: 24px; max-width: 600px; text-align: center; line-height: 1.5; color: #ccc;">
                You have found all the hidden words. The essence of the house is now yours.
            </p>
            <div style="margin-top: 40px; border: 2px solid #ffd700; padding: 20px; border-radius: 10px;">
                <p style="font-size: 20px; color: #ffd700;">[ PRIZE PLACEHOLDER ]</p>
                <p style="font-size: 14px; margin-top: 10px;">(A secret video or link will appear here)</p>
            </div>
            <button id="close-prize-btn" style="margin-top: 50px; background: transparent; border: 1px solid #fff; color: #fff; padding: 10px 30px; cursor: pointer; font-family: 'Courier New';">CLOSE</button>
        `;

        document.body.appendChild(prizeOverlay);

        document.getElementById('close-prize-btn').addEventListener('click', () => {
            prizeOverlay.style.opacity = '0';
            setTimeout(() => { prizeOverlay.style.display = 'none'; }, 1000);
        });
    }

    function toggleList() {
        if (listContainer.style.display === 'none') {
            renderList();
            listContainer.style.display = 'flex';
        } else {
            listContainer.style.display = 'none';
        }
    }

    function renderList() {
        listContainer.innerHTML = '';
        Object.keys(WORDS).forEach(room => {
            const word = WORDS[room];
            const isFound = foundWords.includes(word);

            const item = document.createElement('div');
            item.style.cssText = `
                color: ${isFound ? '#00ff00' : '#555'};
                font-size: 14px;
                display: flex;
                justify-content: space-between;
            `;
            item.innerHTML = `
                <span>${room.toUpperCase()}</span>
                <span>${isFound ? word : '???'}</span>
            `;
            listContainer.appendChild(item);
        });
    }

    function updateUI() {
        const count = document.getElementById('word-count');
        if (count) count.innerText = foundWords.length;
        if (listContainer && listContainer.style.display !== 'none') renderList();
    }

    // V-NEW: Add Word to Stack with Animation
    function addWordToStack(word) {
        const wordStack = document.getElementById('word-stack');
        if (!wordStack) return;

        const wordEl = document.createElement('div');
        wordEl.style.cssText = `
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            text-shadow: 0 0 5px #00ffff;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        wordEl.textContent = word.toUpperCase();
        wordStack.appendChild(wordEl);

        // Trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                wordEl.style.opacity = '1';
                wordEl.style.transform = 'translateY(0)';
            });
        });
    }

    // --- GAME LOGIC ---
    function collectWord(roomName) {
        const word = WORDS[roomName];
        if (!word) return;

        if (!foundWords.includes(word)) {
            console.log(`Collect Word: ${word} in ${roomName}`);
            foundWords.push(word);
            saveState();
            updateUI();

            // Animation / Feedback
            showCollectionFeedback(word);
            addWordToStack(word);

            if (foundWords.length === TOTAL_WORDS) {
                setTimeout(triggerWinState, 1500);
            }
        } else {
            console.log(`Word already collected: ${word}`);
            // Optional: Smaller feedback "Already collected"
        }
    }

    function showCollectionFeedback(word) {
        // Create a temporary floating element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            font-family: 'Glass Antiqua', cursive;
            font-size: 80px;
            color: #00ffff;
            text-shadow: 0 0 20px #00ffff;
            pointer-events: none;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 2500;
        `;
        feedback.innerText = word;
        document.body.appendChild(feedback);

        // Pop In
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1.0)';
        }, 50);

        // Float Up and Fade Out
        setTimeout(() => {
            feedback.style.transform = 'translate(-50%, -150%) scale(1.2)';
            feedback.style.opacity = '0';
        }, 1500);

        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2500);
    }

    function triggerWinState() {
        console.log("WINNER! Playing Prize Video...");

        // Create Video Overlay
        const vidOverlay = document.createElement('div');
        vidOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: black;
            z-index: 5000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 1s;
        `;

        const video = document.createElement('video');
        video.src = '../assets/video/gift.mp4';
        video.style.cssText = "max-width: 90%; max-height: 80vh; box-shadow: 0 0 50px #ffd700;";
        video.controls = true;
        video.autoplay = true;

        // Link Container
        const linkContainer = document.createElement('div');
        linkContainer.style.marginTop = '20px';
        linkContainer.innerHTML = `
            <a href="https://tonic.davidenker.com/" target="_blank" style="color: #ffd700; font-family: 'Glass Antiqua', cursive; font-size: 24px; text-decoration: none; border-bottom: 2px solid #ffd700;">
                CLAIM YOUR ESSENCE
            </a>
            <p style="color: #888; font-family: 'Arial', sans-serif; margin-top: 10px; font-size: 14px;">(Click to proceed)</p>
            <button id="close-win-btn" style="margin-top: 30px; background: transparent; border: 1px solid #555; color: #555; padding: 8px 20px; cursor: pointer;">CLOSE</button>
        `;

        vidOverlay.appendChild(video);
        vidOverlay.appendChild(linkContainer);
        document.body.appendChild(vidOverlay);

        // Fade In
        setTimeout(() => vidOverlay.style.opacity = '1', 100);

        // Close Handler
        const closeBtn = linkContainer.querySelector('#close-win-btn');
        closeBtn.onclick = () => {
            vidOverlay.style.opacity = '0';
            setTimeout(() => document.body.removeChild(vidOverlay), 1000);
        };
    }


    // --- 3D INTERACTABLE CREATION ---
    function createInteractable(roomName, fontSize = 60, color = "#00ffff") {
        const word = WORDS[roomName];
        if (!word) return null;

        // Create a glowing orb/symbol instead of the text directly? 
        // Or floating text that says "?" until clicked?
        // Plan says: "Hidden Word interactables" -> let's make them 3D Text that reveals itself?
        // OR: Small distinct objects.
        // Let's go with a floating "Orb of Knowledge" or a stylized question mark.

        // For distinctness, let's use a standard "Word Hunt Orb" geometry.

        const group = new THREE.Group();
        group.userData = {
            type: 'wordHuntItem',
            isCollectible: true, // Audit Fix: Explicit flag for raycaster
            name: 'WordHunt_' + roomName, // Used for raycasting identification
            onClick: () => collectWord(roomName)
        };

        // 1. The Orb
        const orbGeo = new THREE.IcosahedronGeometry(0.15, 0);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0088aa,
            emissiveIntensity: 0.8,
            wireframe: true
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        group.add(orb);

        // 2. Inner Glow
        const glowGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        group.add(glow);

        // 3. Large Hitbox (Invisible)
        const hitGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: true });
        const hitBox = new THREE.Mesh(hitGeo, hitMat);
        group.add(hitBox);

        // Animation Loop (Self-contained)
        group.userData.update = (t) => {
            orb.rotation.y = t * 2.0;
            orb.rotation.z = t * 1.5;
            const pulse = Math.sin(t * 3.0) * 0.1 + 1.0;
            orb.scale.set(pulse, pulse, pulse);
        };

        // V-FIX: Ensure it is clickable
        if (window.interiorClickables) {
            window.interiorClickables.push(group);
        }

        return group;
    }

    function showUI() {
        if (container) container.style.display = 'flex';
    }

    return {
        init,
        createInteractable,
        showUI, // V-NEW: Exposed for house.js
        // Debug
        collectWord,
        triggerWinState
    };

})();

window.WordHunt = WordHunt;
