import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { getFirestoreInstance } from '@/adapters/firebase/providers/firestore';
import { AppSettings } from '@/core/types/settings';
import { isFirebaseConfigured } from '@/config/env';

const SETTINGS_COLLECTION = 'settings';
const GENERAL_DOC_ID = 'app_settings';

const MOCK_SETTINGS_KEY = 'foodflow_mock_settings';

const DEFAULT_SETTINGS: AppSettings = {
  costoEnvio: 3000,
  montoDescuentoBienvenida: 2000,
  descuentoPedido3: 3000,
  descuentoPedido5: 5000,
  descuentoPedido10: 10000,
  totalUsers: 0,
  userLimit: 500,
};

export const getSettings = async (): Promise<AppSettings> => {
  if (!isFirebaseConfigured()) {
    try {
      const stored = localStorage.getItem(MOCK_SETTINGS_KEY);
      return stored ? (JSON.parse(stored) as AppSettings) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  const db = await getFirestoreInstance();
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as AppSettings;
  }

  return DEFAULT_SETTINGS;
};

export const updateSettings = async (newSettings: Partial<AppSettings>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    try {
      const current = await getSettings();
      const updated = { ...current, ...newSettings };
      localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(updated));
      return;
    } catch (e) {
      console.error('Error saving mock settings', e);
      return;
    }
  }

  const db = await getFirestoreInstance();
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);
  await setDoc(docRef, newSettings, { merge: true });
};
