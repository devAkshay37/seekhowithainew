# SeekhoWithAI — Product Requirements Document
**Version:** 1.0 — MVP  
**Stack:** Next.js 15 (App Router) · Supabase (DB + Auth) · Gemini Flash API  
**Date:** March 2026  
**Prepared for:** Claude Code

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Database Schema](#3-database-schema)
4. [Authentication & Onboarding](#4-authentication--onboarding)
5. [App Structure & Navigation](#5-app-structure--navigation)
6. [Tools — Feature Specs](#6-tools--feature-specs)
   - 6.1 TeachPack
   - 6.2 Last Min Prep
   - 6.3 Mindmap Creator
   - 6.4 Quiz / Test Paper Creator
   - 6.5 Activity Generator
7. [AI Prompt Architecture](#7-ai-prompt-architecture)
8. [PDF Export](#8-pdf-export)
9. [UI/UX Guidelines](#9-uiux-guidelines)
10. [Supabase RLS Policies](#10-supabase-rls-policies)
11. [Environment Variables](#11-environment-variables)
12. [Folder Structure](#12-folder-structure)
13. [Out of Scope (Post-MVP)](#13-out-of-scope-post-mvp)

---

## 1. Product Overview

**SeekhoWithAI** is an AI-powered teaching companion for school teachers. It transforms any lesson topic into a complete, classroom-ready teaching experience in seconds.

### One-Line Definition
> An intelligent teaching companion that transforms any lesson into a complete, classroom-ready teaching experience within seconds.

### Core Value Prop
- Teachers spend hours preparing lessons — SeekhoWithAI does it in seconds
- Every output is structured, curriculum-aligned, and ready to use
- Supports Teacher Notes in Hindi, Marathi, and Gujarati
- Works on both mobile and desktop browsers

### Primary Users
- **Teachers** — primary school, middle school, subject teachers
- **HODs / Academic Coordinators** — oversight, quality, consistency (Phase 2)

### Tools in MVP
| Tool | Purpose |
|------|---------|
| TeachPack | Full lesson content package |
| Last Min Prep | Rapid revision card before class |
| Mindmap Creator | Visual interactive concept map |
| Quiz / Test Paper | Printable test paper with answer key |
| Activity Generator | SEL-structured solo/group activities |

---

## 2. Tech Stack & Architecture

### Starting Template
```bash
npx create-next-app -e with-supabase
```
This gives: Next.js 15 + Supabase SSR auth + shadcn/ui + middleware + TypeScript. No extra boilerplate.

### Core Stack
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Official Supabase Starter as base |
| Database | Supabase (PostgreSQL) | Auth + DB + RLS |
| Auth | Supabase Auth (email/password) | SSR via `@supabase/ssr` — NOT legacy auth-helpers |
| AI Generation | Google Gemini Flash API (`gemini-1.5-flash`) | Server-side only |
| UI Components | shadcn/ui + Tailwind CSS | Install via `npx shadcn@latest add` |
| PDF Export | `@react-pdf/renderer` | Via `/api/export/pdf` route |
| Deployment | Vercel | Auto-deploy from GitHub main |

### Architecture Notes
- All AI generation happens via **Next.js API routes only** — never client-side (API key protection)
- Use `@supabase/ssr` throughout — **not** legacy `@supabase/auth-helpers-nextjs`
- All routes under `/app` are protected (middleware auth check)
- Gemini calls are made server-side via `/api/generate/*` routes
- **No DexieJS in MVP** — offline layer is Phase 2
- **No Zustand** — use React state + Supabase queries directly

### API Routes Required
```
POST /api/generate/teachpack
POST /api/generate/lastminprep
POST /api/generate/mindmap
POST /api/generate/quiz
POST /api/generate/activity
POST /api/generate/addon          ← for worksheets, assessments, extras
POST /api/export/pdf
```

---

## 3. Database Schema

### `profiles` table
Extends Supabase `auth.users`. Created on sign-up via trigger.

```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  school_name text,
  mobile text,
  board text,                        -- 'CBSE' | 'ICSE' | 'State Board'
  classes text[],                    -- e.g. ['6', '7', '8']
  subjects text[],                   -- e.g. ['Science', 'Maths']
  language_preference text default 'English',  -- 'English' | 'Hindi' | 'Marathi' | 'Gujarati'
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);
```

### `teachpacks` table
```sql
create table teachpacks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  board text,
  class text,
  subject text,
  topic text not null,
  duration integer,                  -- 30 | 45 | 60
  language text,
  content jsonb not null,            -- structured TeachPack JSON (see schema below)
  addons jsonb default '[]',         -- array of addon objects
  is_starred boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `teachpacks.content` JSON schema
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

#### `teachpacks.addons` JSON schema
```json
[
  {
    "type": "worksheet | assessment | homework | analogies | examples",
    "content": {}
  }
]
```

### `lastminpreps` table
```sql
create table lastminpreps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  class text,
  subject text,
  topic text not null,
  depth text,                        -- 'quick' | 'deep'
  content jsonb not null,
  created_at timestamptz default now()
);
```

#### `lastminpreps.content` JSON schema
```json
{
  "core_concept": "string",
  "key_points": ["string"],
  "must_know_terms": [{ "term": "string", "definition": "string" }],
  "common_confusions": ["string"],
  "best_analogy": "string",
  "quick_questions": ["string"],
  "teacher_notes": "string"
}
```

### `mindmaps` table
```sql
create table mindmaps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  class text,
  subject text,
  topic text not null,
  depth text,                        -- 'broad' | 'standard' | 'detailed'
  content jsonb not null,            -- node tree structure
  is_starred boolean default false,
  created_at timestamptz default now()
);
```

#### `mindmaps.content` JSON schema
```json
{
  "central_node": "string",
  "branches": [
    {
      "id": "string",
      "label": "string",
      "color": "string",
      "children": [
        {
          "id": "string",
          "label": "string",
          "detail": "string"
        }
      ]
    }
  ]
}
```

### `quizzes` table
```sql
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  class text,
  subject text,
  topics text[],
  total_marks integer,
  duration integer,
  difficulty text,                   -- 'easy' | 'medium' | 'hard' | 'mixed'
  question_types text[],
  include_answer_key boolean default true,
  content jsonb not null,
  is_starred boolean default false,
  created_at timestamptz default now()
);
```

#### `quizzes.content` JSON schema
```json
{
  "paper_header": {
    "title": "string",
    "class": "string",
    "subject": "string",
    "duration": "string",
    "total_marks": "number"
  },
  "sections": [
    {
      "type": "MCQ | Fill in the Blanks | Match the Following | Short Answer | Long Answer",
      "marks_per_question": "number",
      "questions": [
        {
          "id": "string",
          "question": "string",
          "options": ["string"],        
          "answer": "string",           
          "marks": "number"
        }
      ]
    }
  ]
}
```

### `activities` table
```sql
create table activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  class text,
  subject text,
  topic text not null,
  activity_type text,                -- 'solo' | 'group'
  group_size text,                   -- '2-3' | '4-5' | '6+' | null
  duration integer,                  -- minutes
  content jsonb not null,
  is_starred boolean default false,
  created_at timestamptz default now()
);
```

#### `activities.content` JSON schema
```json
{
  "objectives": ["string"],
  "sel_structure": {
    "framework": "string",
    "competencies": ["string"],
    "description": "string"
  },
  "real_world_connection": "string",
  "materials_needed": ["string"],
  "instructions": [
    { "step": "number", "instruction": "string" }
  ],
  "assessment": {
    "criteria": ["string"],
    "method": "string"
  }
}
```

---

## 4. Authentication & Onboarding

### Auth Flow
- Supabase Auth with **email/password**
- On `auth.users` insert → trigger creates `profiles` row automatically
- Middleware checks session on all `/app/*` routes
- If `onboarding_complete = false` → redirect to `/onboarding`

### Onboarding Steps (5 screens, `/onboarding`)

**Step 1 — Welcome**
- Logo + tagline: *"Your AI teaching companion"*
- CTA: "Get Started"
- Link: "I already have an account → Sign In"

**Step 2 — Create Account**
- Fields: Full Name, Email, Password
- Submit → creates Supabase auth user
- Auto-creates `profiles` row via DB trigger

**Step 3 — Teaching Profile**
- Fields:
  - School Name (text)
  - Board (single select: CBSE / ICSE / State Board)
  - Classes you teach (multi-select chips: 1–12)
  - Subjects you teach (multi-select chips: common subjects + custom input)
- Saves to `profiles`

**Step 4 — Language Preference**
- Label: *"In which language should Teacher Notes be generated?"*
- Single select: English / Hindi / Marathi / Gujarati
- Sub-label: *"This applies to Teacher Notes in your TeachPacks. You can change this anytime."*
- Saves `language_preference` to `profiles`

**Step 5 — Ready**
- Message: *"Welcome, [first_name]! You're all set."*
- Sets `onboarding_complete = true`
- CTA: "Start your first TeachPack" → `/app/teachpack/new`
- Shows 5 tool cards as a preview

### Profile Settings Page (`/app/settings/profile`)
- Edit all onboarding fields at any time
- Language preference editable here
- Separate "Account" section for email/password change

---

## 5. App Structure & Navigation

### Route Map
```
/                          → Marketing landing page (or redirect to /app if logged in)
/login                     → Sign in page
/signup                    → Sign up (Step 1 of onboarding)
/onboarding                → Onboarding flow (steps 2–5)

/app                       → Dashboard (protected)
/app/teachpack             → TeachPack list (My Library)
/app/teachpack/new         → New TeachPack form
/app/teachpack/[id]        → View/edit TeachPack
/app/lastminprep           → Last Min Prep list
/app/lastminprep/new       → New Last Min Prep
/app/lastminprep/[id]      → View saved prep
/app/mindmap               → Mindmap list
/app/mindmap/new           → New Mindmap
/app/mindmap/[id]          → View/edit Mindmap
/app/quiz                  → Quiz list
/app/quiz/new              → New Quiz config
/app/quiz/[id]             → Preview/edit Quiz
/app/activity              → Activity list
/app/activity/new          → New Activity
/app/activity/[id]         → View/edit Activity
/app/settings/profile      → Profile & preferences
```

### Navigation
- **Desktop:** Left sidebar with tool icons + labels
- **Mobile:** Bottom tab bar (5 tabs: Home, TeachPack, Tools, Library, Profile)
- **Home/Dashboard (`/app`):**
  - Greeting: "Good morning, [name]"
  - Quick access: 5 tool cards
  - Recent: last 5 generated items across all tools
  - Stats: total packs created this week

---

## 6. Tools — Feature Specs

---

### 6.1 TeachPack

**Route:** `/app/teachpack/new`

#### Input Form
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Board | Single select | From profile | CBSE / ICSE / State Board |
| Class | Single select | From profile (first) | 1–12 |
| Subject | Single select | From profile (first) | From profile subjects |
| Chapter / Topic | Text input | — | Autocomplete from curriculum list |
| Lesson Duration | Toggle | 45 min | 30 / 45 / 60 min |
| Language for Teacher Notes | Single select | From `language_preference` | English / Hindi / Marathi / Gujarati |

#### Generation
- On submit → `POST /api/generate/teachpack`
- Show animated progress with section labels appearing sequentially
- On success → render TeachPack view in-page

#### TeachPack View — Sections
Each section is displayed as a collapsible card. Each has a **↻ Regenerate** button and is **inline editable**.

1. **Lesson Overview** — Concept summary, learning goals (bullet list), key ideas
2. **Learning Objectives** — What students will be able to do (numbered list)
3. **Teaching Flow** — Step-by-step lesson structure with phase names and durations
4. **Teacher Explanation** — Concept breakdown, analogies, real-life examples, teaching tips
5. **Classroom Questions** — Grouped by type: Recall / Understanding / Application / Critical Thinking
6. **Teacher Notes** — Generated in selected language (Hindi/Marathi/Gujarati/English)

#### Add-ons (Optional — Teacher-triggered)
Shown as "+ Add" buttons at the bottom of the TeachPack. Each triggers a separate API call and appends a new section.

| Add-on | Trigger | Output |
|--------|---------|--------|
| Worksheet | "+ Add Worksheet" | MCQ, Fill blanks, Match, Short answer, Long answer |
| Quick Assessment | "+ Add Assessment" | 5-question exit ticket |
| Homework Sheet | "+ Add Homework" | Take-home practice sheet |
| More Analogies | "+ More Analogies" | 3 additional analogies |
| More Examples | "+ More Examples" | 5 additional real-life examples |

#### Save & Export
- **Save to Library** → writes to `teachpacks` table
- **Download PDF** → modal with two options:
  - Teacher PDF (full pack including teacher notes)
  - Student PDF (worksheet only, no teacher notes)
- **Share** → copy shareable link (public view, no auth required)

---

### 6.2 Last Min Prep

**Route:** `/app/lastminprep/new`

#### Input Form
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Class | Single select | From profile | |
| Subject | Single select | From profile | |
| Topic | Text input | — | Autocomplete |
| Depth | Slider | Middle | Quick Glance ←→ Deep Refresh |

**Depth slider values:**
- Quick Glance (1–2 min): Core Concept + Key Points + 1 Analogy only
- Deep Refresh (3–5 min): All sections

#### Output — Prep Card
Displayed as a clean, glanceable single-scroll card:

1. **Core Concept** — 2–3 sentence plain-language summary
2. **Key Points** — 5–8 bullet points
3. **Must-Know Terms** — 3–5 term/definition pairs
4. **Common Student Confusions** — what students typically get wrong
5. **Best Analogy** — the single strongest analogy for this topic
6. **Quick Questions** — 2 questions to ask the class
7. **Teacher Notes** — in preferred language

*Quick Glance shows only: Core Concept + Key Points + Best Analogy*

#### Save & Export
- Save to Library
- Download PDF (single-page, print-optimised)

---

### 6.3 Mindmap Creator

**Route:** `/app/mindmap/new`

#### Input Form
| Field | Type | Default |
|-------|------|---------|
| Class | Single select | From profile |
| Subject | Single select | From profile |
| Topic | Text input or "Use from TeachPack" | — |
| Depth | Radio | Standard |

**Depth options:** Broad Overview / Standard / Detailed

**"Use from TeachPack"** — opens a picker modal showing saved TeachPacks. Selecting one pre-fills Topic and seeds the AI with existing content.

#### Mindmap Rendering
- Rendered as an **interactive SVG/Canvas** in the browser
- No external charting library dependency — build with D3.js or plain SVG + React state
- Structure:
  - **Central node** — Topic name (largest, brand colour)
  - **Level 1 branches** — Key concepts (5–8 nodes, colour-coded by category)
  - **Level 2 branches** — Sub-concepts, definitions, examples
- **Interactions:**
  - Tap/click any node → side panel shows detail
  - Pan (drag) + zoom (scroll/pinch)
  - Collapse/expand branches

#### Edit Mode
- Rename any node (inline edit on double-click)
- Add custom child node
- Delete a node
- Collapse/expand branch

#### Save & Export
- Save to Library
- Download PDF (static snapshot of visible mindmap)
- "Attach to TeachPack" — links mindmap to a saved TeachPack

---

### 6.4 Quiz / Test Paper Creator

**Route:** `/app/quiz/new`

#### Input Form — Paper Configuration
| Field | Type | Notes |
|-------|------|-------|
| Class | Single select | From profile |
| Subject | Single select | From profile |
| Topic(s) | Text input (multi-topic) | Comma-separated or tag input |
| Total Marks | Number input | Marks auto-distributed across question types |
| Duration | Toggle | 30 / 45 / 60 / 90 min |
| Difficulty | Radio | Easy / Medium / Hard / Mixed |
| Question Types | Multi-select checkboxes | MCQ / Fill in the Blanks / Match the Following / Short Answer / Long Answer |
| Include Answer Key | Toggle | Default: Yes |

#### Generation
- `POST /api/generate/quiz`
- Marks auto-distributed: MCQ = 1 mark each, Short Answer = 2–3, Long Answer = 5

#### Test Paper Preview
- Displayed in print-formatted layout (A4 preview)
- **Paper header:** Class, Subject, Date placeholder, Duration, Total Marks
- **Sections** grouped by question type with marks per question shown
- **Per question actions:**
  - Inline edit the question text
  - "↻ Swap" — regenerates just that question
  - "+ Add question" — inserts one more of same type
  - "✕ Remove" — deletes question, marks auto-rebalance
- **Answer Key tab** — shown alongside if enabled

#### Save & Export
- Save to Library
- Download Test Paper PDF (student-facing — no answers)
- Download Answer Key PDF (teacher-facing — answers shown)

**PDF format:** A4, clean test paper layout, section breaks, marks per question

---

### 6.5 Activity Generator

**Route:** `/app/activity/new`

#### Input Form
| Field | Type | Notes |
|-------|------|-------|
| Class | Single select | From profile |
| Subject | Single select | From profile |
| Topic | Text input or "Use from TeachPack" | |
| Activity Type | Single select | Solo / Group |
| Group Size | Radio (conditional) | Shown only if Group selected: 2–3 / 4–5 / 6+ |
| Duration | Toggle | 10 / 15 / 20 / 30 min |

#### Output — Activity Card (6 fixed sections)

1. **Objectives** — What students will achieve (bullet list)
2. **SEL Structure**
   - SEL competency addressed (self-awareness / social awareness / relationship skills / responsible decision-making)
   - How this activity develops that competency
3. **Real-World Connection** — How the topic connects to students' daily life
4. **Materials Needed** — Items required (only classroom-available items)
5. **Instructions** — Numbered step-by-step guide for the teacher to run the activity. Group activities include role assignments.
6. **Assessment** — Criteria and method for evaluating student participation and understanding

Each section is **inline editable**.

#### Regenerate Options
- ↻ Regenerate full activity
- ↻ Regenerate individual section
- "Make it simpler" / "Make it more challenging" — one-tap difficulty shift (re-calls API with adjusted prompt parameter)

#### Save & Export
- Save to Library
- Download PDF (clean printable activity card)
- "Add to TeachPack" — attaches to a saved TeachPack's addons array

---

## 7. AI Prompt Architecture

All prompts sent to Gemini Flash via server-side API routes. Return **strict JSON only** — no markdown, no preamble.

### System Prompt (shared across all tools)
```
You are SeekhoWithAI, an expert educational content generator for Indian school teachers.
You generate structured, curriculum-aligned teaching content for classes 1–12.
Always respond with valid JSON only. No markdown. No preamble. No explanation outside the JSON.
Content must be age-appropriate, accurate, and suitable for Indian school curriculum.
```

### TeachPack Prompt
```
Generate a complete TeachPack for the following lesson.

Board: {board}
Class: {class}
Subject: {subject}
Topic: {topic}
Duration: {duration} minutes
Teacher Notes Language: {language}

Return a JSON object matching this exact schema:
{
  "lesson_overview": { "concept_summary": "", "learning_goals": [], "key_ideas": [] },
  "learning_objectives": [],
  "teaching_flow": [{ "step": 1, "phase": "", "description": "", "duration": "" }],
  "teacher_explanation": { "concept_breakdown": "", "analogies": [], "real_life_examples": [], "teaching_tips": [] },
  "classroom_questions": { "recall": [], "understanding": [], "application": [], "critical_thinking": [] },
  "teacher_notes": ""
}

Teacher Notes must be written entirely in {language}.
Teaching flow must fit within {duration} minutes.
All other content in English.
```

### Last Min Prep Prompt
```
Generate a Last Minute Prep card for a teacher.

Class: {class}
Subject: {subject}
Topic: {topic}
Depth: {depth} (quick = condensed, deep = comprehensive)
Teacher Notes Language: {language}

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

If depth is "quick": populate only core_concept, key_points (max 5), best_analogy, teacher_notes.
If depth is "deep": populate all fields fully.
Teacher Notes in {language}. All other content in English.
```

### Mindmap Prompt
```
Generate a mindmap node structure for the following topic.

Class: {class}
Subject: {subject}
Topic: {topic}
Depth: {depth}

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

Depth guide:
- broad: 4–5 branches, 2–3 children each
- standard: 6–7 branches, 3–4 children each
- detailed: 8–9 branches, 4–5 children each

Assign distinct, visually distinct hex colors to each branch. Use educational color palette.
```

### Quiz Prompt
```
Generate a test paper for the following configuration.

Class: {class}
Subject: {subject}
Topics: {topics}
Total Marks: {total_marks}
Duration: {duration} minutes
Difficulty: {difficulty}
Question Types: {question_types}
Include Answer Key: {include_answer_key}

Distribute marks across question types proportionally.
MCQ = 1 mark each. Short Answer = 2–3 marks. Long Answer = 5 marks. Fill/Match = 1 mark each.

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

options array only for MCQ questions. answer field always populated.
```

### Activity Prompt
```
Generate a classroom activity for the following configuration.

Class: {class}
Subject: {subject}
Topic: {topic}
Activity Type: {activity_type}
Group Size: {group_size}
Duration: {duration} minutes

Return JSON:
{
  "objectives": [],
  "sel_structure": { "framework": "", "competencies": [], "description": "" },
  "real_world_connection": "",
  "materials_needed": [],
  "instructions": [{ "step": 1, "instruction": "" }],
  "assessment": { "criteria": [], "method": "" }
}

Activity must be completable within {duration} minutes.
Materials must only include items available in a typical Indian classroom.
If group activity, instructions must include role assignments for group members.
SEL competency must be one of: self-awareness, social-awareness, relationship-skills, responsible-decision-making.
```

### Add-on Prompts

**Worksheet:**
```
Generate a student worksheet for this topic: {topic}, Class {class}, Subject {subject}.
Include: MCQ (3), Fill in the blanks (3), Match the following (1 set of 5), Short answer (2), Long answer (1).
Return JSON: { "sections": [{ "type": "", "questions": [] }] }
```

**Quick Assessment:**
```
Generate a 5-question exit ticket for Class {class}, {subject}, topic: {topic}.
Mix question types. Max 2 minutes to complete.
Return JSON: { "questions": [{ "id": "", "type": "", "question": "", "answer": "" }] }
```

---

## 8. PDF Export

**Route:** `POST /api/export/pdf`

### Request Body
```json
{
  "type": "teachpack | lastminprep | quiz | quiz_answer_key | activity",
  "id": "uuid",
  "variant": "teacher | student"
}
```

### PDF Specifications
- Paper size: **A4**
- Font: System serif or Noto Sans (supports Hindi/Marathi/Gujarati rendering)
- Use **`@react-pdf/renderer`** for React-based PDF generation

### PDF Layouts

**TeachPack — Teacher PDF:**
- Cover: Tool name, Topic, Class, Subject, Date
- All 6 sections with headings
- Teacher Notes in selected language (use Noto Sans for Devanagari/Gujarati)
- Add-ons appended at end

**TeachPack — Student PDF:**
- Worksheet section only
- No teacher notes, no explanations

**Last Min Prep PDF:**
- Single page
- All sections in card layout

**Quiz — Test Paper PDF:**
- Standard test paper format
- Header: Class, Subject, Duration, Total Marks, Date line
- Sections with question numbers and marks
- No answers shown

**Quiz — Answer Key PDF:**
- Same format with answers shown in highlighted boxes

**Activity PDF:**
- Clean card layout
- All 6 sections with icons per section

---

## 9. UI/UX Guidelines

### Design Principles
- **Fast** — every screen should feel instant. Use optimistic UI updates.
- **Calm** — no clutter. Content is the focus, not the chrome.
- **Mobile-first** — majority of teachers will use on phone.
- **Accessible** — minimum 16px body text, sufficient contrast.

### Color Palette
```
--brand-orange:     #E85D1E
--brand-orange-light: #FF7A3D
--bg-primary:       #FFFFFF (light mode)
--bg-secondary:     #F5F5F7
--text-primary:     #0F0F1A
--text-muted:       #6B6B8A
--border:           #E0E0EC
--success:          #22C55E
--error:            #EF4444
```

### Typography
- **Headings:** `Plus Jakarta Sans` (600/700)
- **Body:** `Geist` or `Inter`
- **Code/mono:** `JetBrains Mono`
- **Regional language content (Hindi/Marathi/Gujarati):** `Noto Sans Devanagari` / `Noto Sans Gujarati`

### Component Patterns
- **Input forms:** Full-width on mobile, max-width 640px on desktop, centred
- **Tool cards:** Grid of 2 on mobile, 3 on tablet, 5 on desktop
- **Generated content sections:** Collapsible cards with subtle border
- **Loading state:** Skeleton loaders + progress animation (not blank spinners)
- **Empty states:** Friendly illustration + single clear CTA
- **Regenerate button:** Small icon button (↻) top-right of each section card
- **Add-on triggers:** Dashed border "+ Add" cards at bottom of TeachPack

### Mobile-Specific
- Bottom navigation bar (5 items)
- Large tap targets (min 44px)
- Sticky "Generate" / "Save" CTAs at bottom of screen
- Swipe to dismiss modals

---

## 10. Supabase RLS Policies

Enable Row Level Security on all tables. Users can only access their own data.

```sql
-- profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- teachpacks
alter table teachpacks enable row level security;
create policy "Users can CRUD own teachpacks" on teachpacks for all using (auth.uid() = user_id);

-- lastminpreps
alter table lastminpreps enable row level security;
create policy "Users can CRUD own lastminpreps" on lastminpreps for all using (auth.uid() = user_id);

-- mindmaps
alter table mindmaps enable row level security;
create policy "Users can CRUD own mindmaps" on mindmaps for all using (auth.uid() = user_id);

-- quizzes
alter table quizzes enable row level security;
create policy "Users can CRUD own quizzes" on quizzes for all using (auth.uid() = user_id);

-- activities
alter table activities enable row level security;
create policy "Users can CRUD own activities" on activities for all using (auth.uid() = user_id);
```

### Supabase DB Trigger — Auto-create profile on signup
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 11. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 12. Folder Structure

```
seekhowith-ai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── onboarding/
│   │   └── page.tsx              ← multi-step onboarding
│   ├── app/
│   │   ├── layout.tsx            ← protected layout with nav
│   │   ├── page.tsx              ← dashboard
│   │   ├── teachpack/
│   │   │   ├── page.tsx          ← library list
│   │   │   ├── new/page.tsx      ← input form
│   │   │   └── [id]/page.tsx     ← view/edit
│   │   ├── lastminprep/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── mindmap/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── quiz/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── activity/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/
│   │       └── profile/page.tsx
│   └── api/
│       ├── generate/
│       │   ├── teachpack/route.ts
│       │   ├── lastminprep/route.ts
│       │   ├── mindmap/route.ts
│       │   ├── quiz/route.ts
│       │   ├── activity/route.ts
│       │   └── addon/route.ts
│       └── export/
│           └── pdf/route.ts
├── components/
│   ├── ui/                       ← base components (Button, Input, Select, etc.)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── DashboardHeader.tsx
│   ├── tools/
│   │   ├── teachpack/
│   │   │   ├── TeachPackForm.tsx
│   │   │   ├── TeachPackView.tsx
│   │   │   ├── TeachPackSection.tsx
│   │   │   └── AddOnPanel.tsx
│   │   ├── lastminprep/
│   │   ├── mindmap/
│   │   │   └── MindmapCanvas.tsx
│   │   ├── quiz/
│   │   └── activity/
│   └── shared/
│       ├── GeneratingAnimation.tsx
│       ├── PDFExportModal.tsx
│       ├── LibraryCard.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← browser client
│   │   ├── server.ts             ← server client
│   │   └── middleware.ts
│   ├── gemini.ts                 ← Gemini API wrapper
│   ├── prompts/
│   │   ├── teachpack.ts
│   │   ├── lastminprep.ts
│   │   ├── mindmap.ts
│   │   ├── quiz.ts
│   │   ├── activity.ts
│   │   └── addons.ts
│   └── db/
│       ├── teachpacks.ts         ← DB query helpers
│       ├── lastminpreps.ts
│       ├── mindmaps.ts
│       ├── quizzes.ts
│       └── activities.ts
├── hooks/
│   ├── useProfile.ts
│   ├── useTeachPack.ts
│   └── useGenerate.ts
├── types/
│   └── index.ts                  ← all TypeScript types/interfaces
├── middleware.ts                  ← auth protection + onboarding redirect
├── .env.local
└── package.json
```

---

## 13. Claude Code Build Order

> Follow this sequence exactly. Do not skip ahead. Each phase must be working before the next begins.

| Phase | Task | Done When |
|-------|------|-----------|
| 1 | `npx create-next-app -e with-supabase` — scaffold base project | App runs on localhost:3000 |
| 2 | `supabase/migrations` — all 6 tables + DB trigger + RLS policies | `supabase db push` succeeds |
| 3 | `middleware.ts` — auth check + onboarding_complete redirect logic | Protected routes redirect correctly |
| 4 | Auth pages — `/login`, `/signup` with Supabase Auth | Can sign up and sign in |
| 5 | Onboarding flow — 5 steps, saves to `profiles` table | `onboarding_complete = true` after step 5 |
| 6 | Dashboard shell — sidebar (desktop), bottom nav (mobile), header | Layout renders on all screen sizes |
| 7 | Profile / Settings page — edit all profile fields | Changes save to Supabase |
| 8 | TeachPack — form, API route, Gemini call, output view, save, PDF export | Full end-to-end works |
| 9 | Last Min Prep — same pattern as TeachPack | Full end-to-end works |
| 10 | Mindmap — SVG rendering, pan/zoom, edit mode | Mindmap renders and is interactive |
| 11 | Quiz / Test Paper — paper preview, per-question edit, 2 PDF exports | Both PDFs generate correctly |
| 12 | Activity Generator — 6 sections, regenerate options, Add to TeachPack | Full end-to-end works |

---

## 14. Out of Scope (Post-MVP)

These features are explicitly excluded from the MVP build:

| Feature | Phase |
|---------|-------|
| AI Video generation (HeyGen integration) | Phase 2 |
| Reveal.js interactive presentations | Phase 2 |
| Word (.docx) export | Phase 2 |
| HOD / Admin dashboard | Phase 2 |
| Multi-school / SaaS billing | Phase 3 |
| Student-facing interface | Phase 3 |
| Parent communication | Phase 3 |
| LMS integrations (Google Classroom etc.) | Phase 3 |
| Mobile app (React Native) | Phase 3 |
| Offline DexieJS layer | Phase 2 |

---

*End of PRD — SeekhoWithAI MVP*  
*Prepared by Aalore Tech Lab · March 2026*
