import type { FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

let app: FirebaseApp;

export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!app) {
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}
