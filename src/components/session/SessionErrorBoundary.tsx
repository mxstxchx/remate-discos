'use client';

import { useEffect } from 'react';
import { SessionError } from '@/lib/session/types';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export function SessionErrorBoundary({ children }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      
      if (!(error instanceof SessionError)) return;

      console.log('[APP] Session Error:', { 
        code: error.code, 
        message: error.message
      });

      const errorMessages = {
        QUERY_ERROR: 'Error retrieving session data',
        INSERT_ERROR: 'Unable to create session',
        ADMIN_AUTH_ERROR: 'Admin access denied',
        UNKNOWN_ERROR: 'Unexpected session error'
      };

      toast({
        variant: 'destructive',
        title: 'Session Error',
        description: errorMessages[error.code] || error.message
      });

      if (error.code === 'ADMIN_AUTH_ERROR') {
        router.push('/');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast, router]);

  return <>{children}</>;
}