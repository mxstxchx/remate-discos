import { useSessionStore } from '@/stores/session';
import { SessionErrorResponse } from '@/types/session';
import { toast } from '@/components/ui/use-toast';

export function handleSessionError(error: unknown) {
  const { language } = useSessionStore.getState();
  
  let message = language === 'es-CL' 
    ? 'Error de sesión - por favor intenta nuevamente'
    : 'Session error - please try again';

  if (error instanceof Error) {
    message = error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const sessionError = error as SessionErrorResponse;
    if (sessionError.message) {
      message = sessionError.message;
    }
  }

  toast({
    title: language === 'es-CL' ? 'Error' : 'Error',
    description: message,
    variant: 'destructive',
  });
}

export function isSessionExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}

export function hasValidSession(): boolean {
  const { sessionId, expiresAt } = useSessionStore.getState();
  return Boolean(sessionId && !isSessionExpired(expiresAt));
}