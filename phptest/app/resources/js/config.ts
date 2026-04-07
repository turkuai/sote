let base = '/';
let apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function setBaseUrls(app, api) {
  base = app || api || '/';
  if (base !== '/' && !base.endsWith('/')) {
    base = base + '/';
  }
}

export function getBasename() {
  return base;
}

export function getApiBase() {
  return apiBase;
}

export function getAssetUrl(path) {
  const p = path.startsWith('/') ? path.slice(1) : path;
  return base + p;
}

