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
