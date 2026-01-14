window.createStudioInterior = function () {
    // -- STUDIO INTERIOR (Standard File Remastered) --
    // Content: Furniture (Desk/Chair/Rug) + Video Posters (Metropolis/Tron) + Molecule (Atom)

    // 1. FURNITURE
    // Scaling Group for Furniture
    const furnGroup = new THREE.Group();
    furnGroup.scale.set(1.25, 1.25, 1.25);
    interiorGroup.add(furnGroup);

    // Desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 1.5), deskMat);
    desk.position.set(0, 1.0, -1.5);
    furnGroup.add(desk);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.0, 0.1);
    const fl = new THREE.Mesh(legGeo, deskMat); fl.position.set(-1.4, -0.5, 0.65); desk.add(fl);
    const fr = new THREE.Mesh(legGeo, deskMat); fr.position.set(1.4, -0.5, 0.65); desk.add(fr);
    const bh = new THREE.Mesh(legGeo, deskMat); bh.position.set(-1.4, -0.5, -0.65); desk.add(bh);
    const br = new THREE.Mesh(legGeo, deskMat); br.position.set(1.4, -0.5, -0.65); desk.add(br);

    // Laptop (Interactive)
    const laptopGroup = new THREE.Group();
    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    lapScreen.position.set(0, 0.2, -0.2);
    lapScreen.rotation.x = 0.2;
    const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.35), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0044aa }));
    screenGlow.position.z = 0.02;
    lapScreen.add(screenGlow);
    laptopGroup.add(lapBase); laptopGroup.add(lapScreen);
    laptopGroup.position.set(0, 0.15, 0);
    desk.add(laptopGroup);

    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), new THREE.MeshBasicMaterial({ visible: false }));
    hitBox.userData = { type: 'laptop' };
    hitBox.position.y = 0.3;
    laptopGroup.add(hitBox);
    interiorClickables.push(hitBox);

    // Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), chairMat);
    seat.position.set(0, 0.8, 0.5);
    furnGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.1), chairMat);
    back.position.set(0, 0.5, 0.4);
    seat.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), chairMat);
    stem.position.set(0, -0.4, 0);
    seat.add(stem);

    // Rug
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0xe91e63 }));
    rug.position.set(0, 0.02, 0);
    furnGroup.add(rug);

    // 2. VIDEO POSTERS
    const createVideoPoster = (src, opacity = 1) => {
        const vid = document.createElement('video');
        vid.src = src;
        vid.loop = true;
        vid.muted = true;
        vid.preload = 'auto';
        vid.crossOrigin = "anonymous";
        vid.setAttribute('playsinline', '');
        vid.style.position = 'fixed';
        vid.style.top = '-10000px';
        vid.style.left = '-10000px';
        document.body.appendChild(vid);

        vid.load();
        const p = vid.play();
        if (p !== undefined) {
            p.catch(error => {
                console.error("Auto-play blocked for " + src, error);
            });
        }

        const tex = new THREE.VideoTexture(vid);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            uniform sampler2D map;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(map, vUv);
                float dist = length(vUv - 0.5) * 1.414; 
                float feather = smoothstep(0.1, 0.8, dist); 
                color.a *= opacity * (1.0 - feather);
                gl_FragColor = color;
            }
        `;

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: tex },
                opacity: { value: opacity }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 6.3), mat);
        mesh.userData = { isVideo: true, videoElement: vid };
        return { mesh: mesh, video: vid };
    };

    // Metropolis (Back Wall)
    const mepo = createVideoPoster('video/mepo.mp4', 0.8);
    mepo.mesh.position.set(1.0, 5, -4.9);
    interiorGroup.add(mepo.mesh);

    // Tron (Left Wall)
    const tron = createVideoPoster('video/tronai.mp4', 0.9);
    tron.mesh.scale.set(0.75, 0.75, 0.75);
    tron.mesh.position.set(-4.9, 5, 3.5);
    tron.mesh.rotation.y = Math.PI / 2;
    interiorGroup.add(tron.mesh);

    // 3. MOLECULE (Atom Group)
    atomGroup = new THREE.Group();
    atomGroup.position.set(-3, 4, -3);
    interiorGroup.add(atomGroup);

    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 }));
    atomGroup.add(nucleus);

    const createOrbit = (rx, ry, rz, color) => {
        const orbitGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 50);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        orbitGroup.add(ring);

        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: color }));
        electron.position.x = 1.5;
        orbitGroup.add(electron);

        orbitGroup.rotation.set(rx, ry, rz);
        orbitGroup.userData = { speed: Math.random() * 0.05 + 0.02, electron: electron };
        atomGroup.add(orbitGroup);
    };

    createOrbit(0, 0, 0, 0xff0000);
    createOrbit(Math.PI / 2, 0, 0, 0xffff00);
    createOrbit(0, Math.PI / 2, Math.PI / 4, 0x0000ff);

    // 4. R2-D2 IN RIGHT CORNER
    createR2D2InCorner();
}

window.createR2D2InCorner = function () {
    const r2d2Group = new THREE.Group();
    r2d2Group.scale.set(0.33, 0.33, 0.33);
    r2d2Group.position.set(3.5, 0, -3.5);
    r2d2Group.rotation.y = -Math.PI / 4;
    interiorGroup.add(r2d2Group);

    const white = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.4 });
    const silver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x0044bb, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const sideLegHeight = 2.2;
    const bodyPivotY = sideLegHeight;
    const bodyTiltAngle = -0.32;

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

    // R2-D2 Body Rings (Restored/Kept)
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
    const legSlant = -0.3;
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

    // HOLOGRAM
    const vid = document.createElement('video');
    vid.src = 'video/hologram.mp4';
    vid.loop = true;
    vid.muted = true;
    vid.preload = 'auto';
    vid.crossOrigin = "anonymous";
    vid.setAttribute('playsinline', '');
    vid.style.position = 'fixed';
    vid.style.top = '-10000px';
    vid.style.left = '-10000px';
    document.body.appendChild(vid);

    vid.load();
    const p = vid.play();
    if (p !== undefined) {
        p.catch(error => console.error("Auto-play blocked for hologram", error));
    }

    const holoTex = new THREE.VideoTexture(vid);
    holoTex.minFilter = THREE.LinearFilter;
    holoTex.magFilter = THREE.LinearFilter;

    const hologramGroup = new THREE.Group();

    // BEAM: Modified to be "really more blurry" and a "glowing particle cloud"
    // We removed the banded pulse to get rid of the "rings" in the beam.
    const beamGeo = new THREE.ConeGeometry(0.35, 6, 32, 12, true);
    beamGeo.translate(0, -3, 0);

    const beamMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x44eeff) }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // High energy jitter
                float jitter = fract(sin(time * 10.0 + position.y * 20.0)) * 0.12;
                pos.x += jitter;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            
            void main() {
                // Finer grain for "particle cloud" look
                float grain = hash(vUv * 800.0 + time * 8.0);
                
                // Volume envelope - MUCH BLURRIER
                // Softer smoothsteps create a hazier, less defined edge
                float envelope = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.3, vUv.y);
                float sideFade = pow(sin(vUv.x * 3.14159), 3.0); 
                
                // Glitchy horizontal line cuts - less "ring-like"
                float glitchLines = step(0.98, hash(vec2(floor(time * 20.0), floor(vUv.y * 120.0))));
                
                // Pulsing glow - Removed vUv.y dependency to remove "rings" in the beam
                float pulse = 0.7 + 0.3 * sin(time * 12.0);
                
                // Final alpha combines grain (particles) with the volume shape
                float alpha = (grain * 0.4 + 0.6) * envelope * sideFade * pulse;
                alpha += glitchLines * 0.5;
                
                // Glowing color with random flicker
                float flicker = 0.5 + 0.5 * hash(vec2(time * 15.0, 0.0));
                vec3 finalColor = color + vec3(glitchLines * 0.7);
                
                gl_FragColor = vec4(finalColor, alpha * 0.35 * flicker);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.rotation.x = Math.PI;
    hologramGroup.add(beamMesh);

    const holoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        new THREE.ShaderMaterial({
            uniforms: {
                map: { value: holoTex },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float time;
                varying vec2 vUv;
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                }
                void main() {
                    vec2 uv = vUv;
                    
                    float glitchTime = floor(time * 12.0);
                    if (hash(vec2(glitchTime, 0.0)) > 0.85) {
                        uv.x += (hash(vec2(glitchTime, floor(uv.y * 10.0))) - 0.5) * 0.15;
                    }

                    float splitAmount = 0.012 + noise(vec2(time * 8.0, uv.y * 20.0)) * 0.02;
                    vec4 texColorR = texture2D(map, uv + vec2(splitAmount, 0.0));
                    vec4 texColorG = texture2D(map, uv);
                    vec4 texColorB = texture2D(map, uv - vec2(splitAmount, 0.0));
                    vec4 texColor = vec4(texColorR.r, texColorG.g, texColorB.b, texColorG.a);
                    
                    float greenness = texColor.g - max(texColor.r, texColor.b);
                    float alpha = 1.0 - smoothstep(0.2, 0.4, greenness);
                    
                    float flicker = 0.7 + hash(vec2(time * 30.0, 0.0)) * 0.3;
                    float scanline = sin(uv.y * 200.0 + time * 15.0) * 0.1 + 0.9;
                    float dropout = step(0.94, hash(vec2(time * 10.0, 0.0))); 
                    
                    float finalAlpha = alpha * flicker * scanline * (1.0 - dropout) * 0.85;
                    
                    gl_FragColor = vec4(texColor.rgb + vec3(noise(uv*50.0 + time)*0.1), finalAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );
    holoPlane.position.y = 6;
    holoPlane.rotation.y = Math.PI;
    hologramGroup.add(holoPlane);

    hologramGroup.position.set(0, 0.35, 1.3);
    hologramGroup.rotation.x = 0.7;
    domeGroup.add(hologramGroup);

    if (!window.r2d2Elements) window.r2d2Elements = [];
    window.r2d2Elements.push({
        domeGroup: domeGroup,
        lightRed: lightRed,
        lightBlue: lightBlue,
        lightGreen: lightGreen,
        hologramGroup: hologramGroup,
        holoPlane: holoPlane,
        beamMat: beamMat
    });
}