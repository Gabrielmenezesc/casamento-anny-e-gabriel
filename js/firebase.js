// ============================================================================
// FIREBASE.JS - Motor de Persistência (Firebase Firestore + LocalStorage)
// ============================================================================
// Prioridade: Firebase Firestore → LocalStorage (fallback seguro)
// Nunca lança exceções para o chamador. Sempre salva localmente como garantia.
// ============================================================================

let db = null;
let firebaseReady = false;

// ===== Storage Helper =====
const STORAGE_KEYS = {
  rsvps: 'wedding_rsvps',
  gifts: 'wedding_gifts',
  godparents: 'wedding_godparents',
  honeymoon: 'wedding_honeymoon',
  theme: 'wedding_theme'
};

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ===== INITIAL GIFTS DATA =====
const INITIAL_GIFTS_DATA = [
  { id: 'g1', name: 'Jogo de Panelas', price: 350, image: '🍳', category: 'Cozinha', status: 'available' },
  { id: 'g2', name: 'Jogo de Cama Queen', price: 280, image: '🛏️', category: 'Quarto', status: 'available' },
  { id: 'g3', name: 'Jogo de Toalhas', price: 150, image: '🛁', category: 'Banheiro', status: 'available' },
  { id: 'g4', name: 'Cafeteira Elétrica', price: 200, image: '☕', category: 'Cozinha', status: 'available' },
  { id: 'g5', name: 'Aspirador de Pó', price: 450, image: '🧹', category: 'Casa', status: 'available' },
  { id: 'g6', name: 'Liquidificador', price: 120, image: '🥤', category: 'Cozinha', status: 'available' },
  { id: 'g7', name: 'Air Fryer', price: 380, image: '🍟', category: 'Cozinha', status: 'available' },
  { id: 'g8', name: 'Conjunto de Taças', price: 90, image: '🥂', category: 'Cozinha', status: 'available' },
  { id: 'g9', name: 'Ferro de Passar', price: 100, image: '👔', category: 'Casa', status: 'available' },
  { id: 'g10', name: 'Microondas', price: 500, image: '📡', category: 'Cozinha', status: 'available' },
  { id: 'g11', name: 'Ventilador', price: 180, image: '🌀', category: 'Casa', status: 'available' },
  { id: 'g12', name: 'Edredom Casal', price: 200, image: '🛌', category: 'Quarto', status: 'available' }
];

// ===== Firebase Init =====
async function initFirebase() {
  try {
    const { firebaseConfig } = await import('./firebase/firebase-config.js');

    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.info('[Firebase] Sem credenciais. Usando LocalStorage.');
      return false;
    }

    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const fsModule = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    const app = initializeApp(firebaseConfig);
    db = fsModule.getFirestore(app);
    firebaseReady = true;
    window._fsLib = fsModule;

    console.info('[Firebase] ✅ Conectado com sucesso!');
    return true;
  } catch (e) {
    console.warn('[Firebase] ❌ Falha ao conectar:', e.message);
    return false;
  }
}

// ===== Helper: Firebase com timeout =====
async function firebaseWithTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Firebase timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// ===== RSVP (Confirmações de Presença) =====

async function saveRSVP(rsvpData) {
  const data = { ...rsvpData, confirmedAt: new Date().toISOString() };
  if (!data.id) data.id = generateId();

  // 1. SEMPRE salva no localStorage primeiro (garantia)
  const cached = Storage.get(STORAGE_KEYS.rsvps, []);
  Storage.set(STORAGE_KEYS.rsvps, [data, ...cached.filter(r => r.id !== data.id)]);

  // 2. Tenta salvar no Firebase (silencioso, nunca bloqueia)
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const docRef = await firebaseWithTimeout(addDoc(collection(db, 'rsvps'), data));
      data.id = docRef.id;
      // Atualiza localStorage com o ID do Firebase
      const list = Storage.get(STORAGE_KEYS.rsvps, []);
      list[0] = data;
      Storage.set(STORAGE_KEYS.rsvps, list);
    } catch (e) {
      console.warn('[Firebase] Erro ao salvar RSVP (salvo localmente):', e.message);
    }
  }

  return data;
}

async function getRSVPs() {
  // 1. Tenta Firebase
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await firebaseWithTimeout(getDocs(collection(db, 'rsvps')));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => new Date(b.confirmedAt || 0) - new Date(a.confirmedAt || 0));

      // Mescla com localStorage (itens que não foram sincronizados)
      const local = Storage.get(STORAGE_KEYS.rsvps, []);
      local.forEach(l => {
        if (!items.find(r => r.id === l.id || r.fullName === l.fullName)) {
          items.push(l);
        }
      });

      Storage.set(STORAGE_KEYS.rsvps, items);
      return items;
    } catch (e) {
      console.warn('[Firebase] Fallback getRSVPs:', e.message);
    }
  }

  // 2. Fallback: localStorage
  return Storage.get(STORAGE_KEYS.rsvps, []);
}

async function deleteRSVP(id) {
  // Remove do Firebase
  if (firebaseReady && db) {
    try {
      const { doc, deleteDoc } = window._fsLib;
      await firebaseWithTimeout(deleteDoc(doc(db, 'rsvps', id)));
    } catch (e) { console.warn('[Firebase] Erro ao deletar RSVP:', e.message); }
  }
  // Remove do localStorage
  const list = Storage.get(STORAGE_KEYS.rsvps, []).filter(r => r.id !== id);
  Storage.set(STORAGE_KEYS.rsvps, list);
  return list;
}

// ===== GIFTS (Presentes) =====

async function getGifts() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await firebaseWithTimeout(getDocs(collection(db, 'gifts')));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        Storage.set(STORAGE_KEYS.gifts, items);
        return items;
      }
    } catch (e) { console.warn('[Firebase] Fallback getGifts:', e.message); }
  }
  return Storage.get(STORAGE_KEYS.gifts, INITIAL_GIFTS_DATA);
}

async function updateGift(id, updates) {
  // Firebase
  if (firebaseReady && db) {
    try {
      const { doc, updateDoc } = window._fsLib;
      await firebaseWithTimeout(updateDoc(doc(db, 'gifts', id), updates));
    } catch (e) { console.warn('[Firebase] Erro ao atualizar presente:', e.message); }
  }
  // localStorage
  const list = Storage.get(STORAGE_KEYS.gifts, INITIAL_GIFTS_DATA).map(g =>
    g.id === id ? { ...g, ...updates } : g
  );
  Storage.set(STORAGE_KEYS.gifts, list);
  return list;
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
      const snap = await firebaseWithTimeout(getDocs(collection(db, 'gifts')));
      if (snap.empty) {
        for (const gift of defaultGifts) {
          await setDoc(doc(db, 'gifts', gift.id), gift);
        }
      }
    } catch (e) { console.warn('[Firebase] Erro ao inicializar presentes:', e.message); }
  }

  const local = Storage.get(STORAGE_KEYS.gifts);
  if (!local || !local.length) {
    Storage.set(STORAGE_KEYS.gifts, defaultGifts);
    return defaultGifts;
  }
  return local;
}

// ===== GODPARENTS (Padrinhos) =====

async function saveGodparent(data) {
  const item = { ...data, confirmedAt: new Date().toISOString() };
  if (!item.id) item.id = generateId();

  // localStorage primeiro
  const list = Storage.get(STORAGE_KEYS.godparents, []);
  Storage.set(STORAGE_KEYS.godparents, [item, ...list]);

  // Firebase
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const ref = await firebaseWithTimeout(addDoc(collection(db, 'godparents'), item));
      item.id = ref.id;
      const updated = Storage.get(STORAGE_KEYS.godparents, []);
      updated[0] = item;
      Storage.set(STORAGE_KEYS.godparents, updated);
    } catch (e) { console.warn('[Firebase] Erro ao salvar padrinho:', e.message); }
  }

  return item;
}

async function getGodparents() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await firebaseWithTimeout(getDocs(collection(db, 'godparents')));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Mescla com localStorage
      const local = Storage.get(STORAGE_KEYS.godparents, []);
      local.forEach(l => {
        if (!items.find(r => r.id === l.id)) items.push(l);
      });

      Storage.set(STORAGE_KEYS.godparents, items);
      return items;
    } catch (e) { console.warn('[Firebase] Fallback getGodparents:', e.message); }
  }
  return Storage.get(STORAGE_KEYS.godparents, []);
}

// ===== HONEYMOON =====

async function getHoneymoonSettings() {
  if (firebaseReady && db) {
    try {
      const { doc, getDoc } = window._fsLib;
      const snap = await firebaseWithTimeout(getDoc(doc(db, 'settings', 'honeymoon')));
      if (snap.exists()) {
        const data = snap.data();
        Storage.set(STORAGE_KEYS.honeymoon, data);
        return data;
      }
    } catch (e) { console.warn('[Firebase] Fallback honeymoon:', e.message); }
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
  if (firebaseReady && db) {
    try {
      const { doc, setDoc } = window._fsLib;
      await firebaseWithTimeout(setDoc(doc(db, 'settings', 'honeymoon'), settings));
    } catch (e) { console.warn('[Firebase] Erro ao salvar honeymoon:', e.message); }
  }
}

// ===== PIX =====

async function getPix() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await firebaseWithTimeout(getDocs(collection(db, 'pix')));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Mescla com localStorage
      const local = Storage.get('wedding_pix', []);
      local.forEach(l => {
        if (!items.find(r => (r.data === l.data && r.nome === l.nome) || r.id === l.id)) {
          items.push(l);
        }
      });

      Storage.set('wedding_pix', items);
      return items;
    } catch (e) { console.warn('[Firebase] Fallback getPix:', e.message); }
  }
  return Storage.get('wedding_pix', []);
}

async function savePix(nome, valor) {
  const data = { nome, valor: parseFloat(String(valor).replace(',', '.')), data: new Date().toISOString(), id: generateId() };

  // localStorage primeiro
  const local = Storage.get('wedding_pix', []);
  Storage.set('wedding_pix', [...local, data]);

  // Firebase
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const docRef = await firebaseWithTimeout(addDoc(collection(db, 'pix'), data));
      data.id = docRef.id;
    } catch (e) { console.warn('[Firebase] Erro ao salvar PIX:', e.message); }
  }
  return data;
}

async function deletePix(indexOrId) {
  if (firebaseReady && db && typeof indexOrId === 'string') {
    try {
      const { doc, deleteDoc } = window._fsLib;
      await firebaseWithTimeout(deleteDoc(doc(db, 'pix', indexOrId)));
    } catch (e) { console.warn('[Firebase] Erro ao deletar PIX:', e.message); }
  }

  let list = Storage.get('wedding_pix', []);
  if (typeof indexOrId === 'number' && indexOrId >= 0 && indexOrId < list.length) {
    list.splice(indexOrId, 1);
  } else if (typeof indexOrId === 'string') {
    list = list.filter(p => p.id !== indexOrId);
  }
  Storage.set('wedding_pix', list);
  return list;
}
