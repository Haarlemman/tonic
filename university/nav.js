(function() {
    const pages = [
        "5d.html", "artsoul.html", "atom.html", "bigbang.html", "bms.html", 
        "chaos.html", "circuit.html", "clouds.html", "cube.html", "disc.html", 
        "folio.html", "galaxy.html", "god.html", "goldenratio.html", 
        "manorbit.html", "mondrian.html", "nodefloat.html", "popmatrix.html", 
        "quantumparadoxmachine.html", "radioactive.html", "rothko.html", 
        "sleepless.html", "star.html", "studio.html", "tonic.html", 
        "triad.html", "twincity.html", "words.html"
    ];

    // Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #uni-nav-overlay {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Courier New', monospace;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
            pointer-events: none; /* Let clicks pass through empty space */
        }
        .uni-brand {
            background: #000;
            color: #fff;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #333;
            letter-spacing: 1px;
            pointer-events: auto;
            margin-bottom: 5px;
        }
        .uni-controls {
            display: flex;
            gap: 2px;
            pointer-events: auto;
            background: rgba(0,0,0,0.8);
            padding: 2px;
            border: 1px solid #333;
        }
        .uni-btn {
            background: #111;
            color: #888;
            border: none;
            padding: 5px 10px;
            font-size: 10px;
            cursor: pointer;
            font-family: inherit;
            text-transform: uppercase;
            transition: all 0.2s;
        }
        .uni-btn:hover { background: #333; color: #fff; }
        .uni-btn.active { color: #0f0; }
        
        /* Auto-play progress bar */
        #uni-progress {
            height: 2px;
            background: #0f0;
            width: 0%;
            transition: width 0.1s linear;
        }
    `;
    document.head.appendChild(style);

    // UI
    const container = document.createElement('div');
    container.id = 'uni-nav-overlay';
    
    // Brand
    const brand = document.createElement('div');
    brand.className = 'uni-brand';
    brand.innerText = 'University of Free Will';
    container.appendChild(brand);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'uni-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'uni-btn';
    prevBtn.innerText = '<';
    prevBtn.onclick = () => go(-1);
    
    const indexBtn = document.createElement('button');
    indexBtn.className = 'uni-btn';
    indexBtn.innerText = 'INDEX';
    indexBtn.onclick = () => window.location.href = 'index.html';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'uni-btn';
    nextBtn.innerText = '>';
    nextBtn.onclick = () => go(1);

    const autoBtn = document.createElement('button');
    autoBtn.className = 'uni-btn';
    autoBtn.id = 'uni-auto-btn';
    autoBtn.innerText = 'AUTO';
    autoBtn.onclick = toggleAuto;

    controls.appendChild(prevBtn);
    controls.appendChild(indexBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(autoBtn);
    
    container.appendChild(controls);
    
    const progress = document.createElement('div');
    progress.id = 'uni-progress';
    controls.appendChild(progress); // Add tiny bar to controls or separately? Let's put it under controls container logic.
    // Actually, let's put it inside controls but absolute? 
    // Simplified: Just highlight the button for now.

    document.body.appendChild(container);

    // Logic
    const currentFile = window.location.pathname.split('/').pop();
    let currentIndex = pages.indexOf(currentFile);
    let autoTimer = null;
    let autoActive = false;
    const AUTO_TIME = 8000; // 8 seconds per slide

    // Check if auto was on
    if (localStorage.getItem('uni-auto') === 'true') {
        toggleAuto(null, true);
    }

    function go(dir) {
        if (currentIndex === -1) currentIndex = 0;
        let nextIndex = (currentIndex + dir + pages.length) % pages.length;
        window.location.href = pages[nextIndex];
    }

    function toggleAuto(e, forceState) {
        if (forceState !== undefined) autoActive = forceState;
        else autoActive = !autoActive;

        const btn = document.getElementById('uni-auto-btn');
        if (autoActive) {
            btn.classList.add('active');
            localStorage.setItem('uni-auto', 'true');
            autoTimer = setTimeout(() => go(1), AUTO_TIME);
        } else {
            btn.classList.remove('active');
            localStorage.setItem('uni-auto', 'false');
            if (autoTimer) clearTimeout(autoTimer);
        }
    }
})();
