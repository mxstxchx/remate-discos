import { useSessionStore } from '@/stores/sessionStore';

export function initializeSession() {
  const sessionStore = useSessionStore.getState();
  return sessionStore.initialize();
}

export function checkSession() {
  const { alias, sessionId } = useSessionStore.getState();
  return Boolean(alias && sessionId);
}

export function getSessionLanguage() {
  return useSessionStore.getState().language;
}

export function clearSession() {
  useSessionStore.getState().clear();
}
