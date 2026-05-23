# Database Schema

SeekhoWithAI uses Supabase (PostgreSQL) for data persistence.

## Tables Overview

### 1. `profiles`
Extends the core `auth.users` through a linked ID.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | References `auth.users(id)`. |
| `full_name` | `text` | User's full name. |
| `school_name` | `text` | Name of the user's school. |
| `mobile` | `text` | Contact number. |
| `board` | `text` | 'CBSE', 'ICSE', or 'State Board'. |
| `classes` | `text[]` | Array of classes taught (e.g., ['6', '7']). |
| `subjects` | `text[]` | Array of subjects taught (e.g., ['Science']). |
| `language_preference`| `text` | 'English', 'Hindi', 'Marathi', or 'Gujarati'. |
| `onboarding_complete`| `boolean`| Status of user onboarding. |

### 2. `teachpacks`
Storage for all generated lesson packages.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Owner of the TeachPack. |
| `title` | `text` | Topic or Chapter name. |
| `class` | `text` | Target class level. |
| `subject` | `text` | Subject name. |
| `content` | `jsonb` | Structured lesson content. |
| `addons` | `jsonb` | Array of add-ons (Worksheets, etc.). |
| `is_starred` | `boolean`| Flag for favorites. |

### 3. `lastminpreps`
Storage for prep cards.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Owner of the prep card. |
| `topic` | `text` | Topic title. |
| `depth` | `text` | 'quick' or 'deep'. |
| `content` | `jsonb` | Structured prep JSON. |

### 4. `mindmaps`
Storage for generated mindmap node trees.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Owner of the mindmap. |
| `content` | `jsonb` | Node tree structure (branches, labels, colors). |

### 5. `quizzes` / `activities`
Similar structures storing tool-specific JSON content linked to users.

---

## Content JSON Structures (Drafts)

### TeachPack `content` Structure
```json
{
  "lesson_overview": {
    "concept_summary": "string",
    "learning_goals": ["string"],
    "key_ideas": ["string"]
  },
  "learning_objectives": ["string"],
  "teaching_flow": [
    { "step": "number", "phase": "string", "description": "string", "duration": "string" }
  ],
  "teacher_explanation": {
    "concept_breakdown": "string",
    "analogies": ["string"],
    "real_life_examples": ["string"],
    "teaching_tips": ["string"]
  },
  "classroom_questions": {
    "recall": ["string"],
    "understanding": ["string"],
    "application": ["string"],
    "critical_thinking": ["string"]
  },
  "teacher_notes": "string"
}
```

---

## Row Level Security (RLS)
Security is enforced for each table:
- **SELECT**: Authenticated user can only read rows where `user_id == auth.uid()`.
- **INSERT**: Authenticated user can only insert rows where `user_id == auth.uid()`.
- **UPDATE/DELETE**: User can only modify their own data.
