'use client';

import { Button } from "@/components/ui/button"
import { useSessionStore } from "@/stores/session"
import { useCallback } from "react";

export default function Home() {
  const { language } = useSessionStore();

  const handleClick = useCallback(() => {
    console.log('Current Language:', language);
  }, [language]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Remate Discos</h1>
        <p className="text-lg text-muted-foreground">
          {language === 'es-CL' 
            ? 'Marketplace y sistema de reservas para vinilos'
            : 'Vinyl marketplace and reservation system'
          }
        </p>
      </header>

      <div className="flex flex-col gap-4 items-center">
        <Button variant="default" onClick={handleClick}>
          {language === 'es-CL' ? 'Navegar catálogo' : 'Browse catalog'}
        </Button>
      </div>
    </main>
  )
}