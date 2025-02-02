'use client';

import { useCallback, useState } from 'react';
import { Inter } from 'next/font/google';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { SessionLanguage } from '@/types/session';
import { useSessionStore } from '@/stores/session';
import { handleSessionError } from '@/lib/session/errors';

const inter = Inter({ subsets: ['latin'] });

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const [alias, setAlias] = useState('');
  const [language, setLanguage] = useState<SessionLanguage>('es-CL');
  const [isLoading, setIsLoading] = useState(false);

  const { initializeSession } = useSessionStore();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) return;

    setIsLoading(true);
    try {
      const { data: session } = await supabase
        .from('user_sessions')
        .insert({
          alias: alias.trim(),
          preferred_language: language,
          last_active: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (!session) throw new Error('Failed to create session');
      initializeSession(session);
      onClose();

    } catch (error) {
      handleSessionError(error);
    } finally {
      setIsLoading(false);
    }
  }, [alias, language, initializeSession, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={inter.className}>
        <DialogHeader>
          <DialogTitle>
            {language === 'es-CL' ? 'Bienvenido a Remate Discos' : 'Welcome to Remate Discos'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alias">
                {language === 'es-CL' ? 'Alias para identificarte' : 'Alias to identify you'}
              </Label>
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                maxLength={30}
                placeholder={language === 'es-CL' ? 'Tu alias' : 'Your alias'}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language">
                {language === 'es-CL' ? 'Idioma preferido' : 'Preferred language'}
              </Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as SessionLanguage)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es-CL">Español (Chile)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || !alias.trim()}>
              {language === 'es-CL' ? 'Comenzar' : 'Start'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
