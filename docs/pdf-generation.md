# PDF Generation & Export

SeekhoWithAI uses `@react-pdf/renderer` for generating high-quality PDFs for both teachers and students.

## Technology

- **Renderer**: `@react-pdf/renderer`
- **Location**: API Route: `/api/export/pdf`
- **Component**: `components/pdf/TeachPackPDF.tsx` (and other related PDF components)

## Features

- **Teacher PDF**: Complete TeachPack content including Teacher Notes, Classroom Questions, and Lesson Overview.
- **Student PDF**: Worksheet-only format, excluding teacher-facing content like notes and answers.
- **Dynamic Content**: Renders lesson content, add-ons (worksheets, assessments), and metadata.

## Regional Language Support (Hindi/Marathi/Gujarati)

To support non-English characters in generated PDFs, SeekhoWithAI integrates specialized fonts.

### Font Registration

Fonts are registered in the PDF components using `Font.register`.

```javascript
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: '/fonts/NotoSans-Regular.ttf' },
    { src: '/fonts/NotoSans-Bold.ttf', fontWeight: 'bold' },
  ],
});
```

### Font Handling Decisions:
- **Font Normalization**: Unicode text is normalized (e.g., using `String.prototype.normalize('NFC')`) to ensure proper rendering.
- **Fallbacks**: Standard fonts (like Helvetica) are used for English content, while Noto Sans is used for regional language text sections.

---

## Layout Structure

1.  **Header**: School Name, Board, Class, Subject, and Topic.
2.  **Overview**: Learning Objectives and Concept Summary.
3.  **Content Sections**: Teaching Flow, Teacher Explanation, Classroom Questions.
4.  **Add-ons**: Appended Worksheets and Homework sheets at the end.
5.  **Footer**: Page numbers and "SeekhoWithAI" branding.

---

## PDF Generation Workflow

1.  User clicks "Download PDF".
2.  Client makes a `POST` request to `/api/export/pdf` with the `teachpack` data.
3.  Server renders the React component to a PDF stream.
4.  Server returns the PDF blob to the client for download.
