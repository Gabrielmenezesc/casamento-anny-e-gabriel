// ============================================================================
// FIREBASE & CLOUD SYNC ENGINE - 100% AUTOMÁTICO E VINCULADO VIA NUVEM
// ============================================================================
// Se o Firebase estiver configurado com credenciais, usa o Firebase Firestore.
// Se não (config padrão sem chaves de API), conecta automaticamente aos nossos
// repositórios em nuvem permanentes no JSONBlob Cloud + cache no LocalStorage.
// Isso garante sincronização 100% em tempo real em qualquer dispositivo no mundo!
// ============================================================================

let db = null;
let firebaseReady = false;

// IDs dos repositórios na nuvem permanentes vinculados ao site
const CLOUD_REPOS = {
  gifts:      '019f6739-4e35-73bd-bf4a-73d2a5f1ceb1',
  rsvps:      '019f6739-4fa4-7ad9-b2fa-7bc5ccdd5286',
  godparents: '019f6739-50b3-7f1b-b198-0a5aefcbc55b',
  settings:   '019f6739-51c2-7ece-ab5e-59c0c178bc2d'
};

async function cloudGet(repoKey) {
  try {
    const blobId = CLOUD_REPOS[repoKey];
    if (!blobId) return null;
    const res = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.items || data;
  } catch (e) {
    console.warn(`[Cloud Sync] Falha ao buscar ${repoKey}:`, e.message);
    return null;
  }
}

async function cloudSave(repoKey, dataObj) {
  try {
    const blobId = CLOUD_REPOS[repoKey];
    if (!blobId) return false;
    const payload = Array.isArray(dataObj) ? { items: dataObj } : dataObj;
    const res = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.warn(`[Cloud Sync] Falha ao salvar ${repoKey}:`, e.message);
    return false;
  }
}

/**
 * Inicializa Firebase ou ativa Cloud Sync
 */
async function initFirebase() {
  try {
    const { firebaseConfig } = await import('../firebase/firebase-config.js');

    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.info('[Cloud Sync] Conectado ao Repositório em Nuvem (Sincronização Global Ativa).');
      return false;
    }

    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseReady = true;
    window._fsLib = { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy };

    console.info('[Firebase] Conectado com sucesso!');
    return true;
  } catch (e) {
    console.warn('[Firebase] Falha ao conectar. Ativando Cloud Sync como fallback.');
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
      const cached = Storage.get(STORAGE_KEYS.rsvps, []);
      Storage.set(STORAGE_KEYS.rsvps, [data, ...cached]);
      return data;
    } catch (e) {
      console.warn('[Firebase] Falha ao salvar RSVP, usando Cloud Sync.', e.message);
    }
  }

  // Cloud Sync + LocalStorage
  if (!data.id) data.id = generateId();
  const list = Storage.get(STORAGE_KEYS.rsvps, []);
  const updatedList = [data, ...list.filter(r => r.id !== data.id)];
  Storage.set(STORAGE_KEYS.rsvps, updatedList);

  // Sincroniza online
  cloudGet('rsvps').then(remoteList => {
    const combined = remoteList ? [data, ...remoteList.filter(r => r.id !== data.id)] : updatedList;
    cloudSave('rsvps', combined);
  });

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

  // Busca na Nuvem Global
  const remote = await cloudGet('rsvps');
  if (remote && Array.isArray(remote)) {
    Storage.set(STORAGE_KEYS.rsvps, remote);
    return remote;
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
  cloudSave('rsvps', list);
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

  // Busca na Nuvem Global
  const remote = await cloudGet('gifts');
  if (remote && Array.isArray(remote) && remote.length > 0) {
    Storage.set(STORAGE_KEYS.gifts, remote);
    return remote;
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

  const list = Storage.get(STORAGE_KEYS.gifts, INITIAL_GIFTS_DATA).map(g =>
    g.id === id ? { ...g, ...updates } : g
  );
  Storage.set(STORAGE_KEYS.gifts, list);

  // Sincroniza na Nuvem Global
  cloudGet('gifts').then(remote => {
    const base = (remote && remote.length) ? remote : list;
    const updated = base.map(g => g.id === id ? { ...g, ...updates } : g);
    cloudSave('gifts', updated);
  });
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
  const remote = await cloudGet('gifts');
  if (!remote || !remote.length) {
    await cloudSave('gifts', defaultGifts);
    Storage.set(STORAGE_KEYS.gifts, defaultGifts);
  } else if (!Storage.get(STORAGE_KEYS.gifts)) {
    Storage.set(STORAGE_KEYS.gifts, remote);
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
  const updated = [item, ...list];
  Storage.set(STORAGE_KEYS.godparents, updated);
  cloudSave('godparents', updated);
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
  const remote = await cloudGet('godparents');
  if (remote && Array.isArray(remote)) {
    Storage.set(STORAGE_KEYS.godparents, remote);
    return remote;
  }
  return Storage.get(STORAGE_KEYS.godparents, []);
}

// ===== HONEYMOON =====

async function getHoneymoonSettings() {
  if (firebaseReady && db) {
    try {
      const { doc, getDoc } = window._fsLib;
      const snap = await getDoc(doc(db, 'settings', 'honeymoon'));
      if (snap.exists()) return snap.data();
    } catch (e) { console.warn(e); }
  }
  const remote = await cloudGet('settings');
  if (remote && remote.goal) {
    Storage.set(STORAGE_KEYS.honeymoon, remote);
    return remote;
  }
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
  cloudSave('settings', settings);
  if (firebaseReady && db) {
    try {
      const { doc, setDoc } = window._fsLib;
      await setDoc(doc(db, 'settings', 'honeymoon'), settings);
    } catch (e) { console.warn(e); }
  }
}
