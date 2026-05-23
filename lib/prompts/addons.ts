export function buildWorksheetPrompt(params: { topic: string; class: string; subject: string }): string {
  return `Generate a student worksheet for Class ${params.class}, ${params.subject}, Topic: ${params.topic}.

Include exactly:
- MCQ: 3 questions (4 options each, 1 correct)
- Fill in the Blanks: 3 questions
- Match the Following: 1 set of 5 pairs
- Short Answer: 2 questions (2–3 sentences each)
- Long Answer: 1 question (paragraph answer)

Return JSON: { "sections": [{ "type": "", "questions": [{ "id": "", "question": "", "options": [], "answer": "" }] }] }`;
}

export function buildAssessmentPrompt(params: { topic: string; class: string; subject: string }): string {
  return `Generate a 5-question exit ticket for Class ${params.class}, ${params.subject}, Topic: ${params.topic}.
Mix question types. Max 2 minutes to complete. Questions must be quick to answer.

Return JSON: { "questions": [{ "id": "", "type": "", "question": "", "answer": "" }] }`;
}

export function buildHomeworkPrompt(params: { topic: string; class: string; subject: string }): string {
  return `Generate a homework sheet for Class ${params.class}, ${params.subject}, Topic: ${params.topic}.
Include: 2 practice problems, 2 short answer questions, 1 creative/application task suitable for home.

Return JSON: { "sections": [{ "type": "", "title": "", "questions": [{ "id": "", "question": "", "answer": "" }] }] }`;
}

export function buildMoreAnalogiesPrompt(params: { topic: string; class: string; subject: string }): string {
  return `Generate 3 creative, memorable analogies for teaching "${params.topic}" to Class ${params.class} ${params.subject} students in India.
Each analogy should use a familiar everyday object or situation.

Return JSON: { "analogies": ["", "", ""] }`;
}

export function buildMoreExamplesPrompt(params: { topic: string; class: string; subject: string }): string {
  return `Generate 5 real-life examples that demonstrate "${params.topic}" for Class ${params.class} ${params.subject} students.
Examples must be relatable to Indian students' daily life and experiences.

Return JSON: { "examples": ["", "", "", "", ""] }`;
}
