import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function createUserSession(alias: string, language: string) {
  const { data, error } = await supabase
    .from('user_sessions')
    .insert([
      {
        alias,
        preferred_language: language,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserSessions(alias: string) {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('alias', alias);

  if (error) throw error;
  return data;
}

export async function updateLastActive(sessionId: string) {
  const { error } = await supabase
    .from('user_sessions')
    .update({ last_active: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}
