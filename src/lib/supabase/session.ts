import { createClient } from '@supabase/supabase-js';
import useSessionStore from '@/stores/session';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const createUserSession = async (alias: string, language: 'es-CL' | 'en-US' = 'es-CL') => {
  console.log('[APP] Creating user session:', { alias, language });
  
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([
        { 
          alias,
          preferred_language: language,
          last_active: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('[APP] Session creation failed:', error);
    throw error;
  }
};

export const checkSessionValidity = async (sessionId: string) => {
  console.log('[APP] Checking session validity:', { sessionId });

  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    const isValid = new Date(data.expires_at) > new Date();
    if (!isValid) {
      useSessionStore.getState().reset();
    }

    return isValid;

  } catch (error) {
    console.error('[APP] Session validation failed:', error);
    return false;
  }
};