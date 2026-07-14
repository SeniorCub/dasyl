(function() {
    if (window.__dasyl_net_injected) return;
    window.__dasyl_net_injected = true;

    function isDevMode() {
        return document.documentElement.getAttribute('data-dasyl-dev-mode') === 'true';
    }

    function sendMetric(url, method, status, duration) {
        window.postMessage({
            type: 'DASYL_PULSE_METRIC',
            payload: {
                url,
                method,
                status,
                duration,
                timestamp: Date.now()
            }
        }, '*');
    }

    // Intercept Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const start = performance.now();
        const requestUrl = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : 'Request Object');
        const method = (args[1] && args[1].method) ? args[1].method.toUpperCase() : 'GET';
        
        try {
            const response = await originalFetch.apply(this, args);
            const duration = performance.now() - start;
            
            if (isDevMode()) {
                console.log(`%c[Dasyl Net] FETCH: ${requestUrl} | Status: ${response.status} | Time: ${duration.toFixed(2)}ms`, 'color: #00f2ff');
            }
            
            sendMetric(requestUrl, method, response.status, duration);
            return response;
        } catch (error) {
            const duration = performance.now() - start;
            if (isDevMode()) {
                console.error(`[Dasyl Net] FETCH FAILED: ${requestUrl} | Time: ${duration.toFixed(2)}ms`, error);
            }
            sendMetric(requestUrl, method, 0, duration);
            throw error;
        }
    };

    // Intercept XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method.toUpperCase();
        this._start = performance.now();
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
            const duration = performance.now() - this._start;
            if (isDevMode()) {
                console.log(`%c[Dasyl Net] XHR: ${this._url} | Status: ${this.status} | Time: ${duration.toFixed(2)}ms`, 'color: #7000ff');
            }
            sendMetric(this._url, this._method, this.status, duration);
        });

        this.addEventListener('error', () => {
            const duration = performance.now() - this._start;
            if (isDevMode()) {
                console.error(`[Dasyl Net] XHR FAILED: ${this._url} | Duration: ${duration.toFixed(2)}ms`);
            }
            sendMetric(this._url, this._method, 0, duration);
        });

        return originalSend.apply(this, arguments);
    };
})();
