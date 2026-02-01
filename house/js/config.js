// The House of Meaning Configuration
// namespace: MeaningHouse.Config

(function () {
    window.MeaningHouse = window.MeaningHouse || {};

    MeaningHouse.Config = {
        // Camera Constants
        camera: {
            intro: {
                start: { px: -2.8, py: 51.9, pz: 175.9, tx: -1.94, ty: -20.5, tz: -0.94 },
                end: { px: 0.2, py: 2.6, pz: 16.8, tx: -0.01, ty: 1.6, tz: -9.05 }
            },
            house: {
                position: { x: 14, y: 12, z: 18 },
                lookAt: { x: 0, y: 0, z: 0 }
            },
            room: {
                position: { x: 4, y: 6, z: 9 },
                lookAt: { x: 0, y: 2.5, z: 0 }
            }
        },

        // Animation Timings (ms)
        timing: {
            introDuration: 6000,
            roomTransition: 800,
            loaderHideDelay: 2500,
            fadeDuration: 500
        },

        // Lighting Defaults
        lighting: {
            exterior: {
                ambient: 0.4,
                directional: 1.0,
                rim: 0.4,
                hemi: 0.4,
                fogColor: 0x2d1b4e
            },
            house: {
                ambient: 0.25,
                directional: 0.7,
                rim: 0.4,
                hemi: 0.3
            }
        },

        // Asset Paths
        assets: {
            audio: {
                tension: 'audio/Tension_Short_07.wav',
                intro: '/assets/audio/premonition.mp3'
            },
            video: {
                history: '../video/historytrailer.mp4',
                spirit: 'video/spirit.mp4',
                gift: '../assets/video/gift.mp4'
            },
            images: {
                // Add texture paths here as they are extracted
            }
        }
    };
})();
