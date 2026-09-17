export const isFirebaseConfigured = (): boolean => {
  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    return true;
  }
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('your_key_here'));
};

export const getDataMode = (): 'firebase' | 'mock' => {
  return isFirebaseConfigured() ? 'firebase' : 'mock';
};

export const DATA_MODE = getDataMode();
