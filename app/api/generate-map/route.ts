import { NextRequest, NextResponse } from 'next/server';
import { generateMermaidDiagram } from '@/lib/ai-client';
import { prepareMermaidForRender } from '@/lib/diagram-converter';
import type { MapType, MapGenerationRequest, MapGenerationResponse } from '@/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body: MapGenerationRequest = await req.json();
    const { topic, description, mapType, images } = body;

    // Validate input
    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!mapType || !['mindmap', 'concept', 'flowchart', 'sequence'].includes(mapType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid map type' },
        { status: 400 }
      );
    }

    // Generate the diagram using AI
    const mermaidCode = await generateMermaidDiagram({
      topic: topic.trim(),
      description: description?.trim(),
      mapType: mapType as MapType,
      images,
    });

    // Validate and prepare the code for rendering
    const preparedCode = prepareMermaidForRender(mermaidCode, mapType as MapType);

    const response: MapGenerationResponse = {
      mermaidCode: preparedCode,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in generate-map API:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while generating the diagram';

    const response: MapGenerationResponse = {
      mermaidCode: '',
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
