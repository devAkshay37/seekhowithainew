export function buildActivityPrompt(params: {
  class: string;
  subject: string;
  topic: string;
  activity_type: 'solo' | 'group';
  group_size?: string;
  duration: number;
}): string {
  return `Generate a classroom activity for the following configuration.

Class: ${params.class}
Subject: ${params.subject}
Topic: ${params.topic}
Activity Type: ${params.activity_type}
${params.group_size ? `Group Size: ${params.group_size} students` : ''}
Duration: ${params.duration} minutes

Return JSON:
{
  "objectives": [],
  "sel_structure": { "framework": "", "competencies": [], "description": "" },
  "real_world_connection": "",
  "materials_needed": [],
  "instructions": [{ "step": 1, "instruction": "" }],
  "assessment": { "criteria": [], "method": "" }
}

Rules:
- Activity must be completable within ${params.duration} minutes
- Materials must ONLY include items available in a typical Indian classroom (paper, pencils, blackboard, textbooks, etc.)
- objectives: 3–4 measurable learning outcomes
- sel_structure.framework must be one of: "Self-Awareness", "Social Awareness", "Relationship Skills", "Responsible Decision-Making"
- sel_structure.competencies: 2–3 specific skills
- instructions: step-by-step numbered guide with clear teacher language
${params.activity_type === 'group'
    ? `- Group activity: instructions MUST include role assignments for group members (leader, recorder, presenter, etc.)`
    : '- Solo activity: instructions should be individual and self-paced'
  }
- assessment.criteria: 3–4 observable criteria
- assessment.method: how the teacher evaluates (observation, checklist, verbal, etc.)`;
}
