/**
 * David Enker Comics Collection - Main JavaScript File
 * Handles Google Sheets integration and UI interactions
 */

class ComicsManager {
    constructor() {
        this.cache = new Map();
        this.lastFetch = new Map();
        this.selectedComics = new Set();
        
        // Bind methods to maintain context
        this.loadCategoryCounts = this.loadCategoryCounts.bind(this);
        this.getCategoryCount = this.getCategoryCount.bind(this);
        this.refreshData = this.refreshData.bind(this);
        
        this.init();
    }
    
    init() {
        // Load category counts on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.loadCategoryCounts();
            
            // Set up auto-refresh if enabled
            if (CONFIG.AUTO_REFRESH.ENABLED) {
                setInterval(this.refreshData, CONFIG.AUTO_REFRESH.INTERVAL);
            }
        });
    }
    
    /**
     * Load and display counts for all categories
     */
    async loadCategoryCounts() {
        for (const [category, gid] of Object.entries(CONFIG.SHEET_GIDS)) {
            const countElementId = this.getCategoryCountElementId(category);
            const countElement = document.getElementById(countElementId);
            
            if (!countElement) continue;
            
            if (gid !== null) {
                try {
                    const count = await this.getCategoryCount(category, gid);
                    countElement.textContent = count;
                } catch (error) {
                    console.error(`Error loading ${category} count:`, error);
                    countElement.textContent = '?';
                }
            } else {
                countElement.textContent = '0';
            }
        }
    }
    
    /**
     * Get count for a specific category
     */
    async getCategoryCount(category, gid) {
        // Check cache first
        const cacheKey = `count-${category}`;
        const cached = this.getCachedData(cacheKey);
        if (cached !== null) {
            return cached;
        }
        
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${gid}`;
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            const rows = this.parseCSV(csvText);
            
            // Subtract 1 for header row, ensure minimum 0
            const count = Math.max(0, rows.length - 1);
            
            // Cache the result
            this.setCachedData(cacheKey, count);
            
            return count;
        } catch (error) {
            console.error(`Error fetching ${category} count:`, error);
            return 0;
        }
    }
    
    /**
     * Load full data for a category
     */
    async loadCategoryData(category, gid) {
        // Check cache first
        const cacheKey = `data-${category}`;
        const cached = this.getCachedData(cacheKey);
        if (cached !== null) {
            return cached;
        }
        
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${gid}`;
            
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText