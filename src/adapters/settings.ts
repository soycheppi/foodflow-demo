import { AppSettings } from '@/core/types/settings';

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
  try {
    const stored = localStorage.getItem(MOCK_SETTINGS_KEY);
    return stored ? (JSON.parse(stored) as AppSettings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const updateSettings = async (newSettings: Partial<AppSettings>): Promise<void> => {
  try {
    const current = await getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(updated));
  } catch {
    // LocalStorage fallback
  }
};
