# API Reference

All AI content generation happens through Next.js API routes (server-side only) to protect Gemini API keys and maintain consistent formatting.

## Generation Endpoints

All generation endpoints use the `POST` method and return a JSON object matching the requested tool's schema.

### 1. `POST /api/generate/teachpack`
Generates full lesson content for teachers.

**Request Body**:
```json
{
  "board": "string",
  "class": "string",
  "subject": "string",
  "topic": "string",
  "duration": "number",
  "language": "string"
}
```

### 2. `POST /api/generate/lastminprep`
Generates a condensed prep card.

**Request Body**:
```json
{
  "class": "string",
  "subject": "string",
  "topic": "string",
  "depth": "quick | deep",
  "language": "string"
}
```

### 3. `POST /api/generate/mindmap`
Generates a mindmap node tree.

**Request Body**:
```json
{
  "class": "string",
  "subject": "string",
  "topic": "string",
  "depth": "broad | standard | detailed"
}
```

### 4. `POST /api/generate/quiz`
Generates a printable test paper.

**Request Body**:
```json
{
  "class": "string",
  "subject": "string",
  "topics": "string[]",
  "total_marks": "number",
  "duration": "number",
  "difficulty": "easy | medium | hard | mixed",
  "question_types": "string[]",
  "include_answer_key": "boolean"
}
```

### 5. `POST /api/generate/activity`
Generates an SEL-based classroom activity.

**Request Body**:
```json
{
  "class": "string",
  "subject": "string",
  "topic": "string",
  "activity_type": "solo | group",
  "group_size": "string",
  "duration": "number"
}
```

### 6. `POST /api/generate/addon`
Generates supplemental content (Worksheets, Homework, extra assessments) for an existing TeachPack.

---

## Export Endpoints

### 1. `POST /api/export/pdf`
Generates a downloadable PDF of the provided content.

**Request Body**:
```json
{
  "type": "teacher | student",
  "content": "json" (the full TeachPack/tool data)
}
```

---

## Error Handling

API routes return standard HTTP status codes:
- **200 OK**: Generation successful.
- **400 Bad Request**: Missing or invalid request parameters.
- **401 Unauthorized**: User is not authenticated.
- **500 Internal Server Error**: AI generation failed or other server-side errors.

AI responses are returned as structured JSON only (no markdown, no explanations) for consistent parsing.
