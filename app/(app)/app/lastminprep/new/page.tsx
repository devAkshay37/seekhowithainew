import { createClient } from '@/lib/supabase/server';
import NewLastMinPrepClient from '@/components/tools/lastminprep/NewLastMinPrepClient';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';
import { defaultProfile } from '@/lib/defaultProfile';

export default async function NewLastMinPrepPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return <NewLastMinPrepClient profile={(profile ?? defaultProfile) as Profile} />;
}
