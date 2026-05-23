import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/gemini';
import { buildLastMinPrepPrompt } from '@/lib/prompts/lastminprep';
import type { LastMinPrepContent } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { class: classLevel, subject, topic, depth, language = 'English' } = body;

    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const prompt = buildLastMinPrepPrompt({ class: classLevel, subject, topic, depth, language });
    const content = await generateJSON<LastMinPrepContent>(prompt);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('LastMinPrep generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
