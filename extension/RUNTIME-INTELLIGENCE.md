# Dasyl Pulse - Runtime Intelligence (Phase 2 Implementation)

## Overview
As part of the **Dasyl Vision 2030 Roadmap**, the Pulse Chrome Extension has been officially imported into the Dasyl monorepo and heavily refactored. 

Pulse has pivoted away from being a generic "internet speed test" and has been transformed into a **Developer/QA Runtime Intelligence Tool**. It now silently monitors page requests to detect failures, analyze latency, and flag performance issues without requiring the user to open the Chrome DevTools network tab.

---

## 1. Architectural Changes (Under the Hood)

To capture accurate metrics without affecting page performance or violating Chrome Manifest V3 security policies, we built a secure message-passing pipeline:

### `pulse/content/inject.js` (The Interceptor)
- **Role:** Injected directly into the website's `MAIN` execution world so it can override the browser's native networking APIs.
- **Implementation:** 
  - Proxies `window.fetch` and `XMLHttpRequest.prototype.open`/`send`.
  - Captures the Request URL, HTTP Method, HTTP Status Code, and calculates exact execution `duration` using `performance.now()`.
  - Dispatches this data securely to the isolated extension world via `window.postMessage` using the `DASYL_PULSE_METRIC` event type.

### `pulse/content/content.js` (The Bridge)
- **Role:** Runs in Chrome's isolated world and acts as a secure bridge between the untrusted DOM and the extension's background worker.
- **Implementation:** 
  - Listens for `window.addEventListener('message')`.
  - Validates that the event originated from the same window.
  - Forwards the payload to the background script via `chrome.runtime.sendMessage({ action: 'recordRequest' })`.

### `pulse/background/background.js` (The Memory Store)
- **Role:** Acts as the central nervous system and state manager for the extension.
- **Implementation:**
  - Maintains a `tabMetrics` Map to isolate network data per browser tab.
  - Listens for `chrome.tabs.onUpdated` and automatically clears the metrics when a user refreshes or navigates to a new page (preventing memory leaks).
  - Stores a rolling array of the **last 100 requests** for every active tab.

---

## 2. User Interface Rewrite (The Dashboard)

The old speed-dial interface was entirely removed. `popup.html` and `popup.js` were rewritten from scratch to provide actionable developer insights.

### Real-Time Metrics Grid
Instead of ping/download speed, the top of the popup now displays four critical metrics for the current site:
1. **Total Requests:** Total number of APIs intercepted.
2. **Failed (500s/CORS):** Red indicator for any request returning `status >= 400` or `status === 0` (network/CORS failure).
3. **Slow (>1s):** Yellow indicator for any API taking longer than 1000ms.
4. **Avg API Time:** The mean latency of all requests on the page.

### Smart Warnings Engine
A dedicated panel that parses the request data and dynamically injects actionable warnings:
- 🔴 `⚠ Server Error (500) on /api/login`
- 🔴 `⚠ Network/CORS Failed on /api/products`
- 🟡 `⚠ Slow API (2.6s) on /api/checkout`

### Request History Console
A scrollable history log of the last 100 requests, displaying the newest events first. 
- Formats the timestamp (e.g., `12:30:10`).
- Truncates long URLs.
- Color codes the HTTP method and status (Green for `200`, Red for `500`/`0`, Yellow for slow).

---

## 3. Bug Fixes & Refactors
- **Service Worker Initialization:** Fixed a critical bug in `background/background.js` where `importScripts('/utils/speedTest.js')` was using an absolute path. Changed this to a relative path (`../utils/speedTest.js`) which strictly aligns with Chrome Manifest V3 service worker resolution logic.

---

## 4. How to Test It Locally
Since this is an unpacked extension, you can test these new changes instantly in your browser:
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"**.
5. Select the `dasyl/pulse` folder on your local machine.
6. Open any website (like YouTube, or your own local Dasyl server), open the Pulse extension popup, and watch the API requests flow in!

---

## 5. Next Steps (Phase 3 Roadmap)
- **PerformanceObserver Integration:** Hook into the native DOM `PerformanceObserver` inside `inject.js` to track "Large JS Bundles" and "Heavy Images" as specified in the PRD.
- **Infinite Loop Detection:** Write a small algorithm in `background.js` to flag if the exact same URL is called >20 times within 10 seconds.
- **Mocking/Overrides:** Allow developers to click on a failed request in the popup and toggle a "Mock Response" rule to fake a `200 OK` on their next page load.
