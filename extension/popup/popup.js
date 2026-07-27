import * as auth from './auth.js';
import * as ui from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const token = await auth.getToken();
    if (!token) {
        ui.showAuthView();
    } else {
        ui.showAppView();
        loadData();
    }

    // Auth Form Listener
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tokenInput = document.getElementById('apiTokenInput').value.trim();
            try {
                await auth.saveToken(tokenInput);
                ui.showAppView();
                loadData();
            } catch (err) {
                ui.showError(err.message);
            }
        });
    }
    
    // Logout listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await auth.clearToken();
            ui.showAuthView();
        });
    }

    // Dev Mode Toggle
    const devModeToggle = document.getElementById('devModeToggle');
    if (devModeToggle) {
        devModeToggle.addEventListener('change', (e) => {
            chrome.storage.local.get('settings', (data) => {
                const settings = data.settings || {};
                settings.devMode = e.target.checked;
                chrome.storage.local.set({ settings });
            });
        });
    }
});

function loadData() {
    const currentUrlDisplay = document.getElementById('currentUrl');
    const devModeToggle = document.getElementById('devModeToggle');

    // Load settings
    chrome.storage.local.get('settings', (data) => {
        if (data.settings && devModeToggle) {
            devModeToggle.checked = data.settings.devMode;
        }
    });

    // Request metrics from background
    chrome.runtime.sendMessage({ action: 'getTabMetrics' }, (response) => {
        if (response && response.success) {
            if (currentUrlDisplay) currentUrlDisplay.textContent = response.url || 'Unknown URL';
            ui.renderMetrics(response.metrics || []);
        } else {
            if (currentUrlDisplay) currentUrlDisplay.textContent = 'No data for active tab';
            ui.renderMetrics([]);
        }
    });
}
