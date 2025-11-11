import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { MapType } from "@/types";

export interface GenerateMermaidOptions {
  topic: string;
  description?: string;
  mapType: MapType;
  images?: string[];
}

export async function generateMermaidDiagram(
  options: GenerateMermaidOptions
): Promise<string> {
  const { topic, description, mapType, images } = options;

  const mapTypeInstructions = {
    mindmap: `Use Mermaid mindmap syntax. Start with "mindmap" and use proper indentation:
mindmap
  root((Central Topic))
    Branch 1
      Sub-topic 1.1
      Sub-topic 1.2
    Branch 2`,
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
    ? `Note: User has provided ${images.length} image(s). Consider any visual information if relevant.`
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

    return mermaidCode;
  } catch (error) {
    console.error("Error generating diagram:", error);
    throw new Error("Failed to generate diagram. Please try again.");
  }
}
