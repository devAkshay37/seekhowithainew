# Development Guide

Follow the instructions below to set up and run SeekhoWithAI locally.

## Setup Requirements

1.  **Node.js**: LTS version (18 or higher).
2.  **npm/yarn/pnpm**: Package manager.
3.  **Supabase Account**: A project created on the [Supabase Dashboard](https://database.new).
4.  **Google AI SDK**: API Key for [Gemini Flash API](https://aistudio.google.com/).

## Steps to Run Locally

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/seekhowithai.git
    cd seekhowithai
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables**:
    Rename `.env.example` (if any) or create/update `.env.local` in the root directory:

    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

    # Google Gemini AI API
    GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GEMINI_API_KEY

    # PostHog Analytics
    NEXT_PUBLIC_POSTHOG_KEY=YOUR_POSTHOG_KEY
    NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

    The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Runs the compiled production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## Development Patterns

- **API Security**: Never call Gemini API directly from the client. Use server routes in `app/api/generate`.
- **Styling**: Always use Tailwind CSS and shadcn/ui.
- **TypeScript**: Ensure all new components and functions are properly typed.
- **PWA Support**: The app includes a Service Worker for offline-readiness (Phase 2). Check `sw.ts` and `@serwist/next` configuration.
