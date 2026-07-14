// Dasyl Net - Runtime Intelligence Popup Controller

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const currentUrlDisplay = document.getElementById('currentUrl');
    const totalRequestsDisplay = document.getElementById('totalRequests');
    const failedRequestsDisplay = document.getElementById('failedRequests');
    const slowRequestsDisplay = document.getElementById('slowRequests');
    const avgTimeDisplay = document.getElementById('avgTime');
    const historyList = document.getElementById('historyList');
    const warningsList = document.getElementById('warningsList');
    const devModeToggle = document.getElementById('devModeToggle');

    // Load initial state
    loadData();

    // Event Listeners
    devModeToggle.addEventListener('change', toggleDevMode);

    function loadData() {
        // Get settings
        chrome.storage.local.get('settings', (data) => {
            if (data.settings) {
                devModeToggle.checked = data.settings.devMode;
            }
        });

        // Request metrics from background script
        chrome.runtime.sendMessage({ action: 'getTabMetrics' }, (response) => {
            if (response && response.success) {
                currentUrlDisplay.textContent = response.url || 'Unknown URL';
                processMetrics(response.metrics || []);
            } else {
                currentUrlDisplay.textContent = 'No data for active tab';
                processMetrics([]);
            }
        });
    }

    function processMetrics(metrics) {
        if (!metrics || metrics.length === 0) {
            totalRequestsDisplay.textContent = '0';
            failedRequestsDisplay.textContent = '0';
            slowRequestsDisplay.textContent = '0';
            avgTimeDisplay.textContent = '--';
            historyList.innerHTML = '<div class="history-item">No network requests intercepted yet.</div>';
            warningsList.innerHTML = '<div style="font-size: 11px; color: var(--text-dim); padding: 5px 0;">No active warnings.</div>';
            return;
        }

        totalRequestsDisplay.textContent = metrics.length;
        
        let failedCount = 0;
        let slowCount = 0;
        let totalTime = 0;
        const warnings = [];

        // Reverse to show newest first
        const reversedMetrics = [...metrics].reverse();
        historyList.innerHTML = '';

        reversedMetrics.forEach(req => {
            totalTime += req.duration;

            // Analyze
            if (req.status === 0 || req.status >= 400) {
                failedCount++;
                if (req.status >= 500) {
                    warnings.push(`⚠ Server Error (${req.status}) on ${new URL(req.url).pathname}`);
                } else if (req.status === 0) {
                    warnings.push(`⚠ Network/CORS Failed on ${new URL(req.url).pathname}`);
                }
            }

            if (req.duration > 1000) {
                slowCount++;
                if (req.duration > 2500) {
                    warnings.push(`⚠ Slow API (${(req.duration/1000).toFixed(1)}s) on ${new URL(req.url).pathname}`);
                }
            }

            // Create UI Item
            const date = new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            let statusColor = '#39ff14'; // green
            if (req.status >= 400 || req.status === 0) statusColor = '#ff3366'; // red
            else if (req.duration > 1000) statusColor = '#ffaa00'; // yellow

            const item = document.createElement('div');
            item.className = 'history-item';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.gap = '4px';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: ${statusColor}; font-size: 10px;">${req.method} ${req.status || 'ERR'}</span>
                    <span style="color: var(--text-dim); font-size: 10px;">${req.duration.toFixed(0)}ms</span>
                </div>
                <div style="font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #ccc;">
                    ${req.url}
                </div>
                <div style="font-size: 9px; color: var(--text-dim); text-align: right;">${date}</div>
            `;
            historyList.appendChild(item);
        });

        // Update Stats
        failedRequestsDisplay.textContent = failedCount;
        slowRequestsDisplay.textContent = slowCount;
        avgTimeDisplay.textContent = (totalTime / metrics.length).toFixed(0) + 'ms';

        // Display Warnings
        if (warnings.length > 0) {
            warningsList.innerHTML = warnings.map(w => `<div style="font-size: 11px; color: #ffaa00; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${w}</div>`).join('');
        } else {
            warningsList.innerHTML = '<div style="font-size: 11px; color: var(--text-dim); padding: 5px 0;">No active warnings.</div>';
        }
    }

    function toggleDevMode() {
        chrome.storage.local.get('settings', (data) => {
            const settings = data.settings || {};
            settings.devMode = devModeToggle.checked;
            chrome.storage.local.set({ settings });
            
            // Auto reload metrics to show that interception relies on this
            if (settings.devMode) {
                setTimeout(loadData, 500);
            }
        });
    }

    // Auto-refresh metrics every 2 seconds if popup is open
    setInterval(loadData, 2000);
});
