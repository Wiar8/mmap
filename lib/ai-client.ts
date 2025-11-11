import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { MapType, ImageWithTopic } from "@/types";

export interface GenerateMermaidOptions {
  topic: string;
  description?: string;
  mapType: MapType;
  images?: ImageWithTopic[];
}

export async function generateMermaidDiagram(
  options: GenerateMermaidOptions
): Promise<string> {
  const { topic, description, mapType, images } = options;

  // Build image information for the prompt
  const imageInfo = images && images.length > 0
    ? images.map(img => `- "${img.topic}"`).join('\n')
    : '';

  const mapTypeInstructions = {
    mindmap: `Use Mermaid mindmap syntax. Start with "mindmap" and use proper indentation:
mindmap
  root((Central Topic))
    Branch 1
      Sub-topic 1.1
      Sub-topic 1.2
    Branch 2

${images && images.length > 0 ? `IMPORTANT FOR IMAGES:
When you create a node that matches one of these topics, add [IMAGE] immediately after the topic name:
${imageInfo}

Example:
  Neural Network [IMAGE]
  Deep Learning [IMAGE]

The [IMAGE] marker will be replaced with the actual image. Use it ONLY for topics that have associated images.` : ''}`,
    concept: `Use Mermaid graph TD syntax for concept maps with labeled relationships:
graph TD
    A[Concept 1] -->|relationship| B[Concept 2]
    B -->|another relationship| C[Concept 3]`,
    flowchart: `Use Mermaid flowchart syntax:
flowchart TD
    Start([Start]) --> Process[Process Step]
    Process --> Decision{Decision?}
    Decision -->|Yes| End([End])
    Decision -->|No| Process`,
    sequence: `Use Mermaid sequence diagram syntax:
sequenceDiagram
    participant A
    participant B
    A->>B: Message
    B-->>A: Response`,
  };

  const prompt = `You are a diagram expert. Create a Mermaid diagram based on the following information:

Topic: ${topic}
${description ? `Description: ${description}` : ""}
${
  images && images.length > 0
    ? `\nUser has provided ${images.length} image(s) for these topics:\n${imageInfo}\n`
    : ""
}

Diagram Type: ${mapType}

${mapTypeInstructions[mapType]}

IMPORTANT RULES:
1. Return ONLY the Mermaid code, no explanations or markdown code blocks
2. Do not wrap the code in \`\`\`mermaid or any other formatting
3. Ensure the syntax is valid Mermaid ${mapType} syntax
4. Keep it clear, well-structured, and easy to understand
5. For mind maps, use proper indentation (2 spaces per level)
6. Make sure all connections and relationships make logical sense
${mapType === 'mindmap' && images && images.length > 0 ? '7. Add [IMAGE] marker after topics that have associated images' : ''}

Generate the Mermaid diagram now:`;

  try {
    const result = await generateText({
      model: google("gemini-flash-lite-latest"),
      prompt,
      temperature: 0.7,
    });

    let mermaidCode = result.text.trim();

    // Clean up the response - remove markdown code blocks if present
    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, "");
    mermaidCode = mermaidCode.replace(/```\n?/g, "");
    mermaidCode = mermaidCode.trim();

    // For mind maps, replace [IMAGE] markers with actual image references
    if (mapType === 'mindmap' && images && images.length > 0) {
      mermaidCode = injectImagesIntoMindmap(mermaidCode, images);
    }

    return mermaidCode;
  } catch (error) {
    console.error("Error generating diagram:", error);
    throw new Error("Failed to generate diagram. Please try again.");
  }
}

/**
 * Injects images into mind map code by replacing [IMAGE] markers
 * or by finding matching topics and adding images after them
 */
function injectImagesIntoMindmap(
  mermaidCode: string,
  images: ImageWithTopic[]
): string {
  let result = mermaidCode;

  // Create a map of topics to images for quick lookup
  const topicToImage = new Map(
    images.map(img => [img.topic.toLowerCase().trim(), img.base64])
  );

  // First, try to replace explicit [IMAGE] markers
  images.forEach(img => {
    const topic = img.topic;
    // Look for the topic followed by [IMAGE] marker
    const regex = new RegExp(`(\\s*)(${escapeRegex(topic)})\\s*\\[IMAGE\\]`, 'gi');
    result = result.replace(regex, (match, indent, topicText) => {
      return `${indent}${topicText}\n${indent}  <img src="${img.base64}" width="80" height="80"/>`;
    });
  });

  // If no [IMAGE] markers were found, try to find topics and add images
  if (result === mermaidCode) {
    const lines = result.split('\n');
    const newLines: string[] = [];

    lines.forEach(line => {
      newLines.push(line);

      // Check if this line contains any of our topics
      const trimmedLine = line.trim();
      for (const [topic, base64] of topicToImage) {
        // Simple check if topic is in the line (case insensitive)
        if (trimmedLine.toLowerCase().includes(topic)) {
          // Get the indentation of the current line
          const indent = line.match(/^\s*/)?.[0] || '';
          // Add the image on the next line with more indentation
          newLines.push(`${indent}  <img src="${base64}" width="80" height="80"/>`);
          break; // Only add one image per line
        }
      }
    });

    result = newLines.join('\n');
  }

  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
