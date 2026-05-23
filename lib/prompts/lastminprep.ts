export function buildLastMinPrepPrompt(params: {
  class: string;
  subject: string;
  topic: string;
  depth: 'quick' | 'deep';
  language: string;
}): string {
  return `Generate a Last Minute Prep card for a teacher.

Class: ${params.class}
Subject: ${params.subject}
Topic: ${params.topic}
Depth: ${params.depth} (quick = condensed 1-2 min read, deep = comprehensive 3-5 min read)
Teacher Notes Language: ${params.language}

Return JSON:
{
  "core_concept": "",
  "key_points": [],
  "must_know_terms": [{ "term": "", "definition": "" }],
  "common_confusions": [],
  "best_analogy": "",
  "quick_questions": [],
  "teacher_notes": ""
}

${params.depth === 'quick'
    ? 'Depth is quick: populate ONLY core_concept (2-3 sentences), key_points (max 5 points), best_analogy (1 sentence), teacher_notes. Leave other fields as empty arrays/strings.'
    : 'Depth is deep: populate ALL fields fully. key_points: 6-8 items. must_know_terms: 4-6 terms. common_confusions: 3-4 items. quick_questions: 3 questions.'
  }
Teacher Notes in ${params.language}. All other content in English.`;
}
