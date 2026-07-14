// Dasyl Net - Background Service Worker

// Catch any unhandled rejections globally
self.addEventListener('unhandledrejection', event => {
  console.error('Unhandled background promise rejection:', event.reason);
});

console.log('Background: Loading speedTest.js...');
try {
  // Use absolute path from extension root for reliability
  importScripts('../utils/speedTest.js');
  console.log('Background: speedTest.js loaded. Global SpeedTestEngine:', typeof SpeedTestEngine);
} catch (e) {
  console.error('Background: Failed to importScripts:', e);
}

const ALARM_NAME = 'network-check';
let engine;

try {
  if (typeof SpeedTestEngine !== 'undefined') {
    engine = new SpeedTestEngine();
    console.log('Dasyl Pulse Engine Initialized');
  } else {
    console.error('Background: SpeedTestEngine class is not defined after import');
  }
} catch (e) {
  console.error('Background: Failed to initialize SpeedTestEngine:', e);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Dasyl Pulse Installed');
  
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 5 });
  
  chrome.storage.local.set({
    history: [],
    settings: {
      alertThresholdMbps: 5,
      alertLatencyMs: 200,
      devMode: false
    },
    currentStatus: 'Excellent'
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    checkConnection();
  }
});

async function checkConnection() {
  if (!navigator.onLine) {
    updateStatus('Offline');
    return;
  }

  if (!engine) return;

  try {
    const latencyData = await engine.measureLatency(3);
    let status = 'Excellent';
    if (latencyData.avg > 300) status = 'Poor';
    else if (latencyData.avg > 150) status = 'Good';
    
    chrome.storage.local.set({ currentStatus: status });
  } catch (e) {
    console.warn('Background status check failed:', e);
  }
}

function updateStatus(status) {
  chrome.storage.local.set({ currentStatus: status });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'runFullTest') {
    if (!engine) {
      console.error('Background: Cannot run test, engine not initialized');
      sendResponse({ success: false, error: 'Engine not initialized. Please reload the extension.' });
      return;
    }

    engine.runFullTest((msg) => {
      chrome.runtime.sendMessage({ action: 'testProgress', message: msg }).catch(() => {});
    }).then(results => {
      console.log('Test completed successfully:', results);
      saveResult(results);
      sendResponse({ success: true, results });
    }).catch(err => {
      console.error('Background test error:', err);
      sendResponse({ success: false, error: err.message || 'Unknown test error' });
    });
    return true; // keep channel open
  }
});

async function saveResult(result) {
  const { history } = await chrome.storage.local.get('history');
  const newHistory = [result, ...(history || [])].slice(0, 20);
  chrome.storage.local.set({ history: newHistory });
}
