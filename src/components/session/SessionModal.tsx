import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserSession } from '@/lib/supabase/session';
import useSessionStore from '@/stores/session';

const SessionModal = () => {
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const { setAlias: storeAlias, setSessionId, setExpiresAt } = useSessionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[APP] Session creation attempt:', { alias });

    try {
      const session = await createUserSession(alias);
      storeAlias(alias);
      setSessionId(session.id);
      setExpiresAt(new Date(session.expires_at));
      
    } catch (error) {
      console.error('[APP] Session creation error:', error);
      setError('Failed to create session');
    }
  };

  return (
    <Dialog open={true}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome to Remate Discos</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alias">Choose an alias</Label>
                <Input
                  id="alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Your alias"
                  className="w-full"
                />
              </div>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default SessionModal;