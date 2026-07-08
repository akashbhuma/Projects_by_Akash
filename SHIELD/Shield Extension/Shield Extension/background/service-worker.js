chrome.runtime.onMessage.addListener((message, sender) => {
  if (!sender.tab) return;
  const tabId = sender.tab.id;

  if (message.type === 'FLAG_COUNT') {
    const count = message.count;
    if (count > 0) {
      chrome.action.setBadgeText({ text: String(count), tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#C62828', tabId });
    } else {
      chrome.action.setBadgeText({ text: '', tabId });
    }
  }

  if (message.type === 'CLEAR_BADGE') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});
