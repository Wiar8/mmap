import type { MapType } from '@/types';

/**
 * Validates and cleans Mermaid diagram code
 */
export function validateMermaidCode(code: string, mapType: MapType): string {
  let cleanedCode = code.trim();

  // Remove any markdown code block wrappers
  cleanedCode = cleanedCode.replace(/```mermaid\n?/g, '');
  cleanedCode = cleanedCode.replace(/```\n?/g, '');
  cleanedCode = cleanedCode.trim();

  // Validate that the code starts with the expected diagram type
  const expectedStarts: Record<MapType, string[]> = {
    mindmap: ['mindmap'],
    concept: ['graph TD', 'graph LR', 'graph'],
    flowchart: ['flowchart TD', 'flowchart LR', 'flowchart'],
    sequence: ['sequenceDiagram']
  };

  const validStart = expectedStarts[mapType].some(start =>
    cleanedCode.toLowerCase().startsWith(start.toLowerCase())
  );

  if (!validStart) {
    throw new Error(`Invalid ${mapType} diagram syntax. Expected to start with ${expectedStarts[mapType].join(' or ')}`);
  }

  return cleanedCode;
}

/**
 * Adds helpful defaults or fixes common issues in Mermaid code
 */
export function enhanceMermaidCode(code: string): string {
  // Remove any extra blank lines
  let enhanced = code.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Ensure proper spacing
  enhanced = enhanced.trim();

  return enhanced;
}

/**
 * Converts Mermaid code to a format optimized for rendering
 */
export function prepareMermaidForRender(code: string, mapType: MapType): string {
  let prepared = validateMermaidCode(code, mapType);
  prepared = enhanceMermaidCode(prepared);
  return prepared;
}
