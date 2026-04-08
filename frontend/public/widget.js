(function () {
  'use strict';

  var DEFAULTS = {
    api: '',
    position: 'bottom-right',
    title: 'Travel Assistant',
    subtitle: 'by Onfly',
    greeting: 'Olá! 👋 Sou o Travel Assistant da Onfly. Posso ajudar você a reservar voos e hotéis de forma rápida e simples.\n\nPara começar, me diga: **para onde você precisa viajar?**',
    primaryColor: '#0ea5e9',
    zIndex: 99999,
  };

  var script = document.currentScript;
  var config = {
    api: script.getAttribute('data-api') || DEFAULTS.api,
    position: script.getAttribute('data-position') || DEFAULTS.position,
    title: script.getAttribute('data-title') || DEFAULTS.title,
    subtitle: script.getAttribute('data-subtitle') || DEFAULTS.subtitle,
    greeting: script.getAttribute('data-greeting') || DEFAULTS.greeting,
    primaryColor: script.getAttribute('data-color') || DEFAULTS.primaryColor,
    zIndex: parseInt(script.getAttribute('data-z-index') || String(DEFAULTS.zIndex), 10),
  };

  var sessionId = localStorage.getItem('ta_widget_session');
  var messages = [];
  var isOpen = false;
  var isLoading = false;

  // Capture Onfly auth token when embedded in app.onfly.com
  function getOnflyToken() {
    try {
      // Check localStorage for JWT tokens
      var keys = Object.keys(localStorage);
      for (var i = 0; i < keys.length; i++) {
        var val = localStorage.getItem(keys[i]);
        if (val && val.startsWith('eyJ') && val.length > 100) {
          // Prefer tokens from Onfly-specific keys
          if (keys[i].includes('token') || keys[i].includes('auth') || keys[i].includes('session')) {
            return val;
          }
        }
      }
      // Fallback: any JWT in localStorage
      for (var i = 0; i < keys.length; i++) {
        var val = localStorage.getItem(keys[i]);
        if (val && val.startsWith('eyJ') && val.length > 100) return val;
      }
      // Check sessionStorage too
      keys = Object.keys(sessionStorage);
      for (var i = 0; i < keys.length; i++) {
        var val = sessionStorage.getItem(keys[i]);
        if (val && val.startsWith('eyJ') && val.length > 100) return val;
      }
    } catch (e) {}
    return null;
  }

  // ── Styles ──
  var css = `
    #ta-widget-fab {
      position: fixed;
      ${config.position.includes('right') ? 'right: 24px' : 'left: 24px'};
      ${config.position.includes('bottom') ? 'bottom: 24px' : 'top: 24px'};
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: ${config.zIndex};
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #ta-widget-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,0.25);
    }
    #ta-widget-panel {
      position: fixed;
      ${config.position.includes('right') ? 'right: 24px' : 'left: 24px'};
      ${config.position.includes('bottom') ? 'bottom: 100px' : 'top: 100px'};
      width: 400px;
      height: 560px;
      max-height: calc(100vh - 140px);
      border-radius: 16px;
      background: #f8fafc;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: ${config.zIndex};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      color: #1e293b;
    }
    #ta-widget-panel.open { display: flex; }
    @media (max-width: 480px) {
      #ta-widget-panel {
        width: calc(100vw - 16px);
        height: calc(100vh - 80px);
        max-height: none;
        right: 8px;
        left: 8px;
        bottom: 72px;
        border-radius: 12px;
      }
    }

    #ta-widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: ${config.primaryColor};
      color: #fff;
      flex-shrink: 0;
    }
    #ta-widget-header-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #ta-widget-header-title {
      font-size: 16px;
      font-weight: 700;
    }
    #ta-widget-header-badge {
      font-size: 10px;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
      padding: 2px 8px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    #ta-widget-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    #ta-widget-close:hover {
      background: rgba(255,255,255,0.15);
    }

    #ta-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ta-msg {
      display: flex;
      gap: 8px;
      max-width: 88%;
      animation: ta-fade-in 0.2s ease-out;
    }
    .ta-msg-user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .ta-msg-assistant {
      align-self: flex-start;
    }
    .ta-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(14,165,233,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .ta-msg-content {
      padding: 10px 14px;
      border-radius: 14px;
      line-height: 1.5;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .ta-msg-user .ta-msg-content {
      background: ${config.primaryColor};
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .ta-msg-assistant .ta-msg-content {
      background: #fff;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
    }

    .ta-tool-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      font-size: 12px;
      color: ${config.primaryColor};
      font-weight: 500;
      align-self: flex-start;
    }
    .ta-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(14,165,233,0.2);
      border-top: 2px solid ${config.primaryColor};
      border-radius: 50%;
      animation: ta-spin 0.8s linear infinite;
    }

    #ta-widget-input-form {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #fff;
      border-top: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    #ta-widget-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #ta-widget-input:focus {
      border-color: ${config.primaryColor};
      box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
    }
    #ta-widget-send {
      padding: 10px 16px;
      border-radius: 10px;
      border: none;
      background: ${config.primaryColor};
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    #ta-widget-send:hover:not(:disabled) { background: #0284c7; }
    #ta-widget-send:disabled { opacity: 0.5; cursor: not-allowed; }

    @keyframes ta-spin { to { transform: rotate(360deg); } }
    @keyframes ta-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Load Inter font
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // ── DOM ──
  var fab = document.createElement('button');
  fab.id = 'ta-widget-fab';
  fab.innerHTML = '✈️';
  fab.title = 'Abrir Travel Assistant';

  var panel = document.createElement('div');
  panel.id = 'ta-widget-panel';
  panel.innerHTML = `
    <div id="ta-widget-header">
      <div id="ta-widget-header-brand">
        <span style="font-size:20px">✈️</span>
        <span id="ta-widget-header-title">${config.title}</span>
        <span id="ta-widget-header-badge">${config.subtitle}</span>
      </div>
      <button id="ta-widget-close">✕</button>
    </div>
    <div id="ta-widget-messages"></div>
    <form id="ta-widget-input-form">
      <input id="ta-widget-input" type="text" placeholder="Digite sua mensagem..." autocomplete="off" />
      <button id="ta-widget-send" type="submit">➤</button>
    </form>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var messagesEl = document.getElementById('ta-widget-messages');
  var inputEl = document.getElementById('ta-widget-input');
  var formEl = document.getElementById('ta-widget-input-form');
  var sendBtn = document.getElementById('ta-widget-send');
  var closeBtn = document.getElementById('ta-widget-close');

  // ── Render ──
  function formatText(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function addMessage(role, content, id) {
    var msgId = id || 'msg-' + Date.now();
    var div = document.createElement('div');
    div.className = 'ta-msg ta-msg-' + role;
    div.id = msgId;
    div.innerHTML =
      (role === 'assistant' ? '<div class="ta-msg-avatar">🤖</div>' : '') +
      '<div class="ta-msg-content">' + formatText(content) + '</div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msgId;
  }

  function updateMessage(id, content) {
    var el = document.getElementById(id);
    if (!el) return;
    var contentEl = el.querySelector('.ta-msg-content');
    if (contentEl) contentEl.innerHTML = formatText(content);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showToolStatus(tool) {
    removeToolStatus();
    var labels = {
      search_flights: '✈️ Buscando voos...',
      search_hotels: '🏨 Buscando hotéis...',
      create_booking: '📋 Criando reserva...',
    };
    var div = document.createElement('div');
    div.className = 'ta-tool-status';
    div.id = 'ta-tool-status';
    div.innerHTML = '<div class="ta-spinner"></div>' + (labels[tool] || 'Processando...');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeToolStatus() {
    var el = document.getElementById('ta-tool-status');
    if (el) el.remove();
  }

  function setLoading(v) {
    isLoading = v;
    inputEl.disabled = v;
    sendBtn.disabled = v;
  }

  // ── API ──
  async function sendMessage(text) {
    setLoading(true);
    removeToolStatus();

    addMessage('user', text);
    var assistantId = addMessage('assistant', '');
    var fullText = '';

    try {
      var res = await fetch(config.api + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, onflyToken: getOnflyToken() }),
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (!res.body) throw new Error('No body');

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          if (!lines[i].startsWith('data: ')) continue;
          try {
            var data = JSON.parse(lines[i].slice(6));
            if (data.type === 'session' && data.sessionId) {
              sessionId = data.sessionId;
              localStorage.setItem('ta_widget_session', sessionId);
            } else if (data.type === 'text') {
              fullText += data.content || '';
              updateMessage(assistantId, fullText);
            } else if (data.type === 'tool_start') {
              showToolStatus(data.tool);
            } else if (data.type === 'tool_end') {
              removeToolStatus();
            } else if (data.type === 'error') {
              fullText = '❌ Erro: ' + data.message;
              updateMessage(assistantId, fullText);
            }
          } catch (e) { /* skip */ }
        }
      }
    } catch (err) {
      updateMessage(assistantId, '❌ Desculpe, ocorreu um erro. Tente novamente.');
    }

    setLoading(false);
    removeToolStatus();
    inputEl.focus();
  }

  // ── Events ──
  fab.addEventListener('click', function () {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.innerHTML = isOpen ? '✕' : '✈️';
    if (isOpen) {
      if (messagesEl.children.length === 0) {
        addMessage('assistant', config.greeting);
      }
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', function () {
    isOpen = false;
    panel.classList.remove('open');
    fab.innerHTML = '✈️';
  });

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = inputEl.value.trim();
    if (!text || isLoading) return;
    inputEl.value = '';
    sendMessage(text);
  });
})();
