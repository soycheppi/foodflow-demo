import { FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

export async function setupAppCheck(app: FirebaseApp) {
  if (typeof window === 'undefined') return;
  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') return;

  const debugToken = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
  if (debugToken) {
    (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string }).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  }

  try {
    const siteKey = firebaseConfig.recaptchaSiteKey;
    if (!siteKey) return;

    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e: unknown) {
    const errorObj = e as { code?: string };
    if (errorObj?.code !== 'app-check/already-initialized') {
      console.error('❌ Failed to initialize App Check:', e);
    }
  }
}
