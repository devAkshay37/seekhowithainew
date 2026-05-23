import { createClient } from '@/lib/supabase/server';
import type { Mindmap } from '@/types';

export async function getMindmaps(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Mindmap[];
}

export async function getMindmap(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as Mindmap;
}

export async function createMindmap(mindmap: Omit<Mindmap, 'id' | 'created_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mindmaps')
    .insert(mindmap)
    .select()
    .single();
  if (error) throw error;
  return data as Mindmap;
}

export async function updateMindmap(id: string, updates: Partial<Mindmap>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mindmaps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Mindmap;
}

export async function deleteMindmap(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('mindmaps').delete().eq('id', id);
  if (error) throw error;
}
