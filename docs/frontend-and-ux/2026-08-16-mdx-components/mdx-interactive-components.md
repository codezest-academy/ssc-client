# Interactive MDX Components

This document outlines the interactive components available to content creators within the MDX renderer of the SSC CGL learning platform. These components are designed to enhance the visual appeal and pedagogical effectiveness of lessons.

## 1. Zoomable Images (`<ZoomableImage />`)

To provide a better experience for students viewing complex charts, dense math screenshots, or detailed diagrams, all images within lessons are automatically wrapped in a Lightbox.

- **How it works:** Content creators simply use standard Markdown image syntax (`![alt text](image.url)`).
- **Behavior:** The `MdxRenderer` intercepts the standard `<img>` tag and replaces it with the `<ZoomableImage />` React component. When clicked, the image expands into a full-screen, backdrop-blurred fixed modal. It supports smooth scale animations and can be dismissed via a click or the `Esc` key.

## 2. Text-to-Diagram Mindmaps (`<Mindmap />`)

For subjects that benefit from visual relationship mapping (e.g., Indian History timelines, Biology taxonomies), the platform supports Mermaid.js diagrams directly within MDX.

- **How to use:** Content creators can explicitly invoke the `<Mindmap />` component in the `.mdx` file, passing the Mermaid syntax as the `chart` prop.

```mdx
<Mindmap chart={`
graph TD;
    A[Start] --> B{Is it?};
    B -- Yes --> C[OK];
    B -- No ----> D[Cancel];
`} />
```

- **Behavior:** The component dynamically loads the `mermaid` library on the client-side, parses the syntax, and renders an SVG diagram.
- **Theming:** The diagram is automatically themed with the platform's primary CodeZest Indigo brand colors (`#e0e7ff`, `#818cf8`) and adapts to the clean UI aesthetics.
- **Resilience:** If there is a syntax error in the diagram string, the component gracefully catches it and displays a syntax error boundary, preventing the entire lesson page from crashing.
