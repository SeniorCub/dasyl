const API_URL = 'https://dasyl.seniorcub.name.ng';

export async function pushTelemetry(metrics) {
  try {
    const data = await chrome.storage.local.get('apiToken');
    const token = data.apiToken;
    
    if (!token) {
      console.warn('Dasyl Pulse: Cannot push telemetry. No API Token found.');
      return;
    }

    await fetch(`${API_URL}/api/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        source: 'extension',
        metrics 
      })
    });
  } catch (error) {
    console.error('Dasyl Pulse: Error pushing telemetry', error);
  }
}
