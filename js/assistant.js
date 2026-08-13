/* ============================================================
   ASSISTENTE VIRTUAL DO CASAL — assistant.js
   Mini IA com diálogos pré-programados, navegação e voz (Web Speech API)
   ============================================================ */

(function () {
  'use strict';

  // ── Configurações ──────────────────────────────────────────
  const CONFIG = {
    nome: 'Laoanny & Gabriel',
    data: '25 de Abril de 2027',
    hora: '16h30',
    local: 'Chácara Canto dos Pássaros, Samambaia Sul – Brasília/DF',
    pixKey: '(38) 99162-1135',
    pixTitular: 'Gabriel Menezes',
    whatsapp: 'https://wa.me/5538991621135',
    voiceEnabled: false,
    lang: 'pt-BR',
  };

  // ── Detectar página atual ──────────────────────────────────
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  const isPadrinhos  = pagina.includes('padrinhos');
  const isPresentes  = pagina.includes('presentes');
  const isConvidados = pagina.includes('convidados');
  const isLocal      = pagina.includes('local');
  const isLua        = pagina.includes('lua-de-mel');

  // ── Estrutura de diálogo ──────────────────────────────────
  // Cada nó tem: id, texto do assistente, opções []
  const DIALOGOS = {
    inicio: {
      msg: `Olá! 💍 Sou o assistente do casamento de ${CONFIG.nome}!\n\nComo posso te ajudar hoje?`,
      opts: [
        { icon: '📅', label: 'Quando é o casamento?', next: 'data_hora' },
        { icon: '📍', label: 'Onde vai ser?',           next: 'local' },
        { icon: '🎁', label: 'Quero presentear',         next: 'presentear' },
        { icon: '✅', label: 'Confirmar minha presença', action: () => ir('convidados.html') },
        { icon: '💛', label: 'Sou padrinho / madrinha', next: 'padrinhos' },
        { icon: '🌙', label: 'Lua de Mel',               action: () => ir('lua-de-mel.html') },
        { icon: '🔙', label: 'Voltar ao início do site', action: () => ir('index.html') },
      ]
    },

    data_hora: {
      msg: `📅 O casamento será no dia:\n\n**${CONFIG.data}** às **${CONFIG.hora}**\n\nMarque na sua agenda! Não pode faltar! 😍`,
      opts: [
        { icon: '📍', label: 'E onde vai ser?',      next: 'local' },
        { icon: '✅', label: 'Confirmar presença',   action: () => ir('convidados.html') },
        { icon: '🏠', label: 'Voltar ao menu',       next: 'inicio' },
      ]
    },

    local: {
      msg: `📍 O casamento acontecerá no:\n\n**${CONFIG.local}**\n\nHá estacionamento gratuito. Uber e 99 funcionam na região!`,
      opts: [
        { icon: '🗺️', label: 'Ver o local no mapa',  action: () => ir('local.html') },
        { icon: '✅', label: 'Confirmar presença',    action: () => ir('convidados.html') },
        { icon: '🏠', label: 'Voltar ao menu',        next: 'inicio' },
      ]
    },

    presentear: {
      msg: `🎁 Que gentileza! Você pode presentear de 3 formas:\n\n1️⃣ Escolher um item da nossa **lista de presentes**\n2️⃣ Contribuir com um valor via **PIX**\n3️⃣ Presentear diretamente na festa\n\nO que prefere?`,
      opts: [
        { icon: '🛍️', label: 'Ver a lista de presentes', action: () => ir('presentes.html') },
        { icon: '📱', label: 'Presentear com PIX',        next: 'pix_info' },
        { icon: '🏠', label: 'Voltar ao menu',            next: 'inicio' },
      ]
    },

    pix_info: {
      msg: `💳 **Dados do PIX:**\n\nChave: **${CONFIG.pixKey}**\nTitular: ${CONFIG.pixTitular}\n\nApós pagar, fale com os noivos no WhatsApp para confirmar! 💬`,
      opts: [
        { icon: '📋', label: 'Copiar chave PIX', action: copiarPix },
        { icon: '💬', label: 'Falar no WhatsApp', action: () => window.open(CONFIG.whatsapp, '_blank') },
        { icon: '🛍️', label: 'Ver lista de presentes', action: () => ir('presentes.html') },
        { icon: '🏠', label: 'Voltar ao menu',    next: 'inicio' },
      ]
    },

    padrinhos: {
      msg: `💛 Área especial para Padrinhos e Madrinhas!\n\nAqui você encontra informações exclusivas sobre o dia:`,
      opts: [
        { icon: '🎨', label: 'Ver cores e traje',         next: 'cores' },
        { icon: '⏰', label: 'Horário de chegada deles',  next: 'horario_padrinhos' },
        { icon: '💐', label: 'Detalhes da cerimônia',     next: 'cerimonia' },
        { icon: '👥', label: 'Ver página dos padrinhos',  action: () => ir('padrinhos.html') },
        { icon: '🏠', label: 'Voltar ao menu',            next: 'inicio' },
      ]
    },

    cores: {
      msg: `🎨 **Paleta de cores dos padrinhos:**\n\n• Madrinhas: Vestido **Rosê / Nude** (tom champagne)\n• Padrinhos: Terno **Cinza Chumbo** ou **Grafite** com gravata dourada\n\nEvitem preto e branco, reservados aos noivos.`,
      opts: [
        { icon: '⏰', label: 'Horário de chegada',   next: 'horario_padrinhos' },
        { icon: '👥', label: 'Ver todos os padrinhos', action: () => ir('padrinhos.html') },
        { icon: '🏠', label: 'Voltar ao menu',        next: 'inicio' },
      ]
    },

    horario_padrinhos: {
      msg: `🕒 **Horário especial para o cortejo:**\n\nOs padrinhos devem chegar ao local até **16h00** para a organização do cortejo.\n\nA cerimônia começa às **16h30**.\n\n⚠️ Pontualidade é muito importante! 🥰`,
      opts: [
        { icon: '📍', label: 'Ver endereço',    next: 'local' },
        { icon: '🎨', label: 'Ver cores',       next: 'cores' },
        { icon: '🏠', label: 'Voltar ao menu', next: 'inicio' },
      ]
    },

    cerimonia: {
      msg: `💐 **Detalhes da cerimônia:**\n\n📿 Estilo: Casamento religioso e civil\n📍 Local: ${CONFIG.local}\n🕒 Início: ${CONFIG.hora}\n\nHaverá decoração floral, músicos ao vivo e jantar/festa após a cerimônia. 🎊`,
      opts: [
        { icon: '📍', label: 'Ver o local',         next: 'local' },
        { icon: '🎁', label: 'Lista de presentes', action: () => ir('presentes.html') },
        { icon: '🏠', label: 'Voltar ao menu',      next: 'inicio' },
      ]
    },
  };

  // ── Utilitários ────────────────────────────────────────────
  function ir(href) {
    window.location.href = href;
  }

  function copiarPix() {
    navigator.clipboard.writeText(CONFIG.pixKey).then(() => {
      adicionarMensagem('✅ Chave PIX copiada! Cole no app do seu banco.', 'bot', true);
    }).catch(() => {
      adicionarMensagem(`A chave é: ${CONFIG.pixKey} — Copie e cole no seu banco.`, 'bot');
    });
  }

  // ── Web Speech API — Voz em Português ─────────────────────
  let voiceOn = false;
  let synth = window.speechSynthesis;

  function speak(text) {
    if (!voiceOn || !synth) return;
    synth.cancel();
    // Limpa markdown
    const clean = text.replace(/\*\*/g, '').replace(/\n/g, '. ');
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = CONFIG.lang;
    utt.rate = 0.9;
    utt.pitch = 1.05;
    // Tenta selecionar voz em pt-BR
    const voices = synth.getVoices();
    const pt = voices.find(v => v.lang.startsWith('pt'));
    if (pt) utt.voice = pt;
    synth.speak(utt);
  }

  // ── Construção do DOM ──────────────────────────────────────
  function criarAssistente() {
    // Estilos já carregados pelo HTML

    // Botão flutuante
    const btn = document.createElement('button');
    btn.id = 'wedding-assistant-btn';
    btn.setAttribute('data-tooltip', 'Falar com o assistente 💍');
    btn.setAttribute('aria-label', 'Abrir assistente do casamento');
    btn.innerHTML = '👫';
    btn.addEventListener('click', toggleChat);
    document.body.appendChild(btn);

    // Janela
    const win = document.createElement('div');
    win.id = 'assistant-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Assistente do Casamento');
    win.innerHTML = `
      <div class="asst-header">
        <div class="asst-header-avatar">👫</div>
        <div class="asst-header-info">
          <span class="asst-header-name">Assistente Laoanny & Gabriel</span>
          <span class="asst-header-status"><span class="asst-status-dot"></span> Online • Feliz em ajudar!</span>
        </div>
        <div class="asst-header-btns">
          <button class="asst-ctrl-btn" id="asst-voice-btn" title="Ativar/Desativar voz para idosos" aria-label="Ativar voz">🔊</button>
          <button class="asst-ctrl-btn" id="asst-home-btn"  title="Voltar ao menu principal"          aria-label="Menu principal">🏠</button>
          <button class="asst-ctrl-btn" id="asst-close-btn" title="Fechar"                            aria-label="Fechar assistente">✕</button>
        </div>
      </div>
      <div class="asst-messages" id="asst-messages"></div>
      <div class="asst-footer">
        <input class="asst-input" id="asst-input" placeholder="Digite sua dúvida..." aria-label="Mensagem" />
        <button class="asst-send-btn" id="asst-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    // Eventos internos
    document.getElementById('asst-close-btn').addEventListener('click', fecharChat);
    document.getElementById('asst-home-btn').addEventListener('click', () => mostrarDialogo('inicio'));
    document.getElementById('asst-voice-btn').addEventListener('click', toggleVoz);

    // Input livre
    const input = document.getElementById('asst-input');
    document.getElementById('asst-send').addEventListener('click', () => processarInput(input.value));
    input.addEventListener('keypress', e => { if (e.key === 'Enter') processarInput(input.value); });

    // Abre automaticamente no contexto da página
    setTimeout(() => {
      mostrarDialogoPaginaAtual();
    }, 100);
  }

  // ── Toggle chat ────────────────────────────────────────────
  let chatAberto = false;
  let iniciadoUmaVez = false;

  function toggleChat() {
    chatAberto = !chatAberto;
    const win = document.getElementById('assistant-window');
    win.classList.toggle('open', chatAberto);
    if (chatAberto && !iniciadoUmaVez) {
      iniciadoUmaVez = true;
      setTimeout(() => mostrarDialogoPaginaAtual(), 300);
    }
  }
  function fecharChat() {
    chatAberto = false;
    document.getElementById('assistant-window').classList.remove('open');
  }

  // ── Voz ───────────────────────────────────────────────────
  function toggleVoz() {
    voiceOn = !voiceOn;
    const btn = document.getElementById('asst-voice-btn');
    btn.classList.toggle('active', voiceOn);
    btn.title = voiceOn ? 'Desativar voz' : 'Ativar voz (para idosos)';
    const msg = voiceOn
      ? '🔊 Voz ativada! Agora vou ler as mensagens em voz alta para facilitar.'
      : '🔇 Voz desativada.';
    adicionarMensagem(msg, 'bot', true);
    if (voiceOn) speak(msg);
  }

  // ── Diálogos ──────────────────────────────────────────────
  function mostrarDialogoPaginaAtual() {
    // Saudação contextual por página
    if (isPadrinhos)  return mostrarDialogo('padrinhos');
    if (isPresentes)  return mostrarDialogo('presentear');
    if (isConvidados) {
      adicionarMensagem('✅ Você está na página de confirmação de presença! Preencha o formulário acima para confirmar.', 'bot', true);
      mostrarOpcoes([
        { icon: '🎁', label: 'Ver lista de presentes', action: () => ir('presentes.html') },
        { icon: '🏠', label: 'Ir para o início',       action: () => ir('index.html') },
        { icon: '💬', label: 'Falar no WhatsApp',       action: () => window.open(CONFIG.whatsapp, '_blank') },
      ]);
      return;
    }
    if (isLocal)  {
      adicionarMensagem('📍 Você está na página do local! Use os botões de mapas acima para se guiar. Precisa de mais informações?', 'bot', true);
      mostrarOpcoes([
        { icon: '✅', label: 'Confirmar presença',    action: () => ir('convidados.html') },
        { icon: '🎁', label: 'Lista de presentes',  action: () => ir('presentes.html') },
        { icon: '🏠', label: 'Menu principal',       next: 'inicio' },
      ]);
      return;
    }
    mostrarDialogo('inicio');
  }

  function mostrarDialogo(id) {
    const d = DIALOGOS[id];
    if (!d) return;
    limparOpcoes();
    // Animação de digitando
    mostrarDigitando().then(() => {
      adicionarMensagem(formatarTexto(d.msg), 'bot', true);
      speak(d.msg);
      if (d.opts && d.opts.length) {
        setTimeout(() => mostrarOpcoes(d.opts), 250);
      }
    });
  }

  function mostrarDigitando() {
    return new Promise(resolve => {
      const msgs = document.getElementById('asst-messages');
      const typing = document.createElement('div');
      typing.className = 'asst-typing';
      typing.id = 'asst-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(typing);
      scrollBottom();
      setTimeout(() => {
        typing.remove();
        resolve();
      }, 700);
    });
  }

  function adicionarMensagem(texto, lado = 'bot', highlight = false) {
    const msgs = document.getElementById('asst-messages');
    const el = document.createElement('div');
    el.className = `asst-msg ${lado}${highlight ? ' highlight' : ''}`;
    el.innerHTML = texto;
    msgs.appendChild(el);
    scrollBottom();
  }

  function mostrarOpcoes(opts) {
    const msgs = document.getElementById('asst-messages');
    const wrap = document.createElement('div');
    wrap.className = 'asst-options';
    wrap.id = 'asst-opts';
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'asst-opt-btn';
      btn.innerHTML = `<span class="asst-opt-icon">${opt.icon}</span> ${opt.label}`;
      btn.addEventListener('click', () => {
        limparOpcoes();
        adicionarMensagem(`${opt.icon} <em>${opt.label}</em>`, 'bot');
        if (opt.action)  opt.action();
        if (opt.next)    mostrarDialogo(opt.next);
      });
      wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    scrollBottom();
  }

  function limparOpcoes() {
    document.querySelectorAll('#asst-opts').forEach(el => el.remove());
  }

  // ── Input livre com resposta simples ──────────────────────
  const KEYWORDS = {
    'present': 'presentear',
    'gift':    'presentear',
    'pix':     'pix_info',
    'data':    'data_hora',
    'quando':  'data_hora',
    'hora':    'data_hora',
    'local':   'local',
    'onde':    'local',
    'enderec': 'local',
    'padrinho':'padrinhos',
    'madrinha':'padrinhos',
    'cor':     'cores',
    'traje':   'cores',
    'cerimoni':'cerimonia',
    'lua':     () => ir('lua-de-mel.html'),
    'confirm': () => ir('convidados.html'),
  };

  function processarInput(texto) {
    if (!texto.trim()) return;
    document.getElementById('asst-input').value = '';
    adicionarMensagem(`💬 "${texto}"`, 'bot');
    limparOpcoes();

    const t = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    for (const [kw, resp] of Object.entries(KEYWORDS)) {
      if (t.includes(kw)) {
        if (typeof resp === 'function') return resp();
        return mostrarDialogo(resp);
      }
    }
    // Fallback
    mostrarDigitando().then(() => {
      adicionarMensagem('Hmm, não entendi bem. 😊 Escolha uma das opções abaixo que eu te ajudo!', 'bot');
      mostrarOpcoes(DIALOGOS.inicio.opts);
    });
  }

  // ── Helpers ────────────────────────────────────────────────
  function formatarTexto(txt) {
    return txt
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function scrollBottom() {
    const msgs = document.getElementById('asst-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  // ── Init ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', criarAssistente);
  } else {
    criarAssistente();
  }

})();
