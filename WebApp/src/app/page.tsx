import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: releases, error } = await supabase
    .from('releases')
    .select('*');

  if (error) {
    console.error('[APP] Failed to load releases:', error);
  }

  console.log('[APP] Loaded releases:', releases?.length || 0);

  return (
    <main className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {releases?.map((release) => (
          <div 
            key={release.id} 
            className="p-4 border rounded-lg shadow bg-card"
          >
            <h3 className="font-bold">{release.title}</h3>
            <p className="text-sm text-muted-foreground">
              {release.artists?.join(', ')}
            </p>
            <div className="mt-2">
              <span className="text-sm bg-primary/10 rounded-full px-2 py-1">
                €{release.price}
              </span>
              <span className="ml-2 text-sm bg-secondary/50 rounded-full px-2 py-1">
                {release.condition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}