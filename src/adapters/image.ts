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

export const uploadImageFile = async (
  file: File,
  _folder: string,
  _oldFile: { url?: string } | null = null,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file?.name || !file.type?.startsWith('image/')) {
    throw new Error('The file must be a valid image.');
  }
  onProgress?.(50);
  const resized = await resizeImageToWebP(file, 320);
  onProgress?.(100);
  return URL.createObjectURL(resized);
};

export const deleteImageFile = async (
  fileObject: { url?: string },
  notifyDeleted?: (msg: string) => void
) => {
  if (!fileObject?.url) return;
  notifyDeleted?.('Image deleted from local preview.');
};

export function toCDNUrl(url: string | null | undefined): string {
  return url || '';
}
