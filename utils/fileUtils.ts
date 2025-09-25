
import type { ImageFile } from '../types';

export const fileToImageFile = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image.'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader result is not a string.'));
      }
      const previewUrl = reader.result;
      const base64 = previewUrl.split(',')[1];
      if (!base64) {
        return reject(new Error('Failed to extract base64 data from file.'));
      }
      resolve({
        base64,
        mimeType: file.type,
        previewUrl,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const dataUrlToImageFile = (dataUrl: string): ImageFile => {
  const parts = dataUrl.split(',');
  const mimeTypePart = parts[0].match(/:(.*?);/);
  if (!mimeTypePart || !parts[1]) {
    throw new Error('Invalid data URL.');
  }
  const mimeType = mimeTypePart[1];
  const base64 = parts[1];
  return {
    base64,
    mimeType,
    previewUrl: dataUrl,
  };
};
