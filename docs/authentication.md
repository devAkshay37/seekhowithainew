# Authentication & Onboarding

SeekhoWithAI uses Supabase Auth for secure user management and session handling.

## Authentication Flow

1.  **Sign Up**: Users create an account with an email and password.
2.  **Email Confirmation**: A confirmation email is sent (default Supabase behavior).
3.  **Onboarding**: New users are redirected to the onboarding flow (`/onboarding`) to set up their profile.
4.  **Middleware Protection**: All routes under `/app` are protected by Next.js Middleware (`middleware.ts`).
5.  **Session Persistence**: Auth is managed via SSR-compatible cookies using `@supabase/ssr`.

## Onboarding Process

The onboarding flow consists of multiple steps to tailor the AI experience for each teacher:

- **Welcome**: Introduction to the platform.
- **Teaching Profile**: User selects their School Name, Board (CBSE, ICSE, State Board), Subjects, and Classes.
- **Language Preference**: Users select their preferred language for Teacher Notes (English, Hindi, Marathi, or Gujarati).
- **Completion**: `onboarding_complete` flag is set to `true` in the `profiles` table.

## User Profiles

User profiles are stored in the `profiles` table and are automatically created via a database trigger upon user registration.

### Trigger Logic:
Upon a new insert in `auth.users`, a corresponding row is created in `public.profiles` with default values.

---

## Security (RLS)

All user data is protected via Supabase **Row Level Security (RLS)**:
- Users can only access their own profile.
- Users can only access TeachPacks, Mindmaps, and Quizzes they have created.
- API routes verify the user's session before performing AI generation or PDF exports.

## OAuth Support

The application supports **Google OAuth** for a seamless, one-click login experience.
- The Google Sign-In button is available on both the Login and Sign-Up forms.
- On successful authentication, users are redirected back to the app and onboarded if necessary.
