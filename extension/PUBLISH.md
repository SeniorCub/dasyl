# Publishing Dasyl Pulse

This guide provides step-by-step instructions for publishing the **Dasyl Pulse** internet speed extension to the Chrome Web Store and other major browser marketplaces.

## 1. Final Quality Check

Before packaging, ensure the following are correct in your `manifest.json`:
- **Version:** Update the version number (e.g., `1.0.0`).
- **Icons:** Verify all icon sizes (16, 48, 128) are present and clear.
- **Permissions:** Ensure only necessary permissions are requested.
- **Testing:** Perform a final "Load unpacked" test in Chrome to ensure no errors are in the console.

## 2. Packaging the Extension

You must create a ZIP file containing all the files in the project root. 

**Important:** The `manifest.json` must be at the **root** of the ZIP archive.

### Using the Command Line (Linux/macOS)
Run this command in the project's root directory:
```bash
zip -r dasyl-pulse-v1.zip . -x "*.git*" "*.md" ".DS_Store"
```

### Using a File Explorer
1. Select all files in the `internetSpeed` folder (except `.git` or `README.md`).
2. Right-click and select **Compress** or **Send to Compressed (zipped) folder**.

## 3. Chrome Web Store (Google Chrome)

### Step 1: Set up a Developer Account
1. Visit the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
2. Sign in with a Google Account.
3. Pay the **$5 USD one-time registration fee**.

### Step 2: Upload Your Item
1. Click the **+ New Item** button.
2. Upload the `dasyl-pulse-v1.zip` file you created.

### Step 3: Fill Out the Store Listing
- **Description:** Use a compelling description emphasizing developer-focused metrics like Loaded Latency and Jitter.
- **Category:** Select "Productivity" or "Developer Tools".
- **Graphics:**
    - **Screenshots:** At least one 1280x800 or 640x400 image.
    - **Small Tile Icon:** 440x280 image (PNG).
    - **Marquee:** (Optional) 1400x560 image for featured placement.

### Step 4: Privacy and Permissions
Google requires a **Privacy Policy** because the extension accesses network data.
- **Privacy Policy URL:** Host a simple privacy policy on GitHub Pages or a similar service.
- **Permission Justification:** You must explain why you need `<all_urls>`.
  - *Example:* "Required to perform latency and speed tests against various global CDN endpoints (Cloudflare, Google) to ensure accurate network measurements."

### Step 5: Submit for Review
Click **Submit for Review**. Reviews typically take **1–3 business days**.

---

## 4. Microsoft Edge Add-ons (Edge)

Microsoft Edge uses the same Chromium engine, so your extension is already compatible.
1. Visit the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge).
2. Create an account (free for individuals).
3. Upload the same ZIP file and follow their submission steps.

## 5. Firefox Add-ons (Firefox)

Firefox requires minor changes to `manifest.json` (like adding an ID in `browser_specific_settings`).
1. Visit the [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/).
2. Upload your ZIP file for signing and listing.

---

## Maintenance Tips
- **Updates:** To push a new version, update the `"version"` in `manifest.json`, ZIP the folder, and upload it as a "New Version" in the console.
- **Feedback:** Monitor the "Reviews" tab for user feedback and bug reports.
