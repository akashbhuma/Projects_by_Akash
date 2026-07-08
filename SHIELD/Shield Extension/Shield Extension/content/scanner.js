console.log('[Shield] scanner.js TOP LEVEL ✅');

(() => {
  if (window.__shieldScannerLoaded) return;
  window.__shieldScannerLoaded = true;

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT',
    'CODE', 'PRE', 'SVG', 'CANVAS', 'IFRAME'
  ]);
  const BLOCK_TAGS = new Set([
    'P', 'DIV', 'ARTICLE', 'SECTION', 'LI', 'BLOCKQUOTE',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TD'
  ]);
  const SEVERITY_SCORE = { low: 1, medium: 2, high: 3 };

  let signals = [];
  let compiled = [];
  let settings = {
    enabled: true,
    sensitivity: 'medium',
    showToast: true,
    blurHigh: true,
    whitelistedSites: [],
    dismissedBlocks: []
  };
  let totalFlagged = 0;
  let pageFlags = [];

  function isSocialMedia(host) {
    return (
      host.includes('instagram.com') ||
      host.includes('facebook.com') ||
      host.includes('twitter.com') ||
      host.includes('x.com') ||
      host.includes('reddit.com') ||
      host.includes('youtube.com') ||
      host.includes('linkedin.com')
    );
  }

  function sensitivityAllows(severity) {
    if (settings.sensitivity === 'low')    return severity === 'high';
    if (settings.sensitivity === 'medium') return severity === 'high' || severity === 'medium';
    return true;
  }

  function getBlockAncestor(node) {
    let el = node.parentElement;
    while (el && el !== document.body) {
      if (BLOCK_TAGS.has(el.tagName)) return el;
      el = el.parentElement;
    }
    return node.parentElement;
  }

  function hashText(text) {
    const slice = text.slice(0, 64);
    try { return btoa(unescape(encodeURIComponent(slice))); }
    catch (e) { return slice; }
  }

  function aggregateSeverity(matched) {
    let score = 0;
    matched.forEach(s => { score += SEVERITY_SCORE[s.severity] || 0; });
    if (score >= 5) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  function isExtensionAlive() {
    try { return !!chrome.runtime && !!chrome.runtime.id; }
    catch (e) { return false; }
  }

  function persistSummary() {
    if (!isExtensionAlive()) return;
    try {
      chrome.storage.local.set({
        pageSummary: {
          url: location.href,
          flaggedCount: totalFlagged,
          flags: pageFlags.slice(0, 20)
        }
      });
      chrome.runtime.sendMessage({ type: 'FLAG_COUNT', count: totalFlagged });
    } catch (e) {}
  }

  const SOCIAL_SELECTORS = {
    'twitter.com':   ['[data-testid="tweet"]', '[data-testid="tweetText"]'],
    'x.com':         ['[data-testid="tweet"]', '[data-testid="tweetText"]'],
    'instagram.com': ['article', 'div[role="presentation"] span'],
    'facebook.com':  ['[role="article"]', '[data-ad-preview="message"]'],
    'reddit.com':    ['[data-testid="post-container"]', 'shreddit-post', '.Post'],
    'youtube.com':   ['#content-text', 'ytd-comment-thread-renderer', 'yt-formatted-string#content'],
    'linkedin.com':  ['.feed-shared-update-v2', '.feed-shared-text', '.update-components-text']
  };

  function getSelectorsForHost(host) {
    for (const [domain, selectors] of Object.entries(SOCIAL_SELECTORS)) {
      if (host.includes(domain)) return selectors;
    }
    return ['article'];
  }

  function analyzePost(post, text) {
    const matched = [];
    for (const c of compiled) {
      if (c.regex.test(text)) matched.push(c.signal);
    }
    if (matched.length === 0) return;
    const severity = aggregateSeverity(matched);
    if (!sensitivityAllows(severity)) return;
    const hash = hashText(text);
    if (settings.dismissedBlocks.includes(hash)) return;
    post.dataset.shieldProcessed = 'true';
    if (window.__shieldOverlay && window.__shieldOverlay.flag) {
      window.__shieldOverlay.flag(post, matched, severity, hash);
      totalFlagged++;
      pageFlags.push({ excerpt: text.slice(0, 60), severity, category: matched[0].category });
    }
  }

  function scanSocialMedia() {
    const host = location.hostname;
    const selectors = getSelectorsForHost(host);
    const seen = new Set();
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(post => {
        if (post.dataset.shieldProcessed) return;
        if (seen.has(post)) return;
        seen.add(post);
        const text = (post.innerText || post.textContent || '').trim();
        if (text.length < 20) return;
        analyzePost(post, text);
      });
    });
  }

  function scanRoot(root) {
    if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.trim().length < 20) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-shield-processed]')) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.shield-flagged-wrapper, .shield-panel, .shield-toast, .shield-badge')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const blockMap = new Map();
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue;
      const matched = [];
      for (const c of compiled) {
        if (c.regex.test(text)) matched.push(c.signal);
      }
      if (matched.length === 0) continue;
      const block = getBlockAncestor(node);
      if (!block || block.dataset.shieldProcessed) continue;
      const entry = blockMap.get(block) || { signals: new Set() };
      matched.forEach(s => entry.signals.add(s));
      blockMap.set(block, entry);
    }

    blockMap.forEach((entry, block) => {
      const matchedSignals = Array.from(entry.signals);
      const severity = aggregateSeverity(matchedSignals);
      if (!sensitivityAllows(severity)) return;
      const blockText = (block.innerText || block.textContent || '').trim();
      const hash = hashText(blockText);
      if (settings.dismissedBlocks.includes(hash)) {
        block.dataset.shieldProcessed = 'true';
        return;
      }
      block.dataset.shieldProcessed = 'true';
      if (window.__shieldOverlay && window.__shieldOverlay.flag) {
        window.__shieldOverlay.flag(block, matchedSignals, severity, hash);
        totalFlagged++;
        pageFlags.push({
          excerpt: blockText.slice(0, 60),
          severity,
          category: matchedSignals[0].category
        });
      }
    });
  }

  let mutationTimer = null;
  function startObserver() {
    const observer = new MutationObserver(mutations => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        if (!isExtensionAlive()) return;
        const host = location.hostname;
        const social = isSocialMedia(host);
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (social) scanSocialMedia();
            else scanRoot(n);
          });
        });
        persistSummary();
      }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[Shield] MutationObserver started ✅');
  }

  async function init() {
    console.log('[Shield] init() running on:', location.hostname);

    // Load settings — if storage fails keep defaults and continue anyway
    try {
      const stored = await new Promise((resolve, reject) => {
        try {
          chrome.storage.local.get(
            ['enabled', 'sensitivity', 'showToast', 'blurHigh', 'whitelistedSites', 'dismissedBlocks'],
            data => {
              if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
              else resolve(data);
            }
          );
        } catch(e) { reject(e); }
      });
      settings = { ...settings, ...stored };
      console.log('[Shield] settings loaded ✅');
    } catch (e) {
      console.warn('[Shield] storage failed, using defaults:', e.message);
      // intentionally continue with defaults
    }

    if (settings.enabled === false) { console.log('[Shield] disabled'); return; }

    const host = location.hostname;
    if ((settings.whitelistedSites || []).includes(host)) { console.log('[Shield] whitelisted'); return; }

    // Load signals.json
    try {
      const url = chrome.runtime.getURL('rules/signals.json');
      console.log('[Shield] fetching signals from:', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      signals = data.signals || [];
      compiled = signals.flatMap(sig =>
        sig.patterns.map(p => {
          try { return { regex: new RegExp(p, 'i'), signal: sig }; }
          catch (e) { console.warn('[Shield] bad pattern skipped:', p); return null; }
        }).filter(Boolean)
      );
      console.log('[Shield] compiled', compiled.length, 'patterns ✅');
    } catch (e) {
      console.error('[Shield] signals.json FAILED:', e.message);
      return;
    }

    window.__shieldSettings = settings;

    // Scan
    try {
      if (isSocialMedia(host)) {
        console.log('[Shield] social media mode:', host);
        scanSocialMedia();
        setInterval(() => {
          if (isExtensionAlive()) { scanSocialMedia(); persistSummary(); }
        }, 3000);
      } else {
        console.log('[Shield] website mode:', host);
        scanRoot(document.body);
        persistSummary();
      }
    } catch(e) {
      console.error('[Shield] scan crashed:', e.message);
    }

    console.log('[Shield] done — flagged:', totalFlagged);

    if (settings.showToast !== false && totalFlagged > 0 && window.__shieldOverlay) {
      window.__shieldOverlay.showToast(totalFlagged);
    }

    startObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();