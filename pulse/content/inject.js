(function() {
    if (window.__dasyl_net_injected) return;
    window.__dasyl_net_injected = true;

    function isDevMode() {
        return document.documentElement.getAttribute('data-dasyl-dev-mode') === 'true';
    }

    // Intercept Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const start = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : 'Request Object');
        
        try {
            const response = await originalFetch.apply(this, args);
            const duration = performance.now() - start;
            
            if (isDevMode()) {
                console.log(`%c[Dasyl Net] FETCH: ${url} | Status: ${response.status} | Time: ${duration.toFixed(2)}ms`, 'color: #00f2ff');
            }
            
            return response;
        } catch (error) {
            const duration = performance.now() - start;
            if (isDevMode()) {
                console.error(`[Dasyl Net] FETCH FAILED: ${url} | Time: ${duration.toFixed(2)}ms`, error);
            }
            throw error;
        }
    };

    // Intercept XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method;
        this._start = performance.now();
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
            if (isDevMode()) {
                const duration = performance.now() - this._start;
                console.log(`%c[Dasyl Net] XHR: ${this._url} | Status: ${this.status} | Time: ${duration.toFixed(2)}ms`, 'color: #7000ff');
            }
        });

        this.addEventListener('error', () => {
            if (isDevMode()) {
                const duration = performance.now() - this._start;
                console.error(`[Dasyl Net] XHR FAILED: ${this._url} | Duration: ${duration.toFixed(2)}ms`);
            }
        });

        return originalSend.apply(this, arguments);
    };
})();
