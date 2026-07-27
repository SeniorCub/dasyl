// Tab metrics store
export const tabMetrics = new Map();

export function initTab(tabId) {
  tabMetrics.set(tabId, []);
}

export function clearTab(tabId) {
  tabMetrics.delete(tabId);
}

export function addMetric(tabId, payload) {
  if (!tabMetrics.has(tabId)) {
    initTab(tabId);
  }
  const metrics = tabMetrics.get(tabId);
  metrics.push(payload);
  
  // Keep last 100 requests per tab
  if (metrics.length > 100) metrics.shift();
}

export function getMetrics(tabId) {
  return tabMetrics.get(tabId) || [];
}
