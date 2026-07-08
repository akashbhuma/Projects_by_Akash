console.log('[Shield] overlay.js TOP LEVEL ✅ - if you see this, injection works');

(() => {
  if (window.__shieldOverlay) return;

  function snopesUrl(text) {
    const q = text.split(/\s+/).slice(0, 6).join(' ');
    return 'https://www.snopes.com/search/?q=' + encodeURIComponent(q);
  }

  function buildPanel(signals, blockText, onDismiss) {
    const panel = document.createElement('div');
    panel.className = 'shield-panel';
    const list = document.createElement('ul');
    list.className = 'shield-signal-list';
    signals.forEach(s => {
      const li = document.createElement('li');
      li.className = 'shield-signal-item shield-' + s.severity;
      const strong = document.createElement('strong');
      strong.textContent = s.category + ': ';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(s.context));
      list.appendChild(li);
    });
    panel.appendChild(list);
    const footer = document.createElement('div');
    footer.className = 'shield-panel-footer';
    const link = document.createElement('a');
    link.href = snopesUrl(blockText);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Check on Snopes ↗';
    footer.appendChild(link);
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'shield-dismiss-btn';
    dismissBtn.textContent = 'Dismiss';
    dismissBtn.addEventListener('click', e => { e.stopPropagation(); onDismiss(); });
    footer.appendChild(dismissBtn);
    panel.appendChild(footer);
    return panel;
  }

  function flag(block, signals, severity, hash) {
    if (!block || block.classList.contains('shield-flagged-wrapper')) return;
    block.classList.add('shield-flagged-wrapper', 'shield-severity-' + severity);
    const badge = document.createElement('div');
    badge.className = 'shield-badge';
    badge.dataset.severity = severity;
    badge.innerHTML =
      '<span class="shield-icon">🛡️</span>' +
      '<span class="shield-label"></span>' +
      '<span class="shield-count"></span>' +
      '<button class="shield-expand-btn" aria-label="See details">▾</button>';
    badge.querySelector('.shield-label').textContent = signals[0].label;
    badge.querySelector('.shield-count').textContent =
      signals.length + ' signal' + (signals.length > 1 ? 's' : '');
    const blockText = (block.innerText || block.textContent || '').trim();
    const dismiss = () => {
      try {
        chrome.storage.local.get(['dismissedBlocks'], data => {
          const arr = data.dismissedBlocks || [];
          if (!arr.includes(hash)) arr.push(hash);
          chrome.storage.local.set({ dismissedBlocks: arr });
        });
      } catch(e) {}
      block.classList.remove(
        'shield-flagged-wrapper', 'shield-severity-low',
        'shield-severity-medium', 'shield-severity-high', 'shield-demoted'
      );
      badge.remove();
      if (panel && panel.parentNode) panel.remove();
      const reveal = block.querySelector(':scope > .shield-reveal-label');
      if (reveal) reveal.remove();
    };
    const panel = buildPanel(signals, blockText, dismiss);
    badge.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('shield-open'); });
    block.insertBefore(badge, block.firstChild);
    block.insertBefore(panel, badge.nextSibling);
    const settings = window.__shieldSettings || {};
    if (severity === 'high' && settings.blurHigh !== false) {
      block.classList.add('shield-demoted');
      const reveal = document.createElement('div');
      reveal.className = 'shield-reveal-label';
      reveal.textContent = '🛡️ Click to reveal';
      reveal.addEventListener('click', e => {
        e.stopPropagation();
        block.classList.remove('shield-demoted', 'shield-severity-high');
        block.classList.add('shield-severity-medium');
        reveal.remove();
      });
      block.appendChild(reveal);
    }
  }

  function showToast(count) {
    if (document.querySelector('.shield-toast')) return;
    const toast = document.createElement('div');
    toast.className = 'shield-toast';
    toast.innerHTML =
      '<span>🛡️ Shield found <strong></strong> suspicious passage(s) on this page.</span>' +
      '<button class="shield-toast-view">View</button>' +
      '<button class="shield-toast-dismiss">Dismiss</button>';
    toast.querySelector('strong').textContent = count;
    toast.querySelector('.shield-toast-view').addEventListener('click', () => {
      const first = document.querySelector('.shield-flagged-wrapper');
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first.style.outline = '3px solid #C62828';
        setTimeout(() => { first.style.outline = ''; }, 2000);
      }
      toast.remove();
    });
    toast.querySelector('.shield-toast-dismiss').addEventListener('click', () => toast.remove());
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
  }

  window.__shieldOverlay = { flag, showToast };
  console.log('[Shield] window.__shieldOverlay ready ✅');
})();