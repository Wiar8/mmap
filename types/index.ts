export type MapType = 'mindmap' | 'concept' | 'flowchart' | 'sequence';

export interface MapGenerationRequest {
  topic: string;
  description?: string;
  mapType: MapType;
  images?: string[]; // base64 encoded images
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
}
