'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from './image-uploader';
import type { MapType, ImageUpload } from '@/types';
import { Loader2 } from 'lucide-react';

interface MapInputFormProps {
  onGenerate: (data: {
    topic: string;
    description: string;
    mapType: MapType;
    images: ImageUpload[];
  }) => void;
  isLoading?: boolean;
}

export function MapInputForm({ onGenerate, isLoading = false }: MapInputFormProps) {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [mapType, setMapType] = useState<MapType>('mindmap');
  const [images, setImages] = useState<ImageUpload[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onGenerate({
      topic,
      description,
      mapType,
      images,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your Map</CardTitle>
        <CardDescription>
          Enter your topic and let AI generate a visual diagram
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Machine Learning, Project Planning, Biology..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about what you want to visualize..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Map Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="mapType">Diagram Type</Label>
            <Select
              value={mapType}
              onValueChange={(value) => setMapType(value as MapType)}
              disabled={isLoading}
            >
              <SelectTrigger id="mapType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mindmap">Mind Map</SelectItem>
                <SelectItem value="concept">Concept Map</SelectItem>
                <SelectItem value="flowchart">Flowchart</SelectItem>
                <SelectItem value="sequence">Sequence Diagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Uploader */}
          <div className="space-y-2">
            <Label>Images (Optional)</Label>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              disabled={isLoading}
            />
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!topic.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Diagram'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
