import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { createUserSession } from '@/lib/supabase/session';
import { Language } from '@/types/session';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SessionModal() {
  const [open, setOpen] = useState(false);
  const [alias, setAlias] = useState('');
  const [language, setLanguage] = useState<Language>('es-CL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAlias: setStoreAlias, setLanguage: setStoreLanguage, setSessionId } = useSessionStore();

  useEffect(() => {
    // Check if we need to show the modal
    const hasExistingSession = localStorage.getItem('alias');
    if (!hasExistingSession) {
      setOpen(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) return;

    setIsSubmitting(true);
    try {
      const session = await createUserSession(alias, language);
      setStoreAlias(alias);
      setStoreLanguage(language);
      setSessionId(session.id, new Date(session.expires_at));
      setOpen(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalText = (language: Language) => {
    return {
      'es-CL': {
        title: 'Bienvenido a Remate Discos',
        description: 'Por favor, ingresa un alias para continuar. Este alias se utilizará para gestionar tus reservas.',
        aliasLabel: 'Tu alias',
        aliasPlaceholder: 'Ingresa un alias',
        languageLabel: 'Idioma preferido',
        continue: 'Continuar',
      },
      'en-US': {
        title: 'Welcome to Remate Discos',
        description: 'Please enter an alias to continue. This alias will be used to manage your reservations.',
        aliasLabel: 'Your alias',
        aliasPlaceholder: 'Enter an alias',
        languageLabel: 'Preferred language',
        continue: 'Continue',
      },
    }[language];
  };

  const text = getModalText(language);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alias">{text.aliasLabel}</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder={text.aliasPlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">{text.languageLabel}</Label>
            <Select
              value={language}
              onValueChange={(value: Language) => setLanguage(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es-CL">Español (Chile)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {text.continue}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
