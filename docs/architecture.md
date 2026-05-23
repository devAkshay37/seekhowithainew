# Architecture & Tech Stack

SeekhoWithAI is built using modern web technologies to ensure scalability, performance, and a seamless developer experience.

## Core Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Core application logic and routing. |
| **Database** | Supabase (PostgreSQL) | Data persistence, authentication, and Row Level Security (RLS). |
| **Authentication** | Supabase Auth (SSR) | Secure user login, signup, and session management. |
| **AI Generation** | Google Gemini Flash API | Server-side AI logic for content generation. |
| **UI Components** | shadcn/ui + Tailwind CSS | Modern, responsive, and customizable UI design. |
| **PDF Export** | `@react-pdf/renderer` | Generating downloadable documents for teachers and students. |
| **Deployment** | Vercel | Scalable hosting and automated deployments. |

## Key Libraries

- **Framer Motion**: For smooth UI animations and micro-interactions.
- **Lucide React**: Vector icons for a consistent visual style.
- **PostHog**: Integrated analytics for user behavior tracking.
- **D3.js**: Used for rendering interactive mindmaps.

## Folder Structure

The project follows a standard Next.js App Router structure:

```text
/
├── app/               # Next.js routes, API handlers, and page layouts
│   ├── (app)/         # Main application routes (Dashboard, Tools)
│   ├── api/           # Server-side API routes for AI generation and PDF export
│   └── auth/          # Authentication related routes
├── components/        # Reusable React components (UI, Forms, PDF layouts)
│   ├── ui/            # shadcn/ui base components
│   ├── tools/         # Component-specific to teachers' tools
│   └── pdf/           # PDF document templates & styles
├── lib/               # Utility functions (Supabase client, AI helpers)
├── supabase/          # Database migrations and configuration
├── public/            # Static assets (logos, fonts, images)
├── types/             # TypeScript type definitions
└── docs/              # Project documentation
```

## Architectural Decisions

1.  **Server-Side AI**: Gemini AI calls are performed only in Next.js API routes to protect API keys and ensure consistent formatting.
2.  **Supabase SSR**: Authentication is managed via SSR-compatible cookies, allowing for middleware-based route protection.
3.  **No Client-Side Cache Layer**: Using React state and direct Supabase queries to keep the implementation lean (Zustand/TanStack Query are considered for Phase 2).
4.  **Row Level Security (RLS)**: Database access is strictly secured via Supabase RLS, ensuring users can only access their own data.
