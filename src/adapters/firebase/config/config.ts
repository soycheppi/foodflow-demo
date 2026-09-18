const isEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isEmulator ? 'fake-api-key' : ''),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (isEmulator ? 'demo-foodflow.firebaseapp.com' : ''),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (isEmulator ? 'demo-foodflow' : ''),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (isEmulator ? 'demo-foodflow.appspot.com' : ''),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (isEmulator ? '123456789' : ''),
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (isEmulator ? '1:123456789:web:demo' : ''),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
};
