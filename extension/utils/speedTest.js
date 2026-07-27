/**
 * Dasyl Net - Speed Test Engine (v2)
 * Accurately measures download, upload, latency (unloaded/loaded), and jitter.
 */

export class SpeedTestEngine {
  constructor() {
    this.testEndpoints = {
      latency: 'https://1.1.1.1/cdn-cgi/trace',
      download: [
        'https://speed.cloudflare.com/__down?bytes=10000000', // 10MB
        'https://speed.cloudflare.com/__down?bytes=25000000', // 25MB
        'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js'
      ],
      upload: 'https://httpbin.org/post',
      clientInfo: 'https://ipapi.co/json/',
      clientInfoSecondary: 'http://ip-api.com/json/' 
    };
  }

  async runFullTest(onProgress) {
    const results = {
      downloadMbps: 0,
      uploadMbps: 0,
      latencyUnloaded: 0,
      latencyLoaded: 0,
      jitter: 0,
      client: {
        ip: '--',
        org: '--',
        city: '--',
        country_name: '--'
      },
      timestamp: Date.now()
    };

    try {
      // 1. Get Client Info
      if (onProgress) onProgress('Gathering client info...');
      results.client = await this.getRobustClientInfo();

      // 2. Unloaded Latency
      if (onProgress) onProgress('Measuring unloaded latency...');
      const unloaded = await this.measureLatency(10);
      results.latencyUnloaded = unloaded.avg;
      results.jitter = unloaded.jitter;

      // 3. Download Speed & Loaded Latency
      if (onProgress) onProgress('Testing download speed...');
      const downloadResults = await this.measureDownloadWithLatency(onProgress);
      results.downloadMbps = downloadResults.mbps;
      const downloadLoadedLatency = downloadResults.avgLatency;

      // 4. Upload Speed & Loaded Latency
      if (onProgress) onProgress('Testing upload speed...');
      const uploadResults = await this.measureUpload(onProgress);
      results.uploadMbps = uploadResults.mbps;
      const uploadLoadedLatency = uploadResults.avgLatency;

      // Final loaded latency is an average of both phases
      results.latencyLoaded = Math.round((downloadLoadedLatency + uploadLoadedLatency) / 2);

      return results;
    } catch (error) {
      console.error('Speed Test Error:', error);
      throw error;
    }
  }

  async measureLatency(samples = 5) {
    const pings = [];
    for (let i = 0; i < samples; i++) {
      const start = performance.now();
      try {
        await fetch(this.testEndpoints.latency + '?cache=' + Math.random(), { 
          mode: 'no-cors', 
          cache: 'no-cache'
        });
        pings.push(performance.now() - start);
      } catch (e) {
        console.warn('Ping failed:', e);
      }
    }

    if (pings.length === 0) return { avg: 0, jitter: 0 };
    const avg = pings.reduce((a, b) => a + b) / pings.length;
    let totalDiff = 0;
    for (let i = 1; i < pings.length; i++) {
        totalDiff += Math.abs(pings[i] - pings[i-1]);
    }
    const jitter = pings.length > 1 ? totalDiff / (pings.length - 1) : 0;
    return { avg: Math.round(avg), jitter: Math.round(jitter) };
  }

  async getRobustClientInfo() {
    let info = { ip: '--', org: '--', city: '--', country_name: '--' };

    // Try primary source (ipapi.co)
    try {
      const resp = await fetch(this.testEndpoints.clientInfo);
      if (resp.ok) {
        const data = await resp.json();
        return {
          ip: data.ip || '--',
          org: data.org || data.asn || '--',
          city: data.city || '--',
          country_name: data.country_name || data.country || '--'
        };
      }
    } catch (e) {
      console.warn('ipapi.co failed, trying secondary fallback...');
    }

    // Secondary source: ip-api.com
    try {
      const resp = await fetch(this.testEndpoints.clientInfoSecondary);
      if (resp.ok) {
        const data = await resp.json();
        return {
          ip: data.query || '--',
          org: data.isp || data.org || '--',
          city: data.city || '--',
          country_name: data.country || '--'
        };
      }
    } catch (e) {
      console.warn('ip-api.com failed, trying Cloudflare trace...');
    }

    // Fallback 1: Cloudflare Trace (Very reliable for IP and Country code)
    try {
      const resp = await fetch(this.testEndpoints.latency);
      if (resp.ok) {
        const text = await resp.text();
        const lines = text.split('\n');
        const trace = {};
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) trace[key] = value;
        });
        
        info.ip = trace.ip || info.ip;
        info.country_name = trace.loc || info.country_name;
        info.org = 'Unknown Provider'; 
      }
    } catch (e) {
      console.warn('Cloudflare trace fallback failed');
    }

    return info;
  }

  async measureDownloadWithLatency(onProgress) {
    const url = this.testEndpoints.download[1]; // Use 25MB sample
    const pingsDuringDownload = [];
    let downloadComplete = false;

    // Start background pings for loaded latency
    const pingInterval = setInterval(async () => {
      if (downloadComplete) return;
      const start = performance.now();
      try {
        await fetch(this.testEndpoints.latency + '?cache=' + Math.random(), { mode: 'no-cors' });
        pingsDuringDownload.push(performance.now() - start);
      } catch (e) {}
    }, 200);

    let totalBytes = 0;
    const start = performance.now();
    try {
      const response = await fetch(url + '&nocache=' + Math.random(), { cache: 'no-cache' });
      const reader = response.body.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        
        // Optional progress update
        const elapsed = (performance.now() - start) / 1000;
        if (elapsed > 0 && onProgress) {
            const currentMbps = (totalBytes * 8) / (elapsed * 1000000);
            onProgress(`Downloading... ${currentMbps.toFixed(1)} Mbps`);
        }
      }
    } catch (e) {
      console.warn('Download failed:', e);
    } finally {
      downloadComplete = true;
      clearInterval(pingInterval);
    }

    const end = performance.now();
    const duration = (end - start) / 1000;
    const mbps = (totalBytes * 8) / (duration * 1000000);
    const avgLatency = pingsDuringDownload.length > 0 
      ? Math.round(pingsDuringDownload.reduce((a, b) => a + b) / pingsDuringDownload.length)
      : 0;

    return { mbps: parseFloat(mbps.toFixed(2)), avgLatency };
  }

  async measureUpload(onProgress) {
    const size = 5 * 1024 * 1024; // 5MB for better accuracy
    const data = new Uint8Array(size);
    
    // Fill in chunks to avoid QuotaExceededError in getRandomValues (limit is 65536)
    const chunkSize = 65536;
    for (let i = 0; i < size; i += chunkSize) {
      const end = Math.min(i + chunkSize, size);
      crypto.getRandomValues(data.subarray(i, end));
    }

    const pingsDuringUpload = [];
    let uploadComplete = false;

    // Start background pings for loaded latency
    const pingInterval = setInterval(async () => {
      if (uploadComplete) return;
      const start = performance.now();
      try {
        await fetch(this.testEndpoints.latency + '?cache=' + Math.random(), { mode: 'no-cors' });
        pingsDuringUpload.push(performance.now() - start);
      } catch (e) {}
    }, 200);

    const start = performance.now();
    try {
      const response = await fetch(this.testEndpoints.upload, {
        method: 'POST',
        body: data,
        cache: 'no-cache'
      });
      if (!response.ok) throw new Error('Upload failed');
    } catch (e) {
      console.warn('Upload test failed:', e);
      return { mbps: 0, avgLatency: 0 };
    } finally {
        uploadComplete = true;
        clearInterval(pingInterval);
    }
    const end = performance.now();
    const duration = (end - start) / 1000;
    const mbps = (size * 8) / (duration * 1000000);
    const avgLatency = pingsDuringUpload.length > 0 
      ? Math.round(pingsDuringUpload.reduce((a, b) => a + b) / pingsDuringUpload.length)
      : 0;
    return { mbps: parseFloat(mbps.toFixed(2)), avgLatency };
  }
}

// Export for background (service worker) or popup
if (typeof self !== 'undefined') self.SpeedTestEngine = SpeedTestEngine;
if (typeof window !== 'undefined') window.SpeedTestEngine = SpeedTestEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = SpeedTestEngine;
