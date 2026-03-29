/* ====================================================
   Dasyl Website — script.js
   ==================================================== */

// ── Copy-to-clipboard ─────────────────────────────────
const toast = document.getElementById('copy-toast');
let toastTimer;

function showToast(message = 'Copied!') {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;

  const text = btn.dataset.copy;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    showToast('Copied!');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Copied!');
  });
});

// ── Tab switching ─────────────────────────────────────
document.querySelectorAll('.tabs').forEach((tabGroup) => {
  tabGroup.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;

    const targetId = tab.dataset.tab;
    const parent = tabGroup.closest('.step__content') || document.body;

    // Deactivate all tabs & panels in this group
    tabGroup.querySelectorAll('.tab').forEach((t) => {
      t.classList.remove('tab--active');
      t.setAttribute('aria-selected', 'false');
    });

    parent.querySelectorAll('.tab-content').forEach((panel) => {
      panel.classList.remove('tab-content--active');
    });

    // Activate selected tab & panel
    tab.classList.add('tab--active');
    tab.setAttribute('aria-selected', 'true');

    const panel = parent.querySelector(`#tab-${targetId}`);
    if (panel) panel.classList.add('tab-content--active');
  });
});

// ── Mobile navigation ─────────────────────────────────
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a nav link is clicked
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Suggestion form → GitHub Issue URL ───────────────
const form = document.getElementById('suggestion-form');

function validateForm() {
  let valid = true;

  const typeSelect = document.getElementById('sg-type');
  const typeError = document.getElementById('sg-type-error');

  if (!typeSelect.value) {
    typeSelect.classList.add('invalid');
    typeError.textContent = 'Please select a category.';
    valid = false;
  } else {
    typeSelect.classList.remove('invalid');
    typeError.textContent = '';
  }

  const messageArea = document.getElementById('sg-message');
  const messageError = document.getElementById('sg-message-error');

  if (!messageArea.value.trim() || messageArea.value.trim().length < 10) {
    messageArea.classList.add('invalid');
    messageError.textContent = 'Please enter at least 10 characters.';
    valid = false;
  } else {
    messageArea.classList.remove('invalid');
    messageError.textContent = '';
  }

  return valid;
}

// Live validation feedback
['sg-type', 'sg-message'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) {
        // Re-validate just this field on change
        el.classList.remove('invalid');
        const errEl = document.getElementById(`${id}-error`);
        if (errEl) errEl.textContent = '';
      }
    });
  }
});

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const name    = (document.getElementById('sg-name').value.trim() || 'Anonymous');
    const type    = document.getElementById('sg-type').value;
    const message = document.getElementById('sg-message').value.trim();

    const labelMap = {
      'new-project-type': 'enhancement',
      'new-feature':      'enhancement',
      'improvement':      'enhancement',
      'bug':              'bug',
      'other':            'question',
    };

    const typeLabels = {
      'new-project-type': 'New project type',
      'new-feature':      'New feature',
      'improvement':      'Improvement',
      'bug':              'Bug report',
      'other':            'Other',
    };

    const issueTitle = `[${typeLabels[type] || type}] Suggestion from website`;
    const issueBody  = [
      `**Category:** ${typeLabels[type] || type}`,
      `**Submitted by:** ${name}`,
      '',
      '---',
      '',
      message,
      '',
      '---',
      '*Submitted via the Dasyl website suggestion box.*',
    ].join('\n');

    const label = labelMap[type] || 'enhancement';

    const url = new URL('https://github.com/SeniorCub/dasyl/issues/new');
    url.searchParams.set('title', issueTitle);
    url.searchParams.set('body', issueBody);
    url.searchParams.set('labels', label);

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  });
}

// ── Subtle scroll-reveal animation ───────────────────
const observerConfig = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerConfig);

// Only animate if the user hasn't requested reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll(
    '.feature-card, .step, .project-card, .suggestion-form, .suggestion-alt'
  ).forEach((el) => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ── Interactive hero terminal ─────────────────────────
(function initInteractiveTerminal() {
  const body        = document.getElementById('terminal-body');
  const hiddenInput = document.getElementById('terminal-hidden-input');
  const terminalEl  = document.getElementById('hero-terminal');

  if (!body || !hiddenInput || !terminalEl) return;

  /* ── State ──────────────────────────────────────────── */
  let cmdHistory   = [];
  let historyIdx   = -1;
  let isProcessing = false;
  // Keep in sync with the version in package.json
  const DASYL_VERSION   = '1.6.4';
  const SPINNER_TICK_MS = 80;
  const SPINNER_DURATION = { create: 1400, install: 2200, git: 700 };

  /* ── Focus management ──────────────────────────────── */
  terminalEl.addEventListener('click', () => hiddenInput.focus());
  terminalEl.addEventListener('focus', () => hiddenInput.focus());

  hiddenInput.addEventListener('focus', () => terminalEl.classList.add('terminal--focused'));
  hiddenInput.addEventListener('blur',  () => terminalEl.classList.remove('terminal--focused'));

  /* ── Input display sync ────────────────────────────── */
  hiddenInput.addEventListener('input', syncInputDisplay);

  function syncInputDisplay() {
    const inputLine = getInputLine();
    if (!inputLine) return;
    const span = inputLine.querySelector('.t-input-text');
    if (span) span.textContent = hiddenInput.value;
    scrollToBottom();
  }

  /* ── Keyboard handling ─────────────────────────────── */
  hiddenInput.addEventListener('keydown', (e) => {
    if (isProcessing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      submitCommand(hiddenInput.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        hiddenInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
        syncInputDisplay();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        hiddenInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
      } else {
        historyIdx = -1;
        hiddenInput.value = '';
      }
      syncInputDisplay();
    }
  });

  /* ── DOM helpers ───────────────────────────────────── */
  function getInputLine() {
    return body.querySelector('.terminal__input-line');
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  /**
   * Insert an output line before the input line.
   */
  function addOutputLine(html, extraClass) {
    const line = document.createElement('div');
    line.className = 'terminal__line terminal__line--output' +
                     (extraClass ? ' ' + extraClass : '');
    line.innerHTML = html;
    body.insertBefore(line, getInputLine());
    scrollToBottom();
    return line;
  }

  /**
   * Freeze the current input line as a plain command echo,
   * then append a fresh input line at the bottom.
   */
  function commitInputLine(cmd) {
    const old = getInputLine();
    old.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${escHtml(cmd)}</span>`;
    old.classList.remove('terminal__input-line');

    const next = document.createElement('div');
    next.className = 'terminal__line terminal__input-line';
    next.innerHTML  = `<span class="t-prompt">$</span> ` +
                      `<span class="t-input-text"></span>` +
                      `<span class="t-cursor">▋</span>`;
    body.appendChild(next);
    scrollToBottom();
  }

  /* ── Spinner animation ─────────────────────────────── */
  const FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a spinner line and animate it, then finalise with a checkmark.
   */
  function createSpinnerLine(textHtml) {
    const line = document.createElement('div');
    line.className = 'terminal__line terminal__line--output';
    line.innerHTML  = `<span class="t-spinner-anim" aria-hidden="true">⠋</span>` +
                      `<span class="t-line-text">${textHtml}</span>`;
    body.insertBefore(line, getInputLine());
    scrollToBottom();
    return line;
  }

  async function animateSpinner(lineEl, finalTextHtml, durationMs) {
    const ticks = Math.max(2, Math.floor(durationMs / SPINNER_TICK_MS));
    const icon  = lineEl.querySelector('.t-spinner-anim');
    const text  = lineEl.querySelector('.t-line-text');

    for (let i = 0; i < ticks; i++) {
      if (icon) icon.textContent = FRAMES[i % FRAMES.length];
      await wait(SPINNER_TICK_MS);
    }

    if (icon) { icon.textContent = '✔'; icon.className = 't-spinner'; }
    if (text) text.innerHTML = finalTextHtml;
    scrollToBottom();
  }

  /* ── Command execution ─────────────────────────────── */
  async function submitCommand(raw) {
    const cmd = raw.trim();
    hiddenInput.value = '';
    syncInputDisplay();
    commitInputLine(cmd);

    if (!cmd) return;

    if (cmd === 'clear') {
      clearTerminal();
      return;
    }

    cmdHistory.push(cmd);
    historyIdx = -1;

    const parts = cmd.split(/\s+/);
    const base  = parts[0];

    if (base !== 'dasyl') {
      addOutputLine(
        `<span class="t-error">command not found: <strong>${escHtml(base)}</strong>` +
        ` — try <span class="t-hl">dasyl --help</span></span>`
      );
      return;
    }

    isProcessing = true;
    const sub  = parts[1];
    const name = parts[2] || null;

    try {
      if (!sub || sub === '--help' || sub === '-h') {
        showHelp();
      } else if (sub === '--version' || sub === '-v') {
        showVersion();
      } else if (['react','vue','svelte','node','node-ts','laravel'].includes(sub)) {
        await simulateCreate(sub, name);
      } else {
        addOutputLine(
          `<span class="t-error">Unknown option: <strong>${escHtml(sub)}</strong>` +
          ` — run <span class="t-hl">dasyl --help</span> for usage.</span>`
        );
      }
    } finally {
      isProcessing = false;
      scrollToBottom();
      hiddenInput.focus();
    }
  }

  function clearTerminal() {
    const inputLine = getInputLine();
    Array.from(body.children).forEach(child => {
      if (child !== inputLine) child.remove();
    });
  }

  /* ── Command: --help ───────────────────────────────── */
  function showHelp() {
    const rows = [
      `<span class="t-hl">dasyl</span> <span class="t-dim">v${DASYL_VERSION} — Create and release development projects faster.</span>`,
      `&nbsp;`,
      `<span class="t-cmd-label">Usage:</span>`,
      `  <span class="t-cmd">dasyl</span> <span class="t-dim">[type] [project-name]</span>`,
      `&nbsp;`,
      `<span class="t-cmd-label">Quick shortcuts:</span>`,
      `  <span class="t-cmd">dasyl react &lt;name&gt;</span>    <span class="t-dim">React app via Vite</span>`,
      `  <span class="t-cmd">dasyl vue &lt;name&gt;</span>      <span class="t-dim">Vue app via Vite</span>`,
      `  <span class="t-cmd">dasyl svelte &lt;name&gt;</span>   <span class="t-dim">Svelte app via Vite</span>`,
      `  <span class="t-cmd">dasyl node &lt;name&gt;</span>     <span class="t-dim">Node.js Express API (JS)</span>`,
      `  <span class="t-cmd">dasyl node-ts &lt;name&gt;</span>  <span class="t-dim">Node.js Express API (TS)</span>`,
      `  <span class="t-cmd">dasyl laravel &lt;name&gt;</span>  <span class="t-dim">Laravel PHP project</span>`,
      `&nbsp;`,
      `<span class="t-cmd-label">Flags:</span>`,
      `  <span class="t-cmd">--help</span>     <span class="t-dim">Show this help message</span>`,
      `  <span class="t-cmd">--version</span>  <span class="t-dim">Show version number</span>`,
      `&nbsp;`,
      `<span class="t-cmd-label">Terminal:</span>`,
      `  <span class="t-cmd">clear</span>      <span class="t-dim">Clear the terminal output</span>`,
    ];
    rows.forEach(html => {
      const line = document.createElement('div');
      line.className = 'terminal__line terminal__line--output';
      line.innerHTML  = html;
      body.insertBefore(line, getInputLine());
    });
    scrollToBottom();
  }

  /* ── Command: --version ────────────────────────────── */
  function showVersion() {
    addOutputLine(`<span class="t-hl">dasyl</span> <span class="t-spinner">v${DASYL_VERSION}</span>`);
    addOutputLine(
      `<span class="t-dim">Created by Farinde Reuben Ifeoluwa ` +
      `(<a href="https://github.com/SeniorCub" target="_blank" rel="noopener noreferrer" class="t-hl">github.com/SeniorCub</a>)</span>`
    );
  }

  /* ── Command: scaffold ─────────────────────────────── */
  const TYPE_LABELS = {
    react:     'React',
    vue:       'Vue',
    svelte:    'Svelte',
    node:      'Node.js Express API',
    'node-ts': 'Node.js Express API (TypeScript)',
    laravel:   'Laravel',
  };

  async function simulateCreate(type, name) {
    if (!name) {
      addOutputLine(`<span class="t-error">❌ Please provide a project name.</span>`);
      addOutputLine(
        `<span class="t-dim">Usage:   <span class="t-cmd">dasyl ${escHtml(type)} &lt;project-name&gt;</span></span>`
      );
      addOutputLine(
        `<span class="t-dim">Example: <span class="t-cmd">dasyl ${escHtml(type)} my-awesome-app</span></span>`
      );
      return;
    }

    const label = TYPE_LABELS[type] || type;

    const s1 = createSpinnerLine(
      `Creating ${label} project <span class="t-hl">${escHtml(name)}</span>...`
    );
    await animateSpinner(
      s1,
      `Creating ${label} project <span class="t-hl">${escHtml(name)}</span>`,
      SPINNER_DURATION.create
    );

    const s2 = createSpinnerLine('Installing dependencies...');
    await animateSpinner(s2, 'Dependencies installed', SPINNER_DURATION.install);

    const s3 = createSpinnerLine('Initializing Git repository...');
    await animateSpinner(s3, 'Git repository initialized with initial commit', SPINNER_DURATION.git);

    await wait(120);
    addOutputLine(
      `<span class="t-success">🎉 Project <span class="t-hl">${escHtml(name)}</span> created successfully!</span>`
    );

    const nextCmd = type === 'laravel'
      ? `cd ${escHtml(name)} &amp;&amp; php artisan serve`
      : `cd ${escHtml(name)} &amp;&amp; npm run dev`;
    addOutputLine(`<span class="t-dim">${nextCmd}</span>`);
    addOutputLine(
      `<span class="t-dim t-note">⚡ This is a simulation — install dasyl globally to scaffold real projects.</span>`
    );
  }

  /* ── Initialise ─────────────────────────────────────── */
  function init() {
    body.innerHTML = '';

    const welcome = document.createElement('div');
    welcome.className = 'terminal__line terminal__line--output';
    welcome.innerHTML =
      `<span class="t-dim">Type <span class="t-hl">dasyl --help</span> for available commands, ` +
      `or try <span class="t-hl">dasyl react my-app</span>.</span>`;
    body.appendChild(welcome);

    const inputLine = document.createElement('div');
    inputLine.className = 'terminal__line terminal__input-line';
    inputLine.innerHTML =
      `<span class="t-prompt">$</span> ` +
      `<span class="t-input-text"></span>` +
      `<span class="t-cursor">▋</span>`;
    body.appendChild(inputLine);
  }

  init();
})();
