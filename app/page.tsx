'use client';

import { useState, useRef } from 'react';
import { MapInputForm } from '@/components/map-input-form';
import { MapDisplay } from '@/components/map-display';
import { ExportButton } from '@/components/export-button';
import type { ImageUpload, MapType } from '@/types';

export default function Home() {
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (data: {
    topic: string;
    description: string;
    mapType: MapType;
    images: ImageUpload[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: data.topic,
          description: data.description,
          mapType: data.mapType,
          images: data.images
            .filter((img) => img.base64 && img.topic.trim()) // Only include images with both base64 and topic
            .map((img) => ({
              base64: img.base64!,
              topic: img.topic.trim(),
            })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMermaidCode(result.mermaidCode);
      } else {
        setError(result.error || 'Failed to generate diagram');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while generating the diagram. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">MMAP</h1>
          <p className="text-gray-600 mt-1">AI-Powered Mind Map Generator</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-4">
            <MapInputForm onGenerate={handleGenerate} isLoading={isLoading} />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Right Column - Diagram Display */}
          <div className="space-y-4">
            <div ref={diagramRef}>
              <MapDisplay mermaidCode={mermaidCode} />
            </div>

            {mermaidCode && (
              <ExportButton
                targetRef={diagramRef}
                filename="mmap-diagram"
                disabled={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Powered by Vercel AI SDK and Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}
