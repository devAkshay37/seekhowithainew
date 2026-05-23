import { createClient } from '@/lib/supabase/server';
import type { LastMinPrep } from '@/types';

export async function getLastMinPreps(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lastminpreps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as LastMinPrep[];
}

export async function getLastMinPrep(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lastminpreps')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as LastMinPrep;
}

export async function createLastMinPrep(prep: Omit<LastMinPrep, 'id' | 'created_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lastminpreps')
    .insert(prep)
    .select()
    .single();
  if (error) throw error;
  return data as LastMinPrep;
}

export async function deleteLastMinPrep(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('lastminpreps').delete().eq('id', id);
  if (error) throw error;
}
