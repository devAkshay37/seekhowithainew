import { createClient } from '@/lib/supabase/server';
import NewActivityClient from '@/components/tools/activity/NewActivityClient';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';
import { defaultProfile } from '@/lib/defaultProfile';

export default async function NewActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return <NewActivityClient profile={(profile ?? defaultProfile) as Profile} />;
}
