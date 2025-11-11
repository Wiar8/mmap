export type MapType = 'mindmap' | 'concept' | 'flowchart' | 'sequence';

export interface ImageWithTopic {
  base64: string;
  topic: string; // keyword/topic this image represents
}

export interface MapGenerationRequest {
  topic: string;
  description?: string;
  mapType: MapType;
  images?: ImageWithTopic[]; // images with associated topics
}

export interface MapGenerationResponse {
  mermaidCode: string;
  success: boolean;
  error?: string;
}

export interface ImageUpload {
  file: File;
  preview: string;
  base64?: string;
  topic: string; // keyword/topic this image represents
}
