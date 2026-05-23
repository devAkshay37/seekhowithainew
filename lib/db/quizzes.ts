import { createClient } from '@/lib/supabase/server';
import type { Quiz } from '@/types';

export async function getQuizzes(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Quiz[];
}

export async function getQuiz(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as Quiz;
}

export async function createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .insert(quiz)
    .select()
    .single();
  if (error) throw error;
  return data as Quiz;
}

export async function updateQuiz(id: string, updates: Partial<Quiz>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Quiz;
}

export async function deleteQuiz(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('quizzes').delete().eq('id', id);
  if (error) throw error;
}
