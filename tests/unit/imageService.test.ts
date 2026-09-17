import { describe, it, expect } from 'vitest';
import { toCDNUrl, manejarCargaArchivo, manejarEliminacionArchivo } from '@/adapters/image';

describe('ImageService Adapter (Zero-Trust & CDN Optimization)', () => {
  describe('toCDNUrl converter', () => {
    it('returns empty string or original value when input is nullish or non-string', () => {
      expect(toCDNUrl(null)).toBe('');
      expect(toCDNUrl(undefined)).toBe('');
      expect(toCDNUrl('')).toBe('');
    });

    it('preserves data: and blob: URLs without alteration', () => {
      const dataUri = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAQAcJaACdLoB+AA=';
      const blobUri = 'blob:http://localhost:5173/1234-5678';

      expect(toCDNUrl(dataUri)).toBe(dataUri);
      expect(toCDNUrl(blobUri)).toBe(blobUri);
    });

    it('returns original URL if no CDN_BASE is configured', () => {
      const firebaseUrl = 'https://firebasestorage.googleapis.com/v0/b/test/o/products%2Fburger.webp?alt=media';
      expect(toCDNUrl(firebaseUrl)).toBe(firebaseUrl);
    });
  });

  describe('Validation in manejarCargaArchivo', () => {
    it('rejects invalid files that are not images', async () => {
      const textFile = new File(['hello text'], 'document.txt', { type: 'text/plain' });

      await expect(manejarCargaArchivo(textFile, 'products')).rejects.toThrow(
        'The file must be a valid image.'
      );
    });

    it('rejects file without name or empty file', async () => {
      await expect(manejarCargaArchivo(null as unknown as File, 'products')).rejects.toThrow();
    });
  });

  describe('manejarEliminacionArchivo', () => {
    it('handles empty or missing url gracefully without throwing', async () => {
      let notified = false;
      await expect(
        manejarEliminacionArchivo({ url: '' }, () => {
          notified = true;
        })
      ).resolves.toBeUndefined();

      expect(notified).toBe(false);
    });
  });
});
