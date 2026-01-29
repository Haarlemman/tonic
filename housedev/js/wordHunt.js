
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
            flex-direction: column-reverse; /* Grow upwards */
            align-items: flex-end;
            font-family: 'Courier New', monospace;
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
        icon.innerHTML = `WORDS: <span id="word-count">0</span>/${TOTAL_WORDS}`;

        icon.onmouseenter = () => icon.style.background = 'rgba(0,0,0,0.8)';
        icon.onmouseleave = () => icon.style.background = 'rgba(0,0,0,0.6)';
        icon.onclick = toggleList;

        container.appendChild(icon);

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
            <p style="font-family: 'Lato', sans-serif; font-size: 24px; max-width: 600px; text-align: center; line-height: 1.5; color: #ccc;">
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
            font-family: 'Glass Antiqua', serif;
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
            <a href="https://tonic.davidenker.com/" target="_blank" style="color: #ffd700; font-family: 'Courier New'; font-size: 24px; text-decoration: none; border-bottom: 2px solid #ffd700;">
                CLAIM YOUR ESSENCE
            </a>
            <p style="color: #888; font-family: sans-serif; margin-top: 10px; font-size: 14px;">(Click to proceed)</p>
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
