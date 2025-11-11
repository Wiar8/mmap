/**
 * Compress and resize an image file to reduce base64 size
 * Preserves transparency for PNG/WebP images
 */
export async function compressImage(
  file: File,
  maxWidth: number = 100,
  maxHeight: number = 100,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: true });

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Clear canvas with transparency
        ctx.clearRect(0, 0, width, height);

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Check if image has transparency
        const hasTransparency = checkTransparency(ctx, width, height);

        // Use PNG for transparent images, JPEG for opaque images
        let compressedBase64: string;
        if (hasTransparency || file.type === 'image/png' || file.type === 'image/webp') {
          // PNG supports transparency but has larger file size
          compressedBase64 = canvas.toDataURL('image/png');
        } else {
          // JPEG has better compression but no transparency
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Check if canvas has any transparent pixels
 */
function checkTransparency(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): boolean {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Check alpha channel of pixels (every 4th value)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true; // Found a transparent or semi-transparent pixel
      }
    }

    return false; // All pixels are fully opaque
  } catch (error) {
    // If we can't read image data, assume no transparency
    return false;
  }
}

/**
 * Get file size in KB from base64 string
 */
export function getBase64Size(base64: string): number {
  const base64Length = base64.length - (base64.indexOf(',') + 1);
  const padding = (base64.charAt(base64.length - 2) === '=' ? 2 : (base64.charAt(base64.length - 1) === '=' ? 1 : 0));
  return (base64Length * 0.75 - padding) / 1024;
}
