// Dasyl Net - Content Script (Isolated World)
// Syncs settings and manages the Dev Mode state in the DOM

function updateDevModeAttribute() {
  chrome.storage.local.get('settings', (data) => {
    const devMode = data.settings && data.settings.devMode;
    document.documentElement.setAttribute('data-dasyl-dev-mode', devMode ? 'true' : 'false');
  });
}

// Initial Sync
updateDevModeAttribute();

// Listen for storage changes (e.g. from Popup)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    updateDevModeAttribute();
  }
});

// Network status listeners
window.addEventListener('online', () => {
  chrome.runtime.sendMessage({ action: 'networkStatus', status: 'online' });
});

window.addEventListener('offline', () => {
  chrome.runtime.sendMessage({ action: 'networkStatus', status: 'offline' });
});

// Listen for intercepted network requests from inject.js (MAIN world)
window.addEventListener('message', (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;
  
  if (event.data && event.data.type === 'DASYL_PULSE_METRIC') {
    // Forward the metric to the background script
    chrome.runtime.sendMessage({
      action: 'recordRequest',
      payload: event.data.payload
    });
  }
});
