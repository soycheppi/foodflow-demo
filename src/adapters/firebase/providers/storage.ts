import type { FirebaseStorage } from 'firebase/storage';
import { getFirebaseApp } from '../config/init';

let storagePromise: Promise<FirebaseStorage> | null = null;

export async function getStorageInstance(): Promise<FirebaseStorage> {
  if (!storagePromise) {
    storagePromise = (async () => {
      const app = await getFirebaseApp();
      const { getStorage } = await import('firebase/storage');
      const storage = getStorage(app);

      if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
        const { connectStorageEmulator } = await import('firebase/storage');
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }

      return storage;
    })();
  }
  return storagePromise;
}
