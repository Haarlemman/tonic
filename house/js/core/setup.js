// The House of Meaning Core Setup
// namespace: MeaningHouse.Core.Setup

(function () {
    window.MeaningHouse = window.MeaningHouse || {};
    window.MeaningHouse.Core = window.MeaningHouse.Core || {};

    const Setup = {
        init: function () {
            console.log("--- The House of Meaning Setup Init ---");

            // 1. Scene
            const scene = new THREE.Scene();
            const fogColor = MeaningHouse.Config.lighting.exterior.fogColor;
            scene.fog = new THREE.Fog(fogColor, 20, 500);
            scene.background = new THREE.Color(fogColor);

            // 2. Camera
            const camConfig = MeaningHouse.Config.camera.intro.start;
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(camConfig.px, camConfig.py, camConfig.pz);
            camera.lookAt(camConfig.tx, camConfig.ty, camConfig.tz);

            // 3. Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.domElement.style.filter = 'blur(0px)';
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const container = document.getElementById('canvas-container');
            if (container) {
                container.appendChild(renderer.domElement);
            } else {
                console.warn("Canvas container not found, appending to body");
                document.body.appendChild(renderer.domElement);
            }

            // 4. Controls
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enabled = false;
            controls.enableZoom = false;
            controls.enableRotate = false;
            controls.enablePan = true;
            controls.screenSpacePanning = true;
            controls.panSpeed = 1.0;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxPolarAngle = Math.PI / 2;
            controls.target.set(camConfig.tx, camConfig.ty, camConfig.tz);

            // 5. Groups
            const worldGroup = new THREE.Group();
            scene.add(worldGroup);

            const interiorGroup = new THREE.Group();
            scene.add(interiorGroup);
            interiorGroup.visible = false;

            // Resize Listener
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            // Store in Global State
            MeaningHouse.elements.scene = scene;
            MeaningHouse.elements.camera = camera;
            MeaningHouse.elements.renderer = renderer;
            MeaningHouse.elements.controls = controls;
            MeaningHouse.elements.worldGroup = worldGroup;
            MeaningHouse.elements.interiorGroup = interiorGroup;

            // Global Backwards Compatibility (Important for legacy scripts)
            window.scene = scene;
            window.camera = camera;
            window.renderer = renderer;
            window.controls = controls;
            window.worldGroup = worldGroup;
            window.interiorGroup = interiorGroup;

            return { scene, camera, renderer, controls, worldGroup, interiorGroup };
        }
    };

    MeaningHouse.Core.Setup = Setup;
})();
