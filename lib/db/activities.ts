import { createClient } from '@/lib/supabase/server';
import type { Activity } from '@/types';

export async function getActivities(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Activity[];
}

export async function getActivity(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function updateActivity(id: string, updates: Partial<Activity>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function deleteActivity(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
}
