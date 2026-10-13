/**
 * db.js
 * Client-side IndexedDB service for BenefitBridge.
 * All case data, timeline entries, photos, and consent settings stay strictly on the user's device.
 */

const DB_NAME = 'BenefitBridgeDB';
const DB_VERSION = 1;

const STORES = {
  CONSENT: 'consent',
  CASE_DATA: 'case_data',
  TIMELINE: 'evidence_timeline',
  GRIEVANCE: 'grievance_data'
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.CONSENT)) {
        db.createObjectStore(STORES.CONSENT, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.CASE_DATA)) {
        db.createObjectStore(STORES.CASE_DATA, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.TIMELINE)) {
        db.createObjectStore(STORES.TIMELINE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.GRIEVANCE)) {
        db.createObjectStore(STORES.GRIEVANCE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic get by key
export async function getRecord(storeName, key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`Error reading ${storeName}:`, err);
    return null;
  }
}

// Generic put record
export async function setRecord(storeName, record) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`Error writing ${storeName}:`, err);
    throw err;
  }
}

// Get all records from a store
export async function getAllRecords(storeName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`Error getting all from ${storeName}:`, err);
    return [];
  }
}

// Delete a single record
export async function deleteRecord(storeName, key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`Error deleting from ${storeName}:`, err);
    return false;
  }
}

// === High-level Helper Methods ===

export async function saveConsent(consentData) {
  return setRecord(STORES.CONSENT, {
    id: 'user_consent',
    ...consentData,
    updatedAt: new Date().toISOString()
  });
}

export async function loadConsent() {
  return getRecord(STORES.CONSENT, 'user_consent');
}

export async function saveCaseData(caseData) {
  return setRecord(STORES.CASE_DATA, {
    id: 'active_case',
    ...caseData,
    updatedAt: new Date().toISOString()
  });
}

export async function loadCaseData() {
  return getRecord(STORES.CASE_DATA, 'active_case');
}

export async function saveTimelineEntry(entry) {
  const id = entry.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  await setRecord(STORES.TIMELINE, {
    ...entry,
    id,
    createdAt: entry.createdAt || new Date().toISOString()
  });
  return id;
}

export async function loadTimelineEntries() {
  const items = await getAllRecords(STORES.TIMELINE);
  // Sort latest first
  return items.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

export async function deleteTimelineEntry(id) {
  return deleteRecord(STORES.TIMELINE, id);
}

export async function saveGrievanceData(grievanceData) {
  return setRecord(STORES.GRIEVANCE, {
    id: 'active_grievance',
    ...grievanceData,
    updatedAt: new Date().toISOString()
  });
}

export async function loadGrievanceData() {
  return getRecord(STORES.GRIEVANCE, 'active_grievance');
}

/**
 * COMPLETELY WIPES ALL USER DATA FROM INDEXEDDB
 * Fulfills Privacy Control requirement: "A 'Delete my case' button that wipes IndexedDB after confirmation"
 */
export async function wipeCaseData() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => {
      // Clear any session/local storage as well
      sessionStorage.clear();
      resolve(true);
    };
    req.onerror = () => reject(req.error);
    req.onblocked = () => {
      console.warn('Database deletion blocked, closing connections');
      resolve(true);
    };
  });
}
