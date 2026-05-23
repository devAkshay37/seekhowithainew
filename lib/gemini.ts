import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are SeekhoWithAI, an expert educational content generator for Indian school teachers.
You generate structured, curriculum-aligned teaching content for classes 1–12.
Always respond with valid JSON only. No markdown. No preamble. No explanation outside the JSON.
Content must be age-appropriate, accurate, and suitable for Indian school curriculum.`;

export async function generateJSON<T>(userPrompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 65536,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned) as T;
  }
}
