import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/gemini';
import { buildQuizPrompt } from '@/lib/prompts/quiz';
import type { QuizContent } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { class: classLevel, subject, topics, total_marks, duration, difficulty, question_types, include_answer_key } = body;

    if (!topics || !subject) {
      return NextResponse.json({ error: 'Topics and subject are required' }, { status: 400 });
    }

    const prompt = buildQuizPrompt({ class: classLevel, subject, topics, total_marks, duration, difficulty, question_types, include_answer_key });
    const content = await generateJSON<QuizContent>(prompt);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
