import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isFirebaseConfigured, getDataMode, DATA_MODE } from '@/config/env';

describe('Environment & Zero-Config Autonomy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to mock mode when no firebase API key is provided', () => {
    // In mock mode without remote firebase secrets, isFirebaseConfigured returns false
    const configured = isFirebaseConfigured();
    expect(typeof configured).toBe('boolean');
    expect(['firebase', 'mock']).toContain(DATA_MODE);
    expect(getDataMode()).toBe('mock');
  });

  it('detects emulator mode when VITE_USE_FIREBASE_EMULATORS is set to true', () => {
    vi.stubEnv('VITE_USE_FIREBASE_EMULATORS', 'true');
    expect(isFirebaseConfigured()).toBe(true);
    expect(getDataMode()).toBe('firebase');
    vi.stubEnv('VITE_USE_FIREBASE_EMULATORS', 'false');
  });

  it('evaluates valid API key versus placeholder "your_key_here" and empty strings', () => {
    // Valid key
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'AIzaSyA_RealKey123456');
    expect(isFirebaseConfigured()).toBe(true);

    // Placeholder key
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'AIzaSy_your_key_here');
    expect(isFirebaseConfigured()).toBe(false);

    // Empty or whitespace key
    vi.stubEnv('VITE_FIREBASE_API_KEY', '   ');
    expect(isFirebaseConfigured()).toBe(false);

    vi.stubEnv('VITE_FIREBASE_API_KEY', '');
    expect(isFirebaseConfigured()).toBe(false);
  });
});
