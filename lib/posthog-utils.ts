import { SupabaseClient } from '@supabase/supabase-js';
import { PostHog } from 'posthog-js';

export async function trackGenerationCompletion(
  supabase: SupabaseClient,
  posthog: PostHog,
  tool: string,
  formData: object | undefined,
  timeTaken: number,
  sectionsCount: number
) {
  try {
    // 1. Fire basic completion event
    posthog.capture('teachpack_generation_completed', {
      tool,
      time_taken_seconds: timeTaken,
      sections_generated: sectionsCount,
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user's previous generations to check milestones
    // We'll query teachpacks, mindmaps, quizzes, lastminprep, activities
    // Since SeekhoWithAI merges all into basically teachpacks or specific tables, Let's check the 'teachpacks' table plus others if they exist.
    // If they only save to 'teachpacks', we can just query that. But wait! Generation completed doesn't mean "Saved". It means the generation finished.
    // The prompt says: "When a user completes their very first Techpack ever...". "When a user creates their second Techpack".
    // I will check the 'teachpacks' table for saving. Or wait. "When a user completes their very first Techpack ever" -> means generation or save? "creates their second Techpack" - creating meaning save? Let's check the teachpacks table.
    // 
    // BUT what about distinct subjects/classes?
    // "After any generation - check if the user has now used more than one subject. If yes, fire once per new subject"
    // To do this reliably, we can store a user_metric record, OR query the past teachpacks. Let's query past teachpacks.

    const { data: pastPacks } = await supabase
      .from('teachpacks')
      .select('id, created_at, subject, class, tool')
      .eq('user_id', user.id);

    if (!pastPacks) return;

    // The 'tool' might not exist in teachpacks if it's implicitly all "TeachPack". 
    // Assuming everything generated ends up in `teachpacks` for simplified querying, or we just count from pastPacks.
    const count = pastPacks.length;

    // 1. First/Second Techpack milestone
    // Note: Since this fires BEFORE the current one is saved (generation just completed), the actual count is count + 1 (the one just generated).
    // WAIT! If it's not saved yet, it's not in the database!
    // So if count === 0, THIS is the first one generated.
    if (count === 0) {
      posthog.capture('first_teachpack_completed', {
        tool,
        board: formData.board,
        class: formData.class,
        subject: formData.subject,
      });
    } else if (count === 1) {
      const firstDate = new Date(pastPacks[0].created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      posthog.capture('second_teachpack_created', {
        days_since_first: diffDays,
      });
    }

    // 2. Multiple subjects
    const pastSubjects = new Set(pastPacks.map(p => p.subject).filter(Boolean));
    const currentSubject = formData.subject;
    if (currentSubject && !pastSubjects.has(currentSubject) && pastSubjects.size >= 1) {
      // It's a NEW subject, and they've used at least one OTHER subject before
      posthog.capture('multiple_subjects_used', {
        subject_count: pastSubjects.size + 1,
      });
    }

    // 3. Multiple classes
    const pastClasses = new Set(pastPacks.map(p => p.class).filter(Boolean));
    const currentClass = formData.class;
    if (currentClass && !pastClasses.has(currentClass) && pastClasses.size >= 1) {
      posthog.capture('multiple_classes_used', {
        class_count: pastClasses.size + 1,
      });
    }

  } catch (error) {
    console.error("PostHog Metrics Error:", error);
  }
}
