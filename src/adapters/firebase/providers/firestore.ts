import type { Firestore } from 'firebase/firestore/lite';
import { getFirebaseApp } from '../config/init';
import { setupAppCheck } from '../config/security';

let firestorePromise: Promise<Firestore> | null = null;

export async function getFirestoreInstance(): Promise<Firestore> {
  if (!firestorePromise) {
    firestorePromise = (async () => {
      const app = await getFirebaseApp();

      if (typeof window !== 'undefined') {
        await setupAppCheck(app);
      }

      const { getFirestore } = await import('firebase/firestore/lite');
      const db = getFirestore(app);

      if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
        const { connectFirestoreEmulator } = await import('firebase/firestore/lite');
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      }

      return db;
    })();
  }
  return firestorePromise;
}

export const mapDoc = <T>(docSnap: import('firebase/firestore/lite').DocumentSnapshot | import('firebase/firestore/lite').QueryDocumentSnapshot): T => {
  return { id: docSnap.id, ...(docSnap.data() || {}) } as T;
};
