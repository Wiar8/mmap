'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ImageUpload } from '@/types';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/image-utils';

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
    async (acceptedFiles: File[]) => {
      // Convert files to compressed base64 and create previews
      const newImages: ImageUpload[] = [];

      for (const file of acceptedFiles) {
        try {
          // Create preview (full size for display)
          const preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          // Create compressed version for embedding in diagram (80x80, 60% quality)
          const compressedBase64 = await compressImage(file, 80, 80, 0.6);

          newImages.push({
            file,
            preview, // Full size for preview
            base64: compressedBase64, // Compressed for diagram
            topic: '', // Initialize with empty topic
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }

      // Update state with all processed images
      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages].slice(0, maxImages);
        onImagesChange(updatedImages);
      }
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

  const updateTopic = (index: number, topic: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], topic };
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
              <p className="text-xs text-gray-500 font-medium mt-2">
                For mind maps: Add topic/keyword for each image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Images will be automatically resized to 80x80px
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Previews with Topic Input */}
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex gap-3">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-700 block mb-1">
                        Topic/Keyword *
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Neural Network, Planning, DNA..."
                        value={image.topic}
                        onChange={(e) => updateTopic(index, e.target.value)}
                        disabled={disabled}
                        className="h-8 text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2"
                      onClick={() => removeImage(index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This image will appear next to &quot;{image.topic || 'the topic'}&quot; in the diagram
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
