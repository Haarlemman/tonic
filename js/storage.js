// ============================================================
//  HOUSE OF AWE — Storage & Memory Layer  (storage.js)
// ============================================================
//
//  LOCAL PERSISTENCE  — localStorage for offline progress
//  CLOUD PERSISTENCE  — Firebase Firestore for the Visitor Gallery
// ============================================================

const PROGRESS_STORAGE_KEY = 'userQuizProgress';
const MEMORY_STORAGE_KEY = 'houseOfAweMemory';

// ---- LOCAL: Save / Load / Clear Progress ----

/**
 * Saves the current user progress to localStorage.
 * @param {object} progressData - visitorData object (name, answers, visitedRooms)
 */
function saveUserProgress(progressData) {
    try {
        const serializedData = JSON.stringify(progressData);
        localStorage.setItem(PROGRESS_STORAGE_KEY, serializedData);
        // Also update the memory record
        updateMemory(progressData);
    } catch (error) {
        console.error('Error saving progress to localStorage:', error);
    }
}

/**
 * Loads user progress from localStorage.
 * @returns {object|null}
 */
function loadUserProgress() {
    try {
        const serializedData = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (serializedData === null) {
            console.log('No user progress found in localStorage.');
            return null;
        }
        const progressData = JSON.parse(serializedData);
        console.log('User progress loaded successfully from localStorage.');
        return progressData;
    } catch (error) {
        console.error('Error loading progress from localStorage:', error);
        return null;
    }
}

/**
 * Clears user progress from localStorage.
 */
function clearUserProgress() {
    try {
        localStorage.removeItem(PROGRESS_STORAGE_KEY);
        console.log('User progress cleared from localStorage.');
    } catch (error) {
        console.error('Error clearing progress from localStorage:', error);
    }
}


// ============================================================
//  RICH MEMORY SYSTEM
// ============================================================
//  Tracks:  visitCount, firstVisit, lastVisit, totalTimeSpent,
//           journeyOrder (order rooms were visited),
//           previousAnswers (snapshots of past completions)
// ============================================================

function getMemory() {
    try {
        const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('Memory read error:', e); }
    return null;
}

function saveMemory(mem) {
    try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(mem));
    } catch (e) { console.warn('Memory write error:', e); }
}

function initMemory() {
    let mem = getMemory();
    const now = new Date().toISOString();

    if (!mem) {
        mem = {
            visitCount: 1,
            firstVisit: now,
            lastVisit: now,
            sessionStart: now,
            totalTimeSpent: 0,          // seconds
            journeyOrder: [],           // room keys in order of first visit
            previousCompletions: [],    // array of { date, name, answers }
            gallerySubmitted: false     // true once uploaded to Firestore
        };
    } else {
        mem.prevLastVisit = mem.lastVisit;
        mem.visitCount = (mem.visitCount || 0) + 1;
        mem.lastVisit = now;
        mem.sessionStart = now;
    }

    saveMemory(mem);
    return mem;
}

/**
 * Called whenever progress is saved — keeps memory in sync
 */
function updateMemory(progressData) {
    let mem = getMemory();
    if (!mem) mem = initMemory();

    // Track journey order
    if (progressData.visitedRooms && progressData.visitedRooms.length > 0) {
        const current = mem.journeyOrder || [];
        progressData.visitedRooms.forEach(room => {
            if (!current.includes(room)) current.push(room);
        });
        mem.journeyOrder = current;
    }

    // Track elapsed time this session
    if (mem.sessionStart) {
        const elapsed = (Date.now() - new Date(mem.sessionStart).getTime()) / 1000;
        mem.totalTimeSpent = (mem.totalTimeSpent || 0) + elapsed;
        mem.sessionStart = new Date().toISOString(); // reset for next delta
    }

    saveMemory(mem);
}

/**
 * Snapshot current answers as a "completion" — called when all 10 rooms done
 */
function recordCompletion(visitorData) {
    let mem = getMemory();
    if (!mem) mem = initMemory();

    if (!mem.previousCompletions) mem.previousCompletions = [];

    mem.previousCompletions.push({
        date: new Date().toISOString(),
        name: visitorData.name || 'Unknown',
        answers: { ...(visitorData.answers || {}) }
    });

    saveMemory(mem);
}


// ============================================================
//  VISITOR GALLERY — Firebase Firestore
// ============================================================
//  Anonymous submissions: first name + answers (no auth needed).
//  Firestore rules should allow writes to 'gallery' collection
//  but restrict reads to the last ~50 entries.
// ============================================================

let _firestoreDB = null;

function getFirestore() {
    if (_firestoreDB) return _firestoreDB;
    // firebase is loaded via CDN compat scripts
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        _firestoreDB = firebase.firestore();
        return _firestoreDB;
    }
    return null;
}

/**
 * Submit the visitor's completed record to the community gallery.
 * Only submits once per completion (tracked in memory).
 */
async function submitToGallery(visitorData) {
    const db = getFirestore();
    if (!db) {
        console.warn('Firestore not available — gallery submission skipped.');
        return false;
    }

    // Build a sanitized record
    const answers = visitorData.answers || {};
    const name = (visitorData.name || 'Anonymous').substring(0, 30);

    // Extract short excerpts (first 120 chars) for privacy
    const excerpts = {};
    const roomOrder = ['hall', 'living', 'annex', 'studio', 'basement',
        'toilet', 'bedroom', 'bathroom', 'attic', 'space'];
    roomOrder.forEach(room => {
        if (answers[room]) {
            excerpts[room] = answers[room].substring(0, 120);
        }
    });

    const record = {
        name: name,
        answers: excerpts,
        roomCount: Object.keys(excerpts).length,
        language: window.currentLanguage || 'en',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        // Simple fingerprint to avoid exact duplicates (no personal data)
        fingerprint: btoa(name + Object.values(excerpts).join('')).substring(0, 32)
    };

    try {
        const docRef = await db.collection('gallery').add(record);
        console.log('✅ Gallery submission successful, ID:', docRef.id);

        // Mark as submitted in memory
        let mem = getMemory();
        if (mem) {
            mem.gallerySubmitted = true;
            mem.galleryDocId = docRef.id;
            saveMemory(mem);
        }

        return docRef.id || true;
    } catch (err) {
        console.error('Gallery submission failed:', err);
        return false;
    }
}

/**
 * Remove a previously submitted record from the gallery.
 */
async function removeFromGallery(docId) {
    if (!docId) return false;
    const db = getFirestore();
    if (!db) return false;

    try {
        await db.collection('gallery').doc(docId).delete();
        console.log('🗑️ Gallery record removed:', docId);

        // Update memory
        let mem = getMemory();
        if (mem) {
            mem.gallerySubmitted = false;
            delete mem.galleryDocId;
            saveMemory(mem);
        }
        return true;
    } catch (err) {
        console.error('Gallery removal failed:', err);
        return false;
    }
}

/**
 * Fetch recent gallery entries (newest first, max 30).
 * Returns an array of { name, answers, timestamp }
 */
async function fetchGalleryEntries(limit) {
    limit = limit || 30;
    const db = getFirestore();
    if (!db) {
        console.warn('Firestore not available — cannot fetch gallery.');
        return [];
    }

    try {
        const snapshot = await db.collection('gallery')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();

        const entries = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            entries.push({
                name: data.name || 'Anonymous',
                answers: data.answers || {},
                roomCount: data.roomCount || 0,
                language: data.language || 'en',
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
            });
        });

        console.log(`📋 Fetched ${entries.length} gallery entries.`);
        return entries;
    } catch (err) {
        console.error('Gallery fetch failed:', err);
        return [];
    }
}

/**
 * Get the total count of gallery submissions.
 */
async function getGalleryCount() {
    const db = getFirestore();
    if (!db) return 0;

    try {
        // Firestore doesn't have a direct count API in the compat SDK,
        // so we use a lightweight query
        const snapshot = await db.collection('gallery')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) return 0;

        // For a rough count, we'll use the gallery_meta document if it exists
        try {
            const metaDoc = await db.collection('meta').doc('gallery_stats').get();
            if (metaDoc.exists) return metaDoc.data().totalCount || 0;
        } catch (e) { /* meta doc not available, that's fine */ }

        // Fallback: fetch up to 100 and count
        const countSnap = await db.collection('gallery').limit(100).get();
        return countSnap.size;
    } catch (err) {
        console.warn('Gallery count error:', err);
        return 0;
    }
}

// Expose functions globally
window.saveUserProgress = saveUserProgress;
window.loadUserProgress = loadUserProgress;
window.clearUserProgress = clearUserProgress;
window.getMemory = getMemory;
window.saveMemory = saveMemory;
window.initMemory = initMemory;
window.recordCompletion = recordCompletion;
window.submitToGallery = submitToGallery;
window.fetchGalleryEntries = fetchGalleryEntries;
window.removeFromGallery = removeFromGallery;
window.getGalleryCount = getGalleryCount;
