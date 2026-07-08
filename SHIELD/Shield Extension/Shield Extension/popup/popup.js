const DEFAULTS = {
  enabled: true,
  sensitivity: 'medium',
  showToast: true,
  blurHigh: true,
  whitelistedSites: [],
  pageSummary: { flaggedCount: 0, flags: [], url: '' }
};

function getActiveTab() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]));
  });
}

function load() {
  return new Promise(resolve => {
    chrome.storage.local.get(Object.keys(DEFAULTS), data => {
      resolve({ ...DEFAULTS, ...data });
    });
  });
}

function save(partial) {
  return new Promise(resolve => chrome.storage.local.set(partial, resolve));
}

function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
  });
}

async function render() {
  const state = await load();
  const tab = await getActiveTab();
  const host = tab && tab.url ? new URL(tab.url).hostname : '';

  document.getElementById('enabledToggle').checked = state.enabled;
  document.getElementById('sensitivity').value = state.sensitivity;
  document.getElementById('showToast').checked = state.showToast;
  document.getElementById('blurHigh').checked = state.blurHigh;
  document.getElementById('whitelist').checked = (state.whitelistedSites || []).includes(host);

  const summary = state.pageSummary || {};
  const sameUrl = summary.url === (tab && tab.url);
  const count = sameUrl ? (summary.flaggedCount || 0) : 0;
  const flags = sameUrl ? (summary.flags || []) : [];

  const title = document.getElementById('summaryTitle');
  const list = document.getElementById('flagList');
  const scrollBtn = document.getElementById('scrollFirst');
  list.innerHTML = '';

  if (!state.enabled) {
    title.textContent = 'Shield is OFF';
    scrollBtn.hidden = true;
    return;
  }
  if ((state.whitelistedSites || []).includes(host)) {
    title.textContent = 'This site is whitelisted';
    scrollBtn.hidden = true;
    return;
  }

  if (count === 0) {
    title.textContent = 'No suspicious passages found';
    scrollBtn.hidden = true;
  } else {
    title.textContent = `${count} suspicious passage${count > 1 ? 's' : ''} found`;
    flags.slice(0, 5).forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="severity-dot ${f.severity}"></span><span class="flag-excerpt"></span>`;
      li.querySelector('.flag-excerpt').textContent = f.excerpt;
      list.appendChild(li);
    });
    scrollBtn.hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render();

  document.getElementById('enabledToggle').addEventListener('change', async e => {
    await save({ enabled: e.target.checked });
    reloadActiveTab();
    setTimeout(render, 100);
  });

  document.getElementById('sensitivity').addEventListener('change', async e => {
    await save({ sensitivity: e.target.value });
    reloadActiveTab();
  });

  document.getElementById('showToast').addEventListener('change', async e => {
    await save({ showToast: e.target.checked });
  });

  document.getElementById('blurHigh').addEventListener('change', async e => {
    await save({ blurHigh: e.target.checked });
  });

  document.getElementById('whitelist').addEventListener('change', async e => {
    const tab = await getActiveTab();
    const host = tab && tab.url ? new URL(tab.url).hostname : '';
    if (!host) return;
    const state = await load();
    let list = state.whitelistedSites || [];
    if (e.target.checked) {
      if (!list.includes(host)) list.push(host);
    } else {
      list = list.filter(h => h !== host);
    }
    await save({ whitelistedSites: list });
    reloadActiveTab();
  });

  document.getElementById('scrollFirst').addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const el = document.querySelector('.shield-flagged-wrapper');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.outline = '3px solid #C62828';
          setTimeout(() => { el.style.outline = ''; }, 2000);
        }
      }
    });
  });

  const settingsToggle = document.getElementById('settingsToggle');
  settingsToggle.addEventListener('click', () => {
    const p = document.getElementById('settingsPanel');
    p.hidden = !p.hidden;
    settingsToggle.textContent = p.hidden ? 'Settings ▾' : 'Settings ▴';
  });
});
