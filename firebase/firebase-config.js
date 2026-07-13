// ===================================================
// firebase-config.js
// Atualize este arquivo com as credenciais do seu projeto Firebase
// Para criar um projeto: https://console.firebase.google.com
// ===================================================

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// INSTRUÇÕES:
// 1. Acesse https://console.firebase.google.com
// 2. Crie um novo projeto chamado "casamento-laoanny-gabriel"
// 3. Adicione um app Web ao projeto
// 4. Copie as credenciais e substitua acima
// 5. Crie as coleções: rsvps, gifts, godparents, settings
// 6. Publique as regras do firestore (arquivo firestore.rules)
//
// ENQUANTO NÃO CONFIGURAR O FIREBASE:
// O site funcionará normalmente usando LocalStorage do navegador.
// Todos os dados serão salvos localmente no dispositivo do usuário.
