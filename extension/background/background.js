import { SpeedTestEngine } from '../utils/speedTest.js';
import * as storage from './storage.js';
import * as api from './api.js';

// Catch any unhandled rejections globally
self.addEventListener('unhandledrejection', event => {
  console.error('Unhandled background promise rejection:', event.reason);
});

const ALARM_NAME = 'network-check';
let engine = new SpeedTestEngine();

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
    chrome.storage.local.set({ currentStatus: 'Offline' });
    return;
  }

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

chrome.tabs.onRemoved.addListener((tabId) => {
  storage.clearTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // Clear metrics when a page refreshes
  if (changeInfo.status === 'loading' && changeInfo.url) {
    storage.initTab(tabId);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle runtime intelligence metrics
  if (request.action === 'recordRequest' && sender.tab) {
    const tabId = sender.tab.id;
    storage.addMetric(tabId, request.payload);
    
    // Periodically push to server (in a real app you might batch this)
    if (request.payload && request.payload.status >= 400) {
      api.pushTelemetry([request.payload]); // push errors immediately
    }
    return;
  }

  // Handle popup request for current tab metrics
  if (request.action === 'getTabMetrics') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        const metrics = storage.getMetrics(tabs[0].id);
        sendResponse({ success: true, metrics, url: tabs[0].url });
      } else {
        sendResponse({ success: false, error: 'No active tab' });
      }
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'runFullTest') {
    engine.runFullTest((msg) => {
      chrome.runtime.sendMessage({ action: 'testProgress', message: msg }).catch(() => {});
    }).then(results => {
      saveResult(results);
      api.pushTelemetry([results]); // optionally push full test to backend
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
