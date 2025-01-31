'use client';

import { createUserSession } from '@/lib/session/create-session';
import { Button } from '@/components/ui/button';

export default function TestPage() {
  const testAdmin = async () => {
    try {
      const result = await createUserSession('_soyelputoamo_', true);
      console.log('[TEST] Admin session:', result);
    } catch (error) {
      console.error('[TEST] Admin error:', error);
    }
  };

  const testInvalidAdmin = async () => {
    try {
      await createUserSession('invalid_admin', true);
    } catch (error) {
      console.error('[TEST] Invalid admin error:', error);
    }
  };

  const testUser = async () => {
    try {
      const result = await createUserSession('test_user', false);
      console.log('[TEST] User session:', result);
    } catch (error) {
      console.error('[TEST] User error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={testAdmin}>Test Admin Session</Button>
      <Button onClick={testInvalidAdmin}>Test Invalid Admin</Button>
      <Button onClick={testUser}>Test Regular User</Button>
    </div>
  );
}