        let scene, camera, renderer, raycaster, mouse, controls;
        let specialBlocks = [];
        let leaderLines = [];
        let atomGroup, spiritBeam, spiritGlowVolume;

        let audioCtx, analyser, dataArray;
        let audioInitialized = false;
        let beatLevel = 0;

        let introActive = true;
        let skipRequested = false;
        let cinematicTarget = null;
        let lastZoomTime = 0;
        let lastQuoteTime = 0;
        const ZOOM_INTERVAL = 14000;
        const QUOTE_INTERVAL = 2500;

        const tooltip = document.getElementById('tooltip');
        const introTextEl = document.getElementById('intro-text');
        const skipBtn = document.getElementById('skip-btn');
        const hudLayer = document.getElementById('hud-layer');
        const bgMusic = document.getElementById('bg-music');
        const musicToggleBtn = document.getElementById('music-toggle');
        const facultyScreen = document.getElementById('faculty-screen');
        const screenContent = document.getElementById('screen-content');
        const generalMenu = document.getElementById('general-menu');

        const facultyData = {
            art: {
                quotes: ["UNUSUAL IS BEAUTY", "TO CREATE IS TO LIVE", "ESTHETICS OF THE SOUL", "FORM FOLLOWS FREEDOM", "THE CANVAS BLEEDS", "MIND IS THE BRUSH"],
                class: "neon-art",
                quoteIndex: 0
            },
            science: {
                quotes: ["FREE WILL IS A PARADOX", "THE ANSWER IS WHERE YOU ARE NOT LOOKING", "THE MORE YOU KNOW, THE LESS YOU UNDERSTAND", "REALITY IS RELATIVE", "ENTROPY IS A BEGINNING"],
                class: "neon-science",
                quoteIndex: 0
            },
            spirit: {
                quotes: ["ADVERSITY IS YOUR TEACHER", "LETTING GO IS POWER", "SILENCE SPEAKS VOLUMES", "WISDOM THROUGH SURRENDER", "THE VOID STARES BACK", "EGOS ARE NULL"],
                class: "neon-spirit",
                quoteIndex: 0
            }
        };

        const introQuotes = [
            "Welcome to the University of Free Will.",
            "A place of knowledge, wisdom and beauty.",
            "Where letting go of control equals freedom.",
            "And where adversity becomes your teacher."
        ];

        window.onload = function () {
            init();
            animate();
            runIntroSequence();
            skipBtn.onclick = (e) => { e.stopPropagation(); startExperience(); };
        };

        function toggleMenu() {
            generalMenu.classList.toggle('active');
        }

        function toggleMusic() {
            if (!audioInitialized) initAudio();
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

            if (bgMusic.paused) {
                bgMusic.play();
                musicToggleBtn.innerText = "Audio: On";
            } else {
                bgMusic.pause();
                musicToggleBtn.innerText = "Audio: Off";
            }
        }

        async function runIntroSequence() {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.0;
            for (let quote of introQuotes) {
                if (skipRequested) break;
                introTextEl.style.opacity = 0;
                await new Promise(r => setTimeout(r, 800));
                if (skipRequested) break;
                introTextEl.innerText = quote;
                introTextEl.style.opacity = 1;
                await new Promise(r => setTimeout(r, 3500));
            }
        }

        function initAudio() {
            if (audioInitialized) return;
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                const source = audioCtx.createMediaElementSource(bgMusic);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                audioInitialized = true;
                document.getElementById('audio-status').style.opacity = 1;
            } catch (e) { console.log("Audio Error:", e); }
        }

        function startExperience() {
            skipRequested = true;
            introActive = false;
            initAudio();
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            bgMusic.volume = 0.5;
            bgMusic.play().catch(() => { });
            document.getElementById('intro-overlay').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('intro-overlay').style.visibility = 'hidden';
                hudLayer.style.opacity = 1;
                lastZoomTime = Date.now();
            }, 1000);
        }

        function focusBuilding(type) {
            const b = specialBlocks.find(b => b.userData.type === type);
            if (b) {
                cinematicTarget = b;
                lastZoomTime = Date.now();
                lastQuoteTime = Date.now();
                updateFacultyScreen(type);
                facultyScreen.classList.add('active');
            }
        }

        function updateFacultyScreen(type) {
            const data = facultyData[type];
            if (!data) return;
            screenContent.className = 'neon-text ' + data.class;
            screenContent.innerText = data.quotes[data.quoteIndex];
            data.quoteIndex = (data.quoteIndex + 1) % data.quotes.length;
        }

        function createTextSprite(text, color = "#ffffff", isIcon = false) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1024;
            canvas.height = 256;
            if (!isIcon) {
                ctx.fillStyle = 'rgba(0,0,0,0.85)';
                if (ctx.roundRect) ctx.roundRect(200, 64, 624, 128, 12);
                else ctx.fillRect(200, 64, 624, 128);
                ctx.fill();
            }
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
            ctx.font = 'Bold 48px Inter, Arial'; ctx.fillText(text, 512, 128);
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(7.5, 1.875, 1);
            return sprite;
        }

        function createGradientTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 256, 0, 0);
            grad.addColorStop(0, 'white'); grad.addColorStop(0.7, 'rgba(255,255,255,0.2)'); grad.addColorStop(1, 'black');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 1, 256);
            return new THREE.CanvasTexture(canvas);
        }

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1e293b);
            scene.fog = new THREE.Fog(0x1e293b, 40, 140);
            const aspect = window.innerWidth / window.innerHeight;
            const d = 16;
            camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
            camera.position.set(45, 45, 45);
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('canvas-container').appendChild(renderer.domElement);
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            const sun = new THREE.DirectionalLight(0xffffff, 1.0);
            sun.position.set(20, 50, 10);
            sun.castShadow = true;
            scene.add(sun);
            createCampus();
            window.addEventListener('resize', onWindowResize, false);
            window.addEventListener('mousemove', onMouseMove, false);
        }

        function createCampus() {
            const SPACING = 1.6;
            const GRID = 14;
            const centerOffset = (GRID * SPACING) / 2;
            const gradTexture = createGradientTexture();
            const materials = {
                campus: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 }),
                museumWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }),
                museumRed: new THREE.MeshStandardMaterial({ color: 0xef4444 }),
                science: new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.5 }),
                spiritNeon: new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xfacc15, emissiveIntensity: 10, transparent: true, alphaMap: gradTexture }),
                spiritGlow: new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, alphaMap: gradTexture }),
                dottedLine: new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.2, transparent: true, opacity: 0.7 })
            };
            for (let x = 0; x < GRID; x++) {
                for (let z = 0; z < GRID; z++) {
                    let mesh;
                    let type = "campus";
                    let labelText = "";
                    let labelY = 0;
                    if (x === 6 && z === 7) {
                        type = "art"; labelText = "BEAUTY"; labelY = 11.5;
                        const g = new THREE.Group();
                        const core = new THREE.Mesh(new THREE.BoxGeometry(0.8, 6.5, 0.8), materials.museumRed);
                        core.position.y = 3.25; g.add(core);
                        const shards = [{ size: [4.5, 0.8, 3], pos: [0, 1.5, 0], rot: [0.2, 0.1, 0.1] }, { size: [3, 0.8, 5], pos: [-0.5, 3.8, 0.5], rot: [-0.3, -0.4, 0.1] }, { size: [5.5, 0.4, 2.5], pos: [0.8, 2.6, -0.2], rot: [0.1, 0.6, -0.2] }];
                        shards.forEach(s => { const sh = new THREE.Mesh(new THREE.BoxGeometry(...s.size), materials.museumWhite); sh.position.set(...s.pos); sh.rotation.set(...s.rot); g.add(sh); });
                        mesh = g;
                    }
                    else if (x === 10 && z === 3) {
                        type = "science"; labelText = "KNOWLEDGE"; labelY = 11.5;
                        const g = new THREE.Group();
                        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.2, 3, 4), materials.campus);
                        ped.position.y = 1.5; g.add(ped);
                        atomGroup = new THREE.Group();
                        const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), materials.science);
                        atomGroup.add(nuc);
                        const rGeom = new THREE.TorusGeometry(1.4, 0.05, 12, 64);
                        const rMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 });
                        [0, Math.PI / 2].forEach((rot, i) => { const r = new THREE.Mesh(rGeom, rMat); if (i === 1) r.rotation.x = rot; atomGroup.add(r); });
                        atomGroup.position.y = 4.8; g.add(atomGroup);
                        mesh = g;
                    }
                    else if (x === 3 && z === 10) {
                        type = "spirit"; labelText = "WISDOM"; labelY = 3.6;
                        mesh = new THREE.Group();
                        spiritBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.4, 18, 32), materials.spiritNeon);
                        spiritBeam.position.y = 9; mesh.add(spiritBeam);
                        spiritGlowVolume = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.9, 18, 32), materials.spiritGlow);
                        spiritGlowVolume.position.y = 9; mesh.add(spiritGlowVolume);
                    }
                    else {
                        let h = 0.3 + Math.random() * 2.2;
                        mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.campus);
                        mesh.scale.set(1, h, 1); mesh.position.y = h / 2;
                    }
                    mesh.position.x = x * SPACING - centerOffset;
                    mesh.position.z = z * SPACING - centerOffset;
                    mesh.userData = { type, label: labelText || type };
                    scene.add(mesh);
                    if (type !== "campus") {
                        specialBlocks.push(mesh);
                        const label = createTextSprite(labelText, (type === 'spirit' ? '#fef08a' : '#ffffff'));
                        const off = (type === 'spirit') ? 3.5 : 1.2;
                        label.position.set(mesh.position.x + off, labelY, mesh.position.z + off);
                        scene.add(label);
                        const linePts = [new THREE.Vector3(mesh.position.x, 0.5, mesh.position.z), new THREE.Vector3(label.position.x, label.position.y, label.position.z)];
                        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), materials.dottedLine.clone());
                        line.computeLineDistances(); scene.add(line); leaderLines.push(line);
                    }
                }
            }
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
            floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
        }

        function onMouseMove(event) {
            if (introActive) return;
            mouse = mouse || new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster = raycaster || new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(specialBlocks, true);
            if (intersects.length > 0) {
                let t = intersects[0].object; while (t.parent && !t.userData.type) t = t.parent;
                tooltip.style.display = 'block';
                tooltip.style.left = event.clientX + 'px';
                tooltip.style.top = event.clientY + 'px';
                tooltip.innerHTML = `<span class="highlight-${t.userData.type}">${t.userData.label}</span>`;
            } else tooltip.style.display = 'none';
        }

        function onWindowResize() {
            const aspect = window.innerWidth / window.innerHeight;
            const d = 16;
            camera.left = -d * aspect; camera.right = d * aspect;
            camera.top = d; camera.bottom = -d;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.001;
            const now = Date.now();
            if (audioInitialized && !bgMusic.paused) {
                analyser.getByteFrequencyData(dataArray);
                let bass = 0; for (let i = 0; i < 16; i++) bass += dataArray[i];
                beatLevel = (bass / 16 / 255) * 1.5;
                if (controls.autoRotate) controls.autoRotateSpeed = 0.2 + (beatLevel * 6.0);
                specialBlocks.forEach((b, idx) => {
                    const f = dataArray[10 + idx * 8] / 255;
                    const s = 1 + (f * 0.5) + (beatLevel * 0.3);
                    b.scale.lerp(new THREE.Vector3(s, s, s), 0.2);
                });
            } else {
                beatLevel = 0;
                if (controls.autoRotate && !introActive) controls.autoRotateSpeed = 0.2;
            }
            if (atomGroup) { atomGroup.rotation.y += 0.03 + beatLevel * 0.2; atomGroup.rotation.z += 0.02 + beatLevel * 0.2; }
            if (spiritBeam) {
                const s = 1 + Math.sin(time * 5) * 0.1 + beatLevel * 0.8;
                spiritBeam.scale.set(s, 1, s);
                spiritGlowVolume.material.opacity = 0.1 + beatLevel * 0.6;
            }
            leaderLines.forEach(l => {
                l.material.dashOffset -= 0.02 + beatLevel * 0.1;
                l.material.opacity = 0.2 + beatLevel * 0.8;
            });
            if (!introActive && now - lastZoomTime > ZOOM_INTERVAL) {
                if (cinematicTarget) { cinematicTarget = null; facultyScreen.classList.remove('active'); }
                else { cinematicTarget = specialBlocks[Math.floor(Math.random() * specialBlocks.length)]; facultyScreen.classList.add('active'); }
                lastZoomTime = now;
            }
            if (cinematicTarget) {
                controls.target.lerp(cinematicTarget.position.clone(), 0.08);
                camera.zoom = THREE.MathUtils.lerp(camera.zoom, 2.5, 0.04);
                if (now - lastQuoteTime > QUOTE_INTERVAL) { updateFacultyScreen(cinematicTarget.userData.type); lastQuoteTime = now; }
                const vector = cinematicTarget.position.clone();
                vector.y += 2.5; vector.project(camera);
                const x = (vector.x * .5 + .5) * window.innerWidth;
                const y = (vector.y * -.5 + .5) * window.innerHeight;
                facultyScreen.style.left = x + 'px';
                facultyScreen.style.top = y + 'px';
            } else {
                controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.03);
                camera.zoom = THREE.MathUtils.lerp(camera.zoom, 1.0, 0.03);
            }
            camera.updateProjectionMatrix();
            controls.update();
            renderer.render(scene, camera);
        }
