export function buildMindmapPrompt(params: {
  class: string;
  subject: string;
  topic: string;
  depth: 'broad' | 'standard' | 'detailed';
}): string {
  const depthGuide = {
    broad: '4–5 branches, 2–3 children each',
    standard: '6–7 branches, 3–4 children each',
    detailed: '8–9 branches, 4–5 children each',
  }[params.depth];

  return `Generate a mindmap node structure for the following topic.

Class: ${params.class}
Subject: ${params.subject}
Topic: ${params.topic}
Depth: ${params.depth}

Return JSON:
{
  "central_node": "",
  "branches": [
    {
      "id": "b1",
      "label": "",
      "color": "#hexcode",
      "children": [
        { "id": "b1c1", "label": "", "detail": "" }
      ]
    }
  ]
}

Depth guide: ${depthGuide}
Assign distinct, visually appealing hex colors to each branch (use educational color palette: blues, greens, purples, oranges, teals, pinks - avoid very light or very dark colors).
Each child "detail" should be 1 sentence explaining the concept.
central_node should be the topic name itself.`;
}
