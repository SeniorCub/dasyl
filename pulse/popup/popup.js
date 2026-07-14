// Dasyl Net - Popup Controller

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const runTestBtn = document.getElementById('runTestBtn');
    const speedDisplay = document.getElementById('speedDisplay');
    const uploadDisplay = document.getElementById('uploadDisplay');
    const latencyUnloadedDisplay = document.getElementById('latencyUnloadedDisplay');
    const latencyLoadedDisplay = document.getElementById('latencyLoadedDisplay');
    const jitterDisplay = document.getElementById('jitterDisplay');
    const clientIP = document.getElementById('clientIP');
    const clientProvider = document.getElementById('clientProvider');
    const clientLocation = document.getElementById('clientLocation');
    const statusBadge = document.getElementById('statusBadge');
    const historyList = document.getElementById('historyList');
    const devModeToggle = document.getElementById('devModeToggle');
    const progressCircle = document.getElementById('progressCircle');

    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // Load initial state
    loadData();

    // Event Listeners
    runTestBtn.addEventListener('click', runSpeedTest);
    devModeToggle.addEventListener('change', toggleDevMode);

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    function displayTestResult(res) {
        if (!res) return;

        animateValue(speedDisplay, 0, res.downloadMbps, 1000);
        uploadDisplay.textContent = res.uploadMbps + ' Mbps';
        latencyUnloadedDisplay.textContent = (res.latencyUnloaded || res.latencyMs || '--') + ' ms';
        latencyLoadedDisplay.textContent = (res.latencyLoaded || '--') + ' ms';
        jitterDisplay.textContent = (res.jitter || res.jitterMs || '--') + ' ms';
        
        if (res.client) {
            clientIP.textContent = res.client.ip || '--';
            clientProvider.textContent = res.client.org || '--';
            
            const city = res.client.city;
            const country = res.client.country_name;
            if (city && country) {
                clientLocation.textContent = `${city}, ${country}`;
            } else if (city || country) {
                clientLocation.textContent = city || country;
            } else {
                clientLocation.textContent = 'Unknown';
            }
        } else {
            clientIP.textContent = '--';
            clientProvider.textContent = '--';
            clientLocation.textContent = '--';
        }

        setProgress(Math.min(res.downloadMbps, 100));
    }

    async function loadData() {
        const data = await chrome.storage.local.get(['history', 'settings', 'currentStatus']);
        
        // Update history
        updateHistoryUI(data.history || []);
        
        // Update status badge
        if (data.currentStatus) {
            statusBadge.textContent = data.currentStatus;
            statusBadge.className = `status-badge status-${data.currentStatus.toLowerCase()}`;
        }

        // Update settings
        if (data.settings) {
            devModeToggle.checked = data.settings.devMode;
        }
    }

    function updateHistoryUI(history) {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-item">No tests yet</div>';
            return;
        }

        history.forEach((test, index) => {
            const date = new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const item = document.createElement('div');
            item.className = 'history-item clickable';
            item.innerHTML = `
                <span>${test.downloadMbps} / ${test.uploadMbps} Mbps</span>
                <span class="date">${date}</span>
            `;
            item.addEventListener('click', () => {
                displayTestResult(test);
                // Visual feedback for selection
                document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
            historyList.appendChild(item);
        });
    }

    async function runSpeedTest() {
        runTestBtn.disabled = true;
        runTestBtn.textContent = 'TESTING...';
        setProgress(0);
        
        speedDisplay.textContent = '0.0';
        uploadDisplay.textContent = '--';
        latencyUnloadedDisplay.textContent = '--';
        latencyLoadedDisplay.textContent = '--';
        jitterDisplay.textContent = '--';
        clientIP.textContent = '--';
        clientProvider.textContent = '--';
        clientLocation.textContent = '--';

        chrome.runtime.sendMessage({ action: 'runFullTest' }, (response) => {
            if (response && response.success) {
                displayTestResult(response.results);
                loadData(); // Refresh history
            } else {
                console.error('Speed Test Failed:', response ? response.error : 'No response');
                speedDisplay.textContent = 'Err';
            }
            
            runTestBtn.disabled = false;
            runTestBtn.textContent = 'RUN SPEED TEST';
        });
    }

    // Progress update listener from background
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'testProgress') {
            runTestBtn.textContent = request.message.toUpperCase();
            // Could update small progress bar here too
        }
    });

    function toggleDevMode() {
        chrome.storage.local.get('settings', (data) => {
            const settings = data.settings || {};
            settings.devMode = devModeToggle.checked;
            chrome.storage.local.set({ settings });
        });
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
