<div align="center">
  <img src="icons/icon128.png" alt="Dasyl Pulse Logo" width="128"/>
  <h1>⚡ Dasyl Pulse</h1>
  <p><strong>See your network like a developer.</strong></p>
</div>

A premium, developer-focused Chrome extension built on Manifest V3. **Dasyl Pulse** provides an uncompromising view into your current network connection—combining rigorous speed measurement with active request tracking.

## ✨ Core Features

1. **Precision Speed Engine**  
   Unlike consumer speed tests that just "guess" using a single file, Dasyl Pulse utilizes the `performance.now()` API alongside sequential URL fetch streams and chunked cryptography array buffers.
   - **Download Mbps:** Tested via high-availability CDNs (jQuery, Axios).
   - **Upload Mbps:** Tested via `httpbin` POST endpoints respecting entropy limits.
   - **Latency & Jitter:** 5-sample multi-ping calculations that rule out anomalies.

2. **Real-time Status Monitor**  
   Runs an optimized `chrome.alarm` background worker to classify your network health into *Excellent*, *Good*, *Poor*, or *Offline*. It taps into `navigator.connection` to determine infrastructure types (e.g., 4G).

3. **Premium SaaS Aesthetic**  
   It isn't just a tool; it looks like one. Built with a Neon Green (`#39ff14`) and Electric Blue (`#00e5ff`) dark mode, custom Monospace typography, and an animated SVG progress ring.

4. **🔥 Developer Mode (Network Interceptor)**  
   A powerful toggle that injects `fetch` and `XMLHttpRequest` monkey-patching directly into the website's executing context (`MAIN` world). See exactly how long requests are taking right in your window console.

## 🛠️ How to exactly use Dev Mode

When you toggle **"Dev Mode"** ON in the Dasyl Pulse extension:
1. It injects a script into whatever webpage you are currently viewing.
2. It wraps the browser's native `fetch` and `XMLHttpRequest` functions.
3. **If you open your browser's Developer Tools Console (`F12` -> Console)**, Dasyl Pulse will automatically log:
   - Green/Blue outputs for successful API calls: `[Dasyl Net] FETCH: /api/users | Status: 200 | Time: 45.20ms`
   - Bright Red outputs for failed ones: `[Dasyl Net] XHR FAILED: /api/upload | Time: 2004.10ms`

**Why is this useful?**  
Instead of clicking over to the cluttered "Network" tab to hunt down a slow-loading widget, Dasyl Pulse prints the exact duration and HTTP Status Code out in the main console alongside your `console.log()` statements. You instantly catch silent failures and slow APIs while developing front-end applications!

## 📁 Architecture Summary

```text
dasyl-net/
├── manifest.json         # V3 configuration, permissions, and script declarations
├── background/
│   └── background.js     # Mission control, global error trapping, health alarms
├── content/
│   ├── content.js        # Isolated World: Syncs extension settings to the DOM
│   └── inject.js         # Main World: Executes the Fetch/XHR interceptor
├── utils/
│   └── speedTest.js      # Core calculation metric algorithms
├── popup/
│   ├── popup.html        # Glassmorphic layout structure
│   ├── popup.css         # Styling and hover states
│   └── popup.js          # Reactive controller (triggers engine via messages)
└── icons/                # Precisely scaled symbol assets
```

## 🚀 Installation & Setup

1. **Clone or Download** this repository.
2. Go to `chrome://extensions/` in your browser.
3. Enable **Developer mode** toggle in the top-right.
4. Click **Load unpacked** and select the parent folder.
5. Pin **Dasyl Pulse** to your toolbar!

---
*Debug performance before it breaks.*
