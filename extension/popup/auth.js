export async function getToken() {
  const data = await chrome.storage.local.get('apiToken');
  return data.apiToken || null;
}

export async function saveToken(token) {
  if (!token || !token.startsWith('dsl_')) {
    throw new Error('Invalid Dasyl API Token');
  }
  await chrome.storage.local.set({ apiToken: token });
}

export async function clearToken() {
  await chrome.storage.local.remove('apiToken');
}
