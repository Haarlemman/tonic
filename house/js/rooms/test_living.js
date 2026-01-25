
// Mocks
global.window = {};
global.THREE = {
    Group: class { add() { } },
    Mesh: class {
        constructor() { this.position = { set: () => { }, copy: () => { } }; this.rotation = { set: () => { } }; this.scale = { set: () => { } }; this.userData = {}; this.geometry = { attributes: { position: { array: [], count: 0, getY: () => 0, getX: () => 0, setX: () => { } } }, translate: () => { }, rotateX: () => { } }; }
        add() { }
    },
    MeshStandardMaterial: class { },
    MeshBasicMaterial: class { },
    PlaneGeometry: class { attributes = { position: { count: 0 } }; translate() { }; rotateX() { }; },
    BoxGeometry: class { },
    SphereGeometry: class { },
    CylinderGeometry: class { },
    ConeGeometry: class { },
    IcosahedronGeometry: class { },
    CircleGeometry: class { },
    TextureLoader: class { load() { return { colorSpace: '' }; } },
    CanvasTexture: class { },
    VideoTexture: class { },
    PointLight: class { constructor() { this.position = { set: () => { } }; this.shadow = { bias: 0 }; } },
    SpotLight: class { constructor() { this.position = { set: () => { } }; this.target = { position: { set: () => { } } }; } },
    ShaderMaterial: class { },
    Color: class { },
    DoubleSide: 2,
    SRGBColorSpace: 'srgb',
    LinearFilter: 1,
    AdditiveBlending: 2
};
global.interiorGroup = { add: () => { }, children: [], traverse: () => { } };
global.interiorClickables = { push: () => { } };
global.TWEEN = { Easing: { Quadratic: { InOut: {}, Out: {} } }, Tween: class { to() { return this; } easing() { return this; } start() { return this; } onComplete() { return this; } } };
global.document = {
    createElement: () => ({
        getContext: () => ({ fillStyle: '', fillRect: () => { }, strokeRect: () => { }, fillText: () => { }, beginPath: () => { }, arc: () => { }, fill: () => { }, stroke: () => { }, moveTo: () => { }, lineTo: () => { } }),
        setAttribute: () => { }
    })
};

// Load Script
require('./living.js');
console.log("Living Room Script Loaded Successfully");
if (typeof window.createLivingRoomInterior === 'function') {
    console.log("Function exported correctly");
} else {
    console.error("Function NOT exported");
}
