
// ─── SHARED HELPERS ──────────────────────────────────────────────────────────
function mat(color, metalness = 0.5, roughness = 0.5) {
    return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function glassMat(color, transmission = 0.88) {
    return new THREE.MeshPhysicalMaterial({ color, metalness: 0.05, roughness: 0.06, transmission, transparent: true, opacity: 0.92 });
}
function cylinder(w, h, d, mat_) {
    return new THREE.Mesh(new THREE.CylinderGeometry(h, h, w, 12), mat_);
}
function mkPillar(g, mat_, x, y, z, w, d, h, rx, ry) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat_);
    m.position.set(x, y, z);
    m.rotation.x = THREE.MathUtils.degToRad(rx);
    m.rotation.y = THREE.MathUtils.degToRad(ry);
    g.add(m);
}
function border(g, mat_, x, y, z, w, h, rx) {
    const frameGeo = new THREE.BoxGeometry(w, 0.05, 0.04);
    const frame = new THREE.Mesh(frameGeo, mat_);
    frame.position.set(x, y + h / 2, z); frame.rotation.x = rx; g.add(frame);
    const frameB = new THREE.Mesh(frameGeo, mat_);
    frameB.position.set(x, y - h / 2, z); frameB.rotation.x = rx; g.add(frameB);
}

// ─── ROLLS-ROYCE PHANTOM DROPHEAD — full fidelity from 2.html, body white ────
// Caches for repeated geometries
let rrSpokeGeo = null;
let rrSlatGeo = null;

function buildRRWheel(g, pos, chrome, rubber) {
    const [x, y, z] = pos;
    const side = x < 0 ? 1 : -1;

    // V-PERF: Drastic segment reduction (64 -> 16/20)
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.22, 12, 20), rubber);
    tyre.rotation.y = Math.PI / 2; tyre.position.set(x, y, z); g.add(tyre);

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.12, 16), mat(0x1a1a1a, 0.8, 0.22));
    disc.rotation.z = Math.PI / 2; disc.position.set(x + side * 0.06, y, z); g.add(disc);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 12), chrome);
    hub.rotation.z = Math.PI / 2; hub.position.set(x + side * 0.13, y, z); g.add(hub);

    if (!rrSpokeGeo) rrSpokeGeo = new THREE.BoxGeometry(0.055, 0.565, 0.042);
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const spoke = new THREE.Mesh(rrSpokeGeo, chrome);
        spoke.position.set(x + side * 0.13, y + Math.sin(angle) * 0.5, z + Math.cos(angle) * 0.5);
        spoke.rotation.set(0, 0, angle); g.add(spoke);
        // Small parts don't cast shadows
        spoke.castShadow = false;
    }

    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.045, 8, 20), chrome);
    rimRing.rotation.y = Math.PI / 2; rimRing.position.set(x + side * 0.13, y, z); g.add(rimRing);

    const bdisc = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 12), mat(0x333333, 0, 0.7));
    bdisc.rotation.z = Math.PI / 2; bdisc.position.set(x - side * 0.04, y, z); g.add(bdisc);

    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.28), mat(0x888888, 0.5, 0.4));
    caliper.position.set(x - side * 0.01, y + 0.35, z); g.add(caliper);
}

function buildRollsRoyce() {
    const g = new THREE.Group();

    const body = mat(0xf5e6c0, 0.45, 0.12); // Warm ivory-gold bling
    const bodyDark = mat(0xe0cfa0, 0.40, 0.18); // Darker ivory-gold underside
    const chrome = mat(0xffd700, 1.0, 0.02); // Pure gold chrome
    const darkChrome = mat(0xb8860b, 0.95, 0.08); // Dark gold
    const glass = glassMat(0x0a0a18, 0.85);
    const rubber = mat(0x0a0a0a, 0.0, 0.95);
    const softTop = mat(0x1a1210, 0.0, 0.88);
    const leather = mat(0x8b4513, 0.0, 0.65);

    // Lower body
    const bodyBaseRear = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.58, 2.8), bodyDark);
    bodyBaseRear.position.set(0, 0.57, -4.2); bodyBaseRear.castShadow = true; g.add(bodyBaseRear);
    const bodyBaseMid = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.44, 3.0), bodyDark);
    bodyBaseMid.position.set(0, 0.50, 0.25); bodyBaseMid.castShadow = true; g.add(bodyBaseMid);
    const bodyBaseFront = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.58, 2.6), bodyDark);
    bodyBaseFront.position.set(0, 0.57, 4.7); bodyBaseFront.castShadow = true; g.add(bodyBaseFront);

    for (const [wx, wz] of [[-1.12, 3.4], [1.12, 3.4], [-1.12, -2.9], [1.12, -2.9]]) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.12, 12, 32, Math.PI), mat(0x1a1614, 0, 0.9));
        arch.rotation.z = Math.PI / 2; arch.rotation.y = Math.PI / 2;
        arch.position.set(wx, 1.04, wz); g.add(arch);
    }

    const bodyMain = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.82, 9.2), body);
    bodyMain.position.set(0, 1.07, -0.2); bodyMain.castShadow = true; g.add(bodyMain);

    // Boot
    const boot = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.62, 2.2), body);
    boot.position.set(0, 1.62, -3.6); boot.castShadow = true; g.add(boot);
    const bootCurve = cylinder(2.1, 0.9, 2.22, body);
    bootCurve.scale.set(1, 0.18, 1); bootCurve.position.set(0, 1.93, -3.6); bootCurve.rotation.z = Math.PI / 2; g.add(bootCurve);

    // Bonnet
    const bonnet = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.22, 3.8), body);
    bonnet.position.set(0, 1.74, 2.5); bonnet.castShadow = true; g.add(bonnet);
    const bonnetRib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 3.6), chrome);
    bonnetRib.position.set(0, 1.865, 2.5); g.add(bonnetRib);

    // Windscreen frame + A-pillars
    const wsHeader = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.12), chrome);
    wsHeader.position.set(0, 2.62, 0.72); g.add(wsHeader);
    mkPillar(g, body, -0.96, 2.18, 0.8, 0.12, 0.14, 0.92, 20, -12);
    mkPillar(g, body, 0.96, 2.18, 0.8, 0.12, 0.14, 0.92, 20, 12);
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 1.04), glass);
    ws.position.set(0, 2.25, 0.82); ws.rotation.x = -0.38; g.add(ws);
    border(g, chrome, 0, 2.25, 0.82, 1.84, 1.1, -0.38);

    // Interior
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.22, 0.7), mat(0x2a1a08, 0, 0.6));
    dash.position.set(0, 1.72, 0.62); g.add(dash);
    const console_ = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 2.2), mat(0x2a1a08, 0.1, 0.5));
    console_.position.set(0, 1.62, -0.55); g.add(console_);
    for (const sx of [-0.5, 0.5]) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.7), leather);
        seat.position.set(sx, 1.7, 0.0); g.add(seat);
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.55, 0.12), leather);
        seatBack.position.set(sx, 1.98, -0.34); g.add(seatBack);
    }
    for (const sx of [-0.45, 0.45]) {
        const rseat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.62), leather);
        rseat.position.set(sx, 1.7, -1.7); g.add(rseat);
        const rseatBack = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.45, 0.1), leather);
        rseatBack.position.set(sx, 1.94, -2.02); g.add(rseatBack);
    }
    const swRim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 10, 32), mat(0x111111, 0, 0.6));
    swRim.position.set(-0.48, 1.88, 0.38); swRim.rotation.x = 0.55; g.add(swRim);

    // Soft-top stack
    const topStack = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.28, 1.0), softTop);
    topStack.position.set(0, 1.82, -2.85); g.add(topStack);
    for (let i = 0; i < 5; i++) {
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.04, 0.06), mat(0x0e0a08, 0, 0.9));
        ridge.position.set(0, 1.97, -2.42 - i * 0.14); g.add(ridge);
    }
    const tonneau = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 1.05), mat(0x1c140e, 0, 0.75));
    tonneau.position.set(0, 1.98, -2.85); g.add(tonneau);

    // Chrome door tops
    const doorTopL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 4.2), chrome);
    doorTopL.position.set(-1.08, 1.78, -0.8); g.add(doorTopL);
    const doorTopR = doorTopL.clone(); doorTopR.position.x = 1.08; g.add(doorTopR);

    // Door panels (front + rear) + shut lines
    const fdL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.82, 2.1), body);
    fdL.position.set(-1.08, 1.4, -0.15); g.add(fdL);
    const fdR = fdL.clone(); fdR.position.x = 1.08; g.add(fdR);
    const rdL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.82, 2.1), body);
    rdL.position.set(-1.08, 1.4, -2.25); g.add(rdL);
    const rdR = rdL.clone(); rdR.position.x = 1.08; g.add(rdR);
    for (const z of [0.72, -1.72]) {
        const sl = new THREE.Mesh(new THREE.BoxGeometry(0.025, 1.05, 0.03), mat(0x000000, 0, 0.9));
        sl.position.set(-1.08, 1.3, z); g.add(sl);
        const slR = sl.clone(); slR.position.x = 1.08; g.add(slR);
    }

    // Sill + waistline chrome
    const sillL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 8.8), chrome);
    sillL.position.set(-1.08, 0.66, -0.4); g.add(sillL);
    const sillR = sillL.clone(); sillR.position.x = 1.08; g.add(sillR);
    const waistL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.065, 8.9), chrome);
    waistL.position.set(-1.09, 1.66, -0.35); g.add(waistL);
    const waistR = waistL.clone(); waistR.position.x = 1.09; g.add(waistR);

    // Pantheon grille
    const grilleSurround = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.1, 0.35), chrome);
    grilleSurround.position.set(0, 1.52, 4.85); g.add(grilleSurround);
    const grilleRecess = new THREE.Mesh(new THREE.BoxGeometry(1.78, 1.88, 0.38), mat(0x050505, 0, 0.9));
    grilleRecess.position.set(0, 1.52, 4.86); g.add(grilleRecess);

    if (!rrSlatGeo) rrSlatGeo = new THREE.BoxGeometry(0.065, 1.78, 0.12);
    for (let i = -11; i <= 11; i++) {
        const slat = new THREE.Mesh(rrSlatGeo, chrome);
        slat.position.set(i * 0.082, 1.52, 5.0); g.add(slat);
        slat.castShadow = false; // Grille slats don't need independent shadows
    }
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.12, 0.38), chrome);
    topBar.position.set(0, 2.48, 4.85); g.add(topBar);

    // Front bumper + splitter + fogs
    const fBumper = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.55, 0.55), body);
    fBumper.position.set(0, 0.65, 5.05); g.add(fBumper);
    const fBumperChr = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.14, 0.58), chrome);
    fBumperChr.position.set(0, 0.52, 5.05); g.add(fBumperChr);
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.4), mat(0x080808, 0, 0.9));
    splitter.position.set(0, 0.22, 5.1); g.add(splitter);
    for (const x of [-0.82, 0.82]) {
        const fog = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.1), mat(0xffeecc, 1, 0.1));
        fog.position.set(x, 0.62, 5.12); g.add(fog);
    }

    // Rear bumper + exhausts
    const rBumper = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.55, 0.55), body);
    rBumper.position.set(0, 0.65, -5.05); g.add(rBumper);
    const rBumperChr = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.14, 0.58), chrome);
    rBumperChr.position.set(0, 0.52, -5.05); g.add(rBumperChr);
    for (const x of [-0.62, 0.62]) {
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 20), darkChrome);
        exhaust.rotation.x = Math.PI / 2; exhaust.position.set(x, 0.35, -5.18); g.add(exhaust);
        const exhaustDark = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.05, 20), mat(0x000000, 0, 0.9));
        exhaustDark.rotation.x = Math.PI / 2; exhaustDark.position.set(x, 0.35, -5.22); g.add(exhaustDark);
    }

    // Headlights
    for (const side of [-1, 1]) {
        const x = side * 0.88;
        const hCasing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.22), body);
        hCasing.position.set(x, 1.65, 4.88); g.add(hCasing);
        const drl = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.055, 0.06), new THREE.MeshBasicMaterial({ color: 0xf8fff0 }));
        drl.position.set(x, 1.81, 4.98); g.add(drl);
        const lens = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.08), glassMat(0x88aacc, 0.6));
        lens.position.set(x, 1.62, 4.97); g.add(lens);
        const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 20), darkChrome);
        proj.rotation.x = Math.PI / 2; proj.position.set(x, 1.62, 5.0); g.add(proj);
    }

    // Tail lights
    for (const side of [-1, 1]) {
        const x = side * 0.9;
        const tl = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.12), glassMat(0x660000, 0.4));
        tl.position.set(x, 1.62, -4.88); g.add(tl);
        const tlLit = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.62, 0.04), new THREE.MeshBasicMaterial({ color: 0x440000 }));
        tlLit.position.set(x, 1.62, -4.91); g.add(tlLit);
    }

    // Mirrors
    for (const side of [-1, 1]) {
        const mx = side * 1.22;
        const mBase = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.22), body);
        mBase.position.set(mx, 1.95, 0.82); g.add(mBase);
        const mHead = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.26), body);
        mHead.position.set(mx + side * 0.2, 1.92, 0.82); g.add(mHead);
        const mGlass2 = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.18), glassMat(0x223344, 0.7));
        mGlass2.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        mGlass2.position.set(mx + side * 0.41, 1.92, 0.82); g.add(mGlass2);
    }

    // Spirit of Ecstasy
    const statuePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.55, 16), chrome);
    statuePedestal.position.set(0, 2.58, 4.48); g.add(statuePedestal);
    const statueBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.075, 0.32, 12), chrome);
    statueBody.position.set(0, 2.99, 4.48); g.add(statueBody);
    const statueArm = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.14), chrome);
    statueArm.position.set(0, 3.08, 4.48); statueArm.rotation.y = 0.15; g.add(statueArm);

    // RR badge
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.165, 24), chrome);
    badge.position.set(0, 2.52, 5.04); g.add(badge);

    // Wheels (4x)
    const wheelPos = [
        [-1.12, 1.04, 3.4], [1.12, 1.04, 3.4],
        [-1.12, 1.04, -2.9], [1.12, 1.04, -2.9]
    ];
    wheelPos.forEach(p => buildRRWheel(g, p, chrome, rubber));

    return g;
}

// ─── FIAT 500 ─────────────────────────────────────────────────────────────────
function buildFiatWheel(g, pos, chrome, rubber) {
    const [x, y, z] = pos;
    const side = x < 0 ? 1 : -1;

    // V-PERF: Segments reduction (48 -> 16)
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 12, 16), rubber);
    tyre.rotation.y = Math.PI / 2; tyre.position.set(x, y, z); g.add(tyre);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), mat(0x111111, 0.6, 0.35));
    disc.rotation.z = Math.PI / 2; disc.position.set(x + side * 0.03, y, z); g.add(disc);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12), chrome);
    hub.rotation.z = Math.PI / 2; hub.position.set(x + side * 0.06, y, z); g.add(hub);

    const fiatSpokeGeo = new THREE.BoxGeometry(0.055, 0.22, 0.038);
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const spoke = new THREE.Mesh(fiatSpokeGeo, chrome);
        spoke.position.set(x + side * 0.06, y + Math.sin(angle) * 0.22, z + Math.cos(angle) * 0.22);
        spoke.rotation.set(0, 0, angle); g.add(spoke);
        spoke.castShadow = false;
    }
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 8, 16), chrome);
    rim.rotation.y = Math.PI / 2; rim.position.set(x + side * 0.06, y, z); g.add(rim);
    const bdisc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 12), mat(0x333333, 0, 0.7));
    bdisc.rotation.z = Math.PI / 2; bdisc.position.set(x - side * 0.02, y, z); g.add(bdisc);
}

function buildFiat500() {
    const g = new THREE.Group();

    const body = mat(0xcc2222, 0.65, 0.22);
    const bodyDk = mat(0xa01818, 0.6, 0.28);
    const chrome = mat(0xdddddd, 1.0, 0.04);
    const glass = glassMat(0x9bb8cc, 0.78);
    const rubber = mat(0x0c0c0c, 0, 0.92);
    const black = mat(0x080808, 0, 0.85);

    const lowerMid = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.34, 1.5), body);
    lowerMid.position.set(0, 0.42, 0.04); lowerMid.castShadow = true; g.add(lowerMid);
    const lowerFront = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.34, 0.65), body);
    lowerFront.position.set(0, 0.42, 1.62); lowerFront.castShadow = true; g.add(lowerFront);
    const lowerRear = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.34, 0.55), body);
    lowerRear.position.set(0, 0.42, -1.5); lowerRear.castShadow = true; g.add(lowerRear);

    for (const [wx, wz] of [[-0.82, 1.14], [0.82, 1.14], [-0.82, -1.08], [0.82, -1.08]]) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 10, 28, Math.PI), mat(0x200e0e, 0, 0.9));
        arch.rotation.z = Math.PI / 2; arch.rotation.y = Math.PI / 2;
        arch.position.set(wx, 0.46, wz); g.add(arch);
    }

    const fBulge = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24), body);
    fBulge.scale.set(0.79, 0.44, 0.9); fBulge.position.set(0, 0.96, 0.68); fBulge.castShadow = true; g.add(fBulge);
    const rBulge = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24), body);
    rBulge.scale.set(0.77, 0.42, 0.88); rBulge.position.set(0, 0.94, -0.78); rBulge.castShadow = true; g.add(rBulge);
    const centFill = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.84, 1.48), body);
    centFill.position.set(0, 0.92, -0.05); g.add(centFill);

    const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24), body);
    roof.scale.set(0.75, 0.35, 0.82); roof.position.set(0, 1.59, -0.38); roof.castShadow = true; g.add(roof);
    const roofFill = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 1.65), body);
    roofFill.position.set(0, 1.56, -0.38); g.add(roofFill);

    const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 0.72), glass);
    ws.position.set(0, 1.42, 0.84); ws.rotation.x = -0.52; g.add(ws);
    for (const s of [-1, 1]) {
        const ap = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.75, 0.055), chrome);
        ap.position.set(s * 0.66, 1.42, 0.8); ap.rotation.z = s * 0.18; ap.rotation.x = -0.52; g.add(ap);
    }
    for (const side of [-1, 1]) {
        const sw = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.55), glass);
        sw.position.set(side * 0.78, 1.46, -0.28); sw.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(sw);
    }
    for (const side of [-1, 1]) {
        const qw = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.38), glass);
        qw.position.set(side * 0.77, 1.42, -1.02); qw.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(qw);
    }
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), glass);
    rw.position.set(0, 1.44, -1.42); rw.rotation.x = 0.55; g.add(rw);
    const wsurrL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 1.38), chrome);
    wsurrL.position.set(-0.79, 1.49, -0.28); g.add(wsurrL);
    const wsurrR = wsurrL.clone(); wsurrR.position.x = 0.79; g.add(wsurrR);

    for (const side of [-1, 1]) {
        const hx = side * 0.62;
        const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.198, 0.055, 20, 48), chrome);
        bezel.position.set(hx, 1.09, 1.74); g.add(bezel);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.148, 32), glassMat(0xeefff0, 0.55));
        lens.position.set(hx, 1.09, 1.76); g.add(lens);
        const ref = new THREE.Mesh(new THREE.CircleGeometry(0.08, 24), mat(0xddeeff, 0.9, 0.1));
        ref.position.set(hx, 1.09, 1.77); g.add(ref);
    }

    const fBumper = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.38, 0.38), body);
    fBumper.position.set(0, 0.56, 1.82); g.add(fBumper);
    const bumperChr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.42), chrome);
    bumperChr.position.set(0, 0.69, 1.82); g.add(bumperChr);
    const lowerBumpChr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.065, 0.42), chrome);
    lowerBumpChr.position.set(0, 0.42, 1.82); g.add(lowerBumpChr);
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.24, 0.1), chrome);
    grilleFrame.position.set(0, 0.58, 1.96); g.add(grilleFrame);
    for (let i = -2; i <= 2; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.06), black);
        slot.position.set(i * 0.15, 0.58, 1.98); g.add(slot);
    }
    const fbadge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.04), chrome);
    fbadge.position.set(0, 0.92, 1.98); g.add(fbadge);

    const rBumper = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.38, 0.38), body);
    rBumper.position.set(0, 0.56, -1.85); g.add(rBumper);
    const rBumperChr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.42), chrome);
    rBumperChr.position.set(0, 0.69, -1.85); g.add(rBumperChr);
    for (const side of [-1, 1]) {
        const tlBezel = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.042, 16, 36), chrome);
        tlBezel.position.set(side * 0.62, 1.12, -1.78); g.add(tlBezel);
        const tl = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshBasicMaterial({ color: 0x550000 }));
        tl.position.set(side * 0.62, 1.12, -1.77); g.add(tl);
    }
    const exh = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.22, 16), chrome);
    exh.rotation.x = Math.PI / 2; exh.position.set(0, 0.44, -1.98); g.add(exh);

    for (const side of [-1, 1]) {
        const sill = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 3.3), black);
        sill.position.set(side * 0.78, 0.36, 0); g.add(sill);
    }
    for (const side of [-1, 1]) {
        const mx = side * 0.82;
        const mb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.1), body);
        mb.position.set(mx, 1.49, 0.72); g.add(mb);
        const mh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.22), body);
        mh.position.set(mx + side * 0.12, 1.47, 0.72); g.add(mh);
    }

    const wheelPos = [
        [-0.82, 0.46, 1.14], [0.82, 0.46, 1.14],
        [-0.82, 0.46, -1.08], [0.82, 0.46, -1.08]
    ];
    wheelPos.forEach(p => buildFiatWheel(g, p, chrome, rubber));

    return g;
}

// ─── PLACEMENT ───────────────────────────────────────────────────────────────
window.initCars = function (parent) {
    const rr = buildRollsRoyce();
    rr.scale.setScalar(0.52);
    // Right side of house, clear of 3D letters (which occupy z≈6-9, x≈-2..+2)
    rr.position.set(5.5, 0, 4.0);
    if (window.alignToPlanet) window.alignToPlanet(rr, 5.5, 4.0);
    rr.translateY(0.04);
    rr.rotation.y = -Math.PI * 0.1;
    parent.add(rr);

    const fiat = buildFiat500();
    fiat.scale.setScalar(0.56);
    // Alongside Rolls, nudged away from garage door
    fiat.position.set(7.2, 0, 5.2);
    if (window.alignToPlanet) window.alignToPlanet(fiat, 7.2, 5.2);
    fiat.translateY(0.04);
    fiat.rotation.y = -Math.PI * 0.08;
    parent.add(fiat);
};
