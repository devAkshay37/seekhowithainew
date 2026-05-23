import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/gemini';
import { buildTeachPackPrompt } from '@/lib/prompts/teachpack';
import type { TeachPackContent } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { board, class: classLevel, subject, topic, number_of_lectures, duration, language } = body;

    if (!topic || !subject) {
      return NextResponse.json({ error: 'Topic and subject are required' }, { status: 400 });
    }

    const prompt = buildTeachPackPrompt({ board, class: classLevel, subject, topic, number_of_lectures, duration, language });
    const content = await generateJSON<TeachPackContent>(prompt);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('TeachPack generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
