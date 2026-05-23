import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateJSON } from '@/lib/gemini';
import { buildWorksheetPrompt, buildAssessmentPrompt, buildHomeworkPrompt, buildMoreAnalogiesPrompt, buildMoreExamplesPrompt } from '@/lib/prompts/addons';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { type, topic, class: classLevel, subject } = body;

    if (!type || !topic) {
      return NextResponse.json({ error: 'type and topic are required' }, { status: 400 });
    }

    const params = { topic, class: classLevel || '', subject: subject || '' };

    let prompt: string;
    switch (type) {
      case 'worksheet': prompt = buildWorksheetPrompt(params); break;
      case 'assessment': prompt = buildAssessmentPrompt(params); break;
      case 'homework': prompt = buildHomeworkPrompt(params); break;
      case 'analogies': prompt = buildMoreAnalogiesPrompt(params); break;
      case 'examples': prompt = buildMoreExamplesPrompt(params); break;
      default:
        return NextResponse.json({ error: 'Invalid addon type' }, { status: 400 });
    }

    const content = await generateJSON(prompt);
    return NextResponse.json({ content, type });
  } catch (error) {
    console.error('Addon generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
