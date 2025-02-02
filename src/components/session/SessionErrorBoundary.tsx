'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSessionStore } from '@/stores/session';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SessionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Session error:', error, errorInfo);
    
    // Clear session on critical errors
    const sessionStore = useSessionStore.getState();
    if (sessionStore.sessionId) {
      sessionStore.clearSession();
    }
  }

  public render() {
    if (this.state.hasError) {
      const { language } = useSessionStore.getState();
      
      return (
        <Alert variant="destructive">
          <AlertTitle>
            {language === 'es-CL' 
              ? 'Error de sesión' 
              : 'Session Error'
            }
          </AlertTitle>
          <AlertDescription>
            {language === 'es-CL'
              ? 'Hubo un problema con tu sesión. Por favor recarga la página.'
              : 'There was a problem with your session. Please refresh the page.'
            }
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}