# Getting Started

Follow these steps to quickly get SeekhoWithAI up and running.

## Prerequisites

- Node.js installed on your machine.
- A Supabase project set up.
- Google AI API key for Gemini models.
- PostHog account (optional for analytics).

## Quick Setup

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/your-username/seekhowithai.git
    cd seekhowithai
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file and add the following keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `GOOGLE_GENERATIVE_AI_API_KEY`

3.  **Database Triggers**:
    Make sure your Supabase project has the profile creation trigger set up to handle new signups.

4.  **Run Development Mode**:
    ```bash
    npm run dev
    ```

## Post-Setup

- Visit [http://localhost:3000/signup](http://localhost:3000/signup) to create your first teacher account.
- Complete the onboarding flow to set your teaching preferences.
- Start generating your first TeachPack on the dashboard!
