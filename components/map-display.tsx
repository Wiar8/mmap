'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MapDisplayProps {
  mermaidCode: string;
  title?: string;
}

export function MapDisplay({ mermaidCode, title = 'Generated Diagram' }: MapDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      logLevel: 'error',
    });
    setIsInitialized(true);
  }, []);

  // Render diagram when code changes
  useEffect(() => {
    if (!isInitialized || !mermaidCode || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(null);

        // Clear previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidCode);

        // Insert the SVG
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to render diagram. Please try generating again.'
        );
      }
    };

    renderDiagram();
  }, [mermaidCode, isInitialized]);

  if (!mermaidCode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Diagram</CardTitle>
          <CardDescription>
            Fill out the form and click &quot;Generate Diagram&quot; to see your map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>No diagram generated yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Your AI-generated diagram is ready
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div
            ref={containerRef}
            className="mermaid-container overflow-auto p-4 bg-white rounded-lg border border-gray-200"
            style={{ minHeight: '400px' }}
          />
        )}
      </CardContent>
    </Card>
  );
}
