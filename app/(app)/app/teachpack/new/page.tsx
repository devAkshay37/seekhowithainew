import { createClient } from '@/lib/supabase/server';
import { NewTeachPackClient } from '@/components/tools/teachpack/NewTeachPackClient';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';

const defaultProfile: Profile = {
  id: '',
  full_name: '',
  board: 'CBSE',
  classes: ['8'],
  subjects: ['Science'],
  language_preference: 'English',
  onboarding_complete: false,
  created_at: '',
};

export default async function NewTeachPackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return <NewTeachPackClient profile={(profile ?? defaultProfile) as Profile} />;
}
