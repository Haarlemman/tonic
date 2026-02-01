
// --- UI.JS ---
console.log("Loading UI Logic (V-Modular-Elite)...");

// --- MEDIA MANAGER ---
class GlobalMediaManager {
    constructor() {
        this.audio = document.getElementById('room-audio');
        this.video = document.getElementById('generic-video');
        console.log("GlobalMediaManager Initialized");
    }
    playAudio(src, options = {}) {
        if (!this.audio) return;
        this.audio.src = src;
        if (options.volume !== undefined) this.audio.volume = options.volume;
        if (options.loop !== undefined) this.audio.loop = options.loop;
        return this.audio.play().catch(e => console.warn("Audio play blocked:", e));
    }
    playVideo(src, options = {}) {
        if (!this.video) return;
        this.video.src = src;
        if (options.volume !== undefined) this.video.volume = options.volume;
        if (options.loop !== undefined) this.video.loop = options.loop;
        if (options.muted !== undefined) this.video.muted = options.muted;
        return this.video.play().catch(e => console.warn("Video play blocked:", e));
    }
}
window.mediaManager = new GlobalMediaManager();
window.videoElement = window.mediaManager.video;
window.audioPlayer = window.mediaManager.audio;

// --- UNIVERSAL VIDEO INTERFACE ---
window.createUniversalVideoInterface = function (parentGroup, position, playlist, options = {}) {
    if (!playlist || playlist.length === 0) return;
    const group = new THREE.Group(); group.position.copy(position);
    if (options.scale) group.scale.setScalar(options.scale);
    const h = 0.4 + (playlist.length * 0.3);
    group.add(new THREE.Mesh(new THREE.PlaneGeometry(1.0, h), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 })));
    playlist.forEach((item, i) => {
        const y = (h / 2 - 0.4) - (i * 0.25);
        const btn = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshBasicMaterial({ color: 0x222222 }));
        btn.position.set(0, y, 0.02);
        const lCan = document.createElement('canvas'); lCan.width = 256; lCan.height = 64;
        const lCtx = lCan.getContext('2d'); lCtx.fillStyle = '#fff'; lCtx.font = '24px Arial'; lCtx.textAlign = 'center'; lCtx.fillText((i + 1) + ". " + (item.title || "Video"), 128, 32);
        btn.add(new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lCan), transparent: true }))).position.z = 0.01;
        btn.userData = {
            onClick: () => {
                if (options.onPlay) options.onPlay(i);
                else if (window.playBedroomVideo && currentRoom === 'bedroom') window.playBedroomVideo(i);
                else if (window.playLivingVideo && currentRoom === 'living') window.playLivingVideo(i);
                btn.material.color.setHex(0x00aa00); setTimeout(() => btn.material.color.setHex(0x222222), 500);
            }
        };
        group.add(btn); interiorClickables.push(btn);
    });
    parentGroup.add(group); return group;
};

// --- SHARED ROOM HELPERS ---
window.createLavaLamp = function (scale = 0.1, position = new THREE.Vector3(0, 0, 0)) {
    const group = new THREE.Group(); group.scale.setScalar(scale);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0, metalness: 1 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 2.0 });
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2, 32), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 })));
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 6, 32), glassMat)).position.y = 4;
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1, 32), new THREE.MeshStandardMaterial({ color: 0x111111 }))).position.y = 7.5;
    const blobs = [];
    for (let i = 0; i < 4; i++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), lavaMat);
        b.position.y = 2 + Math.random() * 4; b.userData = { p: Math.random() * 6.28, s: 0.5 + Math.random() * 0.5 };
        group.add(b); blobs.push(b);
    }
    const light = new THREE.PointLight(0xff4400, 2, 10); light.position.y = 4; group.add(light);
    group.userData.update = (t) => {
        blobs.forEach(b => { b.position.y = 2.5 + Math.sin(t * b.userData.s + b.userData.p) * 2; b.scale.setScalar(1 + Math.sin(t * 2 + b.userData.p) * 0.2); });
        light.intensity = 2 + Math.sin(t * 3) * 0.5;
    };
    group.position.copy(position); return group;
};

window.createRoundedBox = function (w, h, d, r) {
    const shape = new THREE.Shape(); const x = -w / 2, y = -h / 2;
    shape.moveTo(x, y + r); shape.lineTo(x, y + h - r); shape.quadraticCurveTo(x, y + h, x + r, y + h); shape.lineTo(x + w - r, y + h); shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r); shape.lineTo(x + w, y + r); shape.quadraticCurveTo(x + w, y, x + w - r, y); shape.lineTo(x + r, y); shape.quadraticCurveTo(x, y, x, y + r);
    return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
};

// --- INTERACTION ---
document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('#pixel-band')) {
        if (typeof exitRoom === 'function') exitRoom();
    }
});

window.hideLoader = function () {
    const l = document.getElementById('loading');
    if (l) { l.style.transition = 'opacity 0.8s'; l.style.opacity = '0'; setTimeout(() => l.style.display = 'none', 800); }
    const tc = document.getElementById('top-controls'); if (tc) tc.style.opacity = '1';
};
