// ============================================================
//  HOUSE OF AWE — UI Components  (ui.js)
// ============================================================

// PERF: Debug logging — mirrors the flag in house.js
const _uiDebug = typeof DEBUG !== 'undefined' ? DEBUG : false;
const _uiDbg = _uiDebug ? console.log.bind(console) : () => { };


// ---- Universal Video Interface ----

window.createUniversalVideoInterface = function (parentGroup, position, playlist, options) {
    options = options || {};
    const scale = options.scale || 1.0;

    const trafficGroup = new THREE.Group();
    trafficGroup.position.copy(position);
    trafficGroup.scale.set(scale, scale, scale);
    trafficGroup.userData.type = 'videoInterfaceGroup';
    parentGroup.add(trafficGroup);

    // --- Play / Pause Button ---
    const btnGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0, 2.5, 0);

    // Sync initial button colour to current video state
    if (window.videoElement && !window.videoElement.paused) {
        btn.material.color.setHex(0x00ff00);
        btn.material.emissive.setHex(0x004400);
    }

    btn.userData = {
        type: 'videoControlSingle',
        onClick() {
            if (!window.videoElement) return;

            if (window.videoElement.paused) {
                // Pause music before playing video
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                if (options.onPlay && typeof options.onPlay === 'function') {
                    // Use custom player logic (like playVideo in bedroom)
                    options.onPlay(window.masterVideoIndex || 0);
                } else {
                    // Default logic
                    if (!window.videoElement.src || window.videoElement.src === '' ||
                        window.videoElement.src === window.location.href) {
                        if (playlist && playlist.length > 0) window.videoElement.src = playlist[0].src;
                    }
                    window.videoElement.play().catch(e => console.error('Video play error:', e));
                }
                btn.material.color.setHex(0x00ff00);
                btn.material.emissive.setHex(0x004400);
            } else {
                window.videoElement.pause();
                // If bedroom, restore lights but don't clear src (allow resume)
                if (window.currentRoom === 'bedroom') {
                    if (window.ambientLight) new TWEEN.Tween(window.ambientLight).to({ intensity: 0.25 }, 1000).start();
                    if (window.dirLight) new TWEEN.Tween(window.dirLight).to({ intensity: 0.3 }, 1000).start();
                    if (window.rimLight) new TWEEN.Tween(window.rimLight).to({ intensity: 0.3 }, 1000).start();
                } else if (window.currentRoom === 'bathroom' && window.stopBathroomVideo) {
                    window.stopBathroomVideo();
                } else if (window.currentRoom === 'living' && window.stopLivingVideo) {
                    window.stopLivingVideo();
                }

                btn.material.color.setHex(0xffff00);
                btn.material.emissive.setHex(0x444400);
            }
        }
    };
    trafficGroup.add(btn);
    if (window.interiorClickables) window.interiorClickables.push(btn);

    // --- "VIDEO" Header Label ---
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512; hCanvas.height = 128;
    const hctx = hCanvas.getContext('2d');
    hctx.clearRect(0, 0, 512, 128);
    hctx.fillStyle = '#ffffff';
    hctx.font = 'bold 60px Arial';
    hctx.textAlign = 'center';
    hctx.textBaseline = 'middle';
    hctx.shadowColor = 'rgba(0,0,0,0.8)';
    hctx.shadowBlur = 4;
    hctx.shadowOffsetX = 2;
    hctx.shadowOffsetY = 2;
    hctx.fillText('VIDEO', 256, 64);

    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 0.8),
        new THREE.MeshBasicMaterial({ map: hTex, transparent: true })
    );
    hMesh.position.set(0, 1.6, 0);
    trafficGroup.add(hMesh);

    // --- Track List ---
    const updateAllItems = () => {
        if (!window.interiorClickables) return;
        window.interiorClickables.forEach(c => {
            if (c && c.userData && c.userData.type === 'universalVideoItem' && c.userData.updateState) {
                c.userData.updateState();
            }
        });
    };
    window.updateVideoUI = updateAllItems;

    if (playlist && playlist.length > 0) {
        playlist.forEach((item, i) => {
            const yPos = 1.0 - i * 0.9;

            const sCanvas = document.createElement('canvas');
            sCanvas.width = 512; sCanvas.height = 100;
            const sctx = sCanvas.getContext('2d');
            const sTex = new THREE.CanvasTexture(sCanvas);

            const itemMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(4.0, 0.8),
                new THREE.MeshBasicMaterial({ map: sTex, transparent: true })
            );
            itemMesh.position.set(0, yPos, 0);

            itemMesh.userData.updateState = () => {
                const isActive = (typeof window.masterVideoIndex !== 'undefined' && window.masterVideoIndex === i);
                // Always clear before redrawing to avoid ghost text
                sctx.clearRect(0, 0, 512, 100);
                if (isActive) {
                    sctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#00ff00';
                } else {
                    sctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    sctx.fillRect(0, 0, 512, 100);
                    sctx.fillStyle = '#ffffff';
                }
                sctx.font = 'bold 40px Arial';
                sctx.textAlign = 'left';
                sctx.textBaseline = 'middle';
                sctx.fillText((i + 1) + '. ' + item.title, 20, 50);
                sTex.needsUpdate = true;
            };

            itemMesh.userData.updateState();
            itemMesh.userData.type = 'universalVideoItem';
            itemMesh.userData.index = i;

            itemMesh.userData.onClick = () => {
                window.masterVideoIndex = i;

                // Stop room music when a video is selected
                if (window.audioPlayer && !window.audioPlayer.paused) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }

                if (options.onPlay && typeof options.onPlay === 'function') {
                    options.onPlay(i);
                } else if (window.playTVVideo) {
                    window.playTVVideo(i);
                } else if (window.videoElement) {
                    window.videoElement.src = item.src;
                    window.videoElement.muted = false;
                    window.videoElement.volume = 1.0;
                    window.videoElement.load();
                    window.videoElement.play().catch(e => console.error(e));
                }

                updateAllItems();

                // Update the play/pause button colour
                if (window.interiorClickables) {
                    const ctrlBtn = window.interiorClickables.find(
                        c => c && c.userData && c.userData.type === 'videoControlSingle'
                    );
                    if (ctrlBtn) {
                        ctrlBtn.material.color.setHex(0x00ff00);
                        ctrlBtn.material.emissive.setHex(0x004400);
                    }
                }

                if (window.audioPlayer) {
                    window.audioPlayer.pause();
                    window.isMusicPlaying = false;
                    if (window.musicSwitchMesh) window.musicSwitchMesh.material.color.setHex(0xff0000);
                }
            };

            trafficGroup.add(itemMesh);
            if (window.interiorClickables) window.interiorClickables.push(itemMesh);
        });
    }

    return trafficGroup;
};


// ---- Book Popup ----

window.showBookPopup = function (data) {
    if (document.getElementById('book-overlay')) return;

    const isMobile = window.innerWidth < 768;

    const overlay = document.createElement('div');
    overlay.id = 'book-overlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0',
        'background:rgba(0,0,0,0.5)',
        'z-index:9999',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'opacity:0',
        'transition:opacity 0.4s ease',
        'padding:20px',
        'box-sizing:border-box',
        'overflow-y:auto'
    ].join(';');

    const modal = document.createElement('div');
    modal.style.cssText = [
        'width:100%',
        'max-width:600px', // Reduced from 1000px
        'background-color:#f4f1ea',
        `background-image:
            repeating-linear-gradient(0deg,rgba(0,0,0,0.02) 0px,rgba(0,0,0,0.02) 1px,transparent 1px,transparent 2px),
            repeating-linear-gradient(90deg,rgba(0,0,0,0.02) 0px,rgba(0,0,0,0.02) 1px,transparent 1px,transparent 2px),
            repeating-linear-gradient(45deg,rgba(0,0,0,0.01) 0px,rgba(0,0,0,0.01) 2px,transparent 2px,transparent 4px)`,
        `padding:${isMobile ? '20px' : '30px'}`, // Reduced from 40px
        'border-radius:2px',
        'position:relative',
        'box-shadow:0 20px 50px rgba(0,0,0,0.5)',
        'color:#333',
        'font-family:Georgia,serif',
        'box-sizing:border-box'
    ].join(';');

    if (isMobile) {
        modal.style.maxHeight = '90vh';
        modal.style.overflowY = 'auto';
    } else {
        modal.style.display = 'grid';
        modal.style.gridTemplateColumns = '200px 1fr'; // Reduced from 300px
        modal.style.gap = '30px'; // Reduced from 40px
    }

    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '\u2715';
    closeBtn.style.cssText = [
        'position:absolute',
        `top:${isMobile ? '10px' : '20px'}`,
        `right:${isMobile ? '10px' : '20px'}`,
        `font-size:${isMobile ? '28px' : '32px'}`,
        'cursor:pointer',
        'color:#999',
        'z-index:10000',
        'padding:5px 10px',
        'line-height:1'
    ].join(';');

    const doClose = () => {
        window.removeEventListener('resize', handleResize);
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
    };
    closeBtn.onclick = doClose;

    // Cover image
    const coverContainer = document.createElement('div');
    if (isMobile) coverContainer.style.cssText = 'margin-bottom:20px;text-align:center';

    const cover = document.createElement('img');
    cover.src = data.image || '';
    cover.style.cssText = [
        `width:${isMobile ? '200px' : '100%'}`,
        `max-width:${isMobile ? '200px' : '300px'}`,
        'box-shadow:5px 5px 15px rgba(0,0,0,0.2)',
        `display:${isMobile ? 'inline-block' : 'block'}`
    ].join(';');
    coverContainer.appendChild(cover);

    // Content
    const content = document.createElement('div');
    const title = document.createElement('h1');
    title.innerText = data.title;
    title.style.cssText = [
        'margin-top:0',
        `font-size:${isMobile ? '22px' : '30px'}`,
        'border-bottom:1px solid #ddd',
        `padding-bottom:${isMobile ? '10px' : '20px'}`,
        'line-height:1.2'
    ].join(';');

    const synopsis = document.createElement('p');
    synopsis.style.cssText = [
        `font-size:${isMobile ? '13px' : '16px'}`,
        'line-height:1.6',
        `margin-top:${isMobile ? '12px' : '20px'}`
    ].join(';');
    synopsis.innerHTML = data.synopsis;

    content.appendChild(title);
    content.appendChild(synopsis);


    modal.appendChild(closeBtn);
    modal.appendChild(coverContainer);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Rebuild on breakpoint cross
    const handleResize = () => {
        const nowMobile = window.innerWidth < 768;
        if (nowMobile !== isMobile) {
            overlay.remove();
            window.showBookPopup(data);
        }
    };
    window.addEventListener('resize', handleResize);
};


// ---- Holographic Usher ----

// V-FIX: Refreshable Usher Text
window.refreshUsherText = function (mesh) {
    if (!mesh) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Glowing radial background
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 510);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    grad.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Text
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = 'bold 90px "Courier New", monospace';
    ctx.fillText(t('usher_welcome'), 512, 400);

    ctx.font = '35px "Courier New", monospace';
    ctx.shadowBlur = 1;
    ctx.fillText(t('usher_explore'), 512, 500);
    ctx.fillText(t('usher_discover'), 512, 640);

    const tex = new THREE.CanvasTexture(canvas);
    if (mesh.material.map) mesh.material.map.dispose();
    mesh.material.map = tex;
    mesh.material.needsUpdate = true;
};

function createUsherText() {
    const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
    mesh.userData.type = 'usher_text';
    window.refreshUsherText(mesh);
    return mesh;
}

function createUsherShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.05;
    return mesh;
}

function createGlitchyHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const g = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    g.addColorStop(0.6, 'rgba(0, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
}

// ============================================================
//  NARRATIVE QUESTIONNAIRE SYSTEM
// ============================================================

// --- Load saved progress from localStorage (if any) ---
(function () {
    const saved = (typeof loadUserProgress === 'function') ? loadUserProgress() : null;
    if (saved && typeof saved === 'object') {
        window.visitorData = {
            name: saved.name || '',
            answers: saved.answers || {},
            visitedRooms: saved.visitedRooms || []
        };
        _uiDbg('✅ Restored visitor progress:', window.visitorData);
    } else {
        window.visitorData = {
            name: '',
            answers: {},
            visitedRooms: []
        };
        _uiDbg('🆕 Starting a new session.');
    }
    // Initialize the rich memory system
    if (typeof initMemory === 'function') {
        window._aweMemory = initMemory();
        _uiDbg('🧠 Memory loaded — visit #' + (window._aweMemory.visitCount || 1));
    }
})();

// Auto-save progress whenever the user leaves the page
window.addEventListener('beforeunload', () => {
    if (window.visitorData && (window.visitorData.name || Object.keys(window.visitorData.answers).length > 0)) {
        if (typeof saveUserProgress === 'function') {
            saveUserProgress(window.visitorData);
        }
    }
});

window.closeOverlay = function (id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 400);
    }
};

// Global array for animated objects (e.g., guidance arrow)
window.animatedObjects = window.animatedObjects || [];


window.initNarrativePrompt = function (forceShow = false) {
    const overlay = document.getElementById('narrative-overlay');
    const card = overlay ? overlay.querySelector('.narrative-card') : null;
    if (!overlay) return;

    // V-FIX: If we already have a name, don't show the prompt again (e.g. on language switch)
    const hasName = window.visitorData && window.visitorData.name && window.visitorData.name.trim() !== "";

    // Restore original name-entry HTML / Refresh translations
    if (card) {
        card.style.maxWidth = '';
        card.style.border = '';
        card.style.boxShadow = '';
        card.innerHTML = `
            <h2 id="narrative-title">${t('welcome_title')}</h2>
            <p class="text-gray-500 mb-4 font-mono text-xs uppercase tracking-widest">${t('welcome_hint')}</p>
            <input type="text" id="visitor-name" class="narrative-input" placeholder="${t('welcome_placeholder')}" maxlength="30" onkeypress="if(event.key==='Enter') window.submitVisitorName()">
            <button class="narrative-btn" onclick="window.submitVisitorName()">${t('proceed')}</button>
            <div class="mt-4 text-center">
                <span id="browse-hint-text" class="text-[10px] text-gray-500 uppercase tracking-widest">${t('browse_hint')}</span>
                <button id="browse-btn" class="narrative-btn" style="padding:4px 8px; font-size:10px; margin-left: 8px; min-height: unset;" onclick="window.skipNameEntry && window.skipNameEntry()">${t('browse')}</button>
            </div>
        `;
    }

    if (hasName && forceShow) {
        // Returning visitor — show enriched "Welcome back" greeting with memory stats
        const answered = Object.keys(window.visitorData.answers || {}).length;
        const mem = (typeof getMemory === 'function') ? getMemory() : null;

        // Build memory stats line
        let memoryHTML = '';
        if (mem && mem.visitCount > 1) {
            const visitNum = mem.visitCount;
            const firstDate = mem.firstVisit ? new Date(mem.firstVisit) : null;
            const lastDateSrc = mem.prevLastVisit || mem.lastVisit;
            const lastDate = lastDateSrc ? new Date(lastDateSrc) : null;

            // Time since last visit
            let timeSinceHTML = '';
            if (lastDate && mem.visitCount > 1) {
                const diffMs = Date.now() - lastDate.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor(diffMs / (1000 * 60));
                if (diffDays > 0) {
                    timeSinceHTML = `${diffDays} ${t('days_ago')} `;
                } else if (diffHours > 0) {
                    timeSinceHTML = `${diffHours} ${t('hours_ago')} `;
                } else {
                    timeSinceHTML = `${diffMins} ${t('minutes_ago')} `;
                }
            }

            // First visit date
            const firstDateStr = firstDate ? firstDate.toLocaleDateString(window.currentLanguage === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

            memoryHTML = `
                <div style="margin: 1rem 0 1.5rem; padding: 12px 16px; border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 4px; background: rgba(96, 165, 250, 0.06); font-family: 'Share Tech Mono', monospace;">
                    <div style="font-size: 9px; color: #60a5fa; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; opacity: 0.8;">${t('memory_header')}</div>
                    <div style="font-size: 11px; color: #aaa; line-height: 1.8;">
                        ${t('visit_number')}: <span style="color: #60a5fa; font-weight: bold;">#${visitNum}</span><br>
                        ${firstDateStr ? `${t('first_visit')}: <span style="color: #eee;">${firstDateStr}</span><br>` : ''}
                        ${timeSinceHTML ? `${t('last_seen')}: <span style="color: #eee;">${timeSinceHTML}</span>` : ''}
                    </div>
                </div>
        `;
        }

        if (card) {
            card.innerHTML = `
                <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
                <h2 style="font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: bold; color: #fff; margin-bottom: 1rem; letter-spacing: 0.2em; text-transform: uppercase;">
                    ${mem && mem.visitCount > 1 ? t('welcome_back') : t('hi')} <span style="color: #60a5fa">${window.visitorData.name}</span>
                </h2>
                <p style="color: #d4d4d4; font-size: 13px; line-height: 1.6; margin-bottom: 1rem; font-family: 'Share Tech Mono', monospace;">
                    ${t('welcome_text')}
                </p>
                ${memoryHTML}
                ${answered > 0 ? `<p style="color: #888; font-size: 11px; font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; letter-spacing: 0.1em;">${t('reflections_gathered')}: ${answered}/10</p>` : ''}
    <button onclick="window.dismissWelcome()" class="narrative-btn">${t('resume')}</button>
    `;
        }
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 50);
    } else if (!hasName && forceShow) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.opacity = '1';
            const input = overlay.querySelector('#visitor-name');
            if (input) input.focus();
        }, 50);
    }
};

const UI_I18N = {
    en: {
        welcome_title: "WHAT IS YOUR NAME?",
        welcome_hint: "Identify yourself to enter the House of Awe.",
        welcome_placeholder: "YOUR NAME...",
        proceed: "PROCEED",
        hi: "HI",
        welcome_back: "WELCOME BACK",
        welcome_text: "Go and discover.<br><br>Just follow your instinct and everything will be fine.",
        enter: "ENTER",
        browse: "BROWSE",
        browse_hint: "don't mind me, I'm just browsing.",
        reflected: "REFLECTED",
        reflection: "REFLECTION",
        submit: "SUBMIT",
        tell_us_something: "Tell us something...",
        identify_error: "Please identify yourself before entering.",
        reflection_error: "Quiet reflection is fine, but please share at least a few words.",
        congrats: "CONGRATULATIONS!",
        secret_unlocked: "You unlocked the <span style='font-weight:700; color:#000;'>secret of the universe</span>!<br>Go and check it here.",
        reveal_secret: "REVEAL THE SECRET",
        mol_title: "THE MEANING OF LIFE",
        mol_according: "ACCORDING TO",
        started: "The Big Bang! Suddenly:",
        love_is: "The world should be ruled by",
        bully: "Ignore",
        should: "Everybody should",
        doubt: "When in doubt,",
        einstein: "Einstein couldn't even think of this:",
        eat: "We should all",
        hero: "is our hero",
        forget: "never forget:",
        answer_everything: "The answer to everything is",
        download_report: "DOWNLOAD REPORT",
        return_house: "Return to House",
        status_progress: "Status: In Progress",
        journey_so_far: "YOUR JOURNEY SO FAR",
        visitor: "Visitor",
        reflections_gathered: "Reflections Gathered",
        resume: "Continue",
        transmitting: "TRANSMITTING DATA...",
        record_secured: "✓ RECORD SECURED IN THE AETHER",
        download_record: "DOWNLOAD RECORD",
        email_record: "EMAIL RECORD",
        restore_view: "RESTORE VIEW",
        report_header: "HOUSE OF AWE - NARRATIVE RECORD",
        date: "Date",
        question: "Question",
        answer: "Answer",
        more_info: "More Info",
        for_sale: "For sale",
        usher_welcome: "Welcome",
        usher_explore: "Explore the house and surround",
        usher_discover: "Discover the messages",
        // Memory system strings
        memory_header: "YOUR MEMORY",
        visit_number: "Visit",
        first_visit: "First visited",
        last_seen: "Last seen",
        days_ago: "days ago",
        hours_ago: "hours ago",
        minutes_ago: "minutes ago",
        // Gallery strings
        gallery_title: "VISITOR GALLERY",
        gallery_subtitle: "<span style='font-size:38px;'>The meaning of life</span><br><span style='font-size:16px; opacity:0.6;'>according to those who came before you</span>",
        gallery_empty: "Be the first to complete all rooms and share your meaning.",
        gallery_rooms: "rooms",
        gallery_submit_prompt: "Share your meaning with future visitors?",
        gallery_submit_yes: "SHARE ANONYMOUSLY",
        gallery_submit_no: "KEEP PRIVATE",
        gallery_submitted: "✓ Shared with the universe",
        gallery_view: "VIEW GALLERY",
        gallery_close: "CLOSE",
        gallery_visitors: "visitors have shared their meaning",
        // Visitor Wall strings (spoiler-free, shown during gameplay)
        wall_title: "VISITOR WALL",
        wall_subtitle: "Those who walked these halls before you",
        wall_empty: "No visitors yet. You could be the first.",
        wall_completed: "completed the journey",
        wall_close: "CLOSE",
        // Question strings
        hall_q: "All stories begin somewhere, somehow. How does yours start?",
        living_q: "What do you love in life?",
        annex_q: "What do you fear?",
        studio_q: "What do you do in your spare time?",
        basement_q: "If you stop thinking; what does your gut say?",
        toilet_q: "What are your big ideas?",
        bedroom_q: "What are your dreams made of?",
        bathroom_q: "Who is your favorite superhero?",
        attic_q: "What are your fondest memories?",
        space_q: "Where were you 1 year before you were born?",
        hall_l: "Genesis",
        living_l: "Love",
        annex_l: "Evil",
        studio_l: "Leisure",
        basement_l: "Gut",
        toilet_l: "Ideas",
        bedroom_l: "dreams",
        bathroom_l: "Identity",
        attic_l: "Time",
        space_l: "Meaning",
        hall_welcome: "Welcome to",
        hall_house_name: "the House of Awe",
        hall_tagline: "Explore // Wonder // Dream",
        hall_recommend: "Big screen and sound recommended",
        sculpture_text: "House of Awe",
        audio_header: "AUDIO",
        no_reflections: "No reflections recorded yet.",
        idea_zone: "THE IDEA ZONE",
        idea_close: "Close",
        idea_save: "Save Idea",
        found_it: "Found It",
        hint_hall_label: "The Reception Hall",
        hint_hall_msg: "Enter through the front door.",
        hint_living_label: "The Living Room",
        hint_living_msg: "next to the front door.",
        hint_studio_label: "The Studio",
        hint_studio_msg: "on the other side of the front door.",
        hint_bedroom_label: "The Bedroom",
        hint_bedroom_msg: "above the living room.",
        hint_bathroom_label: "The Bathroom",
        hint_bathroom_msg: "inside the tall tower.",
        hint_toilet_label: "The Little Room",
        hint_toilet_msg: "the small shed on the back.",
        hint_attic_label: "The Attic",
        hint_attic_msg: "the top of the house.",
        hint_basement_label: "The Basement",
        hint_basement_msg: "The entrance is below — look for the hatch.",
        hint_annex_label: "The Annex",
        hint_annex_msg: "hidden — find it from inside the living room.",
        hint_space_label: "The Void",
        hint_space_msg: "a portal through the garage.",
        hint_bookcase: "Look at the bookcase — there is something hidden behind it.",
        hint_orb: "Find the glowing orb and click it to reflect.",
        hint_completed: "You have completed all rooms. The secret awaits!",
        hint_next: "Next: ",
        hint_follow_arrow: "Follow the arrow to enter."
    },
    nl: {
        welcome_title: "WIE BEN JIJ?",
        welcome_hint: "Identificeer jezelf om het Huis der Verwondering te betreden.",
        welcome_placeholder: "JE NAAM...",
        proceed: "GA VERDER",
        hi: "HOI",
        welcome_back: "WELKOM TERUG",
        welcome_text: "Ga op ontdekking!<br><br>Volg gewoon je intuïtie en alles komt goed.",
        enter: "GA VERDER",
        browse: "KIJKEN",
        browse_hint: "ik kom alleen even kijken.",
        reflected: "GEDAAN ✓",
        reflection: "REFLECTIE",
        submit: "VERSTUREN",
        tell_us_something: "Zeg het maar...",
        identify_error: "Identificeer jezelf voordat je naar binnen gaat.",
        reflection_error: "Stille reflectie is prima, maar deel alsjeblieft een paar woorden.",
        congrats: "GEFELICITEERD!",
        secret_unlocked: "Je hebt het <span style='font-weight:700; color:#000;'>geheim van het universum</span> ontrafeld!<br>Bekijk het hier.",
        reveal_secret: "ONTHUL HET GEHEIM",
        mol_title: "DE ZIN VAN HET LEVEN",
        mol_according: "VOLGENS",
        started: "De Oerknal! Plotseling:",
        love_is: "De wereld zou geregeerd moeten worden door",
        bully: "Negeer",
        should: "Iedereen zou moeten",
        doubt: "Bij twijfel,",
        einstein: "Zelfs Einstein had dit niet kunnen bedenken:",
        eat: "We zouden allemaal moeten ",
        hero: "is onze held",
        forget: "vergeet nooit:",
        answer_everything: "Het antwoord op alles is",
        download_report: "DOWNLOAD RAPPORT",
        return_house: "Terug naar het Huis",
        status_progress: "Status: In Uitvoering",
        journey_so_far: "JE REIS TOT NU TOE",
        visitor: "Bezoeker",
        reflections_gathered: "Reflecties Verzameld",
        resume: "Doorgaan",
        transmitting: "GEGEVENS VERZENDEN...",
        record_secured: "✓ RECORD OPGESLAGEN IN SPACE",
        download_record: "DOWNLOAD RECORD",
        email_record: "EMAIL RECORD",
        restore_view: "HERSTEL WEERGAVE",
        report_header: "HUIS DER VERWONDERING - NARRATIEF VERSLAG",
        date: "Datum",
        question: "Vraag",
        answer: "Antwoord",
        more_info: "Meer Info",
        for_sale: "Te koop",
        usher_welcome: "Welkom",
        usher_explore: "Verken het huis en de omgeving",
        usher_discover: "Ontdek de berichten",
        // Memory system strings
        memory_header: "JOUW GEHEUGEN",
        visit_number: "Bezoek",
        first_visit: "Eerste bezoek",
        last_seen: "Laatst gezien",
        days_ago: "dagen geleden",
        hours_ago: "uur geleden",
        minutes_ago: "minuten geleden",
        // Gallery strings
        gallery_title: "BEZOEKERSOVERZICHT",
        gallery_subtitle: "<span style='font-size:38px;'>De zin van het leven</span><br><span style='font-size:16px; opacity:0.6;'>volgens hen die voor jou kwamen</span>",
        gallery_empty: "Wees de eerste die alle kamers voltooit en de betekenis deelt.",
        gallery_rooms: "kamers",
        gallery_submit_prompt: "Deel jouw betekenis met toekomstige bezoekers?",
        gallery_submit_yes: "ANONIEM DELEN",
        gallery_submit_no: "PRIVÉ HOUDEN",
        gallery_submitted: "✓ Gedeeld met het universum",
        gallery_view: "BEKIJK OVERZICHT",
        gallery_close: "SLUITEN",
        gallery_visitors: "bezoekers hebben hun betekenis gedeeld",
        // Visitor Wall strings (spoiler-free, shown during gameplay)
        wall_title: "BEZOEKERSMUUR",
        wall_subtitle: "Zij die voor jou door deze hallen liepen",
        wall_empty: "Nog geen bezoekers. Jij kunt de eerste zijn.",
        wall_completed: "heeft de reis voltooid",
        wall_close: "SLUITEN",
        // Question strings
        hall_q: "Alle verhalen beginnen ergens. Hoe begint het jouwe?",
        living_q: "Waar hou je van?",
        annex_q: "Waar ben je bang voor?",
        studio_q: "Wat doe je in je vrije tijd?",
        basement_q: "SAls je nu NIET nadenkt; wat zegt dan je gevoel?",
        toilet_q: "Wat zijn je grote ideeën?",
        bedroom_q: "Waar droom je over?",
        bathroom_q: "Wie is je favoriete superheld?",
        attic_q: "Wat zijn je mooiste herinneringen?",
        space_q: "Waar was je 1 jaar voordat je was geboren?",
        hall_l: "Genesis",
        living_l: "Liefde",
        annex_l: "Het Kwaad",
        studio_l: "Ontspanning",
        basement_l: "Gevoel",
        toilet_l: "Idee",
        bedroom_l: "Dromen",
        bathroom_l: "Identiteit",
        attic_l: "Tijdreizen",
        space_l: "Het Leven",
        hall_welcome: "Welkom bij",
        hall_house_name: "het Huis der Verwondering",
        hall_tagline: "Denk // Voel // Droom",
        hall_recommend: "Groot scherm en geluid aanbevolen",
        sculpture_text: "Huis der Verwondering",
        audio_header: "AUDIO",
        no_reflections: "Nog geen reflecties vastgelegd.",
        idea_zone: "DE IDEEËNZONE",
        idea_close: "Sluiten",
        idea_save: "Opslaan",
        found_it: "Gevonden",
        hint_hall_label: "De Ontvangsthal",
        hint_hall_msg: "Ga naar binnen door de voordeur.",
        hint_living_label: "De Woonkamer",
        hint_living_msg: "bevindt zich naast de voordeur.",
        hint_studio_label: "De Studio",
        hint_studio_msg: "is aan de andere kant van de voordeur.",
        hint_bedroom_label: "De Slaapkamer",
        hint_bedroom_msg: "bevindt zich boven de woonkamer.",
        hint_bathroom_label: "De Badkamer",
        hint_bathroom_msg: "is in de hoge toren.",
        hint_toilet_label: "Het Kleine Kamertje",
        hint_toilet_msg: "is de kleine schuur aan de achterkant.",
        hint_attic_label: "De Zolder",
        hint_attic_msg: "is bovenin het huis.",
        hint_basement_label: "De Kelder",
        hint_basement_msg: "De ingang is onder het huis.",
        hint_annex_label: "De Annex",
        hint_annex_msg: "is verborgen (vind het vanuit de woonkamer).",
        hint_space_label: "De Leegte",
        hint_space_msg: "is een portaal door de garage.",
        hint_bookcase: "Kijk naar de boekenkast — er is iets achter verborgen.",
        hint_orb: "Vind de gloeiende bol en klik erop om te reflecteren.",
        hint_completed: "Je hebt alle kamers voltooid. Het geheim wacht op je!",
        hint_next: "Volgende: ",
        hint_follow_arrow: "Volg de pijl om naar binnen te gaan."
    }
};

window.currentLanguage = window.currentLanguage || 'en';

function t(key) {
    const lang = window.currentLanguage;
    return (UI_I18N[lang] && UI_I18N[lang][key]) || (UI_I18N['en'][key]) || key;
}

const ROOM_QUESTIONS = {
    get 'hall'() { return t('hall_q'); },
    get 'living'() { return t('living_q'); },
    get 'annex'() { return t('annex_q'); },
    get 'studio'() { return t('studio_q'); },
    get 'basement'() { return t('basement_q'); },
    get 'toilet'() { return t('toilet_q'); },
    get 'bedroom'() { return t('bedroom_q'); },
    get 'bathroom'() { return t('bathroom_q'); },
    get 'attic'() { return t('attic_q'); },
    get 'space'() { return t('space_q'); }
};

// Display labels for the reflections panel on the index page
const ROOM_REFLECTION_LABELS = {
    get 'hall'() { return t('hall_l'); },
    get 'living'() { return t('living_l'); },
    get 'annex'() { return t('annex_l'); },
    get 'studio'() { return t('studio_l'); },
    get 'basement'() { return t('basement_l'); },
    get 'toilet'() { return t('toilet_l'); },
    get 'bedroom'() { return t('bedroom_l'); },
    get 'bathroom'() { return t('bathroom_l'); },
    get 'attic'() { return t('attic_l'); },
    get 'space'() { return t('space_l'); }
};

window.addEventListener('message', (event) => {
    const d = event.data;
    if (d.type === 'SET_LANGUAGE') {
        window.currentLanguage = d.lang;
        window.currentLang = d.lang; // alias — some parts of house.js read this name
        _uiDbg('🌐 Language switched to:', d.lang);

        // Update any visible UI
        const hTitle = document.getElementById('narrative-title');
        if (hTitle && (hTitle.innerText.includes('NAME') || hTitle.innerText.includes('NAAM'))) {
            hTitle.innerText = t('welcome_title');
            const hint = hTitle.nextElementSibling;
            if (hint) hint.innerText = t('welcome_hint');
            const input = document.getElementById('visitor-name');
            if (input) input.placeholder = t('welcome_placeholder');
            const btn = document.querySelector('.narrative-btn');
            if (btn) btn.innerText = t('proceed');
        }

        // If we are in the "HI NAME" screen
        const card = document.querySelector('.narrative-card');
        if (card && (card.innerText.includes('HI') || card.innerText.includes('HOI'))) {
            // Redraw with current language
            const name = window.visitorData.name;
            card.querySelector('h2').innerHTML = `${t('hi')} <span style="color: #60a5fa">${name}</span>`;
            card.querySelector('p').innerHTML = t('welcome_text');
            card.querySelector('.narrative-btn').innerText = t('enter');

            // Update browsing hint if present
            const browseHint = card.querySelector('#browse-hint-text');
            if (browseHint) browseHint.innerText = t('browse_hint');
            const browseBtn = card.querySelector('#browse-btn');
            if (browseBtn) browseBtn.innerText = t('browse');
        }
    }
});
window.skipNameEntry = function () {
    window.visitorData = window.visitorData || { answers: {}, visitedRooms: [] };
    window.visitorData.name = 'Guest';
    window.visitorData.isBrowsing = true; // Mark as browsing

    // Persist to localStorage
    if (typeof saveUserProgress === 'function') {
        saveUserProgress(window.visitorData);
    }

    // Move to next step smoothly
    const overlay = document.getElementById('narrative-overlay');
    if (overlay) {
        const card = overlay.querySelector('.narrative-card');
        if (card) {
            card.style.opacity = '0';
            setTimeout(() => {
                card.innerHTML = `
                    <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
                    <h2 style="font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: bold; color: #fff; margin-bottom: 1.5rem; letter-spacing: 0.2em; text-transform: uppercase;">
                        ${t('hi')} <span style="color: #60a5fa">${t('unknown') || 'GUEST'}</span>
                    </h2>
                    <p style="color: #d4d4d4; font-size: 13px; line-height: 1.6; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace;">
                        ${t('welcome_text')}
                    </p>
                    <button onclick="window.dismissWelcome()" class="narrative-btn">${t('enter')}</button>
    `;
                card.style.opacity = '1';

                if (window.parent) {
                    window.parent.postMessage({ type: 'VISITOR_BROWSING' }, '*');
                }
            }, 300);
        }
    }
};

window.submitVisitorName = function () {
    const input = document.getElementById('visitor-name');
    if (!input) return; // Safety check
    const name = input.value.trim();

    if (name.length < 2) {
        alert(t('identify_error'));
        return;
    }

    // Save Name
    window.visitorData = window.visitorData || { answers: {}, visitedRooms: [] };
    window.visitorData.name = name;

    // Persist to localStorage
    if (typeof saveUserProgress === 'function') {
        saveUserProgress(window.visitorData);
    }

    // Transition within the SAME popup (Seamless)
    const overlay = document.getElementById('narrative-overlay');
    if (overlay) {
        const card = overlay.querySelector('.narrative-card');
        if (card) {
            // Fade out content briefly
            card.style.opacity = '0';

            setTimeout(() => {
                // Update Content
                card.innerHTML = `
                    <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
                    <h2 style="font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: bold; color: #fff; margin-bottom: 1.5rem; letter-spacing: 0.2em; text-transform: uppercase;">
                        ${t('hi')} <span style="color: #60a5fa">${name}</span>
                    </h2>
                    <p style="color: #d4d4d4; font-size: 13px; line-height: 1.6; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace;">
                        ${t('welcome_text')}
                    </p>
                    <button onclick="window.dismissWelcome()" 
                        class="narrative-btn">
                        ${t('enter')}
                    </button>
                    <div class="mt-4 text-center">
                        <span id="browse-hint-text" class="text-[10px] text-gray-500 uppercase tracking-widest">${t('browse_hint')}</span>
                        <button id="browse-btn" class="narrative-btn" style="padding:4px 8px; font-size:10px; margin-left: 8px; min-height: unset;" onclick="window.skipNameEntry && window.skipNameEntry()">${t('browse')}</button>
                    </div>
    `;

                // Fade back in
                card.style.transition = 'opacity 0.5s ease';
                card.style.opacity = '1';
            }, 300);
        }
    }
};

// Simplified Dismiss (Close Overlay -> Trigger Arrow)
window.dismissWelcome = function () {
    _uiDbg('🚪 Dismissing welcome popup...');
    const overlay = document.getElementById('narrative-overlay');

    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            // Start Guidance — but intelligently: skip already-answered rooms
            const answered = (window.visitorData && window.visitorData.answers) ? window.visitorData.answers : {};
            const nextRoom = HINT_ROOM_SEQUENCE.find(r => !answered[r.key]);

            if (!nextRoom) {
                // All rooms done — no arrow needed
                return;
            }

            if (nextRoom.key === 'hall') {
                // Hall is next — show the original guidance arrow pointing at it
                if (typeof createGuidanceArrow === 'function') {
                    createGuidanceArrow();
                }
            } else {
                // Hall already done — point to the next unvisited room via the hint system
                showHintToast(t('hint_next') + nextRoom.label + ' — ' + nextRoom.msg);
                const pos = getHintTargetPos(nextRoom.key);
                if (pos && typeof spawnOutdoorHintArrow === 'function') {
                    spawnOutdoorHintArrow(new THREE.Vector3(pos.x, pos.y, pos.z), nextRoom.key);
                }
            }
        }, 800);
    }
};

// Deprecated/Removed: startWelcomeSequence & showWelcomePopup (Merged into above flow)
window.startWelcomeSequence = function (name) { /* no-op */ };
function showWelcomePopup(name) { /* no-op */ }

// Deprecated: Old 3D text function (kept for reference or removal)
function createWelcomeFloatingText_OLD(name) {
    // ... (rest of old function if needed, or I can cut it to clean up. I'll just leave the start of it to match end line)
    _uiDbg('✨ Creating welcome text for:', name);
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1024, 256);

    // Glow / Text Style
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 22px "Courier New", monospace'; // Reduced from 28px

    // Draw text on two lines with better spacing
    ctx.fillText(`Hi ${name}, great to have you here.`, 512, 80);
    ctx.fillText("Just follow your instinct and everything will be fine.", 512, 140);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        fog: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), mat); // Reduced from 10x2.5
    mesh.frustumCulled = false;

    // Position text directly in front of camera, centered and lower
    if (window.camera) {
        // Place 8 units in front of the camera
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(window.camera.quaternion);
        mesh.position.copy(window.camera.position).addScaledVector(dir, 8);
        mesh.position.y = window.camera.position.y - 1.5; // Lower position (was +0.5)
        mesh.quaternion.copy(window.camera.quaternion);
    } else {
        mesh.position.set(0, 5.5, 12); // Lower fallback position (was 7)
    }

    if (window.worldGroup) {
        window.worldGroup.add(mesh);
        _uiDbg('📝 Welcome text added to scene at position:', mesh.position);
    } else {
        console.error('❌ worldGroup not found!');
    }

    // Animation: Fade In, Wait, Fade Out
    let opacity = 0;
    let phase = 'in';

    const animObj = {
        update: function (t, dt) {
            // Keep text parallel to camera during animation
            if (window.camera) {
                mesh.quaternion.copy(window.camera.quaternion);
            }

            if (phase === 'in') {
                opacity += dt * 2.0;
                if (opacity >= 1) {
                    opacity = 1;
                    phase = 'wait';
                    _uiDbg('⏸️ Welcome text visible, will fade out in 5 seconds');
                    setTimeout(() => { phase = 'out'; }, 5000);
                }
            } else if (phase === 'out') {
                opacity -= dt * 1.0;
                if (opacity <= 0) {
                    opacity = 0;
                    if (mesh.parent) mesh.parent.remove(mesh);
                    const idx = window.animatedObjects.indexOf(animObj);
                    if (idx > -1) window.animatedObjects.splice(idx, 1);
                    _uiDbg('👋 Welcome text removed');
                }
            }
            if (mesh.material) mesh.material.opacity = opacity;
        }
    };
    window.animatedObjects.push(animObj);
    mesh.material.opacity = 0.01;
}

function createGuidanceArrow() {
    _uiDbg('🎯 Creating guidance arrow');
    const arrowGroup = new THREE.Group();

    // Create arrow shape
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.5);
    arrowShape.lineTo(0.3, 0);
    arrowShape.lineTo(0.15, 0);
    arrowShape.lineTo(0.15, -0.5);
    arrowShape.lineTo(-0.15, -0.5);
    arrowShape.lineTo(-0.15, 0);
    arrowShape.lineTo(-0.3, 0);
    arrowShape.lineTo(0, 0.5);

    const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
    const arrowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.scale.set(1.5, 1.5, 1.5); // Smaller as requested

    // Add a glow plane behind it
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 255, 255, 0.8)'); // Cyan glow
    grad.addColorStop(1, 'rgba(0, 255, 255, 0)');
    gCtx.fillStyle = grad;
    gCtx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glowMat);
    glowMesh.position.set(0, 0, -0.1);
    arrowMesh.add(glowMesh);

    arrowGroup.add(arrowMesh);

    arrowGroup.position.set(0, 1.8, 4);
    arrowGroup.rotation.x = -Math.PI / 2;

    // V-FIX: Make arrow clickable to enter hall (solves blocking issue)
    arrowGroup.userData = {
        name: 'hall', // Acts as hall entry
        onClick: () => {
            if (window.enterRoom) window.enterRoom('hall');
        }
    };

    if (window.worldGroup) {
        window.worldGroup.add(arrowGroup);
        _uiDbg('🎯 Arrow added to scene');
    }

    // V-FIX: Ensure raycaster can hit it
    if (window.interiorClickables) {
        // ...
    }

    arrowMesh.userData = { name: 'hall', onClick: arrowGroup.userData.onClick };
    glowMesh.userData = { name: 'hall', onClick: arrowGroup.userData.onClick };

    // Animate arrow: fade in, pulse, then fade out
    let opacity = 0;
    let phase = 'in';
    let pulseTime = 0;

    const animObj = {
        update: function (t, dt) {
            // Safety: Ensure dt is reasonable
            dt = Math.min(dt, 0.1);

            if (phase === 'in') {
                opacity += dt * 1.5;
                if (opacity >= 1.0) {
                    opacity = 1.0;
                    phase = 'pulse';
                    pulseTime = 0;
                }
            } else if (phase === 'pulse') {
                pulseTime += dt;
                // STABLE pulse for opacity/glow
                const pulse = Math.sin(pulseTime * 8) * 0.35 + 0.65;

                // Hologram flicker
                const flicker = Math.random() > 0.85 ? 0.6 : 1.0;

                arrowMesh.material.opacity = pulse * flicker;

                // CONSTANT scale (no more size pulsing)
                arrowMesh.scale.set(1.2, 1.2, 1.2);

                // STRONGER glow sync - more intense
                if (glowMat) glowMat.opacity = pulse * 0.9;

                // Forward/backward pound (Position movement only)
                arrowGroup.position.z = 4 + Math.sin(pulseTime * 8) * 0.4;

                if (pulseTime > 20) { // Extended to 20s
                    phase = 'out';
                }
            } else if (phase === 'out') {
                opacity -= dt * 0.8;
                arrowMesh.material.opacity = opacity;
                if (glowMat) glowMat.opacity = opacity * 0.5;

                if (opacity <= 0) {
                    opacity = 0;
                    if (arrowGroup.parent) arrowGroup.parent.remove(arrowGroup);
                    const idx = window.animatedObjects.indexOf(animObj);
                    if (idx > -1) window.animatedObjects.splice(idx, 1);
                    _uiDbg('🎯 Arrow animation finished & removed');
                }
            }

            // Sync in 'in' phase too
            if (phase === 'in') {
                arrowMesh.material.opacity = opacity;
                if (glowMat) glowMat.opacity = opacity * 0.5;
            }
        } // End update
    };

    // Ensure it is actually pushed to the global animation loop
    if (window.animatedObjects) {
        window.animatedObjects.push(animObj);
    }
}

// ---- HINT SYSTEM ----

// Ordered list of outdoor-accessible rooms for hint sequencing
const HINT_ROOM_SEQUENCE = [
    { key: 'hall', get label() { return t('hint_hall_label'); }, get msg() { return t('hint_hall_msg'); } },
    { key: 'living', get label() { return t('hint_living_label'); }, get msg() { return t('hint_living_msg'); } },
    { key: 'annex', get label() { return t('hint_annex_label'); }, get msg() { return t('hint_annex_msg'); } },
    { key: 'studio', get label() { return t('hint_studio_label'); }, get msg() { return t('hint_studio_msg'); } },
    { key: 'bedroom', get label() { return t('hint_bedroom_label'); }, get msg() { return t('hint_bedroom_msg'); } },
    { key: 'bathroom', get label() { return t('hint_bathroom_label'); }, get msg() { return t('hint_bathroom_msg'); } },
    { key: 'toilet', get label() { return t('hint_toilet_label'); }, get msg() { return t('hint_toilet_msg'); } },
    { key: 'attic', get label() { return t('hint_attic_label'); }, get msg() { return t('hint_attic_msg'); } },
    { key: 'basement', get label() { return t('hint_basement_label'); }, get msg() { return t('hint_basement_msg'); } },
    { key: 'space', get label() { return t('hint_space_label'); }, get msg() { return t('hint_space_msg'); } },
];

function showHintToast(msg) {
    let toast = document.getElementById('hint-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'hint-toast';
        toast.style.cssText = [
            'position:fixed', 'bottom:80px', 'left:50%',
            'transform:translateX(-50%)',
            'background:rgba(0,0,0,0.82)',
            'color:#fff',
            'padding:10px 22px',
            'border:1px solid rgba(255,255,255,0.18)',
            'font-family:"Share Tech Mono",monospace',
            'font-size:10px',
            'letter-spacing:0.15em',
            'text-transform:uppercase',
            'z-index:9999',
            'pointer-events:none',
            'opacity:0',
            'transition:opacity 0.4s ease',
            'max-width:80vw',
            'text-align:center',
            'border-radius:2px',
            'white-space:normal'
        ].join(';');
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 5000);
}

// Shared helper: build the hologram-style arrow mesh group (white/blue glitchy — matches entrance arrow)
function buildHologramArrow(scale) {
    scale = scale || 1.5;
    const group = new THREE.Group();

    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.5);
    arrowShape.lineTo(0.3, 0);
    arrowShape.lineTo(0.15, 0);
    arrowShape.lineTo(0.15, -0.5);
    arrowShape.lineTo(-0.15, -0.5);
    arrowShape.lineTo(-0.15, 0);
    arrowShape.lineTo(-0.3, 0);
    arrowShape.lineTo(0, 0.5);

    const arrowGeo = new THREE.ShapeGeometry(arrowShape);
    const arrowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.scale.setScalar(scale);
    group.add(arrowMesh);

    // Cyan glow plane behind arrow
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,220,255,0.85)');
    grad.addColorStop(1, 'rgba(0,220,255,0)');
    gCtx.fillStyle = grad;
    gCtx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.MeshBasicMaterial({
        map: glowTex, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), glowMat);
    glowMesh.position.set(0, 0, -0.05);
    group.add(glowMesh);

    return { group, arrowMat, glowMat };
}

// Animate a hologram arrow with glitchy pulse, fade in/out, then remove from scene
function animateHologramArrow(group, arrowMat, glowMat, duration, onDone) {
    duration = duration || 8.0;
    let elapsed = 0;
    let pulseTime = 0;
    const anim = {
        update: function (t, dt) {
            dt = Math.min(dt, 0.1);
            elapsed += dt;
            pulseTime += dt;

            const flicker = Math.random() > 0.88 ? 0.55 : 1.0;
            const pulse = Math.sin(pulseTime * 8) * 0.3 + 0.7;

            let opacity;
            if (elapsed < 0.8) {
                opacity = elapsed / 0.8;
            } else if (elapsed > duration - 1.2) {
                opacity = Math.max(0, (duration - elapsed) / 1.2);
            } else {
                opacity = pulse * flicker;
            }

            arrowMat.opacity = opacity;
            glowMat.opacity = opacity * 0.6;

            if (elapsed > duration) {
                if (group.parent) group.parent.remove(group);
                const idx = window.animatedObjects ? window.animatedObjects.indexOf(anim) : -1;
                if (idx > -1) window.animatedObjects.splice(idx, 1);
                if (onDone) onDone();
            }
        }
    };
    if (window.animatedObjects) window.animatedObjects.push(anim);
    return anim;
}

// Spawn a hologram arrow outdoors pointing down at a world-space target position
function spawnOutdoorHintArrow(targetPos, roomKey) {
    // Remove any previous hint arrow
    if (window._hintArrowObj) {
        if (window._hintArrowObj.group && window._hintArrowObj.group.parent) {
            window._hintArrowObj.group.parent.remove(window._hintArrowObj.group);
        }
        if (window._hintArrowObj.anim && window.animatedObjects) {
            const idx = window.animatedObjects.indexOf(window._hintArrowObj.anim);
            if (idx > -1) window.animatedObjects.splice(idx, 1);
        }
        if (window._hintArrowObj.bobAnim && window.animatedObjects) {
            const idx = window.animatedObjects.indexOf(window._hintArrowObj.bobAnim);
            if (idx > -1) window.animatedObjects.splice(idx, 1);
        }
        window._hintArrowObj = null;
    }

    const { group, arrowMat, glowMat } = buildHologramArrow(1.4);

    group.position.set(targetPos.x, targetPos.y + 2.8, targetPos.z);
    group.rotation.x = -Math.PI / 2; // tip points down toward target

    if (window.worldGroup) window.worldGroup.add(group);

    let elapsed2 = 0;
    const baseY = targetPos.y + 2.8;
    const bobAnim = {
        update: function (t, dt) {
            dt = Math.min(dt, 0.1);
            elapsed2 += dt;
            group.position.y = baseY + Math.sin(elapsed2 * 3) * 0.22;
        }
    };
    if (window.animatedObjects) window.animatedObjects.push(bobAnim);

    const anim = animateHologramArrow(group, arrowMat, glowMat, 8.0, () => {
        if (window.animatedObjects) {
            const i = window.animatedObjects.indexOf(bobAnim);
            if (i > -1) window.animatedObjects.splice(i, 1);
        }
        window._hintArrowObj = null;
    });

    window._hintArrowObj = { group, anim, bobAnim };
}

// Known approximate world positions for each outdoor-visible target
const HINT_TARGET_POSITIONS = {
    hall: { x: 0, y: 0, z: 4.5 },
    living: { x: -2.3, y: 0, z: 4.5 },
    annex: { x: -2.3, y: 0, z: 4.5 }, // Usually accessed via living inside, but outside it's same side
    studio: { x: 2.3, y: 0, z: 4.5 },
    basement: { x: 0, y: -0.5, z: 4.5 },
    toilet: { x: 0, y: 0, z: -4.5 },
    bedroom: { x: -1.8, y: 3.5, z: 4.5 },
    bathroom: { x: 2.0, y: 4.0, z: 4.0 },
    attic: { x: -1.2, y: 6.5, z: 4.5 },
    space: { x: 10, y: 0, z: 5.5 }
};

function getHintTargetPos(key) {
    return HINT_TARGET_POSITIONS[key] || { x: 0, y: 0, z: 5 };
}

window.showHintArrow = function () {
    const currentRoom = window.currentRoom;
    const currentState = window.state || 'HOUSE';
    const answered = (window.visitorData && window.visitorData.answers) ? window.visitorData.answers : {};

    if (currentState === 'HOUSE') {
        const nextRoom = HINT_ROOM_SEQUENCE.find(r => !answered[r.key]);
        if (!nextRoom) {
            showHintToast(t('hint_completed'));
            return;
        }

        if (nextRoom.key === 'hall') {
            showHintToast(t('hint_follow_arrow'));
            return;
        }

        showHintToast(t('hint_next') + nextRoom.label + ' — ' + nextRoom.msg);
        const pos = getHintTargetPos(nextRoom.key);
        spawnOutdoorHintArrow(new THREE.Vector3(pos.x, pos.y, pos.z), nextRoom.key);
        return;
    }

    if (currentState === 'ROOM') {
        if (!answered[currentRoom]) {
            showHintToast(t('hint_orb'));
            return;
        }

        let nextRoom = null;
        const currentIndex = HINT_ROOM_SEQUENCE.findIndex(r => r.key === currentRoom);

        if (currentIndex !== -1) {
            for (let i = currentIndex + 1; i < HINT_ROOM_SEQUENCE.length; i++) {
                if (!answered[HINT_ROOM_SEQUENCE[i].key]) {
                    nextRoom = HINT_ROOM_SEQUENCE[i];
                    break;
                }
            }
            if (!nextRoom) {
                for (let i = 0; i < currentIndex; i++) {
                    if (!answered[HINT_ROOM_SEQUENCE[i].key]) {
                        nextRoom = HINT_ROOM_SEQUENCE[i];
                        break;
                    }
                }
            }
        } else {
            nextRoom = HINT_ROOM_SEQUENCE.find(r => !answered[r.key]);
        }

        if (!nextRoom) {
            showHintToast(t('hint_completed'));
            return;
        }

        if (currentRoom === 'living' && nextRoom.key === 'annex') {
            showHintToast(t('hint_next') + t('hint_annex_label') + ' — ' + t('hint_bookcase'));

            const { group, arrowMat, glowMat } = buildHologramArrow(1.5);
            group.position.set(-2.8, 2.6, -3.5);
            // Bookcase is on the left wall (-X). rotation.z = -Math.PI/2 tilts the
            // upward-pointing arrow to face left (toward -X / the bookcase).
            group.rotation.set(0, 0, -Math.PI / 2);
            if (window.interiorGroup) window.interiorGroup.add(group);

            let elapsed = 0;
            const baseX = -2.8;
            const bobAnim = {
                update: function (t, dt) {
                    dt = Math.min(dt, 0.1);
                    elapsed += dt;
                    group.position.x = baseX - Math.abs(Math.sin(elapsed * 2.5)) * 0.3;
                }
            };
            if (window.animatedObjects) window.animatedObjects.push(bobAnim);

            animateHologramArrow(group, arrowMat, glowMat, 7.0, () => {
                if (window.animatedObjects) {
                    const i = window.animatedObjects.indexOf(bobAnim);
                    if (i > -1) window.animatedObjects.splice(i, 1);
                }
            });
            return;
        }

        if (currentRoom === 'annex' && nextRoom.key === 'studio') {
            showHintToast(t('hint_next') + t('hint_studio_label') + ' — ' + nextRoom.msg);

            const { group, arrowMat, glowMat } = buildHologramArrow(1.5);
            // Point toward the front room exit (+Z). Arrow shape points up by default,
            // so rotation.x = -Math.PI/2 lays it flat with tip toward +Z.
            group.position.set(0, 2.2, 3.0); // In front of exit
            group.rotation.set(-Math.PI / 2, 0, 0); // Tip pointing toward +Z (exit direction)
            if (window.interiorGroup) window.interiorGroup.add(group);

            let elapsed = 0;
            const baseZ = 3.0;
            const bobAnim = {
                update: function (t, dt) {
                    dt = Math.min(dt, 0.1);
                    elapsed += dt;
                    group.position.z = baseZ + Math.abs(Math.sin(elapsed * 2.5)) * 0.3;
                }
            };
            if (window.animatedObjects) window.animatedObjects.push(bobAnim);

            animateHologramArrow(group, arrowMat, glowMat, 7.0, () => {
                if (window.animatedObjects) {
                    const i = window.animatedObjects.indexOf(bobAnim);
                    if (i > -1) window.animatedObjects.splice(i, 1);
                }
            });
            return;
        }

        showHintToast(t('hint_next') + nextRoom.label + ' — ' + nextRoom.msg);
        return;
    }
};

window.showRoomQuestion = function (roomName) {
    // V-NEW: If in browsing mode, don't show questions, show description instead
    if (window.visitorData && window.visitorData.isBrowsing) {
        if (window.showRoomDescription) window.showRoomDescription(roomName);
        return;
    }

    if (!ROOM_QUESTIONS[roomName]) return;

    const overlay = document.getElementById('question-overlay');
    const qText = document.getElementById('room-question-text');
    const qTitle = document.getElementById('room-question-title');
    const qInput = document.getElementById('room-answer');
    // The submit button lives inside the question overlay (may or may not have an id)
    const submitBtn = overlay ? overlay.querySelector('.narrative-btn') : null;

    // Resolve localized room display name
    const roomData = window.roomContent ? window.roomContent[roomName] : null;
    const lang = window.currentLanguage || 'en';
    const roomDisplayName = roomData
        ? (lang === 'nl' && roomData.title_nl ? roomData.title_nl : roomData.title)
        : roomName.toUpperCase();

    // If already answered, show a read-only "already reflected" view
    if (window.visitorData.answers[roomName]) {
        qTitle.innerHTML = `<span style="font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.2em; font-size: 0.55em; display: block; margin-bottom: 0.5em; opacity: 0.8; color:#4ade80;">${t('reflected')}</span>` + roomDisplayName.toUpperCase();
        qText.textContent = ROOM_QUESTIONS[roomName];
        qInput.value = window.visitorData.answers[roomName];
        qInput.disabled = true;
        qInput.style.opacity = '0.55';
        qInput.style.color = '#7fb0ff';

        if (submitBtn) {
            submitBtn.textContent = t('close');
            submitBtn._origOnclick = submitBtn.onclick;
            submitBtn.onclick = function () {
                // Restore everything for future unanswered rooms
                qInput.disabled = false;
                qInput.style.opacity = '';
                qInput.style.color = '';
                if (submitBtn) {
                    submitBtn.textContent = t('submit');
                    submitBtn.onclick = submitBtn._origOnclick || window.submitRoomAnswer;
                }
                overlay.style.opacity = '0';
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
            };
        }

        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 10);
        return;
    }

    // Unanswered room — restore defaults (in case previous view changed them)
    if (submitBtn) {
        submitBtn.textContent = t('submit');
        submitBtn.onclick = submitBtn._origOnclick || window.submitRoomAnswer;
    }
    qInput.disabled = false;
    qInput.style.opacity = '';

    // If browsing, we can change the prompt or just leave it. 
    // The user said "you don't have to answer questions", but they clicked the orb.
    // I will add a "Browsing" note in the title if they are browsing.
    if (window.visitorData.isBrowsing) {
        qTitle.innerHTML = `<span style="font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.2em; font-size: 0.55em; display: block; margin-bottom: 0.5em; opacity: 0.8; color:#60a5fa;">BROWSING</span>` + roomDisplayName.toUpperCase();
    } else {
        qTitle.innerHTML = `<span style="font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.2em; font-size: 0.55em; display: block; margin-bottom: 0.5em; opacity: 0.8; color:#facc15;">REFLECTIONS</span>` + roomDisplayName.toUpperCase();
    }
    qInput.style.color = '';

    qTitle.innerHTML = `<span style="font-family: 'Lato', sans-serif; font-weight: 700; letter-spacing: 0.2em; font-size: 0.55em; display: block; margin-bottom: 0.5em; opacity: 0.8;">${t('reflection')}</span>` + roomDisplayName.toUpperCase();
    qText.textContent = ROOM_QUESTIONS[roomName];
    qInput.value = '';
    qInput.placeholder = t('tell_us_something');

    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.opacity = '1', 10);
};

window.submitRoomAnswer = function () {
    const room = window.currentRoom;
    const input = document.getElementById('room-answer');
    const answer = input.value.trim();

    if (answer.length < 3) {
        alert(t('reflection_error'));
        return;
    }

    window.visitorData.answers[room] = answer;
    if (!window.visitorData.visitedRooms.includes(room)) {
        window.visitorData.visitedRooms.push(room);
    }

    // Persist to localStorage
    if (typeof saveUserProgress === 'function') {
        saveUserProgress(window.visitorData);
    }

    // Notify parent index page of the new answer (include the reflection label)
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'ROOM_ANSWERED',
            room: room,
            answer: answer,
            reflectionLabel: ROOM_REFLECTION_LABELS[room] || room,
            visitorName: window.visitorData.name,
            allAnswers: window.visitorData.answers,
            totalAnswered: window.visitorData.visitedRooms.length
        }, '*');
    }

    // Refresh the orb in the 3D scene to show the answered state (faded red)
    if (typeof interiorGroup !== 'undefined' && interiorGroup) {
        interiorGroup.traverse(child => {
            if (child.userData && child.userData.type === 'reflection_trigger' && child.userData.roomKey === room) {
                // Re-tint core & shell to answered colours
                child.traverse(part => {
                    if (part.isMesh && part.material) {
                        if (part.material.toneMapped === false) {
                            // Core (MeshBasicMaterial)
                            part.material.color.setHex(0xff2200);
                        } else if (part.material.emissive) {
                            // Shell (MeshStandardMaterial)
                            part.material.color.setHex(0xff2200);
                            part.material.emissive.setHex(0xff2200);
                            part.material.opacity = 0.35;
                            part.material.emissiveIntensity = 0.5;
                        }
                    }
                    if (part.isSprite && part.material) {
                        part.material.opacity = 0.35;
                    }
                    if (part.isPointLight) {
                        part.color.setHex(0xff2200);
                        part.intensity = 0.3;
                        part.distance = 3;
                    }
                });
                child.userData.tooltip = t('reflected');
            }
        });
    }

    const overlay = document.getElementById('question-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        checkNarrativeCompletion();
    }, 500);
};

function checkNarrativeCompletion() {
    // Check if we reached 10 rooms
    if (window.visitorData.visitedRooms.length === 10) {
        // Play victory sound
        try {
            const victoryAudio = new Audio(window.houseConfig && window.houseConfig.audio && window.houseConfig.audio.victory
                ? window.houseConfig.audio.victory
                : '/assets/audio/victory.wav');
            victoryAudio.volume = 0.8;
            victoryAudio.play().catch(e => console.warn('Victory audio failed:', e));
        } catch (e) { console.warn('Victory audio error:', e); }

        // Record this completion in memory
        if (typeof recordCompletion === 'function') {
            recordCompletion(window.visitorData);
        }

        // V-NEW: Show Bright Congratulatory Popup
        showCompletionPopup();

        // Notify parent to show full summary on index page (background update)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'NARRATIVE_COMPLETE',
                visitorName: window.visitorData.name,
                allAnswers: window.visitorData.answers
            }, '*');
        }
    }
}

window.closeOverlay = function (id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 500);
    }
};

window.skipNameEntry = function () {
    window.visitorData = window.visitorData || { answers: {}, visitedRooms: [] };
    window.visitorData.name = 'Guest';
    window.visitorData.isBrowsing = true;

    // Notify index if in iframe
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'VISITOR_BROWSING', browsing: true }, '*');
    }

    const overlay = document.getElementById('narrative-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }
};

window.showRoomDescription = function (roomName) {
    const rData = window.roomContent ? window.roomContent[roomName] : null;
    if (!rData || !rData.description) return;

    const overlay = document.getElementById('description-overlay');
    const titleEl = document.getElementById('room-desc-title');
    const textEl = document.getElementById('room-desc-text');

    if (!overlay || !titleEl || !textEl) return;

    const lang = window.currentLanguage || 'en';
    const title = lang === 'nl' && rData.title_nl ? rData.title_nl : rData.title;
    const desc = lang === 'nl' && rData.description_nl ? rData.description_nl : rData.description;

    titleEl.textContent = title;
    textEl.textContent = desc;

    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.opacity = '1'; }, 10);
};

window.showCompletionPopup = function () {
    const overlay = document.getElementById('narrative-overlay');
    const card = overlay.querySelector('.narrative-card');

    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    overlay.style.background = 'rgba(0,0,0,0.95)';
    overlay.style.backdropFilter = 'blur(10px)';

    // Responsive sizing
    const isSmall = window.innerWidth < 600;

    // Bright, premium look
    card.style.cssText = `
    background: white;
    color: black;
    padding: ${isSmall ? '32px 16px' : '60px 40px'};
    border - radius: 4px;
    text - align: center;
    width: ${isSmall ? '92vw' : '90%'};
    max - width: 500px;
    max - height: 90vh;
    overflow - y: auto;
    box - sizing: border - box;
    box - shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    `;

    card.innerHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:8px; background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000); background-size: 200% auto; animation: rainbow 3s linear infinite;"></div>
        <style>
            @keyframes rainbow { to { background-position: 200% center; } }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        </style>
        <h2 style="font-family:'Lexend', sans-serif; font-size: clamp(22px, 8vw, 40px); font-weight:600; color:#000; margin-bottom:1rem; letter-spacing:-0.03em;">${t('congrats')}</h2>
        <p style="font-family:'Lexend', sans-serif; font-size: clamp(13px, 4vw, 20px); line-height:1.5; color:#444; margin-bottom:2rem; font-weight:300;">
            ${t('secret_unlocked')}
        </p>
        <button onclick="window.returnToIndexAndShowMeaning(event)" 
            ontouchstart="window.returnToIndexAndShowMeaning(event)"
            class="group"
            style="background: #000; color: #fff; padding: clamp(12px, 3vw, 20px) clamp(20px, 6vw, 40px); border-radius: 2px; font-family:'Lexend', sans-serif; font-weight:700; font-size: clamp(13px, 3.5vw, 16px); letter-spacing: 0.1em; transition: all 0.3s ease; cursor:pointer; border:none; animation: float 3s ease-in-out infinite; touch-action: manipulation;">
            ${t('reveal_secret')}
        </button>
    `;

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
};

window.returnToIndexAndShowMeaning = function (e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        e.stopPropagation();
    }

    // Prevent double trigger if both touch and click fire
    if (window._revealBusy) return;
    window._revealBusy = true;
    setTimeout(() => { window._revealBusy = false; }, 1000);

    _uiDbg('🔮 Reveal Secret button clicked!');
    const overlay = document.getElementById('narrative-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }

    // Exit fullscreen first
    try {
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozFullScreenElement && document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msFullscreenElement && document.msExitFullscreen) document.msExitFullscreen();
    } catch (fsErr) { console.warn('Fullscreen exit error:', fsErr); }

    if (window.parent && window.parent !== window) {
        _uiDbg('📡 Posting GOTO_MEANING_OF_LIFE to parent');
        window.parent.postMessage({
            type: 'GOTO_MEANING_OF_LIFE',
            visitorName: window.visitorData ? window.visitorData.name : null,
            allAnswers: window.visitorData ? window.visitorData.answers : {}
        }, '*');
    }

    // After seeing the meaning of life, prompt to share with the gallery
    setTimeout(() => {
        if (typeof window.showGallerySharePrompt === 'function') {
            window.showGallerySharePrompt();
        }
    }, 4000);
};

function showFinalSummary() {
    const summaryOverlay = document.getElementById('narrative-overlay');
    if (!summaryOverlay) return;
    const card = summaryOverlay.querySelector('.narrative-card');
    if (!card) return;

    // V-FIX: Ensure overlay is scrollable if content overflows (prevents "stuck" state)
    summaryOverlay.style.display = 'flex';
    summaryOverlay.style.overflowY = 'auto';
    summaryOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    summaryOverlay.style.backdropFilter = 'blur(15px)';
    summaryOverlay.style.opacity = '1';
    summaryOverlay.style.padding = '40px 20px'; // Give some breathing room

    card.innerHTML = '';
    card.style.maxWidth = '640px';
    card.style.width = '100%';
    card.style.margin = 'auto'; // Flex centering fallback

    // Give the card a subtle presence so it's not "invisible"
    card.style.background = 'rgba(255, 255, 255, 0.03)';
    card.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
    card.style.textAlign = 'left';

    // Build the specific room lines
    const answers = window.visitorData.answers || {};
    const roomOrder = [
        { id: 'hall', prefix: t('started') },
        { id: 'living', prefix: t('love_is') },
        { id: 'annex', prefix: t('bully') },
        { id: 'studio', prefix: t('should') },
        { id: 'basement', prefix: t('doubt') },
        { id: 'toilet', prefix: t('einstein') },
        { id: 'bedroom', prefix: t('eat') },
        { id: 'bathroom', special: true, suffix: t('hero') },
        { id: 'attic', prefix: t('forget') },
        { id: 'space', prefix: t('answer_everything') }
    ];

    let linesHTML = '';
    roomOrder.forEach((r, idx) => {
        const ans = answers[r.id] || "???";
        let line = '';
        const fontStyle = "font-family:'Special Elite', cursive;";
        const numStyle = "font-family:'Special Elite', cursive; color: #666; min-width: 1.5em; display: inline-block;";

        if (r.special) {
            line = `<span style="${numStyle}">${idx + 1}.</span> <span class="text-cyan-300 font-bold" style="${fontStyle}">${ans}</span> <span class="text-gray-400" style="${fontStyle}">${r.suffix}</span>`;
        } else {
            line = `<span style="${numStyle}">${idx + 1}.</span> <span class="text-gray-400" style="${fontStyle}">${r.prefix}</span> <span class="text-cyan-300 font-bold" style="${fontStyle}">${ans}</span>`;
        }
        linesHTML += `<div class="mb-3 border-b border-white/5 pb-2 text-md leading-snug">${line}</div>`;
    });

    const vName = window.visitorData.name || "Unknown";

    card.innerHTML = `
        <button class="close-popup-btn" style="position:fixed; top:20px; right:20px; z-index:2001; background:rgba(0,0,0,0.5); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.2);" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
        <div class="text-center mb-6 mt-2 flex flex-col items-center">
            <h2 class="uppercase text-center" style="font-family:'Orelega One', cursive; line-height: 1.1; letter-spacing: -0.02em; color: #fff;">
                <span style="font-size: min(10vw, 48px); display: block; width: 100%; opacity: 0.8;">${t('mol_title')}</span>
                <span style="font-size: 18px; display: block; opacity: 0.6; margin: 10px 0; font-family: 'Orelega One', cursive;">${t('mol_according')}</span>
                <span style="font-size: min(15vw, 64px); display: block; font-weight: 700; color: #fff;">${vName}</span>
            </h2>
            <div class="flex flex-col items-center gap-1.5 opacity-20 mt-4">
                <div class="w-24 h-[1px] bg-white"></div>
                <div class="w-40 h-[1px] bg-white"></div>
            </div>
        </div>

        <div class="text-left leading-relaxed max-h-[50vh] overflow-y-auto px-4 custom-scrollbar mb-4">
            ${linesHTML}
        </div>

        <div class="mt-8 mb-4 flex flex-col gap-3 text-center px-4">
            <button class="narrative-btn w-full py-4" style="background: #fff; color: #000; font-weight: bold;" onclick="window.downloadNarrative()">${t('download_report')}</button>
            <button class="text-[11px] text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] py-4"
                onclick="window.closeFinalSummaryOverlay()">
                ${t('return_house')}
            </button>
        </div>
    `;
}


// Closes the final summary overlay. On mobile (inside the full-screen iframe),
// also signals the parent page to exit mobile-experience-active so the user
// can scroll down to the paper "Meaning of Life" section.
window.closeFinalSummaryOverlay = function () {
    const overlay = document.getElementById('narrative-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.style.background = 'rgba(0,0,0,0.85)';
    }
    // Tell the parent to drop mobile-experience mode and scroll to the paper section
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'EXIT_TO_PAPER_SECTION' }, '*');
    }
};
window.showNarrativeSummary = function () {
    const visitedCount = window.visitorData.visitedRooms.length;
    const isComplete = visitedCount >= 10;

    // If complete, show the final sealed record
    if (isComplete) {
        showFinalSummary();
        return;
    }

    // Otherwise show current progress — all 10 rooms listed
    const summaryOverlay = document.getElementById('narrative-overlay');
    if (!summaryOverlay) return;

    const card = summaryOverlay.querySelector('.narrative-card');
    if (!card) return;

    const answers = window.visitorData.answers || {};

    // All 10 rooms in order
    const ALL_ROOMS = [
        { key: 'hall', nameEn: 'The Reception Hall', nameNl: 'De Ontvangsthal' },
        { key: 'living', nameEn: 'The Living Room', nameNl: 'De Woonkamer' },
        { key: 'studio', nameEn: 'The Studio', nameNl: 'De Studio' },
        { key: 'bedroom', nameEn: 'The Bedroom', nameNl: 'De Slaapkamer' },
        { key: 'bathroom', nameEn: 'The Bathroom', nameNl: 'De Badkamer' },
        { key: 'toilet', nameEn: 'The Little Room', nameNl: 'Het Kleinste Kamertje' },
        { key: 'attic', nameEn: 'The Attic', nameNl: 'De Zolder' },
        { key: 'basement', nameEn: 'The Basement', nameNl: 'De Kelder' },
        { key: 'annex', nameEn: 'The Annex', nameNl: 'De Annex' },
        { key: 'space', nameEn: 'The Void', nameNl: 'De Ruimte' },
    ];

    const lang = window.currentLanguage || 'en';

    let breakdownHTML = '<div class="mt-4 pt-4 border-t border-white/10 text-left max-h-[40vh] overflow-y-auto custom-scrollbar">';
    ALL_ROOMS.forEach(room => {
        const isAnswered = !!answers[room.key];
        const label = isAnswered ? (ROOM_REFLECTION_LABELS[room.key] || '✓') : '—';
        const roomName = lang === 'nl' ? room.nameNl : room.nameEn;
        const statusColor = isAnswered ? 'text-cyan-400' : 'text-gray-600';
        const checkMark = isAnswered ? '<span class="text-green-400">✓</span>' : '<span class="text-gray-700">○</span>';
        breakdownHTML += `
        <div class="text-[10px] mb-2 flex justify-between items-center py-1 border-b border-white/5">
                <span class="flex items-center gap-2">${checkMark} <span class="${isAnswered ? 'text-gray-300' : 'text-gray-600'}">${roomName}</span></span>
                <span class="${statusColor} font-bold text-[9px] tracking-wider">${label}</span>
            </div>`;
    });
    breakdownHTML += '</div>';

    card.innerHTML = '';
    card.style.maxWidth = '480px';
    card.style.border = '1px solid rgba(0, 255, 255, 0.2)';
    card.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.05)';

    card.innerHTML = `
        <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
        <div class="text-xs font-mono text-cyan-400 mb-2 tracking-[0.3em] uppercase">${t('status_progress')}</div>
        <h2 style="font-family:'Courier Prime'; color:#fff; border-bottom:1px solid #333; padding-bottom:1rem; margin-bottom: 1.5rem;">${t('journey_so_far')}</h2>
        <div style="color:#aaa; font-size:0.8rem; line-height:1.7; font-family:'Courier Prime';">
            ${t('visitor')}: ${window.visitorData.name || 'Unknown'}<br>
            ${t('reflections_gathered')}: ${visitedCount} / 10
        </div>
        ${breakdownHTML}
    <div class="mt-6 flex justify-center">
        <button class="px-8 py-3 border border-white/40 text-white hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
            onclick="document.getElementById('narrative-overlay').style.display='none'">
            ${t('resume')}
        </button>
    </div>
    `;

    summaryOverlay.style.display = 'flex';
    summaryOverlay.style.opacity = '0';
    setTimeout(() => summaryOverlay.style.opacity = '1', 50);
};

window.submitFinalRecord = function () {
    const zone = document.getElementById('submit-action-zone');
    if (zone) {
        zone.innerHTML = `
        <div class="text-cyan-400 font-mono text-[10px] animate-pulse py-4">
            ${t('transmitting')}
            </div>
        `;
    }

    setTimeout(() => {
        if (zone) {
            zone.innerHTML = `
        <div class="text-green-400 font-mono text-[10px] py-4 mb-2">
            ${t('record_secured')}
                </div>
                <button class="narrative-btn" onclick="downloadNarrative()">${t('download_record')}</button>
                <button class="narrative-btn" style="margin-top:10px; border-color:#333;" onclick="emailNarrative()">${t('email_record')}</button>
                <button class="text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-widest mt-4" onclick="document.getElementById('narrative-overlay').style.display='none'">${t('restore_view')}</button>
    `;
        }

        // Final chime or effect?
        _uiDbg("Transmission complete.");
    }, 2500);
};

window.downloadNarrative = function () {
    let content = `${t('report_header')} \n`;
    content += `${t('visitor')}: ${window.visitorData.name} \n`;
    content += `${t('date')}: ${new Date().toLocaleString()} \n`;
    content += `------------------------------------------\n\n`;

    for (const [room, answer] of Object.entries(window.visitorData.answers)) {
        content += `[${room.toUpperCase()}]\n${t('question')}: ${ROOM_QUESTIONS[room]} \n${t('answer')}: ${answer} \n\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AweRecord_${window.visitorData.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};

window.emailNarrative = function () {
    let subject = encodeURIComponent(`House of Awe Record - ${window.visitorData.name} `);
    let body = `HOUSE OF AWE - NARRATIVE RECORD\n`;
    body += `Visitor: ${window.visitorData.name} \n`;
    body += `Date: ${new Date().toLocaleString()} \n`;
    body += `------------------------------------------\n\n`;

    // Only include answered questions
    for (const [room, answer] of Object.entries(window.visitorData.answers)) {
        if (ROOM_QUESTIONS[room]) {
            body += `[${room.toUpperCase()}]\nQ: ${ROOM_QUESTIONS[room]} \nA: ${answer} \n\n`;
        }
    }

    body = encodeURIComponent(body);

    // Using an anchor tag click is more reliable than window.location.href for mailto protocol
    const a = document.createElement('a');
    a.href = `mailto:? subject = ${subject}& body=${body} `;
    a.target = '_blank';
    a.click();
};

function createPlutoUsher() {
    const group = new THREE.Group();
    group.userData.type = 'usher_group';
    const baseH = 1.8;

    const halo = createGlitchyHalo();
    halo.position.set(0, baseH, 0);
    group.add(halo);

    const text = createUsherText();
    text.position.set(0, baseH, 0);
    group.add(text);

    group.userData.update = function (t) {
        const bob = Math.sin(t * 1.5) * 0.1;
        halo.position.y = baseH + bob;
        text.position.y = baseH + bob;
    };

    return group;
}

// ---- LANGUAGE SYNC ----
window.setExperienceLanguage = function (lang) {
    if (!UI_I18N[lang]) return;
    window.currentLanguage = lang; // must match what t() reads
    window.currentLang = lang;     // alias for house.js references
    _uiDbg("🏳️ Experience language set to:", lang);

    // 1. Refresh global UI elements (prompts, overlays)
    initNarrativePrompt();
    if (window.currentRoom) {
        if (window.showRoomQuestion) {
            // If the question overlay is already visible, refresh its text
            const qOverlay = document.getElementById('question-overlay');
            if (qOverlay && qOverlay.style.display !== 'none') {
                window.showRoomQuestion(window.currentRoom);
            }
        }

        // 2. Refresh 3D Room Elements
        if (window.currentRoom === 'hall' && window.refreshHallSign) {
            window.refreshHallSign();
        }

        // Refresh Music Panel
        if (window.updateMusicPanelHighlight) window.updateMusicPanelHighlight();
    }

    // 3. Refresh Word Sculpture (Neon)
    if (window.refreshWordSculpture) window.refreshWordSculpture();

    // 4. Refresh Usher (if exists)
    if (window.worldGroup && window.refreshUsherText) {
        window.worldGroup.traverse(c => {
            if (c.userData && c.userData.type === 'usher_text') {
                window.refreshUsherText(c);
            }
        });
    }
};

window.addEventListener('message', (event) => {
    const d = event.data;
    if (!d) return;

    if (d.type === 'SET_LANGUAGE') {
        window.setExperienceLanguage(d.lang);
    }

    if (d.type === 'SET_VISITOR_BROWSING') {
        window.visitorData = window.visitorData || { answers: {}, visitedRooms: [] };
        window.visitorData.isBrowsing = !!d.browsing;
        if (window.visitorData.isBrowsing) {
            window.visitorData.name = 'Guest';
            window.closeOverlay('narrative-overlay');
        }
    }

    // Triggered by parent (index.html) when the user is in mobile-experience mode
    // and has completed all 10 rooms. Shows the final summary inside the 3D world
    // instead of navigating away to the paper section on the parent page.
    if (d.type === 'SHOW_FINAL_SUMMARY') {
        if (typeof showFinalSummary === 'function') {
            showFinalSummary();
        } else if (typeof window.showNarrativeSummary === 'function') {
            window.showNarrativeSummary();
        }
    }

    if (d.type === 'RESET_VIEW') {
        if (typeof window.resetToIdleView === 'function') {
            window.resetToIdleView();
        }
    }
});


// ============================================================
//  VISITOR WALL — Spoiler-Free Names-Only View (during gameplay)
// ============================================================

/**
 * Show a spoiler-free "Visitor Wall" — only names and completion times,
 * no answers revealed. This preserves the punchline surprise.
 */
window.showVisitorWall = async function () {
    const summaryOverlay = document.getElementById('narrative-overlay');
    if (!summaryOverlay) return;
    const card = summaryOverlay.querySelector('.narrative-card');
    if (!card) return;

    const visitedCount = window.visitorData.visitedRooms.length;
    const isUserFinished = visitedCount >= 10;

    // Style card based on mode
    card.innerHTML = '';
    card.style.maxWidth = isUserFinished ? '640px' : '480px';
    card.style.border = '1px solid rgba(0, 255, 255, 0.2)';
    card.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 255, 0.05)';
    card.style.background = 'rgba(0,0,0,0.95)';
    card.style.padding = '3rem 2rem';

    // Loading State
    card.innerHTML = `
        <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
        <div class="text-xs font-mono text-cyan-400 mb-2 tracking-[0.3em] uppercase">${t('wall_title')}</div>
        <h2 style="font-family:'Courier Prime'; color:#fff; border-bottom:1px solid #333; padding-bottom:1rem; margin-bottom:1.5rem;">${t('wall_subtitle')}</h2>
        <div id="wall-loading" style="font-family:'Share Tech Mono',monospace; font-size:11px; color:#60a5fa; text-align:center; padding:40px 0;">...</div>
    `;

    summaryOverlay.style.display = 'flex';
    summaryOverlay.style.opacity = '1';
    summaryOverlay.style.overflowY = 'auto';

    // Fetch entries
    let entries = [];
    try {
        if (typeof fetchGalleryEntries === 'function') {
            entries = await fetchGalleryEntries(50);
        }
    } catch (err) {
        console.error('🔥 Visitor Wall fetch error:', err);
    }

    if (entries.length === 0) {
        card.innerHTML = `
        <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
            <div class="text-xs font-mono text-cyan-400 mb-2 tracking-[0.3em] uppercase">${t('wall_title')}</div>
            <h2 style="font-family:'Courier Prime'; color:#fff; border-bottom:1px solid #333; padding-bottom:1rem; margin-bottom:1.5rem;">${t('wall_subtitle')}</h2>
            <p style="font-family:'Share Tech Mono',monospace; font-size:11px; color:#555; text-align:center; padding:40px 0;">${t('wall_empty')}</p>
    `;
        return;
    }

    // Build the list
    let listHTML = '';
    const prefixes = {
        hall: t('started'),
        living: t('love_is'),
        annex: t('bully'),
        studio: t('should'),
        basement: t('doubt'),
        toilet: t('einstein'),
        bedroom: t('eat'),
        bathroom: t('hero'),
        attic: t('forget'),
        space: t('answer_everything')
    };

    if (isUserFinished) {
        // DETAILED MODE: Show the meaning of life for each visitor
        listHTML = `<div class="space-y-6 max-h-[60vh] overflow-y-auto px-4 custom-scrollbar text-left mt-4">`;
        entries.forEach(entry => {
            const timeAgo = entry.timestamp ? formatTimeAgo(entry.timestamp) : '';
            const ans = entry.answers || {};

            let answersHtml = '';
            const rOrder = ['hall', 'living', 'annex', 'studio', 'basement', 'toilet', 'bedroom', 'bathroom', 'attic', 'space'];
            rOrder.forEach(room => {
                if (ans[room]) {
                    const prefix = prefixes[room] || '';
                    if (room === 'bathroom') {
                        answersHtml += `<div class="mb-1"><span class="text-cyan-400 font-bold">${ans[room]}</span> <span class="text-gray-500">${prefix}</span></div>`;
                    } else {
                        answersHtml += `<div class="mb-1"><span class="text-gray-500">${prefix}</span> <span class="text-cyan-400 font-bold">${ans[room]}</span></div>`;
                    }
                }
            });

            listHTML += `
        <div class="border border-white/10 rounded p-4 bg-white/5 relative overflow-hidden">
                    <div class="flex justify-between items-baseline mb-3 border-b border-white/5 pb-2">
                        <span style="font-family:'Orelega One',cursive; font-size:18px; color:#fff;">${entry.name}</span>
                        <span style="font-family:'Share Tech Mono',monospace; font-size:9px; color:#555;">${timeAgo}</span>
                    </div>
                    <div style="font-family:'Special Elite',cursive; font-size:12px; line-height:1.6;">
                        ${answersHtml || '<span class="opacity-20 italic">No reflections shared.</span>'}
                    </div>
                </div> `;
        });
        listHTML += `</div>`;
    } else {
        // SPOILER-FREE MODE: List of names only
        listHTML = `<div style="font-family:'Share Tech Mono',monospace; font-size:10px; color:#333; letter-spacing:0.1em; margin-bottom:12px; text-transform:uppercase;">${entries.length} ${t('wall_completed')}</div>`;
        listHTML += `<div class="space-y-1 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">`;
        entries.forEach(entry => {
            const timeAgo = entry.timestamp ? formatTimeAgo(entry.timestamp) : '';
            listHTML += `
        <div class="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
                    <span class="flex items-center gap-2">
                        <span style="width:4px;height:4px;border-radius:50%;background:#00ffff;box-shadow:0 0 4px cyan;display:inline-block;"></span>
                        <span style="font-family:'Orelega One',cursive; font-size:16px; color:#fff;">${entry.name}</span>
                    </span>
                    <span style="font-family:'Share Tech Mono',monospace; font-size:9px; color:#444;">${timeAgo}</span>
                </div> `;
        });
        listHTML += `</div>`;
    }

    card.innerHTML = `
        <button class="close-popup-btn" onclick="window.closeOverlay('narrative-overlay')">&times;</button>
        <div class="text-xs font-mono text-cyan-400 mb-2 tracking-[0.3em] uppercase">${t('wall_title')}</div>
        <h2 style="font-family:'Courier Prime'; color:#fff; border-bottom:1px solid #333; padding-bottom:1rem; margin-bottom:1.5rem;">${t('wall_subtitle')}</h2>
        ${listHTML}
    <div class="mt-8 flex justify-center">
        <button class="narrative-btn px-10 py-3" onclick="window.closeOverlay('narrative-overlay')">
            ${t('resume')}
        </button>
    </div>
    `;
};



// ============================================================
//  VISITOR GALLERY — Share Prompt & Community Wall (post-completion only)
// ============================================================

/**
 * After completing all 10 rooms, offer the visitor the choice to
 * share their anonymous "meaning of life" to the Firestore gallery.
 */
window.showGallerySharePrompt = function () {
    const mem = typeof getMemory === 'function' ? getMemory() : null;
    if (mem && mem.gallerySubmitted) {
        _uiDbg('Gallery: already submitted, skipping prompt.');
        return;
    }

    // Create an overlay prompt
    let existing = document.getElementById('gallery-share-prompt');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'gallery-share-prompt';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:10001',
        'background:rgba(0,0,0,0.85)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'opacity:0', 'transition:opacity 0.5s ease'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
        'background:#111', 'border:1px solid rgba(96,165,250,0.3)',
        'padding:32px 28px', 'border-radius:4px', 'max-width:420px',
        'width:90%', 'text-align:center',
        'box-shadow:0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(96,165,250,0.08)'
    ].join(';');

    card.innerHTML = `
        <div style="font-family:'Share Tech Mono',monospace; font-size:9px; color:#60a5fa; letter-spacing:0.25em; text-transform:uppercase; margin-bottom:16px; opacity:0.7;">
            ${t('gallery_title')}
        </div>
        <p style="font-family:'Share Tech Mono',monospace; font-size:13px; color:#ddd; line-height:1.7; margin-bottom:24px;">
            ${t('gallery_submit_prompt')}
        </p>
        <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
            <button id="gallery-share-yes" style="
                background:transparent; border:1px solid #60a5fa; color:#60a5fa;
                padding:10px 28px; font-family:'Share Tech Mono',monospace;
                font-size:11px; letter-spacing:0.15em; cursor:pointer;
                transition:all 0.3s ease; text-transform:uppercase;
            ">${t('gallery_submit_yes')}</button>
            <button id="gallery-share-no" style="
                background:transparent; border:1px solid #333; color:#666;
                padding:8px 28px; font-family:'Share Tech Mono',monospace;
                font-size:10px; letter-spacing:0.15em; cursor:pointer;
                transition:all 0.3s ease; text-transform:uppercase;
            ">${t('gallery_submit_no')}</button>
        </div>
        <div id="gallery-share-status" style="margin-top:16px; font-family:'Share Tech Mono',monospace; font-size:10px; color:#888; min-height:20px;"></div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Hover styles
    const yesBtn = card.querySelector('#gallery-share-yes');
    yesBtn.onmouseenter = function () { this.style.background = '#60a5fa'; this.style.color = '#000'; };
    yesBtn.onmouseleave = function () { this.style.background = 'transparent'; this.style.color = '#60a5fa'; };

    // YES — submit to gallery
    yesBtn.onclick = async function () {
        const statusEl = card.querySelector('#gallery-share-status');
        statusEl.textContent = t('transmitting');
        statusEl.style.color = '#60a5fa';

        const success = typeof submitToGallery === 'function'
            ? await submitToGallery(window.visitorData)
            : false;

        if (success) {
            statusEl.textContent = t('gallery_submitted');
            statusEl.style.color = '#4ade80';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 2000);
        } else {
            statusEl.textContent = 'Firestore not configured — submission saved locally.';
            statusEl.style.color = '#f87171';
            // Still fade out after a moment
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 3000);
        }
    };

    // NO — dismiss
    card.querySelector('#gallery-share-no').onclick = function () {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    };
};

/**
 * Show the Visitor Gallery overlay — a scrollable community wall
 * of past visitors' anonymous "meaning of life" summaries.
 */
window.showGalleryOverlay = async function () {
    // V-FIX: Prevent viewing the gallery until all 10 rooms are finished
    const roomsCount = (window.visitorData && window.visitorData.visitedRooms) ? window.visitorData.visitedRooms.length : 0;
    if (roomsCount < 10) {
        // Show a "Locked" message instead of the gallery
        let existing = document.getElementById('gallery-locked-overlay');
        if (existing) existing.remove();

        const lockedIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#60a5fa" viewBox="0 0 16 16" style="margin-bottom:20px; opacity:0.8;">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
        `;

        const overlay = document.createElement('div');
        overlay.id = 'gallery-locked-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.4s ease;';
        overlay.innerHTML = `
            ${lockedIcon}
            <div style="font-family:'Share Tech Mono',monospace; font-size:10px; color:#60a5fa; letter-spacing:0.3em; text-transform:uppercase; margin-bottom:15px; opacity:0.7;">
                ${t('gallery_title')}
            </div>
            <p style="font-family:'Orelega One',cursive; font-size:22px; color:#fff; text-align:center; max-width:320px; line-height:1.4; margin-bottom:30px;">
                ${window.currentLanguage === 'nl' ? 'De betekenis van het leven is een verrassing die je zelf moet ontdekken.' : 'The meaning of life is a surprise you must discover for yourself.'}
            </p>
            <p style="font-family:'Share Tech Mono',monospace; font-size:11px; color:#555; text-align:center;">
                ${window.currentLanguage === 'nl' ? 'Voltooi alle 10 kamers om de galerij te ontgrendelen.' : 'Complete all 10 rooms to unlock the community gallery.'}
            </p>
            <button id="close-locked-gallery" style="margin-top:40px; background:transparent; border:1px solid #444; color:#888; padding:10px 30px; font-family:'Share Tech Mono',monospace; font-size:10px; text-transform:uppercase; cursor:pointer; transition:all 0.3s ease;">
                ${t('gallery_close')}
            </button>
    `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.style.opacity = '1');

        overlay.querySelector('#close-locked-gallery').onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 400);
        };
        return;
    }

    let existing = document.getElementById('gallery-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'gallery-overlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:10000',
        'background:rgba(0,0,0,0.92)',
        'display:flex', 'flex-direction:column', 'align-items:center',
        'overflow-y:auto', 'padding:40px 20px 60px',
        'opacity:0', 'transition:opacity 0.5s ease'
    ].join(';');

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'text-align:center; margin-bottom:30px; max-width:600px; width:100%;';
    header.innerHTML = `
        <div style="font-family:'Share Tech Mono',monospace; font-size:14px; color:#60a5fa; letter-spacing:0.3em; text-transform:uppercase; margin-bottom:12px; opacity:0.7;">
            ${t('gallery_title')}
        </div>
        <p style="font-family:'Orelega One',cursive; font-size:32px; color:#fff; line-height:1.3; margin-bottom:8px;">
            ${t('gallery_subtitle')}
        </p>
        <div id="gallery-count" style="font-family:'Share Tech Mono',monospace; font-size:10px; color:#666; letter-spacing:0.1em;"></div>
    `;
    overlay.appendChild(header);

    // Loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.style.cssText = 'font-family:"Share Tech Mono",monospace; font-size:11px; color:#60a5fa; animation:pulse 1.5s ease-in-out infinite;';
    loadingEl.textContent = '...';
    overlay.appendChild(loadingEl);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = t('gallery_close');
    closeBtn.style.cssText = [
        'position:fixed', 'top:20px', 'right:24px', 'z-index:10001',
        'background:transparent', 'border:1px solid #444', 'color:#888',
        'padding:8px 20px', 'font-family:"Share Tech Mono",monospace',
        'font-size:10px', 'letter-spacing:0.15em', 'cursor:pointer',
        'transition:all 0.3s ease', 'text-transform:uppercase'
    ].join(';');
    closeBtn.onmouseenter = function () { this.style.borderColor = '#fff'; this.style.color = '#fff'; };
    closeBtn.onmouseleave = function () { this.style.borderColor = '#444'; this.style.color = '#888'; };
    closeBtn.onclick = function () {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    };
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Fetch entries from Firestore
    let entries = [];
    try {
        if (typeof fetchGalleryEntries === 'function') {
            entries = await fetchGalleryEntries(30);
        }
    } catch (err) {
        console.error('🔥 Gallery fetch error:', err);
    }

    // Remove loading
    loadingEl.remove();

    // Update count
    const countEl = overlay.querySelector('#gallery-count');
    if (countEl) {
        countEl.textContent = entries.length > 0
            ? `${entries.length} ${t('gallery_visitors')} `
            : '';
    }

    if (entries.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.style.cssText = 'font-family:"Share Tech Mono",monospace; font-size:12px; color:#555; text-align:center; margin-top:40px;';
        emptyMsg.textContent = t('gallery_empty');
        overlay.appendChild(emptyMsg);
        return;
    }

    // The room prefixes (matching the final summary display)
    const roomPrefixes = {
        hall: { en: 'It all started...', nl: 'Het begon allemaal' },
        living: { en: 'Love is', nl: 'Liefde is' },
        annex: { en: 'The biggest bully is', nl: 'De grootste pestkop is' },
        studio: { en: 'Everybody should', nl: 'Iedereen zou moeten' },
        basement: { en: 'When in doubt,', nl: 'Bij twijfel,' },
        toilet: { en: 'Einstein couldn\'t think of:', nl: 'Einstein dacht niet aan:' },
        bedroom: { en: 'We should all', nl: 'We zouden allemaal moeten' },
        bathroom: { en: '', nl: '' },  // name IS hero
        attic: { en: 'Never forget:', nl: 'Nooit vergeten:' },
        space: { en: 'The answer to everything', nl: 'Het antwoord op alles' }
    };

    const lang = window.currentLanguage || 'en';

    // Render gallery cards
    const grid = document.createElement('div');
    grid.style.cssText = 'max-width:700px; width:100%; display:flex; flex-direction:column; gap:20px;';

    entries.forEach((entry, idx) => {
        const card = document.createElement('div');
        card.style.cssText = [
            'background:rgba(255,255,255,0.03)',
            'border:1px solid rgba(255,255,255,0.08)',
            'border-radius:4px', 'padding:24px',
            'transition:all 0.3s ease',
            'opacity:0', 'transform:translateY(20px)'
        ].join(';');

        // Staggered fade-in
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, idx * 80);

        // Hover
        card.onmouseenter = function () {
            this.style.borderColor = 'rgba(96,165,250,0.3)';
            this.style.background = 'rgba(96,165,250,0.04)';
        };
        card.onmouseleave = function () {
            this.style.borderColor = 'rgba(255,255,255,0.08)';
            this.style.background = 'rgba(255,255,255,0.03)';
        };

        // Build card content
        let answerLines = '';
        const roomOrder = ['hall', 'living', 'annex', 'studio', 'basement', 'toilet', 'bedroom', 'bathroom', 'attic', 'space'];
        const answers = entry.answers || {};

        // Show 2-3 highlighted excerpts
        const shownRooms = roomOrder.filter(r => answers[r]);
        shownRooms.forEach(room => {
            const prefix = roomPrefixes[room] ? (roomPrefixes[room][lang] || roomPrefixes[room].en) : '';
            const ans = answers[room] || '';
            if (room === 'bathroom') {
                answerLines += `<div style="margin-bottom:6px;"><span style="color:#67e8f9; font-weight:bold;">${ans}</span> <span style="color:#888;">is our hero</span></div>`;
            } else {
                answerLines += `<div style="margin-bottom:6px;"><span style="color:#888;">${prefix}</span> <span style="color:#67e8f9; font-weight:bold;">${ans}</span></div>`;
            }
        });

        // Time ago
        const timeAgo = entry.timestamp ? formatTimeAgo(entry.timestamp) : '';

        card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
                <div style="font-family:'Orelega One',cursive; font-size:18px; color:#fff;">${entry.name}</div>
                <div style="font-family:'Share Tech Mono',monospace; font-size:9px; color:#555; letter-spacing:0.1em;">${entry.roomCount || 0} ${t('gallery_rooms')} · ${timeAgo}</div>
            </div>
        <div style="font-family:'Special Elite',cursive; font-size:13px; line-height:1.8;">
            ${answerLines}
        </div>
    `;

        grid.appendChild(card);
    });

    overlay.appendChild(grid);
};

/**
 * Helper: Format a Date as a human-readable time-ago string
 */
function formatTimeAgo(date) {
    if (!date) return '';
    const dateObj = (date instanceof Date) ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const now = Date.now();
    const diffMs = now - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 30) {
        return dateObj.toLocaleDateString(window.currentLanguage === 'nl' ? 'nl-NL' : 'en-GB', {
            day: 'numeric', month: 'short'
        });
    }
    if (diffDays > 0) return `${diffDays} d`;
    if (diffHours > 0) return `${diffHours} h`;
    if (diffMins > 0) return `${diffMins} m`;
    return 'now';
}
