import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/gemini';
import { buildActivityPrompt } from '@/lib/prompts/activity';
import type { ActivityContent } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { class: classLevel, subject, topic, activity_type, group_size, duration } = body;

    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const prompt = buildActivityPrompt({ class: classLevel, subject, topic, activity_type, group_size, duration });
    const content = await generateJSON<ActivityContent>(prompt);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Activity generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
