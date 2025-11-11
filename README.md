# MMAP - AI-Powered Mind Map Generator

Generate beautiful mind maps, concept maps, flowcharts, and sequence diagrams using AI. Built with Next.js, Vercel AI SDK, and Google Gemini.

## Features

- **AI-Powered Generation**: Automatically create diagrams from text descriptions
- **Multiple Diagram Types**: Mind maps, concept maps, flowcharts, and sequence diagrams
- **Image Support**: Upload images to provide additional context (optional)
- **PNG Export**: Download your diagrams as high-quality PNG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **AI**: Vercel AI SDK with Google Gemini
- **Diagrams**: Mermaid.js
- **Export**: html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` or edit the existing `.env.local`
   - Add your Google Gemini API key:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a Topic**: Describe what you want to visualize (e.g., "Machine Learning Concepts")
2. **Add Description** (optional): Provide more details to help AI generate a better diagram
3. **Select Diagram Type**: Choose from mind map, concept map, flowchart, or sequence diagram
4. **Upload Images** (optional): Add reference images to provide visual context
5. **Generate**: Click "Generate Diagram" and watch AI create your visualization
6. **Export**: Download your diagram as a PNG file

## Example Topics

- "Machine Learning fundamentals and key algorithms"
- "Project management workflow from planning to deployment"
- "Biology: Cell structure and organelles"
- "Web development technologies and their relationships"
- "Software development lifecycle phases"

## Project Structure

```
mmap/
├── app/
│   ├── api/generate-map/    # API endpoint for AI generation
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── map-input-form.tsx    # Input form component
│   ├── map-display.tsx       # Mermaid diagram renderer
│   ├── image-uploader.tsx    # Image upload component
│   └── export-button.tsx     # PNG export component
├── lib/
│   ├── utils.ts              # Utility functions
│   ├── ai-client.ts          # Vercel AI SDK integration
│   └── diagram-converter.ts  # Mermaid syntax validation
└── types/
    └── index.ts              # TypeScript type definitions
```

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint

## How It Works

1. User enters topic and preferences in the form
2. Frontend sends request to `/api/generate-map` endpoint
3. API calls Google Gemini using Vercel AI SDK with a structured prompt
4. AI generates valid Mermaid.js syntax based on the diagram type
5. Response is validated and cleaned
6. Mermaid.js renders the diagram in the browser
7. User can export the diagram as a PNG file

## Supported Diagram Types

### Mind Map
Hierarchical visualization of ideas branching from a central concept.

### Concept Map
Network-style diagram showing relationships between concepts with labeled connections.

### Flowchart
Step-by-step process flow with decision points and paths.

### Sequence Diagram
Interaction between entities over time, useful for workflows and communication patterns.
