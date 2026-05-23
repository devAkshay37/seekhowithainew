export function buildTeachPackPrompt(params: {
  board: string;
  class: string;
  subject: string;
  topic: string;
  number_of_lectures: number;
  duration: number;
  language: string;
}): string {
  return `Generate a complete TeachPack for the following lesson.
The lesson must be divided into exactly ${params.number_of_lectures} lecture(s).

Board: ${params.board}
Class: ${params.class}
Subject: ${params.subject}
Topic: ${params.topic}
Duration per Lecture: ${params.duration} minutes
Teacher Notes Language: ${params.language}

Return a JSON object matching this exact schema:
{
  "lectures": [
    {
      "lecture_number": 1,
      "lecture_title": "Title of this specific lecture",
      "lesson_overview": { "concept_summary": "", "learning_goals": [], "key_ideas": [] },
      "learning_objectives": [],
      "teaching_flow": [{ "step": 1, "phase": "", "description": "", "duration": "" }],
      "teacher_explanation": { "concept_breakdown": "", "analogies": [], "real_life_examples": [], "teaching_tips": [] },
      "classroom_questions": { "recall": [], "understanding": [], "application": [], "critical_thinking": [] },
      "teacher_notes": ""
    }
  ]
}

Teacher Notes must be written entirely in ${params.language}.
Teaching flow for each lecture must fit within ${params.duration} minutes total.
All other content in English.
For EACH lecture:
- learning_goals should have 3–5 items. key_ideas should have 4–6 items.
- learning_objectives should have 4–6 measurable outcomes.
- teaching_flow should have 5–7 steps covering the full lecture time.
- classroom_questions: at least 3 questions per type.`;
}
