import { createClient } from '@/lib/supabase/server';
import type { TeachPack } from '@/types';

export async function getTeachPacks(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teachpacks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as TeachPack[];
}

export async function getTeachPack(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teachpacks')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as TeachPack;
}

export async function createTeachPack(pack: Omit<TeachPack, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teachpacks')
    .insert(pack)
    .select()
    .single();
  if (error) throw error;
  return data as TeachPack;
}

export async function updateTeachPack(id: string, updates: Partial<TeachPack>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teachpacks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as TeachPack;
}

export async function deleteTeachPack(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('teachpacks').delete().eq('id', id);
  if (error) throw error;
}
