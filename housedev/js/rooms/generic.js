function createGenericInterior(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.font = 'bold 40px Arial'; ctx.textAlign = 'center';
    ctx.shadowColor = "black"; ctx.shadowBlur = 4; ctx.fillText(text, 256, 128);
    const tex = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    plane.position.set(0, 4, -4.9);
    interiorGroup.add(plane);
}
