export function buildQuizPrompt(params: {
  class: string;
  subject: string;
  topics: string;
  total_marks: number;
  duration: number;
  difficulty: string;
  question_types: string[];
  include_answer_key: boolean;
}): string {
  return `Generate a test paper for the following configuration.

Class: ${params.class}
Subject: ${params.subject}
Topics: ${params.topics}
Total Marks: ${params.total_marks}
Duration: ${params.duration} minutes
Difficulty: ${params.difficulty}
Question Types: ${params.question_types.join(', ')}
Include Answer Key: ${params.include_answer_key}

Distribute marks across question types proportionally.
MCQ = 1 mark each. Short Answer = 2–3 marks. Long Answer = 5 marks. Fill in the Blanks = 1 mark each. Match the Following = 1 mark per pair.

Return JSON:
{
  "paper_header": { "title": "", "class": "", "subject": "", "duration": "", "total_marks": 0 },
  "sections": [
    {
      "type": "",
      "marks_per_question": 0,
      "questions": [
        { "id": "q1", "question": "", "options": [], "answer": "", "marks": 0 }
      ]
    }
  ]
}

Rules:
- options array ONLY for MCQ questions (4 options each), leave empty array [] for other types
- answer field ALWAYS populated for all question types
- For Match the Following, format question as "Match Column A with Column B" and list pairs in options
- Total marks of all questions must equal ${params.total_marks}
- paper_header.title format: "${params.subject} Test Paper"`;
}
