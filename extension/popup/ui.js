// UI Manipulation Module

export function renderMetrics(metrics) {
    const totalRequestsDisplay = document.getElementById('totalRequests');
    const failedRequestsDisplay = document.getElementById('failedRequests');
    const slowRequestsDisplay = document.getElementById('slowRequests');
    const avgTimeDisplay = document.getElementById('avgTime');
    const historyList = document.getElementById('historyList');
    const warningsList = document.getElementById('warningsList');

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

    const reversedMetrics = [...metrics].reverse();
    historyList.innerHTML = '';

    reversedMetrics.forEach(req => {
        totalTime += req.duration;

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

        const date = new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        let statusColor = '#39ff14'; // green
        if (req.status >= 400 || req.status === 0) statusColor = '#ff3366'; // red
        else if (req.duration > 1000) statusColor = '#ffaa00'; // yellow

        const item = document.createElement('div');
        item.className = 'history-item';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        
        item.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:2px; max-width:70%;">
                <span style="font-size:10px; color:var(--text-dim);">${date} - ${req.method}</span>
                <span style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${new URL(req.url).pathname}</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:2px; text-align:right;">
                <span style="font-size:11px; color:${statusColor}; font-weight:600;">${req.status === 0 ? 'FAIL' : req.status}</span>
                <span style="font-size:10px; color:var(--text-dim);">${Math.round(req.duration)}ms</span>
            </div>
        `;
        historyList.appendChild(item);
    });

    failedRequestsDisplay.textContent = failedCount;
    slowRequestsDisplay.textContent = slowCount;
    avgTimeDisplay.textContent = Math.round(totalTime / metrics.length) + 'ms';

    if (warnings.length > 0) {
        warningsList.innerHTML = warnings.slice(0, 5).map(w => `<div style="font-size: 11px; color: #ff3366; padding: 5px 0; border-bottom: 1px solid var(--border-color);">${w}</div>`).join('');
    } else {
        warningsList.innerHTML = '<div style="font-size: 11px; color: var(--text-dim); padding: 5px 0;">No active warnings.</div>';
    }
}

export function showAuthView() {
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appView').style.display = 'none';
}

export function showAppView() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'block';
}

export function showError(msg) {
    const errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }
}
