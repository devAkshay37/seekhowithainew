import { createClient } from '@/lib/supabase/server';
import NewMindmapClient from '@/components/tools/mindmap/NewMindmapClient';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';
import { defaultProfile } from '@/lib/defaultProfile';

export default async function NewMindmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return <NewMindmapClient profile={(profile ?? defaultProfile) as Profile} />;
}
