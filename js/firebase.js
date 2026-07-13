// ===================================================
// FIREBASE.JS - Integração Firebase / LocalStorage fallback
// ===================================================

// Importa a config do Firebase (será carregada dinamicamente)
// Se Firebase não estiver configurado, usa LocalStorage automaticamente

let db = null;
let firebaseReady = false;

/**
 * Inicializa Firebase
 * Se não estiver configurado (ou falhar), usa LocalStorage
 */
async function initFirebase() {
  try {
    // Tenta carregar a config do firebase
    const { firebaseConfig } = await import('../firebase/firebase-config.js');

    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.info('[Firebase] Config não encontrada. Usando LocalStorage como fallback.');
      return false;
    }

    // Importa Firebase SDK via CDN (usando módulos ES)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseReady = true;

    // Expõe funções Firestore globalmente
    window._fsLib = { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy };

    console.info('[Firebase] Conectado com sucesso!');
    return true;
  } catch (e) {
    console.warn('[Firebase] Falha ao conectar. Usando LocalStorage.', e.message);
    return false;
  }
}

// ===== RSVP (Confirmações de Presença) =====

async function saveRSVP(rsvpData) {
  const data = { ...rsvpData, confirmedAt: new Date().toISOString() };
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const docRef = await addDoc(collection(db, 'rsvps'), data);
      data.id = docRef.id;
      // Também salva no LocalStorage como cache
      const cached = Storage.get(STORAGE_KEYS.rsvps, []);
      Storage.set(STORAGE_KEYS.rsvps, [data, ...cached]);
      return data;
    } catch (e) {
      console.warn('[Firebase] Falha ao salvar RSVP, usando fallback.', e.message);
    }
  }
  // Fallback: LocalStorage
  data.id = generateId();
  const list = Storage.get(STORAGE_KEYS.rsvps, []);
  Storage.set(STORAGE_KEYS.rsvps, [data, ...list]);
  return data;
}

async function getRSVPs() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs, query, orderBy } = window._fsLib;
      const q = query(collection(db, 'rsvps'), orderBy('confirmedAt', 'desc'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      Storage.set(STORAGE_KEYS.rsvps, items);
      return items;
    } catch (e) {
      console.warn('[Firebase] Fallback getRSVPs.', e.message);
    }
  }
  return Storage.get(STORAGE_KEYS.rsvps, []);
}

async function deleteRSVP(id) {
  if (firebaseReady && db) {
    try {
      const { doc, deleteDoc } = window._fsLib;
      await deleteDoc(doc(db, 'rsvps', id));
    } catch (e) { console.warn(e); }
  }
  const list = Storage.get(STORAGE_KEYS.rsvps, []).filter(r => r.id !== id);
  Storage.set(STORAGE_KEYS.rsvps, list);
}

// ===== GIFTS (Presentes) =====

async function getGifts() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await getDocs(collection(db, 'gifts'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        Storage.set(STORAGE_KEYS.gifts, items);
        return items;
      }
    } catch (e) { console.warn('[Firebase] Fallback getGifts.', e.message); }
  }
  return Storage.get(STORAGE_KEYS.gifts, INITIAL_GIFTS_DATA);
}

async function updateGift(id, updates) {
  if (firebaseReady && db) {
    try {
      const { doc, updateDoc } = window._fsLib;
      await updateDoc(doc(db, 'gifts', id), updates);
    } catch (e) { console.warn(e); }
  }
  const list = Storage.get(STORAGE_KEYS.gifts, []).map(g =>
    g.id === id ? { ...g, ...updates } : g
  );
  Storage.set(STORAGE_KEYS.gifts, list);
}

async function reserveGift(id, reservationData) {
  const updates = {
    status: 'reserved',
    reservedAt: new Date().toISOString(),
    ...reservationData
  };
  return updateGift(id, updates);
}

async function initGiftsIfEmpty(defaultGifts) {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs, setDoc, doc } = window._fsLib;
      const snap = await getDocs(collection(db, 'gifts'));
      if (snap.empty) {
        for (const gift of defaultGifts) {
          await setDoc(doc(db, 'gifts', gift.id), gift);
        }
      }
    } catch (e) { console.warn(e); }
  }
  if (!Storage.get(STORAGE_KEYS.gifts)) {
    Storage.set(STORAGE_KEYS.gifts, defaultGifts);
  }
}

// ===== GODPARENTS (Padrinhos) =====

async function saveGodparent(data) {
  const item = { ...data, confirmedAt: new Date().toISOString() };
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const ref = await addDoc(collection(db, 'godparents'), item);
      item.id = ref.id;
    } catch (e) { console.warn(e); }
  }
  if (!item.id) item.id = generateId();
  const list = Storage.get(STORAGE_KEYS.godparents, []);
  Storage.set(STORAGE_KEYS.godparents, [item, ...list]);
  return item;
}

async function getGodparents() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await getDocs(collection(db, 'godparents'));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      Storage.set(STORAGE_KEYS.godparents, items);
      return items;
    } catch (e) { console.warn(e); }
  }
  return Storage.get(STORAGE_KEYS.godparents, []);
}

// ===== HONEYMOON =====

async function getHoneymoonSettings() {
  return Storage.get(STORAGE_KEYS.honeymoon, {
    goal: 25000,
    currentAmount: 3850,
    pixKey: '38991621135',
    cardPaymentUrl: 'https://invoice.infinitepay.io/gabrielmen10/gV7OaCL60E',
    infinitePayLink: 'https://link.infinitepay.io/gabrielmen10?origin=link-na-bio'
  });
}

async function saveHoneymoonSettings(settings) {
  Storage.set(STORAGE_KEYS.honeymoon, settings);
  if (firebaseReady && db) {
    try {
      const { doc, setDoc } = window._fsLib;
      await setDoc(doc(db, 'settings', 'honeymoon'), settings);
    } catch (e) { console.warn(e); }
  }
}
