import { createClient } from '@/lib/supabase/server';
import NewQuizClient from '@/components/tools/quiz/NewQuizClient';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';
import { defaultProfile } from '@/lib/defaultProfile';

export default async function NewQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return <NewQuizClient profile={(profile ?? defaultProfile) as Profile} />;
}
