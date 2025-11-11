'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImageUpload } from '@/types';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: ImageUpload[];
  onImagesChange: (images: ImageUpload[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onImagesChange,
  disabled = false,
  maxImages = 5,
}: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Convert files to base64 and create previews
      const newImages: ImageUpload[] = [];

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result as string;
          newImages.push({
            file,
            preview: base64,
            base64,
          });

          // Update state when all files are processed
          if (newImages.length === acceptedFiles.length) {
            const updatedImages = [...images, ...newImages].slice(0, maxImages);
            onImagesChange(updatedImages);
          }
        };

        reader.readAsDataURL(file);
      });
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: maxImages - images.length,
    disabled: disabled || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">Drop images here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag & drop images here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB ({maxImages - images.length} remaining)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
