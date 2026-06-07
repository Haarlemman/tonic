// ============================================================
//  HOUSE OF AWE — iOS / Mobile Patch  (mobile.js)
//  Drop this AFTER house.js, rooms.js, ui.js in house.html
//
//  Fixes:
//  1. Virtual joystick  — movement inside rooms on touch devices
//  2. Look / orbit      — single-finger drag mapped to OrbitControls
//  3. Fullscreen        — iOS doesn't support the API; falls back to
//                         a CSS "expand to fill viewport" trick
//  4. Audio unlock      — re-tries audio on first touch inside the iframe
//  5. Viewport height   — corrects 100vh on iOS Safari (address-bar gap)
//  6. Pinch-to-zoom     — routed through OrbitControls dolly
// ============================================================

(function () {
    'use strict';

    // ── Detect touch / iOS ──────────────────────────────────
    const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const IS_IOS   = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!IS_TOUCH) return; // Desktop — nothing to do

    // ── 1. VIRTUAL JOYSTICK ─────────────────────────────────
    //
    //  A semi-transparent left-side stick that maps displacement
    //  to the existing window._wasdKeys so the rest of the engine
    //  needs zero changes.
    //
    //  The joystick is only shown when _wasdEnabled === true
    //  (i.e. the player is inside a room).

    const STICK_SIZE  = 110;   // outer ring diameter (px)
    const KNOB_SIZE   = 46;    // inner knob diameter (px)
    const DEAD_ZONE   = 8;     // px — ignore tiny drifts
    const SAFE_BOTTOM = 28;    // px above home-indicator

    // Build DOM
    const stick = document.createElement('div');
    stick.id = 'mobile-joystick';
    Object.assign(stick.style, {
        position:        'fixed',
        bottom:          (SAFE_BOTTOM + 'px'),
        left:            '28px',
        width:           (STICK_SIZE + 'px'),
        height:          (STICK_SIZE + 'px'),
        borderRadius:    '50%',
        background:      'rgba(255,255,255,0.10)',
        border:          '2px solid rgba(255,255,255,0.25)',
        zIndex:          '9000',
        display:         'none',           // hidden until inside room
        touchAction:     'none',
        userSelect:      'none',
        WebkitUserSelect:'none',
        pointerEvents:   'auto',
        boxSizing:       'border-box',
        backdropFilter:  'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
    });

    const knob = document.createElement('div');
    Object.assign(knob.style, {
        position:     'absolute',
        width:        (KNOB_SIZE + 'px'),
        height:       (KNOB_SIZE + 'px'),
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.55)',
        top:          '50%',
        left:         '50%',
        transform:    'translate(-50%,-50%)',
        transition:   'transform 0.05s ease',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.4)',
        pointerEvents:'none',
    });

    stick.appendChild(knob);
    document.body.appendChild(stick);

    // State
    let stickActive  = false;
    let stickOriginX = 0;
    let stickOriginY = 0;
    let stickTouchId = null;

    const MAX_DISP = (STICK_SIZE / 2) - (KNOB_SIZE / 2);   // max knob travel

    function updateKnob(dx, dy) {
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const clamp = Math.min(dist, MAX_DISP);
        const angle = Math.atan2(dy, dx);
        const kx = Math.cos(angle) * clamp;
        const ky = Math.sin(angle) * clamp;
        knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
    }

    function resetKnob() {
        knob.style.transform = 'translate(-50%,-50%)';
        if (window._wasdKeys) {
            window._wasdKeys.w = false;
            window._wasdKeys.a = false;
            window._wasdKeys.s = false;
            window._wasdKeys.d = false;
        }
    }

    function applyKeys(dx, dy) {
        if (!window._wasdKeys) return;
        const threshold = DEAD_ZONE;
        window._wasdKeys.w = dy < -threshold;
        window._wasdKeys.s = dy >  threshold;
        window._wasdKeys.a = dx < -threshold;
        window._wasdKeys.d = dx >  threshold;
    }

    stick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const t = e.changedTouches[0];
        stickActive  = true;
        stickTouchId = t.identifier;
        const r = stick.getBoundingClientRect();
        stickOriginX = r.left + r.width  / 2;
        stickOriginY = r.top  + r.height / 2;
    }, { passive: false });

    stick.addEventListener('touchmove', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!stickActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier !== stickTouchId) continue;
            const dx = t.clientX - stickOriginX;
            const dy = t.clientY - stickOriginY;
            updateKnob(dx, dy);
            applyKeys(dx, dy);
        }
    }, { passive: false });

    function onStickEnd(e) {
        e.preventDefault();
        stickActive  = false;
        stickTouchId = null;
        resetKnob();
    }
    stick.addEventListener('touchend',    onStickEnd, { passive: false });
    stick.addEventListener('touchcancel', onStickEnd, { passive: false });

    // Show / hide joystick based on _wasdEnabled state.
    // We poll because house.js doesn't emit a custom event for this.
    let _lastWasdEnabled = false;
    setInterval(() => {
        const enabled = !!window._wasdEnabled;
        if (enabled !== _lastWasdEnabled) {
            _lastWasdEnabled = enabled;
            stick.style.display = enabled ? 'block' : 'none';
            if (!enabled) resetKnob();
        }
    }, 200);


    // ── 2. SINGLE-FINGER LOOK / ORBIT (right half of screen) ─
    //
    //  OrbitControls handles two-finger pinch automatically once
    //  touch events reach the canvas. The missing piece is
    //  single-finger orbit (looking around). We translate a
    //  touchmove on the RIGHT half of the canvas into mouse-like
    //  deltas fed to OrbitControls.
    //
    //  Implementation: inject synthetic pointermove events so
    //  OrbitControls picks them up without any changes to house.js.

    let lookTouchId  = null;
    let lookLastX    = 0;
    let lookLastY    = 0;
    let lookPointerDown = false;

    const canvas = document.getElementById('canvas-container');

    function touchIsOnRightHalf(t) {
        return t.clientX > window.innerWidth * 0.45;
    }

    function firePointerEvent(type, x, y, id) {
        const canvas3d = canvas ? canvas.querySelector('canvas') : null;
        const target = canvas3d || document.elementFromPoint(x, y) || document.body;
        const evt = new PointerEvent(type, {
            clientX: x, clientY: y,
            pointerId: id || 1,
            pointerType: 'touch',
            isPrimary: true,
            bubbles: true,
            cancelable: true,
        });
        target.dispatchEvent(evt);
    }

    document.addEventListener('touchstart', (e) => {
        // Skip if touch is on the joystick or a UI element
        if (e.target.closest('#mobile-joystick, button, input, textarea, select, a, [data-ui]')) return;
        if (!window._wasdEnabled) return; // only inside rooms

        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (lookTouchId === null && touchIsOnRightHalf(t)) {
                lookTouchId = t.identifier;
                lookLastX = t.clientX;
                lookLastY = t.clientY;
                lookPointerDown = true;
                firePointerEvent('pointerdown', t.clientX, t.clientY, 99);
                break;
            }
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (lookTouchId === null || !lookPointerDown) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier !== lookTouchId) continue;
            firePointerEvent('pointermove', t.clientX, t.clientY, 99);
            lookLastX = t.clientX;
            lookLastY = t.clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === lookTouchId) {
                firePointerEvent('pointerup', lookLastX, lookLastY, 99);
                lookTouchId  = null;
                lookPointerDown = false;
            }
        }
    }, { passive: true });

    document.addEventListener('touchcancel', () => {
        if (lookTouchId !== null) {
            firePointerEvent('pointerup', lookLastX, lookLastY, 99);
            lookTouchId = null;
            lookPointerDown = false;
        }
    }, { passive: true });


    // ── 3. iOS FULLSCREEN FALLBACK ───────────────────────────
    //
    //  iOS Safari does not support requestFullscreen() at all.
    //  Patch toggleGlobalFullscreen() to do a CSS-based expansion
    //  instead: add/remove a class that sets position:fixed + inset:0.

    const FS_CLASS = 'ios-fake-fullscreen';

    // Inject the CSS class once
    const fsStyle = document.createElement('style');
    fsStyle.textContent = `
        .${FS_CLASS} {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            height: 100dvh !important;
            z-index: 99999 !important;
        }
        .${FS_CLASS} ~ * { display: none !important; }
    `;
    document.head.appendChild(fsStyle);

    if (IS_IOS) {
        window.toggleGlobalFullscreen = function () {
            const docEl   = document.documentElement;
            const iconOn  = document.getElementById('icon-fullscreen-on');
            const iconOff = document.getElementById('icon-fullscreen-off');
            const isFs    = docEl.classList.contains(FS_CLASS);

            if (!isFs) {
                docEl.classList.add(FS_CLASS);
                // Also scroll to top so the 3D canvas fills from y=0
                window.scrollTo(0, 0);
                if (iconOn)  iconOn.classList.add('hidden');
                if (iconOff) iconOff.classList.remove('hidden');
            } else {
                docEl.classList.remove(FS_CLASS);
                if (iconOn)  iconOn.classList.remove('hidden');
                if (iconOff) iconOff.classList.add('hidden');
            }
        };
    }


    // ── 4. AUDIO UNLOCK ON FIRST TOUCH ──────────────────────
    //
    //  iOS requires that AudioContext.resume() and audio.play()
    //  are called from within a user-gesture handler IN THE SAME
    //  document (not an ancestor frame). This listener fires once
    //  on the first touch inside house.html and unlocks everything.

    function unlockAudio() {
        // Resume Web Audio context
        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume().catch(() => {});
        }
        // Also attempt to play the current audio player
        if (window.audioPlayer && window.audioPlayer.paused && window.isMusicPlaying) {
            window.audioPlayer.play().catch(() => {});
        }
        // One-shot
        document.removeEventListener('touchstart', unlockAudio, true);
    }
    document.addEventListener('touchstart', unlockAudio, { passive: true, capture: true });


    // ── 5. VIEWPORT HEIGHT — fix 100vh on iOS Safari ─────────
    //
    //  iOS reports window.innerHeight as the FULL screen height
    //  (ignoring the address bar) which means elements set to
    //  100vh get clipped.  We write a --vh custom property and
    //  update it on resize / orientationchange.

    function setVh() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setVh();
    window.addEventListener('resize',            setVh, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(setVh, 300), { passive: true });

    // Patch any element that uses 100vh in its inline style to use --vh instead.
    // (The canvas container uses CSS classes which already include 100dvh,
    //  but the loading screen uses an inline height:100%)
    const loadingEl = document.getElementById('loading');
    if (loadingEl && IS_IOS) {
        loadingEl.style.height = 'calc(var(--vh, 1vh) * 100)';
    }
    const canvasContainerEl = document.getElementById('canvas-container');
    if (canvasContainerEl && IS_IOS) {
        canvasContainerEl.style.height = 'calc(var(--vh, 1vh) * 100)';
    }


    // ── 6. PINCH-TO-ZOOM via OrbitControls ──────────────────
    //
    //  OrbitControls.enableZoom = true already handles two-finger
    //  pinch on desktop Chrome/Firefox. On iOS it works IF the
    //  canvas has touch-action:none (which style.css already sets
    //  on #canvas-container). Nothing extra needed here — just make
    //  sure we don't accidentally preventDefault on the canvas's
    //  touch events (we only preventDefault on the joystick above).


    // ── 7. PREVENT DOUBLE-TAP ZOOM & CONTEXT MENU ───────────
    //
    //  Double-tap on iOS zooms the page; long-press shows a
    //  context menu. Both break the 3D experience.

    let lastTap = 0;
    document.addEventListener('touchend', (e) => {
        // Skip UI elements
        if (e.target.closest('button, input, textarea, a, #mobile-joystick')) return;
        const now = Date.now();
        if (now - lastTap < 300) {
            e.preventDefault(); // kill double-tap zoom
        }
        lastTap = now;
    }, { passive: false });

    document.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('input, textarea')) {
            e.preventDefault();
        }
    }, { passive: false });


    // ── 8. SCROLL LOCK inside the 3D canvas ─────────────────
    //
    //  When the user is navigating the 3D scene, scrolling the
    //  parent page is jarring. Lock it while a touch is active
    //  on the canvas area.

    let _scrollLocked = false;

    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        canvasContainer.addEventListener('touchstart', () => {
            _scrollLocked = true;
            document.body.style.overflow = 'hidden';
        }, { passive: true });

        canvasContainer.addEventListener('touchend', () => {
            _scrollLocked = false;
            document.body.style.overflow = '';
        }, { passive: true });
    }

    console.log('✅ House of Awe — mobile.js loaded (touch device)');

})();
