// The House of Meaning Lighting Module
// namespace: MeaningHouse.World.Lighting

(function () {
    window.MeaningHouse = window.MeaningHouse || {};
    window.MeaningHouse.World = window.MeaningHouse.World || {};

    const Lighting = {
        init: function () {
            const scene = MeaningHouse.elements.scene;
            const config = MeaningHouse.Config.lighting.exterior;

            // 1. Ambient
            const ambientLight = new THREE.AmbientLight(0xffffff, config.ambient);
            scene.add(ambientLight);

            // 2. Hemisphere (Global Fill)
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x442288, config.hemi);
            hemiLight.position.set(0, 50, 0);
            scene.add(hemiLight);

            // 3. Directional (Moon/Sun)
            const dirLight = new THREE.DirectionalLight(0xfffaed, config.directional);
            dirLight.position.set(50, 80, 30);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            dirLight.shadow.camera.near = 0.5;
            dirLight.shadow.camera.far = 200;
            const d = 50;
            dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d; dirLight.shadow.camera.bottom = -d;
            scene.add(dirLight);

            // 4. Rim Light
            const rimLight = new THREE.PointLight(0x88ccff, config.rim);
            rimLight.position.set(-20, 20, -20);
            scene.add(rimLight);

            // Store References
            MeaningHouse.elements.lights = { ambientLight, hemiLight, dirLight, rimLight };

            // Legacy Backwards Compat
            window.ambientLight = ambientLight;
            window.hemiLight = hemiLight;
            window.dirLight = dirLight;
            window.rimLight = rimLight;
        },

        // V115: Robust Room Lighting System (Global Control)
        applyRoomLighting: function (roomName) {
            console.log("MeaningHouse Lighting: Apply for", roomName);

            const lights = MeaningHouse.elements.lights;
            if (!lights) return;

            let target = {
                ambient: 0.6,
                dir: 1.2,
                rim: 0.6,
                hemi: 0.6
            };

            // PER-ROOM OVERRIDES (Migrated from house.js)
            if (roomName === 'basement') {
                target = { ambient: 0.15, dir: 0.2, rim: 0.2, hemi: 0.1 };
            } else if (roomName === 'bathroom') {
                target = { ambient: 0.6, dir: 0.8, rim: 0.5, hemi: 0.4 };
            } else if (roomName === 'toilet') {
                target = { ambient: 0.25, dir: 0.4, rim: 0.25, hemi: 0.2 };
            } else if (roomName === 'hall') {
                target = { ambient: 0.15, dir: 0.4, rim: 0.2, hemi: 0.1 };
            } else if (roomName === 'studio' || roomName === 'annex') {
                target = { ambient: 0.4, dir: 0.6, rim: 0.3, hemi: 0.2 };
            } else if (roomName === 'attic') {
                target = { ambient: 0.3, dir: 0.5, rim: 0.3, hemi: 0.2 };
            } else if (roomName === 'living') {
                target = { ambient: 0.4, dir: 0.5, rim: 0.3, hemi: 0.3 };
            } else if (roomName === 'bedroom') {
                target = { ambient: 0.25, dir: 0.3, rim: 0.3, hemi: 0.2 };
            }

            // Apply
            if (lights.ambientLight) lights.ambientLight.intensity = target.ambient;
            if (lights.dirLight) lights.dirLight.intensity = target.dir;
            if (lights.rimLight) lights.rimLight.intensity = target.rim;
            if (lights.hemiLight) lights.hemiLight.intensity = target.hemi;
        }
    };

    MeaningHouse.World.Lighting = Lighting;

    // Legacy Global Hook
    window.applyRoomLighting = Lighting.applyRoomLighting;
})();
