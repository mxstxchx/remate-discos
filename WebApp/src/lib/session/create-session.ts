import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionError, SessionErrorCode } from './types';

const LOG_PREFIX = '[APP] Session:';

export async function createUserSession(alias: string, isAdmin = false) {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Get most recent session if exists
    const { data: existingSession, error: queryError } = await supabase
      .from('user_sessions')
      .select('id, alias, is_admin')
      .eq('alias', alias)
      .eq('is_admin', isAdmin)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (queryError) {
      console.log(`${LOG_PREFIX} Query error:`, queryError);
      throw new SessionError(
        'Failed to check existing sessions',
        'QUERY_ERROR',
        { error: queryError }
      );
    }

    if (existingSession?.id) {
      console.log(`${LOG_PREFIX} Using existing session:`, existingSession.id);
      return existingSession.id;
    }

    const { data: newSession, error: insertError } = await supabase
      .from('user_sessions')
      .insert({
        alias,
        is_admin: isAdmin,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.log(`${LOG_PREFIX} Creation error:`, insertError);
      
      const errorCode: SessionErrorCode = insertError.message.includes('permission denied')
        ? 'ADMIN_AUTH_ERROR'
        : 'INSERT_ERROR';
        
      throw new SessionError(
        errorCode === 'ADMIN_AUTH_ERROR' 
          ? 'Unauthorized admin session creation'
          : 'Failed to create session',
        errorCode,
        { error: insertError }
      );
    }

    console.log(`${LOG_PREFIX} Created new session:`, newSession.id);
    return newSession.id;
    
  } catch (error) {
    if (error instanceof SessionError) {
      throw error;
    }
    
    console.log(`${LOG_PREFIX} Unexpected error:`, error);
    throw new SessionError(
      'Unexpected error creating session',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }
}