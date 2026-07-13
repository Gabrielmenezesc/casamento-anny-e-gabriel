# 💒 Laoanny & Gabriel — Site de Casamento Premium

Site de casamento completo com design premium, animações cinematográficas e gerenciamento de convidados e presentes em tempo real.

## ✨ Funcionalidades

- **Hero 3D** com efeito Ken Burns, parallax e tratamento cinematográfico Golden Hour
- **Modal PIX** com QR Code gerado automaticamente + botão copiar chave
- **Lista de Presentes** estilo Amazon com reserva em tempo real
- **Confirmação de Presença** (RSVP) com animação de sucesso
- **Contador Regressivo** até o dia 25/04/2027
- **Painel Administrativo** com dashboard, gráficos e exportação CSV
- **Tema Claro/Escuro** com transições suaves
- **Responsivo** para todos os dispositivos
- **PWA-Ready** (Offline com LocalStorage fallback)

## 📁 Estrutura

```
casamento-premium/
├── index.html          # Página inicial (Hero 3D + PIX modal)
├── convidados.html     # Formulário de confirmação de presença
├── presentes.html      # Lista de presentes (estilo Amazon)
├── padrinhos.html      # Página dos padrinhos
├── lua-de-mel.html     # Contribuição para lua de mel
├── local.html          # Localização + Google Maps
├── admin.html          # Painel administrativo protegido
├── css/
│   ├── style.css       # Design system global
│   ├── animations.css  # Ken Burns, parallax, ripple, shimmer
│   ├── home.css        # Estilos da página inicial
│   ├── presentes.css   # Estilos da lista de presentes
│   ├── convidados.css  # Estilos do RSVP
│   ├── admin.css       # Estilos do painel admin
│   └── responsive.css  # Media queries
├── js/
│   ├── utils.js        # Funções auxiliares
│   ├── firebase.js     # Integração Firebase + LocalStorage fallback
│   ├── app.js          # Core: navbar, tema, toast, ripple
│   ├── animations.js   # GSAP, parallax, 3D tilt, partículas
│   ├── countdown.js    # Contador regressivo
│   ├── pix.js          # Modal PIX com QR Code BR Code
│   ├── presentes.js    # Lista de presentes interativa
│   ├── convidados.js   # Formulário RSVP
│   └── admin.js        # Dashboard administrativo
├── assets/
│   └── images/
│       └── capa.jpg    # Foto do casal (substituir pela original!)
└── firebase/
    ├── firebase-config.js  # Configuração Firebase (editar aqui!)
    └── firestore.rules     # Regras de segurança
```

## 🚀 Como Usar

### 1. Abrir o site
Abra o arquivo `index.html` em qualquer navegador moderno. **Não precisa de servidor!**

### 2. Foto da capa
Substitua o arquivo `assets/images/capa.jpg` pela foto do casal.

### 3. Painel Admin
Acesse `admin.html` e use a senha: **`casamento2027`**

### 4. Configurar Firebase (opcional)
Para persistência em nuvem, edite `firebase/firebase-config.js` com as credenciais do seu projeto Firebase.

**Sem Firebase**: O site funciona 100% com LocalStorage (dados salvos no navegador).

## 🎨 Cores Utilizadas

- **Dourado**: `hsl(38, 72%, 55%)` — cor principal
- **Rose**: `hsl(345, 75%, 55%)` — cor secundária
- **Champagne**: `hsl(36, 55%, 85%)` — tons suaves

## 💝 Informações do Evento

| Campo      | Valor                                    |
|-----------|------------------------------------------|
| **Data**  | 25 de Abril de 2027                      |
| **Hora**  | 15:00 horas                             |
| **Local** | Espaço Villa Rose                        |
| **Endereço** | Samambaia Sul, Brasília - DF          |
| **Chave PIX** | 38991621135                          |

---

Feito com ❤ para Laoanny e Gabriel.
