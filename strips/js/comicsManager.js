// comicsManager.js
class ComicsManager {
    constructor() {
        this.cache = new Map();
        this.lastFetch = new Map();
        this.selectedComics = new Set();
        
        this.loadCategoryCounts = this.loadCategoryCounts.bind(this);
        this.getCategoryCount = this.getCategoryCount.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.toggleComicSelection = this.toggleComicSelection.bind(this);
        this.updateBuyButton = this.updateBuyButton.bind(this);
        this.showImagePopup = this.showImagePopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadCategoryCounts();
            if (CONFIG.AUTO_REFRESH.ENABLED) {
                setInterval(this.refreshData, CONFIG.AUTO_REFRESH.INTERVAL);
            }
            this.setupEventListeners();
            // Load comics if on a category page
            const category = document.body.dataset.category;
            if (category) {
                this.loadCategoryComics(category);
            }
        });
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.comic-card');
            if (item && e.target.matches('.select-checkbox input')) {
                this.toggleComicSelection(item.dataset.id);
            } else if (item && e.target.matches('.comic-image img')) {
                this.showImagePopup(e.target.src, e.target.alt);
            }
        });
        document.getElementById('popup')?.addEventListener('click', this.closePopup);
    }
    
    async loadCategoryCounts() {
        for (const [category, gid] of Object.entries(CONFIG.SHEET_GIDS)) {
            const countElementId = `count-${category}`;
            const countElement = document.getElementById(countElementId);
            if (!countElement || !gid) {
                if (countElement) countElement.textContent = '0';
                continue;
            }
            try {
                const count = await this.getCategoryCount(category, gid);
                countElement.textContent = count;
            } catch (error) {
                console.error(`Error loading ${category} count:`, error);
                countElement.textContent = '?';
            }
        }
    }
    
    async getCategoryCount(category, gid) {
        const cacheKey = `count-${category}`;
        const cached = this.getCachedData(cacheKey);
        if (cached !== null) return cached;
        
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
            const response = await fetch(csvUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const csvText = await response.text();
            const rows = this.parseCSV(csvText);
            const count = Math.max(0, rows.length - 1);
            this.setCachedData(cacheKey, count);
            return count;
        } catch (error) {
            console.error(`Error fetching ${category} count:`, error);
            return 0;
        }
    }
    
    async loadCategoryComics(category) {
        const gid = CONFIG.SHEET_GIDS[category];
        if (!gid) return;
        const grid = document.getElementById('grid');
        grid.innerHTML = '<p class="loading">Bezig met laden...</p>';
        
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
            const response = await fetch(csvUrl);
            if (!response.ok) throw new Error('Kan Google Sheet niet laden');
            const csvText = await response.text();
            const rows = this.parseCSV(csvText);
            
            if (rows.length === 0) throw new Error('Geen data gevonden');
            const header = rows[0];
            const dataRows = rows.slice(1);
            
            const colIdx = {};
            for (const key in CONFIG.COLUMNS) {
                colIdx[key] = this.findColIdx(header, CONFIG.COLUMNS[key]);
            }
            
            const serieIdx = colIdx['serie'];
            const filterValue = category === 'suske-wiske' ? '4 kleurenreeks' : null;
            const filtered = serieIdx >= 0 && filterValue
                ? dataRows.filter(row => row[serieIdx] === filterValue)
                : dataRows;
            
            let html = '<div class="comics-grid">';
            filtered.forEach((row, index) => {
                const comicId = `${category}-${index}`;
                const condition = row[colIdx.conditie]?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
                const imageUrl = row[colIdx.image] ? `${CONFIG.IMAGE_BASE_URL}${row[colIdx.image]}` : 'placeholder.jpg';
                html += `<div class="comic-card" data-id="${comicId}">
                    <div class="select-checkbox">
                        <input type="checkbox">
                    </div>
                    <div class="comic-image">
                        <img src="${imageUrl}" alt="${row[colIdx.title] || 'Comic'}" loading="lazy">
                    </div>
                    <div class="comic-details">
                        <span class="comic-number">${row[colIdx.nr] || ''}</span>
                        <div class="comic-title">${row[colIdx.title] || ''}</div>
                        <div>
                            <span>Druk: ${row[colIdx.druk] || ''}</span><br>
                            <span class="comic-condition condition-${condition}">Conditie: ${row[colIdx.conditie] || 'Onbekend'}</span><br>
                            <span class="comic-price">Prijs: ${row[colIdx.prijs] || 'N.v.t.'}</span><br>
                            <span>${row[colIdx.bijzonderheden] || ''}</span><br>
                            ${row[colIdx.link] ? `<a href="${row[colIdx.link]}" target="_blank" class="comic-link">Meer info</a>` : ''}
                        </div>
                    </div>
                </div>`;
            });
            html += '</div>';
            grid.innerHTML = html;
        } catch (err) {
            grid.innerHTML = `<p class="error-message">Fout bij laden: ${err.message}</p>`;
        }
    }
    
    parseCSV(text) {
        const rows = [];
        let row = [], field = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i], next = text[i+1];
            if (inQuotes) {
                if (c === '"' && next === '"') { field += '"'; i++; }
                else if (c === '"') inQuotes = false;
                else field += c;
            } else {
                if (c === '"') inQuotes = true;
                else if (c === ',') { row.push(field); field = ''; }
                else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
                else field += c;
            }
        }
        if (field || row.length) { row.push(field); rows.push(row); }
        return rows;
    }
    
    findColIdx(header, names) {
        for (let i = 0; i < header.length; i++) {
            if (names.some(n => header[i].toLowerCase().includes(n.toLowerCase()))) return i;
        }
        return -1;
    }
    
    getCachedData(key) {
        const now = Date.now();
        const cacheEntry = this.cache.get(key);
        const lastFetch = this.lastFetch.get(key);
        if (cacheEntry && lastFetch && (now - lastFetch < CONFIG.CACHE_DURATION)) {
            return cacheEntry;
        }
        return null;
    }
    
    setCachedData(key, value) {
        this.cache.set(key, value);
        this.lastFetch.set(key, Date.now());
    }
    
    refreshData() {
        this.cache.clear();
        this.lastFetch.clear();
        this.loadCategoryCounts();
        const category = document.body.dataset.category;
        if (category) this.loadCategoryComics(category);
    }
    
    toggleComicSelection(comicId) {
        if (this.selectedComics.has(comicId)) {
            this.selectedComics.delete(comicId);
        } else {
            this.selectedComics.add(comicId);
        }
        this.updateBuyButton();
        document.querySelectorAll('.comic-card').forEach(item => {
            item.classList.toggle('selected', this.selectedComics.has(item.dataset.id));
        });
    }
    
    updateBuyButton() {
        const buyButton = document.getElementById('buyBtn');
        const badge = document.getElementById('badge');
        const count = this.selectedComics.size;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
        buyButton.disabled = count === 0;
        buyButton.onclick = () => {
            if (count > 0) {
                alert(`Selected comics: ${Array.from(this.selectedComics).join(', ')}`);
                // Replace with actual purchase/inquiry logic
            }
        };
    }
    
    showImagePopup(src, alt) {
        const popup = document.getElementById('popup');
        const popImg = document.getElementById('popimg');
        popImg.src = src;
        popImg.alt = alt || '';
        popup.classList.add('show');
    }
    
    closePopup() {
        document.getElementById('popup').classList.remove('show');
    }
}

const comicsManager = new ComicsManager();