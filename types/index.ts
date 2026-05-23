// ============================================================
// SeekhoWithAI - TypeScript Types
// ============================================================

// ─── Profile ────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string;
  school_name?: string;
  mobile?: string;
  board?: 'CBSE' | 'ICSE' | 'State Board';
  classes?: string[];
  subjects?: string[];
  language_preference: 'English' | 'Hindi' | 'Marathi' | 'Gujarati';
  onboarding_complete: boolean;
  created_at: string;
}

// ─── TeachPack ───────────────────────────────────────────────
export interface TeachPackLecture {
  lecture_number: number;
  lecture_title: string;
  lesson_overview: {
    concept_summary: string;
    learning_goals: string[];
    key_ideas: string[];
  };
  learning_objectives: string[];
  teaching_flow: Array<{
    step: number;
    phase: string;
    description: string;
    duration: string;
  }>;
  teacher_explanation: {
    concept_breakdown: string;
    analogies: string[];
    real_life_examples: string[];
    teaching_tips: string[];
  };
  classroom_questions: {
    recall: string[];
    understanding: string[];
    application: string[];
    critical_thinking: string[];
  };
  teacher_notes: string;
}

export interface TeachPackContent {
  lectures: TeachPackLecture[];
}

export interface AddOn {
  type: 'worksheet' | 'assessment' | 'homework' | 'analogies' | 'examples';
  content: Record<string, unknown>;
}

export interface TeachPack {
  id: string;
  user_id: string;
  title: string;
  board?: string;
  class?: string;
  subject?: string;
  topic: string;
  duration?: number;
  language?: string;
  content: TeachPackContent;
  addons: AddOn[];
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Last Min Prep ───────────────────────────────────────────
export interface LastMinPrepContent {
  core_concept: string;
  key_points: string[];
  must_know_terms: Array<{ term: string; definition: string }>;
  common_confusions: string[];
  best_analogy: string;
  quick_questions: string[];
  teacher_notes: string;
}

export interface LastMinPrep {
  id: string;
  user_id: string;
  class?: string;
  subject?: string;
  topic: string;
  depth: 'quick' | 'deep';
  content: LastMinPrepContent;
  created_at: string;
}

// ─── Mindmap ─────────────────────────────────────────────────
export interface MindmapChild {
  id: string;
  label: string;
  detail: string;
}

export interface MindmapBranch {
  id: string;
  label: string;
  color: string;
  children: MindmapChild[];
}

export interface MindmapContent {
  central_node: string;
  branches: MindmapBranch[];
}

export interface Mindmap {
  id: string;
  user_id: string;
  class?: string;
  subject?: string;
  topic: string;
  depth: 'broad' | 'standard' | 'detailed';
  content: MindmapContent;
  is_starred: boolean;
  created_at: string;
}

// ─── Quiz ─────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  marks: number;
}

export interface QuizSection {
  type: 'MCQ' | 'Fill in the Blanks' | 'Match the Following' | 'Short Answer' | 'Long Answer';
  marks_per_question: number;
  questions: QuizQuestion[];
}

export interface QuizContent {
  paper_header: {
    title: string;
    class: string;
    subject: string;
    duration: string;
    total_marks: number;
  };
  sections: QuizSection[];
}

export interface Quiz {
  id: string;
  user_id: string;
  class?: string;
  subject?: string;
  topics?: string[];
  total_marks?: number;
  duration?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  question_types?: string[];
  include_answer_key: boolean;
  content: QuizContent;
  is_starred: boolean;
  created_at: string;
}

// ─── Activity ────────────────────────────────────────────────
export interface ActivityContent {
  objectives: string[];
  sel_structure: {
    framework: string;
    competencies: string[];
    description: string;
  };
  real_world_connection: string;
  materials_needed: string[];
  instructions: Array<{ step: number; instruction: string }>;
  assessment: {
    criteria: string[];
    method: string;
  };
}

export interface Activity {
  id: string;
  user_id: string;
  class?: string;
  subject?: string;
  topic: string;
  activity_type?: 'solo' | 'group';
  group_size?: '2-3' | '4-5' | '6+';
  duration?: number;
  content: ActivityContent;
  is_starred: boolean;
  created_at: string;
}

// ─── Form Input Types ─────────────────────────────────────────
export interface TeachPackFormInput {
  board: string;
  class: string;
  subject: string;
  topic: string;
  number_of_lectures: number;
  duration: 30 | 45 | 60;
  language: 'English' | 'Hindi' | 'Marathi' | 'Gujarati';
}

export interface LastMinPrepFormInput {
  class: string;
  subject: string;
  topic: string;
  depth: 'quick' | 'deep';
}

export interface MindmapFormInput {
  class: string;
  subject: string;
  topic: string;
  depth: 'broad' | 'standard' | 'detailed';
}

export interface QuizFormInput {
  class: string;
  subject: string;
  topics: string;
  total_marks: number;
  duration: 30 | 45 | 60 | 90;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  question_types: string[];
  include_answer_key: boolean;
}

export interface ActivityFormInput {
  class: string;
  subject: string;
  topic: string;
  activity_type: 'solo' | 'group';
  group_size?: '2-3' | '4-5' | '6+';
  duration: 10 | 15 | 20 | 30;
}

// ─── API Response Types ───────────────────────────────────────
export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export interface GenerationState<T> {
  status: GenerationStatus;
  data: T | null;
  error: string | null;
}

// ─── Library Item (for display cards) ────────────────────────
export interface LibraryItem {
  id: string;
  title: string;
  topic: string;
  subject?: string;
  class?: string;
  is_starred: boolean;
  created_at: string;
  type: 'teachpack' | 'lastminprep' | 'mindmap' | 'quiz' | 'activity';
}
