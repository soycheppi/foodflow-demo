import type { StorageReference } from 'firebase/storage';

import imageCompression from 'browser-image-compression';

export const resizeImageToWebP = async (
  file: File,
  maxWidth = 320,
  maxHeight?: number
): Promise<File> => {
  const options = {
    maxWidthOrHeight: maxHeight ? Math.max(maxWidth, maxHeight) : maxWidth,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const fileName = `${file.name.replace(/\.[^/.]+$/, '')}.webp`;
    return new File([compressedBlob], fileName, { type: 'image/webp' });
  } catch {

    return file;
  }
};

const uploadFileWithProgress = async (
  storageRef: StorageReference,
  file: Blob | Uint8Array | ArrayBuffer,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { uploadBytesResumable, getDownloadURL } = await import('firebase/storage');

  return new Promise((resolve, reject) => {
    const metadata = {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: 'image/webp',
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

function extractStoragePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes('/o/')) {
      const encoded = parsed.pathname.split('/o/')[1];
      return decodeURIComponent(encoded);
    }
    return parsed.pathname.replace(/^\/+/, '');
  } catch {
    return null;
  }
}

export const uploadImageFile = async (
  file: File,
  folder: string,
  oldFile: { url?: string } | null = null,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file?.name || !file.type.startsWith('image/')) {
    throw new Error('The file must be a valid image.');
  }

  const { ref, deleteObject } = await import('firebase/storage');
  const { getStorageInstance } = await import('@/adapters/firebase/providers/storage');
  const storageInstance = await getStorageInstance();

  if (oldFile?.url) {
    try {
      const path = extractStoragePath(oldFile.url);
      if (path) {
        await deleteObject(ref(storageInstance, path));
      }
    } catch (e) {
      console.warn('Could not delete old file', e);
    }
  }

  const resized = await resizeImageToWebP(file, 320);
  const name = `${Date.now()}-${file.name.split('.')[0]}.webp`;
  const storageRef = ref(storageInstance, `${folder}/${name}`);
  return await uploadFileWithProgress(storageRef, resized, onProgress);
};

export const deleteImageFile = async (
  fileObject: { url?: string },
  notifyDeleted?: (msg: string) => void
) => {
  try {
    if (!fileObject?.url) return;

    const { ref, deleteObject } = await import('firebase/storage');
    const { getStorageInstance } = await import('@/adapters/firebase/providers/storage');
    const storage = await getStorageInstance();

    const path = extractStoragePath(fileObject.url);
    if (path) {
      await deleteObject(ref(storage, path));
      notifyDeleted?.('Image deleted successfully.');
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting image:', error);
    notifyDeleted?.(`Error deleting image: ${errorMsg}`);
  }
};

const CDN_BASE = import.meta.env.VITE_CDN_URL || '';
const BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';

const GCS_PREFIXES = [
  `https://storage.googleapis.com/${BUCKET}/`,
  `https://storage.cloud.google.com/${BUCKET}/`,
];

function normalizePath(p: string): string {
  if (!p) return '';
  return p.replace(/^\/+/, '');
}

function extractPathFromFirebaseV0(url: string): string | null {
  const rx = /\/v0\/b\/([^/]+)\/o\/([^?]+)/;
  const m = url.match(rx);
  if (!m) return null;
  const bucket = m[1];
  if (bucket !== BUCKET) return null;

  try {
    const decoded = decodeURIComponent(m[2]);
    return normalizePath(decoded);
  } catch {
    return null;
  }
}

function extractPathFromGCS(url: string): string | null {
  for (const prefix of GCS_PREFIXES) {
    if (url.startsWith(prefix)) {
      const path = url.slice(prefix.length);
      return normalizePath(path);
    }
  }
  return null;
}

export function toCDNUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return url || '';
  if (!CDN_BASE || CDN_BASE === '') return url;

  if (url.startsWith(CDN_BASE) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  if (url.includes('firebasestorage.googleapis.com')) {
    const p = extractPathFromFirebaseV0(url);
    if (p) return `${CDN_BASE}/${p}`;
    return url;
  }

  if (url.includes('storage.googleapis.com') || url.includes('storage.cloud.google.com')) {
    const p = extractPathFromGCS(url);
    if (p) return `${CDN_BASE}/${p}`;
  }

  return url;
}
