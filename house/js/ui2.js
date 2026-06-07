// ============================================================
//  HOUSE OF AWE — UI Components  (ui.js)
// ============================================================


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
                // Optionally call stopBedroomVideo if it exists
                if (window.currentRoom === 'bedroom' && window.stopBedroomVideo) {
                    window.stopBedroomVideo();
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

window.visitorData = {
    name: '',
    answers: {},
    visitedRooms: []
};

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
        `;
    }

    if (!hasName && forceShow) {
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
        welcome_text: "Go and discover.<br><br>Just follow your instinct and everything will be fine.",
        enter: "ENTER",
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
        started: "It all started...",
        love_is: "Love is",
        bully: "The biggest bullie is",
        should: "Everybody should",
        doubt: "When in doubt,",
        einstein: "Einstein couldn't even think of this:",
        eat: "We should all",
        hero: "is our hero",
        forget: "never forget:",
        answer_everything: "The answer to everything",
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
        hall_q: "All stories begin somewhere, somehow. How does yours start?",
        living_q: "What do you love in life?",
        annex_q: "What do you fear?",
        studio_q: "What do you do in your spare time?",
        basement_q: "Stop thinking - What does your gut say?",
        toilet_q: "What are your big ideas?",
        bedroom_q: "What are your dreams made of?",
        bathroom_q: "Who is your favorite superhero?",
        attic_q: "What are your fondest memories?",
        space_q: "Where were you 10 years before you were born?",
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
        welcome_text: "Ga op ontdekking!<br><br>Volg gewoon je intuïtie en alles komt goed.",
        enter: "GA VERDER",
        reflected: "GEREFLECTEERD ✓",
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
        started: "Het begon allemaal",
        love_is: "Liefde is",
        bully: "De grootste pestkop is",
        should: "Iedereen zou moeten",
        doubt: "Bij twijfel,",
        einstein: "Einstein had dit niet kunnen bedenken:",
        eat: "We zouden allemaal moeten ",
        hero: "is onze held",
        forget: "nooit vergeten:",
        answer_everything: "Het antwoord op alles",
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
        hall_q: "Alle verhalen beginnen ergens. Hoe begint het jouwe?",
        living_q: "Waar hou je van?",
        annex_q: "Waar ben je bang voor?",
        studio_q: "Wat doe je in je vrije tijd?",
        basement_q: "Stop NU met denken - Wat zegt je gevoel?",
        toilet_q: "Wat zijn je grote ideeën?",
        bedroom_q: "Waar droom je over?",
        bathroom_q: "Wie is je favoriete superheld?",
        attic_q: "Wat zijn je mooiste herinneringen?",
        space_q: "Waar was je 10 jaar voordat je was geboren?",
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
        console.log('🌐 Language switched to:', d.lang);

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
        }
    }
});

window.submitVisitorName = function () {
    const input = document.getElementById('visitor-name');
    if (!input) return; // Safety check
    const name = input.value.trim();

    if (name.length < 2) {
        alert(t('identify_error'));
        return;
    }

    // Save Name
    window.visitorData = window.visitorData || {};
    window.visitorData.name = name;

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
    console.log('🚪 Dismissing welcome popup...');
    const overlay = document.getElementById('narrative-overlay');

    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            // Start Guidance
            if (typeof createGuidanceArrow === 'function') {
                createGuidanceArrow();
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
    console.log('✨ Creating welcome text for:', name);
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
        console.log('📝 Welcome text added to scene at position:', mesh.position);
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
                    console.log('⏸️ Welcome text visible, will fade out in 5 seconds');
                    setTimeout(() => { phase = 'out'; }, 5000);
                }
            } else if (phase === 'out') {
                opacity -= dt * 1.0;
                if (opacity <= 0) {
                    opacity = 0;
                    if (mesh.parent) mesh.parent.remove(mesh);
                    const idx = window.animatedObjects.indexOf(animObj);
                    if (idx > -1) window.animatedObjects.splice(idx, 1);
                    console.log('👋 Welcome text removed');
                }
            }
            if (mesh.material) mesh.material.opacity = opacity;
        }
    };
    window.animatedObjects.push(animObj);
    mesh.material.opacity = 0.01;
}

function createGuidanceArrow() {
    console.log('🎯 Creating guidance arrow');
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
        console.log('🎯 Arrow added to scene');
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
                    console.log('🎯 Arrow animation finished & removed');
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

    // Update the reflect icon to green
    const reflectBtn = document.getElementById('reflect-icon-btn');
    if (reflectBtn) {
        const iconSvg = reflectBtn.querySelector('#reflect-icon-svg');
        const iconLabel = reflectBtn.querySelector('#reflect-icon-label');
        if (iconSvg) iconSvg.setAttribute('stroke', '#ff2200');
        if (iconLabel) { iconLabel.textContent = t('reflected'); iconLabel.style.color = '#ff2200'; }
        reflectBtn.style.opacity = '0.8';
        reflectBtn.onclick = null;
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
                : '../assets/audio/victory.wav');
            victoryAudio.volume = 0.8;
            victoryAudio.play().catch(e => console.warn('Victory audio failed:', e));
        } catch (e) { console.warn('Victory audio error:', e); }

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
        el.style.display = 'none';
        el.style.opacity = '0';
    }
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
                border-radius: 4px;
                text-align: center;
                width: ${isSmall ? '92vw' : '90%'};
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-sizing: border-box;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 255, 255, 0.1);
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

    console.log('🔮 Reveal Secret button clicked!');
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
        console.log('📡 Posting GOTO_MEANING_OF_LIFE to parent');
        window.parent.postMessage({
            type: 'GOTO_MEANING_OF_LIFE',
            visitorName: window.visitorData ? window.visitorData.name : null,
            allAnswers: window.visitorData ? window.visitorData.answers : {}
        }, '*');
    }
};

function showFinalSummary() {
    const summaryOverlay = document.getElementById('narrative-overlay');
    const card = summaryOverlay.querySelector('.narrative-card');

    // V-FIX: Make it "Alone" on the index page (opaque background, full screen fixed)
    summaryOverlay.style.backgroundColor = '#151515';
    summaryOverlay.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://www.transparenttextures.com/patterns/black-linen.png")';
    summaryOverlay.style.backgroundBlendMode = 'normal';
    summaryOverlay.style.opacity = '1';
    summaryOverlay.style.padding = '0'; // Remove padding to prevent shift if card is large

    card.innerHTML = '';
    card.style.maxWidth = '640px';
    card.style.width = '100%';
    card.style.margin = '0 auto';
    // Remove default card look to make it feel more like a clean sheet/page
    card.style.background = 'transparent';
    card.style.border = 'none';
    card.style.boxShadow = 'none';
    card.style.textAlign = 'left'; // Reset text align specifically

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
        { id: 'bathroom', special: true, suffix: t('hero') }, // Special case
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
        // V-FIX: Reduced margin-bottom and padding for tighter list
        linesHTML += `<div class="mb-3 border-b border-gray-900 pb-2 text-md leading-snug">${line}</div>`;
    });

    const vName = window.visitorData.name || "Unknown";

    card.innerHTML = `
        <div class="text-center mb-6 mt-6 flex flex-col items-center">
            <h2 class="uppercase text-center" style="font-family:'Orelega One', cursive; line-height: 1.1; letter-spacing: -0.02em;">
                <span style="font-size: 58px; display: block; width: 100%;">${t('mol_title')}</span>
                <span style="font-size: 24px; display: block; opacity: 0.7; margin: 10px 0; font-family: 'Orelega One', cursive;">${t('mol_according')}</span>
                <span style="font-size: 82px; display: block; font-weight: 700;">${vName}</span>
            </h2>
            <!-- Art Deco Double Line -->
            <div class="flex flex-col items-center gap-1.5 opacity-30">
                <div class="w-32 h-[1px] bg-white"></div>
                <div class="w-48 h-[2px] bg-white"></div>
            </div>
        </div>

        <div class="text-left leading-relaxed max-h-[65vh] overflow-y-auto px-4 custom-scrollbar">
            ${linesHTML}
        </div>

        <div class="mt-8 mb-4 flex flex-col gap-3 text-center px-8">
            <button class="narrative-btn w-full" onclick="window.downloadNarrative()">${t('download_report')}</button>
            <button class="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest mt-2"
                onclick="document.getElementById('narrative-overlay').style.display='none'; document.getElementById('narrative-overlay').style.background = 'rgba(0,0,0,0.85)';">
                ${t('return_house')}
            </button>
        </div>
    `;

    summaryOverlay.style.display = 'flex';
}


// V-FIX: Make summary accessible at any time
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
        console.log("Transmission complete.");
    }, 2500);
};

window.downloadNarrative = function () {
    let content = `${t('report_header')}\n`;
    content += `${t('visitor')}: ${window.visitorData.name}\n`;
    content += `${t('date')}: ${new Date().toLocaleString()}\n`;
    content += `------------------------------------------\n\n`;

    for (const [room, answer] of Object.entries(window.visitorData.answers)) {
        content += `[${room.toUpperCase()}]\n${t('question')}: ${ROOM_QUESTIONS[room]}\n${t('answer')}: ${answer}\n\n`;
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
    let subject = encodeURIComponent(`House of Awe Record - ${window.visitorData.name}`);
    let body = `HOUSE OF AWE - NARRATIVE RECORD\n`;
    body += `Visitor: ${window.visitorData.name}\n`;
    body += `Date: ${new Date().toLocaleString()}\n`;
    body += `------------------------------------------\n\n`;

    // Only include answered questions
    for (const [room, answer] of Object.entries(window.visitorData.answers)) {
        if (ROOM_QUESTIONS[room]) {
            body += `[${room.toUpperCase()}]\nQ: ${ROOM_QUESTIONS[room]}\nA: ${answer}\n\n`;
        }
    }

    body = encodeURIComponent(body);

    // Using an anchor tag click is more reliable than window.location.href for mailto protocol
    const a = document.createElement('a');
    a.href = `mailto:?subject=${subject}&body=${body}`;
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
    console.log("🏳️ Experience language set to:", lang);

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
});
